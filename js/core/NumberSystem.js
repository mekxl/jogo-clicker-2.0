export const NumberSystem = {
    suffixes: ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "Ud", "Dd"],

    formatNumber(value) {
        let safeVal = this.sanitizeNumber(value);
        if (safeVal < 1000) return Math.floor(safeVal).toString();

        let suffixNum = Math.floor(("" + Math.floor(safeVal)).length / 3);
        
        // Proteção caso passe do limite do nosso array de sufixos
        if (suffixNum >= this.suffixes.length) {
            return safeVal.toExponential(2);
        }

        let shortValue = parseFloat((suffixNum !== 0 ? (safeVal / Math.pow(1000, suffixNum)) : safeVal).toPrecision(3));
        if (shortValue % 1 !== 0) {
            shortValue = shortValue.toFixed(1);
        }
        return shortValue + this.suffixes[suffixNum];
    },

    isValidNumber(value) {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    },

    sanitizeNumber(value) {
        if (!this.isValidNumber(value)) {
            console.warn("NumberSystem bloqueou uma mutação inválida (NaN/Infinity). Retornando 0 para proteger a run.");
            return 0;
        }
        return Math.max(0, value);
    }
};
