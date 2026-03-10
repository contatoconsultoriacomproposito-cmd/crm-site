// src/lib/supabase.ts
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL ou Anon Key não configuradas no .env.local do site.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  global: {
    headers: {
      "X-Client-Info": "segurocrm-site-template",
      "apikey": supabaseAnonKey,
      "Authorization": `Bearer ${supabaseAnonKey}`,
    },
  },
})

export async function fetchSiteConfig(domainOrSlug: string) {
  // 1. Decodifica o host (ex: localhost%3A3000 -> localhost:3000)
  const decodedHost = decodeURIComponent(domainOrSlug);
  
  // 2. Extrai o slug se for subdomínio
  const cleanSlug = decodedHost.replace('.segurocrm.com.br', '');

  // 3. Busca a configuração do site
  const { data: config, error: configError } = await supabase
    .from("tab_configuracoes_site")
    .select("*")
    .or(`dominio.eq.${decodedHost},slug.eq.${cleanSlug}`)
    .eq("status_site", true)
    .maybeSingle();

  if (configError || !config) {
    console.error("❌ Erro ao buscar tab_configuracoes_site:", configError);
    return { data: null, corretora: null };
  }

  // 4. Busca os dados da corretora
  const { data: corretora, error: corrError } = await supabase
    .from("tab_corretora_config")
    .select("*")
    .eq("id", config.corretora_id)
    .maybeSingle();

  if (corrError) {
    console.error("❌ Erro ao buscar tab_corretora_config:", corrError);
  }

  return { 
    data: config, 
    corretora: corretora || null 
  };
}

/**
 * Busca o portfólio completo: Produtos e suas respectivas Seguradorass
 */
// No arquivo src/lib/supabase.ts, altere apenas a função fetchCorretoraPortfolio:

export async function fetchCorretoraPortfolio(corretoraId: string) {
  const { data, error } = await supabase
    .from("tab_corretora_portfolio")
    .select(`
      id,
      base_produtos (
        id,
        nome,
        descricao
      ),
      base_seguradoras (
        id,
        nome,
        logo_url
      )
    `)
    .eq("corretora_id", corretoraId);

  if (error) {
    console.error("❌ Erro na Query Portfolio:", error.message);
  }

  return { data, error };
}