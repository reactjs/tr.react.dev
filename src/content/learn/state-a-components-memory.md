---
title: "State: Bir Bileşenin Hafızası"
---

<Intro>

Bileşenler, etkileşimin bir sonucu olarak ekranda olanı değiştirmeye sıklıkla ihtiyaç duyarlar. Forma yazı yazmak, giriş alanını güncellemelidir, resim karuselinde "sonraki"ye tıklamak gösterilen resmi değiştirmelidir, "satın al" düğmesine tıklamak bir ürünü alışveriş sepetine koymalıdır. Bileşenler şeyleri "hatırlamalıdır": mevcut girdi değeri, mevcut resim, alışveriş sepeti. React'te, bileşene özgü bu tür bellek *state* olarak adlandırılır.

</Intro>

<YouWillLearn>

* [`useState`](/reference/react/useState) Hook'u ile state değişkeni nasıl eklenir
* `useState` Hook'unun döndürdüğü değer çifti
* Birden fazla state değişkeni nasıl eklenir
* Neden state'in yerel olarak adlandırıldığı

</YouWillLearn>

## Normal bir değişken yeterli olmadığında {/*when-a-regular-variable-isnt-enough*/}

İşte bir heykel resmini oluşturan bir bileşen. "Sonraki" düğmesine tıklanarak `index` değişkeni `1`, ardından `2` ve benzeri şekilde değiştirilerek bir sonraki heykel gösterilmelidir. Ancak bu **çalışmayacaktır** (deneyebilirsiniz!):

<Sandpack>

```js
import { sculptureList } from './data.js';

export default function Gallery() {
  let index = 0;

  function handleClick() {
    index = index + 1;
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Sonraki
      </button>
      <h2>
        <i>{sculpture.name}, </i>
        {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: "Colvin'in öncelikle pre-Hispanik sembollere gönderme yapan soyut temalarıyla tanınmasına rağmen, nöroşirurjiye bir saygı niteliğindeki bu devasa heykel, en tanınmış halka açık sanat eserlerinden biridir.",
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Parmak uçlarında insan beynini nazikçe tutan iki çapraz ellerden oluşan bronz bir heykel.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: "Buenos Aires'te bulunan bu devasa (75 ft. veya 23 m) gümüş çiçek, akşamları veya güçlü rüzgarlar estiğinde yapraklarını kapatarak ve sabahları açarak hareket etmek üzere tasarlanmıştır.",
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Ayna gibi yansıtıcı yaprakları ve güçlü erkek organları olan devasa bir metal çiçek heykeli.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson, eşitlik, sosyal adalet ve insanlık özünün temel ve manevi nitelikleriyle ilgilendiği için tanınmaktadır. Bu devasa (7ft. veya 2,13m) bronz, "evrensel insanlık duygusuyla zenginleştirilmiş sembolik bir Siyah varlığı" olarak tanımladığı şeyi temsil etmektedir.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'İnsan kafasını tasvir eden heykel her zaman varmış gibi görünüyor ve hüzünlü. Sakinlik ve huzur yayar.'
}, {
  name: 'Moai',
  artist: 'Bilinmeyen Sanatçı',
  description: "Paskalya Adası'nda bulunan, erken Rapa Nui halkı tarafından yaratılmış 1.000 moai veya devasa anıtsal heykelden oluşan bir koleksiyondur ve bazıları tanrılaştırılmış ataları temsil ettiğine inanıyor.",
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Somut ifadeleriyle orantısız büyük başlara sahip üç devasa taş büst.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nanalar muzaffer yaratıklar, kadınlık ve annelik sembolleridir. Saint Phalle, Nanalar için başlangıçta kumaş ve buluntu nesneler kullanmış, daha sonra daha canlı bir etki elde etmek için polyester kullanmıştır.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Neşe saçan renkli kostümüyle dans eden tuhaf bir kadın figürünün büyük bir mozaik heykeli.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: "Bu soyut bronz heykel, Yorkshire Heykel Parkı'nda bulunan The Family of Man serisinin bir parçasıdır. Hepworth, dünyanın birebir temsillerini yaratmak yerine, insanlardan ve manzaralardan esinlenen soyut formlar geliştirmeyi tercih etmiştir.",
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'İnsan figürünü anımsatan, birbiri üzerine yığılmış üç unsurdan oluşan uzun bir heykel.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Dört kuşaktır ahşap oymacılığı yapan Fakeye'nin eserleri geleneksel ve çağdaş Yoruba temalarını harmanlıyor.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Desenlerle bezenmiş bir atın üzerinde odaklanmış bir yüze sahip bir savaşçının karmaşık bir ahşap heykeli.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow, gençliğin ve güzelliğin kırılganlığı ve geçiciliğine bir metafor olarak parçalanmış bedenlerin heykelleriyle tanınır. Bu heykel, birbirine yığılmış iki çok gerçekçi büyük karın kasını tasvir eder, her biri yaklaşık beş ayak (1,5m) yüksekliğindedir.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'Heykel, klasik heykellerdeki göbeklerden oldukça farklı olan kıvrımlardan oluşan bir çağlayanı andırıyor.'
}, {
  name: 'Terracotta Army',
  artist: 'Bilinmeyen Sanatçı',
  description: "Terracotta Ordusu, Çin'in ilk İmparatoru Qin Shi Huang'ın ordularını tasvir eden bir terracotta heykel koleksiyonudur. Ordu 8.000'den fazla asker, 520 atlı 130 savaş arabası ve 150 süvari atından oluşuyordu.",
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: 'Her biri benzersiz bir yüz ifadesine ve zırha sahip, vakur savaşçıların 12 pişmiş toprak heykeli.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: "Nevelson, New York'un enkazından topladığı ve daha sonra anıtsal yapılarda bir araya getireceği nesnelerle tanınıyordu. Bu eserinde yatak direği, hokkabaz iğnesi ve koltuk parçası gibi birbirinden farklı parçaları kullanmış, bunları çivileyip yapıştırarak Kübizm'in geometrik mekân ve biçim soyutlamasının etkisini yansıtan kutular haline getirmiştir.",
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Tek tek unsurların başlangıçta ayırt edilemediği siyah mat bir heykel.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar geleneksel ve modern olanı, doğal ve endüstriyel olanı birleştiriyor. Sanatı insan ve doğa arasındaki ilişkiye odaklanıyor. Çalışmaları hem soyut hem de figüratif olarak zorlayıcı, yerçekimine meydan okuyan ve "beklenmedik malzemelerin iyi bir sentezi" olarak tanımlanmıştır.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Beton duvara monte edilmiş ve yere inen soluk tel benzeri bir heykel. Hafif görünüyor.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'Taipei Hayvanat Bahçesi, oyun oynayan su aygırlarının yer aldığı bir Su Aygırı Meydanı yaptırdı.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Bir grup bronz su aygırı heykeli sanki yüzüyormuş gibi kaldırımdan çıkıyor.'
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

`handleClick` olay yöneticisi bir yerel değişken olan `index`'i güncelliyor. Ancak, iki şey bu değişikliğin görünür olmasını engelliyor:

1. **Yerel değişkenler renderlar arasında kalıcı değildir.** React bu bileşeni ikinci kez renderladığında, herhangi bir yerel değişiklik göz önünde bulundurulmaz ve bileşen sıfırdan yeniden renderlanır.
2. **Yerel değişkenlere yapılan değişiklikler renderı tetiklemez.** React, bileşeni yeni verilerle yeniden render etmesi gerektiğini fark etmez.

Yeni verilerle bir bileşeni güncellemek için, iki şeyin yapılması gerekir:

1. Renderlar arasında verileri **korumak**.
2. Bileşeni yeni verilerle yeniden render etmesi için React'i **tetiklemek**.

[`useState`](/reference/react/useState) Hook'u bu iki şeyi sağlar:

1. Renderlar arasında verileri saklamak için bir **state değişkeni**.
2. Değişkeni güncellemek ve React'in bileşeni tekrar render etmesini tetiklemek için bir **state setter fonksiyonu**.

## State değişkeni ekleme {/*adding-a-state-variable*/}

Bir state değişkeni eklemek için, dosyanın üst kısmında React'ten `useState` öğesini içe aktarın:

```js
import { useState } from 'react';
```

Ardından, bu satırı:

```js
let index = 0;
```

bununla değiştirin

```js
const [index, setIndex] = useState(0);
```

`index` bir state değişkeni ve `setIndex` ise bir setter fonksiyonudur.

> Buradaki `[` ve `]` sözdizimine [array destructuring](https://thrkardak.medium.com/javascript-harikalar%C4%B1-3-destructuring-assignment-64cbb9fe3355) denir ve bir diziden değerleri okumanızı sağlar. `useState` tarafından döndürülen dizi her zaman tam olarak iki öğeye sahiptir.


`handleClick` içinde birlikte bu şekilde çalışırlar:

```js
function handleClick() {
  setIndex(index + 1);
}
```

Artık "Sonraki" düğmesine tıklamak mevcut heykeli değiştirir:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);

  function handleClick() {
    setIndex(index + 1);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button onClick={handleClick}>
        Sonraki
      </button>
       <h2>
        <i>{sculpture.name}, </i>
        {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
      <p>
        {sculpture.description}
      </p>
    </>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: "Colvin'in öncelikle pre-Hispanik sembollere gönderme yapan soyut temalarıyla tanınmasına rağmen, nöroşirurjiye bir saygı niteliğindeki bu devasa heykel, en tanınmış halka açık sanat eserlerinden biridir.",
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Parmak uçlarında insan beynini nazikçe tutan iki çapraz ellerden oluşan bronz bir heykel.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: "Buenos Aires'te bulunan bu devasa (75 ft. veya 23 m) gümüş çiçek, akşamları veya güçlü rüzgarlar estiğinde yapraklarını kapatarak ve sabahları açarak hareket etmek üzere tasarlanmıştır.",
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Ayna gibi yansıtıcı yaprakları ve güçlü erkek organları olan devasa bir metal çiçek heykeli.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson, eşitlik, sosyal adalet ve insanlığın temel ve ruhsal nitelikleriyle ilgilenmesiyle tanınıyordu. Bu devasa (7 fit veya 2,13 m) bronz, "evrensel insanlık duygusu ile dolu sembolik bir Siyah varlığı" olarak nitelendirdiği şeyi temsil eder.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'İnsan kafasını tasvir eden heykel her zaman varmış gibi görünüyor ve hüzünlü. Sakinlik ve huzur yayar.'
}, {
  name: 'Moai',
  artist: 'Bilinmeyen Sanatçı',
  description: "Paskalya Adası'nda bulunan, erken Rapa Nui halkı tarafından yaratılmış 1.000 moai veya devasa anıtsal heykelden oluşan bir koleksiyondur ve bazıları tanrılaştırılmış ataları temsil ettiğine inanıyor.",
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Somut ifadeleriyle orantısız büyük başlara sahip üç devasa taş büst.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nanalar muzaffer yaratıklar, kadınlık ve annelik sembolleridir. Saint Phalle, Nanalar için başlangıçta kumaş ve buluntu nesneler kullanmış, daha sonra daha canlı bir etki elde etmek için polyester kullanmıştır.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Neşe saçan renkli kostümüyle dans eden tuhaf bir kadın figürünün büyük bir mozaik heykeli.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: "Bu soyut bronz heykel, Yorkshire Heykel Parkı'nda bulunan The Family of Man serisinin bir parçasıdır. Hepworth, dünyanın birebir temsillerini yaratmak yerine, insanlardan ve manzaralardan esinlenen soyut formlar geliştirmeyi tercih etmiştir.",
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'İnsan figürünü anımsatan, birbiri üzerine yığılmış üç unsurdan oluşan uzun bir heykel.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Dört kuşaktır ahşap oymacılığı yapan Fakeye'nin eserleri geleneksel ve çağdaş Yoruba temalarını harmanlıyor.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Desenlerle bezenmiş bir atın üzerinde odaklanmış bir yüze sahip bir savaşçının karmaşık bir ahşap heykeli.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow, gençliğin ve güzelliğin kırılganlığı ve geçiciliğine bir metafor olarak parçalanmış bedenlerin heykelleriyle tanınır. Bu heykel, birbirine yığılmış iki çok gerçekçi büyük karın kasını tasvir eder, her biri yaklaşık beş ayak (1,5m) yüksekliğindedir.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'Heykel, klasik heykellerdeki göbeklerden oldukça farklı olan kıvrımlardan oluşan bir çağlayanı andırıyor.'
}, {
  name: 'Terracotta Army',
  artist: 'Bilinmeyen Sanatçı',
  description: "Terracotta Ordusu, Çin'in ilk İmparatoru Qin Shi Huang'ın ordularını tasvir eden bir terracotta heykel koleksiyonudur. Ordu 8.000'den fazla asker, 520 atlı 130 savaş arabası ve 150 süvari atından oluşuyordu.",
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: 'Her biri benzersiz bir yüz ifadesine ve zırha sahip, vakur savaşçıların 12 pişmiş toprak heykeli.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: "Nevelson, New York'un enkazından topladığı ve daha sonra anıtsal yapılarda bir araya getireceği nesnelerle tanınıyordu. Bu eserinde yatak direği, hokkabaz iğnesi ve koltuk parçası gibi birbirinden farklı parçaları kullanmış, bunları çivileyip yapıştırarak Kübizm'in geometrik mekân ve biçim soyutlamasının etkisini yansıtan kutular haline getirmiştir.",
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Tek tek unsurların başlangıçta ayırt edilemediği siyah mat bir heykel.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar geleneksel ve modern olanı, doğal ve endüstriyel olanı birleştiriyor. Sanatı insan ve doğa arasındaki ilişkiye odaklanıyor. Çalışmaları hem soyut hem de figüratif olarak zorlayıcı, yerçekimine meydan okuyan ve "beklenmedik malzemelerin iyi bir sentezi" olarak tanımlanmıştır.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Beton duvara monte edilmiş ve yere inen soluk tel benzeri bir heykel. Hafif görünüyor.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'Taipei Hayvanat Bahçesi, oyun oynayan su aygırlarının yer aldığı bir Su Aygırı Meydanı yaptırdı.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Bir grup bronz su aygırı heykeli sanki yüzüyormuş gibi kaldırımdan çıkıyor.'
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

### İlk Hook'unuz ile tanışın {/*meet-your-first-hook*/}

React'te, `useState` ve "`use`" ile başlayan diğer tüm fonksiyonlar Hook olarak adlandırılır.

*Hook'lar* yalnızca React [rendering](/learn/render-and-commit#step-1-trigger-a-render) işlemi sırasında kullanılabilen özel fonksiyonlardır (bir sonraki sayfada daha ayrıntılı olarak ele alacağız). Bunlar farklı React özelliklerini "bağlamaya" izin verirler.

State bu özelliklerden sadece biri, ancak diğer Hook'larla daha sonra tanışacaksınız.

<Pitfall>

**Hook'lar (`use` ile başlayan fonksiyonlar) yalnızca bileşenlerinizin en üst seviyesinde veya [kendi Hook'larınızda](/learn/reusing-logic-with-custom-hooks) çağrılabilir.** Hook'ları koşullar, döngüler veya diğer iç içe geçmiş fonksiyonlar içinde çağıramazsınız. Hook'lar fonksiyonlar olsa da, bileşeninizin ihtiyaçları hakkında koşulsuz deklarasyonlar olarak düşünmek faydalıdır. React özelliklerini bileşeninizin başında "use" edersiniz, tıpkı dosyanızın başında modülleri "import" etmeniz gibi.

</Pitfall>

### `useState`'in' anatomisi {/*anatomy-of-usestate*/}

[`useState`](/reference/react/useState) fonksiyonunu çağırdığınızda, React'e bu bileşenin bir şeyleri hatırlamasını istediğinizi söylüyorsunuz:

```js
const [index, setIndex] = useState(0);
```

Bu örnekte, React'in `index`i hatırlamasını istiyorsunuz.

<Note>

Bu çifti `const [birOge, setBirOge]` gibi adlandırmak geleneksel bir yöntemdir. İstediğiniz herhangi bir isim verebilirsiniz, ancak gelenekleşmiş yöntemler farklı projeler arasında şeylerin daha kolay anlaşılmasını sağlar.

</Note>

`useState` için tek argüman state değişkeninizin **başlangıç değeridir**. Bu örnekte, `index`in başlangıç değeri `useState(0)` ile `0` olarak ayarlanmıştır. 

Bileşeniniz her render edildiğinde, `useState` size iki değer içeren bir dizi verir:

1. Değerinizi saklayan **state değişkeni** (`index`).
2. State değişkenini güncelleyebilen ve React'in bileşeni yeniden renderlaması için tetikleyen **state setter fonksiyonu** (`setIndex`).

İşte bunun işleyişi:

```js
const [index, setIndex] = useState(0);
```
1. **Bileşeniniz ilk kez render edilir.** `useState`'e `index` başlangıç değeri olarak  `0` geçtiğinizden, `[0, setIndex]` olarak geri dönecektir. React, `0` değerinin en son state değeri olduğunu hatırlar.
2. **State'i güncellersiniz.** Bir kullanıcı butona tıkladığında, `setIndex(index + 1)` çağırır. `index` değeri `0` olduğu için `setIndex(1)` çağrılır. Bu, React'e `index`'in artık `1` olduğunu hatırlamasını söyler ve başka bir render işlemini tetikler.
3. **Bileşeninizin ikinci render edilişi.** React hala `useState(0)`'ı görür, ancak React `index`'in artık `1` olarak ayarlandığını *hatırladığıdan*, `[1, setIndex]` olarak geri döner.
4. Ve böyle devam eder!

## Bir bileşene birden fazla state değişkeni verme {/*giving-a-component-multiple-state-variables*/}

Bir bileşende istediğiniz kadar çok sayıda farklı tipte state değişkeni olabilir. Bu bileşende, bir `index` sayısı ve "Detayları göster"e tıkladığınızda değiştirilen bir boolean `showMore` değeri:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
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
        <i>{sculpture.name}, </i>
        {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        Detayları {showMore ? 'Gizle' : 'Göster'}
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
  description: "Colvin'in öncelikle pre-Hispanik sembollere gönderme yapan soyut temalarıyla tanınmasına rağmen, nöroşirurjiye bir saygı niteliğindeki bu devasa heykel, en tanınmış halka açık sanat eserlerinden biridir.",
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Parmak uçlarında insan beynini nazikçe tutan iki çapraz ellerden oluşan bronz bir heykel.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: "Buenos Aires'te bulunan bu devasa (75 ft. veya 23 m) gümüş çiçek, akşamları veya güçlü rüzgarlar estiğinde yapraklarını kapatarak ve sabahları açarak hareket etmek üzere tasarlanmıştır.",
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Ayna gibi yansıtıcı yaprakları ve güçlü erkek organları olan devasa bir metal çiçek heykeli.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson, eşitlik, sosyal adalet ve insanlığın temel ve ruhsal nitelikleriyle ilgilenmesiyle tanınıyordu. Bu devasa (7 fit veya 2,13 m) bronz, "evrensel insanlık duygusu ile dolu sembolik bir Siyah varlığı" olarak nitelendirdiği şeyi temsil eder.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'İnsan kafasını tasvir eden heykel her zaman varmış gibi görünüyor ve hüzünlü. Sakinlik ve huzur yayar.'
}, {
  name: 'Moai',
  artist: 'Bilinmeyen Sanatçı',
  description: "Paskalya Adası'nda bulunan, erken Rapa Nui halkı tarafından yaratılmış 1.000 moai veya devasa anıtsal heykelden oluşan bir koleksiyondur ve bazıları tanrılaştırılmış ataları temsil ettiğine inanıyor.",
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Somut ifadeleriyle orantısız büyük başlara sahip üç devasa taş büst.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nanalar muzaffer yaratıklar, kadınlık ve annelik sembolleridir. Saint Phalle, Nanalar için başlangıçta kumaş ve buluntu nesneler kullanmış, daha sonra daha canlı bir etki elde etmek için polyester kullanmıştır.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Neşe saçan renkli kostümüyle dans eden tuhaf bir kadın figürünün büyük bir mozaik heykeli.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: "Bu soyut bronz heykel, Yorkshire Heykel Parkı'nda bulunan The Family of Man serisinin bir parçasıdır. Hepworth, dünyanın birebir temsillerini yaratmak yerine, insanlardan ve manzaralardan esinlenen soyut formlar geliştirmeyi tercih etmiştir.",
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'İnsan figürünü anımsatan, birbiri üzerine yığılmış üç unsurdan oluşan uzun bir heykel.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Dört kuşaktır ahşap oymacılığı yapan Fakeye'nin eserleri geleneksel ve çağdaş Yoruba temalarını harmanlıyor.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Desenlerle bezenmiş bir atın üzerinde odaklanmış bir yüze sahip bir savaşçının karmaşık bir ahşap heykeli.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow, gençliğin ve güzelliğin kırılganlığı ve geçiciliğine bir metafor olarak parçalanmış bedenlerin heykelleriyle tanınır. Bu heykel, birbirine yığılmış iki çok gerçekçi büyük karın kasını tasvir eder, her biri yaklaşık beş ayak (1,5m) yüksekliğindedir.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'Heykel, klasik heykellerdeki göbeklerden oldukça farklı olan kıvrımlardan oluşan bir çağlayanı andırıyor.'
}, {
  name: 'Terracotta Army',
  artist: 'Bilinmeyen Sanatçı',
  description: "Terracotta Ordusu, Çin'in ilk İmparatoru Qin Shi Huang'ın ordularını tasvir eden bir terracotta heykel koleksiyonudur. Ordu 8.000'den fazla asker, 520 atlı 130 savaş arabası ve 150 süvari atından oluşuyordu.",
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: 'Her biri benzersiz bir yüz ifadesine ve zırha sahip, vakur savaşçıların 12 pişmiş toprak heykeli.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: "Nevelson, New York'un enkazından topladığı ve daha sonra anıtsal yapılarda bir araya getireceği nesnelerle tanınıyordu. Bu eserinde yatak direği, hokkabaz iğnesi ve koltuk parçası gibi birbirinden farklı parçaları kullanmış, bunları çivileyip yapıştırarak Kübizm'in geometrik mekân ve biçim soyutlamasının etkisini yansıtan kutular haline getirmiştir.",
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Tek tek unsurların başlangıçta ayırt edilemediği siyah mat bir heykel.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar geleneksel ve modern olanı, doğal ve endüstriyel olanı birleştiriyor. Sanatı insan ve doğa arasındaki ilişkiye odaklanıyor. Çalışmaları hem soyut hem de figüratif olarak zorlayıcı, yerçekimine meydan okuyan ve "beklenmedik malzemelerin iyi bir sentezi" olarak tanımlanmıştır.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Beton duvara monte edilmiş ve yere inen soluk tel benzeri bir heykel. Hafif görünüyor.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'Taipei Hayvanat Bahçesi, oyun oynayan su aygırlarının yer aldığı bir Su Aygırı Meydanı yaptırdı.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Bir grup bronz su aygırı heykeli sanki yüzüyormuş gibi kaldırımdan çıkıyor.'
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

Bu örnekte olduğu gibi `index` ve `showMore` gibi state'ler birbirleriyle ilişkisiz olduğunda, birden fazla state değişkenine sahip olmak iyi bir fikirdir. Ancak iki state değişkenini sık sık birlikte değiştirdiğinizi fark ederseniz, bunları tek bir değişkende birleştirmek daha pratik olabilir. Örneğin, çok sayıda alana sahip bir formunuz varsa, alan başına state değişkeni yerine bir nesneyi tutan tek bir state değişkenine sahip olmak daha uygundur. Daha fazla ipucu için [Choosing the State Structure](/learn/choosing-the-state-structure) bölümünü okuyun.

<DeepDive>

#### React hangi state'in geri döneceğini nasıl bilir? {/*how-does-react-know-which-state-to-return*/}

`useState` çağrısının *hangi* state değişkenine referans verdiği hakkında herhangi bir bilgi almadığını fark etmiş olabilirsiniz. `useState`'e geçilen bir "tanımlayıcı" yoktur, peki hangi state değişkenini döndüreceğini nasıl bilir? Fonksiyonlarınızı ayrıştırmak gibi bir sihre mi güveniyor? Cevap hayır.

Bunun yerine, kısa sözdizimlerini etkinleştirmek için Hook'lar **aynı bileşenin her render edilişinde sabit bir çağrı sırasına dayanır.** Bu pratikte iyi çalışır, çünkü yukarıdaki kuralı izlerseniz ("Hook'ları yalnızca en üst düzeyde çağırın"), Hook'lar her zaman aynı sırada çağrılacaktır. Ek olarak bir [linter eklentisi](https://www.npmjs.com/package/eslint-plugin-react-hooks) çoğu hatayı yakalar.

Dahili olarak, React her bileşen için bir state çifti dizisi tutar. Ayrıca, render edilmeden önce `0` olarak ayarlanan mevcut çift indeksini de tutar. Her `useState`'i çağırdığınızda, React size bir sonraki state çiftini verir ve indeksi artırır. Bu mekanizma hakkında daha fazla bilgi için [React Hooks: Not Magic, Just Arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e) yazısını okuyabilirsiniz.

Bu örnekte **React** kullanılmıyor ancak `useState`in dahili olarak nasıl çalıştığı hakkında bir fikir verir:

<Sandpack>

```js src/index.js active
let componentHooks = [];
let currentHookIndex = 0;

// useState'nın React içinde nasıl çalıştığı (basitleştirilmiş).
function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // Bu ilk render değil,
    // dolayısıyla state çifti zaten var.
    // Onu döndür ve bir sonraki Hook çağrısı için hazırla.
    currentHookIndex++;
    return pair;
  }

  // Bu ilk render,
  // state çifti oluştur ve depola.
  pair = [initialState, setState];

  function setState(nextState) {
    // Kullanıcı state değişikliği talep ettiğinde,
    // yeni değeri çiftin içine yerleştir.
    pair[0] = nextState;
    updateDOM();
  }

  // Gelecekteki renderlar için çifti depola
  // ve bir sonraki Hook çağrısı için hazırla.
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}

function Gallery() {
  // Her useState() çağrısı bir sonraki çifti alacaktır.
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  // Bu örnek React kullanmadığından
  // JSX yerine bir çıktı nesnesi geri döndürür.
  return {
    onNextClick: handleNextClick,
    onMoreClick: handleMoreClick,
    header: `${sculpture.name} by ${sculpture.artist}`,
    counter: `${index + 1} of ${sculptureList.length}`,
    more: `$Detayları {showMore ? 'Gizle' : 'Göster'}`,
    description: showMore ? sculpture.description : null,
    imageSrc: sculpture.url,
    imageAlt: sculpture.alt
  };
}

function updateDOM() {
  // Bileşeni oluşturmadan önce
  // mevcut Hook dizinini sıfırla.
  currentHookIndex = 0;
  let output = Gallery();

  // Çıktıya uygun olarak DOM'u güncelle.
  // Bu kısım React tarafından sizin için yapılır.
  nextButton.onclick = output.onNextClick;
  header.textContent = output.header;
  moreButton.onclick = output.onMoreClick;
  moreButton.textContent = output.more;
  image.src = output.imageSrc;
  image.alt = output.imageAlt;
  if (output.description !== null) {
    description.textContent = output.description;
    description.style.display = '';
  } else {
    description.style.display = 'none';
  }
}

let nextButton = document.getElementById('nextButton');
let header = document.getElementById('header');
let moreButton = document.getElementById('moreButton');
let description = document.getElementById('description');
let image = document.getElementById('image');
let sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: "Colvin'in öncelikle pre-Hispanik sembollere gönderme yapan soyut temalarıyla tanınmasına rağmen, nöroşirurjiye bir saygı niteliğindeki bu devasa heykel, en tanınmış halka açık sanat eserlerinden biridir.",
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Parmak uçlarında insan beynini nazikçe tutan iki çapraz ellerden oluşan bronz bir heykel.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: "Buenos Aires'te bulunan bu devasa (75 ft. veya 23 m) gümüş çiçek, akşamları veya güçlü rüzgarlar estiğinde yapraklarını kapatarak ve sabahları açarak hareket etmek üzere tasarlanmıştır.",
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Ayna gibi yansıtıcı yaprakları ve güçlü erkek organları olan devasa bir metal çiçek heykeli.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson, eşitlik, sosyal adalet ve insanlığın temel ve ruhsal nitelikleriyle ilgilenmesiyle tanınıyordu. Bu devasa (7 fit veya 2,13 m) bronz, "evrensel insanlık duygusu ile dolu sembolik bir Siyah varlığı" olarak nitelendirdiği şeyi temsil eder.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'İnsan kafasını tasvir eden heykel her zaman varmış gibi görünüyor ve hüzünlü. Sakinlik ve huzur yayar.'
}, {
  name: 'Moai',
  artist: 'Bilinmeyen Sanatçı',
  description: "Paskalya Adası'nda bulunan, erken Rapa Nui halkı tarafından yaratılmış 1.000 moai veya devasa anıtsal heykelden oluşan bir koleksiyondur ve bazıları tanrılaştırılmış ataları temsil ettiğine inanıyor.",
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Somut ifadeleriyle orantısız büyük başlara sahip üç devasa taş büst.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nanalar muzaffer yaratıklar, kadınlık ve annelik sembolleridir. Saint Phalle, Nanalar için başlangıçta kumaş ve buluntu nesneler kullanmış, daha sonra daha canlı bir etki elde etmek için polyester kullanmıştır.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Neşe saçan renkli kostümüyle dans eden tuhaf bir kadın figürünün büyük bir mozaik heykeli.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: "Bu soyut bronz heykel, Yorkshire Heykel Parkı'nda bulunan The Family of Man serisinin bir parçasıdır. Hepworth, dünyanın birebir temsillerini yaratmak yerine, insanlardan ve manzaralardan esinlenen soyut formlar geliştirmeyi tercih etmiştir.",
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'İnsan figürünü anımsatan, birbiri üzerine yığılmış üç unsurdan oluşan uzun bir heykel.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Dört kuşaktır ahşap oymacılığı yapan Fakeye'nin eserleri geleneksel ve çağdaş Yoruba temalarını harmanlıyor.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Desenlerle bezenmiş bir atın üzerinde odaklanmış bir yüze sahip bir savaşçının karmaşık bir ahşap heykeli.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow, gençliğin ve güzelliğin kırılganlığı ve geçiciliğine bir metafor olarak parçalanmış bedenlerin heykelleriyle tanınır. Bu heykel, birbirine yığılmış iki çok gerçekçi büyük karın kasını tasvir eder, her biri yaklaşık beş ayak (1,5m) yüksekliğindedir.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'Heykel, klasik heykellerdeki göbeklerden oldukça farklı olan kıvrımlardan oluşan bir çağlayanı andırıyor.'
}, {
  name: 'Terracotta Army',
  artist: 'Bilinmeyen Sanatçı',
  description: "Terracotta Ordusu, Çin'in ilk İmparatoru Qin Shi Huang'ın ordularını tasvir eden bir terracotta heykel koleksiyonudur. Ordu 8.000'den fazla asker, 520 atlı 130 savaş arabası ve 150 süvari atından oluşuyordu.",
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: 'Her biri benzersiz bir yüz ifadesine ve zırha sahip, vakur savaşçıların 12 pişmiş toprak heykeli.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: "Nevelson, New York'un enkazından topladığı ve daha sonra anıtsal yapılarda bir araya getireceği nesnelerle tanınıyordu. Bu eserinde yatak direği, hokkabaz iğnesi ve koltuk parçası gibi birbirinden farklı parçaları kullanmış, bunları çivileyip yapıştırarak Kübizm'in geometrik mekân ve biçim soyutlamasının etkisini yansıtan kutular haline getirmiştir.",
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Tek tek unsurların başlangıçta ayırt edilemediği siyah mat bir heykel.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar geleneksel ve modern olanı, doğal ve endüstriyel olanı birleştiriyor. Sanatı insan ve doğa arasındaki ilişkiye odaklanıyor. Çalışmaları hem soyut hem de figüratif olarak zorlayıcı, yerçekimine meydan okuyan ve "beklenmedik malzemelerin iyi bir sentezi" olarak tanımlanmıştır.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Beton duvara monte edilmiş ve yere inen soluk tel benzeri bir heykel. Hafif görünüyor.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'Taipei Hayvanat Bahçesi, oyun oynayan su aygırlarının yer aldığı bir Su Aygırı Meydanı yaptırdı.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Bir grup bronz su aygırı heykeli sanki yüzüyormuş gibi kaldırımdan çıkıyor.'
}];

// Kullanıcı arayüzünü ilk state ile eşleştir.
updateDOM();
```

```html public/index.html
<button id="nextButton">
  Sonraki
</button>
<h3 id="header"></h3>
<button id="moreButton"></button>
<p id="description"></p>
<img id="image">

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
button { display: block; margin-bottom: 10px; }
</style>
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

React'i kullanmak için bunu anlamak zorunda değilsiniz, ancak bu sizin için yararlı bir zihinsel model olabilir.

</DeepDive>

## State izole edilmiştir ve özeldir {/*state-is-isolated-and-private*/}

State, ekrandaki bir bileşen örneği için yereldir. Başka bir deyişle, **aynı bileşeni iki kez render ederseniz, her bir kopya tamamen izole edilmiş state'e sahip olacaktır** Birini değiştirmek diğerini etkilemeyecektir.

Bu örnekte, önceki örnekteki `Gallery` bileşeni çalışma mantığı değiştirilmeden iki kez render edilir. Galerilerin her birinin içindeki düğmelere tıklamayı deneyin. State'lerinin bağımsız olduğuna dikkat edin:

<Sandpack>

```js
import Gallery from './Gallery.js';

export default function Page() {
  return (
    <div className="Page">
      <Gallery />
      <Gallery />
    </div>
  );
}

```

```js src/Gallery.js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <section>
      <button onClick={handleNextClick}>
        Sonraki
      </button>
       <h2>
        <i>{sculpture.name}, </i>
        {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        Detayları {showMore ? 'Gizle' : 'Göster'}
      </button>
      {showMore && <p>{sculpture.description}</p>}
      <img 
        src={sculpture.url} 
        alt={sculpture.alt}
      />
    </section>
  );
}
```

```js src/data.js
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: "Colvin'in öncelikle pre-Hispanik sembollere gönderme yapan soyut temalarıyla tanınmasına rağmen, nöroşirurjiye bir saygı niteliğindeki bu devasa heykel, en tanınmış halka açık sanat eserlerinden biridir.",
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Parmak uçlarında insan beynini nazikçe tutan iki çapraz ellerden oluşan bronz bir heykel.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: "Buenos Aires'te bulunan bu devasa (75 ft. veya 23 m) gümüş çiçek, akşamları veya güçlü rüzgarlar estiğinde yapraklarını kapatarak ve sabahları açarak hareket etmek üzere tasarlanmıştır.",
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Ayna gibi yansıtıcı yaprakları ve güçlü erkek organları olan devasa bir metal çiçek heykeli.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson, eşitlik, sosyal adalet ve insanlığın temel ve ruhsal nitelikleriyle ilgilenmesiyle tanınıyordu. Bu devasa (7 fit veya 2,13 m) bronz, "evrensel insanlık duygusu ile dolu sembolik bir Siyah varlığı" olarak nitelendirdiği şeyi temsil eder.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'İnsan kafasını tasvir eden heykel her zaman varmış gibi görünüyor ve hüzünlü. Sakinlik ve huzur yayar.'
}, {
  name: 'Moai',
  artist: 'Bilinmeyen Sanatçı',
  description: "Paskalya Adası'nda bulunan, erken Rapa Nui halkı tarafından yaratılmış 1.000 moai veya devasa anıtsal heykelden oluşan bir koleksiyondur ve bazıları tanrılaştırılmış ataları temsil ettiğine inanıyor.",
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Somut ifadeleriyle orantısız büyük başlara sahip üç devasa taş büst.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nanalar muzaffer yaratıklar, kadınlık ve annelik sembolleridir. Saint Phalle, Nanalar için başlangıçta kumaş ve buluntu nesneler kullanmış, daha sonra daha canlı bir etki elde etmek için polyester kullanmıştır.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Neşe saçan renkli kostümüyle dans eden tuhaf bir kadın figürünün büyük bir mozaik heykeli.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: "Bu soyut bronz heykel, Yorkshire Heykel Parkı'nda bulunan The Family of Man serisinin bir parçasıdır. Hepworth, dünyanın birebir temsillerini yaratmak yerine, insanlardan ve manzaralardan esinlenen soyut formlar geliştirmeyi tercih etmiştir.",
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'İnsan figürünü anımsatan, birbiri üzerine yığılmış üç unsurdan oluşan uzun bir heykel.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Dört kuşaktır ahşap oymacılığı yapan Fakeye'nin eserleri geleneksel ve çağdaş Yoruba temalarını harmanlıyor.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Desenlerle bezenmiş bir atın üzerinde odaklanmış bir yüze sahip bir savaşçının karmaşık bir ahşap heykeli.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow, gençliğin ve güzelliğin kırılganlığı ve geçiciliğine bir metafor olarak parçalanmış bedenlerin heykelleriyle tanınır. Bu heykel, birbirine yığılmış iki çok gerçekçi büyük karın kasını tasvir eder, her biri yaklaşık beş ayak (1,5m) yüksekliğindedir.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'Heykel, klasik heykellerdeki göbeklerden oldukça farklı olan kıvrımlardan oluşan bir çağlayanı andırıyor.'
}, {
  name: 'Terracotta Army',
  artist: 'Bilinmeyen Sanatçı',
  description: "Terracotta Ordusu, Çin'in ilk İmparatoru Qin Shi Huang'ın ordularını tasvir eden bir terracotta heykel koleksiyonudur. Ordu 8.000'den fazla asker, 520 atlı 130 savaş arabası ve 150 süvari atından oluşuyordu.",
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: 'Her biri benzersiz bir yüz ifadesine ve zırha sahip, vakur savaşçıların 12 pişmiş toprak heykeli.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: "Nevelson, New York'un enkazından topladığı ve daha sonra anıtsal yapılarda bir araya getireceği nesnelerle tanınıyordu. Bu eserinde yatak direği, hokkabaz iğnesi ve koltuk parçası gibi birbirinden farklı parçaları kullanmış, bunları çivileyip yapıştırarak Kübizm'in geometrik mekân ve biçim soyutlamasının etkisini yansıtan kutular haline getirmiştir.",
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Tek tek unsurların başlangıçta ayırt edilemediği siyah mat bir heykel.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar geleneksel ve modern olanı, doğal ve endüstriyel olanı birleştiriyor. Sanatı insan ve doğa arasındaki ilişkiye odaklanıyor. Çalışmaları hem soyut hem de figüratif olarak zorlayıcı, yerçekimine meydan okuyan ve "beklenmedik malzemelerin iyi bir sentezi" olarak tanımlanmıştır.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Beton duvara monte edilmiş ve yere inen soluk tel benzeri bir heykel. Hafif görünüyor.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'Taipei Hayvanat Bahçesi, oyun oynayan su aygırlarının yer aldığı bir Su Aygırı Meydanı yaptırdı.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Bir grup bronz su aygırı heykeli sanki yüzüyormuş gibi kaldırımdan çıkıyor.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
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

Bu, state'i modülünüzün en üstünde bildirebileceğiniz normal değişkenlerden farklı kılan şeydir. State belirli bir fonksiyon çağrısına veya koddaki bir yere bağlı değildir, ancak ekrandaki belirli bir yere "yereldir". İki `<Gallery />` bileşeni oluşturdunuz, bu nedenle state'leri ayrı ayrı saklanır.

Ayrıca `Page` bileşeninin `Gallery` state'i hakkında hiçbir şey "bilmediğine" ve hatta herhangi bir state'e sahip olup olmadığına dikkat edin. Prop'ların aksine, **state, onu bildiren bileşene tamamen özeldir.** Üst bileşen onu değiştiremez. Bu, bileşenlerin geri kalanını etkilemeden herhangi bir bileşene state eklemenize veya kaldırmanıza olanak tanır.

Peki ya her iki galerinin de state'lerinin senkronize olmasını istiyorsanız? React'te bunu yapmanın doğru yolu, alt bileşenlerden state'i *kaldırmak* ve en yakın paylaşılan ebeveynlerine eklemektir. Sonraki birkaç sayfa tek bir bileşenin state'ini düzenlemeye odaklanacak, ancak bu konuya [Sharing State Between Components](/learn/sharing-state-between-components) bölümünde geri döneceğiz.

<Recap>

* Bir bileşenin render işlemleri arasında bazı bilgileri "hatırlaması" gerektiğinde bir state değişkeni kullanın.
* State değişkenleri `useState` Hook`u çağrılarak bildirilir.
* Hook'lar `use` ile başlayan özel fonksiyonlardır. State gibi React özelliklerine "bağlanmanızı (hook into)" sağlarlar.
* Hook'lar, size import'ları hatırlatabilir: koşulsuz olarak çağrılmalıdırlar. `useState` de dahil Hook'ları çağırmak, yalnızca bir bileşenin üst seviyesinde veya başka bir Hook'ta geçerlidir.
* `useState` Hook'u bir çift değer döndürür: mevcut state ve onu güncelleyecek fonksiyon.
* Birden fazla state değişkeniniz olabilir. Dahili olarak, React bunları sıralarına göre eşleştirir.
* State bileşene özeldir. Eğer iki yerde render ederseniz, her kopya kendi state'ini oluşturur.

</Recap>



<Challenges>

#### Galeriyi tamamlayın {/*complete-the-gallery*/}

Son heykelde "Sonraki" tuşuna bastığınızda kod çöküyor. Çökmeyi önlemek için mantığı düzeltin. Bunu olay yöneticisine ekstra mantık ekleyerek veya işlem mümkün olmadığında düğmeyi devre dışı bırakarak yapabilirsiniz.

Çökmeyi düzelttikten sonra, bir önceki heykeli gösteren "Önceki" düğmesi ekleyin. İlk heykelde çökmemesi gerekir.

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
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
        <i>{sculpture.name}, </i>
        {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        Detayları {showMore ? 'Gizle' : 'Göster'}
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
  description: "Colvin'in öncelikle pre-Hispanik sembollere gönderme yapan soyut temalarıyla tanınmasına rağmen, nöroşirurjiye bir saygı niteliğindeki bu devasa heykel, en tanınmış halka açık sanat eserlerinden biridir.",
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Parmak uçlarında insan beynini nazikçe tutan iki çapraz ellerden oluşan bronz bir heykel.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: "Buenos Aires'te bulunan bu devasa (75 ft. veya 23 m) gümüş çiçek, akşamları veya güçlü rüzgarlar estiğinde yapraklarını kapatarak ve sabahları açarak hareket etmek üzere tasarlanmıştır.",
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Ayna gibi yansıtıcı yaprakları ve güçlü erkek organları olan devasa bir metal çiçek heykeli.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson, eşitlik, sosyal adalet ve insanlığın temel ve ruhsal nitelikleriyle ilgilenmesiyle tanınıyordu. Bu devasa (7 fit veya 2,13 m) bronz, "evrensel insanlık duygusu ile dolu sembolik bir Siyah varlığı" olarak nitelendirdiği şeyi temsil eder.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'İnsan kafasını tasvir eden heykel her zaman varmış gibi görünüyor ve hüzünlü. Sakinlik ve huzur yayar.'
}, {
  name: 'Moai',
  artist: 'Bilinmeyen Sanatçı',
  description: "Paskalya Adası'nda bulunan, erken Rapa Nui halkı tarafından yaratılmış 1.000 moai veya devasa anıtsal heykelden oluşan bir koleksiyondur ve bazıları tanrılaştırılmış ataları temsil ettiğine inanıyor.",
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Somut ifadeleriyle orantısız büyük başlara sahip üç devasa taş büst.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nanalar muzaffer yaratıklar, kadınlık ve annelik sembolleridir. Saint Phalle, Nanalar için başlangıçta kumaş ve buluntu nesneler kullanmış, daha sonra daha canlı bir etki elde etmek için polyester kullanmıştır.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Neşe saçan renkli kostümüyle dans eden tuhaf bir kadın figürünün büyük bir mozaik heykeli.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: "Bu soyut bronz heykel, Yorkshire Heykel Parkı'nda bulunan The Family of Man serisinin bir parçasıdır. Hepworth, dünyanın birebir temsillerini yaratmak yerine, insanlardan ve manzaralardan esinlenen soyut formlar geliştirmeyi tercih etmiştir.",
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'İnsan figürünü anımsatan, birbiri üzerine yığılmış üç unsurdan oluşan uzun bir heykel.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Dört kuşaktır ahşap oymacılığı yapan Fakeye'nin eserleri geleneksel ve çağdaş Yoruba temalarını harmanlıyor.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Desenlerle bezenmiş bir atın üzerinde odaklanmış bir yüze sahip bir savaşçının karmaşık bir ahşap heykeli.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow, gençliğin ve güzelliğin kırılganlığı ve geçiciliğine bir metafor olarak parçalanmış bedenlerin heykelleriyle tanınır. Bu heykel, birbirine yığılmış iki çok gerçekçi büyük karın kasını tasvir eder, her biri yaklaşık beş ayak (1,5m) yüksekliğindedir.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'Heykel, klasik heykellerdeki göbeklerden oldukça farklı olan kıvrımlardan oluşan bir çağlayanı andırıyor.'
}, {
  name: 'Terracotta Army',
  artist: 'Bilinmeyen Sanatçı',
  description: "Terracotta Ordusu, Çin'in ilk İmparatoru Qin Shi Huang'ın ordularını tasvir eden bir terracotta heykel koleksiyonudur. Ordu 8.000'den fazla asker, 520 atlı 130 savaş arabası ve 150 süvari atından oluşuyordu.",
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: 'Her biri benzersiz bir yüz ifadesine ve zırha sahip, vakur savaşçıların 12 pişmiş toprak heykeli.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: "Nevelson, New York'un enkazından topladığı ve daha sonra anıtsal yapılarda bir araya getireceği nesnelerle tanınıyordu. Bu eserinde yatak direği, hokkabaz iğnesi ve koltuk parçası gibi birbirinden farklı parçaları kullanmış, bunları çivileyip yapıştırarak Kübizm'in geometrik mekân ve biçim soyutlamasının etkisini yansıtan kutular haline getirmiştir.",
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Tek tek unsurların başlangıçta ayırt edilemediği siyah mat bir heykel.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar geleneksel ve modern olanı, doğal ve endüstriyel olanı birleştiriyor. Sanatı insan ve doğa arasındaki ilişkiye odaklanıyor. Çalışmaları hem soyut hem de figüratif olarak zorlayıcı, yerçekimine meydan okuyan ve "beklenmedik malzemelerin iyi bir sentezi" olarak tanımlanmıştır.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Beton duvara monte edilmiş ve yere inen soluk tel benzeri bir heykel. Hafif görünüyor.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'Taipei Hayvanat Bahçesi, oyun oynayan su aygırlarının yer aldığı bir Su Aygırı Meydanı yaptırdı.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Bir grup bronz su aygırı heykeli sanki yüzüyormuş gibi kaldırımdan çıkıyor.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

<Solution>

Bu, her iki olay yöneticisinin içine bir koruma koşulu eklemek ve gerektiğinde düğmeleri devre dışı bırakmak:

<Sandpack>

```js
import { useState } from 'react';
import { sculptureList } from './data.js';

export default function Gallery() {
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  let hasPrev = index > 0;
  let hasNext = index < sculptureList.length - 1;

  function handlePrevClick() {
    if (hasPrev) {
      setIndex(index - 1);
    }
  }

  function handleNextClick() {
    if (hasNext) {
      setIndex(index + 1);
    }
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  return (
    <>
      <button
        onClick={handlePrevClick}
        disabled={!hasPrev}
      >
        Önceki
      </button>
      <button
        onClick={handleNextClick}
        disabled={!hasNext}
      >
        Sonraki
      </button>
       <h2>
        <i>{sculpture.name}, </i>
        {sculpture.artist}
      </h2>
      <h3>  
        ({index + 1} of {sculptureList.length})
      </h3>
      <button onClick={handleMoreClick}>
        Detayları {showMore ? 'Gizle' : 'Göster'}
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

```js src/data.js hidden
export const sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: "Colvin'in öncelikle pre-Hispanik sembollere gönderme yapan soyut temalarıyla tanınmasına rağmen, nöroşirurjiye bir saygı niteliğindeki bu devasa heykel, en tanınmış halka açık sanat eserlerinden biridir.",
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'Parmak uçlarında insan beynini nazikçe tutan iki çapraz ellerden oluşan bronz bir heykel.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: "Buenos Aires'te bulunan bu devasa (75 ft. veya 23 m) gümüş çiçek, akşamları veya güçlü rüzgarlar estiğinde yapraklarını kapatarak ve sabahları açarak hareket etmek üzere tasarlanmıştır.",
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'Ayna gibi yansıtıcı yaprakları ve güçlü erkek organları olan devasa bir metal çiçek heykeli.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson, eşitlik, sosyal adalet ve insanlığın temel ve ruhsal nitelikleriyle ilgilenmesiyle tanınıyordu. Bu devasa (7 fit veya 2,13 m) bronz, "evrensel insanlık duygusu ile dolu sembolik bir Siyah varlığı" olarak nitelendirdiği şeyi temsil eder.',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'İnsan kafasını tasvir eden heykel her zaman varmış gibi görünüyor ve hüzünlü. Sakinlik ve huzur yayar.'
}, {
  name: 'Moai',
  artist: 'Bilinmeyen Sanatçı',
  description: "Paskalya Adası'nda bulunan, erken Rapa Nui halkı tarafından yaratılmış 1.000 moai veya devasa anıtsal heykelden oluşan bir koleksiyondur ve bazıları tanrılaştırılmış ataları temsil ettiğine inanıyor.",
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Somut ifadeleriyle orantısız büyük başlara sahip üç devasa taş büst.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nanalar muzaffer yaratıklar, kadınlık ve annelik sembolleridir. Saint Phalle, Nanalar için başlangıçta kumaş ve buluntu nesneler kullanmış, daha sonra daha canlı bir etki elde etmek için polyester kullanmıştır.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'Neşe saçan renkli kostümüyle dans eden tuhaf bir kadın figürünün büyük bir mozaik heykeli.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: "Bu soyut bronz heykel, Yorkshire Heykel Parkı'nda bulunan The Family of Man serisinin bir parçasıdır. Hepworth, dünyanın birebir temsillerini yaratmak yerine, insanlardan ve manzaralardan esinlenen soyut formlar geliştirmeyi tercih etmiştir.",
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'İnsan figürünü anımsatan, birbiri üzerine yığılmış üç unsurdan oluşan uzun bir heykel.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Dört kuşaktır ahşap oymacılığı yapan Fakeye'nin eserleri geleneksel ve çağdaş Yoruba temalarını harmanlıyor.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'Desenlerle bezenmiş bir atın üzerinde odaklanmış bir yüze sahip bir savaşçının karmaşık bir ahşap heykeli.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow, gençliğin ve güzelliğin kırılganlığı ve geçiciliğine bir metafor olarak parçalanmış bedenlerin heykelleriyle tanınır. Bu heykel, birbirine yığılmış iki çok gerçekçi büyük karın kasını tasvir eder, her biri yaklaşık beş ayak (1,5m) yüksekliğindedir.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'Heykel, klasik heykellerdeki göbeklerden oldukça farklı olan kıvrımlardan oluşan bir çağlayanı andırıyor.'
}, {
  name: 'Terracotta Army',
  artist: 'Bilinmeyen Sanatçı',
  description: "Terracotta Ordusu, Çin'in ilk İmparatoru Qin Shi Huang'ın ordularını tasvir eden bir terracotta heykel koleksiyonudur. Ordu 8.000'den fazla asker, 520 atlı 130 savaş arabası ve 150 süvari atından oluşuyordu.",
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: 'Her biri benzersiz bir yüz ifadesine ve zırha sahip, vakur savaşçıların 12 pişmiş toprak heykeli.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: "Nevelson, New York'un enkazından topladığı ve daha sonra anıtsal yapılarda bir araya getireceği nesnelerle tanınıyordu. Bu eserinde yatak direği, hokkabaz iğnesi ve koltuk parçası gibi birbirinden farklı parçaları kullanmış, bunları çivileyip yapıştırarak Kübizm'in geometrik mekân ve biçim soyutlamasının etkisini yansıtan kutular haline getirmiştir.",
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'Tek tek unsurların başlangıçta ayırt edilemediği siyah mat bir heykel.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar geleneksel ve modern olanı, doğal ve endüstriyel olanı birleştiriyor. Sanatı insan ve doğa arasındaki ilişkiye odaklanıyor. Çalışmaları hem soyut hem de figüratif olarak zorlayıcı, yerçekimine meydan okuyan ve "beklenmedik malzemelerin iyi bir sentezi" olarak tanımlanmıştır.',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'Beton duvara monte edilmiş ve yere inen soluk tel benzeri bir heykel. Hafif görünüyor.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'Taipei Hayvanat Bahçesi, oyun oynayan su aygırlarının yer aldığı bir Su Aygırı Meydanı yaptırdı.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'Bir grup bronz su aygırı heykeli sanki yüzüyormuş gibi kaldırımdan çıkıyor.'
}];
```

```css
button { display: block; margin-bottom: 10px; }
.Page > * {
  float: left;
  width: 50%;
  padding: 10px;
}
h2 { margin-top: 10px; margin-bottom: 0; }
h3 {
  margin-top: 5px;
  font-weight: normal;
  font-size: 100%;
}
img { width: 120px; height: 120px; }
```

</Sandpack>

`hasPrev` ve `hasNext`'in *hem* döndürülen JSX için *hem* de olay yöneticilerinin içinde nasıl kullanıldığına dikkat edin! Bu kullanışlı model işe yaramaktadır çünkü olay yöneticisi fonksiyonları ["close over"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) render sırasında bildirilen tüm değişkenleri kapatmaktadır.

</Solution>

#### Sıkışmış form girdilerini düzeltin {/*fix-stuck-form-inputs*/}

Girdi alanlarına yazdığınızda hiçbir şey görünmüyor. İlk `<input>`'un `value` değeri her zaman `firstName` değişkeniyle eşleştirilir ve ikinci `<input>`'un `value` değeri her zaman `lastName` değişkeniyle eşleştirilir. Bu doğrudur. Her iki girdi de onChange olay yöneticilerine sahiptir, bu olay yöneticileri, son kullanıcı girişi (`e.target.value`) temelinde değişkenleri güncellemeye çalışır. Ancak, değişkenler yeniden renderlanırken değerlerini "hatırlamıyor" gibi görünüyorlar. Bunun yerine state değişkenlerini kullanarak bunu düzeltin.

<Sandpack>

```js
export default function Form() {
  let firstName = '';
  let lastName = '';

  function handleFirstNameChange(e) {
    firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    lastName = e.target.value;
  }

  function handleReset() {
    firstName = '';
    lastName = '';
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="İsim"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Soyisim"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Merhaba, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Sıfırla</button>
    </form>
  );
}
```

```css 
h1 { margin-top: 10px; }
```

</Sandpack>

<Solution>

İlk olarak React'ten `useState` öğesini içe aktarın. Ardından `firstName` ve `lastName` yerine `useState` çağrısı ile bildirilen state değişkenlerini yerleştirin. Son olarak, her `firstName = ...` atamasını `setFirstName(...)` ile değiştirin ve aynısını `lastName` için de yapın. Sıfırlama düğmesinin çalışması için `handleReset`i de güncellemeyi unutmayın.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  function handleReset() {
    setFirstName('');
    setLastName('');
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="İsim"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Soyisim"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Merhaba, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Sıfırla</button>
    </form>
  );
}
```

```css 
h1 { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Bir çökmeyi düzeltin {/*fix-a-crash*/}

Burada kullanıcının geri bildirim bırakmasına izin vermesi amaçlanan küçük bir form bulunmaktadır. Geri bildirim gönderildiğinde, bir teşekkür mesajının görüntülenmesi gerekiyordu. Ancak, "Rendered fewer hooks than expected." (Beklenenden daha az hook render edildi.) şeklinde bir hata mesajı ile çöküyor. Hatanın nedenini bulabilir ve düzeltebilir misiniz?

<Hint>

Hook'ların _nerede_ çağrılabileceği konusunda herhangi bir sınırlama var mı? Bu bileşen herhangi bir kuralı ihlal ediyor mu? Linter kontrollerini devre dışı bırakan herhangi bir yorum olup olmadığını kontrol edin hataların genellikle saklandığı yer burasıdır!

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  if (isSent) {
    return <h1>Teşekkürler!</h1>;
  } else {
    // eslint-disable-next-line
    const [message, setMessage] = useState('');
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Mesaj"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Gönder</button>
      </form>
    );
  }
}
```

</Sandpack>

<Solution>

Hook'lar yalnızca bileşen fonksiyonunun en üst seviyesinde çağrılabilir. Burada, ilk `isSent` tanımı bu kurala uymaktadır, ancak `message` tanımı bir koşulun içine yerleştirilmiştir.

Sorunu çözmek için bunu koşulun dışına taşıyın:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>Teşekkürler!</h1>;
  } else {
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Mesaj"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Gönder</button>
      </form>
    );
  }
}
```

</Sandpack>

Unutmayın, Hook'lar koşulsuz olarak ve her zaman aynı sırada çağrılmalıdır!

İç içe geçmeyi azaltmak için gereksiz `else` dalını da kaldırabilirsiniz. Ancak, Hook'lara yapılan tüm çağrıların ilk `return'den *önce* gerçekleşmesi hala önemlidir.

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  const [message, setMessage] = useState('');

  if (isSent) {
    return <h1>Teşekkürler!</h1>;
  }

  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert(`Sending: "${message}"`);
      setIsSent(true);
    }}>
      <textarea
        placeholder="Mesaj"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <br />
      <button type="submit">Gönder</button>
    </form>
  );
}
```

</Sandpack>

İkinci `useState` çağrısını `if` koşulundan sonra taşımayı deneyin ve bunun nasıl tekrar bozulduğuna dikkat edin.

Eğer linter'ınız [React için yapılandırılmışsa](/learn/editor-setup#linting), böyle bir hata yaptığınızda bir lint hatası görmelisiniz. Hatalı kodu yerel olarak denediğinizde bir hata görmüyorsanız, projeniz için linting'i ayarlamanız gerekir.

</Solution>

#### Gereksiz state'i kaldırın {/*remove-unnecessary-state*/}

Bu örnekte düğme tıklandığında kullanıcının adını istemesi ve ardından onları selamlayan bir uyarı görüntülemesi gerekiyordu. İsim bilgisini tutmak için state kullanmaya çalıştınız, ancak her zaman "Merhaba, !" şeklinde görüntüleniyor.

Bu kodu düzeltmek için gereksiz state değişkenini kaldırın. ([Bunun neden işe yaramadığını](/learn/state-as-a-snapshot) daha sonra tartışacağız.)

Bu state değişkeninin neden gereksiz olduğunu açıklayabilir misiniz?

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [name, setName] = useState('');

  function handleClick() {
    setName(prompt('İsminiz nedir?'));
    alert(`Merhaba, ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      Selamla
    </button>
  );
}
```

</Sandpack>

<Solution>

Burada, ihtiyaç duyulan fonksiyonda deklare edilen normal bir `name` değişkenini kullanan düzeltilmiş bir versiyon bulunmaktadır:

<Sandpack>

```js
export default function FeedbackForm() {
  function handleClick() {
    const name = prompt('İsminiz nedir?');
    alert(`Merhaba, ${name}!`);
  }

  return (
    <button onClick={handleClick}>
      Selamla
    </button>
  );
}
```

</Sandpack>

Bir state değişkeni, bir bileşenin yeniden render edilmesi arasında bilgiyi korumak için gereklidir. Tek bir olay yöneticisi içinde, normal bir değişken de gayet çalışacaktır. Bu yüzden normal bir değişkenin iyi çalıştığı durumlarda state değişkenlerini kullanmayın.

</Solution>

</Challenges>
