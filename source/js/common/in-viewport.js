export const type = {
  BOTTOM: 'bottom',
  CENTER: 'center',
  TOP: 'top',
  V_TOP: 'viewportTop',
  T_PART: 'thirdPart'
}

/**
 * Checks if the given element is shown on the center of viewport
 * @param {Element} el
 * @return {boolean} isInViewport indicator
 */
export function isInViewport(el, typeParam = 'center') {
  if (!el){
    return;
  }

  let top = el.offsetTop;
  let left = el.offsetLeft;
  let width = el.offsetWidth;
  let height = el.offsetHeight;
  let viewPortSection;

  while (el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  switch(typeParam) {
    case type.BOTTOM:
      viewPortSection = 1;
      break;
    case type.CENTER:
      viewPortSection = .5;
      break;
    case type.T_PART:
      viewPortSection = .7;
      break;
    case type.TOP:
      viewPortSection = .2;
      break;
    case type.V_TOP:
      viewPortSection = 1.03;
      break;
  }

  return (
      top < (window.pageYOffset + window.innerHeight * viewPortSection) &&
      left < (window.pageXOffset + window.innerWidth) &&
      (top + height) > window.pageYOffset &&
      (left + width) > window.pageXOffset
  );
};
