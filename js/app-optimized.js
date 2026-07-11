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
