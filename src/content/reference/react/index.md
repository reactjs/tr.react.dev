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

React DOM, yalnızca web uygulamaları (tarayıcı DOM ortamında çalışan) için desteklenen özellikleri içerir.  
Bu bölüm aşağıdaki başlıklara ayrılmıştır:

* [Hooks](/reference/react-dom/hooks) - Tarayıcı DOM ortamında çalışan web uygulamaları için kullanılan Hook’lar.
* [Components](/reference/react-dom/components) - React, tarayıcıya özgü yerleşik tüm HTML ve SVG bileşenlerini destekler.
* [APIs](/reference/react-dom) - `react-dom` paketi, yalnızca web uygulamalarında desteklenen metodları içerir.
* [Client APIs](/reference/react-dom/client) - `react-dom/client` API’leri, React bileşenlerini istemci tarafında (tarayıcıda) render etmeni sağlar.
* [Server APIs](/reference/react-dom/server) - `react-dom/server` API’leri, React bileşenlerini sunucu tarafında HTML’e dönüştürmene olanak tanır.
* [Static APIs](/reference/react-dom/static) - `react-dom/static` API’leri, React bileşenlerinden statik HTML üretmeni sağlar.

## React Compiler {/*react-compiler*/}

React Compiler, React bileşenlerinizi ve değerlerinizi otomatik olarak **memoize** eden bir derleme zamanı optimizasyon aracıdır:

* [Configuration](/reference/react-compiler/configuration) - React Compiler için yapılandırma seçenekleri.
* [Directives](/reference/react-compiler/directives) - Derlemeyi kontrol etmek için fonksiyon seviyesinde direktifler.
* [Compiling Libraries](/reference/react-compiler/compiling-libraries) - Önceden derlenmiş kütüphane kodu dağıtımı rehberi.

## ESLint Plugin React Hooks {/*eslint-plugin-react-hooks*/}

The [ESLint plugin for React Hooks](/reference/eslint-plugin-react-hooks) helps enforce the Rules of React:

* [Lints](/reference/eslint-plugin-react-hooks) - Detailed documentation for each lint with examples.

## Rules of React {/*rules-of-react*/}

React, kalıpların anlaşılması kolay ve yüksek kaliteli uygulamalar üretecek şekilde nasıl ifade edileceğine ilişkin deyimlere — veya kurallara — sahiptir:

* [Bileşenler ve Hook'lar saf olmalıdır](/reference/rules/components-and-hooks-must-be-pure) – Purity, kodunuzun anlaşılmasını, hata ayıklamasını kolaylaştırır ve React'in bileşenlerinizi ve hook'larınızın otomatik olarak doğru şekilde optimize etmesini sağlar.
* [React Bileşenleri ve Hook'ları çağırır](/reference/rules/react-calls-components-and-hooks) – React, kullanıcı deneyimini optimize etmek için gerektiğinde bileşenleri ve hook'ları oluşturmaktan sorumludur.
* [Hook Kuralları](/reference/rules/rules-of-hooks) – Hook'lar JavaScript fonksiyonları kullanılarak tanımlanır, ancak nerede çağrılabilecekleri konusunda kısıtlamaları olan özel bir yeniden kullanılabilir UI mantığı türünü temsil ederler.

## Eski API'ler {/*legacy-apis*/}

* [Eski API'ler](/reference/react/legacy) - `react` paketinden dışa aktarılır, ancak yeni yazılan kodlarda kullanılması önerilmez.
