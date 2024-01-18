---
title: State İçerisindeki Dizileri Güncelleme
---

<Intro>

Diziler JavaScript'te değiştirilebilirdir, ancak bunları state içinde depolarken değiştirilemez olarak ele almalısınız. Tıpkı nesnelerde olduğu gibi, state'te depolanan bir diziyi güncellemek istediğinizde yeni bir dizi oluşturmanız (veya var olanın bir kopyasını oluşturmanız) ve ardından yeni oluşturduğunuz diziyi kullanmak için state'i güncellemeniz gerekir.

</Intro>

<YouWillLearn>

- React state'indeki bir diziye öğeler nasıl eklenir, çıkarılır ya da değiştirilir
- Dizi içindeki nesne nasıl güncellenir
- Immer kullanarak dizi kopyalama işlemi daha az tekrarla nasıl yapılır

</YouWillLearn>

## Dizileri değiştirmeden güncelleme {/*updating-arrays-without-mutation*/}

JavaScript'te diziler bir nesne türüdür. [Nesnelerde olduğu gibi](/learn/updating-objects-in-state), **React state'indeki dizileri salt okunur olarak görmelisiniz.** Bu, `arr[0] = 'bird'` şeklinde bir dizi içindeki öğeleri başka değerlere yeniden atamamanız, ayrıca `push()` ve `pop()` gibi dizileri mutasyona uğratan JavaScript metodlarını kullanmamanız gerektiği anlamına gelir.

Bu metodları kullanmak yerine, bir diziyi her güncellemek istediğinizde state setter fonksiyonunuza *yeni* bir dizi iletmelisiniz. Bunu yapmak için, `filter()` ve `map()` gibi diziyi mutasyona uğratmayan JavaScript metodlarını kullanarak orijinal diziden yeni bir dizi oluşturabilirsiniz. Ardından, state'inizi kopyaladığınız dizi olarak güncelleyebilirsiniz.

Aşağıda sık kullanılan dizi metodları tablo halinde gösterilmiştir. React state'indeki dizilerle çalışırken sol sütundaki metodları kullanmaktan kaçınarak sağ sütundaki metodları tercih etmelisiniz.

|           | kaçınılacaklar (diziyi mutasyona uğratır)           |  tercih edilecekler (yeni bir dizi döndürür)                                        |
| --------- | ----------------------------------- | ------------------------------------------------------------------- |
| eklemek    | `push`, `unshift`                   | `concat`, `[...arr]` spread sözdizimi ([örnek](#adding-to-an-array)) |
| çıkartmak  | `pop`, `shift`, `splice`            | `filter`, `slice` ([örnek](#removing-from-an-array))              |
| değiştirmek | `splice`, `arr[i] = ...` ataması | `map` ([örnek](#replacing-items-in-an-array))                     |
| sıralamak   | `reverse`, `sort`                   | ilk önce diziyi kopyalayın ([örnek](#making-other-changes-to-an-array)) |

Alternatif olarak, her iki sütundaki metodları kullanmanıza izin veren [Immer'ı] (#write-concise-update-logic-with-immer) tercih edebilirsiniz.

<Pitfall>

Ne yazık ki, [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice) ve [`splice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) metodları isim olarak benzeseler bile birbirlerinden çok farklıdırlar.

* `slice` metodu dizinin bir parçasını veya tamamını kopyalamınızı sağlar.
* `splice` diziyi **mutasyona uğratır** (diziye yeni öğe eklemek ya da var olanı çıkartmak için kullanılır).

React'te, `slice` (`p` yok!) metodunu daha sık kullanacaksınız çünkü state'teki nesneleri veya dizileri mutasyona uğratmak istemezsiniz. [Nesneleri Güncelleme](/learn/updating-objects-in-state) sayfasında mutasyon nedir ve state için neden kullanılmamalıdır öğrenebilirsiniz.

</Pitfall>

### Diziye öğe eklemek {/*adding-to-an-array*/}

`push()` metodu diziyi mutasyona uğratacaktır, ki bunu istemezsiniz:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>İlham verici heykeltıraşlar:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        artists.push({
          id: nextId++,
          name: name,
        });
      }}>Ekle</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Bunun yerine, mevcut öğeleri *ve* son eleman olarak yeni öğeyi içeren *yeni* diziyi oluşturun. Bunu yapmanın birden çok yolu vardır ancak en kolay yol `...` [dizi spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_array_literals) sözdizimini kullanmaktır:

```js
setArtists( // State'i yeni bir dizi 
  [ // ile değiştirin
    ...artists, // bu eski öğelerin tümünü
    { id: nextId++, name: name } // ve sona eklenecek yeni öğeyi içerir.
  ]
);
```

Şimdi doğru şekilde çalışmakta:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 0;

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState([]);

  return (
    <>
      <h1>İlham verici heykeltıraşlar:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => {
        setArtists([
          ...artists,
          { id: nextId++, name: name }
        ]);
      }}>Ekle</button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

Dizi spread sözdizimi yeni öğeyi orijinal `...artists`'den *önceye* yerleştirerek dizinin başına eklemenizi de sağlar:

```js
setArtists([
  { id: nextId++, name: name },
  ...artists // Eski öğeleri dizinin sonuna yerleştir
]);
```

Bu şekilde, spread sözdizimi `push()` (öğeyi dizinin sonuna eklemek) ve `unshift()` (öğeyi dizinin başına eklemek) metodlarının görevini yapabilir. Yukarıdaki sandbox'ta deneyebilirsiniz!

### Diziden öğe çıkartma {/*removing-from-an-array*/}

Diziden bir öğeyi çıkartmanın en kolay yolu o öğeyi *filtrelemektir.* Bir başka deyişle, o öğeyi içermeyen yeni bir dizi oluşturmaktır. Bunu yapmak için `filter` metodunu kullanabilirsiniz. Örneğin:

<Sandpack>

```js
import { useState } from 'react';

let initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [artists, setArtists] = useState(
    initialArtists
  );

  return (
    <>
      <h1>İlham verici heykeltıraşlar:</h1>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>
            {artist.name}{' '}
            <button onClick={() => {
              setArtists(
                artists.filter(a =>
                  a.id !== artist.id
                )
              );
            }}>
              Sil
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

"Sil" butonuna birkaç kez tıklayın ve tıklama yöneticisine bakın.

```js
setArtists(
  artists.filter(a => a.id !== artist.id)
);
```

Burada `artists.filter(a => a.id !== artist.id)` ifadesi "`artist` dizisini kullanarak ID'leri `artist.id`'den farklı olan öğelerle yeni bir dizi oluştur" anlamına gelmektedir. Diğer bir deyişle, her bir artist'e karşılık gelen "Sil" butonu o artist'i diziden filtreleyecek ve nihai dizi ile yeniden render isteği gönderecektir. `filter` metodunun orijinal diziyi değiştirmediğini unutmayın.

### Diziyi dönüştürme {/*transforming-an-array*/}

Dizideki bazı ya da tüm öğeleri değiştirmek isterseniz **yeni** bir dizi oluşturmak için `map()` metodunu kullanabilirsiniz. `map`'e ileteceğiniz fonksiyon, verisine veya indeksine (veya her ikisine) bağlı olarak her bir öğeyle ne yapacağınızı belirler.

Bu örnekte dizi, iki daire ve bir karenin koordinatlarını içermektedir. Butona tıkladığınız zaman sadece daireler 50 piksel aşağı hareket etmektedir. Bunu, `map()` metodunu kullanıp yeni bir veri dizisi oluşturarak yapar:

<Sandpack>

```js
import { useState } from 'react';

let initialShapes = [
  { id: 0, type: 'circle', x: 50, y: 100 },
  { id: 1, type: 'square', x: 150, y: 100 },
  { id: 2, type: 'circle', x: 250, y: 100 },
];

export default function ShapeEditor() {
  const [shapes, setShapes] = useState(
    initialShapes
  );

  function handleClick() {
    const nextShapes = shapes.map(shape => {
      if (shape.type === 'square') {
        // Değişiklik yok
        return shape;
      } else {
        // 50 piksel aşağıda yeni bir daire döndürür
        return {
          ...shape,
          y: shape.y + 50,
        };
      }
    });
    // Yeni dizi ile yeniden render et
    setShapes(nextShapes);
  }

  return (
    <>
      <button onClick={handleClick}>
        Daireleri aşağı hareket ettir!
      </button>
      {shapes.map(shape => (
        <div
          key={shape.id}
          style={{
          background: 'purple',
          position: 'absolute',
          left: shape.x,
          top: shape.y,
          borderRadius:
            shape.type === 'circle'
              ? '50%' : '',
          width: 20,
          height: 20,
        }} />
      ))}
    </>
  );
}
```

```css
body { height: 300px; }
```

</Sandpack>

### Dizideki öğeleri değiştirme {/*replacing-items-in-an-array*/}

Bir dizideki bir veya daha fazla öğeyi değiştirmek oldukça sık istenmektedir. `arr[0] = 'bird'` gibi atamalar yapmak orijinal diziyi mutasyona uğrattığı için burada da `map` metodunu kullanmak mantıklı olacaktır.

Bir öğeyi değiştirmek için `map` ile yeni bir dizi oluşturun. `map` metodu içinde, ikinci argüman olarak öğenin indeksini alacaksınız. Bu indeksi orijinal öğeyi (fonksiyonun ilk argümanı) veya başka bir öğeyi döndürüp döndürmeyeceğinize karar vermek için kullanın:

<Sandpack>

```js
import { useState } from 'react';

let initialCounters = [
  0, 0, 0
];

export default function CounterList() {
  const [counters, setCounters] = useState(
    initialCounters
  );

  function handleIncrementClick(index) {
    const nextCounters = counters.map((c, i) => {
      if (i === index) {
        // Tıklanan sayacı artır
        return c + 1;
      } else {
        // Geri kalan değişmez
        return c;
      }
    });
    setCounters(nextCounters);
  }

  return (
    <ul>
      {counters.map((counter, i) => (
        <li key={i}>
          {counter}
          <button onClick={() => {
            handleIncrementClick(i);
          }}>+1</button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

### Dizide belli bir konuma öğe ekleme {/*inserting-into-an-array*/}

Bazen bir öğeyi dizinin başına ya da sonuna değil de belirli bir konuma eklemek isteyebilirsiniz. Bunu yapmak için, `...` dizi spread sözdizimini `slice()` metodu ile beraber kullanabilirsiniz. `slice()` metodu diziden bir "dilim (slice)" almanızı sağlar. Yeni öğeyi eklemek için, eklemek istediğiniz konumdan önceki dilimden spread sözdizimi ile yeni bir dizi oluşturacak, ardından yeni öğeyi ekleyecek ve son olarak da orijinal dizinin geri kalanını ekleyeceksiniz.

Bu örnekte, Ekle butonu her zaman `1.` indekse ekler:

<Sandpack>

```js
import { useState } from 'react';

let nextId = 3;
const initialArtists = [
  { id: 0, name: 'Marta Colvin Andrade' },
  { id: 1, name: 'Lamidi Olonade Fakeye'},
  { id: 2, name: 'Louise Nevelson'},
];

export default function List() {
  const [name, setName] = useState('');
  const [artists, setArtists] = useState(
    initialArtists
  );

  function handleClick() {
    const insertAt = 1; // Herhangi bir indeks olabilir
    const nextArtists = [
      // Eklemek istediğiniz konumdan önceki öğeler:
      ...artists.slice(0, insertAt),
      // Yeni öğe:
      { id: nextId++, name: name },
      // Eklemek istediğiniz konumdan sonraki öğeler:
      ...artists.slice(insertAt)
    ];
    setArtists(nextArtists);
    setName('');
  }

  return (
    <>
      <h1>İlham verici heykeltıraşlar:</h1>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={handleClick}>
        Ekle
      </button>
      <ul>
        {artists.map(artist => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ul>
    </>
  );
}
```

```css
button { margin-left: 5px; }
```

</Sandpack>

### Dizide başka değişiklikler yapma {/*making-other-changes-to-an-array*/}

Spread sözdizimi veya `map()` ve `filter()` gibi diziyi mutasyona uğratmayan metodlarla yapamayacağınız bazı şeyler vardır. Örneğin, bir diziyi sıralamak veya dizi öğelerini ters çevirmek isteyebilirsiniz. JavaScript'in `reverse()` ve `sort()` metodları orijinal diziyi değiştirir, bu nedenle doğrudan bu metodları kullanamazsınız.

**Ancak, önce diziyi kopyalayabilir ve sonra o dizi üzerinde değişiklikler yapabilirsiniz.**

Örneğin:

<Sandpack>

```js
import { useState } from 'react';

const initialList = [
  { id: 0, title: 'Big Bellies' },
  { id: 1, title: 'Lunar Landscape' },
  { id: 2, title: 'Terracotta Army' },
];

export default function List() {
  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse();
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Ters Çevir
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

Burada `[...list]` spread sözdizimi kullanılarak orijinal dizinin bir kopyası oluşturulur. Artık bir kopyanız olduğuna göre `nextList.reverse()` ya da `nextList.sort()` gibi mutasyona sebep olan metodlar kullanabilir, hatta `nextList[0] = "something"` ile öğeleri tek tek yeni değerlerine atayabilirsiniz.

Ancak, **bir diziyi kopyalasanız bile dizinin  _içindeki_ öğeleri doğrudan mutasyona uğratamazsınız.** Bunun nedeni yaptığınız kopyalamanın yüzeysel (shallow) olmasıdır. Yani yeni dizi, orijinal diziyle aynı öğeleri içermektedir. Dolayısıyla, kopyalanan dizinin içindeki bir nesneyi değiştirdiğiniz zaman mevcut state'i de mutasyona uğratmış olursunuz. Örneğin, aşağıdaki gibi bir kod sorunludur. 

```js
const nextList = [...list];
nextList[0].seen = true; // Sorun: list[0]'ı mutasyona uğratır
setList(nextList);
```

`nextList` ve `list` iki farklı dizi olmasına rağmen, **`nextList[0]` ve `list[0]` ifadeleri aynı nesneyi işaret eder.** Yani `nextList[0].seen` değerini değiştirirseniz, aynı zamanda `list[0].seen` değerini de değiştirmiş olursunuz. Bu, state'i mutasyona uğratmaktır ki bundan kaçınmalısınız! Bu sorunu [iç içe JavaScript nesnelerini güncelleme](/learn/updating-objects-in-state#updating-a-nested-object) yöntemine benzer şekilde, değiştirmek istediğiniz öğeleri mutasyona uğratmak yerine tek tek kopyalayarak çözebilirsiniz. Nasıl yapıldığını görelim.

## Dizideki nesneleri güncelleme {/*updating-objects-inside-arrays*/}

Nesneler  _gerçekte_ dizilerin "içinde" yer almazlar. Yazdığınız kodda "içinde" gibi görünebilir ancak bir dizideki her nesne, dizinin "işaret ettiği" ayrı bir değerdir. Bu yüzden `list[0]` gibi iç içe ifadeleri değiştirirken dikkatli olmalısınız. Başka bir kişinin sanat eseri listesi (artwork list), dizinin aynı öğesine işaret edebilir!

**İç içe geçmiş state'i güncellerken, güncellemek istediğiniz noktadan en üst düzeye kadar kopyalar oluşturmanız gerekir.** Şimdi bunun nasıl olduğunu görelim.

Bu örnekte, iki farklı sanat eseri listesi aynı başlangıç state'ine sahiptir. Bu listelerin izole olmaları gerekirdi ancak bir mutasyon nedeniyle yanlışlıkla state'leri paylaşmaktadırlar ve listedeki bir kutuyu işaretlemek diğer listeyi de etkilemektedir:

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
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    const myNextList = [...myList];
    const artwork = myNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setMyList(myNextList);
  }

  function handleToggleYourList(artworkId, nextSeen) {
    const yourNextList = [...yourList];
    const artwork = yourNextList.find(
      a => a.id === artworkId
    );
    artwork.seen = nextSeen;
    setYourList(yourNextList);
  }

  return (
    <>
      <h1>Görülecek Sanat Eserleri Listesi</h1>
      <h2>Görmek istediğim eserler listesi:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Senin görmek istediğin eserler listesi:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

Bu koddaki sorun şudur:

```js
const myNextList = [...myList];
const artwork = myNextList.find(a => a.id === artworkId);
artwork.seen = nextSeen; // Sorun: mevcut öğeyi mutasyona uğratır
setMyList(myNextList);
```

`myNextList` dizisi yeni bir dizi olmasına rağmen, *dizi içindeki öğeler* orijinal `myList` dizisindeki öğeler ile aynıdır. Yani `artwork.seen`'i değiştirmek *orijinal* sanat eserini de değiştirir. Bu sanat eseri `yourList` dizisinde de olduğu için hata burdan kaynaklanmaktadır. Bunun gibi hataları düşünmek zor olabilir, ancak state'i mutasyona uğratmaktan kaçınırsanız bu hatalar ortadan kalkacaktır.

**Eski bir öğeyi mutasyon olmadan güncellenmiş sürümüyle değiştirmek için `map` metodunu kullanabilirsiniz.**

```js
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Değişikliklerle *yeni* bir nesne oluştur
    return { ...artwork, seen: nextSeen };
  } else {
    // Değişiklik yok
    return artwork;
  }
}));
```

Burada `...`, [bir nesnenin kopyasını oluşturmak](/learn/updating-objects-in-state#copying-objects-with-the-spread-syntax) için kullanılan nesne spread sözdizimidir.

Bu yaklaşımla, mevcut state öğelerinin hiçbiri mutasyona uğramamış olur ve hata düzeltilir:

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
  const [myList, setMyList] = useState(initialList);
  const [yourList, setYourList] = useState(
    initialList
  );

  function handleToggleMyList(artworkId, nextSeen) {
    setMyList(myList.map(artwork => {
      if (artwork.id === artworkId) {
        // Değişikliklerle *yeni* bir nesne oluştur
        return { ...artwork, seen: nextSeen };
      } else {
        // Değişiklik yok
        return artwork;
      }
    }));
  }

  function handleToggleYourList(artworkId, nextSeen) {
    setYourList(yourList.map(artwork => {
      if (artwork.id === artworkId) {
        // Değişikliklerle *yeni* bir nesne oluştur
        return { ...artwork, seen: nextSeen };
      } else {
        // Değişiklik yok
        return artwork;
      }
    }));
  }

  return (
    <>
      <h1>Görülecek Sanat Eserleri Listesi</h1>
      <h2>Görmek istediğim eserler listesi:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Senin görmek istediğin eserler listesi:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

Genel olarak, **yalnızca az önce oluşturduğunuz nesneleri mutasyona uğratmalısınız.** *Yeni* bir sanat eseri ekliyorsanız, onu mutasyona uğratabilirsiniz, ancak zaten state'te olan bir eserde bir değişiklik yapıyorsanız, bir kopya oluşturmanız gerekmektedir.

### Immer kullanarak kısa ve öz güncelleme mantığı yazmak {/*write-concise-update-logic-with-immer*/}

İç içe dizileri mutasyona uğratmadan güncellemek [tıpkı nesnelerde olduğu gibi](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) biraz tekrara binebilir:

- Genel olarak, state'i birkaç seviyeden daha derine güncellemeniz gerekmez. Ancak state nesneleriniz çok derinse, düz (flat) olmaları için [onları farklı şekilde yeniden yapılandırmak](/learn/choosing-the-state-structure#avoid-deeply-nested-state) isteyebilirsiniz.
- Eğer state yapınızı değiştirmek istemiyorsanız, [Immer](https://github.com/immerjs/use-immer) kullanmak isteyebilirsiniz. Immer, diziyi mutasyona uğratacak sözdizimlerini kullanmanıza izin vererek, kopyalama işlemlerini sizin yerinize kendisi yapar.

Immer ile yazılmış örneği aşağıda görebilirsiniz:

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
  const [myList, updateMyList] = useImmer(
    initialList
  );
  const [yourList, updateYourList] = useImmer(
    initialList
  );

  function handleToggleMyList(id, nextSeen) {
    updateMyList(draft => {
      const artwork = draft.find(a =>
        a.id === id
      );
      artwork.seen = nextSeen;
    });
  }

  function handleToggleYourList(artworkId, nextSeen) {
    updateYourList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Görülecek Sanat Eserleri Listesi</h1>
      <h2>Görmek istediğim eserler listesi:</h2>
      <ItemList
        artworks={myList}
        onToggle={handleToggleMyList} />
      <h2>Senin görmek istediğin eserler listesi:</h2>
      <ItemList
        artworks={yourList}
        onToggle={handleToggleYourList} />
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

Immer ile **`artwork.seen = nextSeen` gibi mutasyonların artık sorun çıkarmadığına dikkat edin:**

```js
updateMyTodos(draft => {
  const artwork = draft.find(a => a.id === artworkId);
  artwork.seen = nextSeen;
});
```

Bunun nedeni, _orijinal_ state'i mutasyona uğratmamanızdır. Burada Immer tarafından sağlanan özel bir `draft` nesnesini mutasyona uğratmaktayız. Benzer şekilde, `draft` nesnesine `push()` ve `pop()` gibi mutasyona neden olan metodları da uygulayabilirsiniz.

Arka planda Immer, `draft`'a yaptığınız değişikliklere göre her zaman bir sonraki state'i sıfırdan oluşturur. Bu, olay yönetecilerinizi, state'i hiç mutasyona uğratmadan kısa ve öz olarak tutar.

<Recap>

- State'e dizi koyabilirsiniz ancak değiştiremezsiniz.
- Bir diziyi mutasyona uğratmak yerine o dizinin *yeni* bir sürümünü oluşturun ve state'i buna göre güncelleyin.
- `[...arr, newItem]` dizi spread sözdizimini kullanarak yeni öğelerle bir dizi oluşturabilirsiniz
- `filter()` ve `map()` metodlarını kullanarak filtrelenmiş ya da dönüştürülmüş yeni diziler oluşturabilirsiniz.
- Kodunuzu kısa ve öz tutmak için Immer'ı kullanabilirsiniz.

</Recap>



<Challenges>

#### Alışveriş sepetindeki ürünü güncelleyin {/*update-an-item-in-the-shopping-cart*/}

"+" butonuna tıklandığında ilgili sayının artması için `handleIncreaseClick` mantığını doldurun:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {

  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

Yeni bir dizi oluşturmak için `map` fonksiyonunu kullanabilir ve ardından `...` nesne spread sözdizimini kullanarak yeni dizi için değiştirilmiş nesnenin bir kopyasını oluşturabilirsiniz:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Alışveriş sepetinden bir ürünü çıkarın {/*remove-an-item-from-the-shopping-cart*/}

Bu alışveriş sepetinde "+" butonu çalışmaktadır ancak "–" butonu çalışmamaktadır. Bu butona bir olay yöneticisi ekleyerek ürüne karşılık gelen butona tıklandığında `count` sayacının azalmasını sağlayın. Eğer sayaç 1 ise "–" butonuna tıklandığında ürün sepetten otomatik olarak çıkarılmalıdır. Sayacın asla 0 göstermemesine dikkat edin.

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

<Solution>

İlk önce `map` metodu ile yeni bir dizi oluşturabilir daha sonra `count` sayacı `0` olan ürünler `filter` metodu ile sepetten çıkartılabilir:

<Sandpack>

```js
import { useState } from 'react';

const initialProducts = [{
  id: 0,
  name: 'Baklava',
  count: 1,
}, {
  id: 1,
  name: 'Cheese',
  count: 5,
}, {
  id: 2,
  name: 'Spaghetti',
  count: 2,
}];

export default function ShoppingCart() {
  const [
    products,
    setProducts
  ] = useState(initialProducts)

  function handleIncreaseClick(productId) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count + 1
        };
      } else {
        return product;
      }
    }))
  }

  function handleDecreaseClick(productId) {
    let nextProducts = products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          count: product.count - 1
        };
      } else {
        return product;
      }
    });
    nextProducts = nextProducts.filter(p =>
      p.count > 0
    );
    setProducts(nextProducts)
  }

  return (
    <ul>
      {products.map(product => (
        <li key={product.id}>
          {product.name}
          {' '}
          (<b>{product.count}</b>)
          <button onClick={() => {
            handleIncreaseClick(product.id);
          }}>
            +
          </button>
          <button onClick={() => {
            handleDecreaseClick(product.id);
          }}>
            –
          </button>
        </li>
      ))}
    </ul>
  );
}
```

```css
button { margin: 5px; }
```

</Sandpack>

</Solution>

#### Mutasyona uğratmayan metodlar kullanarak mutasyonları düzeltin {/*fix-the-mutations-using-non-mutative-methods*/}

Bu örnekte, `App.js` dosyasındaki tüm olay yönetecileri dizileri mutasyona uğratacak metodlar kullanmaktadır. Bu nedenle, yapılacaklar listesindekileri düzenlemek ve silmek çalışmamaktadır. `handleAddTodo`, `handleChangeTodo`, ve `handleDeleteTodo` fonksiyonlarını mutasyona uğratmayan metodlar kullanarak tekrar yazın:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Yapılacak bir şey ekleyin"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Ekle</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Kaydet
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Düzenle
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Sil
      </button>
    </label>
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

`handleAddTodo` fonksiyonunda dizi spread sözdizimini kullanabilirsiniz. `handleChangeTodo` fonksiyonunda `map` metodu ile yeni bir dizi oluşturabilirsiniz. `handleDeleteTodo` fonksiyonunda `filter` metodu ile yeni bir dizi oluşturabilirsiniz. Şimdi liste doğru bir şekilde çalışmaktadır:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Yapılacak bir şey ekleyin"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Ekle</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Kaydet
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Düzenle
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Sil
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

</Solution>


#### Immer kullanarak mutasyonları düzeltin {/*fix-the-mutations-using-immer*/}

Bu örnekle bir önceki örnek aynıdır. Bu sefer Immer kullanarak mutasyonları düzeltin. Kolaylık sağlaması için, `useImmer` halihazırda içeri aktarılmıştır. Bunu kullanarak `todos` state değişkenini değiştirmeniz gerekir.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAddTodo(title) {
    todos.push({
      id: nextId++,
      title: title,
      done: false
    });
  }

  function handleChangeTodo(nextTodo) {
    const todo = todos.find(t =>
      t.id === nextTodo.id
    );
    todo.title = nextTodo.title;
    todo.done = nextTodo.done;
  }

  function handleDeleteTodo(todoId) {
    const index = todos.findIndex(t =>
      t.id === todoId
    );
    todos.splice(index, 1);
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Yapılacak bir şey ekleyin"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Ekle</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Kaydet
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Düzenle
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Sil
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

<Solution>

Immer ile, Immer'ın size verdiği `draft`'ın yalnızca bazı kısımlarını mutasyona uğrattığınız sürece mutasyon metodlarını kullanabilirsiniz. Burada tüm mutasyonlar `draft` üzerinde gerçekleştirildiği için kod çalışmaktadır:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(draft => {
      const todo = draft.find(t =>
        t.id === nextTodo.id
      );
      todo.title = nextTodo.title;
      todo.done = nextTodo.done;
    });
  }

  function handleDeleteTodo(todoId) {
    updateTodos(draft => {
      const index = draft.findIndex(t =>
        t.id === todoId
      );
      draft.splice(index, 1);
    });
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Yapılacak bir şey ekleyin"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Ekle</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Kaydet
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Düzenle
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Sil
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Immer ile mutasyona uğratan ve uğratmayan yaklaşımları beraber kullanabilirsiniz.

Örneğin, burada `handleAddTodo` fonksiyonu Immer `draft`'ı mutasyona uğratacak şekilde yazılırken, `handleChangeTodo` ve `handleDeleteTodo` fonksiyonları mutasyona uğratmayan `map` ve `filter` metodları ile yazılmıştır:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, updateTodos] = useImmer(
    initialTodos
  );

  function handleAddTodo(title) {
    updateTodos(draft => {
      draft.push({
        id: nextId++,
        title: title,
        done: false
      });
    });
  }

  function handleChangeTodo(nextTodo) {
    updateTodos(todos.map(todo => {
      if (todo.id === nextTodo.id) {
        return nextTodo;
      } else {
        return todo;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    updateTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js src/AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Yapılacak bir şey ekleyin"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Ekle</button>
    </>
  )
}
```

```js src/TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Kaydet
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Düzenle
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Sil
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
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

Immer ile her bir durum için size en doğal gelen yöntemi seçebilirsiniz.

</Solution>

</Challenges>
