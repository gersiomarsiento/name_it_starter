# GUÍA DE USO

Starter Shopify + Alpine.js + Tailwind css

* Instale las extensiones recomendadas en VSCode

## Configuración básica

Los archivos de desarrollo se encuentran en la carpeta `/external`

1. En `package.json` reemplace `dev-miguel-test-store` con el slug de su Store
2. `vite.config.js`

## Comandos

Ubíquese en la carpeta external e instale los paquetes de npm

```bash
cd external
npm install
```

Ejecute el servidor de desarrollo de Shopify

```bash
npm run shopify
```

Compile el javascript y css del proyecto (Output: `assets/main.js` - `assets/main.css`)

```bash
npm run dev
```

Obtener cambios del Customizer

```bash
npm run shopify:pull
```

## Proyecto

Archivos base en:

1. `/external/src/main.js`
2. `/external/src/main.js`

# ESTILOS

## Contenedor

Utilice la clase `.c-container` para delimitar contenedores en sus secciones. Modifiquelo en `/external/src/scss/globals.scss`.

```html
<section>
  <div class="c-container">
```

Puede utilizar el modificador `.wide` para un contenedor mas ancho

```html
<div class="c-container wide">
```

## Botones

Utilice las clases de botones de `/external/src/scss/buttons.scss`. Modifique o agregue nuevos botones.

```html
<button class="button-primary">...</button>
<a class="button-secondary" href="#">...</a>
````

Utilice los modificadores `.tiny`, `.small`, `.medium`, `.big`, `.no-borders`

Modifique los colores básicos y secundarios en `tailwind.config.js` > `colors: {}`

## Imágenes

Utilice el snippet `image-element.liquid` de la siguiente forma:

```liquid
{%- assign isPriorityLoad = false -%}

{%-
  render 'image-element',
  image: image
-%}
````

Puede utilizar modificadores y preloaders como en [image_tag](https://shopify.dev/docs/api/liquid/filters/image_tag) de Liquid:

```liquid
{%- assign preload = false -%}

{%- if section.index == 1 -%}
  {%- assign preload = true -%}
{%- endif %-}

{%-
  render 'image-element',
  image: image,
  preload: preload,
  class: 'YOUR CLASSES',
  max_width: 800
-%}
````

Por defecto la imagen se carga por lazyload

Modificadores:

* max_width
* fixed_width
* preload ➜ precarga imagen, utilizar con prudencia para reducir **CLS Y LCP**
* priority ➜ no precarga imagen, utiliza fetchpriority="high"
* class
* alt
* widths
* sizes
* style
* crop
* sizes

## Fuentes

Utilice las clases `.h1, ..., .h6` y `.body-1, ..., .body-6` de `/external/src/scss/fonts.scss`. *Por motivos de accesibilidad, se recomienda que ningun texto deba tener un font-size menor a **11px***.

```html
<p class="body-3">...</p>
<h2 class="h2">...</h2>
````

Para modificar el `font-family`:

* `global-style-fonts.liquid`
  * `--font-body-family`
  * `--font-heading-family`
* `tailwind.config.js`
  * `fontFamily: {}`

## Formularios

Utilice las clases `.form__input`, `.form__label`, `.form__input_range`, `.form__switch` de `/external/src/scss/form.scss`.

```html
{%- form 'contact' -%}
  <label class="form__label">...</label>

  <input type="text" class="form__input">

  <select class="form__input"></select>

  <textarea class="form__input"></textarea>

  <input type="range" class="form__input_range">

  <div class="form__switch">
    <input type="checkbox">
    <label for=""></label>
  </div>
{%- endfor -%}
````

## Párrafos

Utilice las clases `.richtext` para parrafos enriquecidos.

```html
<div class="richtext">
  {{- section.settings.description -}}
</div>
````

## Modal

Utilice el snippet `'modal'` para invocar modales.

```liquid
{%- capture modalContent -%}
  {%- render 'custom-content' -%}
{%- endcapture -%}

{%- render 'modal',
  modalContent: modalContent,
  id: 'YOUR_MODAL_ID',
  width: 600,
  class: '',
  hasPadding: true
-%}

<button data-modal="YOUR_MODAL_ID">...</button>
````

## Utilidades

Utilice o agregue nuevas utilidades css tailwind en `/external/src/scss/utilities.scss`. Tambien puede agregarlos en `tailwind.config.js`

## Animaciones

Utilice las clase `.processing-spinner` para animar botones de carga en solicitudes asincronas.

```html
<button class="button-primary" :class="{ 'processing-spinner': isLoading }">
  Some button
</button>
````

O utilice un svg de carga de tipo spinner

```html
<div x-show="isLoading">
  {%- render 'loading-spinner' -%}
</div>
````

# JAVASCRIPT

## Agregar al carrito

Utilice la clase `.js-add-to-cart` en los botones de agregar al carrito que requiera.

```html
{%- form 'product', product -%}
  ... 
  <button class="button-primary js-add-to-cart">Add to cart</button>
{%- endform -%}
````

Esto utilizará los datos del formulario para agregar el producto al carrito con los datos de cantidad y propiedades seleccionadas.

Puede modificar el funcionamiento en: `/external/src/js/cart.js`

## Recomendaciones

* No agregue directamente javascript no esencial a `external/main.js`. Excepto para las secciones **header, footer, PDP, PLP y secciones que considere esenciales**.
  * Puede afectar la performance del sitio tener un bundle extremadamente grande e innecesario.  
  * Puede encontrar un ejemplo más amplio en: `featured-collection.liquid`.  
  * Para secciones secundarias, se comienda utilizar utilidades de Alpine y Swiper en las secciones de la siguiente forma:

```html
<div x-data="SectionSlider">...</div>

<script>
document.addEventListener('alpine:init', () => {
  Alpine.data('SectionSlider', () => ({
    init() {
      new Swiper(...);
    },
    ...
  })
}, { once: true });
</script>
````

* Utilice snippets de liquid para encapsular logica especifica.
* Formatear siempre el codigo para evitar merge issues.

## Herramientas útiles

* Performance
  * [Page Speed](https://pagespeed.web.dev/?hl=en)
  * [GTmetrix](https://gtmetrix.com/)
* Accessibility
  * [Wave Report](https://wave.webaim.org/)
  * [WCAG 2 Checklit](https://webaim.org/standards/wcag/checklist)
  * [Contrast Checker](https://webaim.org/resources/linkcontrastchecker/)
  * Chrome Extensions:
    * [Axe Devtools](https://chromewebstore.google.com/detail/axe-devtools-web-accessib/lhdoppojpmngadmnindnejefpokejbdd?pli=1)
    * [Web Vitals](https://chromewebstore.google.com/detail/web-vitals/ahfhijdlegdabablpippeagghigmibma)
    * [Wave Report](https://chromewebstore.google.com/detail/wave-evaluation-tool/jbbplnpkjmmeebjpijfedlgcdilocofh)  

## License

[Dango Digital](https://dango.digital)
