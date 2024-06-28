import Alpine from 'alpinejs';
import Swiper from 'swiper/bundle';

window.Alpine = Alpine;
window.Swiper = Swiper;

import focus from '@alpinejs/focus';
import collapse from '@alpinejs/collapse';
import anchor from '@alpinejs/anchor';
import intersect from '@alpinejs/intersect';

import './js/product';
import './js/cart';

// Featured Collection Switcher Slider Swiper
Alpine.data('feat_collection_slider', () => ({
  init() {
    new Swiper('.swiper_feat_collection_slider_1', {
      direction: 'horizontal',
      loop: true,
      slidesPerView: 2,
      spaceBetween: 0,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
        1280: {
          slidesPerView: 5,
        },
      },
    });
    new Swiper('.swiper_feat_collection_slider_2', {
      direction: 'horizontal',
      loop: true,
      slidesPerView: 2,
      spaceBetween: 0,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
        1280: {
          slidesPerView: 5,
        },
      },
    });
  },
}));

Alpine.plugin(focus);
Alpine.plugin(collapse);
Alpine.plugin(anchor);
Alpine.plugin(intersect);
Alpine.start();
