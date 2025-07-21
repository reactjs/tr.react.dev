---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` CSS-in-JS kütüphanesi geliştiricileri için tasarlanmış hooktur. CSS-in-JS kütüphanesi üzerinde çalışmıyorsanız muhtemelen bu hook yerine [`useEffect`](/reference/react/useEffect) veya [`useLayoutEffect`](/reference/react/useLayoutEffect) hookunu kullanmak isteyeceksiniz.

</Pitfall>

<Intro>

`useInsertionEffect`, herhangi bir layout efekti tetiklenmeden önce DOM'a öğe eklenmesine izin verir.

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

Layout'ı okuma ihtimali olan herhangi bir efekt tetiklenmeden önce stil eklemek için `useInsertionEffect` hookunu çağırın:

```js
import { useInsertionEffect } from 'react';

// Inside your CSS-in-JS library
function useCSS(rule) {
  useInsertionEffect(() => {
    // ... inject <style> tags here ...
  });
  return rule;
}
```

[Aşağıda daha fazla örneğe göz atın.](#usage)

#### Parametreler {/*parameters*/}

* `setup`: Effect mantığınızı içeren fonksiyon. Setup fonksiyonunuz isteğe bağlı olarak bir *temizlik* fonksiyonu döndürebilir.  Bileşeniniz DOM'a eklenmeden önce, React setup fonksiyonunuzu çalışıtıracak. Değişen bağımlılıklarla her yeniden render işleminde, React önce (varsa) temizlik işlevinizi eski değerlerle çalıştıracak, ardından setup fonksiyonunuzu yeni değerlerle çalıştıracaktır. Bileşeniniz DOM'dan kaldırıldığında, React temizlik fonksiyonunuzu çalıştıracaktır.
* **opsiyonel** `bağımlılıklar`: `setup` kodunun içinde referans verilen tüm reaktif değerlerin listesi. Reaktif değerler, props, state ve direkt olarak bileşen içinde belirtilen tüm değişkenleri ve fonksiyonları içerir. Eğer linteriniz [React için yapılandırılmış](/learn/editor-setup#linting), her reaktif değerin bağımlılık olarak doğru şekilde belirtildiğini doğrulayacaktır. Bağımlılıkların listesi sabit sayıda ögeye sahip olmalı ve `[dep1, dep2, dep3]` gibi sıralı şekilde yazılmalıdır. React [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırma algoritmasını kullanarak her bağımlılığı önceki değeriyle karşılaştıracak. Bağımlılıkları hiç belirtmezseniz, Efektiniz bileşenin her yeniden render işleminde tekrar çalışacaktır.

#### Dönüş Değerleri {/*returns*/}

`useInsertionEffect` hooku `undefined` değerini döndürür.

#### Uyarılar {/*caveats*/}

* Efektler sadece kullanıcı tarafında çalışır. Sunucu tarafı render işleminde çalışmazlar.
* `useInsertionEffect` içerisinden state'i güncelleyemezsiniz.
* `useInsertionEffect` çalıştığı sırada, referanslar (refler) henüz eklenmemiştir.
* `useInsertionEffect` DOM güncellendikten önce ya da sonra çalışabilir. DOM'un belirli bir zamanda güncelleniyor olmasına güvenmemelisiniz.
* Her efekt için temizleme (cleanup) ve kurulum (setup) fonksiyonlarını çalıştıran diğer efekt tiplerinin aksine, `useInsertionEffect` her seferinde tek bir bileşen için hem temizleme hem de kurulum fonksiyonlarını çalıştırır. Bu, temizleme ve kurulum fonksiyonlarının araya girmesine sebep olur. 
---

## Kullanım {/*usage*/}

### CSS-in-JS kütüphanelerinden dinamik stilleri ekleme {/*injecting-dynamic-styles-from-css-in-js-libraries*/}

Geleneksel olarak, React bileşenlerini saf CSS kullanarak stillendirirsiniz. 

```js
// In your JS file:
<button className="success" />

// In your CSS file:
.success { color: green; }
```

Bazı takımlar, CSS dosyaları yazmak yerine stilleri direkt olarak Javascript kodları içerisinde yazmayı tercih eder. Bu yaklaşım genellikle bir CSS-in-JS kütüphanesi veya bir aracı kullanmayı gerektirir. CSS-in-JS için üç genel yaklaşım vardır:

1. Bir derleyici ile CSS dosyalarına statik olarak çıkarma
2. Satır içi stiller, örn. `<div style={{ opacity: 1 }}>`
3. `<style>` etiketlerinin çalışma zamanında eklenmesi

CSS-in-JS kullanıyorsanız, genellikle ilk iki yaklaşımın (Statik stiller için CSS dosyaları, dinamik stiller için satır içi stiller) bir kombinasyonunu öneriyoruz. **`<style>` etiketi eklenmesini iki sebeple önermiyoruz:**

1. Çalışma zamanı ekleme yapılması tarayıcıları stilleri birçok kez yeniden hesaplama yapması için zorlar.
2. Çalışma zamanı ekleme yapılması, React yaşam döngüsünde yanlış zamanda gerçekleşirse oldukça yavaş olabilir. 

İlk problem çözülemezken, ama `useInsertionEffect` hooku ikinci problemi çözmenize yardımcı olur.

Herhangi bir layout efektinden önce stilleri eklemek için `useInsertionEffect` hookunu çağırın: 

```js {4-11}
// Inside your CSS-in-JS library
let isInserted = new Set();
function useCSS(rule) {
  useInsertionEffect(() => {
    // As explained earlier, we don't recommend runtime injection of <style> tags.
    // But if you have to do it, then it's important to do in useInsertionEffect.
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      document.head.appendChild(getStyleForRule(rule));
    }
  });
  return rule;
}

function Button() {
  const className = useCSS('...');
  return <div className={className} />;
}
```

`useEffect` hookuna benzer olarak, `useInsertionEffect` hooku sunucuda çalışmaz. Eğer hangi CSS kurallarının sunucu tarafında kullanıldığını bilmeniz gerekiyorsa, render işlemi sırasında bunu yapabilirsiniz.

```js {1,4-6}
let collectedRulesSet = new Set();

function useCSS(rule) {
  if (typeof window === 'undefined') {
    collectedRulesSet.add(rule);
  }
  useInsertionEffect(() => {
    // ...
  });
  return rule;
}
```

[CSS-in-JS kütüphanelerini çalışma zamanı ekleme yapılarak `useInsertionEffect` hookunu kullanarak nasıl güncelleyeceğiniz hakkında daha fazla bilgi edinin.](https://github.com/reactwg/react-18/discussions/110)

<DeepDive>

#### Bu yöntem, render işlemi veya useLayoutEffect sırasında stil eklemekten nasıl daha iyidir? {/*how-is-this-better-than-injecting-styles-during-rendering-or-uselayouteffect*/}

<<<<<<< HEAD
Render işlemi sırasında stiller eklerseniz ve React bir [kesintisiz güncelleme](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) işlemi işliyorsa tarayıcı her karede bileşen ağacını yeniden oluştururken stilleri tekrar tekrar hesaplayacaktır ve bu **aşırı yavaş** olabilir.
=======
If you insert styles during rendering and React is processing a [non-blocking update,](/reference/react/useTransition#perform-non-blocking-updates-with-actions) the browser will recalculate the styles every single frame while rendering a component tree, which can be **extremely slow.**
>>>>>>> d52b3ec734077fd56f012fc2b30a67928d14cc73

`useInsertionEffect` hooku stilleri eklemek için [`useLayoutEffect`](/reference/react/useLayoutEffect) veya [`useEffect`](/reference/react/useEffect) hookundan daha iyidir çünkü diğer Efektler bileşenlerinizde çalışırken `<style>` etiketleri zaten eklenmiş olur. Aksi takdirde, layout hesaplamaları normal Efekt'lerde güncel olmayan stiller nedeniyle yanlış olur.

</DeepDive>
