---
title: "Yerleşik React Hook'ları"
---

<Intro>

*Hook'lar*, bileşenlerinizde farklı React özelliklerini kullanmanızı sağlar. Yerleşik Hook'ları kullanabilir ya da kendi Hook'larınızı oluşturmak için onları birleştirebilirsiniz. Bu sayfa, React'teki tüm yerleşik Hook'ları listeler.
</Intro>

---

## State Hook'ları {/*state-hooks*/}

*State* bir bileşenin [kullanıcı girdisi gibi bir bilgiyi "hatırlamasını"](/learn/state-a-components-memory) sağlar. Örneğin, bir form bileşeni input değerini saklamak için state kullanabilirken, bir resim galerisi bileşeni de seçilen resim indeksini saklamak için state kullanabilir.

Bir bileşene state eklemek için bu Hook'lardan birini kullanın:

* [`useState`](/reference/react/useState) direkt olarak güncelleyebileceğiniz bir state değişkeni bildirir.
* [`useReducer`](/reference/react/useReducer) [reducer fonksiyonu](/learn/extracting-state-logic-into-a-reducer) ile güncellenebilen bir state değişkeni bildirir.

```js
function ImageGallery() {
  const [index, setIndex] = useState(0);
  // ...
```

---

## Context Hook'ları {/*context-hooks*/}

*Context*, bir bileşenin [bilgiyi prop olarak geçirmeden uzaktaki üst bileşenlerden almasını](/learn/passing-props-to-a-component) sağlar. Örneğin, uygulamanızın en üst düzey bileşeni, derinliğine bakılmaksızın tüm alt bileşenlere geçerli UI temasını iletebilir.

* [`useContext`](/reference/react/useContext) bir context değerini okur ve abone olur.

```js
function Button() {
  const theme = useContext(ThemeContext);
  // ...
```

---

## Ref Hook'ları {/*ref-hooks*/}

*Ref'ler* bir bileşenin [render için kullanılmayan bazı bilgileri](/learn/referencing-values-with-refs) (örneğin, bir DOM düğümü veya bir timeout ID) tutmasını sağlar. State ile farklı olarak, bir ref'i güncellemek bileşeninizi yeniden render etmez. Ref'ler, React paradigmasından kaçmak için kullanılır. Dahili tarayıcı API'lari gibi React dışı sistemlerle çalışmanız gerektiğinde kullanışlıdır.

* [`useRef`](/reference/react/useRef) bir ref bildirir. İçinde herhangi bir değeri tutabilirsiniz, ancak genellikle bir DOM düğümü tutmak için kullanılır.
* [`useImperativeHandle`](/reference/react/useImperativeHandle) bileşeninizin dışarıya açtığı bir ref'i özelleştirmenizi sağlar. Bu nadiren kullanılır.

```js
function Form() {
  const inputRef = useRef(null);
  // ...
```

---

## Efekt Hook'ları {/*effect-hooks*/}

*Effect'ler*, bir bileşenin [harici sistemlere bağlanmasını ve onlarla senkronize olmasını](/learn/synchronizing-with-effects) sağlar. Bu sistemler; ağ, tarayıcı DOM'u, animasyonlar, farklı bir UI kütüphanesi kullanılarak yazılmış araçlar ve diğer React dışı kodları kapsar.

* [`useEffect`](/reference/react/useEffect) bir bileşeni harici bir sisteme bağlar.

```js
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  // ...
```

Effekler React paradigmasından kaçmak için kullanılır. Uygulamanızın veri akışını düzenlemek için Efektleri kullanmayın. Eğer harici bir sistemle etkileşimde değilseniz, [bir Efekte ihtiyacınız olmayabilir.](/learn/you-might-not-need-an-effect)

Zamanlama noktasında farklılıları olan ve nadiren kullanılan iki `useEffect` varyasyonu vardır:

* [`useLayoutEffect`](/reference/react/useLayoutEffect) tarayıcı ekrana tekrar çizim yapmadan önce çalışır. Yerleşim (layout) hesaplamalarını burada yapabilirsiniz.
* [`useInsertionEffect`](/reference/react/useInsertionEffect) React DOM'a değişiklik yapmadan önce çalışır. Kütüphaneler bu noktada dinamik olarak CSS ekleyebilir.

---

## Performans Hook'ları {/*performance-hooks*/}

Tekrar render etme performansını optimize etmenin yaygın bir yolu da gereksiz işlemleri atlamaktır. Örneğin, React'e önbelleğe alınmış bir hesaplamayı yeniden kullanmasını veya verilerin, önceki render'dan bu yana değişmediyse, yeniden render edilmesini atlamasını söyleyebilirsiniz.

Hesaplamaları ve gereksiz yeniden render etmeleri atlamak için bu Hook'lardan birini kullanın:

- [`useMemo`](/reference/react/useMemo); pahalı bir hesaplamanın sonucunu önbelleğe almanızı sağlar.
- [`useCallback`](/reference/react/useCallback); bir fonksiyon tanımının, optimize edilmiş bir bileşene iletilmeden önce, önbelleğe alınmasını sağlar.

```js
function TodoList({ todos, tab, theme }) {
  const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
  // ...
}
```

Bazen yeniden render etmeyi atlayamazsınız çünkü ekranın gerçekten güncellenmesi gerekir. Bu durumda, kullanıcı arayüzünü engellemesi gerekmeyen güncellemeleri (bir grafiği güncellemek gibi), eşzamanlı olması gereken güncellemelerden (örneğin bir inputa yazmak) ayırarak performansı artırabilirsiniz.

Render etme işlemini önceliklendirmek için bu Hook'lardan birini kullanın:

- [`useTransition`](/reference/react/useTransition) bir state geçişini engellemeyen (non-blocking) olarak işaretleyerek diğer güncellemelerin araya girmesine izin verir.
- [`useDeferredValue`](/reference/react/useDeferredValue) arayüzün kritik olmayan bir kısmının güncellenmesini ertelemenize ve önce diğer bölümlerin güncellenmesine izin vermenize olanak sağlar.

---

## Kaynak Hook'ları {/*resource-hooks*/}

*Kaynaklar* bir bileşenin, state'inin bir parçası olmadan da erişebileceği verilerdir. Örneğin, bir bileşen bir Promise'den bir mesajı veya bir context'ten stil bilgilerini okuyabilir.

Bir kaynaktan bir değer okumak için bu Hook'u kullanın:

- [`use`](/reference/react/use) [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) ya da [context](/learn/passing-data-deeply-with-context) gibi bir kaynakğın değerini okumanızı sağlar.

```js
function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
}
```

---

## Diğer Hook'lar {/*other-hooks*/}

Bu Hook'lar genellikle kütüphane geliştiricileri için kullanışlıdır ve uygulama kodlarında yaygın olarak kullanılmazlar.

- [`useDebugValue`](/reference/react/useDebugValue) React DevTools'da, kendi yazdığınız hook için özel bir etiket belirlemenizi sağlar.
- [`useId`](/reference/react/useId) bir bileşenin kendisiyle benzersiz bir ID ilişkilendirmesini sağlar. Genellikle erişilebilirlik API'ları ile kullanılır.
- [`useSyncExternalStore`](/reference/react/useSyncExternalStore) bir bileşenin harici bir depoya abone olmasını sağlar.

---

## Kendi Hook'larınız {/*your-own-hooks*/}

Ayrıca, [kendi özel Hook'larınızı](/learn/reusing-logic-with-custom-hooks#extracting-your-own-custom-hook-from-a-component) JavaScript fonksiyonları olarak tanımlayabilirsiniz.
