export default function useScrollTo() {
  return {
    top: toTop,
    bottom: toBottom,
    element: toElement,
    elementWithOffset: toElementWithOffset
  };
}

function toElement(selector: string) {
  const anchor = document.querySelector(selector);

  if (anchor) anchor.scrollIntoView({ behavior: 'smooth' });
}

function toElementWithOffset(selector: string, offset = 0) {
  if (!selector) return;
  const target = document.querySelector(selector);

  if (!target) return;
  const targetRect = target.getBoundingClientRect();

  window.scroll({
    behavior: 'smooth',
    top: targetRect.top + window.scrollY + offset
  });
}

function toTop() {
  window.scroll({ behavior: 'smooth', top: 0, left: 0 });
}

function toBottom() {
  window.scroll({
    behavior: 'smooth',
    top: document.documentElement.scrollHeight,
    left: 0
  });
}
