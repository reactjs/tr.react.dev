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

## Using a Custom Hook {#using-a-custom-hook}

In the beginning, our stated goal was to remove the duplicated logic from the `FriendStatus` and `FriendListItem` components. Both of them want to know whether a friend is online.

Now that we've extracted this logic to a `useFriendStatus` hook, we can *just use it:*

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

**Is this code equivalent to the original examples?** Yes, it works in exactly the same way. If you look closely, you'll notice we didn't make any changes to the behavior. All we did was to extract some common code between two functions into a separate function. **Custom Hooks are a convention that naturally follows from the design of Hooks, rather than a React feature.**

**Do I have to name my custom Hooks starting with “`use`”?** Please do. This convention is very important. Without it, we wouldn't be able to automatically check for violations of [rules of Hooks](/docs/hooks-rules.html) because we couldn't tell if a certain function contains calls to Hooks inside of it.

**Do two components using the same Hook share state?** No. Custom Hooks are a mechanism to reuse *stateful logic* (such as setting up a subscription and remembering the current value), but every time you use a custom Hook, all state and effects inside of it are fully isolated.

**How does a custom Hook get isolated state?** Each *call* to a Hook gets isolated state. Because we call `useFriendStatus` directly, from React's point of view our component just calls `useState` and `useEffect`. And as we [learned](/docs/hooks-state.html#tip-using-multiple-state-variables) [earlier](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns), we can call `useState` and `useEffect` many times in one component, and they will be completely independent.

### Tip: Pass Information Between Hooks {#tip-pass-information-between-hooks}

Since Hooks are functions, we can pass information between them.

To illustrate this, we'll use another component from our hypothetical chat example. This is a chat message recipient picker that displays whether the currently selected friend is online:

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

We keep the currently chosen friend ID in the `recipientID` state variable, and update it if the user chooses a different friend in the `<select>` picker.

Because the `useState` Hook call gives us the latest value of the `recipientID` state variable, we can pass it to our custom `useFriendStatus` Hook as an argument:

```js
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);
```

This lets us know whether the *currently selected* friend is online. If we pick a different friend and update the `recipientID` state variable, our `useFriendStatus` Hook will unsubscribe from the previously selected friend, and subscribe to the status of the newly selected one.

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
