---
title: Refs Must Have Owner Uyarısı
layout: single
permalink: warnings/refs-must-have-owner.html
---

Muhtemelen aşağıdaki hata mesajlarından birini aldığınız için buradasınız:

*React 16.0.0+*
> Warning:
>
> Element ref was specified as a string (myRefName) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner).

*React'in önceki versiyonlarında*
> Warning:
>
> addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded.

Bunun sebebi genellikle üç şeyden biridir:

- Bir fonksiyon bileşenine `ref` eklemeye çalışıyorsunuz.
- Bileşenin render() fonksiyonu dışında oluşturulan bir elemana `ref` eklemeye çalışıyorsunuz. 
- Birden fazla (çakışan) React versiyonları yüklüyorsunuz. (Ör. yanlış ayarlanmış npm paketlerinden)

## Fonksiyon Bileşenlerindeki Ref'ler {#refs-on-function-components}

Eğer `<Foo>` bir fonksiyon bileşeniyse, ona ref ekleyemezsiniz.

```js
// Eğer Foo bir fonksiyonsa, buradaki ref çalışmaz.
<Foo ref={foo} />
```

Eğer bir bileşene ref eklemeniz gerekiyorsa, öncelikle onu sınıf yapısına çevirin ya da [nadiren gerekli](/docs/refs-and-the-dom.html#when-to-use-refs) olmadıkça ref kullanmamayı düşünün.

## Render methodu dışındaki string Ref'ler {#strings-refs-outside-the-render-method}

Bu genellikle, bir sahibi olmayan (yani, başka bir bileşenin `render` methodu içerisinde oluşturulmayan) bir bileşene bir ref eklemeye çalışıyorsunuz demektir. Örneğin, aşağıdaki kod çalışmayacaktır:

```js
// Çalışmaz!
ReactDOM.render(<App ref="app" />, el);
```
Bunun yerine bu bileşeni başka bir üst-seviye bileşenin içerisinde render ederek ref'i tutmayı deneyebilirsiniz. Başka bir alternatif olarak, bir callback ref kullanmayı deneyebilirsiniz:

```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

Bu yaklaşımı kullanmadan önce bir [ref'e gerçekten ihtiyacınız olduğunu](/docs/refs-and-the-dom.html#when-to-use-refs) iyi değerlendirin.

## React'in çoklu kopyaları {#multiple-copies-of-react}

Bower, bağımlılıkların tekilleştirilmesi konusunda iyi bir iş çıkartır ancak npm yapmaz. Eğer reflerle (süslü) bir şeyler yapmıyorsanız, problemin sizin reflerinizle ilgili olmadığına dair bir şansınız vardır, aksine projenizde birden fazla React kopyası olabilir. Bazen, üçüncü-parti bir modülü npm ile çektiğinizde, bağımlı kütüphanenin ikinci bir kopyasını alırsınız ve bu da sorunlara sebep olur.

Eğer npm kullanıyorsanız... `npm ls` ya da `npm ls react` komutları, netleştirmenize yardımcı olabilir.