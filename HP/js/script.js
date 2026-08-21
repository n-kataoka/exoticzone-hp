document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  const heroBg = document.querySelector(".hero-bg");
  const parallaxEls = document.querySelectorAll(".parallax-slow");

  /* ---------- Header scroll state + hero parallax ---------- */
  function updateParallax() {
    if (heroBg) {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.18}px)`;
    }
    const viewportCenter = window.innerHeight / 2;
    parallaxEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - viewportCenter) * 0.08;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    updateParallax();
  }
  onScroll();
  window.addEventListener("scroll", onScroll);

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenis.on("scroll", onScroll);
  }

  /* ---------- Mobile nav ---------- */
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("open");
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.classList.remove("open");
        nav.classList.remove("open");
      });
    });
  }

  /* ---------- Smooth anchor links (works with Lenis) ---------- */
  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const url = new URL(link.href);
      if (url.pathname === window.location.pathname && url.hash) {
        const target = document.querySelector(url.hash);
        if (target) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(target, { offset: -80 });
          } else {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
    });
  });

  /* ---------- Contact form ---------- */
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('input[type="text"]').value.trim();
      const email = contactForm.querySelector('input[type="email"]').value.trim();
      const tel = contactForm.querySelector('input[type="tel"]').value.trim();
      const inquiryType = contactForm.querySelector('input[name="inquiry-type"]:checked')?.value || "";
      const knownVia = Array.from(
        contactForm.querySelectorAll('.checkbox-group input[type="checkbox"]:checked')
      )
        .map((cb) => cb.value)
        .join("、");
      const message = contactForm.querySelector("textarea").value.trim();
      const fileInput = contactForm.querySelector('input[type="file"]');
      const hasFile = fileInput && fileInput.files.length > 0;

      const bodyLines = [
        `お名前: ${name}`,
        `メールアドレス: ${email}`,
        `電話番号: ${tel || "未入力"}`,
        `お問い合わせの種類: ${inquiryType}`,
        `当サービスを知ったきっかけ: ${knownVia || "未選択"}`,
        "",
        "お問い合わせ内容:",
        message || "(未入力)",
      ];

      if (hasFile) {
        bodyLines.push(
          "",
          `※添付ファイル「${fileInput.files[0].name}」はこのメールに自動で添付されません。開くメール作成画面にお手数ですが手動で添付してください。`
        );
      }

      const to = "tomori_yoichi@torihada.co.jp,info.exzo@torihada.co.jp";
      const subject = `【Exotic Zone お問い合わせ】${inquiryType}`;
      const body = bodyLines.join("\n");
      const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (hasFile) {
        alert(
          `添付ファイル「${fileInput.files[0].name}」はメールに自動で添付されません。開くメール作成画面に手動で添付してください。`
        );
      }

      window.location.href = mailtoUrl;
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -80px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Count-up numbers ---------- */
  const countEls = document.querySelectorAll(".count-up");
  if (countEls.length) {
    const countIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          countIo.unobserve(entry.target);
          const el = entry.target;
          const target = parseInt(el.dataset.target, 10) || 0;
          const duration = 1200;
          const start = performance.now();
          const tickCount = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(tickCount);
          };
          requestAnimationFrame(tickCount);
        });
      },
      { threshold: 0.4 }
    );
    countEls.forEach((el) => countIo.observe(el));
  }

  /* ---------- Cursor spotlight ---------- */
  const spotlight = document.querySelector(".cursor-spotlight");
  if (spotlight && window.matchMedia("(hover: hover)").matches) {
    let sx = 0, sy = 0;
    window.addEventListener("mousemove", (e) => {
      sx = e.clientX;
      sy = e.clientY;
      spotlight.classList.add("active");
      spotlight.style.transform = `translate3d(${sx}px, ${sy}px, 0)`;
    });
    window.addEventListener("mouseleave", () => spotlight.classList.remove("active"));
  }

  /* ---------- Magnetic buttons ---------- */
  document.querySelectorAll(".magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.25}px)`;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });

  /* ---------- Opening loader ---------- */
  const loader = document.querySelector(".loader");
  if (loader) {
    const alreadyPlayed = sessionStorage.getItem("exzo-op-played");
    if (alreadyPlayed) {
      loader.remove();
    } else {
      const countEl = loader.querySelector(".loader-count");
      const duration = 1400;
      const start = performance.now();

      const finishLoader = () => {
        sessionStorage.setItem("exzo-op-played", "1");
        setTimeout(() => {
          loader.classList.add("loader-hidden");
          setTimeout(() => loader.remove(), 1000);
        }, 250);
      };

      const tickLoader = (now) => {
        const elapsed = now - start;
        const progress = Math.min(100, Math.round((elapsed / duration) * 100));
        if (countEl) countEl.textContent = progress;
        if (progress < 100) {
          requestAnimationFrame(tickLoader);
        } else {
          finishLoader();
        }
      };
      requestAnimationFrame(tickLoader);
    }
  }
});
