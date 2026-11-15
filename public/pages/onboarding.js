(function () {
  function message(key, substitutions) {
    try {
      return globalThis.chrome?.i18n?.getMessage(key, substitutions) || '';
    } catch (_) {
      return '';
    }
  }

  // Keep translated copy as text. Inline keys and emphasis are existing DOM nodes,
  // represented by native message placeholders so each language can reorder them.
  const slotToken = (index) => `\uE000${index}\uE001`;
  const localizedNodes = Array.from(document.querySelectorAll('[data-i18n]'));
  localizedNodes.reverse().forEach((node) => {
    const slots = Array.from(node.children).filter((child) => child.hasAttribute('data-i18n-slot'));
    const translated = message(node.dataset.i18n, slots.map((_, index) => slotToken(index)));
    if (!translated) return;
    if (!slots.length) {
      node.textContent = translated;
      return;
    }

    const pieces = translated.split(/(\uE000\d+\uE001)/);
    const usedSlots = new Set();
    let validSlots = true;
    const content = document.createDocumentFragment();
    pieces.forEach((piece) => {
      const match = /^\uE000(\d+)\uE001$/.exec(piece);
      const index = match ? Number(match[1]) : -1;
      if (slots[index] && !usedSlots.has(index)) {
        usedSlots.add(index);
        content.append(slots[index].cloneNode(true));
      } else {
        if (match) validSlots = false;
        content.append(document.createTextNode(piece));
      }
    });
    // A missing placeholder must not hide a keyboard key or a setting name.
    if (validSlots && usedSlots.size === slots.length) node.replaceChildren(content);
  });

  ['aria-label', 'alt'].forEach((attribute) => {
    document.querySelectorAll(`[data-i18n-${attribute}]`).forEach((node) => {
      const translated = message(node.getAttribute(`data-i18n-${attribute}`));
      if (translated) node.setAttribute(attribute, translated);
    });
  });
  document.documentElement.lang = message('panelLocale') || 'en';
  document.documentElement.dir = message('panelDirection') || 'ltr';

  const panelImages = new Map([
    ['en', '../assets/tabshow-panel-2.4.png'],
    ['de', '../assets/tabshow-panel-2.4-de.png'],
    ['zh-CN', '../assets/tabshow-panel-2.4-zh_CN.png'],
    ['zh-TW', '../assets/tabshow-panel-2.4-zh_TW.png'],
  ]);
  const englishPanelImage = panelImages.get('en');
  const localizedPanelImage = panelImages.get(document.documentElement.lang) || englishPanelImage;
  document.querySelectorAll('img[data-localized-panel-image]').forEach((image) => {
    if (localizedPanelImage !== englishPanelImage) {
      image.addEventListener('error', () => { image.src = englishPanelImage; }, { once: true });
    }
    image.src = localizedPanelImage;
  });

  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
  const shortcutText = isMac ? 'Command + Shift + X' : 'Ctrl + Shift + X';

  document.querySelectorAll('[data-copy-shortcuts]').forEach((button) => {
    button.addEventListener('click', async () => {
      const label = button.querySelector('[data-copy-label]');
      try {
        await navigator.clipboard.writeText('chrome://extensions/shortcuts');
        if (label) label.textContent = message('pagesCopied') || 'Copied';
      } catch (_) {
        const code = button.querySelector('code');
        if (code) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(code);
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }
        if (label) label.textContent = message('pagesSelected') || 'Selected';
      }
      window.setTimeout(() => { if (label) label.textContent = message('pagesCopy') || 'Copy'; }, 1800);
    });
  });

  document.querySelectorAll('[data-open-panel]').forEach((button) => {
    button.addEventListener('click', async () => {
      const statusNodes = document.querySelectorAll('[data-panel-status]');
      try {
        if (!globalThis.chrome?.sidePanel?.open || !globalThis.chrome?.windows?.getCurrent) throw new Error('Side panel API unavailable');
        const currentWindow = await chrome.windows.getCurrent();
        await chrome.sidePanel.open({ windowId: currentWindow.id });
        statusNodes.forEach((node) => { node.textContent = message('pagesPanelOpened') || 'TabShow is open. Search for a tab or choose one from the list.'; });
      } catch (_) {
        statusNodes.forEach((node) => { node.textContent = message('pagesPanelOpenFallback', [shortcutText]) || `Use the toolbar icon or press ${shortcutText} to open TabShow.`; });
      }
    });
  });
})();
