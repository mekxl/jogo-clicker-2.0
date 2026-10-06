export const RiskSystem = {
    // Avalia a probabilidade e retorna os efeitos de Sucesso ou Falha
    evaluateRiskChoice(choice) {
        if (!choice.risk) return choice.effects || {};
        
        const roll = Math.random();
        if (roll <= choice.risk.probability) {
            return choice.risk.successEffects || {};
        } else {
            return choice.risk.failureEffects || {};
        }
    }
};
