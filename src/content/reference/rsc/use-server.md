---
title: "'use server'"
titleForTitleTag: "'use server' directive"
---

<RSC>

<<<<<<< HEAD
`'use server'` sadece [React Sunucu Bileşenlerini kullanıyorsanız](/learn/start-a-new-react-project#bleeding-edge-react-frameworks) veya bunlarla uyumlu bir kütüphane oluşturuyorsanız gereklidir.
=======
`'use server'` is for use with [using React Server Components](/learn/start-a-new-react-project#bleeding-edge-react-frameworks).
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80

</RSC>


<Intro>

`'use server'` istemci tarafı kodundan çağrılabilen sunucu tarafı işlevlerini işaretler.

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `'use server'` {/*use-server*/}

<<<<<<< HEAD
Fonksiyonu istemci tarafından çağrılabilir olarak işaretlemek için bir asenkron fonksiyon gövdesinin başına `'use server'' ekleyin. Bu işlevlere _Sunucu Eylemleri_ adını veriyoruz.
=======
Add `'use server'` at the top of an async function body to mark the function as callable by the client. We call these functions [_Server Functions_](/reference/rsc/server-functions).
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80

```js {2}
async function addToCart(data) {
  'use server';
  // ...
}
```

<<<<<<< HEAD
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
=======
When calling a Server Function on the client, it will make a network request to the server that includes a serialized copy of any arguments passed. If the Server Function returns a value, that value will be serialized and returned to the client.

Instead of individually marking functions with `'use server'`, you can add the directive to the top of a file to mark all exports within that file as Server Functions that can be used anywhere, including imported in client code.

#### Caveats {/*caveats*/}
* `'use server'` must be at the very beginning of their function or module; above any other code including imports (comments above directives are OK). They must be written with single or double quotes, not backticks.
* `'use server'` can only be used in server-side files. The resulting Server Functions can be passed to Client Components through props. See supported [types for serialization](#serializable-parameters-and-return-values).
* To import a Server Functions from [client code](/reference/rsc/use-client), the directive must be used on a module level.
* Because the underlying network calls are always asynchronous, `'use server'` can only be used on async functions.
* Always treat arguments to Server Functions as untrusted input and authorize any mutations. See [security considerations](#security).
* Server Functions should be called in a [Transition](/reference/react/useTransition). Server Functions passed to [`<form action>`](/reference/react-dom/components/form#props) or [`formAction`](/reference/react-dom/components/input#props) will automatically be called in a transition.
* Server Functions are designed for mutations that update server-side state; they are not recommended for data fetching. Accordingly, frameworks implementing Server Functions typically process one action at a time and do not have a way to cache the return value.
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80

### Güvenlikle ilgili hususlar {/*security*/}

<<<<<<< HEAD
Sunucu Eylemlerine yönelik bağımsız değişkenler tamamen istemci kontrolündedir. Güvenlik için bunları her zaman güvenilmeyen girdi olarak ele alın ve bağımsız değişkenleri uygun şekilde doğruladığınızdan ve kaçtığınızdan emin olun.

Herhangi bir Sunucu Eyleminde, oturum açan kullanıcının bu eylemi gerçekleştirmesine izin verildiğini doğruladığınızdan emin olun.

<Wip>

Bir Sunucu Eyleminden hassas verilerin gönderilmesini önlemek için, benzersiz değerlerin ve nesnelerin istemci koduna aktarılmasını önleyen deneysel taint API'leri vardır.
=======
Arguments to Server Functions are fully client-controlled. For security, always treat them as untrusted input, and make sure to validate and escape arguments as appropriate.

In any Server Function, make sure to validate that the logged-in user is allowed to perform that action.

<Wip>

To prevent sending sensitive data from a Server Function, there are experimental taint APIs to prevent unique values and objects from being passed to client code.
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80

Bkz. [experimental_taintUniqueValue](/reference/react/experimental_taintUniqueValue) ve [experimental_taintObjectReference](/reference/react/experimental_taintObjectReference).

</Wip>

### Serileştirilebilir bağımsız değişkenler ve dönüş değerleri {/*serializable-parameters-and-return-values*/}

<<<<<<< HEAD
İstemci kodu Sunucu Eylemini ağ üzerinden çağırdığından, aktarılan tüm argümanların serileştirilebilir olması gerekir.

Sunucu Eylemi bağımsız değişkenleri için desteklenen türler şunlardır:
=======
Since client code calls the Server Function over the network, any arguments passed will need to be serializable.

Here are supported types for Server Function arguments:
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80

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
<<<<<<< HEAD
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
=======
* [FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData) instances
* Plain [objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object): those created with [object initializers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer), with serializable properties
* Functions that are Server Functions
* [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Notably, these are not supported:
* React elements, or [JSX](/learn/writing-markup-with-jsx)
* Functions, including component functions or any other function that is not a Server Function
* [Classes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Classes_in_JavaScript)
* Objects that are instances of any class (other than the built-ins mentioned) or objects with [a null prototype](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects)
* Symbols not registered globally, ex. `Symbol('my new symbol')`
* Events from event handlers
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80


Desteklenen serileştirilebilir dönüş değerleri, bir sınır İstemci Bileşeni için [serileştirilebilir proplar](/reference/rsc/use-client#passing-props-from-server-to-client-components) ile aynıdır.

## Kullanım {/*usage*/}

### Formlarda Sunucu Eylemleri {/*server-actions-in-forms*/}

<<<<<<< HEAD
Sunucu Eylemlerinin en yaygın kullanım durumu, verileri değiştiren sunucu işlevlerini çağırmak olacaktır. Tarayıcıda, [HTML form elemanı](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) kullanıcının bir mutation göndermesi için geleneksel yaklaşımdır. React Sunucu Bileşenleri ile React, [forms](/reference/react-dom/components/form) Sunucu Eylemleri için birinci sınıf destek sunuyor.

İşte bir kullanıcının kullanıcı adı talep etmesini sağlayan bir form.
=======
### Server Functions in forms {/*server-functions-in-forms*/}

The most common use case of Server Functions will be calling functions that mutate data. On the browser, the [HTML form element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) is the traditional approach for a user to submit a mutation. With React Server Components, React introduces first-class support for Server Functions as Actions in [forms](/reference/react-dom/components/form).

Here is a form that allows a user to request a username.
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80

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

<<<<<<< HEAD
Bu örnekte `requestUsername` bir `<form>`a aktarılan bir Sunucu Eylemidir. Bir kullanıcı bu formu gönderdiğinde, `requestUsername` sunucu işlevine bir ağ isteği gönderilir. Bir formda bir Sunucu Eylemi çağırırken, React formun <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> öğesini Sunucu Eylemine ilk argüman olarak sağlayacaktır.

React, `action` formuna bir Sunucu Eylemi geçirerek formu [aşamalı olarak geliştirebilir](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). Bu, formların JavaScript paketi yüklenmeden önce gönderilebileceği anlamına gelir.
=======
In this example `requestUsername` is a Server Function passed to a `<form>`. When a user submits this form, there is a network request to the server function `requestUsername`. When calling a Server Function in a form, React will supply the form's <CodeStep step={1}>[FormData](https://developer.mozilla.org/en-US/docs/Web/API/FormData)</CodeStep> as the first argument to the Server Function.

By passing a Server Function to the form `action`, React can [progressively enhance](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) the form. This means that forms can be submitted before the JavaScript bundle is loaded.
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80

#### Formlarda dönüş değerlerini işleme {/*handling-return-values*/}

Kullanıcı adı istek formunda, bir kullanıcı adının mevcut olmaması ihtimali olabilir. `requestUsername` bize başarısız olup olmadığını söylemelidir.

<<<<<<< HEAD
Aşamalı geliştirmeyi desteklerken bir Sunucu Eyleminin sonucuna göre kullanıcı arayüzünü güncellemek için [`useActionState`](/reference/react/useActionState) kullanın.
=======
To update the UI based on the result of a Server Function while supporting progressive enhancement, use [`useActionState`](/reference/react/useActionState).
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80

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

<<<<<<< HEAD
### Sunucu Eylemini `<form>` dışında çağırma {/*calling-a-server-action-outside-of-form*/}

Sunucu Eylemleri açık sunucu uç noktalarıdır ve istemci kodunun herhangi bir yerinde çağrılabilir.

[Form](/reference/react-dom/components/form) dışında bir Sunucu Eylemi kullanırken, Sunucu Eylemini bir [Transition](/reference/react/useTransition) içinde çağırın; bu sayede bir yükleme göstergesi görüntüleyebilir, [iyimser state güncellemeleri](/reference/react/useOptimistic) gösterebilir ve beklenmedik hataları ele alabilirsiniz
=======
### Calling a Server Function outside of `<form>` {/*calling-a-server-function-outside-of-form*/}

Server Functions are exposed server endpoints and can be called anywhere in client code.

When using a Server Function outside a [form](/reference/react-dom/components/form), call the Server Function in a [Transition](/reference/react/useTransition), which allows you to display a loading indicator, show [optimistic state updates](/reference/react/useOptimistic), and handle unexpected errors. Forms will automatically wrap Server Functions in transitions.
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80

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

<<<<<<< HEAD
Bir Sunucu Eylemi dönüş değerini okumak için, döndürülen promise'i `await` etmeniz gerekir.
=======
To read a Server Function return value, you'll need to `await` the promise returned.
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80
