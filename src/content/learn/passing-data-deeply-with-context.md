---
title: Context ile Veriyi Derinlemesine Aktarma
---

<Intro>

Genellikle, bilgiyi üst elemandan alt elemana doğru, prop'lar ile aktarırsınız. Ancak, prop'ları aktarırken aşağıya doğru çok fazla ortanca eleman varsa veya geçirdiğiniz bilgiyi uygulamanızda birçok elemanda kullanacaksanız prop'ları aşağıya aktarmak zahmetli ve uygunsuz olur. *Context*, üst elemanın, bilgiyi kendi altındaki herhangi bir elemana tek tek prop'lar ile aktarmadan erişilebilir olmasını sağlar.

</Intro>

<YouWillLearn>

- "Prop sondajlaması" nedir
- Art arda tekrarlanan prop aktarımını context ile değiştirmek
- Context'in genel kullanım yöntemleri
- Context'in alternatifleri

</YouWillLearn>

## Prop'ları aktarmanın yarattığı sorun {/*the-problem-with-passing-props*/}

[Prop'ları aktarmak,](/learn/passing-props-to-a-component)veriyi UI ağacınız üzerinde ilgili bileşenlere aktarmanın harika bir yoludur.

Ancak, bir prop'u ağacın derinliklerine aktarmak gerektiğinde veya birçok elemanın aynı prop'a ihtiyaç duyduğu durumlarda, prop'ları aktarmak zahmetli ve uygunsuz hale gelebilir. Veriye ihtiyaç duyan elemanları ile en yakın ortak ata arasındaki mesafe uzun olabilir ve bu durum, [state'i yukarı taşımanın](/learn/sharing-state-between-components) getireceği "prop sondajı" adı verilen duruma yol açabilir.

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Üç elemanın olduğu ağaç diyagramı. Üst eleman bir değeri temsil eden mor bir baloncuk içerir. Bu değer mor ile gösterilmiş iki alt elemana doğru akar." >

State'i yukarı taşımak

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="On boğum noktasına sahip ağaç diyagramı. Her bir boğum noktasının iki veya daha az alt elemanı var. Kök boğum, bir değeri temsil eden mor bir baloncuk içerir. Bu değer iki alt elemana doğru akar, her biri değeri aktarır fakat içinde barındırmaz. Sol alt eleman, bu değeri, mor ile gösterilmiş iki alt elemana doğru aktarır. Kökün sağ alt elemanı, bu değeri, iki alt elemanından birine aktarır - sağda bulunan, mor ile gösterilmiş. O alt eleman değeri kendi tek alt elemanına aktarır, bu alt eleman da değeri mor ile gösterilmiş kendi iki alt elemanına aktarır.">

Prop sondajlaması

</Diagram>

</DiagramGroup>

Prop'ları aktarmadan veriyi ağaçtaki bileşenlere "ışınlamannın" bir yolu olsa harika olmaz mıydı? React'ın context özelliği sayesinde bu mümkün! 

## Context: prop'ları aktarmanın alternatif bir yolu {/*context-an-alternative-to-passing-props*/}

Context üst elemanın altındaki tüm ağaca veri sağlamasına olanak tanır. Context'in bir çok kullanım alanı vardır. İşte bir örnek. Boyutu için `level` kabul eden bu `Heading` elemanını ele alalım:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Üst Başlık</Heading>
      <Heading level={2}>Başlık</Heading>
      <Heading level={3}>Alt-başlık</Heading>
      <Heading level={4}>Alt-alt-başlık</Heading>
      <Heading level={5}>Alt-alt-alt-başlık</Heading>
      <Heading level={6}>Alt-alt-alt-alt-başlık</Heading>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Diyelim ki aynı `Section` içerisinde aynı boyuta sahip birden fazla başlık kullanmak istiyorsunuz:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Üst Başlık</Heading>
      <Section>
        <Heading level={2}>Başlık</Heading>
        <Heading level={2}>Başlık</Heading>
        <Heading level={2}>Başlık</Heading>
        <Section>
          <Heading level={3}>Alt-başlık</Heading>
          <Heading level={3}>Alt-başlık</Heading>
          <Heading level={3}>Alt-başlık</Heading>
          <Section>
            <Heading level={4}>Alt-alt-başlık</Heading>
            <Heading level={4}>Alt-alt-başlık</Heading>
            <Heading level={4}>Alt-alt-başlık</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Şu ana kadar, `level` prop'unu her `<Heading>` için tek tek tanımladınız:

```js
<Section>
  <Heading level={3}>Hakkında</Heading>
  <Heading level={3}>Fotoğraflar</Heading>
  <Heading level={3}>Videolar</Heading>
</Section>
```

 `level` prop'unu `<Section>` elemanına direkt aktarıp, `<Heading>` için bu prop'u tek tek tanımlamamak daha iyi olurdu. Böylece bir "section" içindeki bütün "headingler" aynı boyuta sahip olurdu:

```js
<Section level={3}>
  <Heading>Hakkında</Heading>
  <Heading>Fotoğraflar</Heading>
  <Heading>Videolar</Heading>
</Section>
```

Peki `<Heading>` elemanı kendine en yakın `<Section>` elemanının "level" boyutunu nasıl bilebilir? **Bunun için alt elemanın bir şekilde ağacın üst kısmına veriyi "sorması" gerekir.**

Bunu sadece prop'lar ile yapamazsınız. Context işte burada devreye girer. Üç adımda bu işi yapabilirsiniz:

1. **Oluştur:** context'i oluşturun. (`LevelContext`, olarak oluşturabilirsiniz, "heading" level'ı olarak kullanılacağı için.)
2. **Kullan:** context'i veriye ihtiyacı olan elemanda kullanın. (`Heading` `LevelContext`'i kullanacak.)
3. **Sağla:** veriyi tanımlayacak olan elemandan, context'i aktar. (`Section` `LevelContext`'i sağlayın, yani aktarın.)

Context üst elemanın--çok uzak olsa bile!--içindeki tüm ağaca veri aktarmasını sağlar.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Üç elemandan oluşan ağaç diyagramı. Üst eleman turuncu ile belirtilmiş bir değeri gösteren baloncuk içerir. Değer ordan turuncu ile gösterilmiş iki alt elemanına geçer." >

Context'i alt elemanda kullanmak

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="On boğum noktasına sahip ağaç diyagramı. Her bir boğum noktasının iki veya daha az alt elemanı var. Kök boğum, bir değeri temsil eden turuncu bir baloncuk içerir. Bu değer direkt olarak hepsi turuncu ile belirtilmiş dört yaprağa ve bir ortanca elemana doğru yansır. Diğer ortanca elemanlardan hiçbiri bir renkle belirtilmemiştir.">

Context'i uzak bir alt elemanda kullanmak

</Diagram>

</DiagramGroup>

### Step 1: Context'i oluştur {/*step-1-create-the-context*/}

Öncelikle, context'i oluşturup onu bir dosyadan "export" etmeniz gerekir ki diğer elemanlar onu kullanabilsin:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading level={1}>Üst Başlık</Heading>
      <Section>
        <Heading level={2}>Başlık</Heading>
        <Heading level={2}>Başlık</Heading>
        <Heading level={2}>Başlık</Heading>
        <Section>
          <Heading level={3}>Alt-başlık</Heading>
          <Heading level={3}>Alt-başlık</Heading>
          <Heading level={3}>Alt-başlık</Heading>
          <Section>
            <Heading level={4}>Alt-alt-başlık</Heading>
            <Heading level={4}>Alt-alt-başlık</Heading>
            <Heading level={4}>Alt-alt-başlık</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
export default function Heading({ level, children }) {
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js active
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

`createContext`'e verilen tek argüman _default_ değeridir. Burada, `1` en büyük başlık seviyesine karşılık gelir, ancak buraya isterseniz herhangi bir değer girebilirsiniz(obje bile). Default değerin önemini bir sonraki adımda daha iyi göreceksiniz.

### Step 2: Context'i kullanın {/*step-2-use-the-context*/}

`useContext` hook'unu React'tan ve kendi context'inizi tanımladığınız yerden "import" edin:

```js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';
```

Şuanda, `Heading` elemanı `level`'ı prop'lardan okur:

```js
export default function Heading({ level, children }) {
  // ...
}
```

Bunu yerine, `level` prop'unu kaldırın ve değeri az önce import ettiğiniz `LevelContext`'ten okuyun:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext`, `useState` ve `useReducer` gibi bir Hook'tur. Hook'ları sadece React elemanlarının içinde çağırabilirsiniz (dögülerin veya kondisyonel içerisinde çağıramazsınız.) **`useContext` React'a `Heading`'in `LevelContext`'i okumak istediğini söyler.**

Şimdi `Heading` elemanının `level` prop'u olmadığına göre, level prop'unu `Heading`'e aşağıdaki JSX'te olduğu gibi geçirmenize gerek yoktur:

```js
<Section>
  <Heading level={4}>Alt-alt-başlık</Heading>
  <Heading level={4}>Alt-alt-başlık</Heading>
  <Heading level={4}>Alt-alt-başlık</Heading>
</Section>
```

JSX'i `Section` level prop'unu alacak şekilde güncelleyin:

```jsx
<Section level={4}>
  <Heading>Alt-alt-başlık</Heading>
  <Heading>Alt-alt-başlık</Heading>
  <Heading>Alt-alt-başlık</Heading>
</Section>
```

Hatırlatma olarak, üzerinde elde etmeye çalıştığınız işaretleme bu:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Üst Başlık</Heading>
      <Section level={2}>
        <Heading>Başlık</Heading>
        <Heading>Başlık</Heading>
        <Heading>Başlık</Heading>
        <Section level={3}>
          <Heading>Alt-başlık</Heading>
          <Heading>Alt-başlık</Heading>
          <Heading>Alt-başlık</Heading>
          <Section level={4}>
            <Heading>Alt-alt-başlık</Heading>
            <Heading>Alt-alt-başlık</Heading>
            <Heading>Alt-alt-başlık</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Farkettiyseniz bu örnek şu anlık tam olarak çalışmıyor. Bütün başlıkların boyutu aynı **context'i *kullanmanıza* rağmen, daha onu *sağlamadınız.*** React bunu nereden alacağını bilmiyor!

Eğer context'i sağlamazsanız, React bir önceki adımda tanımladığınız default değeri kullanacaktır. Bu örnekte, `1` argümanını `createContext` için belirlediniz, dolayısıyla `useContext(LevelContext)`  `1` değerini döndürür, ve bütün başlıkları `<h1>` olarak ayarlar. Bu sorunu çözmek için her `Section` için kendi context'ini sağlamasına yardımcı olalım.

### Step 3: Context'i sağla {/*step-3-provide-the-context*/}

`Section` elemanı alt elemanlarını şuanlık şu şekilde render ediyor:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

**Bunları context provider ile sarın** böylece `LevelContext`'i sağlayabilirsiniz:

```js {1,6,8}
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

Bu React'a şöyle söyler: "`<Section>` içindeki herhangi bir eleman,`LevelContext`'i istediğinde, ona bu `level` değerini ver." Bu eleman UI ağacında kendisine en yakın `<LevelContext.Provider>` değerini kullanacaktır.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section level={1}>
      <Heading>Title</Heading>
      <Section level={2}>
        <Heading>Başlık</Heading>
        <Heading>Başlık</Heading>
        <Heading>Başlık</Heading>
        <Section level={3}>
          <Heading>Alt-başlık</Heading>
          <Heading>Alt-başlık</Heading>
          <Heading>Alt-başlık</Heading>
          <Section level={4}>
            <Heading>Alt-alt-başlık</Heading>
            <Heading>Alt-alt-başlık</Heading>
            <Heading>Alt-alt-başlık</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Sonuç ilk başta yazdığınız kod ile aynı, fakat her bir Heading elemanına level prop'unu tek tek aktarmanız gerekmedi! Bunun yerine, her bir Heading elemanı, başlık boyutunu kendisine en yakın Section'a sorarak "anlıyor":

1. `level` prop'unu `<Section>`'a aktarıyorsunuz.
2. `Section` alt elemanlarını `<LevelContext.Provider value={level}>` ile çevreliyor.
3. `Heading` kendisine en yakın `LevelContext` değerini `useContext(LevelContext)` ile sorguluyor.

## Context'i aynı elemandan kullanmak ve sağlamak {/*using-and-providing-context-from-the-same-component*/}

Halen her "section" için `level`' ı manuel olarak belirtiyorsunuz:

```js
export default function Page() {
  return (
    <Section level={1}>
      ...
      <Section level={2}>
        ...
        <Section level={3}>
          ...
```

Context bir üst elemandan bilgi almanızı sağlar, her `Section` `level` değerini bir üst `Section`'dan okuyabilir ve `level + 1` değerini otomatik olarak aşağıya aktarabilir. Bunu nasıl yapabileceğinize dair bir örnek:

```js Section.js {5,8}
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

Bu değişiklik ile, artık `level` prop'unu *hem* `<Section>`'a *hem de* `<Heading>`' e tanımlamanıza gerek kalmaz:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Üst Başlık</Heading>
      <Section>
        <Heading>Başlık</Heading>
        <Heading>Başlık</Heading>
        <Heading>Başlık</Heading>
        <Section>
          <Heading>Alt-başlık</Heading>
          <Heading>Alt-başlık</Heading>
          <Heading>Alt-başlık</Heading>
          <Section>
            <Heading>Alt-alt-başlık</Heading>
            <Heading>Alt-alt-başlık</Heading>
            <Heading>Alt-alt-başlık</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

Şimdi hem `Heading` hem de `Section` `LevelContext` değerini okuyarak ne kadar "derinde" olduklarını anlayabilir. Ve `Section` içinde bulunan her şeyin daha "derin" bir seviyede olduğunu belirtmek için çocuk elemanlarını `LevelContext` ile sarıyor.

<Note>

Bu örneğin, başlık boyutlarını kullanma sebebi, iç içe geçmiş elemanların context'i nasıl geçersiz kıldığını görsel olarak göstermesidir. Ancak context'in bir çok başka kullanım alanı mevcuttur. Alt ağaçtaki bütün elemanların ihtiyaç duyduğu her türlü bilgiyi aktarabilirsiniz: mevcut renk teması, şu anda oturum açmış kullanıcı vb.

</Note>

## Context'in ortanca elemanlardan aktarılması {/*context-passes-through-intermediate-components*/}

Context'i kullanan eleman ile context'i sağlayan eleman arasına istediğiniz kadar eleman koyabilirsiniz. Mesela `<div>` gibi önceden tanımlı elemanlar ve kendi tanımladığınız elemanlar.

Bu örnekte, `Post` elemanı (çizgili çerçevesi olan) iki farklı derinlikte render ediliyor. Dikkat ederseniz içindeki `<Heading>` elemanı boyutunu otomatik olarak kendisine en yakın olan `<Section>`'dan alıyor:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>My Profile</Heading>
      <Post
        title="Merhaba, Gezgin!"
        body="Maceralarımı oku."
      />
      <AllPosts />
    </Section>
  );
}

function AllPosts() {
  return (
    <Section>
      <Heading>Posts</Heading>
      <RecentPosts />
    </Section>
  );
}

function RecentPosts() {
  return (
    <Section>
      <Heading>Recent Posts</Heading>
      <Post
        title="Lizbon'un lezzetleri"
        body="...enfes pastéis de nata!"
      />
      <Post
        title="Tango ritminde Buenos Aires"
        body="Bayıldım!"
      />
    </Section>
  );
}

function Post({ title, body }) {
  return (
    <Section isFancy={true}>
      <Heading>
        {title}
      </Heading>
      <p><i>{body}</i></p>
    </Section>
  );
}
```

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children, isFancy }) {
  const level = useContext(LevelContext);
  return (
    <section className={
      'section ' +
      (isFancy ? 'fancy' : '')
    }>
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Heading must be inside a Section!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}

.fancy {
  border: 4px dashed pink;
}
```

</Sandpack>

Bunun çalışması için herhangi özel bir şey yapmadınız. `Section` içinde bulunduğu ağaç için context'i belirler, yani `<Heading>`'i istediğiniz yerde kullanabilirsiniz, ve her zaman doğru boyut da olacaktır. Yukarıdaki sandbox'ta deneyiniz!

**Context "etrafına adapte olan" elemanlar yazmanıza olanak sağlar ve  _nerede_ (yada, _hangi context'te_) oldukarına göre render'lanırlar.**

Context'in çalışma şekli size şunu hatırlatabilir: [CSS property inheritance.](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) CSS kullanırken, bir `<div>` için ve onun altındaki DOM boğumları için şöyle bir tanım yapabilirsiniz: `color: blue`, ne kadar derinde olurlarsa olsunlar, elemanlar renk özelliğini "inherit" eder. Eğer ortada bulunan farklı bir DOM boğumu `color: green` tanımlarsa "inherit" edilen renk geçersiz kılınır. Aynı şekilde, React kullanırken, yukarıdan gelen context'i geçersiz kılmanın tek yolu, alt elemanları farklı bir context sağlayıcısı ile sarmaktır.

CSS kullanırken, birbirinden farklı özellikler mesela, `color` ve `background-color` birbirini geçersiz kılmaz. Bütün bir `<div>`'in `color` özelliğini `background-color`'ı etkilemeden değiştirebilirsiniz. Aynı şekilde, **farklı React context'leri birbirini geçersiz kılmaz.** `createContext()` ile yarattığınız bütün context'ler birbirinden tamamen ayrıdır, ve her biri *kendi* context'i ile o context'i kullanan elemanları etkiler. Bir eleman birden çok context kullanabilir ve sağlayabilir, bu bir sorun teşkil etmez.

## Context'i kullanmadan önce {/*before-you-use-context*/}

Context'i kullanmak çok çekici gelebilir! Bu yüzden, onu gereksiz ve fazla kullanabilirsiniz. **Prop'ları birkaç eleman derine indirmeniz gerekiyorsa, bu context kullanmalısınız anlamına gelmez.**

Context kullanmadan önce düşünmeniz için bir kaç alternatif:

1. **Öncelikle [prop'ları aktararak.](/learn/passing-props-to-a-component) başlayın** Eğer elemanlarınız elzem değilse, bir düzine elemana bir düzine prop aktarmak alışılmadık bir durum değildir. Bu durum zahmetli gibi görünebilir, ancak hangi elemanların hangi veriyi kullandığını çok net bir şekilde gösterir! Kodunuzun bakımını yapan kişi, veri akışını prop'lar ile açık bir şekilde belirttiğiniz için size minnettar olacaktır.
2. **Elemanları çıkarın ve [JSX'i alt eleman olarak aktarın](/learn/passing-props-to-a-component#passing-jsx-as-children) to them.** Eğer bir veriyi, onu kullanmayan bir kaç katmandan (ortanca elemanlar) geçiriyorsanız, genellikle bunun nedeni, bazı elemanları çıkarmayı unutmuş olabileceğiniz anlamına gelir. Örneğin, belki de `posts` gibi veri prop'larını o veriyi direkt olarak kullanmayan bazı görsel elemanlara aktarıyor olabilirsiniz, mesela `<Layout posts={posts} />`. Bunun yerine, `Layout`'un alt elemanı (`children`) prop olarak almasını sağlayın, ve şu şekilde render edin `<Layout><Posts posts={posts} /></Layout>`. Böylece veriyi belirleyen ve kullanan elemanlar arasındaki katman sayısını azaltmış olursunuz.

Eğer bu yaklaşımların ikiside işinize yaramıyor ise, o zaman context'i kullanmayı düşünebilirsiniz.

## Context'in kullanum alanları {/*use-cases-for-context*/}

* **Tema:** Eğer uygulamanız kullanıcıya görünümü değiştirme olanağı veriyorsa (mesela karanlık mod), uygulamanızın en tepesine, context sağlayıcı yerleştirebilirsiniz, ve bu context'i görünümlerini değiştirecek olan elemanlarda kullanabilirsiniz.
* **Çevrimiçi hesap:** Bir çok eleman o an çevrimiçi olan hesap hakkında işlem yapıyor olabilir. Bu bilgiyi context'e koymak uygulamanızın herhangi bir yerinden ona ulaşmanız için kolaylık sağlar. Bazı uygulamalar birden fazla hesap ile işlem yapmanıza olanak sağlayabilir (örneğin farklı bir kullanıcı ile yorum yapma). Bu durumlarda, kullanıcı arayüzünün (UI) bir kısmını iç içe geçmiş farklı hesap sağlayıcıları ile sarabilirsiniz.
* **Routing:** Çoğu "router", mevcut rotayı tutmak için içeriden context kullanır. Bu şekilde, linkler aktif olup olmadığını "bilir". Eğer kendi router sisteminizi oluşturuyorsanız, siz de bunu yapmak isteyebilirsiniz.
* **State yönetimi:** Uygulamanız büyüdükçe, state'lerinizin birçoğu uygulamanızın üst kısmında kalabilir. Altta bulunan uzak elemanlar bu state'leri değiştirmek isteyebilir. Bu tür durumlarda [context ile birlikte reducer kullanmak](/learn/scaling-up-with-reducer-and-context) karmaşık state'leri yönetmek ve zahmetsiz bir şekilde aşağıya aktarmak için yaygın bir çözümdür.
  
Context kullanımı statik değerler ile sınırlı değildir. Eğer bir sonraki render işlemi sırasında farklı bir değer aktarırsanız, React bu değeri okuyan bütün elemanları günceller! Bu nedenle context genelde state ile birlikte kullanılır.

Genellikle, eğer bir bilgiye ağacın farklı yerlerinde bulunan uzak elemanlar tarafından ihtiyaç duyuluyorsa, bu durum context'in işinize yarayacağına dair güzel bir göstergedir.

<Recap>

* Context bir elemanın altındaki tüm ağaca bilgi aktarmasını sağlar.
* Context'i aktarmak için:
  1. Şu şekilde oluşturun ve export edin: `export const MyContext = createContext(defaultValue)`.
  2. `useContext(MyContext)` Hook'unu kullanarak, ne kadar derinde olursa olsun, herhangi bir alt elemanda context'i okuyabilirsiniz..
  3. Üst elemandan onu aktarmak için, alt elemanları şu şekilde sarın: `<MyContext.Provider value={...}>`.
* Context ortada bulunan herhangi bir elamandan "geçer".
* Context, "çevresine uyum sağlayabilen" elemanlar yazmanıza olanak sağlar.
* Context kullanmadan önce, prop'ları aktarmayı veya JSX'i `children` olarak aktarmayı deneyin.

</Recap>

<Challenges>

#### Context'i prop sondajlaması yerine kullanmak {/*replace-prop-drilling-with-context*/}

Bu örnekte, onay kutusunun (checkbox) işaretini değiştirmek, her bir `<PlaceImage>` elemanına aktarılan imageSize prop'unu değiştirir. Onay kutusunun state'i en üst seviye `App` elemanında tutulur, ancak her bir `<PlaceImage>` bu state'i bilmelidir.

Şuan, `App` `imageSize` prop'unu `List` elemanına aktarıyor, oradan `Place` elemanına aktarılıyor, oradan `PlaceImage` elemanına aktarılıyor. `imageSize` prop'unu kaldırın, bunun yerine `App` elemanından direkt olarak `PlaceImage` elemanına aktarın.

Context tanımını şurada yapabilirsiniz: `Context.js`.

<Sandpack>

```js App.js
import { useState } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Büyük resim kullan
      </label>
      <hr />
      <List imageSize={imageSize} />
    </>
  )
}

function List({ imageSize }) {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place
        place={place}
        imageSize={imageSize}
      />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place, imageSize }) {
  return (
    <>
      <PlaceImage
        place={place}
        imageSize={imageSize}
      />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place, imageSize }) {
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js Context.js

```

```js data.js
export const places = [{
  id: 0,
  name: 'Cape Town, Güney Afrika\'da Bo-Kaap',
  description: 'Evler için parlak renkler seçme geleneği 20. yüzyılın sonlarında başlamıştır.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Taichung, Tayvan\'da Gökkuşağı Köyü',
  description: 'Evleri yıkımdan kurtarmak için, yerel bir sakin olan Huang Yung-Fu, 1924 yılında hepsini boyamıştır.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Pachuca, Meksika\'da Macromural',
  description: 'Dünyanın en büyük duvar resimlerinden biri, bir tepe mahallesindeki evleri kaplar.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Rio de Janeiro, Brezilya\'da Selarón Merdivenleri',
  description: 'Bu simge yapı, Şilili sanatçı Jorge Selarón tarafından "Brezilya halkına bir övgü" olarak yaratıldı.',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, İtalya',
  description: 'Evler, 16. yüzyıla dayanan belirli bir renk sistemi izlenerek boyanmıştır.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Fas',
  description: 'Evlerin neden mavi boyandığına dair birkaç teori var, bunların arasında: rengin sivrisinekleri uzaklaştırıyor olabilmesi veya gökyüzünü ve cenneti simgeliyor olabilmesi var.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Busan, Güney Kore\'de Gamcheon Kültür Köyü',
  description: '2009 yılında köy, evleri boyayanak, sergiler ve sanat gösterileri düzenlenerek bir kültür merkezi haline getirildi.',
  imageId: 'ZfQOOzf'
}];
```

```js utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
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
```

</Sandpack>

<Solution>

`imageSize` prop'unu bütün elemanlardan kaldırın.

`Context.js`'den `ImageSizeContext`'i oluşturun ve export edin. Ardından değeri aşağı aktarmak için List'i `<ImageSizeContext.Provider value={imageSize}>` tarafından sarın, ve `useContext(ImageSizeContext)` kullanarak `PlaceImage`'de değeri okuyun:

<Sandpack>

```js App.js
import { useState, useContext } from 'react';
import { places } from './data.js';
import { getImageUrl } from './utils.js';
import { ImageSizeContext } from './Context.js';

export default function App() {
  const [isLarge, setIsLarge] = useState(false);
  const imageSize = isLarge ? 150 : 100;
  return (
    <ImageSizeContext.Provider
      value={imageSize}
    >
      <label>
        <input
          type="checkbox"
          checked={isLarge}
          onChange={e => {
            setIsLarge(e.target.checked);
          }}
        />
        Use large images
      </label>
      <hr />
      <List />
    </ImageSizeContext.Provider>
  )
}

function List() {
  const listItems = places.map(place =>
    <li key={place.id}>
      <Place place={place} />
    </li>
  );
  return <ul>{listItems}</ul>;
}

function Place({ place }) {
  return (
    <>
      <PlaceImage place={place} />
      <p>
        <b>{place.name}</b>
        {': ' + place.description}
      </p>
    </>
  );
}

function PlaceImage({ place }) {
  const imageSize = useContext(ImageSizeContext);
  return (
    <img
      src={getImageUrl(place)}
      alt={place.name}
      width={imageSize}
      height={imageSize}
    />
  );
}
```

```js Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js data.js
export const places = [{
  id: 0,
  name: 'Cape Town, Güney Afrika\'da Bo-Kaap',
  description: 'Evler için parlak renkler seçme geleneği 20. yüzyılın sonlarında başlamıştır.',
  imageId: 'K9HVAGH'
}, {
  id: 1, 
  name: 'Taichung, Tayvan\'da Gökkuşağı Köyü',
  description: 'Evleri yıkımdan kurtarmak için, yerel bir sakin olan Huang Yung-Fu, 1924 yılında hepsini boyamıştır.',
  imageId: '9EAYZrt'
}, {
  id: 2, 
  name: 'Pachuca, Meksika\'da Macromural',
  description: 'Dünyanın en büyük duvar resimlerinden biri, bir tepe mahallesindeki evleri kaplar.',
  imageId: 'DgXHVwu'
}, {
  id: 3, 
  name: 'Rio de Janeiro, Brezilya\'da Selarón Merdivenleri',
  description: 'Bu simge yapı, Şilili sanatçı Jorge Selarón tarafından "Brezilya halkına bir övgü" olarak yaratıldı.',
  imageId: 'aeO3rpI'
}, {
  id: 4, 
  name: 'Burano, İtalya',
  description: 'Evler, 16. yüzyıla dayanan belirli bir renk sistemi izlenerek boyanmıştır.',
  imageId: 'kxsph5C'
}, {
  id: 5, 
  name: 'Chefchaouen, Fas',
  description: 'Evlerin neden mavi boyandığına dair birkaç teori var, bunların arasında: rengin sivrisinekleri uzaklaştırıyor olabilmesi veya gökyüzünü ve cenneti simgeliyor olabilmesi var.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Busan, Güney Kore\'de Gamcheon Kültür Köyü',
  description: '2009 yılında köy, evleri boyayanak, sergiler ve sanat gösterileri düzenlenerek bir kültür merkezi haline getirildi.',
  imageId: 'ZfQOOzf'
}];
```

```js utils.js
export function getImageUrl(place) {
  return (
    'https://i.imgur.com/' +
    place.imageId +
    'l.jpg'
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
```

</Sandpack>

Not: Artık ortanca elemanların `imageSize` prop'unu aktarmasına gerek yok.

</Solution>

</Challenges>
