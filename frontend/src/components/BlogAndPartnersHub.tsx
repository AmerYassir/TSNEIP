import React, { useState } from 'react';
import { 
  Language, 
  BlogPost, 
  PlatformPartner, 
  BlogCategory,
  GeoPointRecord
} from '../types';
import { translations } from '../data/translations';
import { INITIAL_BLOG_POSTS, PLATFORM_PARTNERS } from '../data/blogAndPartnersData';
import { AltatweerLogo } from './AltatweerLogo';
import { 
  Newspaper, 
  Users, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Download, 
  MapPin, 
  Sparkles, 
  Tag,
  ShieldCheck,
  Building2,
  Globe2,
  FileSpreadsheet
} from 'lucide-react';

interface BlogAndPartnersHubProps {
  lang: Language;
  onSelectMapPoint?: (pointId: string) => void;
}

export const BlogAndPartnersHub: React.FC<BlogAndPartnersHubProps> = ({
  lang,
  onSelectMapPoint,
}) => {
  const t = translations[lang];

  // Active Tab: 'blog' | 'partners'
  const [activeTab, setActiveTab] = useState<'blog' | 'partners'>('blog');
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Article Modal Reader
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  // Filter Blog Posts
  const filteredPosts = INITIAL_BLOG_POSTS.filter((post) => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitleAr = post.titleAr.toLowerCase().includes(q);
      const matchTitleEn = post.titleEn.toLowerCase().includes(q);
      const matchSummaryAr = post.summaryAr.toLowerCase().includes(q);
      if (!matchTitleAr && !matchTitleEn && !matchSummaryAr) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 bg-[#E3EAEF] text-[#1E293B] overflow-y-auto p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-[#006BB2] to-[#005794] text-white p-6 rounded-2xl shadow-lg border border-blue-400/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center gap-2">
              <AltatweerLogo lang={lang} size="sm" showText={false} />
              <span className="bg-[#009600] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {lang === 'ar' ? 'المركز الإعلامي والشركاء' : 'Media Hub & Partners Network'}
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-black font-heading text-white tracking-tight leading-tight">
              {lang === 'ar' 
                ? 'مدونة الأبحاث البيئية وشبكة الشركاء الوطنيين والدوليين' 
                : 'Syrian Environmental Research Blog & Global Partner Network'}
            </h2>
            <p className="text-xs md:text-sm text-blue-100/90 font-medium">
              {lang === 'ar'
                ? 'تابع أحدث الدراسات الميدانية، الأخبار الاستشعارية، وتقارير الشراكة مع منظمات الأمم المتحدة والجهات الوطنية لرصد النظم البيئية السورية.'
                : 'Stay updated with field survey reports, GIS satellite news, and collaborative initiatives with UN bodies & Syrian national authorities.'}
            </p>
          </div>

          {/* Tab Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-black/20 p-1.5 rounded-xl border border-white/20 shrink-0 self-stretch md:self-auto justify-center">
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'blog'
                  ? 'bg-white text-[#006BB2] shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>{lang === 'ar' ? 'المدونة والأخبار' : 'News & Articles'}</span>
            </button>

            <button
              onClick={() => setActiveTab('partners')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'partners'
                  ? 'bg-white text-[#006BB2] shadow-md'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الشركاء والرعاة' : 'Partners & Agencies'}</span>
            </button>
          </div>
        </div>

        {/* TAB 1: BLOG & NEWS HUB */}
        {activeTab === 'blog' && (
          <div className="space-y-6">

            {/* Filter & Search Controls Bar */}
            <div className="bg-white p-4 rounded-xl shadow-xs border border-[#D1DCE5] flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Categories */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-[#009600] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {lang === 'ar' ? 'جميع المقالات' : 'All Articles'}
                </button>

                <button
                  onClick={() => setSelectedCategory('news')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'news'
                      ? 'bg-[#006BB2] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {lang === 'ar' ? 'أخبار المنصة' : 'Platform News'}
                </button>

                <button
                  onClick={() => setSelectedCategory('research')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'research'
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {lang === 'ar' ? 'دراسات وبحوث' : 'Research Reports'}
                </button>

                <button
                  onClick={() => setSelectedCategory('field')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'field'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {lang === 'ar' ? 'رحلات ميدانية' : 'Field Expeditions'}
                </button>

                <button
                  onClick={() => setSelectedCategory('partner')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === 'partner'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {lang === 'ar' ? 'إعلانات الشركاء' : 'Partner Updates'}
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute top-2.5 left-3 rtl:left-auto rtl:right-3 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'ar' ? 'البحث في المقالات والأخبار...' : 'Search articles...'}
                  className="w-full pl-9 rtl:pl-3 rtl:pr-9 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#006BB2] focus:outline-none"
                />
              </div>

            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border border-[#D1DCE5] flex flex-col hover:shadow-xl transition-all group"
                >
                  {/* Article Thumbnail */}
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={post.imageUrl}
                      alt={post.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    
                    {/* Category Pill */}
                    <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-[#009600] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase shadow-sm">
                      {post.category}
                    </div>

                    {/* SDG Tags */}
                    <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex gap-1">
                      {post.sdgTags.map((sdg) => (
                        <span
                          key={sdg.id}
                          className="text-[9px] font-bold text-white px-2 py-0.5 rounded shadow-xs"
                          style={{ backgroundColor: sdg.color }}
                        >
                          {sdg.code}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-[#006BB2]" />
                          <span>{post.date}</span>
                        </span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{post.readTimeMinutes} {lang === 'ar' ? 'دقائق قراءة' : 'min read'}</span>
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#006BB2] transition-colors line-clamp-2 leading-snug">
                        {lang === 'ar' ? post.titleAr : post.titleEn}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {lang === 'ar' ? post.summaryAr : post.summaryEn}
                      </p>
                    </div>

                    {/* Author & Read Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 leading-none">
                            {lang === 'ar' ? post.authorAr : post.authorEn}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {lang === 'ar' ? post.authorRoleAr : post.authorRoleEn}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedArticle(post)}
                        className="px-3 py-1.5 bg-[#006BB2] hover:bg-[#005794] text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <span>{lang === 'ar' ? 'قراءة المزيد' : 'Read Article'}</span>
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: PARTNERS & AGENCIES */}
        {activeTab === 'partners' && (
          <div className="space-y-6">

            {/* Partners Overview Intro */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-[#D1DCE5] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#009600]" />
                  <span>{lang === 'ar' ? 'التحالف الوطني والدولي لحماية البيئة السورية' : 'National & International Environmental Alliance'}</span>
                </h3>
                <p className="text-xs text-slate-600 max-w-3xl">
                  {lang === 'ar'
                    ? 'تعمل منصة TSNEIP تحت مظلة مؤسسة التطوير البيئي بالتكامل التام مع الهيئات الوزارية والجهات الدولية لتقديم بيانات جغرافية بيئية موثقة برقم معتمد.'
                    : 'TSNEIP GIS operates under AlTatweer Environment Foundation in full integration with ministries and UN entities to present audited spatial data.'}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900 shrink-0">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <div>
                  <div>{PLATFORM_PARTNERS.length} {lang === 'ar' ? 'شريكاً رسمياً موثقاً' : 'Official Partners'}</div>
                  <div className="text-[10px] text-emerald-700 font-normal">TSNEIP Ecosystem Certified</div>
                </div>
              </div>
            </div>

            {/* Partners Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PLATFORM_PARTNERS.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white rounded-2xl p-6 shadow-md border border-[#D1DCE5] flex flex-col justify-between space-y-4 hover:shadow-xl transition-all"
                >
                  <div className="space-y-3">
                    
                    {/* Partner Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                          <img src={partner.logoUrl} alt={partner.nameEn} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                            {lang === 'ar' ? partner.nameAr : partner.nameEn}
                          </h4>
                          <span className="text-[10px] font-bold text-[#006BB2] uppercase tracking-wider block mt-0.5">
                            {lang === 'ar' ? partner.typeAr : partner.typeEn}
                          </span>
                        </div>
                      </div>

                      <span
                        className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full uppercase"
                        style={{ backgroundColor: partner.badgeColor }}
                      >
                        Est. {partner.establishedYear}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'ar' ? partner.descriptionAr : partner.descriptionEn}
                    </p>

                    {/* Role & Datasets */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Globe2 className="w-3.5 h-3.5 text-[#006BB2]" />
                        <span>{lang === 'ar' ? 'دور الشريك والتكامل:' : 'Partner Role & Integration:'}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {lang === 'ar' ? partner.roleAr : partner.roleEn}
                      </div>
                    </div>

                  </div>

                  {/* Partner Bottom Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-emerald-700 font-bold">
                      <FileSpreadsheet className="w-4 h-4" />
                      <span>{partner.datasetsCount} {lang === 'ar' ? 'سجلاً مرتبطة' : 'Linked Datasets'}</span>
                    </div>

                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-all flex items-center gap-1"
                    >
                      <span>{lang === 'ar' ? 'الموقع الرسمي' : 'Official Site'}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#006BB2]" />
                    </a>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* FULL ARTICLE MODAL READER */}
        {selectedArticle && (
          <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-300 p-6 md:p-8 space-y-6">
              
              {/* Modal Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 text-xs font-bold text-[#009600]">
                  <AltatweerLogo lang={lang} size="sm" showText={false} />
                  <span>{lang === 'ar' ? 'دراسة بيئية معتمدة من TSNEIP' : 'Certified TSNEIP Article'}</span>
                </div>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Cover Image & Title */}
              <div className="space-y-3">
                <div className="h-64 rounded-xl overflow-hidden relative">
                  <img src={selectedArticle.imageUrl} alt={selectedArticle.titleEn} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-xl md:text-2xl font-black font-heading leading-tight">
                      {lang === 'ar' ? selectedArticle.titleAr : selectedArticle.titleEn}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-3">
                    <span>👤 {lang === 'ar' ? selectedArticle.authorAr : selectedArticle.authorEn}</span>
                    <span>&bull;</span>
                    <span>📅 {selectedArticle.date}</span>
                  </div>
                  <span className="font-mono bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    {selectedArticle.readTimeMinutes} min read
                  </span>
                </div>
              </div>

              {/* Article Paragraphs */}
              <div className="space-y-4 text-sm text-slate-800 leading-relaxed font-sans">
                {(lang === 'ar' ? selectedArticle.contentAr : selectedArticle.contentEn).map((paragraph, index) => (
                  <p key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'تحميل التقرير الكامل (PDF)' : 'Download PDF Brief'}</span>
                </button>

                <button
                  onClick={() => setSelectedArticle(null)}
                  className="px-5 py-2 bg-[#006BB2] hover:bg-[#005794] text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  {lang === 'ar' ? 'إغلاق القارئ' : 'Close Article'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
