/* ============================================================
   MOMENTUM — Fondo animado: red de conexiones digitales
   ------------------------------------------------------------
   Vive 100% aparte del resto de la lógica de la página (no toca
   app.js, no participa del cuestionario ni del envío a Google
   Sheets). Es pura decoración de fondo, dibujada en un <canvas>
   con la API nativa del navegador — sin librerías externas.

   Capas, de atrás para adelante:
   1. Atmósfera: manchas de color grandes y muy difuminadas,
      cambiando de tono lentamente entre azul / violeta / celeste
      / verde suave.
   2. Malla: nodos conectados por líneas finas con brillo.
   3. Pulsos ambiente: destellos que viajan por las conexiones,
      dando sensación de "datos moviéndose".
   4. Recorrido guiado: un pulso más marcado que va visitando, en
      loop, tres puntos fijos — Nicho → Avatar → ROMA — mostrando
      esa palabra en dorado al llegar a cada uno.
   ============================================================ */

(function () {
  const canvas = document.getElementById("momentum-network");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PALETTE = ["#3E6BAE", "#7C5CFF", "#55D2E3", "#4ECDA0"];
  const GOLD = "#F2DA8E";

  let width = 0, height = 0, dpr = 1;
  let nodes = [];
  let pulses = [];
  let hubs = [];
  let journey = null;
  let rafId = null;
  let running = false;

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
  }

  function buildNodes() {
    const area = width * height;
    const count = Math.round(clamp(area / 26000, 14, 34));
    nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 1.4 + Math.random() * 1.6,
        color: PALETTE[i % PALETTE.length],
      });
    }
    pulses = [];
    for (let i = 0; i < Math.min(4, Math.round(count / 6)); i++) {
      pulses.push(makePulse());
    }
  }

  // Tres puntos fijos (en % del viewport) donde va a "aterrizar"
  // el recorrido guiado y aparecer cada palabra del método.
  function buildHubs() {
    const positions = [
      { key: "Nicho", xPct: 0.18, yPct: 0.30 },
      { key: "Avatar", xPct: 0.5, yPct: 0.68 },
      { key: "ROMA", xPct: 0.82, yPct: 0.32 },
    ];
    hubs = positions.map((p) => ({
      key: p.key,
      x: width * p.xPct,
      y: height * p.yPct,
    }));

    if (!journey) {
      journey = {
        fromIndex: 2, // arranca "llegando" desde ROMA hacia Nicho, para que el primer tramo visible sea Nicho
        toIndex: 0,
        t: 0,
        phase: "travel", // travel | hold | fade
        holdT: 0,
        wordOpacity: 0,
      };
    }
  }

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function nearestNodeTo(x, y) {
    let best = nodes[0], bestD = Infinity;
    nodes.forEach((n) => {
      const d = (n.x - x) ** 2 + (n.y - y) ** 2;
      if (d < bestD) { bestD = d; best = n; }
    });
    return best;
  }

  function makePulse() {
    if (nodes.length < 2) return null;
    const a = nodes[Math.floor(Math.random() * nodes.length)];
    const b = nearestConnected(a);
    return { a, b, t: Math.random(), speed: 0.0025 + Math.random() * 0.003 };
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

  function drawAtmosphere(time) {
    const cycle = time * 0.00003;
    PALETTE.forEach((color, i) => {
      const angle = cycle + (i * Math.PI * 2) / PALETTE.length;
      const cx = width * (0.5 + 0.35 * Math.cos(angle));
      const cy = height * (0.5 + 0.35 * Math.sin(angle * 0.8));
      const radius = Math.max(width, height) * 0.55;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, hexToRgba(color, 0.10));
      grad.addColorStop(1, hexToRgba(color, 0));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    });
  }

  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const MAX_LINK_DIST = 170;

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
        const alpha = (1 - dist / MAX_LINK_DIST) * 0.22;
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

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.fillStyle = hexToRgba(n.color, 0.55);
      ctx.shadowColor = n.color;
      ctx.shadowBlur = 6;
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
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
      ctx.shadowBlur = 10;
      ctx.arc(x, y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  const TRAVEL_MS = 4200;
  const HOLD_MS = 2200;
  const FADE_MS = 550;

  function updateJourney(dt) {
    if (!journey || hubs.length < 3) return;
    const from = hubs[journey.fromIndex];
    const to = hubs[journey.toIndex];

    if (journey.phase === "travel") {
      journey.t += dt / TRAVEL_MS;
      if (journey.t >= 1) {
        journey.t = 1;
        journey.phase = "hold";
        journey.holdT = 0;
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
        journey.t = 0;
        journey.phase = "travel";
        journey.wordOpacity = 0;
      }
    }

    // Posición actual del recorrido (con suavizado ease-in-out)
    const ease = journey.t < 0.5
      ? 2 * journey.t * journey.t
      : 1 - Math.pow(-2 * journey.t + 2, 2) / 2;
    journey.x = from.x + (to.x - from.x) * ease;
    journey.y = from.y + (to.y - from.y) * ease;
  }

  function drawJourney() {
    if (!journey) return;

    // El destello del recorrido guiado, más grande y brillante
    // que los pulsos ambiente.
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.beginPath();
    ctx.fillStyle = "#FFFFFF";
    ctx.shadowColor = GOLD;
    ctx.shadowBlur = 18;
    ctx.arc(journey.x, journey.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // La palabra (Nicho / Avatar / ROMA) en el hub actual, mientras
    // dura la fase de "hold" o "fade".
    if (journey.wordOpacity > 0.01 && (journey.phase === "hold" || journey.phase === "fade")) {
      const hub = hubs[journey.toIndex];
      const fontSize = clamp(width * 0.028, 18, 30);
      ctx.save();
      ctx.globalAlpha = journey.wordOpacity;
      ctx.font = `600 ${fontSize}px 'Syne', sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = GOLD;
      ctx.shadowColor = GOLD;
      ctx.shadowBlur = 16;
      ctx.fillText(hub.key, hub.x, hub.y - 26);
      ctx.restore();
    }
  }

  let lastTime = performance.now();

  function frame(time) {
    if (!running) return;
    const dt = Math.min(time - lastTime, 64);
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
    // Para quienes tienen "reducir movimiento" activado: se dibuja
    // una sola vez, sin animación, respetando su preferencia.
    ctx.clearRect(0, 0, width, height);
    drawAtmosphere(0);
    drawMesh();
    if (hubs[0]) {
      const fontSize = clamp(width * 0.028, 18, 30);
      ctx.font = `600 ${fontSize}px 'Syne', sans-serif`;
      ctx.textAlign = "center";
      ctx.fillStyle = GOLD;
      hubs.forEach((h) => ctx.fillText(h.key, h.x, h.y - 26));
    }
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
