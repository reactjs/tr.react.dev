---
title: "'use server'"
titleForTitleTag: "'use server' direktif"
---

<RSC>

<<<<<<< HEAD
`'use server'`, [React Sunucu Bileşenleri kullanımı için](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) kullanılır.
=======
`'use server'` is for use with [using React Server Components](/reference/rsc/server-components).
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

</RSC>


<Intro>

`'use server'` istemci tarafı kodundan çağrılabilen sunucu tarafı işlevlerini işaretler.

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `'use server'` {/*use-server*/}

Bir async fonksiyonunun başına `'use server'` ekleyerek fonksiyonu istemci tarafından çağrılabilir hale getirin. Bu fonksiyonlara [_Server Functions_](/reference/rsc/server-functions) denir.

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

Bir Sunucu Fonksiyon'u istemciden çağırdığınızda, geçilen tüm argümanların serileştirilmiş bir kopyasını içeren bir ağ isteği sunucuya yapılır. Eğer Sunucu Fonksiyon bir değer dönerse, bu değer serileştirilir ve istemciye geri gönderilir.

Fonksiyonları tek tek `'use server'` ile işaretlemek yerine, bir dosyanın başına yönergeyi ekleyebilirsiniz, böylece o dosyadaki tüm export'lar, istemci kodunda da kullanılabilen Sunucu Fonksiyon'lar olarak işaretlenir.

#### Uyarılar {/*caveats*/}
* `'use server'` fonksiyonlarının veya modüllerinin başında, diğer kodlardan (imports dahil) önce olmalıdır (yönergelerden önceki yorumlar kabul edilir). Tek tırnak veya çift tırnak ile yazılmalıdır, ters tırnak kullanılamaz.
* `'use server'` yalnızca sunucu tarafı dosyalarında kullanılabilir. Ortaya çıkan Sunucu Fonksiyon'lar, Sunucu Bileşen'lere prop'lar aracılığıyla iletilebilir. Desteklenen [serileştirme türlerine](#serializable-parameters-and-return-values) bakın.
* Bir Sunucu Fonksiyon'ı [istemci kodu](/reference/rsc/use-client) içinden içe aktarmak için, yönerge modül seviyesinde kullanılmalıdır.
* Altta yatan ağ çağrıları her zaman asenkron olduğu için, `'use server'` yalnızca async fonksiyonlarda kullanılabilir.
* Sunucu Fonksiyon'lara geçirilen argümanları her zaman güvenilmeyen girişler olarak ele alın ve herhangi bir değişiklik yapmadan önce yetkilendirme yapın. [Güvenlik önlemleri](#security) için bakın.
* Sunucu Fonksiyon'lar bir [Transition](/reference/react/useTransition) içinde çağrılmalıdır. [`<form action>`](/reference/react-dom/components/form#props) veya [`formAction`](/reference/react-dom/components/input#props) ile geçirilen Sunucu Fonksiyon'lar otomatik olarak bir geçiş içinde çağrılacaktır.
* Sunucu Fonksiyon'lar, sunucu tarafı durumu güncelleyen değişiklikler için tasarlanmıştır; veri çekme işlemleri için önerilmezler. Bu nedenle, Sunucu Fonksiyon'ları uygulayan framework'ler genellikle her seferinde bir işlemi işler ve dönüş değerini önbelleğe almak için bir yöntem sunmazlar.

### Güvenlikle ilgili hususlar {/*security*/}

Sunucu Fonksiyon'lara geçirilen argümanlar tamamen istemci tarafından kontrol edilir. Güvenlik için, her zaman bunları güvenilmeyen girişler olarak ele alın ve argümanları uygun şekilde doğrulayın ve kaçış işlemi uygulayın.

Herhangi bir Sunucu Fonksiyonu içinde, giriş yapmış kullanıcının bu işlemi gerçekleştirmeye yetkili olduğundan emin olun.

<Wip>

Bir Sunucu Fonksiyonun'dan hassas veri gönderimini önlemek için, istemci koduna benzersiz değerlerin ve nesnelerin iletilmesini engellemek amacıyla deneysel taint API'leri mevcuttur.

Bkz. [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) ve [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>

### Serileştirilebilir bağımsız değişkenler ve dönüş değerleri {/*serializable-parameters-and-return-values*/}

İstemci kodu, Sunucu Fonksiyon'u ağ üzerinden çağırdığı için, geçirilen tüm argümanların serileştirilebilir olması gerekir.

İşte Sunucu Fonksiyon argümanları için desteklenen türler:

* Primitives
  * [string](https://developer.mozilla.org/en-US/docs/Glossary/String)
  * [number](https://developer.mozilla.org/en-US/docs/Glossary/Number)
  * [bigint](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
  * [boolean](https://developer.mozilla.org/en-US/docs/Glossary/Boolean)
  * [undefined](https://developer.mozilla.org/en-US/docs/Glossary/Undefined)
  * [null](https://developer.mozilla.org/en-US/docs/Glossary/Null)
  * [symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol), [`Symbol.for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/for) aracılığıyla yalnızca global Sembol kayıt defterine kayıtlı semboller
* Serileştirilebilir değerler içeren yinelenebilir dosyalar
  * [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
  * [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
  * [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
  * [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)
  * [TypedArray](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) ve [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)
* [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instances
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
* Sunucu Fonksiyon'u olan fonksiyonlar
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Özellikle, bunlar desteklenmez:
* React elemanları veya [JSX](/learn/writing-markup-with-jsx)
* Fonksiyonlar, bileşen fonksiyonları veya Sunucu Fonksiyon olmayan diğer tüm fonksiyonlar dahil
* [Sınıflar](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Herhangi bir sınıfın örnekleri olan nesneler (bahsedilen yerleşik sınıflar dışında) veya [null prototipi olan nesneler](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Küresel olarak kaydedilmemiş semboller, örneğin `Symbol('my new symbol')`
* Olay yöneticilerinden gelen olaylar

Desteklenen serileştirilebilir dönüş değerleri, bir sınır İstemci Bileşeni için [serileştirilebilir proplar](/reference/rsc/use-client#passing-props-from-server-to-client-components) ile aynıdır.

## Kullanım {/*usage*/}

### Formlarda Sunucu Eylemleri {/*server-actions-in-forms*/}

### Formlardaki Sunucu Fonksiyon'lar {/*server-functions-in-forms*/}

Sunucu Fonksiyon'ların en yaygın kullanım senaryosu, veri üzerinde değişiklik yapan fonksiyonları çağırmaktır. Tarayıcıda, [HTML form elemanı](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form), bir kullanıcının bir değişiklik göndermesi için geleneksel yaklaşımdır. React Sunucu Bileşenleri ile React, [formlarda](/reference/react-dom/components/form) Sunucu Fonksiyon'lar için birinci sınıf destek sunar.

İşte bir kullanıcının bir kullanıcı adı talep etmesine izin veren bir form.

```js [[1, 3, "formData"]]
// App.js

async function requestUsername(formData) {
  'use server';
  const username = formData.get('username');
  // ...
}

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">İstek</button>
    </form>
  );
}
```

Bu örnekte `requestUsername`, bir `<form>`'a geçirilen bir Sunucu Fonksiyon'dır. Bir kullanıcı bu formu gönderdiğinde, `requestUsername` sunucu fonksiyonuna yapılan bir ağ isteği gerçekleşir. Bir Sunucu Fonksiyon'ı form içinde çağırırken, React, formun <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep>'sini birinci argüman olarak Sunucu Fonksiyon'a iletecektir.

Bir Sunucu Fonksiyon'ı form `action`'ına geçirerek, React formu [kademeli olarak iyileştirebilir](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). Bu, formların JavaScript paketi yüklenmeden önce gönderilebileceği anlamına gelir.

#### Formlarda dönüş değerlerini işleme {/*handling-return-values*/}

Kullanıcı adı istek formunda, bir kullanıcı adının mevcut olmaması ihtimali olabilir. `requestUsername` bize başarısız olup olmadığını söylemelidir.

Sunucu Fonksiyonu sonucuna dayalı olarak UI'yı güncellemek ve kademeli iyileştirmeyi desteklemek için, [`useActionState`](/reference/react/useActionState) kullanın.

```js
// requestUsername.js
'use server';

export default async function requestUsername(formData) {
  const username = formData.get('username');
  if (canRequest(username)) {
    // ...
    return 'başarılı';
  }
  return 'başarısız oldu';
}
```

```js {4,8}, [[2, 2, "'use client'"]]
// UsernameForm.js
'use client';

import { useActionState } from 'react';
import requestUsername from './requestUsername';

function UsernameForm() {
  const [state, action] = useActionState(requestUsername, null, 'n/a');

  return (
    <>
      <form action={action}>
        <input type="text" name="username" />
        <button type="submit">İstek</button>
      </form>
      <p>Son gönderim talebi iade edildi: {state}</p>
    </>
  );
}
```

Not: Diğer çoğu Hook gibi `useActionState`in de yalnızca <CodeStep step={1}>[client code](/reference/rsc/use-client)</CodeStep> içinde çağrılabileceğini unutmayın.

### `<form>` dışında bir Sunucu Fonksiyon'u çağırma {/*calling-a-server-function-outside-of-form*/}

Sunucu Fonksiyon'lar, sunucu uç noktalarıdır ve istemci kodunda her yerde çağrılabilir.

Bir Sunucu Fonksiyon'u bir [form](/reference/react-dom/components/form) dışında kullanırken, Sunucu Fonksiyon'u bir [Transition](/reference/react/useTransition) içinde çağırın, bu sayede yükleme göstergesi gösterebilir, [iyimser durum güncellemeleri](/reference/react/useOptimistic) yapabilir ve beklenmeyen hataları yönetebilirsiniz. Formlar, otomatik olarak Sunucu Fonksiyon'ları geçişler içinde sarar.

```js {9-12}
import incrementLike from './actions';
import { useState, useTransition } from 'react';

function LikeButton() {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(0);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Toplam Beğeni: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>Beğen</button>;
    </>
  );
}
```

```js
// actions.js
'use server';

let likeCount = 0;
export default async function incrementLike() {
  likeCount++;
  return likeCount;
}
```

Bir Sunucu Fonksiyon dönüş değerini okumak için, döndürülen promise'i `await` etmeniz gerekecek.
