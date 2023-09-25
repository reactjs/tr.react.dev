---
title: Bileşenlere Prop'ları Aktarma
---

<Intro>

React bileşenleri, birbirleriyle iletişim kurmak için *prop'ları* kullanır. Her üst eleman, alt elemanlarına prop'lar vererek onlarla bilgi paylaşabilir. Prop'lar, size HTML özelliklerini hatırlatabilir, ancak onların aracılığıyla nesneler, diziler ve fonksiyonlar da dahil olmak üzere herhangi bir JavaScript değeri aktarabilirsiniz.

</Intro>

<YouWillLearn>

* Bileşene prop nasıl aktarılır
* Bir bileşenden prop nasıl okunur
* Prop'lar için varsayılan değerler nasıl belirlenir
* Bir bileşene JSX nasıl aktarılır
* Prop'ların zamanla nasıl değiştiği

</YouWillLearn>

## Tanıdık Prop'lar {/*familiar-props*/}

Prop'lar, JSX etiketine ilettiğiniz bilgilerdir. Örneğin, `className`, `src`, `alt`, `width` ve `height`, bir `<img>`'ye aktarabileceğiniz prop'lardan bazılarıdır:

<Sandpack>

```js
function Avatar() {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
}

export default function Profile() {
  return (
    <Avatar />
  );
}
```

```css
body { min-height: 120px; }
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Bir `<img>` etiketine aktarabileceğiniz prop'lar önceden tanımlanmıştır (ReactDOM, [HTML standardına](https://www.w3.org/TR/html52/semantics-embedded-content.html#the-img-element) uygundur). Ancak, özelleştirmek için `<Avatar>` gibi *kendi* bileşenlerinize herhangi bir özellik aktarabilirsiniz. İşte nasıl!

## Bileşene prop'lar aktarma {/*passing-props-to-a-component*/}

Bu kodda, `Profile` bileşeni, `Avatar` adlı alt bileşenine herhangi bir prop aktarmıyor:

```js
export default function Profile() {
  return (
    <Avatar />
  );
}
```

`Avatar`'a iki adımda prop'lar ekleyebilirsiniz.

### Adım 1: Alt bileşene prop'lar aktarma {/*step-1-pass-props-to-the-child-component*/}

Öncelikle, `Avatar`'a bazı prop'lar ekleyin. Örneğin, iki prop ekleyelim: `person` (bir nesne) ve `size` (bir sayı):

```js
export default function Profile() {
  return (
    <Avatar
      person={{ name: 'Lin Lanying', imageId: '1bX5QH6' }}
      size={100}
    />
  );
}
```

<Note>

Eğer `person=` sonrasındaki çift süslü parantezler sizi şaşırtırsa, bunların JSX süslü parantezlerinin içinde sadece [bir nesne olduklarını](/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx) hatırlayın.

</Note>

Şimdi bu prop'ları `Avatar` bileşeni içinde okuyabilirsiniz.

### Adım 2: Alt eleman içinde prop'ları okuma {/*step-2-read-props-inside-the-child-component*/}

Bu prop'ları, `function Avatar`'dan hemen sonra `({` ve `})` içinde virgülle ayrılan `person, size` isimlerini yazarak okuyabilirsiniz. Bu, onları `Avatar` kodunun içinde bir değişken gibi kullanmanıza olanak tanır.

```js
function Avatar({ person, size }) {
  // burada person ve size kullanılabilir
}
```

`Avatar`'a, `person` ve `size` prop'larını kullanarak render etmek için biraz mantık ekleyin ve hazırsınız.

Artık `Avatar`'ı farklı prop'larla birçok farklı şekilde render etmek için yapılandırabilirsiniz. Değerler ile oynamayı deneyin!

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

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

export default function Profile() {
  return (
    <div>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi', 
          imageId: 'YfeOqp2'
        }}
      />
      <Avatar
        size={80}
        person={{
          name: 'Aklilu Lemma', 
          imageId: 'OKS67lh'
        }}
      />
      <Avatar
        size={50}
        person={{ 
          name: 'Lin Lanying',
          imageId: '1bX5QH6'
        }}
      />
    </div>
  );
}
```

```js utils.js
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
body { min-height: 120px; }
.avatar { margin: 10px; border-radius: 50%; }
```

</Sandpack>

Prop'lar, üst ve alt bileşenleri bağımsız olarak düşünmenize olanak tanır. Örneğin, `Avatar`'ın bunları nasıl kullandığını düşünmeden, `Profile` içindeki `person` veya `size` prop'larını değiştirebilirsiniz. Benzer şekilde, `Profile`'a bakmadan, `Avatar`'ın bu prop'ları nasıl kullandığını değiştirebilirsiniz.

Prop'ları ayarlayabileceğiniz "düğmeler" gibi düşünebilirsiniz. Aslında, prop'lar fonksiyonlara sağlanan argümanlarla aynı rolü üstlenirler - aslında, prop'lar bileşeniniz için tek argümanlardır! React bileşen fonksiyonları, bir `props` nesnesi olarak tek bir argümanı kabul ederler:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

Genellikle tüm `props` nesnesine ihtiyacınız olmaz, bu yüzden onu bireysel prop'lara ayırarak yapıyı çözmeniz gerekir.

<Pitfall>

Prop'ları tanımlarken `(` ve `)` içindeki `{` ve `}` süslü parantez çiftini **unutmayın**:

```js
function Avatar({ person, size }) {
  // ...
}
```

Bu sözdizimi ["yapı çözme"](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter) olarak adlandırılır ve bir fonksiyon parametresinden prop'ları okumaya eşdeğerdir:

```js
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
```

</Pitfall>

## Bir prop için varsayılan değeri belirleme {/*specifying-a-default-value-for-a-prop*/}

Bir prop'a, belirtilen değer olmadığında geri dönecek varsayılan bir değer vermek isterseniz, parametreden hemen sonra `=` ve varsayılan değeri koyarak yapı çözmeyle yapabilirsiniz:

```js
function Avatar({ person, size = 100 }) {
  // ...
}
```

Şimdi, `<Avatar person={...} />` `size` prop'u belirtilmeden render edilirse, `size` `100` olarak ayarlanacaktır.

Varsayılan değer yalnızca, `size` prop'u eksikse veya `size={undefined}` olarak geçirilirse kullanılır. Ancak `size={null}` veya `size={0}` olarak geçirirseniz, varsayılan değer **kullanılmaz**.

## JSX yayılım sözdizimiyle prop'ları iletmek {/*forwarding-props-with-the-jsx-spread-syntax*/}

Bazı durumlarda, prop'ları aktarmak çok tekrar edici olabilir:

```js
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

Tekrarlayan kodda yanlış olan bir şey yoktur. Daha okunaklı olabilir. Ancak bazen kısa ve öz olmaya önem verirsiniz. Bazı bileşenler, bu `Profile` bileşeninin `Avatar` ile yaptığı gibi, tüm prop'larını alt elemanlarına iletirler. Doğrudan hiçbir prop kullanmadıklarından, daha özlü "yayılma (spread)" sözdizimi kullanmak mantıklı olabilir:

```js
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}
```

Bu, her birinin adını listeleyerek `Profile`'ın tüm prop'larını `Avatar`'a iletiyor.

**Spread sözdizimini ölçülü bir şekilde kullanın.** Her diğer bileşende bunu kullanıyorsanız, bir şeyler yanlış demektir. Çoğu zaman, bileşenlerinizi ayırmanız ve alt elemanları JSX olarak iletilmesi gerektiği anlamına gelir. Sonraki adımda daha fazlası var!

## JSX'i alt eleman olarak aktarma {/*passing-jsx-as-children*/}

Dahili tarayıcı etiketlerini iç içe geçirmek yaygındır:

```js
<div>
  <img />
</div>
```

Bazen kendi bileşenlerinizi aynı şekilde iç içe yerleştirmek istersiniz:

```js
<Card>
  <Avatar />
</Card>
```

Bir JSX etiketi içine içerik yerleştirdiğinizde, üst eleman, `children` adında bir prop'un içinde bu içeriği alacaktır. Örneğin, aşağıdaki `Card` bileşeni, `<Avatar />` olarak ayarlanmış bir `children` prop'u alacak ve bunu bir sarma divinde render edilecektir:

<Sandpack>

```js App.js
import Avatar from './Avatar.js';

function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

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
```

```js Avatar.js
import { getImageUrl } from './utils.js';

export default function Avatar({ person, size }) {
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
```

```js utils.js
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

`<Card>` içindeki `<Avatar>`'ı bir metinle değiştirerek, `Card` bileşeninin herhangi bir iç içe içeriği sarmalayabileceğini görmek için deneyebilirsiniz. İçinde neyin render edildiğini "bilmesi" gerekmez. Bu esnek kalıbı birçok yerde göreceksiniz.

Bir `children` prop'una sahip bir bileşeni, üst elemanların istediği JSX ile "doldurabileceği" bir "delik" olarak düşünebilirsiniz. Sıklıkla, görsel sarmalayıcılar için (`panel`, `grid` vb.) `children` prop'u kullanacaksınız.

<Illustration src="/images/docs/illustrations/i_children-prop.png" alt='Metin ve Avatar gibi "alt" parçaları için bir yer olan, bir bulmaca kartı benzeri bir Card örneği' />

Aşağıdaki `Clock` bileşeni, üst elemandan iki prop alır: `color` ve `time`. (Üst elemanın kodu, henüz incelemeyeceğimiz [durum (state)](/learn/state-a-components-memory) kullandığı için atlanmıştır.)

Aşağıdaki seçim kutusunda rengi değiştirmeyi deneyin:

<Sandpack>

```js Clock.js active
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

Bu örnek, **bir bileşenin zamanla farklı prop'lar alabileceğini** gösterir. Prop'lar her zaman statik değildir! Burada `time` prop'u her saniyede bir değişir ve `color` prop'u başka bir renk seçtiğinizde değişir. Prop'lar, bir bileşenin verilerini sadece başlangıçta değil, herhangi bir zamandaki durumunu yansıtır.

Ancak, prop'lar [immutable](https://en.wikipedia.org/wiki/Immutable_object) (değiştirilemez) özelliktedir - bilgisayar bilimlerinde "değiştirilemez" anlamına gelen bir terimdir. Bir bileşen, prop'larını değiştirmesi gerektiğinde (örneğin, bir kullanıcı etkileşimine veya yeni verilere yanıt olarak), farklı bir nesne olan _farklı prop'ları_ geçmesi için _üst elemanından_ "istemek" zorunda kalacaktır! Eski prop'ları atılacak ve sonunda JavaScript motoru tarafından bunların işgal ettiği bellek geri alınacaktır.

**Prop'ları "değiştirmeye" çalışmayın.** Kullanıcı girdisine yanıt vermeniz gerektiğinde (seçilen rengi değiştirme gibi), [State: Bir Bileşenin Belleği](/learn/state-a-components-memory) konusunda öğrenebileceğiniz şekilde "state ayarı" yapmanız gerekecektir.

<Recap>

* Prop'ları geçmek için, HTML özniteliklerini geçirdiğiniz gibi JSX'e ekleyin.
* Prop'ları okumak için, `function Avatar({ person, size })` yapısını kullanın.
* Eksik veya tanımlanmamış prop'lar için kullanılan `size = 100` gibi varsayılan bir değer belirleyebilirsiniz.
* Tüm prop'ları `<Avatar {...props} />` JSX spread sözdizimi ile iletebilirsiniz, ancak bunu abartmayın!
* `<Card><Avatar /></Card>` gibi iç içe JSX, `Card` bileşeninin `children` prop'u olarak görüntülenecektir.
* Prop'lar, her render işlemi bir prop'ların yeni bir sürümünü aldığı için okunur ve değiştirilemez.
* Prop'ları değiştiremezsiniz. Etkileşimli bir bileşen için, state ayarlaması yapmanız gerekecektir.

</Recap>



<Challenges>

#### Bileşen Ayıklama {/*extract-a-component*/}

Bu `Gallery` bileşeni, iki profille ilgili çok benzer bir işaretleme içerir. Yinelemeyi azaltmak için bunun dışında bir `Profile` bileşeni çıkarın. Hangi prop'ların geçirileceğine karar vermeniz gerekecektir.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

export default function Gallery() {
  return (
    <div>
      <h1>Önemli Bilim İnsanları</h1>
      <section className="profile">
        <h2>Maria Skłodowska-Curie</h2>
        <img
          className="avatar"
          src={getImageUrl('szV5sdG')}
          alt="Maria Skłodowska-Curie"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Meslek: </b> 
            fizikçi ve kimyager
          </li>
          <li>
            <b>Ödüller: 4 </b> 
            (Fizik Nobel Ödülü, Kimya Nobel Ödülü, Davy Madalyası, Matteucci Madalyası)
          </li>
          <li>
<<<<<<< HEAD
            <b>Keşfedilenler: </b>
            polonyum (element)
=======
            <b>Discovered: </b>
            polonium (chemical element)
>>>>>>> 2390627c9cb305216e6bd56e67c6603a89e76e7f
          </li>
        </ul>
      </section>
      <section className="profile">
        <h2>Katsuko Saruhashi</h2>
        <img
          className="avatar"
          src={getImageUrl('YfeOqp2')}
          alt="Katsuko Saruhashi"
          width={70}
          height={70}
        />
        <ul>
          <li>
            <b>Meslek: </b> 
            jeokimyager
          </li>
          <li>
            <b>Ödüller: 2 </b> 
            (Miyake Ödülü (jeokimya), Tanaka Ödülü)
          </li>
          <li>
            <b>Keşfedilenler: </b>
            deniz suyundaki karbondioksit ölçüm yöntemi
          </li>
        </ul>
      </section>
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

<Hint>

İlk olarak, bilim insanlarından birinin işaretlemesini ayıklayın. Daha sonra, ikinci örnekte eşleşmeyen parçaları bulun ve bunları prop'larla yapılandırılabilir hâle getirin.

</Hint>

<Solution>

Bu çözümde, `Profile` bileşeni birden çok prop kabul eder: `imageId` (bir string), `name` (bir string), `profession` (bir string), `awards` (bir string dizisi), `discovery` (bir string) ve `imageSize` (bir sayı).

`imageSize` prop'unun varsayılan bir değeri olduğu için bileşene aktarmıyoruz.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({
  imageId,
  name,
  profession,
  awards,
  discovery,
  imageSize = 70
}) {
  return (
    <section className="profile">
      <h2>{name}</h2>
      <img
        className="avatar"
        src={getImageUrl(imageId)}
        alt={name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li><b>Meslek:</b> {profession}</li>
        <li>
          <b>Ödüller: {awards.length} </b>
          ({awards.join(', ')})
        </li>
        <li>
          <b>Keşfedilenler: </b>
          {discovery}
        </li>
      </ul>
    </section>
  );
}

export default function Gallery() {
  return (
    <div>
      <h1>Önemli Bilim İnsanları</h1>
      <Profile
        imageId="szV5sdG"
        name="Maria Skłodowska-Curie"
        profession="fizikçi ve kimyager"
        discovery="polonyum (kimyasal element)"
        awards={[
          'Fizik Nobel Ödülü',
          'Kimya Nobel Ödülü',
          'Davy Madalyası',
          'Matteucci Madalyası'
        ]}
      />
      <Profile
        imageId='YfeOqp2'
        name='Katsuko Saruhashi'
        profession='jeokimyager'
        discovery="deniz suyundaki karbondioksiti ölçmek için bir yöntem"
        awards={[
          'Miyake Ödülü (jeokimya)',
          'Tanaka Ödülü'
        ]}
      />
    </div>
  );
}
```

```js utils.js
export function getImageUrl(imageId, size = 's') {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Eğer `awards` bir dizi ise ayrı bir `awardCount` prop'una ihtiyacınız olmadığına dikkat edin. Ardından, ödül sayısını saymak için `awards.length` kullanabilirsiniz. Prop'ların her türlü değeri kabul edebildiğini, bunların arasında dizilerin de olduğunu unutmayın!

Bu sayfadaki önceki örneklerle daha benzer olan başka bir çözüm, bir kişi hakkındaki tüm bilgileri tek bir nesnede gruplamak ve bu nesneyi tek bir prop olarak geçirmektir:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Profile({ person, imageSize = 70 }) {
  const imageSrc = getImageUrl(person)

  return (
    <section className="profile">
      <h2>{person.name}</h2>
      <img
        className="avatar"
        src={imageSrc}
        alt={person.name}
        width={imageSize}
        height={imageSize}
      />
      <ul>
        <li>
          <b>Meslek:</b> {person.profession}
        </li>
        <li>
          <b>Ödüller: {person.awards.length} </b>
          ({person.awards.join(', ')})
        </li>
        <li>
          <b>Keşfedilenler: </b>
          {person.discovery}
        </li>
      </ul>
    </section>
  )
}

export default function Gallery() {
  return (
    <div>
      <h1>Önemli Bilim İnsanları</h1>
      <Profile person={{
        imageId: 'szV5sdG',
        name: 'Maria Skłodowska-Curie',
        profession: 'fizikçi ve kimyager',
        discovery: 'polonyum (kimyasal element)',
        awards: [
          'Fizik Nobel Ödülü',
          'Kimya Nobel Ödülü',
          'Davy Madalyası',
          'Matteucci Madalyası'
        ],
      }} />
      <Profile person={{
        imageId: 'YfeOqp2',
        name: 'Katsuko Saruhashi',
        profession: 'jeokimyager',
        discovery: 'okyanus suyundaki karbondioksiti ölçmek için bir yöntem',
        awards: [
          'Jeokimya alanında Miyake Ödülü', 
          'Tanaka Ödülü'
        ],
      }} />
    </div>
  );
}
```

```js utils.js
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
.avatar { margin: 5px; border-radius: 50%; min-height: 70px; }
.profile {
  border: 1px solid #aaa;
  border-radius: 6px;
  margin-top: 20px;
  padding: 10px;
}
h1, h2 { margin: 5px; }
h1 { margin-bottom: 10px; }
ul { padding: 0px 10px 0px 20px; }
li { margin: 5px; }
```

</Sandpack>

Sözdizimi biraz farklı görünüyor çünkü bir JavaScript nesnesinin özelliklerini tanımlıyorsunuz, JSX özelliklerinin bir koleksiyonunu tanımlamıyorsunuz. Ancak, bu örnekler büyük ölçüde eşdeğerdir ve istediğiniz yaklaşımı seçebilirsiniz.

</Solution>

#### Bir prop'a dayanarak resim boyutunu ayarlayın {/*adjust-the-image-size-based-on-a-prop*/}

İlgili örnekte, `Avatar` bileşeni, `<img>` genişliği ve yüksekliğini belirleyen sayısal bir `size` prop'u alır. Bu örnekte `size` prop'u `40` olarak ayarlanmıştır. Ancak, resmi yeni bir sekmede açarsanız, resmin kendisinin daha büyük (`160` piksel) olduğunu fark edeceksiniz. Gerçek resim boyutu, hangi küçük resim boyutunun talep edildiğine bağlıdır.

`Avatar` bileşenini, `size` prop'u temelinde en yakın resim boyutunu isteyecek şekilde değiştirin. Özellikle, `size` 90'dan küçükse, `getImageUrl` işlevine `'b'` ("büyük") yerine `'s'` ("küçük") geçirin. `size` prop'unun farklı değerleriyle avatarları render ederek ve resimleri yeni bir sekmede açarak değişikliklerinizin işleyip işlemediğini doğrulayın.

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person, 'b')}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <Avatar
      size={40}
      person={{ 
        name: 'Gregorio Y. Zara', 
        imageId: '7vQD0fP'
      }}
    />
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

<Solution>

İşte bunu nasıl yapabilirsiniz:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Ayrıca [`window.devicePixelRatio`](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio) özelliğini dikkate alarak yüksek DPI ekranlar için daha keskin bir resim gösterebilirsiniz:

<Sandpack>

```js App.js
import { getImageUrl } from './utils.js';

const ratio = window.devicePixelRatio;

function Avatar({ person, size }) {
  let thumbnailSize = 's';
  if (size * ratio > 90) {
    thumbnailSize = 'b';
  }
  return (
    <img
      className="avatar"
      src={getImageUrl(person, thumbnailSize)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}

export default function Profile() {
  return (
    <>
      <Avatar
        size={40}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={70}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
      <Avatar
        size={120}
        person={{ 
          name: 'Gregorio Y. Zara', 
          imageId: '7vQD0fP'
        }}
      />
    </>
  );
}
```

```js utils.js
export function getImageUrl(person, size) {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

```css
.avatar { margin: 20px; border-radius: 50%; }
```

</Sandpack>

Prop'lar, bu şekilde mantığı `Avatar` bileşeni içine kapsayarak (ve ihtiyaç duyulursa daha sonra değiştirerek), resimlerin nasıl talep edildiği ve yeniden boyutlandırıldığı hakkında düşünmeden herkesin `<Avatar>` bileşenini kullanabilmesini sağlar.

</Solution>

#### Bir `children` prop'u içinde JSX geçirmek. {/*passing-jsx-in-a-children-prop*/}

Aşağıdaki yapıdan bir `Card` bileşeni çıkarın ve farklı JSX geçirmek için `children` prop'unu kullanın:

<Sandpack>

```js
export default function Profile() {
  return (
    <div>
      <div className="card">
        <div className="card-content">
          <h1>Photo</h1>
          <img
            className="avatar"
            src="https://i.imgur.com/OKS67lhm.jpg"
            alt="Aklilu Lemma"
            width={70}
            height={70}
          />
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h1>Hakkında</h1>
          <p>Aklilu Lemma, şistosomiyazis için doğal bir tedavi keşfeden saygın bir Etiyopyalı bilim adamıydı.</p>
        </div>
      </div>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

<Hint>

Bir bileşenin etiketi içine yerleştirdiğiniz herhangi bir JSX, bu bileşene `children` prop'u olarak iletilir.

</Hint>

<Solution>

İşte `Card` bileşenini her iki yerde de nasıl kullanabileceğinize dair örnek:

<Sandpack>

```js
function Card({ children }) {
  return (
    <div className="card">
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card>
        <h1>Hakkında</h1>
        <p>İyi bilinen bir Etiyopyalı bilim adamı olan Aklilu Lemma, şistosomiyazis için doğal bir tedavi bulmuştur.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

Her `Card`'ın her zaman bir başlığa sahip olmasını isterseniz, `title`'ı ayrı bir prop olarak da kullanabilirsiniz:

<Sandpack>

```js
function Card({ children, title }) {
  return (
    <div className="card">
      <div className="card-content">
        <h1>{title}</h1>
        {children}
      </div>
    </div>
  );
}

export default function Profile() {
  return (
    <div>
      <Card title="Fotoğraf">
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={100}
          height={100}
        />
      </Card>
      <Card title="Hakkında">
        <p>Aklilu Lemma, şistosomiyazis için doğal bir tedavi keşfeden saygın bir Etiyopyalı bilim adamıydı.</p>
      </Card>
    </div>
  );
}
```

```css
.card {
  width: fit-content;
  margin: 20px;
  padding: 20px;
  border: 1px solid #aaa;
  border-radius: 20px;
  background: #fff;
}
.card-content {
  text-align: center;
}
.avatar {
  margin: 10px;
  border-radius: 50%;
}
h1 {
  margin: 5px;
  padding: 0;
  font-size: 24px;
}
```

</Sandpack>

</Solution>

</Challenges>
