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
