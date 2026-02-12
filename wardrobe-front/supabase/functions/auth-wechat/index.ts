import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const WECHAT_APP_ID = Deno.env.get("WECHAT_APP_ID")
const WECHAT_APP_SECRET = Deno.env.get("WECHAT_APP_SECRET")
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { code } = await req.json()

        if (!code) {
            throw new Error("Missing code")
        }

        // 1. Exchange code for access_token and openid/unionid
        const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WECHAT_APP_ID}&secret=${WECHAT_APP_SECRET}&code=${code}&grant_type=authorization_code`
        const tokenRes = await fetch(tokenUrl)
        const tokenData = await tokenRes.json()

        if (tokenData.errcode) {
            throw new Error(`WeChat error: ${tokenData.errmsg}`)
        }

        const { openid, unionid, access_token } = tokenData

        // 2. Fetch user info (if needed for new users)
        const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
        const userInfoRes = await fetch(userInfoUrl)
        const userInfo = await userInfoRes.json()

        // 3. Connect to Supabase with Service Role
        const supabaseAdmin = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

        // 4. Try to find user by unionid (best) or openid
        let { data: profile, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .or(`wechat_unionid.eq.${unionid},wechat_openid.eq.${openid}`)
            .single()

        let userId;

        if (profile) {
            userId = profile.id
        } else {
            // 5. Create new user
            // Generate a random email/password or use a special pattern
            const email = `wechat_${unionid || openid}@wardrobe.internal`
            const password = crypto.randomUUID()

            const { data: newUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: {
                    full_name: userInfo.nickname,
                    avatar_url: userInfo.headimgurl,
                    wechat_openid: openid,
                    wechat_unionid: unionid,
                }
            })

            if (signUpError) throw signUpError
            userId = newUser.user.id
        }

        // 6. Generate a session for the user
        const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.createSession({
            userId
        })

        if (sessionError) throw sessionError

        return new Response(JSON.stringify(sessionData), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
})
