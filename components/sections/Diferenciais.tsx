interface DiferencialItem {
  titulo: string;
  descricao: string;
}

interface DiferenciaisProps {
  cor: string;
  // Alterado para 'dados' para representar o objeto JSONB do banco
  dados: {
    imagem_url?: string;
    itens?: DiferencialItem[];
  };
}

export default function Diferenciais({ cor, dados }: DiferenciaisProps) {
  // Fallbacks para quando o banco estiver vazio
  const imagemPadrao = "https://images.unsplash.com/photo-1600880212340-02d956ea3a8a?q=80&w=1000";
  const itensFallback = [
    { titulo: "Atendimento Humanizado", descricao: "Nossa equipe está pronta para te ouvir." },
    { titulo: "Consultoria Especializada", descricao: "Especialistas em diversos ramos." },
    { titulo: "Rapidez no Sinistro", descricao: "Acompanhamos todo o processo." }
  ];

  const imagemExibida = dados?.imagem_url || imagemPadrao;
  const itensExibidos = dados?.itens?.length ? dados.itens : itensFallback;

  return (
    <section id="diferenciais" className="py-24 bg-gray-900 text-white px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        {/* LADO ESQUERDO: IMAGEM (Vinda do CRM) */}
        <div className="w-full md:w-1/2">
          <div className="relative group">
            {/* Overlay decorativo com a cor da corretora */}
            <div 
              className="absolute -inset-4 rounded-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
              style={{ backgroundColor: cor }}
            ></div>
            <img 
              src={imagemExibida} 
              className="relative rounded-3xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 aspect-[4/3] object-cover" 
              alt="Nossos Diferenciais" 
            />
          </div>
        </div>

        {/* LADO DIREITO: TEXTOS */}
        <div className="w-full md:w-1/2">
          <span className="text-sm font-black uppercase tracking-[0.3em] mb-4 block" style={{ color: cor }}>
            Vantagens Exclusivas
          </span>
          <h2 className="text-4xl md:text-5xl font-black mb-12 leading-tight">
            Por que escolher <br/> nossa corretora?
          </h2>

          <div className="space-y-10">
            {itensExibidos.map((item, idx) => (
              <div key={idx} className="group flex gap-4 border-l-4 pl-6 transition-all duration-300 hover:border-white" style={{ borderColor: cor }}>
                <div>
                  <h4 className="text-xl font-bold mb-2 group-hover:translate-x-2 transition-transform duration-300">
                    {item.titulo}
                  </h4>
                  <p className="text-gray-400 leading-relaxed max-w-md">
                    {item.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}