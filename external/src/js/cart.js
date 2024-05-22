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
  sections: {
    cartDrawer: 'cart-drawer',
    mainCart: 'main-cart',
  },
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
    const sections = response.sections;

    if (sections[defaults.sections.cartDrawer]) {
      const sectionCartDrawerText = sections[defaults.sections.cartDrawer].replace('loading="lazy"', 'loading="eager"');
      const drawerResponse = new DOMParser().parseFromString(sectionCartDrawerText, 'text/html');
      const drawerItems = document.querySelector(defaults.cartDrawerItems);
      drawerItems.innerHTML = drawerResponse.querySelector(defaults.cartDrawerItems).innerHTML;

      const drawerFooter = document.querySelector(defaults.cartDrawerFooter);
      if (drawerFooter != null) {
        drawerFooter.innerHTML = drawerResponse.querySelector(defaults.cartDrawerFooter).innerHTML;
      }
    }

    if (sections[defaults.sections.mainCart]) {
      const cartSectionResponse = new DOMParser().parseFromString(sections[defaults.sections.mainCart], 'text/html');
      const cartSectionContainer = document.getElementById(defaults.sections.mainCart);
      cartSectionContainer.innerHTML = cartSectionResponse.getElementById(defaults.sections.mainCart).innerHTML;
    }
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
      sections: [defaults.sections.cartDrawer],
      sections_url: window.location.pathname + '?request_type=ajax',
    };

    if (window.location.pathname.includes(Shopify.routes.cart_url)) formData.sections.push(defaults.sections.mainCart);

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
      sections: [defaults.sections.cartDrawer],
      sections_url: window.location.pathname + '?request_type=ajax',
    };
    if (window.location.pathname.includes(Shopify.routes.cart_url)) formData.sections.push(defaults.sections.mainCart);

    CartUtils.setLoadingButton(button);
    let response = await this.changeJS(formData).finally(() => {
      CartUtils.setLoadingButton(button, false);
    });

    CartUtils.updateSections(response);
    this.updateCartJson(response);
  },

  async getDrawerUpdated() {
    let endPoint = Shopify.routes.root + '?request_type="ajax&sections=' + defaults.sections.cartDrawer;

    if (window.location.pathname.includes(Shopify.routes.cart_url))
      endendPoint = endPoint + ',' + defaults.sections.mainCart;

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
    const responseHtml = new DOMParser().parseFromString(response.sections[defaults.sections.cartDrawer], 'text/html');
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
