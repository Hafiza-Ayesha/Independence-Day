/* ============================================================
   PAKISTAN — A STORY OF FREEDOM
   Vanilla JS interactions
   ============================================================ */
   (() => {
    "use strict";
  
    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  
    /* ---------------------------------------------------------
       NAV: scroll state + mobile menu + smooth scroll
       --------------------------------------------------------- */
    const nav = $("#nav");
    const navToggle = $("#navToggle");
    const navLinks = $("#navLinks");
  
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    }, { passive: true });
  
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  
    $$(".navlink").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
      });
    });
  
    /* ---------------------------------------------------------
       SCROLL REVEAL (IntersectionObserver)
       --------------------------------------------------------- */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
  
    $$(".reveal").forEach(el => revealObserver.observe(el));
  
    /* ---------------------------------------------------------
       HERO CANVAS: waving flag + crescent + stars + particles
       --------------------------------------------------------- */
    const heroCanvas = $("#heroCanvas");
    const hctx = heroCanvas.getContext("2d");
    let heroW, heroH, dpr = Math.min(window.devicePixelRatio || 1, 2);
  
    function sizeHero() {
      const hero = $(".hero");
      heroW = hero.clientWidth; heroH = hero.clientHeight;
      heroCanvas.width = heroW * dpr; heroCanvas.height = heroH * dpr;
      heroCanvas.style.width = heroW + "px"; heroCanvas.style.height = heroH + "px";
      hctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeHero();
  
    // starfield
    const stars = Array.from({ length: 90 }, () => ({
      x: Math.random(), y: Math.random() * 0.6,
      r: Math.random() * 1.3 + 0.3,
      tw: Math.random() * Math.PI * 2
    }));
  
    // ambient particles
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.8 + 0.6,
      vy: -(Math.random() * 0.06 + 0.02),
      vx: (Math.random() - 0.5) * 0.02,
      a: Math.random() * 0.5 + 0.15
    }));
  
    let heroTime = 0;
  
    function drawFlag(t) {
      // simplified waving Pakistan flag silhouette, right side, translucent, cinematic
      const w = heroW * 0.46, h = w * 0.62;
      const x0 = heroW - w - heroW * 0.02;
      const y0 = heroH * 0.5 - h / 2;
  
      hctx.save();
      hctx.globalAlpha = 0.16;
      const rows = 26;
      for (let i = 0; i < rows; i++) {
        const py = y0 + (h / rows) * i;
        const wave = Math.sin(t * 0.0007 + i * 0.35) * 10;
        hctx.beginPath();
        hctx.moveTo(x0 + wave, py);
        for (let x = 0; x <= w; x += 14) {
          const yy = py + Math.sin(t * 0.0009 + x * 0.02 + i * 0.3) * 4;
          hctx.lineTo(x0 + x + wave, yy);
        }
        hctx.lineTo(x0 + w + wave, py + (h / rows));
        hctx.lineTo(x0 + wave, py + (h / rows));
        hctx.closePath();
        const isWhiteBar = i < 6;
        hctx.fillStyle = isWhiteBar ? "rgba(243,239,228,0.9)" : "rgba(22,105,63,0.9)";
        hctx.fill();
      }
      hctx.restore();
    }
  
    function drawCrescent(t) {
      const cx = heroW * 0.24, cy = heroH * 0.38;
      const R = Math.min(heroW, heroH) * 0.09;
      const glow = 0.55 + Math.sin(t * 0.0012) * 0.15;
  
      hctx.save();
      hctx.shadowColor = `rgba(201,164,92,${glow})`;
      hctx.shadowBlur = 60;
      hctx.fillStyle = "rgba(243,239,228,0.85)";
      hctx.beginPath();
      hctx.arc(cx, cy, R, 0, Math.PI * 2);
      hctx.fill();
      hctx.globalCompositeOperation = "destination-out";
      hctx.beginPath();
      hctx.arc(cx + R * 0.42, cy - R * 0.12, R * 0.92, 0, Math.PI * 2);
      hctx.fill();
      hctx.restore();
  
      // star beside crescent
      hctx.save();
      hctx.translate(cx + R * 1.55, cy - R * 0.1);
      hctx.fillStyle = "rgba(243,239,228,0.85)";
      drawStarShape(hctx, R * 0.32);
      hctx.restore();
    }
  
    function drawStarShape(ctx, r) {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a1 = (Math.PI / 5) * (2 * i) - Math.PI / 2;
        const a2 = (Math.PI / 5) * (2 * i + 1) - Math.PI / 2;
        ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
        ctx.lineTo(Math.cos(a2) * r * 0.42, Math.sin(a2) * r * 0.42);
      }
      ctx.closePath();
      ctx.fill();
    }
  
    function heroFrame(t) {
      hctx.clearRect(0, 0, heroW, heroH);
  
      // light rays
      const grad = hctx.createRadialGradient(heroW * 0.3, heroH * 0.2, 0, heroW * 0.3, heroH * 0.2, heroW * 0.7);
      grad.addColorStop(0, "rgba(22,105,63,0.28)");
      grad.addColorStop(1, "rgba(4,7,5,0)");
      hctx.fillStyle = grad;
      hctx.fillRect(0, 0, heroW, heroH);
  
      // stars
      stars.forEach(s => {
        const alpha = 0.35 + Math.sin(t * 0.001 + s.tw) * 0.35;
        hctx.fillStyle = `rgba(243,239,228,${Math.max(0, alpha)})`;
        hctx.beginPath();
        hctx.arc(s.x * heroW, s.y * heroH, s.r, 0, Math.PI * 2);
        hctx.fill();
      });
  
      drawCrescent(t);
      drawFlag(t);
  
      // particles
      particles.forEach(p => {
        p.y += p.vy * 0.6;
        p.x += p.vx * 0.6;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        hctx.fillStyle = `rgba(201,164,92,${p.a})`;
        hctx.beginPath();
        hctx.arc(p.x * heroW, p.y * heroH, p.r, 0, Math.PI * 2);
        hctx.fill();
      });
  
      if (!reduceMotion) requestAnimationFrame(heroFrame);
    }
    requestAnimationFrame(heroFrame);
    window.addEventListener("resize", sizeHero);
  
    /* ---------------------------------------------------------
       HERO COUNTER (0 -> 79)
       --------------------------------------------------------- */
    function animateCounter(el, to, duration = 1600) {
      const start = performance.now();
      function tick(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * to);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    const heroCounterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter($("#heroCounter"), 79);
          heroCounterObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    heroCounterObserver.observe($("#heroCounter"));
  
    /* ---------------------------------------------------------
       FIREWORKS (shared engine) used on hero + shine section
       --------------------------------------------------------- */
    function createFireworks(canvas) {
      const ctx = canvas.getContext("2d");
      let w, h, dprLocal = Math.min(window.devicePixelRatio || 1, 2);
      let particlesFw = [];
      let running = false;
  
      function resize() {
        const parent = canvas.parentElement;
        w = parent.clientWidth; h = parent.clientHeight;
        canvas.width = w * dprLocal; canvas.height = h * dprLocal;
        canvas.style.width = w + "px"; canvas.style.height = h + "px";
        ctx.setTransform(dprLocal, 0, 0, dprLocal, 0, 0);
      }
      resize();
      window.addEventListener("resize", resize);
  
      const colors = ["#f3efe4", "#c9a45c", "#16693f", "#3fae6f", "#e8d9a8"];
  
      function burst(x, y) {
        const count = 46;
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
          const speed = Math.random() * 3.2 + 1.4;
          particlesFw.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            decay: Math.random() * 0.012 + 0.008,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 2 + 1.4
          });
        }
      }
  
      function loop() {
        ctx.clearRect(0, 0, w, h);
        particlesFw.forEach(p => {
          p.x += p.vx; p.y += p.vy;
          p.vy += 0.025; // gravity
          p.life -= p.decay;
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.globalAlpha = 1;
        particlesFw = particlesFw.filter(p => p.life > 0);
        if (particlesFw.length > 0 || running) {
          requestAnimationFrame(loop);
        }
      }
  
      function launch(times = 5) {
        running = true;
        let i = 0;
        const interval = setInterval(() => {
          const x = w * (0.2 + Math.random() * 0.6);
          const y = h * (0.2 + Math.random() * 0.35);
          burst(x, y);
          i++;
          if (i >= times) { clearInterval(interval); running = false; }
        }, 260);
        requestAnimationFrame(loop);
      }
  
      return { launch };
    }
  
    const heroFireworks = createFireworks($("#heroFireworks"));
    $("#heroCelebrateBtn").addEventListener("click", () => heroFireworks.launch(4));
  
    const shineFireworks = createFireworks($("#shineCanvas"));
    const shineBanner = $("#shineBanner");
    $("#shineBtn").addEventListener("click", () => {
      shineFireworks.launch(9);
      shineBanner.classList.add("show");
      setTimeout(() => shineBanner.classList.remove("show"), 3200);
    });
  
    /* ---------------------------------------------------------
       DREAM WORDS: sequential highlight on scroll into view
       --------------------------------------------------------- */
    const dreamWords = $$(".dream__word");
    const dreamObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          dreamWords.forEach((w, i) => {
            setTimeout(() => w.classList.add("active"), i * 350);
          });
          dreamObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    dreamObserver.observe($("#dreamWords"));
  
    /* ---------------------------------------------------------
       HISTORY: draggable horizontal journey (1857-1947)
       --------------------------------------------------------- */
    const historyData = [
      {
        year: "1857", label: "The War of Independence",
        desc: "The uprising of 1857 marked the first major, united resistance against British colonial rule — and the beginning of a long political awakening.",
        img: "images/history/1857.jpg"
      },
      {
        year: "1906", label: "The All-India Muslim League",
        desc: "Founded in Dhaka, the All-India Muslim League gave Muslims of the subcontinent an organised political voice for the first time.",
        img: "images/history/1906.jpg"
      },
      {
        year: "1930", label: "The Allahabad Address",
        desc: "Allama Iqbal proposed a separate Muslim state in North-West India — the intellectual foundation on which Pakistan would later be built.",
        img: "images/history/1930.jpg"
      },
      {
        year: "1940", label: "The Lahore Resolution",
        desc: "On 23 March 1940, the Muslim League formally called for independent states for Muslims — the moment the demand for Pakistan became official.",
        img: "images/history/1940.jpg"
      },
      {
        year: "1947", label: "A New Beginning",
        desc: "On 14 August 1947, Pakistan emerged on the map of the world — a homeland won through sacrifice, resolve, and an unshakeable dream.",
        img: "images/history/1947.jpg"
      }
    ];
  
    const historyTrack = $("#historyTrack");
    const historyHandle = $("#historyHandle");
    const historyFill = $("#historyFill");
    const historyTicksWrap = $("#historyTicks");
    const historyYearEl = $("#historyYear");
    const historyLabelEl = $("#historyLabel");
    const historyDescEl = $("#historyDesc");
    const historyBgEl = $("#historyBg");
  
    historyData.forEach((d, i) => {
      const tick = document.createElement("span");
      tick.textContent = d.year;
      tick.dataset.i = i;
      historyTicksWrap.appendChild(tick);
    });
    const historyTickEls = $$("span", historyTicksWrap);
  
    let historyIndex = 0;
    function setHistory(i, animateBg = true) {
      historyIndex = Math.max(0, Math.min(historyData.length - 1, i));
      const d = historyData[historyIndex];
      const pct = (historyIndex / (historyData.length - 1)) * 100;
      historyHandle.style.left = pct + "%";
      historyFill.style.width = pct + "%";
      historyHandle.setAttribute("aria-valuenow", historyIndex);
      historyYearEl.textContent = d.year;
      historyLabelEl.textContent = d.label;
      historyDescEl.textContent = d.desc;
      if (animateBg) historyBgEl.style.backgroundImage = `url('${d.img}')`;
      historyTickEls.forEach((t, idx) => t.classList.toggle("active", idx === historyIndex));
    }
    setHistory(0);
  
    historyTickEls.forEach(t => {
      t.addEventListener("click", () => setHistory(parseInt(t.dataset.i, 10)));
    });
  
    function historyPosToIndex(clientX) {
      const rect = historyTrack.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round(ratio * (historyData.length - 1));
    }
  
    let draggingHistory = false;
    function startDragHistory(e) {
      draggingHistory = true;
      moveDragHistory(e);
    }
    function moveDragHistory(e) {
      if (!draggingHistory) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setHistory(historyPosToIndex(clientX));
    }
    function endDragHistory() { draggingHistory = false; }
  
    historyHandle.addEventListener("mousedown", startDragHistory);
    historyTrack.addEventListener("mousedown", startDragHistory);
    window.addEventListener("mousemove", moveDragHistory);
    window.addEventListener("mouseup", endDragHistory);
  
    historyHandle.addEventListener("touchstart", startDragHistory, { passive: true });
    historyTrack.addEventListener("touchstart", startDragHistory, { passive: true });
    window.addEventListener("touchmove", moveDragHistory, { passive: true });
    window.addEventListener("touchend", endDragHistory);
  
    historyHandle.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") setHistory(historyIndex + 1);
      if (e.key === "ArrowLeft") setHistory(historyIndex - 1);
    });
  
    /* ---------------------------------------------------------
       JOURNEY: 1947 -> 2026 slider with milestones
       --------------------------------------------------------- */
    const milestones = {
      1947: "A New Beginning — Pakistan gains independence on 14 August, with Muhammad Ali Jinnah as its first Governor-General.",
      1948: "The nation mourns the loss of Quaid-e-Azam Muhammad Ali Jinnah, its founding father.",
      1956: "Pakistan adopts its first Constitution, becoming an Islamic Republic.",
      1960: "The Mangla and Tarbela dam projects begin, laying the foundation for the country's water and power infrastructure.",
      1965: "A defining year of national resolve, later commemorated as Defence Day.",
      1970: "Pakistan hosts its first general elections under universal adult franchise.",
      1973: "A new Constitution is adopted, forming the basis of Pakistan's parliamentary democracy.",
      1974: "The Islamic Summit in Lahore brings leaders from across the Muslim world together.",
      1980: "Pakistan's mountaineers and explorers begin drawing global attention to the northern peaks.",
      1988: "Benazir Bhutto becomes the first woman to lead a Muslim-majority nation as Prime Minister.",
      1996: "Pakistan wins the Cricket World Cup co-hosting spotlight, fueling a golden cricketing era.",
      1998: "Pakistan conducts its first nuclear tests, becoming a declared nuclear power.",
      2005: "A devastating earthquake in Kashmir is met with an extraordinary national relief effort.",
      2010: "Communities across the country rally together after historic floods.",
      2017: "Pakistan lifts the ICC Champions Trophy, a landmark cricketing achievement.",
      2018: "A new generation of tech startups begins to put Pakistan on the global innovation map.",
      2020: "Pakistan's youth-led digital and freelance economy accelerates rapidly.",
      2022: "Pakistan hosts major climate-resilience conversations following historic monsoon floods.",
      2025: "A new wave of Pakistani software, design and freelance talent finds global clients.",
      2026: "Pakistan marks 79 years of independence — a story still being written by its people."
    };
    const milestoneYears = Object.keys(milestones).map(Number).sort((a, b) => a - b);
  
    function nearestMilestoneYear(year) {
      let closest = milestoneYears[0];
      for (const y of milestoneYears) {
        if (y <= year) closest = y; else break;
      }
      return closest;
    }
  
    const journeySlider = $("#journeySlider");
    const journeyYearEl = $("#journeyYear");
    const journeyLabelEl = $("#journeyLabel");
    const journeyDescEl = $("#journeyDesc");
  
    function setJourney(year) {
      journeyYearEl.textContent = year;
      const my = nearestMilestoneYear(parseInt(year, 10));
      const isExact = my === parseInt(year, 10);
      journeyLabelEl.textContent = isExact ? "A Milestone Year" : `${my} — Nearest Milestone`;
      journeyDescEl.textContent = milestones[my];
    }
    setJourney(1947);
    journeySlider.addEventListener("input", (e) => setJourney(e.target.value));
  
    /* ---------------------------------------------------------
       GALLERY: build items + lightbox
       Each item now points at a real photo file (img) that you
       place in an "images/gallery/" folder next to index.html.
       If a photo file is missing, the gallery__img keeps its
       CSS fallback tone (see gpt.css) instead of breaking.
       --------------------------------------------------------- */
    const galleryItems = [
      { name: "Minar-e-Pakistan", place: "Lahore", img: "images/gallery/minar-e-pakistan.jpg" },
      { name: "Faisal Mosque", place: "Islamabad", img: "images/gallery/faisal-mosque.jpg" },
      { name: "Pakistan Monument", place: "Islamabad", img: "images/gallery/pakistan-monument.jpg" },
      { name: "Hunza Valley", place: "Gilgit-Baltistan", img: "images/gallery/hunza-valley.jpg" },
      { name: "Badshahi Mosque", place: "Lahore", img: "images/gallery/badshahi-mosque.jpg" },
      { name: "Karachi Coastline", place: "Sindh", img: "images/gallery/karachi-coast.jpg" },
      { name: "Northern Pakistan", place: "Khyber Pakhtunkhwa", img: "images/gallery/swat-valley.jpg" }
    ];
  
    const galleryGrid = $("#galleryGrid");
    galleryItems.forEach((item, i) => {
      const el = document.createElement("div");
      el.className = "gallery__item";
      el.innerHTML = `
        <div class="gallery__img" style="background-image:url('${item.img}')"></div>
        <div class="gallery__overlay"><span class="gallery__title">${item.name}</span></div>
      `;
      el.addEventListener("click", () => openLightbox(item));
      galleryGrid.appendChild(el);
    });
  
    const lightbox = $("#lightbox");
    const lightboxImg = $("#lightboxImg");
    const lightboxCaption = $("#lightboxCaption");
  
    function openLightbox(item) {
      lightboxImg.style.backgroundImage = `url('${item.img}')`;
      lightboxCaption.textContent = `${item.name} — ${item.place}`;
      lightbox.classList.add("open");
    }
    $("#lightboxClose").addEventListener("click", () => lightbox.classList.remove("open"));
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.classList.remove("open"); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") lightbox.classList.remove("open"); });
  
    /* ---------------------------------------------------------
       DID YOU KNOW: random fact machine
       --------------------------------------------------------- */
    const facts = [
      { tag: "History", text: "Pakistan came into being on 14 August 1947, making it one of the youngest nations built on the idea of a shared identity." },
      { tag: "Geography", text: "Pakistan is home to K2, the second-highest peak on Earth, and five of the world's fourteen 8,000-metre giants." },
      { tag: "Symbols", text: "The star and crescent on Pakistan's flag represent progress and light, while green and white stand for the majority and minorities." },
      { tag: "Culture", text: "Pakistan's Indus Valley Civilization at Mohenjo-daro is one of the oldest urban cultures in human history, dating back over 4,500 years." },
      { tag: "Places", text: "The Karakoram Highway, connecting Pakistan and China, is one of the highest paved international roads in the world." },
      { tag: "Achievements", text: "In 1998, Pakistan became the seventh country in the world — and the first Muslim-majority nation — to conduct nuclear tests." },
      { tag: "Culture", text: "Urdu is Pakistan's national language, but the country is home to more than 70 languages spoken across its provinces." },
      { tag: "Geography", text: "Pakistan has coastline along the Arabian Sea, deserts in the south, plains in the centre, and glaciers in the north — all within one country." },
      { tag: "Achievements", text: "Pakistan has won the Cricket World Cup, the T20 World Cup, and the Champions Trophy, becoming a powerhouse of world cricket." },
      { tag: "History", text: "Allama Iqbal, the poet who envisioned Pakistan, is honoured every year on 9 November as Iqbal Day." },
      { tag: "Places", text: "The Faisal Mosque in Islamabad, shaped like a Bedouin tent, was once the largest mosque in the world." },
      { tag: "Symbols", text: "Pakistan's national anthem, 'Qaumi Taranah', is almost entirely in Persianised Urdu and was composed before its lyrics were written." }
    ];
  
    const factTag = $("#factTag");
    const factText = $("#factText");
    const factsCard = $("#factsCard");
    let lastFactIndex = -1;
  
    function showFact() {
      let i = Math.floor(Math.random() * facts.length);
      if (i === lastFactIndex) i = (i + 1) % facts.length;
      lastFactIndex = i;
      const f = facts[i];
      factsCard.style.animation = "none";
      void factsCard.offsetWidth; // reflow to restart animation
      factsCard.style.animation = "";
      factTag.textContent = f.tag;
      factText.textContent = f.text;
    }
    showFact();
    $("#factsBtn").addEventListener("click", showFact);
  
    /* ---------------------------------------------------------
       QUIZ
       --------------------------------------------------------- */
    const quizQuestions = [
      {
        q: "On what date did Pakistan gain independence?",
        options: ["14 August 1947", "15 August 1947", "23 March 1940", "6 September 1965"],
        correct: 0
      },
      {
        q: "Who is known as the founder of Pakistan?",
        options: ["Allama Iqbal", "Liaquat Ali Khan", "Muhammad Ali Jinnah", "Sir Syed Ahmad Khan"],
        correct: 2
      },
      {
        q: "What do the crescent and star on Pakistan's flag represent?",
        options: ["War and peace", "Progress and light", "Trade and wealth", "Rivers and mountains"],
        correct: 1
      },
      {
        q: "The Lahore Resolution, calling for separate states for Muslims, was passed in which year?",
        options: ["1930", "1940", "1947", "1956"],
        correct: 1
      },
      {
        q: "Which mountain, the second-highest in the world, is located in Pakistan?",
        options: ["Everest", "Nanga Parbat", "K2", "Kangchenjunga"],
        correct: 2
      },
      {
        q: "What is Pakistan's national language?",
        options: ["Punjabi", "Urdu", "Pashto", "Sindhi"],
        correct: 1
      },
      {
        q: "In which city was the All-India Muslim League founded in 1906?",
        options: ["Lahore", "Karachi", "Delhi", "Dhaka"],
        correct: 3
      }
    ];
  
    const quizIntro = $("#quizIntro");
    const quizPlay = $("#quizPlay");
    const quizResult = $("#quizResult");
    const quizQuestionEl = $("#quizQuestion");
    const quizOptionsEl = $("#quizOptions");
    const quizCountEl = $("#quizCount");
    const quizProgressFill = $("#quizProgressFill");
    const quizScoreEl = $("#quizScore");
    const quizScoreMsgEl = $("#quizScoreMsg");
  
    let quizIndex = 0;
    let quizScore = 0;
  
    function startQuiz() {
      quizIndex = 0;
      quizScore = 0;
      quizIntro.hidden = true;
      quizResult.hidden = true;
      quizPlay.hidden = false;
      renderQuizQuestion();
    }
  
    function renderQuizQuestion() {
      const q = quizQuestions[quizIndex];
      quizCountEl.textContent = `Question ${quizIndex + 1} / ${quizQuestions.length}`;
      quizProgressFill.style.width = `${(quizIndex / quizQuestions.length) * 100}%`;
      quizQuestionEl.textContent = q.q;
      quizOptionsEl.innerHTML = "";
      q.options.forEach((opt, i) => {
        const btn = document.createElement("button");
        btn.className = "quiz__option";
        btn.textContent = opt;
        btn.addEventListener("click", () => handleQuizAnswer(i, btn));
        quizOptionsEl.appendChild(btn);
      });
    }
  
    function handleQuizAnswer(i, btn) {
      const q = quizQuestions[quizIndex];
      const allBtns = $$(".quiz__option", quizOptionsEl);
      allBtns.forEach(b => b.setAttribute("disabled", "true"));
  
      if (i === q.correct) {
        btn.classList.add("correct");
        quizScore++;
      } else {
        btn.classList.add("wrong");
        allBtns[q.correct].classList.add("correct");
      }
  
      setTimeout(() => {
        quizIndex++;
        if (quizIndex < quizQuestions.length) {
          renderQuizQuestion();
        } else {
          finishQuiz();
        }
      }, 900);
    }
  
    function finishQuiz() {
      quizPlay.hidden = true;
      quizResult.hidden = false;
      quizProgressFill.style.width = "100%";
      animateCounter(quizScoreEl, quizScore, 1000);
      const pct = quizScore / quizQuestions.length;
      let msg;
      if (pct === 1) msg = "Perfect score — a true patriot!";
      else if (pct >= 0.7) msg = "Impressive! You know your country well.";
      else if (pct >= 0.4) msg = "Good effort — a little more history to explore.";
      else msg = "A great starting point to learn more about Pakistan.";
      quizScoreMsgEl.textContent = `${quizScore} / ${quizQuestions.length} — ${msg}`;
    }
  
    $("#quizStartBtn").addEventListener("click", startQuiz);
    $("#quizRestartBtn").addEventListener("click", startQuiz);
  
    /* ---------------------------------------------------------
       Init sizes on load (ensures canvases match final layout)
       --------------------------------------------------------- */
    window.addEventListener("load", () => {
      sizeHero();
    });
  
  })();