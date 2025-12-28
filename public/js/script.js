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

if (animatedItems.length) {
  const animObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
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

