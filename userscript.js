// ==UserScript==
// @name         Back Out of Images
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://cohost.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cohost.org
// @grant        none
// @run-at       document-end
// @noframes
// ==/UserScript==

(function() {
  function waitForElement(selector, callback) {
    // Check if element already exists
    const element = document.querySelector(selector);
    if (element) {
      return callback(element);
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        callback(element);
      }
    });
    observer.observe(document.body, {childList: true, subtree: true});
  }

  let viewingImages = false;
  const observer = new MutationObserver(() => {
    const headlessUIImage = document.querySelector('#headlessui-portal-root img[src^="https://staging.cohostcdn.org/attachment/"]');

    if (viewingImages && !headlessUIImage) {
      history.back();
    } else if (!viewingImages && headlessUIImage) {
      viewingImages = true;
      history.pushState({source: 'cohost-back-out-of-images-userscript'}, '');
    }
  });

  waitForElement('#headlessui-portal-root', (headlessUIRoot) => {
    observer.observe(headlessUIRoot, {childList: true, subtree: true});
  });

  window.addEventListener('popstate', (event) => {
    if (viewingImages) {
      const headlessUIImage = document.querySelector('#headlessui-portal-root img[src^="https://staging.cohostcdn.org/attachment/"]');
      if (headlessUIImage) {
        headlessUIImage.click();
      }

      viewingImages = false;
    }
  });
})();
