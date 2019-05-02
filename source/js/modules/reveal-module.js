import {DataSelectors, Events} from '../common/constants';
import {Module} from '../common/module';
import {isInViewport, type} from '../common/in-viewport';
import {debounce} from '../common/utilities';


const DEFAULT_TIMEOUT = 10;
const moduleClasses = {
  REVEAL: 'reveal',
};

/**
 * Fadein element when user scroll
 * @extends Module
 */
class RevealSection {
  /**
   * @param {element} element return the module/section element
   */
  constructor(element) {
    /**
     * The element
     * @type {HTMLElement}
     * @private
     */
    this.element = element;

    /**
     * Marks if the section has already been revealed.
     * @type {boolean}
     */
    this.reveal = false;

    this.init();
  }

  /**
   * Init function
   */
  init() {
    // Add animation on scroll, debouncing the event
    const scrollListener = debounce(() => {
      this.revealEvent();
    }, DEFAULT_TIMEOUT);

    window.addEventListener(Events.SCROLL, scrollListener, false);

    this.revealEvent();
  }

  /**
   * Reveal event
   */
  revealEvent() {
    if (!this.reveal_ && isInViewport(this.element, type.V_TOP)) {
      this.element.classList.add(moduleClasses.REVEAL);
      this.reveal = true;
    }
  }
}

/**
 * Initializes all the instance of the component
 * @return {Array.<RevealSection>}
 */
export function init() {
  return [...document.querySelectorAll(DataSelectors.REVEAL_MODULE)]
      .map((el) => new RevealSection(el));
}
