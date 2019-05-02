//Custom components
import { init as headerInit } from './partials/header';
import { init as sliderModuleInit } from './modules/slider';
import { init as revealModule } from './modules/reveal-module';

(function(window) {
  document.addEventListener('DOMContentLoaded', () => {
    // Partials
    headerInit();

    // Modules
    sliderModuleInit();
    revealModule();
  });
})(window);
