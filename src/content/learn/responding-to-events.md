---
title: Olaylara Tepki Verme
---

<Intro>

React, JSX'inize olay yöneticileri eklemenize olanak tanır. Olay yöneticileri; tıklamak, fareyle üzerine gelmek ve form girdilerine odaklanmak gibi kullanıcı aksiyonlarına tepki verirken tetiklenecek olan fonksiyonlarınızdır.

</Intro>

<YouWillLearn>

* Olay yöneticisi yazmanın farklı biçimleri
* Üst bileşenden (parent component) olay yönetimi mantığının nasıl iletileceği
* Olayların nasıl yayıldığı (propagation) ve nasıl durdurulacağı

</YouWillLearn>

## Olay yöneticileri oluşturmak {/*adding-event-handlers*/}

Olay yöneticisi (event handler) oluşturmak için bir fonksiyon tanımlayıp uygun JSX etiketine [prop olarak iletirsiniz](/learn/passing-props-to-a-component). Örneğin, hiçbir şey yapmayan bir butonu ele alalım:

<Sandpack>

```js
export default function Button() {
  return (
    <button>
      Hiçbir şey yapmıyorum
    </button>
  );
}
```

</Sandpack>

Kullanıcı düğmeye tıkladığında bir mesaj göstermek için aşağıdaki adımları izleyebilirsiniz:

1. `Button` bileşeninizin *içerisinde* `handleClick` isimli bir fonksiyon tanımlayın.
2. Tanımladığınız fonksiyonun içerisinde mantığınızı oluşturun (mesaj göstermek için `alert` kullanın).
3. `<button>` JSX etiketine `onClick={handleClick}` ekleyin.

<Sandpack>

```js
export default function Button() {
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

```css
button { margin-right: 10px; }
```

</Sandpack>

`handleClick` fonksiyonunu tanımladınız ve ardından `<button>`'a [prop olarak ilettiniz](/learn/passing-props-to-a-component). `handleClick`, bir **olay yöneticisi (event handler)**'dir. Olay yönetici fonksiyonları:

* Genellikle bileşenlerinizin *içerisinde* tanımlanır.
* `handle` ile başlayıp olayın ismiyle devam edecek formatta isimlendirilirler.

Geleneksel olarak olay yöneticilerinin isimlerinin `handle` ile başlaması yaygındır. İncelediğiniz projelerde `onClick={handleClick}` ve `onMouseEnter={handleMouseEnter}` gibi kulanımları sıkça görürsünüz.

Alternatif olarak, olay yöneticilerini JSX'de satır içi tanımlayabilirsiniz:

```jsx
<button onClick={function handleClick() {
  alert('Bana tıkladın!');
}}>
```

Ya da ok fonksiyonlarını kullanarak kısaltabilirsiniz:

```jsx
<button onClick={() => {
  alert('Bana tıkladın!');
}}>
```

Bu yazım biçimleri eşdeğerdir. Satır içi olay yöneticileri, basit fonksiyonlar için kullanışlıdır.

<Pitfall>

Olay yöneticilerine iletilen fonksiyonlar çağırılmamalıdır, yalnızca iletilmelidir. Örneğin:

| fonksiyonu iletmek (doğru)       | fonksiyonu çağırmak (yanlış)     |
| -------------------------------- | ---------------------------------- |
| `<button onClick={handleClick}>` | `<button onClick={handleClick()}>` |

Aradaki farkı farkedebilmek zor olabilir. İlk örnekte, `handleClick` fonksiyonu `onClick` olay yöneticisi olarak iletilir. Bu sayede React, fonksiyonu hatırlar ve yalnızca kullanıcı düğmeye tıkladığında çağırır.

İkinci örnekte, `handleClick()` ifadesinin sonundaki parantezler yüzünden [rendering](/learn/render-and-commit) esnasında herhangi bir tıklama olmaksızın fonksiyon doğrudan tetiklenir. Sebebi ise [JSX'de `{` ve `}`](/learn/javascript-in-jsx-with-curly-braces) arasındaki JavaScript kodlarının anında yürütülmesidir.

Satır içi kod yazarken aynı tuzak farklı bir biçimde ortaya çıkar:

| fonksiyonu iletmek (doğru)              | fonksiyonu çağırmak (yanlış)    |
| --------------------------------------- | --------------------------------- |
| `<button onClick={() => alert('...')}>` | `<button onClick={alert('...')}>` |


Satır içi yazılan bu gibi kodlar, tıklama esnasında tetiklenmez—bileşenin render'larında tetiklenir:

```jsx
// `alert` her tıklamada değil, her render'da tetiklenir!
<button onClick={alert('Bana tıkladın!')}>
```

Olay yöneticinizi satır içi tanımlamak isterseniz anonim işleve sarabilirsiniz:

```jsx
<button onClick={() => alert('Bana tıkladın!')}>
```

Bu sayede her render'da çalıştırmak yerine daha sonra çağrılmak üzere bir fonksiyon oluşturur.

Her iki durumda da iletmek istediğimiz şey fonksiyondur:

* `<button onClick={handleClick}>` ifadesinde `handleClick` fonksiyonu iletilir.
* `<button onClick={() => alert('...')}>` ifadesinde `() => alert('...')` fonksiyonu iletilir.

[Ok fonksiyonları (arrow functions) hakkında daha fazla bilgi edinin.](https://tr.javascript.info/arrow-functions-basics)

</Pitfall>

### Olay yöneticilerinde prop'ları okumak {/*reading-props-in-event-handlers*/}

Olay yöneticileri, bileşenlerin içerisinde tanımlandığından prop'lara erişebilirler. Tıklandığında `message` prop'unun değerini içeren bir uyarı gösteren bir düğme örneğine bakalım:

<Sandpack>

```js
function AlertButton({ message, children }) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <AlertButton message="Oynatılıyor!">
        Film Oynat
      </AlertButton>
      <AlertButton message="Yükleniyor!">
        Resim Yükle
      </AlertButton>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Bu iki düğmenin farklı mesaj gösterebilmesine olanak sağlar. Bileşenlere ilettiğiniz mesajları değiştirmeyi deneyin.

### Olay yöneticilerini prop olarak iletmek {/*passing-event-handlers-as-props*/}

Sıklıkla bileşenlerin alt bileşenlerindeki (child component) olay yöneticilerini belirlemesini istersiniz. Düğmeleri düşünelim: bileşeninin nerede kullanıldığına bağlı olarak farklı işlevler yerine getirmesini isteyebilirsiniz - mesela biri film oynatırken diğeri resim yükleyebilir.

Bunun için, üst bileşenden (parent component) prop olarak alınan fonksiyon olay yöneticisi olarak kullanılabilir:

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`${movieName} oynatılıyor!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      "{movieName}" Filmini Oynat
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Yükleniyor!')}>
      Resim Yükle
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Hababam Sınıfı" />
      <UploadButton />
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>


`Toolbar` bileşeni, `PlayButton` ve `UploadButton` bileşenlerini render eder:

- `PlayButton`, içerisindeki `Button` bileşenine `onClick` prop'u için `handlePlayClick` fonksiyonunu iletir.
- `UploadButton`, içerisindeki `Button` bileşenine `onClick` prop'u için `() => alert('Yükleniyor!')` fonksiyonunu iletir.

Son olarak, `Button` bileşeniniz `onClick` prop'unu kabul eder ve doğrudan `onClick={onClick}` şeklinde yerleşik `<button>` elementine aktarır. Böylece React, düğmeye tıkladıkça ilettiğiniz fonksiyonu çağırır.

Bu durum [tasarım sistemlerinde (design system)](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) yaygınca kullanılır. Tasarım sistemi bileşenleri varsayılan stillendirmelere sahiptirler ancak davranış tanımlamazlar. Böylece `PlayButton` ve `UploadButton` bileşenlerinde olduğu gibi, olay yöneticileri iletilerek davranış belirlenir.

### Olay yönetici prop'larını adlandırmak {/*naming-event-handler-props*/}

`<button>` ve `<div>` gibi yerleşik bileşenler, yalnızca `onClick` gibi [tarayıcı olay adlarını](/reference/react-dom/components/common#common-props) prop adı olarak destekler. Ancak kendi bileşenlerinizin olay yönetici prop'larını istediğiniz gibi adlandırabilirsiniz.

Geleneksel olarak, olay yönetici prop'ları `on` ile başlamalı ve büyük harfle devam etmelidir.

Örneğin, `Button` bileşeninin `onClick` prop'u `onSmash` olarak da adlandırılabilirdi:

<Sandpack>

```js
function Button({ onSmash, children }) {
  return (
    <button onClick={onSmash}>
      {children}
    </button>
  );
}

export default function App() {
  return (
    <div>
      <Button onSmash={() => alert('Oynatılıyor!')}>
        Film Oynat
      </Button>
      <Button onSmash={() => alert('Yükleniyor!')}>
        Resim Yükle
      </Button>
    </div>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Bu örnekte, `<button onClick={onSmash}>` ifadesindeki `<button>` (küçük harfle) tıklama olayı için `onClick` isminde bir prop almak zorundadır ancak özel `Button` bileşeninizin prop adı tamamen size kalmıştır!

Bileşeniniz birden fazla etkileşimi desteklediğinde, olay işleyicisi prop'larını uygulamaya özgü konseptler için adlandırabilirsiniz. Örneğin, `Toolbar` bileşeni `onPlayMovie` ve `onUploadImage` olay yöneticilerini alır:

<Sandpack>

```js
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Oynatılıyor!')}
      onUploadImage={() => alert('Yükleniyor!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Film Oynat
      </Button>
      <Button onClick={onUploadImage}>
        Resim Yükle
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
button { margin-right: 10px; }
```

</Sandpack>

Dikkat ederseniz `App` bileşeni, `Toolbar` bileşeninin `onPlayMovie` veya `onUploadImage` ile *ne* yapacağını bilmek zorunda değildir. Bu `Toolbar` bileşeninin implementasyon detayıdır. `Toolbar`, bu prop'ları `Button`'larına `onClick` olay yöneticisi olarak iletir. İleriki zamanlarda tıklama yerine klavye kısayoluyla da tetikletmek isteyebilirsiniz. Bileşenlerinizin prop'larını `onPlayMovie` gibi uygulamaya özgü etkileşimlere göre adlandırmak ileride kullanım biçimlerini değiştirme esnekliği sağlar.

## Olayların yayılması {/*event-propagation*/}

Olay yöneticileri aynı zamanda alt elementlerden gelen olayları da yakalar. Bu durum, olayların "kabarması" (bubble) ya da "yayılması" (propagate) olarak adlandırılır. Meydana geldiği yerde başlar ve DOM ağacında yukarı doğru ilerler.

Örnekteki `<div>` iki düğme içerir. Hem `<div>` *hem de* düğmeler kendi `onClick` yöneticilerine sahiptirler. Bir düğmeye tıkladığınızda hangi yöneticilerin tetikleneceğini düşünürsünüz?

<Sandpack>

```js
export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('Araç çubuğuna tıkladın!');
    }}>
      <button onClick={() => alert('Oynatılıyor!')}>
        Film Oynat
      </button>
      <button onClick={() => alert('Yükleniyor!')}>
        Resim Yükle
      </button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Bir düğmeye tıkladığınızda, önce kendi `onClick`'i çalışır sonrasında üst element olan `div`'in `onClick`'i çalışır. Bu sebeple iki mesaj belirir. Eğer araç çubuğuna tıklarsanız, yalnızca `div`'in `onClick`'i çalışır.

<Pitfall>

React'ta `onScroll` haricindeki tüm olaylar yayılır. `onScroll` ise sadece eklendiği JSX etiketi için çalışır.

</Pitfall>

### Yayılımı durdurmak {/*stopping-propagation*/}

Olay yöneticileri argüman olarak yalnızca bir **olay nesnesi (event object)** alır. Genellikle olay teriminin İngilizce karşılığı "event"in kısaltılması olan `e` ile adlandırılırlar. Bu nesneyi kullanarak olay hakkındaki detaylara erişebilirsiniz.

Olay nesnesi ayrıca yayılımı durdurmanıza da imkan sağlar. Bir olayın üst bileşenlere erişmesini engellemek istiyorsanız, örnekteki `Button` bileşeninde olduğu gibi `e.stopPropagation()` çağırmalısınız.

<Sandpack>

```js
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('Araç çubuğuna tıkladın!');
    }}>
      <Button onClick={() => alert('Oynatılıyor!')}>
        Film Oynat
      </Button>
      <Button onClick={() => alert('Yükleniyor!')}>
        Resim Yükle
      </Button>
    </div>
  );
}
```

```css
.Toolbar {
  background: #aaa;
  padding: 5px;
}
button { margin: 5px; }
```

</Sandpack>

Düğmelerden birisine tıkladığınızda:

1. React, `<button>`'a iletilen `onClick` yöneticisini çağırır. 
2. Bu yönetici, `Button` içerisinde tanımlanır ve şunları yapar:
   *  Olayın daha fazla kabarmasını (bubbling) önlemek için `e.stopPropagation()` metodunu çağırır.
   * `Toolbar` bileşeninden prop olarak iletilen `onClick` fonksiyonunu çağırır.
3. Bu fonksiyon `Toolbar` bileşeninde tanımlanır ve düğmenin kendi uyarısını görüntüler.
4. Yayılım durdurulduğu için üstteki `<div>` elementinin `onClick` yöneticisi *çalışmaz*.

Düğmeye tıklandığında `<button>` ve `<div>` elementlerinden gelen iki ayrı uyarı gösterilirken `e.stopPropagation()` kullanıldığında yalnızca `<button>` elementinden gelen uyarı gösterilir. Düğmeye tıklamak, fonksiyonellik açısından araç çubuğuna tıklamakla aynı şey değildir. Dolayısıyla da olayın yayılımının durdurulması arayüz açısından oldukça mantıklıdır.

<DeepDive>

#### Olay aşamalarını yakalamak {/*capture-phase-events*/}

Nadir durumlarda **yayılması durdurulmuş** olsa bile alt elemanlardaki olayları yakalamak isteyebilirsiniz. Örneğin, analitik verileri için her tıklamayı kaydetmek istebilirsiniz. Bu yayılım mantığından bağımsızdır. Bunu olay adının sonuna `Capture` ekleyerek yapabilirsiniz:

```js
<div onClickCapture={() => { /* ilk bu çalışır */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```

Her olay üç aşamada yayılır:

1. Aşağıya doğru ilerleyecek şekilde tüm `onClickCapture` yöneticilerini çalıştırır.
2. Tıklanan elementin `onClick` yöneticisi çalıştırır. 
3. Yukarı doğru ilerleyecek şekilde tüm `onClick` yöneticilerini çalıştırır.

Olayları yakalamak, yönlendirici (router) ya da analitik kodları için faydalıdır ancak muhtemelen uygulamanızda kullanmayacaksınız.

</DeepDive>

### Yayılıma alternatif olarak yöneticileri iletmek {/*passing-handlers-as-alternative-to-propagation*/}

Örnekteki tıklama yöneticisinin önce bir kod satırını yürüttüğüne, _ardından_ üst bileşenden iletilen `onClick` prop'unu çağırdığına dikkat edin:

```js {4,5}
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}
```

Bu yöneticiye, üst bileşenin `onClick` olay yöneticisini çağırmadan önce, istediğiniz kadar kod ekleyebilirsiniz. Bu kalıp, yayılıma *alternatif* sağlar. Alt bileşenin olayı yönetmesine izin verirken, üst bileşenin ek davranışları belirlemesine olanak tanır. Yayılımın aksine otomatik değildir. Ancak bu kalıbın faydası, bir olay sonucunda yürütülen kod zincirinin tamamını net bir şekilde takip edebilmenizdir.

Eğer yayılıma güvenmiyorsanız ve hangi yöneticlerin neden çalıştığını takip etmekte zorlanıyorsanız bu yaklaşımı deneyin.

### Varsayılan davranışı önlemek {/*preventing-default-behavior*/}

Bazı tarayıcı olayları, kendisine has varsayılan davranışlara sahiptir. Örneğin, `<form>`'un gönderme (submit) olayı, içerisindeki düğmeye tıklandığında varsayılan olarak tüm sayfanın yeniden yüklenmesine neden olur:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={() => alert('Gönderiliyor!')}>
      <input />
      <button>Gönder</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Bu durumu önlemek için olay nesnesinden `e.preventDefault()` metodunu çağırabilirsiniz:

<Sandpack>

```js
export default function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Gönderiliyor!');
    }}>
      <input />
      <button>Gönder</button>
    </form>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>


`e.stopPropagation()` ve `e.preventDefault()` metodlarını birbiriyle karıştırmayın. İkisi de yararlıdır ancak birbiriyle ilişkileri yoktur:

* [`e.stopPropagation()`](https://developer.mozilla.org/docs/Web/API/Event/stopPropagation), üstündeki etiketlere eklenen olay yöneticilerinin tetiklenmesini önler.
* [`e.preventDefault()` ](https://developer.mozilla.org/docs/Web/API/Event/preventDefault), bazı olayların sahip olduğu varsayılan tarayıcı davranışını önler.

## Olay yöneticilerinin yan etkileri olabilir mi? {/*can-event-handlers-have-side-effects*/}

Kesinlikle! Olay yöneticileri yan etkiler (side effect) için en iyi yerdir.

Renderlama fonksiyonlarının aksine, olay yöneticilerinin [saf (pure)](/learn/keeping-components-pure) olması gerekmez. Bu sebeple bir şeyleri *değiştirmek* için güzel yerlerdir - örneğin, yazma eylemine tepki olarak girdi değerini değiştirmek veya düğmeye basma eylemine tepki olarak listeyi değiştirmek. Ancak, bilgiyi değiştirmek için öncelikle bir yerde saklamak gerekir. React'da bunu yapmak için [state, bileşen hafızası](/learn/state-a-components-memory) kullanabilirsiniz. Bununla ilgili tüm detayları bir sonraki sayfada öğreneceksiniz.

<Recap>

* `<button>` gibi elementlere fonksiyonları prop olarak ileterek olayları yönetebilirsiniz.
* Olay yöneticileri iletilmelidir, **çağırılmamalıdır!** `onClick={handleClick}` doğru kullanımdır, `onClick={handleClick()}` ise yanlış kullanımdır.
* Olay yönetici fonksiyonunu ayrı yada satır içi tanımlayabilirsiniz.
* Olay yöneticileri bileşenin içerisinde tanımlanır, bu nedenle prop'lara erişebilirler.
* Olay yöneticilerini üst bileşende tanımlayıp alt bileşene prop olarak iletebilirsiniz.
* Uygulamaya özgü isimleri kullanarak kendi olay yönetici prop'larınızı tanımlayabilirsiniz.
* Olaylar yukarı doğru yayılır. Önlemek için `e.stopPropagation()`'ı yönetici fonksiyonun en üstünde çağırın.
* Olaylar, istenmeyen varsayılan tarayıcı davranışına sahip olabilir. Önlemek için `e.preventDefault()`'u çağırın.
* Olay yöneticisi prop'unu alt bileşenin yöneticisinde açıkca çağırmak, yayılıma iyi bir alternatiftir.

</Recap>



<Challenges>

#### Olay yöneticisini düzeltin {/*fix-an-event-handler*/}

Örnekteki düğmeye tıklandığında sayfa arka planının beyaz ve siyah arasında geçiş yapması beklenir ancak tıkladığınızda hiçbir şey olmaz. Bu problemi çözün. (`handleClick` içerisindeki mantıkla ilgilenmeyin—o kısım sorunsuzdur.)

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick()}>
      Işıkları aç/kapat
    </button>
  );
}
```

</Sandpack>

<Solution>

Problemin sebebi, `<button onClick={handleClick()}>`'deki `handleClick` fonksiyonunu elemente _iletmek_ yerine _çağırmasıdır_. Çözmek için ilgili koddaki `()` çağrısını kaldırarak `<button onClick={handleClick}>` olarak değiştirmek gerekir:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={handleClick}>
      Işıkları aç/kapat
    </button>
  );
}
```

</Sandpack>

Alternatif olarak çağrıyı anonim fonksiyona sarabilirsiniz, örneğin `<button onClick={() => handleClick()}>`:

<Sandpack>

```js
export default function LightSwitch() {
  function handleClick() {
    let bodyStyle = document.body.style;
    if (bodyStyle.backgroundColor === 'black') {
      bodyStyle.backgroundColor = 'white';
    } else {
      bodyStyle.backgroundColor = 'black';
    }
  }

  return (
    <button onClick={() => handleClick()}>
      Işıkları aç/kapat
    </button>
  );
}
```

</Sandpack>

</Solution>

#### Olayları bağlayın {/*wire-up-the-events*/}

`ColorSwitch` bileşeni bir düğme render eder ve tıklandığında sayfa rengini değiştirmesi beklenir. Düğmeye tıklandığında renk değiştirmek için üst bileşenden aldığınız `onChangeColor` olay yönetici prop'unu bileşene bağlayın.

Düzeltmeyi yaptıktan sonra düğmeye yapılan tıklamaların beklenmedik şekilde sayfa tıklama sayacını da arttırdığına dikkat edin. Üst bileşeni yazan ekip arkadaşınız `onChangeColor` kodunda sayacın arttırılmadığı konusunda ısrar ediyor. Problemin sebebi başka ne olabilir? Düğmeye tıkladığınızda sayacın _artmaması_ için gerekli düzeltme yapın. Düğmenin *yalnızca* arkaplan rengini değiştirmesi beklenir.

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button>
      Rengi değiştir
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Sayfanın tıklanma sayısı: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

<Solution>

Öncelikle, `<button onClick={onChangeColor}>` şeklinde olay yöneticisi eklemeniz gerekir.

Ancak yöneticiyi eklediğinizde sayacın da arttığını görebilirsiniz. Ekip arkadaşınızın belirttiği gibi `onChangeColor` fonksiyonu sayacı arttırmıyorsa, problemin sebebi olayın yukarı doğru yayılması ve üstteki yöneticinin bunu gerçekleştirmesidir. Sorunu çözmek için yayılımı durdurmanız gerekir. Ancak `onChangeColor`'ı çağırmayı unutmamalısınız.

<Sandpack>

```js ColorSwitch.js active
export default function ColorSwitch({
  onChangeColor
}) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onChangeColor();
    }}>
      Rengi değiştir
    </button>
  );
}
```

```js App.js hidden
import { useState } from 'react';
import ColorSwitch from './ColorSwitch.js';

export default function App() {
  const [clicks, setClicks] = useState(0);

  function handleClickOutside() {
    setClicks(c => c + 1);
  }

  function getRandomLightColor() {
    let r = 150 + Math.round(100 * Math.random());
    let g = 150 + Math.round(100 * Math.random());
    let b = 150 + Math.round(100 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  function handleChangeColor() {
    let bodyStyle = document.body.style;
    bodyStyle.backgroundColor = getRandomLightColor();
  }

  return (
    <div style={{ width: '100%', height: '100%' }} onClick={handleClickOutside}>
      <ColorSwitch onChangeColor={handleChangeColor} />
      <br />
      <br />
      <h2>Sayfa tıklanma sayısı: {clicks}</h2>
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
