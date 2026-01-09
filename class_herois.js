// 1. Definição da Classe Heroi
class Heroi {
   
    constructor(nome, idade, tipo, genero, xp, poder) {
        this.nome = nome;
        this.idade = idade;
        this.tipo = tipo;
        this.genero = genero;
        this.xp = xp;       
        this.poder = poder; 
    }

    // 2. Método auxiliar para calcular Nível e Dano baseado no XP (Lógica do Desafio 1)
    calcularStatus() {
        let nivel = "";
        let danoBase = 0;

        switch (true) {
            case (this.xp <= 1000):
                nivel = "Ferro";
                danoBase = 10;
                break;
            case (this.xp >= 1001 && this.xp <= 2000):
                nivel = "Bronze";
                danoBase = 20;
                break;
            case (this.xp >= 2001 && this.xp <= 5000):
                nivel = "Prata";
                danoBase = 40;
                break;
            case (this.xp >= 5001 && this.xp <= 7000):
                nivel = "Ouro";
                danoBase = 60;
                break;
            case (this.xp >= 7001 && this.xp <= 8000):
                nivel = "Platina";
                danoBase = 80;
                break;
            case (this.xp >= 8001 && this.xp <= 9000):
                nivel = "Ascendente";
                danoBase = 150; // A partir daqui o herói fica forte!
                break;
            case (this.xp >= 9001 && this.xp <= 10000):
                nivel = "Imortal";
                danoBase = 300;
                break;
            case (this.xp >= 10001):
                nivel = "Radiante";
                danoBase = 9999; // Hit kill!
                break;
            default:
                nivel = "Desconhecido";
                danoBase = 1;
        }
        
        // Retorna um objeto com as duas informações
        return { nivelAtual: nivel, dano: danoBase };
    }

    atacar() {
        let estiloAtaque = "";
        
        // 3. Pegamos o status atualizado do herói
        const status = this.calcularStatus();

        // Lógica do Tipo de Arma/Estilo
        switch (this.tipo.toLowerCase()) {
            case 'mago':
                estiloAtaque = "uma magia";
                break;
            case 'guerreiro':
                estiloAtaque = "um golpe de espada";
                break;
            case 'monge':
                estiloAtaque = "um punho";
                break;
            case 'ninja':
                estiloAtaque = "uma shuriken";
                break;
            default:
                estiloAtaque = "um ataque";
        }

        // 4. MENSAGEM FINAL COM STATUS ATUALIZADO
        console.log(`--------------------------------------------------`);
        console.log(`O ${this.tipo} **${this.nome}** (Nível ${status.nivelAtual})`);
        console.log(`Atacou usando ${estiloAtaque} de **${this.poder}**`);
        console.log(`💥 Causou **${status.dano}** pontos de dano!`);
        console.log(`--------------------------------------------------\n`);
    }
}

// --- ÁREA DE TESTES ---

// Mago fraco (Ferro) de Gelo
const heroi1 = new Heroi("Gandalf", 1500, "mago", "Masculino", 900, "Gelo");
heroi1.atacar(); 

// Guerreira forte (Ouro) de Fogo
const heroi2 = new Heroi("Xena", 30, "guerreiro", "Feminino", 6000, "Fogo");
heroi2.atacar();

// Ninja nível Deus (Radiante) das Sombras
const heroi3 = new Heroi("Naruto", 18, "ninja", "Masculino", 15000, "Sombras");
heroi3.atacar();