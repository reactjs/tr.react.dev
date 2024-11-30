---
title: Context ile Veriyi Derinlemesine Aktarma
---

<Intro>

Bilgiyi genelde prop'lar vasıtasıyla üst elemandan alt elemana doğru aktarırsınız. Ancak, aktarmanız gereken bileşen ulaşana kadar birçok ara bileşene iletmeniz veya birden çok bileşene aktarmanız gerekiyorsa prop kullanmak zahmetli ve karmaşık hale gelir. *Context*, bilgiyi üst bileşenden ihtiyaç duyan alt bileşenlere (derinliğine bakılmaksızın) prop olarak açıkça belirtmeden iletmenizi sağlar.

</Intro>

<YouWillLearn>

- "Prop drilling" nedir
- Birden fazla kez alt elemana aktarılan prop'u context ile değiştirmek
- Context'in yaygın kullanım durumları
- Context'in yaygın alternatifleri

</YouWillLearn>

## Prop'ları aktarmanın yarattığı sorun {/*the-problem-with-passing-props*/}

[Prop'ları aktarmak](/learn/passing-props-to-a-component), UI ağacınızdaki bileşenlere kullanacağı verileri iletmenin harika bir yoludur.

Ancak, bir prop'u ağacın derinliklerine aktarmak gerektiğinde veya birçok elemanın aynı prop'a ihtiyaç duyduğu durumlarda zahmetli ve uygunsuz hale gelebilir. Veriye ihtiyaç duyan elemanlar ile en yakın ortak üst bileşen arasındaki mesafe uzun olabilir ve [state'i yukarı taşımak](/learn/sharing-state-between-components) "prop drilling" adı verilen duruma yol açabilir.

<DiagramGroup>

<Diagram name="passing_data_lifting_state" height={160} width={608} captionPosition="top" alt="Üç elemanın olduğu ağaç diyagramı. Üst eleman bir değeri temsil eden mor bir baloncuk içerir. Bu değer mor ile gösterilmiş iki alt elemana doğru akar." >

State'i yukarı taşımak

</Diagram>
<Diagram name="passing_data_prop_drilling" height={430} width={608} captionPosition="top" alt="Her düğümün iki veya daha az çocuğu olan on düğümlü bir ağaç diyagramı. Kök düğüm, mor renkle vurgulanmış bir değeri temsil eden bir balon içerir. Değer, her biri değeri geçiren ancak kullanmayan iki çocuktan aşağı doğru akar. Soldaki çocuk, değeri her ikisi de mor renkle vurgulanmış olan iki çocuğa aktarır. Sağdaki çocuk ise değeri mor renkle vurgulanmış sağ çocuğa aktarır. Bu çocuk değeri tek çocuğuna aktarır, o da mor renkle vurgulanan iki çocuğuna aktarır.">

Prop drilling

</Diagram>

</DiagramGroup>

Veriyi prop'lar ile aktarmadan ağaçtaki bileşenlere "ışınlamanın" bir yolu olsa harika olmaz mıydı? React'ın context özelliği sayesinde bu mümkün! 

## Context: prop'ları aktarmanın alternatif bir yolu {/*context-an-alternative-to-passing-props*/}

Context, üst bileşenin altındaki tüm ağaca veri sağlamasına olanak tanır. Bir çok kullanım alanı vardır. İşte bir örnek. Boyutu için `level` kabul eden bu `Heading` elemanını ele alalım:

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

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
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

Diyelim ki aynı `Section` içerisinde birden fazla başlığın her zaman aynı boyutta olmasını istiyorsunuz:

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

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
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

Bunun yerine  `level` prop'unu `<Section>` bileşenine aktarıp `<Heading>`'den kaldırabilseydiniz daha iyi olurdu. Böylece aynı bölümdeki tüm başlıkların aynı boyuta sahip olmasını sağlayabilirsiniz:

```js
<Section level={3}>
  <Heading>Hakkında</Heading>
  <Heading>Fotoğraflar</Heading>
  <Heading>Videolar</Heading>
</Section>
```

Peki `<Heading>` elemanı kendine en yakın `<Section>` elemanının seviyesini nasıl bilebilir? **Bunun için alt bileşenin yukarıdaki bir yerden veri "istemesi" gerekir.**

Bunu sadece prop'lar ile yapamazsınız. Context burada devreye girer. Bunu üç adımda yaparsınız:

1. Context **oluşturun**. (Başlık seviyesi için olduğundan `LevelContext` olarak isimlendirebilirsiniz.)
2. Context'i veriye ihtiyacı olan bileşende **kullanın**. (`Heading`, `LevelContext`'i kullanacak.)
3. Veriyi tanımlayacak bileşenden context'i **sağlayın**. (`Section`, `LevelContext`'i sağlayacak.)

Context, üst bileşenin--uzakta olsa bile!--içindeki tüm ağaca veri aktarmasını sağlar.

<DiagramGroup>

<Diagram name="passing_data_context_close" height={160} width={608} captionPosition="top" alt="Üç elemandan oluşan ağaç diyagramı. Üst eleman turuncu ile belirtilmiş bir değeri gösteren baloncuk içerir. Değer ordan turuncu ile gösterilmiş iki alt elemanına geçer." >

Context'i alt elemanda kullanmak

</Diagram>

<Diagram name="passing_data_context_far" height={430} width={608} captionPosition="top" alt="On boğum noktasına sahip ağaç diyagramı. Her bir boğum noktasının iki veya daha az alt elemanı var. Kök boğum, bir değeri temsil eden turuncu bir baloncuk içerir. Bu değer direkt olarak hepsi turuncu ile belirtilmiş dört yaprağa ve bir ortanca elemana doğru yansır. Diğer ortanca elemanlardan hiçbiri bir renkle belirtilmemiştir.">

Context'i uzak bir alt elemanda kullanmak

</Diagram>

</DiagramGroup>

### Adım 1: Context'i oluşturun {/*step-1-create-the-context*/}

Öncelikle context'i oluşturmanız gerekir. Bileşenlerinizin kullanabilmesi için bunu **bir dosyadan dışa aktarmalısınız**:

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

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
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

```js src/LevelContext.js active
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

`createContext`'e verilen tek argüman _varsayılan_ değeridir. Burada, `1` en büyük başlık seviyesine karşılık gelir ancak herhangi bir değer (hatta obje) verebilirsiniz. Varsayılan değerin önemini bir sonraki adımda göreceksiniz.

### Adım 2: Context'i kullanın {/*step-2-use-the-context*/}

 React'tın `useContext` hook'unu ve context'inizi içe aktarın:

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

Bunu yerine, `level` prop'unu kaldırın ve değeri az önce içe aktardığınız context'ten (`LevelContext`) okuyun:

```js {2}
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

`useContext` bir Hook'tur. Tıpkı `useState` ve `useReducer` gibi, yalnızca React bileşeninin üst kapsamında çağırabilirsiniz (döngülerin veya koşulların içinde çağıramazsınız). **`useContext`, React'e `Heading` bileşeninin `LevelContext`'i okumak istediğini söyler.**

Artık `Heading` bileşeninin `level` prop'u olmadığına göre `Heading`'e aşağıdaki JSX'te olduğu gibi aktarmanıza da gerek yoktur:

```js
<Section>
  <Heading level={4}>Alt-alt-başlık</Heading>
  <Heading level={4}>Alt-alt-başlık</Heading>
  <Heading level={4}>Alt-alt-başlık</Heading>
</Section>
```

Bunun yerine JSX'i `Section`'ın `level` prop'unu alacağı şekilde güncelleyin:

```jsx
<Section level={4}>
  <Heading>Alt-alt-başlık</Heading>
  <Heading>Alt-alt-başlık</Heading>
  <Heading>Alt-alt-başlık</Heading>
</Section>
```

Hatırlatmak gerekirse, yapmaya çalıştığınız biçimlendirme budur:

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

```js src/Section.js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

```js src/Heading.js
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

```js src/LevelContext.js
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

Bu örneğin henüz tam olarak çalışmadığına dikkat edin! Tüm başlıklar aynı boyuta sahip. **Context'i *kullanıyorsunuz* ancak henüz *sağlamadınız*.** React nereden alacağını bilmiyor!

Context'i sağlamazsanız, React önceki adımda belirttiğiniz varsayılan değeri kullanır. Bu örnekte, `createContext`'e argüman olarak `1` belirttiniz. Bu nedenle `useContext(LevelContext)` ifadesi `1` döndürür ve tüm bu başlıkları `<h1>` olarak ayarlar. Her `Section`'ın kendi context'ini sağlamasını ayarlayarak bu sorunu çözelim.

### Adım 3: Context'i sağlayın {/*step-3-provide-the-context*/}

`Section` bileşeni şu anda alt bileşenlerini render eder:

```js
export default function Section({ children }) {
  return (
    <section className="section">
      {children}
    </section>
  );
}
```

Alt bileşenlerine `LevelContext` sağlamak için **context provider ile sarın**:

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

Bu React'a şunu söyler: "`<Section>` içindeki herhangi bir eleman,`LevelContext`'i istediğinde, ona bu `level` değerini ver." Bileşen, üzerindeki UI ağacında bulunan en yakın `<LevelContext.Provider>` değerini kullanır.

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

```js src/Section.js
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

```js src/Heading.js
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

```js src/LevelContext.js
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

Orijinal kodla aynı sonucu elde edersiniz, ancak her `Heading` bileşenine `level` prop'unu aktarmanız gerekmez! Bunun yerine, üstündeki en yakın `Section` bileşenine sorarak başlık seviyesini "bulur":

1. `level` prop'unu `<Section>`'a aktarırsınız.
2. `Section` alt bileşenlerini `<LevelContext.Provider value={level}>` sarmalar.
3. `Heading`, `useContext(LevelContext)` ile birlikte yukarıdaki en yakın `LevelContext`'e değerini sorar.

## Context değerini provider'ının tanımlandığı bileşende okuma {/*using-and-providing-context-from-the-same-component*/}

Şu anda hala her bölümün `level`'ını manuel olarak belirlemeniz gerekir:

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

Context, üstteki bileşenlerden bilgi okumanıza izin verdiğinden, her `Section` üstündeki `Section`'dan `level` değerini okuyarak `level + 1` değerini otomatik olarak aşağıya aktarabilir. Bunu nasıl yapabileceğinize dair bir örnek:

```js src/Section.js {5,8}
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

Bu değişiklik ile birlikte artık `level` prop'unu *ne* `<Section>`'a *ne de* `<Heading>`' e aktarmanıza gerek kalmaz:

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

```js src/Section.js
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

```js src/Heading.js
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

```js src/LevelContext.js
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

Bu örnekte başlık seviyeleri kullanılmasının sebebi, iç içe geçmiş bileşenlerin context'i nasıl ezebileceğini görselleştirmektir. Ancak context diğer birçok kullanım durumu için de yararlıdır. Tüm alt ağacın ihtiyaç duyduğu her türlü bilgiyi aktarabilirsiniz: geçerli renk teması, o anda oturum açmış kullanıcı vb.

</Note>

## Context'in ara bileşenlerden aktarılması {/*context-passes-through-intermediate-components*/}

Context'i sağlayan ve kullanan bileşenlerin arasına istediğiniz kadar bileşen ekleyebilirsiniz. Bu, hem `<div>` gibi yerleşik bileşenleri hem de kendi bileşenleriniz olabilir.

Bu örnekte, `Post` elemanı (çizgili çerçevesi olan) iki farklı derinlikte render ediliyor. Dikkat ederseniz içindeki `<Heading>` elemanı boyutunu otomatik olarak kendisine en yakın olan `<Section>`'dan alıyor:
Bu örnekte, aynı `Post` bileşeni (kesikli kenarlıklı) iki farklı derinlikte render edilmiştir. İçindeki `<Heading>`'in seviyesini otomatik olarak en yakın `<Section>`'dan aldığına dikkat edin:

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function ProfilePage() {
  return (
    <Section>
      <Heading>Profilim</Heading>
      <Post
        title="Merhaba gezgin!"
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
      <Heading>Son Yazılarım</Heading>
      <Post
        title="Lizbon'un lezzetleri"
        body="Enfes Portekiz tatlısı!"
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

```js src/Section.js
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

```js src/Heading.js
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

```js src/LevelContext.js
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

Bunun çalışması için herhangi özel bir şey yapmadınız. `Section` içinde bulunduğu ağaç için context'i belirler. `<Heading>`'i istediğiniz yerde kullanabilirsiniz ve her zaman doğru boyut da olacaktır. Yukarıdaki sandbox'ta deneyin!

**Context "çevresine adapte olan" ve _nerede_ (başka bir deyişle _hangi context'te_)  render edildiklerine bağlı olarak farklı şekilde gözüken bileşenler yazmanıza olanak sağlar.**

Context'in çalışma şekli size [CSS özellik kalıtımını](https://developer.mozilla.org/en-US/docs/Web/CSS/inheritance) andırabilir. CSS'de bir `<div>` için `color: blue` belirttiğinizde içindeki herhangi bir DOM düğümü `color: green` ile ezmediği sürece tüm elemanlar bu rengi kalıtır. Benzer şekilde, React'te yukarıdan gelen context'i ezmenin tek yolu alt bileşeni farklı bir değere sahip bir context provider'a sarmalamaktır.

CSS kullanırken, birbirinden farklı özellikler mesela, `color` ve `background-color` birbirini geçersiz kılmaz. Bütün bir `<div>`'in `color` özelliğini `background-color`'ı etkilemeden değiştirebilirsiniz. Aynı şekilde, **farklı React context'leri birbirini geçersiz kılmaz.** `createContext()` ile yarattığınız bütün context'ler birbirinden tamamen ayrıdır, ve her biri *kendi* context'i ile o context'i kullanan elemanları etkiler. Bir eleman birden çok context kullanabilir ve sağlayabilir, bu bir sorun teşkil etmez.

CSS'de `color` ve `background-color` gibi farklı özellikler birbirini ezmez. Arka plan rengini etkilemeden tüm `<div>`'lerin metin rengini kırmızı olarak ayarlayabilirsiniz. Benzer şekilde, farklı React context'leri birbirini ezmez. `createContext()` ile oluşturduğunuz her context diğerlerinden tamamen ayrıdır ve o context'i kullanan ve sağlayan bileşenleri birbirine bağlar. Bileşenler birden fazla farklı context'i sorunsuzca kullanabilir.

## Context'i kullanmadan önce {/*before-you-use-context*/}

Context'i kullanmak çok caziptir! Bu yüzden, gereksiz ve fazla kullanabilirsiniz. **Prop'ları birkaç eleman derine indirmeniz gerekiyorsa, bu context kullanmalısınız anlamına gelmez.**
Context'i kullanmak çok caziptir! Ancak, bu aynı zamanda gereğinden fazla kullanmanın da çok kolay olduğu anlamına gelir. Bazı prop'ları birkaç seviye derine aktarmanızın gerekmesi, bu bilgiler için context kullanmanız gerektiği anlamına gelmez.

Context kullanmadan önce düşünmeniz için bir kaç alternatif:

1. **[Prop olarak aktararak](/learn/passing-props-to-a-component) başlayın.** Eğer küçük bileşenleriniz yoksa, bir düzine bileşen için bir düzine prop aktarmak olağandışı bir durum değildir. Zahmetli gibi görünebilir ancak hangi bileşenlerin hangi veriyi kullandığını çok net bir şekilde gösterir! Kodunuzun bakımını yapan kişi, veri akışını prop'lar ile açık bir şekilde belirttiğiniz için size minnettar olacaktır.
2. **Bileşenlere ayırın ve [JSX'i `children` olarak aktarın](/learn/passing-props-to-a-component#passing-jsx-as-children).** Bazı verileri, bu veriyi kullanmayan (yalnızca aşağıya aktaran) birçok ara bileşen katmanından geçirmeniz gerekiyorsa, genellikle bileşene çıkarmayı unuttuğunuz kodlarınızın olduğu anlamına gelir. Örneğin, `posts` gibi veri prop'larını o veriyi direkt kullanmayan görsel bileşenlere aktarıyor olabilirsiniz, mesela `<Layout posts={posts} />`. Bunun yerine, `Layout`'un alt bileşenini `children` olarak almasını sağlayın ve `<Layout><Posts posts={posts} /></Layout>` olarak render edin. Bu kullanım, veriyi sağlayan ile veriye ihtiyaç duyan bileşenler arasındaki katman sayısını azaltır.

Eğer bu yaklaşımların ikiside işinize yaramıyor ise, o zaman context'i kullanmayı düşünebilirsiniz.

## Context'in kullanım alanları {/*use-cases-for-context*/}

* **Tema:** Uygulamanız kullanıcının görünümü değiştirmesine izin veriyorsa (mesela karanlık mod), uygulamanızın en üstüne bir context provider koyabilir ve bu context'i görsel görünümlerini değiştirmesi gereken bileşenlerde kullanabilirsiniz.
* **Çevrimiçi hesap:** Bir çok bileşenin o anda oturum açmış olan kullanıcıyı bilmesi gerekebilir. Bunu bir context'e yerleştirmek, ağacın herhangi bir yerinde okumayı kolaylaştırır. Bazı uygulamalar aynı anda birden fazla hesabı çalıştırmanıza da izin verir (örneğin, farklı bir kullanıcı olarak yorum bırakmak için). Bu gibi durumlarda, kullanıcı arayüzünün bir kısmını farklı geçerli kullanıcıya sahip provider'a sarmalamak uygun olabilir.
* **Routing:** Çoğu routing çözümü, geçerli yolu tutmak için dahili olarak context kullanır. Linkler aktif olup olmadığını bu şekilde "bilir". Kendi yönlendiricinizi oluşturuyorsanız, siz de bunu yapmak isteyebilirsiniz.
* **State yönetimi:** Uygulamanız büyüdükçe, uygulamanızın üst kısmına yakın çok sayıda state ile karşılaşabilirsiniz. Farklı derinlikteki birçok bileşen bunları değiştirmek isteyebilir. Karmaşık state'leri yönetmek ve çok fazla güçlük çekmeden uzaktaki bileşenlere aktarmak için [context ile birlikte bir reducer kullanmak](/learn/scaling-up-with-reducer-and-context) yaygındır.
  
Context kullanımı, statik değerlerle sınırlı değildir. Bir sonraki render'da farklı bir değer iletirseniz, React onu okuyan tüm bileşenleri günceller! Bu yüzden context genellikle state ile birlikte kullanılır.

Genellikle, bazı bilgilere ağacın farklı bölümlerindeki bileşenler tarafından ihtiyaç duyulması, context'in işinize yarayacağına dair güzel bir göstergedir.

<Recap>

* Context, bir elemanın altındaki tüm ağaca bilgi aktarmasını sağlar.
* Context'i aktarmak için:
  1. `export const MyContext = createContext(defaultValue)` ile oluşturun ve dışa aktarın.
  2. Farklı derinlikteki herhangi bir alt bileşenden okumak için `useContext(MyContext)` Hook'una aktarın.
  3. Üst bileşenden değer sağlamak için, alt bileşenleri `<MyContext.Provider value={...}>` içine sarın.
* Context ortada bulunan herhangi bir elamandan aktarılır.
* Context, "çevresine adapte olan" bileşenler yazmanıza olanak sağlar.
* Context kullanmadan önce, prop olarak aktarmayı veya JSX'i `children` olarak iletmeyi deneyin.

</Recap>

<Challenges>

#### Prop drilling yerine context kullanmak {/*replace-prop-drilling-with-context*/}

Bu örnekte, onay kutusunun (checkbox) işaretini değiştirmek, her `<PlaceImage>` bileşenine aktarılan `imageSize` prop'unu değiştirir. Onay kutusunun state'i en üst kapsam olan `App` bileşeninde tutulur her `<PlaceImage>`'ın bundan haberdar olması gerekir.

Şu anda, `App` `imageSize` değerini `List`'e, `List` de `PlaceImage`'a aktarmaktadır. `imageSize` prop'unu kaldırın ve bunun yerine `App` bileşeninden doğrudan `PlaceImage`'a aktarın.

Context tanımını `Context.js` dosyasında yapabilirsiniz.

<Sandpack>

```js src/App.js
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
        Büyük resimleri kullan
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

```js src/Context.js

```

```js src/data.js
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
  description: 'Evlerin neden maviye boyandığına dair birkaç teori var, bunların arasında: rengin sivrisinekleri uzaklaştırıyor olabilmesi veya gökyüzünü ve cenneti simgeliyor olabilmesi var.',
  imageId: 'rTqKo46'
}, {
  id: 6,
  name: 'Busan, Güney Kore\'de Gamcheon Kültür Köyü',
  description: '2009 yılında köy, evleri boyayanak, sergiler ve sanat gösterileri düzenlenerek bir kültür merkezi haline getirildi.',
  imageId: 'ZfQOOzf'
}];
```

```js src/utils.js
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

`imageSize` prop'unu bütün bileşenlerden kaldırın.

`Context.js` dosyasında `ImageSizeContext`'i oluşturun ve dışa aktarın. Ardından değeri aşağı aktarmak için `List`'i `<ImageSizeContext.Provider value={imageSize}>` ile sarın ve `useContext(ImageSizeContext)` kullanarak `PlaceImage` bileşeninde değerini okuyun:

<Sandpack>

```js src/App.js
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

```js src/Context.js
import { createContext } from 'react';

export const ImageSizeContext = createContext(500);
```

```js src/data.js
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

```js src/utils.js
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

Not: Artık ara bileşenlere `imageSize` prop'unu iletmeye gerek olmadığına dikkat edin.

</Solution>

</Challenges>
