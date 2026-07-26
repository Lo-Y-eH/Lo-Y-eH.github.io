(function () {
  'use strict';

  function initializeScene() {
    var scene = document.getElementById('not-found');
    var loader = document.getElementById('scene-loader');
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!scene || !loader) {
      return;
    }

    if (reducedMotion) {
      scene.classList.add('is-ready');
      loader.remove();
      return;
    }

    window.requestAnimationFrame(function () {
      scene.classList.add('is-ready');
      loader.classList.add('is-leaving');
    });

    loader.addEventListener('transitionend', function () {
      loader.remove();
    }, { once: true });

    window.setTimeout(function () {
      if (loader.parentNode) {
        loader.remove();
      }
    }, 1400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeScene);
  } else {
    initializeScene();
  }
}());
