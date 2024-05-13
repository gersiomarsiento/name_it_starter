import Swiper from 'swiper/bundle';
import Alpine from 'alpinejs';

Alpine.data('product_gallery', () => ({
  swiperReference: null,
  init() {
    this.initSlider();
  },
  initSlider() {
    this.swiperReference = new Swiper(this.$refs.swiperContainer, {
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: this.$refs.pagination,
        clickable: true,
      },
    });
  },
}));
