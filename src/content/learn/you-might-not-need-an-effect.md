---
title: 'Bir Efekte İhtiyacınız Olmayabilir'
---

<Intro>

Efektler, React paradigmasından bir kaçış yoludur. Bu kaçış yolları size React'ten "dışarı çıkmanıza" ve React ile alakalı olmayan React araçlarıyla, ağ veya tarayıcı DOM'u gibi bazı harici sistemlerle bileşenlerinizi senkronize etmenize izin verir. Eğer harici bir sistem yoksa (örneğin, bir bileşenin state'ini bazı props veya state değişikliklerinde güncellemek istiyorsanız), bir Efekte ihtiyacınız olmamalıdır. Gereksiz Efektleri ortadan kaldırmak kodunuzun takip edilmesini kolaylaştıracak, çalışmasını hızlandıracak ve hataya daha az açık hale getirecektir.

</Intro>

<YouWillLearn>

* Gereksiz Efektleri bileşenlerinizden neden ve nasıl ortadan kaldırabileceğinizi
* Masraflı hesaplamaları Efektler olmadan nasıl önbelleğe alabileceğinizi
* Efektler olmadan bileşen state'ini nasıl ayarlayıp ve sıfırlayabileceğinizi
* Olay yöneticileri arasında mantığı nasıl paylaşabileceğinizi
* Ne tür mantık kodlarının olay yöneticilerine taşınabileceğini
* Üst elemanlara değişiklikler hakkında nasıl bildirimde bulunulacağını

</YouWillLearn>

## Gereksiz Efektler nasıl ortadan kaldırılır {/*how-to-remove-unnecessary-effects*/}

Efektlere ihtiyaç duymadığınız iki yaygın durum vardır:

* **Verileri işlemek üzere dönüştürmek için Efektlere ihtiyacınız yoktur.** Örneğin, bir listeyi göstermeden önce o listeyi filtrelemek istediğinizi varsayalım. Liste değiştiğinde bir state değişkenini güncelleyen bir Efekt yazmak cazip hissettirebilir. Ancak, bu yöntem verimsizdir. State'i güncellediğinizde, React ilk olarak ekranda ne gözükeceğini hesaplamak için öncelikle bileşen fonksiyonlarınızı çağırır. Daha sonra React ekranı güncelleyerek bu değişiklikleri DOM'a ["işleyecektir"](/learn/render-and-commit). Ardından React Efektlerinizi çalıştıracaktır. Efektiniz *ayrıca* state'i anında güncelliyorsa, bu tüm süreci yeniden sıfırdan başlatır! Gereksiz render geçişlerini önlemek için bileşenlerinizin en üst düzeyindeki tüm verileri dönüştürün. Bu kod propslarınız veya stateleriniz değiştiğinde otomatik olarak yeniden çalışacaktır.
* **Kulanıcı olaylarını yönetmek için Efektlere ihtiyacınız yoktur.** Örneğin, `/api/buy` POST isteği göndermek ve kullanıcı bir ürün satın aldığında bir bildirim göstermek istediğinizi varsayalım. Satın Al buton olay yöneticisi içerisinde, kesinlikle ne olacağını bilirsiniz. Efekt çalıştığında, kullanınıcının *ne* yaptığını bilemezsiniz (örneğin, hangi butona tıklandığını). Bu sebeple, genellikle kullanıcı olaylarını karşılık gelen olay yöneticileri içerisinde ele alacaksınız.

External sistemlerle [senkronize olmak](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events) için Effects’e gerçekten *ihtiyaç duyarsınız*. Örneğin, bir jQuery widget’ını React state ile senkronize tutan bir Effect yazabilirsiniz. Ayrıca Effects ile data fetch de edebilirsiniz; örneğin arama sonuçlarını mevcut search query ile senkronize edebilirsiniz. Ancak unutmayın: modern [framework’ler](/learn/creating-a-react-app#full-stack-frameworks), component’larınız içinde doğrudan Effect yazarak yapacağınız data fetching’e kıyasla çok daha verimli built-in data fetching mekanizmaları sunar.

Doğru sezgiyi kazanmanıza yardımcı olmak için, hadi bazı yaygın somut örneklere göz atalım!

### State veya propslara göre state'i güncelleme {/*updating-state-based-on-props-or-state*/}

İki state değişkenine sahip bir bileşeniniz olduğunu varsayalım: `firstName` ve `lastName`. `firstName` ve `lastName`'i birleştirerek onlardan bir `fullName` elde etmek istiyorsunuz. Ayrıca, `firstName` veya `lastName` her değiştiğinde `fullName`'i güncellemek istiyorsunuz. İlk olarak aklınıza `fullName` state değişkeni oluşturmak ve onu bir Efekt içerisinde güncellemek olabilir:

```js {expectedErrors: {'react-compiler': [8]}} {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Gereksiz state ve Efektlerden uzak durun.
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Bu gerektiğinden daha karmaşıktır. Aynı zamanda verimsizdir: `fullName`  için geçersiz bir değerle tam bir yeniden render işlemi gerçekleştirir ve hemen ardından güncellenmiş değerle tekrar yeniden render eder. State değişkenini ve Efektini kaldırın:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Render işlemi sırasında hesaplanması iyidir.
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

**Mevcut props veya state'ten birşey hesaplanabilirken [hesaplanabilen değeri state içerisine koymayın.](/learn/choosing-the-state-structure#avoid-redundant-state) Bunun yerine, render işlemi sırasında hesaplayın.** Bu şekilde kodunuz hızlı (Ekstra "kademeli" güncellemelerden kaçınırsınız), daha basit (bazı kodları ortadan kaldırırsınız), ve daha az hata eğilimlidir (birbiriyle senkronize olmayan farklı state değişkenlerinin neden olduğu hatalardan kaçınırsınız). Bu yaklaşım size yeni geliyorsa, [React'ta düşünmek](/learn/thinking-in-react#step-3-find-the-minimal-but-complete-representation-of-ui-state) state içerisine nelerin girmesi gerektiğini açıklar.

### Maliyetli hesaplamaları önbelleğe almak {/*caching-expensive-calculations*/}

Bu bileşen gelen `todos` propunu `filter` propsuna göre filtreleme işlemi yaparak `visibleTodos` değerini hesaplar. Sonuçları state içerisinde depolamak ve bir Efektten güncellemek isteyebilirsiniz:


```js {expectedErrors: {'react-compiler': [7]}} {4-8}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');

  // 🔴 Gereksiz state ve Efektlerden uzak durun.
  const [visibleTodos, setVisibleTodos] = useState([]);
  useEffect(() => {
    setVisibleTodos(getFilteredTodos(todos, filter));
  }, [todos, filter]);

  // ...
}
```

Önceki örnekte olduğu gibi, bu gereksiz ve verimsizdir. İlk olarak, state ve Efekti kaldırın:

```js {3-4}
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ getFilteredTodos() yavaş değilse bu problem değildir.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
```

Genellikle, bu kod iyidir! Ama belki `getFilteredTodos()` fonksiyonu yavaştır veya bir sürü `todos`'a sahipsindir. Bu durumda, `newTodo` gibi alakasız bir state değişkeni değiştiyse, `getFilteredTodos()`'un yeniden hesaplama yapmasını istemezsin

Maliyetli bir hesaplamayı [`useMemo`](/reference/react/useMemo) Hook'una sarmalayarak önbelleğe alabilirsiniz (veya ["memoize edebilirsiniz"](https://en.wikipedia.org/wiki/Memoization)):


<Note>

[React Compiler](/learn/react-compiler) can automatically memoize expensive calculations for you, eliminating the need for manual `useMemo` in many cases.

</Note>

```js {5-8}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ todos veya filter değişmeden yeniden çalışmaz.
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

Veya, tek bir satır olarak yazılır:

```js {5-6}
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅  todos veya filtre değiştirilmedikçe getFilteredTodos()'u yeniden çalışmaz.
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
```

**Bu React'a `todos` veya `filter` değişmedikçe iç fonksiyonun yeniden çalışmasını istemediğinizi söyler.**
** React `getFilteredTodos()`'un başlangıç render işlemindeki dönüş değerini hatırlayacaktır. React sonraki render işlemlerinde ise, `todos` veya `filter`'ın değişip değişmediğini kontrol edecektir. Eğer bunlar son seferdekiyle aynı ise, `useMemo` depoladığı son sonucu döndürecektir. Ancak eğer bunlar farklı ise, React iç fonksiyonu tekrar çağıracaktır (ve sonucunu depolayacaktır).

[`useMemo`](/reference/react/useMemo) içerisine sarmaladığınız fonksiyon render işlemi sırasında çalışır, dolayısıyla bu sadece [saf hesaplamalar](/learn/keeping-components-pure) için çalışır.

<DeepDive>

#### Bir hesaplamanın maliyetli olup olmadığı nasıl anlaşılır? {/*how-to-tell-if-a-calculation-is-expensive*/}

Genel olarak, binlerce nesne oluşturmadıkça veya üzerinde döngü yapmadıkça, bu muhtemelen maliyetli değildir. Daha fazla güven sağlamak isterseniz, bir kod parçasında geçen süreyi ölçmek için bir konsol ekleyebilirsiniz.

```js {1,3}
console.time('filter array');
const visibleTodos = getFilteredTodos(todos, filter);
console.timeEnd('filter array');
```

Ölçüm yaptığınız etkileşimi gerçekleştirin (örneğin, giriş kutusuna yazma işlemi yapın). Daha sonra konsolunuzda `filter array: 0.15ms` gibi loglar göreceksiniz. Toplamda kaydedilen süre miktarı (örneğin, `1ms` veya daha fazlası) geçiyorsa, o hesaplamanın önbelleğe alınması mantıklı olabilir. Denemek için, hesaplamayı `useMemo` ile sarmalayabilir ve bu etkileşim için loglanan toplam sürenin azaldığını doğrulayabilirsiniz:

```js
console.time('filter array');
const visibleTodos = useMemo(() => {
  return getFilteredTodos(todos, filter); // todos ve filter değişmediyse atlanır.
}, [todos, filter]);
console.timeEnd('filter array');
```

`useMemo` *ilk* render işlemini daha hızlı yapmaz. Sadece güncellemelerle ilgili gereksiz çalışmaları atlamanıza yardımcı olur.

Makinenizin kullanıcılarınızdan daha hızlı olduğunu aklınızda bulundurun bu nedenle performansınızı yapay bir yavaşlık ile test etmek daha iyi bir fikirdir. Örneğin, Chrome bunun için [CPU Throttling](https://developer.chrome.com/blog/new-in-devtools-61/#throttling) seçeneği sunuyor.

Ayrıca geliştirme ortamı içerisinde performans ölçümü yapılması size en doğru sonuçları vermeyeceğini unutmayın. (Örneğin, [Strict mod](/reference/react/StrictMode) açıkken, her bileşenin bir yerine iki kez render olduğunu göreceksiniz.) En doğru ölçümleri elde etmek için, uygulamanızı üretim için derleyin ve kullanıcılarınızın sahip olduğu gibi bir cihazda test edin.

</DeepDive>

### Bir prop değiştiğinde tüm state'i sıfırlama {/*resetting-all-state-when-a-prop-changes*/}

Bu `ProfilePage` bileşeni bir `userId` propu alır. Sayfa bir yorum inputu içeriyor ve bu değeri tutması için bir `comment` state değişkeni kullanıyorsunuz. Bir gün, bir problem olduğunu farkedeceksiniz: bir profilden diğerine geçiş yaptığınızda, `comment` state'inin sıfırlanmamasıdır. Sonuç olarak, yanlış bir kullanıcının profiline istemediğiniz bir yorum yapmak oldukça kolay olabilir. Bu sorunu çözmek için, `userId` her değiştiğinde `comment` state değişkeninin temizlenmesini istersiniz:

```js {expectedErrors: {'react-compiler': [6]}} {4-7}
export default function ProfilePage({ userId }) {
  const [comment, setComment] = useState('');

  // 🔴 Bir Efekt içerisinde prop değiştiğinde state'i sıfırlamaktan kaçının.
  useEffect(() => {
    setComment('');
  }, [userId]);
  // ...
}
```

Bu verimlilik açısından etkisizdir çünkü `ProfilePage` ve içerisindeki alt elemanlar ilk olarak eski değerle birlike render edilecek, ve daha sonra tekrar render edilecektir. Ayrıca bu karmaşıktır çünkü `ProfilePage` içerisindeki her bileşende bu işlemi yapmanız gerekecektir. Örneğin yorum arayüzü iç içe ise, iç içe yorum state'ini de temizlemek istersiniz.

Bunun yerine, her kullanıcının profiline belirli bir key vererek React'a her kullanıcı profilinin kavramsal olarak _farklı_ bir profil olduğunu bildirebilirsiniz. Bileşeninizi ikiye bölün ve dış bileşenden iç bileşene `key` özniteliği iletin:

```js {5,11-12}
export default function ProfilePage({ userId }) {
  return (
    <Profile
      userId={userId}
      key={userId}
    />
  );
}

function Profile({ userId }) {
  // ✅ Bu ve aşağıdaki herhangi bir state key değişikliğinde otomatik olarak sıfırlanır.
  const [comment, setComment] = useState('');
  // ...
}
```

Normalde, React aynı bileşen aynı noktada render edildiğinde state'i korur. **`Profile` bileşenine bir `key` olarak `userId` ileterek, React'ten farklı `userId`'li iki `Profile` bileşenine herhangi bir state'i paylaşmaması gereken iki farklı bileşen olarak muamele etmesini istiyorsunuz.** Key her değiştiğinde (`userId` olarak ayarladığınız), React DOM'u tekrar oluşturacak ve  `Profile` bileşeninin ve tüm alt öğelerinin [state'lerini sıfırlar](/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key). Artık profiller arasında gezinirken `comment` alanı otomatik olarak temizlenecektir.

Bu örnekte, sadece dış `ProfilePage` bileşeninin dışa aktarıldığını ve projedeki diğer dosyalarda gözüktüğünü unutmayın. `ProfilePage`'i oluşturan bileşenlerin `ProfilePage`e key iletmesi gerekmez: Bunun yerine `userId`'yi normal bir prop olarak iletirler. `ProfilePage` bileşeninin içindeki `Profile` bileşenine key olarak iletilmesi, bir uygulama ayrıntısıdır.

### Bir prop değişikliğinde bazı state'lerin ayarlanması {/*adjusting-some-state-when-a-prop-changes*/}

Bazen, bir prop değişikliğinde state'in bazı noktalarını sıfırlamak veya ayarlamak isteyebilirsiniz.

Buradaki `List` bileşeni props olarak `items` listesini alır, ve seçilen öğeyi `selection` state değişkeni içerisinde tutar. `items` propsu farklı bir array aldığında `selection` state değişkenini sıfırlamak isteyebilirsiniz:

```js {expectedErrors: {'react-compiler': [7]}} {5-8}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // 🔴 Bir Efekt içerisinde prop değişikliğinde state ayarlamaktan kaçının.
  useEffect(() => {
    setSelection(null);
  }, [items]);
  // ...
}
```

Bu ideal bir çözüm değildir. `items` her değiştiğinde, `List` ve onun alt elemanı ilk başta eski `selection` değeri ile render olacaktır. Daha sonra React DOM'u güncelleyecek ve Efektleri çalıştıracaktır. Son olarak, `setSelection(null)` çağrısı `List` ve onun alt elemanlarının yeniden render işlemine sebebiyet verecektir, ve bu süreci yeniden başlatacaktır.

Öncelikle, Efekti silin. Bunun yerine state'i doğrudan render işlemi sırasında ayarlayın:

```js {5-11}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selection, setSelection] = useState(null);

  // Render işlemi sırasında state ayarlamak daha iyi bir yöntemdir.
  const [prevItems, setPrevItems] = useState(items);
  if (items !== prevItems) {
    setPrevItems(items);
    setSelection(null);
  }
  // ...
}
```

Bu şekilde, [önceki render işlemindeki bilgiyi depolamak](/reference/react/useState#storing-information-from-previous-renders) anlamayı zorlaştırabilir, ama bu aynı state'i bir Efekt içerisinde güncellemekten daha iyidir. Yukarıdaki örnekte, `setSelection` direkt olarak render işlemi sırasında çağrılır. React `List` bileşenini `return` ifadesi ile *hemen* çıkış yaptıktan sonra yeniden render edecektir. React `List` bileşeninin alt elemanlarını henüz render etmemiştir veya DOM henüz güncellenmemiştir, bu sebeple, `List` bileşeninin alt elemanları eski `selection` değeri ile render edilir.

Bir bileşeni render işlemi sırasında güncellediğinizde, React, döndürülen JSX'i yoksayar ve hemen yeniden render işlemini tekrarlar. Çok yavaş kademeli yeniden denemeleri önlemek için, React render işlemi sırasında size sadece *aynı* bileşenin state'ini güncellemenize izin verir. Eğer, render işlemi sırasında başka bir bileşenin state'ini güncellerseniz, bir hata ile karşılaşırsınız. Döngülerden kaçınmak için `items !== prevItems` gibi bir koşul ifadesi gereklidir. State'i bı şekilde ayarlayabilirsiniz, ama diğer yan efektler (DOM'u değiştirmek veya zaman aşımlarını ayarlamak gibi) [bileşeni saf tutmak](/learn/keeping-components-pure) için olay yöneticilerinin veya Efektlerin içerisinde kalmalıdır.

**Bu kalıp bir Efektten daha verimli olmasına rağmen, çoğu bileşenin buna da ihtiyacı olmamalıdır.** Ne şekilde yaparsanız yapın, state'i props'lara veya diğer state'lere göre ayarlamak, veri akışınızı anlamanızı ve hata ayıklama yapmanızı daha zor hale getirecektir. Her zaman [tüm state'i bir key ile sıfırlamayı](#resetting-all-state-when-a-prop-changes) veya [herşeyi render işlemi sırasında hesaplamayı](#updating-state-based-on-props-or-state) yapıp yapamayacağınızı kontrol edin. Örneğin, seçilen *itemi* depolamak (ve sıfırlamak) yerine, seçili *item kimliğini(item ID)* saklayabilirsiniz:

```js {3-5}
function List({ items }) {
  const [isReverse, setIsReverse] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  // ✅ Herşeyi render işlemi sırasında hesaplamak en iyi yöntemdir.
  const selection = items.find(item => item.id === selectedId) ?? null;
  // ...
}
```

Şuan burada state'i "ayarlamanıza" ihtiyacınız yoktur. Seçilmiş ID'li item liste içerisindeyse, seçili olarak kalır. Eğer değilse, `selection` render işlemi esnasında eşleşen item bulunmadığından dolayı `null` olarak hesaplanacaktır. Bu davranış farklıdır, ama `items` seçilen değişiklikleri koruduğu için kısmen daha iyidir.

### Olay yöneticileri arasında mantık kodları paylaşmak {/*sharing-logic-between-event-handlers*/}

İstediğiniz ürünü satın alamınıza izin veren iki butonlu (Satın Al ve Öde) bir ürün sayfanızın olduğunu varsayalım. Kullanıcı ürünü sepete eklediğinde bir bildirim göstermek istiyorsunuz. Her iki butonun `showNotification()` fonksiyonunu çağırması tekrar eden bir işlem gibi gelebilir, bu yüzden bu mantığı bir Efekte yerleştirmek isteyebilirsiniz:

```js {2-7}
function ProductPage({ product, addToCart }) {
  // 🔴 Bir Efekt içerisinde olaya-özgü bir mantık kodu bulundurmaktan kaçının.
  useEffect(() => {
    if (product.isInCart) {
      showNotification(`Added ${product.name} to the shopping cart!`);
    }
  }, [product]);

  function handleBuyClick() {
    addToCart(product);
  }

  function handleCheckoutClick() {
    addToCart(product);
    navigateTo('/checkout');
  }
  // ...
}
```

Bu Efekt gereksizdir. Muhtemelen bir soruna sebebiyet verecektir. Örneğin, uygulamanızın sayfa yeniden yüklemelerinde alışveris sepetinizi "hatırladığını" varsayalım. Sepetinize ürünü birkez ekleyip ardından sayfayı yeniden yüklerseniz, bildirim tekrar görünecektir. Bu ürünün sayfasını her yenilediğinizde gözükmeye devam edecektir. Bunun sebebi, `product.isInCart` değeri sayfa yüklenirken zaten `true` olmasıdır, bu sebeple Efekt tekrar `showNotification()` fonksiyonunu çağıracaktır.

**Bazı kod bloklarının bir Efekt veya olay yöneticisi içerisinde olup olmaması gerektiğinden emin değilseniz, bu kod bloğunun *neden* çalışması gerektiğini kendinize sorun. Sadece bileşenin kullanıcıya gösterildiği durumlarda çalışması gereken kodlar için Efektleri kullanın.** Bu örnekte, bildirim sayfa görüntülendiği için değil, kullanıcı *butona bastığı* için gözükmelidir! Efekti silin ve paylaşılan mantığı, her iki olay yöneticinden çağrılan bir fonksiyon içine yerleştirin:

```js {2-6,9,13}
function ProductPage({ product, addToCart }) {
  // ✅ Olaya özgü mantık kodunun, olay yöneticilerinden çağrılması daha iyi bir seçimdir.
  function buyProduct() {
    addToCart(product);
    showNotification(`Added ${product.name} to the shopping cart!`);
  }

  function handleBuyClick() {
    buyProduct();
  }

  function handleCheckoutClick() {
    buyProduct();
    navigateTo('/checkout');
  }
  // ...
}
```

Bu hem gereksiz Efektleri ortadan kaldırır hem de hataları düzeltir.

### Bir POST isteği göndermek {/*sending-a-post-request*/}

Bu `Form` bileşeni iki tür POST isteği gönderir. Bileşen yüklendiğinde bir analitik olay gönderir. Formu doldurup Gönder butonuna tıkladığınızda ise `/api/register` noktasına bir POST isteği gönderir.

```js {5-8,10-16}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Bileşen görüntülendiği için bu mantık çalışır.
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  // 🔴 Bir Efekt içerisinde olaya-özgü bir mantık kodu bulundurmaktan kaçının.
  const [jsonToSubmit, setJsonToSubmit] = useState(null);
  useEffect(() => {
    if (jsonToSubmit !== null) {
      post('/api/register', jsonToSubmit);
    }
  }, [jsonToSubmit]);

  function handleSubmit(e) {
    e.preventDefault();
    setJsonToSubmit({ firstName, lastName });
  }
  // ...
}
```

Bir önceki örnekte olduğu gibi aynı kriterleri uygulayalım.

Analitik POST isteği bir Efekt içerisinde kalmalıdır. Çünkü, analitik olayının gönderilme _nedeni_ formun görünür olmasıdır. (Bu geliştirme aşamasında iki kez tetiklenebilir, ancak bu durumla başa çıkmak için [buraya bakabilirsiniz](/learn/synchronizing-with-effects#sending-analytics).)

Ancak, `/api/register` POST isteği form _görünür_ olduğu için gönderilmez. Bu isteği yalnızca kullanıcı butona bastığı anda göndermek istersiniz. Bu işlem sadece _belirli etkileşimlerde_ meydana gelmelidir. İkinci Efekti silin ve POST isteğini olay yöneticisine taşıyın:

```js {12-13}
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  // ✅ Bileşen görüntülendiği için bu mantık çalışır.
  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_form' });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // ✅ Olaya özgü mantık kodunun, olay yöneticilerinden çağrılması daha iyi bir seçimdir.
    post('/api/register', { firstName, lastName });
  }
  // ...
}
```

Bir olay yöneticisi veya bir Efekt içine hangi mantığı yerleştireceğinizi seçerken, kullanıcının perspektifinden _hangi tür mantık_ olduğu sorusuna cevap bulmanız gerekmektedir. Eğer bu mantık belirli bir etkileşimden kaynaklanıyorsa, olay yöneticisnde tutun. Eğer kullanıcının bileşeni ekran üzerinde _görme_ eylemiyle ilişkili ise, o zaman Efekt içinde tutun.

### Hesaplama zincirleri {/*chains-of-computations*/}

Bazen her biri diğer bir state'e dayalı olarak state'in bir parçasını ayarlayan Efektleri zincirlemek isteyebilirsiniz.

```js {7-29}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  // 🔴 State'i yalnızca birbirini tetikleyecek şekilde ayarlayan Efekt Zincirlerinden kaçının.
  useEffect(() => {
    if (card !== null && card.gold) {
      setGoldCardCount(c => c + 1);
    }
  }, [card]);

  useEffect(() => {
    if (goldCardCount > 3) {
      setRound(r => r + 1)
      setGoldCardCount(0);
    }
  }, [goldCardCount]);

  useEffect(() => {
    if (round > 5) {
      setIsGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    alert('Good game!');
  }, [isGameOver]);

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    } else {
      setCard(nextCard);
    }
  }

  // ...
```

Birinci problem bu kodun çok verimsiz olmasıdır: bileşenin (ve onun alt elemanlarının) `set` çağrıları arasında her seferinde yeniden render edilmesidir. Yukarıdaki örnekte, en kötü durumda (`setCard` → render → `setGoldCardCount` → render → `setRound` → render → `setIsGameOver` → render) alt eleman ağacında üç gereksiz yeniden render işlemi gerçekleşir.

İkinci problem ise; hızlı olmasa bile, kodunuz geliştikçe yeni gereksinimlere uygun olmayan durumlarla karşılaşabilirsiniz. Örneğin, oyun hareketlerinin geçmişini adım adım izlemek için bir yol eklemek istediğinizi düşünün. Her bir state değişkenini geçmişteki bir değere güncelleyerek bunu yapardınız. Ancak, `card` state'ini geçmişteki bir değere ayarlamak, Efekt zincirini tekrar tetikler ve gösterilen verileri değiştirir. Bu tür bir kod genellikle sert ve kırılgan olabilir.

Bu durumda, yapabileceğiniz hesaplamaları render işlemi sırasında gerçekleştirmek ve durumu olay yöneticisinde ayarlamak daha iyidir.

```js {6-7,14-26}
function Game() {
  const [card, setCard] = useState(null);
  const [goldCardCount, setGoldCardCount] = useState(0);
  const [round, setRound] = useState(1);

  // ✅ Mümkün olduğunca render işlemi sırasında hesaplama yapın.
  const isGameOver = round > 5;

  function handlePlaceCard(nextCard) {
    if (isGameOver) {
      throw Error('Game already ended.');
    }

    // ✅ Sonraki state'i olay yöneticisi içerisinde hesaplayın.
    setCard(nextCard);
    if (nextCard.gold) {
      if (goldCardCount < 3) {
        setGoldCardCount(goldCardCount + 1);
      } else {
        setGoldCardCount(0);
        setRound(round + 1);
        if (round === 5) {
          alert('Good game!');
        }
      }
    }
  }

  // ...
```

Bu yöntem çok daha verimli olacaktır. Ayrıca, oyun geçmişini görüntülemek için bir yol uygularsanız, artık her bir state değişkenini diğer tüm değerleri ayarlayan Efekt zincirini tetiklemeden geçmişten bir hamleye ayarlayabileceksiniz. Birden fazla olay yöneticisi arasında mantığı yeniden kullanmanız gerekiyorsa, [bir fonksiyon çıkarabilir](#sharing-logic-between-event-handlers) ve bu fonksiyonu o olay yöneticilerinden çağırabilirsiniz.

Olay yöneticilerinin içinde, [durum bir anlık görüntü gibi davranır](/learn/state-as-a-snapshot). Örneğin, `setRound(round + 1)` çağrıldıktan sonra bile, `round` değişkeni kullanıcının butona bastığı anda sahip olduğu değeri yansıtır. Hesaplamalar için bir sonraki değeri kullanmanız gerekiyorsa, `const nextRound = round + 1` gibi manuel olarak tanımlama yapmalısınız.

Bazı durumlarda, bir sonraki state'i bir olay yöneticisi içerisinden direkt olarak *hesaplayamazsınız*. Örneğin, birbirine bağlı çoklu açılır menülerin bulunduğu bir form düşünelim. Bir sonraki açılır menünün seçilen değeri önceki açılır menünün seçilen değerine bağlıdır. Bu durumda, bir Efekt zinciri uygun olabilir çünkü ağ bağlantısı ile senkronizasyon yapmanız gerekmektedir.

### Uygulamayı başlatma {/*initializing-the-application*/}

Bazı mantık kodları, uygulama yüklendiğinde yalnızca bir kez çalışmalıdır.


Bu işlemi genellikle üst-seviye bileşendeki bir Efekt içine yerleştirmek isteyebilirsiniz.

```js {2-6}
function App() {
  // 🔴 Yalnızca bir kez çalışması gereken mantığa sahip olan Efektlerden kaçının.
  useEffect(() => {
    loadDataFromLocalStorage();
    checkAuthToken();
  }, []);
  // ...
}
```

Ancak, bu işlemin [canli ortamda iki kere çalıştırıldığını](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) keşfedeceksiniz. Bu durum sorunlara neden olabilir--örneğin, fonksiyonun iki kez çağrılması düşünülmeden tasarlandığı için kimlik doğrulama tokeni geçersiz hale gelebilir. Genel olarak, bileşenleriniz yeniden yerleştirilmeye karşı dayanıklı olmalıdır. Bu, üst-seviye `App` bileşeniniz için de geçerlidir.

Üretim ortamında pratikte yeniden monte edilmese bile, tüm bileşenlerde aynı kısıtlamalara uymak, kodun taşınmasını ve yeniden kullanılmasını kolaylaştırır. Eğer belirli bir mantığın *bileşen başına bir kez değil*, *uygulama yüklemesi başına bir kez çalışması* gerekiyorsa, bu durumu takip etmek için bir üst-seviye değişken ekleyebilirsiniz.

```js {1,5-6,10}
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      // ✅ Uygulama her yüklendiğinde yalnızca bir kez çalışır.
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
  // ...
}
```

Modül başlatma sırasında ve uygulama render edilmeden önce de çalıştırabilirsiniz:

```js {1,5}
if (typeof window !== 'undefined') { // Tarayıcıda çalışıp çalışmadığınızı kontrol edin.
   // ✅ Uygulama her yüklendiğinde yalnızca bir kez çalışır.
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Bileşeninizi içe aktardığınızda, bileşenin sonunda render edilmezse bile üst seviyedeki kod bir kez çalışır. Rastgele bileşenler içe aktarılırken yavaşlama veya beklenmeyen davranışlardan kaçınmak için bu yöntemi aşırı kullanmamaya özen gösterin. Uygulama genelindeki başlatma mantığınızı, `App.js` gibi kök bileşen modüllerinde veya uygulamanızın giriş noktasında tutun.

### Üst elemanları state değişiklikleri hakkında bilgilendirmek {/*notifying-parent-components-about-state-changes*/}

`isOn` state'i `true` veya `false` değerlerini alabilen bir `Toggle` bileşeni yazdığınızı düşünelim. Geçiş efektini sağlaması için birkaç farklı yol vardır (tıklayarak veya sürükleyerek). `Toggle` dahili durumu her değiştiğinde üst elemana bildirimde bulunmak istiyorsunuz, böylece bir `onChange` olayını bir Efektten çağırıyorsunuz:

```js {4-7}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  // 🔴 onChange işleyicisinin çok geç çalıştırılmasından kaçının.
  useEffect(() => {
    onChange(isOn);
  }, [isOn, onChange])

  function handleClick() {
    setIsOn(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      setIsOn(true);
    } else {
      setIsOn(false);
    }
  }

  // ...
}
```

Daha önce olduğu gibi, bu ideal değil. İlk olarak `Toggle` kendi state'ini günceller, ve React ekranı günceller. Ardından React, üst elemandan iletilen `onChange` fonksiyonunu  çağıran Effect'i çalıştırır. Şimdi üst eleman, başka bir render geçişi başlatarak kendi state'ini güncelleyecektir. Her şeyi tek geçişte yapmak daha iyi olur.

Efekti silin ve bunun yerine aynı olay yöneticisi içinde *her iki* bileşenin durumunu güncelleyin:

```js {5-7,11,16,18}
function Toggle({ onChange }) {
  const [isOn, setIsOn] = useState(false);

  function updateToggle(nextIsOn) {
    // ✅ Tüm güncellemeleri onları tetikleyen olay sırasında gerçekleştirin.
    setIsOn(nextIsOn);
    onChange(nextIsOn);
  }

  function handleClick() {
    updateToggle(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      updateToggle(true);
    } else {
      updateToggle(false);
    }
  }

  // ...
}
```

Bu yaklaşımla, hem `Toggle` bileşeni hem de onun üst elemanı, olay sırasında state değişkenlerini günceller. React farklı bileşenlerden [güncellemeleri toplu olarak](/learn/queueing-a-series-of-state-updates) gerçekleştirir, böylece yalnızca bir render geçişi olacaktır.

Ayrıca state'i tamamen kaldırabilir ve bunun yerine üst elemandan `isOn` değerini alabilirsiniz:

```js {1,2}
// ✅ Bileşenin, kendi üst elemanı tarafından kontrol edilmesi daha iyidir.
function Toggle({ isOn, onChange }) {
  function handleClick() {
    onChange(!isOn);
  }

  function handleDragEnd(e) {
    if (isCloserToRightEdge(e)) {
      onChange(true);
    } else {
      onChange(false);
    }
  }

  // ...
}
```

["State'i yukarı taşımak"](/learn/sharing-state-between-components) üst elemanın kendi state'ini değiştirerek, `Toggle`'ı tamamen kontrol etmesine olanak tanır. Bu, üst elemanın daha fazla mantık içermesi gerektiği anlamına gelir, ancak genel olarak endişelenmeniz gereken daha az durum olur. Farklı iki state değişkenini senkronize tutmaya çalıştığınızda, bunun yerine state'i yukarı taşımaya çalışın!

### Üst elemana veri aktarma {/*passing-data-to-the-parent*/}

Bu `Child` bileşeni bazı verileri çeker ve ardından `Parent` bileşenine bir Efekt içerisinde bu veriyi aktarır:

```js {9-14}
function Parent() {
  const [data, setData] = useState(null);
  // ...
  return <Child onFetched={setData} />;
}

function Child({ onFetched }) {
  const data = useSomeAPI();
  // 🔴 Verileri bir Efekt içinde üst elemana iletmekten kaçının.
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
  // ...
}
```

React içerisinde, veri akışı üst elemanlardan alt elemanlara doğru akar. Ekranda yanlış bir şey gördüğünüzde, yanlış bilgiyi nereden aldığınızı bulmak için bileşen hiyerarşisini yukarı doğru takip edebilirsiniz. Yanlış prop ileten veya yanlış state'e sahip olan bileşeni bulana kadar bileşen zincirinde yukarı doğru ilerleyebilirsiniz. Bu şekilde, sorunun kaynağını tespit edebilir ve düzeltmeler yapabilirsiniz. Alt elemanlar, üst elemanlarının state'ini Efektler içerisinde güncellediği durumlarda, veri akışını takip etmek zorlaşabilir. Üst ve alt elemanın aynı veriye ihtiyacı olduğunda, üst elemanın ihtiyaç duyduğunuz veriyi çekmesini sağlayın ve alt elemanlarına doğru *veriyi aşağıya iletin*:

```js {4-5}
function Parent() {
  const data = useSomeAPI();
  // ...
  // ✅ Veriyi aşağı doğru alt elemanlara iletmek daha iyidir.
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```

Veri akışının üst elemandan alt elemana doğru olması veri akışının tahmin edilmesini basitleştirir ve daha anlaşılır olmasını sağlar.

### Harici veri depolarını takip etme {/*subscribing-to-an-external-store*/}

Bazen, bileşenlerinizin React state'inin dışındaki bazı verilere abone olması gerebilir. Bu veriler, 3.parti bir kütüphaneden veya yerleşik tarayıcı API'leri olabilir. Bu veriler, React'ın bilgisi olmadan değişebileceğinden, manuel olarak bu verileri takip etmeniz gerekmektedir. Bu genellikle bir Efekt ile yapılır, örneğin:

```js {2-17}
function useOnlineStatus() {
  // Bir Efekt içinde manuel veri deposu takip edilmesi ideal değildir.
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function updateState() {
      setIsOnline(navigator.onLine);
    }

    updateState();

    window.addEventListener('online', updateState);
    window.addEventListener('offline', updateState);
    return () => {
      window.removeEventListener('online', updateState);
      window.removeEventListener('offline', updateState);
    };
  }, []);
  return isOnline;
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Bu örnekte, bileşen harici bir veri deposunu (burada, tarayıcının `navigator.onLine` API'sini) takip eder. Bu API sunucuda mevcut olmamasından dolayı (bu sebeple, başlangıç HTML'i için kullanılamaz), başlangıçta state `true` olarak ayarlanacaktır. Tarayıcı içerisindeki veri deposunun değeri her değiştiğinde, bileşen state'ini günceller.

Bu olay için Efektler kullanmak yaygın olsa da, React'in tercih edilen şekilde kullanılan harici bir veri deposunu takip etmek için özel olarak tasarlanmış bir Hook'u bulunmaktadır.  Efekti silin ve [`useSyncExternalStore`](/reference/react/useSyncExternalStore) ile değiştirin:

```js {11-16}
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Harici veri depolarını yerleşik Hooklar ile takip etmek daha iyidir.
  return useSyncExternalStore(
    subscribe, // React, aynı fonksiyonu geçtiğin sürece yeniden takip etmeyecek
    () => navigator.onLine, // İstemcideki değer bu şekilde alınır
    () => true // Sunucudaki değer bu şekilde alınır
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Bu yaklaşım, bir Efekt ile değiştirilebilir React state'ini manuel olarak senkronize etme işlemine göre daha az hataya sebep olur. Genellikle, yukarıdaki `useOnlineStatus()` gibi özelleştrilmiş bir Hook yazacağınızdan dolayı, ayrı ayrı her bileşende bu işlemi tekrar etmenize gerek yoktur. [React bileşenlerinden harici veri depolarını takip etme hakkında daha fazla bilgi edinebilirsiniz.](/reference/react/useSyncExternalStore)

### Veri çekme {/*fetching-data*/}

Birçok uygulama veri çekme işlemi için Efektleri kullanır. Şu şekilde veri çekme Efekti yazmak oldukça yaygındır:

```js {5-10}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // 🔴 Temizleme mantığı olmadan veri çekmekten kaçının.
    fetchResults(query, page).then(json => {
      setResults(json);
    });
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Bu veri çekme işlemini bir olay yöneticisine taşımanıza gerek *yoktur*.

Bu, daha önceki örneklerle çelişkili gibi görünebilir, çünkü mantığı olay yöneticilerine koymak gerekiyordu! Bununla birlikte, düşünün ki veri çekmenin ana neden *yazma olayı* değildir. Arama inputları genellikle URL'den önceden doldurulur ve kullanıcı, inputa dokunmadan Back ve Forward butonlarını kullanarak gezinebilir.

`page` ve `query`'nin nereden geldiğini önemli değildir. Bu bileşen görünürken, mevcut `page` ve `query` değerlerine göre ağdaki verilerle `results`'ı [senkronize](/learn/synchronizing-with-effects) etmek istersiniz. Bu nedenle, bunu bir Efekt olarak kullanırsınız.

Ancak, yukarıdaki kodda bir hata bulunmaktadır. Hızlıca `"hello"` yazdığınızı hayal edin. Ardından `query` değeri `"h"`'den, `"he"`, `"hel"`, `"hell"` ve `"hello"` şeklinde değişecektir. Bu ayrı ayrı veri çekme işlemleri başlatacaktır, ancak yanıtların hangi sırayla geleceği konusunda garanti verilmemektedir. Örneğin, `"hell"` yanıtı `"hello"` yanıtından sonra gelebilir. `setResults()` çağrısı en son yapıldığından dolayı, yanlış arama sonuçlarını görüntülemiş olacaksınız. Buna ["race condition"](https://en.wikipedia.org/wiki/Race_condition) denir: İki farklı istek birbirleriyle "yarıştı" ve beklediğinizden farklı bir sırayla geldi.

**Race condition sorununu düzeltmek, eski yanıtları görmezden gelmek için  [bir temizleme fonksiyonu eklemeniz](/learn/synchronizing-with-effects#fetching-data) gerekmektedir:**

```js {5,7,9,11-13}
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() => {
    let ignore = false;
    fetchResults(query, page).then(json => {
      if (!ignore) {
        setResults(json);
      }
    });
    return () => {
      ignore = true;
    };
  }, [query, page]);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}
```

Bu, Efektiniz veri çektiğinde, en son istenen isteğin haricindeki tüm yanıtların görmezden gelinmesini sağlar.

Race conditionları yönetmek, veri çekme işlemini uygularken karşılaşılan tek zorluk değildir. Ayrıca yanıtların önbelleğe alınması (kullanıcının Back butonuna tıkladığında önceki ekranı anında görebilmesi için), sunucuda veri çekme işleminin nasıl gerçekleştirileceği (ilk sunucu tarafından oluşturulan HTML'in spinner yerine çekilen içeriği içermesi için) ve ağ gecikmelerinden kaçınma yöntemleri (bir alt elemanın, üst elemanların tamamlanmasını beklemeksizin veri çekme işlemi yapabilmesi) gibi düşüncelerde bulunmanız gerekebilir.

**Bu sorunlar yalnızca React için değil, herhangi bir UI library için geçerlidir. Bunları çözmek trivial değildir; bu nedenle modern [framework’ler](/learn/creating-a-react-app#full-stack-frameworks), veriyi Effects içinde fetch etmeye kıyasla çok daha verimli built-in data fetching mekanizmaları sunar.**

Eğer bir framework kullanmadıysanız (ve kendiniz oluşturmak istemiyorsanız) ama Efektlerden veri çekme işlemini daha kolay şekilde yapmak istiyorsanız, kendi veri çekme mantığınızı bu örnekteki gibi özel bir Hook'a çevirin:

```js {4}
function SearchResults({ query }) {
  const [page, setPage] = useState(1);
  const params = new URLSearchParams({ query, page });
  const results = useData(`/api/search?${params}`);

  function handleNextPageClick() {
    setPage(page + 1);
  }
  // ...
}

function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setData(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [url]);
  return data;
}
```

Muhtemelen hata yönetimi ve içeriğin yüklenip yüklenmediğini takip etmek için muhtemelen biraz mantık eklemek isteyeceksiniz. Bu şekilde kendiniz bir Hook oluşturabilir veya React ekosisteminde mevcut olan birçok çözümden birini kullanabilirsiniz. **Bu tek başına, bir framework'ün yerleşik veri çekme mekanizmasını kullanmak kadar verimli olmayabilir, ancak veri çekme mantığını özel bir Hook'a taşımak, daha sonra verimli bir veri çekme stratejisini benimsemeyi kolaylaştıracaktır.**

Genelde, ne zaman Efekt yazmak zorunda kalsanız, `useData` gibi daha deklaratif ve amaç odaklı bir API'ye sahip olan özel bir Hook'a bir işlevselliği çıkarabileceğiniz durumları gözlemleyin. Bileşenlerinizde daha az sayıda `useEffect` çağrısı olduğunda, uygulamanızın bakımını daha rahat yapabileceksiniz.

<Recap>

- Eğer render işlemi sırasında hesaplama yapabiliyorsanız, bir Efekte ihtiyacınız yoktur.
- Masraflı hesaplamaları önbelleğe almak için, `useEffect` yerine `useMemo` kullanın.
- Bir bileşen ağacının durumunu sıfırlamak için ona farklı bir `key` iletin.
- Bir özelliğin değişimi sonucunda belirli bir state'in sıfırlanması için, bunu render sırasında ayarlayın.
- Bir bileşen görüntülendiğinde çalışan kod, Efektlerde olmalıdır, geri kalan kodlar ise olaylarda yer almalıdır.
- Eğer birkaç bileşenin state'ini güncellemeniz gerekiyorsa, bunu tek bir olay anında yapmak daha iyidir.
- Farklı bileşenlerdeki state değişkenlerini senkronize etmeye çalıştığınızda, state'i yukarı taşımayı düşünün.
- Veri çekmek için Effect'leri kullanabilirsiniz, ancak race conditionları önlemek için temizleme işlemini de uygulamanız gerekmektedir.

</Recap>

<Challenges>

#### Veriyi Efektler kullanmadan dönüştürün. {/*transform-data-without-effects*/}

Aşağıdaki `TodoList` todoların bir listesini gösterir. "Show only active todos" checkbox'ı işaretlendiğinde, tamamlanmış todolar listede gösterilmez. Hangi todoların görünür olduğuna bakmaksızın, footer henüz tamamlanmayan todoların sayısını gösterir.

Bu bileşeni tüm gereksiz state ve Efektleri ortadan kalırarak basitleştirin.

<Sandpack>

```js {expectedErrors: {'react-compiler': [12, 16, 20]}}
import { useState, useEffect } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [activeTodos, setActiveTodos] = useState([]);
  const [visibleTodos, setVisibleTodos] = useState([]);
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    setActiveTodos(todos.filter(todo => !todo.completed));
  }, [todos]);

  useEffect(() => {
    setVisibleTodos(showActive ? activeTodos : todos);
  }, [showActive, todos, activeTodos]);

  useEffect(() => {
    setFooter(
      <footer>
        {activeTodos.length} todos left
      </footer>
    );
  }, [activeTodos]);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      {footer}
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Hint>

Eğer bir şeyi render işlemi sırasında hesaplayabiliyorsanız, state veya güncelleme işlemi gerektiren bir Efekt
kullanmanıza gerek yoktur.

</Hint>

<Solution>

Bu örnekte state'in sadece iki önemli parçası var: `todos` listesi ve checkbox'ın işaretlenip işaretlenmediğini temsil eden `showActive` state değişkenidir. Diğer tüm state değişkenleri [gereksiz](/learn/choosing-the-state-structure#avoid-redundant-state) ve render işlemi sırasında yeniden hesaplanabilir. Bu kısma `footer`da dahildir, bu kısmı doğrudan çevreleyen JSX içine taşıyabilirsiniz.

Sonucunuz şu şekilde gözükmeli:

<Sandpack>

```js
import { useState } from 'react';
import { initialTodos, createTodo } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
      <footer>
        {activeTodos.length} todos left
      </footer>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

</Solution>

#### Efektler olmadan bir hesaplamayı önbelleğe alın {/*cache-a-calculation-without-effects*/}

Bu örnekte, todoların filtrelenmesi ayrı bir fonksiyon olan `getVisibleTodos()` içerisine taşındı. Bu fonksiyon içerisinde,sizin fonksiyonu ne zaman çağırdığınızı farketmenize yardımcı olması için bir `console.log()` çağrısı bulunur. "Show only active todos" seçeneğini değiştirin ve bunun `getVisibleTodos()` fonksiyonunun yeniden çalışmasına sebep olduğunu farkedeceksiniz. Bu beklenen bir durumdur, çünkü görünen todolar, hangilerini görüntüleyeceğinizi değiştirdiğinizde değişir.

Göreviniz, `TodoList` bileşeni içerisindeki `visibleTodos` listesini yeniden hesaplayan Efekti ortadan kaldırmaktır. Ancak, input içerisine yazarken `getVisibleTodos()` fonksiyonunun tekrar *çalışmayacağından* (dolayısıyla herhangi bir log yazdırmayacağından) emin olmalısınız.

<Hint>

Çözümlerden biri, görünür todoları önbelleğe almak için `useMemo` çağrısı ekleyin. Ayrıca, daha az göze çarpan çözüm de mevcuttur.

</Hint>

<Sandpack>

```js {expectedErrors: {'react-compiler': [11]}}
import { useState, useEffect } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const [visibleTodos, setVisibleTodos] = useState([]);

  useEffect(() => {
    setVisibleTodos(getVisibleTodos(todos, showActive));
  }, [todos, showActive]);

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

<Solution>

State değişkenini ve Efekti kaldırın, bunun yerine `getVisibleTodos()` çağrısının sonuçlarını önbelleğe alması için bir `useMemo` çağrısı ekleyin:

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const [text, setText] = useState('');
  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, showActive),
    [todos, showActive]
  );

  function handleAddClick() {
    setText('');
    setTodos([...todos, createTodo(text)]);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Bu değişikliklerle, `getVisibleTodos()` sadece `todos` veya `showActive` değiştiğinde çağrılacaktır. Input içerisine yazmak sadece `text` state değişkenini değiştirir, dolayısıyla bu bir `getVisibleTodos()` çağrısını tetiklemez.

`useMemo`'ya ihtiyaç duyulmayan bir başka çözüm de vardır. `text` state değişkeni todoları etkilemeyeceğinden, `NewTodo` formunu ayrı bir bileşene çıkarabilir, ve `text` state değişkenini bunun içerisine taşıyabilirsiniz;

<Sandpack>

```js
import { useState, useMemo } from 'react';
import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

export default function TodoList() {
  const [todos, setTodos] = useState(initialTodos);
  const [showActive, setShowActive] = useState(false);
  const visibleTodos = getVisibleTodos(todos, showActive);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={showActive}
          onChange={e => setShowActive(e.target.checked)}
        />
        Show only active todos
      </label>
      <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
      <ul>
        {visibleTodos.map(todo => (
          <li key={todo.id}>
            {todo.completed ? <s>{todo.text}</s> : todo.text}
          </li>
        ))}
      </ul>
    </>
  );
}

function NewTodo({ onAdd }) {
  const [text, setText] = useState('');

  function handleAddClick() {
    setText('');
    onAdd(createTodo(text));
  }

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={handleAddClick}>
        Add
      </button>
    </>
  );
}
```

```js src/todos.js
let nextId = 0;
let calls = 0;

export function getVisibleTodos(todos, showActive) {
  console.log(`getVisibleTodos() was called ${++calls} times`);
  const activeTodos = todos.filter(todo => !todo.completed);
  const visibleTodos = showActive ? activeTodos : todos;
  return visibleTodos;
}

export function createTodo(text, completed = false) {
  return {
    id: nextId++,
    text,
    completed
  };
}

export const initialTodos = [
  createTodo('Get apples', true),
  createTodo('Get oranges', true),
  createTodo('Get carrots'),
];
```

```css
label { display: block; }
input { margin-top: 10px; }
```

</Sandpack>

Input içerisine yazdığınızda, sadece `text` state değişkeni güncellenir. `text` state değişkeni alt `NewTodo` bileşeninin içerisinde olduğundan, üst `TodoList` bileşeni yeniden render olmaz. Bu nedenle, siz yazmaya devam ederken `getVisibleTodos()` çağrılmaz. (`TodoList` bir başka nedenle yeniden render olduğunda `getVisibleTodos()` çağrılmaya devam edecektir.)

</Solution>

#### Efektler olmadan state'i sıfırlayın {/*reset-state-without-effects*/}

Bu `EditContact` bileşeni, `savedContact` propu olarak `{ id, name, email }` şeklindeki bir kişi nesnesini alır. İsim ve email input alanlarını düzenlemeyi deneyin. Save butonuna bastığınızda, formun üzerindeki kişinin butonu düzenlenen adla güncellenir. Reset düğmesine bastığınızda ise formdaki bekleyen değişiklikler iptal edilir. Bir fikir edinmek için bu kullanıcı arayüzü ile oynayın.

Üstteki butonlarla bir kişi seçtiğinizde, form kişinin detaylarına göre sıfırlanır. Bu `EditContact.js` içerisindeki bir Efekt ile yapılır. Bu Efekti kaldırın. `savedContact.id` değiştiğinde formu resetlemek için farklı bir yol bulun.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js {expectedErrors: {'react-compiler': [8, 9]}} src/EditContact.js active
import { useState, useEffect } from 'react';

export default function EditContact({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  useEffect(() => {
    setName(savedContact.name);
    setEmail(savedContact.email);
  }, [savedContact]);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

<Hint>

React'a `savedContact.id` farklı olduğunda, `EditContact` formu kavramsal olarak _farklı  bir kullanıcının formu_ olduğunu ve state'i korumaması gerektiğini söylemenin bir yolu olsaydı güzel olurdu. Böyle bir yol hatırlıyor musun?

</Hint>

<Solution>

`EditContact` bileşenini iki parçaya ayırın. Bütün form state'ini iç `EditForm` bileşenine taşıyın. Dış `EditContact` bileşenini dışa aktarın, ve `savedContact.id`'yi iç `EditContact` bileşenine `key` olarak gönderilmesini sağlayın. Sonuç olarak, iç `EditForm` bileşeni bütün form state'ini sıfırlar ve farklı bir kişi seçtiğinizde DOM'u yeniden oluşturur.

<Sandpack>

```js src/App.js hidden
import { useState } from 'react';
import ContactList from './ContactList.js';
import EditContact from './EditContact.js';

export default function ContactManager() {
  const [
    contacts,
    setContacts
  ] = useState(initialContacts);
  const [
    selectedId,
    setSelectedId
  ] = useState(0);
  const selectedContact = contacts.find(c =>
    c.id === selectedId
  );

  function handleSave(updatedData) {
    const nextContacts = contacts.map(c => {
      if (c.id === updatedData.id) {
        return updatedData;
      } else {
        return c;
      }
    });
    setContacts(nextContacts);
  }

  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={selectedId}
        onSelect={id => setSelectedId(id)}
      />
      <hr />
      <EditContact
        savedContact={selectedContact}
        onSave={handleSave}
      />
    </div>
  )
}

const initialContacts = [
  { id: 0, name: 'Taylor', email: 'taylor@mail.com' },
  { id: 1, name: 'Alice', email: 'alice@mail.com' },
  { id: 2, name: 'Bob', email: 'bob@mail.com' }
];
```

```js src/ContactList.js hidden
export default function ContactList({
  contacts,
  selectedId,
  onSelect
}) {
  return (
    <section>
      <ul>
        {contacts.map(contact =>
          <li key={contact.id}>
            <button onClick={() => {
              onSelect(contact.id);
            }}>
              {contact.id === selectedId ?
                <b>{contact.name}</b> :
                contact.name
              }
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js src/EditContact.js active
import { useState } from 'react';

export default function EditContact(props) {
  return (
    <EditForm
      {...props}
      key={props.savedContact.id}
    />
  );
}

function EditForm({ savedContact, onSave }) {
  const [name, setName] = useState(savedContact.name);
  const [email, setEmail] = useState(savedContact.email);

  return (
    <section>
      <label>
        Name:{' '}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </label>
      <label>
        Email:{' '}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </label>
      <button onClick={() => {
        const updatedData = {
          id: savedContact.id,
          name: name,
          email: email
        };
        onSave(updatedData);
      }}>
        Save
      </button>
      <button onClick={() => {
        setName(savedContact.name);
        setEmail(savedContact.email);
      }}>
        Reset
      </button>
    </section>
  );
}
```

```css
ul, li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li { display: inline-block; }
li button {
  padding: 10px;
}
label {
  display: block;
  margin: 10px 0;
}
button {
  margin-right: 10px;
  margin-bottom: 10px;
}
```

</Sandpack>

</Solution>

#### Efektler olmadan bir form gönderin {/*submit-a-form-without-effects*/}

Bu `Form` bileşeni bir arkadaşınıza mesaj göndermenize izin verir. Formu gönderdiğinizde, `showForm` state değişkeni `false` olarak değişir. Bu `sendMessage(message)` adında  mesaj gönderen bir Efekt tetikler (mesajı konsolda görebilirsiniz). Mesaj gönderildikten sonra, forma geri dönmenizi sağlayan "Open chat" butonu olan bir "Thank you" bildirim mesajını görürsünüz.

Uygulamanızın kullanıcıları çok fazla mesaj gönderiyor. Sohbet etmeyi biraz daha zorlaştırmak için, form yerine *önce* "Thank you" bildirim mesajını göstermeye karar verdiniz. Bunun için `showForm` state değişkenini `true` yerine `false` ile başlatacak şekilde değiştirin. Bu değişikliği yaptığınız anda konsol boş bir mesajın gönderildiğini gösterecektir. Bu mantıkta bir şeyler yanlış!

Bu hatanın ana kaynağı nedir? Ve bunu nasıl düzeltebilirsiniz?

<Hint>

Kullanıcı "Thank you" mesajını _gördüğü için_ mi mesaj gönderilmeli? Yoksa tam tersi, mesajı gönderdiği için mi "Thank You" mesajını görmeli?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!showForm) {
      sendMessage(message);
    }
  }, [showForm, message]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Solution>

showForm state değişkeni, formun mu yoksa "Thank you" mesajının mı gösterileceğini belirler. Ancak "Thank you" iletişim kutusu _görüntülendiği_ için mesajı göndermiyorsunuz. Kullanıcının  _formu göndermesi_ nedeniyle mesajı göndermek istiyorsunuz. Yanıltıcı Efekti silin ve `sendMessage` çağrısını `handleSubmit` olay yöneticisi içerisine taşıyın:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Form() {
  const [showForm, setShowForm] = useState(true);
  const [message, setMessage] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setShowForm(false);
    sendMessage(message);
  }

  if (!showForm) {
    return (
      <>
        <h1>Thanks for using our services!</h1>
        <button onClick={() => {
          setMessage('');
          setShowForm(true);
        }}>
          Open chat
        </button>
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit" disabled={message === ''}>
        Send
      </button>
    </form>
  );
}

function sendMessage(message) {
  console.log('Sending message: ' + message);
}
```

```css
label, textarea { margin-bottom: 10px; display: block; }
```

</Sandpack>

Bu versiyonda, sadece _formun gönderilmesi_ (bu bir olaydır) durumunda mesaj gönderilir. `showForm` başlangıçta `true` veya `false` olarak ayarlanmış olsa da işleyiş aynı şekilde eşit derecede iyi çalışır. (`showForm`'u `false` olarak değiştirin ve fazladan konsol mesajı olmadığını farkedin.)

</Solution>

</Challenges>