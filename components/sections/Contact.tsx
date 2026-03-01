"use client";

import { Mail, Phone, MapPin, FileText } from "lucide-react";
import { useState } from "react";

interface ContactProps {
  cor: string;
  corretora: any;
  produtos: string[];
}

export default function Contact({ cor, corretora, produtos }: ContactProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [telefone, setTelefone] = useState("");

  // Máscara de Telefone (Brasil)
  const handlePhoneMask = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/g, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .replace(/(-\d{4})\d+?$/, "$1");
  };

  const handleCheckboxChange = (nome: string) => {
    setSelectedProducts(prev => 
      prev.includes(nome) ? prev.filter(p => p !== nome) : [...prev, nome]
    );
  };

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const mensagem = `Olá! Me chamo ${formData.get("nome")}.%0A` +
                     `Meu WhatsApp: ${telefone}.%0A` +
                     `Tenho interesse nos seguintes seguros: ${selectedProducts.join(", ") || "Informados na consultoria"}.%0A` +
                     `E-mail: ${formData.get("email")}`;
    
    window.open(`https://wa.me/55${corretora?.whatsapp_comercial?.replace(/\D/g, "")}?text=${mensagem}`, "_blank");
  };

  const mapAddress = encodeURIComponent(`${corretora?.logradouro}, ${corretora?.numero}, ${corretora?.municipio} - ${corretora?.uf}`);
  const mapSearchUrl = `https://maps.google.com/maps?q=${mapAddress}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="contato" className="py-20 bg-gray-50 border-t border-gray-100 w-full">
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          
          {/* COLUNA 1: DADOS LEGAIS */}
          <div className="flex flex-col justify-center space-y-8 py-4">
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2 text-gray-400">
                Fale com a <span style={{ color: cor }}>Corretora</span>
              </h3>
              <p className="text-gray-800 font-bold text-xl leading-tight">
                {corretora?.razao_social || "NOME DA CORRETORA"}
              </p>
            </div>

            <div className="space-y-6 text-sm text-gray-700 font-medium">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 shrink-0" style={{ color: cor }} />
                <p className="leading-relaxed">
                  {corretora?.logradouro}, {corretora?.numero}<br/>
                  {corretora?.bairro} — {corretora?.municipio}/{corretora?.uf}<br/>
                  CEP: {corretora?.cep}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <FileText className="w-6 h-6 shrink-0" style={{ color: cor }} />
                <p>CNPJ: {corretora?.cnpj}</p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 shrink-0" style={{ color: cor }} />
                <p className="text-lg font-bold">{corretora?.whatsapp_comercial}</p>
              </div>
            </div>
          </div>

          {/* COLUNA 2: FORMULÁRIO COM TELEFONE */}
          <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100">
            <form onSubmit={handleWhatsAppRedirect} className="space-y-4">
              <div className="space-y-4">
                <input 
                  name="nome" 
                  type="text" 
                  placeholder="Seu nome completo" 
                  required 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 transition-all outline-none" 
                  style={{"--tw-ring-color": cor} as any} 
                />
                
                {/* CAMPO TELEFONE ADICIONADO */}
                <input 
                  name="telefone" 
                  type="tel" 
                  placeholder="Seu WhatsApp (com DDD)" 
                  value={telefone}
                  onChange={(e) => setTelefone(handlePhoneMask(e.target.value))}
                  required 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 transition-all outline-none" 
                  style={{"--tw-ring-color": cor} as any} 
                />

                <input 
                  name="email" 
                  type="email" 
                  placeholder="Seu melhor e-mail" 
                  required 
                  className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 transition-all outline-none" 
                  style={{"--tw-ring-color": cor} as any} 
                />
              </div>
              
              <div className="py-2">
                <p className="text-[11px] font-black uppercase text-gray-500 mb-4 tracking-widest">Tenho interesse em:</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {produtos.map((prod) => (
                    <label key={prod} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-none" 
                          style={{ backgroundColor: selectedProducts.includes(prod) ? cor : 'transparent' }}
                          onChange={() => handleCheckboxChange(prod)}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 group-hover:text-black transition-colors uppercase tracking-tight">
                        {prod}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 rounded-2xl text-white font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                style={{ backgroundColor: cor, boxShadow: `0 10px 20px -10px ${cor}` }}
              >
                Solicitar Cotação
              </button>
            </form>
          </div>

          {/* COLUNA 3: MAPA */}
          <div className="h-[450px] lg:h-auto min-h-[400px] rounded-[40px] overflow-hidden shadow-lg border-4 border-white">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapSearchUrl}
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  );
}