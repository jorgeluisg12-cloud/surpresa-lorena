/* ============================================================
   CONFIG.js
   Todo o conteúdo do jogo "De Parauapebas até Você ❤️"
   pode ser editado aqui, sem precisar tocar na lógica do jogo.
   ============================================================ */

const CONFIG = {

  gameTitle: "De Parauapebas até Você",
  playerName: "Lorena",
  partnerName: "Jorge",

  // Música tocada no encontro final (coloque o arquivo em assets/audio/)
  music: {
    src: "assets/audio/musica-final.mp3",
    title: "Partilhar - Rubel"
  },

  // Textos da tela inicial (aparecem em sequência, com fade)
  intro: [
    "Todo fim de semana existe uma jornada.",
    "Mas algumas jornadas possuem um destino especial."
  ],
  startButtonText: "Começar",

  // ----------------------------------------------------------
  // CAPÍTULOS
  // start / end = posição (em "metros" do mundo) onde o capítulo
  // começa e termina. A jornada tem 12000 metros no total.
  // ----------------------------------------------------------
  chapters: [
    {
      id: 1,
      name: "PARAUAPEBAS",
      start: 0,
      end: 1500,
      sky: ["#bfe6f5", "#eaf6ff"],
      ground: "#7cb86b",
      theme: "morning"
    },
    {
      id: 2,
      name: "A ESTRADA",
      start: 1500,
      end: 4000,
      sky: ["#a9d8f0", "#e8f7ff"],
      ground: "#6fae5e",
      theme: "road",
      message: "Mesmo quando o caminho parece longo..."
    },
    {
      id: 3,
      name: "A DISTÂNCIA",
      start: 4000,
      end: 6500,
      sky: ["#90a6b8", "#cdd9e2"],
      ground: "#5d8a55",
      theme: "rain",
      signs: [
        { x: 4500, label: "TRABALHO" },
        { x: 5200, label: "CANSAÇO" },
        { x: 5900, label: "SAUDADE" }
      ],
      messages: [
        "Algumas pessoas fariam o caminho uma vez.",
        "Você escolhe fazê-lo várias vezes."
      ]
    },
    {
      id: 4,
      name: "QUASE LÁ",
      start: 6500,
      end: 9000,
      sky: ["#ffb37b", "#ffe0b3"],
      ground: "#8a7a4a",
      theme: "sunset",
      message: "Eu te amo mil..."
    },
    {
      id: 5,
      name: "MARABÁ",
      start: 9000,
      end: 12000,
      sky: ["#ff9966", "#ffd9a0"],
      ground: "#8a7a4a",
      theme: "arrival"
    }
  ],

  // ----------------------------------------------------------
  // CORAÇÕES — mensagens em sequência
  // ----------------------------------------------------------
  hearts: [
    { x: 700,  text: "Eu te amo..." },
    { x: 2600, text: "Eu te amo mil..." },
    { x: 8400, text: "Eu te amo mil milhões..." }
  ],

  // ----------------------------------------------------------
  // MEMÓRIAS — cartões especiais (Capítulo 4)
  // Edite livremente título e texto de cada memória.
  // ----------------------------------------------------------
  memories: [
    {
      x: 6900,
      title: "Nosso primeiro encontro",
      text: "O dia em que tudo começou. Eu não sabia ainda, mas aquele encontro mudaria a minha vida para sempre."
    },
    {
      x: 7500,
      title: "Nossa primeira viagem",
      text: "Estradas novas, risadas no caminho e a sensação de que, ao seu lado, qualquer lugar vira um lugar especial."
    },
    {
      x: 8100,
      title: "Nosso primeiro café",
      text: "Uma xícara, uma conversa e o tempo parando. Foi naquele café que percebi: eu queria mais momentos assim."
    },
    {
      x: 8700,
      title: "Nossas conversas infinitas",
      text: "Madrugadas adentro, sem perceber o tempo passar. Com você, até o silêncio é um lugar confortável."
    }
  ],

  // ----------------------------------------------------------
  // EASTER EGGS — corações escondidos
  // O jogador deve apertar "Pular" perto desses pontos para
  // encontrá-los.
  // ----------------------------------------------------------
  easterEggs: [1000, 3200, 5500, 7800, 10500],
  easterEggMessage: "Você encontrou todos os pedaços da nossa história.",

  // ----------------------------------------------------------
  // CONQUISTAS
  // ----------------------------------------------------------
  achievements: [
    { id: "steps",    name: "Primeiros Passos",            desc: "Você começou a jornada.",                 icon: "🏆" },
    { id: "distance", name: "Superando a Distância",       desc: "Você venceu o caminho mais difícil.",     icon: "🏆" },
    { id: "memories", name: "Colecionadora de Memórias",   desc: "Você reuniu todas as memórias.",          icon: "🏆" },
    { id: "almost",   name: "Quase em Casa",                desc: "Você está quase chegando.",                icon: "🏆" },
    { id: "finish",   name: "Meu Destino Favorito",         desc: "Você chegou ao seu destino favorito.",     icon: "🏆" },
    { id: "eggs",     name: "Pedaços da Nossa História",     desc: "Você encontrou todos os corações escondidos.", icon: "💖" }
  ],

  // Mensagem final, exibida no reencontro em Marabá
  finalMessage: "Porque a melhor parte da viagem sempre foi você.",

  // ----------------------------------------------------------
  // ASSETS — sprites opcionais.
  // Se os arquivos abaixo não existirem, o jogo desenha os
  // personagens automaticamente em pixel art (fallback).
  // Basta colocar imagens PNG (fundo transparente) nesses
  // caminhos para usar sua própria arte.
  // ----------------------------------------------------------
  assets: {
    lorena: {
      idle: "assets/sprites/lorena_idle.png",
      run:  ["assets/sprites/lorena_run1.png", "assets/sprites/lorena_run2.png"],
      jump: "assets/sprites/lorena_jump.png",
      cheer: "assets/sprites/lorena_cheer.png"
    },
    jorge: {
      idle: "assets/sprites/jorge_idle.png",
      wave: "assets/sprites/jorge_wave.png"
    },
    backgrounds: {
      // opcional: imagens de fundo por capítulo (1 a 5)
      // ch1: "assets/backgrounds/ch1.png", etc.
    }
  }
};
