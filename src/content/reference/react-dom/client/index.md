---
title: İstemci React DOM API'leri
---

<Intro>

`React-dom/client` API'leri, React bileşenlerini istemcide (tarayıcıda) oluşturmanızı sağlar. Bu API’ler genellikle React ağacınızı başlatmak için uygulamanızın en üst seviyesinde kullanılır. Bir [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) bunları sizin için çağırabilir. Bileşenlerinizin çoğu, bunları içe aktarmaya veya kullanmaya ihtiyaç duymaz.

</Intro>

---

## İstemci API'leri {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) React bileşenlerini bir tarayıcı DOM düğümü içinde görüntülemek için bir kök oluşturmanızı sağlar.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) React bileşenlerini, HTML içeriği daha önce [`react-dom/server`.](/reference/react-dom/server) tarafından oluşturulmuş bir tarayıcı DOM düğümü içinde görüntülemenizi sağlar

---

## Tarayıcı desteği {/*browser-support*/}

React, Internet Explorer 9 ve üzeri dahil olmak üzere tüm popüler tarayıcıları destekler. IE 9 ve IE 10 gibi eski tarayıcılarda bazı polyfill'ler gereklidir.




