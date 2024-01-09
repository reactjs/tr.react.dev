---
title: Bileşenleri İçe ve Dışa Aktarma
---

<Intro>

Bileşenlerin büyüsü yeniden kullanılabilirliklerinde yatar: diğer bileşenlerden oluşan bileşenler oluşturabilirsiniz. Ancak, giderek daha fazla bileşeni iç içe yerleştirdikçe, bunları farklı dosyalara bölmeye başlamak genellikle mantıklıdır. Bu, dosyalarınızın kolayca taranmasını ve bileşenlerin daha fazla yerde yeniden kullanılmasını sağlar.

</Intro>

<YouWillLearn>

* Kök bileşen dosyası nedir
* Bir bileşeni içe ve dışa aktarma
* Varsayılan ve adlandırılmış içe ve dışa aktarmaların ne zaman kullanılması gerektiği
* Bir dosyadan birden fazla bileşen içe ve dışa nasıl aktarılır
* Bileşenler birden fazla dosyaya nasıl bölünür

</YouWillLearn>

## Kök bileşen dosyası {/*the-root-component-file*/}

[İlk bileşeniniz](/learn/your-first-component)'de, `Profile` bileşenini render eden bir `Gallery` bileşeni oluşturmuştunuz:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Muhteşem bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>
Bu örnekte, bileşenler `App.js` adlı bir **kök bileşen dosyası**'nın içerisinde barınmaktadır. [Create React App](https://create-react-app.dev/)'de uygulamanız `src/App.js` dosyası içinde barınmaktadır. Fakat kurulumunuza bağlı olarak kök bileşeniniz başka bir dosyanın içerisinde olabilir. Eğer dosya tabanlı yönlendirmesi olan bir çatı kullanıyorsanız, kök bileşeniniz her sayfa için ayrı olacaktır.

## Bileşenleri içe ve dışa aktarma {/*exporting-and-importing-a-component*/}

Bu örnekte bileşenler `App.js` adlı bir **kök bileşen dosyasında** bulunmaktadır. Kurulumunuza bağlı olarak, kök bileşeniniz (root component) başka bir dosyada olabilir. Next.js gibi dosya tabanlı yönlendirmeye sahip bir çatı (framework) kullanıyorsanız, kök bileşeniniz her sayfa için farklı olacaktır.

Eğer açılış ekranını değiştirmek ve bilim kitaplarının bir listesini koymak isterseniz ne olur? Veya tüm profilleri başka bir yere yerleştirmek isterseniz? Bu durumda `Galeri` ve `Profil` bileşenlerini kök bileşen dosyasından çıkarmak mantıklıdır. Bu, onların daha modüler olmasını ve diğer dosyalarda yeniden kullanılabilir olmasını sağlayacaktır. Bir bileşeni üç adımda taşıyabilirsiniz:

1. **Yeni** bir JS dosyası oluşturunuz ve bileşeni bunun içine koyunuz.
2. **Dışa aktarma** işlemini bu dosya içerisindeki fonksiyon bileşenine uygulayınız ([varsayılan](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) olarak yada [adlandırılmış](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) olarak dışa aktarım).
3. **İçe aktarma** işlemini bu bileşeni kullanmak istediğiniz dosyada yapınız ([varsayılan](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) yada [adlandırılmış](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) dışa akratıma uygun olacak içe aktarımı kullanarak).

Burada `Profile` ve `Gallery` bileşenleri `App.js` dosyası dışına `Gallery.js` adlı bir dosyaya taşınmıştır. Şimdi `App.js` dosyasını `Gallery.js` dosyasından `Gallery` bileşenini içe aktaracak şekilde düzenleyebilirsiniz:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Muhteşem bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Bu örneğin iki farklı bileşen dosyasına nasıl ayrıldığına dikkat ediniz:

1. `Gallery.js`:
     - Sadece aynı dosya içerisinde kullanılan ve dışa aktarılmayan `Profile` bileşenini tanımlar.
     - **Varsayılan dışa aktarma** olarak `Gallery` bileşenini dışa aktarır. 
2. `App.js`:
     - `Gallery.js` dosyasından **varsayılan içe aktarma** olarak `Gallery` bileşenini içe aktarır.
     - **Varsayılan dışa aktarma** olarak `App` bileşenini dışa aktarır.


<Note>

`.js` dosya uzantısını kullanmayan dosyalarla karşılaşabilirsiniz:

```js 
import Gallery from './Gallery';
```

`'./Gallery.js'` yada `'./Gallery'` React ile çalışacaktır, ancak ilk kullanım [yerel ES Modülleri](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)'nin çalışma şekline daha yakındır.

</Note>

<DeepDive>

#### Varsayılan ve adlandırılmış dışa aktarmalar {/*default-vs-named-exports*/}

Javascript'de değerleri dışa aktarmak için başlıca iki yol vardır: varsayılan dışa aktarmalar ve adlandırılmış dışa aktarmalar. Şimdiye kadar, örneklerimizde sadece varsayılan dışa aktarmalar kullanılmıştır. Fakat siz birini yada ikisini birlikte aynı dosyada kullanabilirsiniz. **Bir dosyada birden fazla _varsayılan_ dışa aktarma olamaz, ama dilediğiniz kadar _adlandırılmış_ dışa aktarma olabilir.**

![Varsayılan ve adlandırılmış dışa aktarma](/images/docs/illustrations/i_import-export.svg)

Bileşenlerinizi nasıl dışa aktardığınız nasıl içe aktarmanız gerektiğini belirler. Eğer varsayılan bir dışa aktarmayı, adlandırılmış bir dışa aktarma ile aynı şekilde içe aktarmaya çalışırsanız hata alırsınız! Bu tablo takip etmenize yardımcı olabilir:

| Sözdizimi        | Dışa aktarma ifadesi                       | İçe aktarma ifadesi                       |
| -----------      | -----------                                | -----------                               |
| Varsayılan       | `export default function Button() {}`      | `import Button from './Button.js';`       |
| Adlandırılmış    | `export function Button() {}`              | `import { Button } from './Button.js';`   |

Bir içe aktarma yazarken `import` sonrasında istediğiniz adı kullanabilirsiniz. Örneğin, `import Zurna from './Button.js'` şeklinde yazabilirsiniz ve bu size yine aynı varsayılan dışa aktarmayı sağlayacaktır. Buna karşılık, adlandırılmış içe aktarmalarda, ad iki tarafta da aynı olmak zorundadır. Bu sebeple bunlara _adlandırılmış_ içe aktarmalar denir!

**Geliştiriciler eğer dosya tek bir bileşeni dışa aktarıyorsa genellikle varsayılan dışa aktarmayı, birden fazla bileşen ve değeri dışa aktarıyorsa adlandırılmış dışa aktarmayı kullanmaktadır.** Hangi kodlama stilini tercih ettiğinizden bağımsız olarak, bileşen fonksiyonlarınıza ve bulundukları dosyalara anlamlı adlar veriniz. Hata ayıklamayı zorlaştırdıkları için, `export default () => {}` gibi adsız bileşenlerin kullanımı önerilmez.

</DeepDive>

## Aynı dosya içerisinden birden fazla bileşenin içe ve dışa aktarımı {/*exporting-and-importing-multiple-components-from-the-same-file*/}

Eğer bir galeri yerine sadece bir `Profile` göstermek isterseniz ne olur? `Profile` bileşenini de dışa aktarabilirsiniz. Ancak `Gallery.js` dosyası zaten bir *varsayılan* dışa aktarmaya sahiptir ve _iki_ varsayılan dışa aktarmaya sahip olamaz. Varsayılan aktarmayla yeni bir dosya oluşturabilirsiniz yada `Profile` için *adlandırılmış* dışa aktarma ekleyebilirsiniz. **Bir dosya sadece bir adet varsayılan dışa aktarmaya sahip olabilir, ancak birçok adlandırılmış dışa aktarmaya sahip olabilir!**

<Note>

Varsayılan ve adlandırılmış dışa aktarmalar arasındaki olası karışıklığı azaltmak için, bazı geliştirici ekipler yalnızca bir stile (varsayılan veya adlandırılmış) bağlı kalmayı veya bunları tek bir dosyada birlikte kullanmaktan kaçınmayı seçmektedir. Siz, sizin için en iyi olanı uygulayınız!

</Note>

İlk olarak, adlandırılmış dışa aktarma kullanarak `Gallery.js`'den `Profile`'ı **dışa aktarınız** (`default` anahtar kelimesi olmadan):

```js
export function Profile() {
  // ...
}
```

Sonrasında, adlandırılmış içe aktarma kullanarak `Gallery.js`'den `Profile`'ı `App.js`'de **içe aktarınız** (süslü parantezleri kullanarak):

```js
import { Profile } from './Gallery.js';
```

Son olarak, `App` bileşeninde `<Profile />`'ı **render** ediniz:

```js
export default function App() {
  return <Profile />;
}
```

Şu anda `Gallery.js` dosyası iki adet dışa aktarma içermektedir: bir varsayılan `Gallery` dışa aktarma, ve bir adlandırılmış `Profile` dışa aktarma. `App.js` dosyası her ikisini de içe aktarmaktadır. Bu örnekte `<Profile />` bileşenini `<Gallery />` olarak düzenlemeyi ve geri almayı deneyin:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js src/Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Muhteşem bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Artık varsayılan ve adlandırılmış dışa aktarmaları bir arada kullanıyorsunuz:

* `Gallery.js`:
  - `Profile` bileşenini **adlandırılmış dışa aktarma** olarak `Profile` adıyla dışa aktarır.
  - `Gallery` bileşenini **varsayılan dışa aktarma** olarak dışa aktarır.
* `App.js`:
  - `Profile`'ı `Gallery.js`'den **adlandırılmış içe aktarma** olarak `Profile` adıyla dışa aktarır.
  - `Gallery`'i `Gallery.js`'den **varsayılan içe aktarma** olarak içe aktarır.
  - Kök `App` bileşenini **varsayılan dışa aktarma** olarak dışa aktarır.

<Recap>

Bu sayfada öğrendikleriniz:

* Kök bileşeni nedir
* Bir bileşen içe ve dışa nasıl aktarılır 
* Varsayılan ve adlandırılmış içe ve dışa aktarmalar ne zaman ve nasıl kullanılmalıdır
* Aynı dosya içerisinden birden fazla bileşen nasıl dışarı aktarılabilir

</Recap>



<Challenges>

#### Bileşenleri daha fazla ayırın {/*split-the-components-further*/}

Şu anda Gallery.js, hem `Profile`'i hem de `Gallery`i dışa aktarıyor, bu biraz kafa karıştıcı. 

`Profile` bileşenini kendi `Profile.js` dosyasına taşıyınız, ve sonrasında `App` bileşenini sırasıyla `<Profile />` ve `<Gallery />` render edecek şekilde değiştiriniz.

`Profile` için varsayılan yada adlandırılmış bir dışa aktarma kullanabilirsiniz, ancak hem `App.js` hem de `Gallery.js` için kullandığınız dışa aktarmaya uygun içe aktarma sözdizimini kullandığınızdan emin olunuz! Yukarıdaki derinlemesine incelemede verilen tablodan yararlanabilirsiniz:


| Sözdizimi        | Dışa aktarma ifadesi                       | İçe aktarma ifadesi                     |
| -----------      | -----------                                | -----------                             |
| Varsayılan       | `export default function Button() {}`      | `import Button from './Button.js';`     |
| Adlandırılmış    | `export function Button() {}`              | `import { Button } from './Button.js';` |

<Hint>

Bileşenleri çağırıldıkları yerde içe aktarmayı unutmayınız. `Gallery`'de `Profile` kullanılmıyor mu?

</Hint>

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js src/Gallery.js active
// Beni Profile.js'e taşıyınız!
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Muhteşem bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Bir dışa aktarma türü ile çalıştırdıktan sonra, diğer dışa aktarma türü ile de çalıştırmayı deneyiniz.

<Solution>

Adlandırılmış dışa aktarmalara sahip çözüm:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Muhteşem bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Varsayılan dışa aktarmalara sahip çözüm:

<Sandpack>

```js src/App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js src/Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Muhteşem bilim insanları</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js src/Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>
