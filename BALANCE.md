# BALANCE (Estágio 3)
## Encontros e Escalonamento
- HP Scaling: `baseHP * Math.pow(1.15, level - 1)` (crescimento exponencial suave).
- Break Scaling: `baseBreak * (1 + (level * 0.05))` (crescimento linear mais lento).
- Break Multiplier: 1.5x Dano.
- Break Duration: 3.0 Segundos (3000ms).
