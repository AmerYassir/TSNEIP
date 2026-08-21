import React from 'react';
import { Language, AppView } from '../types';
import { translations } from '../data/translations';
import { AltatweerLogo } from './AltatweerLogo';
import { HamburgerMenu } from './HamburgerMenu';
import { useAuth } from '../context/AuthContext';
import { 
  Globe, 
  PlusCircle, 
  BarChart3, 
  Map,
  FileText,
  Newspaper,
  SlidersHorizontal,
  Info
} from 'lucide-react';

interface HeaderProps {
  lang: Language;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onLanguageToggle: () => void;
  onOpenSubmitModal: () => void;
  onOpenAnalyticsModal: () => void;
  onOpenAboutUsModal: () => void;
  activeLayersCount: number;
  totalPointsCount: number;
  verifiedCount: number;
  isOptionsDrawerOpen?: boolean;
  onToggleOptionsDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  currentView,
  onViewChange,
  onLanguageToggle,
  onOpenSubmitModal,
  onOpenAnalyticsModal,
  onOpenAboutUsModal,
  activeLayersCount,
  totalPointsCount,
  verifiedCount,
  isOptionsDrawerOpen,
  onToggleOptionsDrawer,
}) => {
  const t = translations[lang];
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-[#006BB2] text-white border-b-2 border-[#005794] shadow-md relative z-30 select-none">
      
      {/* Top Main Header Row */}
      <div className="max-w-[1920px] mx-auto px-4 py-2 flex items-center justify-between gap-3">
        
        {/* Left Side: Hamburger Menu + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Trigger */}
          <HamburgerMenu
            lang={lang}
            currentView={currentView}
            onViewChange={onViewChange}
            onOpenAnalytics={onOpenAnalyticsModal}
            onOpenAboutUs={onOpenAboutUsModal}
            onOpenSubmitModal={onOpenSubmitModal}
            onLanguageToggle={onLanguageToggle}
            isOptionsDrawerOpen={isOptionsDrawerOpen}
            onToggleOptionsDrawer={onToggleOptionsDrawer}
          />

          {/* Al Tatweer Foundation Logo & Branding */}
          <div 
            onClick={() => onViewChange('map')}
            className="cursor-pointer"
          >
            <AltatweerLogo lang={lang} size="md" textColor="text-white" />
          </div>
        </div>

        {/* Center: Desktop Navigation Quick Pills */}
        <div className="hidden lg:flex items-center gap-1.5 bg-[#004d80] p-1 rounded-xl border border-blue-400/30 text-xs shadow-inner">
          <button
            onClick={() => onViewChange('map')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'map'
                ? 'bg-[#009600] text-white shadow-md ring-1 ring-emerald-300'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Map className="w-4 h-4 text-emerald-300" />
            <span>{lang === 'ar' ? 'الخريطة التفاعلية' : 'Interactive Map'}</span>
          </button>

          <button
            onClick={onOpenAnalyticsModal}
            className="px-3 py-1.5 rounded-lg font-bold text-blue-100 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-emerald-300" />
            <span>{lang === 'ar' ? 'التحليلات والتقارير' : 'Analytics & Reports'}</span>
          </button>

          <button
            onClick={() => onViewChange('forms')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'forms'
                ? 'bg-[#009600] text-white shadow-md ring-1 ring-emerald-300'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-300" />
            <span>{lang === 'ar' ? 'الاستمارات' : 'Forms'}</span>
          </button>

          <button
            onClick={() => onViewChange('blog')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'blog'
                ? 'bg-[#009600] text-white shadow-md ring-1 ring-emerald-300'
                : 'text-blue-100 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Newspaper className="w-4 h-4 text-emerald-300" />
            <span>{lang === 'ar' ? 'المدونة والأخبار' : 'Blog / News'}</span>
          </button>

          <button
            onClick={onOpenAboutUsModal}
            className="px-3 py-1.5 rounded-lg font-bold text-blue-100 hover:bg-white/10 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Info className="w-4 h-4 text-amber-300" />
            <span>{lang === 'ar' ? 'عَن المؤسسة' : 'About Us'}</span>
          </button>
        </div>

        {/* Right Side: Primary Actions */}
        <div className="flex items-center gap-2">
          
          {/* Layer Options Drawer Toggle (Visible in Map View) */}
          {currentView === 'map' && onToggleOptionsDrawer && (
            <button
              onClick={onToggleOptionsDrawer}
              className={`px-3 py-1.5 text-xs rounded-xl border font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                isOptionsDrawerOpen 
                  ? 'bg-amber-500 text-white border-amber-400' 
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/25'
              }`}
              title={lang === 'ar' ? 'إظهار/إخفاء خيارات الخريطة' : 'Toggle Map Options'}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isOptionsDrawerOpen 
                  ? (lang === 'ar' ? 'إخفاء الخيارات' : 'Hide Options') 
                  : (lang === 'ar' ? 'خيارات الخريطة' : 'Map Options')}
              </span>
            </button>
          )}

          {/* Submit Data CTA */}
          <button
            onClick={onOpenSubmitModal}
            className="px-3.5 py-1.5 text-xs md:text-sm bg-[#009600] hover:bg-[#008000] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md transition-all border border-emerald-400/30 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">{t.submitGeoData}</span>
            <span className="sm:hidden">{lang === 'ar' ? 'إضافة' : 'Add'}</span>
          </button>

          {/* Language Switcher Button */}
          <button
            onClick={onLanguageToggle}
            className="px-3 py-1.5 text-xs bg-white/15 hover:bg-white/25 rounded-xl border border-white/25 transition-all font-bold flex items-center gap-1.5 cursor-pointer"
            title={lang === 'ar' ? 'تغيير اللغة' : 'Switch Language'}
          >
            <Globe className="w-4 h-4 text-blue-200" />
            <span>{t.languageSwitch}</span>
          </button>

        </div>

      </div>

    </header>
  );
};