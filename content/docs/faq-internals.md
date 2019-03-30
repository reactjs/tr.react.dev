---
id: faq-internals
title: Virtual DOM ve İç Dinamikler
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### Virtual DOM nedir? {#what-is-the-virtual-dom}

Virtual DOM (VDOM), bir UI'ın ideal veya "sanal" bir temsilinin bellekte tutulduğu ve ReactDOM gibi bir kütüphane tarafından "gerçek" DOM ​​ile senkronize edildiği bir programlama konseptidir. Bu sürece [uyumlaştırma](/docs/reconciliation.html) denir.

Bu yaklaşım, bildirimsel React API'sini etkinleştirir: React'e UI'ın hangi state'te olmasını istediğinizi söylersiniz ve DOM'un bu durumla eşleştiğinden emin olur. Bu, uygulamanızı oluşturmak için kullanmak zorunda kalacağınız özellik manipülasyonu, olay yönetimi ve manuel DOM güncellemesini özetler.

Since "virtual DOM" is more of a pattern than a specific technology, people sometimes say it to mean different things. In React world, the term "virtual DOM" is usually associated with [React elements](/docs/rendering-elements.html) since they are the objects representing the user interface. React, however, also uses internal objects called "fibers" to hold additional information about the component tree. They may also be considered a part of "virtual DOM" implementation in React.

"Virtual DOM" belirli bir teknolojiden daha ziyade bir kalıp olduğundan, insanlar bazen farklı şeyler ifade ettiğini söylüyor. React dünyasında, "virtual DOM" terimi genellikle [React elemanları](/docs/rendering-elements.html) ile ilişkilendirilir, çünkü bunlar kullanıcı arayüzünü temsil eden nesnelerdir. Bununla birlikte, React, bileşen ağacı hakkında ek bilgi tutmak için "fibers" adı verilen dahili nesneleri de kullanır. Ayrıca React'teki "virtual DOM" uygulamasının bir parçası olarak da düşünülebilirler.

### Is the Shadow DOM the same as the Virtual DOM? {#is-the-shadow-dom-the-same-as-the-virtual-dom}

No, they are different. The Shadow DOM is a browser technology designed primarily for scoping variables and CSS in web components. The virtual DOM is a concept implemented by libraries in JavaScript on top of browser APIs.

### What is "React Fiber"? {#what-is-react-fiber}

Fiber is the new reconciliation engine in React 16. Its main goal is to enable incremental rendering of the virtual DOM. [Read more](https://github.com/acdlite/react-fiber-architecture).
