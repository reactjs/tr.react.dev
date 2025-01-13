---
title: React DOM API'leri
---

<Intro>

`react-dom` paketi, sadece tarayıcı DOM ortamında çalışan web uygulamaları için desteklenen yöntemleri içerir. React Native için desteklenmezler.

</Intro>

---

## API'ler {/*apis*/}

Bu API'ler bileşenlerinizden içe aktarılabilirler. Nadiren kullanılırlar:

* [`createPortal`](/reference/react-dom/createPortal) alt bileşenleri DOM ağacındaki farklı bir bölüme render etmenizi sağlar.
* [`flushSync`](/reference/react-dom/flushSync) React'i bir state güncellemesini hemen uygulamaya zorlayarak senkronize şekilde DOM'u güncellemenizi sağlar.

## Resource Preloading APIs {/*resource-preloading-apis*/}

These APIs can be used to make apps faster by pre-loading resources such as scripts, stylesheets, and fonts as soon as you know you need them, for example before navigating to another page where the resources will be used.

[React-based frameworks](/learn/start-a-new-react-project) frequently handle resource loading for you, so you might not have to call these APIs yourself. Consult your framework's documentation for details.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS) lets you prefetch the IP address of a DNS domain name that you expect to connect to.
* [`preconnect`](/reference/react-dom/preconnect) lets you connect to a server you expect to request resources from, even if you don't know what resources you'll need yet.
* [`preload`](/reference/react-dom/preload) lets you fetch a stylesheet, font, image, or external script that you expect to use.
* [`preloadModule`](/reference/react-dom/preloadModule) lets you fetch an ESM module that you expect to use.
* [`preinit`](/reference/react-dom/preinit) lets you fetch and evaluate an external script or fetch and insert a stylesheet.
* [`preinitModule`](/reference/react-dom/preinitModule) lets you fetch and evaluate an ESM module.

---

## Giriş noktaları {/*entry-points*/}

`react-dom` paketi iki ek giriş noktası sağlar:

* [`react-dom/client`](/reference/react-dom/client) React bileşenlerini istemcide (tarayıcıda) render etmek için API'ler içerir.
* [`react-dom/server`](/reference/react-dom/server) React bileşenlerini sunucuda oluşturmak için API'ler içerir.

---

<<<<<<< HEAD
## Kullanımdan kaldırılmış API'ler {/*deprecated-apis*/}

<Deprecated>

Bu API'ler React'in gelecekteki bir ana sürümünde kaldırılacaktır.

</Deprecated>

* [`findDOMNode`](/reference/react-dom/findDOMNode) bir sınıf bileşeni öğesine karşılık gelen en yakın DOM düğümünü bulur.
* [`hydrate`](/reference/react-dom/hydrate) sunucu HTML'inden oluşturulan DOM'a bir ağaç bağlar. [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) ile değiştirilmiştir.
* [`render`](/reference/react-dom/render) bir ağacı DOM'a bağlar. [`createRoot`](/reference/react-dom/client/createRoot) ile değiştirilmiştir.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode) bir ağacı DOM'dan kaldırır. [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) ile değiştirilmiştir.
=======
## Removed APIs {/*removed-apis*/}

These APIs were removed in React 19:
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): see [alternatives](https://18.react.dev/reference/react-dom/findDOMNode#alternatives).
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): use [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) instead.
* [`render`](https://18.react.dev/reference/react-dom/render): use [`createRoot`](/reference/react-dom/client/createRoot) instead.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): use [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) instead.
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): use [`react-dom/server`](/reference/react-dom/server) APIs instead.
