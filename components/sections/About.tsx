"use client";

import { Target, Eye, ShieldCheck } from "lucide-react";

interface AboutProps {
  cor: string;
  conteudo: {
    historia?: string;
    missao?: string;
    visao?: string;
    valores?: string;
    imagem_sobre_url?: string; // Nova prop para a imagem do corretor/equipe
  };
}

export default function About({ cor, conteudo }: AboutProps) {
  const pilares = [
    { 
      icon: <Target size={28} />, 
      label: "Missão", 
      text: conteudo.missao || "Prover as melhores soluções em seguros com transparência e agilidade." 
    },
    { 
      icon: <Eye size={28} />, 
      label: "Visão", 
      text: conteudo.visao || "Ser referência nacional em inovação e atendimento no mercado de seguros." 
    },
    { 
      icon: <ShieldCheck size={28} />, 
      label: "Valores", 
      text: conteudo.valores || "Ética, compromisso com o cliente e excelência operacional." 
    },
  ];

  return (
    <section id="sobre" className="py-24 bg-white px-6 md:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* COLUNA DA ESQUERDA: IMAGEM */}
          <div className="relative group">
            {/* Elemento Decorativo atrás da foto */}
            <div 
              className="absolute -bottom-6 -right-6 w-full h-full rounded-2xl opacity-10 z-0"
              style={{ backgroundColor: cor }}
            ></div>
            
            <div className="relative z-10 overflow-hidden rounded-2xl shadow-2xl aspect-[4/5] lg:aspect-auto lg:h-[600px]">
              {conteudo.imagem_sobre_url ? (
                <img 
                  src={conteudo.imagem_sobre_url} 
                  alt="Nossa Equipe" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center p-12 text-center">
                  <p className="text-gray-400 font-medium italic">
                    Faça o upload da sua foto ou da sua equipe no painel administrativo.
                  </p>
                </div>
              )}
            </div> 
          </div>

          {/* COLUNA DA DIREITA: TEXTOS */}
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: cor }}>
              Quem Somos
            </span>
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-[1.1] text-gray-900">
              Nossa história começa <br />
              <span className="relative">
                <span className="relative z-10" style={{ color: cor }}>aqui!</span>
                <span className="absolute bottom-1 left-0 w-full h-3 bg-current opacity-10 z-0"></span>
              </span>
            </h2>
            
            <div className="text-gray-600 leading-relaxed text-base md:text-lg mb-12 space-y-4">
              {conteudo.historia ? (
                // Permite parágrafos se o texto vier formatado
                conteudo.historia.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <p>Sua história começa aqui. Carregue sua trajetória no painel do corretor para conectar-se com seus clientes.</p>
              )}
            </div>

            {/* PILARES (GRID INTERNO) */}
            <div className="grid gap-4">
              {pilares.map((pilar, idx) => (
                <div 
                  key={idx} 
                  className="group flex gap-5 p-5 rounded-xl border border-gray-100 bg-white hover:border-transparent hover:shadow-xl transition-all duration-300"
                >
                  <div 
                    style={{ color: cor, backgroundColor: `${cor}10` }} 
                    className="shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors group-hover:bg-current group-hover:text-white"
                  >
                    {pilar.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-xs uppercase tracking-widest text-gray-900 mb-1">{pilar.label}</h4>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{pilar.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}