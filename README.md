# Automation Exercise - Trabalho de Automacao Web

Projeto individual de conclusao da disciplina de Automacao Web da PGATS.
Aplicacao: https://www.automationexercise.com
Fonte dos cenarios: https://www.automationexercise.com/test_cases

## Tecnologias

- Cypress **13.17.0**, ultima versao publicada da serie 13, fixada sem `^`.
- JavaScript, Mocha e Chai, disponibilizados pelo Cypress.
- `cypress-mochawesome-reporter` para relatorio HTML com evidencias.
- GitHub Actions com Node.js 22 e Electron headless.

## Instalacao e execucao

Recomendado: Node.js 22 LTS e npm. E necessario acesso a internet, tanto para
instalar o Cypress quanto para testar a aplicacao publica.

```sh
npm ci
npm test
```

Abrir o runner interativo:

```sh
npm run cy:open
```

Executar no Chrome instalado na maquina:

```sh
npm run test:chrome
```

Executar somente compras:

```sh
npm test -- --spec cypress/e2e/05-compras.cy.js
```

Se o npm estiver configurado para um registro corporativo sem acesso ao pacote,
e a politica da sua rede permitir o registro publico:

```sh
npm ci --registry=https://registry.npmjs.org
```

Se o download/descompactacao do binario for interrompido, execute
`npx cypress install` antes de tentar os testes novamente. Nao e necessario
alterar a configuracao global do npm.

## Cenarios implementados

| Caso | Comportamento | Arquivo em cypress/e2e |
| --- | --- | --- |
| 01 | Cadastro completo, login automatico e exclusao | 01-cadastro.cy.js |
| 02 | Login com credenciais corretas e exclusao | 02-autenticacao.cy.js |
| 03 | Login com email e senha incorretos | 02-autenticacao.cy.js |
| 04 | Logout e retorno para login | 02-autenticacao.cy.js |
| 05 | Cadastro com email existente | 02-autenticacao.cy.js |
| 08 | Catalogo e detalhes do primeiro produto | 03-produtos.cy.js |
| 09 | Busca e verificacao dos produtos encontrados | 03-produtos.cy.js |
| 10 | Inscricao na newsletter da pagina inicial | 04-inscricao.cy.js |
| 15 | Compra apos cadastro pela interface | 05-compras.cy.js |
| 16 | Compra apos login pela interface | 05-compras.cy.js |

Os dez testes sao independentes e podem ser executados isoladamente.
Nos casos de compra sao adicionados dois produtos, conferidos os enderecos de
entrega e cobranca, revisado o pedido e preenchidos os dados ficticios de pagamento.

## Organizacao e boas praticas

```text
.github/workflows/cypress.yml   Execucao e publicacao de artefatos no CI
cypress.config.js              URL base, timeouts, evidencias e reporter
cypress/e2e/                   Dez casos distribuidos por funcionalidade
cypress/fixtures/payment.json  Cartao ficticio de teste
cypress/support/commands.js    Cadastro, autenticacao, seletores e APIs de apoio
cypress/support/checkout.js    Catalogo, carrinho e checkout reutilizaveis
cypress/support/e2e.js         Hooks globais e registro dos comandos
cypress/support/user.js        Fabrica de usuarios unicos por teste/tentativa
```

- Modularizacao por comandos customizados, conforme permitido pelo professor.
- Preferencia por `data-qa`; IDs, atributos semanticos e seletores por contexto
  quando a aplicacao nao fornece um atributo dedicado a testes.
- Sem XPath, esperas fixas, cliques forcados ou dependencia entre testes.
- APIs oficiais usadas somente na preparacao de contas existentes e na limpeza.
  Cadastro dos casos 01 e 15, login, compra e exclusao exigidos sao feitos pela UI.
- `afterEach` tenta excluir a conta mesmo se o teste falhar. Aceita conta ja excluida.
  Interrupcao abrupta do processo pode impedir o hook de limpeza.
- Emails exclusivos de exemplo; nenhuma conta pessoal ou segredo e necessario.
- Isolamento padrao do Cypress mantido. Nao ha supressao global de erros JavaScript.
- Apenas dominios externos de publicidade sao interceptados para evitar anuncios
  sobrepostos; respostas funcionais da aplicacao nao sao simuladas.
- Uma repeticao automatica no modo headless para oscilacoes do site publico;
  tentativas sao preservadas no relatorio. Modo interativo sem repeticao.

### Confirmacao de pagamento

O roteiro oficial cita `Your order has been placed successfully!`. Na versao
observada da aplicacao, esse texto fica em um elemento inicialmente oculto no
formulario. A confirmacao final visivel, apos o envio real, e `Order Placed!` com
`Congratulations! Your order has been confirmed!`. Os testes verificam essa tela
e a URL `/payment_done/<id>`, sem tornar elementos ocultos visiveis artificialmente.

## Relatorios e evidencias

Ao terminar `npm test`, abra `cypress/reports/index.html` no navegador.
O relatorio e consolidado para todos os arquivos executados e inclui capturas de
falha. Os videos ficam em `cypress/videos/` e tambem sao copiados para o relatorio.
Cada nova execucao substitui o relatorio anterior.

No GitHub: **Actions > Testes E2E - Automation Exercise > execucao > Artifacts**.
Baixe `relatorio-mochawesome-<numero>`, extraia e abra `index.html`.
Os artefatos sao publicados mesmo quando os testes falham, se foram gerados,
e ficam disponiveis por 30 dias. Videos e capturas tambem possuem artefato proprio.

## Publicacao e entrega

1. Crie um repositorio vazio na sua conta do GitHub, sem inicializar outro README.
2. No terminal desta pasta, execute os comandos abaixo, substituindo a URL.

```sh
git init
git add .
git commit -m "Adiciona trabalho final de automacao web com Cypress"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/automation-exercise-pgats.git
git push -u origin main
```

3. Confira o resultado da primeira execucao na aba Actions. O workflow executa
   automaticamente em pushes e pull requests; tambem permite **Run workflow**.
4. Confirme que o avaliador tem acesso ao repositorio e aos artefatos.
5. Para obter o ZIP sem `node_modules`, use **Code > Download ZIP** no GitHub.
   A pasta de dependencias, relatorios gerados, segredos e PDFs de apoio estao
   ignorados e nao devem ser adicionados com `git add -f`.
6. Envie o arquivo e a URL do repositorio na plataforma ate **31/10/2026 23:59:59**,
   conforme as instrucoes da atividade. Publicar no GitHub nao substitui o upload.

O arquivo `package-lock.json` deve ser versionado: garante instalacao reproduzivel
com `npm ci`. Nao e necessario excluir `node_modules` da sua maquina para entregar
o ZIP obtido do GitHub.

## Limites de reproducibilidade

Automation Exercise e um ambiente publico externo. Indisponibilidade, mudancas
no site, bloqueios de rede e oscilacoes podem causar falhas reais, que nao sao
ocultadas pelo projeto. Cypress 13 e uma versao antiga, mantida aqui por exigencia
da atividade; avisos de dependencias legadas nao devem ser resolvidos com upgrades
automaticos que mudem essa versao sem revisar a compatibilidade.