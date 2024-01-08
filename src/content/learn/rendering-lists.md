---
title: Listeleri Render Etmek
---

<Intro>

Genellikle bir veri topluluğundan birden fazla benzer bileşen göstermek isteyeceksiniz. Bir veri dizisini manipule etmek için [JavaScript dizi metodlarını](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) kullanabilirsiniz. Bu sayfada, React ile [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) ve [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) metodlarını kullanarak bir veri dizisini filtreleyecek ve bir bileşen dizisine dönüştüreceksiniz.

</Intro>

<YouWillLearn>

* Javascript'in `map()` metodunu kullanarak bir diziden nasıl bileşenler oluşturulur? 
* Javascript'in `filter()` metodunu kullanarak yalnızca belirli bileşenler nasıl oluşturulur?
* React anahtarlarını ne zaman ve neden kullanmalıyız?

</YouWillLearn>

## Dizilerden veri render etmek {/*rendering-data-from-arrays*/}

Aşağıdaki gibi bir listeniz olduğunu düşünelim.

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

Bu liste öğeleri arasındaki tek fark içerikleri, verileridir. Arayüzler oluştururken farklı veriler kullanan aynı bileşenin birkaç örneğini göstermeniz gerekebilir: yorum listeleri ya da profil resimleri galerileri gibi. Bu gibi durumlarda, gerekli verileri Javascript objeleri ve dizilerinde saklayabilir ve [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) ve [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) gibi metodları kullanarak bu verilerden bileşen listeleri oluşturabilirsiniz.

Aşağıdaki kısa örnekte bir diziden nasıl öğe listesi oluşturulduğunu görebilirsiniz. 


1. Verinizi bir dizi içine **aktarın**: 

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. **Map** metodu ile `people` üyelerini `listItems` adında yeni bir JSX node dizisine atayın:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **Return** ifadesini kullanarak `<ul>` elementi içinde `listItems`'ı döndürün:

```js
return <ul>{listItems}</ul>;
```

İşte sonuç:

<Sandpack>

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];

export default function List() {
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}
```

```css
li { margin-bottom: 10px; }
```

</Sandpack>

Yukarıdaki sandbox'un bir konsol hatası gösterdiğine dikkat edin:

<ConsoleBlock level="error">

Uyarı: Bir listedeki her alt elemanın benzersiz bir "key" ("anahtar") prop'u olmalıdır.

</ConsoleBlock>

Bu hatayı daha sonra bu sayfada nasıl düzelteceğinizi öğreneceksiniz. Buna gelmeden önce, verilerinize biraz yapı ekleyelim.

## Bir diziyi filtreleme {/*filtering-arrays-of-items*/}

Bu veriler daha da yapılandırılabilir.

```js
const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
}, {
  name: 'Percy Lavon Julian',
  profession: 'chemist',  
}, {
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
}];
```

Diyelim ki sadece mesleği `'chemist'` olan kişileri göstermenin bir yolunu istiyorsunuz. Javacript'in `filter()` metodunu kullanarak yalnızca bu kişileri döndürebilirsiniz. Bu yöntem, bir diziyi alır, onları bir "testten" (`doğru` veya `yanlış` döndüren bir test) geçirir ve yalnızca testi geçen (`doğru` olarak döndürülen) öğelerden oluşan yeni bir dizi oluşturur.

Sadece mesleği `'chemist'` olan kişileri istiyorsunuz. Bunun için "test" fonksiyonu `(person) => person.profession === 'chemist'` şeklindedir. Bunu nasıl bir araya getireceğiniz aşağıda gösterilmiştir:

1. Sadece "chemist" mesleğindeki insanlardan yeni bir `chemists` dizisi **oluştur**, bunun için `filter()` metodunu `people` dizisinde `person.profession === 'chemist'` şeklinde kullanabilirsin:

```js
const chemists = people.filter(person =>
  person.profession === 'chemist'
);
```

2. Şimdi `chemists` dizisinde **map** metodu kullanılır:

```js {1,13}
const listItems = chemists.map(person =>
  <li>
     <img
       src={getImageUrl(person)}
       alt={person.name}
     />
     <p>
       <b>{person.name}:</b>
       {' ' + person.profession + ' '}
       known for {person.accomplishment}
     </p>
  </li>
);
```

3. Son olarak, bileşeninizden `listItems` **döndürülür**:

```js
return <ul>{listItems}</ul>;
```

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const listItems = chemists.map(person =>
    <li>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Pitfall>

Ok fonksiyonları, "=>" ifadesinden sonra ifadeyi hemen döndürür, böylece bir `return` ifadesine ihtiyacınız olmaz:


```js
const listItems = chemists.map(person =>
  <li>...</li> // Implicit return!
);
```

Ancak, **`=>` ifadesinden sonra `{` parentezini kullandıysanız, `return` ifadesini yazmak zorundasınız**

```js
const listItems = chemists.map(person => { // Curly brace
  return <li>...</li>;
});
```

`=> {` içeren ok fonksiyonların bir ["blok gövdesi".](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) olduğu söylenir. Ok fonksiyonları tek bir kod satırından daha fazlasını yazmanıza olanak verir ancak `return` ifadesini yazmanız gerekmektedir. Eğer unutursanız, fonksiyonunuz geri hiçbir şey döndürmez!

</Pitfall>

## `key` (`anahtar`) prop'u ile liste öğelerini sıralı şekilde tutmak {/*keeping-list-items-in-order-with-key*/}

Yukarıdaki tüm sandbox'ların konsolda bir hata gösterdiğine dikkat edin:

<ConsoleBlock level="error">

Uyarı: Bir listedeki her alt elemanın benzersiz bir "key" ("anahtar") prop'u olmalıdır.

</ConsoleBlock>

Her bir dizi öğesine bir `key` (`anahtar`) vermelisiniz -- dizideki her bir öğeyi birbirinden ayırt edecek şekilde o öğeye bir string ya da numara vermeniz gerekmektedir:

```js
<li key={person.id}>...</li>
```

<Note>

Her `map()` metodu kullanıldığında JSX elementleri bir anahtara ihtiyaç duyar.

</Note>

Anahtarlar, React'e her bir bileşenin hangi dizi öğesine karşılık geldiğini söylerek React'in daha sonra bu öğeleri eşleştirmesini sağlar. Bu durum, eğer dizi öğeleriniz yer değiştiriyorsa (örneğin sıralaması değişiyorsa), yeni öğeler eklenip veya çıkartılabiliyorsa daha önemli bir hale gelir. İyi seçilmiş bir `anahtar` React'in değişen öğelerde ne olduğunu anlamasına ve DOM ağacında doğru güncellemeleri yapmasına yardımcı olur.

Anında anahtar oluşturmak yerine, anahtarları verilerinize dahil etmelisiniz:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}</b>
          {' ' + person.profession + ' '}
          known for {person.accomplishment}
      </p>
    </li>
  );
  return <ul>{listItems}</ul>;
}
```

```js src/data.js active
export const people = [{
  id: 0, // JSX için anahtar olarak kullanılır
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1, // JSX için anahtar olarak kullanılır
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2, // JSX için anahtar olarak kullanılır
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3, // JSX için anahtar olarak kullanılır
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4, // JSX için anahtar olarak kullanılır
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li { 
  margin-bottom: 10px; 
  display: grid; 
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<DeepDive>

#### Her liste öğesi için birkaç DOM node'u göstermek {/*displaying-several-dom-nodes-for-each-list-item*/}

Her öğenin bir değil birkaç DOM node'u render etmesi gerektiğinde ne yaparsınız?

Kısa [`<>...</>` Fragment](/reference/react/Fragment) syntax'ı bir key (anahtar) prop'u belirlemenize izin vermez, bu nedenle tüm elementleri bir `<div>` elementi içinde gruplandırmanız ya da daha uzun olan [`<Fragment>` syntax'i](/reference/react/Fragment#rendering-a-list-of-fragments) kullanmalısınız.

```js
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);
```

Fragmentler DOM'dan kaybolur, bu nedenle geriye sadece `<h1>`, `<p>`, `<h1>`, `<p>` gibi elementler kalacaktır.

</DeepDive>

### `anahtar` nereden gelir {/*where-to-get-your-key*/}

Farklı veri kaynakları, farklı anahtar kaynakları sağlar:

* **Veritabanından gelen veri:** Eğer veriniz bir veritabanından geliyorsa, doğasından ötürü zaten benzersiz olan veritabanı anahtarları/ID'leri kullanılabilir.
* **Yerel olarak oluşturulmuş veriler:** Eğer veriniz yerel olarak oluşturuluyor ve saklanıyorsa (örneğin not alma aplikasyonundaki notlar), sıralı olarak artan numaralar [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) ya da [`uuid`](https://www.npmjs.com/package/uuid) gibi bir paket kullanabilirsiniz.

### Anahtarların kuralları {/*rules-of-keys*/}

* **Anahtarlar kardeşler arasında benzersiz olmalıdır.** Ancak, _farklı_ dizilerdeki JSX node'ları için aynı anahtarları kullanmakta bir sakınca yoktur.
* **Anahtarlar değişmemelidir.** yoksa bu anahtarların bütün amacını bozar! Anahtarları render etme sırasında üretmeyiniz.

### React neden anahtarlara ihtiyaç duyar? {/*why-does-react-need-keys*/}

Masaüstünüzdeki dosyaların isimlerinin olmadığını düşünün. Bunun yerine, dosyalara sıralarına göre referans edersiniz -- ilk dosya, ikinci dosya gibi. Bu sisteme alışabilirsiniz ama bir dosyayı sildiğiniz zaman durum kafa karıştırıcı bir hale gelecektir. İkinci dosya birinci, üçüncü dosya ise ikinci dosya olurdu gibi.

Dosya isimleri de dizilerdeki JSX anahtarları gibi aynı amaca hizmet etmektedir. Anahtarlar, kardeşleri arasında bir öğeyi benzersiz bir şekilde tanımlamamıza olanak sağlar. İyi seçilmiş bir anahtar, dizi içindeki pozisyondan daha fazla bilgi sağlar. Örneğin _sıra_ yeniden sıralama nedeniyle değişse bile, `anahtar` React'in öğeyi döngü boyunca tanımasını sağlar.

<Pitfall>

Anahtar olarak dizideki bir öğenin indeksini kullanmak isteyebilirsiniz. Aslında, hiç bir `key` (`anahtar`) belirtmezseniz React'in kullanacağı anahtar bu olacaktır. Ancak, bir öğe eklenirse, silinirse veya dizi yeniden sıralanırsa, öğeleri oluşturma sıranız zaman içinde değişecektir. Bir anahtar olarak indeksi kullanmak, genellikle gizli ve kafa karıştırıcı hatalara yol açar.

Benzer şekilde, anahtarları o anda oluşturmayın, örneğin `key={Math.random()}` ile oluşturulan anahtarlar. Bu, anahtarların render etmeler arasında eşleşmemesine neden olarak tüm bileşenlerinizin ve DOM'un her seferinde yeniden oluşturulmasına yol açar. Bu sadece yavaş olmakla kalmaz, aynı zamanda liste öğeleri içindeki herhangi bir kullanıcı girdisini de kaybeder. Bunun yerine, verilere dayalı sabit bir ID kullanılmalıdır.

Bileşenlerinizin prop olarak `key` (`anahtar`) almayacağını unutmayın. Yalnıcaz React'in kendisi tarafından bir işaret olarak kullanılırlar. Eğer bileşeninizin bir ID'ye ihtiyacı varsa, ID'yi ayrı bir prop olarak şu şekilde kullanabilirsiniz: `<Profile key={id} userId={id} />`.

</Pitfall>

<Recap>

Bu sayfada şunları öğrendiniz:

* Verileri bileşenlerin dışına, diziler ve objeler gibi veri yapılarına taşıma.
* JavaScript'in `map()` metodu ile benzer bileşen setleri oluşturma.
* JavaScript'in `filter()` metodu ile filterenmiş öğe dizileri oluşturma.
* React'in, konumları ya da verileri değişse bile her bir koleksiyondaki her bileşeni takip edebilmesi için `anahtar` neden ve nasıl kullanılır. 

</Recap>



<Challenges>

#### Bir listeyi ikiye bölme {/*splitting-a-list-in-two*/}

Bu örnek tüm insanların bir listesini göstermektedir.

Örneği birbiri ardına iki ayrı liste gösterecek şekilde değiştirin: **Chemists** ve **Everyone Else.** Daha önce yaptığımız gibi, bir insanın "chemist" olup olmadığını `person.profession === 'chemist'` ifadesi ile tespit edebilirsiniz.

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <img
        src={getImageUrl(person)}
        alt={person.name}
      />
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        known for {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

<Solution>

`filter()` metodunu iki defa kullanıp iki farklı dizi oluşturabilir ardından `map` metodunu kullanabilirsiniz:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <h2>Chemists</h2>
      <ul>
        {chemists.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
      <h2>Everyone Else</h2>
      <ul>
        {everyoneElse.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Bu çözümde, `map` metodu doğrudan üst `<ul>` elementinin satır içine yerleştirilebilir, ancak daha okunabilir olmasını istiyorsanız yeni değişkenler kullanabilirsiniz.

Render edilmiş listeler arasında hala bazı tekrarlamalar mevcut. Çözümü biraz daha ileri götürmek isterseniz tekrar eden bölümleri yeni bir `<ListSection>` bileşenine aktarabilirsiniz:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  const chemists = people.filter(person =>
    person.profession === 'chemist'
  );
  const everyoneElse = people.filter(person =>
    person.profession !== 'chemist'
  );
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

Çok dikkatli bir okuyucu, iki defa `filter` metodunu kullanmak her kişinin mesleğinin iki defa kontrol edilmesine sebep olacağını görmüştür. Bir özelliği kontrol etmek çok hızlıdır, bu nedenle bu örnek bir sorun yaratmayacaktır. Ancak kullandığınız mantığın hesaplanması pahalıysa `filter` metodunu, dizileri manuel olarak oluşturan ve her kişiyi bir kez kontrol eden bir döngü ile değiştirebilirsiniz.

Aslında, eğer `people` hiç değişmiyorsa, bu kodu bileşeninizden çıkarabilirsiniz. React'in perspektifine göre, önemli olan tek şey sonunda React'e bir dizi JSX node'u vermenizdir. React diziyi nasıl ürettiğiniz ile ilgilenmez:

<Sandpack>

```js src/App.js
import { people } from './data.js';
import { getImageUrl } from './utils.js';

let chemists = [];
let everyoneElse = [];
people.forEach(person => {
  if (person.profession === 'chemist') {
    chemists.push(person);
  } else {
    everyoneElse.push(person);
  }
});

function ListSection({ title, people }) {
  return (
    <>
      <h2>{title}</h2>
      <ul>
        {people.map(person =>
          <li key={person.id}>
            <img
              src={getImageUrl(person)}
              alt={person.name}
            />
            <p>
              <b>{person.name}:</b>
              {' ' + person.profession + ' '}
              known for {person.accomplishment}
            </p>
          </li>
        )}
      </ul>
    </>
  );
}

export default function List() {
  return (
    <article>
      <h1>Scientists</h1>
      <ListSection
        title="Chemists"
        people={chemists}
      />
      <ListSection
        title="Everyone Else"
        people={everyoneElse}
      />
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
  accomplishment: 'spaceflight calculations',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
  accomplishment: 'discovery of Arctic ozone hole',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'physicist',
  accomplishment: 'electromagnetism theory',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'chemist',
  accomplishment: 'pioneering cortisone drugs, steroids and birth control pills',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrophysicist',
  accomplishment: 'white dwarf star mass calculations',
  imageId: 'lrWQx8l'
}];
```

```js src/utils.js
export function getImageUrl(person) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    's.jpg'
  );
}
```

```css
ul { list-style-type: none; padding: 0px 10px; }
li {
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 20px;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
```

</Sandpack>

</Solution>

#### Bir bileşende iç içe geçmiş listeler {/*nested-lists-in-one-component*/}

Bu diziden bir tarif listesi yapın! Dizideki her bir tarif için tarifin ismini `<h2>` olarak gösterin ve içindekiler kısmını `<ul>` ile gösterin.

<Hint>

Bunu yapmak için iki `map` metodunu iç içe kullanmalısınız.

</Hint>

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Problemi çözmenin bir yolu şu şekildeydi:

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Her bir `recipes` zaten bir `id` değerine sahip, bu yüzden dışardaki döngü bu değeri `key` (`anahtar`) olarak kullanmakta. İçindekiler kısmındaki döngü için kullanabiliceğimiz bir ID değerine sahip değiliz. Ancak, bir malzeme aynı tarif içinde iki defa bulunmayacağından  dolayı, malzemenin ismini `anahtar` olarak kullanmakta bir sakınca yoktur. Alternatif olarak, veri yapısını ID'ler olacak şekilde değiştirebilir ya da indeksi `key` (`anahtar`) olarak kullanabiliriz (malzemeleri güvenli bir şekilde yeniden sıralayamayacağımız uyarısıyla).

</Solution>

#### Bir liste öğesi bileşeni çıkarma {/*extracting-a-list-item-component*/}

`RecipeList` bileşeni iç içe iki defa `map` metodunu kullanmaktadır. Bu işlemi basitleştirmek için, `id`, `name`, ve `ingredients` prop'larını alacak olan yeni bir `Recipe` bileşeni oluşturun. Dıştaki `anahtar`'ı nereye ve neden yerleştirirsiniz?

<Sandpack>

```js src/App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <div key={recipe.id}>
          <h2>{recipe.name}</h2>
          <ul>
            {recipe.ingredients.map(ingredient =>
              <li key={ingredient}>
                {ingredient}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

<Solution>

Dıştaki `map` metodundaki JSX'i yeni bir `Recipe` bileşenine kopyalayıp yapıştırabilir ve bu JSX'i geri döndürebilirsiniz. Daha sonra `recipe.name`'i `name`'e, `recipe.id`'yi  `id`'ye dönüştürüp prop olarak `Recipe` bileşenine aktarabilirsiniz:

<Sandpack>

```js
import { recipes } from './data.js';

function Recipe({ id, name, ingredients }) {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map(ingredient =>
          <li key={ingredient}>
            {ingredient}
          </li>
        )}
      </ul>
    </div>
  );
}

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
      {recipes.map(recipe =>
        <Recipe {...recipe} key={recipe.id} />
      )}
    </div>
  );
}
```

```js src/data.js
export const recipes = [{
  id: 'greek-salad',
  name: 'Greek Salad',
  ingredients: ['tomatoes', 'cucumber', 'onion', 'olives', 'feta']
}, {
  id: 'hawaiian-pizza',
  name: 'Hawaiian Pizza',
  ingredients: ['pizza crust', 'pizza sauce', 'mozzarella', 'ham', 'pineapple']
}, {
  id: 'hummus',
  name: 'Hummus',
  ingredients: ['chickpeas', 'olive oil', 'garlic cloves', 'lemon', 'tahini']
}];
```

</Sandpack>

Burada, `<Recipe {...recipe} key={recipe.id} />` syntax'ı `recipe` objesinin tüm özelliklerini `Recipe` bileşenine prop olarak aktarmanın kısa bir yoludur. Ayrıca her bir prop'u açıkça şu şekilde yazabilirsiniz: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**`key`'in (`anahtar`) `Recipe`'den döndürülen root `<div>` yerine `<Recipe>` üzerinde kullanıldığına dikkat edin.** Bunun nedeni, `anahtar`'ın doğrudan çevreleyen dizi bağlamında gerekli olmasıdır. Önceden, bir `<div>` diziniz vardı, dolayısıyla her birinin bir `anahtar`'a ihtiyacı vardı. Ancak artık bir `<Recipe>` diziniz var. Diğer bir deyişle, yeni bir bileşen çıkarttığınız zaman, `anahtar`'ı kopyalayıp yapıştırdığınız JSX'in dışında bırakmayı unutmayın.

</Solution>

#### Ayraç içeren liste {/*list-with-a-separator*/}

Bu örnek, Katsushika Hokusai'nin her satırı `<p>` elementi içinde olacak şekilde yazılmış ünlü bir haiku'sunu göstermektedir. Bizim görevimiz, her paragrafın arasına gelecek bir `<hr />` ayırıcı elementi eklemektir. Ortaya şöyle bir yapı çıkmalıdır:

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

Bir haiku yalnızca üç satır içerir ancak yapacağınız çözüm herhangi bir sayıda satırla da çalışmalıdır. `<hr />` elementinin `<p>` elementinin yalnızca *arasında* olduğuna, başında ya da sonunda olmadığına dikkat edin!

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

(Burası indeksi anahtar olarak kullanmakta sakınca olmadağı nadir durumlardan biridir çünkü şiirin satırlarının yerleri hiçbir zaman değişmeyecektir.)

<Hint>

Burada `map` metodu yerine manuel bir döngü kullanmanız ya da bir Fragment kullanmanız gerekmektedir.

</Hint>

<Solution>

Output dizisine `<hr />` ve `<p>...</p>` elementleri ekleyerek manuel bir döngü yazabilirsiniz:

<Sandpack>

```js
const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  let output = [];

  // Output dizisine ekleyin
  poem.lines.forEach((line, i) => {
    output.push(
      <hr key={i + '-separator'} />
    );
    output.push(
      <p key={i + '-text'}>
        {line}
      </p>
    );
  });
  // İlk <hr /> elementi silin
  output.shift();

  return (
    <article>
      {output}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Şiirin satır indeksini `key` (`anahtar`) olarak kullanmak artık işe yaramayacaktır çünkü artık her ayraç ve paragraf aynı dizide bulunmakta. Ancak, bir sonek kullanarak her birine ayrı bir anahtar verebilirsiniz, örneğin `key={i + '-text'}`.

Alternatif olarak, `<hr />` ve `<p>...</p>` elementlerini içeren Fragment'ler render edebilirsiniz. Ancak, `<>...</>` kısa syntax'i anahtarları prop olarak alamaz bu yüzden `<Fragment>` olarak kullanmanız gerekmektedir:

<Sandpack>

```js
import { Fragment } from 'react';

const poem = {
  lines: [
    'I write, erase, rewrite',
    'Erase again, and then',
    'A poppy blooms.'
  ]
};

export default function Poem() {
  return (
    <article>
      {poem.lines.map((line, i) =>
        <Fragment key={i}>
          {i > 0 && <hr />}
          <p>{line}</p>
        </Fragment>
      )}
    </article>
  );
}
```

```css
body {
  text-align: center;
}
p {
  font-family: Georgia, serif;
  font-size: 20px;
  font-style: italic;
}
hr {
  margin: 0 120px 0 120px;
  border: 1px dashed #45c3d8;
}
```

</Sandpack>

Şunu unutmayın, Fragment'ler (`<> </>` şeklinde yazılır) fazladan `<div>`ler kullanmadan JSX node'larını gruplamanıza izin verirler.

</Solution>

</Challenges>
