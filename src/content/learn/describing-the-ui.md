---
title: Kullanıcı Arayüzünü Tanımlama
---

<Intro>

React, kullanıcı arayüzleri (UI) oluşturmak için kullanılan bir JavaScript kütüphanesidir. Kullanıcı arayüzü butonlar, metinler ve resimler gibi küçük birimlerden oluşur. React bunları yeniden kullanılabilir, iç içe yerleştirilebilir *bileşenler* halinde birleştirmenize olanak tanır. Web sitelerinden telefon uygulamalarına kadar ekrandaki her şey bileşenlere ayrılabilir. Bu bölümde, React bileşenlerini oluşturmayı, özelleştirmeyi ve koşullu olarak görüntülemeyi öğreneceksiniz.

</Intro>

<YouWillLearn isChapter={true}>

* [İlk React bileşeninizi nasıl yazarsınız](/learn/your-first-component)
* [Çok bileşenli dosyalar ne zaman ve nasıl oluşturulur](/learn/importing-and-exporting-components)
* [JSX ile JavaScript'e işaretleme nasıl eklenir](/learn/writing-markup-with-jsx)
* [Bileşenlerinizden JavaScript fonksiyonlarına erişmek için JSX ile süslü parantezler nasıl kullanılır](/learn/javascript-in-jsx-with-curly-braces)
* [Bileşenler prop'lar ile nasıl yapılandırılır](/learn/passing-props-to-a-component)
* [Bileşenleri koşullu olarak nasıl render edebilirim](/learn/conditional-rendering)
* [Birden çok bileşeni aynı anda nasıl render edebilirim](/learn/rendering-lists)
* [Bileşenleri saf tutarak kafa karışıklığına neden olan hatalardan nasıl kaçınılır](/learn/keeping-components-pure)
* [Kullanıcı arayüzünüzü ağaçlar olarak anlamak neden yararlıdır](/learn/understanding-your-ui-as-a-tree) 

</YouWillLearn>

## İlk bileşeniniz {/*your-first-component*/}

React uygulamaları, *bileşenler* adı verilen izole kullanıcı arayüzü parçalarından oluşturulur. Bir React bileşeni, işaretleme ile serpiştirebileceğiniz bir JavaScript fonksiyonudur. Bileşenler bir buton kadar küçük veya tüm bir sayfa kadar büyük olabilir. İşte üç adet `Profil` bileşeni oluşturan bir `Galeri` bileşeni:

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
      <h1>Muhteşem Bilim İnsanları</h1>
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

<LearnMore path="/learn/your-first-component">

React bileşenlerini bildirmeyi ve kullanmayı öğrenmek için **[İlk bileşeniniz](/learn/your-first-component)** bölümünü okuyun.

</LearnMore>

## Bileşenlerin içe ve dışa aktarılması {/*importing-and-exporting-components*/}

Bu durumda, bir dosyada birçok bileşen bildirebilirsiniz, ancak büyük dosyaları navigate etmek zor olabilir. Bu sorunu çözmek için, bir bileşeni kendi dosyasında dışa aktarabilir (export), ardından başka bir dosyadan o bileşeni içe aktarabilirsiniz (import):


<Sandpack>

```js src/App.js hidden
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js src/Gallery.js active
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Muhteşem Bilim İnsanları</h1>
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
img { margin: 0 10px 10px 0; }
```

</Sandpack>

<LearnMore path="/learn/importing-and-exporting-components">

Bileşenleri kendi dosyalarına nasıl ayıracağınızı öğrenmek için **[Bileşenleri İçe ve Dışa Aktarma](/learn/importing-and-exporting-components)** bölümünü okuyun.

</LearnMore>

## JSX ile işaretleme (markup) yazma {/*writing-markup-with-jsx*/}

Her React bileşeni, React'in tarayıcıda render ettiği bazı işaretlemeler (markuplar) içerebilecek bir JavaScript fonksiyonudur. React bileşenleri, bu işaretlemeyi temsil etmek için JSX adı verilen bir sözdizimi uzantısını kullanır. JSX, HTML'ye çok benzer, ancak biraz daha katıdır ve dinamik bilgileri görüntüleyebilir.

Mevcut HTML işaretlemesini bir React bileşenine yapıştırırsak, bu her zaman çalışmayacaktır:

<Sandpack>

```js
export default function TodoList() {
  return (
    // Bu tam olarak işe yaramaz!
    <h1>Hedy Lamarr'ın Yapılacakları</h1>
    <img
      src="https://i.imgur.com/yXOvdOSs.jpg"
      alt="Hedy Lamarr"
      class="photo"
    >
    <ul>
      <li>Yeni trafik ışıkları icat etmek
      <li>Bir film sahnesinin provasını yapmak
      <li>Spektrum teknolojisini geliştirmek
    </ul>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

Eğer böyle bir HTML'iniz varsa, [dönüştürücü](https://transform.tools/html-to-jsx) kullanarak düzeltebilirsiniz:

<Sandpack>

```js
export default function TodoList() {
  return (
    <>
      <h1>Hedy Lamarr'ın Yapılacakları</h1>
      <img
        src="https://i.imgur.com/yXOvdOSs.jpg"
        alt="Hedy Lamarr"
        className="photo"
      />
      <ul>
        <li>Yeni trafik ışıkları icat etmek</li>
        <li>Bir film sahnesinin provasını yapmak</li>
        <li>Spektrum teknolojisini geliştirmek</li>
      </ul>
    </>
  );
}
```

```css
img { height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/writing-markup-with-jsx">

Doğru JSX yazmayı öğrenmek için **[JSX ile İşaretleme (Markup) Yazma](/learn/writing-markup-with-jsx)** bölümünü okuyun.

</LearnMore>

## JSX içinde JavaScript kodunu süslü parantezlerle kullanma {/*javascript-in-jsx-with-curly-braces*/}

JSX, JavaScript dosyası içinde HTML benzeri işaretleme yazmanıza olanak tanır ve renderlama mantığını ile içeriği aynı yerde tutar. Bazı durumlarda, bu işaretlemenin içine biraz JavaScript mantığı eklemek veya dinamik bir özelliğe başvurmak isteyebilirsiniz. Bu durumda, JSX içinde süslü parantez kullanarak JavaScript'e bir "pencere açabilirsiniz".

<Sandpack>

```js
const person = {
  name: 'Gregorio Y. Zara',
  theme: {
    backgroundColor: 'black',
    color: 'pink'
  }
};

export default function TodoList() {
  return (
    <div style={person.theme}>
      <h1>{person.name}'nın Yapılacaklası</h1>
      <img
        className="avatar"
        src="https://i.imgur.com/7vQD0fPs.jpg"
        alt="Gregorio Y. Zara"
      />
      <ul>
        <li>Görüntülü telefonu geliştirmek</li>
        <li>Havacılık derslerini hazırlamak</li>
        <li>Alkol yakıtlı motor üzerinde çalışmak</li>
      </ul>
    </div>
  );
}
```

```css
body { padding: 0; margin: 0 }
body > div > div { padding: 20px; }
.avatar { border-radius: 50%; height: 90px; }
```

</Sandpack>

<LearnMore path="/learn/javascript-in-jsx-with-curly-braces">

JSX'ten JavaScript verilerine nasıl erişileceğini öğrenmek için **[JSX içinde Süslü Parantezlerle JavaScript](/learn/javascript-in-jsx-with-curly-braces)** bölümünü okuyun.

</LearnMore>

## Bileşenlere Prop'ları Aktarma {/*passing-props-to-a-component*/}

React bileşenleri birbirleriyle iletişim kurmak için *props* kullanırlar. Her ana bileşen, alt bileşenlerine prop'lar vererek onlara bazı bilgiler aktarabilir. Prop'lar size HTML özelliklerini hatırlatabilir, ancak nesneler, diziler, fonksiyonlar ve hatta JSX dahil olmak üzere herhangi bir JavaScript değerini bunlar aracılığıyla iletebilirsiniz!

<Sandpack>

```js
import { getImageUrl } from './utils.js'

export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

```

```js src/utils.js
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
.card {
  width: fit-content;
  margin: 5px;
  padding: 5px;
  font-size: 20px;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.avatar {
  margin: 20px;
  border-radius: 50%;
}
```

</Sandpack>

<LearnMore path="/learn/passing-props-to-a-component">

Prop'ların nasıl aktarılacağını ve okunacağını öğrenmek için **[Bileşenlere Prop'ları Aktarma](/learn/passing-props-to-a-component)** bölümünü okuyun.

</LearnMore>

## Koşullu olarak render etme {/*conditional-rendering*/}

Bileşenlerinizin genellikle farklı koşullara bağlı olarak farklı şeyler göstermesi gerekecektir. React'te, `if` ifadeleri, `&&` ve `? :` operatörleri gibi JavaScript sözdizimlerini kullanarak JSX'i koşullu olarak oluşturabilirsiniz.

Bu örnekte, bir onay işaretini (checkmark) koşullu olarak oluşturmak için JavaScriptdeki `&&` operatörü kullanılmıştır:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride'ın Bavul Listesi</h1>
      <ul>
        <Item
          isPacked={true}
          name="Uzay giysisi"
        />
        <Item
          isPacked={true}
          name="Altın yapraklı kask"
        />
        <Item
          isPacked={false}
          name="Tam'in fotoğrafı"
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<LearnMore path="/learn/conditional-rendering">

İçeriği koşullu olarak oluşturmanın farklı yollarını öğrenmek için **[Koşullu Olarak Render Etmek](/learn/conditional-rendering)** bölümünü okuyun.

</LearnMore>

## Listeleri render etmek {/*rendering-lists*/}

Genellikle bir veri koleksiyonundan birden fazla benzer bileşeni görüntülemek istersiniz. Veri dizinizi filtrelemek ve bir bileşen dizisine dönüştürmek için JavaScript'in `filter()` ve `map()` fonksiyonlarını React ile kullanabilirsiniz.

Her dizi öğesi için bir `key` belirtmeniz gerekecektir. Genellikle, veritabanından bir ID'yi `key` olarak kullanmak isteyeceksiniz. Key'ler, liste değişse bile React'in her öğenin listedeki yerini takip etmesini sağlar.

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
        bilinen çalışması: {person.accomplishment}
      </p>
    </li>
  );
  return (
    <article>
      <h1>Bilim insanları</h1>
      <ul>{listItems}</ul>
    </article>
  );
}
```

```js src/data.js
export const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'matematikçi',
  accomplishment: 'uzay uçuşu hesaplamaları',
  imageId: 'MK3eW3A'
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'kimyager',
  accomplishment: 'Arktik ozon deliğinin keşfi',
  imageId: 'mynHUSa'
}, {
  id: 2,
  name: 'Mohammad Abdus Salam',
  profession: 'fizikçi',
  accomplishment: 'elektromanyeti̇zma teori̇si̇',
  imageId: 'bE7W1ji'
}, {
  id: 3,
  name: 'Percy Lavon Julian',
  profession: 'kimyager',
  accomplishment: 'kortizon ilaçları, steroidler ve doğum kontrol haplarına öncülük etmek',
  imageId: 'IOjWm71'
}, {
  id: 4,
  name: 'Subrahmanyan Chandrasekhar',
  profession: 'astrofizikçi',
  accomplishment: 'beyaz cüce yıldız kütle hesaplamaları',
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
  grid-template-columns: 1fr 1fr;
  align-items: center;
}
img { width: 100px; height: 100px; border-radius: 50%; }
h1 { font-size: 22px; }
h2 { font-size: 20px; }
```

</Sandpack>

<LearnMore path="/learn/rendering-lists">

Bir bileşen listesinin nasıl oluşturulacağını ve bir anahtarın nasıl seçileceğini öğrenmek için **[Listeleri Render Etmek](/learn/rendering-lists)** bölümünü okuyun.

</LearnMore>

## Bileşenleri saf tutmak {/*keeping-components-pure*/}

Bazı JavaScript fonksiyonları *saftır.* Saf bir fonksiyon:

* **Kendi işine bakar.** Çağrılmadan önce var olan hiçbir nesneyi veya değişkeni değiştirmez.
* **Aynı girdiler, aynı çıktılar.** Aynı girdiler verildiğinde, saf bir fonksiyon her zaman aynı sonucu döndürmelidir.

Bileşenlerinizi yalnızca saf fonksiyonlar olarak yazarsanız, kod tabanınız büyüdükçe şaşırtıcı hatalardan ve öngörülemeyen davranışlardan kaçınabilirsiniz. İşte saf olmayan bir bileşen örneği:

<Sandpack>

```js
let guest = 0;

function Cup() {
  // Bad: changing a preexisting variable!
  guest = guest + 1;
  return <h2>Misafir #{guest} için çay bardağı</h2>;
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

Önceden var olan bir değişkeni değiştirmek yerine bir prop geçirerek bu bileşeni saf hale getirebilirsiniz:

<Sandpack>

```js
function Cup({ guest }) {
  return <h2>Misafir #{guest} için çay bardağı</h2>;
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

<LearnMore path="/learn/keeping-components-pure">

Bileşenlerin saf, öngörülebilir fonksiyonlar olarak nasıl yazılacağını öğrenmek için **[Bileşenleri Saf Tutmak](/learn/keeping-components-pure)** bölümünü okuyun.

</LearnMore>

## Arayüzünüzü bir ağaç olarak düşünün {/*your-ui-as-a-tree*/}

React, bileşenler ve modüller arasındaki ilişkileri modellemek için ağaçları kullanır.

React render ağacı, bileşenler arasındaki ebeveyn ve çocuk ilişkisinin bir temsilidir.

<Diagram name="generic_render_tree" height={250} width={500} alt="A tree graph with five nodes, with each node representing a component. The root node is located at the top the tree graph and is labelled 'Root Component'. It has two arrows extending down to two nodes labelled 'Component A' and 'Component C'. Each of the arrows is labelled with 'renders'. 'Component A' has a single 'renders' arrow to a node labelled 'Component B'. 'Component C' has a single 'renders' arrow to a node labelled 'Component D'.">

Örnek bir React render ağacı.

</Diagram>

Ağacın tepesine , kök bileşene yakın bileşenler üst düzey bileşenler olarak kabul edilir. Alt elemanı olmayan bileşenler yaprak bileşenlerdir. Bileşenlerin bu şekilde kategorize edilmesi, veri akışını ve işleme performansını anlamak için kullanışlıdır.


JavaScript modülleri arasındaki ilişkiyi modellemek, uygulamanızı anlamanın bir başka yararlı yoludur. Bunu modül bağımlılık ağacı olarak adlandırıyoruz.

<Diagram name="generic_dependency_tree" height={250} width={500} alt="A tree graph with five nodes. Each node represents a JavaScript module. The top-most node is labelled 'RootModule.js'. It has three arrows extending to the nodes: 'ModuleA.js', 'ModuleB.js', and 'ModuleC.js'. Each arrow is labelled as 'imports'. 'ModuleC.js' node has a single 'imports' arrow that points to a node labelled 'ModuleD.js'.">

Örnek bir modül bağımlılık ağacı.

</Diagram>

Bağımlılık ağacı genellikle derleme araçları tarafından istemcinin indirmesi ve renderlaması için ilgili tüm JavaScript kodunu paketlemek için kullanılır. Büyük bir paket boyutu, React uygulamaları için kullanıcı deneyimini geriletir. Modül bağımlılık ağacını anlamak, bu tür sorunları ayıklamak için yardımcı olur.

<LearnMore path="/learn/understanding-your-ui-as-a-tree">

Bir React uygulaması için render ve modül bağımlılık ağaçlarının nasıl oluşturulacağını ve bunların kullanıcı deneyimini ve performansı iyileştirmek için nasıl yararlı zihinsel modeller olduğunu öğrenmek için **[Arayüzünüzü Bir Ağaç Olarak Anlamak](/learn/understanding-your-ui-as-a-tree)** bölümünü okuyun.

</LearnMore>


## Sırada ne var? {/*whats-next*/}

Bu bölümü sayfa sayfa okumaya başlamak için [İlk Bileşeniniz](/learn/your-first-component) bölümüne gidin!

Ya da bu konulara zaten aşinaysanız, neden [Etkileşim Ekleme](/learn/adding-interactivity) hakkında okumuyorsunuz?
