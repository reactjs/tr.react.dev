---
title: Sunucu Eylemleri
canary: true
---

<Intro>

Sunucu Eylemleri, İstemci Bileşenlerinin sunucuda yürütülen asenkron işlevleri çağırmasına olanak tanır.

</Intro>

<InlineToc />

<Note>

#### Sunucu Eylemleri için nasıl destek oluşturabilirim? {/*how-do-i-build-support-for-server-actions*/}

React 19'daki Sunucu Eylemleri kararlı ve büyük sürümler arasında kırılmayacak olsa da, bir React Sunucu Bileşenleri paketleyicisinde veya çatısında Sunucu Eylemlerini uygulamak için kullanılan temel API'ler semver'ı takip etmez ve React 19.x'teki küçük sürümler arasında kırılabilir. 

Sunucu Eylemlerini bir paketleyici veya çerçeve olarak desteklemek için, belirli bir React sürümüne sabitlemenizi veya Canary sürümünü kullanmanızı öneririz. Gelecekte Sunucu Eylemlerini uygulamak için kullanılan API'leri stabilize etmek için paketleyiciler ve çerçevelerle çalışmaya devam edeceğiz.

</Note>

Bir Sunucu Eylemi `“use server”` direktifi tanımlandığında, çatınız otomatik olarak sunucu işlevine bir referans oluşturacak ve bu referansı İstemci Bileşenine aktaracaktır. Bu işlev istemcide çağrıldığında, React işlevi yürütmek için sunucuya bir istek gönderecek ve sonucu return edecektir.

Sunucu Eylemleri, Sunucu Bileşenlerinde oluşturulabilir ve İstemci Bileşenlerine destek olarak aktarılabilir veya İstemci Bileşenlerinde içe aktarılabilir ve kullanılabilir

### Sunucu Bileşeninden Sunucu Eylemi Oluşturma {/*creating-a-server-action-from-a-server-component*/}

Sunucu Bileşenleri `“use server”` yönergesi ile Sunucu Eylemleri tanımlayabilir:

```js [[2, 7, "'use server'"], [1, 5, "createNoteAction"], [1, 12, "createNoteAction"]]
// Sunucu Bileşeni
import Button from './Button';

function EmptyNote () {
  async function createNoteAction() {
    // Sunucu Eylemi
    'use server';
    
    await db.notes.create();
  }

  return <Button onClick={createNoteAction}/>;
}
```

React, `EmptyNote` Sunucu Bileşenini işlediğinde, `createNoteAction` fonksiyonuna bir referans oluşturacak ve bu referansı `Button` İstemci Bileşenine aktaracaktır. Butona tıklandığında, React, sağlanan referansla `createNoteAction` fonksiyonunu çalıştırmak için sunucuya bir istek gönderecektir:

```js {5}
"use client";

export default function Button({onClick}) { 
  console.log(onClick); 
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={() => onClick()}>Boş Not Oluştur</button>
}
```

Daha fazlası için [`“use server”`](/reference/rsc/use-server) dokümanlarına bakın.


### İstemci Bileşenlerinden Sunucu Eylemlerini İçe Aktarma {/*importing-server-actions-from-client-components*/}

İstemci Bileşenleri, `“use server”` direktifini kullanan dosyalardan Sunucu Eylemlerini içe aktarabilir:

```js [[1, 3, "createNoteAction"]]
"use server";

export async function createNoteAction() {
  await db.notes.create();
}

```

Paketleyici `EmptyNote` İstemci Bileşenini oluşturduğunda, paketteki `createNoteAction` işlevine bir referans oluşturacaktır. Butona tıklandığında React, sağlanan referansı kullanarak `createNoteAction` fonksiyonunu çalıştırmak için sunucuya bir istek gönderecektir:

```js [[1, 2, "createNoteAction"], [1, 5, "createNoteAction"], [1, 7, "createNoteAction"]]
"use client";
import {createNoteAction} from './actions';

function EmptyNote() {
  console.log(createNoteAction);
  // {$$typeof: Symbol.for("react.server.reference"), $$id: 'createNoteAction'}
  return <button onClick={createNoteAction} />
}
```

Daha fazlası için [`“use server”`](/reference/rsc/use-server) dokümanlarına bakın.

### Sunucu Eylemlerini Eylemlerle Oluşturma {/*composing-server-actions-with-actions*/}

Sunucu Eylemleri, istemci üzerindeki Eylemlerle birlikte oluşturulabilir:

```js [[1, 3, "updateName"]]
"use server";

export async function updateName(name) {
  if (!name) {
    return {error: 'İsim gereklidir'};
  }
  await db.users.updateName(name);
}
```

```js [[1, 3, "updateName"], [1, 13, "updateName"], [2, 11, "submitAction"],  [2, 23, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const [isPending, startTransition] = useTransition();

  const submitAction = async () => {
    startTransition(async () => {
      const {error} = await updateName(name);
      if (!error) {
        setError(error);
      } else {
        setName('');
      }
    })
  }
  
  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Başarısız: {state.error}</span>}
    </form>
  )
}
```

Bu, Sunucu Eyleminin `isPending` durumuna, istemcideki bir Eyleme sararak erişmenizi sağlar.

Daha fazlası için [Sunucu Eylemini `<form>` dışında çağırma](/reference/rsc/use-server#calling-a-server-action-outside-of-form) dokümanlarına bakın

### Sunucu Eylemleri ile Form Eylemleri {/*form-actions-with-server-actions*/}

Sunucu Eylemleri, React 19'daki yeni Form özellikleri ile çalışır.

Formu otomatik olarak sunucuya göndermek için bir Form'a bir Sunucu Eylemi aktarabilirsiniz:


```js [[1, 3, "updateName"], [1, 7, "updateName"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  return (
    <form action={updateName}>
      <input type="text" name="name" />
    </form>
  )
}
```

Form gönderimi başarılı olduğunda, React formu otomatik olarak sıfırlayacaktır. Pending state, son yanıta erişmek veya aşamalı geliştirmeyi desteklemek için `useActionState` ekleyebilirsiniz.

Daha fazla bilgi için [Formlarda Sunucu Eylemleri](/reference/rsc/use-server#server-actions-in-forms) dokümanlarına bakın.

### `UseActionState` ile Sunucu Eylemleri {/*server-actions-with-use-action-state*/}

Yalnızca pending state'ine ve son döndürülen yanıta erişmeniz gereken yaygın durumlar için Sunucu Eylemlerini `useActionState` ile oluşturabilirsiniz:

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "submitAction"], [2, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [state, submitAction, isPending] = useActionState(updateName, {error: null});

  return (
    <form action={submitAction}>
      <input type="text" name="name" disabled={isPending}/>
      {state.error && <span>Başarısız: {state.error}</span>}
    </form>
  );
}
```

Sunucu Eylemleri ile `useActionState` kullanıldığında, React ayrıca hidrasyon tamamlanmadan önce girilen form gönderimlerini otomatik olarak yeniden oynatacaktır. Bu, kullanıcıların uygulama hidratlanmadan önce bile uygulamanızla etkileşime girebileceği anlamına gelir.

Daha fazlası için [`useActionState`](/reference/react-dom/hooks/useFormState) dokümanlarına bakın.

### `UseActionState` ile aşamalı iyileştirme {/*progressive-enhancement-with-useactionstate*/}

Sunucu Eylemleri ayrıca `useActionState` üçüncü bağımsız değişkeni ile aşamalı geliştirmeyi de destekler.

```js [[1, 3, "updateName"], [1, 6, "updateName"], [2, 6, "/name/update"], [3, 6, "submitAction"], [3, 9, "submitAction"]]
"use client";

import {updateName} from './actions';

function UpdateName() {
  const [, submitAction] = useActionState(updateName, null, `/name/update`);

  return (
    <form action={submitAction}>
      ...
    </form>
  );
}
```

<CodeStep step={2}>permalink</CodeStep> `useActionState` için sağlandığında, form JavaScript paketi yüklenmeden önce gönderilirse React sağlanan URL'ye yönlendirecektir.

Daha fazlası için [`useActionState`](/reference/react-dom/hooks/useFormState) dokümanlarına bakın.
