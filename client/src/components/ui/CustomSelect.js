'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export const CustomSelect = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select option...',
  className = '',
  alignRight = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value)) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block w-full text-left font-sans ${className}`}>
      {/* TRIGGER BUTTON */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-[#FFF0F3] border-1.5 border-[#FFCCE1] rounded-2xl text-xs font-black text-[#2A0826] hover:border-[#FF2A6D] transition-all cursor-pointer shadow-xs active:scale-[0.99]"
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-[#FF2A6D] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* CUSTOM FLOATING DROPDOWN MENU */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1.5 ${
            alignRight ? 'right-0' : 'left-0'
          } w-full min-w-[160px] max-w-full bg-white border-2 border-[#FFCCE1] rounded-2xl shadow-[0_12px_35px_rgba(42,8,38,0.18)] z-50 animate-fade-in overflow-hidden`}
        >
          <div
            className="p-1.5 max-h-52 overflow-y-auto custom-select-scrollbar"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#FF5C8A transparent',
            }}
          >
            <div className="space-y-1">
              {options.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange({ target: { value: opt.value } });
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-[#FFF0F3] text-[#FF2A6D] font-black shadow-xs'
                        : 'text-[#2A0826] hover:bg-[#FFF0F3]/70 hover:text-[#FF2A6D]'
                    }`}
                  >
                    <span className="truncate pr-2">{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#FF2A6D] shrink-0 stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
