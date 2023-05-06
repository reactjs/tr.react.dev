---
title: Giriş
---

<Intro>

React dokümantasyonuna hoş geldiniz! Bu sayfa sizin günlük olarak kullanacağınız React kavramlarının %80'ine giriş yapacaktır.

</Intro>

<YouWillLearn>

- Bileşenleri nasıl oluşturup iç içe yerleştireceğinizi
- Markup ve stilleri nasıl ekleyeceğinizi
- Verileri nasıl görüntüleyeceğinizi
- Koşulları ve listeleri nasıl oluşturacağınızı
- Olaylara nasıl yanıt vereceğinizi ve ekranı nasıl güncelleyeceğinizi
- Bileşenler arasında nasıl veri paylaşacağınızı

</YouWillLearn>

## Bileşenleri oluşturma ve iç içe yerleştirme {/*components*/}

React uygulamaları *bileşenler*'den oluşmaktadır. Bileşen, kendi mantığı ve görünümü olan UI (kullanıcı arayüzü) parçasıdır. Bileşen bir buton kadar küçük veya bir sayfa kadar büyük olabilir.


React bileşenleri, markup döndüren JavaScript fonksiyonlarıdır:

```js
function MyButton() {
  return (
    <button>Ben bir butonum</button>
  );
}
```

Şimdi, `MyButton`'ı oluşturduğunuza göre, onu başka bir bileşenin içine yerleştirebilirsiniz:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Uygulamama hoş geldiniz</h1>
      <MyButton />
    </div>
  );
}
```

Dikkat ettiyseniz `<MyButton />` büyük harfle başlıyor. Bu, onun bir React bileşeni olduğunu anlamanızı sağlar. React bileşen isimleri her zaman büyük harfle başlamalıdır, HTML etiketleri ise küçük harfle başlamalıdır.

Sonuca bir göz atın:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      Ben bir butonum
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Uygulamama hoş geldiniz</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

`export default` anahtar sözcüğü dosyadaki ana bileşeni belirtir. Eğer JavaScript söz dizimi hakkında bilginiz yoksa, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) ve [javascript.info](https://javascript.info/import-export) harika referanslara sahiptir.

## JSX ile markup yazma {/*writing-markup-with-jsx*/}

Yukarıda gördüğünüz markup söz dizilimi *JSX* olarak adlandırılmaktadır. Bu isteğe bağlıdır, ancak çoğu React projesi JSX'i kolaylığından dolayı kullanmaktadır. [Yerel geliştirme için önerdiğimiz tüm araçlar](/learn/installation) JSX'i kutudan çıkarılmış olarak desteklemektedir.

JSX, HTML'den daha katıdır. `<br />` gibi etiketleri kapatmanız gerekir. Bileşeniniz ayrıca birden fazla JSX etiketi döndüremez. Onları `<div>...</div>` veya boş `<>...</>` sarmalayıcısı gibi ortak bir üst öğeye sarmalamanız gerekir:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>Hakkında</h1>
      <p>Merhaba.<br />Nasılsınız?</p>
    </>
  );
}
```

Eğer JSX'e dönüştüreceğiniz çok fazla HTML'iniz varsa, [çevrimiçi bir dönüştürücü](https://transform.tools/html-to-jsx) kullanabilirsiniz.

## Stil ekleme {/*adding-styles*/}

React'de, bir CSS sınıfını `className` ile belirtirsiniz. Bu, HTML'deki [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) özniteliğiyle aynı şekilde çalışır:

```js
<img className="avatar" />
```

Ardından, CSS kurallarını ayrı bir CSS dosyasında yazarsınız:

```css
/* CSS'inizin içerisinde */
.avatar {
  border-radius: 50%;
}
```

React CSS dosyalarını nasıl ekleyeceğinizi önden belirtmez. En basit durumda, HTML'nize bir [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) etiketi ekleyeceksiniz. Eğer bir build aracı veya bir framework kullanıyorsanız, projenize bir CSS dosyası nasıl ekleyeceğinizi öğrenmek için dokümantasyonuna bakın.

## Veri görüntüleme {/*displaying-data*/}

JSX, Javascript içerisine markup eklemenizi olanaklı kılar. Süslü parantezler, Javascript'e "geri dönmenizi" sağlar, böylece kodunuzdan bir değişkeni gömüp kullanıcıya gösterebilirsiniz. Örneğin, bu `user.name`'i gösterecektir:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

Aynı zamanda, JSX özniteliklerinde de Javascript'e "geri dönme" yapabilirsiniz, ancak bunun için tırnak yerine süslü parantez kullanmanız gerekir. Örneğin, `className="avatar"` `"avatar"` stringini CSS sınıfı olarak geçer, ancak `src={user.imageUrl}` Javascript `user.imageUrl` değişken değerini okur ve bu değeri `src` özniteliği olarak geçer:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

JSX süslü parantezlerinin içerisine daha karmaşık ifadeler de yerleştirebilirsiniz, örneğin [string birleştirme](https://javascript.info/operators#string-concatenation-with-binary):

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Photo of ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

Yukarıdaki örnekte, `style={{}}` özel bir sözdizimi değil, `style={ }` JSX süslü parantezlerinin içerisindeki sıradan bir `{}` nesnesidir. Stilleriniz Javascript değişkenlerine bağlı olduğunda `style` özniteliğini kullanabilirsiniz.

## Koşullu render etme {/*conditional-rendering*/}

React'de, koşulları yazmak için özel bir sözdizimi yoktur. Onun yerine, sıradan JavaScript kodu yazarken kullandığınız teknikleri kullanacaksınız. Örneğin, JSX'i koşullu olarak dahil etmek için bir [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) ifadesi kullanabilirsiniz:

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

Eğer daha kompakt bir kod tercih ediyorsanız, [koşullu `?` operatörünü](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) kullanabilirsiniz. `if`'in aksine, JSX içerisinde çalışır:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

`else` dalına ihtiyacınız olmadığında, daha kısa olan [mantıksal `&&` sözdizimini](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation) kullanabilirsiniz:

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Tüm bu yaklaşımlar ayrıca öznitelikler koşullu olarak belirtilmek istendiğinde de çalışır. Eğer bu JavaScript sözdizimlerinden bazıları size yabancıysa, `if...else` kullanarak başlayabilirsiniz.

## Listeleri render etme {/*rendering-lists*/}

Bileşenlerden oluşan listeleri render etmek için [`for` döngüsü](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) ve [dizi `map()` fonksiyonu](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) gibi JavaScript özelliklerine ihtiyacınız olacak.

Örneğin, bir ürünler (products) diziniz olduğunu varsayalım:

```js
const products = [
  { title: 'Lahana', id: 1 },
  { title: 'Sarımsak', id: 2 },
  { title: 'Elma', id: 3 },
];
```

Bileşeniniz içerisinde, `map()` fonksiyonunu kullanıp ürünler dizisini `<li>` öğeleri dizisine dönüştürün:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

`<li>` etiketinin bir `key` özniteliği olduğuna dikkat edin. Bir listedeki her öğe için, o öğeyi kardeşleri arasında benzersiz bir şekilde tanımlayan bir string veya sayı geçirmelisiniz. Genellikle, bir anahtar (`key`) verilerinizden gelmelidir (Örneğin veritabanındaki ID). React, daha sonra öğeleri eklediğinizde, sildiğinizde veya yeniden sıraladığınızda ne olduğunu bilmek için anahtarlarınızı kullanır.

<Sandpack>

```js
const products = [
  { title: 'Lahana', isFruit: false, id: 1 },
  { title: 'Sarımsak', isFruit: false, id: 2 },
  { title: 'Elma', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## Olaylara yanıt verme {/*responding-to-events*/}

Bileşenleriniz içerisinde *olay işleyici* fonksiyonlar tanımlayarak olaylara yanıt verebilirsiniz:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

Fark ettiyseniz `onClick={handleClick}` sonunda herhangi bir parantez barındırmıyor! Olay işleyici fonksiyonunuzu _çağırmayın_: onun sadece referansını *geçirmeniz* gerekir. React kullanıcı butona tıkladığında olay işleyicinizi çağıracaktır.

## Ekranı güncelleme {/*updating-the-screen*/}

Bazen, bileşeninizin bazı bilgileri "hatırlamasını" ve bunları görüntülemesini istersiniz. Örneğin, belki bir butona kaç kez tıklandığını saymak istersiniz. Bunu yapmak için, bileşeninize *state* ekleyin.

Önce, React'ten [`useState`](/reference/react/useState)'i içe aktarın:

```js
import { useState } from 'react';
```

Şimdi bileşeniniz içerisinde bir *state değişkeni* oluşturabilirsiniz:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

`useState`'den iki şey alacaksınız: mevcut durum (`count`) ve onu güncellemenizi sağlayan fonksiyon (`setCount`). Onlara herhangi bir isim verebilirsiniz, ancak genel düzen `[birşey, setBirşey]` şeklinde yazmaktır.

Buton ilk kez görüntülendiğinde, `count` `0` olacaktır çünkü `useState()`'e `0` geçirdiniz. State'i değiştirmek istediğinizde, `setCount()`'u çağırın ve ona yeni değeri geçirin. Bu butona tıklamak sayacı artıracaktır:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Clicked {count} times
    </button>
  );
}
```

React bileşen fonksiyonunuzu tekrar çağıracaktır. Bu sefer `count` `1` olacaktır. Ondan sonra `2` olacaktır. Ve böyle devam edecektir.

Eğer aynı bileşeni birden fazla kez render etmek istiyorsanız, her biri kendi state'ini alacaktır. Her bir butona ayrı ayrı tıklayın:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Sayaçlar ayrı ayrı güncellenecektir</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      {count} kere tıklandı
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Fark ettiyseniz her buton kendi `count` state'ini "hatırlıyor" ve diğer butonları etkilemiyor.

## Hook'ları kullanma {/*using-hooks*/}

`use` ile başlayan fonksiyonlar *Hook'lar* olarak adlandırılır. `useState` React tarafından sağlanan yerleşik bir Hook'tur. Diğer yerleşik Hook'ları [API referansında](/reference/react) bulabilirsiniz. Ayrıca, mevcut olanları birleştirerek kendi Hook'larınızı da yazabilirsiniz.

Hook'lar diğer fonksiyonlardan daha kısıtlayıcıdır. Hook'ları yalnızca bileşenlerinizin *en üstünde* çağırabilirsiniz (ua da diğer Hook'ların). Eğer bir koşul veya döngü içerisinde `useState` kullanmak istiyorsanız, yeni bir bileşen oluşturup onu oraya yerleştirin.

## Bileşenler arasında veri paylaşma {/*sharing-data-between-components*/}

Bir önceki örnekte, her `MyButton` bileşeni kendi bağımsız `count`'una sahipti ve her butona tıklandığında, yalnızca tıklanan butonun `count`'u değişti:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. Both MyButton components contain a count with value zero.">

Başlangıçta, her `MyButton`'un `count` state'i `0`'dır

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="The same diagram as the previous, with the count of the first child MyButton component highlighted indicating a click with the count value incremented to one. The second MyButton component still contains value zero." >

İlk `MyButton` `count`'unu `1` olarak günceller

</Diagram>

</DiagramGroup>

Ancak, bazen bileşenlerin *veri paylaşması ve her zaman birlikte güncellenmesi* gerekecektir.

İki `MyButton` bileşeninin de aynı `count` state'ini göstermesi ve her zaman birlikte güncellenmesi için, state'i tek tek butonlardan "yukarıya" tüm butonları içeren en yakın bileşene taşımanız gerekir.

Bu örnekte, o bileşen `MyApp`'tir:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Diagram showing a tree of three components, one parent labeled MyApp and two children labeled MyButton. MyApp contains a count value of zero which is passed down to both of the MyButton components, which also show value zero." >

Başlangıçta, `MyApp`'in `count` state'i `0`'dır ve her iki çocuğa da geçirilir

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="The same diagram as the previous, with the count of the parent MyApp component highlighted indicating a click with the value incremented to one. The flow to both of the children MyButton components is also highlighted, and the count value in each child is set to one indicating the value was passed down." >

Tıklandığında, `MyApp` `count` state'ini `1` olarak günceller ve her iki çocuğa da geçirir

</Diagram>

</DiagramGroup>

Şimdi, eğer butonlardan herhangi birine tıklarsanız, `MyApp`'in içerisindeki `count` değişecektir, bu da her iki `MyButton`'ın `count`'unu değiştirecektir. Bunu kod içerisinde nasıl ifade edeceğinize bakalım.

Öncelikle, `MyButton`'dan `MyApp`'e *state'i yukarıya taşıyın*:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Ayrı ayrı güncellenen sayaçlar</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... kodu buradan taşıyoruz ...
}

```

Sonrasında, `MyApp`'den her `MyButton`'a doğru tıklama olay işleyicisi ile birlikte *state'i aşağı geçirin*. `MyButton`'a bilgiyi JSX süslü parantezleri kullanarak geçirebilirsiniz, yukarıda `<img>` gibi yerleşik etiketlerle yaptığınız gibi:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Birlikte güncellenen sayaçlar</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

Aşağıya geçirdiğiniz bilgiye _prop'lar_ denir. Şimdi `MyApp` bileşeni `count` state'ini ve `handleClick` olay işleyicisini içeriyor ve her ikisini de butonlara *prop'lar olarak geçiriyor*.

Son olarak, `MyButton`'ı, bir üst bileşeninden geçirdiğiniz prop'ları *okumak* için değiştirin:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      {count} kere tıklandı
    </button>
  );
}
```

Butona tıkladığınızda, `onClick` olay işleyicisi tetiklenir. Her butonun `onClick` prop'u `MyApp` içerisindeki `handleClick` fonksiyonuna işaret ediyor, yani o fonksiyonun içerisindeki kod yürütülüyor. Bu kod `setCount(count + 1)`'i çağırıyor, bununla `count` state değişkenini artırıyor. Yeni `count` değeri her butona bir prop olarak geçiriliyor, bununla birlikte hepsi yeni değeri gösteriyor. Buna "state'i yukarı taşımak" denir. State'i yukarı taşıyarak, onu bileşenler arasında paylaştınız.

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Birlikte güncellenen sayaçlar</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      {count} kere tıklandı
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## Sonraki adımlar {/*next-steps*/}

Şimdi, React kodu yazmanın temellerini biliyorsunuz!

Öğrendiklerinizi pratiğe dökmek ve React ile ilk mini-uygulamanızı oluşturmak için [Öğretici](/learn/tutorial-tic-tac-toe)'ye göz atın.
