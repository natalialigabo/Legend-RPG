const ESCALA_HEROI = 6; 

const capitulosHistoria = [
    { titulo: "Memória da Raiz", texto: "Nós lembramos... O Grande Império não caiu por guerras, mas por traição interna." },
    { titulo: "O Veneno", texto: "O Mago Supremo envenenou a água antes de envenenar as mentes." },
    { titulo: "Segredo Guardado", texto: "Os humanos esqueceram, mas nós guardamos a chave nas Cavernas Reais." },
    { titulo: "O Caminho", texto: "Siga para as montanhas. Acorde o Guardião com a palavra certa." }
];
let indiceHistoria = 0;
let historiaAberta = false;

const biomas = [
    { nome: "Floresta Antiga", css: "bg-floresta", inimigos: ["Goblin", "Lobo"], maxLvl: 5 },
    { nome: "Vila Esquecida", css: "bg-povoado", inimigos: ["Guarda", "Mercenário"], maxLvl: 10 },
    { nome: "Deserto", css: "bg-deserto", inimigos: ["Escorpião", "Múmia"], maxLvl: 15 },
    { nome: "Caverna", css: "bg-caverna", inimigos: ["Golem", "Sombra"], maxLvl: 99 }
];

class Heroi {
    constructor(nome, elemento) {
        this.nome = nome; this.elemento = elemento;
        this.nivel = 1; this.xp = 0; this.gold = 0; this.potions = 1;
        this.x = 50; this.vidaMax = 500; this.vida = 500; this.ataqueBase = 50;
    }
    calcularDano(tipo) {
        let dano = this.ataqueBase + Math.floor(Math.random() * 20);
        if (tipo === 'skill') dano *= 1.5;
        return Math.floor(dano);
    }
    ganharXp(qtd) {
        this.xp += qtd;
        if (this.xp >= this.nivel * 400) {
            this.nivel++; this.vidaMax += 150; this.vida = this.vidaMax;
            log(`LEVEL UP! Nível ${this.nivel}!`, "lime");
        }
    }
}
class Mago extends Heroi { constructor(n,e){super(n,e);this.vidaMax=450;this.vida=450;this.ataqueBase=75;this.tipo="mago";} }
class Guerreiro extends Heroi { constructor(n,e){super(n,e);this.vidaMax=800;this.vida=800;this.ataqueBase=50;this.tipo="guerreiro";} }
class Ninja extends Heroi { constructor(n,e){super(n,e);this.vidaMax=550;this.vida=550;this.ataqueBase=65;this.tipo="ninja";} }
class Elfo extends Heroi { constructor(n,e){super(n,e);this.vidaMax=500;this.vida=500;this.ataqueBase=70;this.tipo="elfo";} }
class Anao extends Heroi { constructor(n,e){super(n,e);this.vidaMax=900;this.vida=900;this.ataqueBase=55;this.tipo="anao";} }
class Paladino extends Heroi { constructor(n,e){super(n,e);this.vidaMax=850;this.vida=850;this.ataqueBase=45;this.tipo="paladino";} }

let jogador;
let monstro = { nome: "", vida: 0, vidaMax: 0, dano: 0, xpReward: 0 };
let estadoJogo = 'MENU';
let teclas = {};
let biomaIndex = 0;
let emTransicao = false;

window.onload = () => {
    document.addEventListener('keydown', (e) => teclas[e.key] = true);
    document.addEventListener('keyup', (e) => teclas[e.key] = false);
    setInterval(gameLoop, 1000/60);
    setInterval(danoAmbiental, 2000);
    document.querySelector("#intro-game p").innerHTML = "O Mago Supremo reescreveu a história.<br><br>Apenas os <strong>Ents Antigos</strong> lembram da verdade.<br><br>Encontre-os na floresta.";
    document.getElementById('intro-game').classList.remove('escondido');
    document.getElementById('tela-selecao').classList.add('escondido');
};

function fecharIntro() {
    document.getElementById('intro-game').classList.add('escondido');
    document.getElementById('tela-selecao').classList.remove('escondido');
}

function iniciarJogo() {
    const nome = document.getElementById('nomeHeroi').value || "Herói";
    const classe = document.getElementById('classeHeroi').value;
    const elem = document.getElementById('elementoHeroi').value;

    if(classe=='mago') jogador = new Mago(nome,elem);
    else if(classe=='guerreiro') jogador = new Guerreiro(nome,elem);
    else if(classe=='ninja') jogador = new Ninja(nome,elem);
    else if(classe=='elfo') jogador = new Elfo(nome,elem);
    else if(classe=='anao') jogador = new Anao(nome,elem);
    else if(classe=='paladino') jogador = new Paladino(nome,elem);

    document.getElementById('tela-selecao').classList.add('escondido');
    document.getElementById('tela-batalha').classList.remove('escondido');
    
    const sprite = document.getElementById('hero-sprite');
    sprite.className = `pixel-art ${jogador.tipo} ${jogador.elemento}`;
    document.getElementById('displayNome').innerText = jogador.nome;
    
    atualizarHud();
    prepararBatalha(); 
}

function gameLoop() {
    if (estadoJogo !== 'EXPLORACAO') return;
    const sprite = document.getElementById('hero-sprite');
    const marker = document.getElementById('mapa-heroi');
    let moveu = false;

    if (teclas['ArrowRight'] || teclas['d']) { 
        jogador.x += 5; 
        sprite.style.transform = `scale(${ESCALA_HEROI}) scaleX(1)`; 
        moveu = true; 
    }
    if (teclas['ArrowLeft'] || teclas['a']) { 
        jogador.x -= 5; 
        sprite.style.transform = `scale(${ESCALA_HEROI}) scaleX(-1)`; 
        moveu = true; 
    }

    if(jogador.x < 50) jogador.x = 50;
    
    const saida = document.getElementById('saida-fase');
    if(jogador.x > 860 && !emTransicao && !saida.classList.contains('escondido')) {
        emTransicao = true;
        avancarParaBatalha();
    } else if (jogador.x > 860) {
        jogador.x = 860;
        log("Fale com o Ent primeiro!", "orange");
    }

    sprite.style.left = jogador.x + 'px';
    marker.style.left = ((jogador.x - 50) / 800 * 100) + '%';
    
    if (moveu) sprite.classList.add('andando'); else sprite.classList.remove('andando');
    checarColisoes();
}

function checarColisoes() {
    const bau = document.getElementById('bau-tesouro');
    if (!bau.classList.contains('escondido') && !bau.classList.contains('aberto') && Math.abs(jogador.x - 400) < 50) {
        abrirBau();
    }
    const npc = document.getElementById('npc-sprite');
    if (!npc.classList.contains('escondido') && Math.abs(jogador.x - 600) < 60 && !historiaAberta) {
        interagirNPC();
    }
}

function gerarCenarioFundo() {
    const container = document.getElementById('scenery-container');
    container.innerHTML = "";
    for(let i=0; i<5; i++) {
        let t = document.createElement('div'); t.className = 'pixel-art arvore-fundo';
        t.style.left = (Math.random()*800)+"px"; 
        t.style.transform = `scale(${Math.random()*2+3})`; 
        container.appendChild(t);
    }
    for(let i=0; i<5; i++) {
        let b = document.createElement('div'); b.className = 'pixel-art arbusto';
        b.style.left = (Math.random()*800)+"px";
        container.appendChild(b);
    }
}

function prepararBatalha() {
    estadoJogo = 'BATALHA';
    emTransicao = false;
    
    if (jogador.nivel > biomas[biomaIndex].maxLvl && biomaIndex < biomas.length - 1) biomaIndex++;
    const dados = biomas[biomaIndex];
    
    document.getElementById('tela-batalha').className = ""; 
    document.getElementById('tela-batalha').classList.add(dados.css);
    document.getElementById('nomeLocal').innerText = dados.nome;

    const sprite = document.getElementById('hero-sprite');
    sprite.classList.remove('livre', 'andando');
    sprite.style.cssText = ""; 
    sprite.style.transform = `scale(${ESCALA_HEROI}) scaleX(1)`; 
    
    document.querySelector('.hero-side').style.opacity = "1"; 
    document.querySelector('.battlefield').classList.remove('modo-exploracao');
    
    document.getElementById('scenery-container').innerHTML = "";
    document.getElementById('bau-tesouro').classList.add('escondido');
    document.getElementById('npc-sprite').classList.add('escondido');
    document.getElementById('saida-fase').classList.add('escondido');
    document.getElementById('menu-batalha').classList.remove('escondido');

    const nomeMob = dados.inimigos[Math.floor(Math.random() * dados.inimigos.length)];
    monstro.nome = nomeMob;
    monstro.vidaMax = 400 + (jogador.nivel * 100);
    monstro.vida = monstro.vidaMax;
    monstro.dano = 20 + (jogador.nivel * 10);
    monstro.xpReward = 150 + (jogador.nivel * 20);
    
    document.getElementById('nomeMonstro').innerText = `${monstro.nome} Lv.${jogador.nivel}`;
    document.getElementById('xpRewardDisplay').innerText = `Recompensa: ${monstro.xpReward} XP`;
    const enemySprite = document.getElementById('enemy-sprite');
    enemySprite.style.opacity = "1"; enemySprite.classList.remove('morto');
    enemySprite.style.transform = `scale(${ESCALA_HEROI}) scaleX(-1)`;
    
    log(`Um ${monstro.nome} bloqueia o caminho!`);
    atualizarHud();
}

function iniciarExploracao() {
    estadoJogo = 'EXPLORACAO';
    log("Caminho livre.", "white");
    
    const sprite = document.getElementById('hero-sprite');
    // Força o herói a aparecer e ficar na posição correta
    sprite.style.cssText = ""; // Limpa inlines da batalha
    sprite.classList.add('livre'); 
    
    jogador.x = 50; 
    sprite.style.left = jogador.x + 'px';
    sprite.style.transform = `scale(${ESCALA_HEROI}) scaleX(1)`;

    document.querySelector('.battlefield').classList.add('modo-exploracao');
    document.getElementById('menu-batalha').classList.add('escondido');
    
    gerarCenarioFundo();

    if (indiceHistoria < capitulosHistoria.length) {
        const npc = document.getElementById('npc-sprite');
        npc.className = "pixel-art ent-antigo";
        npc.classList.remove('escondido'); npc.style.left = "600px";
        log("Fale com o Ent Antigo.", "lime");
    } else {
        document.getElementById('saida-fase').classList.remove('escondido');
    }

    if (Math.random() > 0.7) {
        const bau = document.getElementById('bau-tesouro');
        bau.classList.remove('escondido', 'aberto'); bau.style.opacity="1"; bau.style.left = (Math.random()*300+200)+"px";
    }
}

function interagirNPC() {
    estadoJogo = 'HISTORIA';
    historiaAberta = true;
    const cap = capitulosHistoria[indiceHistoria];
    document.getElementById('story-title').innerText = cap.titulo;
    document.getElementById('story-text').innerText = cap.texto;
    document.getElementById('story-modal').classList.remove('escondido');
    document.getElementById('npc-sprite').classList.add('escondido');
}

function fecharLivroHistoria() {
    document.getElementById('story-modal').classList.add('escondido');
    historiaAberta = false;
    if(indiceHistoria < capitulosHistoria.length) indiceHistoria++;
    document.getElementById('saida-fase').classList.remove('escondido');
    estadoJogo = 'EXPLORACAO';
}

function avancarParaBatalha() { prepararBatalha(); }
function abrirBau() { const b=document.getElementById('bau-tesouro'); if(b.classList.contains('aberto'))return; b.classList.add('aberto'); b.style.opacity="0.5"; jogador.gold+=50; log("+50 Ouro!", "gold"); atualizarHud(); }
function toggleLoja() { const l=document.getElementById('menu-loja'); l.classList.toggle('escondido'); estadoJogo=l.classList.contains('escondido')?(document.getElementById('menu-batalha').classList.contains('escondido')?'EXPLORACAO':'BATALHA'):'LOJA'; }
function comprar(i) { if(i=='potion'&&jogador.gold>=50){jogador.gold-=50;jogador.potions++;log("Comprou Poção.");} else if(i=='upgrade'&&jogador.gold>=200){jogador.gold-=200;jogador.ataqueBase+=10;log("Upgrade!");} else log("Ouro insuficiente."); atualizarHud(); }
function usarPotion() { if(jogador.potions>0){jogador.potions--;jogador.vida+=200;if(jogador.vida>jogador.vidaMax)jogador.vida=jogador.vidaMax;atualizarHud();} }
function danoAmbiental() { if(estadoJogo==='EXPLORACAO' && biomas[biomaIndex].nome.includes("Deserto")) { jogador.vida-=5; atualizarHud(); } }
function turno(acao) { if(estadoJogo!=='BATALHA')return; let d=jogador.calcularDano(acao); monstro.vida-=d; log(`Dano: ${d}`); animar('#enemy-sprite','tremer'); atualizarHud(); if(monstro.vida<=0)vitoria(); else setTimeout(turnoMonstro,600); }
function turnoMonstro() { let d=monstro.dano; jogador.vida-=d; log(`Inimigo atacou: -${d}`, 'red'); animar('#hero-sprite','tremer'); atualizarHud(); if(jogador.vida<=0){alert("Game Over");location.reload();} }
function vitoria() { document.getElementById('enemy-sprite').classList.add('morto'); jogador.ganharXp(monstro.xpReward); jogador.gold+=25; log("Vitória!", "green"); setTimeout(iniciarExploracao,1000); }
function atualizarHud() { document.getElementById('hp-hero-fill').style.width=Math.max(0,(jogador.vida/jogador.vidaMax*100))+'%'; document.getElementById('hp-hero-text').innerText=`${jogador.vida}/${jogador.vidaMax}`; document.getElementById('hp-enemy-fill').style.width=Math.max(0,(monstro.vida/monstro.vidaMax*100))+'%'; document.getElementById('hp-enemy-text').innerText=`${monstro.vida}/${monstro.vidaMax}`; if(jogador.vida<jogador.vidaMax*0.3) document.getElementById('tela-batalha').classList.add('perigo'); else document.getElementById('tela-batalha').classList.remove('perigo'); document.getElementById('goldDisplay').innerText=jogador.gold; document.getElementById('heroLevel').innerText=jogador.nivel; document.getElementById('qtdPotion').innerText=jogador.potions; }
function log(msg,c) { const b=document.getElementById('log-batalha'); b.innerHTML+=`<p style="color:${c}">${msg}</p>`; b.scrollTop=9999; }
function animar(s,a) { const el=document.querySelector(s); el.classList.add(a); setTimeout(()=>el.classList.remove(a),500); }