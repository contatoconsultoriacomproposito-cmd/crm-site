// src/app/[slug]/page.tsx
import { fetchSiteConfig, fetchCorretoraPortfolio } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Diferenciais from "@/components/sections/Diferenciais";
import ProductsGrid from "@/components/ProductsGrid";
import PartnersCarousel from "@/components/sections/PartnersCarousel";
import TestimonialsCarousel from "@/components/sections/TestimonialsCarousel";
import Contact from "@/components/sections/Contact";
import ChatSDR from "@/components/ui/ChatSDR";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: config } = await fetchSiteConfig(slug);
  return {
    title: `${config?.nome_exibicao || "Corretora"} | SeguroCRM`,
  };
}

export default async function Home({ params }: PageProps) {
  const { slug } = await params;
  
  // 1) Busca dados das tabelas tab_configuracoes_site e tab_corretora_config
  const { data: config, corretora } = await fetchSiteConfig(slug);

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Site não encontrado</h1>
          <p className="text-gray-500">Verifique o status no CRM.</p>
        </div>
      </div>
    );
  }

  // 2) Busca Portfólio (tab_corretora_portfolio -> base_produtos)
  const { data: portfolio } = await fetchCorretoraPortfolio(config.corretora_id) as { data: any[] };
  console.log("CONTEUDO DO PORTFOLIO:", JSON.stringify(portfolio?.[0], null, 2));

  /**
   * TRATAMENTO DE UNICIDADE BLINDADO:
   * Remove espaços duplos, caracteres invisíveis (\u00A0) e normaliza o texto.
   */
  const nomesUnicos = Array.from(
    new Set(
      portfolio?.map((item: any) => {
        const nomeOriginal = item.base_produtos?.nome || "";
        return nomeOriginal
          .replace(/[\u00A0\u1680\u180e\u2000-\u2009\u200a\u200b\u202f\u205f\u3000]/g, " ") // Remove espaços especiais
          .trim()
          .replace(/\s+/g, " ") // Transforma múltiplos espaços em um só
          .toUpperCase();
      }).filter(Boolean)
    )
  ) as string[];

  const nomesDosProdutos = nomesUnicos;

  // Criamos os objetos para o Grid, garantindo IDs consistentes
  const produtosFormatados = nomesUnicos.map((nome, index) => {
    // Busca o item original no portfólio para extrair o ID e a DESCRIÇÃO
    const itemOriginal = portfolio?.find(
      (p: any) => p.base_produtos?.nome?.trim().toUpperCase() === nome
    );
    
    return {
      id: (itemOriginal as any)?.base_produtos?.id || `prod-${index}`,
      nome: nome,
      // Puxa a descrição dinâmica que você adicionou na tabela base_produtos
      descricao: (itemOriginal as any)?.base_produtos?.descricao 
    };
  });

  // ... (dentro do componente Home, após nomesUnicos)

/**
 * EXTRAÇÃO DE SEGURADORAS ÚNICAS:
 * Mapeia o portfólio para pegar as logos e nomes das seguradoras parceiras sem repetição.
 */
const seguradorasUnicas = Array.from(
  new Map(
    portfolio
      ?.filter((item: any) => item.base_seguradoras?.logo_url) // Apenas as que têm logo
      .map((item: any) => [
        item.base_seguradoras.id,
        {
          id: item.base_seguradoras.id,
          nome: item.base_seguradoras.nome,
          logo_url: item.base_seguradoras.logo_url
        }
      ])
  ).values()
);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* NAVBAR: Passando a lista de nomes únicos corrigida */}
      <Navbar 
        cor={config.cor_primaria}
        nome_exibicao={config.nome_exibicao}
        logo_url={config.logo_url}
        produtos={nomesDosProdutos} 
        contatos={{
          instagram: corretora?.instagram,
          facebook: corretora?.facebook,
          whatsapp_comercial: corretora?.whatsapp_comercial,
          email_corporativo: corretora?.email_corporativo,
          logotipo_url: corretora?.logotipo_url
        }}
      />

      <main>
        {/* HERO */}
        <Hero 
          nome={config.nome_exibicao} 
          cor={config.cor_primaria} 
          slides={config.hero_slides || []} 
        />
        
        {/* SOBRE */}
        <About 
          cor={config.cor_primaria} 
          conteudo={config.sobre_conteudo} 
        />

        {/* NOVO: CARROSSEL DE PARCEIROS (SEGURADORAS) */}
        {seguradorasUnicas.length > 0 && (
          <PartnersCarousel 
            cor={config.cor_primaria}
            nomeCorretora={config.nome_exibicao}
            seguradoras={seguradorasUnicas}
          />
        )}

        {/* DIFERENCIAIS */}
        <Diferenciais 
          cor={config.cor_primaria} 
          dados={config.diferenciais || {}} 
        />

        {/* SEGUROS (Grid de Soluções Únicas) */}
        <section id="seguros" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-3xl font-black text-center mb-12 uppercase tracking-tighter">
              <span style={{ color: config.cor_primaria }}>Nossas Soluções</span>
            </h2>
            <ProductsGrid produtos={produtosFormatados} />
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section id="depoimentos" className="py-20 bg-white">
          {config.depoimentos && config.depoimentos.length > 0 && (
            <TestimonialsCarousel 
              cor={config.cor_primaria} 
              depoimentos={config.depoimentos} 
            />
          )}
        </section>

        {/* CONTATO E LOCALIZAÇÃO */}
        <section id="contato" className="py-20 bg-gray-50 border-t border-gray-100">
          <Contact 
            cor={config.cor_primaria}
            corretora={corretora}
            produtos={nomesDosProdutos} 
          />
        </section>
        {/* AGENTE SDR */}
        <ChatSDR 
          corretoraId={corretora.id} 
          corPrimaria={config.cor_primaria} 
          nomeCorretora={corretora.nome_fantasia} 
        />  
      </main>

      <Footer 
        cor={config.cor_primaria}
        config={config}
        corretora={corretora}
      />
    </div>
  );
}