"use client";

import { useState } from "react";
import { Mail, MessageCircle, ChevronDown, Menu, X } from "lucide-react";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

interface NavbarProps {
  cor: string;
  contatos: {
    facebook?: string;
    instagram?: string;
    whatsapp_comercial?: string;
    email_corporativo?: string;
    logotipo_url?: string;
  };
  logo_url?: string;
  nome_exibicao: string;
  produtos?: string[];
}

export default function Navbar({
  cor,
  contatos,
  logo_url,
  nome_exibicao,
  produtos = []
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const whatsappLimpo = contatos.whatsapp_comercial?.replace(/\D/g, "") || "";
  const logoFinal = contatos.logotipo_url || logo_url;

  // --- FILTRO DE SEGURANÇA INTERNO ---
  const produtosUnicos = Array.from(
    new Set(produtos.map(p => p.trim().toUpperCase()))
  ).filter(Boolean).sort();

  return (
    <header className="w-full sticky top-0 z-50 bg-white">
      {/* 1. TOP BAR - Mantida conforme original, mas otimizada */}
      <div className="bg-gray-900 text-white py-2 px-4 md:px-12 flex justify-between items-center text-[11px] md:text-xs font-medium">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            {contatos.instagram && (
              <a
                href={contatos.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-70 transition-opacity flex items-center gap-1"
              >
                <FaInstagram size={14} />
                <span className="hidden sm:inline opacity-80">Instagram</span>
              </a>
            )}

            {contatos.facebook && (
              <a
                href={contatos.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:opacity-70 transition-opacity flex items-center gap-1"
              >
                <FaFacebookF size={14} />
                <span className="hidden sm:inline opacity-80">Facebook</span>
              </a>
            )}
          </div>

          {(contatos.instagram || contatos.facebook) && (
            <div className="h-3 w-[1px] bg-gray-700 hidden sm:block"></div>
          )}

          <div className="hidden sm:flex items-center gap-2">
            <Mail size={13} style={{ color: cor }} strokeWidth={2} />
            <span className="opacity-80">
              {contatos.email_corporativo || "E-mail não informado"}
            </span>
          </div>
        </div>

        <div className="uppercase tracking-[0.15em] opacity-70 font-bold hidden md:block text-[10px]">
          Atendimento Nacional
        </div>
      </div>

      {/* 2. MAIN HEADER + MENU INTEGRADO */}
      <div className="bg-white border-b border-gray-100 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-12 h-20 md:h-28 flex justify-between items-center">
          
          {/* LOGO */}
          <div className="flex items-center">
            {logoFinal ? (
              <img
                src={logoFinal}
                alt={nome_exibicao}
                className="h-10 md:h-16 w-auto object-contain transition-transform hover:scale-105"
              />
            ) : (
              <h1
                className="text-xl md:text-2xl font-black uppercase tracking-tighter"
                style={{ color: cor }}
              >
                {nome_exibicao}
              </h1>
            )}
          </div>

          {/* DESKTOP NAVIGATION (Integrada lateralmente para eficiência) */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#sobre" className="nav-link">Sobre</a>
            
            <div className="relative group cursor-pointer py-4">
              <button className="nav-link flex items-center gap-2">
                Seguros <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
              </button>
              
              <div className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-100 overflow-hidden">
                <div className="py-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                  {produtosUnicos.length > 0 ? (
                    produtosUnicos.map((nomeProduto) => (
                      <a 
                        key={nomeProduto}
                        href={`#seguro-${nomeProduto.replace(/\s+/g, '-').toLowerCase()}`} 
                        className="block px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                        style={{ borderLeft: `3px solid transparent` }}
                        onMouseEnter={(e) => e.currentTarget.style.borderLeftColor = cor}
                        onMouseLeave={(e) => e.currentTarget.style.borderLeftColor = 'transparent'}
                      >
                        {nomeProduto}
                      </a>
                    ))
                  ) : (
                    <span className="block px-6 py-4 text-[10px] text-gray-400">Nenhum produto ativo</span>
                  )}
                </div>
              </div>
            </div>

            <a href="#diferenciais" className="nav-link">Diferenciais</a>
            <a href="#contato" className="nav-link">Contato</a>
          </nav>

          {/* BOTÕES DE AÇÃO */}
          <div className="flex items-center gap-4">
            {/* WhatsApp (Desktop) */}
            {contatos.whatsapp_comercial && (
              <a
                href={`https://wa.me/${whatsappLimpo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-3 group border-r border-gray-100 pr-6 mr-2"
              >
                <div className="text-right">
                  <p className="text-[9px] uppercase font-bold text-gray-400 leading-none mb-1">Central WhatsApp</p>
                  <p className="text-sm font-extrabold text-gray-800 group-hover:text-green-600 transition-colors">
                    {contatos.whatsapp_comercial}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-gray-50 group-hover:bg-green-50 transition-colors">
                  <MessageCircle size={20} style={{ color: cor }} />
                </div>
              </a>
            )}

            <button
              className="text-white px-6 md:px-8 py-3 rounded-full text-[11px] md:text-xs font-black shadow-lg hover:brightness-110 hover:shadow-xl transition-all active:scale-95 flex items-center gap-3"
              style={{ backgroundColor: cor }}
            >
              <span className="relative flex h-2 w-2 hidden md:flex">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              COTAR COM IA
            </button>

            {/* Menu Mobile Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE MENU DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[300px] bg-white shadow-2xl p-8 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-10">
              <span className="text-xs font-black uppercase tracking-widest opacity-40">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex flex-col gap-6">
              <a href="#sobre" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Sobre</a>
              <div className="h-[1px] bg-gray-100 w-full" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seguros</p>
              <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {produtosUnicos.map(p => (
                  <a key={p} href={`#seguro-${p.replace(/\s+/g, '-').toLowerCase()}`} className="text-sm font-bold text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>{p}</a>
                ))}
              </div>
              <div className="h-[1px] bg-gray-100 w-full" />
              <a href="#contato" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contato</a>
            </nav>

            <div className="mt-auto pt-8">
               <button
                className="w-full text-white py-4 rounded-xl text-xs font-black shadow-lg"
                style={{ backgroundColor: cor }}
              >
                ÁREA RESTRITA
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .nav-link { 
          color: #1a1a1a !important; 
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          transition: all 0.2s ease-in-out;
          display: flex;
          align-items: center;
        }
        .nav-link:hover { color: ${cor} !important; }
        .mobile-nav-link {
          font-size: 16px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f9f9f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${cor}; border-radius: 10px; }
      `}</style>
    </header>
  );
}