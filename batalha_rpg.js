class Heroi {
    constructor(nome, idade, tipo, xp, poder) {
        this.nome = nome;
        this.idade = idade;
        this.tipo = tipo;
        this.xp = xp;
        this.poder = poder;
        this.vida = 1000; // Todos começam com 1000 de HP
        this.vidaMaxima = 1000;
    }

    calcularNivel() {
        if (this.xp <= 1000) return { nivel: "Ferro", danoBase: 20 };
        if (this.xp <= 5000) return { nivel: "Prata", danoBase: 50 };
        if (this.xp <= 8000) return { nivel: "Platina", danoBase: 100 };
        if (this.xp <= 10000) return { nivel: "Imortal", danoBase: 300 };
        return { nivel: "Radiante", danoBase: 800 };
    }

    atacar() {
        const status = this.calcularNivel();
        let danoFinal = status.danoBase;
        let mensagem = "";

        // --- Lógica de RNG (Sorte) ---
        const sorte = Math.random(); // Gera número entre 0.0 e 1.0

        if (sorte > 0.85) { // 15% de chance de Crítico
            danoFinal = danoFinal * 2;
            mensagem = `🔥 CRÍTICO! O ${this.tipo} acertou em cheio o ponto fraco!`;
        } else if (sorte < 0.10) { // 10% de chance de Errar
            danoFinal = 0;
            mensagem = `💨 ERROU! O ${this.tipo} tentou atacar mas escorregou.`;
        } else {
            mensagem = `⚔️ O ${this.tipo} atacou com ${this.poder}.`;
        }

        return { mensagem, dano: danoFinal };
    }

    receberDano(dano) {
        this.vida -= dano;
        if (this.vida < 0) this.vida = 0;
    }
}

// --- CLASSE DO MONSTRO (Para ter contra quem lutar) ---
class Monstro {
    constructor() {
        this.nome = "Orc Berserker";
        this.vida = 2500;
        this.ataqueBase = 80;
    }
    
    atacar() {
        // Monstro tem dano fixo + variação pequena
        return this.ataqueBase + Math.floor(Math.random() * 20); 
    }
}

// --- SIMULAÇÃO DA BATALHA ---
function iniciarBatalha() {
    // 1. Criar os combatentes
    const meuHeroi = new Heroi("Aragorn", 87, "guerreiro", 7500, "Espada Narsil");
    const monstro = new Monstro();

    console.log(`🚨 UM ${monstro.nome} SELVAGEM APARECEU!`);
    console.log(`Combate: ${meuHeroi.nome} (HP: ${meuHeroi.vida}) vs ${monstro.nome} (HP: ${monstro.vida})\n`);

    let turno = 1;

    // 2. Loop de repetição (Enquanto os dois estiverem vivos)
    while (meuHeroi.vida > 0 && monstro.vida > 0) {
        console.log(`--- TURNO ${turno} ---`);

        // Turno do Herói
        const resultadoAtaque = meuHeroi.atacar();
        monstro.vida -= resultadoAtaque.dano;
        
        console.log(`${resultadoAtaque.mensagem}`);
        console.log(`Dano causado: ${resultadoAtaque.dano}`);
        
        if (monstro.vida <= 0) {
            console.log(`\n🏆 VITÓRIA! O monstro foi derrotado!`);
            break; // Sai do loop
        }

        // Turno do Monstro
        const danoMonstro = monstro.atacar();
        meuHeroi.receberDano(danoMonstro);
        console.log(`O monstro revidou e causou ${danoMonstro} de dano!`);

        if (meuHeroi.vida <= 0) {
            console.log(`\n☠️ GAME OVER... Seu herói caiu em combate.`);
            break;
        }

        console.log(`Status: Herói HP[${meuHeroi.vida}] | Monstro HP[${monstro.vida}]\n`);
        turno++;
    }
}

// Executar
iniciarBatalha();
        let danoFinal = 0;
        
        const status = this.calcularStatus();
        const danoBase = status.dano;
        const nivel = status.nivelAtual;
        
        // Lógica de RNG para variação de dano
        const sorte = Math.random(); // Gera número entre 0.0 e 1.0
        
        if (sorte > 0.8) { // 20% de chance de Crítico
            danoFinal = danoBase * 2;
            estiloAtaque += " com um golpe CRÍTICO!";
        } else if (sorte < 0.1) { // 10% de chance de Errar
            danoFinal = 0;
            estiloAtaque = "mas errou o ataque!";
        } else {
            danoFinal = danoBase;
        }
        
        return { mensagem: `${this.nome} atacou ${estiloAtaque} (Nível: ${nivel})`, dano: danoFinal };
