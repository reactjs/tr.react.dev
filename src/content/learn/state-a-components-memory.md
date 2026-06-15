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

```js {expectedErrors: {'react-compiler': [7]}}
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
        <i>{sculpture.name} </i>
        by {sculpture.artist}
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
  description: 'Colvin ağırlıklı olarak Hispanik öncesi sembollere gönderme yapan soyut temalarıyla bilinse de, nöroşirürjiye bir saygı duruşu olan bu devasa heykel, onun en tanınan kamusal sanat eserlerinden biridir.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'İki çapraz elin, parmak uçlarında insan beynini nazikçe tuttuğu bronz bir heykel.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'Bu devasa (75 ft. veya 23 m) gümüş çiçek Buenos Aires’te yer alır. Akşamları veya güçlü rüzgarlar estiğinde taç yapraklarını kapatacak, sabahları ise açacak şekilde tasarlanmıştır.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'Yansıtıcı, ayna benzeri taç yaprakları ve güçlü erkek organları olan devasa metalik bir çiçek heykeli.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson; eşitlik, sosyal adalet ve insanlığın temel ve ruhani nitelikleriyle ilgilenmesiyle biliniyordu. Bu büyük (7 ft. veya 2,13 m) bronz eser, onun "evrensel insanlık duygusuyla harmanlanmış sembolik bir Siyah varlık" olarak tanımladığı şeyi temsil eder.',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'Bir insan başını tasvir eden heykel, her zaman var olan ve ağırbaşlı bir izlenim verir. Sakinlik ve huzur yayar.'
}, {
  name: 'Moai',
  artist: 'Bilinmeyen Sanatçı',
  description: 'Paskalya Adası’nda bulunan, erken dönem Rapa Nui halkı tarafından oluşturulmuş 1.000 adet moai veya günümüze ulaşmış anıtsal heykel vardır. Bazılarına göre bunlar tanrılaştırılmış ataları temsil ediyordu.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Orantısız derecede büyük başlara ve ciddi yüz ifadelerine sahip üç anıtsal taş büst.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'Nana’lar, kadınlık ve anneliğin sembolleri olan zafer kazanmış varlıklardır. Başlangıçta Saint Phalle, Nana’lar için kumaş ve buluntu nesneler kullandı; daha sonra daha canlı bir etki elde etmek için polyesteri dahil etti.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'Renkli bir kostüm içinde neşe saçan, oyunbaz şekilde dans eden büyük bir kadın figürünün mozaik heykeli.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'Bu soyut bronz heykel, Yorkshire Sculpture Park’ta yer alan The Family of Man serisinin bir parçasıdır. Hepworth, dünyanın birebir temsillerini oluşturmak yerine insanlardan ve manzaralardan ilham alan soyut formlar geliştirmeyi seçti.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'Üst üste yerleştirilmiş üç öğeden oluşan ve bir insan figürünü hatırlatan uzun bir heykel.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Dört kuşak ahşap oymacısının soyundan gelen Fakeye’nin çalışmaları, geleneksel ve çağdaş Yoruba temalarını harmanladı.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'Desenlerle süslenmiş bir atın üzerinde, odaklanmış yüz ifadeli bir savaşçıyı tasvir eden ayrıntılı bir ahşap heykel.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow, parçalanmış beden heykellerini gençliğin ve güzelliğin kırılganlığı ile geçiciliğine dair bir metafor olarak kullanmasıyla bilinir. Bu heykel, üst üste yerleştirilmiş iki oldukça gerçekçi büyük göbeği tasvir eder; her biri yaklaşık beş fit (1,5 m) uzunluğundadır.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'Heykel, klasik heykellerdeki göbeklerden oldukça farklı olan bir kıvrım şelalesini andırır.'
}, {
  name: 'Terracotta Army',
  artist: 'Bilinmeyen Sanatçı',
  description: 'Terracotta Army, Çin’in ilk İmparatoru Qin Shi Huang’ın ordularını tasvir eden pişmiş toprak heykellerden oluşan bir koleksiyondur. Ordu; 8.000’den fazla asker, 520 atlı 130 savaş arabası ve 150 süvari atından oluşuyordu.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: 'Her biri kendine özgü yüz ifadesine ve zırha sahip, ciddi görünümlü savaşçılardan oluşan 12 pişmiş toprak heykel.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson, New York City enkazından nesneler toplaması ve bunları daha sonra anıtsal yapılara dönüştürmesiyle biliniyordu. Bu eserde; yatak direği, jonglör labutu ve koltuk parçası gibi birbirinden farklı parçaları kullandı, bunları kutuların içine çivileyip yapıştırarak Kübizmin mekan ve form üzerindeki geometrik soyutlama etkisini yansıttı.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'Tek tek öğelerin ilk bakışta ayırt edilemediği siyah mat bir heykel.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar geleneksel ile moderni, doğal olan ile endüstriyel olanı birleştirir. Sanatı, insan ve doğa arasındaki ilişkiye odaklanır. Eserleri hem soyut hem figüratif açıdan etkileyici, yer çekimine meydan okuyan ve "beklenmedik malzemelerin ince bir sentezi" olarak tanımlanmıştır.',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'Beton duvara monte edilmiş ve zemine doğru inen, soluk renkli tel benzeri bir heykel. Hafif görünür.'
}, {
  name: 'Hippos',
  artist: 'Taipei Hayvanat Bahçesi',
  description: 'Taipei Hayvanat Bahçesi, oyun oynayan suya batmış hipopotamları içeren bir Hippo Square yaptırdı.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'Sanki yüzüyormuş gibi kaldırımdan çıkan bir grup bronz hipopotam heykeli.'
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
        <i>{sculpture.name} </i>
        by {sculpture.artist}
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
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
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

`useState`’e verilen tek argument, state variable’ınızın **initial value**’sudur. Bu örnekte, `index`’in initial value’su `useState(0)` ile `0` olarak set edilir.

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
        <i>{sculpture.name} </i>
        by {sculpture.artist}
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
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
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
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
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
        <i>{sculpture.name} </i>
        by {sculpture.artist}
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
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
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
        <i>{sculpture.name} </i>
        by {sculpture.artist}
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
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
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
        <i>{sculpture.name} </i>
        by {sculpture.artist}
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
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://react.dev/images/docs/scientists/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://react.dev/images/docs/scientists/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://react.dev/images/docs/scientists/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://react.dev/images/docs/scientists/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://react.dev/images/docs/scientists/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://react.dev/images/docs/scientists/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://react.dev/images/docs/scientists/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://react.dev/images/docs/scientists/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://react.dev/images/docs/scientists/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://react.dev/images/docs/scientists/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://react.dev/images/docs/scientists/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://react.dev/images/docs/scientists/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
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

```js {expectedErrors: {'react-compiler': [6]}}
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

```js {expectedErrors: {'react-compiler': [9]}}
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

Linter’ınız [React için yapılandırılmışsa](/learn/editor-setup#linting), böyle bir hata yaptığınızda bir lint error görmelisiniz. Faulty code’u local’de denediğinizde bir error görmüyorsanız, projeniz için linting setup etmeniz gerekir.

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
