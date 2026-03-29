// Selectors that target Google AI Overview containers
const AI_OVERVIEW_SELECTORS = [
  '[data-attrid="SGE"]',
  '.vx5jAb',           // AI overview card wrapper
  '.M8OgIe',           // Another AI snippet wrapper  
  '[jsname="yEVEwb"]', // AI overview jsname
  '.YzccPd',           // AI overview container
  'ai-overview',       // Custom element tag
  '[data-content-feature="1"]',
  '.c2xzTb',           // SGE container
  '.osrp-blk',         // AI overview block
  '.kno-rdesc',        // Knowledge panel AI content
];

const STAMP_CLASS = 'ai-overview-stamped';
const STAMP_ID_PREFIX = 'ai-stamp-';

let stampCounter = 0;

function createStamp() {
  const stamp = document.createElement('div');
  stamp.className = 'ai-stamp-overlay';
  stamp.innerHTML = `
    <div class="ai-stamp-inner">
      <div class="ai-stamp-border">
        <div class="ai-stamp-text">
          <span class="ai-stamp-line1">THIS</span>
          <span class="ai-stamp-line2">SHIT</span>
          <span class="ai-stamp-line3">SUCKS</span>
        </div>
        <div class="ai-stamp-stars">★ ★ ★</div>
      </div>
    </div>
  `;
  return stamp;
}

function stampElement(el) {
  if (el.classList.contains(STAMP_CLASS)) return;
  el.classList.add(STAMP_CLASS);

  // Make sure the element is positioned so we can overlay
  const pos = getComputedStyle(el).position;
  if (pos === 'static' || pos === '') {
    el.style.position = 'relative';
  }

  const stamp = createStamp();
  stamp.id = STAMP_ID_PREFIX + (stampCounter++);
  el.appendChild(stamp);

  // Trigger animation after a tiny delay for drama
  requestAnimationFrame(() => {
    setTimeout(() => {
      stamp.classList.add('ai-stamp-slam');
    }, 150);
  });
}

function scanAndStamp() {
  for (const selector of AI_OVERVIEW_SELECTORS) {
    try {
      document.querySelectorAll(selector).forEach(el => {
        // Only stamp if it's reasonably sized (actual content, not tiny bits)
        if (el.offsetHeight > 40) {
          stampElement(el);
        }
      });
    } catch (e) {
      // Selector might be invalid in some contexts
    }
  }

  // Also scan by text content / aria labels as fallback
  document.querySelectorAll('[aria-label*="AI Overview"], [aria-label*="AI overview"]').forEach(el => {
    if (el.offsetHeight > 40) stampElement(el);
  });
}

// Initial scan
scanAndStamp();

// Watch for dynamic content (Google loads stuff async)
const observer = new MutationObserver(() => {
  scanAndStamp();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
