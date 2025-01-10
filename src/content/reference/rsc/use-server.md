---
title: "'use server'"
titleForTitleTag: "'use server' directive"
canary: true
---

<Canary>

`'use server'` sadece [React Sunucu Bileşenlerini kullanıyorsanız](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) veya bunlarla uyumlu bir kütüphane oluşturuyorsanız gereklidir.

</Canary>


<Intro>

`'use server'` istemci tarafı kodundan çağrılabilen sunucu tarafı işlevlerini işaretler.

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `'use server'` {/*use-server*/}

Fonksiyonu istemci tarafından çağrılabilir olarak işaretlemek için bir asenkron fonksiyon gövdesinin başına `'use server'' ekleyin. Bu işlevlere _Sunucu Eylemleri_ adını veriyoruz.

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

İstemcide bir Sunucu Eylemi çağrıldığında, sunucuya iletilen tüm bağımsız değişkenlerin serileştirilmiş bir kopyasını içeren bir ağ isteği gönderilir. Sunucu Eylemi bir değer döndürürse, bu değer serileştirilir ve istemciye döndürülür.

İşlevleri tek tek `'use server'` ile işaretlemek yerine, bir dosyanın en üstüne bu yönergeyi ekleyerek o dosyadaki tüm dışa aktarımları, istemci koduna aktarılanlar da dahil olmak üzere her yerde kullanılabilecek Sunucu Eylemleri olarak işaretleyebilirsiniz.

#### Uyarılar {/*caveats*/}
* `'use server'` fonksiyon veya modüllerinin en başında olmalıdır; içe aktarmalar dahil diğer tüm kodların üzerinde (direktiflerin üzerindeki yorumlar uygundur). Tek ya da çift tırnakla yazılmalıdırlar, ters tırnakla değil.
* `'use server'` sadece sunucu tarafındaki dosyalarda kullanılabilir. Ortaya çıkan Sunucu Eylemleri prop'lar aracılığıyla İstemci Bileşenlerine aktarılabilir. Desteklenen [serileştirme türleri](#serializable-parameters-and-return-values) bölümüne bakın.
* Sunucu Eylemini [istemci kodu](/reference/rsc/use-client)'ndan içe aktarmak için yönerge modül düzeyinde kullanılmalıdır
* Temel ağ çağrıları her zaman asenkron olduğundan, `'use server'` yalnızca asenkron fonksiyonlarda kullanılabilir.
* Sunucu Eylemlerine yönelik bağımsız değişkenleri her zaman güvenilmeyen girdi olarak değerlendirin ve tüm mutasyonları yetkilendirin. Bkz. [güvenlik hususları](#security).
* Sunucu Eylemleri bir [Transition](/reference/react/useTransition) içinde çağrılmalıdır. [`<form action>`](/reference/react-dom/components/form#props) veya [`formAction`](/reference/react-dom/components/input#props)'a geçirilen Sunucu Eylemleri otomatik olarak bir geçişte çağrılacaktır.
* Sunucu Eylemleri sunucu tarafı durumunu güncelleyen mutasyonlar için tasarlanmıştır; veri getirme için önerilmezler. Buna göre, Sunucu Eylemlerini uygulayan çatılar genellikle bir seferde bir eylemi işler ve dönüş değerini önbelleğe almanın bir yolu yoktur.

### Güvenlikle ilgili hususlar {/*security*/}

Sunucu Eylemlerine yönelik bağımsız değişkenler tamamen istemci kontrolündedir. Güvenlik için bunları her zaman güvenilmeyen girdi olarak ele alın ve bağımsız değişkenleri uygun şekilde doğruladığınızdan ve kaçtığınızdan emin olun.

Herhangi bir Sunucu Eyleminde, oturum açan kullanıcının bu eylemi gerçekleştirmesine izin verildiğini doğruladığınızdan emin olun.

<Wip>

Bir Sunucu Eyleminden hassas verilerin gönderilmesini önlemek için, benzersiz değerlerin ve nesnelerin istemci koduna aktarılmasını önleyen deneysel taint API'leri vardır.

Bkz. [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) ve [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>

### Serileştirilebilir bağımsız değişkenler ve dönüş değerleri {/*serializable-parameters-and-return-values*/}

İstemci kodu Sunucu Eylemini ağ üzerinden çağırdığından, aktarılan tüm argümanların serileştirilebilir olması gerekir.

Sunucu Eylemi bağımsız değişkenleri için desteklenen türler şunlardır:

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
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) nesne
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer) ile oluşturulmuş olanlar, serileştirilebilir özelliklerle
* Sunucu Eylemleri Olan İşlevler
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Özellikle, bunlar desteklenmemektedir:
* React elemanları, ya da [JSX](/learn/writing-markup-with-jsx)
* Bileşen işlevleri veya Sunucu Eylemi olmayan diğer işlevler dahil olmak üzere işlevler
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Herhangi bir sınıfın örneği olan nesneler (belirtilen yerleşikler dışında) veya [null prototipli](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Global olarak kaydedilmemiş semboller, örn. `Symbol('yeni sembolüm')`


Desteklenen serileştirilebilir dönüş değerleri, bir sınır İstemci Bileşeni için [serileştirilebilir proplar](/reference/rsc/use-client#passing-props-from-server-to-client-components) ile aynıdır.

## Kullanım {/*usage*/}

### Formlarda Sunucu Eylemleri {/*server-actions-in-forms*/}

Sunucu Eylemlerinin en yaygın kullanım durumu, verileri değiştiren sunucu işlevlerini çağırmak olacaktır. Tarayıcıda, [HTML form elemanı](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) kullanıcının bir mutation göndermesi için geleneksel yaklaşımdır. React Sunucu Bileşenleri ile React, [forms](/reference/react-dom/components/form) Sunucu Eylemleri için birinci sınıf destek sunuyor.

İşte bir kullanıcının kullanıcı adı talep etmesini sağlayan bir form.

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

Bu örnekte `requestUsername` bir `<form>`a aktarılan bir Sunucu Eylemidir. Bir kullanıcı bu formu gönderdiğinde, `requestUsername` sunucu işlevine bir ağ isteği gönderilir. Bir formda bir Sunucu Eylemi çağırırken, React formun <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> öğesini Sunucu Eylemine ilk argüman olarak sağlayacaktır.

React, `action` formuna bir Sunucu Eylemi geçirerek formu [aşamalı olarak geliştirebilir](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). Bu, formların JavaScript paketi yüklenmeden önce gönderilebileceği anlamına gelir.

#### Formlarda dönüş değerlerini işleme {/*handling-return-values*/}

Kullanıcı adı istek formunda, bir kullanıcı adının mevcut olmaması ihtimali olabilir. `requestUsername` bize başarısız olup olmadığını söylemelidir.

Aşamalı geliştirmeyi desteklerken bir Sunucu Eyleminin sonucuna göre kullanıcı arayüzünü güncellemek için [`useActionState`](/reference/react/useActionState) kullanın.

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

Note that like most Hooks, `useActionState` can only be called in <CodeStep step={1}>[client code](/reference/rsc/use-client)</CodeStep>.
Çoğu Hook gibi `useActionState`in de yalnızca <CodeStep step={1}>[client code](/reference/rsc/use-client)</CodeStep> içinde çağrılabileceğini unutmayın.

### Sunucu Eylemini `<form>` dışında çağırma {/*calling-a-server-action-outside-of-form*/}

Sunucu Eylemleri açık sunucu uç noktalarıdır ve istemci kodunun herhangi bir yerinde çağrılabilir.

[Form](/reference/react-dom/components/form) dışında bir Sunucu Eylemi kullanırken, Sunucu Eylemini bir [Transition](/reference/react/useTransition) içinde çağırın; bu sayede bir yükleme göstergesi görüntüleyebilir, [iyimser state güncellemeleri](/reference/react/useOptimistic) gösterebilir ve beklenmedik hataları ele alabilirsiniz

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

Bir Sunucu Eylemi dönüş değerini okumak için, döndürülen promise'i `await` etmeniz gerekir.