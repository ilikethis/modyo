/**
 * Dependencies injection
 * @typedef {utilities|module|constants}
 */
import {Events, ClassesNames, DataSelectors} from '../common/constants';
import {debounce, qsa, qs} from '../common/utilities';
import {Module} from '../common/module';

/**
 * destructure variables
 * @enum {events}
 */
const {CLICK, SCROLL} = Events;
/**
 * destructure variables
 * @enum {string}
 */
const {HIDE} = ClassesNames;
/**
 * destructure variables
 * @enum {string}
 */
const {HEADER_MODULE} = DataSelectors;

/**
 * Module classes.
 * @enum {string}
 */
const ModuleClasses = {
  HAMBURGUER: '.hamburguer',
  HAMBURGUER_ACTION: '.hamburguer-action',
};

/**
 * Module classes names.
 * @enum {string}
 */
const ModuleClassesNames = {
  SHOWING_DRAWER: 'showing-drawer',
};
/**
 * Header Module
 * Extends Module section
 * @implements {Iterable<element>}
 */
class HeaderModule extends Module {
  /**
   * @param {Element} element return the module/section elemet
   */
  constructor(element) {
    super();
    /**
     * The element
     * @type {HTMLElement}
     * @private
     */
    this.element = element;
    /**
     * Hamburguer HTMLelement
     * @type {HTMLelement}
     */
    this.hamburguer = null;
    /**
     * Set the initial scroll position
     * @type {number}
     */
    this.lastScrollTop = 0;
    /**
     * Scroll Handler
     * @type {function}
     */
    this.debouncedScrollHandler = null;
    /**
     * toggle menu status
     * @type {boolean}
    */
    this.menuOpen = null;

    /**
     * Header Height
     * @type {number}
     */
    this.height = this.element.getBoundingClientRect().height;

    this.init();
  }

  /**
   * Init function
   */
  init() {
    this.hamburguer = qs(ModuleClasses.HAMBURGUER, this.element);
    this.hamburguerAction = qsa(ModuleClasses.HAMBURGUER_ACTION, this.element);
    this.debouncedScrollHandler = debounce(this.hideHeader.bind(this), 0, true, false);
    this.bindEvents();
  }
  /**
   * Check menu status
   * @type {function}
   * @param {elem} hamburguer element
   */
  checkStatus(elem) {
    this.menuOpen = !elem.checked;
    let htmlElem = document.documentElement;

    document.body.classList.toggle(ModuleClassesNames.SHOWING_DRAWER,
      this.menuOpen);
    htmlElem.classList.toggle(ModuleClassesNames.SHOWING_DRAWER,
      this.menuOpen);
  }
  /**
   * Hide header function
   * @type {function}
   */
  hideHeader() {
    if (!this.menuOpen) {
      const scrollTop = window.pageYOffset ||
        document.documentElement.scrollTop;
      const direction = scrollTop > this.height && scrollTop > this.lastScrollTop;

      if (scrollTop >= this.element.offsetHeight) {
        this.element.classList.toggle(HIDE, direction);
      }

      this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }
  }
  /**
   * bind events
   */
  bindEvents() {
    this.hamburguerAction.forEach((element) => {
      element.addEventListener(CLICK, ()=> {
        this.checkStatus(this.hamburguer);
      });
    });

    window.addEventListener(SCROLL, this.debouncedScrollHandler);
  }
}
/**
 * Initializes all the instance of the component
 * @return {Array.<HeaderModule>}
 */
exports.init = function() {
  return [...qsa(DataSelectors.HEADER_MODULE)]
      .map((el) => new HeaderModule(el));
};
