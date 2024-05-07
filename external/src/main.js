import './main.scss';

import Alpine from 'alpinejs';
import Swiper from 'swiper/bundle';

window.Alpine = Alpine;
window.Swiper = Swiper;

import focus from '@alpinejs/focus';
import collapse from '@alpinejs/collapse';
import anchor from '@alpinejs/anchor';

import './js/cart';

Alpine.plugin(focus);
Alpine.plugin(collapse);
Alpine.plugin(anchor);
Alpine.start();
