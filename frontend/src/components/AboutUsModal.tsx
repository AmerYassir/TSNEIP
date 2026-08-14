import React from 'react';
import { Language } from '../types';
import { AltatweerLogo } from './AltatweerLogo';
import { 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  TreePine, 
  Droplets, 
  BarChart3, 
  CheckCircle2, 
  Mail, 
  MapPin, 
  HeartHandshake,
  X
} from 'lucide-react';

interface AboutUsModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({
  lang,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in font-sans">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-300 flex flex-col justify-between">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#006BB2] to-[#005794] text-white p-6 rounded-t-2xl flex items-start justify-between relative overflow-hidden">
          <div className="space-y-2 relative z-10 max-w-xl">
            <AltatweerLogo lang={lang} size="lg" showText={true} textColor="text-white" />
            <p className="text-xs md:text-sm text-blue-100 font-medium leading-relaxed mt-2">
              {lang === 'ar'
                ? 'مؤسسة إنسانية تنموية مستقلة تعنى بالتنمية المستدامة، حماية البيئة السورية، وإدارة النظم الجغرافية والموارد الطبيعية.'
                : 'An independent humanitarian developmental foundation committed to sustainable development, Syrian environmental protection, and GIS ecosystem management.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6">
          
          {/* Mission & Foundation Intro */}
          <div className="bg-emerald-50/70 p-5 rounded-xl border border-emerald-200/80 space-y-3">
            <div className="flex items-center gap-2 text-[#009600] font-extrabold text-sm md:text-base">
              <ShieldCheck className="w-5 h-5" />
              <span>{lang === 'ar' ? 'رؤية المنصة والهدف الاستراتيجي' : 'Platform Vision & Strategic Mandate'}</span>
            </div>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-sans">
              {lang === 'ar'
                ? 'تسعى مؤسسة التطوير من خلال منصة (TSNEIP) إلى توفير قاعدة بيانات جغرافية موحدة ودقيقة ترصد حالة البيئة السورية، الغطاء النباتي، الموارد المائية، والتنوع الحيوي، مع تمكين الباحثين والفرق الميدانية من تقديم تقارير دورية تخدم أهداف التنمية المستدامة (SDGs).'
                : 'Al Tatweer Foundation through the TSNEIP GIS platform aims to provide a unified, precise spatial database monitoring Syrian environmental states, land cover, water reserves, and biodiversity while empowering field research teams to document SDG-compliant reports.'}
            </p>
          </div>

          {/* Strategic Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-[#006BB2] font-bold text-xs md:text-sm">
                <TreePine className="w-4 h-4" />
                <span>{lang === 'ar' ? 'رصد التنوع الحيوي والغابات' : 'Biodiversity & Forest Cover'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'ar'
                  ? 'متابعة المناطق المحمية وحساب مؤشرات الاخضرار (NDVI) لتقييم صحة النظام البيئي الخضري.'
                  : 'Tracking protected reserves & vegetation index (NDVI) to evaluate flora ecosystem vitality.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs md:text-sm">
                <Droplets className="w-4 h-4" />
                <span>{lang === 'ar' ? 'حماية الموارد المائية والسطحية' : 'Water Quality & Hydro Spatial'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'ar'
                  ? 'قياس الملوحة والتحليل الكيميائي لشبكات الأنهار والبحيرات والمياه الجوفية السورية.'
                  : 'Monitoring salinity, pH, & chemical analysis for Syrian rivers, basins, & groundwater reserves.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs md:text-sm">
                <BarChart3 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'التحليلات والاستشعار عن بعد' : 'GIS Remote Sensing & Analytics'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'ar'
                  ? 'دماج الصور الفضائية عالية الدقة مع التقارير الميدانية لتقديم تحليلات التدهور والمخاطر البيئية.'
                  : 'Combining satellite imagery with verified field data to deliver environmental degradation reports.'}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-xs md:text-sm">
                <HeartHandshake className="w-4 h-4" />
                <span>{lang === 'ar' ? 'الشراكة مع المنظمات الدولية' : 'Global UN Agency Synergy'}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {lang === 'ar'
                  ? 'العمل بالتكامل مع برامج الأمم المتحدة (UNEP, UNDP, FAO) لدعم الاستجابة البيئية الوطنية.'
                  : 'Coordinating with UN agencies (UNEP, UNDP, FAO) to support national ecosystem resilience.'}
              </p>
            </div>

          </div>

          {/* Official Website CTA Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#009600] flex items-center justify-center text-white shrink-0">
                <Globe className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="font-extrabold text-sm text-white">
                  {lang === 'ar' ? 'الموقع الرسمي لمؤسسة التطوير' : 'Official Al Tatweer Foundation Website'}
                </div>
                <div className="text-xs text-slate-300 font-mono mt-0.5">
                  https://altatweref.org/
                </div>
              </div>
            </div>

            <a
              href="https://altatweref.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#009600] hover:bg-[#008000] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
            >
              <span>{lang === 'ar' ? 'زيارة الموقع الرسمي' : 'Visit Official Portal'}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-100 rounded-b-2xl border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2 font-medium">
            <MapPin className="w-4 h-4 text-[#006BB2]" />
            <span>{lang === 'ar' ? 'الجمهورية العربية السورية' : 'Syrian Arab Republic'}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#006BB2] hover:bg-[#005794] text-white font-bold rounded-lg cursor-pointer transition-colors"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
