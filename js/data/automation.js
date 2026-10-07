// DATA-ONLY: Configuração base dos drones e entidades de automação
export const AUTOMATION_ENTITIES = {
    "drone_basic": { id: "drone_basic", name: "Pulse Drone", baseDamage: 2, intervalMs: 1500, tags: ["AUTOMATION"] },
    "void_shard": { id: "void_shard", name: "Void Shard", baseDamage: 25, intervalMs: 4000, tags: ["AUTOMATION", "VOID"] },
    "frenzy_bot": { id: "frenzy_bot", name: "Stim Injector", baseDamage: 0, intervalMs: 5000, tags: ["AUTOMATION", "FRENZY"], special: "FRENZY_CHARGE" } 
};
