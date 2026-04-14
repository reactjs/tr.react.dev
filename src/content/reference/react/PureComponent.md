---
title: PureComponent
---

<Pitfall>

Bileşenleri sınıf yerine fonksiyon olarak tanımlamanızı öneririz. [Nasıl taşınacağını görün.](#alternatives)

</Pitfall>

<Intro>

`PureComponent`, [`Component`](/reference/react/Component) ile benzerdir ancak aynı prop'lar ve state için yeniden renderlamayı atlar. Sınıf bileşenleri hâlâ React tarafından desteklenmektedir, ancak yeni kodda kullanılmasını önermiyoruz.

```js
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Başvuru Dokümanı {/*reference*/}

### `PureComponent` {/*purecomponent*/}

Aynı prop'lar ve state için bir sınıf bileşeninin yeniden renderlanmasını atlamak istiyorsanız, [`Component`](/reference/react/Component) yerine `PureComponent`'ı genişletin:

```js
import { PureComponent } from 'react';

class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

`PureComponent`, `Component`'ın bir alt sınıfıdır ve [tüm `Component` API'lerini](/reference/react/Component#reference) destekler. `PureComponent`'ı genişletmek, prop'ları ve state'i yüzeysel (shallow) olarak karşılaştıran özel bir [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) metodu tanımlamakla eşdeğerdir.

[Aşağıda daha fazla örneğe bakın.](#usage)

---

## Kullanım {/*usage*/}

### Sınıf bileşenlerinde gereksiz yeniden renderlamaları atlama {/*skipping-unnecessary-re-renders-for-class-components*/}

React normalde üst bileşen her yeniden renderlandığında alt bileşeni de yeniden renderlar. Bir optimizasyon olarak, yeni prop'ları ve state'i eski prop'lar ve state ile aynı olduğu sürece üst bileşen yeniden renderlandığında React'in yeniden renderlamayacağı bir bileşen oluşturabilirsiniz. [Sınıf bileşenleri](/reference/react/Component), `PureComponent`'ı genişleterek bu davranışı tercih edebilir:

```js {1}
class Greeting extends PureComponent {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

Bir React bileşeni her zaman [saf renderlama mantığına](/learn/keeping-components-pure) sahip olmalıdır. Bu, prop'ları, state'i ve context'i değişmediyse aynı çıktıyı döndürmesi gerektiği anlamına gelir. `PureComponent` kullanarak, React'e bileşeninizin bu gereksinime uyduğunu söylemiş olursunuz; böylece React, prop'ları ve state'i değişmediği sürece yeniden renderlama yapmak zorunda kalmaz. Ancak bileşeniniz, kullandığı bir context değişirse yine de yeniden renderlanır.

Bu örnekte, `Greeting` bileşeninin `name` değiştiğinde yeniden renderlandığına (çünkü bu, prop'larından biridir), ancak `address` değiştiğinde yeniden renderlanmadığına dikkat edin (çünkü `Greeting`'e prop olarak iletilmemektedir):

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Pitfall>

Bileşenleri sınıf yerine fonksiyon olarak tanımlamanızı öneririz. [Nasıl taşınacağını görün.](#alternatives)

</Pitfall>

---

## Alternatifler {/*alternatives*/}

### Bir `PureComponent` sınıf bileşeninden fonksiyona geçiş {/*migrating-from-a-purecomponent-class-component-to-a-function*/}

Yeni kodda [sınıf bileşenleri](/reference/react/Component) yerine fonksiyon bileşenlerini kullanmanızı öneririz. `PureComponent` kullanan mevcut sınıf bileşenleriniz varsa, bunları nasıl dönüştürebileceğiniz aşağıda açıklanmıştır. İşte orijinal kod:

<Sandpack>

```js
import { PureComponent, useState } from 'react';

class Greeting extends PureComponent {
  render() {
    console.log("Greeting was rendered at", new Date().toLocaleTimeString());
    return <h3>Hello{this.props.name && ', '}{this.props.name}!</h3>;
  }
}

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

[Bu bileşeni sınıftan fonksiyona dönüştürdüğünüzde,](/reference/react/Component#alternatives) [`memo`](/reference/react/memo) ile sarmalayın:

<Sandpack>

```js
import { memo, useState } from 'react';

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}
```

```css
label {
  display: block;
  margin-bottom: 16px;
}
```

</Sandpack>

<Note>

`PureComponent`'ın aksine, [`memo`](/reference/react/memo) eski ve yeni state'i karşılaştırmaz. Fonksiyon bileşenlerinde, [`set` fonksiyonunu](/reference/react/useState#setstate) aynı state ile çağırmak, `memo` olmadan bile [varsayılan olarak yeniden renderlamayı önler.](/reference/react/memo#updating-a-memoized-component-using-state)

</Note>
