export const EVENTS = [
    {
        id: "ev_pact", name: "PACTO DE SANGUE", type: "PACT",
        description: "Uma anomalia carmesim pulsa à sua frente. Ela exige vitalidade em troca de poder bruto.",
        choices: [
            { id: "c1", label: "Aceitar o Pacto", description: "Perca 20% do HP atual. Ganhe um Upgrade Épico.", effects: { hpPercent: -0.2, grantUpgradeRarity: "EPIC" } },
            { id: "c2", label: "Recusar", description: "Sair em segurança.", effects: {} }
        ]
    },
    {
        id: "ev_void", name: "O VAZIO TE ENCARA", type: "VOID",
        description: "Uma fenda na realidade revela o vazio primordial. Você pode alcançar o fundo, mas haverá um preço.",
        choices: [
            { id: "c1", label: "Alcançar o Fundo", description: "Sofra dano massivo. Ganhe Fragmentos do Vazio.", effects: { hpPercent: -0.5, fov: 50 } },
            { id: "c2", label: "Desviar o Olhar", description: "Evite o perigo. Ganhe 10 Energia.", effects: { energy: 10 } }
        ]
    },
    {
        id: "ev_mirror", name: "ESPELHO ESTILHAÇADO", type: "MIRROR",
        description: "Um espelho flutuante reflete uma versão distorcida do seu núcleo. Ele convida você a tocá-lo.",
        choices: [
            { id: "c1", label: "Tocar o Vidro", description: "50% chance de ganhar uma Relíquia. 50% chance de perder 50 Energia.", risk: { probability: 0.5, successEffects: { randomRelic: 1 }, failureEffects: { energy: -50 } } },
            { id: "c2", label: "Quebrá-lo", description: "Ganhe +5 Dano Base permanentemente para esta run.", effects: { runBaseDamage: 5 } }
        ]
    },
    {
        id: "ev_offer", name: "OFERENDA PROFANA", type: "OFFER",
        description: "Um altar de código antigo aguarda um tributo.",
        choices: [
            { id: "c1", label: "Ofertar Energia", description: "Pague 100 Energia. Ganhe um Upgrade Raro.", requirements: { energy: 100 }, effects: { energy: -100, grantUpgradeRarity: "RARE" } },
            { id: "c2", label: "Ignorar", description: "Siga seu caminho.", effects: {} }
        ]
    },
    {
        id: "ev_sacrifice", name: "ALTAR DO SACRIFÍCIO", type: "SACRIFÍCIO",
        description: "A máquina exige um pedaço da sua build para lhe conceder ímpeto.",
        choices: [
            { id: "c1", label: "Sacrificar Relíquia", description: "Perca uma Relíquia aleatória. Ganhe 200 Energia.", requirements: { minRelics: 1 }, effects: { loseRandomRelic: 1, energy: 200 } },
            { id: "c2", label: "Preservar a Build", description: "Vá embora.", effects: {} }
        ]
    },
    {
        id: "ev_rift", name: "FENDA DIMENSIONAL", type: "RIFT",
        description: "Um atalho através do vazio se abriu. Parece altamente instável.",
        choices: [
            { id: "c1", label: "Entrar na Fenda", description: "Pule o próximo combate. Ganhe 50 Energia.", effects: { skipNextCombat: 1, energy: 50 } },
            { id: "c2", label: "Manter o Rumo", description: "Ganhe 5 HP Máximo.", effects: { maxHp: 5, heal: 5 } }
        ]
    },
    {
        id: "ev_memory", name: "ECO DE UMA MEMÓRIA", type: "MEMORY",
        description: "Um holograma fraco reproduz dados de uma tentativa passada.",
        choices: [
            { id: "c1", label: "Baixar Dados", description: "Ganhe 2 Upgrades Comuns.", effects: { grantUpgradeRarity: "COMMON", repeatUpgrade: 2 } },
            { id: "c2", label: "Corromper Dados", description: "Converta a memória em 25 Fragmentos do Vazio.", effects: { fov: 25 } }
        ]
    },
    {
        id: "ev_entity", name: "ENTIDADE ERRANTE", type: "ENTITY",
        description: "Um ser neutro flutua próximo, carregando um artefato bizarro.",
        choices: [
            { id: "c1", label: "Atacar a Entidade", description: "70% chance de Relíquia Épica. 30% chance de perder 80% do HP.", risk: { probability: 0.7, successEffects: { randomRelicRarity: "EPIC" }, failureEffects: { hpPercent: -0.8 } } },
            { id: "c2", label: "Negociar", description: "Pague 50 Energia por uma Relíquia Comum.", requirements: { energy: 50 }, effects: { energy: -50, randomRelic: 1 } }
        ]
    },
    {
        id: "ev_contract", name: "CONTRATO VINCULANTE", type: "CONTRACT",
        description: "Um pergaminho digital surge. 'Assine sua segurança em troca de poder exponencial.'",
        choices: [
            { id: "c1", label: "Assinar", description: "HP reduzido a 1. Ganhe +500 Energia e 1 Upgrade Lendário.", effects: { setHp: 1, energy: 500, grantUpgradeRarity: "LEGENDARY" } },
            { id: "c2", label: "Queimar", description: "Ganhe 20 Energia.", effects: { energy: 20 } }
        ]
    },
    {
        id: "ev_shrine", name: "SANTUÁRIO DE RESTAURAÇÃO", type: "SHRINE",
        description: "Uma zona silenciosa e segura em meio ao caos.",
        choices: [
            { id: "c1", label: "Descansar", description: "Restaure 50% do seu HP Máximo.", effects: { healPercent: 0.5 } },
            { id: "c2", label: "Desmontar Santuário", description: "Destrua por 100 Energia, sofra 10% Dano de HP.", effects: { energy: 100, hpPercent: -0.1 } }
        ]
    },
    {
        id: "ev_gamble", name: "ALTO RISCO", type: "GAMBLE",
        description: "Um terminal giratório aguarda seu input.",
        choices: [
            { id: "c1", label: "Girar a Sorte", description: "50% de dobrar sua Energia. 50% de perder tudo.", risk: { probability: 0.5, successEffects: { energyMult: 2.0 }, failureEffects: { energyMult: 0.0 } } },
            { id: "c2", label: "Recusar", description: "Siga em frente.", effects: {} }
        ]
    },
    {
        id: "ev_glitch", name: "FALHA NO SISTEMA", type: "GLITCH",
        description: "A matriz ao redor está desmoronando. O código sangra na realidade.",
        choices: [
            { id: "c1", label: "Absorver o Código", description: "Ganhe 3 Upgrades aleatórios.", effects: { grantRandomUpgrade: 3 } },
            { id: "c2", label: "Expurgar", description: "Cure-se até o HP Máximo.", effects: { healPercent: 1.0 } }
        ]
    },
    {
        id: "ev_echo", name: "CÂMARA RESSONANTE", type: "ECHO",
        description: "As paredes ecoam com o som dos seus impactos.",
        choices: [
            { id: "c1", label: "Amplificar", description: "+0.5x Efetividade do Combo na Run.", effects: { runComboBonus: 0.5 } },
            { id: "c2", label: "Absorver", description: "+1 Energia por Clique na Run.", effects: { runEnergyPerClick: 1 } }
        ]
    },
    {
        id: "ev_cache", name: "CAIXA ABANDONADA", type: "CACHE",
        description: "Um suprimento esquecido por um desafiante anterior.",
        choices: [
            { id: "c1", label: "Abrir com Cuidado", description: "Ganhe 75 Energia.", effects: { energy: 75 } },
            { id: "c2", label: "Forçar a Fechadura", description: "80% chance de Relíquia. 20% de explodir (Perca 30% HP).", risk: { probability: 0.8, successEffects: { randomRelic: 1 }, failureEffects: { hpPercent: -0.3 } } }
        ]
    },
    {
        id: "ev_parasite", name: "NINHO DE PARASITAS", type: "NEST",
        description: "Um aglomerado de parasitas adormecidos presos a um nodo.",
        choices: [
            { id: "c1", label: "Incinerar", description: "Sofra 10% Dano de HP. Ganhe um Upgrade Épico.", effects: { hpPercent: -0.1, grantUpgradeRarity: "EPIC" } },
            { id: "c2", label: "Colher", description: "Ganhe 150 Energia. Sem dano.", effects: { energy: 150 } }
        ]
    }
];
