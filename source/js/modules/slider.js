import {DataSelectors} from '../common/constants';
import {axiosHandler, qsa, qs} from '../common/utilities';
import Glide from '@glidejs/glide'

const ModuleClasses = {
  BULLETS: '.glide__bullets',
  SLIDES: '.glide__slides',
  GLIDE: '.glide',
};
const ClassesNames = {
  BULLET: 'glide__bullet',
  SLIDE: 'glide__slide',
  IMAGE: 'glide__image',
};
/**
* @implements {Iterable<element>}
*/
class SliderModule {
  /**
   * @param {element} element return the module/section elemet
   */
  constructor(element) {
    /**
     * Slider
     * @type {HTMLElement}
     * @private
     */
    this.slider = element;

    this.init();
  }

  /**
   * Init function
   */
  init() {
    this.slides  = qs(ModuleClasses.SLIDES, this.slider);
    this.bullets = qs(ModuleClasses.BULLETS, this.slider);

    axiosHandler.then((data) => {
      //removing some slides to match designs
      data.splice(0, 6);

      this.responseContent(data);
    });
  }

  /**
   * Axios promise response
   * @param {Array} data
   */
  responseContent(data) {
    data.forEach((element, index) => {
      this.buildCarousel(element, index);
    });
  };

  /**
   * Build Carousel and printing it in DOM
   * creating the Glide instance
   * @param {HTMLElement} el
   * @param {int} index
   */
  buildCarousel(el, index) {
    const bullet  = document.createElement('button');
    const slide   = document.createElement('li');
    const author  = document.createElement('span');
    const body    = document.createElement('p');
    const thumb   = document.createElement('img');

    body.innerHTML   = el.title;
    author.innerHTML = el.name;

    thumb.src = el.thumbnailUrl;
    thumb.classList.add(ClassesNames.IMAGE);
    bullet.classList.add(ClassesNames.BULLET);
    slide.classList.add(ClassesNames.SLIDE);
    bullet.dataset.glideDir = `=${index}`

    // appending slides && bullets
    slide.appendChild(thumb);
    slide.appendChild(body);
    slide.appendChild(author);

    this.slides.appendChild(slide);
    this.bullets.appendChild(bullet);

    /* TODO: for Glide team, seems like
    there is an error with the touch events */

    // instantiating slider after build the element
    new Glide(ModuleClasses.GLIDE, {
      type: 'carousel',
      startAt: 0
    }).mount();
  }
}

/**
 * Initializes all the instance of the component
 * @return {Array.<SliderModule>}
 */
export function init() {
  return [...qsa(DataSelectors.SLIDER_MODULE)]
      .map((el) => new SliderModule(el));
}
