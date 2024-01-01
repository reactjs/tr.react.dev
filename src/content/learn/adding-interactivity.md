---
title: Etkileşim Ekleme
---

<Intro>

Ekrandaki bazı şeyler kullanıcı girdisine yanıt olarak güncellenir. Örneğin, bir resim galerisine tıklamak aktif resmi değiştirir. React'te, zaman içinde değişen verilere *state* denir. Herhangi bir bileşene state ekleyebilir ve gerektiğinde güncelleyebilirsiniz. Bu bölümde, etkileşimleri işleyen, durumlarını güncelleyen ve zaman içinde farklı çıktılar görüntüleyen bileşenleri nasıl yazacağınızı öğreneceksiniz.

</Intro>

<YouWillLearn isChapter={true}>

* [Kullanıcı tarafından başlatılan olaylar nasıl ele alınır](/learn/responding-to-events)
* [State kullanılarak bileşenlerin bilgiyi "hatırlaması" nasıl sağlanır](/learn/state-a-components-memory)
* [React kullanıcı arayüzünü iki aşamada nasıl günceller](/learn/render-and-commit)
* [State neden onu değiştirdiğiniz anda güncellenmez](/learn/state-as-a-snapshot)
* [Birden çok state güncellemesi sıraya nasıl alınır](/learn/queueing-a-series-of-state-updates)
* [State içerisindeki nesne nasıl güncellenir](/learn/updating-objects-in-state)
* [State içerisindeki dizi nasıl güncellenir](/learn/updating-arrays-in-state)

</YouWillLearn>

## Olaylara tepki verme {/*responding-to-events*/}

React, JSX'inize *olay yöneticileri* eklemenize olanak tanır. Olay yöneticileri; tıklama, üzerine gelme (hover), form girdilerine odaklanma gibi kullanıcı aksiyonlarına tepki vermek için tetiklenecek olan fonksiyonlarınızdır.

`<button>` gibi yerleşik bileşenler yalnızca `onClick` gibi yerleşik tarayıcı olaylarını destekler. Ancak kendi bileşenlerinizi oluşturabilir ve olay yöneticisini ileteceğiniz prop'lara uygulamanıza özgü isimler verebilirsiniz.

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
        Filmi Oynat
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

<LearnMore path="/learn/responding-to-events">

Olay yöneticilerinin nasıl ekleneceğini öğrenmek için **[Olaylara Tepki Verme](/learn/responding-to-events)** bölümünü okuyun.

</LearnMore>

## State: bir bileşenin hafızası {/*state-a-components-memory*/}

Bileşenlerin, genellikle bir etkileşim sonucunda ekrandakileri değiştirmesi gerekir. Forma yazı yazmak girdi alanını güncellemeli, bir resim slaytında "ileri" tıklamak hangi resmin görüntüleneceğini değiştirmeli, "satın al" a tıklamak bir ürünü alışveriş sepetine koymalıdır. Bileşenlerin; mevcut girdi değeri, seçili görsel, alışveriş sepeti gibi şeyleri "hatırlaması" gerekir. React'te bu tür bileşene özgü bellekler *state* olarak adlandırılır.

[`useState`](/reference/react/useState) Hook'u ile bir bileşene state ekleyebilirsiniz. *Hook'lar*, bileşenlerinizde React özelliklerini kullanmanızı sağlayan özel fonksiyonlardır (state bu özelliklerden biridir). `useState` Hook'u, bir state değişkeni bildirmenizi sağlar. Bu Hook başlangıç state'ini alır ve bir çift değer döndürür: mevcut state ve state'i güncellemenizi sağlayan bir fonksiyon.

```js
const [index, setIndex] = useState(0);
const [showMore, setShowMore] = useState(false);
```

Aşağıda resim galerisinin state'i nasıl kullandığını ve state'i tıklama ile nasıl güncellendiğini görebilirsiniz:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  const hasNext = index < sculptureList.length - 1;

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleNextClick}>
        Sonraki
      </button>
      <h2>
        {sculpture.artist}'den
        <i>{sculpture.name} </i>
      </h2>
      <h3>
        ({index + 1}/{sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        Detayları {showMore ? 'Sakla' : 'Göster'}
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img
        src={sculpture.url}
        alt={sculpture.alt}
      />
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Colvin ağırlıklı olarak İspanyol öncesi sembollere gönderme yapan soyut temalarla bilinmesine rağmen, beyin cerrahisine saygı duruşu niteliğindeki bu devasa heykel onun en tanınmış sanat eserlerinden biridir.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Parmak uçlarında insan beynini zarif bir şekilde tutan çapraz iki elin yer aldığı bronz bir heykel.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: "Bu muazzam (75 ft. veya 23m) gümüş çiçek Buenos Aires'te bulunuyor. Akşamları veya kuvvetli rüzgarlar estiğinde yapraklarını kapatarak sabahları açarak hareket edecek şekilde tasarlanmıştır.",
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Yansıtıcı ayna benzeri yaprakları ve güçlü organları ile devasa metalik çiçek heykeli.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson eşitlik ve sosyal adaletin yanı sıra insanlığın temel ve manevi niteliklerine olan ilgisiyle biliniyordu. Bu devasa (7 ft. veya 2,13 m) bronz, kendisinin "evrensel insanlık duygusuyla aşılanmış sembolik bir Siyah varlığı" olarak tanımladığı şeyi temsil ediyor.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'İnsan kafasını tasvir eden heykel her zaman mevcut ve ciddi görünüyor. Sakinlik ve dinginlik yayar.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: "Paskalya Adası'nda, ilk Rapa Nui halkı tarafından yapılmış ve bazılarının tanrılaştırılmış ataları temsil ettiğine inanılan 1000 moai veya günümüze ulaşan anıtsal heykeller bulunmaktadır.",
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Başları orantısız derecede büyük ve kasvetli yüzlere sahip üç anıtsal taş büst.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: "Nanalar muzaffer yaratıklardır, kadınlık ve analığın simgeleridir. Başlangıçta Saint Phalle, Nana'lar için kumaş kullanmış ve nesneler bulmuş, daha sonra daha canlı bir etki elde etmek için polyesteri kullanmıştır.",
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Sevinç yayan renkli bir kostüm içinde tuhaf dans eden bir kadın figürünün büyük mozaik heykeli.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: "Bu soyut bronz heykel, Yorkshire Heykel Parkı'nda bulunan The Family of Man serisinin bir parçasıdır. Hepworth, dünyanın gerçek temsillerini yaratmayı değil, insanlardan ve manzaralardan ilham alan soyut formlar geliştirmeyi seçti.",
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'Bir insan figürünü anımsatan, üst üste dizilmiş üç öğeden oluşan uzun bir heykel.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Dört nesildir ahşap oymacılığı yapan Fakeye'nin çalışmaları geleneksel ve çağdaş Yoruba temalarını harmanlıyordu.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Desenlerle süslenmiş, ata odaklanmış bir yüze sahip bir savaşçının karmaşık ahşap heykeli.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow, gençliğin ve güzelliğin kırılganlığı ve geçiciliğine dair bir metafor olarak parçalanmış beden heykelleriyle tanınıyor. Bu heykel, her biri yaklaşık 1,5 metre yüksekliğinde, üst üste dizilmiş, çok gerçekçi iki büyük karnı tasvir ediyor.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'Heykel, klasik heykellerdeki karınlardan oldukça farklı olarak bir dizi kıvrımı andırıyor.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: "Terracotta Ordusu, Çin'in ilk İmparatoru Qin Shi Huang'ın ordularını tasvir eden pişmiş toprak heykellerden oluşan bir koleksiyondur. Ordu 8.000'den fazla asker, 520 atlı, 130 savaş arabası ve 150 süvari atından oluşuyordu.",
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 tane her biri benzersiz bir yüz ifadesine ve zırha sahip, ciddi savaşçıların pişmiş toprak heykeli.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: "Nevelson, daha sonra anıtsal yapılara dönüştüreceği New York şehrinin enkazından nesneleri temizlemesiyle tanınıyordu. Bu eserinde karyola direği, hokkabazlık iğnesi ve koltuk parçası gibi farklı parçaları kullanarak Kübizm'in geometrik mekan ve biçim soyutlamasının etkisini yansıtan kutulara çivileyip yapıştırdı.",
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Bireysel unsurların başlangıçta ayırt edilemediği siyah mat bir heykel.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar geleneksel ile moderni, doğal ile endüstriyel olanı birleştiriyor. Sanatı insan ve doğa arasındaki ilişkiye odaklanıyor. Çalışmaları hem soyut hem de mecazi olarak ilgi çekici, yerçekimine meydan okuyan ve "beklenmedik malzemelerin ince bir sentezi" olarak tanımlanıyor.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Beton duvara monte edilmiş ve yere inen soluk tel benzeri bir heykel. Hafifmiş gibi görünüyor.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'Taipei Hayvanat Bahçesi, su altındaki su aygırlarının oyun oynadığı bir Su Aygırı Meydanı yaptırdı.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Setin kaldırımından sanki yüzüyormuş gibi çıkan bir grup bronz su aygırı heykeli.'
}];
```

```css
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
 margin-top: 5px;
 font-weight: normal;
 font-size: 100%;
}
img { width: 120px; height: 120px; }
button {
  display: block;
  margin-top: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<LearnMore path="/learn/state-a-components-memory">

**[State: Bir Bileşenin Hafızası](/learn/state-a-components-memory)** sayfasını okuyarak bir değeri nasıl hatırlayacağınızı ve etkileşim ile o değeri nasıl güncelleyeceğinizi öğrenin.

</LearnMore>

## Render et ve işle {/*render-and-commit*/}

Bileşenleriniz ekranda gösterilmeden önce, React tarafından render edilmek zorundadırlar. Bu işlemdeki adımları anlamak, kodunuzun nasıl çalıştığını düşünmenize ve davranışını açıklamanıza yardımcı olacaktır.

Bileşenlerinizin mutfakta malzemelerden lezzetli yemekler hazırlayan aşçılar olduğunu hayal edin. Bu senaryoda React, müşterilerin siparişlerini alan ve bu siparişleri sunan garsondur. Kullanıcı arayüzünü isteme ve sunma sürecinin üç aşaması vardır:

1. Bir render **tetiklemek** (müşterinin siparişinin mutfaktaki aşçıya iletilmesi)
2. Bileşeni **render etmek** (siparişin mutfakta hazırlanması)
3. DOM'a **işlemek** (siparişin masaya götürülmesi)

<IllustrationBlock sequential>
  <Illustration caption="Tetikle" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render et" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="İşle" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

<LearnMore path="/learn/render-and-commit">

**[Render et ve İşle](/learn/render-and-commit)** sayfasını okuyarak kullanıcı arayüzü güncellemesinin yaşam döngüsünü öğrenin.

</LearnMore>

## Anlık görüntü olarak state {/*state-as-a-snapshot*/}

Sıradan JavaScript değişkenlerinin yanı sıra, React state'i daha çok anlık bir görüntü olarak davranır. Bu değişkeni ayarlamak zaten mevcut state değişkenini değiştirmez onun yerine yeniden render tetikler. Bu ilk başta şaşırtıcı gelebilir!

```js
console.log(count);  // 0
setCount(count + 1); // 1 ile yeniden render iste
console.log(count);  // Hala 0!
```

Bu davranış, ince hatalardan kaçınmanıza yardımcı olur. Aşağıda küçük bir mesajlaşma uygulaması vardır. "Gönder" butonuna tıkladıktan *sonra* alıcıyı Bob ile değiştirin ve ne olacağını tahmin etmeye çalışın. 5 saniye sonra kimin ismi `alert` kutusunda çıkacaktır?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Merhaba');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`${to}'a ${message} dediniz`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Alıcı:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Mesaj"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Gönder</button>
    </form>
  );
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>


<LearnMore path="/learn/state-as-a-snapshot">

**[Anlık Görüntü Olarak State](/learn/state-as-a-snapshot)** sayfasını okuyarak olay yönetecilerinde state'in neden "sabit" ve değişmez göründüğünü öğrenin.

</LearnMore>

## State güncellemelerinin kuyruğa alınması {/*queueing-a-series-of-state-updates*/}

Bu bileşen hatalıdır: "+3" butonuna tıklamak skoru sadece bir artırmaktadır.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Skor: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

[Anlık Görüntü Olarak State](/learn/state-as-a-snapshot) sayfası bu duruma neyin neden olduğunu açıklamaktadır. State'i değiştirmek yeni bir yeniden render isteyecektir ama hali hazırda çalışan koddaki state'i değiştirmeyecektir. Yani `score` değeri `setScore(score + 1)` çağırıldıktan hemen sonra `0` olmaya devam edecektir.

```js
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
```

Bu sorunu, state'i değiştirirken *güncelleyici fonksiyon* ileterek düzeltebilirsiniz. `setScore(score + 1)` yerine `setScore(s => s + 1)` kullanmanın "+3" butonunu nasıl düzelttiğine dikkat edin. Bu, birden çok state güncellemesini kuyruğa almanızı sağlar.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h1>Skor: {score}</h1>
    </>
  )
}
```

```css
button { display: inline-block; margin: 10px; font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/queueing-a-series-of-state-updates">

**[State Güncellemelerinin Kuyruğa Alınması](/learn/queueing-a-series-of-state-updates)** sayfasını okuyarak state güncellemelerini nasıl kuyruğa alacağınızı öğrenin.

</LearnMore>

## State içerisindeki nesneleri güncelleme {/*updating-objects-in-state*/}

State, nesneler de dahil olmak üzere herhangi bir JavaScript değerini tutabilir. Ancak, React state'inde tuttuğunuz nesneleri ve dizileri direkt olarak değiştirmemelisiniz. Onun yerine, nesneleri ve dizileri güncellemek istediğinizde, yeni bir tane yaratmanız gerekmektedir (ya da mevcut olanın kopyasını alın) ve daha sonra state'i o kopyayı kullanacak şekilde güncelleyin.

Genel olarak, değiştirmek istediğiniz nesneleri ve dizileri kopyalamak için `...` spread sözdimini kullanacaksınız. Örneğin, iç içe nesneleri güncellemek şöyle gözükecektir:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        İsim:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Başlık:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Şehir:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Resim:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        ({person.artwork.city} şehrinde yaşayan)
        {person.name}
        {' tarafından '}
        <br />
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

Eğer objeleri kopyalamak zor bir hale geldiyse, tekrarlı hale gelen kodu azaltmak için [Immer](https://github.com/immerjs/use-immer) gibi bir kütüphane kullanabilirsiniz:

<Sandpack>

```js
import { useImmer } from 'use-immer';

export default function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        İsim:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Başlık:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        Şehir:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Resim:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        ({person.artwork.city} şehrinde yaşayan)
        {person.name}
        {' tarafından '}
        <br />
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<LearnMore path="/learn/updating-objects-in-state">

**[State İçerisindeki Nesneleri Güncelleme](/learn/updating-objects-in-state)** sayfasını okuyarak nesneleri nasıl doğru şekilde güncellemeniz gerektiğini öğrenin.

</LearnMore>

## State içerisindeki dizileri güncelleme {/*updating-arrays-in-state*/}

State içerisinde saklayabileceğiniz bir diğer değiştirilebilir JavaScript nesnesi dizilerdir ve dizilere salt okunur olarak davranılmalıdır. Nesnelerde olduğu gibi, state'te saklı diziyi güncellemek istediğinizde, yeni bir tane yaratmanız gerekmektedir (ya da mevcut olanın bir kopyasını alın) ve daha sonra yeni diziyi kullanacak şekilde state'i ayarlayın:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, setList] = useState(
    initialList
  );

  function handleToggle(artworkId, nextSeen) {
    setList(list.map(artwork => {
      if (artwork.id === artworkId) {
        return { ...artwork, seen: nextSeen };
      } else {
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Görülecek Sanat Eserleri Listesi</h1>
      <h2>Görmek istediğim eserler listesi:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

</Sandpack>

Eğer dizileri kopyalamak zor bir hale geldiyse, tekrarlı hale gelen kodu azaltmak için [Immer](https://github.com/immerjs/use-immer) gibi bir kütüphane kullanabilirsiniz:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Görülecek Sanat Eserleri Listesi</h1>
      <h2>Görmek istediğim sanat eserleri listesi:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<LearnMore path="/learn/updating-arrays-in-state">

**[State İçerisindeki Dizileri Güncelleme](/learn/updating-arrays-in-state)** sayfasını okuyarak dizileri nasıl doğru şekilde güncellemeniz gerektiğini öğrenin.

</LearnMore>

## Sırada ne var? {/*whats-next*/}

[Olaylara Tepki Verme](/learn/responding-to-events) sayfasına gidin ve bu bölümü sayfa sayfa okumaya başlayın!

Bu konulara zaten aşina iseniz, neden [State'i Yönetme](/learn/managing-state) sayfasını okumuyorsunuz?
