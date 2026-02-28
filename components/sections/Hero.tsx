"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  imagem_url: string;
  titulo: string;
  subtitulo: string;
}

interface HeroProps {
  nome: string;
  cor: string;
  slides: Slide[]; // Aqui o React recebe o array do Supabase (ex: suas 3 imagens)
}

export default function Hero({ nome, cor, slides = [] }: HeroProps) {
  const [current, setCurrent] = useState(0);

  // 1. Fallback: Se o banco estiver vazio, ele mostra este slide padrão
  const defaultSlides: Slide[] = [
    {
      imagem_url: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2000",
      titulo: `Proteção completa com a ${nome}`,
      subtitulo: "Seguros personalizados com atendimento humanizado e tecnologia de ponta."
    }
  ];

  // Se 'slides' vier do banco com 3 itens, activeSlides terá tamanho 3
  const activeSlides = slides && slides.length > 0 ? slides : defaultSlides;

  // 2. Lógica de Autoplay: Muda o slide automaticamente a cada 6 segundos
  useEffect(() => {
    if (activeSlides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
    }, 6000);

    return () => clearInterval(timer);
  }, [activeSlides.length]);

  // Funções para mudar manualmente nas setas
  const nextSlide = () => setCurrent((prev) => (prev === activeSlides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? activeSlides.length - 1 : prev - 1));

  // Função do CTA Único: Desloca a página até o Grid de Produtos
  const scrollToProducts = () => {
    const element = document.getElementById("seguros");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-gray-900">
      {/* 3. RENDERIZAÇÃO DINÂMICA: Mapeia cada slide vindo do banco */}
      {activeSlides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          {/* Overlay para escurecer a foto e destacar o texto */}
          <div className="absolute inset-0 bg-black/50 z-20" />
          
          <img
            src={slide.imagem_url}
            alt={slide.titulo}
            className="h-full w-full object-cover"
          />

          {/* Textos Dinâmicos: Cada imagem terá seu próprio título e subtítulo */}
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center text-white">
            <h2 className="mb-4 max-w-4xl text-4xl font-black md:text-6xl uppercase tracking-tighter leading-[1.1]">
              {slide.titulo}
            </h2>
            <p className="mb-10 max-w-2xl text-lg md:text-xl text-gray-200">
              {slide.subtitulo}
            </p>
            
            {/* CTA Único solicitado */}
            <button 
              onClick={scrollToProducts}
              className="rounded-full px-12 py-4 text-lg font-black shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
              style={{ backgroundColor: cor }}
            >
              Conhecer Soluções
            </button>
          </div>
        </div>
      ))}

      {/* 4. Setas de Navegação Manual */}
      {activeSlides.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white hover:bg-black/40">
            <ChevronLeft size={32} />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/20 p-2 text-white hover:bg-black/40">
            <ChevronRight size={32} />
          </button>

          {/* Indicadores (Bolinhas) na parte inferior */}
          <div className="absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 gap-3">
            {activeSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === current ? "w-8" : "w-2 bg-white/50"
                }`}
                style={{ backgroundColor: i === current ? cor : "" }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}