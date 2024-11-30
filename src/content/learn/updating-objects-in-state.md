---
title: State içerisindeki nesneleri güncelleme
---

<Intro>

State, nesneler dahil olmak üzere herhangi bir JavaScript değerini tutabilir. Ancak React state içerisinde tuttuğunuz nesneleri direkt olarak değiştirmemelisiniz. Bunun yerine bir nesneyi güncellemek istediğinizde, yeni bir nesne oluşturmanız gerekmektedir (veya varolan bir nesnenin kopyasını oluşturmalısınız) daha sonra state'i kopyaladığınız nesneyi kullanması için ayarlamalısınız. 

</Intro>

<YouWillLearn>

- React state'i içerisinde bir nesneyi doğru şekilde güncelleyebileceksiniz.
- İç içe bir nesneyi mutasyona uğratmadan güncelleyebileceksiniz.
- Değişmezlik nedir, ve onu nasıl bozmadan sürdürebileceğinizi.
- Immer ile nesne kopyalamayı daha kolay şekilde yapabileceksiniz.

</YouWillLearn>

## Mutasyon nedir? {/*whats-a-mutation*/}

State içerisinde herhangi bir JavaScript değerini tutabilirsiniz.
```js
const [x, setX] = useState(0);
```

Şimdiye kadar sayılarla, stringlerle ve booleanlarla çalıştınız. Bu JavaScript değerleri "değişmez" veya "salt okunur" anlamına gelir.
Bir değeri _değiştirmek_ için yeniden render işlemi yapabilirsiniz. 

```js
setX(5);
```
`x` state'i `0`'ken `5` ile değiştirildi, ama _`0` sayısının kendisi_ değişmedi. JavaScript'te, sayılar, stringler ve booleanlar gibi yerleşik temel veri tiplerinde herhangi bir değişiklik yapmak mümkün değildir. 

Şimdi state içerisinde bir nesne düşünün:

```js
const [position, setPosition] = useState({ x: 0, y: 0 });
```
Teknik olarak, _nesnenin kendisinin_ içeriğini değiştirmek mümkündür. **Buna mutasyon denir:** 

```js
position.x = 5;
```

Ancak, React state içerisindeki nesneler teknik olarak değiştirilebilir olsalar da, sayılar, booleans ve dizeler gibi **sözde** değişmezmiş gibi muamele edilmelidir. Onları mutasyona uğratmak yerine, her zaman yenilerini oluşturmalısınız.

## State'i salt okunur olarak ele alın {/*treat-state-as-read-only*/}

Başka bir deyişle, **State içerisine koyduğunuz herhangi bir JavaScript nesnesini salt okunur olarak ele almalısınız.**

Bu örnek, mevcut imlec pozisyonunu temsil eden bir nesneyi state içerisinde tutar. Kırmızı nokta, siz önizleme alanına dokunduğunuzda veya imleci üzerinde hareket ettirdiğinizde hareket etmesi gerekir. Ancak nokta başlangıç pozisyonunda kalıyor. 

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
        position.x = e.clientX;
        position.y = e.clientY;
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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

Problem bu kod parçacığıyla ilgili.

```js
onPointerMove={e => {
  position.x = e.clientX;
  position.y = e.clientY;
}}
```

Bu kod, [önceki render](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) işleminden `position` değişkenine atanmış nesneyi değiştirir. Ancak state ayarlama fonksiyonunu kullanmadan, React bu nesnenin değiştiğini bilmez. Bu nedenle, React herhangi bir tepki vermez. Bu, yemeği yedikten sonra siparişin değiştirilmeye çalışılması gibi bir şeydir. State'in mutasyona uğratılması bazı durumlarda çalışabilir, ancak önermiyoruz. Render işleminde erişebildiğiniz state değerini salt okunur olarak ele almanız gerekir.

Bu durumda, gerçekten [yeniden render işlemini tetiklemek](/learn/state-as-a-snapshot#setting-state-triggers-renders) için, ***yeni* bir nesne oluşturun ve onu state ayarlama fonksiyonuna geçirin:**

```js
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
}}
```

`setPosition` ile, React'a şunu söylüyorsunuz:

* Bu yeni nesne ile `position`'ı değiştir
* Ve bu bileşeni tekrar render et

Dikkat edin, kırmızı nokta şimdi önizleme alanına dokunduğunuzda veya üzerine geldiğinizde imlecinizi takip ediyor:

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
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }
```

</Sandpack>

<DeepDive>

#### Yerel mutasyon sorun değildir {/*local-mutation-is-fine*/}

Bu şekildeki kod, state içerisinde *varolan* bir nesneyi değiştirdiği için bir problemdir. 

```js
position.x = e.clientX;
position.y = e.clientY;
```

Ancak bu şekildeki kod **kesinlikle sorunsuzdur** çünkü *yeni oluşturduğunuz* bir nesneyi değiştiriyorsunuz;

```js
const nextPosition = {};
nextPosition.x = e.clientX;
nextPosition.y = e.clientY;
setPosition(nextPosition);
```

Aslında, bunu yazmakla tamamen aynı anlama geliyor:

```js
setPosition({
  x: e.clientX,
  y: e.clientY
});
```

Mutasyon sadece state içerisinde zaten *mevcut olan* nesneleri değiştirdiğinizde bir problem oluşturur. Yeni oluşturduğunuz bir nesneyi değiştirmek *bu nesneye henüz başka bir kod referans vermediği* için tamamen sorunsuzdur. Nesneyi değiştirmek, nesneye bağlı olan bir şeyi yanlışlıkla etkileme olasılığını ortadan kaldıracaktır. Buna "yerel mutasyon" denir.

</DeepDive>  

## Spread sözdizimi ile nesnelerin kopyalanması {/*copying-objects-with-the-spread-syntax*/}

Önceki örnekte, `position` nesnesi her zaman mevcut imlec konumuna göre yeniden oluşturulur. Ama çoğu zaman, yeni oluşturduğunuz nesnenin bir parçası olarak *mevcut* verileri de dahil etmek isteyebilirsiniz. Örneğin, bir formda *sadece tek* bir alanı güncellemek ve diğer form alanlarının önceki değerlerini korumak isteyebilirsiniz

Bu input alanları, `onChange` yöneticileri state'in mutate olmasına neden oldukları için çalışmazlar:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    person.firstName = e.target.value;
  }

  function handleLastNameChange(e) {
    person.lastName = e.target.value;
  }

  function handleEmailChange(e) {
    person.email = e.target.value;
  }

  return (
    <>
      <label>
        Ad:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Soyad:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Örneğin, bu satır önceki bir render'dan state'i değiştirir.

```js
person.firstName = e.target.value;
```

Aradığınız davranışı elde etmek için güvenilir yol, yeni bir nesne oluşturmak ve onu `setPerson` fonksiyonuna geçirmektir. Ancak burada, ayrıca alanlardan yalnızca biri değiştiği için **mevcut verileri içine kopyalamak** istiyorsunuz:

```js
setPerson({
  firstName: e.target.value, // New first name from the input
  lastName: person.lastName,
  email: person.email
});
```

Her bir özelliği ayrı ayrı kopyalamak zorunda kalmadan `...` [nesne spread](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals) sözdizimini kullanabilirsiniz.

```js
setPerson({
  ...person, // Copy the old fields
  firstName: e.target.value // But override this one
});
```

Form şimdi çalışıyor!

Her input alanı için nasıl ayrı bir state değişkeni bildirmediğinize dikkat edin. Büyük formlar için, tüm verileri bir nesnede gruplanmış halde tutmak doğru bir şekilde güncellediğiniz sürece--çok uygundur!

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleFirstNameChange(e) {
    setPerson({
      ...person,
      firstName: e.target.value
    });
  }

  function handleLastNameChange(e) {
    setPerson({
      ...person,
      lastName: e.target.value
    });
  }

  function handleEmailChange(e) {
    setPerson({
      ...person,
      email: e.target.value
    });
  }

  return (
    <>
      <label>
        Ad:
        <input
          value={person.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Soyad:
        <input
          value={person.lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <label>
        Email:
        <input
          value={person.email}
          onChange={handleEmailChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Dikkat edilmesi gereken bir nokta, `...` spread sözdiziminin "yüzeysel" olmasıdır--yalnızca bir seviye derinliğe kadar kopyalar. Bu kopyalama işlemini hızlı yapar, ancak iç içe geçmiş bir özelliği güncellemek istiyorsanız, birden fazla kez kullanmanız gerekecektir.

<DeepDive>

#### Birden çok alan için tek bir olay yöneticisi kullanma {/*using-a-single-event-handler-for-multiple-fields*/}

Ayrıca obje tanımınızda `[` and `]` parantezlerini kullanarak dinamik isme sahip bir özellik belirleyebilirsiniz. İşte üç farklı olay işleyicisi yerine tek bir olay işleyicisi kullanan aynı örnek:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value
    });
  }

  return (
    <>
      <label>
        Ad:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Soyad:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

Burada `e.target.name`, `<input>` DOM ögesine verilen `name` özelliğine atıfta bulunur. 

</DeepDive>

## İç içe nesneleri güncelleme {/*updating-a-nested-object*/}

Bu şekilde iç içe bir nesne yapısı düşünün:

```js
const [person, setPerson] = useState({
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
});
```

Eğer `person.artwork.city` ifadesini güncellemek istiyorsanız, mutasyon ile nasıl yapılacağı açıktır:

```js
person.artwork.city = 'New Delhi';
```

Ancak React'ta, state'leri değiştirilemez olarak ele alırsınız! `city`'i değiştirmek için, ve ardından yeni `artwork`'e işaret eden yeni `person` nesnesi oluşturmanız gerekir:

```js
const nextArtwork = { ...person.artwork, city: 'New Delhi' };
const nextPerson = { ...person, artwork: nextArtwork };
setPerson(nextPerson);
```

Veya, tek bir fonksiyon çağrısı olarak yazılır:

```js
setPerson({
  ...person, // Copy other fields
  artwork: { // but replace the artwork
    ...person.artwork, // with the same one
    city: 'New Delhi' // but in New Delhi!
  }
});
```

Bu biraz uzun bir ifade, ancak birçok durum için gayet işe yarar:

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

<DeepDive>

#### Nesneler aslında iç içe değillerdir {/*objects-are-not-really-nested*/}

Bu şekilde bir nesne kodda "iç içe" gibi gözükür: 

```js
let obj = {
  name: 'Niki de Saint Phalle',
  artwork: {
    title: 'Blue Nana',
    city: 'Hamburg',
    image: 'https://i.imgur.com/Sd1AgUOm.jpg',
  }
};
```

Ancak, "iç içe yerleştirme" nesnelerin nasıl davrandığını düşünmenin yanlış bir yoludur. Kod çalıştığında, "iç içe" geçmiş nesne diye bir şey yoktur. Aslında iki farklı nesneye bakıyorsunuz:

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};
```

`obj1` nesnesi `obj2`'nin "içinde" değil. Örneğin, `obj3`'de `obj1`'e "işaret edebilir":

```js
let obj1 = {
  title: 'Blue Nana',
  city: 'Hamburg',
  image: 'https://i.imgur.com/Sd1AgUOm.jpg',
};

let obj2 = {
  name: 'Niki de Saint Phalle',
  artwork: obj1
};

let obj3 = {
  name: 'Copycat',
  artwork: obj1
};
```

`obj3.artwork.city`'i mutasyona uğratırsanız, hem `obj2.artwork.city` hem de `obj1.city` etkilenecektir. Bu, `obj3.artwork`, `obj2.artwork` ve `obj1`'in aynı nesne olduğu anlamına gelir. Nesnelerin "iç içe geçmiş" olarak düşünüldüğü zaman bu zor görülebilir. Aslında, nesneler birbirine özelliklerle "işaret eden" ayrı nesnelerdir.

</DeepDive>  

### Immer ile kısa güncelleme mantığı yazın {/*write-concise-update-logic-with-immer*/}

Eğer durumunuz derinlemesine iç içe ise, [onu düzleştirmeyi](/learn/choosing-the-state-structure#avoid-deeply-nested-state) düşünebilirsiniz. Ancak, state yapınızı değiştirmek istemiyorsanız, iç içe geçmiş spreadlere bir kısayol tercih edebilirsiniz. [Immer](https://github.com/immerjs/use-immer) popüler bir kütüphanedir ve size kolaylaştırılmış ancak mutasyona neden olan sözdizimini kullanarak yazmanıza izin verir ve kopyaları sizin için üretir. Immer ile yazdığınız kod, "kuralları yoksayıyormuş" gibi görünür, ancak aslında Immer, değişikliklerinizi tespit eder ve tamamen yeni bir nesne üretir:

```js
updatePerson(draft => {
  draft.artwork.city = 'Lagos';
});
```

Ancak normal bir mutasyonun aksine, geçmiş state'in üzerine yazmaz!

<DeepDive>

#### Immer nasıl çalışır? {/*how-does-immer-work*/}

Immer tarafından sağlanan `draft`, [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) olarak adlandırılan özel bir nesne türüdür, onunla yaptıklarınızı "kaydeder". Bu nedenle, istediğiniz kadar serbestçe mutasyona uğratabilirsiniz! Arka planda, Immer, taslağınızın hangi kısımlarının `draft` edildiğini bulur ve düzenlemelerinizi içeren tamamen yeni bir nesne oluşturur.

</DeepDive>

Immer'i denemek için:

1. Immer'i bir bağımlılık olarak eklemek için `npm install use-immer` komutunu çalıştırın
2. Daha sonra `import { useState } from 'react'` satırını `import { useImmer } from 'use-immer'` ile değiştirin

Yukarıdaki örneğin Immere çevrilmiş hali şöyledir:

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
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
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

Dikkat edin, olay işleyicileri ne kadar daha kısa hale geldi. `useState` ve `useImmer`'i tek bir bileşende istediğiniz kadar karıştırabilirsiniz. Immer, özellikle state içerisinde iç içe geçme varsa ve nesnelerin kopyalanması tekrarlayan kodlara neden oluyorsa, olay işleyicilerini kısa tutmanın harika bir yoludur.

<DeepDive>

#### React'te state'i mutasyona uğratmak neden önerilmez? {/*why-is-mutating-state-not-recommended-in-react*/}

Birkaç nedeni var:

* **Hata Ayıklama:** Eğer `console.log` kullanır ve state'i mutasyona uğratmazsanız, önceki loglarınız daha yeni state değişiklikleri tarafından silinmeyecektir. Bu sayede, renderlar arasındaki state değişimlerini açıkça görebilirsiniz.
* **Optimizasyonlar:** React'ta yaygın olarak kullanılan [optimizasyon stratejileri](/reference/react/memo), önceki props veya state ile sonraki props veya state'in aynı olması durumunda işlemleri atlamaya dayanır. Eğer state'in içeriğini hiç mutasyona uğratmazsanız, değişikliklerin olup olmadığını kontrol etmek çok hızlı olacaktır. Eğer `prevObj === obj ise`, nesne içinde hiçbir şeyin değişemeyeceğinden emin olabilirsiniz.
* **Yeni Özellikler:** Yeni React özelliklerinin kullanımı, state'in bir [anlık görüntü gibi davranması](/learn/state-as-a-snapshot) gibi işlem görmesiyle ilgilidir. Eğer state'in geçmiş versiyonlarını mutasyona uğratıyorsanız, bu yeni özellikleri kullanmanızı engelleyebilir.
* **Gerekli Değişiklikler:** Geri/İleri işlevleri, değişikliklerin geçmişini gösterme veya kullanıcının bir formu önceki değerlere sıfırlama gibi bazı uygulama özellikleri, hiçbir şeyin mutasyona uğramadığı zaman daha kolay uygulanabilir. Bu, geçmişteki state kopyalarını hafızada tutup uygun olduğunda yeniden kullanabilmenizden kaynaklanır. Değiştirici bir yaklaşımla başlarsanız, bu gibi özellikleri sonradan eklemek zor olabilir.
* **Daha Basit Uygulama:** React, nesnelerin mutasyonuna bağlı olmadığı için, nesnelerinizle özel bir işlem yapmak zorunda kalmaz.  Özelliklerini ele geçirmek, her zaman Proxilere sarmak veya diğer "reaktif" çözümler gibi başlangıçta başka işler yapmak zorunda değildir. Bu aynı zamanda, React'in ek performans veya doğruluk sorunları olmadan herhangi bir--büyüklüğü önemsiz--nesneyi state içine yerleştirmenize olanak sağladığı için,  React'in büyük nesneleri de dahil olmak üzere herhangi bir nesneyi state içine yerleştirmenize izin verdiği anlamına gelir.

Pratikte, React'ta state'leri mutasyona uğratarak genellikle problemlerden "kurtulabilirsiniz", ancak bu yaklaşım göz önünde bulundurularak geliştirilen yeni React özelliklerini kullanabilmeniz için bunu yapmamanızı şiddetle tavsiye ederiz.Gelecekteki katkı sağlayıcılar ve hatta belki siz bile gelecekteki kendinize teşekkür edeceksiniz!

</DeepDive>

<Recap>

* React içerisindeki bütün state'leri değiştirilemez olarak ele alın.
* React'ta nesneleri state içinde sakladığınızda, nesneleri mutasyona uğratmak yeniden render işlemini tetiklemez ve önceki render "anlık görüntülerindeki" state'i değiştirir.
* Bir nesneyi mutasyona uğratmak yerine, nesnenin *yeni* bir versiyonunu oluşturun, ve state'i nesneye ayarlayarak bir yeniden render oluşturun.
* Nesnenin kopyasını oluşturmak için `{...obj, something: 'newValue'}` nesne spread sözdizimini kullanabilirsiniz.
* Spread sözdizimi yüzeyseldir: yalnızca bir seviye derinliğe kadar kopyalar.
* İç içe bir nesneyi güncellemek için, güncellediğiniz yerden itibaren başlayarak bütün her şeyi kopyalamalısınız.
* Tekrarlayan kopyalama kodlarını azaltmak için Immer kullanın.

</Recap>



<Challenges>

#### Hatalı state güncellemelerini düzeltin {/*fix-incorrect-state-updates*/}

Bu formda birkaç hata var. Skoru arttıran butona birkaç kez tıklayın. Artmadığını fark edeceksiniz. Sonra adı düzenleyin ve skorun aniden değişikliklerinize "yetiştiğini" fark edeceksiniz. Son olarak, soyadını düzenleyin ve skorun tamamen kaybolduğunu fark edeceksiniz.

Göreviniz tüm bu hataları düzeltmektir. Hataları düzeltirken, bu hataların neden meydana geldiğini açıklayın.

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    player.score++;
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Skor: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Ad:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Soyad:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 10px; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Her iki hatanın da düzeltildiği bir sürüm şu şekildedir:

<Sandpack>

```js
import { useState } from 'react';

export default function Scoreboard() {
  const [player, setPlayer] = useState({
    firstName: 'Ranjani',
    lastName: 'Shettar',
    score: 10,
  });

  function handlePlusClick() {
    setPlayer({
      ...player,
      score: player.score + 1,
    });
  }

  function handleFirstNameChange(e) {
    setPlayer({
      ...player,
      firstName: e.target.value,
    });
  }

  function handleLastNameChange(e) {
    setPlayer({
      ...player,
      lastName: e.target.value
    });
  }

  return (
    <>
      <label>
        Skor: <b>{player.score}</b>
        {' '}
        <button onClick={handlePlusClick}>
          +1
        </button>
      </label>
      <label>
        Ad:
        <input
          value={player.firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Soyad:
        <input
          value={player.lastName}
          onChange={handleLastNameChange}
        />
      </label>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
```

</Sandpack>

`handlePlusClick` fonksiyonundaki sorun, `player` nesnesini mutasyona uğratmasıydı. Sonuç olarak, React, yeniden render için bir neden olduğunu bilmediği için, ekrandaki skoru güncellemedi. Bu nedenle, adı düzenlediğinizde, state güncellendi ve bir yeniden render tetiklendi, bu da _aynı zamanda_ ekran üzerindeki skoru güncelledi.

`handleLastNameChange` fonksiyonundaki sorun, mevcut `...player` alanlarını yeni nesneye kopyalamamasıydı. Bu nedenle, soyadını düzenledikten sonra puan kaybedildi.

</Solution>

#### Mutasyonu bulun ve düzeltin {/*find-and-fix-the-mutation*/}

Sabit bir arka plan üzerinde sürüklenebilir bir kutu bulunmaktadır. Select input kullanarak kutunun rengini değiştirebilirsiniz.

Ancak bir hata var. İlk olarak kutuyu hareket ettirirseniz, ve sonra rengini değiştirirseniz, arka plan (hareket etmemesi gereken!) kutunun pozisyonuna "atlayacak". Ancak bu olmamalıdır: `Background` bileşeninin `{ x: 0, y: 0 }` olan `position` propu `initialPosition` olarak ayarlanmıştır. Neden renk değişikliğinden sonra arka plan hareket ediyor? 

Hatayı bulun ve düzeltin.

<Hint>

Herhangi beklenmedik değişiklik durumunda mutasyon gerçekleşir. `App.js` dosyasında mutasyonu bulun ve düzeltin.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Beni sürükle!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Sorun, `handleMove` içerisindeki mutasyondaydı. Bu, `shape.position`'ı mutasyona uğrattı, ancak bu, `initialPosition`'ın işaret ettiği aynı nesne olduğu anlamına geliyor. Şekil ve arka planın hareket etme nedeni bu sebepledir. (Bu bir mutasyon olduğundan, başka bir güncelleme--renk değişikliği--yeniden render edilinceye kadar değişiklik ekran üzerine yansımaz)

`handleMove` fonksiyonundaki mutasyonu kaldırarak ve spread sözdizimini kullanarak şekli kopyalamanız gerekiyor. `+=` bir mutasyon olduğu için, bunu düzenli `+` ifadesini kullanarak yeniden yazmanız gerekmektedir. 

<Sandpack>

```js src/App.js
import { useState } from 'react';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    setShape({
      ...shape,
      position: {
        x: shape.position.x + dx,
        y: shape.position.y + dy,
      }
    });
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Beni sürükle!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Bir nesneyi Immer ile güncelle {/*update-an-object-with-immer*/}

Bu, önceki meydan okumadaki hatalı örnek ile aynıdır. Bu sefer, mutasyonu Immer kullanarak düzeltin. Kolaylık sağlaması için, `useImmer` sizin için içe aktarılmıştır, bu nedenle `shape` state değişkenini kullanmak için onu değiştirmelisiniz.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, setShape] = useState({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    shape.position.x += dx;
    shape.position.y += dy;
  }

  function handleColorChange(e) {
    setShape({
      ...shape,
      color: e.target.value
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Beni sürükle!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

Bu, Immer ile yeniden yazılmış çözümdür. Olay yöneticilerinin değişmiş şekilde yazıldığına dikkat edin, ancak hata meydana gelmez. Bu, Immer'in arka planda mevcut nesneleri asla değiştirmediği için gerçekleşir.

<Sandpack>

```js src/App.js
import { useImmer } from 'use-immer';
import Background from './Background.js';
import Box from './Box.js';

const initialPosition = {
  x: 0,
  y: 0
};

export default function Canvas() {
  const [shape, updateShape] = useImmer({
    color: 'orange',
    position: initialPosition
  });

  function handleMove(dx, dy) {
    updateShape(draft => {
      draft.position.x += dx;
      draft.position.y += dy;
    });
  }

  function handleColorChange(e) {
    updateShape(draft => {
      draft.color = e.target.value;
    });
  }

  return (
    <>
      <select
        value={shape.color}
        onChange={handleColorChange}
      >
        <option value="orange">orange</option>
        <option value="lightpink">lightpink</option>
        <option value="aliceblue">aliceblue</option>
      </select>
      <Background
        position={initialPosition}
      />
      <Box
        color={shape.color}
        position={shape.position}
        onMove={handleMove}
      >
        Beni sürükle!
      </Box>
    </>
  );
}
```

```js src/Box.js
import { useState } from 'react';

export default function Box({
  children,
  color,
  position,
  onMove
}) {
  const [
    lastCoordinates,
    setLastCoordinates
  ] = useState(null);

  function handlePointerDown(e) {
    e.target.setPointerCapture(e.pointerId);
    setLastCoordinates({
      x: e.clientX,
      y: e.clientY,
    });
  }

  function handlePointerMove(e) {
    if (lastCoordinates) {
      setLastCoordinates({
        x: e.clientX,
        y: e.clientY,
      });
      const dx = e.clientX - lastCoordinates.x;
      const dy = e.clientY - lastCoordinates.y;
      onMove(dx, dy);
    }
  }

  function handlePointerUp(e) {
    setLastCoordinates(null);
  }

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        width: 100,
        height: 100,
        cursor: 'grab',
        backgroundColor: color,
        position: 'absolute',
        border: '1px solid black',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: `translate(
          ${position.x}px,
          ${position.y}px
        )`,
      }}
    >{children}</div>
  );
}
```

```js src/Background.js
export default function Background({
  position
}) {
  return (
    <div style={{
      position: 'absolute',
      transform: `translate(
        ${position.x}px,
        ${position.y}px
      )`,
      width: 250,
      height: 250,
      backgroundColor: 'rgba(200, 200, 0, 0.2)',
    }} />
  );
};
```

```css
body { height: 280px; }
select { margin-bottom: 10px; }
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

</Solution>

</Challenges>