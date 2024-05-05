import './main.scss';

import Alpine from 'alpinejs';
import Swiper from 'swiper/bundle';

window.Alpine = Alpine;
window.Swiper = Swiper;

import focus from '@alpinejs/focus';

Alpine.plugin(focus);
Alpine.start();
