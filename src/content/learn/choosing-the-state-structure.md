---
title: State Yapısını Seçme
---

<Intro>

Bir bileşenin state'ini iyi yapılandırmak, değişiklik yapılması ve hata ayıklaması kolay bir bileşen ile sürekli hatalara sebep olan bir bileşen arasındaki farkı yaratabilir. Bu sayfada state'i yapılandırırken göz önünde bulundurmanız gereken ipuçlarını bulabilirsiniz.

</Intro>

<YouWillLearn>

* Ne zaman tek veya birden çok state değişkeni kullanmalısınız
* State'i düzenlerken nelerden kaçınılmalıdır
* State yapısındaki yaygın sorunlar nasıl giderilir

</YouWillLearn>

## State'i yapılandırmanın prensipleri {/*principles-for-structuring-state*/}

İçinde state barındıran bir bileşen yazdığınızda, bu bileşende kaç tane state değişkeni olması gerektiği veya bu değişkenlerin verilerini nasıl şekillendirmeniz gerektiği hakkında kararlar vermeniz gerekecektir. Optimalden uzak state yapısıyla dahi doğru şekilde çalışan programlar yazabilmeniz mümkün olsa da, sizi daha iyi kararlar vermeye yönlendirecek bazı prensipler aşağıdaki gibidir:

1. **Bağlantılı state değişkenlerini gruplayın.** Eğer birden fazla state değişkenini hep aynı anda güncelliyorsanız, bu değişkenleri tek bir state değişkeninde birleştirmeyi değerlendirin.
2. **State çelişkilerinden kaçının.** Eğer bir bileşenin state değişkenleri birbiriyle çelişecek ya da uyuşmayacak şekilde tasarlanırsa hatalara açık kapı bırakmış olursunuz. Bu durumdan kaçının.
3. **Gereksiz state oluşturmaktan kaçının.** Eğer bileşeni render ederken, bileşenin prop'larından ya da varolan state değişkenlerinden ihtiyacınız olan bilgiyi hesaplayabiliyorsanız bu bilgiyi bileşenin state'inde tutmamalısınız.
4. **Yinelenen state değişkenlerinden kaçının.** Aynı veri, farklı state değişkenleri ya da iç içe nesneler içinde yinelendiğinde senkronizasyonu sağlamak zorlaşabilir. Buna benzer tekrarları en aza indirgemeye çalışın.
5. **Derinlemesine iç içe olan bir state yapısından kaçının.** Derinlemesine hiyerarşik yapıya sahip olan state'i güncellemek çok da pratik bir değildir. State'i daha düz bir yapıda şekillendirmeye çalışın.

Bu prensiplerin asıl amacı, *state'i hatalara sebep olmadan kolayca güncelleyebilmektir*. State'ten gereksiz ve yinelenen veriyi temizlemek tüm parçaların birbiriyle senkronize kalmasına yardımcı olur. Bu durum, bir veritabanı mühendisinin hata ihtimalini azaltmak için [veritabanı yapısını "normalleştirmek"](https://learn.microsoft.com/tr-tr/office/troubleshoot/access/database-normalization-description) istemesine benzetilebilir. Albert Einstein'ın sözleriyle yorumlamak gerekirse, **"State mümkün olabildiğince basit olmalı, sadece basit değil."**

Haydi şimdi bu prensiplerin nasıl uygulandığını görelim.

## Bağlantılı state değişkenlerini gruplayın {/*group-related-state*/}

Bazen tek bir state değişkeni mi yoksa birden fazla state değişkeni mi kullanmanız gerektiği hakkında emin olmayabilirsiniz.

Bu şekilde mi yapmalısınız?

```js
const [x, setX] = useState(0);
const [y, setY] = useState(0);
```

Yoksa bu şekilde mi?

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```

Teknik olarak ikisini de kullanabilirsiniz. Fakat **iki farklı state değişkeni hep aynı anda değişiyorsa bunları tek bir state değişkeninde birleştirmek iyi bir fikir olabilir.** Böylece, imleci oynatmanın her iki koordinatı da tek seferde güncellediği örnekte olduğu gibi onları sürekli senkronize tutmayı unutmazsınız:

<Sandpack>

```js
import { useState } from 'react';

export default function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Veriyi bir nesnede ya da dizide gruplayacağınız diğer bir örnek ise kaç farklı state parçasına ihtiyacınız olacağını bilemediğiniz durumlardır. Örneğin, kullanıcının özel alanlar ekleyebildiği bir form oluşturmanız gerektiğinde bu prensip size yardımcı olacaktır.

<Pitfall>

Eğer state değişkeniniz bir nesne ise diğer tüm alanları açıkça kopyalamadan [tek bir alanı kopyalayamayacağınızı](/learn/updating-objects-in-state) unutmayın. Örneğin, yukarıdaki örnekte `setPosition({ x: 100 })` şeklinde güncelleyemezsiniz çünkü bu durumda state değişkeni `y` özelliğini hiç içermemiş olur! Bunun yerine, sadece `x`'i değiştirmek istediğinizde ya `setPosition({ ...position, x: 100 })` şeklinde ya da bunları iki farklı state değişkenine bölüp `setX(100)` şeklinde değiştirmelisiniz.

</Pitfall>

## State çelişkilerinden kaçının {/*avoid-contradictions-in-state*/}

İşte `isSending` ve `isSent` state değişkenlerine sahip olan bir otel geri bildirim formu:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSending(true);
    await sendMessage(text);
    setIsSending(false);
    setIsSent(true);
  }

  if (isSent) {
    return <h1>Thanks for feedback!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Mesajı gönderiyormuş gibi yap.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

Bu kod her ne kadar çalışıyor olsa da "imkansız" state'lere açık kapı bırakıyor. Örneğin, `setIsSent` ve `setIsSending`'i birlikte çağırmayı unutursanız, `isSending` ve `isSent` değişkenlerinin aynı anda `true` olduğu bir durumla karşı karşıya kalabilirsiniz. Bileşeniniz ne kadar karmaşık olursa neler olduğunu anlamanız da aynı oranda zorlaşacaktır.

**`isSending` ve `isSent` değişkenlerinin hiçbir zaman aynı anda `true` olmaması gerektiğinden bunları** `'typing'` (başlangıç değeri), `'sending'` ve `'sent'` **durumlarından birini alabilen `status` adında tek bir state değişkenine dönüştürmek daha iyi olur**:

<Sandpack>

```js
import { useState } from 'react';

export default function FeedbackForm() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    await sendMessage(text);
    setStatus('sent');
  }

  const isSending = status === 'sending';
  const isSent = status === 'sent';

  if (isSent) {
    return <h1>Thanks for feedback!</h1>
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>How was your stay at The Prancing Pony?</p>
      <textarea
        disabled={isSending}
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button
        disabled={isSending}
        type="submit"
      >
        Send
      </button>
      {isSending && <p>Sending...</p>}
    </form>
  );
}

// Mesajı gönderiyormuş gibi yap.
function sendMessage(text) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}
```

</Sandpack>

Okunabilirlik için hala sabit değişkenler oluşturabilirsiniz.

```js
const isSending = status === 'sending';
const isSent = status === 'sent';
```

Fakat onlar state değişkenleri olmadığı için birbirleriyle senkronize kalıp kalmamaları hakkında endişelenmenize gerek yok.

## Gereksiz state oluşturmaktan kaçının {/*avoid-redundant-state*/}

Eğer bileşeni render ederken bileşenin prop'larından ya da varolan state değişkenlerinden ihtiyacınız olan bilgiyi hesaplayabiliyorsanız bu bilgiyi bileşenin state'inde **tutmamalısınız**.

Örneğin bu formu ele alın. Bu form çalışıyor fakat içinde gereksiz bir state bulabilir misiniz?

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Bu form üç state değişkeni içeriyor: `firstName`, `lastName` ve `fullName`. Fakat `fullName` gereksiz bir state değişkeni. **`fullName` değişkeninin değerini her zaman `firstName` ve `lastName` değişkenlerinin değerlerini kullanarak render esnasında hesaplayabilirsiniz, bu yüzden state'ten kaldırmalısınız.**

Bu işlemi şu şekilde yapabilirsiniz:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Burada `fullName` bir state değişkeni *değil*. Bunun yerine bileşen render edilirken hesaplanıyor:

```js
const fullName = firstName + ' ' + lastName;
```

Sonuç olarak, değişiklik yöneticilerinin bu değeri güncellemek için özel bir şey yapmasına gerek kalmıyor. `setFirstName` ve `setLastName` fonksiyonlarını çağırdığınızda bileşenin tekrar render edilmesini tetiklemiş olursunuz, sonrasında da `fullName` değişkeninin yeni değeri güncel veri kullanılarak hesaplanacaktır.

<DeepDive>

#### Prop'ları state'e yansıtmayın {/*don-t-mirror-props-in-state*/}

Gereksiz state'in yaygın bir örneği aşağıdaki gibidir:

```js
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
```

Bu örnekte `color`, `messageColor` prop'u ile başlangıç değeri tanımlanan bir state değişkeni. Sorun şu ki **üst bileşen daha sonra farklı bir `messageColor` değeri (örneğin, `'blue'` yerine `'red'`) gönderdiğinde `color` *state değişkeni* güncellenmeyecek!** Çünkü state yalnızca ilk render esnasında başlangıç değerini alır.

Bu sebeple bir prop'u state değişkenine "yansıtmak" kafa karışıklığına sebep olabilir. Bunun yerine, `messageColor` prop'unu direkt olarak kod içinde kullanın. Eğer daha kısa bir isim vermek istiyorsanız sabit değişken kullanın:

```js
function Message({ messageColor }) {
  const color = messageColor;
```

Böylece üst bileşenden gönderilen prop ile senkronizasyon sorunu oluşmayacaktır.

Prop'ları state'e "yansıtmak", yalnızca belirli bir prop'a ait tüm güncellemeleri *yok saymak* istediğinizde mantıklı bir kullanımdır. Bu durumda, genel kabul olarak, gönderilecek yeni değerlerin yok sayıldığını belirtmek için prop adını `initial` veya `default` ön ekiyle başlatın:

```js
function Message({ initialColor }) {
  // `color` state değişkeni `initialColor`'ın *ilk* değerini tutar.
  // `initialColor`'a ait sonraki tüm değişiklikler yok sayılır.
  const [color, setColor] = useState(initialColor);
```

</DeepDive>

## Yinelenen state değişkenlerinden kaçının {/*avoid-duplication-in-state*/}

Aşağıdaki menü listesi bileşeni birden fazla atıştırmalık içinden birini seçmenizi sağlar:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.title}
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

Mevcut durumda, seçilen öğe `selectedItem` state değişkeninde nesne olarak saklanır. Ancak bu durum pek de iyi değil çünkü **`selectedItem`'ın içeriği `items` listesinde tutulan nesne ile aynı.** Bu durum, öğe hakkındaki bilginin iki farklı yerde yinelenerek tutulduğu anlamına gelir.

Peki bu neden bir sorun? Haydi her öğeyi düzenlenebilir yapalım:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>What's your travel snack?</h2> 
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

Dikkat ederseniz önce bir öğeye ait "Choose" butonuna tıklar ve sonrasında o öğeyi düzenlerseniz **girdi güncellenecektir fakat aşağıdaki öğe adı yapılan değişikliği yansıtmayacaktır.** Bu yinelenen bir state'e sahip olmanızdan kaynaklanır ve `selectedItem`'ı güncellemeyi unuttuğunuz anlamına gelir.

`selectedItem`'ı güncelleyebilecek olsanız dahi, daha basit bir çözüm yinelemeyi ortadan kaldırmaktır. Bu örnekte `selectedItem` nesnesi (`items` içindeki nesnelerle yineleme durumunu yaratan nesne) yerine state'te `selectedId` değerini tutup sonrasında `items` dizisinde bu ID'ye sahip olan `selectedItem`'ı bulabilirsiniz:

<Sandpack>

```js
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```

```css
button { margin-top: 10px; }
```

</Sandpack>

(Alternatif olarak seçilen indeksi state'te tutabilirsiniz.)

State aşağıdaki gibi yineleniyordu:

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedItem = {id: 0, title: 'pretzels'}`

Fakat değişiklik sonrasında aşağıdaki gibi oldu:

* `items = [{ id: 0, title: 'pretzels'}, ...]`
* `selectedId = 0`

Yineleme durumu ortadan kalktı ve yalnızca gerekli olan state'i tutuyorsunuz!

Artık *seçili* öğeyi düzenlediğinizde altındaki mesaj anında güncellenecektir. Bunun sebebi `setItems`'ın bileşenin tekrar render edilmesine sebep olması ve `items.find(...)`'ın başlığı güncellenen öğeyi bulmasıdır. Yani *seçili öğeyi* tutmanıza gerek yoktur çünkü sadece *seçili ID* gereklidir. Geri kalan bilgi render esnasında hesaplanabilir.

## Derinlemesine iç içe olan bir state yapısından kaçının {/*avoid-deeply-nested-state*/}

Gezegenleri, kıtaları ve ülkeleri içeren bir seyahat planı hayal edin. Bu durumda state yapısını, iç içe nesne ve dizilerden oluşacak şekilde tasarlamak sizi cezbedebilir:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ place }) {
  const childPlaces = place.childPlaces;
  return (
    <li>
      {place.title}
      {childPlaces.length > 0 && (
        <ol>
          {childPlaces.map(place => (
            <PlaceTree key={place.id} place={place} />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const planets = plan.childPlaces;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planets.map(place => (
          <PlaceTree key={place.id} place={place} />
        ))}
      </ol>
    </>
  );
}
```

```js places.js active
export const initialTravelPlan = {
  id: 0,
  title: '(Root)',
  childPlaces: [{
    id: 1,
    title: 'Earth',
    childPlaces: [{
      id: 2,
      title: 'Africa',
      childPlaces: [{
        id: 3,
        title: 'Botswana',
        childPlaces: []
      }, {
        id: 4,
        title: 'Egypt',
        childPlaces: []
      }, {
        id: 5,
        title: 'Kenya',
        childPlaces: []
      }, {
        id: 6,
        title: 'Madagascar',
        childPlaces: []
      }, {
        id: 7,
        title: 'Morocco',
        childPlaces: []
      }, {
        id: 8,
        title: 'Nigeria',
        childPlaces: []
      }, {
        id: 9,
        title: 'South Africa',
        childPlaces: []
      }]
    }, {
      id: 10,
      title: 'Americas',
      childPlaces: [{
        id: 11,
        title: 'Argentina',
        childPlaces: []
      }, {
        id: 12,
        title: 'Brazil',
        childPlaces: []
      }, {
        id: 13,
        title: 'Barbados',
        childPlaces: []
      }, {
        id: 14,
        title: 'Canada',
        childPlaces: []
      }, {
        id: 15,
        title: 'Jamaica',
        childPlaces: []
      }, {
        id: 16,
        title: 'Mexico',
        childPlaces: []
      }, {
        id: 17,
        title: 'Trinidad and Tobago',
        childPlaces: []
      }, {
        id: 18,
        title: 'Venezuela',
        childPlaces: []
      }]
    }, {
      id: 19,
      title: 'Asia',
      childPlaces: [{
        id: 20,
        title: 'China',
        childPlaces: []
      }, {
        id: 21,
        title: 'Hong Kong',
        childPlaces: []
      }, {
        id: 22,
        title: 'India',
        childPlaces: []
      }, {
        id: 23,
        title: 'Singapore',
        childPlaces: []
      }, {
        id: 24,
        title: 'South Korea',
        childPlaces: []
      }, {
        id: 25,
        title: 'Thailand',
        childPlaces: []
      }, {
        id: 26,
        title: 'Vietnam',
        childPlaces: []
      }]
    }, {
      id: 27,
      title: 'Europe',
      childPlaces: [{
        id: 28,
        title: 'Croatia',
        childPlaces: [],
      }, {
        id: 29,
        title: 'France',
        childPlaces: [],
      }, {
        id: 30,
        title: 'Germany',
        childPlaces: [],
      }, {
        id: 31,
        title: 'Italy',
        childPlaces: [],
      }, {
        id: 32,
        title: 'Portugal',
        childPlaces: [],
      }, {
        id: 33,
        title: 'Spain',
        childPlaces: [],
      }, {
        id: 34,
        title: 'Turkey',
        childPlaces: [],
      }]
    }, {
      id: 35,
      title: 'Oceania',
      childPlaces: [{
        id: 36,
        title: 'Australia',
        childPlaces: [],
      }, {
        id: 37,
        title: 'Bora Bora (French Polynesia)',
        childPlaces: [],
      }, {
        id: 38,
        title: 'Easter Island (Chile)',
        childPlaces: [],
      }, {
        id: 39,
        title: 'Fiji',
        childPlaces: [],
      }, {
        id: 40,
        title: 'Hawaii (the USA)',
        childPlaces: [],
      }, {
        id: 41,
        title: 'New Zealand',
        childPlaces: [],
      }, {
        id: 42,
        title: 'Vanuatu',
        childPlaces: [],
      }]
    }]
  }, {
    id: 43,
    title: 'Moon',
    childPlaces: [{
      id: 44,
      title: 'Rheita',
      childPlaces: []
    }, {
      id: 45,
      title: 'Piccolomini',
      childPlaces: []
    }, {
      id: 46,
      title: 'Tycho',
      childPlaces: []
    }]
  }, {
    id: 47,
    title: 'Mars',
    childPlaces: [{
      id: 48,
      title: 'Corn Town',
      childPlaces: []
    }, {
      id: 49,
      title: 'Green Hill',
      childPlaces: []      
    }]
  }]
};
```

</Sandpack>

Hali hazırda ziyaret ettiğiniz bir lokasyonu silmeye yarayan bir buton eklemek istediğinizi varsayalım. Nasıl yapardınız? [İç içe yapılandırılmış state'i güncellemek](/learn/updating-objects-in-state#updating-a-nested-object) için değiştiği yere kadar olan tüm nesnelerin kopyalarını yaratmak gerekir. Derinlemesine iç içe geçmiş bir lokasyonu silmek için ise tüm üst lokasyon zincirini kopyalamak gerekir. Böyle bir kod gereğinden daha uzun olabilir.

**Eğer state güncellemek için gereğinden daha fazla iç içe geçmiş bir halde ise onu daha düz bir yapıya getirmeyi değerlendirin.** İşte bu veriyi yeniden yapılandırmanız için bir yol. Eğer her `place` (lokasyon) *alt lokasyonları* için ağaç yapısında bir diziye sahipse her `place`'in (lokasyonun) *alt lokasyonlarının IDlerini* tuttuğu bir diziye sahip olmasını sağlayabilirsiniz. Sonrasında da her bir lokasyon ID'sine karşılık gelen lokasyonun eşlemesini tutabilirsiniz.

Veriyi aşağıdaki gibi yeniden yapılandırmak size bir veritabanı tablosunu hatırlatabilir:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

function PlaceTree({ id, placesById }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      {childIds.length > 0 && (
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              placesById={placesById}
            />
          ))}
        </ol>
      )}
    </li>
  );
}

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);
  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            placesById={plan}
          />
        ))}
      </ol>
    </>
  );
}
```

```js places.js active
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 43, 47],
  },
  1: {
    id: 1,
    title: 'Earth',
    childIds: [2, 10, 19, 27, 35]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'South Africa',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Americas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
    childIds: [20, 21, 22, 23, 24, 25, 26],   
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Hong Kong',
    childIds: []
  },
  22: {
    id: 22,
    title: 'India',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Singapore',
    childIds: []
  },
  24: {
    id: 24,
    title: 'South Korea',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Thailand',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Vietnam',
    childIds: []
  },
  27: {
    id: 27,
    title: 'Europe',
    childIds: [28, 29, 30, 31, 32, 33, 34],   
  },
  28: {
    id: 28,
    title: 'Croatia',
    childIds: []
  },
  29: {
    id: 29,
    title: 'France',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Germany',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Italy',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Portugal',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Spain',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Turkey',
    childIds: []
  },
  35: {
    id: 35,
    title: 'Oceania',
    childIds: [36, 37, 38, 39, 40, 41, 42],   
  },
  36: {
    id: 36,
    title: 'Australia',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Fiji',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  41: {
    id: 41,
    title: 'New Zealand',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Vanuatu',
    childIds: []
  },
  43: {
    id: 43,
    title: 'Moon',
    childIds: [44, 45, 46]
  },
  44: {
    id: 44,
    title: 'Rheita',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Piccolomini',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Tycho',
    childIds: []
  },
  47: {
    id: 47,
    title: 'Mars',
    childIds: [48, 49]
  },
  48: {
    id: 48,
    title: 'Corn Town',
    childIds: []
  },
  49: {
    id: 49,
    title: 'Green Hill',
    childIds: []
  }
};
```

</Sandpack>

**Artık state "düz" ("normalleştirilmiş" olarak da bilinir), iç içe öğeleri güncellemek daha kolay.**

Artık bir lokasyonu kaldırmak için state'in yalnızca iki seviyesini güncellemeniz gerekiyor.

- *Üst* lokasyonunun güncellenmiş sürümü kaldırılan ID'yi `childIds` dizisinden çıkarmalı.
- Kök "tablo" nesnesinin güncellenmiş sürümü üst lokasyonun güncellenmiş halini içermeli.

İşte bunu nasıl yapabileceğinizin bir örneği:

<Sandpack>

```js
import { useState } from 'react';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, setPlan] = useState(initialTravelPlan);

  function handleComplete(parentId, childId) {
    const parent = plan[parentId];
    // Üst lokasyonun, bu alt ID'yi içermeyen
    // yeni bir sürümünü oluştur
    const nextParent = {
      ...parent,
      childIds: parent.childIds
        .filter(id => id !== childId)
    };
    // Kök state nesnesini güncelle...
    setPlan({
      ...plan,
      // ...böylece güncellenen üst öğeye sahip olsun.
      [parentId]: nextParent
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        Complete
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 43, 47],
  },
  1: {
    id: 1,
    title: 'Earth',
    childIds: [2, 10, 19, 27, 35]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'South Africa',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Americas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
    childIds: [20, 21, 22, 23, 24, 25, 26],   
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Hong Kong',
    childIds: []
  },
  22: {
    id: 22,
    title: 'India',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Singapore',
    childIds: []
  },
  24: {
    id: 24,
    title: 'South Korea',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Thailand',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Vietnam',
    childIds: []
  },
  27: {
    id: 27,
    title: 'Europe',
    childIds: [28, 29, 30, 31, 32, 33, 34],   
  },
  28: {
    id: 28,
    title: 'Croatia',
    childIds: []
  },
  29: {
    id: 29,
    title: 'France',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Germany',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Italy',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Portugal',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Spain',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Turkey',
    childIds: []
  },
  35: {
    id: 35,
    title: 'Oceania',
    childIds: [36, 37, 38, 39, 40, 41,, 42],   
  },
  36: {
    id: 36,
    title: 'Australia',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Fiji',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  41: {
    id: 41,
    title: 'New Zealand',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Vanuatu',
    childIds: []
  },
  43: {
    id: 43,
    title: 'Moon',
    childIds: [44, 45, 46]
  },
  44: {
    id: 44,
    title: 'Rheita',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Piccolomini',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Tycho',
    childIds: []
  },
  47: {
    id: 47,
    title: 'Mars',
    childIds: [48, 49]
  },
  48: {
    id: 48,
    title: 'Corn Town',
    childIds: []
  },
  49: {
    id: 49,
    title: 'Green Hill',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
```

</Sandpack>

State'i istediğiniz kadar iç içe olacak şekilde yapılandırabilirsiniz. Fakat "düz" yapılandırmak birçok sorunu çözebilir. Hem state'i güncellemeyi kolaylaştırır hem de iç içe nesnenin farklı bölümlerinde yinelenme ihtimalini ortadan kaldırmaya yardımcı olur.

<DeepDive>

#### Bellek kullanımını iyileştirmek {/*improving-memory-usage*/}

İdeal olarak, bellek kullanımını iyileştirmek için silinen öğeleri (ve alt öğelerini!) "tablo" nesnesinden kaldırmalısınız. Bu sürüm bunu gerçekleştirir. Aynı zamanda güncelleme mantığını daha kısa ve öz hale getirmek için [Immer](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) kullanır.

<Sandpack>

```js
import { useImmer } from 'use-immer';
import { initialTravelPlan } from './places.js';

export default function TravelPlan() {
  const [plan, updatePlan] = useImmer(initialTravelPlan);

  function handleComplete(parentId, childId) {
    updatePlan(draft => {
      // Üst lokasyonun alt IDlerinden kaldır.
      const parent = draft[parentId];
      parent.childIds = parent.childIds
        .filter(id => id !== childId);

      // Bu lokasyonu ve tüm alt ağacını unut.
      deleteAllChildren(childId);
      function deleteAllChildren(id) {
        const place = draft[id];
        place.childIds.forEach(deleteAllChildren);
        delete draft[id];
      }
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planetIds.map(id => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => {
        onComplete(parentId, id);
      }}>
        Complete
      </button>
      {childIds.length > 0 &&
        <ol>
          {childIds.map(childId => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      }
    </li>
  );
}
```

```js places.js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: '(Root)',
    childIds: [1, 43, 47],
  },
  1: {
    id: 1,
    title: 'Earth',
    childIds: [2, 10, 19, 27, 35]
  },
  2: {
    id: 2,
    title: 'Africa',
    childIds: [3, 4, 5, 6 , 7, 8, 9]
  }, 
  3: {
    id: 3,
    title: 'Botswana',
    childIds: []
  },
  4: {
    id: 4,
    title: 'Egypt',
    childIds: []
  },
  5: {
    id: 5,
    title: 'Kenya',
    childIds: []
  },
  6: {
    id: 6,
    title: 'Madagascar',
    childIds: []
  }, 
  7: {
    id: 7,
    title: 'Morocco',
    childIds: []
  },
  8: {
    id: 8,
    title: 'Nigeria',
    childIds: []
  },
  9: {
    id: 9,
    title: 'South Africa',
    childIds: []
  },
  10: {
    id: 10,
    title: 'Americas',
    childIds: [11, 12, 13, 14, 15, 16, 17, 18],   
  },
  11: {
    id: 11,
    title: 'Argentina',
    childIds: []
  },
  12: {
    id: 12,
    title: 'Brazil',
    childIds: []
  },
  13: {
    id: 13,
    title: 'Barbados',
    childIds: []
  }, 
  14: {
    id: 14,
    title: 'Canada',
    childIds: []
  },
  15: {
    id: 15,
    title: 'Jamaica',
    childIds: []
  },
  16: {
    id: 16,
    title: 'Mexico',
    childIds: []
  },
  17: {
    id: 17,
    title: 'Trinidad and Tobago',
    childIds: []
  },
  18: {
    id: 18,
    title: 'Venezuela',
    childIds: []
  },
  19: {
    id: 19,
    title: 'Asia',
    childIds: [20, 21, 22, 23, 24, 25, 26],   
  },
  20: {
    id: 20,
    title: 'China',
    childIds: []
  },
  21: {
    id: 21,
    title: 'Hong Kong',
    childIds: []
  },
  22: {
    id: 22,
    title: 'India',
    childIds: []
  },
  23: {
    id: 23,
    title: 'Singapore',
    childIds: []
  },
  24: {
    id: 24,
    title: 'South Korea',
    childIds: []
  },
  25: {
    id: 25,
    title: 'Thailand',
    childIds: []
  },
  26: {
    id: 26,
    title: 'Vietnam',
    childIds: []
  },
  27: {
    id: 27,
    title: 'Europe',
    childIds: [28, 29, 30, 31, 32, 33, 34],   
  },
  28: {
    id: 28,
    title: 'Croatia',
    childIds: []
  },
  29: {
    id: 29,
    title: 'France',
    childIds: []
  },
  30: {
    id: 30,
    title: 'Germany',
    childIds: []
  },
  31: {
    id: 31,
    title: 'Italy',
    childIds: []
  },
  32: {
    id: 32,
    title: 'Portugal',
    childIds: []
  },
  33: {
    id: 33,
    title: 'Spain',
    childIds: []
  },
  34: {
    id: 34,
    title: 'Turkey',
    childIds: []
  },
  35: {
    id: 35,
    title: 'Oceania',
    childIds: [36, 37, 38, 39, 40, 41,, 42],   
  },
  36: {
    id: 36,
    title: 'Australia',
    childIds: []
  },
  37: {
    id: 37,
    title: 'Bora Bora (French Polynesia)',
    childIds: []
  },
  38: {
    id: 38,
    title: 'Easter Island (Chile)',
    childIds: []
  },
  39: {
    id: 39,
    title: 'Fiji',
    childIds: []
  },
  40: {
    id: 40,
    title: 'Hawaii (the USA)',
    childIds: []
  },
  41: {
    id: 41,
    title: 'New Zealand',
    childIds: []
  },
  42: {
    id: 42,
    title: 'Vanuatu',
    childIds: []
  },
  43: {
    id: 43,
    title: 'Moon',
    childIds: [44, 45, 46]
  },
  44: {
    id: 44,
    title: 'Rheita',
    childIds: []
  },
  45: {
    id: 45,
    title: 'Piccolomini',
    childIds: []
  },
  46: {
    id: 46,
    title: 'Tycho',
    childIds: []
  },
  47: {
    id: 47,
    title: 'Mars',
    childIds: [48, 49]
  },
  48: {
    id: 48,
    title: 'Corn Town',
    childIds: []
  },
  49: {
    id: 49,
    title: 'Green Hill',
    childIds: []
  }
};
```

```css
button { margin: 10px; }
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

</DeepDive>

Bazı durumlarda iç içe state'in bazı parçalarını alt bileşenlere taşıyarak state'i iç içe yapılandırmayı azaltabilirsiniz. Bu durum çok kısa süren, saklanması gerekmeyen, UI state'lerinde işe yarar, örneğin bir öğenin üzerine gelindiğinde (hover edildiğinde).

<Recap>

* Eğer iki farklı state değişkeni hep aynı anda güncelleniyorsa bunları tek bir state değişkeninde birleştirmeyi değerlendirin.
* "İmkansız" state'ler oluşturmaktan kaçınmak için state değişkenlerini dikkatle seçin.
* State'inizi, onu güncellerken hata yapma ihtimalini en aza indirgeyecek şekilde yapılandırın.
* State'inizi senkronize tutmaya çalışmak yerine gereksiz ve yinelenen şekilde yapılandırmaktan kaçının.
* Güncellemeleri engellemek istediğiniz durumlar haricinde prop'ları state *içine* koymayın.
* Seçim (selection) gibi UI kalıpları için state'te objenin kendisi yerine IDsini ya da indeksini tutun.
* Eğer derinlemesine iç içe geçmiş state'i güncellemek karmaşıksa onu düz bir yapıya getirmeye çalışın.

</Recap>

<Challenges>

#### Güncellenmeyen bir bileşeni düzeltin {/*fix-a-component-thats-not-updating*/}

`Clock` bileşeni iki prop alır: `color` ve `time`. Seçim kutusunda farklı bir renk seçtiğinizde, `Clock` bileşeni üst bileşeninden farklı bir `color` prop'u alır. Fakat, bir sebepten ötürü gösterilen renk güncellenmiyor. Neden? Bu sorunu çözün.

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  const [color, setColor] = useState(props.color);
  return (
    <h1 style={{ color: color }}>
      {props.time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

<Solution>

Sorun şu ki bu bileşen `color` prop'unun başlangıç değerinin öndeğer olarak atandığı `color` state'ine sahip. Fakat `color` prop'u değiştiğinde bu state değişkenini etkilemiyor! Böylece uyumsuz hale geliyorlar. Bu sorunu çözmek için state değişkenini tamamen kaldırın ve direkt olarak `color` prop'unu kullanın.

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock(props) {
  return (
    <h1 style={{ color: props.color }}>
      {props.time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

Veya destructuring söz dizimini kullanarak:

<Sandpack>

```js Clock.js active
import { useState } from 'react';

export default function Clock({ color, time }) {
  return (
    <h1 style={{ color: color }}>
      {time}
    </h1>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  const [color, setColor] = useState('lightcoral');
  return (
    <div>
      <p>
        Pick a color:{' '}
        <select value={color} onChange={e => setColor(e.target.value)}>
          <option value="lightcoral">lightcoral</option>
          <option value="midnightblue">midnightblue</option>
          <option value="rebeccapurple">rebeccapurple</option>
        </select>
      </p>
      <Clock color={color} time={time.toLocaleTimeString()} />
    </div>
  );
}
```

</Sandpack>

</Solution>

#### Bozuk ambalaj listesini düzeltin {/*fix-a-broken-packing-list*/}

Bu ambalaj listesi kaç öğenin ambalajlandığını ve toplamda kaç öğe olduğunu gösteren bir altbilgiye sahip. İlk başta çalışıyor gibi gözüküyor fakat hatalı. Örneğin bir öğeyi ambalajlandı olarak işaretlerseniz ve sonrasında silerseniz sayaç düzgün şekilde güncellenmiyor. Sayacı her zaman doğru gösterecek şekilde düzeltin.

<Hint>

Bu örnekte gereksiz olan bir state var mı?

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Warm socks', packed: true },
  { id: 1, title: 'Travel journal', packed: false },
  { id: 2, title: 'Watercolors', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(3);
  const [packed, setPacked] = useState(1);

  function handleAddItem(title) {
    setTotal(total + 1);
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    if (nextItem.packed) {
      setPacked(packed + 1);
    } else {
      setPacked(packed - 1);
    }
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setTotal(total - 1);
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>  
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} out of {total} packed!</b>
    </>
  );
}
```

```js AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add item"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Add</button>
    </>
  )
}
```

```js PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution>

Her bir olay yöneticisini `total` ve `packed` sayaçlarını sorunsuzca güncelleyecek şekilde dikkatlice düzeltebilecek olsanız dahi asıl sorun bu state değişkenlerinin var olması. Öğelerin sayısını (ambalajlanmış ya da toplam) her zaman `items` dizisini kullanarak hesaplayabileceğiniz için bu state değişkenleri gereksiz. Hatayı gidermek için gereksiz state'i kaldırın:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddItem from './AddItem.js';
import PackingList from './PackingList.js';

let nextId = 3;
const initialItems = [
  { id: 0, title: 'Warm socks', packed: true },
  { id: 1, title: 'Travel journal', packed: false },
  { id: 2, title: 'Watercolors', packed: false },
];

export default function TravelPlan() {
  const [items, setItems] = useState(initialItems);

  const total = items.length;
  const packed = items
    .filter(item => item.packed)
    .length;

  function handleAddItem(title) {
    setItems([
      ...items,
      {
        id: nextId++,
        title: title,
        packed: false
      }
    ]);
  }

  function handleChangeItem(nextItem) {
    setItems(items.map(item => {
      if (item.id === nextItem.id) {
        return nextItem;
      } else {
        return item;
      }
    }));
  }

  function handleDeleteItem(itemId) {
    setItems(
      items.filter(item => item.id !== itemId)
    );
  }

  return (
    <>  
      <AddItem
        onAddItem={handleAddItem}
      />
      <PackingList
        items={items}
        onChangeItem={handleChangeItem}
        onDeleteItem={handleDeleteItem}
      />
      <hr />
      <b>{packed} out of {total} packed!</b>
    </>
  );
}
```

```js AddItem.js hidden
import { useState } from 'react';

export default function AddItem({ onAddItem }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add item"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddItem(title);
      }}>Add</button>
    </>
  )
}
```

```js PackingList.js hidden
import { useState } from 'react';

export default function PackingList({
  items,
  onChangeItem,
  onDeleteItem
}) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <label>
            <input
              type="checkbox"
              checked={item.packed}
              onChange={e => {
                onChangeItem({
                  ...item,
                  packed: e.target.checked
                });
              }}
            />
            {' '}
            {item.title}
          </label>
          <button onClick={() => onDeleteItem(item.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

Bu değişiklik sonrasında olay yöneticilerinin nasıl sadece `setItems`'ı çağırmakla ilgilendiğine dikkat edin. Öğelerin sayısı artık sonraki render esnasında `items` kullanılarak hesaplanıyor, yani her zaman güncel.

</Solution>

#### Kaybolan seçimi düzeltin {/*fix-the-disappearing-selection*/}

State'te `letters`'ın (mesajlar) bir listesi var. Bir mesajın üzerine geldiğinizde (hover) ya da odaklandığınızda (focus) vurgulanıyor. Güncel olarak vurgulanan mesaj `highlightedLetter` state değişkeninde saklanıyor. Bir mesajı "favorileyebilir" (star) ya da "favorilerden çıkarabilirsiniz" (unstar), bu durum state'teki `letters` dizisini günceller.

Kod çalışıyor ama küçük bir UI kusuru var. "Star" ya da "Unstar" butonuna tıkladığınızda, vurgu kısa bir süreliğine kayboluyor. Ancak imleci hareket ettirdiğinizde ya da klayve ile başka bir mesaja geçtiğinizde tekrar gözüküyor. Bunun sebebi ne? Hatayı, vurgunun butona tıkladıktan sonra kaybolmayacağı şekilde düzeltin.

<Sandpack>

```js App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedLetter, setHighlightedLetter] = useState(null);

  function handleHover(letter) {
    setHighlightedLetter(letter);
  }

  function handleStar(starred) {
    setLetters(letters.map(letter => {
      if (letter.id === starred.id) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter === highlightedLetter
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter);        
      }}
      onPointerMove={() => {
        onHover(letter);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter);
      }}>
        {letter.isStarred ? 'Unstar' : 'Star'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js data.js
export const initialLetters = [{
  id: 0,
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

<Solution>

Sorun şu ki mesaj nesnesini `highlightedLetter` içerisinde tutuyorsunuz. Fakat aynı bilgiyi `letters` dizisinin içinde de tutuyorsunuz. Yani state'iniz yineleniyor! Butona tıklayarak `letters` dizisini güncellediğinizde `highlightedLetter`'dan farklı yeni bir mesaj nesnesi oluşturmuş oluyorsunuz. Bu yüzden `highlightedLetter === letter` kontrolü `false` oluyor ve vurgu kayboluyor. İmleci hareket ettirerek `setHighlightedLetter`'ı çağırdığınızda da vurgu tekrar gözüküyor.

Sorunu çözmek için yineleme durumunu ortadan kaldırın. *Mesajın kendisini* iki farklı yerde saklamak yerine `highlightedId` değerini saklayın. Böylece her mesaj için `isHighlighted`'ı kontrol edebilirsiniz ve `letter` (mesaj) nesnesi bileşen son render edildiğinden beri değişmiş olsa bile sorunsuzca çalışmasını sağlayabilirsiniz.

<Sandpack>

```js App.js
import { useState } from 'react';
import { initialLetters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [letters, setLetters] = useState(initialLetters);
  const [highlightedId, setHighlightedId ] = useState(null);

  function handleHover(letterId) {
    setHighlightedId(letterId);
  }

  function handleStar(starredId) {
    setLetters(letters.map(letter => {
      if (letter.id === starredId) {
        return {
          ...letter,
          isStarred: !letter.isStarred
        };
      } else {
        return letter;
      }
    }));
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isHighlighted={
              letter.id === highlightedId
            }
            onHover={handleHover}
            onToggleStar={handleStar}
          />
        ))}
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  isHighlighted,
  onHover,
  onToggleStar,
}) {
  return (
    <li
      className={
        isHighlighted ? 'highlighted' : ''
      }
      onFocus={() => {
        onHover(letter.id);        
      }}
      onPointerMove={() => {
        onHover(letter.id);
      }}
    >
      <button onClick={() => {
        onToggleStar(letter.id);
      }}>
        {letter.isStarred ? 'Unstar' : 'Star'}
      </button>
      {letter.subject}
    </li>
  )
}
```

```js data.js
export const initialLetters = [{
  id: 0,
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
  isStarred: false,
}];
```

```css
button { margin: 5px; }
li { border-radius: 5px; }
.highlighted { background: #d2eaff; }
```

</Sandpack>

</Solution>

#### Çoklu seçim yapmayı sağlayın {/*implement-multiple-selection*/}

Bu örnekte her bir `Letter` (mesaj) kendini seçili olarak işaretlemeye yarayan `isSelected` prop'una ve `onToggle` yöneticisine sahip. Bu haliyle çalışıyor fakat state `selectedId` (`null` ya da bir ID) olarak saklanıyor, yani aynı anda yalnızca tek bir mesaj seçilebilir durumda.

State yapısını çoklu seçimi destekleyecek şekilde değiştirin. (Nasıl yapılandırırsınız? Kodu yazmadan önce bunun hakkında düşünün.) Her bir işaret kutucuğu birbirinden bağımsız olmalı. Seçili bir mesaja tıklamak onu seçilmemiş hale getirmeli. Son olarak, altbilgi seçili öğe sayısını doğru şekilde göstermeli.

<Hint>

State'te tek bir seçili ID yerine seçili IDleri içeren bir dizi veya [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) tutmak isteyebilirsiniz.

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedId, setSelectedId] = useState(null);

  // TODO: çoklu seçime izin ver
  const selectedCount = 1;

  function handleToggle(toggledId) {
    // TODO: çoklu seçime izin ver
    setSelectedId(toggledId);
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              // TODO: çoklu seçime izin ver
              letter.id === selectedId
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            You selected {selectedCount} letters
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

<Solution>

State'te tek bir `selectedId` yerine seçili IDleri içeren bir `selectedIds` *dizisi* tutun. Örneğin ilk ve son mesajları seçerseniz bu dizi `[0, 2]` değerlerini içerir. Hiçbir şey seçili değil ise boş bir `[]` dizisi olur:

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedCount = selectedIds.length;

  function handleToggle(toggledId) {
    // Daha önceden seçili miydi?
    if (selectedIds.includes(toggledId)) {
      // Öyleyse bu ID'yi diziden kaldır.
      setSelectedIds(selectedIds.filter(id =>
        id !== toggledId
      ));
    } else {
      // Aksi halde diziye ekle.
      setSelectedIds([
        ...selectedIds,
        toggledId
      ]);
    }
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.includes(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            You selected {selectedCount} letters
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

Dizi kullandığımızda her bir öğenin seçili olup olmadığını kontrol etmek için `selectedIds.includes(letter.id)` fonksiyonunu çağırıyoruz, bu durum dizi kullanmanın küçük bir kusuru olarak değerlendirilebilir. Eğer dizi çok büyükse diziyi [`includes()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes) fonksiyonuyla aramak doğrusal zaman aldığından ve bu aramayı her bir öğe için yaptığınızdan performans sorunlarıyla karşılabilirsiniz.

Bu sorunu çözmek için state'te hızlı bir [has()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/has) operasyonuna sahip olan [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) tutabilirsiniz:

<Sandpack>

```js App.js
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState(
    new Set()
  );

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Kopya oluştur (mutasyonu engellemek için).
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.has(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            You selected {selectedCount} letters
          </b>
        </p>
      </ul>
    </>
  );
}
```

```js Letter.js
export default function Letter({
  letter,
  onToggle,
  isSelected,
}) {
  return (
    <li className={
      isSelected ? 'selected' : ''
    }>
      <label>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {
            onToggle(letter.id);
          }}
        />
        {letter.subject}
      </label>
    </li>
  )
}
```

```js data.js
export const letters = [{
  id: 0,
  subject: 'Ready for adventure?',
  isStarred: true,
}, {
  id: 1,
  subject: 'Time to check in!',
  isStarred: false,
}, {
  id: 2,
  subject: 'Festival Begins in Just SEVEN Days!',
  isStarred: false,
}];
```

```css
input { margin: 5px; }
li { border-radius: 5px; }
label { width: 100%; padding: 5px; display: inline-block; }
.selected { background: #d2eaff; }
```

</Sandpack>

Artık her öğe oldukça hızlı olan `selectedIds.has(letter.id)` kontrolünü yapıyor.

[State'te nesneleri direkt olarak değiştirmekten kaçınmanız](/learn/updating-objects-in-state) gerektiğini unutmayın, bu Set'leri de kapsıyor. Bu yüzden `handleToggle` fonksiyonu önce Set'in bir kopyasını yaratıyor ve ardından bu kopyayı güncelliyor.

</Solution>

</Challenges>
