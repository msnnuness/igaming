import React, { useState, useEffect, useRef } from "react";

/* ============================================================================
   iGAMING TRAFFIC PRO — Landing Page
   ----------------------------------------------------------------------------
   TUDO QUE VOCÊ PRECISA EDITAR ESTÁ NO OBJETO `CONFIG` ABAIXO.
   Preço, checkout, textos do instrutor, links legais e respostas
   configuráveis do FAQ ficam todos aqui.
   ========================================================================== */

const CONFIG = {
  /* URL única usada por TODOS os CTAs da página.
     Troque apenas aqui quando tiver o link do checkout. */
  checkoutUrl: "#checkout",

  brand: {
    name1: "iGAMING",
    name2: "TRAFFIC PRO",
    full: "iGaming Traffic Pro",
  },

  /* Headline do hero. Cada item é uma linha; `accent: true` pinta de verde neon.
     A ordem define a cascata da animação de entrada.
     Variantes testadas (troque o array inteiro para fazer teste A/B):
       A) "SEU CPA ESTÁ ÓTIMO." / "E SEU CPA FTD?"
       B) "O META ENTREGA CADASTRO." / "QUEM PAGA A CONTA É O FTD."   <- em uso
       C) "PARE DE OTIMIZAR PARA CADASTRO." / "COMECE A OTIMIZAR PARA FTD." */
  headline: [
    { text: "O META ENTREGA CADASTRO." },
    { text: "QUEM PAGA A CONTA É O FTD.", accent: true },
  ],

  price: {
    anchor: "R$197",
    current: "R$67",
    stackTotal: "R$502",
    bonusTotal: "R$305",
  },

  /* SEO / Open Graph — usado pelo bloco <Head> comentado no final do arquivo */
  seo: {
    title: "iGaming Traffic Pro — Tráfego pago e performance para iGaming",
    description:
      "Treinamento para gestores de tráfego: Meta Ads, tracking, CAPI, Keitaro, postbacks e métricas de iGaming. Do primeiro clique ao FTD.",
    url: "",       // ex: https://seudominio.com
    ogImage: "",   // ex: https://seudominio.com/og.jpg (1200x630)
  },

  /* Nada de ID fictício. Preencha quando for instalar. */
  tracking: {
    gtmId: "",        // ex: "GTM-XXXXXXX"
    metaPixelId: "",  // ex: "1234567890"
  },

  /* Seção do instrutor — placeholders editáveis, sem inventar resultado nenhum */
  instructor: {
    /* Arquivos em /public. WebP é servido primeiro; JPG é o fallback.
       Para trocar a foto, substitua os dois arquivos mantendo os nomes.
       Deixe `photo` vazio para voltar ao placeholder. */
    photo: "/instrutor.jpeg",
    photoWebp: "",                   // opcional: se subir /instrutor.webp, preencha aqui
    photoAlt: "",                    // vazio = usa "Foto de {name}"
    name: "MATHEUS NUNES",
    role: "Paid Media Specialist",
    handle: "@_nunesads",
    handleUrl: "https://instagram.com/_nunesads",
    bio:
      "Trabalho com mídia paga para operações de iGaming no Brasil — do primeiro clique ao FTD. " +
      "No dia a dia é campanha no Meta e no Google, estrutura de tracking, atribuição e leitura de funil.",
    /* Áreas de atuação. Substitui a lista de cases: demonstra domínio técnico
       sem expor nome de cliente, o que costuma esbarrar em contrato e compliance.
       Não têm ordem — por isso não são numeradas. */
    areas: [
      "Aquisição paga para iGaming no Meta e no Google",
      "Tracking server-side: Pixel, CAPI, GTM e postbacks",
      "Keitaro: atribuição, roteamento e testes de tráfego",
    ],
  },

  /* Respostas que você pediu para deixar configuráveis */
  faqConfig: {
    accessPeriod: "[DEFINIR PERÍODO DE ACESSO]",
    certificate: "[DEFINIR SE HÁ CERTIFICADO]",
  },

  legal: {
    terms: "#",
    privacy: "#",
    support: "#",
    year: "2026",
  },
};

/* ========================================================================== */
/* DESIGN TOKENS + CSS                                                        */
/* ========================================================================== */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');

.itp {
  --bg:#080A0F;
  --card:#11151D;
  --card2:#161B25;
  --neon:#8CFF3D;
  --green:#5EDB25;
  --white:#FFFFFF;
  --gray:#9CA3AF;
  --line:rgba(255,255,255,0.08);
  --line-strong:rgba(255,255,255,0.14);

  background:var(--bg);
  color:var(--white);
  font-family:'Manrope','Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;
  -webkit-font-smoothing:antialiased;
  text-rendering:optimizeLegibility;
  min-height:100vh;
  overflow-x:clip;
  max-width:100vw;
  position:relative;
  -webkit-tap-highlight-color:transparent;
  -webkit-text-size-adjust:100%;
}
.itp *,.itp *::before,.itp *::after{box-sizing:border-box;}
/* âncoras não ficam escondidas atrás do header sticky */
.itp section[id],.itp [id^="mod-"],.itp [id^="faq-"]{scroll-margin-top:78px;}
.itp p,.itp h1,.itp h2,.itp h3,.itp h4,.itp ul,.itp li,.itp figure{margin:0;padding:0;}
.itp ul{list-style:none;}
.itp a{color:inherit;text-decoration:none;}
.itp button{font:inherit;color:inherit;background:none;border:none;cursor:pointer;}
.itp :focus-visible{outline:2px solid var(--neon);outline-offset:3px;border-radius:6px;}

/* ---------- layout ---------- */
.itp-wrap{width:100%;max-width:1180px;margin:0 auto;padding-left:18px;padding-right:18px;}
@media (min-width:430px){.itp-wrap{padding-left:22px;padding-right:22px;}}
.itp-sec{padding-top:56px;padding-bottom:56px;position:relative;}
@media (min-width:600px){.itp-sec{padding-top:76px;padding-bottom:76px;}}
@media (min-width:900px){.itp-sec{padding-top:104px;padding-bottom:104px;}}
.itp-sec--tight{padding-top:48px;padding-bottom:48px;}
.itp-hero{padding-top:26px;padding-bottom:44px;}
@media (min-width:600px){.itp-hero{padding-top:40px;padding-bottom:60px;}}

/* ---------- tipografia ---------- */
.itp-mono{font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;}
.itp-eyebrow{
  font-family:'JetBrains Mono',ui-monospace,monospace;
  font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--neon);
  display:inline-flex;align-items:center;gap:8px;
}
.itp-eyebrow::before{content:"";width:14px;height:1px;background:var(--neon);opacity:.7;}
.itp-h1{font-size:clamp(29px,8.2vw,60px);font-weight:800;line-height:1.05;letter-spacing:-.03em;text-wrap:balance;}
.itp-h2{font-size:clamp(24px,6.2vw,44px);font-weight:800;line-height:1.1;letter-spacing:-.025em;text-wrap:balance;}
.itp-h3{font-size:clamp(16px,4.2vw,20px);font-weight:700;line-height:1.28;letter-spacing:-.01em;}
.itp-lead{color:var(--gray);font-size:clamp(15px,4vw,18px);line-height:1.6;text-wrap:pretty;}
.itp-small{color:var(--gray);font-size:13.5px;line-height:1.6;text-wrap:pretty;}
@media (min-width:600px){.itp-h1,.itp-h2{line-height:1.04;}}
.itp-neon{color:var(--neon);}
.itp-gray{color:var(--gray);}

/* ---------- cards ---------- */
.itp-card{
  background:var(--card);border:1px solid var(--line);border-radius:16px;
  transition:transform .35s cubic-bezier(.2,.7,.3,1),border-color .35s,background .35s;
}
.itp-card--alt{background:var(--card2);}
@media (hover:hover) and (pointer:fine){
  .itp-card--hover:hover{transform:translateY(-3px);border-color:var(--line-strong);}
}
/* no touch, o feedback vem do toque e não do hover */
@media (hover:none){
  .itp-card--hover:active{transform:scale(.992);border-color:var(--line-strong);}
  .itp-btn:active{transform:scale(.98);}
  .itp-acc-head:active{background:rgba(255,255,255,.02);}
}
.itp-card--neon{border-color:rgba(140,255,61,.32);background:linear-gradient(180deg,rgba(140,255,61,.05),transparent 55%),var(--card);}

/* ---------- badges ---------- */
.itp-badge{
  display:inline-flex;align-items:center;gap:8px;
  border:1px solid var(--line-strong);background:rgba(255,255,255,.03);
  border-radius:100px;padding:7px 14px;
  font-family:'JetBrains Mono',ui-monospace,monospace;
  font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--gray);
}
.itp-badge--neon{border-color:rgba(140,255,61,.35);color:var(--neon);background:rgba(140,255,61,.06);}
.itp-dot{width:6px;height:6px;border-radius:50%;background:var(--neon);box-shadow:0 0 8px var(--neon);animation:itp-blink 2.4s ease-in-out infinite;}

/* ---------- botões ---------- */
.itp-btn{
  position:relative;overflow:hidden;isolation:isolate;
  display:inline-flex;align-items:center;justify-content:center;gap:10px;
  border-radius:12px;font-weight:800;letter-spacing:-.01em;text-align:center;
  transition:transform .2s ease,box-shadow .3s ease,background .3s ease,border-color .3s ease;
  cursor:pointer;
}
/* seta avança: microinteração que confirma a direção da ação */
.itp-btn > span:last-child{transition:transform .28s cubic-bezier(.2,.7,.3,1);will-change:transform;}
@media (hover:hover) and (pointer:fine){.itp-btn:hover > span:last-child{transform:translateX(4px);}}
/* varredura de brilho no CTA principal — lenta, quase subliminar */
.itp-btn--primary::before{
  content:"";position:absolute;top:0;left:0;width:34%;height:100%;z-index:1;pointer-events:none;
  background:linear-gradient(100deg,transparent,rgba(255,255,255,.42),transparent);
  transform:translateX(-180%) skewX(-18deg);
  animation:itp-sweep 6s cubic-bezier(.4,0,.2,1) 1.6s infinite;
}
.itp-btn--primary{
  background:linear-gradient(180deg,var(--neon),var(--green));
  color:#07220B;box-shadow:0 0 0 1px rgba(140,255,61,.35),0 10px 34px -14px rgba(140,255,61,.75);
}
@media (hover:hover) and (pointer:fine){
  .itp-btn--primary:hover{transform:translateY(-2px);box-shadow:0 0 0 1px rgba(140,255,61,.55),0 16px 44px -14px rgba(140,255,61,.9);}
  .itp-btn--outline:hover{border-color:rgba(140,255,61,.5);color:var(--neon);}
}
.itp-btn--outline{border:1px solid var(--line-strong);background:rgba(255,255,255,.02);color:var(--white);}
/* mobile: alvo de toque ≥48px, texto que quebra bem em 375px */
.itp-btn--lg{padding:16px 18px;font-size:14.5px;line-height:1.25;min-height:52px;text-wrap:balance;}
.itp-btn--md{padding:13px 18px;font-size:13.5px;min-height:46px;}
.itp-btn--sm{padding:11px 15px;font-size:12.5px;min-height:42px;}
.itp-btn--block{display:flex;width:100%;}
@media (min-width:390px){.itp-btn--lg{font-size:15px;padding:17px 22px;}}
@media (min-width:520px){.itp-btn--lg{font-size:16.5px;padding:19px 34px;}}

/* ---------- header ---------- */
.itp-header{position:sticky;top:0;z-index:60;transition:background .3s,border-color .3s,backdrop-filter .3s,box-shadow .4s;border-bottom:1px solid transparent;}
.itp-header.is-stuck{background:rgba(8,10,15,.82);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-bottom-color:var(--line);box-shadow:0 18px 40px -34px rgba(0,0,0,.9);}
/* progresso de leitura — linguagem de dashboard, não de barra de carregamento */
.itp-progress{position:absolute;left:0;bottom:-1px;height:2px;width:100%;transform-origin:0 50%;background:linear-gradient(90deg,var(--green),var(--neon));opacity:0;transition:opacity .4s;box-shadow:0 0 12px rgba(140,255,61,.55);}
.itp-header.is-stuck .itp-progress{opacity:1;}
.itp-headbar{height:60px;transition:height .35s cubic-bezier(.2,.7,.3,1);}
.itp-header.is-stuck .itp-headbar{height:54px;}
@media (min-width:600px){.itp-headbar{height:70px;}.itp-header.is-stuck .itp-headbar{height:60px;}}
.itp-logo{font-weight:800;font-size:13px;letter-spacing:.02em;line-height:1.06;}
@media (min-width:600px){.itp-logo{font-size:14px;}}
.itp-nav a{font-size:13.5px;color:var(--gray);transition:color .2s;position:relative;}
.itp-nav a:hover{color:var(--white);}
.itp-nav a::after{content:"";position:absolute;left:0;bottom:-6px;height:1px;width:0;background:var(--neon);transition:width .25s;}
.itp-nav a:hover::after{width:100%;}
.itp-burger{width:42px;height:42px;border:1px solid var(--line);border-radius:11px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;background:rgba(255,255,255,.02);}
.itp-burger span{display:block;width:16px;height:1.5px;background:var(--white);transition:transform .28s,opacity .2s;}
.itp-burger.is-open span:nth-child(1){transform:translateY(5.5px) rotate(45deg);}
.itp-burger.is-open span:nth-child(2){opacity:0;}
.itp-burger.is-open span:nth-child(3){transform:translateY(-5.5px) rotate(-45deg);}
.itp-mobilemenu{overflow:hidden;display:grid;grid-template-rows:0fr;transition:grid-template-rows .35s cubic-bezier(.2,.7,.3,1);background:rgba(8,10,15,.97);backdrop-filter:blur(14px);border-bottom:1px solid transparent;}
.itp-mobilemenu.is-open{grid-template-rows:1fr;border-bottom-color:var(--line);}
.itp-mobilemenu > div{min-height:0;}

/* ---------- fundo/ambiente ---------- */
.itp-grid-bg{
  position:absolute;inset:0;pointer-events:none;
  background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);
  background-size:40px 40px;
  mask-image:radial-gradient(ellipse 90% 55% at 50% 0%,#000 20%,transparent 72%);
  -webkit-mask-image:radial-gradient(ellipse 90% 55% at 50% 0%,#000 20%,transparent 72%);
  opacity:.45;
}
@media (min-width:900px){.itp-grid-bg{background-size:56px 56px;opacity:.55;}}
.itp-glow{position:absolute;border-radius:50%;filter:blur(60px);pointer-events:none;opacity:.11;background:var(--neon);will-change:auto;}
@media (min-width:900px){.itp-glow{filter:blur(90px);opacity:.14;}}

/* ---------- dashboard do hero ---------- */
.itp-dash{background:var(--card);border:1px solid var(--line);border-radius:18px;overflow:hidden;box-shadow:0 40px 90px -50px rgba(0,0,0,.9);}
.itp-dash-bar{display:flex;align-items:center;gap:8px;padding:12px 14px;border-bottom:1px solid var(--line);background:rgba(255,255,255,.015);}
.itp-kpi{background:var(--card2);border:1px solid var(--line);border-radius:11px;padding:10px 11px;min-width:0;}
.itp-kpi-label{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--gray);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.itp-kpi-value{font-size:17px;font-weight:800;letter-spacing:-.025em;margin-top:5px;white-space:nowrap;}
@media (min-width:430px){.itp-kpi{padding:12px 13px;}.itp-kpi-value{font-size:19px;}.itp-kpi-label{font-size:9.5px;}}
@media (min-width:1024px){.itp-kpi-value{font-size:21px;}}
.itp-chip{font-family:'JetBrains Mono',monospace;font-size:9px;padding:3px 5px;border-radius:5px;background:rgba(140,255,61,.1);color:var(--neon);white-space:nowrap;flex:none;}
.itp-chip--muted{background:rgba(255,255,255,.05);color:var(--gray);}
/* mini-indicadores: 2x2 no celular, 4 colunas do 430 pra cima */
.itp-mini{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
@media (min-width:430px){.itp-mini{grid-template-columns:repeat(4,minmax(0,1fr));}}
/* float só no desktop — no mobile custa bateria e não agrega */
@media (min-width:900px){.itp-float{animation:itp-float 9s ease-in-out infinite;}}
.itp-spark{stroke-dasharray:1200;stroke-dashoffset:1200;animation:itp-draw 2.4s cubic-bezier(.3,.8,.3,1) .3s forwards;}

/* ---------- fluxo / pipeline (elemento assinatura) ---------- */
.itp-rail{position:relative;padding-left:34px;}
.itp-rail::before{content:"";position:absolute;left:11px;top:8px;bottom:8px;width:1px;background:linear-gradient(180deg,transparent,var(--line-strong) 8%,var(--line-strong) 92%,transparent);}
.itp-rail-pulse{position:absolute;left:8.5px;top:0;width:7px;height:7px;border-radius:50%;background:var(--neon);box-shadow:0 0 10px 2px rgba(140,255,61,.75);animation:itp-travel 4.2s linear infinite;}
.itp-node{position:relative;padding:14px 16px;border:1px solid var(--line);background:var(--card);border-radius:13px;transition:border-color .3s,transform .3s;}
.itp-node:hover{border-color:var(--line-strong);transform:translateX(2px);}
.itp-node--key{border-color:rgba(140,255,61,.4);background:linear-gradient(90deg,rgba(140,255,61,.07),transparent 70%),var(--card);box-shadow:0 0 34px -18px rgba(140,255,61,.9);}
.itp-node::before{content:"";position:absolute;left:-28px;top:50%;transform:translateY(-50%);width:9px;height:9px;border-radius:50%;background:var(--bg);border:1.5px solid var(--line-strong);}
.itp-node--key::before{border-color:var(--neon);background:var(--neon);box-shadow:0 0 10px rgba(140,255,61,.9);}
.itp-node::after{content:"";position:absolute;left:-24px;top:50%;width:14px;height:1px;background:var(--line-strong);}

/* ---------- cadeia horizontal (funil) ---------- */
.itp-chain{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:8px;}
.itp-chainitem{
  font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.1em;text-transform:uppercase;
  border:1px solid var(--line);background:var(--card2);border-radius:9px;padding:9px 13px;color:var(--gray);
}
.itp-chainitem--key{border-color:rgba(140,255,61,.45);color:var(--neon);background:rgba(140,255,61,.07);box-shadow:0 0 26px -14px rgba(140,255,61,.9);font-weight:700;}
.itp-arrow{color:rgba(255,255,255,.22);font-size:12px;}
/* no celular a cadeia vira um fluxo vertical: lê melhor que quebrar em linhas soltas */
@media (max-width:639px){
  .itp-chain{flex-direction:column;align-items:stretch;gap:0;}
  .itp-chainitem{width:100%;text-align:center;padding:11px 12px;font-size:11.5px;}
  .itp-arrow{display:block;text-align:center;padding:6px 0;font-size:13px;transform:rotate(90deg);}
}

/* ---------- accordion ---------- */
.itp-acc-panel{display:grid;grid-template-rows:0fr;transition:grid-template-rows .38s cubic-bezier(.2,.7,.3,1);}
.itp-acc-panel.is-open{grid-template-rows:1fr;}
.itp-acc-panel > div{min-height:0;overflow:hidden;}
.itp-acc-head{display:flex;align-items:flex-start;gap:11px;width:100%;text-align:left;padding:17px 15px;min-height:60px;transition:background .2s;}
@media (min-width:430px){.itp-acc-head{gap:14px;padding:18px 18px;}}
@media (min-width:768px){.itp-acc-head{padding:22px 24px;}}
.itp-plus{position:relative;width:18px;height:18px;flex:none;margin-top:3px;}
.itp-plus::before,.itp-plus::after{content:"";position:absolute;background:var(--gray);transition:transform .3s,background .3s;}
.itp-plus::before{left:0;top:8.25px;width:18px;height:1.5px;}
.itp-plus::after{left:8.25px;top:0;width:1.5px;height:18px;}
.itp-acc.is-open .itp-plus::after{transform:rotate(90deg);}
.itp-acc.is-open .itp-plus::before,.itp-acc.is-open .itp-plus::after{background:var(--neon);}
.itp-topic{display:flex;align-items:center;gap:9px;font-size:14px;color:var(--gray);padding:8px 0;line-height:1.35;}
.itp-topic i{width:4px;height:4px;border-radius:50%;background:var(--neon);opacity:.55;flex:none;}

/* ---------- listas de bônus / stack ---------- */
.itp-row{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:13px 0;border-bottom:1px dashed var(--line);}
.itp-row:last-child{border-bottom:none;}
.itp-strike{text-decoration:line-through;text-decoration-thickness:1.5px;color:var(--gray);}

/* ---------- barra mobile fixa ---------- */
.itp-stickybar{
  position:fixed;left:0;right:0;bottom:0;z-index:70;
  background:rgba(8,10,15,.94);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
  border-top:1px solid var(--line);
  padding:9px 14px calc(9px + env(safe-area-inset-bottom));
  display:flex;align-items:center;gap:10px;
  box-shadow:0 -14px 34px -20px rgba(0,0,0,.95);
  transform:translateY(110%);transition:transform .35s cubic-bezier(.2,.7,.3,1);
}
.itp-stickybar.is-visible{transform:translateY(0);}
@media (min-width:900px){.itp-stickybar{display:none;}}

/* ---------- reveal ---------- */
.itp-reveal{opacity:0;transform:translateY(18px);transition:opacity .6s cubic-bezier(.2,.7,.3,1),transform .6s cubic-bezier(.2,.7,.3,1),filter .6s;}
.itp-reveal.is-in,
.itp-reveal.is-in[data-anim]{opacity:1;transform:none;filter:none;}
.itp-reveal[data-anim="left"]{transform:translateX(-26px);}
.itp-reveal[data-anim="right"]{transform:translateX(26px);}
.itp-reveal[data-anim="scale"]{transform:scale(.965);}
@media (max-width:639px){
  /* deslocamento menor: em tela curta o reveal grande dá sensação de travamento */
  .itp-reveal{transform:translateY(12px);transition-duration:.45s;}
  .itp-reveal[data-anim="left"],.itp-reveal[data-anim="right"]{transform:translateY(12px);}
}

/* ---------- entrada orquestrada do hero ---------- */
.itp-line{display:block;overflow:hidden;}
.itp-line > span{
  display:block;
  transform:translateY(105%);
  animation:itp-lineUp .9s cubic-bezier(.16,.84,.34,1) both;
}
.itp-boot{animation:itp-riseIn .8s cubic-bezier(.2,.7,.3,1) both;}
.itp-page{animation:itp-fadeIn .6s ease-out both;}

/* ---------- stagger de listas ---------- */
.itp-acc.is-open .itp-topic{animation:itp-riseIn .45s cubic-bezier(.2,.7,.3,1) both;animation-delay:calc(var(--i,0) * 26ms);}
.itp-acc.is-open .itp-chain{animation:itp-riseIn .5s cubic-bezier(.2,.7,.3,1) 120ms both;}

/* ---------- barra de conversão animada ---------- */
.itp-bar{height:6px;border-radius:99px;background:rgba(255,255,255,.06);overflow:hidden;margin-top:10px;}
.itp-bar > i{display:block;height:100%;border-radius:99px;width:0;transition:width 1.3s cubic-bezier(.2,.7,.3,1) .15s;}

/* ---------- divisor que se desenha ---------- */
.itp-divider{height:1px;background:linear-gradient(90deg,transparent,var(--line-strong),transparent);transform:scaleX(.15);opacity:0;transition:transform 1.2s cubic-bezier(.2,.7,.3,1),opacity .7s;}
.itp-divider.is-in{transform:scaleX(1);opacity:1;}

/* ---------- áreas de atuação ---------- */
.itp-area{
  padding:14px 16px;display:flex;align-items:center;
  border-left:2px solid var(--neon);
  border-top-left-radius:4px;border-bottom-left-radius:4px;
  transition:border-color .3s,background .3s,transform .3s;
}
@media (hover:hover) and (pointer:fine){
  .itp-area:hover{background:rgba(140,255,61,.05);transform:translateX(2px);}
}

/* ---------- handle social ---------- */
.itp-handle{
  font-size:12px;letter-spacing:.06em;color:var(--gray);
  border:1px solid var(--line);border-radius:100px;padding:5px 11px;
  transition:color .25s,border-color .25s,background .25s;
}
@media (hover:hover) and (pointer:fine){
  .itp-handle:hover{color:var(--neon);border-color:rgba(140,255,61,.4);background:rgba(140,255,61,.06);}
}

/* ---------- brilho de topo nos cards (desktop) ---------- */
@media (hover:hover) and (pointer:fine){
  .itp-card--hover{position:relative;}
  .itp-card--hover::after{
    content:"";position:absolute;left:16%;right:16%;top:-1px;height:1px;pointer-events:none;
    background:linear-gradient(90deg,transparent,var(--neon),transparent);
    opacity:0;transition:opacity .4s ease;
  }
  .itp-card--hover:hover::after{opacity:.75;}
}

/* ---------- ajustes finos de mobile ---------- */
.itp-photo{aspect-ratio:1 / 1;}
@media (min-width:900px){.itp-photo{aspect-ratio:4 / 5;}}

@media (max-width:639px){
  .itp-rail{padding-left:28px;}
  .itp-rail::before{left:9px;}
  .itp-rail-pulse{left:6.5px;}
  .itp-node{padding:13px 14px;}
  .itp-node::before{left:-23px;}
  .itp-node::after{left:-19px;width:11px;}
  .itp-row{padding:12px 0;gap:10px;}
  .itp-badge{padding:6px 11px;font-size:10px;}
  .itp-dash{border-radius:15px;}
  .itp-eyebrow{font-size:10.5px;letter-spacing:.16em;}
  .itp-dash-bar{padding:11px 12px;}
}
@media (max-width:429px){
  /* em 375/390 o badge "dados ilustrativos" tem prioridade sobre o rótulo */
  .itp-dash-title{display:none;}
}
/* preço final: pulso de destaque quando o card entra em cena */
.itp-price{animation:itp-pop .7s cubic-bezier(.2,.7,.3,1) both;}

/* números grandes nunca podem estourar a viewport */
.itp-bignum{font-variant-numeric:tabular-nums;white-space:nowrap;}

/* ---------- keyframes ---------- */
@keyframes itp-blink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes itp-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
@keyframes itp-draw{to{stroke-dashoffset:0}}
@keyframes itp-travel{0%{top:0;opacity:0}8%{opacity:1}92%{opacity:1}100%{top:100%;opacity:0}}
@keyframes itp-sweep{0%{transform:translateX(-180%) skewX(-18deg)}55%,100%{transform:translateX(420%) skewX(-18deg)}}
@keyframes itp-lineUp{from{transform:translateY(105%)}to{transform:translateY(0)}}
@keyframes itp-riseIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes itp-fadeIn{from{opacity:0}to{opacity:1}}
@keyframes itp-pop{0%{transform:scale(.9);opacity:0}60%{transform:scale(1.03)}100%{transform:scale(1);opacity:1}}

@media (prefers-reduced-motion: reduce){
  .itp *,.itp *::before,.itp *::after{animation:none !important;transition-duration:.001ms !important;}
  .itp-reveal{opacity:1;transform:none;filter:none;}
  .itp-spark{stroke-dashoffset:0;}
  .itp-line > span{transform:none;}
  .itp-divider{transform:none;opacity:1;}
  .itp-btn--primary::before{display:none;}
}
`;

/* ========================================================================== */
/* HELPERS                                                                    */
/* ========================================================================== */

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const REDUCED =
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Observa o elemento e dispara uma única vez quando ele entra na viewport. */
function useInView({ threshold = 0.1, rootMargin = "0px 0px -30px 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return setInView(true);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return [ref, inView];
}

/* anim: "up" (padrão) | "left" | "right" | "scale" | "soft" */
function Reveal({ children, delay = 0, anim = "up", className = "", as: Tag = "div", ...rest }) {
  const [ref, inView] = useInView();

  return (
    <Tag
      ref={ref}
      data-anim={anim}
      className={`itp-reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Divisor que se desenha do centro para as bordas quando entra na tela. */
function Divider() {
  const [ref, inView] = useInView({ threshold: 0.4, rootMargin: "0px" });
  return <div ref={ref} className={`itp-divider ${inView ? "is-in" : ""}`} />;
}

/* Contador: números de dashboard sobem até o valor final quando entram na tela.
   Usa easing de desaceleração, então a leitura final é calma e não "trava". */
function Counter({ value, decimals = 0, prefix = "", suffix = "", duration = 1400, className = "", style }) {
  const [ref, inView] = useInView({ threshold: 0.35, rootMargin: "0px" });
  const [n, setN] = useState(REDUCED ? value : 0);

  useEffect(() => {
    if (!inView || REDUCED) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  const text = n.toLocaleString("pt-BR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className} style={style}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

/* CTA único — todos apontam para CONFIG.checkoutUrl e carregam data-cta p/ GTM */
function CTA({ area, children, size = "lg", variant = "primary", block = false, className = "" }) {
  return (
    <a
      href={CONFIG.checkoutUrl}
      id={`cta-${area}`}
      data-cta={area}
      className={`itp-btn itp-btn--${variant} itp-btn--${size} ${block ? "itp-btn--block" : ""} ${className}`}
    >
      {children}
      <span aria-hidden="true">→</span>
    </a>
  );
}

function Eyebrow({ children }) {
  return <span className="itp-eyebrow">{children}</span>;
}

function Disclaimer({ children }) {
  return (
    <p className="itp-mono" style={{ fontSize: 10.5, letterSpacing: ".1em", color: "rgba(156,163,175,.75)", textTransform: "uppercase", lineHeight: 1.6 }}>
      {children}
    </p>
  );
}

/* ========================================================================== */
/* DADOS                                                                      */
/* ========================================================================== */

const NAV = [
  { label: "O treinamento", id: "treinamento" },
  { label: "Conteúdo", id: "conteudo" },
  { label: "Bônus", id: "bonus" },
  { label: "Para quem é", id: "para-quem" },
  { label: "FAQ", id: "faq" },
];

const KPIS = [
  { label: "Investimento", prefix: "R$ ", value: 12450, decimals: 0, chip: "período" },
  { label: "Cadastros", value: 642, decimals: 0, chip: "+18,4%" },
  { label: "CPA cadastro", prefix: "R$ ", value: 19.39, decimals: 2, chip: "−6,2%" },
  { label: "FTDs", value: 187, decimals: 0, chip: "+41,7%" },
  { label: "CPA FTD", prefix: "R$ ", value: 66.58, decimals: 2, chip: "−22,9%" },
  { label: "Conversão", value: 29.1, decimals: 1, suffix: "%", chip: "cad → ftd" },
];

const AUDIENCE = [
  {
    title: "Gestores de tráfego",
    text: "Para quem já trabalha com mídia paga e quer aprender uma nova vertical.",
    icon: "◧",
  },
  {
    title: "Profissionais de iGaming",
    text: "Para quem trabalha dentro de uma operação e quer entender aquisição e performance.",
    icon: "◈",
  },
  {
    title: "Afiliados",
    text: "Para quem precisa entender tracking, atribuição e qualidade do tráfego.",
    icon: "◇",
  },
  {
    title: "Profissionais de marketing",
    text: "Para quem quer entender como funciona o funil de aquisição de uma operação de iGaming.",
    icon: "◎",
  },
];

const MODULES = [
  {
    n: "01",
    title: "O jogo do iGaming",
    summary: "O vocabulário e a economia da operação antes de qualquer campanha.",
    topics: [
      "Como funciona uma operação",
      "Operador × afiliado × gestor",
      "FTD",
      "CPA cadastro",
      "CPA FTD",
      "Conversão cadastro → FTD",
      "Ticket médio",
      "Redepósito",
      "LTV",
      "GGR",
      "NGR",
    ],
  },
  {
    n: "02",
    title: "Meta Ads para iGaming",
    summary: "Estrutura, orçamento e leitura de métricas dentro das particularidades da vertical.",
    topics: [
      "Estrutura de campanhas",
      "Públicos",
      "Orçamento",
      "Testes",
      "Criativos",
      "Métricas",
      "Otimização",
      "Escala",
      "Diagnóstico",
    ],
    note:
      "As estratégias pressupõem anunciantes e operações autorizados e o cumprimento das políticas aplicáveis de cada plataforma.",
  },
  {
    n: "03",
    title: "Criativos para performance",
    summary: "Como o criativo influencia o que acontece depois do clique.",
    topics: [
      "Anatomia do criativo",
      "Hooks",
      "Ofertas",
      "Ângulos",
      "Testes A/B",
      "Análise além do CTR",
      "Como relacionar criativo com FTD",
    ],
  },
  {
    n: "04",
    title: "Tracking para iGaming",
    summary: "A camada de dados que sustenta toda a otimização.",
    topics: [
      "Pixel",
      "CAPI",
      "GTM",
      "UTMs",
      "FBCLID",
      "FBP",
      "FBC",
      "External ID",
      "SubIDs",
      "Eventos",
      "Deduplicação",
      "Server-side",
      "Postbacks",
    ],
  },
  {
    n: "05",
    title: "Keitaro do zero",
    summary: "Do servidor vazio ao primeiro clique rastreado de ponta a ponta.",
    featured: true,
    topics: [
      "VPS",
      "Instalação",
      "Domínio",
      "DNS",
      "SSL",
      "Campaign",
      "Landing Pages",
      "Offers",
      "Flows",
      "Streams",
      "Parâmetros",
      "SubIDs",
      "Postbacks",
      "Testes",
    ],
    chain: ["META", "KEITARO", "LP", "OPERADOR", "FTD"],
    chainKey: ["KEITARO", "FTD"],
  },
  {
    n: "06",
    title: "Keitaro & tracking avançado",
    summary: "Roteamento, segmentação e diagnóstico com dados de log.",
    topics: [
      "GEO",
      "Device",
      "OS",
      "Detecção e análise de tráfego inválido",
      "Fallbacks",
      "Rotação de ofertas",
      "A/B de landing pages",
      "Distribuição de tráfego",
      "Tokens",
      "SubIDs",
      "Logs",
      "Diagnóstico",
      "Postbacks",
      "Relatórios",
    ],
  },
  {
    n: "07",
    title: "Campanha na prática",
    summary: "Uma campanha sendo construída do início ao fim, sem pular etapa.",
    topics: [
      "Estratégia",
      "Criativo",
      "Tracking",
      "Keitaro",
      "Landing",
      "Meta",
      "Eventos",
      "Análise",
    ],
  },
  {
    n: "08",
    title: "Otimização & escala",
    summary: "O que olhar, em que ordem, e o que fazer com a resposta.",
    topics: [
      "Diagnóstico",
      "CPM",
      "CTR",
      "CPC",
      "CPA",
      "CPA FTD",
      "Conversão",
      "Qualidade",
      "Redepósito",
      "LTV",
      "Escala",
    ],
  },
  {
    n: "09",
    title: "Compliance",
    summary: "Como operar dentro das regras do mercado regulado e das plataformas.",
    topics: [
      "Mercado regulado",
      "Publicidade responsável",
      "+18",
      "Operadores autorizados",
      "Políticas das plataformas",
      "Boas práticas",
    ],
  },
];

const PIPELINE = [
  { label: "Meta Ads", desc: "Origem do clique, com parâmetros preservados." },
  { label: "Keitaro", desc: "Tracking, atribuição, roteamento e testes.", key: true },
  { label: "Landing page", desc: "Variações em teste e passagem de parâmetros." },
  { label: "Operador", desc: "Recebe o tráfego já identificado por SubID." },
  { label: "Cadastro", desc: "Registro do jogador atrelado ao clique." },
  { label: "FTD", desc: "O evento que realmente importa.", key: true },
  { label: "Postback", desc: "O operador devolve a conversão para o tracker." },
  { label: "Dashboard", desc: "Resultado atribuído à campanha, ao anúncio e ao criativo.", key: true },
];

const BONUSES = [
  {
    n: "01",
    title: "Dashboard do gestor iGaming",
    text: "Planilha para acompanhar investimento, cadastros, FTDs, CPA FTD, conversão e performance.",
    price: "R$97",
  },
  { n: "02", title: "Checklist Keitaro", text: "Do servidor ao primeiro clique rastreado.", price: "R$47" },
  {
    n: "03",
    title: "Biblioteca de criativos",
    text: "50 referências para estudar estruturas, hooks e ofertas.",
    price: "R$97",
  },
  {
    n: "04",
    title: "Checklist de lançamento",
    text: "O que verificar antes de colocar uma campanha no ar.",
    price: "R$37",
  },
  { n: "05", title: "Glossário iGaming", text: "Os principais termos e métricas da indústria.", price: "R$27" },
];

const STACK = [
  { label: "iGaming Traffic Pro", price: "R$197", main: true },
  { label: "Dashboard do gestor iGaming", price: "R$97" },
  { label: "Checklist Keitaro", price: "R$47" },
  { label: "Biblioteca de criativos", price: "R$97" },
  { label: "Checklist de lançamento", price: "R$37" },
  { label: "Glossário iGaming", price: "R$27" },
];

const FAQ = [
  {
    q: "Preciso já trabalhar com iGaming?",
    a: "Não. O treinamento começa explicando as principais métricas e particularidades da vertical.",
  },
  {
    q: "Preciso entender de tráfego pago?",
    a: "É recomendado ter conhecimento básico de mídia paga, pois o treinamento é focado nas particularidades de iGaming.",
  },
  {
    q: "Vou aprender Keitaro?",
    a: "Sim. Existe um módulo específico mostrando a estrutura, configuração, tracking e utilização da ferramenta.",
  },
  {
    q: "O treinamento ensina a burlar as políticas do Meta?",
    a: "Não. O treinamento aborda aquisição, tracking, roteamento e análise dentro de uma operação profissional e em conformidade com as regras aplicáveis.",
  },
  { q: "Por quanto tempo tenho acesso?", a: CONFIG.faqConfig.accessPeriod },
  { q: "Existe certificado?", a: CONFIG.faqConfig.certificate },
  { q: "Como recebo o acesso?", a: "O acesso é enviado após a confirmação do pagamento." },
];

/* ========================================================================== */
/* BLOCOS                                                                     */
/* ========================================================================== */

function Header() {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setStuck(window.scrollY > 12);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${pct})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
      onScroll();
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header className={`itp-header ${stuck ? "is-stuck" : ""}`}>
      <span ref={barRef} className="itp-progress" aria-hidden="true" style={{ transform: "scaleX(0)" }} />
      <div className="itp-wrap itp-headbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="#top" onClick={go("top")} className="itp-logo" aria-label={CONFIG.brand.full}>
          <span style={{ display: "block" }}>{CONFIG.brand.name1}</span>
          <span style={{ display: "block", color: "var(--neon)" }}>{CONFIG.brand.name2}</span>
        </a>

        <nav className="itp-nav" aria-label="Navegação principal" style={{ display: "none", gap: 28 }}>
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} onClick={go(n.id)}>
              {n.label}
            </a>
          ))}
        </nav>
        <style>{`@media (min-width:1024px){.itp-nav{display:flex !important}.itp-header-cta{display:inline-flex !important}.itp-burger{display:none !important}}`}</style>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a
            href={CONFIG.checkoutUrl}
            id="cta-header"
            data-cta="header"
            className="itp-btn itp-btn--primary itp-btn--sm itp-header-cta"
            style={{ display: "none" }}
          >
            QUERO COMEÇAR
          </a>
          <button
            className={`itp-burger ${open ? "is-open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="itp-mobile-menu"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <div id="itp-mobile-menu" className={`itp-mobilemenu ${open ? "is-open" : ""}`}>
        <div>
          <div className="itp-wrap" style={{ paddingTop: 8, paddingBottom: 20, display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                onClick={go(n.id)}
                style={{ padding: "13px 2px", borderBottom: "1px solid var(--line)", fontSize: 15, fontWeight: 600 }}
              >
                {n.label}
              </a>
            ))}
            <a
              href={CONFIG.checkoutUrl}
              id="cta-menu"
              data-cta="menu"
              className="itp-btn itp-btn--primary itp-btn--md itp-btn--block"
              style={{ marginTop: 16 }}
            >
              QUERO COMEÇAR
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

function Dashboard() {
  return (
    <div className="itp-dash itp-float" role="img" aria-label="Exemplo ilustrativo de painel de performance com investimento, cadastros, CPA e FTDs">
      <div className="itp-dash-bar">
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#2A303C" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#2A303C" }} />
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#2A303C" }} />
        <span
          className="itp-mono itp-gray itp-dash-title"
          style={{ fontSize: 10, letterSpacing: ".12em", marginLeft: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          PERFORMANCE / AQUISIÇÃO
        </span>
        <span style={{ marginLeft: "auto", flex: "none", padding: "5px 9px", fontSize: 9 }} className="itp-badge itp-badge--neon">
          <span className="itp-dot" /> DADOS ILUSTRATIVOS
        </span>
      </div>

      <div style={{ padding: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 8 }}>
          {KPIS.map((k) => (
            <div key={k.label} className="itp-kpi">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
                <span className="itp-kpi-label">{k.label}</span>
                <span className={`itp-chip ${k.chip.match(/[a-z]{3,}/) ? "itp-chip--muted" : ""}`}>{k.chip}</span>
              </div>
              <div className="itp-kpi-value itp-bignum">
                <Counter
                  value={k.value}
                  decimals={k.decimals}
                  prefix={k.prefix || ""}
                  suffix={k.suffix || ""}
                  duration={1500}
                />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12, background: "var(--card2)", border: "1px solid var(--line)", borderRadius: 12, padding: "12px 12px 6px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span className="itp-kpi-label">FTDs por dia</span>
            <span className="itp-mono itp-neon" style={{ fontSize: 10 }}>↗ tendência</span>
          </div>
          <svg viewBox="0 0 560 190" style={{ width: "100%", height: "auto", display: "block" }} aria-hidden="true">
            <defs>
              <linearGradient id="itpArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8CFF3D" stopOpacity="0.30" />
                <stop offset="100%" stopColor="#8CFF3D" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[38, 76, 114, 152].map((y) => (
              <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            ))}
            <path
              d="M0,170 C35,167 48,161 70,158 S120,151 140,146 S192,133 210,127 S262,116 280,110 S332,97 350,89 S402,76 420,67 S472,53 490,45 S542,29 560,24 L560,190 L0,190 Z"
              fill="url(#itpArea)"
            />
            <path
              className="itp-spark"
              d="M0,170 C35,167 48,161 70,158 S120,151 140,146 S192,133 210,127 S262,116 280,110 S332,97 350,89 S402,76 420,67 S472,53 490,45 S542,29 560,24"
              fill="none"
              stroke="#8CFF3D"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="560" cy="24" r="4.5" fill="#8CFF3D">
              <animate attributeName="r" values="4.5;6.5;4.5" dur="2.6s" repeatCount="indefinite" />
            </circle>
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: 6 }} className="itp-mono itp-gray">
            {["S1", "S2", "S3", "S4"].map((s) => (
              <span key={s} style={{ fontSize: 9.5, letterSpacing: ".1em" }}>{s}</span>
            ))}
          </div>
        </div>

        <div className="itp-mini" style={{ marginTop: 10 }}>
          {[
            ["CTR", "2,84%"],
            ["CPC", "R$ 1,12"],
            ["FTD", "187"],
            ["CPA", "R$ 66,58"],
          ].map(([l, v]) => (
            <div key={l} style={{ border: "1px solid var(--line)", borderRadius: 9, padding: "8px 6px", textAlign: "center" }}>
              <div className="itp-mono itp-gray" style={{ fontSize: 9, letterSpacing: ".14em" }}>{l}</div>
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 3 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="itp-hero" style={{ position: "relative", overflow: "hidden" }}>
      <div className="itp-grid-bg" />
      <div className="itp-glow" style={{ width: 520, height: 520, top: -180, right: -140 }} />

      <div className="itp-wrap" style={{ position: "relative" }}>
        <div className="itp-hero-grid" style={{ display: "grid", gap: 40, alignItems: "center" }}>
          <style>{`@media (min-width:1024px){.itp-hero-grid{grid-template-columns:1.02fr .98fr;gap:56px}}`}</style>

          <div>
            <div className="itp-boot" style={{ animationDelay: "60ms" }}>
              <span className="itp-badge itp-badge--neon">
                <span className="itp-dot" /> Treinamento para gestores de tráfego
              </span>
            </div>

            <h1 className="itp-h1" style={{ marginTop: 22 }}>
              {CONFIG.headline.map((l, i) => (
                <React.Fragment key={l.text}>
                  {i > 0 && " "}
                  <span className={`itp-line ${l.accent ? "itp-neon" : ""}`}>
                    <span style={{ animationDelay: `${180 + i * 160}ms` }}>{l.text}</span>
                  </span>
                </React.Fragment>
              ))}
            </h1>

            <div className="itp-boot" style={{ animationDelay: "620ms" }}>
              <p className="itp-lead" style={{ marginTop: 22, maxWidth: 560 }}>
                Aprenda como estruturar, rastrear e otimizar campanhas de aquisição para iGaming — do primeiro clique ao FTD.
              </p>
            </div>

            <div className="itp-boot" style={{ animationDelay: "720ms" }}>
              <div className="itp-mono" style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: "6px 12px", fontSize: 11, letterSpacing: ".16em", color: "var(--gray)" }}>
                {["META ADS", "TRACKING", "FTD", "KEITARO", "PERFORMANCE"].map((t, i) => (
                  <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                    {i > 0 && <span style={{ color: "rgba(255,255,255,.2)" }}>•</span>}
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="itp-boot" style={{ animationDelay: "820ms" }}>
              <div style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 12, maxWidth: 460 }}>
                <CTA area="hero" block>QUERO DOMINAR TRÁFEGO PARA iGAMING</CTA>
                <p className="itp-small" style={{ textAlign: "center" }}>Acesso imediato • Pagamento único</p>
              </div>
            </div>

            <div className="itp-boot" style={{ animationDelay: "920ms" }}>
              <div style={{ marginTop: 26, display: "inline-flex", flexWrap: "wrap", alignItems: "baseline", gap: "6px 10px", padding: "14px 18px", border: "1px solid var(--line)", borderRadius: 14, background: "var(--card)", maxWidth: "100%" }}>
                <span className="itp-strike itp-mono itp-bignum" style={{ fontSize: 13.5 }}>De {CONFIG.price.anchor}</span>
                <span className="itp-gray" style={{ fontSize: 13 }}>por</span>
                <span className="itp-bignum" style={{ fontSize: "clamp(30px,8.5vw,36px)", fontWeight: 800, letterSpacing: "-.03em", color: "var(--neon)", lineHeight: 1 }}>
                  {CONFIG.price.current}
                </span>
              </div>
            </div>
          </div>

          <div className="itp-boot" style={{ animationDelay: "480ms", animationDuration: "1s" }}>
            <Dashboard />
            <div style={{ marginTop: 12 }}>
              <Disclaimer>
                Painel meramente ilustrativo, criado para demonstração do conteúdo. Não representa promessa, projeção ou garantia de resultado.
              </Disclaimer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BeliefBreak() {
  const chain = [
    "Anúncio",
    "Clique",
    "Landing page",
    "Cadastro",
    "FTD",
    "Redepósito",
    "LTV",
  ];
  const keys = ["FTD", "LTV"];

  return (
    <section id="treinamento" className="itp-sec" style={{ position: "relative", background: "linear-gradient(180deg,transparent,rgba(255,255,255,.012),transparent)" }}>
      <div className="itp-wrap">
        <Reveal>
          <Eyebrow>A métrica errada custa caro</Eyebrow>
          <h2 className="itp-h2" style={{ marginTop: 18, maxWidth: 780 }}>
            CADASTRO BARATO NÃO SIGNIFICA CAMPANHA BOA.
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <div style={{ marginTop: 22, display: "grid", gap: 16, maxWidth: 780 }}>
            <p className="itp-lead">
              No iGaming, olhar apenas para CPM, CPC, CTR e CPA de cadastro pode fazer você tomar decisões erradas.
            </p>
            <p className="itp-lead">
              O que realmente importa é entender o que acontece <span style={{ color: "var(--white)", fontWeight: 700 }}>depois</span> do cadastro.
            </p>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="itp-card" style={{ marginTop: 40, padding: "30px 18px" }}>
            <div className="itp-chain">
              {chain.map((c, i) => (
                <React.Fragment key={c}>
                  {i > 0 && <span className="itp-arrow" aria-hidden="true">→</span>}
                  <span className={`itp-chainitem ${keys.includes(c) ? "itp-chainitem--key" : ""}`}>{c}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p style={{ marginTop: 34, fontSize: "clamp(19px,3.4vw,28px)", fontWeight: 800, letterSpacing: "-.02em", lineHeight: 1.25, maxWidth: 720 }}>
            Você não está comprando cadastros. <span className="itp-neon">Está adquirindo jogadores.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ConversionBar({ pct, good }) {
  const [ref, inView] = useInView({ threshold: 0.5, rootMargin: "0px" });
  return (
    <div ref={ref} className="itp-bar" aria-hidden="true">
      <i
        style={{
          width: inView ? `${pct}%` : 0,
          background: good ? "linear-gradient(90deg,var(--green),var(--neon))" : "#C25C5C",
        }}
      />
    </div>
  );
}

function Comparison() {
  const Card = ({ tag, cpa, ftds, conv, pct, cpaFtd, good }) => (
    <div
      className={`itp-card itp-card--hover ${good ? "itp-card--neon" : ""}`}
      style={{
        padding: "20px 18px",
        borderColor: good ? "rgba(140,255,61,.32)" : "rgba(255,110,110,.18)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="itp-mono" style={{ fontSize: 11, letterSpacing: ".18em", color: good ? "var(--neon)" : "#F08A8A" }}>
          {tag}
        </span>
        <span className="itp-badge" style={{ borderColor: good ? "rgba(140,255,61,.3)" : "var(--line)", color: good ? "var(--neon)" : "var(--gray)" }}>
          {good ? "escalável" : "engana"}
        </span>
      </div>

      <div style={{ marginTop: 22 }}>
        <div className="itp-kpi-label">CPA cadastro</div>
        <div className="itp-bignum" style={{ fontSize: "clamp(34px,9vw,42px)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: 1, marginTop: 6 }}>{cpa}</div>
      </div>

      <div style={{ marginTop: 22, display: "grid", gap: 0 }}>
        <div className="itp-row"><span className="itp-small">Cadastros</span><span className="itp-mono" style={{ fontSize: 14 }}>100</span></div>
        <div className="itp-row"><span className="itp-small">FTDs</span><span className="itp-mono" style={{ fontSize: 14 }}>{ftds}</span></div>
        <div className="itp-row" style={{ display: "block" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <span className="itp-small">Conversão cadastro → FTD</span>
            <span className="itp-mono itp-bignum" style={{ fontSize: 16, fontWeight: 700, color: good ? "var(--neon)" : "#F08A8A" }}>{conv}</span>
          </div>
          <ConversionBar pct={pct} good={good} />
        </div>
      </div>

      <div style={{ marginTop: 18, padding: "16px 18px", borderRadius: 12, background: good ? "rgba(140,255,61,.08)" : "rgba(255,255,255,.03)", border: "1px solid var(--line)" }}>
        <div className="itp-kpi-label">CPA FTD</div>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-.03em", marginTop: 4, color: good ? "var(--neon)" : "var(--white)" }}>{cpaFtd}</div>
      </div>
    </div>
  );

  return (
    <section className="itp-sec">
      <div className="itp-wrap">
        <Reveal>
          <Eyebrow>Exemplo didático</Eyebrow>
        </Reveal>

        <div className="itp-cmp-grid" style={{ display: "grid", gap: 18, marginTop: 26 }}>
          <style>{`@media (min-width:800px){.itp-cmp-grid{grid-template-columns:1fr 1fr;gap:22px}}`}</style>
          <Reveal anim="left"><Card tag="CAMPANHA A" cpa="R$12" ftds="10" conv="10%" pct={10} cpaFtd="R$120" good={false} /></Reveal>
          <Reveal anim="right" delay={120}><Card tag="CAMPANHA B" cpa="R$20" ftds="40" conv="40%" pct={40} cpaFtd="R$50" good /></Reveal>
        </div>

        <Reveal delay={140}>
          <div style={{ marginTop: 40, maxWidth: 760 }}>
            <h2 className="itp-h2">QUAL CAMPANHA VOCÊ ESCALARIA?</h2>
            <p className="itp-lead" style={{ marginTop: 18 }}>
              É exatamente esse tipo de decisão que separa um gestor de anúncios de um gestor de performance para iGaming.
            </p>
            <div style={{ marginTop: 20 }}>
              <Disclaimer>Números apresentados como exemplos didáticos. Não representam resultados reais nem garantia de desempenho.</Disclaimer>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Audience() {
  return (
    <section id="para-quem" className="itp-sec">
      <div className="itp-wrap">
        <Reveal>
          <Eyebrow>Público</Eyebrow>
          <h2 className="itp-h2" style={{ marginTop: 18, maxWidth: 700 }}>
            PARA QUEM É O <span className="itp-neon">iGAMING TRAFFIC PRO</span>?
          </h2>
        </Reveal>

        <div className="itp-aud-grid" style={{ display: "grid", gap: 14, marginTop: 34 }}>
          <style>{`@media (min-width:640px){.itp-aud-grid{grid-template-columns:1fr 1fr}}@media (min-width:1100px){.itp-aud-grid{grid-template-columns:repeat(4,1fr)}}`}</style>
          {AUDIENCE.map((a, i) => (
            <Reveal key={a.title} delay={i * 70}>
              <article className="itp-card itp-card--hover" style={{ padding: 24, height: "100%" }}>
                <span aria-hidden="true" style={{ fontSize: 22, color: "var(--neon)", lineHeight: 1 }}>{a.icon}</span>
                <h3 className="itp-h3" style={{ marginTop: 18, textTransform: "uppercase" }}>{a.title}</h3>
                <p className="itp-small" style={{ marginTop: 12 }}>{a.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModuleItem({ mod, open, onToggle }) {
  return (
    <div
      className={`itp-acc itp-card ${open ? "is-open" : ""} ${mod.featured ? "itp-card--neon" : ""}`}
      style={{ overflow: "hidden" }}
    >
      <h3>
        <button className="itp-acc-head" onClick={onToggle} aria-expanded={open} aria-controls={`mod-${mod.n}`}>
          <span className="itp-mono" style={{ fontSize: 12, letterSpacing: ".1em", color: mod.featured ? "var(--neon)" : "var(--gray)", marginTop: 4, flex: "none", width: 26 }}>
            {mod.n}
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
              <span className="itp-h3" style={{ textTransform: "uppercase" }}>{mod.title}</span>
              {mod.featured && (
                <span className="itp-badge itp-badge--neon" style={{ padding: "5px 10px", fontSize: 9.5 }}>Módulo de destaque</span>
              )}
            </span>
            <span className="itp-small" style={{ display: "block", marginTop: 7 }}>{mod.summary}</span>
          </span>
          <span className="itp-plus" aria-hidden="true" />
        </button>
      </h3>

      <div id={`mod-${mod.n}`} className={`itp-acc-panel ${open ? "is-open" : ""}`} role="region">
        <div>
          <div style={{ padding: "0 18px 20px 18px" }}>
            <div style={{ height: 1, background: "var(--line)", marginBottom: 16 }} />
            <ul className="itp-topics" style={{ display: "grid", gap: 0, gridTemplateColumns: "1fr" }}>
              <style>{`@media (min-width:640px){.itp-topics{grid-template-columns:1fr 1fr;column-gap:24px}}@media (min-width:1024px){.itp-topics{grid-template-columns:repeat(3,1fr)}}`}</style>
              {mod.topics.map((t, ti) => (
                <li key={t} className="itp-topic" style={{ "--i": ti }}>
                  <i aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>

            {mod.chain && (
              <div style={{ marginTop: 20, padding: "18px 14px", borderRadius: 12, background: "var(--card2)", border: "1px solid var(--line)" }}>
                <div className="itp-chain">
                  {mod.chain.map((c, i) => (
                    <React.Fragment key={c}>
                      {i > 0 && <span className="itp-arrow" aria-hidden="true">→</span>}
                      <span className={`itp-chainitem ${mod.chainKey.includes(c) ? "itp-chainitem--key" : ""}`}>{c}</span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {mod.note && (
              <p className="itp-small" style={{ marginTop: 18, paddingLeft: 12, borderLeft: "2px solid rgba(140,255,61,.4)" }}>
                {mod.note}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Modules() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="conteudo" className="itp-sec">
      <div className="itp-wrap">
        <Reveal>
          <Eyebrow>Conteúdo — 9 módulos</Eyebrow>
          <h2 className="itp-h2" style={{ marginTop: 18 }}>
            DO PRIMEIRO CLIQUE <span className="itp-neon">AO FTD.</span>
          </h2>
          <p className="itp-lead" style={{ marginTop: 16, maxWidth: 620 }}>
            Um treinamento construído para ensinar a operação completa.
          </p>
        </Reveal>

        <div style={{ marginTop: 34, display: "grid", gap: 12 }}>
          {MODULES.map((m, i) => (
            <Reveal key={m.n} delay={Math.min(i * 40, 200)}>
              <ModuleItem mod={m} open={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? -1 : i)} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div style={{ marginTop: 34, maxWidth: 440 }}>
            <CTA area="modules" block>QUERO ACESSAR OS 9 MÓDULOS</CTA>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function KeitaroFlow() {
  return (
    <section className="itp-sec" style={{ position: "relative", overflow: "hidden" }}>
      <div className="itp-glow" style={{ width: 460, height: 460, left: -180, top: 80 }} />
      <div className="itp-wrap" style={{ position: "relative" }}>
        <div className="itp-flow-grid" style={{ display: "grid", gap: 40, alignItems: "start" }}>
          <style>{`@media (min-width:1000px){.itp-flow-grid{grid-template-columns:.9fr 1.1fr;gap:64px}.itp-flow-sticky{position:sticky;top:96px}}`}</style>

          <div className="itp-flow-sticky">
            <Reveal anim="left">
              <Eyebrow>Atribuição ponta a ponta</Eyebrow>
              <h2 className="itp-h2" style={{ marginTop: 18 }}>
                DO CLIQUE AO FTD. <span className="itp-neon">SAIBA EXATAMENTE DE ONDE VEIO SEU RESULTADO.</span>
              </h2>
              <p className="itp-lead" style={{ marginTop: 20 }}>
                Você vai aprender a montar sua estrutura de tracking do zero e entender como cada parte do funil se conecta.
              </p>
              <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Tracking", "Atribuição", "Roteamento", "Testes", "Análise"].map((t) => (
                  <span key={t} className="itp-badge">{t}</span>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="itp-rail">
            <span className="itp-rail-pulse" aria-hidden="true" />
            <span className="itp-rail-pulse" aria-hidden="true" style={{ animationDelay: "2.1s", opacity: .55 }} />
            <ol style={{ display: "grid", gap: 12, listStyle: "none", padding: 0, margin: 0 }}>
              {PIPELINE.map((p, i) => (
                <Reveal key={p.label} delay={i * 60} as="li">
                  <div className={`itp-node ${p.key ? "itp-node--key" : ""}`}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-.01em", textTransform: "uppercase", color: p.key ? "var(--neon)" : "var(--white)" }}>
                        {p.label}
                      </span>
                      <span className="itp-mono itp-gray" style={{ fontSize: 10 }}>{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <p className="itp-small" style={{ marginTop: 6 }}>{p.desc}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bonus() {
  return (
    <section id="bonus" className="itp-sec">
      <div className="itp-wrap">
        <Reveal>
          <Eyebrow>Bônus inclusos</Eyebrow>
          <h2 className="itp-h2" style={{ marginTop: 18 }}>E VOCÊ AINDA RECEBE:</h2>
        </Reveal>

        <div className="itp-bonus-grid" style={{ display: "grid", gap: 14, marginTop: 32 }}>
          <style>{`@media (min-width:700px){.itp-bonus-grid{grid-template-columns:1fr 1fr}}@media (min-width:1080px){.itp-bonus-grid{grid-template-columns:repeat(3,1fr)}}`}</style>
          {BONUSES.map((b, i) => (
            <Reveal key={b.n} delay={i * 60}>
              <article className="itp-card itp-card--hover" style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span className="itp-mono itp-neon" style={{ fontSize: 11, letterSpacing: ".16em" }}>BÔNUS #{b.n}</span>
                  <span className="itp-mono itp-gray" style={{ fontSize: 12 }}>{b.price}</span>
                </div>
                <h3 className="itp-h3" style={{ marginTop: 16 }}>{b.title}</h3>
                <p className="itp-small" style={{ marginTop: 10 }}>{b.text}</p>
              </article>
            </Reveal>
          ))}

          <Reveal delay={340}>
            <div className="itp-card itp-card--neon" style={{ padding: 24, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
              <span className="itp-kpi-label">Total em bônus</span>
              <span className="itp-bignum" style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-.03em", color: "var(--neon)", marginTop: 8, lineHeight: 1 }}>
                <Counter value={305} prefix="R$" duration={1600} />
              </span>
              <span className="itp-small" style={{ marginTop: 10 }}>inclusos no acesso</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function OfferStack() {
  return (
    <section id="oferta" className="itp-sec" style={{ position: "relative", overflow: "hidden" }}>
      <div className="itp-glow" style={{ width: 560, height: 400, left: "50%", transform: "translateX(-50%)", bottom: -160 }} />
      <div className="itp-wrap" style={{ position: "relative" }}>
        <Reveal>
          <div style={{ textAlign: "center" }}>
            <Eyebrow>A oferta</Eyebrow>
            <h2 className="itp-h2" style={{ marginTop: 18 }}>TUDO QUE ESTÁ INCLUÍDO</h2>
          </div>
        </Reveal>

        <Reveal anim="scale" delay={80}>
          <div className="itp-card" style={{ maxWidth: 640, margin: "34px auto 0", padding: "26px 22px" }}>
            {STACK.map((s) => (
              <div key={s.label} className="itp-row">
                <span style={{ fontSize: 14.5, fontWeight: s.main ? 700 : 500, color: s.main ? "var(--white)" : "var(--gray)" }}>
                  {s.label}
                </span>
                <span className="itp-mono itp-gray" style={{ fontSize: 13, flex: "none" }}>{s.price}</span>
              </div>
            ))}

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--line-strong)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="itp-kpi-label">Valor total</span>
              <span className="itp-strike itp-mono" style={{ fontSize: 17 }}>{CONFIG.price.stackTotal}</span>
            </div>

            <div style={{ marginTop: 22, textAlign: "center", padding: "24px 16px", borderRadius: 14, background: "var(--card2)", border: "1px solid rgba(140,255,61,.28)" }}>
              <span className="itp-kpi-label">Hoje</span>
              <div className="itp-bignum itp-price" style={{ fontSize: "clamp(52px,12vw,74px)", fontWeight: 800, letterSpacing: "-.045em", color: "var(--neon)", lineHeight: 1, marginTop: 6 }}>
                {CONFIG.price.current}
              </div>
              <p className="itp-small" style={{ marginTop: 10 }}>Pagamento único</p>
            </div>

            <div style={{ marginTop: 20 }}>
              <CTA area="offer" block>QUERO GARANTIR MEU ACESSO</CTA>
              <p className="itp-small" style={{ textAlign: "center", marginTop: 12 }}>
                Acesso imediato após a confirmação do pagamento.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Instructor() {
  const I = CONFIG.instructor;
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <section id="instrutor" className="itp-sec">
      <div className="itp-wrap">
        <div className="itp-inst-grid" style={{ display: "grid", gap: 30, alignItems: "center" }}>
          <style>{`@media (min-width:900px){.itp-inst-grid{grid-template-columns:.85fr 1.15fr;gap:56px}}`}</style>

          <Reveal anim="scale">
            <div
              className="itp-card itp-photo"
              style={{
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: I.photo ? "transparent" : "var(--card2)",
              }}
            >
              {I.photo && !imgFailed ? (
                <picture>
                  {I.photoWebp && <source srcSet={I.photoWebp} type="image/webp" />}
                  <img
                    src={I.photo}
                    alt={I.photoAlt || `Foto de ${I.name}`}
                    width={960}
                    height={1200}
                    loading="lazy"
                    decoding="async"
                    onError={() => setImgFailed(true)}
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 28%", display: "block" }}
                  />
                </picture>
              ) : (
                <span className="itp-mono itp-gray" style={{ fontSize: 11, letterSpacing: ".18em", textAlign: "center", padding: 20 }}>
                  [FOTO DO INSTRUTOR]
                </span>
              )}
            </div>
          </Reveal>

          <Reveal anim="right" delay={80}>
            <Eyebrow>Instrutor</Eyebrow>
            <h2 className="itp-h2" style={{ marginTop: 18 }}>
              APRENDA COM QUEM <span className="itp-neon">VIVE PERFORMANCE.</span>
            </h2>

            <div style={{ marginTop: 24 }}>
              <p style={{ fontSize: "clamp(22px,5.5vw,28px)", fontWeight: 800, letterSpacing: "-.025em", textTransform: "uppercase" }}>
                {I.name}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 14px", marginTop: 10 }}>
                <span className="itp-mono itp-neon" style={{ fontSize: 11.5, letterSpacing: ".14em", textTransform: "uppercase" }}>
                  {I.role}
                </span>
                {I.handle && (
                  <a
                    href={I.handleUrl || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="itp-handle itp-mono"
                    aria-label={`Perfil de ${I.name} no Instagram: ${I.handle}`}
                  >
                    {I.handle}
                  </a>
                )}
              </div>
              <p className="itp-lead" style={{ marginTop: 18 }}>{I.bio}</p>
            </div>

            <p className="itp-kpi-label" style={{ marginTop: 30 }}>No que eu opero</p>
            <ul style={{ marginTop: 12, display: "grid", gap: 9 }}>
              {I.areas.map((a) => (
                <li key={a} className="itp-card itp-card--alt itp-area">
                  <span style={{ fontSize: 14.5, color: "var(--white)", fontWeight: 600, lineHeight: 1.4 }}>{a}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState(-1);

  return (
    <section id="faq" className="itp-sec">
      <div className="itp-wrap">
        <Reveal>
          <Eyebrow>Dúvidas</Eyebrow>
          <h2 className="itp-h2" style={{ marginTop: 18 }}>PERGUNTAS FREQUENTES</h2>
        </Reveal>

        <div style={{ marginTop: 32, display: "grid", gap: 10, maxWidth: 860 }}>
          {FAQ.map((f, i) => (
            <Reveal key={f.q} delay={Math.min(i * 45, 200)}>
              <div className={`itp-acc itp-card ${open === i ? "is-open" : ""}`}>
                <h3>
                  <button
                    className="itp-acc-head"
                    onClick={() => setOpen(open === i ? -1 : i)}
                    aria-expanded={open === i}
                    aria-controls={`faq-${i}`}
                  >
                    <span style={{ flex: 1, fontSize: 15.5, fontWeight: 700, letterSpacing: "-.01em" }}>{f.q}</span>
                    <span className="itp-plus" aria-hidden="true" />
                  </button>
                </h3>
                <div id={`faq-${i}`} className={`itp-acc-panel ${open === i ? "is-open" : ""}`} role="region">
                  <div>
                    <p className="itp-small" style={{ padding: "0 18px 20px", maxWidth: 640, fontSize: 14.5 }}>{f.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="itp-sec" style={{ position: "relative", overflow: "hidden", borderTop: "1px solid var(--line)" }}>
      <div className="itp-grid-bg" style={{ opacity: 0.4 }} />
      <div className="itp-glow" style={{ width: 620, height: 420, left: "50%", transform: "translateX(-50%)", top: -140 }} />

      <div className="itp-wrap" style={{ position: "relative", textAlign: "center" }}>
        <Reveal>
          <h2 className="itp-h2" style={{ maxWidth: 860, margin: "0 auto" }}>
            O MERCADO NÃO PRECISA DE MAIS UM APERTADOR DE BOTÃO.
            <br />
            <span className="itp-neon">PRECISA DE GESTORES QUE ENTENDAM PERFORMANCE.</span>
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="itp-lead" style={{ marginTop: 22, maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}>
            Aprenda a analisar o funil inteiro — do anúncio ao jogador.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <div className="itp-card" style={{ maxWidth: 560, margin: "38px auto 0", padding: "30px 24px" }}>
            <p style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em" }}>
              {CONFIG.brand.name1} <span className="itp-neon">{CONFIG.brand.name2}</span>
            </p>

            <div className="itp-mono" style={{ marginTop: 18, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}>
              {["Meta Ads", "Tracking", "Keitaro", "FTD", "Performance"].map((t) => (
                <span key={t} className="itp-badge">{t}</span>
              ))}
            </div>

            <div style={{ marginTop: 28, display: "flex", alignItems: "baseline", justifyContent: "center", gap: 14 }}>
              <span className="itp-strike itp-mono" style={{ fontSize: 16 }}>{CONFIG.price.anchor}</span>
              <span style={{ fontSize: "clamp(48px,11vw,66px)", fontWeight: 800, letterSpacing: "-.045em", color: "var(--neon)", lineHeight: 1 }}>
                {CONFIG.price.current}
              </span>
            </div>
            <p className="itp-small" style={{ marginTop: 8 }}>Pagamento único • Acesso imediato</p>

            <div style={{ marginTop: 24 }}>
              <CTA area="final" block>QUERO COMEÇAR AGORA</CTA>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--line)",
        paddingTop: 40,
        paddingBottom: "calc(56px + env(safe-area-inset-bottom))",
      }}
    >
      <div className="itp-wrap">
        <div className="itp-foot-grid" style={{ display: "grid", gap: 26 }}>
          <style>{`@media (min-width:800px){.itp-foot-grid{grid-template-columns:1fr auto;align-items:start}}`}</style>

          <div>
            <p className="itp-logo" style={{ fontSize: 15 }}>
              <span style={{ display: "block" }}>{CONFIG.brand.name1}</span>
              <span style={{ display: "block", color: "var(--neon)" }}>{CONFIG.brand.name2}</span>
            </p>
            <p className="itp-small" style={{ marginTop: 14 }}>
              © {CONFIG.legal.year} — Todos os direitos reservados.
            </p>
          </div>

          <nav aria-label="Links legais" style={{ display: "flex", flexWrap: "wrap", gap: 22 }}>
            <a className="itp-small" href={CONFIG.legal.terms} style={{ color: "var(--gray)" }}>Termos de Uso</a>
            <a className="itp-small" href={CONFIG.legal.privacy} style={{ color: "var(--gray)" }}>Política de Privacidade</a>
            <a className="itp-small" href={CONFIG.legal.support} style={{ color: "var(--gray)" }}>Suporte</a>
          </nav>
        </div>

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--line)" }}>
          <p className="itp-small" style={{ fontSize: 12, maxWidth: 900, lineHeight: 1.7 }}>
            Este é um treinamento educacional destinado a profissionais adultos. Não somos uma plataforma de apostas e não
            oferecemos jogos ou serviços de apostas. Resultados apresentados como exemplos não representam garantia de
            desempenho. O uso das técnicas ensinadas deve respeitar a legislação, as regras de publicidade e as políticas
            das plataformas utilizadas.
          </p>
        </div>
      </div>
    </footer>
  );
}

function StickyBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const passedHero = window.scrollY > window.innerHeight * 0.7;
      // some perto do rodapé para não competir com o CTA final
      const doc = document.documentElement;
      const nearEnd = window.scrollY + window.innerHeight > doc.scrollHeight - 320;
      setVisible(passedHero && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className={`itp-stickybar ${visible ? "is-visible" : ""}`} aria-hidden={!visible}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {CONFIG.brand.full} — <span className="itp-neon">{CONFIG.price.current}</span>
        </p>
        <p className="itp-small" style={{ fontSize: 10.5 }}>Pagamento único</p>
      </div>
      <a
        href={CONFIG.checkoutUrl}
        id="cta-sticky"
        data-cta="sticky"
        className="itp-btn itp-btn--primary itp-btn--sm"
        tabIndex={visible ? 0 : -1}
        style={{ flex: "none" }}
      >
        QUERO ACESSAR
      </a>
    </div>
  );
}

/* ========================================================================== */
/* PÁGINA                                                                     */
/* ========================================================================== */

export default function IGamingTrafficPro() {
  useEffect(() => {
    document.title = CONFIG.seo.title;
  }, []);

  return (
    <div className="itp itp-page">
      <style>{CSS}</style>
      <Header />
      <main>
        <Hero />
        <Divider />
        <BeliefBreak />
        <Comparison />
        <Divider />
        <Audience />
        <Modules />
        <Divider />
        <KeitaroFlow />
        <Bonus />
        <OfferStack />
        <Divider />
        <Instructor />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyBar />
    </div>
  );
}

/* ============================================================================
   NOTAS DE IMPLEMENTAÇÃO
   ----------------------------------------------------------------------------
   1) CHECKOUT
      Todos os CTAs usam CONFIG.checkoutUrl. Troque em um lugar só.

   2) TRACKING / GTM
      Cada CTA tem id e data-attribute:
        #cta-header   data-cta="header"
        #cta-menu     data-cta="menu"
        #cta-hero     data-cta="hero"
        #cta-modules  data-cta="modules"
        #cta-offer    data-cta="offer"
        #cta-final    data-cta="final"
        #cta-sticky   data-cta="sticky"
      No GTM crie um gatilho de clique em: Click Element matches CSS selector
      `[data-cta]` e envie {{Click Element}} > data-cta como parâmetro do evento.

   3) SEO / OPEN GRAPH  (Next.js — app/layout.tsx)
      export const metadata = {
        title: CONFIG.seo.title,
        description: CONFIG.seo.description,
        openGraph: {
          title: CONFIG.seo.title,
          description: CONFIG.seo.description,
          url: CONFIG.seo.url,
          images: [CONFIG.seo.ogImage],
          type: 'website',
          locale: 'pt_BR',
        },
        twitter: { card: 'summary_large_image' },
      };
      Em HTML puro, use as mesmas tags no <head>.

   4) GTM (Next.js) — cole em app/layout.tsx quando tiver o ID em CONFIG.tracking.gtmId.
      <Script id="gtm" strategy="afterInteractive">{`...`}</Script>
      Nenhum ID fictício foi incluído no código.

   5) TYPESCRIPT
      Renomeie para .tsx e adicione as interfaces (Module, Bonus, FaqItem, etc.).
      Nenhum padrão usado aqui impede a tipagem.
   ========================================================================== */
