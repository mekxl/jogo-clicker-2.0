# Changelog

## [Estágio 4] - Relics e Sinergias
### Adicionado
- `js/data/relics.js` contendo 50 relíquias e 10 sinergias pré-definidas.
- `js/progression/RelicSystem.js` controlando as regras de aquisição (Uniques, limits e tags).
- Sinergias Multi-Tags (Ex: RISK + LUCK gera "High Stakes").
- Painel esquerdo na interface (`relics-sidebar`) documentando a Build da Run atual.
- Drop de Relíquias amarrado ao `EncounterManager` (Uma escolha a cada 3 inimigos).

### Modificado
- `ModifierSystem.js`: Reescrito para comportar arrays de multi-efeitos e aplicar multiplicadores corretamente no final da pilha matemática.
- `DamageSystem.js`: Agora extrai dinamicamente as variáveis de BREAK, CRIT e ENERGIA do pacote `stats` atualizado.
- CSS Layout: Tela convertida para flex-row (`main-layout`) para comportar o painel sem achatar o CORE.
