---
title: React Başvuru Dökümanına Genel Bakış
---

<Intro>

Bu bölüm, React ile çalışmak için ayrıntılı başvuru dökumanı belgeleri sağlar. React'e giriş için lütfen [Öğren](/learn) bölümünü ziyaret edin.

</Intro>

React başvuru dökumanı belgeleri işlevsel alt bölümlere ayrılmıştır:

## React {/*react*/}

Programatik React özellikleri:

* [Hooks](/reference/react/hooks) - Bileşenlerinizdeki farklı React özelliklerini kullanın.
* [Bileşenler](/reference/react/components) - JSX'inizde kullanabileceğiniz yerleşik bileşenler.
* [APIs](/reference/react/apis) - Bileşenleri tanımlamak için yararlı olan API'ler.
* [Direktifler](/reference/rsc/directives) - React Sunucu Bileşenleri ile uyumlu paketleyicilere talimatlar sağlayın.

## React DOM {/*react-dom*/}

React-dom, yalnızca web uygulamaları (tarayıcı DOM ortamında çalışan) için desteklenen özellikler içerir. Bu bölüm aşağıdakilere ayrılmıştır:

* [Hooks](/reference/react-dom/hooks) - Tarayıcı DOM ortamında çalışan web uygulamaları için hooks.
* [Bileşenler](/reference/react-dom/components) - React, tarayıcıda yerleşik HTML ve SVG bileşenlerinin tümünü destekler.
* [APIs](/reference/react-dom) - `react-dom` paketi yalnızca web uygulamalarında desteklenen yöntemleri içerir.
* [İstemci APIs](/reference/react-dom/client) - `react-dom/client` API'leri, React bileşenlerini istemcide (tarayıcıda) oluşturmanızı sağlar.
* [Sunucu APIs](/reference/react-dom/server) - `react-dom/server` API'leri React bileşenlerini sunucuda HTML'ye dönüştürmenizi sağlar.

## Rules of React {/*rules-of-react*/}

React has idioms — or rules — for how to express patterns in a way that is easy to understand and yields high-quality applications:

* [Components and Hooks must be pure](/reference/rules/components-and-hooks-must-be-pure) – Purity makes your code easier to understand, debug, and allows React to automatically optimize your components and hooks correctly.
* [React calls Components and Hooks](/reference/rules/react-calls-components-and-hooks) – React is responsible for rendering components and hooks when necessary to optimize the user experience.
* [Rules of Hooks](/reference/rules/rules-of-hooks) – Hooks are defined using JavaScript functions, but they represent a special type of reusable UI logic with restrictions on where they can be called.

## Legacy APIs {/*legacy-apis*/}

* [Legacy APIs](/reference/react/legacy) - Exported from the `react` package, but not recommended for use in newly written code.
