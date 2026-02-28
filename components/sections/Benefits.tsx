import { ShieldCheck, Zap, Headphones } from "lucide-react";

export default function Benefits({ cor }: { cor: string }) {
  const items = [
    { 
      title: "Cotação Ágil", 
      desc: "Receba as melhores opções em tempo recorde.", 
      icon: <Zap size={32} /> 
    },
    { 
      title: "Multi-Seguradoras", 
      desc: "Comparamos as maiores do mercado para você.", 
      icon: <ShieldCheck size={32} /> 
    },
    { 
      title: "Suporte 24h", 
      desc: "Atendimento especializado quando você mais precisar.", 
      icon: <Headphones size={32} /> 
    },
  ];

  return (
    <section className="py-20 bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center group">
            <div 
              style={{ color: cor }} 
              className="mb-6 p-4 rounded-2xl bg-white shadow-sm group-hover:scale-110 transition-transform"
            >
              {item.icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
            <p className="text-gray-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}