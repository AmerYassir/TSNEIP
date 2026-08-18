import React, { useState } from 'react';
import { Language, AppView } from '../types';
import { AltatweerLogo } from './AltatweerLogo';
import { 
  Menu, 
  X, 
  Home, 
  Map, 
  BarChart3, 
  FileText, 
  Newspaper, 
  Info, 
  ExternalLink,
  PlusCircle,
  Globe,
  ChevronRight,
  ShieldCheck,
  TreePine,
  Layers
} from 'lucide-react';

interface HamburgerMenuProps {
  lang: Language;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onOpenAnalytics: () => void;
  onOpenAboutUs: () => void;
  onOpenSubmitModal: () => void;
  onLanguageToggle: () => void;
  isOptionsDrawerOpen?: boolean;
  onToggleOptionsDrawer?: () => void;
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  lang,
  currentView,
  onViewChange,
  onOpenAnalytics,
  onOpenAboutUs,
  onOpenSubmitModal,
  onLanguageToggle,
  isOptionsDrawerOpen,
  onToggleOptionsDrawer,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleNav = (action: () => void) => {
    action();
    closeMenu();
  };

  const navItems = [
    {
      id: 'home',
      labelAr: 'الرئيسية',
      labelEn: 'Home',
      icon: Home,
      action: () => onViewChange('map'),
      active: currentView === 'map',
      badgeAr: 'الخريطة الرئيسية',
      badgeEn: 'Main Landing',
    },
    {
      id: 'map',
      labelAr: 'الخريطة التفاعلية والمؤشرات',
      labelEn: 'Interactive GIS Map',
      icon: Map,
      action: () => onViewChange('map'),
      active: currentView === 'map',
    },
    {
      id: 'analytics',
      labelAr: 'التحليلات والتقارير البيئية',
      labelEn: 'Analytics & Reports',
      icon: BarChart3,
      action: () => onOpenAnalytics(),
      active: false,
    },
    {
      id: 'forms',
      labelAr: 'استمارات رصد البيانات البيئية',
      labelEn: 'Eco Data Forms',
      icon: FileText,
      action: () => onViewChange('forms'),
      active: currentView === 'forms',
    },
    {
      id: 'blog',
      labelAr: 'المدونة والأخبار والمشاركات',
      labelEn: 'Blog / News / Posts',
      icon: Newspaper,
      action: () => onViewChange('blog'),
      active: currentView === 'blog',
    },
    {
      id: 'about',
      labelAr: 'عن المؤسسة والمعلومات',
      labelEn: 'About Us & Foundation Info',
      icon: Info,
      action: () => onOpenAboutUs(),
      active: currentView === 'about',
      highlight: true,
      subtitleAr: 'مؤسسة التطوير - altatweref.org',
      subtitleEn: 'Al Tatweer Foundation',
    },
  ];

  return (
    <>
      {/* Hamburger Trigger Button */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
        className="px-3 py-2 bg-[#004d80] hover:bg-[#003d66] text-white rounded-xl border border-blue-400/40 flex items-center gap-2 font-bold text-xs md:text-sm shadow-md transition-all active:scale-95 cursor-pointer group"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-emerald-300 transition-transform duration-200 group-hover:rotate-90" />
        ) : (
          <Menu className="w-5 h-5 text-emerald-300 transition-transform duration-200 group-hover:scale-110" />
        )}
        <span className="font-extrabold tracking-wide">
          {lang === 'ar' ? 'القائمة' : 'Menu'}
        </span>
      </button>

      {/* Drawer Overlay Backdrop */}
      {isOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in"
        />
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside
        className={`fixed top-0 bottom-0 ${
          lang === 'ar' ? 'right-0' : 'left-0'
        } z-50 w-80 md:w-96 bg-slate-900 text-white shadow-2xl border-l border-slate-700 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${
          isOpen
            ? 'translate-x-0'
            : lang === 'ar'
            ? 'translate-x-full'
            : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="p-5 bg-gradient-to-r from-[#006BB2] to-[#004d80] border-b border-blue-600/50 flex items-center justify-between">
          <AltatweerLogo lang={lang} size="md" textColor="text-white" />
          <button
            onClick={closeMenu}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Navigation Links */}
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          
          <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-400/90 flex items-center justify-between">
            <span>{lang === 'ar' ? 'اقسام المنصة والتصفح' : 'Platform Navigation'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.action)}
                  className={`w-full p-3 rounded-xl font-bold text-xs md:text-sm text-right rtl:text-right ltr:text-left flex items-center justify-between transition-all cursor-pointer group border ${
                    item.active
                      ? 'bg-[#009600] text-white border-emerald-400 shadow-lg shadow-emerald-950/40'
                      : item.highlight
                      ? 'bg-blue-900/40 hover:bg-blue-800/60 text-blue-100 border-blue-500/40'
                      : 'bg-slate-800/60 hover:bg-slate-800 text-slate-200 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        item.active
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-700 text-emerald-400 group-hover:bg-[#006BB2] group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold">
                        {lang === 'ar' ? item.labelAr : item.labelEn}
                      </div>
                      {item.subtitleAr && (
                        <div className="text-[10px] text-blue-300 font-normal">
                          {lang === 'ar' ? item.subtitleAr : item.subtitleEn}
                        </div>
                      )}
                    </div>
                  </div>

                  {item.badgeAr ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-700 text-emerald-100 font-semibold">
                      {lang === 'ar' ? item.badgeAr : item.badgeEn}
                    </span>
                  ) : (
                    <ChevronRight
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Direct Quick Action Buttons inside Drawer */}
          <div className="pt-4 space-y-2 border-t border-slate-800">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 px-3">
              {lang === 'ar' ? 'أدوات سريعة' : 'Quick Actions'}
            </div>

            {onToggleOptionsDrawer && (
              <button
                onClick={() => handleNav(onToggleOptionsDrawer)}
                className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                  isOptionsDrawerOpen
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-800/40 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>
                  {isOptionsDrawerOpen
                    ? (lang === 'ar' ? 'إخفاء خيارات طبقات الخريطة' : 'Hide Map Layer Options')
                    : (lang === 'ar' ? 'إظهار خيارات طبقات الخريطة' : 'Show Map Layer Options')}
                </span>
              </button>
            )}

            <button
              onClick={() => handleNav(onOpenSubmitModal)}
              className="w-full p-3 rounded-xl bg-[#009600] hover:bg-[#008000] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إضافة بيانات بيئية ميدانية' : 'Submit Field Eco Data'}</span>
            </button>

            <button
              onClick={() => {
                onLanguageToggle();
              }}
              className="w-full p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span>{lang === 'ar' ? 'تغيير اللغة (English)' : 'Switch to Arabic (العربية)'}</span>
            </button>
          </div>

          {/* Official Website Link Box */}
          <div className="p-4 rounded-xl bg-blue-950/60 border border-blue-800/60 text-xs space-y-2 mt-4">
            <div className="flex items-center gap-2 font-bold text-blue-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'الموقع الرسمي للمؤسسة' : 'Official Portal'}</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'للمزيد من المعلومات والتقارير الرسمية يرجى زيارة موقع مؤسسة التطوير:'
                : 'For more info, news, and official reports, visit Al Tatweer Foundation:'}
            </p>
            <a
              href="https://altatweref.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono font-bold text-xs underline underline-offset-2"
            >
              <span>https://altatweref.org/</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
          <span>{lang === 'ar' ? 'مؤسسة التطوير © 2026' : 'Al Tatweer Foundation © 2026'}</span>
          <span className="font-mono text-emerald-400">TSNEIP v3.5</span>
        </div>

      </aside>
    </>
  );
};
