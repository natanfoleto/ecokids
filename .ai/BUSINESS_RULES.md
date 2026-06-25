# BUSINESS_RULES.md

This manual defines the business logic, workflow rules, role matrix constraints, and entity integrity rules for the Ecokids platform.

---

## 1. Segurança e Autorização (AUTH)

### `RULE-AUTH-001` - Acesso Administrativo Completo
- **Escopo**: Usuários com o papel `ADMIN` associado ao seu vínculo (`Member`) com a escola.
- **Regra**: O administrador possui privilégios totais de leitura e escrita (`manage` / `all`) sobre todos os recursos da escola, incluindo a criação de turmas, alunos, itens recicláveis, prêmios, alteração de configurações gerais e de membros/convites.

### `RULE-AUTH-002` - Acesso Restrito de Membro
- **Escopo**: Usuários com o papel `MEMBER` associado ao seu vínculo (`Member`) com a escola.
- **Regra**: O membro possui acesso exclusivo para visualizar os dados de desempenho e estatísticas consolidadas exibidos no **Dashboard** da escola. Ele é expressamente bloqueado de acessar ou executar ações de criação, edição, deleção ou visualização detalhada nas seguintes áreas administrativas:
  - Turmas (`Classes`)
  - Alunos (`Students`)
  - Itens recicláveis (`Items`)
  - Prêmios (`Awards`)
  - Resgates de Prêmios (`RewardRedemptions`)
  - Gestão de Membros e Convites (`Members`/`Invites`)
  - Configurações da Escola (`SchoolSettings`)
  - Geração/Download de Relatórios do Ciclo de Pontuação (`SchoolSeason`)
- **Enforcement**: Qualquer requisição HTTP executada por um `MEMBER` para endpoints destas áreas restritas deve ser rejeitada pela API com status `403 Forbidden`. No Manager, as abas de navegação devem ser ocultadas da interface e o acesso direto via URL deve exibir uma tela de "Acesso Proibido".

---

## 2. Autorização de Estudantes (STUDENT-AUTH)

### `RULE-STUDENT-001` - Login no Terminal de Pesagem (Scorer)
- **Escopo**: Aplicativo Scorer.
- **Regra**: O estudante autentica-se fornecendo o seu código numérico de identificação escolar (`code`) e sua senha cadastrada.
- **Enforcement**: A busca do aluno deve validar se o cadastro está ativo (`active: true`). Caso o aluno não seja encontrado ou sua senha não bata, a API deve retornar erro apropriado sem invalidar o token de sessão do operador da pesagem.

### `RULE-STUDENT-002` - Autenticação Isolada
- **Escopo**: Aplicativo Viewer.
- **Regra**: Estudantes possuem fluxo de autenticação e tokens (via `StudentToken`) separados de usuários comuns (`User`). As sessões e escopos de navegação são totalmente isolados.

---

## 3. Auditoria e Rastreabilidade (AUDIT)

### `RULE-AUDIT-001` - Registro Automático de Alterações
- **Escopo**: Toda a plataforma.
- **Regra**: Toda alteração crítica realizada no sistema (incluindo criação, edição e exclusão de escolas, turmas, alunos, materiais recicláveis, prêmios, resgates, pontuações, convites e controle de membros, além de tentativas de login inválidas ou violações de acesso) deve gerar obrigatoriamente um log de auditoria associado.

### `RULE-AUDIT-002` - Imutabilidade e Permanência
- **Escopo**: Banco de dados e API.
- **Regra**: Os logs do sistema de auditoria são permanentes e imutáveis. Não deve existir nenhum endpoint na API ou lógica no banco de dados para alterar (`UPDATE`) ou deletar (`DELETE`) registros de auditoria.

### `RULE-AUDIT-003` - Acesso Exclusivo a Administradores
- **Escopo**: Frontend (Manager) e API.
- **Regra**: Somente usuários com a permissão/papel `ADMIN` podem visualizar a tela de auditoria ou realizar requisições para listar os logs na API. Usuários com papel `MEMBER` são totalmente bloqueados tanto na interface do usuário quanto a nível de backend (retornando `403 Forbidden`).

---

## 4. Fluxos de Trabalho do Sistema (FLOWS)

### `FLOW-001` - Fluxo de Integração de Escola (Onboarding)
1. O usuário se cadastra na plataforma.
2. Cria uma escola especificando nome, cidade, estado, e opcionalmente um domínio de e-mail.
3. Ao cadastrar, o usuário se torna proprietário (`ownerId` na tabela `School`) e é vinculado automaticamente como membro com papel `ADMIN`.
4. Um registro de configurações padrão (`SchoolSettings`) é criado na mesma transação bancária.

### `FLOW-002` - Fluxo de Cadastro e Matrícula de Estudante
1. O administrador (`ADMIN`) cria uma turma (`Class`) definindo nome e ano letivo.
2. O administrador cria o perfil do estudante (`Student`) associado à turma.
3. Se um código de aluno (`code`) não for fornecido manualmente, o sistema incrementa o campo `lastStudentCode` em `SchoolSettings` e o atribui ao estudante.
4. O código numérico final deve ser único por escola.

### `FLOW-003` - Fluxo de Pontuação por Reciclagem (Scoring)
1. O operador da pesagem identifica o estudante no Scorer informando o código escolar.
2. O operador seleciona os materiais reciclados e informa as quantidades coletadas.
3. Ao submeter a pesagem, o backend resolve os valores vigentes de cada item (`value`).
4. Calcula o total de pontos acumulado (`Σ quantidade × valor unitário`).
5. Cria um registro de pontuação (`Point`) e os respectivos itens de histórico (`ScoreItems`).
6. Os pontos são creditados na conta virtual do estudante.

### `FLOW-004` - Fluxo de Resgate de Prêmios (Draft / Incompleto)
- Atualmente, o aplicativo Viewer exibe uma aba de loja (`/shop`) contendo prêmios listados, mas a operação final de resgate de prêmios (`POST` de resgate ou dedução automática de saldo no banco) não está implementada nas rotas da API.

---

## 5. Regras de Integridade de Entidades (ENTITY)

### `RULE-ENTITY-001` - Geração de Slugs Únicos
- A escola possui um slug gerado a partir do seu nome. Caso o slug resultante já exista no banco de dados, o sistema deve acrescentar um hash aleatório de 4 caracteres para garantir a unicidade global.

### `RULE-ENTITY-002` - Imutabilidade das Pontuações
- Registros de pontuação (`Point`) e itens de pontuação (`ScoreItems`) são **estritamente imutáveis**. Uma vez registrados no banco de dados, não é permitido atualizar ou deletar estes dados.

### `RULE-ENTITY-003` - Histórico de Valor de Reciclagem
- A tabela `ScoreItems` salva uma cópia/snapshot do valor por unidade (`value`) do item reciclável no momento em que a pesagem foi concluída. Mudanças posteriores no valor do material reciclável na tabela `Item` **não devem** alterar as pontuações e históricos salvos no passado.

### `RULE-ENTITY-004` - Cascade Deletes
- A exclusão de uma turma (`Class`) remove em cascata todos os alunos vinculados a ela.
- A exclusão de uma escola (`School`) deleta em cascata todas as turmas, alunos, materiais, pontuações e configurações configurados sob seu escopo.
