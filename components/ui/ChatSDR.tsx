"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, Building2, CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import { supabase, fetchCorretoraPortfolio } from "@/lib/supabase";

// --- UTILITÁRIOS DE MÁSCARA E VALIDAÇÃO ---
const maskPhone = (value: string) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 10) {
    return numbers.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return numbers.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};

const maskCPF = (value: string) => value.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");

const maskCNPJ = (value: string) => value.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1.$2").replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3").replace(/\.(\d{3})(\d)/, ".$1/$2").replace(/(\d{4})(\d)/, "$1-$2");

const maskCEP = (value: string) => value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").substring(0, 9);

const validarCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  let add = 0;
  for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
  let rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;
  add = 0;
  for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(cpf.charAt(10));
};

// --- FUNÇÕES DE API ---
async function buscarCNPJ(cnpj: string) {
  const clean = cnpj.replace(/\D/g, "");
  const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${clean}`);
  if (!res.ok) throw new Error("CNPJ não encontrado");
  return res.json();
}

async function buscarCEP(cep: string) {
  const clean = cep.replace(/\D/g, "");
  const res = await fetch(`https://brasilapi.com.br/api/cep/v1/${clean}`);
  if (!res.ok) throw new Error("CEP não encontrado");
  return res.json();
}

interface ChatSDRProps {
  corretoraId: string;
  corPrimaria: string;
  nomeCorretora: string;
}

type Step = "NOME" | "WHATSAPP" | "TIPO" | "DOCUMENTO" | "CEP" | "INTERESSE" | "HUMANO" | "FINALIZADO";

export default function ChatSDR({ corretoraId, corPrimaria, nomeCorretora }: ChatSDRProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("NOME");
  const [tipoCliente, setTipoCliente] = useState<"PF" | "PJ" | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [whatsappComercial, setWhatsappComercial] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  // Carregar Portfólio e Configuração (WhatsApp) da corretora
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Carregar Portfólio
        const { data: portData } = await fetchCorretoraPortfolio(corretoraId);
        if (portData) {
          const uniqueProducts = Array.from(new Set(portData.map((item: any) => item.base_produtos?.nome)))
            .map(nome => portData.find((item: any) => item.base_produtos?.nome === nome));
          setPortfolio(uniqueProducts);
        }

        // 2. Carregar WhatsApp Comercial (Ajustado filtro de corretora_id para id)
        const { data: configData } = await supabase
          .from("tab_corretora_config")
          .select("whatsapp_comercial")
          .eq("id", corretoraId) // Aqui mudamos para 'id' conforme seu SQL
          .maybeSingle();
        
        if (configData?.whatsapp_comercial) {
          setWhatsappComercial(configData.whatsapp_comercial);
        }
      } catch (err) {
        console.error("Erro ao carregar dados iniciais:", err);
      }
    }
    if (corretoraId) loadData();
  }, [corretoraId]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(`Olá! Sou o assistente virtual da ${nomeCorretora}. Para começar, como posso te chamar?`);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addBotMessage = (text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text }]);
      setIsTyping(false);
    }, 800);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (step === "WHATSAPP") val = maskPhone(val);
    if (step === "CEP") val = maskCEP(val);
    if (step === "DOCUMENTO") {
      val = tipoCliente === "PF" ? maskCPF(val) : maskCNPJ(val);
    }
    setInput(val);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");

    if (step === "NOME") {
      const { data, error } = await supabase.from("tab_leads_site").insert({
        corretora_id: corretoraId,
        corretor_id: corretoraId,
        nome: userText,
        status_processo: "rascunho"
      }).select().single();

      if (!error && data) {
        setLeadId(data.id);
        setStep("WHATSAPP");
        addBotMessage(`Prazer, ${userText.split(" ")[0]}! Qual seu WhatsApp com DDD?`);
      }
    } 
    
    else if (step === "WHATSAPP") {
      await supabase.from("tab_leads_site").update({ whatsapp: userText }).eq("id", leadId);
      setStep("TIPO");
      addBotMessage("Ótimo! O seguro é para Você (Pessoa Física) ou para sua Empresa (Jurídica)?");
    }

    else if (step === "DOCUMENTO") {
      if (tipoCliente === "PF") {
        if (!validarCPF(userText)) {
          addBotMessage("Este CPF parece inválido. Poderia conferir?");
          return;
        }
        await supabase.from("tab_leads_site").update({ cpf_cnpj: userText }).eq("id", leadId);
        setStep("CEP");
        addBotMessage("Perfeito. Agora informe seu CEP para localizarmos sua região:");
      } else {
        setIsTyping(true);
        try {
          const empresa = await buscarCNPJ(userText);
          await supabase.from("tab_leads_site").update({ 
            cpf_cnpj: userText,
            dados_api_cnpj: empresa,
            nome: empresa.razao_social
          }).eq("id", leadId);
          addBotMessage(`Localizei: ${empresa.nome_fantasia || empresa.razao_social}.`);
          setStep("CEP");
          addBotMessage("Qual o CEP da empresa?");
        } catch {
          addBotMessage("Não encontrei esse CNPJ. Digite novamente:");
        } finally {
          setIsTyping(false);
        }
      }
    }

    else if (step === "CEP") {
      setIsTyping(true);
      try {
        const local = await buscarCEP(userText);
        await supabase.from("tab_leads_site").update({ 
          cep: userText, 
          dados_api_cep: local 
        }).eq("id", leadId);
        
        addBotMessage(`Confirmado: ${local.street}, ${local.city}/${local.state}.`);
        setStep("INTERESSE");
        addBotMessage("Qual seguro você tem interesse em cotar?");
      } catch {
        addBotMessage("CEP não encontrado. Digite apenas os números:");
      } finally {
        setIsTyping(false);
      }
    }
  };

  const handleSelectTipo = async (tipo: "PF" | "PJ") => {
    setTipoCliente(tipo);
    setMessages((prev) => [...prev, { role: "user", text: tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica" }]);
    await supabase.from("tab_leads_site").update({ tipo_cliente: tipo }).eq("id", leadId);
    setStep("DOCUMENTO");
    addBotMessage(tipo === "PF" ? "Certo. Informe seu CPF:" : "Qual o CNPJ da empresa?");
  };

  const handleSelectInteresse = async (produtoNome: string) => {
    setMessages((prev) => [...prev, { role: "user", text: produtoNome }]);
    // Compatibilidade com text[] (Array)
    await supabase.from("tab_leads_site").update({ seguros_interesse: [produtoNome] }).eq("id", leadId);
    setStep("HUMANO");
    addBotMessage("Já tenho tudo o que preciso! Gostaria de falar com um de nossos consultores agora pelo WhatsApp para finalizar sua cotação?");
  };

  const handleFinalizarChat = (falarComHumano: boolean) => {
    if (falarComHumano) {
      const historico = messages.map(m => `${m.role === 'bot' ? 'Assistente' : 'Cliente'}: ${m.text}`).join('\n');
      const msgZap = `Olá! Acabei de preencher os dados no site da ${nomeCorretora} e gostaria de falar com um consultor.\n\n*Resumo do Atendimento:*\n${historico}`;
      
      const foneFinal = (whatsappComercial || "5548999999999").replace(/\D/g, "");
      const urlZap = `https://wa.me/${foneFinal}?text=${encodeURIComponent(msgZap)}`;
      window.open(urlZap, "_blank");
    }
    setStep("FINALIZADO");
    addBotMessage("Solicitação enviada com sucesso! Em breve entraremos em contato.");
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} style={{ backgroundColor: corPrimaria }} className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl text-white hover:scale-110 transition-transform z-50 animate-bounce">
        <Send size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-85 h-[520px] bg-white rounded-3xl shadow-2xl flex flex-col z-50 border border-gray-100 overflow-hidden font-sans">
      <div style={{ backgroundColor: corPrimaria }} className="p-5 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30"><User size={20} /></div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm leading-tight">Consultor Virtual</span>
            <span className="text-[10px] opacity-90 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online agora
            </span>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform text-2xl">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f4f7f9]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start animate-in slide-in-from-bottom-2 duration-300"}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] shadow-sm leading-relaxed ${
              m.role === "user" 
                ? "bg-[#dcf8c6] text-slate-900 rounded-tr-none" 
                : "bg-white text-slate-800 rounded-tl-none border border-gray-100"
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-3 py-2 rounded-lg shadow-sm text-[10px] text-gray-400 flex items-center gap-2">
              <Loader2 size={12} className="animate-spin" /> Digitando...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        {step === "TIPO" ? (
          <div className="flex gap-2 animate-in zoom-in-95 duration-200">
            <button onClick={() => handleSelectTipo("PF")} style={{ borderColor: corPrimaria, color: corPrimaria }} className="flex-1 py-3 border-2 rounded-xl text-xs font-bold hover:bg-opacity-10 transition-all active:scale-95" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = corPrimaria; e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = corPrimaria; }}><User size={14} /> Pessoa Física</button>
            <button onClick={() => handleSelectTipo("PJ")} style={{ borderColor: corPrimaria, color: corPrimaria }} className="flex-1 py-3 border-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95" onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = corPrimaria; e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = corPrimaria; }}><Building2 size={14} /> Empresa</button>
          </div>
        ) : step === "INTERESSE" ? (
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 animate-in fade-in slide-in-from-bottom-2">
            {portfolio.map((item, idx) => (
              <button key={idx} onClick={() => handleSelectInteresse(item.base_produtos?.nome)} style={{ borderColor: corPrimaria, color: corPrimaria }} className="py-2.5 px-2 border rounded-xl text-[10px] font-bold hover:bg-opacity-5 transition-all text-center leading-tight">
                {item.base_produtos?.nome}
              </button>
            ))}
          </div>
        ) : step === "HUMANO" ? (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
            <button onClick={() => handleFinalizarChat(true)} style={{ backgroundColor: corPrimaria }} className="w-full py-4 rounded-2xl text-white text-xs font-bold shadow-xl flex items-center justify-center gap-2 hover:brightness-110 transition-all active:scale-95"><MessageSquare size={18} /> FALAR COM UM HUMANO AGORA</button>
            <button onClick={() => handleFinalizarChat(false)} className="text-[10px] text-gray-400 font-medium py-1">Apenas enviar meus dados</button>
          </div>
        ) : step === "FINALIZADO" ? (
          <div className="text-center py-2 text-green-600 font-bold text-sm flex items-center justify-center gap-2 animate-in zoom-in"><CheckCircle2 size={20} /> Solicitação Finalizada!</div>
        ) : (
          <div className="flex gap-2">
            <input type="text" value={input} onChange={handleInputChange} onKeyPress={(e) => e.key === "Enter" && handleSend()} placeholder="Digite aqui..." className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-sm text-gray-900 focus:ring-2 outline-none transition-all" style={{ "--tw-ring-color": corPrimaria } as any}/>
            <button onClick={handleSend} style={{ backgroundColor: corPrimaria }} className="p-3 rounded-full text-white shadow-lg active:scale-90 transition-all"><Send size={20} /></button>
          </div>
        )}
      </div>
    </div>
  );
}