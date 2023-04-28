---
title: createContext
---

<Intro>

`createContext`, bileşenlerin sağlayabileceği veya okuyabileceği bir [context](/learn/passing-data-deeply-with-context) oluşturmanızı sağlar.

```js
const SomeContext = createContext(defaultValue)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `createContext(defaultValue)` {/*createcontext*/}

Bir context oluşturmak için bileşenlerin dışından `createContext`'i çağırın.

```js
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Parametreler {/*parameters*/}

* `defaultValue`: Context'i okuyan bileşenlerin üzerinde eşleşen bir context sağlayıcısı olmadığında contextin sahip olmasını istediğiniz değer. Anlamlı bir varsayılan değeriniz yoksa, `null` belirtin. Varsayılan değer, "son çare" olarak başvurulacak bir alternatif olarak düşünülür. Statiktir ve zamanla asla değişmez.

#### Geri Dönüş Değeri {/*returns*/}

`createContext` bir context nesnesi döndürür.

**Context nesnesinin kendisi herhangi bir bilgi içermez.** Diğer bileşenlerin _hangi_ contexti okuyacağını veya sağlayacağını temsil eder. Genellikle, context değerini belirtmek için bileşenin üstünde [SomeContext.Provider](https://react.dev/reference/react/createContext#provider) kullanır ve bileşenin altında okumak için [useContext(SomeContext)](https://react.dev/reference/react/useContext) çağırırsınız. Context nesnesinin birkaç özelliği vardır:

* `SomeContext.Provider` bilenşenlerin context değerini sağlamanıza olanak tanır.
* `SomeContext.Consumer` context değerini okumak için nadiren kullanılan alternatif bir yöntemdir.

---

### `SomeContext.Provider` {/*provider*/}

Bileşenlerinizi bir context sağlayıcısı ile sarmalayarak içindeki tüm bileşenler için bu contextin değerini belirtin:

```js
function App() {
  const [theme, setTheme] = useState('light');
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

#### Props {/*provider-props*/}

* `value`: Ne kadar derin olursa olsun, bu sağlayıcının içindeki contexti okuyan tüm bileşenlere aktarmak istediğiniz değer. Context değeri herhangi bir türde olabilir. Sağlayıcı içinde [`useContext(SomeContext)`](/reference/react/useContext) kullanan bir bileşen,
üzerindeki en içte bulunan ilgili context sağlayıcısının `value` değerini alır.

---

### `SomeContext.Consumer` {/*consumer*/}

`useContext` var olmadan önce, contexti okumak için daha eski bir yol vardı:

```js
function Button() {
  // 🟡 Eski yöntem (önerilmez)
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button className={theme} />
      )}
    </ThemeContext.Consumer>
  );
}
```

Bu eski yöntem hala çalışıyor olsa da, **yeni yazılan kodun contextini [`useContext()`](/reference/react/useContext) ile okunmak daha uygundur:**

```js
function Button() {
  // ✅ Önerilen yöntem
  const theme = useContext(ThemeContext);
  return <button className={theme} />;
}
```

#### Props {/*consumer-props*/}

* `children`: Bir fonksiyon. React, üst bileşenlerden gelen contextin güncel değerini [`useContext()`](/reference/react/useContext) ile aynı algoritmayı kullanarak belirleyecek ve bu fonksiyondan döndürdüğünüz sonucu render edecektir. Üst bileşenlerden gelen context değiştiğinde, React bu fonksiyonu tekrar çalıştırır ve UI'yi günceller.

---

## Kullanım {/*usage*/}

### Context oluşturma {/*creating-context*/}

Context, bileşenlerin [bilgiyi derinlemesine aktarmasına](/learn/passing-data-deeply-with-context) olanak tanır ve açıkça propları geçirmeden yapar.

Bir veya birden fazla context oluşturmak için bileşenlerin dışında `createContext`'i çağırın.

```js [[1, 3, "ThemeContext"], [1, 4, "AuthContext"], [3, 3, "'light'"], [3, 4, "null"]]
import { createContext } from 'react';

const ThemeContext = createContext('light');
const AuthContext = createContext(null);
```

`createContext` bir <CodeStep step={1}>context nesnesi</CodeStep> döndürür. Bileşenler okumak istediği contexti [useContext()](https://react.dev/reference/react/useContext)'e ileterek kullanabilir:

```js [[1, 2, "ThemeContext"], [1, 7, "AuthContext"]]
function Button() {
  const theme = useContext(ThemeContext);
  // ...
}

function Profile() {
  const currentUser = useContext(AuthContext);
  // ...
}
```

Varsayılan olarak, aldıkları değerler contexti oluştururken belirttiğiniz <CodeStep step={3}>varsayılan değerler</CodeStep> olacaktır. Ancak, varsayılan değerlerin hiçbiri zamanla değişmediği için bu tek başına yararlı değildir.

Context, **bileşenlerinizden diğer dinamik değerleri sağlayabileceğiniz** için kullanışlıdır:

```js {8-9,11-12}
function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Şimdi `Page` bileşeni ve içindeki herhangi bir bileşen, ne kadar derin olursa olsun, iletilen context değerlerini "görecek" ve iletilen context değerleri değişirse, React contexti okuyan bileşenleri yeniden render edecektir.

[Okuma ve sağlama contexti hakkında daha fazla bilgi edinin ve örnekleri görün.](/reference/react/useContext)

---

### Contexti bir dosyadan içe ve dışa aktarma {/*importing-and-exporting-context-from-a-file*/}


Çoğu zaman, farklı dosyalardaki bileşenlerin aynı contexte erişmesi gerekecektir. Bu nedenle, contextleri ayrı bir dosyada oluşturmak yaygındır. Ardından, diğer dosyalar için contexti kullanılabilir kılmak için [export ifadesini](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) kullanabilirsiniz:

```js {4-5}
// Contexts.js
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
````

Diğer dosyalarda tanımlanan bileşenler, bu contexti okumak veya sağlamak için [`import`](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/import) ifadesini kullanabilir:

```js {2}
// Button.js
import { ThemeContext } from './Contexts.js';

function Button() {
  const theme = useContext(ThemeContext);
  // ...
}
```

```js {2}
// App.js
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  // ...
  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

Bu, [bileşenleri içe ve dışa aktarma.](/learn/importing-and-exporting-components) işlemine benzer şekilde çalışır.

---

## Sorun Giderme {/*troubleshooting*/}

### Context değerini değiştirmenin bir yolunu bulamıyorum {/*i-cant-find-a-way-to-change-the-context-value*/}


Böyle bir kod, *varsayılan* context değerini belirtir:

```js
const ThemeContext = createContext('light');
```

Bu değer asla değişmez. React, yalnızca eşleşen bir sağlayıcı bulamazsa bu değeri bir geri dönüş olarak kullanır.

Contextin zaman içinde değişmesini sağlamak için, [state ekleyin ve bileşenleri context sağlayıcısıyla sarın.](/reference/react/useContext#updating-data-passed-via-context)

