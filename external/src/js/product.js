import Swiper from 'swiper/bundle';
import Alpine from 'alpinejs';

Alpine.data('product_gallery', () => ({
  swiperReference: null,
  init() {
    this.initSlider();
    let self = this;
    window.productGalleryGoToSlide = (index) => self.goToSlide(index);
  },
  initSlider() {
    swiperThumbs = new Swiper(this.$refs.swiperThumbs, {
      slidesPerView: 4,
      spaceBetween: 10,
    });

    this.swiperReference = new Swiper(this.$refs.swiperContainer, {
      slidesPerView: 1,
      spaceBetween: 10,
      pagination: {
        el: this.$refs.pagination,
        clickable: true,
      },
      navigation: {
        nextEl: this.$refs.next_arrow,
        prevEl: this.$refs.prev_arrow,
      },
      thumbs: {
        swiper: swiperThumbs,
      },
    });
  },
  goToSlide(index) {
    let index0 = parseInt(index) - 1;
    this.swiperReference.slideTo(index0);
  },
}));
