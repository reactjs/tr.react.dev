---
id: hooks-intro
title: Hook'lara Giriş
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
<<<<<<< HEAD
>React 16.8.0, Hook'ları destekleyen ilk sürümdür. Sürüm yükseltme yaparken, React DOM dahil olmak üzere tüm paketleri güncellemeyi unutmayın. 
>React Native, Hook'ları [0.59 sürümünden itibaren](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059) desteklemektedir.
=======
>React 16.8.0 is the first release to support Hooks. When upgrading, don't forget to update all packages, including React DOM.
>React Native has supported Hooks since [the 0.59 release of React Native](https://reactnative.dev/blog/2019/03/12/releasing-react-native-059).
>>>>>>> 26caa649827e8f8cadd24dfc420ea802dcbee246

## Tanıtım Videosu {#video-introduction}

React 2018 Konferansı'nda, Sophie Alpert ve Dan Abramov Hook'ları tanıttı, ardından Ryan Florence bunları kullanmak için bir uygulamanın nasıl yeniden yapılandırılacağını gösterdi. Videoyu buradan izleyin:

<br>

<iframe width="650" height="366" src="//www.youtube.com/embed/dpw9EHDh2bM" frameborder="0" allowfullscreen></iframe>

## Mevcut Kodu Bozan Değişiklikler Yok {#no-breaking-changes}

Devam etmeden önce, unutmayın ki Hook'lar:

* **Tamamen opsiyoneldir.** Hook'ları mevcut herhangi bir kodu tekrar yazmadan birkaç bileşende deneyebilirsiniz. Fakat istemiyorsanız şu anda Hook'ları öğrenmek veya kullanmak zorunda değilsiniz.
* **100% geriye uyumludur.** Hook'lar mevcut kodu bozan herhangi bir değişiklik içermiyor.
* **Şu an kullanılabilir.** Hook'lar v16.8.0 sürümünün yayımlanması ile şu an kullanıma uygundur.

**React'ten sınıfları kaldırmak gibi bir planımız yok.** Hook'lar için kademeli kabul stratejisi hakkında daha fazla bilgiyi bu sayfanın [alt kısmında](#gradual-adoption-strategy) bulabilirsiniz.

**Hook'lar, React kavramları hakkındaki bilgilerinizin yerini almaz.** Bunun yerine, Hook'lar zaten bildiğiniz React kavramlarına (props, state, context, refs ve lifecycle) daha doğrudan bir API sağlar. Daha sonra göstereceğimiz gibi, Hook'lar bunları bir araya getirmek için yeni bir güçlü yol sunar.

**Sadece Hook'ları öğrenmeye başlamak istiyorsanız, [doğrudan bir sonraki sayfaya atlamaktan](/docs/hooks-overview.html) çekinmeyin!** Ayrıca neden Hook'ları eklediğimizi ve uygulamalarımızı yeniden kodlamadan nasıl kullanmaya başlayacağımızı öğrenmek için bu sayfayı okumaya devam edebilirsiniz.

## Motivasyon {#motivation}

Hook'lar, React'te beş yıldan fazla bir süredir yazdığımız ve on binlerce bileşenin bakımını yaptığımız çok çeşitli görünüşte birbirinden bağımsız sorunları çözüyor. React'i öğreniyor, günlük hayatınızda kullanıyor veya hatta benzer bir bileşen modeline sahip farklı bir kütüphaneyi tercih ediyor da olsanız, bu sorunların bazılarını fark edebilirsiniz.

### Bileşenler arasındaki stateful logic'i yeniden kullanmak zor {#its-hard-to-reuse-stateful-logic-between-components}

React, bir bileşene yeniden kullanılabilir davranışları "iletmenin" bir yolunu sunmaz (örneğin, bir store'a bağlamak). Bir süre React ile çalıştıysanız, bu sorunu çözmeye çalışan [prop'ları render etme](/docs/render-props.html) ve [higher-order bileşenler](/docs/higher-order-components.html) gibi kalıplara aşina olabilirsiniz. Ancak bu modeller, bileşenlerinizi kullandıkça yeniden yapılandırmanızı gerektirir ki bu da kullanışsızdır ve kodun takip edilmesini zorlaştırır. React DevTools'ta tipik bir React uygulamasına bakarsanız, büyük olasılıkla; sağlayıcılar, tüketiciler, higher-order bileşenler, prop'ları render etme ve diğer soyutlamala katmanları ile çevrili bileşenlerin “wrapper hell” problemini bulacaksınız. Bunları [DevTools'ta filtreleyebiliyor](https://github.com/facebook/react-devtools/pull/503) olsak da, bu daha derin bir soruna işaret ediyor: React'e, stateful logic'i paylaşmak için daha iyi bir genel çözüm gerekli.

Hook'lar ile, bir bileşenden stateful logic çıkarabilir, böylece bileşen bağımsız olarak test edilebilir ve yeniden kullanılabilir. **Hook'lar, bileşen hiyerarşinizi değiştirmeden stateful logic'i yeniden kullanmanıza olanak sağlar.** Bu, Hook'ları birçok bileşen arasında veya toplulukla paylaşmayı kolaylaştırır.

Buna daha çok [Kendi Hook'larınızı Oluşturma](/docs/hooks-custom.html) bölümünde değineceğiz.

### Karmaşık bileşenlerin anlaşılması zorlaşıyor {#complex-components-become-hard-to-understand}

Basit bir şekilde başlayan, ancak yönetilemez bir stateful logic ve yan etki karmaşasına dönüşen bileşenlerin bakımını sıkça yapmak zorunda kaldık. Her yaşam döngüsü metodu çoğu zaman alakasız bir mantık karışımı içerir. Örneğin, bileşenler `componentDidMount` ve `componentDidUpdate` içerisinde bazı verileri getirebilir. Bununla birlikte, aynı `componentDidMount` yöntemi de, `componentWillUnmount` içerisinde gerçekleştirilen temizleme işlemiyle olay dinleyicilerini ayarlayan alakasız bir mantık içerebilir. Birlikte değişen karşılıklı ilişkili kod parçalanır, ancak tamamen ilişkisiz kod tek bir metotta bir araya gelmiş olur. Bu, hataları ve tutarsızlıkları ortaya çıkarmayı çok kolaylaştırır.

Çoğu durumda, bu bileşenleri daha küçük parçalara bölmek mümkün değil çünkü stateful logic darmadağın durumdadır. Test etmek de zordur. Bu, birçok insanın React'i ayrı bir state yönetimi kütüphanesiyle kullanmayı tercih etmelerinin nedenlerinden biridir. Ancak, bu genellikle çok fazla soyutlama getirir, farklı dosyalar arasında atlamanızı gerektirir ve bileşenleri yeniden kullanmayı daha da zorlaştırır.

Bunu çözmek için, yaşam döngüsü metotlarını baz alan bir ayrımı zorlamak yerine **Hook'lar, bir bileşeni hangi parçalarla ilgili olduğunu (bir abonelik ayarlamak veya veri almak gibi) baz alarak daha küçük fonksiyonlara ayırmanıza olanak tanır.** Ayrıca, daha öngörülebilir hale getirmek için bileşenin state durumunu bir reducer ile yönetmeyi de seçebilirsiniz.

Buna daha çok [Efekt Hook'unu Kullanma](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns) bölümünde değineceğiz.

### Sınıflar hem insanların hem de makinelerin kafasını karıştırıyor {#classes-confuse-both-people-and-machines}

<<<<<<< HEAD
Sınıfların, kodun yeniden kullanılmasını ve kod organizasyonunu zorlaştırmasının yanı sıra, React'i öğrenme konusunda büyük bir engel olabileceğini gördük. `Bunun` JavaScript'te nasıl çalıştığını anlamalısınız, bu birçok dilde nasıl çalıştığından çok farklı. Olay yöneticilerini bağlamayı için hatırlamanız gereklidir. Kararsız [sözdizimi önerileri](https://babeljs.io/docs/en/babel-plugin-transform-class-properties/) olmadan, kod çok ayrıntılıdır. İnsanlar prop'ları, state'i ve yukarıdan aşağıya veri akışını mükemmel bir şekilde anlayabilir, ancak yine de sınıfları anlamak için çaba sarfedebilir. React'teki fonksiyon ve sınıf bileşenleri arasındaki ayrım ve her birinin ne zaman kullanılacağı, deneyimli React geliştiricileri arasında bile anlaşmazlıklara yol açar.
=======
In addition to making code reuse and code organization more difficult, we've found that classes can be a large barrier to learning React. You have to understand how `this` works in JavaScript, which is very different from how it works in most languages. You have to remember to bind the event handlers. Without [ES2022 public class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields#public_instance_fields), the code is very verbose. People can understand props, state, and top-down data flow perfectly well but still struggle with classes. The distinction between function and class components in React and when to use each one leads to disagreements even between experienced React developers.
>>>>>>> 26caa649827e8f8cadd24dfc420ea802dcbee246

Ayrıca, React 5 yıldır mevcut ve önümüzdeki 5 yıl için de kalıcı olacağından emin olmak istiyoruz. [Svelte](https://svelte.dev/), [Angular](https://angular.io/), [Glimmer](https://glimmerjs.com/) ve diğerlerinin gösterdiği gibi, bileşenlerin [önceden yapılmış derlemeler](https://en.wikipedia.org/wiki/Ahead-of-time_compilation) çok fazla gelecek potansiyeli var. Özellikle de şablonlarla sınırlı değilse. Son zamanlarda, [Prepack](https://prepack.io/) kullanarak [bileşen katlama](https://github.com/facebook/react/issues/7323) ile deneme yaptık ve ilk sonuçların umut verici olduğunu gözlemledik. Bununla birlikte, sınıf bileşenlerinin bu optimizasyonları daha yavaş bir yola geri çekmesini sağlayan istemsiz kalıpları teşvik edebileceğini gördük. Sınıflar da bugünün araçları için sorunlar sunmaktadır. Örneğin, sınıflar çok küçültmezler ve hot reloading'i tuhaf ve güvenilmez yaparlar. Kodun optimize edilebilir yolda kalmasını daha kolay kılan bir API sunmak istiyoruz.

Bu sorunları çözmek için, **Hook'lar, sınıfsız şekilde React'in özelliklerini daha fazla kullanmanızı sağlar.** Kavramsal olarak, React bileşenleri her zaman fonksiyonlara daha yakın olmuştur. Hook'lar React'in pratik ruhundan ödün vermeden. fonksiyonları kucaklar. Hook'lar, mecburi kaçış kapaklarına erişim sağlar ve karmaşık fonksiyonel veya reaktif programlama tekniklerini öğrenmenizi gerektirmez.

>Örnekler
>
>[Bir Bakışta Hook'lar](/docs/hooks-overview.html), Hook'ları öğrenmeye başlamak için iyi bir yer.

## Kademeli Kabul Stratejisi {#gradual-adoption-strategy}

>**Kısaca: Sınıfları React'ten kaldırmak gibi bir planımız yok.**

React geliştiricilerinin ürünlerini teslim etmeye odaklandığını ve yayımlanan her yeni API’yı incelemeye zamanlarının olmadığını biliyoruz. Hook'lar çok yeni ve öğrenmeyi veya benimsemeyi düşünmeden önce daha fazla örnek ve öğretici beklemek daha iyi olabilir.

<<<<<<< HEAD
Meraklı okuyucular için, daha detaylıca motivasyonu işleyen ve belirli tasarım kararları ve önceki ilgili teknikler hakkında ekstra perspektif sağlayan [detaylı RFC](https://github.com/reactjs/rfcs/pull/68)'i hazırladık.
=======
We also understand that the bar for adding a new primitive to React is extremely high. For curious readers, we have prepared a [detailed RFC](https://github.com/reactjs/rfcs/pull/68) that dives into the motivation with more details, and provides extra perspective on the specific design decisions and related prior art.
>>>>>>> 26caa649827e8f8cadd24dfc420ea802dcbee246

**Önemli olan Hook'lar, mevcut kodla yan yana çalışır, böylece bunları aşamalı olarak kullanabilirsiniz.** Hook'lara geçmeniz için acele etmenize gerek yok. Özellikle mevcut, karmaşık sınıf bileşenlerinizi "yeniden yazmak"tan kaçınmanızı öneririz. “Hook'ları anlamak" biraz zaman alabilir. Tecrübelerimize göre, Hook'ları öncelikle yeni ve kritik olmayan bileşenlerde kullanarak pratik yapmak ve ekibinizdeki herkesin kendisini bunu konuda rahat hissetmesini sağlamak en iyisi. Hook'ları denedikten sonra, lütfen bize olumlu ya da olumsuz [geri bildirim gönderin](https://github.com/facebook/react/issues/new).

Hook'ların sınıflar için mevcut tüm kullanım durumlarını kapsamasını istiyoruz, ancak **öngörülebilir gelecek için sınıf bileşenlerini desteklemeye devam edeceğiz.** Facebook'ta, sınıf olarak yazılmış on binlerce bileşene sahibiz ve bunları yeniden yazmak için kesinlikle hiçbir planımız yok. Bunun yerine, yeni kodda Hook'ları yan yana sınıflarla kullanmaya başlıyoruz.

## Sıkça Sorulan Sorular {#frequently-asked-questions}

Hook'lar hakkında en sık sorulan soruları cevaplayan bir [Hook'lar için SSS sayfası](/docs/hooks-faq.html) hazırladık.

## Sonraki Adımlar {#next-steps}

Bu sayfanın sonunda, Hook'ların hangi problemleri çözdüğü hakkında kabaca bir fikriniz olmalı, ancak birçok detay muhtemelen belirsiz. Merak etmeyin! **Şimdi Hook'ları örneklerle öğrenmeye başladığımız [bir sonraki sayfaya](/docs/hooks-overview.html) gidelim.**
