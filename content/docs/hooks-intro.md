---
id: hooks-intro
title: Hook Tanıtımı
permalink: docs/hooks-intro.html
next: hooks-overview.html
---

*Hook'lar* React 16.8'deki yeni bir eklentidir. Bir sınıf yazmadan state ve diğer React özelliklerini kullanmanıza olanak sağlarlar.

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // "count" diyeceğimiz yeni bir state değişkeni tanımlayın
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Bu yeni `useState` fonksiyonu öğreneceğimiz ilk "Hook", ancak bu örnek sadece kısa bir tanıtım. Henüz bir anlam ifade etmiyorsa endişelenmeyin!

**[Bir sonraki sayfada](/docs/hooks-overview.html) Hook'ları öğrenmeye başlayabilirsiniz.** Bu sayfada, React'e Hook'ları neden eklediğimizi ve harika uygulamalar yazmanıza nasıl yardımcı olabileceklerini açıklayarak devam edeceğiz.

>Not
>
>React 16.8.0, Hook'ları destekleyen ilk sürümdür. Sürüm yükseltme yaparken, React DOM dahil olmak üzere tüm paketleri güncellemeyi unutmayın. React Native, Hook'ları bir sonraki stabil sürümde destekleyecek.

## Tanıtım Videosu {#video-introduction}

React 2018 Konferansı'nda, Sophie Alpert ve Dan Abramov Hook'ları tanıttı, ardından Ryan Florence bunları kullanmak için bir uygulamanın nasıl yeniden yapılandırılacağını gösterdi. Videoyu buradan izleyin:

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## Mevcut Kodu Bozan Değişiklikler Yok {#no-breaking-changes}

Devam etmeden önce, unutmayın ki Hook'lar:

* **Tamamen yerleşiktir.** Hook'ları mevcut herhangi bir kodu tekrar yazmadan birkaç bileşende deneyebilirsiniz. Fakat istemiyorsanız şu anda Hook'ları öğrenmek veya kullanmak zorunda değilsiniz.
* **100% geriye uyumludur.** Hook'lar mevcut kodu bozan herhangi bir değişiklik içermiyor.
* **Şu an kullanılabilir.** Hook'lar v16.8.0 sürümünün yayımlanması ile şu an kullanıma uygundur.

**React'ten sınıfları kaldırmak gibi bir planımız yok.** Hook'lar için kademeli kabul stratejisi hakkında daha fazla bilgiyi bu sayfanın [alt kısmında](#gradual-adoption-strategy) bulabilirsiniz.

**Hook'lar, React kavramları hakkındaki bilgilerinizin yerini almaz.** Bunun yerine, Hook'lar zaten bildiğiniz React kavramlarına (props, state, context, refs ve lifecycle) daha doğrudan bir API sağlar. Daha sonra göstereceğimiz gibi, Hook'lar bunları bir araya getirmek için yeni bir güçlü yol sunar.

**Sadece Hook'ları öğrenmeye başlamak istiyorsanız, [doğrudan bir sonraki sayfaya atlamaktan](/docs/hooks-overview.html) çekinmeyin!** Ayrıca neden Hook'ları eklediğimizi ve uygulamalarımızı yeniden kodlamadan nasıl kullanmaya başlayacağımızı öğrenmek için bu sayfayı okumaya devam edebilirsiniz.

## Motivasyon {#motivation}

Hook'lar, React'te beş yıldan fazla bir süredir yazdığımız ve on binlerce bileşenin bakımını yaptığımız çok çeşitli görünüşte birbirinden bağımsız sorunları çözüyor. React'i öğreniyor, günlük hayatınızda kullanıyor veya hatta benzer bir bileşen modeline sahip farklı bir kütüphaneyi tercih ediyor da olsanız, bu sorunların bazılarını fark edebilirsiniz.

### Bileşenler arasındaki durumsal mantığını yeniden kullanmak zor {#its-hard-to-reuse-stateful-logic-between-components}

React, bir bileşene yeniden kullanılabilir davranışları "iletmenin" bir yolunu sunmaz (örneğin, bir belleğe bağlamak). Bir süre React ile çalıştıysanız, bu sorunu çözmeye çalışan [prop'ları render etme](/docs/render-props.html) ve [yüksek dereceli bileşenler](/docs/higher-order-components.html) gibi kalıplara aşina olabilirsiniz. Ancak bu modeller, bileşenlerinizi kullandıkça yeniden yapılandırmanızı gerektirir ki bu da kullanışsızdır ve kodun takip edilmesini zorlaştırır. React DevTools'taki tipik bir React uygulamasına bakarsanız muhtemelen; sağlayıcı katmanları, tüketiciler, yüksek dereceli bileşenler, prop'ları render etmeler ve diğer soyutlamalar ile çevrili bileşenlerin "sarmalayıcı cehennemini" bulacaksınız. Bunları [DevTools'ta filtreleyebiliyor](https://github.com/facebook/react-devtools/pull/503) olsak da, bu daha derin bir soruna işaret ediyor: React'e, durumsal mantığı paylaşmak için daha iyi bir genel çözüm gerekli.

Hook'lar ile, bir bileşenden durumsal mantığı çıkarabilir, böylece bileşen bağımsız olarak test edilebilir ve yeniden kullanılabilir. **Hook'lar, bileşen hiyerarşinizi değiştirmeden durumsal mantığı yeniden kullanmanıza olanak sağlar.** Bu, Hook'ları birçok bileşen arasında veya toplulukla paylaşmayı kolaylaştırır.

Buna daha çok [Kendi Hook'larınızı Oluşturma](/docs/hooks-custom.html) bölümünde değineceğiz.

### Karmaşık bileşenlerin anlaşılması zorlaşıyor {#complex-components-become-hard-to-understand}

Basit bir şekilde başlayan, ancak yönetilemez bir durumsal mantık ve yan etki karmaşasına dönüşen bileşenlerin bakımını sıkça yapmak zorunda kaldık. Her yaşam döngüsü metodu çoğu zaman alakasız bir mantık karışımı içerir. Örneğin, bileşenler `componentDidMount` ve `componentDidUpdate` içerisinde bazı verileri getirebilir. Bununla birlikte, aynı `componentDidMount` yöntemi de, `componentWillUnmount` içerisinde gerçekleştirilen temizleme işlemiyle olay dinleyicilerini ayarlayan alakasız bir mantık içerebilir. Birlikte değişen karşılıklı ilişkili kod parçalanır, ancak tamamen ilişkisiz kod tek bir metotta bir araya gelmiş olur. Bu, hataları ve tutarsızlıkları ortaya çıkarmayı çok kolaylaştırır.

Çoğu durumda, bu bileşenleri daha küçük parçalara bölmek mümkün değil çünkü durumsal mantık darmadağın durumdadır. Test etmek de zordur. Bu, birçok insanın React'i ayrı bir state yönetimi kütüphanesiyle kullanmayı tercih etmelerinin nedenlerinden biridir. Ancak, bu genellikle çok fazla soyutlama getirir, farklı dosyalar arasında atlamanızı gerektirir ve bileşenleri yeniden kullanmayı daha da zorlaştırır.

Bunu çözmek için, yaşam döngüsü metotlarını baz alan bir ayrımı zorlamak yerine **Hook'lar, bir bileşeni hangi parçalarla ilgili olduğunu (bir abonelik ayarlamak veya veri almak gibi) baz alarak daha küçük fonksiyonlara ayırmanıza olanak tanır.** Ayrıca, daha öngörülebilir hale getirmek için bileşenin state durumunu bir reducer ile yönetmeyi de seçebilirsiniz.

Buna daha çok [Efekt Hook'unu Kullanma](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns) bölümünde değineceğiz.

### Sınıflar hem insanların hem de makinelerin kafasını karıştırıyor {#classes-confuse-both-people-and-machines}

Sınıfların, kodun yeniden kullanılmasını ve kod organizasyonunu zorlaştırmasının yanı sıra, React'i öğrenme konusunda büyük bir engel olabileceğini gördük. `Bunun` JavaScript'te nasıl çalıştığını anlamalısınız, bu birçok dilde nasıl çalıştığından çok farklı. Olay yöneticilerini bağlamayı için hatırlamanız gereklidir. Kararsız [sözdizimi önerileri](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/) olmadan, kod çok ayrıntılıdır. İnsanlar prop'ları, state'i ve yukarıdan aşağıya veri akışını mükemmel bir şekilde anlayabilir, ancak yine de sınıfları anlamak için çaba sarfedebilir. React'teki fonksiyon ve sınıf bileşenleri arasındaki ayrım ve her birinin ne zaman kullanılacağı, deneyimli React geliştiricileri arasında bile anlaşmazlıklara yol açar.

Additionally, React has been out for about five years, and we want to make sure it stays relevant in the next five years. As [Svelte](https://svelte.technology/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/), and others show, [ahead-of-time compilation](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) of components has a lot of future potential. Especially if it's not limited to templates. Recently, we've been experimenting with [component folding](https://github.com/facebook/react/issues/7323) using [Prepack](https://prepack.io/), and we've seen promising early results. However, we found that class components can encourage unintentional patterns that make these optimizations fall back to a slower path. Classes present issues for today's tools, too. For example, classes don't minify very well, and they make hot reloading flaky and unreliable. We want to present an API that makes it more likely for code to stay on the optimizable path.

To solve these problems, **Hooks let you use more of React's features without classes.** Conceptually, React components have always been closer to functions. Hooks embrace functions, but without sacrificing the practical spirit of React. Hooks provide access to imperative escape hatches and don't require you to learn complex functional or reactive programming techniques.

>Examples
>
>[Hooks at a Glance](/docs/hooks-overview.html) is a good place to start learning Hooks.

## Gradual Adoption Strategy {#gradual-adoption-strategy}

>**TLDR: There are no plans to remove classes from React.**

We know that React developers are focused on shipping products and don't have time to look into every new API that's being released. Hooks are very new, and it might be better to wait for more examples and tutorials before considering learning or adopting them.

We also understand that the bar for adding a new primitive to React is extremely high. For curious readers, we have prepared a [detailed RFC](https://github.com/reactjs/rfcs/pull/68) that dives into motivation with more details, and provides extra perspective on the specific design decisions and related prior art.

**Crucially, Hooks work side-by-side with existing code so you can adopt them gradually.** There is no rush to migrate to Hooks. We recommend avoiding any "big rewrites", especially for existing, complex class components. It takes a bit of a mindshift to start "thinking in Hooks". In our experience, it's best to practice using Hooks in new and non-critical components first, and ensure that everybody on your team feels comfortable with them. After you give Hooks a try, please feel free to [send us feedback](https://github.com/facebook/react/issues/new), positive or negative.

We intend for Hooks to cover all existing use cases for classes, but **we will keep supporting class components for the foreseeable future.** At Facebook, we have tens of thousands of components written as classes, and we have absolutely no plans to rewrite them. Instead, we are starting to use Hooks in the new code side by side with classes.

## Frequently Asked Questions {#frequently-asked-questions}

We've prepared a [Hooks FAQ page](/docs/hooks-faq.html) that answers the most common questions about Hooks.

## Next Steps {#next-steps}

By the end of this page, you should have a rough idea of what problems Hooks are solving, but many details are probably unclear. Don't worry! **Let's now go to [the next page](/docs/hooks-overview.html) where we start learning about Hooks by example.**
