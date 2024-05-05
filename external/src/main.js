// import Alpine from 'alpinejs';
import Alpine from 'alpinejs';

// import Swiper bundle with all modules installed
import Swiper from 'swiper/bundle';

// import styles bundle
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

window.Alpine = Alpine;

import focus from '@alpinejs/focus';

// load swiper when document is loaded
document.addEventListener('DOMContentLoaded', function () {
  const swiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    slidesPerView: 2,
    spaceBetween: 30,
  });
});

Alpine.data('timelineCarousel', () => ({
  init() {
    new Swiper('.timelineCarousel', {
      direction: 'horizontal',
      loop: false,
      slidesPerView: 'auto',
      spaceBetween: 8,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      scrollbar: {
        el: '.swiper-scrollbar',
        draggable: true,
      },
      mousewheel: {
        forceToAxis: true,
      },
      freeMode: true,
    });
  },
}));

Alpine.plugin(focus);
Alpine.start();
