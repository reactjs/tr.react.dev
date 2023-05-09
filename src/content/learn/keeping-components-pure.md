---
title: Bileşenleri Saf Tutmak 
---

<Intro>

Bazı JavaScript fonksiyonları *saf* olarak adlandırılır. Saf fonksiyonlar sadece bir hesaplama yaparlar ve başka bir işlem gerçekleştirmezler. Bileşenlerinizi sadece saf fonksiyonlar olarak yazarak, kod tabanınız büyüdükçe ortaya çıkabilecek birçok karmaşık hatayı ve öngörülemeyen davranışları önleyebilirsiniz. Ancak, bu faydaları elde etmek için bazı kurallara uymalısınız.

</Intro>

<YouWillLearn>

* Saflık nedir ve hatalardan kaçınmanıza nasıl yardımcı olur,
* Değişiklikleri render aşaması dışında tutarak bileşenleri nasıl saf tutabileceğiniz,
* Bileşenlerinizdeki hataları bulmak için Strict Modu'u nasıl kullanacağınız.

</YouWillLearn>

## Saflık: Formüller olarak bileşenler {/*purity-components-as-formulas*/}

Bilgisayar biliminde (ve özellikle fonksiyonel programlama dünyasında), [saf bir fonksiyon](https://wikipedia.org/wiki/Pure_function) aşağıdaki özelliklere sahip fonksiyonlardır: 

* **Kendi işine bakar.** Çağrılmadan önce var olan herhangi bir nesneyi ve objeyi değiştirmez.
* **Aynı girdi, aynı çıktı.** Aynı girdiler verildiğinde, saf bir fonksiyon her zaman aynı sonucu döndürmelidir.

Saf fonksiyonların bir örneğini zaten biliyor olabilirsiniz: matematikteki formüller.

Bu formülü ele alalım: <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>.

Eğer <Math><MathI>x</MathI> = 2</Math> ise <Math><MathI>y</MathI> = 4</Math>'tür. Her zaman. 

Eğer <Math><MathI>x</MathI> = 3</Math> ise <Math><MathI>y</MathI> = 6</Math>'dır. Her zaman. 

Eğer <Math><MathI>x</MathI> = 3</Math> ise, <MathI>y</MathI> günün zamanına veya borsanın durumuna bağlı olarak bazen <Math>9</Math> ya da <Math>–1</Math> veya <Math>2.5</Math> olmaz. 

Eğer <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math> ve <Math><MathI>x</MathI> = 3</Math> ise, <MathI>y</MathI> _her zaman_ <Math>6</Math>'dır. 

Eğer bunu bir JavaScript fonksiyonuna çevirseydik, şöyle görünürdü:

```js
function double(number) {
  return 2 * number;
}
```

Yukardaki örnekte, `double` **saf bir fonksiyondur.** Fonksiyona `3` parametresini geçerseniz, `6'yı` döndürür. Her zaman.

React bu konseptin etrafında tasarlanmıştır. **React yazdığınız her bileşenin saf bir fonksiyon olduğunu varsayar.** Bu, yazdığınız React bileşenlerinin, aynı girdiler verildiğinde her zaman aynı JSX'i döndürmesi gerektiği anlamına gelir:

<Sandpack>

```js App.js
function Recipe({ drinkers }) {
  return (
    <ol>    
      <li>Boil {drinkers} cups of water.</li>
      <li>Add {drinkers} spoons of tea and {0.5 * drinkers} spoons of spice.</li>
      <li>Add {0.5 * drinkers} cups of milk to boil and sugar to taste.</li>
    </ol>
  );
}

export default function App() {
  return (
    <section>
      <h1>Spiced Chai Recipe</h1>
      <h2>For two</h2>
      <Recipe drinkers={2} />
      <h2>For a gathering</h2>
      <Recipe drinkers={4} />
    </section>
  );
}
```

</Sandpack>

`Drinkers` parametresine `{2}` değerini verip, `Recipe'ye` geçerseniz, `2 bardak su` içeren JSX'i döndürür. Her zaman.

`Drinkers` parametresine `{4}` değerini verip, `4 bardak su` içeren JSX’i döndürür. Her zaman.


Tıpkı bir matematik formülü gibi.

Bileşenlerinizi de bir tarif gibi düşünebilirsiniz: bunları takip eder ve pişirme esnasında yeni malzemeler eklemezseniz, her zaman aynı yemeği yaparsınız. Bu “yemek”, bileşenin React’e [render](/learn/render-and-commit) için sağladığı JSX’tir. 

<Illustration src="/images/docs/illustrations/i_puritea-recipe.png" alt="A tea recipe for x people: take x cups of water, add x spoons of tea and 0.5x spoons of spices, and 0.5x cups of milk" />

## Yan Etkileri: isten(mey)en sonuçlar {/*side-effects-unintended-consequences*/}

React'in render işlemi her zaman saf olmalıdır. Bileşenler yalnızca JSX'lerini *döndürmeli,* ve render işleminden önce var olan herhangi bir nesne veya değişkeni *değiştirmemelidir* - aksi takdirde bileşenler saf olmaktan çıkar!

İşte bu kuralı ihlal eden bir bileşen örneği:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup />
      <Cup />
      <Cup />
    </>
  );
}
```

</Sandpack>

Bu bileşen, kendisi dışında tanımlanmış bir `misafir` değişkenini okuyup yazıyor. Bu, bu bileşenin **birden fazla kez çağrılması farklı JSX üreteceği anlamına gelir!**  Ve daha da fazlası, _diğer_ bileşenler de `misafir` değişkenini okursa, ne zaman render edildiklerine bağlı olarak farklı JSX üreteceklerdir! Bu tahmin edilebilir değil.

<Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>  formülümüze geri dönersek, şimdi <Math><MathI>x</MathI> = 2</Math> olsa bile, <Math><MathI>y</MathI> = 4</Math>'e güvenemeyiz. Testlerimiz başarısız olabilir, kullanıcılarımız şaşkına dönebilir, uçaklar düşebilir - nasıl karışık hatalara neden olacağını görebilirsiniz!

[Bunun yerine, `misafiri` bir prop olarak geçerek](/learn/passing-props-to-a-component) bu bileşeni düzeltebilirsiniz:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaSet() {
  return (
    <>
      <Cup guest={1} />
      <Cup guest={2} />
      <Cup guest={3} />
    </>
  );
}
```

</Sandpack>

Artık bileşeniniz saf bir durumda, çünkü döndürdüğü JSX yalnızca `misafir` prop’una bağlı.

 Genel olarak, bileşenlerinizin belirli bir sırada işlenmesiniz beklememelisiniz. <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>'i, <Math><MathI>y</MathI> = 5<MathI>x</MathI></Math>'ten önce veya sonra çağırmanız farketmez: Her iki formül de birbirinden bağımsız olarak çözülecektir. Aynı şekilde, her bileşen yalnızca "kendi için düşünmeli" ve render işlemi sırasında diğer bileşenlerle koordine etmeye veya onlara bağımlı olmaya çalışmamalıdır. Render işlemi bir okul sınavı gibi: her bileşen kendi JSX'ini hesaplamalıdır!

<DeepDive>

#### StrictMode ile saf olmayan hesaplamaları algılama {/*detecting-impure-calculations-with-strict-mode*/}

Henüz hepsini kullanmamış olsanız da, React'te işleme sırasında okuyabileceğiniz üç tür girdi vardır: [props](/learn/passing-props-to-a-component), [state](/learn/state-a-components-memory), and [context.](/learn/passing-data-deeply-with-context) Bu girişleri her zaman salt okunur olarak değerlendirmelisiniz.

Kullanıcı girişine yanıt olarak bir şeyi *değiştirmek* istediğinizde, bir değişkene yazmak yerine, [state oluşturmalısınız.](/learn/state-a-components-memory) Bileşeniniz render edilirken önceden var olan değişkenleri veya nesneleri asla değiştirmemelisiniz.

React, geliştirme sırasında her bileşenin işlevini iki kez çağırdığı bir “Strict Mode” sunar. **Strict Mode, bileşen işlevlerini iki kez çağırarak, bu kuralları çiğneyen bileşenlerin bulunmasına yardımcı olur.**

Orijinal örneğin "Guest #2", "Guest #4" ve "Guest #6" yerine "Guest #1", "Guest #2" ve "Guest #3" yerine nasıl görüntülendiğine dikkat edin. Orijinal fonksiyon saf değildi, bu yüzden onu iki kez çağırmak onu bozdu. Ancak sabit saf fonksiyon, işlev her seferinde iki kez çağrılsa bile çalışır. **Saf fonksiyonlar yalnızca hesaplama yapar, bu yüzden onları iki kez çağırmak hiçbir şeyi değiştirmez** -- tıpkı `double(2)`'yi iki kez çağırmanın döndürülen şeyi değiştirmemesi, <Math><MathI>y</MathI> = 2<MathI>x</MathI></Math>'i iki kez çözmenin <MathI>y</MathI>'yi değiştirmemesi gibi. Aynı girdiler, aynı çıktılar. Her zaman.

Strict Mode'un canlıda hiçbir etkisi yoktur, bu nedenle kullanıcılarınız için uygulamayı yavaşlatmaz. Strict Mode'u etkinleştirmek için kök bileşeninizi `<React.StrictMode>` içine sarabilirsiniz. Bazı kütüphaneler bunu varsayılan olarak yapar.

</DeepDive>

### Yerel Mutasyon: Yerel bileşeninizin küçük sırrı {/*local-mutation-your-components-little-secret*/}

Yukarıdaki örnekteki sorun, bileşenin render edilirken önceden var olan bir değişkeni değiştirmesiydi. Bu genellikle biraz korkutucu görünmesi için **mutasyon** olarak adlandırılır. Saf fonksiyonlar, fonksiyonun kapsamı dışındaki değişkenleri veya çağrıdan önce oluşturulmuş nesneleri değiştirmez - bu onları saf olmayan fonksiyonlar yapar!

Ancak, **render işlemi *sırasında* oluşturduğunuz değişkenleri ve nesneleri değiştirmek tamamen normaldir.** Bu örnekte, `[]` bir dizi oluşturur, bunu bir `cups` değişkenine atar ve ardından içine bir düzine fincan `eklersiniz`:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Tea cup for guest #{guest}</h2>;
}

export default function TeaGathering() {
  let cups = [];
  for (let i = 1; i <= 12; i++) {
    cups.push(<Cup key={i} guest={i} />);
  }
  return cups;
}
```

</Sandpack>

Eğer cups değişkeni veya `[]` dizisi `TeaGathering` fonksiyonunun dışında oluşturulmuş olsaydı, bu büyük bir sorun olurdu! Bu dizinin içine öğeler ekleyerek *önceden var olan* bir nesneyi değiştiriyor olacaktınız.

Ancak, `TeaGathering` içindeki aynı *render işlemi sırasında* oluşturduğunuz için bu tamamen normaldir. `TeaGathering` dışındaki hiçbir kod bunun olduğunu asla bilemeyecektir. Buna **"yerel mutasyon"** denir - bileşeninizin küçük bir sırrı gibi.

## Yan etkilere neden olabileceğiniz yerler {/*where-you-_can_-cause-side-effects*/}

Fonksiyonel programlama, büyük ölçüde saflığa dayanırken, bir noktada, bir yerde, bir şeyin değişmesi gerekir. Bu, programlamanın bir nevi amacıdır!  Ekranın güncellenmesi, bir animasyonun başlatılması, verilerin değiştirilmesi gibi değişikliklere **yan etkiler** denir. Bunlar, render işlemi sırasında değil, _"yan tarafta"_ meydana gelen şeylerdir.

React'te, **yan etkiler genellikle [olay yöneticileri](/learn/responding-to-events) içine yazılır**. Olay Yöneticileri, bir işlem gerçekleştirdiğinizde (örneğin, bir düğmeye tıkladığınızda) React'ın çalıştırdığı fonksiyonlardır. Olay Yöneticileri bileşeninizin *içinde* tanımlanmış olsa da, bunlar işleme *sırasında* çalışmazlar! **Bu nedenle olay işleyicilerinin saf olması gerekmez.**

Diğer tüm seçenekleri tükettiyseniz ve yan etkiniz için doğru olay yöneticilieri’ni bulamıyorsanız, bileşeninizde bir[`useEffect`](/reference/react/useEffect) çağrısı ile onu döndürülen JSX'inize hâlâ ekleyebilirsiniz. Bu, React'e onu renderdan yani işlemeden sonra, yan etkilere izin verildiğinde çalıştırmasını söyler. **Ancak, bu yaklaşım son çareniz olmalıdır.**

Mümkün olduğunda, mantığınızı yalnızca render ile ifade etmeye çalışın. Bunun sizi ne kadar ileri götürebileceğine şaşıracaksınız!

<DeepDive>

#### React neden saflığı önemsiyor? {/*why-does-react-care-about-purity*/}

Saf işlevler yazmak biraz alışkanlık ve disiplin gerektirir. Ama aynı zamanda harika fırsatların da kapısını açar:

* Bileşenleriniz farklı bir ortamda, örneğin sunucuda çalışabilir! Aynı girdiler için aynı sonucu döndürdüklerinden, bir bileşen birçok kullanıcı isteğine hizmet edebilir.
* Girişleri değişmeyen bleşenleri [render etmeyi atlayarak](/reference/react/memo) performansı artırabilirsiniz. Bu güvenlidir çünkü saf işlevler her zaman aynı sonuçları döndürür, bu nedenle önbelleğe alınmaları güvenlidir.
* Derin bir bileşen ağacı render edilirken ortasında bazı veriler değişirse, React, zaman aşımına uğramış enderi bitirmek için zaman kaybetmeden işlemeyi yeniden başlatabilir. Saflık, herhangi bir zamanda hesaplamayı durdurmayı güvenli hale getirir.

İnşa ettiğimiz her yeni React özelliği, saflıktan yararlanır. Veri toplamadan animasyonlara ve performansa kadar, bileşenleri saf tutmak React paradigmasının gücünü açığa çıkarır.

</DeepDive>

<Recap>

* Bir bileşen saf olmalıdır, yani:
  * **Kendi işine bakar.** İşlemeden önce var olan hiçbir nesneyi veya değişkeni değiştirmemelidir.
  * **Aynı girdiler, aynı çıktılar.** Aynı girdiler verildiğinde, bir bileşen her zaman aynı JSX'i döndürmelidir. 
* Oluşturma herhangi bir zamanda gerçekleşebilir, bu nedenle bileşenler birbirinin oluşturma sırasına bağlı olmamalıdır.
* Bileşenlerinizin render için kullandığı girdilerin hiçbirini mutasyona uğratmamalısınız. Buna props, state ve context dahildir. Ekranı güncellemek için, önceden var olan nesneleri değiştirmek yerine [state "oluşturun".](/learn/state-a-components-memory)
* Döndürdüğünüz JSX'te bileşeninizin mantığını ifade etmeye çalışın. "Bir şeyleri değiştirmeniz" gerektiğinde, bunu genellikle bir olay yöneticilerinde yapmak isteyeceksiniz. Son çare olarak, `useEffect`'i kullanabilirsiniz.
* Saf fonksiyonlar yazmak biraz pratik gerektirir, ancak React'in paradigmasının gücünü açığa çıkarır.

</Recap>


  
<Challenges>

#### Bozuk bir saati düzelt {/*fix-a-broken-clock*/}

Bu bileşen, `<h1>`'in CSS class'ını gün esnasında, gece yarısından sabah 6'ya kadar `"night"` ve diğer tüm zamanlarda ise `"day"` olarak ayarlamaya çalışıyor. Ancak, bu işe yaramıyor. Bu bileşeni düzeltebilir misiniz?

Bilgisayarın saat dilimini geçici olarak değiştirerek çözümünüzün çalışıp çalışmadığını doğrulayabilirsiniz. Geçerli saat gece yarısı ile sabah altı arasında olduğunda, saat ters renklere sahip olmalıdır!

<Hint>

Render etmek bir *hesaplamadır.*, bir şeyler "yapmaya" çalışmamalı. Aynı fikri farklı şekilde ifade edebilir misiniz?

</Hint>

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  if (hours >= 0 && hours <= 6) {
    document.getElementById('time').className = 'night';
  } else {
    document.getElementById('time').className = 'day';
  }
  return (
    <h1 id="time">
      {time.toLocaleTimeString()}
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

<Solution>

Bu bileşeni, `className` değerini hesaplayarak ve bunu render çıktısına dahil ederek düzeltebilirsiniz:

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  let hours = time.getHours();
  let className;
  if (hours >= 0 && hours <= 6) {
    className = 'night';
  } else {
    className = 'day';
  }
  return (
    <h1 className={className}>
      {time.toLocaleTimeString()}
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
  return (
    <Clock time={time} />
  );
}
```

```css
body > * {
  width: 100%;
  height: 100%;
}
.day {
  background: #fff;
  color: #222;
}
.night {
  background: #222;
  color: #fff;
}
```

</Sandpack>

Bu örnekte, yan etki (DOM'u değiştirmek) hiç gerekli değildi. Yalnızca JSX'i döndürmeniz gerekiyordu.

</Solution>

#### Bozuk bir profili düzelt {/*fix-a-broken-profile*/}

İki `Profile` bileşeni, farklı verilerle yan yana oluşturulur. İlk profilde "Daralt"a ve ardından "Genişlet"e basın. Artık her iki profilin de aynı kişiyi gösterdiğini fark edeceksiniz. Bu bir hata.

Hatanın nedenini bulun ve düzeltin.

<Hint>

Hatalı kod `Profile.js`'in içindedir. Hepsini yukarıdan aşağıya okuduğunuzdan emin olun!

</Hint>

<Sandpack>

```js Profile.js
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

let currentPerson;

export default function Profile({ person }) {
  currentPerson = person;
  return (
    <Panel>
      <Header />
      <Avatar />
    </Panel>
  )
}

function Header() {
  return <h1>{currentPerson.name}</h1>;
}

function Avatar() {
  return (
    <img
      className="avatar"
      src={getImageUrl(currentPerson)}
      alt={currentPerson.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  )
}
```

```js utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

<Solution>

Sorun `Profile` bileşeninin `currentPerson` adlı önceden var olan bir değişkene yazması, ve `Header` and `Avatar` bileşenlerinin bundan okumasıdır. Bu, *üçünü de* kirli yapar ve tahmin etmeyi zorlaştırır.

Hatayı düzeltmek için, `currentPerson` değişkenini kaldırın. Bunun yerine, tüm bilgileri `Profile`'den `Header`'a ve `Avatar`'a props aracılığıyla iletin. Her iki bileşene de bir `person` prop'u eklemeniz ve bunu sonuna kadar geçmeniz gerekecek.

<Sandpack>

```js Profile.js active
import Panel from './Panel.js';
import { getImageUrl } from './utils.js';

export default function Profile({ person }) {
  return (
    <Panel>
      <Header person={person} />
      <Avatar person={person} />
    </Panel>
  )
}

function Header({ person }) {
  return <h1>{person.name}</h1>;
}

function Avatar({ person }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={50}
      height={50}
    />
  );
}
```

```js Panel.js hidden
import { useState } from 'react';

export default function Panel({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <section className="panel">
      <button onClick={() => setOpen(!open)}>
        {open ? 'Collapse' : 'Expand'}
      </button>
      {open && children}
    </section>
  );
}
```

```js App.js
import Profile from './Profile.js';

export default function App() {
  return (
    <>
      <Profile person={{
        imageId: 'lrWQx8l',
        name: 'Subrahmanyan Chandrasekhar',
      }} />
      <Profile person={{
        imageId: 'MK3eW3A',
        name: 'Creola Katherine Johnson',
      }} />
    </>
  );
}
```

```js utils.js hidden
export function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; }
.panel {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
  width: 200px;
}
h1 { margin: 5px; font-size: 18px; }
```

</Sandpack>

React'in bileşen fonksiyonlarının belirli bir sırada yürütüleceğini garanti etmediğini unutmayın, bu nedenle değişkenleri ayarlayarak bunlar arasında iletişim kuramazsınız. Tüm iletişim, proplar aracılığıyla gerçekleşmelidir.

</Solution>

#### Bozuk bir hikaye bölümünü düzelt {/*fix-a-broken-story-tray*/}

Şirketinizin CEO'su sizden çevrimiçi saat uygulamanıza "hikayeler" eklemenizi istiyor ve siz hayır diyemiyorsunuz. `stories` listesini kabul eden bir `StoryTray` bileşeni ve ardından bir "Create Story" placeholder'ını yazdınız.

Prop olarak aldığınız `stories` dizisinin sonuna bir sahte hikaye daha iterek "Create Story" placeholder'ını uyguladınız. Ancak nedense "Create Story" birden çok kez görünüyor. Sorunu düzeltin.

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  stories.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // İPUCU: Belgeleri okurken hafızanın sonsuza kadar büyümesini önleyin.
  // Burada kendi kurallarımızı çiğniyoruz.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

</Sandpack>

<Solution>

Saat her güncellendiğinde, "Create Story"nin *iki kez* nasıl eklendiğine dikkat edin.  Bu, oluşturma sırasında bir mutasyona sahip olduğumuza dair bir ipucu görevi görür -- StrictMode, bu sorunları daha belirgin hale getirmek için bileşenleri iki kez çağırır.

`StoryTray` fonksiyonu saf değil. Alınan `stories` dizisinde (bir prop!) `push`'u çağırarak, oluşturmaya başlamadan *önce*, `StoryTray` oluşturulmuş bir nesneyi değiştiriyor. Bu, onu hatalı kılar ve tahmin etmeyi çok zorlaştırır.

En basit düzeltme, diziye hiç dokunmamak ve "Create Story"i ayrı ayrı oluşturmaktır:

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
      <li>Create Story</li>
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // İPUCU: Belgeleri okurken hafızanın sonsuza kadar büyümesini önleyin.
  // Burada kendi kurallarımızı çiğniyoruz.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Alternatif olarak, içine bir öğe göndermeden önce (mevcut olanı kopyalayarak) bir _new_ dizisi oluşturabilirsiniz:

<Sandpack>

```js StoryTray.js active
export default function StoryTray({ stories }) {
  // Diziyi kopyalayın!
  let storiesToDisplay = stories.slice();

  // Orijinal diziyi etkilemez:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState([...initialStories])
  let time = useTime();

  // İPUCU: Belgeleri okurken hafızanın sonsuza kadar büyümesini önleyin.
  // Burada kendi kurallarımızı çiğniyoruz.
  if (stories.length > 100) {
    stories.length = 100;
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <h2>It is {time.toLocaleTimeString()} now.</h2>
      <StoryTray stories={stories} />
    </div>
  );
}

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
```

```css
ul {
  margin: 0;
  list-style-type: none;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Bu, mutasyonunuzu yerel ve render eden fonksiyonunuzu saf tutar. Ancak yine de dikkatli olmanız gerekir: örneğin, dizinin mevcut öğelerinden herhangi birini değiştirmeye çalışırsanız, bu öğeleri de klonlamanız gerekir.

Dizilerdeki hangi işlemlerin onları değiştirdiğini ve hangilerinin değiştirmediğini hatırlamakta fayda var. Örneğin, `push`, `pop`, `reverse`, ve `sort` orijinal diziyi değiştirir, ancak `slice`, `filter`, ve `map` yeni bir dizi oluşturur.

</Solution>

</Challenges>
