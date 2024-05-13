# Guía de uso

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


## License

[Dango Digital](https://dango.digital)