---
title: useId
---

<Intro>

`useId`, erişilebilirlik özniteliklerine iletmek üzere benzersiz kimlikler üreten React Hook'udur.

```js
const id = useId()
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `useId()` {/*useid*/}

Benzersiz bir kimlik oluşturmak için `useId`'yi bileşeninizin en üst kapsamında çağırın:

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

[Daha fazla örnek için aşağıya bakın.](#usage)

#### Parametreler {/*parameters*/}

Herhangi bir parametre almaz.

#### Dönüş değerleri {/*returns*/}

Çağrıldığı bileşene özel olarak her bir `useId` çağrısı için _karakter dizisi (string)_ tipinde benzersiz kimlik döner.

#### Uyarılar {/*caveats*/}

* `useId` bir Hook olduğundan, yalnızca **bileşeninizin en üst kapsamında** ya da kendi Hook'larınızda çağırabilirsiniz. Döngülerin ve koşulların içinde çağıramazsınız. Eğer çağırmak zorunda kaldıysanız yeni bir bileşene çıkarın ve state'i ona taşıyın.

* Liste elemanlarına **anahtar üretmek için kullanılmamalıdır**. [Anahtarlar elinizdeki veriden üretilmelidir.](/learn/rendering-lists#where-to-get-your-key)

---

## Kullanım {/*usage*/}

<Pitfall>

**Anahtar üretmek için `useId` kullanmayın**. [Anahtarlar elinizdeki veriden üretilmelidir.](/learn/rendering-lists#where-to-get-your-key)

</Pitfall>

### Erişilebilirlik öznitelikleri için benzersiz kimlikler üretmek {/*generating-unique-ids-for-accessibility-attributes*/}

Benzersiz kimlikler üretmek için bileşeninizin en üst kapsamında `useId`'yi çağırın:

```js [[1, 4, "passwordHintId"]]
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  // ...
```

Daha sonra <CodeStep step={1}>oluşturulan kimliği</CodeStep> farklı özniteliklere iletebilirsiniz:

```js [[1, 2, "passwordHintId"], [1, 3, "passwordHintId"]]
<>
  <input type="password" aria-describedby={passwordHintId} />
  <p id={passwordHintId}>
</>
```

**Bunun ne zaman faydalı olabileceğini görmek için bir örnek üzerinden ilerleyelim.**

[`aria-describedby`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby) gibi [HTML erişilebilirlik öznitelikleri](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA), iki etiketin birbirine bağlı olduğunu belirtmenizi sağlar. Örneğin, bir elementin (mesela `<input>`) başka bir element (mesela `<p>`) tarafından tanımlandığını belirtebilirsiniz.

Saf HTML'de bunu şu şekilde yazarsınız:

```html {5,8}
<label>
  Şifre:
  <input
    type="password"
    aria-describedby="password-hint"
  />
</label>
<p id="password-hint">
  Şifre en az 18 karakter içermelidir
</p>
```

Ancak, doğrudan koda yazılan kimlikler React'ta iyi bir pratik değildir. Bir bileşen sayfada birden fazla kez render edilebilir--ancak kimlikler benzersiz olmalıdır! Bunun yerine `useId` ile benzersiz bir kimlik oluşturun:

```js {4,11,14}
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Şifre:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Şifre en az 18 karakter içermelidir
      </p>
    </>
  );
}
```

Artık `PasswordField` ekranda birden fazla kez görünse bile üretilen kimlikler çakışmaz.

<Sandpack>

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  return (
    <>
      <label>
        Şifre:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Şifre en az 18 karakter içermelidir
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Şifreni seç</h2>
      <PasswordField />
      <h2>Şifreni doğrula</h2>
      <PasswordField />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Yardımcı teknolojiler ile edinilen kullanıcı deneyiminde yarattığı farkı görmek için [bu videoyu izleyin](https://www.youtube.com/watch?v=0dNzNcuEuOo).

<Pitfall>

[Sunucu taraflı render](/reference/react-dom/server) ile birlikte kullanılan **`useId`, sunucu ve istemci tarafında özdeş bileşen ağacına gereksinim duyar**. Sunucu ve istemcide render edilen ağaçlar birebir eşleşmezse, oluşan kimlikler de eşleşmeyecektir.

</Pitfall>

<DeepDive>

#### Neden useId kullanmak artan bir sayaca nazaran daha iyidir? {/*why-is-useid-better-than-an-incrementing-counter*/}

`useId`'nin `nextId++` gibi global bir değişkeni arttırmaktan neden daha iyi olduğunu merak ediyor olabilirsiniz.

Temel avantajı, React'ın [sunucu taraflı render](/reference/react-dom/server) ile çalışacağını garanti etmesidir. Bileşenleriniz sunucu taraflı render ensasında HTML çıktısı üretir. Ardından istemcide, üretilen HTML'e [hidratlama](/reference/react-dom/client/hydrateRoot) (hydration) sırasında olay yöneticileri eklenir. Hidratlamanın çalışması için, istemci çıktısının sunucu HTML'iyle eşleşmesi gerekir.

Artan sayaç kullanarak bunu garanti etmek çok zordur. İstemci bileşenlerinin hidratlanma sırası ile sunucu HTML'inin tarayıcıya gönderilme sırası eşleşmeyebilir. `useId`'yi çağırmak; hidratlamanın çalışacağından, sunucu ve istemci arasındaki çıktının özdeş olacağından emin olmanızı sağlar.

React'ta `useId`'nin değeri, çağrıldığı bileşenin ağaç içindeki hiyerarşik yolundan (parent path) üretilir. Dolayısıyla sunucu ve istemci ağaçları aynıysa, ürettikleri değerler render sırasına bakılmaksızın eşleşecektir.

</DeepDive>

---

### Birkaç ilişkili element için kimlik üretmek {/*generating-ids-for-several-related-elements*/}

Bir takım ilişkili elemente kimlik vermeniz gerekiyorsa, `useId`'yi çağırarak ürettiğiniz kimliği sonekler ile özelleştirebilirsiniz:

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const id = useId();
  return (
    <form>
      <label htmlFor={id + '-firstName'}>İsim:</label>
      <input id={id + '-firstName'} type="text" />
      <hr />
      <label htmlFor={id + '-lastName'}>Soyisim:</label>
      <input id={id + '-lastName'} type="text" />
    </form>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

Bu kullanım, benzersiz kimliğe ihtiyaç duyan her bir element için `useId`'yi çağırmaktan kaçınmanızı sağlar.

---

### Üretilen tüm kimlikler için önek belirlemek {/*specifying-a-shared-prefix-for-all-generated-ids*/}


Tek bir sayfada birden fazla bağımsız React uygulaması render ederseniz, [`createRoot`](/reference/react-dom/client/createRoot#parameters) veya [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) metodlarına iletebileceğiniz `identifierPrefix` parametresini kullanın. Bu sayede `useId` ile oluşturulan her bir kimlik benzersiz bir önek ile başlayacağından, iki farklı uygulama tarafından oluşturulan kimlikler asla çakışmaz.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <div id="root1"></div>
    <div id="root2"></div>
  </body>
</html>
```

```js
import { useId } from 'react';

function PasswordField() {
  const passwordHintId = useId();
  console.log('Generated identifier:', passwordHintId)
  return (
    <>
      <label>
        Şifre:
        <input
          type="password"
          aria-describedby={passwordHintId}
        />
      </label>
      <p id={passwordHintId}>
        Şifre en az 18 karakter içermelidir
      </p>
    </>
  );
}

export default function App() {
  return (
    <>
      <h2>Şifreni seç</h2>
      <PasswordField />
    </>
  );
}
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root1 = createRoot(document.getElementById('root1'), {
  identifierPrefix: 'my-first-app-'
});
root1.render(<App />);

const root2 = createRoot(document.getElementById('root2'), {
  identifierPrefix: 'my-second-app-'
});
root2.render(<App />);
```

```css
#root1 {
  border: 5px solid blue;
  padding: 10px;
  margin: 5px;
}

#root2 {
  border: 5px solid green;
  padding: 10px;
  margin: 5px;
}

input { margin: 5px; }
```

</Sandpack>

