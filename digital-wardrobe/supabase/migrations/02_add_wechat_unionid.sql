-- Add wechat_unionid to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS wechat_unionid text UNIQUE;

-- Update column comments
COMMENT ON COLUMN public.profiles.wechat_unionid IS 'WeChat UnionID for cross-platform user identification';
COMMENT ON COLUMN public.profiles.wechat_openid IS 'WeChat OpenID for the specific official account';
