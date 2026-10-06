# BALANCE (Estágio 4)

## Obtenção de Relíquias
- O jogador entra na Tela de Seleção de Relíquia (3 opções) toda vez que completa 3 Encontros (Level 3, 6, 9, etc.).

## Escalabilidade dos Modificadores
- Modificadores *Flat* (Soma) acumulam primeiro.
- Modificadores *Multiplier* multiplicam sobre o total consolidado (Ex: Relíquia "Click Core" 1.1x aumenta globalmente).
- Chance Crítica Máxima lógica é 1.0 (100%), mas o `DamageSystem` trata naturalmente (Math.random() < 1.0).
