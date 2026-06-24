# Guia de Padronização de Paginação e Busca

Este guia descreve o padrão arquitetural e de implementação adotado para a paginação e a busca nos endpoints da API e interfaces do Manager do projeto **Ecokids**. O objetivo deste documento é servir como referência técnica para desenvolvimentos futuros, garantindo consistência entre as rotas.

---

## 1. Estrutura de Tipos Reutilizáveis (`@ecokids/types`)

Centralizamos as definições no pacote de tipos compartilhados para garantir conformidade automática entre o servidor e o cliente. Os schemas estão declarados em `packages/types/src/models/pagination.ts`:

### Schema de Consulta (`paginationQuerySchema`)
Responsável por validar a query string recebida do cliente. Todos os parâmetros são opcionais para garantir compatibilidade retroativa.

```typescript
export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  search: z.string().optional(),
})
```

- `page`: Número da página solicitada (base 1).
- `limit`: Quantidade máxima de registros por página (máximo de 100). Se omitido, o endpoint pode retornar todos os registros correspondentes.
- `search`: Termo opcional para busca textual filtrada (pesquisa case-insensitive).

### Schema de Metadados (`paginationMetaSchema`)
Retornado pelo servidor no envelope de resposta sob a chave `meta`.

```typescript
export const paginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  totalCount: z.number(),
  pageCount: z.number(),
})
```

- `page`: Página corrente respondida.
- `limit`: Limite de paginação aplicado.
- `totalCount`: Contagem total de registros no banco de dados correspondentes aos filtros de busca (sem a limitação da página corrente).
- `pageCount`: Total calculado de páginas disponíveis (`ceil(totalCount / limit)`).

---

## 2. Contrato de API (Zod Request / Response)

Todos os schemas de rota que listam coleções devem estender ou incorporar estes schemas. Exemplo para a listagem de turmas (`get-classes.ts`):

```typescript
export const getClassesRequestSchema = z.object({
  params: getClassesParamsSchema,
  query: paginationQuerySchema.optional(), // Permite ser opcional
})

export const getClassesResponseSchema = z.object({
  classes: z.array(classSchema),
  meta: paginationMetaSchema,
})
```

---

## 3. Implementação no Backend (Fastify & Prisma)

No controlador de rota do backend, a busca e a paginação devem ser aplicadas no momento da consulta com o Prisma.

### Exemplo de Filtro de Busca Textual
A busca textual deve sempre ser case-insensitive usando `mode: 'insensitive'`.

```typescript
const { page, limit, search } = request.query

const where = {
  schoolId: school.id,
  ...(search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } as const },
        ],
      }
    : {}),
}
```

### Contagem e Paginação da Consulta Prisma
1. Faça a contagem total de registros condizentes com os critérios utilizando `count`.
2. Determine `limitVal` e `pageVal` padrão para construir os metadados.
3. Aplique `take` (equivalente ao limite) e `skip` (pular registros das páginas anteriores).

```typescript
const totalCount = await prisma.class.count({ where })

const limitVal = limit ? Number(limit) : totalCount
const pageVal = page ? Number(page) : 1
const take = limit ? Number(limit) : undefined
const skip = page && limit ? (Number(page) - 1) * Number(limit) : undefined

const classes = await prisma.class.findMany({
  where,
  orderBy: { name: 'asc' },
  take,
  skip,
})

const pageCount = limitVal > 0 ? Math.ceil(totalCount / limitVal) : 1
```

Retorne a resposta contendo a coleção de itens e o objeto `meta`:

```typescript
return reply.send({
  classes,
  meta: {
    page: pageVal,
    limit: limitVal,
    totalCount,
    pageCount,
  },
})
```

---

## 4. Integração no Cliente HTTP (`ky`)

No frontend, a função HTTP que embrulha a requisição do `ky` deve encaminhar o objeto `query` dentro de `searchParams`:

```typescript
export async function getClasses({ params: { schoolSlug }, query }: GetClassesRequest) {
  const result = await api
    .get(`schools/${schoolSlug}/classes`, {
      searchParams: query
        ? {
            ...(query.page !== undefined ? { page: query.page } : {}),
            ...(query.limit !== undefined ? { limit: query.limit } : {}),
            ...(query.search !== undefined ? { search: query.search } : {}),
          }
        : undefined,
    })
    .json<GetClassesResponse>()

  return result
}
```

---

## 5. Implementação no Frontend (React Query, UI e States)

### Estados de Controle
No componente da página, declare estados para a página atual, termo de busca digitado e termo de busca efetivamente aplicado:

```typescript
const [page, setPage] = useState(1)
const [search, setSearch] = useState('')
const [appliedSearch, setAppliedSearch] = useState('')
```

### React Query Caching
Inclua o termo aplicado (`appliedSearch`) e a página (`page`) na `queryKey`. Use `keepPreviousData` para evitar que a tabela suma ou pisque com carregamento em branco durante a paginação.

```typescript
const { data, isLoading } = useQuery<GetClassesResponse>({
  queryKey: ['schools', schoolSlug, 'classes', { page, search: appliedSearch }],
  queryFn: () => getClasses({
    params: { schoolSlug: schoolSlug! },
    query: { page, limit: 10, search: appliedSearch || undefined }
  }),
  placeholderData: keepPreviousData,
})
```

### Tratamento do Form de Busca
Zere a página para `1` ao submeter um novo filtro para evitar ficar posicionado em uma página inexistente na nova pesquisa.

```typescript
function handleSearch(e: React.FormEvent) {
  e.preventDefault()
  setAppliedSearch(search)
  setPage(1)
}
```

### Componente de Paginação
Utilize o componente reutilizável `<Pagination>` importado de `@/components/pagination`.

```typescript
{data?.meta && data.meta.pageCount > 1 && (
  <Pagination
    page={page}
    limit={data.meta.limit}
    totalCount={data.meta.totalCount}
    pageCount={data.meta.pageCount}
    onPageChange={setPage}
  />
)}
```

---

## 6. Diretrizes Importantes de Estilo e Acessibilidade (UX)
1. **Ícones dentro de botões**: Nunca adicione classes de espaçamento manual (`mr-*` ou `ml-*`) em elementos de ícones SVG encapsulados em componentes `<Button>`, para respeitar o design system integrado.
2. **Tipografia**: Não use estilos em itálico (`italic`) em nenhuma das telas e rotas de paginação.
3. **Resgate de Prêmios (Caso Especial)**: Quando a filtragem client-side se torna inviável (ex: abas por status de resgates), deve-se implementar chamadas separadas para cada status no servidor, controlando de forma independente o estado da página (`pendingPage`, `approvedPage`, etc.) para que uma listagem não interfira na outra.
