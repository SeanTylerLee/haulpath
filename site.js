(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const drawer = document.getElementById("nav-drawer");
  const overlay = document.getElementById("nav-overlay");

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    if (drawer) drawer.hidden = !open;
    if (overlay) overlay.setAttribute("aria-hidden", open ? "false" : "true");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!document.body.classList.contains("menu-open"));
    });
  }
  if (overlay) overlay.addEventListener("click", function () { setMenu(false); });
  if (drawer) {
    drawer.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });

  function onScroll() {
    if (header) header.classList.toggle("is-compact", window.scrollY > 8);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024) setMenu(false);
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var numbers = document.querySelectorAll("[data-count]");
  if (numbers.length) {
    var animate = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      if (reduceMotion) {
        el.textContent = String(target);
        return;
      }
      var start = performance.now();
      var duration = 1100;
      var tick = function (now) {
        var t = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animate(entry.target);
          io.unobserve(entry.target);
        });
      }, { threshold: 0.45 });
      numbers.forEach(function (el) { io.observe(el); });
    } else {
      numbers.forEach(animate);
    }
  }
})();
