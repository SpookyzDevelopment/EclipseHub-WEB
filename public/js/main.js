document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initCartButton();
  initSmoothScroll();
  initStatsAnimation();
});

function initHeader() {
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function initCartButton() {
  updateCartCount();
  window.addEventListener('cart-updated', updateCartCount);
}

function updateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  const cartBadge = document.getElementById('cart-badge');
  const count = getCartCount();

  if (cartCountEl) {
    cartCountEl.textContent = count;
  }

  if (cartBadge) {
    if (count > 0) {
      cartBadge.classList.remove('hidden');
    } else {
      cartBadge.classList.add('hidden');
    }
  }
}

function openCartModal() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.classList.remove('hidden');
    renderCart();
  }
}

function closeCartModal() {
  const modal = document.getElementById('cart-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  const cartFooter = document.getElementById('cart-footer');
  const cartTotal = document.getElementById('cart-total');

  if (cart.length === 0) {
    cartEmpty.classList.remove('hidden');
    cartFooter.classList.add('hidden');
    cartItems.innerHTML = '';
  } else {
    cartEmpty.classList.add('hidden');
    cartFooter.classList.remove('hidden');

    cartItems.innerHTML = cart.map(item => `
      <div class="flex gap-4 bg-gray-800/50 p-4 rounded-lg border border-gray-800">
        <img src="${item.image_url}" alt="${item.name}" class="w-20 h-20 object-cover rounded">
        <div class="flex-1">
          <h3 class="font-semibold mb-1">${item.name}</h3>
          <p class="text-sm text-gray-400 mb-2">$${item.price.toFixed(2)} each</p>
          <div class="flex items-center gap-2">
            <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})" class="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path></svg>
            </button>
            <span class="w-8 text-center font-medium">${item.quantity}</span>
            <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})" class="p-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            </button>
          </div>
        </div>
        <div class="text-right flex flex-col justify-between">
          <button onclick="removeFromCart('${item.id}'); renderCart();" class="text-red-400 hover:text-red-300 transition-colors ml-auto">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
          <p class="font-bold text-lg">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    `).join('');

    cartTotal.textContent = `$${getCartTotal().toFixed(2)}`;
  }
}

function updateCartQuantity(productId, quantity) {
  updateQuantity(productId, quantity);
  renderCart();
}

function clearCartAndRender() {
  clearCart();
  renderCart();
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

function initStatsAnimation() {
  const statsSection = document.getElementById('stats-section');
  if (!statsSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsSection.dataset.animated) {
        statsSection.dataset.animated = 'true';
        animateStats();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsSection);
}

function animateStats() {
  const stats = [
    { id: 'stat-1', value: 50000, suffix: '+' },
    { id: 'stat-2', value: 99.9, suffix: '%' },
    { id: 'stat-3', value: 5, suffix: ' min' },
    { id: 'stat-4', value: 4.9, suffix: '/5' }
  ];

  stats.forEach(stat => {
    const element = document.getElementById(stat.id);
    if (!element) return;

    const duration = 2000;
    const steps = 60;
    const increment = stat.value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(increment * step, stat.value);

      if (stat.suffix === '%' || stat.suffix === '/5') {
        element.textContent = current.toFixed(1) + stat.suffix;
      } else {
        element.textContent = Math.floor(current).toLocaleString() + stat.suffix;
      }

      if (step >= steps) clearInterval(timer);
    }, duration / steps);
  });
}
