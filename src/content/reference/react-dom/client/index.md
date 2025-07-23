---
title: İstemci React DOM API'leri
---

<Intro>

`react-dom/client` API'leri, React bileşenlerini istemci tarafında (tarayıcıda) render etmenizi sağlar. Bu API'ler genellikle uygulamanızın en üst seviyesinde React ağacınızı başlatmak için kullanılır. Bir [framework](/learn/creating-a-react-app#full-stack-frameworks) bunları sizin için çağırabilir. Çoğu bileşeninizin bunları import etmesi veya kullanması gerekmez.

</Intro>

---

## İstemci API'leri {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) React bileşenlerini bir tarayıcı DOM düğümü içinde görüntülemek için bir kök oluşturmanızı sağlar.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) React bileşenlerini, HTML içeriği daha önce [`react-dom/server`.](/reference/react-dom/server) tarafından oluşturulmuş bir tarayıcı DOM düğümü içinde görüntülemenizi sağlar

---

## Tarayıcı desteği {/*browser-support*/}

React, Internet Explorer 9 ve üzeri dahil olmak üzere tüm popüler tarayıcıları destekler. IE 9 ve IE 10 gibi eski tarayıcılarda bazı polyfill'ler gereklidir.




