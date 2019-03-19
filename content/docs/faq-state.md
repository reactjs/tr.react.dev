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

İşte `props` ve `state`in ne zaman kullanılacağı hakkında daha fazla okumak için bir kaç iyi kaynak:
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

### When is `setState` asynchronous? {#when-is-setstate-asynchronous}

Currently, `setState` is asynchronous inside event handlers.

This ensures, for example, that if both `Parent` and `Child` call `setState` during a click event, `Child` isn't re-rendered twice. Instead, React "flushes" the state updates at the end of the browser event. This results in significant performance improvements in larger apps.

This is an implementation detail so avoid relying on it directly. In the future versions, React will batch updates by default in more cases.

### Why doesn't React update `this.state` synchronously? {#why-doesnt-react-update-thisstate-synchronously}

As explained in the previous section, React intentionally "waits" until all components call `setState()` in their event handlers before starting to re-render. This boosts performance by avoiding unnecessary re-renders.

However, you might still be wondering why React doesn't just update `this.state` immediately without re-rendering.

There are two main reasons:

* This would break the consistency between `props` and `state`, causing issues that are very hard to debug.
* This would make some of the new features we're working on impossible to implement.

This [GitHub comment](https://github.com/facebook/react/issues/11527#issuecomment-360199710) dives deep into the specific examples.

### Should I use a state management library like Redux or MobX? {#should-i-use-a-state-management-library-like-redux-or-mobx}

[Maybe.](https://redux.js.org/faq/general#when-should-i-use-redux)

It's a good idea to get to know React first, before adding in additional libraries. You can build quite complex applications using only React.
