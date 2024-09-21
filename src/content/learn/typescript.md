---
title: TypeScript'i kullanma
re: https://github.com/reactjs/react.dev/issues/5960
---

<Intro>

TypeScript, JavaScript kod tabanlarına tür tanımları eklemenin popüler bir yoludur. TypeScript,kullanıma hazır olarak [JSX'i](/learn/writing-markup-with-jsx) destekler ve projenize [`@types/react`](https://www.npmjs.com/package/@types/react) ve [`@types/react-dom`](https://www.npmjs.com/package/@types/react-dom) ekleyerek tam React Web desteği alabilirsiniz.

</Intro>

<YouWillLearn>

* [React Bileşenleri ile TypeScript](/learn/typescript#typescript-with-react-components)
* [Hooks ile Tür Belirlemenin Örnekleri](/learn/typescript#example-hooks)
* [`@types/react`dan Yaygın Türler](/learn/typescript/#useful-types)
* [ İleri Düzey Öğrenme Kaynakları](/learn/typescript/#further-learning)

</YouWillLearn>

## Kurulum {/*installation*/}

Tüm [canlı ortam düzeyinde React framework’leri](/learn/start-a-new-react-project#production-grade-react-frameworks) TypeScript kullanımı için destek sunar. Kurulum için framework’e özgü kılavuzu takip edin:

- [Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)
- [Remix](https://remix.run/docs/en/1.19.2/guides/typescript)
- [Gatsby](https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/)
- [Expo](https://docs.expo.dev/guides/typescript/)

### Mevcut Bir React Projesine TypeScript Ekleme {/*adding-typescript-to-an-existing-react-project*/}

React’in tür tanımlamalarının en son sürümünü yüklemek için:

<TerminalBlock>
npm install @types/react @types/react-dom
</TerminalBlock>

`tsconfig.json` dosyanızda aşağıdaki derleyici seçeneklerinin ayarlanması gerekir::

1. `dom`, [`lib`](https://www.typescriptlang.org/tsconfig/#lib)'e dahil edilmelidir  (Not: Eğer `lib` seçeneği belirtilmemişse, `dom` varsayılan olarak dahil edilir).
1. [`jsx`](https://www.typescriptlang.org/tsconfig/#jsx) geçerli seçeneklerden birine ayarlanmalıdır. Çoğu uygulama için  `preserve` yeterli olacaktır.
Eğer bir kütüphane yayımlıyorsanız, hangi değeri seçeceğiniz konusunda
  If you're publishing a library, consult the [`jsx` documentation](https://www.typescriptlang.org/tsconfig/#jsx) başvurun.

## React Bileşenleri ile TypeScript {/*typescript-with-react-components*/}

<Note>

JSX içeren her dosya `tsx` dosya uzantısını kullanmalıdır. Bu, TypeScript’e bu dosyanın JSX içerdiğini belirten TypeScript’e özel bir uzantıdır.

</Note>

React ile TypeScript yazmak, React ile JavaScript yazmaya çok benzer. Bir bileşenle çalışırken ana fark, bileşenin props’ları için türler sağlayabilmenizdir. Bu türler, doğruluk kontrolü yapmak ve editörlerde yerinde dokümantasyon sağlamak için kullanılabilir

[Hızlı Başlangıç](/learn) kılavuzundan [`MyButton` bileşenini](/learn#components) alarak, butonun `title`’ını tanımlayan bir tür ekleyebiliriz:

<Sandpack>

```tsx src/App.tsx active
function MyButton({ title }: { title: string }) {
  return (
    <button>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Uygulamama hoş geldiniz</h1>
      <MyButton title="Ben bir butonum" />
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```
</Sandpack>

 <Note>

Bu sandboxes TypeScript kodunu çalıştırabilir, ancak tür denetleyicisini çalıştırmaz. Bu, TypeScript sandboxes öğrenmek için değiştirebileceğiniz, ancak tür hataları veya uyarıları almayacağınız anlamına gelir. Tür denetimi almak için [TypeScript Playground](https://www.typescriptlang.org/play) kullanabilir veya daha tam özellikli bir çevrimiçi sandbox kullanabilirsiniz.

</Note>

Bu yerinde sözdizimi, bir bileşen için türler sağlamanın en basit yoludur; ancak birkaç alan tanımlamaya başladığınızda karmaşık hale gelebilir. Bunun yerine, bileşenin props’larını tanımlamak için bir `interface` veya `type` kullanabilirsiniz:

<Sandpack>

```tsx src/App.tsx active
interface MyButtonProps {
  /** Butonun içinde görüntülenecek metin */
  title: string;
  /** Butonun etkileşime girilip girilemeyeceği */
  disabled: boolean;
}

function MyButton({ title, disabled }: MyButtonProps) {
  return (
    <button disabled={disabled}>{title}</button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Uygulamama hoş geldiniz</h1>
      <MyButton title="Ben devre dışı bırakılmış bir butonum" disabled={true}/>
    </div>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Bileşeninizin props’larını tanımlayan tür, ihtiyaç duyduğunuz kadar basit veya karmaşık olabilir; ancak bunlar ya `type` ya da `interface` ile tanımlanmış bir nesne türü olmalıdır. TypeScript’in nesneleri nasıl tanımladığını [Nesne Türleri](https://www.typescriptlang.org/docs/handbook/2/objects.html) bölümünde öğrenebilirsiniz, ayrıca birkaç farklı türden birini alabilen bir prop tanımlamak için [Birleşim Türleri](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types) kullanmayı ve daha karmaşık kullanım senaryoları için [Türlerden Türler Oluşturma](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html) kılavuzunu incelemeyi de düşünebilirsiniz.

## Örnek Hooklar {/*example-hooks*/}

`@types/react`'den gelen tür tanımlamaları, yerleşik Hooks için türleri içerir, böylece bileşenlerinizde ek bir ayar yapmadan kullanabilirsiniz. Bu türler, bileşeninizde yazdığınız kodu dikkate alacak şekilde tasarlanmıştır, bu nedenle çoğu zaman [çıkarılan türler](https://www.typescriptlang.org/docs/handbook/type-inference.html)alırsınız ve ideal olarak türleri sağlama detaylarıyla ilgilenmeniz gerekmez.

Ancak,Hooklar için tipleri nasıl sağlayacağımıza dair birkaç örneğe bakabiliriz.

### `useState` {/*typing-usestate*/}

[`useState` Hook'u](/reference/react/useState)değerinin tipini belirlemek için başlangıç durumu olarak geçirilen değeri yeniden kullanacaktır. Örneğin:

```ts
// Infer the type as "boolean"
const [enabled, setEnabled] = useState(false);
```

Bu, `enabled` değişkenine `boolean` tipini atayacak ve `setEnabled` fonksiyonu ya bir `boolean` argümanı ya da bir boolean döndüren bir fonksiyon alacaktır. Eğer duruma açıkça bir tip sağlamak istiyorsanız, bunu useState çağrısına bir tip argümanı vererek yapabilirsiniz:

```ts 
// Tipi açıkça "boolean" olarak ayarlayın
const [enabled, setEnabled] = useState<boolean>(false);
```

Bu durumda çok faydalı değil, ancak bir tip sağlamanız gereken yaygın bir durum, bir birleşim tipiyle karşılaştığınızda ortaya çıkar. Örneğin, burada `status` birkaç farklı string değerinden biri olabilir

```ts
type Status = "idle" | "loading" | "success" | "error";

const [status, setStatus] = useState<Status>("idle");
```

Ya da, [Durum yapılandırma ilkeleri](/learn/choosing-the-state-structure#principles-for-structuring-state) bölümünde önerildiği gibi, ilgili durumu bir nesne olarak gruplandırabilir ve farklı olasılıkları nesne tipleri aracılığıyla tanımlayabilirsiniz:

```ts
type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success', data: any }
  | { status: 'error', error: Error };

const [requestState, setRequestState] = useState<RequestState>({ status: 'idle' });
```

### `useReducer` {/*typing-usereducer*/}

[`useReducer` Hook'u](/reference/react/useReducer), bir azaltıcı fonksiyon ve bir başlangıç durumu alan daha karmaşık bir Hook’tur. Azaltıcı fonksiyonun tipleri, başlangıç durumundan çıkarılır. `useReducer` çağrısına bir tip argümanı sağlayarak duruma bir tip verebilirsiniz, ancak genellikle tipi başlangıç durumuna ayarlamak daha iyidir:

<Sandpack>

```tsx src/App.tsx active
import {useReducer} from 'react';

interface State {
   count: number 
};

type CounterAction =
  | { type: "reset" }
  | { type: "setCount"; value: State["count"] }

const initialState: State = { count: 0 };

function stateReducer(state: State, action: CounterAction): State {
  switch (action.type) {
    case "reset":
      return initialState;
    case "setCount":
      return { ...state, count: action.value };
    default:
      throw new Error("Unknown action");
  }
}

export default function App() {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  const addFive = () => dispatch({ type: "setCount", value: state.count + 5 });
  const reset = () => dispatch({ type: "reset" });

  return (
    <div>
      <h1>Sayacıma hoş geldiniz</h1>

      <p>Sayaç: {state.count}</p>
      <button onClick={addFive}>5 Ekle</button>
      <button onClick={reset}>Sıfırla</button>
    </div>
  );
}

```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

TypeScript’i birkaç önemli yerde kullanıyoruz:

 - `interface State` reducer’ın durumunun yapısını tanımlar.
 - `type CounterAction` reducer’a gönderilebilecek farklı eylemleri tanımlar.
 - `const initialState: State` başlangıç durumu için bir tür sağlar ve ayrıca varsayılan olarak  `useReducer` tarafından kullanılan türdür.
 - `stateReducer(state: State, action: CounterAction): State` reducer fonksiyonunun argümanları ve dönüş değeri için türleri belirler.

`initialState`’e tür ayarlamanın daha açık bir alternatifi, `useReducer`’a bir tür argümanı sağlamaktır:
```ts
import { stateReducer, State } from './your-reducer-implementation';

const initialState = { count: 0 };

export default function App() {
  const [state, dispatch] = useReducer<State>(stateReducer, initialState);
}
```

### `useContext` {/*typing-usecontext*/}

[`useContext` Hook'u](/reference/react/useContext)verileri bileşen ağacında aşağıya doğru geçirebilmenin bir tekniğidir ve bu işlem için bileşenler üzerinden props geçirmeye gerek kalmaz. Bir sağlayıcı bileşeni oluşturarak ve genellikle bir alt bileşende değeri tüketmek için bir Hook oluşturarak kullanılır.

Context tarafından sağlanan değerin türü,  `createContext` çağrısına geçirilen değerden çıkarılır:

<Sandpack>

```tsx src/App.tsx active
import { createContext, useContext, useState } from 'react';

type Theme = "light" | "dark" | "system";
const ThemeContext = createContext<Theme>("system");

const useGetTheme = () => useContext(ThemeContext);

export default function MyApp() {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={theme}>
      <MyComponent />
    </ThemeContext.Provider>
  )
}

function MyComponent() {
  const theme = useGetTheme();

  return (
    <div>
      <p>Güncel tema: {theme}</p>
    </div>
  )
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

Bu teknik, anlamlı bir varsayılan değeriniz olduğunda işe yarar; ancak bazen varsayılan değeriniz olmadığında `null` mantıklı gelebilir. Ancak, tür sisteminin kodunuzu anlaması için, `createContext` üzerinde açıkça `ContextShape | null` ayarlamanız gerekir.

Bu, bağlam tüketicileri için türde `| null`u ortadan kaldırmanız gerektiği sorununu doğurur. Önerimiz, Hook’un varlığını çalışma zamanında kontrol etmesi ve mevcut değilse bir hata fırlatmasıdır:

```js {5, 16-20}
import { createContext, useContext, useState, useMemo } from 'react';

// Bu daha basit bir örnek, ama burada daha karmaşık bir nesne hayal edebilirsiniz.
type ComplexObject = {
  kind: string
};

// Context, varsayılan değeri doğru bir şekilde yansıtmak için türde `| null` ile oluşturulmuştur.
const Context = createContext<ComplexObject | null>(null);

// `| null` Hook’taki kontrol aracılığıyla kaldırılacaktır.
const useGetComplexObject = () => {
  const object = useContext(Context);
  if (!object) { throw new Error("useGetComplexObject must be used within a Provider") }
  return object;
}

export default function MyApp() {
  const object = useMemo(() => ({ kind: "complex" }), []);

  return (
    <Context.Provider value={object}>
      <MyComponent />
    </Context.Provider>
  )
}

function MyComponent() {
  const object = useGetComplexObject();

  return (
    <div>
      <p>Mevcut nesne: {object.kind}</p>
    </div>
  )
}
```

### `useMemo` {/*typing-usememo*/}

[`useMemo`](/reference/react/useMemo) Hook’u, bir fonksiyon çağrısından hafızada tutulan bir değeri oluşturur veya yeniden erişir ve yalnızca ikinci parametre olarak geçirilen bağımlılıklar değiştiğinde fonksiyonu tekrar çalıştırır. Hook’un çağrılmasının sonucu, ilk parametredeki fonksiyondan dönen değerden çıkarılır. Hook’a bir tür argümanı sağlayarak daha açık olabilirsiniz.
```ts
// visibleTodos’un türü, filterTodos’un dönen değerinden çıkarılır.
const visibleTodos = useMemo(() => filterTodos(todos, tab), [todos, tab]);
```

### `useCallback` {/*typing-usecallback*/}

[`useCallback`](/reference/react/useCallback) ikinci parametre olarak geçirilen bağımlılıklar aynı olduğu sürece bir fonksiyona kararlı bir referans sağlar. `useMemo` gibi, fonksiyonun türü ilk parametredeki fonksiyondan dönen değerden çıkarılır ve Hook’a bir tür argümanı sağlayarak daha açık olabilirsiniz.

```ts
const handleClick = useCallback(() => {
  // ...
}, [todos]);
```

TypeScript strict modunda çalışırken, `useCallback` kullanırken geri çağırma fonksiyonunuzun parametreleri için tür eklemeniz gerekir. Bunun nedeni, geri çağırma fonksiyonunun türünün dönen değerden çıkarılmasıdır ve parametreler olmadan tür tam olarak anlaşılamaz.

Kod stili tercihlerine bağlı olarak, geri çağırmayı tanımlarken aynı anda olay işleyici için tür sağlamak amacıyla React türlerinden `*EventHandler` fonksiyonlarını kullanabilirsiniz:

```ts
import { useState, useCallback } from 'react';

export default function Form() {
  const [value, setValue] = useState("Change me");

  const handleChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((event) => {
    setValue(event.currentTarget.value);
  }, [setValue])
  
  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </>
  );
}
```

## Kullanışlı Türler {/*useful-types*/}

`@types/react` paketinden gelen oldukça geniş bir tür seti vardır ve React ile TypeScript’in nasıl etkileşime girdiğini anladığınızda incelemeye değer. Bunları [DefinitelyTyped’teki React klasöründe](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react/index.d.ts). bulabilirsiniz. Burada daha yaygın kullanılan birkaç türü ele alacağız.

### DOM Olayları {/*typing-dom-events*/}

React’te DOM olaylarıyla çalışırken, olayın türü genellikle olay işleyicisinden çıkarılabilir. Ancak, bir fonksiyonu olay işleyicisine geçirmek üzere ayırmak istediğinizde, olayın türünü açıkça belirtmeniz gerekir.

<Sandpack>

```tsx src/App.tsx active
import { useState } from 'react';

export default function Form() {
  const [value, setValue] = useState("Beni değiştir");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value);
  }

  return (
    <>
      <input value={value} onChange={handleChange} />
      <p>Değer: {value}</p>
    </>
  );
}
```

```js src/App.js hidden
import AppTSX from "./App.tsx";
export default App = AppTSX;
```

</Sandpack>

React türlerinde birçok olay türü sağlanmıştır - tam listeye [buradan](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/b580df54c0819ec9df62b0835a315dd48b8594a9/types/react/index.d.ts#L1247C1-L1373) ulaşabilirsiniz. Bu liste, [DOM’daki en popüler olaylara](https://developer.mozilla.org/en-US/docs/Web/Events).

Kullandığınız olay işleyici için türü belirlerken, ilk olarak olay işleyicinin üzerine geldiğinizde görünen bilgiye bakabilirsiniz; bu, olayın türünü gösterecektir.

Bu listede yer almayan bir olayı kullanmanız gerekirse, tüm olaylar için temel tür olan `React.SyntheticEvent` türünü kullanabilirsiniz.

### Children {/*typing-children*/}

Bir bileşenin children prop’unu tanımlamak için iki yaygın yol vardır. İlki, JSX içinde children olarak geçebilecek tüm olası türlerin birleşimi olan `React.ReactNode` türünü kullanmaktır:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactNode;
}
```

Bu, children için oldukça geniş bir tanımdır. İkinci yol ise, sadece JSX öğelerini ve JavaScript ilkel türleri (string veya number gibi) içermeyen `React.ReactElement` türünü kullanmaktır:

```ts
interface ModalRendererProps {
  title: string;
  children: React.ReactElement;
}
```

Dikkat edilmesi gereken bir nokta, TypeScript’i kullanarak children’ın belirli bir türdeki JSX öğeleri olduğunu tanımlayamayacağınızdır; bu nedenle yalnızca `<li>` children’ları kabul eden bir bileşeni tanımlamak için tür sistemini kullanamazsınız.

`React.ReactNode` ve `React.ReactElement` örneklerini tür denetleyicisi ile birlikte `bu TypeScript playground`(https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgIilQ3wChSB6CxYmAOmXRgDkIATJOdNJMGAZzgwAFpxAR+8YADswAVwGkZMJFEzpOjDKw4AFHGEEBvUnDhphwADZsi0gFw0mDWjqQBuUgF9yaCNMlENzgAXjgACjADfkctFnYkfQhDAEpQgD44AB42YAA3dKMo5P46C2tbJGkvLIpcgt9-QLi3AEEwMFCItJDMrPTTbIQ3dKywdIB5aU4kKyQQKpha8drhhIGzLLWODbNs3b3s8YAxKBQAcwXpAThMaGWDvbH0gFloGbmrgQfBzYpd1YjQZbEYARkB6zMwO2SHSAAlZlYIBCdtCRkZpHIrFYahQYQD8UYYFA5EhcfjyGYqHAXnJAsIUHlOOUbHYhMIIHJzsI0Qk4P9SLUBuRqXEXEwAKKfRZcNA8PiCfxWACecAAUgBlAAacFm80W-CU11U6h4TgwUv11yShjgJjMLMqDnN9Dilq+nh8pD8AXgCHdMrCkWisVoAet0R6fXqhWKhjKllZVVxMcavpd4Zg7U6Qaj+2hmdG4zeRF10uu-Aeq0LBfLMEe-V+T2L7zLVu+FBWLdLeq+lc7DYFf39deFVOotMCACNOCh1dq219a+30uC8YWoZsRyuEdjkevR8uvoVMdjyTWt4WiSSydXD4NqZP4AymeZE072ZzuUeZQKheQgA)’ında görebilirsiniz..

### Stil Propları {/*typing-style-props*/}

React’ta inline stiller kullanırken, `style` prop’una geçirilen nesneyi tanımlamak için `React.CSSProperties` kullanabilirsiniz. Bu tür, tüm olası CSS özelliklerinin birleşimidir ve `style` prop’una geçerli CSS özellikleri sağladığınızdan emin olmak ve düzenleyicinizde otomatik tamamlama almak için iyi bir yoldur.

```ts
interface MyComponentProps {
  style: React.CSSProperties;
}
```

## Daha Fazla Öğrenme {/*further-learning*/}

Bu rehber, TypeScript’i React ile kullanmanın temellerini kapsadı, ancak öğrenilecek daha çok şey var. Dokümanlardaki bireysel API sayfaları, TypeScript ile nasıl kullanılacağına dair daha derinlemesine belgeler içerebilir.

Aşağıdaki kaynakları öneriyoruz:

 - [TypeScript el kitabu](https://www.typescriptlang.org/docs/handbook/) TypeScript için resmi belgelerdir ve çoğu ana dil özelliğini kapsar.

 - [TypeScript sürüm notları](https://devblogs.microsoft.com/typescript/) yeni özellikleri derinlemesine ele alır.

 - [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) TypeScript ile React kullanımı için topluluk tarafından sürdürülen bir kılavuzdur; birçok faydalı kenar durumu kapsar ve bu belgeden daha geniş bir kapsam sunar.

 - [TypeScript Topluluk Discord’u](https://discord.com/invite/typescript) TypeScript ve React ile ilgili sorunlar için sorular sorabileceğiniz ve yardım alabileceğiniz harika bir yerdir.


