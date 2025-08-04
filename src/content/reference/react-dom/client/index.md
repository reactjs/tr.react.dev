---
title: İstemci React DOM API'leri
---

<Intro>

<<<<<<< HEAD
`react-dom/client` API'leri, React bileşenlerini istemci tarafında (tarayıcıda) render etmenizi sağlar. Bu API'ler genellikle uygulamanızın en üst seviyesinde React ağacınızı başlatmak için kullanılır. Bir [framework](/learn/creating-a-react-app#full-stack-frameworks) bunları sizin için çağırabilir. Çoğu bileşeninizin bunları import etmesi veya kullanması gerekmez.
=======
The `react-dom/client` APIs let you render React components on the client (in the browser). These APIs are typically used at the top level of your app to initialize your React tree. A [framework](/learn/start-a-new-react-project#full-stack-frameworks) may call them for you. Most of your components don't need to import or use them.
>>>>>>> e07ac94bc2c1ffd817b13930977be93325e5bea9

</Intro>

---

## İstemci API'leri {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) React bileşenlerini bir tarayıcı DOM düğümü içinde görüntülemek için bir kök oluşturmanızı sağlar.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) React bileşenlerini, HTML içeriği daha önce [`react-dom/server`.](/reference/react-dom/server) tarafından oluşturulmuş bir tarayıcı DOM düğümü içinde görüntülemenizi sağlar

---

## Tarayıcı desteği {/*browser-support*/}

React, Internet Explorer 9 ve üzeri dahil olmak üzere tüm popüler tarayıcıları destekler. IE 9 ve IE 10 gibi eski tarayıcılarda bazı polyfill'ler gereklidir.




