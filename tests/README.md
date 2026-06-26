# Testes de sistema

Projeto independente de testes de caixa-preta com Playwright.

## Instalacao

Na raiz do repositorio:

```bash
npm --prefix client ci
npm --prefix tests ci
```

O projeto usa o Google Chrome instalado no computador; nao e necessario baixar um Chromium separado.

## Execucao

```bash
cd tests
npm test
```

O Playwright inicia automaticamente a API na porta 18081 com H2 em memoria e o frontend na porta 13000. Tambem e possivel executar grupos separados:

```bash
npm run test:api
npm run test:e2e
npm run test:headed
```

Resultado esperado: 6 testes aprovados, sendo 4 de API e 2 E2E.
