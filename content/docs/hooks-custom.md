---
id: hooks-custom
title: Kendi Hook'unuzu Oluşturun
permalink: docs/hooks-custom.html
next: hooks-reference.html
prev: hooks-rules.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

</div>


Hook'lar React'e 16.8 versiyonu ile henüz yeni eklenmişlerdir. Hook'lar sayesinde state ve diğer React özelliklerini bir sınıf oluşturmadan kullanabilirsiniz.

Kendi hook'unuzu oluşturmak, bileşen kodunuzu tekrar kullanılabilir fonksiyonlar halinde oluşturarak yönetmenizi sağlar.

[Effect Hook'unu](/docs/hooks-effect.html#example-using-hooks-1) kullanma yazısında, mesajlaşma uygulamasında bir arkadaşın çevrimiçi veya çevrimdışı olduğunu belirten mesajı görüntüleyen aşağıdaki bileşene değinmiştik: 

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

Şimdi, mesajlaşma uygulamamızın bir kişi listesine sahip olduğunu düşünelim. Kişi listesindeki çevrimiçi olan kullanıcıların isimlerini yeşil renkte render etmek için, üstteki `FriendStatus` bileşeni ile benzer mantığı `FriendListItem` bileşenine kopyala/yapıştır yapabiliriz. Fakat bu durum kod tekrarı oluşturduğundan dolayı ideal bir çözüm olmayacaktır:

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

`FriendStatus` ve `FriendListItem`'da bulunan bu mantığı daha genel bir hale getirip bileşenler arasında paylaştırabiliriz.

React'te state'li mantığı bileşenler arasında paylaşmak için [render props](/docs/render-props.html) ve [higher-order components](/docs/higher-order-components.html) olmak üzere iki geleneksel yöntem bulunmaktadır. Bunların yerine Hook'ları kullanarak, DOM ağacına yeni bir bileşen eklemeden bu tarz problemleri nasıl çözeceğimize değineceğiz.

## Özel bir Hook Oluşturma {#extracting-a-custom-hook}

Normalde, ortak bir işlevin iki JavaScript fonksiyonu arasında paylaştırılmasını istediğimizde, o işlev için üçüncü bir fonksiyon oluşturabiliyoruz. Bileşenler ve Hook'lar da aslında birer fonksiyon olduklarından dolayı, bu durum onlar için de geçerlidir.

**Özel Hook aslında bir JavaScript fonksiyonudur ve adları "`use`" ile başlar. Ayrıca diğer Hook'ları da çağırabilirler.** Örneğin aşağıda ilk defa oluşturduğumuz özel Hook'umuz bulunuyor:

```js{3}
import { useState, useEffect } from 'react';

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

Kod mantığını üstteki bileşenlerden aldığı için içerisinde yeni bir şey bulunmuyor. Tıpkı bileşenlerde olduğu gibi, özel Hook'unuzun üst kısmında `useState()` gibi diğer Hook'ları çağırabilirsiniz. 

Bileşenlerin aksine, özel Hook'larda belirli bir fonksiyon imzasının bulunma zorunluluğu yoktur. Hangi değerlerin parametre olarak verileceğine ve Hook'tan neyin geri döndürüleceğine biz karar verebiliriz. Başka bir deyişle, normal fonksiyonlarda yaptığımız gibi Hook'ları kodlayabiliriz. Özel Hook oluştururken tek bir şartbulunuyor: ilk bakışta fonksiyonun bir React Hook olduğunu anlayabilmek için fonksiyon isimlendirmesinin başında `use` kullanılması gerekiyor. Buna benzer olarak Hook'lar hakkında diğer kurallar için [bu dokümanı](/docs/hooks-rules.html) inceleyebilirsiniz. 

`useFriendStatus` Hook'unun amacı, mesajlaşma uygulamasındaki ilgili arkadaşın durumuna abone olmayı sağlamaktır. Bu nedenle parametre olarak `friendID`'yi alır ve kullanıcının çevrimiçi/çevrimdışı durumunu geri döndürür:

```js
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  return isOnline;
}
```

Şimdi özel Hook'umuzu nasıl kullanacağımıza geçelim.

## Özel bir Hook'un Kullanımı {#using-a-custom-hook}

Başlangıçtaki amacımız, `FriendStatus` ve `FriendListItem` bileşenlerindeki tekrar eden kod mantığını genel bir hale getirmek idi. Çünkü iki bileşen de bir arkadaşın çevrimiçi olma durumundan haberdar olması gerekiyordu.

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

**Bu kod orijinal örneklerdeki ile aynı şekilde çalışır mı?** diye soracak olursanız, evet tam olarak aynı şekilde çalışacağını söyleyebiliriz. Eğer yakından bakarsanız, kod mantığı üzerinde hiçbir değişiklik yapmadığımızı göreceksiniz. Yaptığımız tek şey, iki fonksiyonda da olan kodu, ayrı bir fonksiyona taşımak oldu. **Bu nedenle özel olarak yazılan Hook'lar, bir React özelliğinden ziyade, Hook'lardaki tasarımsal mantığı takip ederek oluşturulurlar.**

**Özel olarak oluşturduğum Hook'u, "`use`" ön ekini kullanarak isimlendirmek zorunda mıyım?** Zorunda değilsiniz fakat bu şekilde isimlendirmenizi tavsiye ederiz. Eğer bu şekilde isimlendirmezseniz, [Hook kurallarının](/docs/hooks-rules.html) ihlalini otomatik olarak kontrol edemeyiz. Çünkü hangi fonksiyonun kendi içerisinde Hook'lara çağrı yaptığını bilemeyiz. 

**Aynı Hook'u kullanan iki bileşen, birbirleri arasında state'i de paylaşır mı?** Hayır. Özel Hook'lar, *state'li mantığı* (örneğin, bir abonelik oluşturmak ve bu aboneliğin değerini barındırmak gibi işlemleri) tekrar kullanmak için bir mekanizmadır. Fakat her defasında özel bir Hook kullandığınızda, state ve içerisindeki etkileri tamamen bileşenden izole edilmiştir.

**Özel Hook, izole bir state'e nasıl sahip olur?** Hook'a yapılan her çağrı, izole state'e sahip olur. Biz `useFriendStatus`'u direkt olarak çağırdığımızda, React'in bakış açısıyla `useState` ve `useEffect` hook'ları çağrılmış olur. [Daha önce](/docs/hooks-effect.html#tip-use-multiple-effects-to-separate-concerns) de [öğrendiğimiz gibi](/docs/hooks-state.html#tip-using-multiple-state-variables) bir bileşen içerisinde `useState` ve `useEffect` hook'larını istediğimiz kadar çağırabiliriz ve bunu yaptığımızda iki hook da birbirinden bağımsız olarak çalışacaktır.

### İpucu: Bilginin Hook'lar Arasında Aktarılması {#tip-pass-information-between-hooks}

Hook'lar birer fonksiyon oldukları için, bilgiyi birbirlerine aktarabiliriz. 

Bunu daha iyi açıklamak için, mesajlaşma uygulaması örneğimizdeki diğer bir bileşeni kullanacağız. Bu bileşen, bir mesaj için alıcı seçmeye yarar. Bu sayede seçili olarak işaretlenmiş bir arkadaşın çevrimiçi olup olmadığının görüntülenmesi sağlanır:

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

## `useHayalGücü()` {#useyourimagination}

Daha önce React bileşenlerinde mümkün olmayan paylaşım esnekliğini özel Hook'lar sunmaktadır. Aklınıza gelebilecek bir çok kullanım durumu için özel Hook'lar oluşturabilirsiniz. Bu kullanım durumlarına örnek verecek olursak: form işleme, animasyon, abonelikler, zamanlayıcılar ve şu an aklımıza gelmeyen daha bir çok şey. React'in beraberinde gelen özellikleri kadar kullanımı kolay olacak biçimde kendi Hook'unuzu oluşturabilirsiniz. 

Erken aşamalarda hemen soyutlamaya gitmeyiniz. Şu an bir fonksiyon bileşeni birçok işlemi gerçekleştiriyorsa, daha sonra projenizdeki bir fonksiyon bileşeninin ortalama uzunluğu da daha fazla olacaktır. Bu normaldir -- hemen kodu Hook'lara ayırma ihtiyacı duymak *zorunda değilsiniz*. Fakat basit bir arayüz arkasındaki karmaşık mantığın gizlenmesini veya karmaşık bir bileşenin ayrıştırılmasına yardımcı olmasını sağlayacak yerlerde özel Hook oluşturmanızı da tavsiye ederiz.

Örneğin, belirli bir amaç için yazılmış birçok yerel state içeren karmaşık bir bileşene sahip olduğunuzu düşünelim. `useState` Hook'unun, state güncelleme mantığını merkezi bir hale getirmesi kolay olmayacağından dolayı, [Redux](https://redux.js.org/) reducer olarak yazmayı tercih edebilirsiniz:

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

Reducer'lar, izole bir ortamda test yapmak ve karmaşık güncelleme mekanizmalarını ölçekleyerek oluşturmak için oldukça kullanışlıdır. Bu sayede bir reducer'ı gerektiğinde birden fazla küçük reducer'lara ayırabilirsiniz. Ancak, React'in yerel state'inin kullanımından keyif alıyor ve projenize harici bir kod kütüphanesini eklemek istemiyor da olabilirsiniz.

Peki  `useReducer` Hook'unu, bir reducer ile birlikte bileşenimizin `yerel` state'ini yönetecek şekilde yazarsak nasıl olur? Basitleştirilmiş versiyonu aşağıdaki gibi olacaktır: 

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

Artık oluşturduğumuz Hook'u bileşenimizde kullanabilir, ve reducer'ın state yönetiminde dümene geçmesini sağlayabiliriz:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

Karmaşık bir bileşende, reducer ile yerel state'in yönetim ihtiyacı oldukça yaygındır. Bu nedenle React'e, `useReducer` Hook'unu varsayılan olarak ekledik. Bunun gibi varsayılan olarak gelen diğer Hook'lar hakkında bilgi için [Hooks API başvuru dokümanını](/docs/hooks-reference.html) inceleyebilirsiniz.