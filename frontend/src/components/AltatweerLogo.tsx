import React from 'react';
import { Language } from '../types';

interface AltatweerLogoProps {
  lang?: Language;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textColor?: string;
  className?: string;
}

export const AltatweerLogo: React.FC<AltatweerLogoProps> = ({
  lang = 'ar',
  size = 'md',
  showText = true,
  textColor = 'text-white',
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', title: 'text-xs', subtitle: 'text-[9px]' },
    md: { box: 'w-11 h-11', title: 'text-sm font-extrabold', subtitle: 'text-[10px]' },
    lg: { box: 'w-14 h-14', title: 'text-base font-extrabold', subtitle: 'text-xs' },
    xl: { box: 'w-20 h-20', title: 'text-xl font-black', subtitle: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 ${className} select-none`}>
      {/* Al Tatweer PNG Emblem */}
      <div className={`relative ${currentSize.box} shrink-0 group hover:scale-105 transition-transform duration-200 cursor-pointer`}>
        <img
          src="https://github.com/AmerYassir/TSNEIP/blob/main/tatweer_logo.png?raw=true"
          alt="Al Tatweer Logo"
          className="w-full h-full object-contain drop-shadow-sm"
        />
      </div>

      {/* Text Branding */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`${currentSize.title} tracking-tight font-heading font-black text-[#009600] ${textColor === 'text-white' ? 'drop-shadow-xs text-white' : 'text-[#009600]'}`}>
              {lang === 'ar' ? 'مؤسسة التطوير' : 'Al Tatweer Foundation'}
            </span>
          </div>
          <span className={`${currentSize.subtitle} opacity-90 font-bold mt-0.5 tracking-wide ${textColor === 'text-white' ? 'text-blue-100' : 'text-[#006BB2]'}`}>
            {lang === 'ar' ? 'منصة المعلومات والنظم الجغرافية البيئية - TSNEIP' : 'Syrian Ecosystem GIS Platform'}
          </span>
        </div>
      )}
    </div>
  );
};