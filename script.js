// =========================================
// 0. CONFIG SITIO (doctor, WhatsApp, etc.)
// =========================================
const SITE = {
  doctorFullName: "Dr. Jorge Daniel Sierra Lara Martínez",
  doctorShortName: "Dr. Sierra",
  whatsappPhone: "525591997174", // +52 55 9199 7174
}

// =========================================
// 1. CONFIGURACIÓN GENERAL Y UTILIDADES
// =========================================

// Theme Toggle
const themeToggle = document.getElementById("themeToggle")
const html = document.documentElement

// Check for saved theme preference or default to light
const savedTheme = localStorage.getItem("theme") || "light"
html.setAttribute("data-theme", savedTheme)

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme")
    const newTheme = currentTheme === "light" ? "dark" : "light"
    html.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
  })
}

// Language Toggle
const langToggle = document.getElementById("langToggle")
let currentLang = "es"

// Initialize placeholders for default language
document.querySelectorAll("[data-es-placeholder][data-en-placeholder]").forEach((el) => {
  el.setAttribute("placeholder", el.getAttribute(`data-${currentLang}-placeholder`))
})

if (langToggle) {
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "es" ? "en" : "es"
    langToggle.textContent = currentLang === "es" ? "EN" : "ES"

    // Update all translatable elements
    document.querySelectorAll("[data-es][data-en]").forEach((el) => {
      el.textContent = el.getAttribute(`data-${currentLang}`)
    })

    // Update translatable placeholders
    document.querySelectorAll("[data-es-placeholder][data-en-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", el.getAttribute(`data-${currentLang}-placeholder`))
    })

    // Update HTML lang attribute
    document.documentElement.lang = currentLang
  })
}

// =========================================
// 2. MENÚ MÓVIL (Overlay Premium)
// =========================================
const menuToggle = document.getElementById("menuToggle")
const nav = document.getElementById("nav")
const menuCloseBtn = document.getElementById("menuCloseBtn")

function closeMenu() {
  if (menuToggle) menuToggle.classList.remove("active")
  if (nav) nav.classList.remove("mobile-open")
  document.body.style.overflow = ""
}

if (menuToggle && nav) {
  // Abrir menú
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("mobile-open")
    menuToggle.classList.toggle("active", isOpen)
    document.body.style.overflow = isOpen ? "hidden" : ""
  })

  // Cerrar al hacer clic en un enlace
  nav.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", closeMenu)
  })

  // Cerrar con el botón X
  if (menuCloseBtn) {
    menuCloseBtn.addEventListener("click", closeMenu)
  }
}

// =========================================
// 3. INTERACCIONES UI (FAQ, Scroll, Forms)
// =========================================

// FAQ Accordion
const faqItems = document.querySelectorAll(".faq-item")
faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question")
  if (question) {
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active")
      faqItems.forEach((faq) => faq.classList.remove("active"))
      if (!isActive) item.classList.add("active")
    })
  }
})

// Fade-in Animation on Scroll
const observerOptions = { root: null, rootMargin: "0px", threshold: 0.1 }
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el))

// Header scroll effect
const header = document.getElementById("header")
if (header) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) header.classList.add("scrolled")
    else header.classList.remove("scrolled")
  })
}

// Set current year in footer
const yearSpan = document.getElementById("currentYear")
if (yearSpan) yearSpan.textContent = new Date().getFullYear()

// Contact form (demo)
const contactForm = document.getElementById("contactForm")
if (contactForm) {
  const contactNote = document.getElementById("contactFormNote")
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const required = contactForm.querySelectorAll("[required]")
    let ok = true
    required.forEach((el) => {
      if (!String(el.value || "").trim()) ok = false
    })

    if (!ok) {
      if (contactNote) {
        contactNote.textContent =
          currentLang === "es"
            ? "Por favor completa los campos obligatorios."
            : "Please fill in all required fields."
      }
      return
    }

    if (contactNote) {
      contactNote.textContent =
        currentLang === "es"
          ? "¡Listo! Tu solicitud fue registrada (demo). Podemos conectarlo a Formspree/EmailJS/tu backend."
          : "Done! Your request was captured (demo). We can connect it to Formspree/EmailJS/your backend."
    }

    contactForm.reset()

    // restore placeholders according to current language after reset
    document.querySelectorAll("[data-es-placeholder][data-en-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", el.getAttribute(`data-${currentLang}-placeholder`))
    })
  })

  contactForm.addEventListener("reset", () => {
    const contactNote = document.getElementById("contactFormNote")
    if (contactNote) {
      contactNote.textContent =
        contactNote.getAttribute(`data-${currentLang}`) || contactNote.textContent
    }
  })
}

/* =============================
   Smooth anchor scroll (with header offset)
   ============================= */
;(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  function getHeaderOffset() {
    const headerEl = document.getElementById("header")
    if (!headerEl) return 0
    const rect = headerEl.getBoundingClientRect()
    return Math.ceil(rect.height)
  }

  function smoothScrollTo(hash) {
    const target = document.querySelector(hash)
    if (!target) return
    const extra = hash === "#about" ? 100 : 0
    const y = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset() - 12 + extra
    window.scrollTo({ top: y, behavior: reduceMotion ? "auto" : "smooth" })
  }

  document.addEventListener("click", (e) => {
    const a = e.target?.closest?.('a[href^="#"]')
    if (!a) return
    const href = a.getAttribute("href")
    if (!href || href === "#") return
    const target = document.querySelector(href)
    if (!target) return
    e.preventDefault()
    history.pushState(null, "", href)
    smoothScrollTo(href)
  })
})()

/* =============================
   Hero photo -> About photo (scroll-linked)
   FIX: Histeresis para evitar “rebote” con scroll-up pequeño
   ============================= */
;(() => {
  const heroImg = document.getElementById("heroPhoto")
  const aboutImg = document.getElementById("aboutPhoto")
  if (!heroImg || !aboutImg) return

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduceMotion) return

  // Elemento flotante
  const float = document.createElement("img")
  float.className = "photo-float"
  float.alt = heroImg.alt || ""
  float.src = heroImg.currentSrc || heroImg.src
  float.decoding = "async"
  float.loading = "eager"
  float.hidden = true
  document.body.appendChild(float)

  let raf = 0
  let mode = "hero" // "hero" | "transition" | "about"

  function isMobile() {
    return (
      window.matchMedia("(max-width: 1024px)").matches ||
      window.matchMedia("(hover: none) and (pointer: coarse)").matches
    )
  }

  function rectDoc(el) {
    const r = el.getBoundingClientRect()
    return { left: r.left + window.scrollX, top: r.top + window.scrollY, width: r.width, height: r.height }
  }

  function clamp01(x) {
    return Math.max(0, Math.min(1, x))
  }

  function resetToHero() {
    mode = "hero"
    float.hidden = true
    heroImg.style.opacity = ""
    aboutImg.style.opacity = "0"
  }

  function resetToAbout() {
    mode = "about"
    float.hidden = true
    heroImg.style.opacity = "0"
    aboutImg.style.opacity = ""
  }

  function enterTransition() {
    if (mode === "transition") return
    mode = "transition"
    heroImg.style.opacity = "0"
    aboutImg.style.opacity = "0"
    float.hidden = false
  }

  // “colchón” para que no cambie por micro scroll
  const ENTER_PAD = 0.08 // desde hero: necesitas avanzar ~8% para entrar transición
  const LEAVE_FROM_END = 0.92 // desde about: necesitas bajar de 92% para re-entrar transición

  function onFrame() {
    raf = 0

    if (isMobile()) {
      // En móvil: sin efecto
      float.hidden = true
      heroImg.style.opacity = ""
      aboutImg.style.opacity = ""
      mode = "hero"
      return
    }

    const heroSection = document.getElementById("hero")
    const aboutSection = document.getElementById("about")
    if (!heroSection || !aboutSection) return

    const start = heroSection.offsetTop
    const end = aboutSection.offsetTop - 200

    const raw = (window.scrollY - start) / Math.max(1, end - start)
    const p = clamp01(raw)

    // Estados con histeresis
    if (mode === "hero") {
      if (p > ENTER_PAD) enterTransition()
      else {
        // asegurar estado hero
        resetToHero()
        return
      }
    }

    if (mode === "about") {
      if (p < LEAVE_FROM_END) enterTransition()
      else {
        // asegurar estado about
        resetToAbout()
        return
      }
    }

    // mode === "transition"
    if (p <= 0) {
      resetToHero()
      return
    }
    if (p >= 1) {
      resetToAbout()
      return
    }

    // Interpolación
    const a = rectDoc(heroImg)
    const b = rectDoc(aboutImg)
    const lerp = (x, y, t) => x + (y - x) * t

    const left = lerp(a.left, b.left, p)
    const top = lerp(a.top, b.top, p)
    const width = lerp(a.width, b.width, p)
    const height = lerp(a.height, b.height, p)

    float.style.left = left - window.scrollX + "px"
    float.style.top = top - window.scrollY + "px"
    float.style.width = width + "px"
    float.style.height = height + "px"

    const scale = 1 - 0.06 * p
    float.style.transform = `scale(${scale})`
  }

  function request() {
    if (raf) return
    raf = requestAnimationFrame(onFrame)
  }

  window.addEventListener("scroll", request, { passive: true })
  window.addEventListener("resize", request)
  window.addEventListener("load", () => {
    float.src = heroImg.currentSrc || heroImg.src
    request()
  })
})()

/* =============================
   Credenciales: desktop preview panel (v2)
   ============================= */
;(() => {
  const section = document.getElementById("credentials")
  if (!section) return

  const list = section.querySelector(".cred-ui__list")
  const items = Array.from(section.querySelectorAll(".cred-ui__item"))
  if (!items.length) return

  const img = section.querySelector("#credPreviewImg")
  const titleEl = section.querySelector("#credPreviewTitle")
  const metaEl = section.querySelector("#credPreviewMeta")
  const ph = section.querySelector("#credPreviewPlaceholder")
  const phMsg = section.querySelector("#credPreviewMsg") || ph?.querySelector("p") || null
  const loading = section.querySelector("#credPreviewLoading")
  const openLink = section.querySelector("#credPreviewOpen")

  const search = section.querySelector("#credSearch")
  const clearBtn = section.querySelector("#credSearchClear")
  const countEl = section.querySelector("#credSearchCount")

  const modal = document.getElementById("credModal")
  const modalImg = document.getElementById("credModalImg")
  const modalTitle = document.getElementById("credModalTitle")
  const modalMeta = document.getElementById("credModalMeta")
  const modalOpen = document.getElementById("credModalOpen")
  const modalClose = document.getElementById("credModalClose")

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

  let activeBtn = null
  let loadToken = 0
  const loadedSrc = new Set()

  const MSG = {
    select: {
      es: "Selecciona una credencial para ver su documento aquí.",
      en: "Select a credential to preview its document here.",
    },
    nodoc: {
      es: "Documento no disponible para esta credencial.",
      en: "Document not available for this credential.",
    },
    error: {
      es: "No se pudo cargar el documento. Intenta abrirlo en una pestaña.",
      en: "Could not load the document. Try opening it in a new tab.",
    },
    noresults: {
      es: "No hay resultados con esa búsqueda.",
      en: "No results for that search.",
    },
  }

  function getLang() {
    return typeof currentLang !== "undefined" ? currentLang : document.documentElement.lang || "es"
  }

  function setPhMessage(key) {
    if (!phMsg || !MSG[key]) return
    phMsg.setAttribute("data-es", MSG[key].es)
    phMsg.setAttribute("data-en", MSG[key].en)
    phMsg.textContent = getLang() === "en" ? MSG[key].en : MSG[key].es
  }

  function pickText(btn, key) {
    const lang = getLang()
    const ds = btn.dataset
    if (key === "title") return lang === "en" ? ds.titleEn || ds.titleEs || "" : ds.titleEs || ds.titleEn || ""
    if (key === "meta") return lang === "en" ? ds.metaEn || ds.metaEs || "" : ds.metaEs || ds.metaEn || ""
    return ""
  }

  function setOpenLink(src) {
    if (!openLink) return
    if (src) {
      openLink.hidden = false
      openLink.href = src
    } else {
      openLink.hidden = true
      openLink.removeAttribute("href")
    }
  }

  function showPlaceholder(kind) {
    if (img) {
      img.hidden = true
      img.classList.remove("is-loaded")
      img.removeAttribute("src")
    }
    if (ph) ph.hidden = false
    if (loading) loading.hidden = true
    setOpenLink("")
    setPhMessage(kind)
  }

  function showPreview(src, altText) {
    if (!img || !ph) return

    if (!src) {
      showPlaceholder("nodoc")
      return
    }

    setOpenLink(src)

    ph.hidden = true
    img.hidden = false
    img.alt = altText || ""
    img.classList.remove("is-loaded")

    if (loadedSrc.has(src)) {
      img.src = src
      if (loading) loading.hidden = true
      if (reduceMotion) img.classList.add("is-loaded")
      else requestAnimationFrame(() => img.classList.add("is-loaded"))
      return
    }

    if (loading) loading.hidden = false
    const token = ++loadToken

    const pre = new Image()
    pre.decoding = "async"
    pre.onload = () => {
      if (token !== loadToken) return
      loadedSrc.add(src)
      img.src = src
      if (loading) loading.hidden = true
      if (reduceMotion) img.classList.add("is-loaded")
      else requestAnimationFrame(() => img.classList.add("is-loaded"))
    }
    pre.onerror = () => {
      if (token !== loadToken) return
      showPlaceholder("error")
    }
    pre.src = src
  }

  function syncAria(btn) {
    const t = pickText(btn, "title")
    const m = pickText(btn, "meta")
    const label = [t, m].filter(Boolean).join(" — ")
    btn.setAttribute("aria-label", label || btn.textContent.trim())
  }

  function setActive(btn, opts = {}) {
    if (!btn || btn.hidden) return
    const { scrollIntoView = false, focus = false } = opts

    activeBtn = btn

    items.forEach((b) => {
      const on = b === btn
      b.classList.toggle("is-active", on)
      b.setAttribute("aria-selected", on ? "true" : "false")
      b.tabIndex = on ? 0 : -1
    })

    items.forEach(syncAria)

    const t = pickText(btn, "title")
    const m = pickText(btn, "meta")
    if (titleEl) titleEl.textContent = t
    if (metaEl) metaEl.textContent = m

    const src = (btn.dataset.preview || "").trim()
    showPreview(src, t)

    if (scrollIntoView) btn.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" })
    if (focus) btn.focus({ preventScroll: true })
  }

  function normalize(s) {
    return String(s || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  }

  function updateCount() {
    if (!countEl || !search) return
    const q = normalize(search.value)
    if (!q) {
      countEl.textContent = ""
      return
    }
    const visible = items.filter((b) => !b.hidden).length
    const lang = getLang()
    countEl.textContent =
      lang === "en"
        ? `${visible} result${visible === 1 ? "" : "s"}`
        : `${visible} resultado${visible === 1 ? "" : "s"}`
  }

  function applyFilter() {
    if (!search) return
    const q = normalize(search.value)

    items.forEach((btn) => {
      const ds = btn.dataset
      const hay = normalize(`${ds.titleEs || ""} ${ds.titleEn || ""} ${ds.metaEs || ""} ${ds.metaEn || ""} ${btn.textContent || ""}`)
      btn.hidden = q ? !hay.includes(q) : false
    })

    section.querySelectorAll(".cred-ui__group").forEach((g) => {
      const any = g.querySelector(".cred-ui__item:not([hidden])")
      g.hidden = !any
    })

    updateCount()

    const visibleItems = items.filter((b) => !b.hidden)
    if (!visibleItems.length) {
      activeBtn = null
      if (titleEl) titleEl.textContent = ""
      if (metaEl) metaEl.textContent = ""
      showPlaceholder("noresults")
      return
    }

    if (!activeBtn || activeBtn.hidden) setActive(visibleItems[0])
    else items.forEach((b) => (b.tabIndex = b === activeBtn ? 0 : -1))
  }

  items.forEach((btn) => {
    btn.setAttribute("role", "option")
    btn.setAttribute("aria-selected", "false")
    btn.setAttribute("aria-controls", "credPreviewFigure")
    btn.tabIndex = -1
    syncAria(btn)
  })
  if (items[0]) items[0].tabIndex = 0

  const hoverDelay = 70
  const hoverTimers = new WeakMap()

  function clearHover(btn) {
    const id = hoverTimers.get(btn)
    if (id) clearTimeout(id)
    hoverTimers.delete(btn)
  }

  items.forEach((btn) => {
    btn.addEventListener("mouseleave", () => clearHover(btn))
    btn.addEventListener("mouseenter", () => {
      clearHover(btn)
      const id = window.setTimeout(() => setActive(btn), hoverDelay)
      hoverTimers.set(btn, id)
    })
    btn.addEventListener("focus", () => setActive(btn))
    btn.addEventListener("click", () => setActive(btn))
  })

  function visibleItems() {
    return items.filter((b) => !b.hidden)
  }

  function moveFocus(delta) {
    const vis = visibleItems()
    if (!vis.length) return
    const current = document.activeElement
    const i = Math.max(0, vis.indexOf(current))
    const next = vis[Math.max(0, Math.min(vis.length - 1, i + delta))]
    if (next) setActive(next, { focus: true, scrollIntoView: true })
  }

  list?.addEventListener("keydown", (e) => {
    const key = e.key
    if (key === "ArrowDown") {
      e.preventDefault()
      moveFocus(1)
    } else if (key === "ArrowUp") {
      e.preventDefault()
      moveFocus(-1)
    } else if (key === "Home") {
      e.preventDefault()
      const vis = visibleItems()
      if (vis[0]) setActive(vis[0], { focus: true, scrollIntoView: true })
    } else if (key === "End") {
      e.preventDefault()
      const vis = visibleItems()
      if (vis[vis.length - 1]) setActive(vis[vis.length - 1], { focus: true, scrollIntoView: true })
    }
  })

  search?.addEventListener("input", () => {
    if (clearBtn) clearBtn.hidden = !String(search.value || "").length
    applyFilter()
  })

  clearBtn?.addEventListener("click", () => {
    if (!search) return
    search.value = ""
    clearBtn.hidden = true
    applyFilter()
    search.focus()
  })

  img?.addEventListener("error", () => showPlaceholder("error"))

  function openModal() {
    if (!activeBtn) return
    const src = (activeBtn.dataset.preview || "").trim()
    if (!src) return

    if (!modal || typeof modal.showModal !== "function" || !modalImg) {
      window.open(src, "_blank", "noopener")
      return
    }

    const t = pickText(activeBtn, "title")
    const m = pickText(activeBtn, "meta")

    if (modalTitle) modalTitle.textContent = t
    if (modalMeta) modalMeta.textContent = m

    modalImg.src = src
    modalImg.alt = t || ""

    if (modalOpen) {
      modalOpen.hidden = false
      modalOpen.href = src
    }

    modal.showModal()
  }

  img?.addEventListener("click", openModal)
  modalClose?.addEventListener("click", () => modal?.close())
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) modal.close()
  })
  modal?.addEventListener("close", () => {
    activeBtn?.focus({ preventScroll: true })
  })

  const firstWithPreview = items.find((b) => (b.dataset.preview || "").trim().length > 0) || items[0]
  setActive(firstWithPreview)

  const langBtn = document.getElementById("langToggle")
  langBtn?.addEventListener("click", () => {
    items.forEach(syncAria)
    if (activeBtn) setActive(activeBtn)
    updateCount()
  })
})()

/* =============================
   Stats count-up (Trayectoria en síntesis)
   ============================= */
;(() => {
  const els = Array.from(document.querySelectorAll(".stat-number"))
  if (!els.length) return

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (reduceMotion) return

  const clamp01 = (t) => Math.max(0, Math.min(1, t))
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

  function parseStat(text) {
    const raw = String(text || "").trim()

    const range = raw.match(/(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)\s*%/)
    if (range) {
      return { kind: "rangePercent", from: Number(range[1]), to: Number(range[2]), finalText: raw }
    }

    const pct = raw.match(/(\d+(?:\.\d+)?)\s*%$/)
    if (pct) {
      return { kind: "percent", to: Number(pct[1]), suffix: "%", finalText: raw }
    }

    const num = raw.replace(/,/g, "")
    if (/^\d+(\.\d+)?$/.test(num)) {
      return { kind: "number", to: Number(num), finalText: raw }
    }

    return { kind: "unknown", finalText: raw }
  }

  function animateNumber(el, spec) {
    const DURATION = 1100
    const start = performance.now()

    el.classList.add("is-counting")

    const settleWindow = 0.88
    const settlePeak = 0.965
    const settleEnd = 1.0

    function microSettle(t, baseValue, overshootValue) {
      if (t <= settleWindow) return baseValue
      const u = (t - settleWindow) / (settleEnd - settleWindow)
      const p = (settlePeak - settleWindow) / (settleEnd - settleWindow)

      if (u <= p) {
        const k = u / Math.max(1e-6, p)
        return baseValue + (overshootValue - baseValue) * k
      } else {
        const k = (u - p) / Math.max(1e-6, 1 - p)
        return overshootValue + (baseValue - overshootValue) * k
      }
    }

    function frame(now) {
      const t = clamp01((now - start) / DURATION)
      const e = easeOutCubic(t)

      if (spec.kind === "number") {
        const to = spec.to
        const base = to * e
        const bump = Math.min(Math.max(1, Math.round(to * 0.03)), 12)
        const over = to + bump
        const v = microSettle(t, base, Math.min(over, to + bump))
        el.textContent = String(Math.round(v))
      } else if (spec.kind === "percent") {
        const to = spec.to
        const base = to * e
        const bump = Math.min(Math.max(1, Math.round(to * 0.05)), 6)
        const over = to + bump
        const v = microSettle(t, base, Math.min(over, to + bump))
        el.textContent = `${Math.round(v)}%`
      } else if (spec.kind === "rangePercent") {
        const to = spec.to
        const base = to * e
        const bump = Math.min(Math.max(1, Math.round(to * 0.05)), 6)
        const over = to + bump
        const v = microSettle(t, base, Math.min(over, to + bump))
        el.textContent = `${Math.round(v)}%`
      } else {
        el.textContent = spec.finalText
      }

      if (t < 1) requestAnimationFrame(frame)
      else {
        el.textContent = spec.finalText
        el.classList.remove("is-counting")
      }
    }

    requestAnimationFrame(frame)
  }

  const specs = els.map((el) => {
    const spec = parseStat(el.textContent)
    el.dataset.finalText = spec.finalText

    if (spec.kind === "number") el.textContent = "0"
    else if (spec.kind === "percent" || spec.kind === "rangePercent") el.textContent = "0%"

    return { el, spec }
  })

  let hasRun = false
  const section = document.getElementById("highlights")

  const obs = new IntersectionObserver(
    (entries) => {
      if (hasRun) return
      const entry = entries.find((e) => e.isIntersecting)
      if (!entry) return

      hasRun = true
      specs.forEach(({ el, spec }) => animateNumber(el, spec))
      obs.disconnect()
    },
    { threshold: 0.35 }
  )

  obs.observe(section || els[0])
})()

/* =========================================
   MEDIA GALLERY LOGIC (CARRUSEL SOPORTE YOUTUBE)
   ========================================= */
;(() => {
  const stage = document.getElementById("mediaStage")
  if (!stage) return

  // --- CONFIGURACIÓN: TUS IMÁGENES Y VIDEOS ---
  // Recomendación: mete tus assets en /media/ y usa rutas relativas.
  // Ejemplos:
  // { type:"image", src:"media/1.jpg", alt:"..." }
  // { type:"video", src:"media/vid1.mp4", poster:"media/poster1.jpg", alt:"..." }
  // { type:"youtube", id:"xxxx", src:"https://img.youtube.com/vi/xxxx/hqdefault.jpg", alt:"..." }
const MEDIA_ITEMS = [
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=80",
    alt: "Instalaciones modernas",
  },
  {
    type: "youtube",
    id: "IlKkBmYyCjU",
    src: "https://img.youtube.com/vi/IlKkBmYyCjU/hqdefault.jpg",
    alt: "Video informativo",
  },
  {
    type: "youtube",
    id: "JlNbn0cvkuc",
    src: "https://img.youtube.com/vi/JlNbn0cvkuc/hqdefault.jpg",
    alt: "Video informativo 2",
  },
  {
    type: "youtube",
    id: "VWuIF_-BK5g",
    src: "https://img.youtube.com/vi/VWuIF_-BK5g/hqdefault.jpg",
    alt: "Video informativo 3",
  },
  {
    type: "video",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    poster: "https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80",
    alt: "Video demostrativo",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    alt: "Consultorio médico",
  },
];

  const layerA = document.getElementById("layerA")
  const layerB = document.getElementById("layerB")
  const btnPrev = document.getElementById("btnPrev")
  const btnNext = document.getElementById("btnNext")
  const thumbRow = document.getElementById("thumbRow")
  const mediaKind = document.getElementById("mediaKind")
  const mediaCounter = document.getElementById("mediaCounter")

  if (!layerA || !layerB) return

  let currentIndex = 0
  let activeLayer = 0
  let autoplayTimer = null
  const AUTOPLAY_DELAY = 12000 // 12s

  function createMediaElement(item) {
    if (item.type === "youtube") {
      const iframe = document.createElement("iframe")
      const videoId = item.id
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&loop=1&playlist=${videoId}&playsinline=1&rel=0`
      iframe.allow = "autoplay; encrypted-media"
      iframe.title = item.alt || "Video"
      iframe.setAttribute("aria-label", item.alt || "Video")
      return iframe
    }

    if (item.type === "video") {
      const v = document.createElement("video")
      v.src = item.src
      v.autoplay = true
      v.muted = true
      v.loop = true
      v.playsInline = true
      if (item.poster) v.poster = item.poster
      v.setAttribute("aria-label", item.alt || "Video")
      return v
    }

    const img = document.createElement("img")
    img.src = item.src
    img.alt = item.alt || ""
    img.loading = "eager"
    return img
  }

  function getLayer(isIncoming) {
    if (isIncoming) return activeLayer === 0 ? layerB : layerA
    return activeLayer === 0 ? layerA : layerB
  }

  function updateMeta() {
    const item = MEDIA_ITEMS[currentIndex]
    const isVideo = item.type === "video" || item.type === "youtube"
    if (mediaKind) mediaKind.textContent = isVideo ? (currentLang === "en" ? "Video" : "Video") : (currentLang === "en" ? "Image" : "Imagen")
    if (mediaCounter) mediaCounter.textContent = `${currentIndex + 1} / ${MEDIA_ITEMS.length}`
  }

  function renderThumbs() {
    if (!thumbRow) return
    thumbRow.innerHTML = ""

    MEDIA_ITEMS.forEach((item, idx) => {
      const btn = document.createElement("button")
      btn.className = `thumb ${idx === 0 ? "is-active" : ""}`
      btn.setAttribute("aria-label", `Ver elemento ${idx + 1}`)

      const img = document.createElement("img")
      const isVideo = item.type === "video" || item.type === "youtube"
      img.src = isVideo ? item.poster || item.src : item.src
      img.alt = ""
      img.loading = "lazy"
      btn.appendChild(img)

      if (isVideo) {
        const icon = document.createElement("div")
        icon.className = "play-icon"
        icon.innerHTML = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`
        btn.appendChild(icon)
      }

      btn.addEventListener("click", () => {
        goTo(idx)
      })

      thumbRow.appendChild(btn)
    })
  }

  function updateThumbs() {
    if (!thumbRow) return
    const thumbs = thumbRow.querySelectorAll(".thumb")
    thumbs.forEach((t, i) => {
      if (i === currentIndex) {
        t.classList.add("is-active")
        const leftPos = t.offsetLeft - thumbRow.clientWidth / 2 + t.clientWidth / 2
        thumbRow.scrollTo({ left: leftPos, behavior: "smooth" })
      } else {
        t.classList.remove("is-active")
      }
    })
  }

  function crossfadeTo(newIndex) {
    const len = MEDIA_ITEMS.length
    const nextIndex = (newIndex % len + len) % len

    if (nextIndex === currentIndex && layerA.innerHTML !== "") return

    const incoming = getLayer(true)
    const outgoing = getLayer(false)

    incoming.innerHTML = ""
    incoming.appendChild(createMediaElement(MEDIA_ITEMS[nextIndex]))

    incoming.classList.add("is-active")
    outgoing.classList.remove("is-active")

    const oldMedia = outgoing.querySelector("video, iframe")
    if (oldMedia) {
      setTimeout(() => {
        try {
          if (oldMedia.tagName === "VIDEO") oldMedia.pause()
          oldMedia.src = ""
          oldMedia.removeAttribute?.("src")
        } catch (e) {}
      }, 600)
    }

    currentIndex = nextIndex
    activeLayer = activeLayer === 0 ? 1 : 0

    updateMeta()
    updateThumbs()
  }

  function goTo(index) {
    crossfadeTo(index)
    resetAutoplay()
  }
  function next() {
    goTo(currentIndex + 1)
  }
  function prev() {
    goTo(currentIndex - 1)
  }

  function startAutoplay() {
    stopAutoplay()
    autoplayTimer = setTimeout(() => next(), AUTOPLAY_DELAY)
  }
  function stopAutoplay() {
    if (autoplayTimer) clearTimeout(autoplayTimer)
    autoplayTimer = null
  }
  function resetAutoplay() {
    stopAutoplay()
    startAutoplay()
  }

  stage.addEventListener("mouseenter", stopAutoplay)
  stage.addEventListener("mouseleave", startAutoplay)

  let touchStartX = 0
  stage.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX
    },
    { passive: true }
  )

  stage.addEventListener(
    "touchend",
    (e) => {
      const touchEndX = e.changedTouches[0].screenX
      const diff = touchEndX - touchStartX
      if (Math.abs(diff) > 50) {
        if (diff < 0) next()
        else prev()
      }
    },
    { passive: true }
  )

  if (btnNext) btnNext.addEventListener("click", next)
  if (btnPrev) btnPrev.addEventListener("click", prev)

  renderThumbs()
  layerA.innerHTML = ""
  layerA.appendChild(createMediaElement(MEDIA_ITEMS[0]))
  layerA.classList.add("is-active")
  layerB.classList.remove("is-active")

  updateMeta()
  startAutoplay()

  // Si cambias idioma, re-render meta (Imagen/Video)
  langToggle?.addEventListener("click", () => updateMeta())
})()

/* =========================================
   BOT DE TRIAJE WHATSAPP (Lógica Completa)
   Actualizado a Dr. Sierra + especialidades
   ========================================= */
;(() => {
  const widget = document.getElementById("waWidget")
  const trigger = document.getElementById("waTrigger")
  const closeBtn = document.getElementById("waCloseBtn")
  const chatBox = document.getElementById("waChatBox")
  const chatBody = document.getElementById("waBody")
  const optionsContainer = document.getElementById("waOptions")
  const inputForm = document.getElementById("waInputForm")
  const textInput = document.getElementById("waTextInput")

  // Guards completos
  if (!widget || !trigger || !chatBox || !chatBody || !optionsContainer || !inputForm || !textInput) return

  const PHONE_NUMBER = SITE.whatsappPhone

  const initialState = { name: "", type: "", reason: "", urgency: "", availability: "" }
  let currentStep = 0
  let userData = { ...initialState }

  function t(es, en) {
    return currentLang === "en" ? en : es
  }

  const steps = [
    {
      id: 0,
      text: () => t(
        `¡Hola! 👋 Soy el asistente virtual del ${SITE.doctorShortName}. Para comenzar, ¿cuál es tu nombre?`,
        `Hi! 👋 I’m the virtual assistant for ${SITE.doctorShortName}. To begin, what’s your name?`
      ),
      type: "text",
      field: "name",
    },
    {
      id: 1,
      text: () => t(
        "Gracias, {name}. ¿Qué tipo de consulta te interesa?",
        "Thanks, {name}. What type of appointment are you looking for?"
      ),
      type: "chips",
      options: () => (currentLang === "en"
        ? ["In-person (CDMX)", "Online / Second opinion"]
        : ["Presencial (CDMX)", "En línea / 2ª Opinión"]),
      field: "type",
    },
    {
      id: 2,
      text: () => t(
        "¿Cuál es el motivo principal de tu consulta?",
        "What is the main reason for your appointment?"
      ),
      type: "chips",
      options: () => (currentLang === "en"
        ? [
            "Heart Failure",
            "Cardio-Oncology",
            "Echocardiography / Imaging",
            "Hypertension",
            "Chest pain",
            "Palpitations / Arrhythmia",
            "Preventive check-up",
            "Second opinion",
            "Other",
          ]
        : [
            "Insuficiencia Cardíaca",
            "Cardio-Oncología",
            "Ecocardiografía / Imagen",
            "Hipertensión",
            "Dolor de pecho",
            "Palpitaciones / Arritmia",
            "Chequeo preventivo",
            "Segunda opinión",
            "Otro",
          ]),
      field: "reason",
    },
    {
      id: 3,
      text: () => t("¿Consideras que tu situación es urgente?", "Do you consider your situation urgent?"),
      type: "chips",
      options: () => (currentLang === "en"
        ? ["Not urgent", "Yes, symptoms right now"]
        : ["No es urgente", "Sí, tengo síntomas ahora"]),
      field: "urgency",
    },
    {
      id: 4,
      text: () => t("¿Qué horario prefieres para la cita?", "What time of day do you prefer?"),
      type: "chips",
      options: () => (currentLang === "en" ? ["Morning", "Afternoon", "As soon as possible"] : ["Mañana", "Tarde", "Lo antes posible"]),
      field: "availability",
    },
    {
      id: 5,
      text: () => t(
        "Perfecto. He preparado tu mensaje. Haz clic abajo para abrir WhatsApp con toda la información lista:",
        "Perfect. I’ve prepared your message. Click below to open WhatsApp with everything ready:"
      ),
      type: "final",
    },
  ]

  function openWidget() {
    widget.classList.add("is-open")
    chatBox.setAttribute("aria-hidden", "false")
    trigger.setAttribute("aria-expanded", "true")

    if (currentStep === 0 && chatBody.childElementCount === 0) renderStep()

    setTimeout(() => {
      if (!textInput.disabled && !inputForm.hidden) textInput.focus()
    }, 250)
  }

  function closeWidget() {
    widget.classList.remove("is-open")
    chatBox.setAttribute("aria-hidden", "true")
    trigger.setAttribute("aria-expanded", "false")
    trigger.focus()
  }

  function scrollToBottom() {
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" })
  }

  function addBotMessage(template) {
    const bubble = document.createElement("div")
    bubble.className = "wa-bubble wa-bubble--bot"

    const msg = typeof template === "function" ? template() : template

    if (msg.includes("{name}") && userData.name) {
      const parts = msg.split("{name}")
      if (parts[0]) bubble.appendChild(document.createTextNode(parts[0]))

      const strong = document.createElement("strong")
      strong.textContent = userData.name
      bubble.appendChild(strong)

      if (parts[1]) bubble.appendChild(document.createTextNode(parts[1]))
    } else {
      bubble.textContent = msg
    }

    chatBody.appendChild(bubble)
    scrollToBottom()
  }

  function addUserMessage(text) {
    const bubble = document.createElement("div")
    bubble.className = "wa-bubble wa-bubble--user"
    bubble.textContent = text
    chatBody.appendChild(bubble)
    scrollToBottom()
  }

  function resetChat() {
    currentStep = 0
    userData = { ...initialState }
    chatBody.innerHTML = ""
    optionsContainer.innerHTML = ""

    inputForm.hidden = false
    textInput.disabled = false
    textInput.value = ""
    textInput.placeholder = t("Escribe tu respuesta...", "Type your answer...")

    renderStep()
  }

  function renderStep() {
    const step = steps[currentStep]

    setTimeout(() => {
      addBotMessage(step.text)

      inputForm.hidden = true
      optionsContainer.innerHTML = ""

      if (step.type === "text") {
        inputForm.hidden = false
        textInput.disabled = false
        textInput.placeholder = t("Escribe tu respuesta...", "Type your answer...")
        setTimeout(() => textInput.focus(), 80)
      } else if (step.type === "chips") {
        const opts = typeof step.options === "function" ? step.options() : step.options
        opts.forEach((opt) => {
          const btn = document.createElement("button")
          btn.className = "wa-chip"
          btn.textContent = opt
          btn.onclick = () => handleInput(opt)
          optionsContainer.appendChild(btn)
        })
      } else if (step.type === "final") {
        renderFinalActions()
      }

      scrollToBottom()
    }, 420)
  }

  function handleInput(value) {
    if (!String(value || "").trim()) return

    const field = steps[currentStep].field
    userData[field] = value

    addUserMessage(value)

    // Alerta de urgencia
    if (field === "urgency" && (value.includes("Sí") || value.includes("Yes"))) {
      const alertDiv = document.createElement("div")
      alertDiv.className = "wa-alert"
      alertDiv.textContent = t(
        "⚠️ IMPORTANTE: Si presentas dolor intenso de pecho, falta de aire marcada, desmayo o síntomas neurológicos, acude a URGENCIAS de inmediato.",
        "⚠️ IMPORTANT: If you have severe chest pain, significant shortness of breath, fainting, or neurological symptoms, go to the ER immediately."
      )
      chatBody.appendChild(alertDiv)
      scrollToBottom()
    }

    currentStep++
    if (currentStep < steps.length) renderStep()

    textInput.value = ""
  }

  function renderFinalActions() {
    const message =
      currentLang === "en"
        ? `Hello ${SITE.doctorShortName}, I’m *${userData.name}*.
I would like to schedule an appointment: *${userData.type}*.
Reason: ${userData.reason}.
Urgency: ${userData.urgency}.
Preferred time: ${userData.availability}.
Thank you.`
        : `Hola ${SITE.doctorShortName}, soy *${userData.name}*.
Me gustaría agendar una consulta: *${userData.type}*.
Motivo: ${userData.reason}.
Urgencia: ${userData.urgency}.
Preferencia: ${userData.availability}.
Gracias.`

    const link = `https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${encodeURIComponent(message)}`

    const bubbleWa = document.createElement("div")
    bubbleWa.className = "wa-bubble wa-bubble--bot"
    bubbleWa.style.background = "transparent"
    bubbleWa.style.boxShadow = "none"
    bubbleWa.style.padding = "0"

    const btn = document.createElement("a")
    btn.className = "wa-btn-final"
    btn.href = link
    btn.target = "_blank"
    btn.rel = "noopener"
    btn.innerHTML = `
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      ${t("Iniciar chat en WhatsApp", "Open WhatsApp")}
    `
    bubbleWa.appendChild(btn)
    chatBody.appendChild(bubbleWa)

    const bubbleReset = document.createElement("div")
    bubbleReset.className = "wa-bubble wa-bubble--bot"
    bubbleReset.style.background = "transparent"
    bubbleReset.style.boxShadow = "none"
    bubbleReset.style.padding = "0"
    bubbleReset.style.marginTop = "-8px"

    const resetBtn = document.createElement("button")
    resetBtn.textContent = t("Volver a empezar", "Start over")
    resetBtn.style =
      "border:none; background:none; color:#666; font-size:0.8rem; cursor:pointer; text-decoration:underline; padding:8px; width:100%;"
    resetBtn.onclick = resetChat

    bubbleReset.appendChild(resetBtn)
    chatBody.appendChild(bubbleReset)

    inputForm.hidden = false
    textInput.disabled = true
    textInput.placeholder = t("Chat finalizado", "Chat finished")

    scrollToBottom()
  }

  trigger.addEventListener("click", () => {
    if (widget.classList.contains("is-open")) closeWidget()
    else openWidget()
  })

  if (closeBtn) closeBtn.addEventListener("click", closeWidget)

  document.addEventListener("click", (e) => {
    if (widget.classList.contains("is-open") && !widget.contains(e.target)) closeWidget()
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && widget.classList.contains("is-open")) closeWidget()
  })

  inputForm.addEventListener("submit", (e) => {
    e.preventDefault()
    handleInput(textInput.value)
  })

  // Si cambias idioma mientras está abierto, seguimos sin romper; reinicia solo el placeholder si aplica
  langToggle?.addEventListener("click", () => {
    if (!textInput.disabled) textInput.placeholder = t("Escribe tu respuesta...", "Type your answer...")
  })
})()
