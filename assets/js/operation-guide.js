(function () {
  'use strict';
  const videoPanels = Array.from(document.querySelectorAll('[data-video-version]'));
  const versionControls = Array.from(document.querySelectorAll('[name="guide-version"]'));
  // The separate hit area excludes native controls, avoiding duplicate toggles.
  videoPanels.forEach(panel => {
    const video = panel.querySelector('video');
    const toggle = panel.querySelector('[data-video-toggle]');
    if (!toggle) return;
    toggle.hidden = false;
    const label = () => toggle.setAttribute('aria-label', video.paused ? '播放影片' : '暫停影片');
    toggle.addEventListener('click', () => {
      if (video.paused) video.play().catch(() => toggle.setAttribute('aria-label', '重試播放影片'));
      else video.pause();
    });
    ['play', 'pause', 'ended'].forEach(type => video.addEventListener(type, label));
    label();
  });
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
