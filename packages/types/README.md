# Estrutura do Pacote de Tipos

Este pacote de tipos é utilizado para compartilhar tipagens entre a API e o front-end, garantindo consistência e facilidade de manutenção. A seguir está uma explicação de cada pasta e o que cada arquivo retorna.

## Estrutura das Pastas

- **schemas/**: Contém os esquemas Zod utilizados para validação de dados na API. Estes esquemas são utilizados separadamente para validar diferentes partes das requisições HTTP (params, body) e as respostas.

- **requests/**: Contém tipos TypeScript que combinam esquemas Zod de `params` e `body` em um único tipo de requisição (`request`) utilizado pelo front-end para enviar dados à API.

- **responses/**: Contém tipos TypeScript que inferem os esquemas Zod de `response`, utilizados pelo front-end para receber e tipar as respostas da API.

## Descrição dos Arquivos

### **schemas/entidade.ts**

- **criarEntidadeParamsSchema**:
  - Esquema Zod utilizado para validar os parâmetros (`params`) da rota de criação de entidades na API.
  - Exemplo de uso na API: Validação de parâmetros específicos da URL como identificadores ou slugs.

- **criarEntidadeBodySchema**:
  - Esquema Zod utilizado para validar o corpo (`body`) da requisição de criação de entidades na API.
  - Exemplo de uso na API: Validação dos dados enviados no corpo da requisição, como informações detalhadas sobre a entidade a ser criada.

- **criarEntidadeResponseSchema**:
  - Esquema Zod utilizado para validar a resposta (`response`) da rota de criação de entidades na API.
  - Exemplo de uso na API: Validação da estrutura da resposta, como um identificador único da entidade criada.

### **requests/entidade.ts**

- **criarEntidadeRequestSchema**:
  - Combina `criarEntidadeParamsSchema` e `criarEntidadeBodySchema` em um único esquema Zod.
  - Tipo inferido (`CriarEntidadeRequest`) é utilizado pelo front-end para enviar dados à API.
  - Exemplo de uso no front-end: `CriarEntidadeRequest` é passado como argumento na função que realiza a chamada à API para criar uma entidade.

- **CriarEntidadeRequest**:
  - Tipo TypeScript que combina as propriedades de `params` e `body` em um único objeto.
  - Utilizado pelo front-end para tipar a requisição de criação de entidades.

### **responses/entidade.ts**

- **CriarEntidadeResponse**:
  - Tipo TypeScript inferido de `criarEntidadeResponseSchema`.
  - Utilizado pelo front-end para tipar a resposta da API após a criação de uma entidade.
  - Exemplo de uso no front-end: Tipagem do retorno da função que realiza a chamada à API.

## Como Utilizar

### Na API

Os esquemas Zod definidos em `schemas/entidade.ts` são utilizados separadamente na API para validar diferentes partes da requisição e a resposta:

```typescript
import { criarEntidadeParamsSchema, criarEntidadeBodySchema, criarEntidadeResponseSchema } from '@yourorg/types';

app.post<{ Params: z.infer<typeof criarEntidadeParamsSchema>, Body: z.infer<typeof criarEntidadeBodySchema> }>('/entidades/:entidadeId/acoes', {
  schema: {
    params: criarEntidadeParamsSchema,
    body: criarEntidadeBodySchema,
    response: { 201: criarEntidadeResponseSchema },
  },
  // Handler da rota
});
