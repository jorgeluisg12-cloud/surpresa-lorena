/* ============================================================
   script.js
   "De Parauapebas até Você ❤️"
   Motor do jogo — HTML5 Canvas, JS puro, sem frameworks.
   ============================================================ */

(function () {
  "use strict";

  // ----------------------------------------------------------
  // ELEMENTOS DA TELA
  // ----------------------------------------------------------
  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const screenMenu = document.getElementById("screen-menu");
  const introTextEl = document.getElementById("intro-text");
  const btnStart = document.getElementById("btn-start");

  const chapterBanner = document.getElementById("chapter-banner");
  const chapterNameEl = document.getElementById("chapter-name");

  const messageBox = document.getElementById("message-box");
  const messageTextEl = document.getElementById("message-text");

  const achievementToast = document.getElementById("achievement-toast");
  const achievementIconEl = document.getElementById("achievement-icon");
  const achievementNameEl = document.getElementById("achievement-name");

  const memoryModal = document.getElementById("memory-modal");
  const memoryTitleEl = document.getElementById("memory-title");
  const memoryTextEl = document.getElementById("memory-text");
  const btnMemoryClose = document.getElementById("btn-memory-close");

  const screenFinal = document.getElementById("screen-final");
  const finalMessageEl = document.getElementById("final-message");
  const btnMusic = document.getElementById("btn-music");
  const musicHint = document.getElementById("music-hint");
  const easterEggSummary = document.getElementById("easter-egg-summary");
  const achievementsListEl = document.getElementById("achievements-list");
  const btnReplay = document.getElementById("btn-replay");

  const controls = document.getElementById("controls");
  const btnLeft = document.getElementById("btn-left");
  const btnRight = document.getElementById("btn-right");
  const btnJump = document.getElementById("btn-jump");

  const bgMusic = document.getElementById("bg-music");

  // ----------------------------------------------------------
  // CONSTANTES DO MUNDO
  // ----------------------------------------------------------
  const TOTAL_DISTANCE = CONFIG.chapters[CONFIG.chapters.length - 1].end;
  const BASE_SPEED = 95;     // unidades por segundo
  const SLOW_SPEED = 55;
  const FAST_SPEED = 140;
  const GRAVITY = 1000;
  const JUMP_VELOCITY = -300;
  const ARRIVAL_START = TOTAL_DISTANCE - 500; // início da cena final
  const ARRIVAL_SLOW = ARRIVAL_START + 400;   // ponto onde Lorena para

  // ----------------------------------------------------------
  // ESTADO DO JOGO
  // ----------------------------------------------------------
  let state = "menu"; // menu | playing | ending | final
  let scrollX = 0;
  let lastTime = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let W = 0, H = 0; // dimensões lógicas (CSS px)

  const player = {
    yOffset: 0,   // 0 = no chão; negativo = no ar
    vy: 0,
    onGround: true,
    runFrame: 0,
    runTimer: 0,
    xNudge: 0      // pequeno deslocamento horizontal (botões esquerda/direita)
  };

  const input = { left: false, right: false, jumpPressed: false };

  let currentChapterIdx = -1;
  let bannerTimer = 0;

  const collectedHearts = new Set();
  const collectedMemories = new Set();
  const eggStatus = {}; // x -> "found" | "missed"
  CONFIG.easterEggs.forEach((x) => (eggStatus[x] = "pending"));

  const unlockedAchievements = new Set();

  // fila de mensagens centrais (pausam levemente a rolagem)
  let messageQueue = [];
  let activeMessage = null;
  let messageTimer = 0;
  const MESSAGE_DURATION = 3.0;

  // fila de toasts de conquista
  let toastQueue = [];
  let activeToast = null;
  let toastTimer = 0;
  const TOAST_DURATION = 3.0;

  let signsTriggered = new Set();
  let chapterMessageTriggered = new Set();

  let particles = [];

  let endingPhase = 0; // 0 = ainda andando, 1 = chegando, 2 = reencontro, 3 = finalizado

  // ----------------------------------------------------------
  // PRÉ-CARREGAMENTO DE IMAGENS (opcional)
  // ----------------------------------------------------------
  function loadImage(src) {
    const entry = { img: new Image(), ok: false };
    entry.img.onload = () => (entry.ok = true);
    entry.img.onerror = () => (entry.ok = false);
    entry.img.src = src;
    return entry;
  }

  const images = {
    lorenaIdle: loadImage(CONFIG.assets.lorena.idle),
    lorenaRun: (CONFIG.assets.lorena.run || []).map(loadImage),
    lorenaJump: loadImage(CONFIG.assets.lorena.jump),
    lorenaCheer: loadImage(CONFIG.assets.lorena.cheer),
    jorgeIdle: loadImage(CONFIG.assets.jorge.idle),
    jorgeWave: loadImage(CONFIG.assets.jorge.wave)
  };

  // ----------------------------------------------------------
  // RESIZE / CANVAS
  // ----------------------------------------------------------
  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  function groundY() {
    return H * 0.78;
  }

  function playerBaseX() {
    return Math.max(70, W * 0.16);
  }

  function playerSize() {
    const h = Math.max(46, Math.min(80, H * 0.16));
    return { w: h * 0.62, h: h };
  }

  // ----------------------------------------------------------
  // UTILITÁRIOS
  // ----------------------------------------------------------
  function getChapterIndex(x) {
    for (let i = 0; i < CONFIG.chapters.length; i++) {
      if (x < CONFIG.chapters[i].end) return i;
    }
    return CONFIG.chapters.length - 1;
  }

  function lerpColor(c1, c2, t) {
    const a = hexToRgb(c1);
    const b = hexToRgb(c2);
    const r = Math.round(a.r + (b.r - a.r) * t);
    const g = Math.round(a.g + (b.g - a.g) * t);
    const bl = Math.round(a.b + (b.b - a.b) * t);
    return `rgb(${r},${g},${bl})`;
  }

  function hexToRgb(hex) {
    const v = hex.replace("#", "");
    return {
      r: parseInt(v.substring(0, 2), 16),
      g: parseInt(v.substring(2, 4), 16),
      b: parseInt(v.substring(4, 6), 16)
    };
  }

  function showChapterBanner(name) {
    chapterNameEl.textContent = name;
    chapterBanner.classList.remove("hidden");
    bannerTimer = 2.2;
  }

  function queueMessage(text) {
    messageQueue.push(text);
  }

  function queueToast(achievementId) {
    const a = CONFIG.achievements.find((x) => x.id === achievementId);
    if (!a) return;
    toastQueue.push(a);
  }

  function unlockAchievement(id) {
    if (unlockedAchievements.has(id)) return;
    unlockedAchievements.add(id);
    queueToast(id);
  }

  function spawnParticles(x, y, count, color, spread) {
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * (spread || 80),
        vy: -Math.random() * 120 - 30,
        life: 1 + Math.random() * 0.6,
        maxLife: 1.6,
        color: color || "#ff8fab",
        size: 4 + Math.random() * 6
      });
    }
  }

  // ----------------------------------------------------------
  // INTRO / TELA INICIAL
  // ----------------------------------------------------------
  function runIntroSequence() {
    let i = 0;
    function showNext() {
      if (i >= CONFIG.intro.length) {
        btnStart.style.display = "inline-block";
        btnStart.textContent = CONFIG.startButtonText;
        return;
      }
      introTextEl.classList.remove("show");
      setTimeout(() => {
        introTextEl.textContent = CONFIG.intro[i];
        introTextEl.classList.add("show");
        i++;
        setTimeout(showNext, 2400);
      }, 400);
    }
    showNext();
  }
  runIntroSequence();

  btnStart.addEventListener("click", startGame);

  function startGame() {
    screenMenu.classList.add("hidden");
    controls.classList.remove("hidden");
    state = "playing";
    unlockAchievement("steps");
    currentChapterIdx = getChapterIndex(scrollX);
    showChapterBanner(CONFIG.chapters[currentChapterIdx].name);
  }

  // ----------------------------------------------------------
  // CONTROLES (toque + teclado)
  // ----------------------------------------------------------
  function bindHold(el, onDown, onUp) {
    const down = (e) => { e.preventDefault(); onDown(); };
    const up = (e) => { e.preventDefault(); onUp(); };
    el.addEventListener("touchstart", down, { passive: false });
    el.addEventListener("touchend", up, { passive: false });
    el.addEventListener("touchcancel", up, { passive: false });
    el.addEventListener("mousedown", down);
    el.addEventListener("mouseup", up);
    el.addEventListener("mouseleave", up);
  }

  bindHold(btnLeft, () => (input.left = true), () => (input.left = false));
  bindHold(btnRight, () => (input.right = true), () => (input.right = false));
  bindHold(
    btnJump,
    () => { input.jumpPressed = true; tryJump(); },
    () => (input.jumpPressed = false)
  );

  window.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") input.left = true;
    if (e.code === "ArrowRight") input.right = true;
    if (e.code === "Space" || e.code === "ArrowUp") {
      input.jumpPressed = true;
      tryJump();
    }
  });
  window.addEventListener("keyup", (e) => {
    if (e.code === "ArrowLeft") input.left = false;
    if (e.code === "ArrowRight") input.right = false;
    if (e.code === "Space" || e.code === "ArrowUp") input.jumpPressed = false;
  });

  function tryJump() {
    if (state !== "playing" && state !== "ending") return;
    if (player.onGround) {
      player.vy = JUMP_VELOCITY;
      player.onGround = false;
    }
    checkEasterEgg();
  }

  function checkEasterEgg() {
    for (const exStr of Object.keys(eggStatus)) {
      const ex = Number(exStr);
      if (eggStatus[ex] === "pending" && Math.abs(scrollX - ex) < 70) {
        eggStatus[ex] = "found";
        spawnParticles(playerBaseX() + player.xNudge, groundY() - playerSize().h * 0.6, 14, "#ff5d8f", 110);
      }
    }
  }

  // ----------------------------------------------------------
  // MODAL DE MEMÓRIA
  // ----------------------------------------------------------
  let modalOpen = false;
  btnMemoryClose.addEventListener("click", () => {
    memoryModal.classList.add("hidden");
    modalOpen = false;
    if (collectedMemories.size === CONFIG.memories.length) {
      unlockAchievement("memories");
    }
  });

  function openMemory(mem) {
    memoryTitleEl.textContent = mem.title;
    memoryTextEl.textContent = mem.text;
    memoryModal.classList.remove("hidden");
    modalOpen = true;
  }

  // ----------------------------------------------------------
  // LOOP PRINCIPAL
  // ----------------------------------------------------------
  function loop(ts) {
    const dt = Math.min((ts - lastTime) / 1000, 1 / 30) || 0;
    lastTime = ts;

    update(dt);
    render();

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  // ----------------------------------------------------------
  // UPDATE
  // ----------------------------------------------------------
  function update(dt) {
    updateMessages(dt);
    updateToasts(dt);
    updateParticles(dt);

    if (bannerTimer > 0) {
      bannerTimer -= dt;
      if (bannerTimer <= 0) chapterBanner.classList.add("hidden");
    }

    const scrolling =
      (state === "playing" || state === "ending") &&
      !modalOpen &&
      !activeMessage &&
      bannerTimer <= 0;

    // ---- velocidade ----
    let speed = BASE_SPEED;
    if (state === "playing") {
      if (input.right) speed = FAST_SPEED;
      else if (input.left) speed = SLOW_SPEED;
    } else if (state === "ending") {
      speed = endingPhase === 0 ? SLOW_SPEED : 0;
    }

    if (scrolling) {
      scrollX += speed * dt;
    }

    // nudge horizontal (sensação de controle, efeito visual)
    const targetNudge = input.left ? -18 : input.right ? 18 : 0;
    player.xNudge += (targetNudge - player.xNudge) * Math.min(1, dt * 6);

    // ---- física do salto ----
    if (!player.onGround) {
      player.yOffset += player.vy * dt;
      player.vy += GRAVITY * dt;
      if (player.yOffset >= 0) {
        player.yOffset = 0;
        player.vy = 0;
        player.onGround = true;
      }
    }

    // animação de corrida
    if (player.onGround && scrolling) {
      player.runTimer += dt;
      if (player.runTimer > 0.12) {
        player.runTimer = 0;
        player.runFrame = (player.runFrame + 1) % 2;
      }
    }

    if (state === "playing") {
      checkChapterTransition();
      checkHearts();
      checkMemories();
      checkSigns();
      checkEggMisses();
      checkArrival();
    } else if (state === "ending") {
      updateEnding(dt);
    }
  }

  function updateMessages(dt) {
    if (!activeMessage && messageQueue.length > 0) {
      activeMessage = messageQueue.shift();
      messageTextEl.textContent = activeMessage;
      messageBox.classList.remove("hidden");
      messageTimer = MESSAGE_DURATION;
    } else if (activeMessage) {
      messageTimer -= dt;
      if (messageTimer <= 0) {
        messageBox.classList.add("hidden");
        activeMessage = null;
      }
    }
  }

  function updateToasts(dt) {
    if (!activeToast && toastQueue.length > 0) {
      activeToast = toastQueue.shift();
      achievementIconEl.textContent = activeToast.icon;
      achievementNameEl.textContent = activeToast.name;
      achievementToast.classList.remove("hidden");
      toastTimer = TOAST_DURATION;
    } else if (activeToast) {
      toastTimer -= dt;
      if (toastTimer <= 0) {
        achievementToast.classList.add("hidden");
        activeToast = null;
      }
    }
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 220 * dt;
      p.life -= dt;
      if (p.life <= 0) particles.splice(i, 1);
    }
  }

  function checkChapterTransition() {
    const idx = getChapterIndex(scrollX);
    if (idx !== currentChapterIdx) {
      currentChapterIdx = idx;
      const ch = CONFIG.chapters[currentChapterIdx];
      showChapterBanner(ch.name);
      if (ch.message && !chapterMessageTriggered.has(ch.id)) {
        chapterMessageTriggered.add(ch.id);
        queueMessage(ch.message);
      }
      if (ch.id === 3) {
        // entrando no capítulo da distância
      }
    }

    // mensagens de encerramento do capítulo 3
    const ch3 = CONFIG.chapters[2];
    if (
      scrollX >= ch3.end &&
      !chapterMessageTriggered.has("ch3-end") &&
      ch3.messages
    ) {
      chapterMessageTriggered.add("ch3-end");
      ch3.messages.forEach((m) => queueMessage(m));
      unlockAchievement("distance");
    }

    // quase em casa = fim do capítulo 4
    const ch4 = CONFIG.chapters[3];
    if (scrollX >= ch4.end && !chapterMessageTriggered.has("ch4-end")) {
      chapterMessageTriggered.add("ch4-end");
      unlockAchievement("almost");
    }
  }

  function checkHearts() {
    CONFIG.hearts.forEach((h, i) => {
      if (!collectedHearts.has(i) && scrollX >= h.x) {
        collectedHearts.add(i);
        queueMessage(h.text);
        spawnParticles(playerBaseX() + player.xNudge, groundY() - playerSize().h * 0.7, 12, "#ff8fab", 90);
      }
    });
  }

  function checkMemories() {
    CONFIG.memories.forEach((m, i) => {
      if (!collectedMemories.has(i) && scrollX >= m.x) {
        collectedMemories.add(i);
        spawnParticles(playerBaseX() + player.xNudge, groundY() - playerSize().h * 0.7, 10, "#ffd1dc", 70);
        openMemory(m);
      }
    });
  }

  function checkSigns() {
    const ch3 = CONFIG.chapters[2];
    if (!ch3.signs) return;
    ch3.signs.forEach((s) => {
      if (!signsTriggered.has(s.x) && scrollX >= s.x) {
        signsTriggered.add(s.x);
        queueMessage(s.label);
      }
    });
  }

  function checkEggMisses() {
    Object.keys(eggStatus).forEach((exStr) => {
      const ex = Number(exStr);
      if (eggStatus[ex] === "pending" && scrollX > ex + 90) {
        eggStatus[ex] = "missed";
      }
    });
  }

  function checkArrival() {
    if (scrollX >= ARRIVAL_START && state === "playing") {
      state = "ending";
      endingPhase = 0;
      controls.classList.add("hidden");
    }
  }

  function updateEnding(dt) {
    if (endingPhase === 0) {
      if (scrollX >= ARRIVAL_SLOW) {
        endingPhase = 1;
      }
    } else if (endingPhase === 1) {
      // Lorena caminha automaticamente até Jorge
      player.xNudge += (40 - player.xNudge) * Math.min(1, dt * 2);
      meetTimer = (meetTimer || 0) + dt;
      if (meetTimer > 1.4) {
        endingPhase = 2;
        spawnParticles(playerBaseX() + 70, groundY() - 60, 30, "#ff8fab", 160);
        spawnParticles(playerBaseX() + 70, groundY() - 60, 18, "#ffd1dc", 120);
        unlockAchievement("finish");
        if (
          Object.values(eggStatus).every((v) => v === "found")
        ) {
          unlockAchievement("eggs");
        }
      }
    } else if (endingPhase === 2) {
      meetHold = (meetHold || 0) + dt;
      if (meetHold > 1.6) {
        endingPhase = 3;
        showFinalScreen();
      }
    }
  }
  let meetTimer = 0;
  let meetHold = 0;

  // ----------------------------------------------------------
  // TELA FINAL
  // ----------------------------------------------------------
  function showFinalScreen() {
    state = "final";
    finalMessageEl.textContent = CONFIG.finalMessage;

    const foundEggs = Object.values(eggStatus).filter((v) => v === "found").length;
    easterEggSummary.textContent =
      foundEggs === CONFIG.easterEggs.length
        ? CONFIG.easterEggMessage
        : `Você encontrou ${foundEggs} de ${CONFIG.easterEggs.length} corações escondidos pelo caminho.`;

    achievementsListEl.innerHTML = "";
    CONFIG.achievements.forEach((a) => {
      const div = document.createElement("div");
      const unlocked = unlockedAchievements.has(a.id);
      div.className = "achievement-item" + (unlocked ? " unlocked" : "");
      div.innerHTML = `
        <span class="a-icon">${unlocked ? a.icon : "🔒"}</span>
        <div class="a-text">
          <strong>${a.name}</strong>
          <span>${a.desc}</span>
        </div>`;
      achievementsListEl.appendChild(div);
    });

    if (CONFIG.music && CONFIG.music.title) {
      btnMusic.textContent = `▶ Tocar "${CONFIG.music.title}"`;
    }

    screenFinal.classList.remove("hidden");
  }

  btnMusic.addEventListener("click", () => {
    if (!bgMusic.src) {
      bgMusic.src = CONFIG.music.src;
    }
    bgMusic
      .play()
      .then(() => {
        musicHint.textContent = "";
        btnMusic.textContent = "🎵 Tocando...";
      })
      .catch(() => {
        musicHint.textContent =
          "Adicione o arquivo de música em assets/audio/ para ouvir aqui.";
      });
  });

  btnReplay.addEventListener("click", () => {
    window.location.reload();
  });

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  function render() {
    ctx.clearRect(0, 0, W, H);

    if (state === "menu") {
      drawBackground(CONFIG.chapters[0], 0);
      return;
    }

    const chapter = CONFIG.chapters[getChapterIndex(scrollX)];
    drawBackground(chapter, scrollX);
    drawGroundDecorations(chapter);
    drawSigns(chapter);
    drawCollectibles();
    drawEggs();

    if (state === "ending" && endingPhase >= 1) {
      drawJorge();
    }

    drawPlayer();
    drawParticles();
  }

  // ---------- FUNDO ----------
  function drawBackground(chapter, x) {
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, chapter.sky[0]);
    sky.addColorStop(1, chapter.sky[1]);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // sol / lua
    if (chapter.theme === "sunset" || chapter.theme === "arrival") {
      ctx.fillStyle = "rgba(255, 235, 200, 0.9)";
      ctx.beginPath();
      ctx.arc(W * 0.78, H * 0.32, Math.min(W, H) * 0.09, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.beginPath();
      ctx.arc(W * 0.82, H * 0.18, Math.min(W, H) * 0.06, 0, Math.PI * 2);
      ctx.fill();
    }

    // nuvens (paralaxe lenta)
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    for (let i = 0; i < 4; i++) {
      const cx = ((W * 1.4 * i + (x * 0.05)) % (W * 1.4)) - W * 0.2;
      const cy = H * (0.12 + 0.08 * (i % 2));
      drawCloud(cx, cy, 40 + (i % 2) * 18);
    }

    // chuva (capítulo 3)
    if (chapter.theme === "rain") {
      ctx.strokeStyle = "rgba(180, 200, 220, 0.55)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 40; i++) {
        const rx = (i * 47 + x * 1.3) % (W + 40);
        const ry = (i * 31 + x * 2.1) % H;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 6, ry + 16);
        ctx.stroke();
      }
    }

    // chão
    const gY = groundY();
    ctx.fillStyle = chapter.ground;
    ctx.fillRect(0, gY, W, H - gY);

    // textura do chão (faixas que se movem)
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    const stripeW = 46;
    const offset = x % stripeW;
    for (let sx = -offset; sx < W; sx += stripeW) {
      ctx.fillRect(sx, gY, 4, H - gY);
    }

    // linha de horizonte sutil
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, gY, W, 3);
  }

  function drawCloud(cx, cy, size) {
    ctx.beginPath();
    ctx.ellipse(cx, cy, size, size * 0.55, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + size * 0.6, cy + size * 0.1, size * 0.7, size * 0.45, 0, 0, Math.PI * 2);
    ctx.ellipse(cx - size * 0.6, cy + size * 0.15, size * 0.6, size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ---------- DECORAÇÕES ----------
  function drawGroundDecorations(chapter) {
    const gY = groundY();
    // pequenas plantas / cones / obstáculos decorativos do capítulo 2
    if (chapter.theme === "road" || chapter.theme === "morning") {
      for (let i = 0; i < 6; i++) {
        const wx = Math.floor(scrollX / 260) * 260 + i * 260 + 130;
        const sxPos = playerBaseX() + (wx - scrollX);
        if (sxPos < -30 || sxPos > W + 30) continue;
        ctx.fillStyle = "#3f7d3a";
        ctx.beginPath();
        ctx.ellipse(sxPos, gY - 6, 14, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#5a4636";
        ctx.fillRect(sxPos - 3, gY - 2, 6, 10);
      }
    }
  }

  // ---------- PLACAS (capítulo 3) ----------
  function drawSigns(chapter) {
    if (!chapter.signs) return;
    const gY = groundY();
    chapter.signs.forEach((s) => {
      const sx = playerBaseX() + (s.x - scrollX);
      if (sx < -80 || sx > W + 80) return;
      ctx.fillStyle = "#6b4a36";
      ctx.fillRect(sx - 4, gY - 70, 8, 70);
      ctx.fillStyle = "#8a6a52";
      ctx.fillRect(sx - 46, gY - 100, 92, 36);
      ctx.strokeStyle = "#4a3322";
      ctx.lineWidth = 3;
      ctx.strokeRect(sx - 46, gY - 100, 92, 36);
      ctx.fillStyle = "#ffe9d6";
      ctx.font = "12px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.fillText(s.label, sx, gY - 78);
      ctx.textAlign = "left";
    });
  }

  // ---------- COLECIONÁVEIS ----------
  function drawCollectibles() {
    const gY = groundY();

    CONFIG.hearts.forEach((h, i) => {
      if (collectedHearts.has(i)) return;
      const sx = playerBaseX() + (h.x - scrollX);
      if (sx < -40 || sx > W + 40) return;
      const bob = Math.sin((scrollX + h.x) * 0.01) * 6;
      drawEmoji("❤️", sx, gY - 70 + bob, 28);
    });

    CONFIG.memories.forEach((m, i) => {
      if (collectedMemories.has(i)) return;
      const sx = playerBaseX() + (m.x - scrollX);
      if (sx < -40 || sx > W + 40) return;
      const bob = Math.sin((scrollX + m.x) * 0.012) * 6;
      drawEmoji("💌", sx, gY - 80 + bob, 30);
    });
  }

  function drawEggs() {
    const gY = groundY();
    Object.keys(eggStatus).forEach((exStr) => {
      const ex = Number(exStr);
      if (eggStatus[ex] !== "pending") return;
      const sx = playerBaseX() + (ex - scrollX);
      if (sx < -40 || sx > W + 40) return;
      const bob = Math.sin((scrollX + ex) * 0.02) * 4;
      ctx.globalAlpha = 0.55 + 0.25 * Math.sin((scrollX + ex) * 0.05);
      drawEmoji("💗", sx, gY - 40 + bob, 20);
      ctx.globalAlpha = 1;
    });
  }

  function drawEmoji(symbol, x, y, size) {
    ctx.font = size + "px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(symbol, x, y);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
  }

  // ---------- PARTÍCULAS ----------
  function drawParticles() {
    particles.forEach((p) => {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  // ---------- LORENA ----------
  function drawPlayer() {
    const { w, h } = playerSize();
    const gY = groundY();
    const x = playerBaseX() + player.xNudge;
    const y = gY - h + player.yOffset;

    // sombra
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, gY + 4, w * 0.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // tenta usar sprite carregado
    let img = null;
    if (state === "ending" && endingPhase >= 2 && images.lorenaCheer.ok) {
      img = images.lorenaCheer.img;
    } else if (!player.onGround && images.lorenaJump.ok) {
      img = images.lorenaJump.img;
    } else if (player.onGround && images.lorenaRun[player.runFrame] && images.lorenaRun[player.runFrame].ok) {
      img = images.lorenaRun[player.runFrame].img;
    } else if (images.lorenaIdle.ok) {
      img = images.lorenaIdle.img;
    }

    if (img) {
      ctx.drawImage(img, x, y, w, h);
      return;
    }

    drawPixelLorena(x, y, w, h);
  }

  function drawPixelLorena(x, y, w, h) {
    const cheering = state === "ending" && endingPhase >= 2;
    const jumping = !player.onGround;
    const legShift = player.runFrame === 0 ? 0 : 1;

    // cabelo (atrás)
    ctx.fillStyle = "#4a2e23";
    ctx.fillRect(x + w * 0.08, y + h * 0.02, w * 0.84, h * 0.28);
    ctx.fillRect(x + w * 0.0, y + h * 0.1, w * 0.18, h * 0.55);
    ctx.fillRect(x + w * 0.82, y + h * 0.1, w * 0.18, h * 0.55);

    // rosto
    ctx.fillStyle = "#f4c9a8";
    ctx.fillRect(x + w * 0.18, y + h * 0.08, w * 0.64, h * 0.26);

    // vestido
    ctx.fillStyle = "#fbe3ea";
    const dressTopW = w * 0.7;
    ctx.fillRect(x + (w - dressTopW) / 2, y + h * 0.32, dressTopW, h * 0.42);
    // detalhe do vestido
    ctx.fillStyle = "#ff8fab";
    ctx.fillRect(x + (w - dressTopW) / 2, y + h * 0.32, dressTopW, h * 0.06);

    // braços
    ctx.fillStyle = "#f4c9a8";
    if (cheering) {
      ctx.fillRect(x - w * 0.08, y + h * 0.28, w * 0.12, h * 0.18);
      ctx.fillRect(x + w * 0.96, y + h * 0.28, w * 0.12, h * 0.18);
    } else {
      ctx.fillRect(x - w * 0.04, y + h * 0.36, w * 0.1, h * 0.22);
      ctx.fillRect(x + w * 0.94, y + h * 0.36, w * 0.1, h * 0.22);
    }

    // pernas / sapatos
    ctx.fillStyle = "#5a4636";
    const legW = w * 0.16;
    const legY = y + h * 0.74;
    const legH = h * 0.26;
    if (jumping) {
      ctx.fillRect(x + w * 0.22, legY - 4, legW, legH);
      ctx.fillRect(x + w * 0.62, legY + 4, legW, legH);
    } else {
      const off = legShift === 0 ? 6 : 0;
      ctx.fillRect(x + w * 0.22, legY + off, legW, legH - off);
      ctx.fillRect(x + w * 0.62, legY + (6 - off), legW, legH - (6 - off));
    }
  }

  // ---------- JORGE ----------
  function drawJorge() {
    const { w, h } = playerSize();
    const gY = groundY();
    const x = playerBaseX() + 90 + (W * 0.06);
    const y = gY - h;

    let img = null;
    if (endingPhase >= 2 && images.jorgeWave.ok) img = images.jorgeWave.img;
    else if (images.jorgeIdle.ok) img = images.jorgeIdle.img;

    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.ellipse(x + w / 2, gY + 4, w * 0.5, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (img) {
      ctx.drawImage(img, x, y, w, h);
      return;
    }

    // cabelo
    ctx.fillStyle = "#3a2a1e";
    ctx.fillRect(x + w * 0.08, y, w * 0.84, h * 0.22);

    // rosto
    ctx.fillStyle = "#f0c4a0";
    ctx.fillRect(x + w * 0.16, y + h * 0.06, w * 0.68, h * 0.26);

    // camisa
    ctx.fillStyle = "#eef3f7";
    ctx.fillRect(x + w * 0.12, y + h * 0.3, w * 0.76, h * 0.4);

    // calça
    ctx.fillStyle = "#39434f";
    ctx.fillRect(x + w * 0.12, y + h * 0.7, w * 0.76, h * 0.3);

    // braço aceno
    ctx.fillStyle = "#f0c4a0";
    if (endingPhase >= 2) {
      ctx.fillRect(x + w * 0.85, y + h * 0.18, w * 0.12, h * 0.22);
    } else {
      ctx.fillRect(x + w * 0.9, y + h * 0.34, w * 0.1, h * 0.2);
    }
  }
})();
