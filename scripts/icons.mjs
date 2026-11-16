// Original card artwork. Keep all 16 symbols here; no runtime dependency or font.
export const cardIcons = Object.freeze({
  owner: '<path d="m3 10 7-6 7 6M5 9v11h7M8 20v-6h4"/><circle cx="18" cy="15" r="3"/><path d="m16 17-3 3m1-1 1 1"/>',
  tenant: '<circle cx="8" cy="7" r="3"/><path d="M2.5 20v-2a5.5 5.5 0 0 1 8.5-4.6"/><circle cx="18" cy="12" r="3"/><path d="M18 15v6m0-2h3"/>',
  apply: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 10h8m-8 4h3m1 3 2 2 4-5"/>',
  tutorial: '<rect x="3" y="3" width="18" height="14" rx="2"/><path d="m10 7 5 3-5 3zM8 21h8m-4-4v4"/>',
  helper: '<path d="M8 19H4l-1 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-6"/><path d="M9.5 8a2.5 2.5 0 1 1 4 2c-1 .6-1.5 1-1.5 2m0 2.5v.1"/>',
  standard: '<path d="m2 9 7-6 7 6M4 8v12h5m-2-6h2"/><rect x="12" y="10" width="9" height="12" rx="2"/><path d="M15 13h3m-3 3h.1m2.9 0h.1M15 19h.1m2.9 0h.1"/>',
  ordinary: '<path d="m3 9 7-6 7 6M5 8v12h5m-2-6h3"/><circle cx="18" cy="14" r="3"/><path d="m16 16-5 5m2-2 1.5 1.5"/>',
  public: '<path d="m3 10 9-7 9 7M5 9v11h14V9"/><path d="M12 18s-4-2.5-4-5a2.2 2.2 0 0 1 4-1.2A2.2 2.2 0 0 1 16 13c0 2.5-4 5-4 5Z"/>',
  social: '<path d="M3 21V7l8-4 8 4v3M7 9h1m4 0h1m-6 4h1m-1 4h1m3 4H2"/><path d="m17 12 5 2v3c0 2-2 4-5 5-3-1-5-3-5-5v-3zM15 17l1.5 1.5L19 16"/>',
  personal: '<rect x="4" y="3" width="13" height="18" rx="2"/><path d="M8 7h5m-5 4h3m-3 4h1m3 0 5-4 5 4m-9-1v7h8v-7m-5 7v-4h2v4"/>',
  subsidy: '<path d="m3 9 7-6 7 6M5 8v10H3m5-5h4"/><path d="M3 21h12l6-5a2 2 0 0 0-3-1l-3 2H9m0 0h4a2 2 0 0 0 0-4h-2"/>',
  search: '<path d="m3 10 8-7 8 7M5 9v11h5m-1-6h3"/><circle cx="16" cy="15" r="4"/><path d="m19 18 3 3"/>',
  questions: '<path d="M13 11H5l-3 3V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M6 7h7"/><rect x="11" y="11" width="10" height="11" rx="2"/><path d="M14 15h4m-4 3h3"/>',
  online: '<rect x="3" y="3" width="18" height="14" rx="2"/><path d="M8 21h8m-4-4v4m0-4v-7m-3 3 3-3 3 3M7 7h3"/>',
  building: '<circle cx="9" cy="6" r="2.5"/><path d="M5 13v-1a4 4 0 0 1 8 0v1m4-2V4h4v7M3 13h18v8M6 17h7m-7 4v-4m11-4v8"/>',
  mail: '<rect x="3" y="7" width="15" height="13" rx="2"/><path d="m3 9 7.5 5L18 9M7 3h13a2 2 0 0 1 2 2v11"/>'
});

export function cardIcon(name) {
  if (!Object.hasOwn(cardIcons, name)) throw new Error(`Unknown card icon: ${name}`);
  return `<svg data-card-icon="${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${cardIcons[name]}</svg>`;
}
