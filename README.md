# SQA Social Media

Projeto educacional de qualidade de software com uma API Spring Boot, um frontend Next.js e testes automatizados em diferentes níveis.

## Visão Geral

- `api/`: backend Java 17 com Spring Boot, autenticação, usuários, posts e curtidas.
- `client/`: frontend Next.js/React que consome a API.
- `e2e/`: testes Playwright para fluxos de interface e endpoints da API.

Principais rotas da aplicação:

- Frontend: `http://localhost:3000`
- API: `http://localhost:8080`

## Como Rodar

Pré-requisitos:

- Java 17+
- Node.js 18+
- npm
- MySQL configurado para o ambiente de desenvolvimento

API:

```bash
cd api
./mvnw spring-boot:run
```

Frontend:

```bash
cd client
npm install
npm run dev
```

O frontend usa `NEXT_PUBLIC_BASE_URL` para definir a URL da API. Exemplo de `.env` em `client/`:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8080
```

## Testes

API:

```bash
cd api
./mvnw test
```

Frontend:

```bash
cd client
npm test
```

E2E/API com Playwright:

```bash
cd e2e
npm install
npx playwright install
npm test
```

Para rodar apenas uma parte dos testes Playwright:

```bash
npm run test:e2e
npm run test:api
```

Os testes Playwright esperam que a API esteja em `http://localhost:8080` e o frontend em `http://localhost:3000`.

## GitHub Actions

O repositório possui dois workflows principais em `.github/workflows/`.

`ci.yml` roda em pushes para `main` e em pull requests. Ele executa:

- testes e build da API;
- testes do frontend com coverage;
- análise do SonarQube após os jobs de API e frontend.

`e2e.yml` roda em pushes para `main` e também pode ser acionado manualmente. Ele prepara MySQL, Java, Node.js e Playwright, sobe API e frontend no runner e executa os testes da pasta `e2e/`. Ao final, publica o relatório HTML do Playwright como artifact quando disponível.

## Documentações

- [README da API](api/README.md)
- [README do Frontend](client/README.md)
- [README dos Testes (Playwright)](e2e/README.md)
- [DummyJSON API Docs](https://dummyjson.com/docs)
