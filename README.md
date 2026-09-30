# Golden Raspberry Awards

Aplicação web desenvolvida em **Angular 22** para visualização e consulta de dados dos indicados e vencedores da categoria *Pior Filme* do prestigiado **Golden Raspberry Awards** (Framboesa de Ouro), atendendo integralmente à especificação do teste prático.

---

## 🎯 Funcionalidades

### 1. Dashboard (`/dashboard`)
Dividido em 4 painéis de visualização rápida em grid responsivo:
- **List years with multiple winners:** Tabela com os anos que tiveram mais de um vencedor e a respectiva contagem de prêmios.
- **Top 3 studios with winners:** Tabela exibindo os 3 estúdios com maior número de premiações e o número de vitórias.
- **Producers with longest and shortest interval between wins:** Duas tabelas destacando produtores com intervalos de vitórias:
  - *Maximum*: Maior intervalo entre vitórias consecutivas.
  - *Minimum*: Menor intervalo entre vitórias consecutivas.
- **List movie winners by year:** Campo numérico de busca por ano com tabela reativa listando os vencedores daquele ano específico.

### 2. Lista de Filmes (`/movies`)
- Tabela paginada com colunas: **ID**, **Year**, **Title** e **Winner?**.
- **Filtro por Ano:** Campo numérico com *debounce* reativo (350ms) para evitar requisições redundantes a cada caractere digitado.
- **Filtro por Vencedor:** Seletor com opções `Yes/No`, `Yes` e `No`.
- **Paginação:** Controle de páginas integrado à API via Angular Material Paginator, com suporte a reset automático ao alterar filtros.

---

## 🏛️ Arquitetura e Padrões de Projeto

O projeto foi construído seguindo rigorosamente os princípios da **Clean Architecture** (Arquitetura Limpa) e as melhores práticas do Angular:

```text
src/app/
├── core/
│   ├── domain/               # Camada de Domínio (independente de framework/HTTP)
│   │   ├── models/           # Entidades e modelos de dados (Movie, Dashboard, Pagination)
│   │   ├── repositories/     # Interfaces de repositório (MovieRepository / Token de DI)
│   │   └── usecases/         # Casos de uso de negócio (GetDashboardData, GetMovies, GetWinnersByYear)
│   └── infrastructure/       # Camada de Infraestrutura
│       └── repositories/     # Implementação do repositório consumindo a API REST (HttpClient)
└── presentation/             # Camada de Apresentação
    └── features/             # Componentes de páginas standalone
        ├── dashboard/        # View do Dashboard
        └── movie-list/       # View da Lista de Filmes
```

### Destaques Técnicos:
- **Angular 22 Standalone Components:** Sem `NgModule` legados.
- **Zoneless Change Detection:** Configurado com `provideZonelessChangeDetection()`.
- **Reatividade com Angular Signals:** Gerenciamento de estado com `signal()`, `computed()` e estratégia `ChangeDetectionStrategy.OnPush` em 100% dos componentes.
- **Dependency Inversion (DIP):** Injeção de dependência via `InjectionToken` desacoplando regras de negócio dos detalhes HTTP.
- **UI Moderna com Angular Material:** Utilização de `@angular/material` (Cards, Tables, Form Fields, Inputs, Selects, Paginator).
- **Sem waterfalls:** Requisições paralelas com `forkJoin` para carregamento instantâneo do dashboard.
- **Resolução Responsiva:** Design otimizado para resoluções padrão desktop e telas de tablets (mínimo de 768x1280).

---

## 🛠️ Pré-requisitos

- **Node.js:** Versão `>= 22.22.3` ou `>= 24.15.0` ou `>= 26.0.0` (recomendado: Node v22 LTS ou v26).
- **NPM:** `>= 10.x`

---

## 🚀 Instalação e Execução

### 1. Clonar o repositório e instalar as dependências:
```bash
npm install
```

### 2. Iniciar o servidor de desenvolvimento:
```bash
npm start
# ou
npx ng serve
```
Acesse a aplicação no navegador em: [http://localhost:4200](http://localhost:4200)

### 3. Executar o linter de código (ESLint):
```bash
npm run lint
```

### 4. Executar os testes unitários (Vitest):
```bash
npm test
# ou em modo headless sem watch:
npx ng test --no-watch
```

### 5. Gerar build de produção:
```bash
npm run build
```

---

## 🧪 Cobertura de Testes Unitários (TDD)

A suíte de testes utiliza o test runner **Vitest** integrado nativamente ao Angular CLI, cobrindo todas as camadas:

- **Infraestrutura / HTTP:** `MovieHttpRepository` testado via `HttpTestingController` validando chamadas e parâmetros de query (`page`, `size`, `year`, `winner`, `projection`).
- **Casos de Uso:** `GetDashboardDataUseCase`, `GetMoviesUseCase` e `GetWinnersByYearUseCase` testados com mocks de repositório e validação de operadores reativos (`forkJoin`).
- **Componentes:** `DashboardComponent` e `MovieListComponent` com validação de renderização, computação de Top 3 estúdios, paginação e filtragens com debounce.

Total de **27 testes unitários automatizados**, todos passando com sucesso.

---

## 🌐 API Externa Consumida

- **Base URL:** `https://challenge.outsera.tech/api/movies` (configurada via `src/environments/environment.ts`)
- **Projeções utilizadas:**
  - `years-with-multiple-winners`
  - `studios-with-win-count`
  - `max-min-win-interval-for-producers`
