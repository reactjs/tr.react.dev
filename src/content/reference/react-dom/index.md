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

## Kaynak Önceden Yükleme API'leri {/*resource-preloading-apis*/}

Bu API'ler, kaynakların (örneğin, betikler, stil sayfaları ve fontlar) önceden yüklenmesini sağlayarak uygulamaları daha hızlı hale getirmek için kullanılabilir. Örneğin, bu kaynakların kullanılacağı başka bir sayfaya geçmeden önce kaynakları yüklemek için kullanılabilir.

[React tabanlı frameworkler](/learn/start-a-new-react-project) sıklıkla kaynak yüklemeyi sizin için halleder, bu yüzden bu API'leri kendiniz çağırmanıza gerek kalmayabilir. Ayrıntılar için framework'ünüzün dökümantasyonuna başvurun.

* [`prefetchDNS`](/reference/react-dom/prefetchDNS), bağlanmayı beklediğiniz bir DNS alan adı adresinin IP adresini önceden yüklemenizi sağlar.
* [`preconnect`](/reference/react-dom/preconnect), hangi kaynakları kullanacağınızı bilmeseniz bile, kaynak talep etmeyi beklediğiniz bir sunucuya bağlanmanıza olanak tanır.
* [`preload`](/reference/react-dom/preload), kullanmayı beklediğiniz bir stil sayfasını, fontu, resmi veya harici betiği önceden yüklemenizi sağlar.
* [`preloadModule`](/reference/react-dom/preloadModule), kullanmayı beklediğiniz bir ESM modülünü önceden yüklemenizi sağlar.
* [`preinit`](/reference/react-dom/preinit), harici bir betiği önceden yükleyip değerlendirmenize veya bir stil sayfasını yükleyip yerleştirmenize olanak tanır.
* [`preinitModule`](/reference/react-dom/preinitModule), bir ESM modülünü önceden yükleyip değerlendirmenizi sağlar.

---

## Giriş noktaları {/*entry-points*/}

`react-dom` paketi iki ek giriş noktası sağlar:

* [`react-dom/client`](/reference/react-dom/client) React bileşenlerini istemcide (tarayıcıda) render etmek için API'ler içerir.
* [`react-dom/server`](/reference/react-dom/server) React bileşenlerini sunucuda oluşturmak için API'ler içerir.

---

## Kaldırılan API'ler {/*removed-apis*/}

Bu API'ler React 19'da kaldırılmıştır:

* [`findDOMNode`](https://18.react.dev/reference/react-dom/findDOMNode): [alternatifleri](https://18.react.dev/reference/react-dom/findDOMNode#alternatives) inceleyin.
* [`hydrate`](https://18.react.dev/reference/react-dom/hydrate): bunun yerine [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) kullanın.
* [`render`](https://18.react.dev/reference/react-dom/render): bunun yerine [`createRoot`](/reference/react-dom/client/createRoot) kullanın.
* [`unmountComponentAtNode`](/reference/react-dom/unmountComponentAtNode): bunun yerine [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) kullanın.
* [`renderToNodeStream`](https://18.react.dev/reference/react-dom/server/renderToNodeStream): bunun yerine [`react-dom/server`](/reference/react-dom/server) API'lerini kullanın.
* [`renderToStaticNodeStream`](https://18.react.dev/reference/react-dom/server/renderToStaticNodeStream): bunun yerine [`react-dom/server`](/reference/react-dom/server) API'lerini kullanın.
