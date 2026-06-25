# BUSINESS_RULES.md

> Regras de negócio associadas ao comportamento, processos e autorizações do sistema Ecokids.

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

## 2. Auditoria e Rastreabilidade (AUDIT)

### `RULE-AUDIT-001` - Registro Automático de Alterações
- **Escopo**: Toda a plataforma.
- **Regra**: Toda alteração crítica realizada no sistema (incluindo criação, edição e exclusão de escolas, turmas, alunos, materiais recicláveis, prêmios, resgates, pontuações, convites e controle de membros, além de tentativas de login inválidas ou violações de acesso) deve gerar obrigatoriamente um log de auditoria associado.

### `RULE-AUDIT-002` - Imutabilidade e Permanência
- **Escopo**: Banco de dados e API.
- **Regra**: Os logs do sistema de auditoria são permanentes e imutáveis. Não deve existir nenhum endpoint na API ou lógica no banco de dados para alterar (`UPDATE`) ou deletar (`DELETE`) registros de auditoria.

### `RULE-AUDIT-003` - Acesso Exclusivo a Administradores
- **Escopo**: Frontend (Manager) e API.
- **Regra**: Somente usuários com a permissão/papel `ADMIN` podem visualizar a tela de auditoria ou realizar requisições para listar os logs na API. Usuários com papel `MEMBER` são totalmente bloqueados tanto na interface do usuário quanto a nível de backend (retornando `403 Forbidden`).

