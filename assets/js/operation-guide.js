(function () {
  'use strict';
  const videoPanels = Array.from(document.querySelectorAll('[data-video-version]'));
  const versionControls = Array.from(document.querySelectorAll('[name="guide-version"]'));
  // Only tested desktop Chromium gets a surface shortcut. Native controls consume
  // their own clicks there; mobile/LINE and unknown engines retain native behavior.
  const ua = navigator.userAgent;
  const nativeOnly = /Android|iPhone|iPad|iPod|\bLine\/|; wv\b/i.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  if (!nativeOnly && /\b(?:Chrome|Chromium|Edg)\//.test(ua)) {
    videoPanels.forEach(panel => {
      const video = panel.querySelector('video');
      video.addEventListener('click', event => {
        if (event.defaultPrevented || event.target !== video || document.fullscreenElement) return;
        event.preventDefault();
        if (video.paused) video.play().catch(() => {});
        else video.pause();
      });
    });
  }
  function pauseVideos() { videoPanels.forEach(panel => panel.querySelector('video').pause()); }
  function selectVideo() {
    pauseVideos();
    const selected = versionControls.find(control => control.checked).value;
    videoPanels.forEach(panel => { panel.hidden = panel.dataset.videoVersion !== selected; });
  }
  versionControls.forEach(control => control.addEventListener('change', selectVideo));
  document.addEventListener('visibilitychange', () => { if (document.hidden) pauseVideos(); });
  window.addEventListener('pagehide', pauseVideos);
  // Choose once by device; later navigation and viewport changes preserve user choice.
  const mobile = navigator.userAgentData?.mobile ?? /Android.*Mobile|iPhone|iPod|Windows Phone/i.test(navigator.userAgent);
  versionControls.forEach(control => { control.checked = control.value === (mobile ? 'mobile' : 'pc'); });
  selectVideo();
  window.RentalOperationGuide = {pause: pauseVideos};
})();
