(function () {
  const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent);
  const shortcutText = isMac ? 'Command + Shift + X' : 'Ctrl + Shift + X';

  document.querySelectorAll('[data-copy-shortcuts]').forEach((button) => {
    button.addEventListener('click', async () => {
      const label = button.querySelector('[data-copy-label]');
      try {
        await navigator.clipboard.writeText('chrome://extensions/shortcuts');
        if (label) label.textContent = 'Copied';
      } catch (_) {
        const code = button.querySelector('code');
        if (code) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(code);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        if (label) label.textContent = 'Selected';
      }
      window.setTimeout(() => { if (label) label.textContent = 'Copy'; }, 1800);
    });
  });

  document.querySelectorAll('[data-open-panel]').forEach((button) => {
    button.addEventListener('click', async () => {
      const statusNodes = document.querySelectorAll('[data-panel-status]');
      try {
        if (!globalThis.chrome?.sidePanel?.open || !globalThis.chrome?.windows?.getCurrent) throw new Error('Side panel API unavailable');
        const currentWindow = await chrome.windows.getCurrent();
        await chrome.sidePanel.open({ windowId: currentWindow.id });
        statusNodes.forEach((node) => { node.textContent = 'TabShow is open—hover a tab to preview it.'; });
      } catch (_) {
        statusNodes.forEach((node) => { node.textContent = `Use the toolbar icon or press ${shortcutText} to open TabShow.`; });
      }
    });
  });
})();
