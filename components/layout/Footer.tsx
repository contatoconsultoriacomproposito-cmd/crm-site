"use client";

import { Instagram, Facebook, Mail, MessageCircle, ArrowUp } from "lucide-react";

interface FooterProps {
  cor: string;
  config: any; // Dados da tab_configuracoes_site
  corretora: any; // Dados da tab_corretora_config
}

export default function Footer({ cor, config, corretora }: FooterProps) {
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100 px-6 md:px-12 w-full">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* COLUNA 1: IDENTIDADE */}
          <div className="space-y-6">
            {config.logo_url ? (
              <img src={config.logo_url} alt={config.nome_exibicao} className="h-12 w-auto object-contain" />
            ) : (
              <h3 className="text-2xl font-black uppercase tracking-tighter" style={{ color: cor }}>
                {config.nome_exibicao}
              </h3>
            )}
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Protegendo seu patrimônio com inteligência, transparência e inovação tecnológica através do SeguroCRM.
            </p>
            {/* REDES SOCIAIS DINÂMICAS */}
            <div className="flex gap-4">
              {corretora?.instagram && (
                <a href={corretora.instagram} target="_blank" className="p-2 rounded-full bg-gray-50 hover:text-white transition-all" style={{ "--hover-bg": cor } as any} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = cor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
                  <Instagram size={18} />
                </a>
              )}
              {corretora?.facebook && (
                <a href={corretora.facebook} target="_blank" className="p-2 rounded-full bg-gray-50 hover:text-white transition-all" style={{ "--hover-bg": cor } as any} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = cor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
                  <Facebook size={18} />
                </a>
              )}
              {corretora?.email_corporativo && (
                <a href={`mailto:${corretora.email_corporativo}`} className="p-2 rounded-full bg-gray-50 hover:text-white transition-all" style={{ "--hover-bg": cor } as any} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = cor} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
                  <Mail size={18} />
                </a>
              )}
            </div>
          </div>
          
          {/* COLUNA 2: NAVEGAÇÃO */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 text-gray-900">Mapa do Site</h4>
            <ul className="text-sm space-y-4 text-gray-500 font-bold">
              <li><a href="#sobre" className="hover:translate-x-2 transition-transform inline-block" style={{ color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.color = cor} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Sobre nós</a></li>
              <li><a href="#seguros" className="hover:translate-x-2 transition-transform inline-block" style={{ color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.color = cor} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Nossas Soluções</a></li>
              <li><a href="#depoimentos" className="hover:translate-x-2 transition-transform inline-block" style={{ color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.color = cor} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Depoimentos</a></li>
              <li><a href="#contato" className="hover:translate-x-2 transition-transform inline-block" style={{ color: 'inherit' }} onMouseEnter={(e) => e.currentTarget.style.color = cor} onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}>Fale Conosco</a></li>
            </ul>
          </div>

          {/* COLUNA 3: INSTITUCIONAL */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 text-gray-900">Institucional</h4>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Razão Social</p>
                <p className="text-sm text-gray-700 font-medium">{corretora?.razao_social}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Registro SUSEP</p>
                <p className="text-sm text-gray-700 font-medium">{corretora?.registro_susep || "Ativo"}</p>
              </div>
            </div>
          </div>

          {/* COLUNA 4: LOCALIZAÇÃO & VOLTAR AO TOPO */}
          <div className="relative">
            <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-8 text-gray-900">Endereço</h4>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              {corretora?.logradouro}, {corretora?.numero}<br/>
              {corretora?.bairro} - {corretora?.municipio}/{corretora?.uf}<br/>
              CEP: {corretora?.cep}
            </p>
            <button 
              onClick={scrollToTop}
              className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              Voltar ao topo <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-[11px] text-gray-400 font-medium">
            <p>© 2026 {config.nome_exibicao}. Todos os direitos reservados.</p>
            <p className="hidden md:block">|</p>
            <p>CNPJ: {corretora?.cnpj}</p>
          </div>
          
          <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Tecnologia</span>
            <span className="font-black text-xs text-blue-600">SeguroCRM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}