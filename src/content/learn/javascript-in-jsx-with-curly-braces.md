---
title: JSX içinde Süslü Parantezlerle JavaScript
---

<Intro>

JSX , render etme mantığını ve içeriği aynı yerde tutarak, bir JavaScript dosyası içinde HTML benzeri işaretleme (markup) yazmanızı sağlar. Bazı durumlarda, o işaretlemenin içine biraz JavaScript mantığı eklemek veya dinamik bir özelliğe referans vermek isteyeceksiniz.
Bu durumda, JSX içinde süslü parantezleri kullanarak, JavaScript'e bir pencere açabilirsiniz.

</Intro>

<YouWillLearn>

* Tırnak işaretleriyle string nasıl gönderilir
* Süslü parantezlerle JSX içinde bir JavaScript değişkenine nasıl referans verilir
* Süslü parantezlerle JSX içinde bir JavaScript fonksiyonu nasıl çağırılır
* Süslü parantezlerle JSX içinde bir JavaScript nesnesi nasıl kullanılır

</YouWillLearn>

## Tırnak içerisinde string gönderilmesi {/*passing-strings-with-quotes*/}

Bir string niteliğini JSX'e iletmek istediğinizde, onu tek veya çift tırnak içine alırsınız:

<Sandpack>

```js
export default function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/7vQD0fPs.jpg"
      alt="Gregorio Y. Zara"
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Burada, `"https://i.imgur.com/7vQD0fPs.jpg"` ve `"Gregorio Y. Zara"` string olarak iletildi.

Ancak `src` veya `alt` metnini dinamik olarak belirtmek isterseniz ne olur?  **`" `ve` "` yerine `{ `ve` }` ile değiştirerek JavaScript'ten bir değer** kullanabilirsiniz:

<Sandpack>

```js
export default function Avatar() {
  const avatar = 'https://i.imgur.com/7vQD0fPs.jpg';
  const description = 'Gregorio Y. Zara';
  return (
    <img
      className="avatar"
      src={avatar}
      alt={description}
    />
  );
}
```

```css
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

`className="avatar"` ifadesi, resmi yuvarlak hale getiren `"avatar"` CSS sınıf adını belirtirken, `src={avatar}` ifadesi, avatar adlı JavaScript değişkeninin değerini okuyan bir ifade olduğuna dikkat edin. Bunun nedeni, süslü parantezlerin işaretleme dilinde doğrudan JavaScript çalıştırmanıza olanak sağlamasıdır!

## Süslü parantez kullanımı : JavaScript dünyasına bir pencere {/*using-curly-braces-a-window-into-the-javascript-world*/}

JSX , JavaScript yazmanın özel bir yoludur. Bunun anlamı, JSX içinde süslü parantez `{ }` kullanarak JavaScript kullanmanın mümkün olmasıdır. Aşağıdaki örnekte önce bir bilim adamı için bir isim olan `name` değişkeni tanımlanır ve daha sonra bu değişken, süslü parantezler kullanılarak `<h1>` etiketi içine gömülür.

<Sandpack>

```js
export default function TodoList() {
  const name = 'Gregorio Y. Zara';
  return (
    <h1>{name}'nın Yapılacaklar Listesi</h1>
  );
}
```

</Sandpack>

`name` değerini 'Gregorio Y. Zara' yerine 'Hedy Lamarr' olarak değiştirmeyi deneyin. Liste başlığının nasıl değiştiğini görüyor musunuz?

`formatDate()` gibi fonksiyon çağrıları da dahil olmak üzere, herhangi bir JavaScript ifadesi süslü parantezler arasında çalışır.

<Sandpack>

```js
const today = new Date();

function formatDate(date) {
  return new Intl.DateTimeFormat(
    'en-US',
    { weekday: 'long' }
  ).format(date);
}

export default function TodoList() {
  return (
    <h1>{formatDate(today)} için yapılacaklar listesi</h1>
  );
}
```

</Sandpack>

### Süslü parantez nerede kullanılır {/*where-to-use-curly-braces*/}

JSX içinde yalnızca iki şekilde süslü parantez kullanabilirsiniz:

1. JSX etiketi içinde doğrudan **metin** olarak kullanılır: `<h1>{name}'s To Do List</h1>` çalışır, ancak `<{tag}>Gregorio Y. Zara'nın Görev Listesi</{tag}>` çalışmaz.
2. `=` işaretinden hemen sonra **özellik olarak** kullanılırsa, `src={avatar}` `avatar` değişkenini okurken, `src="{avatar}"` `"{avatar}"` stringine aktaracaktır.

## Çift süslü parantez kullanımı: JSX'te CSS ve diğer objeler {/*using-double-curlies-css-and-other-objects-in-jsx*/}

 Stringler, sayılar ve diğer JavaScript ifadelerine ek olarak, nesnelere bile JSX geçebilirsiniz. Objeler de `{ name: "Hedy Lamarr", inventions: 5 }` gibi süslü parantezlerle ifade edilir. Bu nedenle, JSX içinde bir JS nesnesi geçmek için, objeyi başka bir çift süslü parantez içine almanız gerekir: `person={{ name: "Hedy Lamarr", inventions: 5 }}`.

JSX'de iç içe CSS tanımları için bunu görebilirsiniz. React, (çoğu durum için CSS sınıfları harika çalıştığından), size iç içe stiller kullanmanızı zorunlu tutmaz. Ancak bir iç içe stil gerektiğinde, nesneyi `style` özelliğine iletiyorsunuz:

<Sandpack>

```js
export default function TodoList() {
  return (
    <ul style={{
      backgroundColor: 'black',
      color: 'pink'
    }}>
      <li>Görüntülü telefonu geliştir</li>
      <li>Havacılık derslerini hazırla</li>
      <li>Alkolle çalışan motor üzerinde çalış</li>
    </ul>
  );
}
```

```css
body { padding: 0; margin: 0 }
ul { padding: 20px 20px 20px 40px; margin: 0; }
```

</Sandpack>

`backgroundColor` ve `color` değerlerini değiştirmeyi deneyin.

Objeyi böyle yazdığınızda, onu gerçekten süslü parantezlerin içinde görebilirsiniz:

```js {2-5}
<ul style={
  {
    backgroundColor: 'black',
    color: 'pink'
  }
}>
```

JSX içinde `{{ `ve` }}` gördüğünüzde, bunun sadece JSX süslü parantezleri içindeki bir nesne olduğunu bilin!

<Pitfall>

İç içe stil özellikleri camelCase kullanılarak yazılır. Örneğin, HTML'de `<ul style="background-color: black">` yazımı bileşeninizde `<ul style={{ backgroundColor: 'black' }}>` şeklinde yazılır.

</Pitfall>

## JavaScript objeleri ve süslü parantezlerle daha fazla eğlence {/*more-fun-with-javascript-objects-and-curly-braces*/}

Çoklu ifadeleri bir nesne içinde toplayabilir ve JSX'in içindeki süslü parantezlerin içinde onlara referans verebilirsiniz:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'nın Yapılacakları</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Görüntülü telefonu geliştir</li>
        <li>Havacılık derslerini hazırla</li>
        <li>Alkolle çalışan motor üzerinde çalış</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Bu örnekte, `person` JavaScript nesnesi bir `name` string'i ve bir `theme` nesnesi içerir.

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};
```

Bileşen, person değişkenindeki bu değerleri şu şekilde kullanabilir:

```js
<div style={person.theme}>
  <h1>{person.name}'nın Yapılacakları</h1>
```

JSX, JavaScript kullanarak verileri ve mantığı düzenlemenize izin verdiği için şablonlama dili olarak oldukça minimalisttir.

<Recap>

Artık JSX hakkında neredeyse her şeyi biliyorsunuz:

* Tırnak içindeki JSX özellikleri string olarak aktarılır.
* Süslü parantezler JavaScript mantığını ve değişkelerini markup içerisine yazmanıza olanak sağlar.
* JSX etiket içeriği veya özellikleri `=` işaretinden hemen sonra kullanılabilirler..
* `{{ ve }}` özel bir sözdizimi değil: JSX süslü parantezlerinin içine yerleştirilmiş bir JavaScript objesidir.

</Recap>

<Challenges>

#### Hatayı Düzelt {/*fix-the-mistake*/}

Bu kod, `Objects are not valid as a React child`(Nesneler bir React alt öğesi olarak geçerli değildir) şeklinde bir hata veriyor:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person}'nın Yapılacakları</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Görüntülü telefonu geliştir</li>
        <li>Havacılık derslerini hazırla</li>
        <li>Alkolle çalışan motor üzerinde çalış</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

Sorunu bulabilir misin ? 

<Hint>Süslü parantezlerin içine ne koyduğumuza bakalım. Oraya doğru şeyi mi koyuyoruz?</Hint>

<Solution>

Bunun nedeni, bu örneğin bir string yerine *direkt olarak bir objenin kendisini* markup içine aktarmasıdır. Nesneler metin içeriği olarak dahil edildiğinde, React onları nasıl görüntülemek istediğinizi bilmediğinden hata verecektir.
 Sorunu çözmek için, `<h1>{person}'nın Yapılacakları</h1>` ifadesini `<h1>{person.name}'nın Yapılacakları</h1>` ile değiştirin:".

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'nın Yapılacakları</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Görüntülü telefonu geliştir</li>
        <li>Havacılık derslerini hazırla</li>
        <li>Alkolle çalışan motor üzerinde çalış</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### Verileri bir nesne içinden çıkarma {/*extract-information-into-an-object*/}

Resim URL'ini `person` nesnesinden çıkarın.

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'nın Yapılacakları</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Görüntülü telefonu geliştir</li>
        <li>Havacılık derslerini hazırla</li>
        <li>Alkolle çalışan motor üzerinde çalış</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<Solution>

Resim URL'ini `person.imageUrl` adlı bir özelliğe taşıyın ve süslü parantezleri kullanarak `<img>` etiketinin içinden okuyun:

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  imageUrl: "https://i.imgur.com/7vQD0fPs.jpg",
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'nın Yapılacakları</h1>
      <img
        className="avatar"
        src={person.imageUrl}
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Görüntülü telefonu geliştir</li>
        <li>Havacılık derslerini hazırla</li>
        <li>Alkolle çalışan motor üzerinde çalış</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

</Solution>

#### JSX süslü parantezleri içinde bir ifade yazın {/*write-an-expression-inside-jsx-curly-braces*/}

Aşağıdaki objede, tam resim URL'si dört parçaya bölünmüştür: temel URL, `imageId`, `imageSize` ve dosya uzantısı.

Resim URL'sini bu özellikleri bir araya getirecek şekilde istiyoruz: temel URL (her zaman `'https://i.imgur.com/'`), `imageId` (`'7vQD0fP'`), `imageSize` (`'s'`) ve dosya uzantısı (her zaman `'.jpg'`). Ancak, `<img>` etiketinin `srcyi belirtme biçiminde bir sorun var.

Bu hatayı düzeltebilir misiniz?

<Sandpack>

```js

const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'nın Yapılacakları</h1>
      <img
        className="avatar"
        src="{baseUrl}{person.imageId}{person.imageSize}.jpg"
        alt={person.name}
      />
      <ul>
        <li>Görüntülü telefonu geliştir</li>
        <li>Havacılık derslerini hazırla</li>
        <li>Alkolle çalışan motor üzerinde çalış</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Yaptığınız düzeltmenin çalıştığını kontrol etmek için `imageSize` değerini `'b'` olarak değiştirmeyi deneyin. Düzenlemenizin ardından resim boyutu değişmelidir.

<Solution>

`src={baseUrl + person.imageId + person.imageSize + '.jpg'}`olarak yazabilirsiniz.

1. `{` JavaScript ifadesini açar
2. `baseUrl + person.imageId + person.imageSize + '.jpg'` doğru URL dizgisini oluşturur
3. `}` JavaScript ifadesini kapatır.

<Sandpack>

```js
const baseUrl = 'https://i.imgur.com/';
const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'nın Yapılacakları</h1>
      <img
        className="avatar"
        src={baseUrl + person.imageId + person.imageSize + '.jpg'}
        alt={person.name}
      />
      <ul>
        <li>Görüntülü telefonu geliştir</li>
        <li>Havacılık derslerini hazırla</li>
        <li>Alkolle çalışan motor üzerinde çalış</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Bu ifadeyi ayrı bir fonksiyon olan `getImageUrl` gibi taşıyabilirsiniz:

<Sandpack>

```js src/App.js
import { getImageUrl } from './utils.js'

const person = {
  name: 'Gregorio Y. Zara',
  imageId: '7vQD0fP',
  imageSize: 's',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'nın Yapılacakları</h1>
      <img
        className="avatar"
        src={getImageUrl(person)}
        alt={person.name}
      />
      <ul>
        <li>Görüntülü telefonu geliştir</li>
        <li>Havacılık derslerini hazırla</li>
        <li>Alkolle çalışan motor üzerinde çalış</li>
      </ul>
    </div>
  );
}
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    person.imageSize +
    '.jpg'
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; }
```

</Sandpack>

Değişkenler ve fonksiyonlar, işaretleme dilini basit tutmanıza yardımcı olabilir!

</Solution>

</Challenges>
