# iGaming Traffic Pro — Landing Page

React + Vite. Sem Tailwind, sem dependência externa além de React: todo o CSS vive
dentro do componente. Build de produção: **~62 kB gzip**.

---

## Rodar local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera /dist
npm run preview  # confere o build
```

---

## Deploy no Render

**Static Site** (não Web Service — é uma página estática, sai mais barato e mais rápido).

1. Suba o repositório no GitHub.
2. No Render: **New → Static Site → conecte o repositório**.
3. Configure:

| Campo | Valor |
|---|---|
| Build Command | `npm run build` |
| Publish Directory | `dist` |
| Node Version | `20` (variável de ambiente `NODE_VERSION`) |

4. Deploy.

### Redirect de SPA

Não é necessário — a página é uma rota só. Se um dia adicionar rotas,
crie em **Redirects/Rewrites**: origem `/*`, destino `/index.html`, tipo **Rewrite**.

---

## Antes de anunciar — checklist

- [ ] **`CHECKOUT_URL`** — em `src/IGamingTrafficPro.jsx`, `CONFIG.checkoutUrl`.
      Está em `#checkout`. Todos os 7 CTAs usam essa constante.
- [ ] **Domínio** — trocar `SEUDOMINIO.com` no `index.html` (canonical, og:url, og:image)
      e no `public/robots.txt`.
- [ ] **Imagem OG** — colocar `og.jpg` (1200×630) em `/public`.
- [ ] **Instrutor** — `CONFIG.instructor`: nome, bio, experiência, foto e cases.
      Estão como placeholders `[ ]` de propósito.
- [ ] **FAQ configurável** — `CONFIG.faqConfig`: período de acesso e certificado.
- [ ] **Links legais** — `CONFIG.legal`: termos, privacidade e suporte estão em `#`.
- [ ] **GTM** — descomentar os dois blocos no `index.html` e trocar o ID.
- [ ] **Meta Pixel** — instalar via GTM, não hardcoded.

---

## Tracking

Todo CTA tem `id` e `data-cta`:

| Elemento | id | data-cta |
|---|---|---|
| Header | `#cta-header` | `header` |
| Menu mobile | `#cta-menu` | `menu` |
| Hero | `#cta-hero` | `hero` |
| Fim dos módulos | `#cta-modules` | `modules` |
| Stack da oferta | `#cta-offer` | `offer` |
| CTA final | `#cta-final` | `final` |
| Barra fixa mobile | `#cta-sticky` | `sticky` |

**Gatilho único no GTM:** Click — All Elements, condição
`Click Element` **matches CSS selector** `[data-cta]`.
Crie uma variável DOM lendo o atributo `data-cta` e mande como parâmetro do evento.
Assim você sabe qual seção converteu sem criar 7 gatilhos.

---

## Estrutura

```
index.html                    SEO, Open Graph, GTM (comentado)
public/favicon.svg
public/robots.txt
src/main.jsx                  entry point
src/index.css                 reset mínimo
src/IGamingTrafficPro.jsx     a página inteira + CONFIG no topo
vite.config.js
```

---

## Compliance embutido

Não remova sem substituir por equivalente:

- Badge **"DADOS ILUSTRATIVOS"** no dashboard do hero + disclaimer abaixo.
- Aviso de **exemplo didático** no comparativo de campanhas.
- Nota no Módulo 02 sobre anunciantes autorizados e políticas das plataformas.
- Aviso completo no rodapé (+18, não é plataforma de apostas, sem garantia de resultado).

A página não usa contador regressivo falso, número falso de vagas nem escassez fabricada.
