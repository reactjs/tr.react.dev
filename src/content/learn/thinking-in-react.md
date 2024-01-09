---
title: React'te Düşünmek
---

<Intro>

React baktığınız tasarımlar ve oluşturduğunuz uygulamalar hakkında düşünme şeklinizi değiştirebilir. React ile bir kullanıcı arayüzü oluşturduğunuzda, öncelikle uygulamanızı *bileşenler* adı verilen parçalara ayırırsınız. Ardından, her bileşeniniz için farklı görsel durumlar tanımlarsınız. Son olarak, veri akışını sağlamak için bileşenlerinizi birbirine bağlarsınız. Bu öğreticide, React ile arama özelliği olan bir ürün veri tablosu oluşturmanın düşünce sürecinde size rehberlik edeceğiz.

</Intro>

## Bir Örnekle Başlayın {/*start-with-the-mockup*/}

Öncelikle, bir JSON API'mızın ve tasarımcımızdan gelen bir modelimizin olduğunu hayal edin.

JSON API şöyle bir veri döndürüyor:

```json
[
  { category: "Meyveler", price: "₺10", stocked: true, name: "Elma" },
  { category: "Meyveler", price: "₺10", stocked: true, name: "Mandalina" },
  { category: "Meyveler", price: "₺20", stocked: false, name: "Portakal" },
  { category: "Sebzeler", price: "₺20", stocked: true, name: "Ispanak" },
  { category: "Sebzeler", price: "₺40", stocked: false, name: "Kabak" },
  { category: "Sebzeler", price: "₺10", stocked: true, name: "Börülce" }
]
```

Tasarımımız da şöyle:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

React'te bir kullanıcı arayüzü (UI) oluşturmak için genellikle hep aynı beş adımı izleyeceksiniz.

## Adım 1: Kullanıcı Arabirimini Bileşen Hiyerarşisine Bölün {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Her bileşenin etrafına kutular çizin ve bileşenlerinize isim verin. Bir tasarımcı ile çalışıyorsanız, tasarım aracında bileşenler zaten adlandırmış olabilirler. Onlara sorun!

Tecrübenize bağlı olarak, bir tasarımı farklı yöntemlerle bileşenlere ayırmayı düşünebilirsiniz:

* **Programlama**--yeni bir fonksiyon veya nesne oluşturup oluşturmayacağınıza karar vermek için aynı teknikleri kullanın. Bu tekniklerden biri [tek sorumluluk ilkesi](https://tr.wikipedia.org/wiki/Tek_sorumluluk_ilkesi)dir, yani bir bileşen ideal olarak sadece bir şey yapmalıdır. Büyümeye başlarsa, daha küçük alt bileşenlere ayrılmalıdır.
* **CSS**--tek tek neler için sınıf seçiçiler yazacağınızı düşünün. (Bununla birlikte, bileşenler biraz daha az ayrıntılıdır.)
* **Tasarım**--tasarımın katmanlarını nasıl düzenleyeceğinizi düşünün.

JSON veriniz iyi yapılandırılmışsa, genellikle arayüzün bileşen yapısıyla doğal bir şekilde eşleştiğini göreceksiniz. Çünkü UI ve veri modelleri genellikle aynı bilgi mimarisine, yani aynı şekle sahiptir. Arayüzünüzü, her bileşenin veri modelinizin bir parçasıyla eşleştiği bileşenlere ayırın.

Bu ekranın beş bileşeni var:

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (gri) bütün uygulamayı içerir.
2. `SearchBar` (mavi) kullanıcıdan arama sorgusunu alır.
3. `ProductTable` (lavanta) kullanıcının arama sorgusuna göre listeyi filtreleyip görüntüler.
4. `ProductCategoryRow` (yeşil) her kategorinin başlığını görüntüler.
5. `ProductRow`	(sarı) her ürün için bir satır görüntüler.

</CodeDiagram>

`ProductTable` (lavanta) öğesine bakarsanız, tablo başlığının ("İsim" ve "Fiyat" etiketlerini içeren kısım) kendi bileşeni olmadığını görürsünüz. Bu bir tercih meselesidir ve her iki şekilde de yapılabilir. Bu örnekte, başlık kısmı `ProductTable`'ın bir parçasıdır, çünkü `ProductTable` listesinin içinde görünüyor. Ancak, bu başlık kısmı karmaşık hale gelirse (örneğin, sıralama özelliği eklerseniz), onu kendi `ProductTableHeader` bileşenine taşıyabilirsiniz.

Tasarım modelinizdeki bileşenleri tanımladığınıza göre, bunları bir hiyerarşi içinde düzenleyin. Modelde başka bir bileşen içinde görünen bileşenler, hiyerarşide bir alt öğe olarak görünmelidir:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## Adım 2: React’te Statik Versiyonunu Oluşturun {/*step-2-build-a-static-version-in-react*/}

Artık bileşen hiyerarşisine sahip olduğunuza göre, uygulamanızı hayata geçirme vakti geldi. Bunun en kolay yolu, herhangi bir etkileşim eklemeden (şimdilik!) veri modelinizden kullanıcı arayüzünü oluşturan bir versiyon oluşturmaktır. Statik versiyonu önce oluşturmak ve sonrasında etkileşim eklemek genellikle daha kolaydır. Çünkü statik bir sürüm oluşturmak *daha çok yazma ve daha az düşünme* gerektirirken, etkileşimli (interaktif) versiyonu yazmak *daha çok düşünme ve daha az yazma* gerektirir.

Veri modelinizi render eden bir statik versiyonu oluşturmak için, diğer bileşenleri kullanan ve [prop’lar](/learn/passing-props-to-a-component) aracılığıyla veri ileten [bileşenler](/learn/your-first-component) oluşturmak isteyeceksiniz. prop’lar bileşenler arasında yukarıdan aşağıya veri iletmenin bir yoludur. (Eğer [state](/learn/state-a-components-memory) konseptine aşinaysanız, bu statik versiyonu oluşturmak için state’leri hiçbir şekilde kullanmayın. State konsepti sadece etkileşim, yani zaman içinde değişen verilerin olduğu durumlar, için ayrılmıştır. Buna, uygulamanın statik bir sürümünü yaptığınız için, ihtiyacınız yoktur.)

Uygulamanızı, hiyerarşide daha yukarıdaki (örneğin, `FilterableProductTable`) bileşenlerden başlayarak, yukarıdan aşağıya (top-down) şeklinde; ya da daha aşağıdaki (`ProductRow`) bileşenler ile başlayarak, aşağıdan yukarıya (bottom-up) şeklinde oluşturabilirsiniz. Daha basit örneklerde, genellikle yukarıdan aşağıya gitmek daha kolaydır. Daha büyük projelerde ise aşağıdan yukarıya gitmek daha kolaydır.

<Sandpack>

```jsx src/App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>İsim</th>
          <th>Fiyat</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Ara..." />
      <label>
        <input type="checkbox" />
        {' '}
       Sadece stokta olan ürünleri göster
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  { category: "Meyveler", price: "₺10", stocked: true, name: "Elma" },
  { category: "Meyveler", price: "₺10", stocked: true, name: "Mandalina" },
  { category: "Meyveler", price: "₺20", stocked: false, name: "Portakal" },
  { category: "Sebzeler", price: "₺20", stocked: true, name: "Ispanak" },
  { category: "Sebzeler", price: "₺40", stocked: false, name: "Kabak" },
  { category: "Sebzeler", price: "₺10", stocked: true, name: "Börülce" }
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(Eğer bu kod korkutucu geliyorsa, önce [Hızlı Başlangıç](/learn/) bölümünü okuyun!)

Bileşenlerinizi oluşturduktan sonra, veri modelinizi render eden yeniden kullanılabilir bileşenlerden oluşan bir kütüphaneniz olacaktır. Bu statik bir uygulama olduğu için, bileşenler yalnızca JSX döndürecektir. Hiyerarşinin en üstündeki bileşen (`FilterableProductTable`) veri modelinizi bir prop olarak alacaktır. Bu, tek yönlü veri akışı (_one-way data flow_) olarak adlandırılır; çünkü veri, en üstteki bileşenden ağacın en altındaki bileşenlere doğru akar.

<Pitfall>

Bu noktada, herhangi bir state değeri kullanmamalısınız. Onun için bir sonraki adımı bekleyin!

</Pitfall>

## Step 3: Arayüzün minimal (ancak eksiksiz) halini belirleme {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

Kullanıcı arayüzünüzü etkileşimli hale getirmek için, kullanıcılarınızın temel veri modelinizi değiştirmesine izin vermeniz gerekir. Bunun için *state* kullanacaksınız.

State'i, uygulamanızın hatırlaması gereken minimum değişen veri kümesi olarak düşünün. State oluşturmanın en önemli ilkesi *Kendinizi Tekrar Etmemektir* ([DRY (Don't Repeat Yourself).](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)). Uygulamanızın ihtiyaç duyduğu state'i belirleyin ve kalan her şeyi sadece ihtiyaç olduğunda hesaplayın. Örneğin, bir alışveriş listesi oluşturuyorsanız; listedeki öğeleri state halinde bir dizi olarak saklayabilirsiniz. Listedeki öğe sayısını da görüntülemek istiyorsanız öğe sayısını başka bir state değeri olarak tutmayın; bunun yerine dizinin uzunluğunu okuyun (length of array).

Örnek uygulamamızdaki sahip olduğumuz tüm veri parçalarına bakalım:

1. Orijinal ürün listesi
2. Kullanıcının girdiği arama metni
3. Checkbox’ın değeri
4. Filtrelenmiş ürün listesi

Bunlarin hangileri state? State olmayanları belirleyin:

* Zaman içinde **değişmeden mi** duruyor? Eğer öyleyse, state değildir.
* Prop'lar aracılığıyla **üst bileşenden mi geliyor**? Eğer öyleyse, state değildir.
* Varolan state veya prop'lara dayalı olarak **hesaplayabilir misiniz**? Eğer öyleyse, *kesinlikle* state değildir!

Geriye kalanlar muhtemelen state'tir.

Hadi teker teker inceleyelim:

1. Orijinal ürün listesi **prop olarak iletildiği için state değildir.**
2. Arama metni zaman içinde değiştiği için ve bir yerden hesaplanamadığı için state'tir.
3. Checkbox'un değeri zaman içinde değiştiği için ve bir yerden hesaplanamadığı için state'tir.
4. Filtrelenmiş ürün listesi, orijinal ürün listesini alıp arama metni ve checkbox'ın değerine göre filtreleyip **hesaplanabilir**. Bu yüzden **state değildir**.

Demek ki sadece arama metni ve checkbox'ın değeri state'tir! Güzel iş!

<DeepDive>

#### Prop'lar vs State {/*props-vs-state*/}

React'te iki tür "model" veri vardır: prop'lar ve state. İkisi birbirinden çok farklıdır:

* [**Prop'lar** fonksiyonlara ilettiğiniz argümanlara](/learn/passing-props-to-a-component) benzer. Prop'lar, üst bileşenin alt bileşene data iletip, görünümünü özelleştirmesini sağlar. Örneğin, bir `Form` bileşeni bir `Button` bileşenine `color` prop'u iletebilir.
* [**State** bir bileşenin hafızası gibidir](/learn/state-a-components-memory). Bir bileşenin bazı bilgileri takip etmesini ve gelen etkilşimlere cevap olarak o bilgiyi değiştirmesini sağlar. Örneğin, bir `Button` bileşeni `isHovered` state'ini takip edebilir.

Prop'lar ve state farklıdır, ancak birlikte çalışırlar. Bir üst bileşen genellikle bazı bilgileri state olarak tutar (değiştirebilmek için) ve bu bilgiyi alt bileşenlere prop olarak *geçirir*. İlk okumada aradaki fark hala belirsiz geliyorsa sorun değil. Gerçekten oturması için biraz pratik gerekiyor!

</DeepDive>

## Step 4: State’inizin barınacağı yeri belirleyin {/*step-4-identify-where-your-state-should-live*/}

Uygulamanızın minimum state verisini belirledikten sonra, bu state'i değiştirmekten sorumlu olan veya state'e *sahip olan* bileşeni belirlemeniz gerekir. Unutmayın: React, veriyi yukarıdan aşağıya doğru tek yönlü olarak (one-way data flow) aktarır. Bu yüzden, hangi bileşenin hangi state'i sahipleneceği hemen net olmayabilir. Bu konseptle yeni tanışıyorsanız bu zor olabilir, ancak aşağıdaki adımları takip ederek çözebilirsiniz!

Uyguamanızdaki her state parçası için:

1. State'e bağlı olarak bir şeyler render eden *her* bileşeni belirleyin.
2. O bileşenlere en yakın ortak üst bileşeni bulun (Hiyerarşide hepsinin üstünde olan bir bileşen).
3. State'in barınacağı yere karar verin:
    1. Genellikle, state'i direkt olarak ortak üst bileşene koyabilirsiniz.
    2. Ayrıca State'i, ortak üst bileşenlerinin üstündeki bir bileşene de koyabilirsiniz.
    3. State'i koyabileceğiniz bir bileşen bulamıyorsanız, sadece state'i tutması için yeni bir bileşen oluşturun ve onu ortak üst bileşenlerinin üstündeki bir yere ekleyin.

Önceki adımda, bu uygulamadaki iki state parçasını buldunuz: arama inputu ve checkbox'ın değeri. Bu örnekte ikisi daima birlikte görünüyor; bu yüzden aynı yere koymak mantıklıdır.

Şimdi o ikisi için stratejimizi gözden geçirelim:

1. **State kullanan bileşenleri belirleyin:**
    * `ProductTable` stat'e göre ürün listesini filtrelemesi gerekiyor. (arama metni ve checkbox değeri).
    * `SearchBar` state'i göstermesi gerekiyor. (arama metni ve checkbox değeri).
2. **Ortak üst bileşeni bulun:** İki bileşenin de ortak olarak paylaştığı üst bileşen `FilterableProductTable` bileşenidir.
3. **State'in barınacağı yere karar verin**: Filtre metni ve checkbox için gerekli state değerlerini `FilterableProductTable` bileşeninde tutacağız.

Sonuç olarak state değerleri `FilterableProductTable` bileşeninde barınacak.

Bileşene state eklemek için [`useState()` Hook'unu](/reference/react/useState) kullanın. Hook'lar React'e "bağlanmanızı" (hook-into) sağlayan özel fonksiyonlardır. `FilterableProductTable` bileşeninin en üstüne iki state değişkeni ekleyin ve başlangıç değerlerini belirtin:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

Then, pass `filterText` and `inStockOnly` to `ProductTable` and `SearchBar` as props:

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

Uygulamanızın nasıl davranacağını görmeye başlayabilirsiniz. Aşağıdaki sandbox'ta, `filterText` başlangıç değerini `useState('')` yerine `useState('elma')` olarak değiştirin. Hem arama inputu hem de tablo güncellenecektir:

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>İsim</th>
          <th>Fiyat</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Ara..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Sadece stoktaki ürünleri göster
      </label>
    </form>
  );
}

const PRODUCTS = [
  { category: "Meyveler", price: "₺10", stocked: true, name: "Elma" },
  { category: "Meyveler", price: "₺10", stocked: true, name: "Mandalina" },
  { category: "Meyveler", price: "₺20", stocked: false, name: "Portakal" },
  { category: "Sebzeler", price: "₺20", stocked: true, name: "Ispanak" },
  { category: "Sebzeler", price: "₺40", stocked: false, name: "Kabak" },
  { category: "Sebzeler", price: "₺10", stocked: true, name: "Börülce" }
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Farkettiyseniz, formu düzenlemek henüz çalışmıyor. Yukarıdaki sandbox'ta nedenini açıklayan bir konsol hatası var:

<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field.

</ConsoleBlock>

<ConsoleBlock level="error">

Bir form alanına \`value\` prop'u verdiniz; ancak bir \`onChange\` handler'ı sağlamadınız. Bu salt-okunur bir form alanı oluşturacaktır.

</ConsoleBlock>



Yukarıdaki sandboxta, `ProductTable` ve `SearchBar`, tabloyu, inputu ve checkbox'ı render etmek için, `filterText` ve `inStockOnly` prop'larını okur. Örneğin, `SearchBar`'ın input değerini nasıl doldurduğuna bakalım:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Ara..."/>
```

Ancak henüz kullanıcı eylemlerine (yazmak gibi) yanıt vermek için herhangi bir kod eklemediniz. Bu da son adımınız olacak.

## Step 5: Ters veri akışı ekleyin {/*step-5-add-inverse-data-flow*/}

Uygulumanız şu anda, prop'lar ve state'in hiyerarşi boyunca aşağı doğru akmasıyla, doğru bir şekilde render ediliyor. Ancak kullanıcı girdisine göre state'i değiştirmek için, ters istikametteki veri akışını da desteklenmeniz gerekemktedir. Hiyerarşinin derinliklerindeki form bileşenlerinin `FilterableProductTable` bileşenindeki state'i güncellemesi gerekecek.

React bu veri akışını açıkça yapar, ancak iki-yönlü veri bağlamaya göre biraz daha fazla kod yazmanızı gerektirir. Yukarıdaki örnekte yazı yazmaya veya kutuyu işaretlemeye çalışırsanız, React girdinizi görmezden gelir. Bu kasıtlıdır. `<input value={filterText} />` yazarak, `input`'un `value` prop'unu her zaman `FilterableProductTable`'dan iletilem `filterText` state'ine eşit olarak ayarladınız. `filterText` state'i hiçbir zaman değişmediği için, input hiçbir zaman değişmez.

Kullanıcı form inputlarını değiştirdiğinde, state'in bu değişiklikleri yansıtacak şekilde güncellenmesini istersiniz. State `FilterableProductTable`'a aittir, bu yüzden yalnızca o bileşen `setFilterText` ve `setInStockOnly` fonksiyonlarını çağırabilir. `SearchBar`'ın `FilterableProductTable`'ın state'ini güncellemesine izin vermek için, bu fonksiyonları `SearchBar`'a iletmeniz gerekir:

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

`SearchBar`'ın içinde, `onChange` olay yöneticilerini ekleyip, onlar aracılığıyla üst bileşenin state'ini güncelleyeceksiniz:

```js {5}
<input 
  type="text" 
  value={filterText} 
  placeholder="Ara..." 
  onChange={(e) => onFilterTextChange(e.target.value)} />
```

Uygulama şimdi tamamen çalışıyor!

<Sandpack>

```jsx src/App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>İsim</th>
          <th>Fiyat</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Ara..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Sadece stoktaki ürünleri göster
      </label>
    </form>
  );
}

const PRODUCTS = [
  { category: "Meyveler", price: "₺10", stocked: true, name: "Elma" },
  { category: "Meyveler", price: "₺10", stocked: true, name: "Mandalina" },
  { category: "Meyveler", price: "₺20", stocked: false, name: "Portakal" },
  { category: "Sebzeler", price: "₺20", stocked: true, name: "Ispanak" },
  { category: "Sebzeler", price: "₺40", stocked: false, name: "Kabak" },
  { category: "Sebzeler", price: "₺10", stocked: true, name: "Börülce" }
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Olayları yönetmek ve state'i güncellemek hakkında daha fazla bilgi için [Etkileşim Ekleme](/learn/adding-interactivity) bölümüne bakabilirsiniz.

## Bundan sonrası {/*where-to-go-from-here*/}

Bu, bileşenleri ve uyguamaları React ile nasıl oluşturacağınızı düşünmenin çok kısa bir girişiydi. Hemen şimdi [bir React projesi başlatabilirsiniz](/learn/installation) veya bu öğreticide kullanılan tüm sözdizimi hakkında [daha derinlere inebilirsiniz](/learn/describing-the-ui).
