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
- Testes automatizados com Vitest e Testing Library;
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

### 🧪 Testes Automatizados

- Testes de renderização da tela principal;
- Testes de conversão com API mockada;
- Testes de favoritos;
- Testes de carregamento de histórico salvo no `localStorage`;
- Testes de validação para valor inválido;
- Testes de tratamento de erro da API;
- Execução automática dos testes no pipeline de CI.

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
| Testes        | Vitest + Testing Library |
| Ambiente de Testes | jsdom    |
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
│   ├── test/                  # Configuração e testes automatizados
│   │   ├── Home.test.tsx      # Testes da página principal
│   │   └── setup.ts           # Setup global dos testes
│   ├── App.tsx                # Componente raiz e configuração de rotas
│   ├── main.tsx               # Entry point da aplicação
│   └── index.css              # Estilos globais e variáveis CSS
│
├── .env.example               # Exemplo de variável de ambiente da API
├── index.html                 # Template HTML
├── package.json               # Dependências e scripts
├── vite.config.ts             # Configuração do Vite e Vitest
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

```
VITE ready in Xms

➜  Local:   http://localhost:5173/
```

Abra essa URL no navegador:

```
http://localhost:5173
```

---

### 6. Gere o build de produção (opcional)

```bash
npm run build
```

---

### 7. Execute o lint (opcional)

```bash
npm run lint
```

---

### 8. Execute os testes automatizados (opcional)

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

Os testes atuais cobrem os principais comportamentos da página inicial:

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
- Tratamento de erro quando a API retorna falha.

A configuração dos testes está integrada ao Vite por meio do `vite.config.ts`, utilizando ambiente `jsdom` para simular o navegador durante a execução dos testes.

---

## ⚠️ Observações

- A conversão depende de uma API externa de câmbio;
- É necessário acesso à internet para o funcionamento completo da aplicação;
- Os valores exibidos refletem as cotações em tempo real fornecidas pela API;
- O histórico e os favoritos são mantidos durante a sessão, sem persistência em banco de dados;
- A URL base da API pode ser configurada pela variável `VITE_EXCHANGE_API_URL`;
- O arquivo `.env.example` serve como modelo para configuração local do projeto;
- Os testes automatizados utilizam mocks para validar comportamentos sem depender da API externa em tempo real.

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

### Variáveis de ambiente

A URL base da API de câmbio foi configurada por meio da variável `VITE_EXCHANGE_API_URL`, documentada no arquivo `.env.example`.

Essa decisão facilita a manutenção do projeto, permite trocar a origem da API sem alterar diretamente o código-fonte e deixa a configuração mais clara para quem clonar o repositório.

### Vitest + Testing Library

O Vitest foi escolhido por possuir integração nativa com o ecossistema Vite, permitindo executar testes de forma rápida e com configuração simples.

A Testing Library foi utilizada para testar a aplicação a partir da perspectiva do usuário, validando elementos visíveis na tela, interações e comportamentos importantes, como conversão, favoritos, histórico, validações e tratamento de erro da API.

### CI/CD com GitHub Actions

A pipeline de integração contínua automatiza a instalação de dependências, verificação de lint, verificação de tipagem com TypeScript, execução dos testes automatizados e build de produção a cada novo push na branch `main`, garantindo que o repositório sempre esteja em um estado válido e pronto para deploy.

### Deploy automatizado na Vercel

O deploy na Vercel foi configurado para ser acionado automaticamente a cada atualização na branch `main`, garantindo que a versão publicada esteja sempre sincronizada com o repositório.

---

## 🧾 Releases

### v2.2.0 — Testes automatizados e melhorias de confiabilidade **Latest**

Versão focada na implementação da primeira camada de testes automatizados do projeto, com Vitest, Testing Library, ambiente `jsdom`, testes para renderização, conversão, favoritos, histórico, validações e tratamento de erro da API, além da atualização do workflow para executar testes no GitHub Actions.

Também inclui a configuração da variável de ambiente `VITE_EXCHANGE_API_URL` e o arquivo `.env.example`, facilitando a execução local e a manutenção da integração com a API de câmbio.

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

- Ampliar a cobertura de testes automatizados;
- Adicionar testes para componentes reutilizáveis;
- Adicionar relatório de cobertura no GitHub Actions;
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
