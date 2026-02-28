"use client";

interface Seguradora {
  id: string;
  nome: string;
  logo_url: string;
}

interface PartnersProps {
  cor: string;
  nomeCorretora: string;
  seguradoras: Seguradora[];
}

export default function PartnersCarousel({ cor, nomeCorretora, seguradoras }: PartnersProps) {
  // Triplicamos para garantir que o carrossel nunca tenha espaços vazios em telas ultra-wide
  const scrollingList = [...seguradoras, ...seguradoras, ...seguradoras];

return (
  <section className="py-16 bg-white overflow-hidden border-b border-gray-50">
    <div className="max-w-7xl mx-auto px-8 mb-10 text-center">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-2 block">
        Parceiros Estratégicos
      </span>
      <h3 className="text-xl md:text-2xl font-bold text-gray-900">
        As melhores seguradoras estão na <span style={{ color: cor }}>{nomeCorretora}</span>
      </h3>
    </div>

    <div className="relative flex items-center">
      {/* Gradientes laterais para suavizar a entrada e saída das logos */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-white to-transparent z-10" />

      {/* Linha Animada */}
      <div 
        className="flex items-center"
        style={{
          display: 'flex',
          width: 'max-content',
          animation: 'scrollInfinite 30s linear infinite',
        }}
      >
        {scrollingList.map((seg, idx) => (
          <div 
            key={`${seg.id}-${idx}`}
            className="flex-shrink-0 flex items-center justify-center px-6 md:px-10 group"
            style={{ width: '200px' }} // Define um "box" de largura fixa para cada parceiro
          >
            <img
              src={seg.logo_url}
              alt={seg.nome}
              className="grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110 object-contain"
              style={{ 
                height: '120px',    // Altura fixa para alinhar a linha visual
                width: '180px',   // Largura máxima para logos muito horizontais
              }}
            />
          </div>
        ))}
      </div>
    </div>

    <style jsx global>{`
      @keyframes scrollInfinite {
        0% { transform: translateX(0); }
        100% { transform: translateX(-33.33%); }
      }
      /* Pausa a animação ao passar o mouse para facilitar a visualização */
      div[style*="animation"]:hover {
        animation-play-state: paused !important;
      }
    `}</style>
  </section>
);
}