---
title: Listeleri Render Etmek
---

<Intro>

Genellikle bir veri topluluğundan birden fazla bileşen göstermek isteyeceksiniz. Bir veri dizisini manipule etmek için [JavaScript dizi metodlarını](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array#) kullanabilirsiniz. Bu sayfada, React ile [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) ve [`map()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/map) metodlarını kullanarak bir veri dizisini filtreleyecek ve bir bileşen dizisine dönüştüreceksiniz.

</Intro>

<YouWillLearn>

* Javascript'in `map()` metodunu kullanarak bir diziden nasıl bileşenler oluşturulur? 
* Javascript'in `filter()` metodunu kullanarak yalnızca belirli bileşenler nasıl oluşturulur?
* React anahtarlarını ne zaman ve neden kullanmalı?

</YouWillLearn>

## Dizilerden veri render etmek {/*rendering-data-from-arrays*/}

Aşağıdaki gibi bir içerik listeniz olduğunu düşünelim.

```js
<ul>
  <li>Creola Katherine Johnson: mathematician</li>
  <li>Mario José Molina-Pasquel Henríquez: chemist</li>
  <li>Mohammad Abdus Salam: physicist</li>
  <li>Percy Lavon Julian: chemist</li>
  <li>Subrahmanyan Chandrasekhar: astrophysicist</li>
</ul>
```

Bu liste öğeleri arasındaki tek fark içerikleri, verileridir. Arayüzler oluştururken farklı veriler kullanan aynı bileşenin birkaç örneğini göstermeniz gerekebilir: yorum listelerinden profil resimleri galerilerine kadar. Bu gibi durumlarda, gerekli verileri Javascript objeleri ve dizilerinde saklayabilir ve [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) ve [`filter()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) gibi metodları kullanarak bu verilerden bileşen listeleri oluşturabilirsiniz.

Aşağıdaki kısa örnekte bir diziden nasıl öğe listesi oluşturulduğunu görebilirsiniz. 


1. **Aktar** veriyi bir dizi içine: 

```js
const people = [
  'Creola Katherine Johnson: mathematician',
  'Mario José Molina-Pasquel Henríquez: chemist',
  'Mohammad Abdus Salam: physicist',
  'Percy Lavon Julian: chemist',
  'Subrahmanyan Chandrasekhar: astrophysicist'
];
```

2. **Map** metodu ile `people` üyelerini `listItems` adında yeni bir JSX node dizisiyle eşleştirin:

```js
const listItems = people.map(person => <li>{person}</li>);
```

3. **Döndür** `<ul>` ile sarılmış bileşeninizden `listItems`:

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

Uyarı: Bir listedeki her alt elemanın benzersiz bir "anahtar" prop'u olmalıdır.

</ConsoleBlock>

Bu hatayı daha sonra bu sayfada nasıl düzelteceğinizi öğreneceksiniz. Buna gelmeden önce, verilerinize biraz yapı ekleyelim.

## Öğe dizilerini filtreleme {/*filtering-arrays-of-items*/}

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

Diyelim ki sadece mesleği `'chemist'` olan kişileri göstermenin bir yolunu istiyorsunuz. Javacript'in `filter()` metodunu kullanarak yalnızca bu kişileri döndürebilirsiniz. Bu yöntem, bir öğe dizisini alır, onları bir "testten" (`doğru` veya `yanlış` döndüren bir test) geçirir ve yalnızca testi geçen (`doğru` olarak döndürülen) öğelerden oluşan yeni bir dizi döndürür.

Sadece mesleği `'chemist'` olan kişileri istiyorsunuz. Bunun için "test" fonksiyonu `(person) => person.profession === 'chemist'` şeklindedir. Bunu nasıl bir araya getireceğiniz aşağıda gösterilmiştir:

1. Sadece "kimyacı" mesleğindeki insanlardan yeni bir `chemists` dizisi **oluştur**, bunun için `filter()` metodu `people` dizisinde `person.profession === 'chemist'` şeklinde kullanılır:

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

```js App.js
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

```js data.js
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

```js utils.js
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

Ok fonksiyonları, "=>" ifadesinden hemen sonra ifadeyi hemen döndürür, böyle bir `return` ifadesine ihtiyacınız olmaz:


```js
const listItems = chemists.map(person =>
  <li>...</li> // Implicit return!
);
```

Ancak, **`=>` ifadesinden sonra `{` parentezi kullandıysanız, `return` ifadesini yazmak zorundasınız**

```js
const listItems = chemists.map(person => { // Curly brace
  return <li>...</li>;
});
```

`=> {` içeren ok fonksiyonların bir ["blok gövdesi".](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body) olduğu söylenir. Ok fonksiyonları tek bir kod satırından daha fazlasını yazmanıza olanak verir ancak `return` ifadesini yazmanız gerekmektedir. Eğer unutursanız, fonksiyonunuz geri hiçbir şey döndürmez!

</Pitfall>

## `anahtar` ile liste öğelerini sıralı tutmak {/*keeping-list-items-in-order-with-key*/}

Yukarıdaki tüm sandboxların konsolda bir hata gösterdiğine dikkat edin:

<ConsoleBlock level="error">

Uyarı: Bir listedeki her alt elemanın benzersiz bir "anahtar" prop'u olmalıdır.

</ConsoleBlock>

Herbir dizi öğesine bir `anahtar` vermelisiniz -- dizideki herbir öğeyi birbirinden ayırt edecek şekilde o öğeye bir string ya da numara vermeniz gerekmektedir:

```js
<li key={person.id}>...</li>
```

<Note>

Her `map()` metodu kullanıldığında JSX elementleri bir anahtara ihtiyaç duyar.

</Note>

Anahtarlar, React'e her bir bileşenin hangi dizi öğesine karşılık geldiğini söylerek React'in daha sonra bu öğeleri eşleştirmesini sağlar. Bu durum, eğer dizi öğeleriniz yer değiştiriyorsa (örneğin sıralaması değişiyorsa), yeni öğeler eklenip veya çıkartılabiliyorsa daha önemli bir hale gelir. İyi seçilmiş bir `anahtar` React'in değişen öğelerde ne olduğunu anlamasına ve DOM ağacında doğru güncellemeleri yapmasına yardımcı olur.

Anında anahtar oluşturmak yerine, anahtarları verilerinize dahil etmelisiniz:

<Sandpack>

```js App.js
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

```js data.js active
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

```js utils.js
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

Kısa [`<>...</>` Fragment](/reference/react/Fragment) syntax'ı bir anahtar belirlemenize izin vermez, bu nedenle tüm elementleri bir `<div>` elementi içinde gruplandırmanız ya da daha uzun olan [`<Fragment>` syntax'i](/reference/react/Fragment#rendering-a-list-of-fragments) kullanmalısınız.

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

Fragmentler DOM'dan kaybolur, bu nedenle `<h1>`, `<p>`, `<h1>`, `<p>` gibi elementlerden oluşan düz bir liste oluşturulur.

</DeepDive>

### `anahtar` nereden gelir {/*where-to-get-your-key*/}

Farklı veri kaynakları, farklı anahtar kaynakları sağlar:

* **Veritabanından gelen veri:** Eğer veriniz bir veritabanından geliyorsa, doğasında ötürü zaten benzersiz olan veritabanı anahtarları/ID'leri kullanılabilir.
* **Yerel olarak oluşturulmuş veriler:** Eğer veriniz yerel olarak oluşturuluyor ve saklanıyorsa (örneğin not alma aplikasyonundaki notlar), sıralı olarak artan numaralar [`crypto.randomUUID()`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID) ya da [`uuid`](https://www.npmjs.com/package/uuid) gibi bir paket kullanabilirsiniz.

### Anahtarların kuralları {/*rules-of-keys*/}

* **Anahtarl kardeşler arasında benzersiz olmalıdır.** Ancak, _different_ dizilerdeki JSX node'ları için aynı anahtarları kullanmakta bir sakınca yoktur.
* **Anahtarlar değişmemelidir.** yoksa bu anahtarların bütün amacını bozar! Anahtarları render etme sırasında üretmeyiniz.

### React neden anahtarlara ihtiyaç duyar? {/*why-does-react-need-keys*/}

Masaüstünüzdeki dosyaların isimlerinin olmadığını düşünün. Imagine that files on your desktop didn't have names. Bunun yerine, dosyalara sıralarına göre refere edersiniz -- ilk dosya, ikinci dosya gibi. Bu sisteme alışabilirsiniz ama bir dosyayı sildiğiniz zaman durum kafa karıştırıcı bir hale gelirdi. İkinci dosya birinci, üçüncü dosya ise ikinci dosya olurdu gibi.

Dosya isimleri de dizilerdeki JSX anahtarları aynı amaca hizmet etmektedir. Anahtarlar, kardeşleri arasında bir öğeyi benzersiz bir şekilde tanımlamamıza olanak sağlar. İyi seçilmiş bir anahtar, dizi içindeki pozisyondan daha fazla bilgi sağlar. Öğenin _position_ yeniden sıralama nedeniyle değişse bile, `anahtar` React'in öğeyi döngü boyunca tanımasını sağlar.

<Pitfall>

Anahtar olarak dizideki bir öğenin dizinini kullanmak isteyebilirsiniz. Aslında, hiç bir `anahtar` belirtmezseniz React'in kullanacağı anahtar budur. Ancak, bir öğe eklenirse, silinirse veya dizi yeniden sıralanırsa, öğeleri oluşturma sıranız zaman içinde değişecektir. Bir anahtar olarak dizin, genellikle gizli ve kafa karıştırıcı hatalara yol açar.

Benzer şekilde, anahtarları o anda oluşturmayın, örneğin `anahtar={Math.random()}` ile oluşturulan anahtarlar. Bu, anahtarların render etmeler arasında eşleşmemesine neden olarak tüm bileşenlerinizin ve DOM'un her seferinde yeniden oluşturulmasına yol açar. Bu sadece yavaş olmakla kalmaz, aynı zamanda liste öğeleri içindeki herhangi bir kullanıcı girdisini de kaybeder. Bunun yerine, verilere dayalı sabit bir ID kullanılmalıdır.

Bileşenlerinizin prop olarak `anahtar` almayacağını unutmayın. Yalnıcaz React'in kendisi tarafından bir işaret olarak kullanılırlar. Eğer bileşeninizin bir ID'ye ihtiyacı varsa, ID'yi ayrı bir prop olarak şu şekilde kullanabilirsiniz: `<Profile key={id} userId={id} />`.

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

```js App.js
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

```js data.js
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

```js utils.js
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

```js App.js
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

```js data.js
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

```js utils.js
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

```js App.js
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

```js data.js
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

```js utils.js
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

```js App.js
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

```js data.js
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

```js utils.js
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

```js App.js
import { recipes } from './data.js';

export default function RecipeList() {
  return (
    <div>
      <h1>Recipes</h1>
    </div>
  );
}
```

```js data.js
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

```js App.js
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

```js data.js
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

Her bir `recipes` zaten bir `id` değerine sahip, bu yüzden dışardaki döngü bu değeri `anahtar` olarak kullanmakta. İçindekiler kısmındaki döngü için kullanabiliceğimiz bir ID değerine sahip değiliz. Ancak, bir malzeme aynı tarif içinde iki defa bulunmayacağından  dolayı, malzemenin ismini `anahtar` olarak kullanmakta bir sakınca yoktur. Alternatif olarak, veri yapısını ID'ler olacak şekilde değiştirebilir ya da dizini `anahtar` olarak kullanabiliriz (malzemeleri güvenli bir şekilde yeniden sıralayamayacağımız uyarısıyla).

</Solution>

#### Extracting a list item component {/*extracting-a-list-item-component*/}

This `RecipeList` component contains two nested `map` calls. To simplify it, extract a `Recipe` component from it which will accept `id`, `name`, and `ingredients` props. Where do you place the outer `key` and why?

<Sandpack>

```js App.js
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

```js data.js
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

You can copy-paste the JSX from the outer `map` into a new `Recipe` component and return that JSX. Then you can change `recipe.name` to `name`, `recipe.id` to `id`, and so on, and pass them as props to the `Recipe`:

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

```js data.js
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

Here, `<Recipe {...recipe} key={recipe.id} />` is a syntax shortcut saying "pass all properties of the `recipe` object as props to the `Recipe` component". You could also write each prop explicitly: `<Recipe id={recipe.id} name={recipe.name} ingredients={recipe.ingredients} key={recipe.id} />`.

**Note that the `key` is specified on the `<Recipe>` itself rather than on the root `<div>` returned from `Recipe`.** This is because this `key` is needed directly within the context of the surrounding array. Previously, you had an array of `<div>`s so each of them needed a `key`, but now you have an array of `<Recipe>`s. In other words, when you extract a component, don't forget to leave the `key` outside the JSX you copy and paste.

</Solution>

#### List with a separator {/*list-with-a-separator*/}

This example renders a famous haiku by Katsushika Hokusai, with each line wrapped in a `<p>` tag. Your job is to insert an `<hr />` separator between each paragraph. Your resulting structure should look like this:

```js
<article>
  <p>I write, erase, rewrite</p>
  <hr />
  <p>Erase again, and then</p>
  <hr />
  <p>A poppy blooms.</p>
</article>
```

A haiku only contains three lines, but your solution should work with any number of lines. Note that `<hr />` elements only appear *between* the `<p>` elements, not in the beginning or the end!

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

(This is a rare case where index as a key is acceptable because a poem's lines will never reorder.)

<Hint>

You'll either need to convert `map` to a manual loop, or use a fragment.

</Hint>

<Solution>

You can write a manual loop, inserting `<hr />` and `<p>...</p>` into the output array as you go:

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

  // Fill the output array
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
  // Remove the first <hr />
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

Using the original line index as a `key` doesn't work anymore because each separator and paragraph are now in the same array. However, you can give each of them a distinct key using a suffix, e.g. `key={i + '-text'}`.

Alternatively, you could render a collection of fragments which contain `<hr />` and `<p>...</p>`. However, the `<>...</>` shorthand syntax doesn't support passing keys, so you'd have to write `<Fragment>` explicitly:

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

Remember, fragments (often written as `<> </>`) let you group JSX nodes without adding extra `<div>`s!

</Solution>

</Challenges>
