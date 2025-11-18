// router.js — Apple macOS Sonoma Grade SPA with Buttery-Smooth GPU-Accelerated Transitions
const homeEl = document.getElementById("home");
const appView = document.getElementById("app-view");
const appFrame = document.getElementById("app-frame");
const backBtn = document.getElementById("backBtn");
const loader = document.getElementById("loader");

// Inject premium ultra-smooth transition styles into document head
const transitionStyles = `
  <style>
    /* ========================= MASTER ANIMATIONS ========================= */
    @keyframes pageEnter {
      from {
        opacity: 0;
        transform: scale(0.95) translateY(16px);
        filter: blur(10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
        filter: blur(0);
      }
    }

    @keyframes pageExit {
      from {
        opacity: 1;
        transform: scale(1) translateY(0);
        filter: blur(0);
      }
      to {
        opacity: 0;
        transform: scale(0.93) translateY(-16px);
        filter: blur(10px);
      }
    }

    @keyframes tilePress {
      0% { transform: scale(1); }
      50% { transform: scale(0.96); }
      100% { transform: scale(1); }
    }

    @keyframes ripple {
      0% {
        box-shadow: 0 0 0 0 rgba(94, 252, 232, 0.8);
      }
      60% {
        box-shadow: 0 0 0 16px rgba(94, 252, 232, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(94, 252, 232, 0);
      }
    }

    @keyframes slideInFromRight {
      from {
        opacity: 0;
        transform: translateX(48px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideOutToLeft {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(-48px);
      }
    }

    @keyframes pulseGlow {
      0%, 100% { 
        box-shadow: 0 0 20px rgba(94, 252, 232, 0.3);
      }
      50% { 
        box-shadow: 0 0 40px rgba(124, 120, 255, 0.4);
      }
    }

    .tile:active {
      animation: tilePress 240ms cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .tile-ripple {
      animation: ripple 700ms cubic-bezier(0.25, 0.8, 0.3, 1) forwards;
    }

    @media (prefers-reduced-motion: reduce) {
      @keyframes pageEnter { from { opacity: 0; } to { opacity: 1; } }
      @keyframes pageExit { from { opacity: 1; } to { opacity: 0; } }
      @keyframes tilePress { 0%, 100% { transform: scale(1); } }
      @keyframes ripple { 0%, 100% { box-shadow: 0 0 0 0 rgba(94, 252, 232, 0); } }
      @keyframes slideInFromRight { from { opacity: 0; } to { opacity: 1; } }
      @keyframes slideOutToLeft { from { opacity: 1; } to { opacity: 0; } }
    }
  </style>
`;

document.head.insertAdjacentHTML('beforeend', transitionStyles);

// Function to attach tile listeners (call on page load and after back button)
function attachTileListeners() {
  document.querySelectorAll(".tile").forEach(tile => {
    // Remove old listeners if they exist
    if (tile._clickHandler) {
      tile.removeEventListener("click", tile._clickHandler);
    }
    if (tile._mouseEnterHandler) {
      tile.removeEventListener("mouseenter", tile._mouseEnterHandler);
    }
    if (tile._mouseLeaveHandler) {
      tile.removeEventListener("mouseleave", tile._mouseLeaveHandler);
    }

    // Define handlers and store them for removal
    tile._clickHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      createRippleEffect(tile, e);
      setTimeout(() => openApp(tile.dataset.app, tile), 50);
    };

    tile._mouseEnterHandler = () => {
      tile.style.transform = "translateY(-6px)";
      tile.style.transition = "all 280ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      tile.style.boxShadow = "0 28px 72px rgba(124, 120, 255, 0.25)";
    };

    tile._mouseLeaveHandler = () => {
      tile.style.transform = "";
      tile.style.boxShadow = "";
    };

    // Attach listeners
    tile.addEventListener("click", tile._clickHandler);
    tile.addEventListener("mouseenter", tile._mouseEnterHandler);
    tile.addEventListener("mouseleave", tile._mouseLeaveHandler);
  });
}

// Initial attach on page load
attachTileListeners();

// Premium ripple micro-interaction with glow effect
function createRippleEffect(element, event) {
  const ripple = document.createElement('div');
  ripple.style.position = 'absolute';
  ripple.style.pointerEvents = 'none';
  ripple.style.inset = '0';
  ripple.style.borderRadius = 'inherit';
  ripple.style.background = 'rgba(94, 252, 232, 0.35)';
  ripple.style.animation = 'ripple 700ms cubic-bezier(0.25, 0.8, 0.3, 1) forwards';
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  element.appendChild(ripple);
  
  setTimeout(() => ripple.remove(), 700);
}

let currentClone = null;

async function openApp(name, tileEl) {
  // show loader with smooth, pulsing entrance (macOS-grade polish)
  loader.classList.remove("hidden");
  loader.style.opacity = "0";
  loader.style.animation = "none";
  void loader.offsetWidth;
  loader.style.animation = "pageEnter 300ms cubic-bezier(0.16, 1, 0.3, 1), pulseGlow 2s ease-in-out infinite 300ms";
  loader.style.opacity = "1";

  // clone tile for premium expanding shared-element animation
  const rect = tileEl.getBoundingClientRect();
  const clone = tileEl.cloneNode(true);
  clone.style.position = "fixed";
  clone.style.top = `${rect.top}px`;
  clone.style.left = `${rect.left}px`;
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.margin = 0;
  clone.style.zIndex = 9999;
  clone.style.pointerEvents = "none";
  clone.style.willChange = "transform, opacity";
  clone.style.transition = "all 480ms cubic-bezier(0.16, 1, 0.3, 1)";
  document.body.appendChild(clone);
  currentClone = clone;

  // small tactile feedback on original tile (scale down)
  tileEl.style.transform = "scale(0.94)";
  tileEl.style.transition = "transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1)";
  tileEl.style.opacity = "0.75";

  // force reflow for smooth animation
  void clone.offsetWidth;

  // expand clone to cover screen with premium Sonoma-grade easing
  const targetW = window.innerWidth * 0.96;
  const targetH = window.innerHeight * 0.92;
  const targetLeft = (window.innerWidth - targetW) / 2;
  const targetTop = (window.innerHeight - targetH) / 2;

  clone.style.left = `${targetLeft}px`;
  clone.style.top = `${targetTop}px`;
  clone.style.width = `${targetW}px`;
  clone.style.height = `${targetH}px`;
  clone.style.borderRadius = "18px";
  clone.style.boxShadow = "0 60px 180px rgba(0, 0, 0, 0.7)";
  clone.style.opacity = "0.99";

  // slide out/hide home with fluid transition
  setTimeout(() => {
    homeEl.style.animation = "slideOutToLeft 380ms cubic-bezier(0.2, 0.8, 0.2, 1)";
    homeEl.style.pointerEvents = "none";

    setTimeout(() => {
      homeEl.classList.add("hidden");
      appView.classList.remove("hidden");
      appView.style.opacity = "0";
      appView.style.transform = "scale(0.97)";
      appView.style.filter = "blur(8px)";
      
      // set iframe src
      appFrame.src = `/apps/${name}/index.html`;
      
      // animate appView fade and scale in with premium easing
      setTimeout(() => {
        appView.style.transition = "all 480ms cubic-bezier(0.16, 1, 0.3, 1)";
        appView.style.opacity = "1";
        appView.style.transform = "scale(1)";
        appView.style.filter = "blur(0)";
      }, 60);
    }, 260);
  }, 300);

  // remove clone after app loads and fade out loader
  setTimeout(() => {
    try { clone.remove(); } catch(e){}
    currentClone = null;
    tileEl.style.transform = "";
    tileEl.style.opacity = "";
    tileEl.style.transition = "";
    
    // smooth loader fade out
    loader.style.transition = "opacity 280ms cubic-bezier(0.4, 0, 0.2, 1)";
    loader.style.opacity = "0";
    loader.style.animation = "none";
    setTimeout(() => {
      loader.classList.add("hidden");
      loader.style.opacity = "1";
      loader.style.animation = "";
    }, 280);
  }, 1000);
}

// back button with premium, fluid exit animation (award-winning macOS feel)
backBtn.addEventListener("click", async () => {
  // smooth loader entrance with glow
  loader.classList.remove("hidden");
  loader.style.opacity = "0";
  loader.style.animation = "pageEnter 220ms cubic-bezier(0.16, 1, 0.3, 1), pulseGlow 2s ease-in-out infinite 220ms";
  loader.style.opacity = "1";

  // smooth app view exit with slide and scale down
  appView.style.transition = "all 420ms cubic-bezier(0.2, 0.8, 0.2, 1)";
  appView.style.opacity = "0";
  appView.style.transform = "scale(0.95) translateX(32px)";
  appView.style.filter = "blur(10px)";

  setTimeout(() => {
    appView.classList.add("hidden");
    appFrame.src = "";
    
    // reveal home with premium slide-in animation
    homeEl.classList.remove("hidden");
    
    // Reset transition and animation
    homeEl.style.transition = "none";
    homeEl.style.animation = "none";
    
    // Clear all inline styles from home element
    homeEl.style.opacity = "";
    homeEl.style.pointerEvents = "";
    homeEl.style.transform = "";
    homeEl.style.filter = "";
    
    // Force reflow
    void homeEl.offsetWidth;
    
    // Apply fresh premium animation after reflow
    homeEl.style.animation = "slideInFromRight 480ms cubic-bezier(0.16, 1, 0.3, 1)";
    homeEl.style.pointerEvents = "auto";
    
    // Reset tile styles that were modified during open
    document.querySelectorAll(".tile").forEach(tile => {
      tile.style.transition = "none";
      tile.style.transform = "";
      tile.style.opacity = "";
      tile.style.boxShadow = "";
    });
    
    // Reattach tile listeners after home is revealed
    setTimeout(() => {
      attachTileListeners();
    }, 120);
    
    // smooth loader fade out
    setTimeout(() => {
      loader.style.transition = "opacity 260ms cubic-bezier(0.4, 0, 0.2, 1)";
      loader.style.opacity = "0";
      loader.style.animation = "none";
      setTimeout(() => {
        loader.classList.add("hidden");
        loader.style.opacity = "1";
      }, 260);
    }, 120);
  }, 380);
});

// listen for auth or child-app messages
window.addEventListener("message", (e) => {
  const data = e.data || {};
  if (data?.type === "login-success") {
    // after login, reload homepage user data
    if (window.refreshHomeUser) window.refreshHomeUser();
    // ensure home is visible
    appFrame.src = "";
    appView.classList.add("hidden");
    homeEl.classList.remove("hidden");
  }

  if (data?.type === "navigate" && data?.target) {
    // allow child iframe to ask router to open another app (optional)
    const tile = [...document.querySelectorAll(".tile")].find(t => t.dataset.app === data.target);
    if (tile) tile.click();
  }
});