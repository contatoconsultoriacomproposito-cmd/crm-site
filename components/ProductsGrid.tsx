"use client";

import { 
  Car, Heart, Home, Briefcase, ShieldCheck, Laptop, Truck, Umbrella, 
  Smartphone, Bike, Tractor, Building2, UserCheck, Stethoscope, 
  Coins, Scale 
} from "lucide-react";

const iconMap: Record<string, any> = {
  "equipamentos": <Laptop className="w-10 h-10" />,
  "agrícola": <Tractor className="w-10 h-10" />,
  "transporte": <Truck className="w-10 h-10" />,
  "vida": <Heart className="w-10 h-10" />,
  "bicicleta": <Bike className="w-10 h-10" />,
  "auto": <Car className="w-10 h-10" />,
  "previdência": <Coins className="w-10 h-10" />,
  "celular": <Smartphone className="w-10 h-10" />,
  "dental": <UserCheck className="w-10 h-10" />,
  "saúde": <Stethoscope className="w-10 h-10" />,
  "condomínio": <Building2 className="w-10 h-10" />,
  "viagem": <Umbrella className="w-10 h-10" />,
  "residencial": <Home className="w-10 h-10" />,
  "empresarial": <Briefcase className="w-10 h-10" />,
  "responsabilidade": <Scale className="w-10 h-10" />,
  "rc": <Scale className="w-10 h-10" />,
};

interface Product {
  id: string;
  nome: string;
  descricao?: string;
}

interface ProductsGridProps {
  produtos: Product[];
  corPrimaria: string;
}

export default function ProductsGrid({ produtos, corPrimaria }: ProductsGridProps) {
  if (!produtos || produtos.length === 0) return null;

  const abrirChat = (e: React.MouseEvent) => {
    // Se clicar no card, abre o chat, mas não impede a ancoragem visual
    window.dispatchEvent(new CustomEvent("abrirChatSDR"));
  };

  return (
    <section className="py-20 px-6 bg-gray-50/50 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {produtos.map((produto) => {
            const nomeMinusculo = produto.nome.toLowerCase();
            const iconKey = Object.keys(iconMap).find(key => nomeMinusculo.includes(key));
            const IconeFinal = iconKey ? iconMap[iconKey] : <ShieldCheck className="w-10 h-10" />;
            
            // ID limpo para bater com o novo padrão do Navbar
            const anchorId = produto.nome.replace(/\s+/g, '-').toLowerCase();

            return (
              <div 
                key={produto.id} 
                id={anchorId}
                onClick={abrirChat}
                /* scroll-mt-40 garante que o cabeçalho não cubra o card ao scrollar */
                className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all duration-500 flex flex-col items-center text-center group cursor-pointer hover:shadow-xl hover:-translate-y-1 target:ring-4 target:ring-offset-2"
                style={({ "--tw-ring-color": corPrimaria } as any)}
              >
                <div 
                  style={{ color: corPrimaria }}
                  className="mb-6 p-4 rounded-2xl bg-gray-50 group-hover:bg-opacity-100 transition-all duration-300"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = corPrimaria;
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb";
                    e.currentTarget.style.color = corPrimaria;
                  }}
                >
                  {IconeFinal}
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-3 uppercase tracking-tight">
                  {produto.nome}
                </h3>
                
                <p className="text-sm text-gray-500 mb-8 leading-relaxed line-clamp-3">
                  {produto.descricao || "Proteção completa para você e seu patrimônio."}
                </p>
                
                <span 
                  style={{ color: corPrimaria }}
                  className="mt-auto font-bold text-sm inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                >
                  SOLICITAR COTAÇÃO →
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}