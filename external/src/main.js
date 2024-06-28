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

Alpine.plugin(focus);
Alpine.plugin(collapse);
Alpine.plugin(anchor);
Alpine.plugin(intersect);
Alpine.start();
