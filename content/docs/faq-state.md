---
id: faq-state
title: Bileşen State'i
permalink: docs/faq-state.html
layout: docs
category: FAQ
---

### `setState` ne yapar? {#what-does-setstate-do}

`setState()`, bir bileşenin `state` nesnesine bir güncelleme planlar. State değiştiğinde, bileşen yeniden render ederek karşılık verir.

### `state` ve `props` arasındaki fark nedir? {#what-is-the-difference-between-state-and-props}

[`props`](/docs/components-and-props.html) ("properties" kısaltması) ve [`state`](/docs/state-and-lifecycle.html), her ikisi de düz JavaScript nesneleridir. Her ikisi de render etmenin çıktısını etkileyen bilgileri tutarken, önemli bir yönden farklıdırlar: `props`, *bileşene* iletilirken (fonksiyon parametrelerine benzer), `state` *bileşende* yönetilir (bir fonksiyon içinde tanımlanan değişkenlere benzer).

İşte `props` ve `state`in ne zaman kullanılacağı hakkında daha fazla okumak için birkaç iyi kaynak:
* [Props vs State](https://github.com/uberVU/react-guide/blob/master/props-vs-state.md)
* [ReactJS: Props vs. State](https://lucybain.com/blog/2016/react-state-vs-pros/)

### Neden `setState` bana yanlış bir değer veriyor? {#why-is-setstate-giving-me-the-wrong-value}

React'te, hem `this.props` hem de `this.state` *render edilmiş* değerleri, yani şu anda ekranda olanları belirtir.

`setState`'e yapılan çağrılar asenkrondur - `setState` çağrısı yaptıktan hemen sonra yeni değeri yansıtmak için `this.state`'e güvenmeyin. Mevcut state'e göre değerleri hesaplamanız gerekiyorsa, nesne yerine güncelleyici bir fonksiyon iletin (ayrıntılar için aşağıya bakın).

Beklendiği gibi *davranmayacak* kod örneği:

```jsx
incrementCount() {
  // Not: bu amaçlandığı gibi *çalışmayacaktır*.
  this.setState({count: this.state.count + 1});
}

handleSomething() {
  // `this.state.count` 0 olarak başlar diyelim.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();
  // React bileşeni yeniden render ettiğinde, `this.state.count` 1 olur, ancak 3 olacak sandın.

  // Bunun sebebi yukarıdaki `incrementCount()` fonksiyonunun `this.state.count`'tan okumasıdır,
  // ancak React, bileşen yeniden render edilene kadar `this.state.count`'u güncellemez.
  // Böylece `incrementCount()`, `this.state.count`'u her seferinde 0 olarak okumuş ve 1 olarak set etmiş olur.

  // Çözüm aşağıda açıklanmıştır!
}
```

Bu sorunu nasıl çözeceğinizi öğrenmek için aşağıya bakınız.

### State'i mevcut state'e bağlı değerlerle nasıl güncellerim? {#how-do-i-update-state-with-values-that-depend-on-the-current-state}

Çağrının her zaman state'in en güncel sürümünü kullandığından emin olmak için `setState`'e nesne yerine bir fonksiyon iletin (aşağıya bakınız).

### `setState`'teki bir nesneyi veya fonksiyonu iletmek arasındaki fark nedir? {#what-is-the-difference-between-passing-an-object-or-a-function-in-setstate}

Bir güncelleme fonksiyonunu iletmek, güncelleyicinin içindeki mevcut state değerine erişmenizi sağlar. `setState` çağrıları toplu halde işlendiğinden, bu, güncellemeleri zincirlemenizi ve çakışma yerine birbirlerinin üzerine inşa etmelerini sağlar:

```jsx
incrementCount() {
  this.setState((state) => {
    // Önemli: Güncelleme yaparken `this.state` yerine` state`'i kullanın.
    return {count: state.count + 1}
  });
}

handleSomething() {
  // `this.state.count` 0 olarak başlar diyelim.
  this.incrementCount();
  this.incrementCount();
  this.incrementCount();

  // `this.state.count`'a şimdi bakarsanız, hala 0 görürsünüz.
  // Fakat React bileşeni yeniden render ettiğinde, 3 olacaktır.
}
```

[setState hakkında daha fazla bilgi edinin](/docs/react-component.html#setstate)

### `setState` ne zaman asenkrondur? {#when-is-setstate-asynchronous}

Şu anda, `setState` olay yöneticileri içinde asenkrondur.

Bu, örneğin bir tıklama olayı sırasında hem `Üst Eleman` hem de `Alt Eleman` `setState` çağrısı yaptığında, `Alt Eleman`'ın iki kez yeniden render edilmemesini sağlar. Bunun yerine, React, tarayıcı olayının sonunda state güncellemelerini "temizler". Bu, daha büyük uygulamalarda önemli performans iyileştirmeleri sağlar.

Bu bir uygulama detayı, bu yüzden doğrudan buna güvenmekten kaçının. Gelecekteki sürümlerde, React birçok durumda varsayılan olarak toplu güncelleştirmeler barındıracak.

### React neden `this.state`'i senkron olarak güncellemez? {#why-doesnt-react-update-thisstate-synchronously}

Önceki bölümde açıklandığı gibi React, tüm bileşenler yeniden render edilmeye başlamadan önce olay yöneticilerinde `setState()`'i çağırıncaya kadar kasten "bekler". Gereksiz yeniden render etme işlemlerinden kaçınarak performansı artırır.

Bununla birlikte, React'in neden yeniden render etmeden hemen `this.state`'i güncellemediğini merak ediyor olabilirsiniz.

İki ana sebep var:

* Bu, `props` ile `state` arasındaki tutarlılığı bozar ve hata ayıklaması zor olan sorunlara neden olur.
* Bu, üzerinde çalıştığımız bazı yeni özelliklerin uygulanmasını imkansız kılar.

Bu [GitHub yorumu](https://github.com/facebook/react/issues/11527#issuecomment-360199710) belirli örneklerin derinliklerine iniyor.

### Redux veya MobX gibi bir state yönetimi kütüphanesi mi kullanmalıyım? {#should-i-use-a-state-management-library-like-redux-or-mobx}

[Olabilir.](https://redux.js.org/faq/general#when-should-i-use-redux)

Ek kütüphaneleri eklemeden önce React'i anlamak iyi bir fikir. Yalnızca React'i kullanarak oldukça karmaşık uygulamalar oluşturabilirsiniz.
