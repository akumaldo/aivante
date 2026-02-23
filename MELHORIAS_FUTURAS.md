# AINOVA - Melhorias Futuras para Avaliacao

## Formulario & Backend
- [ ] Configurar Formspree (ou Resend/SendGrid) com form ID real no CTA.tsx
  - Trocar `YOUR_FORM_ID` em `fetch('https://formspree.io/f/YOUR_FORM_ID', ...)`
  - Alternativa: criar API propria com Next.js/Vercel Functions
- [ ] Trocar email placeholder `contato@ainova.com.br` pelo email real
- [ ] Adicionar integracao com Calendly/Cal.com para o botao "Agendar Sessao"

## Links & Redes Sociais
- [ ] Atualizar URL do LinkedIn em About.tsx e Footer.tsx (`https://linkedin.com/company/ainova`)
  - Trocar pela URL real do perfil/empresa

## SEO & Performance
- [ ] Adicionar og:image e twitter:image no index.html (precisa de uma imagem de preview)
- [ ] Implementar code-splitting com React.lazy() para reduzir bundle inicial
  - Sugestao: lazy load das secoes abaixo do fold (Problem, Solution, Framework, etc.)
- [ ] Adicionar Google Analytics / GTM para tracking de conversoes
- [ ] Criar sitemap.xml e robots.txt
- [ ] Adicionar structured data (JSON-LD) para SEO

## Identidade Visual
- [ ] Criar logo real da AINOVA (SVG) para substituir o favicon inline e o placeholder "AINOVA" no About
- [ ] Considerar adicionar um header/navbar fixo para desktop (alem dos dots na lateral)

## Conteudo
- [x] Avaliar mix portugues/ingles nos termos tecnicos
  - Decisao: manter ingles para termos consagrados (workflow, pipeline, ROI, compliance, deploy)
  - Conceitos proprietarios do framework em ingles com subtitulo PT (ex: Intelligence Throughput / Vazao de Inteligencia)
  - Descricoes, CTAs e labels em portugues natural
- [ ] Adicionar depoimentos/cases de sucesso quando disponivel
- [ ] Criar pagina de Politica de Privacidade (link no Footer)

## Infraestrutura
- [ ] Adicionar React Router se precisar de paginas adicionais (blog, termos, cases)
- [ ] Configurar CI/CD (GitHub Actions -> Vercel/Netlify)
- [ ] Inicializar repositorio Git

## Componentes shadcn/ui
- [x] Limpeza concluida: 47 componentes nao utilizados removidos
- Restantes (em uso): accordion, button, input, select, textarea
- CSS reduzido de 96KB para 41KB com a limpeza
