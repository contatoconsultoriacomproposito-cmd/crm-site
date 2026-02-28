"use client";

import { 
  Car, Heart, Home, Briefcase, ShieldCheck, Laptop, Truck, Umbrella, 
  Smartphone, Bike, Tractor, Building2, UserCheck, Stethoscope, 
  Coins, Scale 
} from "lucide-react";

// Mapeamento de ícones (adicionei alguns extras para os novos slugs)
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
  descricao?: string; // Adicionado conforme sua atualização no banco
}

export default function ProductsGrid({ produtos }: { produtos: Product[] }) {
  if (!produtos || produtos.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-gray-50/50 w-full">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {produtos.map((produto) => {
            const nomeMinusculo = produto.nome.toLowerCase();
            
            // Procura a chave no dicionário que está contida no nome do produto
            const iconKey = Object.keys(iconMap).find(key => nomeMinusculo.includes(key));
            const IconeFinal = iconKey ? iconMap[iconKey] : <ShieldCheck className="w-10 h-10" />;
            
            const anchorId = `seguro-${produto.nome.replace(/\s+/g, '-').toLowerCase()}`;

            return (
              <div 
                key={produto.id} 
                id={anchorId}
                className="scroll-mt-40 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all duration-500 flex flex-col items-center text-center group cursor-pointer hover:shadow-xl hover:-translate-y-1"
              >
                <div className="mb-6 p-4 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  {IconeFinal}
                </div>
                
                <h3 className="font-bold text-lg text-gray-900 mb-3 uppercase tracking-tight">
                  {produto.nome}
                </h3>
                
                <p className="text-sm text-gray-500 mb-8 leading-relaxed line-clamp-3">
                  {produto.descricao || "Proteção completa para você e seu patrimônio."}
                </p>
                
                <span className="mt-auto text-primary font-bold text-sm inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform">
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