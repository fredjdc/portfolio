/**
 * Freddy Díaz — Portfolio Interactivity Script
 * Custom "Product OS" controls: Command Palette, Design System Reader, Accordions, and Project Drawer.
 */

// --- STATE MANAGEMENT & DATA ---
const PROJECTS_DATA = {
  bricks: {
    title: "Bricks Calc — Mortgage Planning",
    subtitle: "App Store iOS App · Designed and Built by Founder",
    tags: ["Product Strategy", "Figma Design System", "SwiftUI Build", "Conversion UI"],
    colorClass: "bricks",
    accentColor: "var(--bricks-accent)",
    highlights: [
      {
        title: "Product Strategy & Onboarding Flow",
        description: "Created clear onboarding screens that explain mortgage calculations and co-ownership dynamics before showing monetization options. Emphasized shared monthly cost splits to maximize onboarding conversions."
      },
      {
        title: "Calculator UX & Split Payment Logic",
        description: "Designed calculations for loan scenarios, Split Payments (who pays what), extra payments, and amortization tables. Focused on legibility and ease of use in joint financial decisions."
      },
      {
        title: "Paywall & Monetization Strategy",
        description: "Designed conversion pathways including limited free calculations, subscriptions, and one-time unlock models. Configured testing templates for onboarding paywalls."
      },
      {
        title: "Figma Component System & Developer Handoff",
        description: "Engineered a robust Figma library featuring variables, Auto Layout, strict text styles, and reusable modules, ensuring quick translation to SwiftUI code."
      },
      {
        title: "Analytics-Informed Funnel Iteration",
        description: "Leveraged analytics reports from Firebase and App Store Connect to identify drop-offs in the onboarding setup, redesigning primary CTA fields to boost conversions by 15%."
      }
    ]
  },
  scan: {
    title: "Bricks Scan — Private Document Scanner",
    subtitle: "Product Systems · OCR & AI Summaries",
    tags: ["Product Design", "OCR", "Document UX", "Privacy"],
    colorClass: "scan",
    accentColor: "var(--scan-accent)",
    highlights: [
      {
        title: "Scan, Import & OCR Review",
        description: "Designed seamless flows for capturing and importing documents, with clean interfaces for reviewing extracted text."
      },
      {
        title: "AI-Generated Summaries",
        description: "Integrated AI features to automatically generate concise summaries of long documents, helping users understand documents faster while keeping the experience private and controlled."
      },
      {
        title: "Organization & Reminders",
        description: "Designed flexible folder and tag systems, alongside rule-based automation logic and reminder flows to efficiently manage documents."
      },
      {
        title: "Export Options",
        description: "Created robust export flows supporting PDF, image, and text formats for seamless sharing and storage."
      },
      {
        title: "Monetization & Privacy",
        description: "Designed free usage limits and upgrade moments, while clearly communicating privacy-first local processing and strict data control."
      }
    ]
  }
};

const COMMANDS = [
  { label: "Jump to: Selected Work", action: () => scrollToSection("#work"), desc: "View projects", icon: "💼" },
  { label: "Jump to: AI Workflow", action: () => scrollToSection("#workflow"), desc: "View AI integration", icon: "🤖" },
  { label: "Jump to: Design Process", action: () => scrollToSection("#process"), desc: "View 4-step process", icon: "⚙️" },
  { label: "Jump to: Capabilities", action: () => scrollToSection("#capabilities"), desc: "View skills grid", icon: "📊" },
  { label: "Jump to: Professional Experience", action: () => scrollToSection("#experience"), desc: "View career history", icon: "Timeline" },
  { label: "Action: Toggle Dark Mode", action: () => toggleTheme(), desc: "Switch UI theme", icon: "🌓" },
  { label: "Action: Copy Email Address", action: () => copyEmail(), desc: "Copy to clipboard", icon: "📧" },
  { label: "Action: Download Resume", action: () => alert("Resume download triggered"), desc: "PDF document", icon: "📄" }
];

// --- EVENT INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  initTimeline();
  initCommandPalette();
  initProjectDrawer();
  updateDesignSystemDisplay();
  initScrollAnimations();

  // Update design system preview when system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    setTimeout(updateDesignSystemDisplay, 100);
  });
});

// --- SCROLL ANIMATIONS ---
function initScrollAnimations() {
  const elements = document.querySelectorAll('.section-header, .metric-card, .case-card, .process-card, .capability-card, .hero-content, .ds-widget');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -40px 0px"
  });

  elements.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

// --- TIMELINE ACCORDIONS ---
function initTimeline() {
  const headers = document.querySelectorAll(".timeline-header");
  headers.forEach(header => {
    header.addEventListener("click", () => {
      const item = header.parentElement;
      const isActive = item.classList.contains("active");

      // Close all other timeline items
      document.querySelectorAll(".timeline-item").forEach(el => {
        el.classList.remove("active");
      });

      // Toggle current
      if (!isActive) {
        item.classList.add("active");
      }
    });
  });
}

// --- PROJECT DRAWER SYSTEM ---
function initProjectDrawer() {
  const overlay = document.getElementById("drawer-overlay");
  const closeBtn = document.getElementById("drawer-close");
  const detailButtons = document.querySelectorAll(".btn-case-detail");

  detailButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const caseId = btn.getAttribute("data-case");
      openProjectDrawer(caseId);
    });
  });

  closeBtn.addEventListener("click", closeProjectDrawer);

  // Close on backdrop click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeProjectDrawer();
    }
  });
}

function openProjectDrawer(caseId) {
  const data = PROJECTS_DATA[caseId];
  if (!data) return;

  const overlay = document.getElementById("drawer-overlay");
  const tagsContainer = document.getElementById("drawer-tags");
  const title = document.getElementById("drawer-title");
  const subtitle = document.getElementById("drawer-subtitle");
  const content = document.getElementById("drawer-content");

  // Set accent color dynamically
  document.getElementById("drawer").style.setProperty('--accent', data.accentColor);

  // Set basic details
  title.textContent = data.title;
  subtitle.textContent = data.subtitle;

  // Set Tags
  tagsContainer.innerHTML = "";
  data.tags.forEach(tag => {
    const span = document.createElement("span");
    span.className = "case-tag";
    span.textContent = tag;
    tagsContainer.appendChild(span);
  });

  // Set content
  content.innerHTML = "";

  // Add placeholder image/graphic
  const visualPl = document.createElement("div");
  visualPl.className = `drawer-visual-placeholder ${data.colorClass}-grid-pattern`;
  visualPl.style.border = `1px solid ${data.accentColor}40`;

  if (caseId === "bricks") {
    visualPl.innerHTML = `
      <img
        class="drawer-visual-image"
        src="images/Bricks-Calc-High-Level-User-Journey-Flow.png"
        alt="Calculator Flow Layout"
      />
      <span class="drawer-visual-caption" style="color: ${data.accentColor};">
        Calculator Flow Layout
      </span>
    `;
  } else {
    visualPl.innerHTML = `
      <img
        class="drawer-visual-image"
        src="images/Bricks-Scan-High-Level-User-Journey-Flow.png"
        alt="Calculator Flow Layout"
      />
      <span class="drawer-visual-caption" style="color: ${data.accentColor};">
        Calculator Flow Layout
      </span>
    `;
  }
  content.appendChild(visualPl);

  // Add detailed sections
  data.highlights.forEach(hl => {
    const sec = document.createElement("div");
    sec.className = "drawer-section";

    const secTitle = document.createElement("h3");
    secTitle.className = "drawer-section-title";
    secTitle.textContent = hl.title;

    const secDesc = document.createElement("p");
    secDesc.style.fontSize = "0.9375rem";
    secDesc.style.color = "var(--text-secondary)";
    secDesc.textContent = hl.description;

    sec.appendChild(secTitle);
    sec.appendChild(secDesc);
    content.appendChild(sec);
  });

  overlay.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent body scroll
}

function closeProjectDrawer() {
  const overlay = document.getElementById("drawer-overlay");
  overlay.classList.remove("active");
  document.body.style.overflow = ""; // Restore body scroll
}

// --- UTILITY NAVIGATION & THEME ---
function scrollToSection(selector) {
  const element = document.querySelector(selector);
  if (element) {
    // Offset for top-bar height (around 50px)
    const yOffset = -60;
    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

function toggleTheme() {
  const root = document.documentElement;
  const isDark = root.classList.contains("dark-theme") ||
    (!root.classList.contains("light-theme") && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    root.classList.remove("dark-theme");
    root.classList.add("light-theme");
    showToast("🌓 Theme switched to Light Mode");
  } else {
    root.classList.remove("light-theme");
    root.classList.add("dark-theme");
    showToast("🌓 Theme switched to Dark Mode");
  }

  // Update colors shown in Design System Widget
  setTimeout(updateDesignSystemDisplay, 100);
}

function copyEmail() {
  const email = "freddyjdc@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    showToast("📋 Email address copied to clipboard!");
  }).catch(() => {
    showToast("❌ Clipboard copy failed. Please copy manually.");
  });
}

// --- TOAST SYSTEM ---
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");

  toastMsg.textContent = message;
  toast.classList.add("active");

  setTimeout(() => {
    toast.classList.remove("active");
  }, 3000);
}

// --- COMMAND PALETTE (CMD+K) ---
let selectedIndex = 0;
let filteredCommands = [...COMMANDS];

function initCommandPalette() {
  const trigger = document.getElementById("cmd-trigger");
  const overlay = document.getElementById("cmd-overlay");
  const input = document.getElementById("cmd-input");

  trigger.addEventListener("click", openCommandPalette);

  // Keyboard triggers: Cmd+K or Ctrl+K
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      openCommandPalette();
    }
  });

  // Overlay key actions
  input.addEventListener("keydown", handleCommandInputKeys);
  input.addEventListener("input", filterCommandsList);

  // Close palette on backdrop click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeCommandPalette();
    }
  });
}

function openCommandPalette() {
  const overlay = document.getElementById("cmd-overlay");
  const input = document.getElementById("cmd-input");

  overlay.classList.add("active");
  input.value = "";
  selectedIndex = 0;
  filteredCommands = [...COMMANDS];
  renderCommands();

  setTimeout(() => input.focus(), 50);
}

function closeCommandPalette() {
  const overlay = document.getElementById("cmd-overlay");
  overlay.classList.remove("active");
}

function renderCommands() {
  const list = document.getElementById("cmd-list");
  list.innerHTML = "";

  if (filteredCommands.length === 0) {
    const empty = document.createElement("li");
    empty.style.padding = "12px";
    empty.style.color = "var(--text-tertiary)";
    empty.style.fontSize = "0.875rem";
    empty.style.textAlign = "center";
    empty.textContent = "No commands found matching filter.";
    list.appendChild(empty);
    return;
  }

  filteredCommands.forEach((cmd, idx) => {
    const li = document.createElement("li");
    li.className = `cmd-item ${idx === selectedIndex ? 'selected' : ''}`;
    li.addEventListener("click", () => triggerCommand(cmd));

    li.innerHTML = `
      <div class="cmd-item-info">
        <span class="cmd-item-icon">${cmd.icon}</span>
        <div>
          <div class="cmd-item-label">${cmd.label}</div>
          <div class="cmd-item-desc">${cmd.desc}</div>
        </div>
      </div>
      <span class="cmd-item-shortcut">Enter</span>
    `;
    list.appendChild(li);
  });

  // Ensure selected item is scrolled into view
  const selectedItem = list.children[selectedIndex];
  if (selectedItem) {
    selectedItem.scrollIntoView({ block: "nearest" });
  }
}

function filterCommandsList(e) {
  const query = e.target.value.toLowerCase().trim();

  if (query === "") {
    filteredCommands = [...COMMANDS];
  } else {
    filteredCommands = COMMANDS.filter(cmd =>
      cmd.label.toLowerCase().includes(query) ||
      cmd.desc.toLowerCase().includes(query)
    );
  }

  selectedIndex = 0;
  renderCommands();
}

function handleCommandInputKeys(e) {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedIndex = (selectedIndex + 1) % filteredCommands.length;
    renderCommands();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
    renderCommands();
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (filteredCommands[selectedIndex]) {
      triggerCommand(filteredCommands[selectedIndex]);
    }
  } else if (e.key === "Escape") {
    e.preventDefault();
    closeCommandPalette();
  }
}

function triggerCommand(cmd) {
  closeCommandPalette();
  cmd.action();
}

// --- DYNAMIC DESIGN SYSTEM WIDGET READER ---
function updateDesignSystemDisplay() {
  const hexBg = document.getElementById("hex-bg-primary");
  const hexText = document.getElementById("hex-text-primary");
  const hexAccent = document.getElementById("hex-accent");

  if (!hexBg || !hexText || !hexAccent) return;

  // Helper to convert rgb(a) values returned by getComputedStyle into Hex format
  const rgbToHex = (rgbStr) => {
    const matches = rgbStr.match(/\d+/g);
    if (!matches || matches.length < 3) return rgbStr;
    const r = parseInt(matches[0]).toString(16).padStart(2, '0');
    const g = parseInt(matches[1]).toString(16).padStart(2, '0');
    const b = parseInt(matches[2]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  };

  // Read calculated colors directly from DOM elements styled by CSS variables
  setTimeout(() => {
    const styles = getComputedStyle(document.documentElement);
    const bgVal = styles.getPropertyValue('--bg-primary').trim();
    const textVal = styles.getPropertyValue('--text-primary').trim();
    const accentVal = styles.getPropertyValue('--accent').trim();

    // We update UI values dynamically
    hexBg.textContent = bgVal.startsWith('#') ? bgVal : rgbToHex(bgVal);
    hexText.textContent = textVal.startsWith('#') ? textVal : rgbToHex(textVal);
    hexAccent.textContent = accentVal.startsWith('#') ? accentVal : rgbToHex(accentVal);
  }, 50);
}

// --- CONTACT FORM HANDLER ---
function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById("form-name").value;
  const email = document.getElementById("form-email").value;
  const message = document.getElementById("form-message").value;

  if (name && email && message) {
    showToast(`✉️ Message sent successfully by ${name}!`);
    document.getElementById("contact-form").reset();
  } else {
    showToast(`⚠️ Please fill in all fields.`);
  }
}
