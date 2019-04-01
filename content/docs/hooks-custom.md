---
id: hooks-custom
title: Kendi Hook'unuzu Oluşturun
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

*Hook*'lar React'e 16.8 versiyonu ile henüz yeni eklenmişlerdir. Hook'lar sayesinde state ve diğer React özelliklerini bir sınıf oluşturmadan kullanabilirsiniz.

Kendi hook'unuzu oluşturmak, bileşen kodunuzu tekrar kullanılabilir fonksiyonlar halinde oluşturarak yönetmenizi sağlar.

[Effect Hook'unu](/docs/hooks-effect.html#example-using-hooks-1) kullanma yazısında, bir chat uygulamasında, arkadaşın çevrimiçi veya çevrimdışı olduğunu belirten mesajı görüntüleyen aşağıdaki bileşene değinmiştik: 

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

Şimdi, chat uygulamamızın bir kişi listesine sahip olduğunu düşünelim. Kişi listesindeki çevrimiçi olan kullanıcıların isimlerini yeşil renkte render etmek için, üstteki `FriendStatus` bileşeni ile benzer mantığı `FriendListItem` bileşenine kopyala/yapıştır yapabiliriz. Fakat bu durum kod tekrarı oluşturduğundan dolayı ideal bir çözüm olmayacaktır:

```js{4-15}
import React, { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

`FriendStatus` ve `FriendListItem`'te bulunan bu mantığı daha genel bir hale getirip bileşenler arasında paylaştırabiliriz.

React'te geleneksel olrak state'li mantığı bileşenler arasında paylaşmak için [render props](/docs/render-props.html) ve [higher-order components](/docs/higher-order-components.html) olmak üzere iki yöntem bulunmaktadır. Bunların yerine hook'lar sayesinde bileşen ağacına yeni bir bileşen eklemeden bu tarz problemleri nasıl çözeceğimize değineceğiz.

## Özel Hook Oluşturma {#extracting-a-custom-hook}

Ortak bir işlevin iki JavaScript fonksiyonu arasında paylaştırılmasını istediğimizde, o işlev için üçüncü bir fonksiyon oluşturabiliyoruz. Bileşenler ve Hook'lar da birer fonksiyon olduklarından dolayı, bu durum onlar için de geçerlidir.

**Özel Hook aslında bir JavaScript fonksiyonudur ve isimlendirmeleri "`use`" ile başlar. Ayrıca diğer Hook'ları da çağırabilirler.** Örneğin aşağıda ilk olarak oluşturduğumuz özel Hook'umuz bulunuyor:

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Kod mantığını üstteki bileşenlerden aldığı için içerisinde yeni bir şey bulunmuyor. Tıpkı bileşenlerde olduğu gibi, özel Hook'unuzun üst seviyesinde diğer Hook'ları çağırabilirsiniz. 

Bileşenlerin aksine, özel Hook'larda belirli bir fonksiyon imzasının bulunma zorunluluğu yoktur. Hangi değerlerin parametre olarak verileceğine ve Hook'tan geri döndürüleceğine biz karar verebiliriz. Başka bir deyişle, normal fonksiyonlarda yaptığımız gibi Hook'ların kodlayabiliriz. Tek bir şart bulunuyor o da ilk bakışta fonksiyonun bir React Hook olduğunu anlayabilmek için fonksiyon isimlendirmesinin başında `use` kullanılması gerekiyor. Buna benzer olarak Hook'lar hakkında diğer kurallar için [bu dokümanı](/docs/hooks-rules.html) inceleyebilirsiniz. 

`useFriendStatus` Hook'unun amacı, chat'teki ilgili arkadaşın durumuna abone olmayı sağlamaktır. Bu nedenle parametre olarak `friendID`'yi alır ve kullanıcının çevrimiçi/çevrimdışı durumunu geri döndürür:

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

Şimdi özel Hook'umuzu nasıl kullanacağımıza geçelim.

## Özel Hook'un Kullanımı {#using-a-custom-hook}

Başlangıçtaki amacımız, `FriendStatus` ve `FriendListItem` bileşenlerindeki mükerrer kod mantığını genel bir hale getirmek idi. Çünkü iki bileşen de bir arkadaşın çevrimiçi olma durumundan haberdar olması gerekiyordu.

Bu kod mantığını iki bileşenden çıkararak `useFriendStatus` hook'unu oluşturduk. Artık aşağıdaki gibi kullanabiliriz: 

```js{2}
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```js{2}
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

**Bu kod orijinal örneklerdeki ile aynı şekilde çalışır mı?** diye soracak olursanız, evet tam olarak aynı şekilde çalışacağını söyleyebiliriz. Eğer yakından bakarsanız, kod mantığı üzerinde hiçbir değişiklik yapmadığımızı göreceksiniz. Yaptığımız tek şey, iki fonksiyonda da olan kodu, ayrı bir fonksiyona taşımak oldu. **Bu nedenle özel Hook'lar, bir React özelliğinden ziyade, Hook'lardaki tasarımsal mantığı takip ederek oluşturulurlar.**

**Peki ya "`use`" ön eki kullanarak özel Hook'larımı isimlendirmek zorunda mıyım?** Zorunda değilsiniz fakat lütfen bu şekilde isimlendiriniz. Eğer böyle yapmazsanız, [Hooks kurallarının](/docs/hooks-rules.html) ihlalini otomatik olarak kontrol edemeyiz. Çünkü hangi fonksiyonun kendi içerisinde Hook'lara çağrı yaptığını bilemeyiz. 

**Aynı Hook'u kullanan iki bileşen, birbirleri arasında state'i de paylaşır mı?** Hayır. Özel Hook'lar, *state'li mantığı* (örneğin, bir abonelik oluşturmak ve bu aboneliğin değerini barındırmak gibi işlemleri) tekrar kullanmak için bir mekanizmadır. Fakat her defasında özel bir Hook kullandığınızda, state ve içerisindeki etkileri tamamen bileşenden izole edilmiştir.

**Özel Hook, izole bir state'e nasıl sahip olur?** Hook'a yapılan her çağrı, izole state'e sahip olur. Biz `useFriendStatus`'u direkt olarak çağırdığımızda, React'in bakış açısıyla `useState` ve `useEffect` hook'ları çağrılmış olur. [Daha önce](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns) de [öğrendiğimiz gibi](/docs/hooks-state.html#tip-using-multiple-state-variables) bir bileşen içerisinde `useState` ve `useEffect` hook'larını istediğimiz kadar çağırabiliriz ve bunu yaptığımızda iki hook da birbirinden bağımsız olarak çalışacaktır.

### İpucu: Bilginin Hook'lar Arasında Aktarılması {#tip-pass-information-between-hooks}

Hook'lar fonksiyon oldukları için, bir bilgiyi birbirlerine aktarabiliriz. 

Bunu daha iyi açıklamak için, daha önceki chat örneğimizdeki diğer bir bileşeni kullanacağız. Bu bileşen, chat mesajı için alıcı seçmeye yarar. Bu sayede seçili olarak belirtilmiş çevrimiçi arkadaşın görüntülenmesi sağlanır:

```js{8-9,13}
const friendList = [
  { id: 1, name: 'Phoebe' },
  { id: 2, name: 'Rachel' },
  { id: 3, name: 'Ross' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

Mevcut seçili arkadaş ID'sini `recipientID` ismindeki state değşkeninde saklıyoruz ve eğer kullanıcı `<select>` seçicisinden farklı bir arkadaşı seçerse bu değişkeni güncelliyoruz.

`useState` Hook'u, `recipientID` state değişkeninin en güncel değerini bize verdiğinden dolayı, önceden oluşturduğumuz `useFriendStatus` adındaki özel hook'a bu değeri parametre olarak geçirebiliriz: 

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

Bu kod, *mevcut seçili* arkadaşın çevrimiçi olup olmadığını bilmemizi sağlar. Eğer farklı bir arkadaşı seçip `recipientID` state değişkenini güncellersek, `useFriendStatus` Hook'u önceden seçili arkadaşın durumunu izlemedeki abonelikten çıkacak ve yeni seçili olan arkadaşın durumu için abone olacaktır.

## `useYourImagination()` {#useyourimagination}

Custom Hooks offer the flexibility of sharing logic that wasn't possible in React components before. You can write custom Hooks that cover a wide range of use cases like form handling, animation, declarative subscriptions, timers, and probably many more we haven't considered. What's more, you can build Hooks that are just as easy to use as React's built-in features.

Try to resist adding abstraction too early. Now that function components can do more, it's likely that the average function component in your codebase will become longer. This is normal -- don't feel like you *have to* immediately split it into Hooks. But we also encourage you to start spotting cases where a custom Hook could hide complex logic behind a simple interface, or help untangle a messy component.

For example, maybe you have a complex component that contains a lot of local state that is managed in an ad-hoc way. `useState` doesn't make centralizing the update logic any easier so might you prefer to write it as a [Redux](https://redux.js.org/) reducer:

```js
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... other actions ...
    default:
      return state;
  }
}
```

Reducers are very convenient to test in isolation, and scale to express complex update logic. You can further break them apart into smaller reducers if necessary. However, you might also enjoy the benefits of using React local state, or might not want to install another library.

So what if we could write a `useReducer` Hook that lets us manage the *local* state of our component with a reducer? A simplified version of it might look like this:

```js
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

Now we could use it in our component, and let the reducer drive its state management:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

The need to manage local state with a reducer in a complex component is common enough that we've built the `useReducer` Hook right into React. You'll find it together with other built-in Hooks in the [Hooks API reference](/docs/hooks-reference.html).
