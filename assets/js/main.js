// NEBULA site — starfield, reveals, interface switcher, lightbox

(function () {
  "use strict";

  /* ---------- starfield (hero) ---------- */
  var canvas = document.getElementById("starfield");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var stars = [], meteors = [], W = 0, H = 0, raf;

    function resize() {
      W = canvas.width = canvas.offsetWidth * devicePixelRatio;
      H = canvas.height = canvas.offsetHeight * devicePixelRatio;
      var count = Math.min(220, Math.floor(W * H / 9000));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: (Math.random() * 1.1 + 0.3) * devicePixelRatio,
          p: Math.random() * Math.PI * 2,
          s: 0.4 + Math.random() * 1.2 // twinkle speed
        });
      }
    }

    function spawnMeteor() {
      meteors.push({
        x: Math.random() * W * 0.7 + W * 0.3,
        y: Math.random() * H * 0.3,
        vx: -(4 + Math.random() * 4) * devicePixelRatio,
        vy: (2 + Math.random() * 2) * devicePixelRatio,
        life: 1
      });
      setTimeout(spawnMeteor, 6000 + Math.random() * 9000);
    }

    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      var i, s;
      for (i = 0; i < stars.length; i++) {
        s = stars[i];
        var a = 0.25 + 0.6 * Math.abs(Math.sin(s.p + t * 0.001 * s.s));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(200, 235, 255, " + a.toFixed(3) + ")";
        ctx.fill();
      }
      for (i = meteors.length - 1; i >= 0; i--) {
        var m = meteors[i];
        m.x += m.vx; m.y += m.vy; m.life -= 0.012;
        if (m.life <= 0 || m.x < -80 || m.y > H + 80) { meteors.splice(i, 1); continue; }
        var tail = 14 * devicePixelRatio;
        var grad = ctx.createLinearGradient(m.x, m.y, m.x + m.vx / 5 * tail, m.y + m.vy / 5 * tail);
        grad.addColorStop(0, "rgba(180, 240, 220, " + (0.8 * m.life).toFixed(3) + ")");
        grad.addColorStop(1, "rgba(180, 240, 220, 0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x + m.vx / 5 * tail, m.y + m.vy / 5 * tail);
        ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    }

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    resize();
    if (reduce) {
      draw(0); cancelAnimationFrame(raf); // static frame
    } else {
      raf = requestAnimationFrame(draw);
      setTimeout(spawnMeteor, 3500);
    }
    window.addEventListener("resize", function () {
      resize();
      if (reduce) { draw(0); cancelAnimationFrame(raf); }
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- interface screenshot switcher ---------- */
  var mainImg = document.getElementById("interface-main");
  var mainCap = document.getElementById("interface-caption");
  var thumbs = document.querySelectorAll(".thumb");
  thumbs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      thumbs.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      mainImg.style.opacity = "0";
      setTimeout(function () {
        mainImg.src = btn.dataset.src;
        mainImg.alt = btn.dataset.caption;
        mainCap.textContent = btn.dataset.caption;
        mainImg.style.transition = "opacity .3s";
        mainImg.style.opacity = "1";
      }, 160);
    });
  });

  /* ---------- lightbox ---------- */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lb-img");
  var lbCap = document.getElementById("lb-caption");
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
  var current = 0;

  function openLb(idx) {
    current = idx;
    var a = items[idx];
    lbImg.src = a.getAttribute("href");
    lbImg.alt = a.dataset.lightbox;
    lbCap.textContent = a.dataset.lightbox + "  ·  " + (idx + 1) + " / " + items.length;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = "";
  }
  function step(d) {
    openLb((current + d + items.length) % items.length);
  }

  items.forEach(function (a, i) {
    a.addEventListener("click", function (ev) {
      ev.preventDefault();
      openLb(i);
    });
  });
  document.getElementById("lb-close").addEventListener("click", closeLb);
  document.getElementById("lb-prev").addEventListener("click", function () { step(-1); });
  document.getElementById("lb-next").addEventListener("click", function () { step(1); });
  lb.addEventListener("click", function (ev) { if (ev.target === lb) closeLb(); });
  document.addEventListener("keydown", function (ev) {
    if (lb.hidden) return;
    if (ev.key === "Escape") closeLb();
    if (ev.key === "ArrowLeft") step(-1);
    if (ev.key === "ArrowRight") step(1);
  });
})();
