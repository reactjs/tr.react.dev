---
id: lists-and-keys
title: Listeler ve Anahtarlar
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

Öncelikle listelerin JavaScript'te nasıl dönüştürüldüğünü gözden geçirelim.

Aşağıdaki kod göz önüne alındığında, `sayılardan` oluşan bir diziyi almak ve değerlerini iki katına çıkarmak için [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) fonksiyonunu kullanırız. `map()` tarafından döndürülen yeni diziyi `doubled` değişkenine atayıp ekrana yazdırırız:

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

Bu kod konsol ekranına `[2, 4, 6, 8, 10]` yazdırır.

React'te, dizileri [element](/docs/rendering-elements.html) listelerine dönüştürmek de neredeyse aynıdır.

### Çoklu Bileşenleri Render Etmek {#rendering-multiple-components}

Elementlerden koleksiyonlar oluşturabilir ve bu koleksiyonları süslü parantezleri `{}` kullanarak [JSX'e dahil edebilirsiniz](/docs/introducing-jsx.html#embedding-expressions-in-jsx).

Aşağıda, JavaScript'in [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) fonksiyonunu kullanarak `numbers` dizisinin içinde geziyoruz. Her bir element için bir `<li>` elemanı döndürüyoruz. Son olarak da, ortaya çıkan diziyi `listItems`a atıyoruz:

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

<<<<<<< HEAD
`listItems` dizisinin tamamını bir `<ul>` elemanının içine ekliyoruz ve [DOM'a render ediyoruz](/docs/rendering-elements.html#rendering-an-element-into-the-dom):
=======
Then, we can include the entire `listItems` array inside a `<ul>` element:
>>>>>>> 1d21630e126af0f4c04ff392934dcee80fc54892

```javascript{2}
<ul>{listItems}</ul>
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

Bu kod 1 ile 5 arasındaki sayıların madde işaretli listesini döndürür.

### Temel Liste Bileşeni {#basic-list-component}

Genellikle listeleri bir [bileşenin](/docs/components-and-props.html) içinde render edersiniz.

Bir önceki örneği, bir `sayı` dizisini kabul eden ve bir öğe listesi çıktısı veren bir bileşende yeniden düzenleyebiliriz.

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<NumberList numbers={numbers} />);
```

Bu kodu çalıştırdığınızda liste elemanları için bir anahtar verilmesi gerektiği konusunda size bir uyarı verilir. Bir "anahtar" öğe listeleri oluştururken eklemeniz gereken bir string özelliğidir. Bunun neden önemli olduğunu bir sonraki bölümde inceleyeceğiz.

`numbers.map()` içindeki liste elemanlarına birer `anahtar` atayalım ve eksik anahtar sorununu düzeltelim:

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Anahtarlar {#keys}

Anahtarlar; hangi öğelerin değiştiğini, eklendiğini ya da silindiğini belirleme noktasında React'e yardımcı olur:

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

Bir anahtar seçmenin en iyi yolu, kardeşleri arasında bir liste öğesini benzersiz olarak tanımlayan bir string kullanmaktır. Çoğu zaman verinizin içindeki ID'leri anahtar olarak kullanırsınız:

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

Render edilen öğeleriniz için sabit ID'leriniz yoksa son çare olarak öğenin index numarasını anahtar olarak kullanabilirsiniz:

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Bunu yalnızca öğelerinizin sabit ID'leri yoksa yapın
  <li key={index}>
    {todo.text}
  </li>
);
```

Dizi içindeki elemanların değişme ihtimali varsa, anahtarlar için index numaralarının kullanılmasını önermiyoruz. Bu, performansı olumsuz yönde etkileyebilir ve bileşen state'i ile ilgili sorunlara neden olabilir. [Index numarasının anahtar olarak kullanılmasının olumsuz etkilerine dair detaylı açıklama](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318) için Robin Pokorny'nin makalesine göz atın. Öğeleri listelemek için belirgin bir anahtar atamamayı seçtiğinizde, React varsayılan olarak index numaralarını anahtar olarak kullanacaktır.

Daha fazla bilgi edinmek istiyorsanız, işte size [neden anahtarların gerekli olduğuna dair](/docs/reconciliation.html#recursing-on-children) detaylı bir açıklama.

### Anahtarları Olan Bileşenleri Çıkarmak {#extracting-components-with-keys}

Anahtarlar yalnızca çevreleyen dizinin bağlamında anlamlıdır.

Örneğin bir `ListItem` bileşenini [çıkarırsanız](/docs/components-and-props.html#extracting-components), anahtarı `ListItem`'in içindeki `<li>` öğesinde değil, dizinin içindeki `<ListItem />` öğelerinde tutmalısınız.

**Örnek: Yanlış Anahtar Kullanımı**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // Yanlış! Anahtarı burada belirtmeye gerek yok:
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Yanlış! Anahtar burada tanımlanmalıydı:
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

**Örnek: Doğru Anahtar Kullanımı**

```javascript{2,3,9,10}
function ListItem(props) {
  // Doğru! Anahtarı burada belirtmeye gerek yok:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Doğru! Anahtar dizinin içinde belirtilmelidir:
    <ListItem key={number.toString()} value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

[**CodePen'de deneyin**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

Temel bir kural da, `map()` çağrısının içindeki elemanların anahtarlara ihtiyaç duymasıdır.

### Anahtarlar Sadece Kardeşler Arasında Benzersiz Olmalıdır {#keys-must-only-be-unique-among-siblings}

Dizilerde kullanılan anahtarlar kardeşleri arasında benzersiz olmalıdır. Ancak, küresel olarak (uygulama genelinde) benzersiz olmaları gerekmez. İki farklı dizi ürettiğimizde aynı anahtarları kullanabiliriz:

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Merhaba Dünya', content: 'React Öğrenmeye Hoşgeldiniz!'},
  {id: 2, title: 'Kurulum', content: 'React\'i npm üzerinden kurabilirsiniz.'}
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Blog posts={posts} />);
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

Anahtarlar, React'e bir ipucu olarak hizmet eder, ancak bileşenlerinize aktarılmazlar. Bileşeninizde aynı değere ihtiyacınız varsa, belirgin bir şekilde farklı bir ada sahip bir `prop` olarak iletin:

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

Yukarıdaki örnekte, `Post` bileşeni `props.id` yi okuyabilir, ancak `props.key` i okuyamaz.

### JSX İçinde map() Kullanımı {#embedding-map-in-jsx}

Yukarıdaki örneklerde ayrı bir `listItems` değişkeni tanımladık ve JSX'e dâhil ettik:

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX, [herhangi bir ifadeyi süslü parantezler içerisine yerleştirmeye](/docs/introducing-jsx.html#embedding-expressions-in-jsx) izin verir, böylece `map ()` sonucunu satır içi olarak ekleyebiliriz:

```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

Bazen bu yöntem daha temiz bir kodla sonuçlanır; ancak bu tarz da kötüye kullanılabilir. JavaScript'te olduğu gibi, okunabilirlik için, bir değişken çıkarmaya değip değmeyeceğine karar vermek size kalmıştır. `map()` gövdesi çok fazla iç içe geçmişse, [bir bileşen çıkarmak](/docs/components-and-props.html#extracting-components) için iyi bir zaman olabileceğini unutmayın.
