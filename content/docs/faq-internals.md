---
id: faq-internals
title: Virtual DOM ve İç Dinamikler
permalink: docs/faq-internals.html
layout: docs
category: FAQ
---

### Virtual DOM nedir? {#what-is-the-virtual-dom}

Virtual DOM (VDOM), bir UI'ın ideal veya "sanal" bir temsilinin bellekte tutulduğu ve ReactDOM gibi bir kütüphane tarafından "gerçek" DOM ​​ile senkronize edildiği bir programlama konseptidir. Bu sürece [uyumlaştırma](/docs/reconciliation.html) denir.

Bu yaklaşım, bildirimsel React API'sini etkinleştirir: React'e UI'ın hangi state'te olmasını istediğinizi söylersiniz ve DOM'ın bu durumla eşleştiğinden emin olur. Bu, uygulamanızı oluşturmak için kullanmak zorunda kalacağınız özellik manipülasyonu, olay yönetimi ve manuel DOM güncellemesini özetler.

"Virtual DOM" belirli bir teknolojiden daha ziyade bir kalıp olduğundan, insanlar bazen farklı şeyler ifade ettiğini söylüyor. React dünyasında, "virtual DOM" terimi genellikle [React elemanları](/docs/rendering-elements.html) ile ilişkilendirilir, çünkü bunlar kullanıcı arayüzünü temsil eden nesnelerdir. Bununla birlikte, React, bileşen ağacı hakkında ek bilgi tutmak için "fibers" adı verilen dahili nesneleri de kullanır. Ayrıca React'teki "virtual DOM" uygulamasının bir parçası olarak da düşünülebilirler.

### Shadow DOM, Virtual DOM ile aynı mı? {#is-the-shadow-dom-the-same-as-the-virtual-dom}

Hayır, farklılar. Shadow DOM, öncelikle web bileşenlerindeki değişkenleri ve CSS'i kapsamak için tasarlanmış bir tarayıcı teknolojisidir. Virtual DOM, JavaScript’teki kütüphaneler tarafından tarayıcı API’ları üzerine uygulanan bir kavramdır.

### "React Fiber" nedir? {#what-is-react-fiber}

Fiber, React 16'daki yeni uyumlaştırma motorudur. Ana hedefi, virtual DOM'ın artımlı render edilmesini sağlamaktır. [Devamını okuyun](https://github.com/acdlite/react-fiber-architecture).
