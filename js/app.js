// Global navigation function - optimized for instant response
window.nav = function(url) {
  // Use replace to avoid adding to history for faster perceived speed
  window.location.href = url;
};

// Global auth view switcher
window.switchAuthView = function(view) {
  var tabs = document.querySelectorAll('.auth-toggle div');
  tabs.forEach(function(d) { d.classList.remove('on'); });
  
  var tab = document.querySelector('[data-authview="' + view + '"]');
  if (tab) tab.classList.add('on');
  
  var views = document.querySelectorAll('.auth-view');
  views.forEach(function(v) { v.classList.remove('active'); });
  
  var activeView = document.getElementById('auth-' + view);
  if (activeView) activeView.classList.add('active');
};

// Global notification tab switcher
window.switchNotifTab = function(el, tab) {
  var tabs = document.querySelectorAll('.notif-tab');
  tabs.forEach(function(t) { t.classList.remove('on'); });
  el.classList.add('on');
  
  var views = document.querySelectorAll('.notif-view');
  views.forEach(function(v) { v.classList.remove('active'); });
  
  var activeView = document.getElementById('notif-' + tab);
  if (activeView) activeView.classList.add('active');
};

// Global send AI text function
window.sendAIText = function() {
  var input = document.getElementById('ai-text-input');
  if (input && input.value.trim()) {
    // Simulate sending message
    var msg = input.value;
    input.value = '';
    // In a real app, this would send to a server
  }
};

// Global send AI suggestion function
window.sendAI = function(el) {
  if (el && el.textContent) {
    var msg = el.textContent;
    // In a real app, this would send to a server
  }
};

// Performance optimization: Preload critical resources
if ('requestIdleCallback' in window) {
  requestIdleCallback(function() {
    // Preload next likely pages
    var links = document.querySelectorAll('[onclick*="nav"]');
    links.forEach(function(link) {
      var match = link.getAttribute('onclick').match(/nav\('([^']+)'\)/);
      if (match && match[1]) {
        var link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = match[1];
        document.head.appendChild(link);
      }
    });
  });
}

// Optimize page transitions with faster rendering
document.addEventListener('DOMContentLoaded', function() {
  // Remove any unnecessary animations during initial load
  document.body.style.opacity = '1';
  
  // Initialize any lazy-loaded content
  var lazyElements = document.querySelectorAll('[data-lazy]');
  lazyElements.forEach(function(el) {
    el.classList.add('loaded');
  });
});

// Minimize reflows by batching DOM updates
var pendingUpdates = [];
var updateScheduled = false;

function scheduleUpdate(fn) {
  pendingUpdates.push(fn);
  if (!updateScheduled) {
    updateScheduled = true;
    requestAnimationFrame(function() {
      pendingUpdates.forEach(function(fn) { fn(); });
      pendingUpdates = [];
      updateScheduled = false;
    });
  }
}

// Cache frequently accessed elements
var cachedElements = {};

function getCachedElement(selector) {
  if (!cachedElements[selector]) {
    cachedElements[selector] = document.querySelector(selector);
  }
  return cachedElements[selector];
}

// Modal management
window.openModal = function(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
};

window.closeModal = function(modalId) {
  var modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
};

// Initialize modal event listeners
document.addEventListener('DOMContentLoaded', function() {
  // Open modal buttons
  var openButtons = document.querySelectorAll('[data-open-modal]');
  openButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var modalId = this.getAttribute('data-open-modal');
      openModal(modalId);
    });
  });
  
  // Close modal buttons
  var closeButtons = document.querySelectorAll('[data-close-modal]');
  closeButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var modalId = this.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });
  
  // Close modal when clicking overlay
  var modals = document.querySelectorAll('.modal-overlay');
  modals.forEach(function(modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === this) {
        closeModal(this.id);
      }
    });
  });
});

// Add shareholder function
window.addShareholder = function() {
  var name = document.getElementById('sh-new-name');
  var addr = document.getElementById('sh-new-addr');
  var nin = document.getElementById('sh-new-nin');
  var pct = document.getElementById('sh-new-pct');
  
  // Validate required fields
  if (!name || !name.value.trim()) {
    alert('Please enter shareholder name');
    return;
  }
  if (!addr || !addr.value.trim()) {
    alert('Please enter residential address');
    return;
  }
  if (!nin || !nin.value.trim()) {
    alert('Please enter NIN or BVN');
    return;
  }
  if (!pct || !pct.value || parseInt(pct.value) < 1 || parseInt(pct.value) > 99) {
    alert('Please enter valid ownership percentage (1-99%)');
    return;
  }
  
  // Create shareholder card
  var initials = name.value.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().slice(0, 2);
  var card = document.createElement('div');
  card.className = 'sh-card';
  card.innerHTML = '<div class="sh-card-head"><div class="sh-card-info"><div class="sh-avatar">' + initials + '</div><div><div class="sh-name">' + name.value + '</div><div class="sh-role">Shareholder</div></div></div><div class="sh-pct">' + pct.value + '%</div></div><div class="sh-detail">NIN: ••• •••• ' + nin.value.slice(-3) + ' · ' + addr.value + '</div><button class="sh-edit" data-open-modal="sh-modal">Edit details</button>';
  
  // Add to list
  var list = document.getElementById('sh-list');
  if (list) {
    list.insertBefore(card, list.querySelector('.add-strip'));
  }
  
  // Clear form and close modal
  if (name) name.value = '';
  if (addr) addr.value = '';
  if (nin) nin.value = '';
  if (pct) pct.value = '';
  closeModal('sh-modal');
};

// Add witness function
window.addWitness = function() {
  var name = document.getElementById('wit-new-name');
  
  // Validate required fields
  if (!name || !name.value.trim()) {
    alert('Please enter witness name');
    return;
  }
  
  // Create witness card
  var initials = name.value.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase().slice(0, 2);
  var card = document.createElement('div');
  card.className = 'sh-card';
  card.innerHTML = '<div class="sh-card-head"><div class="sh-card-info"><div class="sh-avatar">' + initials + '</div><div><div class="sh-name">' + name.value + '</div><div class="sh-role">Witness</div></div></div></div><button class="sh-edit" data-open-modal="wit-modal">Edit details</button>';
  
  // Add to list
  var list = document.getElementById('wit-list');
  if (list) {
    list.insertBefore(card, list.querySelector('.add-strip'));
  }
  
  // Clear form and close modal
  if (name) name.value = '';
  closeModal('wit-modal');
};
