[![CI (Front-end)](https://github.com/felipe-frc/aurora-currency-converter/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/felipe-frc/aurora-currency-converter/actions/workflows/frontend-ci.yml)

# 💱 Aurora Currency Converter

Aplicação web moderna para conversão de moedas em tempo real, com interface sofisticada, histórico de operações, sistema de favoritos e foco em experiência do usuário.

Desenvolvida com **React**, **TypeScript** e **Vite**, a aplicação consome uma API externa de câmbio para exibir cotações atualizadas, permitindo que o usuário converta valores entre múltiplas moedas, salve pares favoritos e consulte o histórico de conversões realizadas na sessão.

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
- Gerenciamento de estado com Context API;
- Componentização e separação de responsabilidades;
- Estilização moderna com Tailwind CSS e glassmorphism;
- Integração contínua com GitHub Actions;
- Deploy automatizado com Vercel;
- Organização profissional de código e documentação para portfólio.

---

## 🚀 Funcionalidades

### 💱 Conversão

- Conversão de moedas em tempo real via API externa;
- Suporte a múltiplas moedas (BRL, USD, EUR, GBP, JPY e outras);
- Inversão rápida entre moeda de origem e destino;
- Exibição de bandeiras para identificação visual das moedas;
- Tratamento de erros de rede e indisponibilidade da API.

### ⭐ Favoritos

- Marcação de pares de moedas como favoritos;
- Acesso rápido aos pares mais usados;
- Persistência de favoritos durante a sessão.

### 📊 Histórico

- Registro automático de todas as conversões realizadas;
- Exibição de histórico com par de moedas, valor e resultado;
- Interface limpa e organizada para consulta.

### 🎨 Interface

- Design moderno com glassmorphism e gradientes;
- Layout totalmente responsivo (mobile e desktop);
- Alternância de tema claro/escuro;
- Notificações toast para feedback de ações;
- Alta performance com Vite como bundler.

---

## 🛠️ Tecnologias

| Camada        | Tecnologia     |
| ------------- | -------------- |
| Linguagem     | TypeScript     |
| Framework     | React          |
| Bundler       | Vite           |
| Estilização   | Tailwind CSS   |
| Componentes   | Radix UI       |
| Roteamento    | Wouter         |
| Ícones        | Lucide Icons   |
| Notificações  | Sonner         |
| Linting       | ESLint         |
| CI/CD         | GitHub Actions |
| Deploy        | Vercel         |
| Versionamento | Git / GitHub   |

---

## 🏗️ Estrutura do Projeto

```
aurora-currency-converter/
│
├── .github/workflows/         # Pipeline de CI/CD
│   └── frontend-ci.yml
│
├── docs/images/               # Imagens utilizadas na documentação
│
├── public/                    # Arquivos públicos (favicon, etc.)
│
├── src/
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/                # Componentes de interface (botões, inputs, etc.)
│   │   └── ErrorBoundary.tsx  # Tratamento de erros em componentes
│   ├── contexts/              # Contextos globais
│   │   └── ThemeContext.tsx   # Gerenciamento de tema claro/escuro
│   ├── lib/                   # Funções utilitárias e helpers
│   ├── pages/                 # Páginas da aplicação
│   │   ├── Home.tsx           # Página principal com conversor
│   │   └── NotFound.tsx       # Página 404
│   ├── App.tsx                # Componente raiz e configuração de rotas
│   ├── main.tsx               # Entry point da aplicação
│   └── index.css              # Estilos globais e variáveis CSS
│
├── index.html                 # Template HTML
├── package.json               # Dependências e scripts
├── vite.config.ts             # Configuração do Vite
├── tsconfig.json              # Configuração TypeScript
└── eslint.config.js           # Configuração do ESLint
```

---

## 📸 Interface do Sistema

### 🏠 Página Principal

Tela inicial do Aurora Currency Converter com o conversor centralizado, seleção de moedas com bandeiras e acesso ao histórico e favoritos.

![Home](./docs/images/home.png)

---

### 💱 Conversão de Moedas

Resultado da conversão em tempo real com exibição do par de moedas, taxa de câmbio atual e botão de inversão rápida.

![Conversão](./docs/images/conversion.png)

---

### 📊 Histórico de Conversões

Painel de histórico com o registro de todas as conversões realizadas na sessão, incluindo par de moedas, valor convertido e resultado.

![Histórico](./docs/images/history.png)

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos

- Node.js 18 ou superior;
- npm ou yarn;
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

### 4. Execute o projeto em modo de desenvolvimento

```bash
npm run dev
```

Após iniciar, o terminal exibirá uma URL parecida com:

```
VITE ready in Xms

➜  Local:   http://localhost:5173/
```

Abra essa URL no navegador:

```
http://localhost:5173
```

---

### 5. Gere o build de produção (opcional)

```bash
npm run build
```

---

### 6. Execute o lint (opcional)

```bash
npm run lint
```

---

## ⚠️ Observações

- A conversão depende de uma API externa de câmbio;
- É necessário acesso à internet para o funcionamento completo da aplicação;
- Os valores exibidos refletem as cotações em tempo real fornecidas pela API;
- O histórico e os favoritos são mantidos durante a sessão, sem persistência em banco de dados.

---

## 🧠 Decisões de Desenvolvimento

### React + TypeScript

O uso de React com TypeScript garante tipagem estática em toda a aplicação, reduzindo erros em tempo de execução e tornando o código mais seguro, escalável e fácil de manter. A tipagem dos dados retornados pela API de câmbio foi especialmente importante para evitar falhas silenciosas.

### Vite como bundler

O Vite foi adotado como ferramenta de build por oferecer tempo de inicialização muito mais rápido em relação a bundlers tradicionais, além de suporte nativo a TypeScript e Hot Module Replacement (HMR) em desenvolvimento.

### Radix UI + Tailwind CSS

A combinação de Radix UI e Tailwind CSS permite construir componentes acessíveis e estilizados com eficiência. O Radix UI fornece a base comportamental dos componentes (dropdowns, diálogos, etc.), enquanto o Tailwind cuida da estilização visual com consistência.

### Context API para gerenciamento de tema

O gerenciamento do tema claro/escuro foi implementado com Context API, evitando a necessidade de bibliotecas externas de estado para uma funcionalidade pontual como essa. O tema é aplicado globalmente via variáveis CSS.

### ErrorBoundary

Um componente de ErrorBoundary foi implementado para capturar erros em tempo de execução nos componentes React, exibindo uma tela amigável ao usuário em vez de uma tela em branco, o que melhora a experiência e a robustez da aplicação.

### CI/CD com GitHub Actions

A pipeline de integração contínua automatiza a instalação de dependências, verificação de tipagem com TypeScript e build de produção a cada novo push na branch `main`, garantindo que o repositório sempre esteja em um estado válido e pronto para deploy.

### Deploy automatizado na Vercel

O deploy na Vercel foi configurado para ser acionado automaticamente a cada atualização na branch `main`, garantindo que a versão publicada esteja sempre sincronizada com o repositório.

---

## 🧾 Releases

### v2.1.0 — Limpeza estrutural e melhorias de manutenção

Versão focada em organização interna: remoção de arquivos e componentes não utilizados, correções de lint, ajustes no ThemeContext e melhoria na legibilidade do código da página principal.

### v2.0.1 — Correções de metadados e documentação

Ajustes pontuais nos metadados do `package.json`, com substituição de URLs genéricas pelos links oficiais do repositório, e atualização da seção de autor no README.

### v2.0.0 — Repaginação visual, melhorias de UX e integração contínua

Versão com maior evolução até então: repaginação completa da interface, implementação de bandeiras nas moedas, melhoria no dropdown de seleção, refinamentos gerais de UX, adição do workflow de GitHub Actions e remoção de arquivos duplicados do repositório.

### v1.0.0 — Primeira versão estável

Lançamento inicial com as funcionalidades principais: conversão em tempo real, interface responsiva, histórico de conversões, sistema de favoritos, tratamento de erros e persistência via localStorage.

---

## 📈 Melhorias Futuras

- Gráficos de variação cambial com histórico por período;
- Alertas de preço para pares de moedas monitorados;
- Detecção automática de localização para seleção padrão de moeda;
- Persistência de dados com backend próprio;
- Sistema de autenticação para histórico entre sessões;
- Suporte a mais moedas e criptomoedas;
- PWA (Progressive Web App) para uso offline.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👨‍💻 Autor

**Marcos Felipe França**

[LinkedIn](https://www.linkedin.com/in/marcosfelipefrc) · [GitHub](https://github.com/felipe-frc)
