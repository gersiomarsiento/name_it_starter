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
    const $cartDrawer = document.querySelector(defaults.cartDrawer);
    const $cartDrawerTrigger = document.querySelector(defaults.cartDrawerTrigger);
    const $cartDrawerClose = document.querySelector(defaults.cartDrawerClose);
    $cartDrawer.classList.add('is-open');
    $cartDrawerTrigger.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';

    this.openCartOverlay();

    setTimeout(() => $cartDrawerClose.focus(), 500);
  }

  static closeCartDrawer() {
    const $cartDrawer = document.querySelector(defaults.cartDrawer);
    const $cartDrawerTrigger = document.querySelector(defaults.cartDrawerTrigger);
    $cartDrawer.classList.remove('is-open');
    $cartDrawer.setAttribute('aria-hidden', 'true');
    $cartDrawerTrigger.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = 'auto';

    this.closeCartOverlay();

    setTimeout(() => $cartDrawerTrigger.focus(), 500);
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

    if (sections['cart-drawer']) {
      const drawerResponse = new DOMParser().parseFromString(sections['cart-drawer'], 'text/html');
      const drawerItems = document.querySelector(defaults.cartDrawerItems);
      drawerItems.innerHTML = drawerResponse.querySelector(defaults.cartDrawerItems).innerHTML;

      const drawerFooter = document.querySelector(defaults.cartDrawerFooter);
      if (drawerFooter != null) {
        drawerFooter.innerHTML = drawerResponse.querySelector(defaults.cartDrawerFooter).innerHTML;
      }
    }

    if (sections['cart']) {
      const cartSectionResponse = new DOMParser().parseFromString(sections['cart'], 'text/html');
      const cartSectionContainer = document.getElementById('shopify-section-cart');
      cartSectionContainer.innerHTML = cartSectionResponse.getElementById('shopify-section-cart').innerHTML;
    }
  }
}

Alpine.store('cart', {
  cart: Shopify.cart || {},
  cartIsUpdating: false,
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
      .then((response) => {
        if (response.status == 422) {
          console.error('Variant is out of stock');
        } else if (response.status != 200) {
          console.error('An error has occurred! Please try again.');
        }

        if (response.status != 200) {
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
      .then((response) => {
        if (response.status == 422) {
          console.error('Variant is out of stock');
        } else if (response.status != 200) {
          console.error('An error has occurred! Please try again.');
        }

        if (response.status != 200) {
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

    const items = [
      {
        id: formSerialize.id,
        quantity: formSerialize.quantity,
      },
    ];

    let formData = {
      items,
      sections: ['cart-drawer'],
      sections_url: window.location.pathname + '?request_type=ajax',
    };

    if (window.location.pathname.includes(Shopify.routes.cart_url)) formData.sections.push('cart');

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
      sections: ['cart-drawer'],
      sections_url: window.location.pathname + '?request_type=ajax',
    };
    if (window.location.pathname.includes(Shopify.routes.cart_url)) formData.sections.push('cart');

    CartUtils.setLoadingButton(button);
    let response = await this.changeJS(formData).finally(() => {
      CartUtils.setLoadingButton(button, false);
    });

    CartUtils.updateSections(response);
    this.updateCartJson(response);
  },

  async getDrawerUpdated() {
    let endPoint = Shopify.routes.root + '?sections=cart-drawer';

    if (window.location.pathname.includes(Shopify.routes.cart_url)) endendPoint = endPoint + ',cart';

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
    const responseHtml = new DOMParser().parseFromString(response.sections['cart-drawer'], 'text/html');
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
