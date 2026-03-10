// src/app/site/[host]/page.tsx
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
  params: Promise<{ host: string }>;
}

/**
 * METADATA DINÂMICA
 * Ajustada para buscar pelo host (domínio ou subdomínio)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { host } = await params;
  // A função fetchSiteConfig agora deve estar preparada para lidar com o host completo
  const { data: config } = await fetchSiteConfig(host);
  
  return {
    title: `${config?.nome_exibicao || "Corretora"} | SeguroCRM`,
  };
}

export default async function Home({ params }: PageProps) {
  const { host } = await params;
  
  /**
   * 1) BUSCA DE CONFIGURAÇÃO
   * O 'host' pode ser 'imbisegcorretora.com.br' ou 'corretora-imbiseg.segurocrm.com.br'
   * A fetchSiteConfig deve ser atualizada para buscar no Supabase usando:
   * .or(`dominio.eq.${host},slug.eq.${host.replace('.segurocrm.com.br', '')}`)
   */
  const { data: config, corretora } = await fetchSiteConfig(host);

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Site não encontrado</h1>
          <p className="text-gray-500">O domínio {host} não está vinculado a nenhuma corretora ativa.</p>
        </div>
      </div>
    );
  }

  // 2) Busca Portfólio
  const { data: portfolio } = await fetchCorretoraPortfolio(config.corretora_id) as { data: any[] };

  /**
   * TRATAMENTO DE PRODUTOS ÚNICOS
   */
  const nomesUnicos = Array.from(
    new Set(
      portfolio?.map((item: any) => {
        const nomeOriginal = item.base_produtos?.nome || "";
        return nomeOriginal
          .replace(/[\u00A0\u1680\u180e\u2000-\u2009\u200a\u200b\u202f\u205f\u3000]/g, " ")
          .trim()
          .replace(/\s+/g, " ")
          .toUpperCase();
      }).filter(Boolean)
    )
  ) as string[];

  const produtosFormatados = nomesUnicos.map((nome, index) => {
    const itemOriginal = portfolio?.find(
      (p: any) => p.base_produtos?.nome?.trim().toUpperCase() === nome
    );
    
    return {
      id: (itemOriginal as any)?.base_produtos?.id || `prod-${index}`,
      nome: nome,
      descricao: (itemOriginal as any)?.base_produtos?.descricao 
    };
  });

  /**
   * EXTRAÇÃO DE SEGURADORAS ÚNICAS
   */
  const seguradorasUnicas = Array.from(
    new Map(
      portfolio
        ?.filter((item: any) => item.base_seguradoras?.logo_url)
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
      <Navbar 
        cor={config.cor_primaria}
        nome_exibicao={config.nome_exibicao}
        logo_url={config.logo_url}
        produtos={nomesUnicos} 
        contatos={{
          instagram: corretora?.instagram,
          facebook: corretora?.facebook,
          whatsapp_comercial: corretora?.whatsapp_comercial,
          email_corporativo: corretora?.email_corporativo,
          logotipo_url: corretora?.logotipo_url
        }}
      />

      <main>
        <Hero 
          nome={config.nome_exibicao} 
          cor={config.cor_primaria} 
          slides={config.hero_slides || []} 
        />
        
        <About 
          cor={config.cor_primaria} 
          conteudo={config.sobre_conteudo} 
        />

        {seguradorasUnicas.length > 0 && (
          <PartnersCarousel 
            cor={config.cor_primaria}
            nomeCorretora={config.nome_exibicao}
            seguradoras={seguradorasUnicas}
          />
        )}

        <Diferenciais 
          cor={config.cor_primaria} 
          dados={config.diferenciais || {}} 
        />

        <section id="seguros" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-8">
            <h2 className="text-3xl font-black text-center mb-12 uppercase tracking-tighter">
              <span style={{ color: config.cor_primaria }}>Nossas Soluções</span>
            </h2>
            <ProductsGrid 
              produtos={produtosFormatados} 
              corPrimaria={config.cor_primaria} 
            />
          </div>
        </section>

        <section id="depoimentos" className="py-20 bg-white">
          {config.depoimentos && config.depoimentos.length > 0 && (
            <TestimonialsCarousel 
              cor={config.cor_primaria} 
              depoimentos={config.depoimentos} 
            />
          )}
        </section>

        <section id="contato" className="py-20 bg-gray-50 border-t border-gray-100">
          <Contact 
            cor={config.cor_primaria}
            corretora={corretora}
            produtos={nomesUnicos} 
          />
        </section>

        <ChatSDR 
          corretoraId={corretora?.id} 
          corPrimaria={config.cor_primaria} 
          nomeCorretora={corretora?.nome_fantasia} 
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