import { supabase } from '@/lib/supabase';

interface WechatAuthResponse {
    error?: string;
    access_token?: string;
    refresh_token?: string;
}

export class AuthService {
    /**
     * Check if user is inside WeChat browser
     */
    isWechatBrowser(): boolean {
        const ua = navigator.userAgent.toLowerCase();
        return ua.indexOf('micromessenger') !== -1;
    }

    /**
     * Generate WeChat OAuth URL
     * @param isSilent Whether to use snsapi_base (silent) or snsapi_userinfo
     */
    getWechatAuthUrl(isSilent = false): string {
        const appId = (import.meta.env['VITE_WECHAT_APP_ID'] as string) || '';
        const redirectUriValue = (import.meta.env['VITE_WECHAT_REDIRECT_URI'] as string) || '';
        const redirectUri = encodeURIComponent(redirectUriValue || window.location.origin + '/#/login');
        const scope = isSilent ? 'snsapi_base' : 'snsapi_userinfo';

        return `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=wechat_login#wechat_redirect`;
    }

    /**
     * Exchange WeChat code for Supabase Session via Edge Function
     */
    async signInWithWechat(code: string) {
        const { data, error } = await supabase.functions.invoke<WechatAuthResponse>('auth-wechat', {
            body: { code },
        }) as unknown as { data: WechatAuthResponse | null; error: unknown };

        if (error) { throw error; }
        if (!data) { throw new Error('No data returned from auth-wechat function'); }
        if (data.error) { throw new Error(data.error); }

        // Set the session in Supabase client
        if (data.access_token && data.refresh_token) {
            const { error: sessionError } = await supabase.auth.setSession({
                access_token: data.access_token,
                refresh_token: data.refresh_token
            });

            if (sessionError) { throw sessionError; }
        } else {
            throw new Error('Missing tokens in auth-wechat response');
        }

        return data;
    }
}

export const authService = new AuthService();
