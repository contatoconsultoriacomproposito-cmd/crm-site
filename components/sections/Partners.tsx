interface PartnersProps {
  seguradoras: any[];
}

export default function Partners({ seguradoras }: PartnersProps) {
  if (seguradoras.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 border-t border-gray-50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-8">
          Trabalhamos com as melhores seguradoras
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {seguradoras.map((seg) => (
            <div key={seg.id} className="flex flex-col items-center">
              {seg.logo_url ? (
                <img 
                  src={seg.logo_url} 
                  alt={seg.nome} 
                  className="h-7 md:h-9 w-auto object-contain"
                />
              ) : (
                <span className="text-xs font-bold text-gray-400">{seg.nome}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}