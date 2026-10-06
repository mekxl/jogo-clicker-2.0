# BREAK//CORE - Architecture

## Fluxo de Modificadores e Relíquias (Estágio 4)
O `ModifierSystem` processa TUDO em ordem estrita de operações a cada `stateUpdated` ou aplicação de upgrades/relíquias.
Ordem:
1. Base Stats (Fixos)
2. Meta Upgrades (FoV)
3. Flat Run Upgrades (+X Dano, +X Energia)
4. Flat Relics e Synergies
5. Multiplicadores Globais (Ex: `globalMultiplier`)

## Tags e Sinergias
As Tags (Ex: `"CLICK"`, `"COMBO"`, `"VOID"`) ditam a ponte do `RelicSystem.js`. Quando uma relíquia é adicionada, `RelicSystem.updateSynergies()` verifica a matriz `SYNERGIES` contra as tags ativas. O resultado alimenta o `ModifierSystem`. O DOM reflete os dados puros via `UIManager`.
