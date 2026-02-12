import { ChevronLeft, Pencil, QrCode, User, ChevronRight, Moon, Globe, Lock, Link as LinkIcon, Bell, Shirt } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

import type React from 'react';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleBack = () => {
    void navigate(-1);
  };

  const handleEditProfile = () => {
    void navigate('/profile/edit');
  };

  const handleEditBodyStats = () => {
    void navigate('/profile/body-stats');
  };

  const handleLogin = () => {
    void navigate('/login');
  };

  const handleUpdatePassword = () => {
    void navigate('/profile/password');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error("Sign out failed", e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark pb-24">
      {/* Header */}
      <div className="flex items-center bg-white dark:bg-surface-dark p-4 pb-2 justify-between sticky top-0 z-10 border-b border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={handleBack}
          className="text-text-main dark:text-white flex size-12 shrink-0 items-center justify-start"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight flex-1 text-center">设置</h2>
        <div className="flex w-12 items-center justify-end"></div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-4 mt-2">
        {/* Profile Card */}
        {user ? (
          <div className="p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-primary" />
                )}
              </div>
              <button
                type="button"
                onClick={handleEditProfile}
                className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-white dark:border-surface-dark flex items-center justify-center cursor-pointer"
              >
                <Pencil className="w-3 h-3 text-text-main" />
              </button>
            </div>
            <div className="flex flex-col flex-1">
              <h3 className="text-lg font-bold text-text-main dark:text-white">{profile?.full_name || 'User'}</h3>
              <p className="text-sm text-text-secondary">@{profile?.username || user.email?.split('@')[0]}</p>
            </div>
            <QrCode className="text-text-secondary w-6 h-6" />
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={handleLogin}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleLogin();
              }
            }}
            className="p-6 bg-primary/10 rounded-xl shadow-sm border border-primary/20 flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-primary/20 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/40">
              <User size={24} className="text-black" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-text-main dark:text-white">Sign In / Sign Up</h3>
              <p className="text-xs text-text-secondary">Sync your wardrobe across devices</p>
            </div>
          </div>
        )}

        {/* Section: Personal Info */}
        <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="px-4 py-3 bg-gray-50 dark:bg-background-dark border-b border-gray-100 dark:border-gray-800">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">个人信息</h4>
          </div>
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            <button
              type="button"
              onClick={handleEditProfile}
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-background-dark transition-colors active:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <User className="text-text-secondary w-5 h-5" />
                <span className="text-text-main dark:text-white font-medium">基本资料</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-text-secondary">头像, 昵称</span>
                <ChevronRight className="text-text-secondary w-5 h-5" />
              </div>
            </button>
            <button
              type="button"
              onClick={handleEditBodyStats}
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-background-dark transition-colors active:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <Shirt className="text-text-secondary w-5 h-5" />
                <span className="text-text-main dark:text-white font-medium">身材数据</span>
              </div>
              <ChevronRight className="text-text-secondary w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section: Notifications */}
        <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="px-4 py-3 bg-gray-50 dark:bg-background-dark border-b border-gray-100 dark:border-gray-800">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">通知提醒</h4>
          </div>
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <Shirt className="text-text-secondary w-5 h-5" />
                <div className="flex flex-col">
                  <span className="text-text-main dark:text-white font-medium">每日穿搭推荐</span>
                  <span className="text-xs text-text-secondary">每天早上 7:30</span>
                </div>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary cursor-pointer">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <Bell className="text-text-secondary w-5 h-5" />
                <div className="flex flex-col">
                  <span className="text-text-main dark:text-white font-medium">护理提醒</span>
                  <span className="text-xs text-text-secondary">基于穿着频率</span>
                </div>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Account & Security */}
        <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="px-4 py-3 bg-gray-50 dark:bg-background-dark border-b border-gray-100 dark:border-gray-800">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">账号与安全</h4>
          </div>
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            <button
              type="button"
              onClick={handleUpdatePassword}
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-background-dark transition-colors active:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <Lock className="text-text-secondary w-5 h-5" />
                <span className="text-text-main dark:text-white font-medium">修改密码</span>
              </div>
              <ChevronRight className="text-text-secondary w-5 h-5" />
            </button>
            <button
              type="button"
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-background-dark transition-colors active:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <LinkIcon className="text-text-secondary w-5 h-5" />
                <span className="text-text-main dark:text-white font-medium">关联账号</span>
              </div>
              <span className="text-sm text-text-secondary">微信已绑定</span>
            </button>
          </div>
        </div>

        {/* Section: General */}
        <div className="flex flex-col bg-white dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="px-4 py-3 bg-gray-50 dark:bg-background-dark border-b border-gray-100 dark:border-gray-800">
            <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">通用</h4>
          </div>
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
            <button
              type="button"
              className="flex items-center justify-between px-4 py-4 hover:bg-gray-50 dark:hover:bg-background-dark transition-colors active:bg-gray-100"
            >
              <div className="flex items-center gap-3">
                <Globe className="text-text-secondary w-5 h-5" />
                <span className="text-text-main dark:text-white font-medium">多语言</span>
              </div>
              <span className="text-sm text-text-secondary">简体中文</span>
            </button>
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <Moon className="text-text-secondary w-5 h-5" />
                <span className="text-text-main dark:text-white font-medium">深色模式</span>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
              </div>
            </div>
          </div>
        </div>

        {user && (
          <button
            type="button"
            onClick={() => { void handleSignOut(); }}
            className="mt-4 w-full py-4 rounded-xl bg-white dark:bg-surface-dark border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-semibold shadow-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors active:scale-[0.99]"
          >
            退出登录
          </button>
        )}

        <div className="text-center pt-2">
          <p className="text-xs text-text-secondary/60">Version 1.2.0 (Build 432)</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;