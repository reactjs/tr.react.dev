---
title: unmountComponentAtNode
---

<Deprecated>

Bu API, React'ın gelecekteki majör sürümlerinden birinde kaldırılacaktır.

`unmountComponentAtNode` React 18 de [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount) ile değiştirildi.

</Deprecated>

<Intro>

`unmountComponentAtNode` DOM'dan monte edilmiş bir React bileşenini kaldırır.

```js
unmountComponentAtNode(domNode)
```

</Intro>

<InlineToc />

---

## Başvuru Dökümanı {/*reference*/}

### `unmountComponentAtNode(domNode)` {/*unmountcomponentatnode*/}

`unmountComponentAtNode` fonksiyonunu kullanarak, monte edilmiş bir React bileşenini DOM'dan kaldırabilir ve olay yöneticilerini ve state'i temizleyebilirsiniz.

```js
import { unmountComponentAtNode } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComponentAtNode(domNode);
```

[Aşağıda daha fazla örnek görebilirsiniz.](#usage)

#### Parametreler {/*parameters*/}

* `domNode`: Bir [DOM elemanı.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React, monte edilmiş bir React bileşenini bu elemandan kaldıracaktır.

#### Geri Dönüş Değeri {/*returns*/}

`unmountComponentAtNode`, bir bileşen kaldırıldıysa `true` döner, aksi takdirde `false` döner.

---

## Kullanım {/*usage*/}

<CodeStep step={1}>Monte edilmiş bir React bileşenini</CodeStep> bir <CodeStep step={2}>tarayıcı DOM öğesinden</CodeStep> kaldırmak ve olay yöneticilerini ile state'i temizlemek için `unmountComponentAtNode` fonksiyonunu çağırın.

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComponentAtNode(rootNode);
```

### DOM elemanından bir React uygulaması kaldırmak {/*removing-a-react-app-from-a-dom-element*/}

Bazen mevcut bir sayfaya veya tamamen React ile yazılmamış bir sayfaya React'i "serpmek" isteyebilirsiniz. Bunun gibi durumlarda, React uygulamalarını, bütün UI, state ve listener'ları render oldukları DOM öğesinden kaldırarak, React uygulamanızı "durdurmak" isteyebilirsiniz.

Bu örnekte "Render React App" butonuna basmak React uygulamasını render edecektir. Yok etmek için "Unmout React App" düğmesine tıklayabilirsiniz.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <button id='render'>Render React App</button>
    <button id='unmount'>Unmount React App</button>
    <!-- This is the React App node -->
    <div id='root'></div>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const domNode = document.getElementById('root');

document.getElementById('render').addEventListener('click', () => {
  render(<App />, domNode);
});

document.getElementById('unmount').addEventListener('click', () => {
  unmountComponentAtNode(domNode);
});
```

```js src/App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>
