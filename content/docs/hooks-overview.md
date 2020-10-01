---
id: hooks-overview
title: İlk Bakışta Hook'lar
permalink: docs/hooks-overview.html
next: hooks-state.html
prev: hooks-intro.html
---

*Hook*'lar React 16.8'deki yeni bir eklentidir. Bir sınıf yazmadan state ve diğer React özelliklerini kullanmanıza olanak sağlar.

Hook'larda [mevcut kodu bozan değişiklikler yok](/docs/hooks-intro.html#no-breaking-changes). Bu sayfa, tecrübeli React kullanıcılarına Hook'lar hakkında genel bir fikir sağlar. Bu hızlı bir gözden geçirme demektir. Eğer kafanız karışırsa bu tarz bir sarı kutu arayın:

>Detaylı açıklama
>
>Neden Hook'ları çıkardığımızı anlamak için [Motivasyon](/docs/hooks-intro.html#motivation) bölümünü okuyun.

**↑↑↑ Her bölüm bunun gibi bir sarı kutuyla biter** Bunlar detaylı açıklamaların nerede bulunacağını gösterir.

## 📌 State Hook'u {#state-hook}

Bu örnek bir sayaç render ediyor. Tuşa basıldığında değeri bir arttırıyor:

```js{1,4,5}
import React, { useState } from 'react';

function Example() {
  // Yeni bir state değişkeni belirlenir, biz buna "count" diyeceğiz.
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

Burada, `useState` bir *Hook* (birazdan bunun ne demek olduğuyla alakalı konuşacağız). Bu fonksiyonu; fonksiyonel bir bileşene, yerel bir state eklemek amacıyla, bu bileşenin içerisinde çağırıyoruz. React bu state'i yenilenen render'lar arasında muhafaza edecek. `useState` bir çift döndürür: *anlık* state değeri ve bunu değiştirmenize yarayan bir fonksiyon. Bu fonksiyonu bir olay yöneticisinde veya başka bir yerde çağırabilirsiniz. Bu, class'lardaki `this.setState` fonksiyonuna benzer, fakat eski ve yeni state'i birleştirmez. (`useState` ve `this.state` farklarını [State Hook'unu Kullanmak](/docs/hooks-state.html) bölümünde göstereceğiz.)

`useState`'in aldığı tek argüman başlangıçtaki state'dir. Yukarıdaki örnekte bu argüman `0`, çünkü sayacımız sıfırdan başlıyor. `this.state`'ten farklı olarak state'in bir obje olması gerekmediğine dikkat edin -- tabi isterseniz obje de kullanabilirsiniz. Başlangıç state argümanı sadece ilk render'da kullanılır.

#### Birden fazla state değişkeni tanımlamak {#declaring-multiple-state-variables}

State Hook'unu tek bir bileşende, birden fazla kullanabilirsiniz:

```js
function ExampleWithManyStates() {
  // Declare multiple state variables!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```

[Dizi parçalama (array destructuring)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring) syntax'i `useState` kullanarak tanımladığımız state değişkenlerine farklı isimler vermemize olanak tanır. Bu isimler `useState` API'nin bir parçası değildir. Bunun yerine; eğer `useState`'i çok fazla çağırırsanız, React her render'da aynı sırayla çağırdığınızı var sayar. Bunun niye çalıştığına ve nasıl kullanışlı olacağına ileride değineceğiz.

#### Peki bir hook nedir? {#but-what-is-a-hook}

Hook'lar React state ve yaşam döngüsü özelliklerine fonksiyonel bileşenleri kullanarak “bağlamanıza” yarayan fonksiyonlardır. Hook'lar class'ların içerisinde çalışmazlar -- React'ı class'lar olmadan kullanmanıza yararlar. (Var olan bileşenlerinizi bir gecede tekrar yazmanızı [önermiyoruz](/docs/hooks-intro.html#gradual-adoption-strategy) fakat yeni bileşenleriniz için Hook'ları kullanmaya başlayabilirsiniz.)

React üzerinde `useState` gibi bir kaç Hook bulunmaktadır. Ayrıca siz de state'le alakalı davranışlarınızın, farklı bileşenler tarafından yeniden kullanılması için özel Hook'larınızı yazabilirsiniz. Öncelikle React üzerinde var olan Hook'ları inceleyeceğiz.

>Detaylı açıklama
>
>State Hook'u hakkında daha fazla bilgiye bu sayfadan ulaşabilirsiniz: [State Hook'unu Kullanmak](/docs/hooks-state.html).

## ⚡️ Effect Hook'u {#effect-hook}

Yüksek ihtimalle daha öncesinde data çekme, dışarıya bağlanma ya da DOM'u elle değiştirme gibi işlemleri React bileşenleri kullanarak yapmışsınızdır. Bu tarz işlemleri "yan etkiler(side effects)" (veya kısaca "etkiler") olarak adlandırıyoruz çünkü başka bileşenleri etkileyebiliyorlar ve render sırasında yapılamayan işlemler oluyorlar.

Effect Hook'u; `useEffect`, fonksiyonel bir bileşene yan etkileri kullanabilme yetkisini ekler. React class'larındaki `componentDidMount`, `componentDidUpdate`, ve `componentWillUnmount` ile aynı işleve sahiptir fakat tek bir API içerisinde birleştirilmiştir. (`useEffect` ve bu metodların farklarını örneklerle [Effect Hook'unu kullanmak](/docs/hooks-effect.html) bölümünde göstereceğiz.)

Örneğin, bu bileşen html dosyasının başlığını React DOM'u güncelledikten sonra değiştirir:

```js{1,6-10}
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // componentdidMount ve componentDidUpdate'e benzer bir şekilde:
  useEffect(() => {
    // Browser API kullanılarak document title güncellenir
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

`useEffect`'i çağırdığınız zaman, React değişiklikleri DOM'a ilettikten sonra "effect" fonksiyonunu çağırmasını söylüyorsunuz. Effect'ler bileşenin içerisinde tanımlandığından state ve prop'lara erişebiliyor. Varsayılan şekliyle React effect'leri her render sonrasında çalıştırır -- ilk render da bunların *içerisinde*. (Class yaşam döngüleriyle farkını detaylı olarak [Effect Hook'unu kullanmak](/docs/hooks-effect.html) bölümünde işleyeceğiz.)

İsteğe bağlı olarak Efect'lerin nasıl kendi "arkalarını toplayacakları", bir fonksiyon döndürülerek belirtilebilir. Örneğin, bu bileşen bir effect kullanarak, bir arkadaşın online bilgisine bağlanıyor ve kendi arkasını bu bağlantıyı kapatarak topluyor:

```js{10-16}
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
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

Bu örnekte, bileşen hem unmount anında hem de sonraki render yüzünden effect’i tekrar çalıştırmadan önce, React `ChatAPI`’ımızla bağlantıyı kesiyor. (eğer `ChatAPI`'a verilen `props.firend.id` değişmediyse, React’a tekrar [bağlantı kurmamasını söyleyebilirsiniz.](/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects))

`useState`’de olduğu gibi tek bir bileşende birden fazla effect kullanabilirsiniz:

```js{3,8}
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
```

Hook’lar bir bileşen içerisindeki yan etkileri yaşam döngüsü metodlarına ayırmaktansa, hangi parçaların etkilendğine bağlı olarak bu yan etkileri organize etmenize yarar.

>Detaylı Açıklama
>
>`useEffect` hakkında daha fazla bilgiye bu sayfadan ulaşabilirsiniz: [Effect Hook'unu kullanmak](/docs/hooks-effect.html).

## ✌️ Hook'ların Kuralları {#rules-of-hooks}

Hook'lar JavaScript fonksiyonlarıdır ama ek olarak iki kural koymaktadırlar:

* Hook'ları sadece **en üst seviyede** çağırın. Hook'ları döngülerin, koşulların veya iç içe fonksiyonların içerisinde çağırmayın.
* Hook'ları sadece **fonksiyonel React bileşenlerinde** çağırın. Normal JavaScript fonksiyonları içerisinde Hook'ları çağırmayın. (Hook'ları başka çağırabileceğiniz tek bir uygun yer var -- kendi yarattığınız Hook'lar. Birazdan bunlar hakkında daha fazla şey öğreneceğiz.)

Bu kuralları otomatik bir şekilde yürütmek için bir [linter eklentisi](https://www.npmjs.com/package/eslint-plugin-react-hooks) sağlıyoruz. Bu kuralların ilk bakışta sınırlayıcı ve kafa karıştırıcı görünebileceğini anlıyoruz fakat Hook'ların düzgün çalışması için hepsi çok önemlidir.

>Detaylı Açıklama
>
>Bu kurallar hakkında daha fazla bilgiye bu sayfadan ulaşabilirsiniz: [Hook Kuralları](/docs/hooks-rules.html).

## 💡 Özel Hook'larınızı Yapmak {#building-your-own-hooks}

Bazen state'le alakalı bazı davranışların bileşenler arasında yeniden kullanılabilir olmasını isteriz. Geleneksel olarak bunun için iki tane popüler çözüm vardır: [üst-seviye bileşenler](/docs/higher-order-components.html) ve [render prop'ları](/docs/render-props.html). Özel Hook'larınız da bunu yapmanıza izin verir ve bunu yaparken bileşen ağacınıza daha fazla bileşen eklemek zorunda kalmazsınız.

Daha öncesinde `useState` ve `useEffect` kullanarak bir arkadaşın online durumuna bağlanan `FriendStatus` adlı bir bileşen tanıtmıştık. Bu bağlantı davranışını başka bir bileşende tekrar kullanmak istediğimizi varsayalım.

Önce, bu davranışı kendi yarattığımız `useFriendStatus` adlı bir Hook'a aktaracağız:

```js{3}
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

Argüman olarak `friendID` alıyor, ve arkadaşımızın online olup olmadığını döndürüyor.

Artık iki bileşenden de bu davranışı kullanabiliriz:


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

Her bileşenin state'i birbirinden tamamen bağımsızdır. Hooklar *state'le alakalı davranışların* tekrar kullanılmasının bir yoludur, state'in yeniden kullanılmasıyla alakalı değildir. Hatta bir Hook her çağırıldığında tamamen ayrı bir state'e sahiptir -- bu sayede özel Hook'unuzu bir bileşen içerisinde iki kere çağırabilirsiniz.

Özel Hook'larınız bir özellikten daha çok bir kural gibidir. Eğer bir fonksiyonun adı "`use`" ile başlıyor ve başka Hook'ları çağırıyorsa, bu fonksiyon bir özel Hook'tur diyoruz. `useSomething` adlandırması linter eklentimizin, Hook kullanılarak yazılan kodda bugları bulmasını sağlıyor.

Özel Hook'larınızı bizim bahsetmediğimiz bir çok durum için kullanabilirsiniz, örneğin: form yönetimi, animasyon, tanımsal bağlantılar, zamanlayıcılar ve aklımıza gelmeyen bir çok farklı durum. React topluluğunun ne tür özel Hook'lar üreteceğini sabırsızlıkla bekliyoruz.

>Detaylı Açıklama
>
>Özel Hook'lar hakkında daha fazla bilgiye bu sayfadan ulaşabilirsiniz:  [Kendi Hook'larınızı Oluşturmak](/docs/hooks-custom.html).

## 🔌 Diğer Hook'lar {#other-hooks}

React içerisinde bulunan ve daha az kullanılan ama yararlı olabilecek bir kaç Hook daha bulunuyor. Örneğin, [`useContext`](/docs/hooks-reference.html#usecontext) iç içe geçmiş bileşenler kullanmadan, React context'e bağlanmanızı sağlar:

```js{2,3}
function Example() {
  const locale = useContext(LocaleContext);
  const theme = useContext(ThemeContext);
  // ...
}
```

Ve [`useReducer`](/docs/hooks-reference.html#usereducer) karmaşık bileşenlerinizin yerel state'ini bir reducer olmadan yönetmenizi sağlar:

```js{2}
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer);
  // ...
```

>Detaylı Açıklama
>
>React içerisindeki tüm Hook'lar hakkında daha fazla bilgiye bu sayfadan ulaşabilirsiniz: [Hook'ların API Kaynağı](/docs/hooks-reference.html).

## Sıradaki Adımlar {#next-steps}

Oof, bu hızlıydı! Eğer bazı şeyler kafanıza tam oturmadıysa veya daha fazla detayla öğrenmek isterseniz [State Hook'u](/docs/hooks-state.html) ile başlayarak, sıradaki sayfaları okuyabilirsiniz.

Ayrıca [Hook'ların API Kaynağı](/docs/hooks-reference.html) ve [Hook'lar için SSS](/docs/hooks-faq.html) bölümlerine bakabilirsiniz.

Son olarak, *neden* Hook'ları eklediğimizi ve uygulamalarımızı baştan yazmadan class'larla nasıl birlikte kullanacağımızı açıkladığımız [Hook'lara Giriş](/docs/hooks-intro.html) bölümünü okumayı unutmayın.
