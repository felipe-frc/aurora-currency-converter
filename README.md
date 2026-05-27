[![CI (Front-end)](https://github.com/felipe-frc/aurora-currency-converter/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/felipe-frc/aurora-currency-converter/actions/workflows/frontend-ci.yml)

# 💱 Aurora Currency Converter

Aplicação web moderna para conversão de moedas em tempo real, com interface sofisticada, histórico de operações, sistema de favoritos, alternância real entre tema claro/escuro e foco em experiência do usuário.

Desenvolvida com **React**, **TypeScript**, **Vite** e **Tailwind CSS**, a aplicação consome uma API externa de câmbio para exibir cotações atualizadas, permitindo que o usuário converta valores entre múltiplas moedas, salve pares favoritos, consulte o histórico de conversões e personalize a experiência visual com persistência de tema no navegador.

---

## 🌐 Acesse o Projeto

🔗 **Deploy:** [aurora-currency-converter.vercel.app](https://aurora-currency-converter.vercel.app/)

📂 **Repositório:** [github.com/felipe-frc/aurora-currency-converter](https://github.com/felipe-frc/aurora-currency-converter)

A aplicação está publicada na **Vercel** com deploy automatizado a cada atualização enviada para a branch `main`.

---

## 📌 Objetivo do Projeto

Este projeto foi desenvolvido com o objetivo de praticar e demonstrar conhecimentos em:

- Desenvolvimento front-end moderno com React e TypeScript;
- Consumo de APIs externas para dados em tempo real;
- Componentização e separação de responsabilidades;
- Gerenciamento de estado com Context API;
- Criação de hooks reutilizáveis;
- Persistência de dados no `localStorage`;
- Estilização moderna com Tailwind CSS, gradientes e glassmorphism;
- Implementação de tema claro/escuro com variáveis CSS;
- Testes automatizados com Vitest e Testing Library;
- Integração contínua com GitHub Actions;
- Deploy automatizado com Vercel;
- Organização profissional de código e documentação para portfólio.

---

## 🚀 Funcionalidades

### 💱 Conversão

- Conversão de moedas em tempo real via API externa;
- Suporte a múltiplas moedas, incluindo BRL, USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY e ARS;
- Inversão rápida entre moeda de origem e moeda de destino;
- Exibição de bandeiras para identificação visual das moedas;
- Resultado formatado com `Intl.NumberFormat`;
- Exibição da taxa de câmbio utilizada na conversão;
- Tratamento de erros de rede, resposta inválida, moeda não suportada e indisponibilidade da API.

### ⭐ Favoritos

- Marcação de pares de moedas como favoritos;
- Acesso rápido aos pares mais usados;
- Limite controlado de favoritos;
- Validação para impedir favoritos duplicados;
- Persistência dos favoritos no `localStorage`;
- Remoção individual de favoritos;
- Limpeza completa da lista de favoritos.

### 📊 Histórico

- Registro automático das conversões realizadas;
- Exibição do valor original, valor convertido, taxa utilizada e horário da operação;
- Histórico formatado com padrão brasileiro de data e hora;
- Limite controlado de registros;
- Persistência do histórico no `localStorage`;
- Limpeza completa do histórico.

### 🌗 Tema claro/escuro

- Alternância real entre tema claro e tema escuro;
- Botão visual para troca de tema;
- Persistência da preferência do usuário no `localStorage`;
- Aplicação das classes `dark` e `light` no `document.documentElement`;
- Tema claro com fundo suave, cards destacados, bordas visíveis e melhor contraste;
- Tema escuro mantendo a identidade visual neon/glassmorphism do projeto.

### 🎨 Interface

- Design moderno com glassmorphism, gradientes e elementos translúcidos;
- Layout responsivo para mobile e desktop;
- Selects customizados com Radix UI;
- Notificações toast com Sonner;
- Feedback visual para carregamento, erros e ações concluídas;
- Botões, cards, inputs e listas com foco em legibilidade e usabilidade.

### 🧪 Testes automatizados

- Testes de renderização da tela principal;
- Testes de conversão com API mockada;
- Testes de favoritos;
- Testes de carregamento de histórico salvo no `localStorage`;
- Testes de validação para valor inválido;
- Testes de tratamento de erro da API;
- Testes do service de câmbio;
- Testes do hook `useLocalStorage`;
- Testes dos helpers de formatação monetária;
- Testes do `ThemeProvider`, `useTheme` e `ThemeToggle`;
- Execução automática dos testes no pipeline de CI.

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
| --- | --- |
| Linguagem | TypeScript |
| Biblioteca | React |
| Bundler | Vite |
| Estilização | Tailwind CSS |
| Componentes acessíveis | Radix UI |
| Roteamento | Wouter |
| Ícones | Lucide React |
| Notificações | Sonner |
| Testes | Vitest + Testing Library |
| Ambiente de testes | jsdom |
| Linting | ESLint |
| CI/CD | GitHub Actions |
| Deploy | Vercel |
| Versionamento | Git / GitHub |

---

## 🏗️ Estrutura do Projeto

```txt
aurora-currency-converter/
│
├── .github/
│   └── workflows/
│       └── frontend-ci.yml          # Pipeline de validação do front-end
│
├── docs/
│   └── images/                      # Imagens utilizadas na documentação
│       ├── conversion.png
│       ├── history.png
│       └── home.png
│
├── public/                          # Arquivos públicos
│
├── src/
│   ├── components/
│   │   ├── currency/                # Componentes específicos do conversor
│   │   │   ├── CurrencyResult.tsx
│   │   │   ├── CurrencySelect.tsx
│   │   │   ├── FavoritesList.tsx
│   │   │   ├── FlagImage.tsx
│   │   │   └── HistoryList.tsx
│   │   │
│   │   ├── theme/                   # Componentes relacionados ao tema
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── ThemeToggle.test.tsx
│   │   │
│   │   ├── ui/                      # Componentes base de interface
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── sonner.tsx
│   │   │
│   │   └── ErrorBoundary.tsx        # Tratamento de erro em componentes React
│   │
│   ├── contexts/                    # Contextos globais da aplicação
│   │   ├── theme.ts                 # Tipos, chave de storage e contexto de tema
│   │   ├── ThemeContext.tsx         # Provider do tema
│   │   ├── ThemeContext.test.tsx    # Testes do contexto de tema
│   │   └── useTheme.ts              # Hook para consumir o tema
│   │
│   ├── data/
│   │   └── currencies.ts            # Lista de moedas e helpers de moeda
│   │
│   ├── hooks/
│   │   ├── useLocalStorage.ts       # Hook reutilizável para localStorage
│   │   └── useLocalStorage.test.tsx # Testes do hook
│   │
│   ├── lib/
│   │   └── utils.ts                 # Utilitário para composição de classes
│   │
│   ├── pages/
│   │   ├── Home.tsx                 # Página principal da aplicação
│   │   └── NotFound.tsx             # Página 404
│   │
│   ├── services/
│   │   ├── exchangeService.ts       # Comunicação e validação da API de câmbio
│   │   └── exchangeService.test.ts  # Testes do service de câmbio
│   │
│   ├── test/
│   │   ├── Home.test.tsx            # Testes da página principal
│   │   └── setup.ts                 # Setup global dos testes
│   │
│   ├── types/
│   │   └── currency.ts              # Tipos de moeda, favoritos e conversões
│   │
│   ├── utils/
│   │   ├── formatCurrency.ts        # Helpers de formatação monetária
│   │   └── formatCurrency.test.ts   # Testes dos helpers
│   │
│   ├── App.tsx                      # Componente raiz, rotas, provider e tema
│   ├── index.css                    # Estilos globais, variáveis e temas
│   ├── main.tsx                     # Entry point da aplicação
│   └── vite-env.d.ts                # Tipagens do Vite
│
├── .env.example                     # Exemplo de variável de ambiente da API
├── .gitignore
├── eslint.config.js
├── index.html
├── LICENSE
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 📸 Interface do Sistema

### 🏠 Página Principal

Tela inicial do Aurora Currency Converter com o conversor centralizado, seleção de moedas com bandeiras, alternância de tema e acesso ao histórico e favoritos.

![Home](./docs/images/home.png)

---

### 💱 Conversão de Moedas

Resultado da conversão em tempo real com exibição do par de moedas, taxa de câmbio atual e botão de inversão rápida.

![Conversão](./docs/images/conversion.png)

---

### 📊 Histórico de Conversões

Painel de histórico com o registro das conversões realizadas, incluindo par de moedas, valor convertido, taxa utilizada e horário da operação.

![Histórico](./docs/images/history.png)

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos

- Node.js 20 ou superior;
- npm;
- Git instalado.

---

### 1. Clone o repositório

```bash
git clone https://github.com/felipe-frc/aurora-currency-converter.git
```

---

### 2. Acesse a pasta do projeto

```bash
cd aurora-currency-converter
```

---

### 3. Instale as dependências

```bash
npm install
```

---

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no arquivo `.env.example`.

No Windows:

```bash
copy .env.example .env
```

No Linux/macOS:

```bash
cp .env.example .env
```

O arquivo `.env` deve conter:

```env
VITE_EXCHANGE_API_URL=https://api.exchangerate-api.com/v4/latest
```

> A API utilizada nesta versão não exige chave de autenticação. A variável acima permite configurar a URL base da API de câmbio usada pela aplicação.

---

### 5. Execute o projeto em modo de desenvolvimento

```bash
npm run dev
```

Após iniciar, o terminal exibirá uma URL parecida com:

```txt
VITE ready in Xms

➜  Local:   http://localhost:5173/
```

Abra essa URL no navegador:

```txt
http://localhost:5173
```

---

### 6. Gere o build de produção

```bash
npm run build
```

---

### 7. Execute o lint

```bash
npm run lint
```

---

### 8. Execute a verificação de tipos

```bash
npm run type-check
```

---

### 9. Execute os testes automatizados

Para executar os testes uma única vez:

```bash
npm run test:run
```

Para executar os testes em modo observação durante o desenvolvimento:

```bash
npm run test
```

Para executar os testes com relatório de cobertura:

```bash
npm run test:coverage
```

---

## 🧪 Testes Automatizados

O projeto possui testes automatizados configurados com **Vitest**, **Testing Library** e **jsdom**, garantindo mais confiabilidade na evolução da aplicação.

Os testes atuais cobrem:

- Renderização da tela principal do conversor;
- Exibição do título, subtítulo, campo de valor e botões principais;
- Conversão de moedas com retorno de API mockado;
- Verificação da chamada correta para a API de câmbio;
- Exibição do resultado da conversão;
- Exibição da taxa de câmbio utilizada;
- Registro da conversão no histórico;
- Salvamento de par de moedas como favorito;
- Carregamento de histórico salvo no `localStorage`;
- Validação para impedir conversão com valor inválido;
- Tratamento de erro quando a API retorna falha;
- Validação do service `fetchExchangeRate`;
- Validação do hook `useLocalStorage`;
- Validação dos helpers `formatCurrency` e `formatExchangeRate`;
- Validação do `ThemeProvider`;
- Validação do hook `useTheme`;
- Validação do componente `ThemeToggle`.

A configuração dos testes está integrada ao Vite por meio do `vite.config.ts`, utilizando ambiente `jsdom` para simular o navegador durante a execução dos testes.

---

## 🔁 CI/CD

O projeto possui pipeline de integração contínua com **GitHub Actions**.

A cada `push` ou `pull_request` para a branch `main`, o workflow executa:

```bash
npm ci
npm run lint
npm run type-check
npm run test:run
npm run build
```

Isso garante que o projeto só evolua com lint, tipagem, testes e build de produção funcionando corretamente.

---

## ⚠️ Observações

- A conversão depende de uma API externa de câmbio;
- É necessário acesso à internet para o funcionamento completo da aplicação;
- Os valores exibidos refletem as cotações em tempo real fornecidas pela API;
- O histórico, favoritos e tema são persistidos no `localStorage`;
- A URL base da API pode ser configurada pela variável `VITE_EXCHANGE_API_URL`;
- O arquivo `.env.example` serve como modelo para configuração local do projeto;
- Os testes automatizados utilizam mocks para validar comportamentos sem depender da API externa em tempo real.

---

## 🧠 Decisões de Desenvolvimento

### React + TypeScript

O uso de React com TypeScript garante tipagem estática em toda a aplicação, reduzindo erros em tempo de execução e tornando o código mais seguro, escalável e fácil de manter.

### Vite como bundler

O Vite foi adotado como ferramenta de build por oferecer tempo de inicialização rápido, suporte moderno a TypeScript e integração simples com Vitest.

### Tailwind CSS + Radix UI

A combinação de Tailwind CSS com Radix UI permite construir uma interface estilizada, responsiva e acessível. O Radix UI fornece a base comportamental dos componentes, enquanto o Tailwind concentra a estilização visual.

### Service para API de câmbio

A comunicação com a API externa foi separada em `exchangeService.ts`, isolando a montagem da URL, a chamada `fetch`, a validação da resposta HTTP e o tratamento de taxas inválidas.

Essa separação deixa a `Home.tsx` mais limpa e facilita a criação de testes automatizados para a integração com a API.

### Hook `useLocalStorage`

A lógica de leitura, validação e escrita no `localStorage` foi extraída para um hook reutilizável, permitindo reaproveitamento em histórico, favoritos e futuras preferências da aplicação.

### Context API para tema claro/escuro

O tema claro/escuro foi implementado com Context API, persistência no `localStorage` e aplicação global das classes `dark` e `light` no `document.documentElement`.

A estrutura foi separada em `theme.ts`, `ThemeContext.tsx` e `useTheme.ts` para manter compatibilidade com Fast Refresh e evitar problemas no CI.

### Formatação monetária com Intl

A formatação de valores e taxas foi extraída para helpers próprios usando `Intl.NumberFormat`, permitindo exibição mais profissional dos valores monetários no padrão brasileiro.

### ErrorBoundary

O componente `ErrorBoundary` captura erros em tempo de execução nos componentes React, exibindo uma tela amigável em vez de uma tela em branco.

### Variáveis de ambiente

A URL base da API de câmbio foi configurada por meio da variável `VITE_EXCHANGE_API_URL`, documentada no arquivo `.env.example`.

### Vitest + Testing Library

O Vitest foi escolhido por ter integração nativa com o ecossistema Vite. A Testing Library foi utilizada para testar a aplicação a partir da perspectiva do usuário, validando interações, elementos visíveis e comportamentos importantes.

### CI/CD com GitHub Actions

A pipeline automatiza instalação, lint, tipagem, testes e build de produção, garantindo uma base mais segura para evolução do projeto.

### Deploy automatizado na Vercel

O deploy na Vercel é atualizado automaticamente a cada alteração enviada para a branch `main`, mantendo a versão publicada sincronizada com o repositório.

---

## 🧾 Releases

### v2.3.0 — Tema claro/escuro, refatoração e testes **Latest**

Versão focada na implementação real de tema claro/escuro, com botão de alternância, persistência no `localStorage`, aplicação das classes `dark` e `light` no `document.documentElement` e ajustes visuais para melhorar contraste e legibilidade no tema claro.

Também inclui uma refatoração importante da página principal, com separação de responsabilidades em componentes, service, hook, helpers de formatação e testes específicos.

Principais entregas:

- Implementação real de tema claro/escuro;
- Criação do `ThemeToggle`;
- Criação e reorganização do contexto de tema;
- Persistência da preferência de tema no `localStorage`;
- Separação de tipos, dados, components, service, hooks e utils;
- Extração de `CurrencySelect`, `CurrencyResult`, `FavoritesList`, `HistoryList` e `FlagImage`;
- Criação do `exchangeService`;
- Criação do hook `useLocalStorage`;
- Criação dos helpers `formatCurrency` e `formatExchangeRate`;
- Melhoria de contraste do tema claro;
- Testes para tema, botão de tema, service, hook e formatação monetária;
- Ajustes nos testes da Home;
- Correção de estrutura para compatibilidade com Fast Refresh no CI.

### v2.2.0 — Testes automatizados e melhorias de confiabilidade

Versão focada na implementação da primeira camada de testes automatizados do projeto, com Vitest, Testing Library, ambiente `jsdom`, testes para renderização, conversão, favoritos, histórico, validações e tratamento de erro da API, além da atualização do workflow para executar testes no GitHub Actions.

Também inclui a configuração da variável de ambiente `VITE_EXCHANGE_API_URL` e o arquivo `.env.example`, facilitando a execução local e a manutenção da integração com a API de câmbio.

### v2.1.0 — Limpeza estrutural e melhorias de manutenção

Versão focada em organização interna: remoção de arquivos e componentes não utilizados, correções de lint, ajustes no `ThemeContext` e melhoria na legibilidade do código da página principal.

### v2.0.1 — Correções de metadados e documentação

Ajustes pontuais nos metadados do `package.json`, com substituição de URLs genéricas pelos links oficiais do repositório, e atualização da seção de autor no README.

### v2.0.0 — Repaginação visual, melhorias de UX e integração contínua

Versão com grande evolução visual e estrutural: repaginação completa da interface, implementação de bandeiras nas moedas, melhoria no dropdown de seleção, refinamentos gerais de UX, adição do workflow de GitHub Actions e remoção de arquivos duplicados do repositório.

### v1.0.0 — Primeira versão estável

Lançamento inicial com as funcionalidades principais: conversão em tempo real, interface responsiva, histórico de conversões, sistema de favoritos, tratamento de erros e persistência via `localStorage`.

---

## 📈 Melhorias Futuras

- Atualizar a versão do `package.json` para refletir a release mais recente;
- Adicionar relatório de cobertura no GitHub Actions;
- Adicionar testes específicos para mais componentes reutilizáveis;
- Adicionar screenshots atualizados do tema claro e do tema escuro;
- Adicionar gráfico de variação cambial por período;
- Adicionar alertas de preço para pares de moedas monitorados;
- Adicionar detecção automática de localização para seleção padrão de moeda;
- Adicionar PWA para experiência instalável;
- Persistir dados em backend próprio;
- Criar autenticação para histórico entre dispositivos;
- Suportar mais moedas e criptomoedas.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

**Marcos Felipe França**

[LinkedIn](https://www.linkedin.com/in/marcosfelipefrc) · [GitHub](https://github.com/felipe-frc)
