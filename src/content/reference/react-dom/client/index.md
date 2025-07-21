---
title: İstemci React DOM API'leri
---

<Intro>

<<<<<<< HEAD
`React-dom/client` API'leri, React bileşenlerini istemcide (tarayıcıda) oluşturmanızı sağlar. Bu API’ler genellikle React ağacınızı başlatmak için uygulamanızın en üst seviyesinde kullanılır. Bir [framework](/learn/start-a-new-react-project#production-grade-react-frameworks) bunları sizin için çağırabilir. Bileşenlerinizin çoğu, bunları içe aktarmaya veya kullanmaya ihtiyaç duymaz.
=======
The `react-dom/client` APIs let you render React components on the client (in the browser). These APIs are typically used at the top level of your app to initialize your React tree. A [framework](/learn/creating-a-react-app#full-stack-frameworks) may call them for you. Most of your components don't need to import or use them.
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

</Intro>

---

## İstemci API'leri {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) React bileşenlerini bir tarayıcı DOM düğümü içinde görüntülemek için bir kök oluşturmanızı sağlar.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) React bileşenlerini, HTML içeriği daha önce [`react-dom/server`.](/reference/react-dom/server) tarafından oluşturulmuş bir tarayıcı DOM düğümü içinde görüntülemenizi sağlar

---

## Tarayıcı desteği {/*browser-support*/}

React, Internet Explorer 9 ve üzeri dahil olmak üzere tüm popüler tarayıcıları destekler. IE 9 ve IE 10 gibi eski tarayıcılarda bazı polyfill'ler gereklidir.




