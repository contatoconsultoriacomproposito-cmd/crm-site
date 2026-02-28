"use client";

import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Depoimento {
  autor: string;
  texto: string;
  estrelas: number;
  foto_url?: string;
}

interface TestimonialsProps {
  depoimentos: Depoimento[];
  cor: string;
}

export default function TestimonialsCarousel({ depoimentos, cor }: TestimonialsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (!depoimentos || depoimentos.length === 0) return null;

  return (
    <section className="py-16 bg-white overflow-hidden group">
      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* SETAS DE NAVEGAÇÃO (Visíveis no hover em Desktop) */}
        <button 
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-xl border border-gray-100 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden lg:flex"
          style={{ backgroundColor: 'white', color: cor }}
        >
          <ChevronLeft size={24} />
        </button>

        <button 
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-xl border border-gray-100 text-gray-400 hover:text-white transition-all opacity-0 group-hover:opacity-100 hidden lg:flex"
          style={{ backgroundColor: 'white', color: cor }}
        >
          <ChevronRight size={24} />
        </button>

        {/* CONTAINER DE SCROLL */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 px-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {depoimentos.map((dep, index) => (
            <div
              key={index}
              className="min-w-[85%] sm:min-w-[45%] lg:min-w-[31%] snap-center bg-gray-50 p-8 rounded-[32px] border border-gray-100 flex flex-col justify-between transition-all duration-300 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50"
            >
              <div>
                <div className="flex gap-1 text-yellow-400 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < dep.estrelas ? "fill-current" : "text-gray-200"}`} />
                  ))}
                </div>
                <p className="text-gray-600 italic leading-relaxed text-sm md:text-base">
                  "{dep.texto}"
                </p>
              </div>

              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200/60">
                <img
                  src={dep.foto_url || `https://ui-avatars.com/api/?name=${dep.autor}&background=random`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  alt={dep.autor}
                />
                <div>
                  <span className="font-black text-xs text-gray-900 uppercase tracking-tighter block">
                    {dep.autor}
                  </span>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">Cliente Satisfeito</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estilo CSS para esconder a scrollbar mantendo o scroll funcional */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}