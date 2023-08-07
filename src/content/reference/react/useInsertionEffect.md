---
title: useInsertionEffect
---

<Pitfall>

`useInsertionEffect` CSS-in-JS kütüphanesi geliştiricileri için tasarlanmış hooktur. CSS-in-JS kütüphanesi üzerinde çalışmıyorsanız muhtemelen bu hook yerine [`useEffect`](/reference/react/useEffect) veya [`useLayoutEffect`](/reference/react/useLayoutEffect) hookunu kullanmak isteyeceksiniz.

</Pitfall>

<Intro>

<<<<<<< HEAD
`useInsertionEffect` hooku herhangi bir DOM mutasyonundan önce tetiklenen [`useEffect`](/reference/react/useEffect) hook'unun bir versiyonudur.
=======
`useInsertionEffect` allows inserting elements into the DOM before any layout effects fire.
>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4

```js
useInsertionEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `useInsertionEffect(setup, dependencies?)` {/*useinsertioneffect*/}

<<<<<<< HEAD
Herhangi bir DOM mutasyonundan önce stilleri eklemek için `useInsertionEffect` hookunu çağırın:  
=======
Call `useInsertionEffect` to insert styles before any effects fire that may need to read layout:
>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4

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

<<<<<<< HEAD
* `setup`: Effect mantığınızı içeren fonksiyon. Setup fonksiyonunuz isteğe bağlı olarak bir *temizlik* fonksiyonu döndürebilir.  Bileşeniniz DOM'a eklenmeden önce, React setup fonksiyonunuzu çalışıtıracak. Değişen bağımlılıklarla her yeniden render işleminde, React önce temizlik işlevinizi (varsa) eski değerlerle çalıştıracak, ardından setup fonksiyonunuzu yeni değerlerle çalıştıracaktır. Bileşeniniz DOM'dan kaldırılmadan önce, React temizlik fonksiyonunuzu çalıştıracaktır.
=======
* `setup`: The function with your Effect's logic. Your setup function may also optionally return a *cleanup* function. When your component is added to the DOM, but before any layout effects fire, React will run your setup function. After every re-render with changed dependencies, React will first run the cleanup function (if you provided it) with the old values, and then run your setup function with the new values. When your component is removed from the DOM, React will run your cleanup function.
 
* **optional** `dependencies`: The list of all reactive values referenced inside of the `setup` code. Reactive values include props, state, and all the variables and functions declared directly inside your component body. If your linter is [configured for React](/learn/editor-setup#linting), it will verify that every reactive value is correctly specified as a dependency. The list of dependencies must have a constant number of items and be written inline like `[dep1, dep2, dep3]`. React will compare each dependency with its previous value using the [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison algorithm. If you don't specify the dependencies at all, your Effect will re-run after every re-render of the component.
>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4

* **opsiyonel** `dependencies`: `setup` kodunun içinde referans verilen tüm reaktif değerlerin listesi. Reaktif değerler, props, state ve direkt olarak bileşen içinde belirtilen tüm değişkenleri ve fonksiyonları içerir. Eğer linteriniz [React için yapılandırılmış](/learn/editor-setup#linting), her reaktif değerin bağımlılık olarak doğru şekilde belirtildiğini doğrulayacaktır. Bağımlılıkların listesi sabit sayıda ögeye sahip olmalı ve `[dep1, dep2, dep3]` gibi sıralı şekilde yazılmalıdır. React [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırma algoritmasını kullanarak her bağımlılığı önceki değeriyle karşılaştıracak. Bağımlılıkları hiç belirtmezseniz, Efektiniz bileşenin her yeniden render işleminde tekrar çalışacaktır.

#### Dönüş Değerleri {/*returns*/}

`useInsertionEffect` hooku `undefined` değerini döndürür.

<<<<<<< HEAD
#### Uyarılar {/*caveats*/}

* Efektler sadece kullanıcı tarafında çalışır. Sunucu tarafı render işleminde çalışmazlar.
* `useInsertionEffect` içerisinden state'i güncelleyemezsiniz.
* `useInsertionEffect` çalıştığı sırada, referanslar henüz eklenmemiş ve DOM henüz güncellenmemiştir.
=======
* Effects only run on the client. They don't run during server rendering.
* You can't update state from inside `useInsertionEffect`.
* By the time `useInsertionEffect` runs, refs are not attached yet.
* `useInsertionEffect` may run either before or after the DOM has been updated. You shouldn't rely on the DOM being updated at any particular time.
* Unlike other types of Effects, which fire cleanup for every Effect and then setup for every Effect, `useInsertionEffect` will fire both cleanup and setup one component at a time. This results in an "interleaving" of the cleanup and setup functions.
>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4
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

<<<<<<< HEAD
Herhangi bir DOM mutasyonundan önce çağırın stilleri eklemek için `useInsertionEffect` hookunu çağırın: 
=======
Call `useInsertionEffect` to insert the styles before any layout effects fire:
>>>>>>> a472775b7c15f41b21865db1698113ca49ca95c4

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

Render işlemi sırasında stiller eklerseniz ve React bir [kesintisiz güncelleme](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) işlemi işliyorsa tarayıcı her karede bileşen ağacını yeniden oluştururken stilleri tekrar tekrar hesaplayacaktır ve bu **aşırı yavaş** olabilir.

`useInsertionEffect` hooku stilleri eklemek için [`useLayoutEffect`](/reference/react/useLayoutEffect) veya [`useEffect`](/reference/react/useEffect) hookundan daha iyidir çünkü diğer Efektler bileşenlerinizde çalışırken `<style>` etiketleri zaten eklenmiş olur. Aksi takdirde, layout hesaplamaları normal Efekt'lerde güncel olmayan stiller nedeniyle yanlış olur.

</DeepDive>
