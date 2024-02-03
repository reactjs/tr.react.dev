---
title: Hızlı Başlangıç
---

<Intro>

React dokümantasyonuna hoşgeldiniz! Bu sayfa, günlük hayatınızda kullanacağınız React konseptlerinin %80'ine bir giriş yapacaktır.

</Intro>

<YouWillLearn>

- Bileşenler nasıl yaratılır ve iç içe koyulur
- Biçimlendirme(markup) ve still nasıl eklenir
- Veri nasıl gösterilir
- Koşullar ve listeler nasıl render edilir
- Olaylara nasıl cevap verilir ve ekran güncellenir
- Bileşenler arasında veri nasıl paylaşılır

</YouWillLearn>

## Bileşenleri yaratma ve iç içe koyma {/*components*/}

React uygulamaları *bileşenlerden* oluşur. Bileşen kendi mantığına ve görünüşüne sahip bir UI (kullanıcı arayüzü) parçasıdır. Bir bileşen bir buton kadar küçük ya da tam bir sayfa kadar büyük olabilir.

React bileşenleri biçimlendirme(markup) döndüren JavaScript fonksiyonlarıdır:

```js
function MyButton() {
  return (
    <button>Ben bir butonum</button>
  );
}
```

`MyButton` bileşenini bildirdiğinize göre, başka bir bileşen içine koyabilirsiniz:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Uygulamama hoşgeldiniz</h1>
      <MyButton />
    </div>
  );
}
```

`<MyButton />`'un büyük harf ile başladığına dikkat edin. Bu onun bir React bileşeni olduğunu belirtir. HTML elemanları küçük harf ile başlamak zorundayken, React bileşenleri her zaman büyük harfle başlamak zorundadır.

Sonuçlara bir göz atın:

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
      <h1>Uygulamama hoşgeldiniz</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

`export default` anahtar kelimeleri dosyadaki ana bileşeni belirtir. Bazı JavaScript sözdizimlerine aşina değilseniz, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) ve [javascript.info](https://javascript.info/import-export) siteleri güzel referanslara sahiptir.

## JSX ile biçimlendirme yazma {/*writing-markup-with-jsx*/}

Yukarıda gördüğünüz biçimlendirme sözdizimine *JSX* denir. Opsiyoneldir, ancak çoğu React projesi kolaylığından dolayı JSX kullanır. [Yerel geliştirme için tavsiye ettiğimiz tüm araçlar](/learn/installation) JSX'i desteklemektedir.

JSX, HTML'den daha katıdır. Elemanları `<br />` gibi kapatmak zorundasınızdır. Aynı zamanda bileşeniniz birden fazla JSX elemanı döndüremez. Döndürmek isteğiniz elemanları `<div>...</div>` veya boş `<>...</>` gibi ortak bir üst eleman içine koymanız gerekmektedir:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>Hakkında</h1>
      <p>Selamlar.<br />Nasılsın?</p>
    </>
  );
}
```

JSX'e aktaracak çok fazla HTML'iniz varsa, [çevrimiçi bir dönüştürücü](https://transform.tools/html-to-jsx) kullanabilirsiniz.

## Stil ekleme {/*adding-styles*/}

React'te, bir CSS class'ı belirtmek için `className` kullanılır. HTML [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class) özelliği ile aynı şekilde çalışmaktadır:

```js
<img className="avatar" />
```

Daha sonra CSS kurallarını ayrı bir CSS dosyasında yazarsınız:

```css
/* CSS dosyanızda */
.avatar {
  border-radius: 50%;
}
```

React, CSS dosyalarınız nasıl ekleyeceğinizi belirtmez. En basit durumda, HTML'inize bir [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) elemanı eklersiniz. Bir derleme aracı veya çatı kullanıyorsanız, projenize nasıl CSS dosyası ekleyeceğinizi öğrenmek için dokümantasyonlara başvurun.

## Veri gösterme {/*displaying-data*/}

JSX, biçimlendirmeyi JavaScript'e dönüştürmenizi sağlar. Süslü parantezler, kodunuzdaki bazı değişkenleri gömebilmeniz ve bu değişkenleri kullanıcıya gösterebilmeniz için JavaScript'e "geri kaçmanızı" sağlar. Örneğin, bu kod `user.name`'i gösterecktir:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

Ayrıca JSX özelliklerinden "JavaScript'e kaçabilirsiniz" ancak tırnak işareti *yerine* süslü parentezleri kullanmak zorundasınızdır. Örneğin, `className="avatar"` ifadesi `"avatar"` string'ini CSS sınıfı olarak iletir ancak `src={user.imageUrl}` ifadesi `user.imageUrl` JavaScript değişken değerini okur ve `src` özelliği olarak o değeri iletir:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

JSX süslü parentezleri içine daha karmaşık ifadeler koyabilirsiniz, örneğin, [string birleştirme](https://javascript.info/operators#string-concatenation-with-binary):

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

Yukarıdaki örnekte `style={{}}` ifadesi özel bir sözdizimi değildir. `style={ }` JSX süslü parantezleri içinde sıradan bir `{}` nesnesidir. `style` özelliğini stilleriniz JavaScript değişkenlerine bağlı olduğunda kullanabilirsiniz.

## Koşullu render etme {/*conditional-rendering*/}

React'te, koşullu ifadeleri yazmanın özel bir sözdizimi yoktur. Onun yerine, sıradan JavaScript kodu yazarken kullandığınız aynı teknikleri kullanacaksınız. Örneğin, [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) ifadesini, koşullu olarak JSX'i dahil etmek için kullanabilirsiniz:

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

Daha kompakt bir kod tercih ediyorsanız [koşullu `?` operatörünü](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) kullanabilirsiniz. `if` ifadesinin aksine, JSX'in içinde çalışır:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

`else` ifadesine ihtiyacınız olmadığında, daha kısa olan [`&&` sözdizimini](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation) de kullanabilirsiniz:

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Tüm bu yaklaşımlar koşullu olarak özelliklerin belirlenmesi için de çalışır. Eğer bu JavaScript sözdizimlerinden bazılarına yabancıysanız, her zaman `if...else` ifadelerini kullanarak başlayabilirsiniz.

## Listeleri render etme {/*rendering-lists*/}

Bileşen listeleri oluşturmak için [`for` döngüsü](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) ve [dizi `map()` fonksiyonu](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) gibi JavaScript özelliklerini kullanacaksınız.

Örneğin, bir dizi ürün listesine sahip olduğunuzu düşünelim:

```js
const products = [
  { title: 'Lahana', id: 1 },
  { title: 'Sarımsak', id: 2 },
  { title: 'Elma', id: 3 },
];
```

Bileşeniniz içinde `map()` fonksiyonunu kullanarak bir dizi ürünü bir dizi `<li>` öğesine dönüştürün:

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

`<li>`'nin `key` özelliğine sahip olduğuna dikkat edin. Listedeki her bir öğe için, o öğeyi kardeşlerinden ayırt edecek bir string ya da sayı iletmenizi gereklidir. Genellikle, veritabanı ID'si gibi bir anahtar veriniz ile geliyor olmalıdır. React, daha sonra eğer yeni veri girerseniz, bir veriyi silerseniz ya da yeniden sıralarsanız ne olacağını bilmek için bu anahtarları kullanır.

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

## Olaylara cevap verme {/*responding-to-events*/}

Bileşenlerinizin içinde *olay yöneticisi* fonksiyonları bildirerek olaylara cevap verebilirsiniz:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('Bana tıkladın!');
  }

  return (
    <button onClick={handleClick}>
      Bana tıkla
    </button>
  );
}
```

`onClick={handleClick}` ifadesinin sonunda parantez olmadığına dikkat edin! Olay yöneticisi fonksiyonu _çağırmayın_: bu fonksiyonu sadece *aşağıya iletmelisiniz*. React, kullanıcı butona tıkladığı zaman olay yöneticisini çağıracaktır.

## Ekranı güncelleme {/*updating-the-screen*/}

Sık sık, bileşeninizin bazı bilgileri ekran göstermek için "hatırlamasını" isteyeceksiniz. Örneğin, bir butona kaç defa tıklandığını takip etmek istiyorsunuz. Bunu yapmak için bileşeninize *state* ekleyin.

İlk olarak, React'ten [`useState`](/reference/react/useState) çağırın:

```js
import { useState } from 'react';
```

Şimdi bileşeniniz içinde bir *state değişkeni* bildirin:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

`useState`'ten iki şey alacaksınız: mevcut state (`count`) ve state'i güncellemenizi sağlayan (`setCount`). Burada istediğiniz isimleri verebilirsiniz ancak yaygın kullanış `[something, setSomething]` şeklindedir.

Buton ilk defa görüntülendiğinde `count` değeri `0` olacaktır çünkü `useState()`'e `0` değerini ilettiniz. State'i değiştirmek istediğinizde, `setCount()`'u çağırın ve yeni değeri iletin. Bu butona tıklamak sayacı artıcaktır:

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      {count} defa tıklandı
    </button>
  );
}
```

React bileşen fonksiyonunuzu yeniden çağıracaktır. Bu sefer `count` değeri `1` olacaktır. Daha sonra `2`. Ve bu böyle devam edecektir.

Aynı bileşeni birden fazla render edersiniz, her biri kendi state'ine sahip olacaktır. Her butona ayrı ayrı tıklayın:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Ayrı olarak güncellenen sayaçlar</h1>
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
      {count} defa tıklandı
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

Her bir butonun kendi `count` state'ini "hatırladığına" ve diğerlerini etkilemediğine dikkat edin.

## Hook kullanmak {/*using-hooks*/}

`use` ile başlayan fonksiyonlara *Hook* denir. `useState`, React tarafından sağlanan bir Hook'tur. [API referansında](/reference/react) diğer yerleşik Hook'ları bulabilirsiniz. Aynı zamanda var olan Hook'ları kullanarak kendi Hook'unuzu da yazabilirsiniz.

Hook'lar diğer fonksiyonlara göre daha kısıtlayıcıdırlar. Hook'ları bileşeninizin sadece *en üst seviyesinde* çağırabilirsiniz (ya da diğer Hook'ları). Eğer `useState`'i bir koşul ya da döngü içinde kullanmak istiyorsanız, yeni bir bileşen oluşturun ve onun içine koyun.

## Bileşenler arasında veri paylaşma {/*sharing-data-between-components*/}

Bir önceki örnekte, her bir `MyButton` bileşeni kendi bağımsız `count` değerine sahipti ve her bir butona tıklandığında, sadece tıklanan butonun `count` değeri değişmekteydi:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Üç bileşenden oluşan bir ağacı gösteren diyagram: üst elemanlardan biri MyApp olarak adlandırılmış ve iki alt eleman MyButton olarak adlandırılmış. Her bir MyButton bileşeni sıfır değerine eşit count değişkenine sahiptir.">

Başlangıçta, her bir `MyButton`'un `count` state'i `0`'dır.

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="Bir öncekiyle aynı diyagram. MyButton bileşeninin ilk alt elemanı ona tıklandığını belirtir şekilde sarı ile yanmakta ve count değeri bir artırılmış şekilde. İkinci MyButton bileşeni hala sıfır değerine sahip." >

İlk `MyButton` bileşeni `count` değerini `1` ile değiştirir.

</Diagram>

</DiagramGroup>

Ancak çoğu zaman bileşenlerin *veriyi paylaşması ve her zaman beraber güncellemesini* isteriz.

Her iki `MyButton` bileşeninin aynı `count` değerini göstermesi ve aynı anda güncellenmesi için state'i bireysel butonlardan "yukarı", hepsini içeren en yakın bileşene taşımanız gerekmektedir.

Bu örnekte hepsini içeren bileşen `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Üç bileşenden oluşan bir ağacı gösteren diyagram. Bir üst bileşen MyApp olarak adlandırılmış ve iki alt bileşen MyButton olarak adlandırılmış. MyApp bileşeni değeri 0'a eşit olan count değişkenine sahip ve bu değer her iki MyButton bileşenine iletilmiştir ve değer orada da sıfırdır." >

Başlangıçta, `MyApp`'in `count` state değeri `0`'dır ve her iki alt elemana iletilmiştir.

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="Bir öncekiyle aynı diyagram. Üst bileşen MyApp bileşeninin count değişkeni tıklandığını belirtecek şekilde sarı ile vurgulanmış ve değer bir artırılmış. Her iki alt eleman olan MyButton bileşenine giden akış da vurgulanmış ve her ikisine de değerin iletildiğini belirtecek şekilde değer bir artırılmış." >

Tıklama ile, `MyApp` kendi `count` state'ini `1` ile günceller ve iki alt elemana iletir

</Diagram>

</DiagramGroup>

Şimdi hangi butona tıklarsanız tıklayın, `MyApp` içindeki `count` değişkeni değişecektir, ki bu da her iki `MyButton` bileşeni içideki count değerini güncelleyecektir. Bu anlattıklarımızı kod halinde nasıl göstereceğimizi aşağıda görebiliriz.

İlk olarak, state'i `MyButton`'dan `MyApp`' bileşenine olacak şekilde *yukarı taşıyın:*

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Birbirinden ayrı güncellenen sayaçlar</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... kodu buradan taşıyoruz ...
}

```

Daha sonra, state'i `MyApp` bileşeninden her bir `MyButton` bileşenine ortak tıklama yönetecisi ile birlikte *aşağı doğru iletin.* `MyButton` bileşenine bilgiyi JSX süslü parantezleri ile iletebilirsiniz, tıpkı yerleşik `<img>` elementlerinde yaptığımız gibi:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Beraber güncellenen sayaçlar</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

Bu şekilde aşağıya doğru ilettiğiniz bilgilere _prop_ denmektedir. Artık `MyApp` bileşeni `count` state'ini ve `handleClick` olay yöneticisini içerir ve her bir butona *bu ikisini prop olarak aşağı doğru iletir.*

Son olarak, `MyButton` bileşenini üst bileşenden ilettiğiniz prop'ları *okuyacak* şekilde düzenleyin:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      {count} defa tıklandı
    </button>
  );
}
```

Butona tıkladığınız zaman, `onClick` yöneticisi çalışır. Her bir butonun `onClick` prop'u `MyApp` bileşeni içindeki `handleClick` fonksiyonuna ayarlanmıştır ve fonksiyon içindeki kod çalışır. Bu kod `setCount(count + 1)` ifadesini çağırır ve `count` state değişkenini artırır. Yeni `count` değeri her bir butona prop olarak iletilir, böylelikle hepsi yeni değeri gösterir. Buna "state'in yukarı kaldırılması" denir. State'i yukarı kaldırarak, bileşenler arasında paylaşmış oldunuz.

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
      <h1>Beraber güncellenen sayaçlar</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      {count} defa tıklandı
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

## Next Steps {/*next-steps*/}

Artık React kodunu yazmanın temellerini biliyorsunuz!

[Tutorial](/learn/tutorial-tic-tac-toe) sayfasına giderek öğrendiklerinizi pratik edebilir ve ilk mini React uygulamanızı yapabilirsiniz.
