import Alpine from 'alpinejs';
import serialize from 'form-serialize';

const defaults = {
  addToCartButton: '.js-add-to-cart',
  cartDrawer: '#cart-drawer',
  cartDrawerItems: '#cart-drawer-items',
  cartDrawerFooter: '#cart-drawer-footer',
  cartDrawerOverlay: '.cart-drawer-overlay',
  cartDrawerTrigger: '.js-cart-drawer-trigger',
  cartDrawerClose: '.js-cart-drawer-close',
  cartDrawerCartJson: '#ajax-cart-drawer-json',
  cartCount: '.cart-count',
  lineItem: '.cart-line-item',
  lineItemUpdate: '.js-cart-line-item-update',
  lineItemQuantity: '.js-cart-line-item-input-quantity',
  moneyFormat: Shopify.currency.default_money_format,
};

class CartUtils {
  static removeItemAnimation(item) {
    item.classList.add('is-invisible');
  }

  static openCartDrawer() {
    document.documentElement.style.overflow = 'hidden';
    Alpine.store('cart').drawerIsOpen = true;
    this.openCartOverlay();
  }

  static closeCartDrawer() {
    document.documentElement.style.overflow = 'auto';
    Alpine.store('cart').drawerIsOpen = false;
    this.closeCartOverlay();
  }

  static openCartOverlay() {
    document.querySelector(defaults.cartDrawerOverlay).classList.add('is-open');
  }

  static closeCartOverlay() {
    document.querySelector(defaults.cartDrawerOverlay).classList.remove('is-open');
  }

  static updateCartItemCount(cart) {
    if (cart.item_count == 0) {
      document.body.classList.add('cart-is-empty');
    } else {
      document.body.classList.remove('cart-is-empty');
    }

    document.querySelectorAll(defaults.cartCount).forEach((itemCount) => {
      itemCount.innerHTML = cart.item_count;
    });
  }

  static setLoadingButton(button, isLoading = true) {
    if (isLoading) {
      button.disabled = true;
      button.classList.add('processing-spinner');
    } else {
      button.disabled = false;
      button.classList.remove('processing-spinner');
    }
  }

  static updateSections(response) {
    if (!response.sections) return;

    CartUtils.getSectionsToRender().forEach((section) => {
      const sectionHtml = new DOMParser().parseFromString(response.sections[section.section], 'text/html');
      section.selectors.forEach((selector) => {
        document.querySelector(selector).innerHTML = sectionHtml.querySelector(selector).innerHTML;
      });
    });
  }

  static getSectionsToRender() {
    let sections = [
      {
        section: document.getElementById('cart-drawer').dataset.sectionId,
        selectors: [defaults.cartDrawerItems, defaults.cartDrawerFooter],
      },
    ];

    if (window.location.pathname.includes(Shopify.routes.cart_url)) {
      sections.push({
        section: document.getElementById('main-cart').dataset.sectionId,
        selectors: ['#main-cart'],
      });
    }

    return sections;
  }
}

Alpine.store('cart', {
  cart: Shopify.cart || {},
  cartIsUpdating: false,
  drawerIsOpen: false,
  init() {
    this.initClickListeners();
    this.initEventListeners();

    Alpine.effect(() => {
      CartUtils.updateCartItemCount(this.cart);
    });
  },

  async addJS(formData) {
    this.cartIsUpdating = true;
    return fetch(Shopify.routes.root + 'cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        if (response.status != 200) {
          const responseJson = await response.json();
          const message = responseJson.message || 'An error has occurred! Please try again.';
          alert(message);

          throw new Error();
        }

        return response.json();
      })
      .catch((e) => {
        throw new Error(e);
      })
      .finally(() => {
        this.cartIsUpdating = false;
      });
  },

  async changeJS(formData) {
    this.cartIsUpdating = true;
    return fetch(Shopify.routes.root + 'cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(async (response) => {
        if (response.status != 200) {
          const responseJson = await response.json();
          const message = responseJson.message || 'An error has occurred! Please try again.';
          alert(message);

          throw new Error();
        }

        return response.json();
      })
      .catch((e) => {
        throw new Error(e);
      })
      .finally(() => {
        this.cartIsUpdating = false;
      });
  },

  async addToCart(addToCartButton) {
    if (this.cartIsUpdating) return;

    let form = addToCartButton.closest('form');
    let formSerialize = serialize(form, { hash: true });
    const items = [formSerialize];

    let formData = {
      items,
      sections: CartUtils.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname + '?request_type=ajax',
    };

    CartUtils.setLoadingButton(addToCartButton);
    let response = await this.addJS(formData).finally(() => {
      CartUtils.setLoadingButton(addToCartButton, false);
    });

    CartUtils.updateSections(response);
    CartUtils.openCartDrawer();

    this.updateCartJson(response);
  },

  async updateCart(button) {
    if (this.cartIsUpdating) return;

    const type = button.dataset.type;
    const line = button.dataset.line;
    const quantityInput = button.closest(defaults.lineItem).querySelector(defaults.lineItemQuantity);
    const step = Number(quantityInput.step || 1);
    let quantity = Number(quantityInput.value || 0);

    switch (type) {
      case 'plus':
        quantity += step;
        break;
      case 'minus':
        quantity -= step;
        break;
      case 'remove':
        quantity = 0;
        break;
    }

    if (quantity === 0) {
      CartUtils.removeItemAnimation(button.closest(defaults.lineItem));
    }

    let formData = {
      line: line,
      quantity: quantity,
      sections: CartUtils.getSectionsToRender().map((section) => section.section),
      sections_url: window.location.pathname + '?request_type=ajax',
    };

    CartUtils.setLoadingButton(button);
    let response = await this.changeJS(formData).finally(() => {
      CartUtils.setLoadingButton(button, false);
    });

    CartUtils.updateSections(response);
    this.updateCartJson(response);
  },

  async getDrawerUpdated() {
    const sectionsToRender = CartUtils.getSectionsToRender()
      .map((section) => section.section)
      .join(',');

    let endPoint = Shopify.routes.root + '?request_type=ajax&sections=' + sectionsToRender;
    let sections = await fetch(endPoint)
      .then((res) => {
        return res.json();
      })
      .catch((e) => {
        throw new Error(e);
      });

    const response = {
      sections: sections,
    };

    CartUtils.updateSections(response);
    CartUtils.openCartDrawer();
    this.updateCartJson(response);
  },

  async updateCartJson(response) {
    const drawerSection = CartUtils.getSectionsToRender()[0].section;
    const responseHtml = new DOMParser().parseFromString(response.sections[drawerSection], 'text/html');
    this.cart = JSON.parse(responseHtml.querySelector(defaults.cartDrawerCartJson).textContent);
  },

  initClickListeners() {
    document.addEventListener('click', (e) => {
      const target = e.target;

      if (target.closest(defaults.addToCartButton)) {
        e.preventDefault();
        this.addToCart(target.closest(defaults.addToCartButton));
      }

      if (target.closest(defaults.lineItemUpdate)) {
        this.updateCart(target.closest(defaults.lineItemUpdate));
      }

      if (target.closest(defaults.cartDrawerTrigger)) {
        e.preventDefault();
        CartUtils.openCartDrawer();
      }

      if (target.closest(defaults.cartDrawerOverlay) || target.closest(defaults.cartDrawerClose)) {
        CartUtils.closeCartDrawer();
      }
    });
  },

  initEventListeners() {
    window.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        if (document.querySelector(defaults.cartDrawer).classList.contains('is-open')) {
          CartUtils.closeCartDrawer();
        }
      }
    });
  },
});
