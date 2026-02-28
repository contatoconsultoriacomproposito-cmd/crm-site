interface CTASectionProps {
  nome: string;
  cor: string;
}

export default function CTASection({ nome, cor }: CTASectionProps) {
  return (
    <section className="py-24 px-6">
      <div 
        className="max-w-5xl mx-auto rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden"
        style={{ backgroundColor: cor }}
      >
        {/* Detalhe visual de fundo (Círculo sutil) */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
            Pronto para proteger o seu futuro com a {nome}?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium">
            Nossa Inteligência Artificial está pronta para encontrar a melhor cobertura para você em segundos. Sem burocracia.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-gray-900 px-10 py-4 rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-transform active:scale-95">
              Fazer Cotação Online
            </button>
            <button className="bg-transparent border-2 border-white/40 hover:border-white text-white px-10 py-4 rounded-full text-lg font-bold transition-colors">
              Falar com Humano
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}