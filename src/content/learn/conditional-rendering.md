---
title: Koşullu Olarak Render Etmek
---

<Intro>

React bileşenlerinizde çoğu zaman farklı koşullar altında farklı şeyler render etmek isteyeceksiniz. React'de, `if` ifadesi, `&&`, ve `? :` gibi Javascript syntax'ine ait operatörleri kullanarak koşullu olarak JSX render edebilirsiniz.

</Intro>

<YouWillLearn>

* Bir koşula bağlı olarak farklı JSX nasıl döndürülür
* Koşullu olarak bir JSX parçası nasıl dahil edilir veya hariç tutulur
* React kod tabanında karşınıza çıkacak yaygın kullanılan kısayol koşul syntax'leri

</YouWillLearn>

## Koşullu olarak JSX döndürmek {/*conditionally-returning-jsx*/}

Diyelim ki elinizde birden çok `Item` render eden bir `PackingList` bileşeni var, ve `Item`'lar bavula konulup konulmadıklarına göre işaret almışlar:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Bazı `Item` bileşenlerinin `isPacked` prop'unun `false` yerine `true` olduğuna dikkat edin. Eğer bileşen prop'u `isPacked={true}` ise eşyaların yanında bir tik (✔) işareti olmalı. 

Bunu bir [`if`/`else` ifadesi](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) olarak şöyle yazabilirsiniz:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Eğer `isPacked` prop'u `true` ise, bu kod **farklı bir JSX ağacı döndürür.** Bu değişiklikle birlikte, bazı eşya isimleri yanına tik işareti gelir:

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Her iki durumda da döndürülenleri düzenlemeyi deneyin ve sonucun nasıl değiştiğini görün!

JavaScript'in `if` ve `return` ifadeleriyle nasıl dallanma mantığı yarattığınıza dikkat edin. React'te kontrol akışı (koşullar gibi) JavaScript tarafından gerçekleştirilir.

### `null` ile koşullu olarak hiçbir şey döndürmemek {/*conditionally-returning-nothing-with-null*/}

Bazı durumlarda hiçbir şey render etmemek isteyeceksiniz. Örneğin, bavula konmuş eşyaların listenizde görünmesini istemiyorsunuz. Bir bileşen bir şey döndürmek zorundadır. Bu durumda `null` döndürebilirsiniz:

```js
if (isPacked) {
  return null;
}
return <li className="item">{name}</li>;
```

 Eğer `isPacked` true (doğru) ise, bileşen hiçbir şey yani `null` döndürecek. Aksi takdirde, render etmek için JSX'i döndürecek.

<Sandpack>

```js
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Uygulamada, bir bileşenin `null` döndürmesi yaygın olarak kullanılan bir şey değildir çünkü bileşeni render etmek isteyen başka bir geliştiricinin şaşırtabilir. Daha sık olarak, bir bileşeni üst bileşeninin JSX'ine koşullu olarak dahil eder veya hariç tutarsınız. Şimdi bunu nasıl yapacağımızı öğrenelim!

## JSX'i koşullu olarak dahil etmek {/*conditionally-including-jsx*/}

Önceki örnekte bileşen tarafından (eğer varsa!) hangi JSX ağacının döndüreleceğini belirlediniz. Render edilen çıktıda bazı tekrarlamalar olduğunu farketmişsinizdir:

```js
<li className="item">{name} ✔</li>
```

bu iki ifade birbirine çok benzemekte

```js
<li className="item">{name}</li>
```

Her iki koşulda `<li className="item">...</li>` ifadesini döndürmekte:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Bu tekrarlamalar zararlı olmasa bile yazdığınız kodu idame ettirmek zorlaşacaktır. Ya `className`'i değiştirmek isterseniz? Bu işlemi kodunuzda iki yerde yapmak zorundasınız! Bu gibi durumlarda, kodunuz daha [DRY.](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) (Tekrar Etme Kendini) hale getirmek için koşullu olarak küçük bir JSX ekleyebilirsiniz.

### Koşullu (ternary) operatörü (`? :`) {/*conditional-ternary-operator--*/}

JavaScript, koşullu bir ifade yazmak için kompakt bir syntax'e sahiptir -- [koşullu operatör](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) ya da  "ternary operatörü".

Bunun yerine:

```js
if (isPacked) {
  return <li className="item">{name} ✔</li>;
}
return <li className="item">{name}</li>;
```

Şöyle yazabilirsiniz:

```js
return (
  <li className="item">
    {isPacked ? name + ' ✔' : name}
  </li>
);
```

 Bu kodu şöyle okuyabilirsiniz: *"eğer `isPacked` true (doğru) ise, o zaman (`?`) `name + ' ✔'` render et, aksi halde (`:`) `name` render et"*.

<DeepDive>

#### Bu iki örnek tamamen eşdeğer mi? {/*are-these-two-examples-fully-equivalent*/}

Obje tabanlı bir programlama geçmişiniz varsa, yukarıdaki iki örneğin biraz farklı olduğunu çünkü birinin iki farklı `<li>` kopyası oluşturabileceğini düşünebilirsiniz. Ancak JSX öğeleri herhangi bir dahili state'e sahip olmadıkları ve gerçek DOM node'u olmadıkları için bir "kopya" değildir. JSX öğeleri aynı kılavuzlar gibi tanımlardır. Yani bu iki örnek birbiriyle **tamamen** aynıdır. [State'i korumak ve sıfırlamak](/learn/preserving-and-resetting-state) bunun nasıl çalıştığını ayrıntılı bir şekilde anlatmaktadır.

</DeepDive>

Şimdi, bavula konmuş eşyanının isminin üstünü listenizde çizmek için `<del>` HTML elementini kullanmak istiyorsunuz. Her durumda da daha fazla JSX'i iç içe yerleştirmeyi kolaylaştırmak için daha fazla yeni satır ve parantez ekleyebilirsiniz:

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? (
        <del>
          {name + ' ✔'}
        </del>
      ) : (
        name
      )}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Kodunuzu bu şekilde yazmak basit koşullu ifadeler için güzel çalışmakta ancak dikkatli kullanmakta fayda var.  Eğer bileşenleriniz iç içe geçmiş çok fazla koşullu ifadeden oluşuyorsa, ifadeyi temizlemek için yeni bir alt bileşen oluşturabilirsiniz. React'te, biçimlendirme kodunuzun bir parçasıdır dolayısıyla karmaşık ifadeleri düzenlemek için değişkenler ve fonksiyonlar gibi araçları kullanabilirsiniz.

### Mantıksal AND (VE) operatörü (`&&`) {/*logical-and-operator-*/}

Karşınıza sıkça çıkacak bir diğer kısayol ise [JavaScript mantıksal AND (VE) (`&&`) operatörüdür.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#:~:text=The%20logical%20AND%20(%20%26%26%20)%20operator,it%20returns%20a%20Boolean%20value.) Bu operatör React bileşeni içinde genellikle koşul doğru olduğunda bir kısım JSX'i render etmek **aksi halde hiçbir şey render etmemek** istediğinizde karşınıza çıkar. `&&` ifadesi ile, yalnızca `isPacked` prop'u `true (doğru)` ise tik işaretini eşyanın isminin yanına koyabilirsiniz.

```js
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```

Bu kodu şu şekilde okuyabilirsiniz: *"eğer `isPacked` prop'u true (doğru) ise, o zaman (`&&`) tik işaretini render et, yoksa render etme"*.

Aşağıda nasıl çalıştığını görebilirsiniz:

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
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

[JavaScript && operatörü](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND) eğer ifademizin sol tarafı (koşulumuz) `true` (`doğru`) ise ifadenin sağ tarafındaki değeri döndürür. Ama koşulumuz `false` (`yanlış`) ise, bütün ifademiz `false` (`yanlış`) olur. React, `false`'u JSX ağacında tıpkı `null` ya da `undefined` gibi bir "delik" olarak kabul eder ve geriye hiçbir şey döndürmez.

<Pitfall>

**`&&` operatörünün sol tarafına numara koymayın.**

JavaScript koşulu test etmek için operatörün sol tarafını otomatik olarak boole (true-false) dönüştürür. Bununla birlikte, eğer sol taraf `0` rakamı ise, ifadenin tamamı `0` değerini alır ve React, hiçbir şey döndürmemek yerine mutlu bir şekilde `0` render edecektir.

Örneğin, `messageCount && <p>New messages</p>` gibi bir kod yazmak yaygın bir hatadır. `messageCount` `0` olduğunda hiçbir şey render etmediğini varsaymak kolaydır ancak React gerçekte `0` render etmektedir.

Bu durumu düzeltmek için sol tarafı boole çevirmek gereklidir: `messageCount > 0 && <p>New messages</p>`.

</Pitfall>

### Bir değişkene koşullu olarak JSX atamak {/*conditionally-assigning-jsx-to-a-variable*/}

Kısayollar düz kod yazmanın önüne geçtiği zaman, bir `if` ifadesi ve bir değişken kullanmayı deneyebilirsiniz. [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) ile tanımlanmış değişkenlere başka değerler atayabilirsiniz, bu nedenle ilk olarak görüntülemek istediğimiz varsayılan değer olan name'i atayalım:

```js
let itemContent = name;
```

Eğer `isPacked` `true` (`doğru`) ise, bir JSX ifadesini `itemContent`'e tekrardan atamak için bir `if` ifadesi kullanın:

```js
if (isPacked) {
  itemContent = name + " ✔";
}
```

[Süslü parantezler "JavaScript'e bir pencere" açar.](/learn/javascript-in-jsx-with-curly-braces#using-curly-braces-a-window-into-the-javascript-world) Önceden hesaplanmış olan değişkeni süslü parantez içinde şu şekilde JSX içinde kullanabilirsiniz:

```js
<li className="item">
  {itemContent}
</li>
```

Bu syntax en ayrıntılı ama aynı zaman en esnek olanıdır. Aşağıda nasıl çalıştığını görebilirsiniz:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = name + " ✔";
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Daha önce olduğu gibi bu yalnızca metin için değil, koşullu JSX için de çalışır:

<Sandpack>

```js
function Item({ name, isPacked }) {
  let itemContent = name;
  if (isPacked) {
    itemContent = (
      <del>
        {name + " ✔"}
      </del>
    );
  }
  return (
    <li className="item">
      {itemContent}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Eğer JavaScript diline aşina değilseniz, bu çeşitli syntax'ler ilk başta kafa karıştırıcı olabilir. Ancak bunları öğrenmek, sadece React bileşenleri değil, herhangi bir JavaScript kodunu okumanıza ve yazmanıza yardımcı olacaktır! Başlangıçta tercih ettiğiniz syntax ile devam edin ve diğer syntax'lerin nasıl çalıştığını unuttuğunuzda bu sayfadan örneklere bakabilirsiniz.

<Recap>

* React'te, branching (dallanma) mantığını JavaScript ile kontrol edersiniz.
* `if` ifadesini kullanarak koşullu olarak bir JSX ifadesi döndürebilirsiniz.
* Bir JSX ifadesini koşullu olarak bir değişkene atayabilir ve süslü parantez kullanarak ("{}") başka bir JSX'in içine dahil edebilirsiniz.
* JSX'te, `{cond ? <A /> : <B />}` ifadesi şu anlama gelmektedir: *"eğer `cond` ise, `<A />`'yı render et, aksi halde `<B />`'yi render et"*.
* JSX'te, `{cond && <A />}` ifadesi şu anlama gelmektedir: *"eğer `cond` ise, `<A />`'yı render et, aksi halde hiçbir şey render etme"*.
* Kod tabanlarında bu kısayolları görmek yaygındır, ancak düz `if` ifadesini tercih ederseniz kısayolları kullanmak zorunda değilsiniz.

</Recap>



<Challenges>

#### Show an icon for incomplete items with `? :` {/*show-an-icon-for-incomplete-items-with--*/}

Use the conditional operator (`cond ? a : b`) to render a ❌ if `isPacked` isn’t `true`.

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
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

<Sandpack>

```js
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked ? '✔' : '❌'}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          isPacked={true} 
          name="Space suit" 
        />
        <Item 
          isPacked={true} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          isPacked={false} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

</Solution>

#### Show the item importance with `&&` {/*show-the-item-importance-with-*/}

In this example, each `Item` receives a numerical `importance` prop. Use the `&&` operator to render "_(Importance: X)_" in italics, but only for items that have non-zero importance. Your item list should end up looking like this:

* Space suit _(Importance: 9)_
* Helmet with a golden leaf
* Photo of Tam _(Importance: 6)_

Don't forget to add a space between the two labels!

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

<Solution>

This should do the trick:

<Sandpack>

```js
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}

export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

</Sandpack>

Note that you must write `importance > 0 && ...` rather than `importance && ...` so that if the `importance` is `0`, `0` isn't rendered as the result!

In this solution, two separate conditions are used to insert a space between then name and the importance label. Alternatively, you could use a fragment with a leading space: `importance > 0 && <> <i>...</i></>` or add a space immediately inside the `<i>`:  `importance > 0 && <i> ...</i>`.

</Solution>

#### Refactor a series of `? :` to `if` and variables {/*refactor-a-series-of---to-if-and-variables*/}

This `Drink` component uses a series of `? :` conditions to show different information depending on whether the `name` prop is `"tea"` or `"coffee"`. The problem is that the information about each drink is spread across multiple conditions. Refactor this code to use a single `if` statement instead of three `? :` conditions.

<Sandpack>

```js
function Drink({ name }) {
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{name === 'tea' ? 'leaf' : 'bean'}</dd>
        <dt>Caffeine content</dt>
        <dd>{name === 'tea' ? '15–70 mg/cup' : '80–185 mg/cup'}</dd>
        <dt>Age</dt>
        <dd>{name === 'tea' ? '4,000+ years' : '1,000+ years'}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Once you've refactored the code to use `if`, do you have further ideas on how to simplify it?

<Solution>

There are multiple ways you could go about this, but here is one starting point:

<Sandpack>

```js
function Drink({ name }) {
  let part, caffeine, age;
  if (name === 'tea') {
    part = 'leaf';
    caffeine = '15–70 mg/cup';
    age = '4,000+ years';
  } else if (name === 'coffee') {
    part = 'bean';
    caffeine = '80–185 mg/cup';
    age = '1,000+ years';
  }
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{part}</dd>
        <dt>Caffeine content</dt>
        <dd>{caffeine}</dd>
        <dt>Age</dt>
        <dd>{age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

Here the information about each drink is grouped together instead of being spread across multiple conditions. This makes it easier to add more drinks in the future.

Another solution would be to remove the condition altogether by moving the information into objects:

<Sandpack>

```js
const drinks = {
  tea: {
    part: 'leaf',
    caffeine: '15–70 mg/cup',
    age: '4,000+ years'
  },
  coffee: {
    part: 'bean',
    caffeine: '80–185 mg/cup',
    age: '1,000+ years'
  }
};

function Drink({ name }) {
  const info = drinks[name];
  return (
    <section>
      <h1>{name}</h1>
      <dl>
        <dt>Part of plant</dt>
        <dd>{info.part}</dd>
        <dt>Caffeine content</dt>
        <dd>{info.caffeine}</dd>
        <dt>Age</dt>
        <dd>{info.age}</dd>
      </dl>
    </section>
  );
}

export default function DrinkList() {
  return (
    <div>
      <Drink name="tea" />
      <Drink name="coffee" />
    </div>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
