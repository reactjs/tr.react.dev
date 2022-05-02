---
id: hooks-reference
title: Hook'ların API Kaynağı
permalink: docs/hooks-reference.html
prev: hooks-custom.html
next: hooks-faq.html
---

*Hook'lar* React 16.8'deki yeni bir eklentidir. Bir sınıf yazmadan state ve diğer React özelliklerini kullanmanıza olanak sağlarlar.

Bu sayfa React içinde gelen Hook'ların kullanım arayüzünü (API) açıklamaktadır.

Eğer Hook'lara yeniyseniz önce [Bir Bakışta Hook'lar](/docs/hooks-overview.html) bölümüne göz atın. [Sıkça sorulan sorular](/docs/hooks-faq.html) bölümünde de işe yarar bilgiler bulabilirsiniz.

- [Temel Hook'lar](#basic-hooks)
  - [`useState`](#usestate)
  - [`useEffect`](#useeffect)
  - [`useContext`](#usecontext)
- [Diğer Hook'lar](#additional-hooks)
  - [`useReducer`](#usereducer)
  - [`useCallback`](#usecallback)
  - [`useMemo`](#usememo)
  - [`useRef`](#useref)
  - [`useImperativeHandle`](#useimperativehandle)
  - [`useLayoutEffect`](#uselayouteffect)
  - [`useDebugValue`](#usedebugvalue)
  - [`useDeferredValue`](#usedeferredvalue)
  - [`useTransition`](#usetransition)
  - [`useId`](#useid)
- [Library Hooks](#library-hooks)
  - [`useSyncExternalStore`](#usesyncexternalstore)
  - [`useInsertionEffect`](#useinsertioneffect)

## Temel Hook'lar {#basic-hooks}

### `useState` {#usestate}

```js
const [state, setState] = useState(initialState);
```

Bir state parçası ve onu güncellemek için bir fonksiyon döndürür.

İlk render aşamasında, döndürülen state parçası (`state`) başlangıçta girilen değerle (`initialState`) aynıdır.

`setState` fonksiyonu state parçasını güncellemek için kullanılır. Yeni bir state değeri kabul eder ve bileşenin yeniden render edilmesini işlem sırasına koyar.

```js
setState(newState);
```

Sonra gelen yeniden-render aşamalarında, `useState` tarafından döndürülen ilk değer, güncelleme uygulandıktan sonraki en son state değerine eşittir.

>Not
>
>React, `setState` fonksiyonunun yeniden-render aşamalarında kimliğini sabit tutulacağı garantisini verir. Bu yüzden `setState` fonksiyonunu `useEffect` ya da `useCallback` hook'larının bağımlı değişkenler listesine eklemenize gerek yoktur.

#### Fonksiyonlu Güncellemeler {#functional-updates}

Eğer yeni state, bir önceki state değerine bağlı olarak hesaplanıyorsa, `setState` içine fonksiyon girebilirsiniz. Bu fonksiyon bir önceki state değerini parametre olarak alır ve güncel state değerini döndürür. `setState` fonksiyonunun her iki çeşidini de kullanan bir örnek sayaç fonksiyonu oluşturalım:

```js
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}
```

"+" ve "-" butonları fonksiyonlu çeşidi kullanır, çünkü güncellenen değer bir önceki değere bağlıdır. Ancak "Reset" butonu normal çeşidi kullanır, çünkü her seferinde sayacı başlangıç değerine sıfırlar.

Eğer bu güncelleme fonksiyonunuz mevcut state ile aynı değeri döndürürse, sıradaki yeniden-render işlemi tamamen göz ardı edilir.

>Not
>
>Sınıf bileşenlerindeki `setState` metodunun aksine, `useState` objeleri otomatik olarak birleştirmez. Fonksiyonlu güncelleme metodu ve obje yayma (spread) operatörü birlikte kullanılarak bu özellik yeniden üretilebilir:
>
> ```js
> const [state, setState] = useState({});
> setState(prevState => {
>   // Object.assign da kullanılabilir
>   return {...prevState, ...updatedValues};
> });
> ```
>
>Diğer bir seçenek ise `useReducer` hook'udur, ki bu birden fazla alt değeri olan objelerin yönetimine daha uygundur.

#### Tembel (lazy) başlangıç state değeri {#lazy-initial-state}

`initialState` değeri ilk render aşamasında kullanılan state değeridir. Sonra gelen render işlemlerinde göz ardı edilir. Eğer başlangıç state değeri ağır bir işlemin sonucu olarak hesaplanıyorsa, bunun yerine yalnızca ilk render aşamasında çalışacak bir fonksiyon girebilirsiniz:

```js
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

#### State güncellemesinden kurtulmak {#bailing-out-of-a-state-update}

Bir State Hook'unu mevcut state değeri ile aynı olan bir değerle güncellerseniz, React render işlemini yapmaz ya da efektleri işleme sokmaz. (React [`Object.is` karşılaştırma algoritmasını](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) kullanır.)

Unutmayın, React yine de bu spesifik bileşeni tekrar render edebilir. Bu durum sorun teşkil etmez çünkü React gereksiz bir şekilde bileşen ağacında derinlere doğru inmez. Render aşamasında ağır hesaplamalar yapıyorsanız, bunları `useMemo` ile optimize edebilirsiniz.

### `useEffect` {#useeffect}

```js
useEffect(didUpdate);
```

Zorunlu yan etkileri (side effects) olan bir fonksiyonu parametre olarak alır.

Mutasyonlar, abonelikler, zamanlayıcılar, loglama, ve diğer yan etkisi olan işlemler bir fonksiyon bileşenin ana gövdesinde bulunamazlar (React'ın _render aşaması_ olarak da bilinir). Böyle yapmak kafa karıştıran hatalara ve kullanıcı arayüzünde (UI) tutarsızlıklara sebep olacaktır.

Bunun yerine, `useEffect` kullanın. `useEffect` içine girilen fonksiyon, render işlemi gerçekleşip bileşenler ekrana yazdırıldıktan sonra çalışacaktır. Efektleri, React'ın tamamen fonksiyonel olan dünyasından gerçek dünyaya bir yangın çıkışı olarak görebilirsiniz.

Varsayılan olarak, efektler her tamamlanan render işleminden sonra çalışır, ancak [sadece belli değerler değiştiğinde](#conditionally-firing-an-effect) çalıştırmak da sizin elinizde.

#### Bir efekti temizlemek {#cleaning-up-an-effect}

Genelde, efektler bileşen ekrandan kaldırılmadan önce temizlenmesi gereken bazı kaynaklar oluşturur, bir abonelik ve zamanlayıcı gibi. Bunu yapmak için, `useEffect` içine girilen fonksiyon bir temizlik fonksiyonu döndürülebilir. Örneğin bir abonelik oluşturalım:

```js
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    //Aboneliği temizle
    subscription.unsubscribe();
  };
});
```

Temizlik fonksiyonu, bellek sızıntılarını önlemek için, bileşen ekrandan kaldırılmadan hemen önce çalıştırılır. Ek olarak, bileşen birkaç defa render edilirse (ki genelde edilir), **bir önceki efekt yeni efekt çalıştırılmadan temizlenir**. Bizim örneğimizde bu demektir ki her güncellemede yeni bir abonelik oluşturuluyor. Bir efekti her güncellemede çalıştırmanın önüne geçmek için bir sonraki bölüme bakınız.

#### Efektlerin zamanlaması {#timing-of-effects}

`componentDidMount` ve `componentDidUpdate`'in aksine, `useEffect` içine girilen fonksiyon ekrana yazdırma işleminden **sonra**, gecikmeli bir olay olarak çalışır. Bu `useEffect`'i birçok yaygın yan etki için uygun getirir, mesela aboneliklerin ve olay yöneticilerinin oluşturulması, çünkü birçok işlem türü aslında tarayıcının ekranı güncellemesini engellememelidir.

Buna rağmen, tüm efekler ertelenemeyebilir. Örneğin, kullanıcının görebildiği, DOM üzerindeki bir değişiklik bir sonraki ekrana yazdırma aşamasından önce gerçekleşmelidir ki kullanıcı görsel bir uyumsuzluk yaşamasın. (Aradaki ayırım konsept olarak pasif vs. aktif olay dinleyicilerine benzer.) Bu tip efekler için React, [`useLayoutEffect`](#uselayouteffect) adında başka bir hook daha sağlar. Bu hook da `useEffect` ile aynı şekilde çalışır, sadece ne zaman çalıştırılacağı farklıdır.

Additionally, starting in React 18, the function passed to `useEffect` will fire synchronously **before** layout and paint when it's the result of a discrete user input such as a click, or when it's the result of an update wrapped in [`flushSync`](/docs/react-dom.html#flushsync). This behavior allows the result of the effect to be observed by the event system, or by the caller of [`flushSync`](/docs/react-dom.html#flushsync).
> Note
> 
> This only affects the timing of when the function passed to `useEffect` is called - updates scheduled inside these effects are still deferred. This is different than [`useLayoutEffect`](#uselayouteffect), which fires the function and processes the updates inside of it immediately.

`useEffect` tarayıcı ekrana yazdırma işlemini tamamlanana kadar geciktirilmiş olmasına rağmen, herhangi bir yeniden-render işleminden önce çalışması da garanti edilir. React her zaman bir önceki render işleminin efektlerini, yeni bir güncellemeye başlamadan önce temizleyecektir.

#### Şartlı olarak bir efekti çalıştırmak {#conditionally-firing-an-effect}

Efektler için varsayılan davranış, her bir tamamlanmış render işleminden sonra efekti çalıştırmaktır. Bu şekilde bir efekt, bağımlı olduğu değişkenlerden birisi değiştiğinde yeniden oluşturulur. 

Ancak, bazı durumlarda bu aşırı güç kullanımı gibi gelebilir, örneğin bir önceki bölümdeki abonelik örneğinde olduğu gibi. Her bir güncellemede yeni bir abonelik oluşturmamıza gerek yoktur, sadece `source` prop değeri değişirse.

Bunu uygulamak için, `useEffect`'e efektin bağımlı olduğu değerlerden oluşan bir diziyi ikinci bir argüman girin. Yeni örneğimiz şimdi şu şekilde görünüyor:

```js
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

Şimdi abonelik yalnızca `props.source` değiştiğinde yeniden oluşturulacaktır.

>Not
>
>Eğer bu optimizasyonu kullanırsanız, diziye **bileşenin içindeki zaman içinde değişen ve efekt içinde kullanılan tüm değerleri** dahil etmeyi unutmayın. Aksi takdirde kodunuz bir önceki render işleminden kalma geçerliliğini yitirmiş değerlere referans gösterecektir. [Fonksiyonlarla nasıl çalışılır](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) ve [dizinin değerleri çok sık değiştiğinde ne yapılır](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) konuları hakkında daha fazla bilgi edinin.
>
>Bir efekti yalnızca bir kere çalıştırıp temizlemek istediğinizde (mount ve unmount aşamalarında), ikinci argüman olarak boş bir dizi (`[]`) gönderebilirsiniz. Böylece React'a, efektin state veya props içindeki hiçbir değere bağlı olmadığını söylemiş olursunuz, böylece efekt *hiçbir* zaman yeniden çalıştırılmaz. Bu özel bir durum değildir -- bağımlı değişkenler dizisinin çalışma prensibi bu şekildedir.
>
>Boş bir dizi girdiğinizde (`[]`), efekt içindeki props ve state her zaman başlangıç değerlerini alırlar. İkinci argüman olarak boş dizi `[]` girmek `componentDidMount` ve `componentWillUnmount` modeline benzese de, efektlerin çok fazla yeniden çalışmasını engellemek için genelde [daha iyi](/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies) [çözümler](/docs/hooks-faq.html#what-can-i-do-if-my-effect-dependencies-change-too-often) mevcuttur. Ayrıca, React'ın `useEffect`'in çalıştırılmasını tarayıcı ekrana yazdırdıktan sonraya bıraktığını unutmayın, yani fazladan iş yapmak çok da önemli değil.
>
>
>Biz [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) kuralının [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) paketinin bir parçası olarak kullanılmasını öneriyoruz. Bu paket bağımlı değişkenler yanlış bir şekilde belirtildiğinde uyarır ve bir çözüm önerir.

Bağımlı değişkenler dizisi efekt fonksiyonuna argüman olarak girilmez. Ancak konsept olarak temsil ettikleri şey odur: efekt fonksiyonu içerisinde referans gösterilen her değer bağımlı değişkenler dizisinde de bulunmalıdır. Gelecekte, yeterince gelişmiş bir derleyici bu diziyi otomatik olarak oluşturabilir.

### `useContext` {#usecontext}

```js
const value = useContext(MyContext);
```

Bir context objesi alır (`React.createContext`'den döndürülen değer) ve mevcut context için o andaki context değerini döndürür. Mevcut context değeri, bileşen ağacında yukarı doğru çıkarken en yakında bulunan `<MyContext.Provider>` ifadesinin `value` değeri tarafından belirlenir. 

Yukarı doğru en yakındaki `<MyContext.Provider>` güncellendiğinde, bu Hook en güncel context `value` değerini `MyContext` sağlayıcısına göndererek bir yeniden-render işlemi tetikler. Yukarıdaki bileşenler [`React.memo`](/docs/react-api.html#reactmemo) ya da [`shouldComponentUpdate`](/docs/react-component.html#shouldcomponentupdate) kullansa bile, yeniden-render işlemi `useContext`'i kullanan bileşenden başlayarak yine de gerçekleşir.

`useContext`'e girilen argümanın *context objesinin kendisi* olduğunu unutmayın:

 * **Doğru:** `useContext(MyContext)`
 * **Yanlış:** `useContext(MyContext.Consumer)`
 * **Yanlış:** `useContext(MyContext.Provider)`

`useContext`'i çağıran bir bileşen context değeri her değiştiğinde yeniden-render edilecektir. Eğer bileşenin yeniden-render edilmesi ağır bir işlem ise, [memoization kullanarak](https://github.com/facebook/react/issues/15156#issuecomment-474590693) optimize edebilirsiniz.

>İpucu
>
>Context API ile Hook'lardan önce tanıştıysanız, `useContext(MyContext)` ile sınıf bileşenlerindeki `static contextType = MyContext` ya da `<MyContext.Consumer>` aynı şeylerdir.
>
>`useContext(MyContext)` sadece context'i *okumanıza* olanak sağlar ve oradaki değişikliklere abone olur. Bileşen ağacınızın üst kısımlarında, bu context'in değerinin *sağlayıcısı* olarak `<MyContext.Provider>`'a hala ihtiyacınız vardır. 

**Context.Provider ile parçaları birleştirelim**
```js{31-36}
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);

  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```
Bu örnek, Context'i ne zaman ve nasıl kullanacağınıza dair bilgiler bulabileceğiniz bir önceki [Context Gelişmiş Rehberi](/docs/context.html) örneğinden alınıp Hook'lar için düzenlenmiştir.


## Diğer Hook'lar {#additional-hooks}

Aşağıda bahsedilen hook'lar ya önce bahsedilen hook'lardan türetilmiştir, ya da belli başlı uç örnekler için gereklidir. Başlangıç aşamasında bunları öğrenmeyi dert etmeyin.

### `useReducer` {#usereducer}

```js
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

[`useState`](#usestate)'e bir alternatiftir. `(state, action) => newState` şeklinde bir reducer fonksiyonunu parametre olarak alır, ve mevcut state'i bir `dispatch` metodu ile birlikte döndürür. (Eğer Redux biliyorsanız, bunun da nasıl çalıştığını zaten biliyorsunuz.)

Birden fazla alt değere sahip karmaşık bir state mantığınız (state logic) olduğunda ya da bir sonraki state bir öncekine bağlı olduğu durumlarda `useReducer`, `useState`'e göre daha çok tercih edilir. Ayrıca [Callback fonksiyonlar yerine `dispatch` gönderebildiğiniz için](/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down), `useReducer` derin güncellemeler gerçekleştiren bileşenlerin performansını artırmanıza müsade eder.

Şimdi de [`useState`](#usestate) bölümündeki örneğin reducer kullanarak yazılmış haline bakalım:

```js
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

>Not
>
>React `dispatch` fonksiyonunun kimliğinin sabit kalacağını garanti eder ve yeniden render işleminde bu fonksiyon değişmez. Bu yüzden `useEffect` or `useCallback` hook'larının bağımlı değişken dizisine eklenmesine gerek yoktur.

#### Başlangıç state değerinin belirlenmesi {#specifying-the-initial-state}

`useReducer` ile state oluşturmanın iki farklı yöntemi vardır. Kullanım amacınıza göre istediğinizi seçebilirsiniz. En kolay yöntem, bağlangıç state değerinin ikinci parametre olarak girilmesidir:

```js{3}
  const [state, dispatch] = useReducer(
    reducer,
    {count: initialCount}
  );
```

>Not
>
>React, Redux tarafından popülerleştirilen `state = initialState` geleneğini kullanmaz. State'in başlangıç değeri bazen prop'lara bağlı olabilir ve tam da bu yüzden Hook içinde belirlenmiştir. Bu konuda kendinize güveniyorsanız, Redux'taki işlemi taklit etmek için `useReducer(reducer, undefined, reducer)` şeklinde kullanabilirsiniz fakat bu yöntem tavsiye edilmez.

#### "Lazy başlatma" {#lazy-initialization}

State'in başlangıç değerini lazy yükleme yöntemiyle de oluşturabilirsiniz. Bunun için, üçüncü argüman olarak `init` fonksiyonu girebilirsiniz. Başlangıç state değeri `init(initialArg)` olarak belirlenecektir.

Bu yöntem, başlangıç state değerini oluşturan mantığın reducer dışına çıkarılmasına yardımcı olur. Bu yöntem sayesinde state'in sonradan bir action'a yanıt olarak resetlenmesi de mümkündür:

```js{1-3,11-12,19,24}
function init(initialCount) {
  return {count: initialCount};
}

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    case 'reset':
      return init(action.payload);
    default:
      throw new Error();
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, initialCount, init);
  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

#### Dispatch'ten kurtulmak {#bailing-out-of-a-dispatch}

Eğer bir Reducer Hook'tan mevcut state'in aynısını döndürüyorsanız, React alt bileşenlerin yeniden render işlemini yapmaktan veya efektlerini çalıştırmaktan kurtulacaktır. (React [`Object.is` karşılaştırma algoritmasını](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description) kullanmaktadır.)

Unutmayın, React bu bahsedilen bileşeni, esas yeniden render işleminden kurtulmadan önce bir kez daha render etmek zorunda olabilir. Bu sorun olmaz çünkü React bileşen ağacında gereksiz bir şekilde aşağılara doğru inmez. Render işlemi aşamasında ağır işlemler yapıyorsanız, bunları `useMemo`ile optimize edebilirsiniz.

### `useCallback` {#usecallback}

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

[Memoize](https://en.wikipedia.org/wiki/Memoization) edilmiş bir callback fonksiyonu döndürür.

Argüman olarak satıriçi bir callback ve bağımlı değişkenler dizisi girin. `useCallback` girdiğiniz callback'in memoize edilmiş, yani hafızadaki yeri korunmuş, ve sadece bağımlı değişkenler dizisine girilen değerlerden birisi değiştiğinde bu hafızadaki yerin değiştiği bir versiyonunu döndürecektir. Bu işlem, yeniden render işlemlerinin önüne geçmek için reference equality yöntemine göre optimize edilmiş alt bileşenlere callback fonksiyonu girerken işinize yarar (örneğin `shouldComponentUpdate`).

`useCallback(fn, deps)` kullanımı ile `useMemo(() => fn, deps)` kullanımı birbirine eşdeğerdir.

>Not
>
>Bağımlı değişkenler dizisi efekt fonksiyonuna argüman olarak girilmez. Ancak konsept olarak temsil ettikleri şey odur: efekt fonksiyonu içerisinde referans gösterilen her değer bağımlı değişkenler dizisinde de bulunmalıdır. Gelecekte, yeterince gelişmiş bir derleyici bu diziyi otomatik olarak oluşturabilir.
>
>Biz [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) kuralının [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) paketinin bir parçası olarak kullanılmasını öneriyoruz. Bu paket bağımlı değişkenler yanlış bir şekilde belirtildiğinde uyarır ve bir çözüm önerir.

### `useMemo` {#usememo}

```js
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

[Memoize](https://fazlamesai.net/posts/common-lisp-ve-bir-optimizasyon-teknigi-memoization) edilmiş bir değer döndürür.

"Create" fonksiyonu ve bir bağımlı değişkenler dizisi girin. `useMemo` memoize edilen değeri, yalnızca bağımlı değişkenlerden birisi değiştiğinde yeniden hesaplar. Bu optimizasyon, ağır işlemlerin her render işleminde yeniden gerçekleştirilmesini önlemeye yardımcı olur.

`useMemo` içine girilen fonksiyonun render aşamasında çalıştığını unutmayın. Normalde render aşamasında yapmayacağınız hiç bir işlemi burada yapmayın. Örneğin, efektler `useEffect` içinde olmalıdır, `useMemo` içinde değil.

Eğer bir bağımlı değişken dizisi verilmezse, her render işleminde değer tekrar hesaplanır.

**`useMemo`'ya performans artırmak için güvenebilirsiniz, ancak anlamsal bir garanti söz konusu değildir.** Gelecekte, React daha önce memoize edilmiş bazı değerleri "unutmayı" tercih edebilir ve bir sonraki render aşamasında yeniden hesaplayabilir, mesela ekranda olmayan bileşenlere hafızada yer açmak için. Kodunuzu `useMemo` olmadan çalışacak şekilde yazın — ve sonra performansı artırmak için bu hook'tan faydalanın.

>Not
>
> Bağımlı değişkenler dizisi efekt fonksiyonuna argüman olarak girilmez. Ancak konsept olarak temsil ettikleri şey odur: efekt fonksiyonu içerisinde referans gösterilen her değer bağımlı değişkenler dizisinde de bulunmalıdır. Gelecekte, yeterince gelişmiş bir derleyici bu diziyi otomatik olarak oluşturabilir.
>
>Biz [`exhaustive-deps`](https://github.com/facebook/react/issues/14920) kuralının [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks#installation) paketinin bir parçası olarak kullanılmasını öneriyoruz. Bu paket bağımlı değişkenler yanlış bir şekilde belirtildiğinde uyarır ve bir çözüm önerir.

### `useRef` {#useref}

```js
const refContainer = useRef(initialValue);
```

`useRef` Hook, `.current` değeri sizin girdiğiniz (`initialValue`) argümanıyla başlatılan, değiştirilebilen bir obje döndürür. Döndürülen obje, bileşenin yaşam döngüsü boyunca aynı kalacaktır.

Genel bir kullanım yeri, alt bileşene zorunlu bir erişimin gerektiği durumlardır:

```js
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` ekrandaki text input elemanına işaret eder
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

Temelde, `useRef`, `.current` değerinde değiştirilebilen bir değer tutan bir "kutu" gibidir.

Ref'leri, [DOM'a erişmenin](/docs/refs-and-the-dom.html) bir yolu olarak kullanmış olabilirsiniz. Bir ref objesini React'a `<div ref={myRef} />` şeklinde girerseniz, React bu ref'in `.current` değerini, bu DOM elemanına, eleman her değiştiğinde eşitler.

Ancak `useRef()`, `ref`'den başka şeyler için de kullanışlıdır. Sınıflarda instance fields kullanımında olduğu gibi [değiştirilebilen (mutable) bir değeri elde tutmak için kullanılabilir](/docs/hooks-faq.html#is-there-something-like-instance-variables).

Bu yöntem çalışır çünkü `useRef()` basit bir JavaScript objesi oluşturur. Bir objeyi kendiniz `{current: ...}` şeklinde oluşturmanız ve `useRef()` kullanmanız arasındaki fark şudur: `useRef()` size her render işleminden sonra hafızadaki yeri değişmeyen aynı ref objesini verecektir.

Şunu unutmayın ki `useRef` içeriği değiştiğinde size haber *vermez*. `.current` değerini değiştirmek yeniden render işlemine sebep olmaz. Eğer React ekrana bir DOM elemanı yazdırdığında veya ekrandan kaldırdığında bir kod çalıştırmak istiyorsanız, `useRef` yerine [callback ref](/docs/hooks-faq.html#how-can-i-measure-a-dom-node) kullanmak isteyebilirsiniz.


### `useImperativeHandle` {#useimperativehandle}

```js
useImperativeHandle(ref, createHandle, [deps])
```

`useImperativeHandle`, `ref` kullanırken üst bileşene açılan bileşenin instance değerini özelleştirmeye yarar. Her zaman olduğu gibi, ref'leri kullanan imperative koddan birçok durumda kaçınılmalıdır. `useImperativeHandle`, [`forwardRef`](/docs/react-api.html#reactforwardref) ile birlikte kullanılmalıdır: 

```js
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

Bu örnekte, `<FancyInput ref={inputRef} />` elementini ekrana yazdıran üst bileşen `inputRef.current.focus()` fonksiyonunu çağırabilecektir.

### `useLayoutEffect` {#uselayouteffect}

Kullanım şekl `useEffect` ile eşdeğerdir, ancak tüm DOM değişiklikleri ile senkronize olarak çalıştırılır. Bu hook'u DOM'daki tasarımı okuyup senkronize olarak yeniden ekrana yazdırmak için kullanın. `useLayoutEffect` içinde planlanan değişiklikler, tarayıcı daha çizim yapmaya fırsat bulamadan, senkronize olarak temizlenecektir.

Görüntüdeki güncellemeleri geciktirmekten kaçınmak için, mümkün olduğunda standart `useEffect` kullanımını tercih edin.

>İpucu
>
>Kodunuzu class bileşenlerden fonksiyonel bileşenlere taşıyorsanız, `useLayoutEffect`'in `componentDidMount` ve `componentDidUpdate` ile aynı aşamada çalıştırıldığını unutmayın. Ancak, **biz `useEffect` ile başlamanızı** ve yine de problem yaşarsanız `useLayoutEffect`'i denemenizi tavsiye ediyoruz. 
>
>Server rendering kullanıyorsanız, unutmayın ki ne `useLayoutEffect` ne de `useEffect` JavaScript indirilmeden çalıştırılamaz. Bu yüzden React, server-rendered bir bileşen `useLayoutEffect` kullanıldığında uyarı verir. Bunu düzeltmek için, ya bu kısımdaki kodu `useEffect` içine taşıyın (eğer ilk render için gerekli değilse), ya da bu bileşenin gösterilmesini istemci ekrana yazdırana kadar geciktirin (eğer HTML `useLayoutEffect` çalışana kadar bozuk görünüyorsa).
>
>Serverda render edilen HTML'den layout efektlerine ihtiyacı olan bir bileşeni hariç tutmak için,  `showChild && <Child />` şeklinde koşullu olarak ekrana yazdırın ve görüntülenmesini `useEffect(() => { setShowChild(true); }, [])` ile geciktirin. Bu sayede arayüz, hydration işleminden önce bozuk görünmeyecektir.

### `useDebugValue` {#usedebugvalue}

```js
useDebugValue(value)
```

`useDebugValue` custom hook'lar için React DevTools içinde bir etiket göstermek için kullanılabilir.

Örneğin, ["Building Your Own Hooks"](/docs/hooks-custom.html) sayfasındaki `useFriendStatus` hook'unu düşünün:

```js{6-8}
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // DevTools içinde bu hook yanında etiket göster
  // Örnek: "FriendStatus: Online"
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

>İpucu
>
>Her özel hook'a debug değeri eklemenizi önermiyoruz. Bu hook, paylaşılan kütüphanelerin bir parçası olan custom hook'lar için en çok değere sahiptir.

#### Debug değerlerini biçimlendirmeyi geciktirin {#defer-formatting-debug-values}

Bazı durumlarda bir değeri ekran için biçimlendirmek ağır bir işlem olabilir. Ayrıca bu işlem, Hook denetlenmeyecekse gereksizdir.

Bu sebepten dolayı `useDebugValue` opsiyonel olarak bir biçimlendirme fonksiyonunu ikinci parametre olarak alır. Bu fonksiyon yalnızca Hook denetlendiğinde çalıştırılır. Debug değerini parametre olarak alır ve biçimlendirilmiş değeri döndürür.

Örneğin bir `Date` değeri döndüren bir custom hook `toDateString` fonksiyonunu, aşağıdaki biçimlendirici fonksiyonu girerek gereksizce çağırmaktan kaçınabilir:

```js
useDebugValue(date, date => date.toDateString());
```

### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value);
```

`useDeferredValue` accepts a value and returns a new copy of the value that will defer to more urgent updates. If the current render is the result of an urgent update, like user input, React will return the previous value and then render the new value after the urgent render has completed.

This hook is similar to user-space hooks which use debouncing or throttling to defer updates. The benefits to using `useDeferredValue` is that React will work on the update as soon as other work finishes (instead of waiting for an arbitrary amount of time), and like [`startTransition`](/docs/react-api.html#starttransition), deferred values can suspend without triggering an unexpected fallback for existing content.

#### Memoizing deferred children {#memoizing-deferred-children}
`useDeferredValue` only defers the value that you pass to it. If you want to prevent a child component from re-rendering during an urgent update, you must also memoize that component with [`React.memo`](/docs/react-api.html#reactmemo) or [`React.useMemo`](/docs/hooks-reference.html#usememo):

```js
function Typeahead() {
  const query = useSearchQuery('');
  const deferredQuery = useDeferredValue(query);

  // Memoizing tells React to only re-render when deferredQuery changes,
  // not when query changes.
  const suggestions = useMemo(() =>
    <SearchSuggestions query={deferredQuery} />,
    [deferredQuery]
  );

  return (
    <>
      <SearchInput query={query} />
      <Suspense fallback="Loading results...">
        {suggestions}
      </Suspense>
    </>
  );
}
```

Memoizing the children tells React that it only needs to re-render them when `deferredQuery` changes and not when `query` changes. This caveat is not unique to `useDeferredValue`, and it's the same pattern you would use with similar hooks that use debouncing or throttling.

### `useTransition` {#usetransition}

```js
const [isPending, startTransition] = useTransition();
```

Returns a stateful value for the pending state of the transition, and a function to start it.

`startTransition` lets you mark updates in the provided callback as transitions:

```js
startTransition(() => {
  setCount(count + 1);
})
```

`isPending` indicates when a transition is active to show a pending state:

```js
function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    })
  }

  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
```

> Note:
>
> Updates in a transition yield to more urgent updates such as clicks.
>
> Updates in a transitions will not show a fallback for re-suspended content. This allows the user to continue interacting with the current content while rendering the update.

### `useId` {#useid}

```js
const id = useId();
```

`useId` is a hook for generating unique IDs that are stable across the server and client, while avoiding hydration mismatches.

For a basic example, pass the `id` directly to the elements that need it:

```js
function Checkbox() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Do you like React?</label>
      <input id={id} type="checkbox" name="react"/>
    </>
  );
};
```

For multiple IDs in the same component, append a suffix using the same `id`:

```js
function NameFields() {
  const id = useId();
  return (
    <div>
      <label htmlFor={id + '-firstName'}>First Name</label>
      <div>
        <input id={id + '-firstName'} type="text" />
      </div>
      <label htmlFor={id + '-lastName'}>Last Name</label>
      <div>
        <input id={id + '-lastName'} type="text" />
      </div>
    </div>
  );
}
```

> Note:
> 
> `useId` generates a string that includes the `:` token. This helps ensure that the token is unique, but is not supported in CSS selectors or APIs like `querySelectorAll`.
> 
> `useId` supports an `identifierPrefix` to prevent collisions in multi-root apps. To configure, see the options for [`hydrateRoot`](/docs/react-dom-client.html#hydrateroot) and [`ReactDOMServer`](/docs/react-dom-server.html).

## Library Hooks {#library-hooks}

The following Hooks are provided for library authors to integrate libraries deeply into the React model, and are not typically used in application code.

### `useSyncExternalStore` {#usesyncexternalstore}

```js
const state = useSyncExternalStore(subscribe, getSnapshot[, getServerSnapshot]);
```

`useSyncExternalStore` is a hook recommended for reading and subscribing from external data sources in a way that's compatible with concurrent rendering features like selective hydration and time slicing.

This method returns the value of the store and accepts three arguments:
- `subscribe`: function to register a callback that is called whenever the store changes.
- `getSnapshot`: function that returns the current value of the store.
- `getServerSnapshot`: function that returns the snapshot used during server rendering.

The most basic example simply subscribes to the entire store:

```js
const state = useSyncExternalStore(store.subscribe, store.getSnapshot);
```

However, you can also subscribe to a specific field:

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
);
```

When server rendering, you must serialize the store value used on the server, and provide it to `useSyncExternalStore`. React will use this snapshot during hydration to prevent server mismatches:

```js
const selectedField = useSyncExternalStore(
  store.subscribe,
  () => store.getSnapshot().selectedField,
  () => INITIAL_SERVER_SNAPSHOT.selectedField,
);
```

> Note:
>
> `getSnapshot` must return a cached value. If getSnapshot is called multiple times in a row, it must return the same exact value unless there was a store update in between.
> 
> A shim is provided for supporting multiple React versions published as `use-sync-external-store/shim`. This shim will prefer `useSyncExternalStore` when available, and fallback to a user-space implementation when it's not.
> 
> As a convenience, we also provide a version of the API with automatic support for memoizing the result of getSnapshot published as `use-sync-external-store/with-selector`.

### `useInsertionEffect` {#useinsertioneffect}

```js
useInsertionEffect(didUpdate);
```

The signature is identical to `useEffect`, but it fires synchronously _before_ all DOM mutations. Use this to inject styles into the DOM before reading layout in [`useLayoutEffect`](#uselayouteffect). Since this hook is limited in scope, this hook does not have access to refs and cannot schedule updates.

> Note:
>
> `useInsertionEffect` should be limited to css-in-js library authors. Prefer [`useEffect`](#useeffect) or [`useLayoutEffect`](#uselayouteffect) instead.
