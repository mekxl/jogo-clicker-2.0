# Changelog

## [Estágio 1] - Fundação do Jogo
### Adicionado
- Estrutura base de pastas baseada em ES Modules.
- Estética CSS base do jogo (sombria, vermelha e tecnológica).
- `GameState` com divisão clara entre estado Efêmero (Run) e Persistente (Meta).
- `EventBus` para desacoplamento de classes.
- `TargetSystem` e `DamageSystem` gerindo o cálculo de diminuição de HP a partir de um clique.
- `CurrencySystem` com ganho fixo de +1 Energy por clique na Run ativa.
- `ComboSystem` registrando cliques em sequência e atribuindo ranges de multiplicador numérico.
- `FeedbackSystem` produzindo indicadores visuais flutuantes ("Floating Damage") sem engessar os cálculos de UI puro do `UIManager`.
- Tela de encerramento da Run com interatividade de restart e reinicialização correta de estado.
