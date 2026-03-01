"use client";

import { useState, useEffect, useRef } from "react";
import { SendHorizontal, User, Building2, CheckCircle2, Loader2, MessageSquare, CheckCheck } from "lucide-react";
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

type Step = "NOME" | "WHATSAPP" | "EMAIL" | "TIPO" | "DOCUMENTO" | "CEP" | "INTERESSE" | "HUMANO" | "FINALIZADO";

export default function ChatSDR({ corretoraId, corPrimaria, nomeCorretora }: ChatSDRProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>("NOME");
  const [tipoCliente, setTipoCliente] = useState<"PF" | "PJ" | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string; time: string }[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [whatsappComercial, setWhatsappComercial] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const escutarAbertura = () => setIsOpen(true);
    
    // Adiciona o ouvinte do evento customizado
    window.addEventListener("abrirChatSDR", escutarAbertura);
    
    return () => {
        window.removeEventListener("abrirChatSDR", escutarAbertura);
    };
    }, []);


  // Carregar Portfólio e Configuração (WhatsApp) da corretora
  useEffect(() => {
    async function loadData() {
      try {
        const { data: portData } = await fetchCorretoraPortfolio(corretoraId);
        if (portData) {
          const uniqueProducts = Array.from(new Set(portData.map((item: any) => item.base_produtos?.nome)))
            .map(nome => portData.find((item: any) => item.base_produtos?.nome === nome));
          setPortfolio(uniqueProducts);
        }

        const { data: configData } = await supabase
          .from("tab_corretora_config")
          .select("whatsapp_comercial")
          .eq("id", corretoraId)
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
      setMessages((prev) => [...prev, { 
        role: "bot", 
        text, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
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
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages((prev) => [...prev, { role: "user", text: userText, time: now }]);
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
      setStep("EMAIL");
      addBotMessage("Perfeito. E qual seria o seu e-mail para enviarmos as informações da cotação?");
    }

    else if (step === "EMAIL") {
      await supabase.from("tab_leads_site").update({ email: userText }).eq("id", leadId);
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
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTipoCliente(tipo);
    setMessages((prev) => [...prev, { role: "user", text: tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica", time: now }]);
    await supabase.from("tab_leads_site").update({ tipo_cliente: tipo }).eq("id", leadId);
    setStep("DOCUMENTO");
    addBotMessage(tipo === "PF" ? "Certo. Informe seu CPF:" : "Qual o CNPJ da empresa?");
  };

  const handleSelectInteresse = async (produtoNome: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { role: "user", text: produtoNome, time: now }]);
    
    // LOG DE SEGURANÇA: Vamos ver se o ID existe antes de tentar o update
    console.log("Tentando qualificar o Lead ID:", leadId);

    if (!leadId) {
      console.error("Erro: Não encontrei o ID do lead para atualizar.");
      return;
    }

    // DISPARO PARA O BANCO
    const { error } = await supabase.from("tab_leads_site").update({ 
      seguros_interesse: [produtoNome],
      status_processo: "qualificado" 
    }).eq("id", leadId);

    if (error) {
      console.error("Erro ao atualizar status no Supabase:", error);
    } else {
      console.log("Lead qualificado com sucesso no banco!");
      // SÓ AVANÇA O CHAT SE O BANCO DER OK
      setStep("HUMANO");
      addBotMessage("Já tenho tudo o que preciso para sua pré-cotação! Gostaria de falar com um de nossos consultores agora pelo WhatsApp para finalizar?");
    }
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
      <button onClick={() => setIsOpen(true)} style={{ backgroundColor: "#25D366" }} className="fixed bottom-6 right-6 p-4 rounded-full shadow-2xl text-white hover:scale-110 transition-transform z-50 animate-bounce">
        <SendHorizontal size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[360px] h-[580px] bg-[#e5ddd5] rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-300 overflow-hidden font-sans">
      
      {/* HEADER ESTILO WHATSAPP */}
      <div className="bg-[#075e54] p-3 text-white flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border border-white/20 overflow-hidden">
            <User size={24} className="text-gray-500" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-bold text-sm leading-tight">{nomeCorretora}</span>
            <span className="text-[11px] text-green-300">online agora</span>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-2 rounded-full transition-colors">✕</button>
      </div>

      {/* ÁREA DE MENSAGENS COM FUNDO DO WHATSAPP */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 relative"
        style={{ 
          backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
          backgroundSize: '400px'
        }}
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`relative max-w-[85%] p-2 px-3 rounded-lg text-[13.5px] shadow-sm ${
              m.role === "user" 
                ? "bg-[#dcf8c6] text-slate-900 rounded-tr-none" 
                : "bg-white text-slate-800 rounded-tl-none border border-gray-100"
            }`}>
              
              {/* Cauda do balão */}
              <div className={`absolute top-0 w-3 h-3 ${
                m.role === "user" 
                ? "-right-2 bg-[#dcf8c6] [clip-path:polygon(0_0,0_100%,100%_0)]" 
                : "-left-2 bg-white [clip-path:polygon(0_0,100%_100%,100%_0)]"
              }`} />

              <div className="pr-12">{m.text}</div>
              
              <div className="absolute bottom-1 right-1.5 flex items-center gap-1 text-[10px] text-gray-400">
                {m.time}
                {m.role === "user" && <CheckCheck size={14} className="text-blue-500" />}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm text-[11px] text-gray-500 italic">
              digitando...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* RODAPÉ E INTERAÇÕES */}
      <div className="p-3 bg-[#f0f0f0] border-t border-gray-200">
        {step === "TIPO" ? (
            <div className="flex gap-2 animate-in zoom-in-95 duration-200 p-1">
                <button 
                onClick={() => handleSelectTipo("PF")} 
                className="flex-1 py-3 bg-white border border-gray-300 rounded-xl text-xs font-bold hover:bg-gray-50 shadow-sm active:scale-95 transition-all text-gray-800" // <-- ADICIONADO text-gray-800
                >
                <User size={14} className="inline mr-1" /> Pessoa Física
                </button>
                <button 
                onClick={() => handleSelectTipo("PJ")} 
                className="flex-1 py-3 bg-white border border-gray-300 rounded-xl text-xs font-bold hover:bg-gray-50 shadow-sm active:scale-95 transition-all text-gray-800" // <-- ADICIONADO text-gray-800
                >
                <Building2 size={14} className="inline mr-1" /> Empresa
                </button>
            </div>
            ) : step === "INTERESSE" ? (
            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 animate-in fade-in slide-in-from-bottom-2">
                {portfolio.map((item, idx) => (
                <button 
                    key={idx} 
                    onClick={() => handleSelectInteresse(item.base_produtos?.nome)} 
                    className="py-2.5 px-2 bg-white border border-gray-300 rounded-xl text-[11px] font-bold hover:bg-gray-50 shadow-sm transition-all text-center leading-tight text-gray-800" // <-- ADICIONE TAMBÉM AQUI para os produtos
                >
                    {item.base_produtos?.nome}
                </button>
                ))}
            </div>
        ) : step === "HUMANO" ? (
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 p-1">
            <button onClick={() => handleFinalizarChat(true)} className="w-full py-3.5 bg-[#25d366] rounded-xl text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 hover:brightness-105 transition-all active:scale-95">
              <MessageSquare size={18} /> FALAR COM UM HUMANO AGORA
            </button>
            <button onClick={() => handleFinalizarChat(false)} className="text-[10px] text-gray-500 font-medium py-1 text-center underline">Apenas enviar meus dados</button>
          </div>
        ) : step === "FINALIZADO" ? (
          <div className="text-center py-4 text-green-700 font-bold text-sm flex items-center justify-center gap-2 animate-in zoom-in bg-white rounded-xl shadow-inner">
            <CheckCircle2 size={20} /> Solicitação Finalizada!
          </div>
        ) : (
          <div className="flex gap-2 items-center bg-white rounded-full px-4 py-1 border border-gray-200 shadow-sm">
            <input 
              type="text" 
              value={input} 
              onChange={handleInputChange} 
              onKeyPress={(e) => e.key === "Enter" && handleSend()} 
              placeholder="Mensagem" 
              className="flex-1 bg-transparent py-2.5 text-[14px] text-gray-900 outline-none"
            />
            <button onClick={handleSend} className="text-[#25D366] p-1 active:scale-90 transition-all">
              <SendHorizontal size={22} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}