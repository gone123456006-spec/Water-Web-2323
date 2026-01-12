/* =====================================================
   PAGE LOADER
===================================================== */
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (!loader) return;

  setTimeout(() => {
    loader.style.opacity = "0";
    loader.style.pointerEvents = "none";
  }, 800);
});

/* =====================================================
   NAVBAR + MOBILE MENU
===================================================== */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    menuBtn.classList.toggle("active");
    navLinks.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
      menuBtn.classList.remove("active");
      navLinks.classList.remove("active");
      document.body.classList.remove("menu-open");
    });
  });
}

/* =====================================================
   SCROLL REVEAL (CARDS + GALLERY)
===================================================== */
const revealItems = document.querySelectorAll(".card, .img-box");

if (revealItems.length) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  revealItems.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "0.6s ease";
    revealObserver.observe(el);
  });
}

/* =====================================================
   GENERIC SCROLL ANIMATION (.animate)
===================================================== */
const animatedItems = document.querySelectorAll(".animate");

let qualityRatingStarted = false;

function startQualityRating(){
  if (qualityRatingStarted) return;
  const scoreEl = document.getElementById("qualityRatingScore");
  const starsFill = document.getElementById("qualityStarsFill");
  if (!scoreEl || !starsFill) return;

  qualityRatingStarted = true;
  const start = 4.6;
  const end = 5.0;
  const duration = 900;
  const startTime = performance.now();

  function tick(now){
    const t = Math.min(1, (now - startTime)/duration);
    const value = start + (end - start)*t;
    scoreEl.textContent = value.toFixed(1);
    starsFill.style.width = `${t*100}%`;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if (animatedItems.length) {
  const animObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        if (entry.target.id === "quality") {
          startQualityRating();
        }
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  animatedItems.forEach((el, i) => {
    el.style.setProperty("--i", i);
    animObserver.observe(el);
  });
}

/* =====================================================
   PARALLAX BOTTLE EFFECT
===================================================== */
const bottle = document.getElementById("bottle");
const bottleWrap = document.getElementById("bottleWrap");

if (bottle && bottleWrap) {
  bottleWrap.addEventListener("mousemove", e => {
    const r = bottleWrap.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const rx = ((y / r.height) - 0.5) * -18;
    const ry = ((x / r.width) - 0.5) * 18;

    bottle.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-10px)`;
  });

  bottleWrap.addEventListener("mouseleave", () => {
    bottle.style.transform = "rotateX(0) rotateY(0) translateY(0)";
  });
}

/* =====================================================
   WATER SPLASH PARTICLES
===================================================== */
const splashBox = document.querySelector(".splashes");

if (splashBox) {
  setInterval(() => {
    const splash = document.createElement("span");
    splash.className = "splash";

    splash.style.left = "50%";
    splash.style.top = "50%";
    splash.style.setProperty("--x", `${Math.random() * 120 - 60}px`);
    splash.style.setProperty("--y", `${Math.random() * -140}px`);

    splashBox.appendChild(splash);
    setTimeout(() => splash.remove(), 1200);
  }, 250);
}

/* =====================================================
   NAVBAR SHADOW ON SCROLL
===================================================== */
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (!navbar) return;
  navbar.style.boxShadow =
    window.scrollY > 10 ? "0 6px 20px rgba(0,0,0,.12)" : "none";
});

/* =====================================================
   FLOATING BUTTON – HIDE ON SCROLL DOWN
===================================================== */
const floatBox = document.getElementById("floatBox");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  if (!floatBox) return;

  if (window.scrollY > lastScrollY && window.scrollY > 200) {
    floatBox.classList.add("hide");
  } else {
    floatBox.classList.remove("hide");
  }
  lastScrollY = window.scrollY;
});



/* =====================================================
   WHATSAPP AUTO MESSAGE + ADDRESS (SAFE VERSION)
===================================================== */
const whatsappBtn = document.getElementById("whatsappBtn");
const phoneNumber = "918974668938"; // change if needed

if (whatsappBtn) {
  whatsappBtn.addEventListener("click", (e) => {
    e.preventDefault();

    /* Get name */
    let customerName = localStorage.getItem("customerName");
    if (!customerName) {
      customerName = prompt("Please enter your name:");
      if (!customerName) return;
      localStorage.setItem("customerName", customerName);
    }

    /* Greeting */
    const hour = new Date().getHours();
    const greeting =
      hour < 12 ? "Good Morning" :
      hour < 18 ? "Good Afternoon" :
      "Good Evening";

    /* Location text default */
    let locationText = "Address: Not shared";

    /* SAFE GEOLOCATION */
    if (location.protocol === "https:" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude.toFixed(6);
          const lng = pos.coords.longitude.toFixed(6);
          locationText = `Live Location: https://www.google.com/maps?q=${lat},${lng}`;
          sendWhatsAppMessage(greeting, customerName, locationText);
        },
        () => {
          sendWhatsAppMessage(greeting, customerName, locationText);
        },
        { timeout: 6000 }
      );
    } else {
      sendWhatsAppMessage(greeting, customerName, locationText);
    }
  });
}

/* SEND MESSAGE FUNCTION */
function sendWhatsAppMessage(greeting, name, locationText) {
  const message = `
${greeting},

My name is ${name}.
I would like to place an order for packaged drinking water.

${locationText}

Please contact me with price and delivery details.
Thank you.
  `.trim();

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/918974668938?text=${encoded}`, "_blank");
}

/* =====================================================
   BUSINESS / BULK ENQUIRY – MODAL POPUP
===================================================== */
const businessModal = document.getElementById("businessModal");
const businessTrigger = document.getElementById("businessTrigger");
const businessForm = document.getElementById("businessForm");
const modalClose = businessModal ? businessModal.querySelector(".modal-close") : null;
const modalBackdrop = businessModal ? businessModal.querySelector(".modal-backdrop") : null;

// Open Modal Function
function openBusinessModal() {
  if (businessModal) {
    businessModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

// Close Modal Function
function closeBusinessModal() {
  if (businessModal) {
    businessModal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

// Trigger Button Click
if (businessTrigger) {
  businessTrigger.addEventListener("click", openBusinessModal);
}

// Close Button Click
if (modalClose) {
  modalClose.addEventListener("click", closeBusinessModal);
}

// Backdrop Click
if (modalBackdrop) {
  modalBackdrop.addEventListener("click", closeBusinessModal);
}

// Escape Key to Close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && businessModal && businessModal.classList.contains("open")) {
    closeBusinessModal();
  }
});

// Auto-open Modal on Page Load (after delay)
window.addEventListener("load", () => {
  // Wait for page loader to finish, then show modal after 2 seconds
  setTimeout(() => {
    // Check if modal was already shown today (optional - can be removed if you want it to show every time)
    const lastShown = localStorage.getItem("businessModalLastShown");
    const today = new Date().toDateString();
    
    // Uncomment the next 3 lines if you want it to show only once per day
    // if (lastShown === today) return;
    // localStorage.setItem("businessModalLastShown", today);
    
    openBusinessModal();
  }, 2000); // 2 second delay after page load
});

// Form Submit Handler
if (businessForm) {
  businessForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(businessForm);
    const name = formData.get("name") || "";
    const phone = formData.get("phone") || "";
    const type = formData.get("type") || "";
    const req = formData.get("requirement") || "";
    const area = formData.get("area") || "";
    const notes = formData.get("notes") || "";

    const lines = [
      "Business / Bulk Water Enquiry",
      "",
      `Name: ${name}`,
      `Mobile: ${phone}`,
      type ? `Business Type: ${type}` : "",
      req ? `Approx. Requirement: ${req}` : "",
      area ? `Area / Address: ${area}` : "",
      notes ? `Notes: ${notes}` : "",
      "",
      "Please contact me with plans and pricing."
    ].filter(Boolean);

    const msg = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/918974668938?text=${msg}`, "_blank");
    
    // Close modal and reset form after submission
    setTimeout(() => {
      closeBusinessModal();
      businessForm.reset();
    }, 500);
  });
}


/* ===============================
   CANVAS SETUP
================================ */
const canvas = document.getElementById("bubbleCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

function resize(){
  if (!canvas) return;
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
if (canvas){
  resize();
  window.addEventListener("resize", resize);
}

/* ===============================
   BOTTLE CENTER (EMISSION POINT)
   Adjust X/Y to align with bottle
================================ */
let bottleX = () => canvas ? canvas.width * 0.55 : 0;
let bottleY = () => canvas ? canvas.height * 0.78 : 0;

/* ===============================
   BUBBLE CLASS
================================ */
class Bubble{
  constructor(x,y){
    this.x = x + (Math.random()*30 - 15);
    this.y = y;
    this.radius = Math.random()*40 + 6;   // BIG + SMALL
    this.speed = Math.random()*0.6 + 0.4;
    this.wobble = Math.random()*2;
    this.life = 1;
    this.opacity = Math.random()*0.6 + 0.4;
  }

  update(){
    this.y -= this.speed;
    this.x += Math.sin(Date.now()*0.002 + this.wobble) * 0.4;

    // Bubble pop near top
    if(this.y < canvas.height * 0.15){
      this.life -= 0.05;
    }

    if(this.life < 0) this.dead = true;
  }

  draw(){
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius*this.life, 0, Math.PI*2);
    ctx.fillStyle = `rgba(180,230,255,${this.opacity*this.life})`;
    ctx.fill();
  }
}

/* ===============================
   BUBBLE SYSTEM
================================ */
const bubbles = [];

function emitBubble(){
  if(!canvas || !ctx) return;
  if(bubbles.length < 120){
    bubbles.push(new Bubble(bottleX(), bottleY()));
  }
}

/* ===============================
   MOUSE DISTURBANCE
================================ */
if (canvas){
  let mouse = {x:0,y:0};

  canvas.addEventListener("mousemove", e=>{
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    bubbles.forEach(b=>{
      const dx = b.x - mouse.x;
      const dy = b.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if(dist < 120){
        b.x += dx * 0.03;
        b.y += dy * 0.03;
      }
    });
  });
}

/* ===============================
   ANIMATION LOOP
================================ */
function animate(){
  if (canvas && ctx){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    emitBubble();

    bubbles.forEach((b,i)=>{
      b.update();
      b.draw();
      if(b.dead) bubbles.splice(i,1);
    });
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

/* =====================================================
   GALLERY LIGHTBOX
===================================================== */
const lightbox = document.getElementById("galleryLightbox");
const lightboxImg = lightbox ? lightbox.querySelector("img") : null;
const lightboxCaption = lightbox ? lightbox.querySelector(".lightbox-caption") : null;
const lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;
const lightboxBackdrop = lightbox ? lightbox.querySelector(".lightbox-backdrop") : null;

if (lightbox && lightboxImg && lightboxCaption){
  document.querySelectorAll(".gallery .img-box img").forEach((img) => {
    img.style.cursor = "pointer";
    img.addEventListener("click", () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "";
      lightboxCaption.textContent = img.dataset.caption || img.alt || "";
      lightbox.classList.add("open");
    });
  });

  const closeLightbox = () => lightbox.classList.remove("open");

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLightbox();
  });
}

/* =====================================================
   GALLERY FILTER BUTTONS
===================================================== */
const filterButtons = document.querySelectorAll(".gallery-filter-btn");
const galleryItems = document.querySelectorAll(".gallery .img-box");

if (filterButtons.length && galleryItems.length){
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const value = btn.dataset.filter || "all";

      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      galleryItems.forEach(box => {
        const type = box.dataset.type || "all";
        const show = value === "all" || value === type;
        box.style.display = show ? "block" : "none";
      });
    });
  });
}

/* =====================================================
   MULTI-LANGUAGE (EN / HI)
===================================================== */
const translations = {
  hi: {
    nav_home: "होम",
    nav_products: "प्रोडक्ट्स",
    nav_quality: "क्वालिटी",
    nav_reviews: "रिव्यू",
    nav_faq: "प्रश्नोत्तर",
    nav_contact: "संपर्क",

    products_title: "हमारे प्रोडक्ट्स",
    products_subtitle: "शुद्ध • स्वच्छ • किफायती पैकेज्ड ड्रिंकिंग वाटर",
    prod_20l_title: "20 लीटर जार",
    prod_20l_desc: "घर और ऑफिस के लिए बेहतर",
    prod_10l_title: "10 लीटर जार",
    prod_10l_desc: "रीफिल के लिए उपलब्ध",
    prod_1l_title: "1 लीटर बोतल",
    prod_1l_desc: "यात्रा और रोज़ाना उपयोग के लिए",
    prod_500_title: "500 ml बोतल",
    prod_500_desc: "इवेंट और डेली यूज़ के लिए",
    btn_order_now: "अभी ऑर्डर करें",

    quality_title: "क्वालिटी और सर्टिफिकेशन",
    quality_subtitle: "हर जार आपके पास पहुँचने से पहले कई सेफ्टी चेक से गुजरता है।",
    quality_ai_score: "AI क्वालिटी स्कोर",

    reviews_title: "हमारे ग्राहकों की राय",
    reviews_subtitle: "मुज़फ्फरपुर के घरों, दुकानों और ऑफ़िसों की पसंद।",

    faq_title: "अक्सर पूछे जाने वाले सवाल",

    business_title: "बिज़नेस / बल्क इंक्वायरी",
    business_subtitle: "अपनी ज़रूरत शेयर करें, हम आपके लिए बेस्ट प्लान सजेस्ट करेंगे।",

    contact_title: "संपर्क करें",
    contact_tagline: "बस एक कॉल या मैसेज की दूरी पर।",
    contact_sub: "नए जार ऑर्डर करने, रीफिल शेड्यूल करने या कोई भी सवाल पूछने के लिए संपर्क करें – हमारी टीम आमतौर पर कार्य समय में 5–10 मिनट के अंदर जवाब देती है।",

    service_area_title: "सर्विस एरिया और टाइमिंग",
    service_time_text: "डेली डिलीवरी • सुबह 7:00 बजे – रात 8:00 बजे",
    area_musahri: "मुशहरी",
    area_muzaffarpur: "मुज़फ्फरपुर सिटी",
    area_brahmpura: "ब्रह्मपुरा",
    area_ahiyapur: "अहियापुर",
    area_more: "नज़दीकी इलाक़े (रिक्वेस्ट पर)"
  }
};

const langButtons = document.querySelectorAll(".lang-btn");
const i18nNodes = document.querySelectorAll("[data-i18n]");

const defaultLang = localStorage.getItem("preferredLang") || "en";

function setLanguage(lang){
  document.documentElement.setAttribute("lang", lang);
  localStorage.setItem("preferredLang", lang);

  langButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });

  if (lang === "en") {
    // Reset to English (original text)
    i18nNodes.forEach(node => {
      const key = node.getAttribute("data-i18n");
      const original = node.getAttribute("data-original") || node.textContent;
      if (!node.hasAttribute("data-original")) {
        node.setAttribute("data-original", original);
      }
      node.textContent = node.getAttribute("data-original");
    });
    return;
  }

  const dict = translations[lang];
  if (!dict) return;

  i18nNodes.forEach(node => {
    const key = node.getAttribute("data-i18n");
    if (!node.hasAttribute("data-original")) {
      node.setAttribute("data-original", node.textContent);
    }
    if (dict[key]){
      node.textContent = dict[key];
    }
  });
}

// Initialize language on page load
if (defaultLang !== "en") {
  setLanguage(defaultLang);
}

if (langButtons.length){
  langButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      setLanguage(btn.dataset.lang || "en");
    });
  });
}

/* ===============================
   ABOUT SECTION - STATS COUNTER
===================================================== */
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M+';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K+';
  } else if (num % 1 === 0) {
    return num.toString();
  } else {
    return num.toFixed(1);
  }
}

function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = formatNumber(current);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = formatNumber(target);
    }
  };

  updateCounter();
}

// Observe stats section for counter animation
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      statNumbers.forEach(stat => {
        const target = parseFloat(stat.dataset.count);
        if (target && !stat.classList.contains('counted')) {
          stat.classList.add('counted');
          animateCounter(stat, target, 2000);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const aboutSection = document.getElementById('about');
if (aboutSection) {
  statsObserver.observe(aboutSection);
}
