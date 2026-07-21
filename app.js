/* ============================================================
   MOMENTUM — Evaluación de Cualificación Profesional
   Data + lógica del cuestionario (7 slides x 5 preguntas)
   ============================================================ */

const QUESTIONS = [
  // Slide 1
  { id: 1, block: "Bloque 1", text: "¿Has monetizado de alguna forma tu conocimiento o expertise a través de redes sociales?", options: [
    { l: "A", t: "No, nunca he vendido nada relacionado a mi conocimiento", v: 1 },
    { l: "B", t: "He intentado pero no he logrado ventas consistentes", v: 2 },
    { l: "C", t: "Sí, he vendido productos/servicios pero de forma irregular", v: 3 },
    { l: "D", t: "Sí, genero ingresos de forma regular vendiendo mi conocimiento", v: 4 },
  ]},
  { id: 2, block: "Bloque 1", text: "¿Cuál es tu principal desafío actual con tu presencia digital?", options: [
    { l: "A", t: "No sé cómo empezar a construir mi marca personal", v: 1 },
    { l: "B", t: "Tengo contenido pero no logro convertirlo en ventas", v: 2 },
    { l: "C", t: "Genero ventas pero no logro escalar ni sistematizar", v: 3 },
    { l: "D", t: "Tengo un sistema funcionando pero quiero multiplicar resultados", v: 4 },
  ]},
  { id: 3, block: "Bloque 1", text: "¿Qué tan clara tienes tu propuesta de valor para tu audiencia?", options: [
    { l: "A", t: "No tengo claridad, sé que tengo conocimiento pero no sé cómo comunicarlo", v: 1 },
    { l: "B", t: "Tengo algunas ideas pero me falta definición y enfoque", v: 2 },
    { l: "C", t: "Tengo claridad pero me cuesta transmitirlo efectivamente", v: 3 },
    { l: "D", t: "Tengo total claridad y mi audiencia entiende perfectamente lo que ofrezco", v: 4 },
  ]},
  { id: 4, block: "Bloque 1", text: "De los últimos 3 proyectos o ideas que iniciaste, ¿cuántos completaste hasta el final?", options: [
    { l: "A", t: "Ninguno, siempre encuentro algo nuevo que me distrae o pierdo el interés", v: 1 },
    { l: "B", t: "Uno, pero los demás los abandoné por falta de resultados rápidos", v: 2 },
    { l: "C", t: "Dos, aunque me costó y tomó más tiempo del esperado", v: 3 },
    { l: "D", t: "Los tres, cuando inicio algo lo termino aunque tarde más de lo planeado", v: 4 },
  ]},
  { id: 5, block: "Bloque 2", text: "¿Cómo definirías tu nivel de conocimiento en el área a la que te dedicas?", options: [
    { l: "A", t: "Estoy aprendiendo, no me considero experto aún", v: 1 },
    { l: "B", t: "Tengo conocimientos básicos y algo de experiencia práctica", v: 2 },
    { l: "C", t: "Tengo experiencia sólida y he ayudado a otras personas con resultados", v: 3 },
    { l: "D", t: "Soy reconocido como referente y tengo años de experiencia con resultados comprobados", v: 4 },
  ]},

  // Slide 2
  { id: 6, block: "Bloque 2", text: "¿Qué tan estructurado está tu conocimiento para ser enseñado o transferido?", options: [
    { l: "A", t: "No está estructurado, sé hacer las cosas pero no sé cómo enseñarlas", v: 1 },
    { l: "B", t: "Tengo algunas ideas pero falta organización y metodología", v: 2 },
    { l: "C", t: "Tengo estructura básica pero necesito pulir y profesionalizar", v: 3 },
    { l: "D", t: "Tengo un método claro, probado y listo para ser transmitido", v: 4 },
  ]},
  { id: 7, block: "Bloque 2", text: "Si tuvieras que enseñar tu conocimiento a alguien hoy mismo, ¿qué pasaría?", options: [
    { l: "A", t: "No sabría por dónde empezar, me falta estructura", v: 1 },
    { l: "B", t: "Podría explicar algunos conceptos pero me costaría ser claro", v: 2 },
    { l: "C", t: "Podría enseñar de forma organizada pero me falta práctica", v: 3 },
    { l: "D", t: "Tengo claridad total y podría transmitir mi conocimiento efectivamente", v: 4 },
  ]},
  { id: 8, block: "Bloque 2", text: "Además de vender tus productos/servicios, ¿hay personas que te piden consejos sobre tu industria o área?", options: [
    { l: "A", t: "No, solo me buscan para comprar productos o servicios", v: 1 },
    { l: "B", t: "Ocasionalmente alguien me pregunta algo relacionado", v: 2 },
    { l: "C", t: "Sí, regularmente me consultan sobre cómo hacer las cosas", v: 3 },
    { l: "D", t: "Constantemente me buscan como referencia y experto en el tema", v: 4 },
  ]},
  { id: 9, block: "Bloque 2", text: "Actualmente, ¿qué vendes u ofreces principalmente?", options: [
    { l: "A", t: "No vendo nada actualmente", v: 1 },
    { l: "B", t: "Vendo productos físicos o servicios tradicionales", v: 2 },
    { l: "C", t: "Ofrezco consultorías o servicios personalizados uno a uno", v: 3 },
    { l: "D", t: "Vendo cursos, programas o infoproductos escalables", v: 4 },
  ]},
  { id: 10, block: "Bloque 2", text: "¿Cuál es tu mayor fortaleza como profesional/emprendedor?", options: [
    { l: "A", t: "Tengo conocimiento pero me cuesta ponerlo en acción", v: 1 },
    { l: "B", t: "Soy bueno en lo que hago pero me falta visión de negocio", v: 2 },
    { l: "C", t: "Domino mi área y entiendo cómo generar ingresos", v: 3 },
    { l: "D", t: "Combino expertise técnico con habilidades estratégicas y de venta", v: 4 },
  ]},

  // Slide 3
  { id: 11, block: "Bloque 2", text: "¿Cuál es tu mayor debilidad como emprendedor/profesional?", options: [
    { l: "A", t: "Me cuesta vender y cerrar clientes", v: 3 },
    { l: "B", t: "No soy constante, pierdo motivación fácilmente", v: 2 },
    { l: "C", t: "Quiero hacer todo perfecto y me paralizo", v: 3 },
    { l: "D", t: "No tengo debilidades significativas, necesito mejor estrategia", v: 1 },
  ]},
  { id: 12, block: "Bloque 2", text: "¿Cómo describirías tu capacidad para resolver problemas complejos en tu área?", options: [
    { l: "A", t: "Resuelvo problemas básicos con ayuda o investigación", v: 1 },
    { l: "B", t: "Puedo resolver la mayoría de problemas comunes", v: 2 },
    { l: "C", t: "Resuelvo problemas complejos que otros no pueden", v: 3 },
    { l: "D", t: "Soy referente en resolver los problemas más difíciles de mi industria", v: 4 },
  ]},
  { id: 13, block: "Bloque 3", text: "¿Qué significa \"éxito\" para ti en términos específicos?", options: [
    { l: "A", t: "Ganar más dinero del que gano ahora (sin cifra específica)", v: 1 },
    { l: "B", t: "Alcanzar una cifra mensual específica (ej: $5,000, $10,000 USD)", v: 4 },
    { l: "C", t: "Tener libertad de tiempo y no depender de un horario", v: 3 },
    { l: "D", t: "Crear impacto masivo y ser reconocido como referente", v: 2 },
  ]},
  { id: 14, block: "Bloque 3", text: "¿En cuánto tiempo esperas ver resultados significativos al escalar tu negocio?", options: [
    { l: "A", t: "En las próximas 2-4 semanas", v: 1 },
    { l: "B", t: "En 1-3 meses", v: 2 },
    { l: "C", t: "En 6 meses a 1 año", v: 4 },
    { l: "D", t: "Entiendo que es un proceso de 1-2 años de construcción sólida", v: 4 },
  ]},
  { id: 15, block: "Bloque 3", text: "Si te dijera que alcanzar resultados extraordinarios requiere trabajo consistente durante 12-18 meses, ¿qué pensarías?", options: [
    { l: "A", t: "Es demasiado tiempo, busco resultados más rápidos", v: 1 },
    { l: "B", t: "Me parece mucho, esperaba algo más inmediato", v: 2 },
    { l: "C", t: "Lo entiendo, pero me gustaría acortar ese tiempo si es posible", v: 3 },
    { l: "D", t: "Lo acepto completamente, entiendo que la construcción sólida toma tiempo", v: 4 },
  ]},

  // Slide 4
  { id: 16, block: "Bloque 3", text: "¿Qué te impulsa realmente a querer transformar tu conocimiento en un negocio escalable?", options: [
    { l: "A", t: "Necesito generar ingresos adicionales urgentemente", v: 1 },
    { l: "B", t: "Quiero independizarme laboralmente y tener más libertad", v: 3 },
    { l: "C", t: "Busco impactar a más personas y crear estabilidad financiera", v: 4 },
    { l: "D", t: "Quiero construir un legado, maximizar mi impacto y libertad total", v: 4 },
  ]},
  { id: 17, block: "Bloque 3", text: "Cuando tenés que tomar una decisión importante para tu negocio, ¿qué hacés?", options: [
    { l: "A", t: "Pido opiniones a familiares, amigos y espero tener certeza total", v: 1 },
    { l: "B", t: "Investigo mucho, analizo todas las opciones y tardo en decidir", v: 2 },
    { l: "C", t: "Analizo rápidamente pros/contras y decido aunque no tenga certeza total", v: 4 },
    { l: "D", t: "Confío en mi intuición y decido rápido basándome en experiencia", v: 3 },
  ]},
  { id: 18, block: "Bloque 3", text: "¿Has intentado escalar tu negocio antes? ¿Qué pasó?", options: [
    { l: "A", t: "No, esta sería mi primera vez", v: 2 },
    { l: "B", t: "Sí, pero abandoné rápido porque no vi resultados inmediatos", v: 1 },
    { l: "C", t: "Sí, tuve algunos resultados pero me faltó estrategia y acompañamiento", v: 3 },
    { l: "D", t: "Sí, he tenido resultados pero quiero llevarlos al siguiente nivel", v: 4 },
  ]},
  { id: 19, block: "Bloque 3", text: "¿Qué creés que es más importante para tener éxito en un negocio digital?", options: [
    { l: "A", t: "Tener una gran audiencia y muchos seguidores", v: 2 },
    { l: "B", t: "Conocer las estrategias y tácticas correctas", v: 2 },
    { l: "C", t: "Tener el producto perfecto antes de lanzar", v: 1 },
    { l: "D", t: "Disciplina, constancia y capacidad de aprender de los fracasos", v: 4 },
  ]},
  { id: 20, block: "Bloque 3", text: "Cuando enfrentás un obstáculo o un resultado no esperado, ¿cómo reaccionás?", options: [
    { l: "A", t: "Me frustro y considero abandonar", v: 1 },
    { l: "B", t: "Me desanimo pero eventualmente lo intento de nuevo", v: 2 },
    { l: "C", t: "Analizo qué falló y busco mejorar mi enfoque", v: 3 },
    { l: "D", t: "Lo veo como aprendizaje necesario y ajusto mi estrategia inmediatamente", v: 4 },
  ]},

  // Slide 5
  { id: 21, block: "Bloque 4", text: "¿Cuántas horas semanales podrías dedicar REALMENTE a construir y escalar tu negocio?", options: [
    { l: "A", t: "Menos de 5 horas semanales", v: 1 },
    { l: "B", t: "Entre 5 y 10 horas semanales", v: 2 },
    { l: "C", t: "Entre 10 y 20 horas semanales", v: 3 },
    { l: "D", t: "Más de 20 horas semanales", v: 4 },
  ]},
  { id: 22, block: "Bloque 4", text: "¿Qué significa \"invertir\" en tu negocio para vos?", options: [
    { l: "A", t: "Principalmente poner dinero en publicidad y herramientas", v: 2 },
    { l: "B", t: "Dedicar tiempo cuando puedo y comprar algún curso", v: 1 },
    { l: "C", t: "Comprometerme con disciplina diaria, tiempo y recursos necesarios", v: 4 },
    { l: "D", t: "Contratar servicios externos para que hagan el trabajo por mí", v: 1 },
  ]},
  { id: 23, block: "Bloque 4", text: "¿Cuál de estas afirmaciones refleja mejor tu relación actual con el dinero?", options: [
    { l: "A", t: "Vivo al día, no tengo ahorros ni capital para invertir", v: 1 },
    { l: "B", t: "Tengo algo ahorrado pero me da miedo gastarlo en mi negocio", v: 2 },
    { l: "C", t: "Tengo recursos pero prefiero invertir poco a poco para minimizar riesgo", v: 3 },
    { l: "D", t: "Entiendo que el dinero es una herramienta y estoy dispuesto a invertir para crecer", v: 4 },
  ]},
  { id: 24, block: "Bloque 4", text: "Si necesitás acelerar resultados, ¿estarías dispuesto a invertir en tráfico pago?", options: [
    { l: "A", t: "No, prefiero estrategias 100% orgánicas", v: 2 },
    { l: "B", t: "Tal vez, pero con presupuesto muy limitado", v: 2 },
    { l: "C", t: "Sí, entiendo que es necesario y puedo destinar presupuesto para ello", v: 4 },
    { l: "D", t: "Sí, y tengo capital disponible para invertir consistentemente", v: 4 },
  ]},
  { id: 25, block: "Bloque 4", text: "¿Has invertido anteriormente en tu educación o desarrollo profesional?", options: [
    { l: "A", t: "No, prefiero aprender solo con contenido gratuito", v: 1 },
    { l: "B", t: "He comprado algunos cursos baratos pero no los terminé", v: 1 },
    { l: "C", t: "Sí, he invertido en cursos y algunos me han dado resultados", v: 3 },
    { l: "D", t: "Sí, invierto constantemente en mentorías, cursos y mi desarrollo", v: 4 },
  ]},

  // Slide 6
  { id: 26, block: "Bloque 4", text: "Si te digo que necesitás invertir 3-6 meses de trabajo intenso SIN garantía de resultados inmediatos, ¿qué harías?", options: [
    { l: "A", t: "Buscaría otra opción con resultados más rápidos", v: 1 },
    { l: "B", t: "Lo pensaría mucho antes de comprometerme", v: 2 },
    { l: "C", t: "Lo aceptaría pero con dudas", v: 2 },
    { l: "D", t: "Lo entiendo perfectamente, así funcionan los negocios sólidos", v: 4 },
  ]},
  { id: 27, block: "Bloque 4", text: "¿Qué porcentaje de tus ganancias actuales estarías dispuesto a reinvertir para escalar?", options: [
    { l: "A", t: "Menos del 10%", v: 1 },
    { l: "B", t: "Entre 10-25%", v: 2 },
    { l: "C", t: "Entre 25-50%", v: 3 },
    { l: "D", t: "Más del 50%, entiendo que la reinversión acelera resultados", v: 4 },
  ]},
  { id: 28, block: "Bloque 5", text: "¿Por qué creés que no has escalado tu negocio hasta ahora?", options: [
    { l: "A", t: "No he tenido el capital necesario para invertir en publicidad", v: 1 },
    { l: "B", t: "No sé cómo hacerlo, me falta conocimiento de marketing digital", v: 2 },
    { l: "C", t: "He estado ocupado con otras prioridades de mi vida", v: 1 },
    { l: "D", t: "No he tomado las decisiones correctas y me ha faltado disciplina", v: 4 },
  ]},
  { id: 29, block: "Bloque 5", text: "¿Cuál describe mejor tu patrón de aprendizaje?", options: [
    { l: "A", t: "Compro cursos pero no termino la mayoría, siempre encuentro uno nuevo", v: 1 },
    { l: "B", t: "Estudio todo profundamente antes de aplicar algo, necesito sentirme preparado", v: 2 },
    { l: "C", t: "Aprendo lo básico y aplico inmediatamente, ajusto sobre la marcha", v: 4 },
    { l: "D", t: "No compro cursos, aprendo solo probando y equivocándome", v: 3 },
  ]},
  { id: 30, block: "Bloque 5", text: "¿Has abandonado proyectos o ideas de negocio anteriormente?", options: [
    { l: "A", t: "Sí, varios, porque no funcionaron rápido", v: 1 },
    { l: "B", t: "Sí, algunos, porque me faltó claridad o acompañamiento", v: 2 },
    { l: "C", t: "He pausado algunos pero por razones estratégicas, no por frustración", v: 3 },
    { l: "D", t: "No abandono, ajusto estrategias hasta lograr resultados", v: 4 },
  ]},

  // Slide 7
  { id: 31, block: "Bloque 5", text: "¿Cómo manejás las críticas o comentarios negativos sobre tu trabajo?", options: [
    { l: "A", t: "Me afectan mucho y me desmotivan", v: 1 },
    { l: "B", t: "Me molestan pero trato de ignorarlos", v: 2 },
    { l: "C", t: "Los escucho y evalúo si hay algo que mejorar", v: 3 },
    { l: "D", t: "Los uso como retroalimentación valiosa para crecer", v: 4 },
  ]},
  { id: 32, block: "Bloque 5", text: "¿Qué tan dispuesto estás a salir de tu zona de confort para lograr tus objetivos?", options: [
    { l: "A", t: "Prefiero mantenerme en lo que ya conozco", v: 1 },
    { l: "B", t: "Lo haría solo si es absolutamente necesario", v: 2 },
    { l: "C", t: "Estoy dispuesto aunque me genere incomodidad", v: 3 },
    { l: "D", t: "Busco activamente salir de mi zona de confort porque sé que ahí está el crecimiento", v: 4 },
  ]},
  { id: 33, block: "Bloque 6", text: "Si tuvieras que elegir solo UNA de estas opciones para los próximos 6 meses, ¿cuál elegirías?", options: [
    { l: "A", t: "Conseguir 10 clientes nuevos como sea para generar ingresos inmediatos", v: 1 },
    { l: "B", t: "Crear contenido de valor todos los días para construir audiencia", v: 3 },
    { l: "C", t: "Perfeccionar mi producto/servicio hasta que sea \"perfecto\"", v: 1 },
    { l: "D", t: "Entender profundamente los problemas de mi cliente ideal antes de vender", v: 4 },
  ]},
  { id: 34, block: "Bloque 6", text: "¿Qué modelo de negocio te parece más atractivo y escalable?", options: [
    { l: "A", t: "Vender productos físicos con margen alto", v: 2 },
    { l: "B", t: "Ofrecer servicios personalizados uno a uno", v: 2 },
    { l: "C", t: "Crear infoproductos que se venden de forma automatizada", v: 4 },
    { l: "D", t: "Combinar infoproductos con mentorías grupales escalables", v: 4 },
  ]},
  { id: 35, block: "Bloque 6", text: "Si en 2 años NO lográs los resultados que buscás con tu negocio, ¿qué harías?", options: [
    { l: "A", t: "Buscaría otro negocio u oportunidad diferente", v: 2 },
    { l: "B", t: "Volvería a un trabajo tradicional, esto no es para mí", v: 1 },
    { l: "C", t: "Seguiría intentando porque esto es mi propósito de vida", v: 3 },
    { l: "D", t: "Dependería de mi situación financiera en ese momento", v: 4 },
  ]},
];

const SLIDE_PHRASES = [
  "Ninguna transformación comienza con una promesa. Comienza con el valor de mirar tu realidad sin excusas. Solo cuando aceptás con honestidad dónde estás hoy, podés construir el camino hacia donde realmente querés llegar.",
  "El conocimiento tiene valor solo cuando puede transformar la vida de otra persona. Mientras permanezca desordenado, seguirá siendo una habilidad personal. Cuando logra convertirse en un método claro, nace la verdadera autoridad.",
  "Los grandes resultados casi nunca dependen de saber más. Dependen de tener la claridad suficiente para sostener una dirección cuando aparecen las dudas, la incertidumbre y las distracciones.",
  "Toda visión importante exige una inversión antes de entregar una recompensa. Tiempo, dinero, energía y disciplina son el precio de entrada para construir algo que pueda crecer de verdad.",
  "El talento puede abrir una puerta, pero nunca sostiene un proyecto. Lo que realmente marca la diferencia es la capacidad de seguir avanzando cuando el entusiasmo desaparece y todavía no existen resultados que celebrar.",
  "Las decisiones importantes nunca se toman cuando todo sale bien. Se revelan cuando aparece la presión. Es en esos momentos donde un emprendedor demuestra si está construyendo un negocio o simplemente reaccionando a las circunstancias.",
  "Todo proyecto importante atraviesa momentos donde nada parece avanzar. La diferencia entre quienes llegan y quienes abandonan no está en la motivación inicial, sino en la decisión de seguir construyendo incluso cuando nadie puede garantizar el resultado.",
];

const SLIDES = [];
for (let i = 0; i < QUESTIONS.length; i += 5) {
  SLIDES.push(QUESTIONS.slice(i, i + 5));
}

const TOTAL_SLIDES = SLIDES.length; // 7

let currentSlide = 0;
const answers = {}; // { [questionId]: { letter, value } }

const introSection = document.getElementById("intro");
const quizSection = document.getElementById("quiz");
const leadSection = document.getElementById("lead");
const thanksSection = document.getElementById("thanks");

const quizForm = document.getElementById("quizForm");
const progressFill = document.getElementById("progressFill");
const progressLabel = document.getElementById("progressLabel");
const slidePhrase = document.getElementById("slidePhrase");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");

function showOnly(section) {
  [introSection, quizSection, leadSection, thanksSection].forEach((s) => {
    s.hidden = s !== section;
  });
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function renderSlide(index) {
  const questions = SLIDES[index];

  progressFill.style.width = `${((index + 1) / TOTAL_SLIDES) * 100}%`;
  progressLabel.textContent = `Bloque ${index + 1} de ${TOTAL_SLIDES}`;
  slidePhrase.textContent = SLIDE_PHRASES[index];

  quizForm.innerHTML = "";

  questions.forEach((q) => {
    const qWrap = document.createElement("fieldset");
    qWrap.className = "question";
    qWrap.dataset.qid = q.id;

    const legend = document.createElement("legend");
    legend.className = "question-text";
    legend.textContent = q.text;
    qWrap.appendChild(legend);

    const optsWrap = document.createElement("div");
    optsWrap.className = "options";

    q.options.forEach((opt) => {
      const optId = `q${q.id}_${opt.l}`;
      const label = document.createElement("label");
      label.className = "option";
      label.setAttribute("for", optId);

      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${q.id}`;
      input.id = optId;
      input.value = opt.l;
      input.dataset.value = opt.v;
      if (answers[q.id] && answers[q.id].letter === opt.l) {
        input.checked = true;
      }

      input.addEventListener("change", () => {
        answers[q.id] = { letter: opt.l, value: opt.v };
        updateNextVisibility();
      });

      const letterSpan = document.createElement("span");
      letterSpan.className = "option-letter";
      letterSpan.textContent = opt.l;

      const textSpan = document.createElement("span");
      textSpan.className = "option-text";
      textSpan.textContent = opt.t;

      label.appendChild(input);
      label.appendChild(letterSpan);
      label.appendChild(textSpan);
      optsWrap.appendChild(label);
    });

    qWrap.appendChild(optsWrap);
    quizForm.appendChild(qWrap);
  });

  btnPrev.disabled = index === 0;
  btnNext.textContent = index === TOTAL_SLIDES - 1 ? "Finalizar" : "Siguiente";
  updateNextVisibility();
}

function slideIsComplete(index) {
  return SLIDES[index].every((q) => answers[q.id]);
}

function updateNextVisibility() {
  btnNext.hidden = !slideIsComplete(currentSlide);
}

function goToSlide(index) {
  currentSlide = index;
  renderSlide(currentSlide);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" in window ? "instant" : "auto" });
    });
  });
}

document.getElementById("startBtn").addEventListener("click", () => {
  showOnly(quizSection);
  goToSlide(0);
});

btnPrev.addEventListener("click", () => {
  if (currentSlide > 0) goToSlide(currentSlide - 1);
});

btnNext.addEventListener("click", () => {
  if (!slideIsComplete(currentSlide)) return; // resguardo, no debería poder verse oculto
  if (currentSlide < TOTAL_SLIDES - 1) {
    goToSlide(currentSlide + 1);
  } else {
    showOnly(leadSection);
  }
});

/* ============================================================
   Captura de nombre + email y envío a Google Sheets
   ============================================================ */

// Reemplazá esta URL por la que te da Google al implementar el
// Apps Script como "Aplicación web" (ver apps-script.gs).
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbziA4xtEDW7GWpepQZt76MQJp89yEHdNQGAZh6C-rObdW5Ud4KTIOzIaZwT7WFQrPwuMA/exec";

const leadForm = document.getElementById("leadForm");
const leadSubmitBtn = document.getElementById("leadSubmitBtn");
const leadNameInput = document.getElementById("leadName");
const leadEmailInput = document.getElementById("leadEmail");
const leadInstagramInput = document.getElementById("leadInstagram");
const leadAltSocialInput = document.getElementById("leadAltSocial");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

function updateLeadSubmitVisibility() {
  const nameOk = leadNameInput.value.trim().length > 1;
  const emailOk = EMAIL_REGEX.test(leadEmailInput.value.trim());
  const instagramOk = leadInstagramInput.value.trim().length > 1;
  const altSocialOk = leadAltSocialInput.value.trim().length > 1;
  leadSubmitBtn.hidden = !(nameOk && emailOk && (instagramOk || altSocialOk));
}

leadNameInput.addEventListener("input", updateLeadSubmitVisibility);
leadEmailInput.addEventListener("input", updateLeadSubmitVisibility);
leadInstagramInput.addEventListener("input", updateLeadSubmitVisibility);
leadAltSocialInput.addEventListener("input", updateLeadSubmitVisibility);

leadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = leadNameInput.value.trim();
  const email = leadEmailInput.value.trim();
  const instagram = leadInstagramInput.value.trim();
  const altSocial = leadAltSocialInput.value.trim();

  if (!(name.length > 1 && EMAIL_REGEX.test(email) && (instagram.length > 1 || altSocial.length > 1))) return;

  const totalScore = Object.values(answers).reduce((sum, a) => sum + a.value, 0);

  const payload = {
    name,
    email,
    instagram,
    altSocial,
    totalScore,
    answers: Object.fromEntries(
      Object.entries(answers).map(([qid, a]) => [`q${qid}`, a.letter])
    ),
    points: Object.fromEntries(
      Object.entries(answers).map(([qid, a]) => [`q${qid}`, a.value])
    ),
  };

  leadSubmitBtn.disabled = true;
  leadSubmitBtn.textContent = "Enviando...";

  try {
    // no-cors: Apps Script no permite leer la respuesta desde otro
    // dominio, pero el envío y guardado en la planilla sí funciona.
    await fetch(WEB_APP_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Error al enviar a Google Sheets:", err);
  }

  showOnly(thanksSection);
});
