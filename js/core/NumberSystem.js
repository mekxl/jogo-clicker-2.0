export const NumberSystem = {
    formatNumber(value) {
        const sanitized = this.sanitizeNumber(value);
        // Futuramente expandido para números absurdos (ex: 1.2M, 1.5B, 1.0e10)
        return sanitized.toLocaleString('en-US');
    },
    isValidNumber(value) {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    },
    sanitizeNumber(value) {
        if (!this.isValidNumber(value)) return 0;
        return Math.max(0, value); // Previne valores indevidos neste contexto base
    }
};
