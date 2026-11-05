
let tela = "inicio";
let quantidadeJogadores = 2;
let jogadores = [];
let jogadorAtual = 0;
let casas = [];
let botoes = [];
let dado = 1;
let mensagem = "Bem-vindo ao Império Empresarial!";
let acaoPendente = null;
let rodadas = 3;
let jogoFinalizado = false;

const cores = [
  [255, 85, 85],
  [65, 160, 255],
  [255, 195, 55],
  [100, 220, 145],
  [190, 120, 255],
  [255, 135, 195]
];

function setup() {
  createCanvas(1000, 760);
  textFont("Arial");
  textAlign(CENTER, CENTER);
  criarTabuleiro();
}

function criarTabuleiro() {
  casas = [
    {tipo:"inicio", nome:"INICIO"},
    {tipo:"evento", nome:"SORTE"},
    {tipo:"empresa", nome:"PADARIA", preco:2000, aluguel:400},
    {tipo:"evento", nome:"EVENTO"},
    {tipo:"empresa", nome:"MERCADO", preco:3000, aluguel:600},
    {tipo:"imposto", nome:"IMPOSTO"},
    {tipo:"investir", nome:"INVESTIR"},
    {tipo:"empresa", nome:"RESTAURANTE", preco:4000, aluguel:800},
    {tipo:"bonus", nome:"BONUS"},
    {tipo:"empresa", nome:"LOJA", preco:2500, aluguel:500},
    {tipo:"evento", nome:"SORTE"},
    {tipo:"descanso", nome:"PAUSA"},
    {tipo:"empresa", nome:"FABRICA", preco:5000, aluguel:1000},
    {tipo:"imposto", nome:"IMPOSTO"},
    {tipo:"empresa", nome:"HOTEL", preco:6000, aluguel:1200},
    {tipo:"investir", nome:"INVESTIR"},
    {tipo:"evento", nome:"EVENTO"},
    {tipo:"empresa", nome:"SHOPPING", preco:7000, aluguel:1500},
    {tipo:"descanso", nome:"PAUSA"},
    {tipo:"empresa", nome:"TECNOLOGIA", preco:8000, aluguel:1800},
    {tipo:"bonus", nome:"BONUS"},
    {tipo:"investir", nome:"INVESTIR"},
    {tipo:"evento", nome:"SORTE"},
    {tipo:"descanso", nome:"PAUSA"}
  ];

  for (let c of casas) {
    c.dono = -1;
  }
}

function iniciarJogo() {
  jogadores = [];

  for (let i = 0; i < quantidadeJogadores; i++) {
    jogadores.push({
      nome: "Jogador " + (i + 1),
      cor: cores[i],
      dinheiro: 10000,
      posicao: 0,
      voltas: 0,
      investimentos: 0
    });
  }

  jogadorAtual = 0;
  dado = 1;
  acaoPendente = null;
  jogoFinalizado = false;
  mensagem = "A partida começou!";
  tela = "jogo";
}

function draw() {
  background(22, 31, 48);
  botoes = [];

  if (tela === "inicio") {
    desenharInicio();
  } else if (tela === "jogo") {
    desenharJogo();
  } else {
    desenharFinal();
  }
}

// =================================
// TELA INICIAL
// =================================

function desenharInicio() {
  fill(255);
  textSize(42);
  text("IMPERIO EMPRESARIAL", width / 2, 110);

  fill(100, 220, 160);
  textSize(20);
  text("Construa seu imperio e seja o maior empresario!",
       width / 2, 170);

  fill(230);
  textSize(19);
  text("ESCOLHA A QUANTIDADE DE JOGADORES",
       width / 2, 290);

  for (let i = 2; i <= 6; i++) {
    let x = 185 + (i - 2) * 130;

    criarBotao(
      String(i),
      x, 350, 95, 75,
      () => quantidadeJogadores = i,
      quantidadeJogadores === i
    );
  }

  fill(230);
  textSize(17);
  text("Cada jogador começa com R$ 10.000",
       width / 2, 480);

  text("Complete 3 voltas e acumule o maior patrimonio.",
       width / 2, 515);

  criarBotao("COMEÇAR PARTIDA",
    350, 570, 300, 75, iniciarJogo);
}

// =================================
// POSICOES DO TABULEIRO
// =================================

function posicaoCasa(i) {
  let col, row;
  let x = 25;
  let y = 75;
  let tamanho = 75;
  let espaco = 4;

  if (i <= 6) {
    col = i;
    row = 0;
  } else if (i <= 11) {
    col = 6;
    row = i - 6;
  } else if (i <= 18) {
    col = 18 - i;
    row = 6;
  } else {
    col = 0;
    row = 24 - i;
  }

  return {
    x: x + col * (tamanho + espaco),
    y: y + row * (tamanho + espaco),
    tamanho: tamanho
  };
}

function corCasa(tipo) {
  if (tipo === "inicio") return [70, 190, 120];
  if (tipo === "empresa") return [65, 110, 180];
  if (tipo === "imposto") return [210, 80, 80];
  if (tipo === "bonus") return [220, 170, 50];
  if (tipo === "investir") return [145, 90, 200];
  if (tipo === "evento") return [210, 120, 60];
  return [80, 95, 115];
}

// =================================
// DESENHAR TABULEIRO
// =================================

function desenharTabuleiro() {
  for (let i = 0; i < casas.length; i++) {
    let p = posicaoCasa(i);
    let c = casas[i];

    fill(...corCasa(c.tipo));
    stroke(255, 100);
    strokeWeight(1);
    rect(p.x, p.y, p.tamanho, p.tamanho, 8);

    noStroke();
    fill(255);
    textSize(10);
    text(c.nome, p.x + 37, p.y + 17);

    if (c.tipo === "empresa") {
      textSize(10);
      text("R$" + c.preco, p.x + 37, p.y + 37);

      if (c.dono !== -1) {
        fill(...jogadores[c.dono].cor);
        circle(p.x + 37, p.y + 60, 15);
      }
    }

    if (c.tipo === "inicio") {
      textSize(10);
      text("SAIDA", p.x + 37, p.y + 43);
    }

    for (let j = 0; j < jogadores.length; j++) {
      if (jogadores[j].posicao === i) {
        let coluna = j % 3;
        let linha = floor(j / 3);

        let px = p.x + 18 + coluna * 19;
        let py = p.y + 65 + linha * 12;

        fill(...jogadores[j].cor);
        stroke(255);
        circle(px, py, 15);
        noStroke();
      }
    }
  }

  fill(35, 48, 70);
  rect(110, 170, 335, 315, 15);

  fill(255);
  textSize(24);
  text("IMPERIO", 277, 225);
  text("EMPRESARIAL", 277, 260);

  fill(100, 220, 160);
  textSize(18);
  text("Construa seu negocio!", 277, 320);

  fill(220);
  textSize(15);
  text("Compre empresas", 277, 370);
  text("Invista e receba alugueis", 277, 400);
  text("Acumule seu patrimonio", 277, 430);
}

// =================================
// PAINEL DO JOGO
// =================================

function desenharJogo() {
  desenharTabuleiro();

  fill(255);
  textAlign(LEFT, CENTER);
  textSize(23);
  text("PAINEL DOS EMPRESARIOS", 575, 48);
  textAlign(CENTER, CENTER);

  for (let i = 0; i < jogadores.length; i++) {
    let j = jogadores[i];
    let x = 575;
    let y = 85 + i * 70;

    fill(42, 55, 77);
    rect(x, y, 395, 62, 10);

    fill(...j.cor);
    circle(x + 25, y + 31, 20);

    fill(255);
    textAlign(LEFT, CENTER);
    textSize(14);
    text(j.nome, x + 48, y + 16);

    textSize(12);
    text("Caixa: R$ " + j.dinheiro.toLocaleString("pt-BR"),
         x + 48, y + 42);

    fill(180);
    textAlign(RIGHT, CENTER);
    text("Voltas: " + j.voltas + "/3", x + 375, y + 17);
    text("Patrimonio: R$ " +
      patrimonio(i).toLocaleString("pt-BR"),
      x + 375, y + 42);

    textAlign(CENTER, CENTER);
  }

  let atual = jogadores[jogadorAtual];

  fill(255);
  textSize(19);
  text("VEZ DE " + atual.nome.toUpperCase(), 775, 550);

  fill(...atual.cor);
  circle(775, 585, 25);

  fill(255);
  textSize(20);
  text("DADO: " + dado, 775, 620);

  if (!acaoPendente && !jogoFinalizado) {
    criarBotao("LANCAR DADO",
      640, 675, 270, 60, jogarDado);
  }

  if (acaoPendente) {
    desenharAcao();
  }

  fill(200);
  textSize(12);
  text("Cada jogador completa 3 voltas.",
       775, 745);
}

// =================================
// DADOS E MOVIMENTACAO
// =================================

function jogarDado() {
  if (acaoPendente || jogoFinalizado) return;

  let j = jogadores[jogadorAtual];

  dado = floor(random(1, 7));

  let nova = j.posicao + dado;

  if (nova >= 24) {
    j.voltas++;
    j.dinheiro += 1000;
    mensagem = j.nome +
      " passou pelo inicio e recebeu R$ 1.000!";
  }

  j.posicao = nova % 24;

  resolverCasa();
}

// =================================
// RESOLVER CASA
// =================================

function resolverCasa() {
  let j = jogadores[jogadorAtual];
  let c = casas[j.posicao];

  if (c.tipo === "inicio") {
    mensagem = "Voce chegou ao inicio!";
    proximoJogador();
    return;
  }

  if (c.tipo === "empresa") {
    if (c.dono === -1) {
      mensagem = "Empresa disponivel para compra!";
      acaoPendente = "empresa";
      return;
    }

    if (c.dono === jogadorAtual) {
      mensagem = "Esta empresa ja pertence a voce!";
      proximoJogador();
      return;
    }

    let aluguel = c.aluguel;
    let dono = jogadores[c.dono];

    let pagamento = min(j.dinheiro, aluguel);
    j.dinheiro -= pagamento;
    dono.dinheiro += pagamento;

    mensagem = j.nome + " pagou R$ " +
      pagamento + " de aluguel para " + dono.nome + ".";

    proximoJogador();
    return;
  }

  if (c.tipo === "imposto") {
    let imposto = min(j.dinheiro, 1000);
    j.dinheiro -= imposto;
    mensagem = "Voce pagou R$ " + imposto + " de impostos!";
    proximoJogador();
    return;
  }

  if (c.tipo === "bonus") {
    let premio = floor(random(500, 2001));
    j.dinheiro += premio;
    mensagem = "Parabens! Voce recebeu R$ " + premio + " de bonus!";
    proximoJogador();
    return;
  }

  if (c.tipo === "investir") {
    mensagem = "Deseja investir no mercado financeiro?";
    acaoPendente = "investir";
    return;
  }

  if (c.tipo === "evento") {
    eventoAleatorio();
    proximoJogador();
    return;
  }

  if (c.tipo === "descanso") {
    mensagem = "Dia tranquilo! Nenhuma movimentacao financeira.";
    proximoJogador();
    return;
  }
}

// =================================
// EVENTOS ALEATORIOS
// =================================

function eventoAleatorio() {
  let j = jogadores[jogadorAtual];

  let eventos = [
    {texto:"Voce conseguiu um grande cliente! +R$ 1.500", dinheiro:1500},
    {texto:"Despesas inesperadas! -R$ 1.000", dinheiro:-1000},
    {texto:"Campanha de marketing deu certo! +R$ 2.000", dinheiro:2000},
    {texto:"Premio empresarial! +R$ 800", dinheiro:800},
    {texto:"Manutencao de equipamentos! -R$ 700", dinheiro:-700},
    {texto:"Venda especial! +R$ 1.200", dinheiro:1200}
  ];

  let e = random(eventos);
  j.dinheiro += e.dinheiro;

  mensagem = e.texto;
}

// =================================
// ACOES DE COMPRA E INVESTIMENTO
// =================================

function desenharAcao() {
  fill(20, 30, 48);
  rect(570, 510, 410, 220, 12);

  fill(255);
  textSize(15);
  text(mensagem, 775, 540, 380, 45);

  if (acaoPendente === "empresa") {
    let c = casas[jogadores[jogadorAtual].posicao];

    fill(255);
    textSize(13);
    text("Preco: R$ " + c.preco +
      " | Aluguel: R$ " + c.aluguel,
      775, 590);

    criarBotao("COMPRAR",
      590, 625, 175, 50, comprarEmpresa);

    criarBotao("PASSAR",
      780, 625, 175, 50, () => {
        acaoPendente = null;
        proximoJogador();
      });
  }

  if (acaoPendente === "investir") {
    fill(255);
    textSize(13);
    text("Invista R$ 1.000 e receba R$ 1.500 em patrimonio.",
      775, 590, 380, 35);

    criarBotao("INVESTIR",
      590, 630, 175, 50, investir);

    criarBotao("PASSAR",
      780, 630, 175, 50, () => {
        acaoPendente = null;
        proximoJogador();
      });
  }
}

function comprarEmpresa() {
  let j = jogadores[jogadorAtual];
  let c = casas[j.posicao];

  if (j.dinheiro >= c.preco) {
    j.dinheiro -= c.preco;
    c.dono = jogadorAtual;
    mensagem = j.nome + " comprou " + c.nome + "!";
  } else {
    mensagem = "Dinheiro insuficiente para comprar!";
  }

  acaoPendente = null;
  proximoJogador();
}

function investir() {
  let j = jogadores[jogadorAtual];

  if (j.dinheiro >= 1000) {
    j.dinheiro -= 1000;
    j.investimentos += 1500;
    mensagem = "Investimento realizado! Patrimonio investido: R$ 1.500.";
  } else {
    mensagem = "Dinheiro insuficiente para investir!";
  }

  acaoPendente = null;
  proximoJogador();
}

// =================================
// CALCULO DE PATRIMONIO
// =================================

function patrimonio(indice) {
  let j = jogadores[indice];
  let total = j.dinheiro + j.investimentos;

  for (let c of casas) {
    if (c.dono === indice) {
      total += c.preco;
    }
  }

  return total;
}

// =================================
// PROXIMO JOGADOR
// =================================

function proximoJogador() {
  if (jogadores.every(j => j.voltas >= rodadas)) {
    finalizarJogo();
    return;
  }

  let tentativas = 0;

  do {
    jogadorAtual = (jogadorAtual + 1) % jogadores.length;
    tentativas++;
  } while (
    jogadores[jogadorAtual].voltas >= rodadas &&
    tentativas <= jogadores.length
  );
}

// =================================
// FINALIZAR PARTIDA
// =================================

function finalizarJogo() {
  jogoFinalizado = true;
  tela = "final";
}

// =================================
// TELA FINAL E CLASSIFICACAO
// =================================

function desenharFinal() {
  fill(255);
  textSize(38);
  text("FIM DO JOGO!", width / 2, 85);

  let ranking = jogadores.slice().sort(
    (a, b) => patrimonio(jogadores.indexOf(b)) -
              patrimonio(jogadores.indexOf(a))
  );

  let vencedor = ranking[0];

  fill(...vencedor.cor);
  textSize(27);
  text("CAMPEAO: " + vencedor.nome.toUpperCase(),
       width / 2, 155);

  fill(100, 220, 160);
  textSize(22);
  text("Patrimonio: R$ " +
    patrimonio(jogadores.indexOf(vencedor)).toLocaleString("pt-BR"),
    width / 2, 205);

  fill(255);
  textSize(20);
  text("CLASSIFICACAO FINAL", width / 2, 280);

  for (let i = 0; i < ranking.length; i++) {
    let j = ranking[i];
    let original = jogadores.indexOf(j);

    fill(40, 55, 78);
    rect(220, 315 + i * 55, 560, 45, 10);

    fill(...j.cor);
    circle(250, 337 + i * 55, 20);

    fill(255);
    textAlign(LEFT, CENTER);
    textSize(16);
    text((i + 1) + " - " + j.nome, 280, 337 + i * 55);

    textAlign(RIGHT, CENTER);
    text("R$ " + patrimonio(original).toLocaleString("pt-BR"),
         755, 337 + i * 55);

    textAlign(CENTER, CENTER);
  }

  criarBotao("JOGAR NOVAMENTE",
    350, 680, 300, 60, () => {
      criarTabuleiro();
      tela = "inicio";
    });
}

// =================================
// CRIACAO DE BOTOES
// =================================

function criarBotao(rotulo, x, y, w, h, acao, selecionado = false) {
  let ativo =
    mouseX >= x && mouseX <= x + w &&
    mouseY >= y && mouseY <= y + h;

  if (selecionado) {
    fill(60, 180, 125);
  } else if (ativo) {
    fill(75, 150, 180);
  } else {
    fill(48, 105, 125);
  }

  noStroke();
  rect(x, y, w, h, 10);

  fill(255);
  textSize(16);
  text(rotulo, x + w / 2, y + h / 2);

  botoes.push({x, y, w, h, acao});
}

function mousePressed() {
  for (let b of botoes) {
    if (
      mouseX >= b.x && mouseX <= b.x + b.w &&
      mouseY >= b.y && mouseY <= b.y + b.h
    ) {
      b.acao();
      return false;
    }
  }
}

function touchStarted() {
  mousePressed();
  return false;
}
