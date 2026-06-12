/* ============================================================
   PARTILHAR — script.js
   Pure JS. No dependencies.
============================================================ */

(() => {
  'use strict';

  /* ---------------------------------------------------------
     DATA — content blocks (from the content roteiro)
  --------------------------------------------------------- */

  const FLASHCARDS = [
    { tag: 'O riso', front: 'O riso mais lindo desse mundo.', back: 'Boca cheia de dentes, sorriso largo — a pureza de uma criança feliz por dentro. Eu reconheceria esse riso em qualquer lugar do mundo.' },
    { tag: 'Quando está nervosa', front: 'Ela fala rápido.', back: 'É o único sinal. Pra quem não conhece, passa despercebido. Pra mim, é como um aviso silencioso: "estou sentindo alguma coisa".' },
    { tag: 'O que a faz brilhar', front: 'Psicologia.', back: 'Quando ela fala do que faz, alguma coisa acende nos olhos dela. Não é trabalho. É vocação.' },
    { tag: 'O cuidado', front: 'Atos de serviço.', back: 'Ela demonstra carinho fazendo. Organizando, cuidando, resolvendo antes de você perceber que precisava.' },
    { tag: 'A jornada', front: 'De Parauapebas para Marabá.', back: 'Sem medir esforço. Sempre que pode, ela está por perto — porque presença, pra ela, não é palavra. É escolha repetida.' },
    { tag: 'O que ela ama', front: 'Sushi.', back: 'Quando ela quer se mimar, é sushi. Um detalhe pequeno que diz muito sobre cuidar de si mesma.' },
    { tag: 'A transformação', front: '"Eu nunca digo eu te amo."', back: 'Foi o que ela disse um dia. Hoje, é "te amo, te amo, te amo" — repetido, fácil, sem medo.' },
    { tag: 'O olhar', front: 'Os olhos dela.', back: 'Ela não sabe, mas tem um olhar poderoso. Cativante. Um olhar que diz coisas antes da boca.' },
  ];

  const TIMELINE_NODES = [
    { tag: 'Curiosidade — fim de 2023', text: 'Um show de stand-up, uma mulher sozinha pedindo para sentar à minha mesa. Eu não sabia ainda, mas alguma coisa tinha começado.' },
    { tag: 'Confirmação — 23/11/2025', text: 'Dois anos depois, finalmente um jantar a sós no Jaboticaba. Saí dali diferente — e sem entender muito bem por quê.' },
    { tag: 'Escolha — 23/12/2025', text: 'Antes de uma viagem em família, decidi: eu não ia te apresentar sem antes ter certeza do que nós éramos. Te pedi em namoro. De propósito.' },
    { tag: 'Confiança — viagem a Marabá', text: 'Pouco tempo de conversa, e você veio. Sem medo. Esse gesto valeu mais do que qualquer palavra.' },
    { tag: 'Leveza — Réveillon em Salvador', text: 'Paralamas do Sucesso, praia, fogos, dez milhões de pessoas — e um beijo que parecia ser só nosso.' },
    { tag: 'Casa — depois da virada', text: 'Dentro de um Uber, de madrugada, em uma cidade que não era a nossa, você confiou sem perguntar nada. Foi aí que eu soube.' },
    { tag: 'Pertencimento — hoje', text: 'A noite do macarrão. A noite dos jogos. A oração antes de dormir. Pequenos rituais que formam um lar — mesmo à distância.' },
    { tag: 'O que vem — em branco', text: 'Esse espaço está vazio de propósito. O que vem depois, a gente escreve junto.' },
  ];

  const QUIZ = [
    {
      q: 'Onde nos conhecemos de verdade — a primeira vez que conversamos?',
      options: ['Em uma festa de amigos em comum', 'Em um show de stand-up no Araguaia', 'Em um aplicativo', 'No trabalho'],
      correct: 1,
      reveal: 'Você chegou sozinha, pediu pra sentar na minha mesa porque eu estava de frente pro palco. Eu nem soube reagir — só pensei: "essa mulher não pode estar pedindo isso pra mim".'
    },
    {
      q: 'Quanto tempo depois daquele primeiro contato veio o nosso primeiro encontro a sós?',
      options: ['Uma semana', 'Um mês', 'Dois anos', 'Três meses'],
      correct: 2,
      reveal: 'Dois anos. Achei que tinha perdido o momento. Mas quando finalmente aconteceu — no Jaboticaba — entendi que talvez o tempo certo simplesmente não tivesse pressa.'
    },
    {
      q: 'Em que data oficialmente começamos a namorar?',
      options: ['22/12/2025', '23/12/2025', '01/01/2026', '23/11/2025'],
      correct: 1,
      reveal: '23/12/2025. Antes da viagem para Imperatriz. Eu não poderia te apresentar pra minha família sem que você soubesse, com clareza, o que nós dois éramos.'
    },
    {
      q: 'Qual foi a primeira frase que você disse para mim e que eu nunca esqueci?',
      options: ['"Você é engraçado"', '"Você tem razão"', '"Vamos viajar"', '"Eu gosto de você"'],
      correct: 1,
      reveal: '"Você tem razão." Pode parecer pouco. Mas eu nunca tinha ouvido isso de verdade de ninguém. Foi a primeira vez que senti que estava sendo ouvido — não só escutado.'
    },
    {
      q: 'Qual banda estava tocando no nosso primeiro Réveillon juntos?',
      options: ['Skank', 'Paralamas do Sucesso', 'Jota Quest', 'Capital Inicial'],
      correct: 1,
      reveal: 'Paralamas do Sucesso, na praia, dez milhões de pessoas e nós dois no meio de tudo — e mesmo assim, parecia que era só pra nós.'
    },
  ];

  const REASONS = [
    'Porque você teve a coragem de sentar à mesa de um estranho — e esse estranho nunca mais foi o mesmo.',
    'Porque seu riso tem dentes, tem largura, tem a pureza de quem ainda guarda a criança por dentro.',
    'Porque quando você fica nervosa, fala mais rápido — e esse é o único disfarce que você não sabe que tem.',
    'Porque você ama o que faz. Psicologia não é seu emprego — é parte de quem você é, e isso se vê.',
    'Porque você demonstra cuidado fazendo, não falando. Atos de serviço são sua linguagem materna.',
    'Porque você é absurdamente caridosa, solícita, presente — para todo mundo, sem cobrar nada em troca.',
    'Porque você estuda até tarde, sempre, com uma disciplina que eu admiro mais do que jamais disse.',
    'Porque você atravessa a distância entre Parauapebas e Marabá sem medir esforço — porque pra você, presença é escolha.',
    'Porque seu olhar tem um poder que você provavelmente nunca percebeu que tem.',
    'Porque você confiou em mim dentro de um Uber, de madrugada, numa cidade que não era a sua — sem perguntar nada.',
    'Porque a mulher que disse "eu nunca falo eu te amo" hoje fala isso três vezes seguidas, sem medo.',
    'Porque você é minha comissária de bordo nas viagens de carro — e a guardiã oficial de todos os detalhes.',
    'Porque você ronca baixinho de madrugada, e em algum momento isso deixou de me incomodar e passou a ser o som de você estar ali.',
    'Porque você lambe minha orelha do nada — e eu não tenho a menor ideia de por que isso é tão você, mas é.',
    'Porque quando está errada, você admite, ri, e segue — sem fazer disso uma guerra.',
    'Porque você tem medo de vulcão e de terremoto — coisas que eu, sinceramente, adoro, porque acho fofo demais.',
    'Porque eu disse que não gostava de dormir colado — e hoje é a única forma que eu durmo bem.',
    'Porque você nunca brigou de verdade comigo. Não porque evita — porque ama de um jeito que não precisa disso.',
    'Porque quando falamos de Deus e de família, alguma coisa em você se acalma — e isso me ensina.',
    'Porque você é, sem nenhuma dúvida, a pessoa mais honesta que já passou pela minha vida.',
    'Porque sua presença sozinha — sem fazer nada — já tem o efeito de me trazer paz.',
    'Porque você atravessou uma história de vida difícil e chegou aqui forte, leve, inteira — e isso me deixa orgulhoso de um jeito que nem sei explicar.',
    'Porque em 23/12/2025 eu escolhi você. E todos os dias depois disso, escolho de novo.',
  ];

  const GALLERY = [
    { src: 'assets/foto-1.jpg', caption: 'Nós dois.' },
    { src: 'assets/foto-2.jpg', caption: 'Um outro momento, a mesma certeza.' },
    { src: 'assets/foto-3.jpg', caption: 'O jeito que eu mais gosto de ver você.' },
    { src: 'assets/foto-4.jpg', caption: 'Imperatriz — onde tudo, de algum jeito, começa.' },
  ];

  const MEDALS = [
    { id: 'start', icon: '✦', name: 'O início', desc: 'Você começou a jornada.' },
    { id: 'constellation', icon: '✶', name: 'Constelação', desc: 'Tocou e formou a constelação.' },
    { id: 'letter', icon: '✉', name: 'Carta oculta', desc: 'Encontrou a carta escondida na Tela 3.' },
    { id: 'flashcards', icon: '◈', name: 'Todas as fichas', desc: 'Virou todas as flashcards.' },
    { id: 'portal', icon: '⌘', name: 'Escolha feita', desc: 'Escolheu um caminho no portal.' },
    { id: 'timeline', icon: '⟿', name: 'Nossa linha', desc: 'Explorou a linha do tempo.' },
    { id: 'vault', icon: '⚷', name: 'O cofre', desc: 'Abriu o cofre.' },
    { id: 'quiz', icon: '?', name: 'Quiz completo', desc: 'Respondeu todas as perguntas.' },
    { id: 'reasons', icon: '23', name: '23 motivos', desc: 'Leu todos os motivos.' },
    { id: 'secret23', icon: '★', name: 'Detalhe escondido', desc: 'Encontrou o número 23 escondido.' },
    { id: 'mirror', icon: '◐', name: 'O espelho', desc: 'Abriu o easter egg final.' },
    { id: 'complete', icon: '♡', name: 'Jornada completa', desc: 'Chegou até o fim.' },
  ];

  /* ---------------------------------------------------------
     STATE
  --------------------------------------------------------- */
  const state = {
    unlocked: new Set(JSON.parse(localStorage.getItem('partilhar_medals') || '[]')),
    flippedCards: new Set(),
    quizAnswered: new Set(),
    visited23: false,
  };

  function saveMedals(){
    localStorage.setItem('partilhar_medals', JSON.stringify([...state.unlocked]));
  }

  /* ---------------------------------------------------------
     TOAST
  --------------------------------------------------------- */
  const toastEl = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg){
    clearTimeout(toastTimer);
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    toastTimer = setTimeout(() => toastEl.classList.remove('is-visible'), 3600);
  }

  /* ---------------------------------------------------------
     MEDALS
  --------------------------------------------------------- */
  const medalsGrid = document.getElementById('medalsGrid');
  const medalsCount = document.getElementById('medalsCount');

  function renderMedals(){
    medalsGrid.innerHTML = '';
    MEDALS.forEach(m => {
      const el = document.createElement('div');
      const unlocked = state.unlocked.has(m.id);
      el.className = 'medal' + (unlocked ? ' unlocked' : '');
      el.innerHTML = `${m.icon}<span class="medal-tooltip">${unlocked ? m.name : '???'}</span>`;
      medalsGrid.appendChild(el);
    });
    medalsCount.textContent = state.unlocked.size;
  }

  function unlockMedal(id){
    if (state.unlocked.has(id)) return;
    state.unlocked.add(id);
    saveMedals();
    renderMedals();
    const medal = MEDALS.find(m => m.id === id);
    if (medal) showToast(`✦ Conquista desbloqueada: ${medal.name}`);
  }

  document.getElementById('medalsToggle').addEventListener('click', () => {
    document.getElementById('medalsPanel').classList.toggle('is-open');
  });
  document.getElementById('medalsClose').addEventListener('click', () => {
    document.getElementById('medalsPanel').classList.remove('is-open');
  });

  /* ---------------------------------------------------------
     PROGRESS BAR
  --------------------------------------------------------- */
  const progressFill = document.getElementById('progressFill');
  function updateProgress(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------------------------------------------------------
     SCREEN ACTIVATION (IntersectionObserver)
  --------------------------------------------------------- */
  const screens = document.querySelectorAll('.screen');
  const screenObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.35){
        entry.target.classList.add('is-active');
        onScreenEnter(entry.target.id);
      }
    });
  }, { threshold: [0.35] });
  screens.forEach(s => screenObserver.observe(s));

  function onScreenEnter(id){
    switch(id){
      case 'screen-intro': break;
      case 'screen-3': break;
      case 'screen-7': animateTimeline(); break;
      case 'screen-final': revealMosaic(); break;
    }
  }

  /* ---------------------------------------------------------
     SCROLL CUES
  --------------------------------------------------------- */
  document.querySelectorAll('.scroll-cue').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.next;
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------------------------------------------------------
     INTRO — stars + enter
  --------------------------------------------------------- */
  const starsContainer = document.getElementById('stars');
  function buildStars(){
    const count = 60;
    for (let i = 0; i < count; i++){
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 1;
      star.style.width = size + 'px';
      star.style.height = size + 'px';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.setProperty('--star-op', (Math.random() * 0.6 + 0.2).toFixed(2));
      star.style.animationDelay = (Math.random() * 3) + 's, ' + (Math.random() * 4) + 's';
      starsContainer.appendChild(star);
    }
  }
  buildStars();

  document.getElementById('btnEnter').addEventListener('click', () => {
    unlockMedal('start');
    document.getElementById('screen-1').scrollIntoView({ behavior: 'smooth' });
    tryStartMusic();
  });

  /* ---------------------------------------------------------
     MUSIC
  --------------------------------------------------------- */
  const bgm = document.getElementById('bgm');
  const musicToggle = document.getElementById('musicToggle');
  let musicPlaying = false;

  function tryStartMusic(){
    bgm.volume = 0.55;
    bgm.play().then(() => {
      musicPlaying = true;
      musicToggle.classList.add('is-playing');
    }).catch(() => {
      // Autoplay blocked — wait for user gesture
    });
  }

  musicToggle.addEventListener('click', () => {
    if (musicPlaying){
      bgm.pause();
      musicPlaying = false;
      musicToggle.classList.remove('is-playing');
    } else {
      bgm.play().then(() => {
        musicPlaying = true;
        musicToggle.classList.add('is-playing');
      }).catch(() => {});
    }
  });

  function playSfx(id){
    const el = document.getElementById(id);
    if (!el) return;
    try {
      el.currentTime = 0;
      el.play().catch(() => {});
    } catch(e){}
  }

  /* ---------------------------------------------------------
     COUNTER — dias desde 23/12/2025
  --------------------------------------------------------- */
  const START_DATE = new Date('2025-12-23T00:00:00');
  const cDays = document.getElementById('cDays');
  const cHours = document.getElementById('cHours');
  const cMin = document.getElementById('cMin');
  const cSec = document.getElementById('cSec');

  function updateCounter(){
    const now = new Date();
    let diff = now - START_DATE;
    if (diff < 0) diff = 0;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    cDays.textContent = days;
    cHours.textContent = String(hours).padStart(2, '0');
    cMin.textContent = String(mins).padStart(2, '0');
    cSec.textContent = String(secs).padStart(2, '0');
  }
  updateCounter();
  setInterval(updateCounter, 1000);

  /* ---------------------------------------------------------
     CONSTELLATION (Screen 3) — touch to trace and light up
     a hidden "23" formed by star points.
  --------------------------------------------------------- */
  const canvas = document.getElementById('constellation');
  const ctx = canvas.getContext('2d');
  const constellationHint = document.getElementById('constellationHint');
  const hiddenLetter = document.getElementById('hiddenLetter');
  let constellationPoints = [];
  let activeTrail = [];
  let letterRevealed = false;
  let constellationTouched = false;

  // Normalized (0-1) coordinates tracing the digits "2" and "3"
  const SHAPE_23 = [
    // "2"
    [0.12,0.18],[0.20,0.12],[0.28,0.18],[0.28,0.30],
    [0.20,0.42],[0.12,0.54],[0.30,0.54],
    // "3"
    [0.45,0.18],[0.58,0.14],[0.66,0.22],[0.58,0.30],
    [0.46,0.34],[0.58,0.40],[0.66,0.48],[0.58,0.56],[0.45,0.54],
  ];

  function resizeCanvas(){
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    buildConstellationPoints();
  }

  function buildConstellationPoints(){
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // background ambient stars
    constellationPoints = [];
    for (let i = 0; i < 14; i++){
      constellationPoints.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.7 + h * 0.05,
        r: Math.random() * 1.3 + 0.8,
        baseOpacity: Math.random() * 0.3 + 0.12,
        ambient: true,
      });
    }

    // the hidden "23" shape points
    const offsetX = w * 0.18;
    const offsetY = h * 0.16;
    const scale = Math.min(w * 0.62, h * 0.62);
    SHAPE_23.forEach(([nx, ny]) => {
      constellationPoints.push({
        x: offsetX + nx * scale,
        y: offsetY + ny * scale,
        r: 2.4,
        baseOpacity: 0.18,
        ambient: false,
        lit: false,
      });
    });
  }

  function drawConstellation(){
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);

    // shape points — lit ones glow gold, unlit barely visible
    const shapePoints = constellationPoints.filter(p => !p.ambient);
    shapePoints.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.lit ? p.r * 1.8 : p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.lit ? 'rgba(184,134,11,0.95)' : `rgba(184,134,11,${p.baseOpacity})`;
      ctx.fill();
      if (p.lit){
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(184,134,11,0.12)';
        ctx.fill();
      }
    });

    // connect lit points in shape order for a "drawn" effect
    const litPoints = shapePoints.filter(p => p.lit);
    if (litPoints.length > 1){
      ctx.beginPath();
      let started = false;
      shapePoints.forEach(p => {
        if (p.lit){
          if (!started){ ctx.moveTo(p.x, p.y); started = true; }
          else ctx.lineTo(p.x, p.y);
        }
      });
      ctx.strokeStyle = 'rgba(184,134,11,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // ambient stars
    constellationPoints.filter(p => p.ambient).forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(184,134,11,${p.baseOpacity})`;
      ctx.fill();
    });

    // current touch trail
    if (activeTrail.length > 1){
      ctx.beginPath();
      ctx.moveTo(activeTrail[0].x, activeTrail[0].y);
      for (let i = 1; i < activeTrail.length; i++){
        ctx.lineTo(activeTrail[i].x, activeTrail[i].y);
      }
      ctx.strokeStyle = 'rgba(241,228,200,0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    if (activeTrail.length > 0){
      const last = activeTrail[activeTrail.length - 1];
      ctx.beginPath();
      ctx.arc(last.x, last.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(241,228,200,0.9)';
      ctx.fill();
    }

    requestAnimationFrame(drawConstellation);
  }

  function getCanvasPos(evt){
    const rect = canvas.getBoundingClientRect();
    const point = evt.touches ? evt.touches[0] : evt;
    return {
      x: point.clientX - rect.left,
      y: point.clientY - rect.top,
    };
  }

  function checkProximity(pos){
    const LIGHT_RADIUS = 28;
    let allLit = true;
    constellationPoints.filter(p => !p.ambient).forEach(p => {
      if (!p.lit){
        const d = Math.hypot(p.x - pos.x, p.y - pos.y);
        if (d < LIGHT_RADIUS) p.lit = true;
      }
      if (!p.lit) allLit = false;
    });
    if (allLit && !letterRevealed){
      revealConstellationLetter();
    }
  }

  function revealConstellationLetter(){
    letterRevealed = true;
    hiddenLetter.classList.add('is-visible');
    unlockMedal('letter');
    playSfx('sfx-chime');
    showToast('23. Você desenhou. E foi exatamente isso que aconteceu aquele dia.');
  }

  function handleConstellationStart(evt){
    constellationHint.classList.add('is-hidden');
    if (!constellationTouched){
      constellationTouched = true;
      unlockMedal('constellation');
    }
    const pos = getCanvasPos(evt);
    activeTrail.push(pos);
    if (activeTrail.length > 60) activeTrail.shift();
    checkProximity(pos);
  }
  function handleConstellationMove(evt){
    if (evt.cancelable) evt.preventDefault();
    const pos = getCanvasPos(evt);
    activeTrail.push(pos);
    if (activeTrail.length > 60) activeTrail.shift();
    checkProximity(pos);
  }
  function handleConstellationEnd(){
    setTimeout(() => { activeTrail = []; }, 600);
  }

  canvas.addEventListener('mousedown', handleConstellationStart);
  canvas.addEventListener('mousemove', (e) => { if (e.buttons === 1) handleConstellationMove(e); });
  canvas.addEventListener('mouseup', handleConstellationEnd);
  canvas.addEventListener('touchstart', handleConstellationStart, { passive: true });
  canvas.addEventListener('touchmove', handleConstellationMove, { passive: false });
  canvas.addEventListener('touchend', handleConstellationEnd);

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
  drawConstellation();

  /* ---------------------------------------------------------
     FLASHCARDS (Screen 4)
  --------------------------------------------------------- */
  const flashGrid = document.getElementById('flashGrid');
  function buildFlashcards(){
    FLASHCARDS.forEach((card, i) => {
      const el = document.createElement('div');
      el.className = 'flash-card';
      el.innerHTML = `
        <div class="flash-card-inner">
          <div class="flash-face flash-face--front">
            <span class="flash-tag">${card.tag}</span>
            <p class="flash-front-text">${card.front}</p>
            <span class="flash-flip-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 12a9 9 0 1 0 9-9M3 12l3-3M3 12l3 3"/></svg>
            </span>
          </div>
          <div class="flash-face flash-face--back">
            <span class="flash-tag">${card.tag}</span>
            <p class="flash-back-text">${card.back}</p>
          </div>
        </div>`;
      el.addEventListener('click', () => {
        el.classList.toggle('is-flipped');
        playSfx('sfx-flip');
        state.flippedCards.add(i);
        if (state.flippedCards.size === FLASHCARDS.length){
          unlockMedal('flashcards');
        }
      });
      flashGrid.appendChild(el);
    });
  }
  buildFlashcards();

  /* ---------------------------------------------------------
     PORTAL (Screen 5)
  --------------------------------------------------------- */
  const portalCards = document.querySelectorAll('.portal-card');
  const portalA = document.getElementById('portalA');
  const portalB = document.getElementById('portalB');

  portalCards.forEach(card => {
    card.addEventListener('click', () => {
      portalCards.forEach(c => c.classList.remove('is-selected'));
      card.classList.add('is-selected');
      const which = card.dataset.portal;
      portalA.classList.toggle('is-open', which === 'a');
      portalB.classList.toggle('is-open', which === 'b');
      // trigger reveal animations for the now-visible block
      const target = which === 'a' ? portalA : portalB;
      requestAnimationFrame(() => {
        target.querySelectorAll('.display-text').forEach((t, i) => {
          t.style.transitionDelay = (i * 0.15) + 's';
          t.style.opacity = '1';
          t.style.transform = 'translateY(0)';
        });
      });
      unlockMedal('portal');
      playSfx('sfx-chime');
    });
  });

  /* ---------------------------------------------------------
     TIMELINE (Screen 7)
  --------------------------------------------------------- */
  const timelineEl = document.getElementById('timeline');
  const timelineProgress = document.getElementById('timelineProgress');
  let timelineAnimated = false;

  function buildTimeline(){
    const nodesWrap = document.createElement('div');
    nodesWrap.className = 'timeline-nodes';
    TIMELINE_NODES.forEach((node, i) => {
      const nodeEl = document.createElement('div');
      nodeEl.className = 'timeline-node';
      nodeEl.innerHTML = `
        <div class="timeline-node-card">
          <div class="timeline-node-title">${node.tag}</div>
          <div class="timeline-node-text">${node.text}</div>
        </div>`;
      nodeEl.addEventListener('click', () => {
        const card = nodeEl.querySelector('.timeline-node-card');
        const isOpen = card.classList.contains('is-visible');
        document.querySelectorAll('.timeline-node-card').forEach(c => c.classList.remove('is-visible'));
        if (!isOpen) card.classList.add('is-visible');
        unlockMedal('timeline');
      });
      nodesWrap.appendChild(nodeEl);
    });
    timelineEl.appendChild(nodesWrap);
  }
  buildTimeline();

  function animateTimeline(){
    if (timelineAnimated) return;
    timelineAnimated = true;
    requestAnimationFrame(() => {
      timelineProgress.style.width = '100%';
      const nodes = document.querySelectorAll('.timeline-node');
      nodes.forEach((n, i) => {
        setTimeout(() => n.classList.add('is-lit'), 200 + i * 180);
      });
    });
  }

  /* ---------------------------------------------------------
     GALLERY + LIGHTBOX
  --------------------------------------------------------- */
  const galleryGrid = document.getElementById('galleryGrid');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');

  function buildGallery(){
    GALLERY.forEach(item => {
      const el = document.createElement('div');
      el.className = 'gallery-item';
      el.innerHTML = `<img src="${item.src}" alt="${item.caption}" loading="lazy"><div class="gallery-caption">${item.caption}</div>`;
      el.addEventListener('click', () => {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.caption;
        lightboxCaption.textContent = item.caption;
        lightbox.classList.add('is-open');
      });
      galleryGrid.appendChild(el);
    });
  }
  buildGallery();

  document.getElementById('lightboxClose').addEventListener('click', () => lightbox.classList.remove('is-open'));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('is-open'); });

  /* ---------------------------------------------------------
     VAULT (Screen 8)
  --------------------------------------------------------- */
  const vaultInput = document.getElementById('vaultInput');
  const vaultSubmit = document.getElementById('vaultSubmit');
  const vaultError = document.getElementById('vaultError');
  const vaultDoor = document.getElementById('vaultDoor');
  const vaultContent = document.getElementById('vaultContent');

  const VAULT_PASSWORDS = ['partilhar', 'te amo'];

  function tryUnlockVault(){
    const val = vaultInput.value.trim().toLowerCase();
    if (VAULT_PASSWORDS.includes(val)){
      vaultError.classList.remove('is-visible');
      vaultDoor.classList.add('is-verifying');
      vaultInput.setAttribute('disabled', 'true');
      vaultSubmit.setAttribute('disabled', 'true');
      setTimeout(() => {
        vaultDoor.classList.remove('is-verifying');
        vaultDoor.classList.add('is-unlocked');
        vaultContent.classList.add('is-visible');
        playSfx('sfx-unlock');
        unlockMedal('vault');
        showToast('Você abriu. Agora é sua a parte que eu guardei com mais cuidado.');
      }, 900);
    } else {
      vaultError.textContent = 'Essa não é a palavra. Pense no que nos move.';
      vaultError.classList.add('is-visible', 'is-shake');
      setTimeout(() => vaultError.classList.remove('is-shake'), 400);
    }
  }
  vaultSubmit.addEventListener('click', tryUnlockVault);
  vaultInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') tryUnlockVault(); });

  /* ---------------------------------------------------------
     QUIZ (Screen quiz)
  --------------------------------------------------------- */
  const quizWrap = document.getElementById('quizWrap');
  const quizContinue = document.getElementById('quizContinue');
  let quizScore = 0;

  function buildQuiz(){
    QUIZ.forEach((item, qi) => {
      const card = document.createElement('div');
      card.className = 'quiz-card' + (qi === 0 ? ' is-active' : '');
      card.dataset.index = qi;
      const optionsHtml = item.options.map((opt, oi) =>
        `<button class="quiz-option" data-index="${oi}">${opt}</button>`
      ).join('');
      card.innerHTML = `
        <p class="quiz-question">${qi + 1}. ${item.q}</p>
        <div class="quiz-options">${optionsHtml}</div>
        <div class="quiz-reveal">${item.reveal}</div>
      `;
      quizWrap.appendChild(card);
    });

    // score display
    const scoreEl = document.createElement('div');
    scoreEl.className = 'quiz-score';
    scoreEl.id = 'quizScore';
    quizWrap.appendChild(scoreEl);

    quizWrap.querySelectorAll('.quiz-card').forEach(card => {
      const qi = +card.dataset.index;
      const options = card.querySelectorAll('.quiz-option');
      options.forEach((btn, oi) => {
        btn.addEventListener('click', () => {
          if (state.quizAnswered.has(qi)) return;
          state.quizAnswered.add(qi);
          options.forEach(b => b.setAttribute('disabled', 'true'));
          if (oi === QUIZ[qi].correct){
            btn.classList.add('is-pending');
            setTimeout(() => {
              btn.classList.remove('is-pending');
              btn.classList.add('is-correct');
              quizScore++;
              card.querySelector('.quiz-reveal').classList.add('is-visible');
            }, 500);
          } else {
            btn.classList.add('is-pending');
            setTimeout(() => {
              btn.classList.remove('is-pending');
              btn.classList.add('is-wrong');
              options[QUIZ[qi].correct].classList.add('is-correct');
              card.querySelector('.quiz-reveal').classList.add('is-visible');
            }, 500);
          }

          // advance to next card after a pause
          setTimeout(() => {
            card.classList.remove('is-active');
            const next = quizWrap.querySelector(`.quiz-card[data-index="${qi + 1}"]`);
            if (next){
              next.classList.add('is-active');
              next.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
              finishQuiz();
            }
          }, 2100);
        });
      });
    });
  }
  buildQuiz();

  function finishQuiz(){
    const scoreEl = document.getElementById('quizScore');
    scoreEl.textContent = `Você acertou ${quizScore} de ${QUIZ.length}. E ainda assim — independente do número — a gente sabe que isso aqui é real.`;
    scoreEl.classList.add('is-visible');
    quizContinue.style.display = 'flex';
    unlockMedal('quiz');
  }

  /* ---------------------------------------------------------
     23 MOTIVOS (Screen reasons)
  --------------------------------------------------------- */
  const reasonsText = document.getElementById('reasonsText');
  const reasonsNumber = document.getElementById('reasonsNumber');
  const reasonsDots = document.getElementById('reasonsDots');
  const reasonsPrev = document.getElementById('reasonsPrev');
  const reasonsNext = document.getElementById('reasonsNext');
  let reasonIndex = 0;
  let reasonsViewed = new Set();

  function buildReasonsDots(){
    REASONS.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'reasons-dot';
      reasonsDots.appendChild(dot);
    });
  }
  buildReasonsDots();

  function renderReason(){
    reasonsNumber.textContent = reasonIndex + 1;
    reasonsText.style.opacity = '0';
    setTimeout(() => {
      reasonsText.textContent = REASONS[reasonIndex];
      reasonsText.style.opacity = '1';
    }, 150);
    document.querySelectorAll('.reasons-dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === reasonIndex);
    });
    reasonsViewed.add(reasonIndex);
    if (reasonsViewed.size === REASONS.length){
      unlockMedal('reasons');
    }
  }
  renderReason();

  reasonsNext.addEventListener('click', () => {
    reasonIndex = (reasonIndex + 1) % REASONS.length;
    renderReason();
  });
  reasonsPrev.addEventListener('click', () => {
    reasonIndex = (reasonIndex - 1 + REASONS.length) % REASONS.length;
    renderReason();
  });

  /* ---------------------------------------------------------
     FINAL — mosaic, mirror, completion
  --------------------------------------------------------- */
  const mosaic = document.getElementById('mosaic');
  let mosaicRevealed = false;
  function revealMosaic(){
    if (mosaicRevealed) return;
    mosaicRevealed = true;
    setTimeout(() => mosaic.classList.add('is-visible'), 600);
    unlockMedal('complete');
    showToast('Você terminou. Mas isso aqui não é um fim — é o registro de um começo.');
  }

  const mirrorTrigger = document.getElementById('mirrorTrigger');
  const mirrorOverlay = document.getElementById('mirrorOverlay');
  const mirrorVideo = document.getElementById('mirrorVideo');
  const mirrorClose = document.getElementById('mirrorClose');

  mirrorTrigger.addEventListener('click', async () => {
    mirrorOverlay.classList.add('is-open');
    unlockMedal('mirror');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      mirrorVideo.srcObject = stream;
    } catch (err) {
      // camera unavailable — show graceful fallback
      mirrorVideo.style.display = 'none';
      const fallback = document.createElement('div');
      fallback.style.width = 'min(320px, 80vw)';
      fallback.style.aspectRatio = '1';
      fallback.style.borderRadius = '50%';
      fallback.style.border = '2px solid var(--gold)';
      fallback.style.display = 'flex';
      fallback.style.alignItems = 'center';
      fallback.style.justifyContent = 'center';
      fallback.style.color = '#F1E4C8';
      fallback.style.fontFamily = 'Georgia, serif';
      fallback.style.fontStyle = 'italic';
      fallback.style.fontSize = '14px';
      fallback.style.textAlign = 'center';
      fallback.style.padding = '20px';
      fallback.textContent = 'Imagine seu reflexo aqui — é assim que ele te vê.';
      mirrorVideo.parentNode.insertBefore(fallback, mirrorVideo);
    }
  });

  mirrorClose.addEventListener('click', () => {
    mirrorOverlay.classList.remove('is-open');
    const stream = mirrorVideo.srcObject;
    if (stream){
      stream.getTracks().forEach(t => t.stop());
      mirrorVideo.srcObject = null;
    }
  });

  /* ---------------------------------------------------------
     EASTER EGG — hidden "23" scattered across screens
  --------------------------------------------------------- */
  function placeSecret23(){
    const hosts = [
      { el: document.getElementById('screen-2'), top: '12%', left: '8%' },
      { el: document.getElementById('screen-7'), top: '8%', left: '85%' },
      { el: document.getElementById('screen-9'), top: '85%', left: '10%' },
    ];
    hosts.forEach(({ el, top, left }) => {
      if (!el) return;
      const span = document.createElement('span');
      span.className = 'secret-23';
      span.textContent = '23';
      span.style.top = top;
      span.style.left = left;
      span.addEventListener('click', () => {
        if (!state.visited23){
          state.visited23 = true;
          unlockMedal('secret23');
          showToast('23. O dia. O motivo. O detalhe que está em todo lugar — porque você está em todo lugar.');
        }
      });
      el.appendChild(span);
    });
  }
  placeSecret23();

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  renderMedals();

})();
