---
id: hooks-state
title: State Hook Kullanımı
permalink: docs/hooks-state.html
next: hooks-effect.html
prev: hooks-overview.html
---

<<<<<<< HEAD
*Hook'lar* React 16.8. ile gelen yeni bir eklentidir. Bu yeni eklenti size herhangi bir sınıf oluşturmadan state ve diğer React özelliklerini kullanmanıza izin verir.
=======
> Try the new React documentation.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [State: A Component's Memory](https://beta.reactjs.org/learn/state-a-components-memory)
> - [`useState`](https://beta.reactjs.org/reference/react/useState)
>
> The new docs will soon replace this site, which will be archived. [Provide feedback.](https://github.com/reactjs/reactjs.org/issues/3308)

*Hooks* are a new addition in React 16.8. They let you use state and other React features without writing a class.
>>>>>>> 5647a9485db3426d62b5a8203f4499c01bcd789b

[Giriş Sayfasında](/docs/hooks-intro.html), Hook'lara aşina olmak için, aşağıdaki örnek kullanılmıştı:

```js{4-5}
import React, { useState } from 'react';

function Example() {
  // "count" adında yeni bir state değişkeni tanımlayın.
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

Bu kodu, eşdeğeri olan sınıf koduyla karşılaştırarak Hook'ları öğrenmeye başlayacağız. 

## Eşdeğer Sınıf Örneği {#equivalent-class-example}

Eğer React'te sınıfları kullandıysanız, bu kod size tanıdık gelecektir.

```js
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

State `{ count: 0 }` olarak başlar ve kullanıcı her tıkladığında `this.setState()` çağırılarak `state.count` arttırılır. Sayfa boyunca bu sınıftan parçalar kullanacağız.


>Not
>
>Neden daha gerçekçi bir örnek yerine sayaç kullandığımızı merak ediyor olabilirsiniz. Bu, Hook'lar ile ilk adımlarınızı atarken API'a odaklanmanıza yardımcı olacaktır. 

## Hook'lar ve Fonksiyon Bileşenleri {#hooks-and-function-components}

React'teki fonksiyon bileşenlerinin böyle gözüktüğünü unutmayınız:

```js
const Example = (props) => {
  // Hook'ları burada kullanabilirsiniz!
  return <div />;
}
```

ya da bunu:

```js
function Example(props) {
  // Hook'ları burada kullanabilirsiniz!
  return <div />;
}
```

Yukarıdakileri "durumsuz (stateless) bileşenler" olarak biliyor olabilirsiniz. Şimdi bu bileşenlere React state'ini kullanma özelliğini getiriyoruz; bu yüzden bunlara "fonksiyon bileşenleri" demeyi tercih ediyoruz. 

Hook'lar sınıfların içinde **çalışmazlar** fakat onları sınıf yazmadan da kullanabilirsiniz.

## Hook Nedir? {#whats-a-hook}

Yeni örneğimize React'ten `useState` hook'u import etmekle başlıyoruz

```js{1}
import React, { useState } from 'react';

function Example() {
  // ...
}
```

**Hook Nedir?** Hook, React özelliklerini "bağlamanıza" izin veren özel bir fonksiyondur. Örneğin `useState`, React state'ini fonksiyon bileşenlerine eklemenize izin veren bir Hook'tur. Yakında diğer Hook'ları da öğreneceğiz.


**Ne zaman bir Hook kullanmalıyım?** Eğer bir fonksiyon bileşeni yazarsanız ve ona biraz state eklemeniz gerektiğini farkederseniz, bundan önce o fonksiyonu bir sınıfa (class) dönüştürmeniz gerekiyordu. Fakat şimdi, varolan fonksiyon bileşenlerinin içinde Hook kullanabilirsiniz. Şimdi tam olarak bunu yapacağız!


>Not:
>
>Hook'ları bileşenlerin içinde kullanıp kullanamayacağımız hakkında birkaç özel kural vardır. Bunları [Hook Kuralları](/docs/hooks-rules.html) sayfasında öğreneceğiz.


## Bir State Değişkeni Tanımlamak  {#declaring-a-state-variable}

Bir sınıfın içinde, `count` state'ini constructor (yapıcı fonksiyon) içinde `this.state`'i `{ count: 0 }`'a eşitleyerek `0` olarak başlatıyoruz. 

```js{4-6}
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

Fonksiyon bileşenlerinde `this` yoktur; bu yüzden `this.state`'e değer ataması veya `this.state`ten okuma yapamıyoruz. Bunun yerine bileşenimizin içinde direkt olarak `useState` hook'unu çağırıyoruz. 

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // "count" adında yeni bir state değişkeni tanımlayın.
  const [count, setCount] = useState(0);
```

**`useState`'i çağırmak ne işe yarar?** Bu, yeni bir "state değişkeni" tanımlar. Değişkenimizin adı `count`; fakat farklı bir şekilde de (örneğin `banana`) çağırabilirdik. Bu yöntemle fonksiyon çağrıları arasında verilerinizi koruyabilirsiniz. — `useState` ise `this.state`'in sınıfta sağladığı özellikleri kullanmanın yeni bir yoludur. Normalde değişkenler fonksiyon bitiminde "kaybolur"; fakat state değişkenleri React tarafından korunur.

**`useState`'e argüman olarak ne atarız?** `useState()` Hook'u için tek argüman initial (başlangıç) state argümanıdır. Sınıfların aksine, state bir nesne olmak zorunda değildir. Sayı ya da string tutabiliriz. Örneğimizde kullanıcının tıklama sayısı için bir sayı istedik bu yüzden değişkenimizin başlangıç değeri `0` olarak atandı. (eğer state'in içinde iki farklı değer tutmak isteseydik,  `useState()`'i iki kere çağırmamız gerekecekti.)

**`useState` geriye ne döndürür?** `useState` geriye iki tane değer döndürür: Şimdiki state ve o state'i güncelleyen fonksiyon. Bu, `const [count, setCount] = useState()` yazmamızın sebebidir. Bu, bir sınıftaki `this.state.count` ve `this.setState`'e benzer. Eğer kullandığımız söz dizimi size tanıdık gelmediyse, [sayfanın alt kısmında](/docs/hooks-state.html#tip-what-do-square-brackets-mean) bu konuya tekrar döneceğiz.

Şimdi `useState` Hook'unun ne yaptığını bildiğimize göre, örneğimiz daha mantıklı bir hale gelecektir.

```js{4,5}
import React, { useState } from 'react';

function Example() {
  // "count" adında yeni bir state değişkeni tanımlayın.
  const [count, setCount] = useState(0);
```


`count` adında bir state değişkeni tanımladık ve `0`'a eşitledik. React, tekrar eden render işlemleri arasında değişkenin mevcut değerini hatırlayacak ve fonksiyonumuza en yeni değeri verecektir. Eğer şu anki `count` değerini değiştirmek isterseniz  `setCount` çağırabilirsiniz.


>Not
>
>`useState` 'in isminin neden `createState` olmadığını merak ediyor olabilirsiniz.
>
>"Create" tam olarak doğru olmazdı. Çünkü state; sadece bileşenimizi ilk kez render ettiğimizde oluşturulur. Sonraki renderlarda `useState` bize o anki state'i verir. Aksi takdirde bu "state" olmazdı. Aynı zamanda hook'ların isimlerinin neden *hep* `use` ile başlamasının nedeni de var. Bunu daha sonra [Hook Kuralları](/docs/hooks-rules.html) bölümünde öğreneceğiz.

## State Okuma {#reading-state}

Sınıf temelli bir component'de geçerli count'u göstermek istediğimiz zaman `this.state.count`'i okuruz:

```js
  <p>You clicked {this.state.count} times</p>
```

Foksiyon  temelli bir component'de ise `count` değişkenini direk kullanabiliriz.:


```js
  <p>You clicked {count} times</p>
```

## State Güncelleme {#updating-state}

`count` state'i güncellemek için sınıfın içinde `this.setState()`'i çağırmamız gerekiyor.

```js{1}
  <button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click me
  </button>
```

Fonksiyonda zaten değişken olarak `setCount` ve `count`'a sahibiz, bu yüzden `this`'e ihtiyaç duymuyoruz :

```js{1}
  <button onClick={() => setCount(count + 1)}>
    Click me
  </button>
```

## Özet {#recap}

Hadi şimdi **Şimdi de baştan sona öğrendiklerimizin üzerinden geçelim ve anlayıp anlamadığımızı kontrol edelim.**

<!--
  I'm not proud of this line markup. Please somebody fix this.
  But if GitHub got away with it for years we can cheat.
-->
```js{1,4,9}
 1:  import React, { useState } from 'react';
 2:
 3:  function Example() {
 4:    const [count, setCount] = useState(0);
 5:
 6:    return (
 7:      <div>
 8:        <p>You clicked {count} times</p>
 9:        <button onClick={() => setCount(count + 1)}>
10:         Click me
11:        </button>
12:      </div>
13:    );
14:  }
```

* **Satır 1:** React'ten `useState` Hook'unu ekliyoruz. Bu, yerel state'i fonksiyon bileşeninde tutmamıza izin verecek.
* **Satır 4:** `Example` bileşeninin içinde `useState` Hook'unu çağırarak yeni bir state değişkeni tanımlıyoruz. Bu, isimlerini bizim verdiğimiz bir çift değer döndürür. Değişkenimizin adı `count` çünkü tıklama sayısını tutuyor.`useState`e `0` yollayarak `count`'u `0`sıfırdan başlatıyoruz. İkinci döndürülen değerin kendisi bir fonksiyondur. Bu, bize `count`'u güncellemek için izin verir. Bu yüzden onu `setCount` diye isimlendirdik.
* **Satır 9:** Kullanıcı her tıkladığında, `setCount`'u yeni bir değerle çağırırız. React, `Example` bileşenini tekrar render edip, ona yeni `count` değerini atar.

İlk bakışta öğrenecek çok fazla şey varmış gibi görünebilir. Acele etmeyin! Açıklamalar arasında kaybolduysanız, yukarıdaki koda tekrar bakın ve baştan sona tekrar okumaya çalışın. State'in sınıflarda nasıl çalıştığını unutup bu koda meraklı gözlerle tekrar baktığınızda, söz veriyoruz, daha anlamlı gelecek.


### İpucu: Köşeli Parantez Ne Anlama gelir? {#tip-what-do-square-brackets-mean}

State değişkenlerini tanımlarken köşeli parantezleri fark etmiş olabilirsiniz:

```js
  const [count, setCount] = useState(0);
```

Soldaki isimler React API'ının bir parçası değildir.Kendi state değişkenlerinizi isimlendirebilirsiniz:

```js
  const [fruit, setFruit] = useState('banana');
```

Bu JavaScript sözdizimi ["dizi parçalama (array destructuring)"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring) olarak adlandırılır.`fruit` ve `setFruit` diye iki yeni değişken oluşturduğumuz anlamına gelir.Burada `fruit`, `useState` tarafından dönen ilk değere; `setFruit` ise ikinci değere atanır bu kod ile eşdeğerdir. 


```js
  var fruitStateVariable = useState('banana'); // Returns a pair
  var fruit = fruitStateVariable[0]; // First item in a pair
  var setFruit = fruitStateVariable[1]; // Second item in a pair
```

`useState` ile state değişkeni tanımladığımız zaman, bu bir çift (iki elemanlı bir dizi) döndürür. İlk eleman o anki değer, ikincisi ise onu güncelleyen fonksiyondur. `[0]` ve `[1]` kullanarak erişmek biraz kafa karıştırıcı çünkü onların kendine özgü anlamları var. Bu yüzden onun yerine dizi parçalama (array destructuring) yöntemini kullanıyoruz.

>Not
>
>this gibi bir şey iletmediğimiz için, React'in useState'in hangi bileşene denk geldiğini nasıl bildiğini merak ediyor olabilirsiniz.  [Bu soruyu](/docs/hooks-faq.html#how-does-react-associate-hook-calls-with-components) ve bunun gibi daha bir coğunu S.S.S. kısmında cevaplıyoruz.

### İpucu: Çoklu State Değişkeni Kullanımı {#tip-using-multiple-state-variables}

Ayrıca; birden fazla state kullanmak istediğimiz durumlarda, farklı state değişkenlerine farklı adlar vermemize izin verdiği için, state değişkenlerini bir çift olarak (`[something, setSomething]`) tanımlamak kullanışlıdır.

```js
function ExampleWithManyStates() {
  // Birden fazla state değişkeni bildir!
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

Yukarıdaki bileşende, `age`, `fruit` ve `todos` adında yerel değişkenlerimiz var ve bunları ayrı ayrı güncelleyebiliriz.

```js
  function handleOrangeClick() {
    // this.setState({ fruit: 'orange' }) ile benzerdir.
    setFruit('orange');
  }
```

birden fazla state değişkeni **kullanmak zorunda değilsiniz**. State değişkenleri, nesneleri ve dizileri gayet güzel bir şekilde tutabilir; böylece ilgili verileri birlikte tutabilirsiniz fakat sınıftaki `this.setState`'ın aksine state değişkenini güncellemek, birleştirmek (merge) yerine var olan ile *değiştirir*.

Bağımsız state değişkenlerini ayırma konusunda daha fazla öneriye [bu bölümden](/docs/hooks-faq.html#should-i-use-one-or-many-state-variables) ulaşabilirsiniz.


## Sonraki Adımlar {#next-steps}

Bu sayfada React tarafından sağlanan Hook'lardan birini, `useState`'i, öğrendik.Bazen bundan "State Hook" olarak da bahsedecegiz. Bu, ilk kez yapmış olduğumuz, React'in fonksiyon bileşenlerine yerel state eklememize imkân sağlıyor. 

Aynı zamanda Hook'lar hakkında bir şeyler öğrendik. Hooklar, React özelliklerini fonksiyon bileşenlerine bağlamamızı sağlayan fonksiyonlardir. İsimleri her zaman `use` ile başlar ve henüz öğrenmediğimiz Hook'lar vardır.


**Hadi şimdi bir sonraki hook olarak  [`useEffect`'i öğrenerek](/docs/hooks-effect.html) devam edelim.** useEffect, bileşenler üzerinde yan etkiler gerçekleştirmenize izin verir ve sınıflardaki yaşam döngüsü (lifecycle) metotlarına benzer.
