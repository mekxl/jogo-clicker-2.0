# BREAK//CORE - Architecture

## Arquitetura e Regras (Estágio 1)
O projeto utiliza Vanilla JavaScript moderno (ES Modules) focado em extrema Separação de Responsabilidades (SoC). Não há frameworks e tudo corre localmente.

## Diretórios
- `/js/core/`: Motores fundamentais (GameState, EventBus, Números, Salvamento, RunManager).
- `/js/combat/`: Resolução mecânica do combate (DamageSystem, TargetSystem, ComboSystem).
- `/js/progression/`: Economia interna da Run (CurrencySystem).
- `/js/feedback/`: Reação audiovisual aos eventos (partículas, pulso).
- `/js/ui/`: Gerenciador de atualização do DOM (texto, painéis).

## Fluxo de Clique (Pipeline)
1. `main.js` capta o evento de `pointerdown` no DOM.
2. Chama `DamageSystem.processClickDamage(coords)`.
3. `DamageSystem` verifica validade em `GameState.run`.
4. `TargetSystem.takeDamage()` calcula perda de HP do inimigo.
5. `CurrencySystem.addEnergy()` injeta energia.
6. `ComboSystem.incrementCombo()` lida com as faixas de multiplicador.
7. `EventBus` dispara eventos (`"damage"`, `"stateUpdated"`, `"targetDefeated"`).
8. `FeedbackSystem` processa FX na tela (números subindo).
9. `UIManager` atualiza os numerais do DOM.

## Regra de Ouro
A Interface (DOM/UI) **NUNCA** calcula dados, apenas despacha ações e espelha o `GameState`.
