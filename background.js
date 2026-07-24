/* ============================================================
   MOMENTUM — Fondo animado: red de conexiones digitales
   ------------------------------------------------------------
   Vive 100% aparte del resto de la lógica de la página (no toca
   app.js, no participa del cuestionario ni del envío a Google
   Sheets). Es pura decoración de fondo, dibujada en un <canvas>
   con la API nativa del navegador — sin librerías externas.

   Capas, de atrás para adelante:
   1. Atmósfera: casi negro, con variaciones muy sutiles entre
      azul y violeta (sin verde).
   2. Malla: nodos conectados por líneas finas, con un brillo
      "reflectivo" (halo de color + núcleo blanco).
   3. Pulsos ambiente: destellos que viajan por las conexiones.
   4. Recorrido guiado: un pulso que va de Nicho → Avatar → ROMA
      dejando un rastro que se va apagando detrás, cambiando de
      color en el camino (blanco → dorado → azul), y mostrando
      esa palabra, con un brillo tipo "vidrio", al llegar a cada
      punto. El punto "Avatar" hace que el recuadro dorado de la
      portada se vuelva translúcido mientras brilla detrás.
   ============================================================ */

(function () {
  const canvas = document.getElementById("momentum-network");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Paleta casi-negra: solo variaciones muy sutiles entre azul y
  // violeta para la atmósfera de fondo (sin verde).
  const ATMO_COLORS = ["#16213E", "#241B3D", "#1A2747"];
  // Colores algo más vivos para la malla de nodos/líneas (siguen
  // siendo azul/violeta, pero con más presencia para que brillen).
  const NODE_COLORS = ["#3E6BAE", "#5A4FCF", "#7C5CFF"];

  // Colores fijos de cada punto del recorrido guiado
  const HUB_COLORS = { Nicho: "#FFFFFF", Avatar: "#FFD866", ROMA: "#5FB8FF" };

  let width = 0, height = 0, dpr = 1;
  let nodes = [];
  let pulses = [];
  let hubs = [];
  let journey = null;
  let legAlpha = [0, 0, 0];
  let rafId = null;
  let running = false;
  let manifestoEl = null;
  let avatarRevealed = false;

  function setup() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    buildNodes();
    buildHubs();
    manifestoEl = document.querySelector(".manifesto");
  }

  function buildNodes() {
    const area = width * height;
    const count = Math.round(clamp(area / 38000, 10, 22));
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.10,
        vy: (Math.random() - 0.5) * 0.10,
        r: 1.2 + Math.random() * 1.3,
        color: NODE_COLORS[i % NODE_COLORS.length],
      });
    }
    pulses = [];
    for (let i = 0; i < Math.min(3, Math.round(count / 7)); i++) {
      pulses.push(makePulse());
    }
  }

  // Nicho y ROMA se ubican hacia los costados, fuera del área del
  // recuadro central, para que se vean por detrás/alrededor de la
  // tarjeta. Avatar queda centrado, justo detrás del recuadro.
  function buildHubs() {
    const positions = [
      { key: "Nicho", xPct: 0.09, yPct: 0.26 },
      { key: "Avatar", xPct: 0.5, yPct: 0.5 },
      { key: "ROMA", xPct: 0.91, yPct: 0.30 },
    ];
    hubs = positions.map((p) => ({
      key: p.key,
      x: width * p.xPct,
      y: height * p.yPct,
      color: HUB_COLORS[p.key],
    }));

    if (!journey) {
      journey = {
        fromIndex: 2,
        toIndex: 0,
        t: 0,
        phase: "travel",
        holdT: 0,
        wordOpacity: 0,
        leg: 2, // qué tramo del recorrido está activo (0: Nicho->Avatar, 1: Avatar->ROMA, 2: ROMA->Nicho)
      };
    }
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function makePulse() {
    if (nodes.length < 2) return null;
    const a = nodes[Math.floor(Math.random() * nodes.length)];
    const b = nearestConnected(a);
    return { a, b, t: Math.random(), speed: 0.0022 + Math.random() * 0.0025 };
  }

  function nearestConnected(node) {
    let best = null, bestD = Infinity;
    nodes.forEach((n) => {
      if (n === node) return;
      const d = (n.x - node.x) ** 2 + (n.y - node.y) ** 2;
      if (d < bestD) { bestD = d; best = n; }
    });
    return best || node;
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function lerpColor(hexA, hexB, t) {
    const a = [parseInt(hexA.slice(1, 3), 16), parseInt(hexA.slice(3, 5), 16), parseInt(hexA.slice(5, 7), 16)];
    const b = [parseInt(hexB.slice(1, 3), 16), parseInt(hexB.slice(3, 5), 16), parseInt(hexB.slice(5, 7), 16)];
    const r = Math.round(a[0] + (b[0] - a[0]) * t);
    const g = Math.round(a[1] + (b[1] - a[1]) * t);
    const bl = Math.round(a[2] + (b[2] - a[2]) * t);
    return `rgb(${r}, ${g}, ${bl})`;
  }

  function drawAtmosphere(time) {
    const cycle = time * 0.000018;
    ATMO_COLORS.forEach((color, i) => {
      const angle = cycle + (i * Math.PI * 2) / ATMO_COLORS.length;
      const cx = width * (0.5 + 0.32 * Math.cos(angle));
      const cy = height * (0.5 + 0.32 * Math.sin(angle * 0.8));
      const radius = Math.max(width, height) * 0.5;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, hexToRgba(color, 0.05));
      grad.addColorStop(1, hexToRgba(color, 0));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    });
    // Empuja todo un poco más hacia el negro parejo
    ctx.fillStyle = "rgba(0, 0, 0, 0.10)";
    ctx.fillRect(0, 0, width, height);
  }

  const MAX_LINK_DIST = 150;

  function updateNodes() {
    nodes.forEach((n) => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
      n.x = clamp(n.x, 0, width);
      n.y = clamp(n.y, 0, height);
    });
  }

  function drawMesh() {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > MAX_LINK_DIST) continue;
        const alpha = (1 - dist / MAX_LINK_DIST) * 0.16;
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, hexToRgba(a.color, alpha));
        grad.addColorStop(1, hexToRgba(b.color, alpha));
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Nodos "reflectivos": halo de color + núcleo brillante
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.fillStyle = hexToRgba(n.color, 0.45);
      ctx.shadowColor = n.color;
      ctx.shadowBlur = 8;
      ctx.arc(n.x, n.y, n.r * 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
      ctx.arc(n.x - n.r * 0.3, n.y - n.r * 0.3, n.r * 0.45, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawPulses() {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    pulses.forEach((p, idx) => {
      if (!p || !p.b) return;
      p.t += p.speed;
      if (p.t >= 1) {
        pulses[idx] = makePulse();
        return;
      }
      const x = p.a.x + (p.b.x - p.a.x) * p.t;
      const y = p.a.y + (p.b.y - p.a.y) * p.t;
      ctx.beginPath();
      ctx.fillStyle = "#FFFFFF";
      ctx.shadowColor = p.a.color;
      ctx.shadowBlur = 8;
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  const TRAVEL_MS = 4600;
  const HOLD_MS = 2300;
  const FADE_MS = 600;
  const LEG_DECAY = 0.0035; // qué tan rápido se apaga un tramo ya recorrido

  function updateJourney(dt) {
    if (!journey || hubs.length < 3) return;
    const from = hubs[journey.fromIndex];
    const to = hubs[journey.toIndex];

    // El tramo activo se enciende progresivamente con el avance
    legAlpha = legAlpha.map((a, i) => (i === journey.leg ? a : Math.max(0.10, a - LEG_DECAY * dt)));

    if (journey.phase === "travel") {
      journey.t += dt / TRAVEL_MS;
      legAlpha[journey.leg] = clamp(journey.t, 0, 1);
      if (journey.t >= 1) {
        journey.t = 1;
        journey.phase = "hold";
        journey.holdT = 0;
        legAlpha[journey.leg] = 1;
      }
    } else if (journey.phase === "hold") {
      journey.holdT += dt;
      journey.wordOpacity = clamp(journey.holdT / FADE_MS, 0, 1);
      if (journey.holdT >= HOLD_MS) {
        journey.phase = "fade";
        journey.holdT = 0;
      }
    } else if (journey.phase === "fade") {
      journey.holdT += dt;
      journey.wordOpacity = 1 - clamp(journey.holdT / FADE_MS, 0, 1);
      if (journey.holdT >= FADE_MS) {
        journey.fromIndex = journey.toIndex;
        journey.toIndex = (journey.toIndex + 1) % hubs.length;
        journey.leg = (journey.leg + 1) % 3;
        journey.t = 0;
        journey.phase = "travel";
        journey.wordOpacity = 0;
      }
    }

    const ease = journey.t < 0.5
      ? 2 * journey.t * journey.t
      : 1 - Math.pow(-2 * journey.t + 2, 2) / 2;
    journey.x = from.x + (to.x - from.x) * ease;
    journey.y = from.y + (to.y - from.y) * ease;
    journey.color = lerpColor(from.color, to.color, ease);

    updateAvatarReveal();
  }

  // Mientras el recorrido está detenido (o desvaneciéndose) sobre
  // el punto "Avatar", el recuadro dorado de la portada se vuelve
  // translúcido para dejar ver la palabra brillando detrás.
  function updateAvatarReveal() {
    if (!manifestoEl) return;
    const atAvatar = hubs[journey.toIndex] && hubs[journey.toIndex].key === "Avatar"
      && (journey.phase === "hold" || journey.phase === "fade");
    if (atAvatar && !avatarRevealed) {
      manifestoEl.classList.add("is-avatar-reveal");
      avatarRevealed = true;
    } else if (!atAvatar && avatarRevealed) {
      manifestoEl.classList.remove("is-avatar-reveal");
      avatarRevealed = false;
    }
  }

  function drawTrail() {
    // Dibuja los 3 tramos del camino (Nicho→Avatar, Avatar→ROMA,
    // ROMA→Nicho), cada uno con su propio nivel de brillo: el
    // tramo recién recorrido queda más marcado, los anteriores se
    // van apagando y afinando con el tiempo.
    const legs = [[0, 1], [1, 2], [2, 0]];
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    legs.forEach(([aIdx, bIdx], i) => {
      const a = hubs[aIdx], b = hubs[bIdx];
      if (!a || !b) return;
      const alpha = legAlpha[i];
      if (alpha <= 0.02) return;
      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, hexToRgba(a.color, alpha * 0.5));
      grad.addColorStop(1, hexToRgba(b.color, alpha * 0.5));
      ctx.strokeStyle = grad;
      ctx.lineWidth = 0.6 + alpha * 1.2;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 4 * alpha;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawJourneyDot() {
    if (!journey || !journey.color) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.beginPath();
    ctx.fillStyle = hexToRgba("#FFFFFF", 0.9);
    ctx.shadowColor = journey.color;
    ctx.shadowBlur = 22;
    ctx.arc(journey.x, journey.y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = journey.color;
    ctx.shadowBlur = 12;
    ctx.arc(journey.x, journey.y, 5, 0, Math.PI * 2);
    ctx.globalAlpha = 0.35;
    ctx.fill();
    ctx.restore();
  }

  // Texto con aspecto "vidrio": varias pasadas de resplandor +
  // un brillo diagonal (highlight) cruzando la palabra.
  function drawGlassWord(text, x, y, color, opacity) {
    const fontSize = clamp(width * 0.03, 19, 34);
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.font = `600 ${fontSize}px 'Syne', sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Halo exterior amplio y suave
    ctx.shadowColor = color;
    ctx.shadowBlur = 30;
    ctx.fillStyle = hexToRgba("#FFFFFF", 0.55);
    ctx.fillText(text, x, y);

    // Núcleo definido, con brillo intermedio
    ctx.shadowBlur = 14;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);

    // Reflejo tipo vidrio: degradé claro cruzando el texto
    const textWidth = ctx.measureText(text).width;
    ctx.shadowBlur = 0;
    const shineGrad = ctx.createLinearGradient(x - textWidth / 2, y - fontSize / 2, x + textWidth / 2, y + fontSize / 2);
    shineGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    shineGrad.addColorStop(0.45, "rgba(255, 255, 255, 0.75)");
    shineGrad.addColorStop(0.55, "rgba(255, 255, 255, 0.75)");
    shineGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = shineGrad;
    ctx.globalAlpha = opacity * 0.6;
    ctx.fillText(text, x, y);

    ctx.restore();
  }

  function drawJourney() {
    if (!journey) return;
    drawTrail();
    drawJourneyDot();

    if (journey.wordOpacity > 0.01 && (journey.phase === "hold" || journey.phase === "fade")) {
      const hub = hubs[journey.toIndex];
      drawGlassWord(hub.key, hub.x, hub.y - 30, hub.color, journey.wordOpacity);
    }
  }

  let lastTime = performance.now();

  function frame(time) {
    if (!running) return;
    const dt = Math.min(time - lastTime, 120);
    lastTime = time;

    ctx.clearRect(0, 0, width, height);
    drawAtmosphere(time);
    updateNodes();
    drawMesh();
    drawPulses();
    updateJourney(dt);
    drawJourney();

    rafId = requestAnimationFrame(frame);
  }

  function drawStaticFrame() {
    ctx.clearRect(0, 0, width, height);
    drawAtmosphere(0);
    drawMesh();
    hubs.forEach((h) => drawGlassWord(h.key, h.x, h.y - 30, h.color, 0.85));
  }

  function start() {
    if (running || reduceMotion) return;
    running = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function handleResize() {
    setup();
    if (reduceMotion) drawStaticFrame();
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });

  window.addEventListener("resize", handleResize);

  setup();
  if (reduceMotion) {
    drawStaticFrame();
  } else {
    start();
  }
})();
