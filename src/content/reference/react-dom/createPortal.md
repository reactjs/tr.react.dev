---
title: createPortal
---

<Intro>

`createPortal` bazı alt elemanları DOM'un farklı bir bölümünde render etmenize olanak tanır.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

Bir portal oluşturmak için, biraz JSX ve render edilmesi gereken DOM düğümünü ileterek `createPortal`'ı çağırın:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>
```

[Aşağıda daha fazla örnek görebilirsiniz.](#usage)

Bir portal yalnızca DOM düğümünün fiziksel yerleşimini değiştirir. Diğer her şekilde, bir portala render ettiğiniz JSX, onu render eden React bileşeninin alt düğümü gibi davranır. Örneğin, alt eleman üst ağaç tarafından sağlanan context'e erişebilir ve olaylar React ağacına göre alt elemanlardan üst elemanlara doğru ilerler.

#### Parametreler {/*parameters*/}

* `children`: Bir JSX parçası gibi React ile render edilebilen herhangi bir şey (örneğin `<div />` ya da `<HerhangiBileşen />`), bir [Fragment](/reference/react/Fragment) (`<>...</>`), bir string ya da bir sayı, veya bunlardan oluşan bir dizi.

* `domNode`: `document.getElementById()` tarafından döndürülen bir DOM düğümü. Düğüm halihazırda mevcut olmalıdır. Güncelleme sırasında farklı bir DOM düğümünün parametre olarak geçilmesi portal içeriğinin yeniden oluşturulmasına neden olacaktır.

* **opsiyonel** `key`: Portalın [anahtarı](/learn/rendering-lists/#keeping-list-items-in-order-with-key) olarak kullanılacak benzersiz bir string veya sayı. 

#### Dönüş değeri {/*returns*/}

`createPortal` JSX'e dahil edilebilen veya bir React bileşeninden döndürülebilen bir React düğümü döndürür. React render çıktısında bununla karşılaşırsa, sağlanan `children`'ı sağlanan `domNode`'un içine yerleştirecektir.

#### Uyarılar {/*caveats*/}

* Portallardan gelen olaylar DOM ağacı yerine React ağacına göre yayılır. Örneğin, bir portalın içine tıklarsanız ve portal `<div onClick>` içine sarılırsa, bu `onClick` yöneticisi tetiklenecektir. Bu sorunlara neden oluyorsa, ya portalın içinden olay yayılımını durdurunuz ya da portalın kendisini React ağacında yukarı taşıyınız.

---

## Kullanım {/*usage*/}

### DOM'un farklı bir bölümüne render etme {/*rendering-to-a-different-part-of-the-dom*/}

*Portallar* bileşenlerinizin bazı alt elemanlarını DOM'da farklı bir yerde render etmenize izin verir. Bu, bileşeninizin bir parçasının içinde bulunduğu konteynerlerden "kaçmasını" sağlar. Örneğin, bir bileşen, sayfanın geri kalanının üstünde ve dışında görünen bir modal iletişim kutusu veya bir araç ipucu görüntüleyebilir.

Bir portal oluşturmak için, `createPortal` sonucunu <CodeStep step={1}>biraz JSX</CodeStep> ve <CodeStep step={2}>gitmesi gereken DOM düğümü</CodeStep> ile render ediniz:

```js [[1, 8, "<p>This child is placed in the document body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

React, <CodeStep step={1}>sağladığınız JSX</CodeStep> için DOM düğümlerini <CodeStep step={2}>sağladığınız DOM düğümünün</CodeStep> içine yerleştirecektir.

Portal olmasaydı, ikinci `<p>` ana `<div>` içine yerleştirilirdi, ancak portal onu [`document.body`](https://developer.mozilla.org/en-US/docs/Web/API/Document/body) içine "ışınladı":

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

İkinci paragrafın kenarla birlikte görsel olarak ana `<div>`'in dışında nasıl göründüğüne dikkat edin. DOM yapısını geliştirici araçlarıyla incelerseniz, ikinci `<p>`'nin doğrudan `<body>` içine yerleştirildiğini görebilirsiniz:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>This child is placed inside the parent div.</p>
      </div>
    ...
  </div>
  <p>This child is placed in the document body.</p>
</body>
```

Bir portal, DOM düğümünün yalnızca fiziksel yerleşimini değiştirir. Diğer her şekilde, bir portala render ettiğiniz JSX, onu render eden React bileşeninin alt düğümü gibi davranır. Örneğin, alt eleman ana ağaç tarafından sağlanan bağlama erişebilir ve olaylar React ağacına göre alt elemanlardan üst elemanlara doğru ilerlemeye devam eder.

---

### Portal ile modal iletişim kutusu render etme {/*rendering-a-modal-dialog-with-a-portal*/}

Diyaloğu çağıran bileşen `overflow: hidden` veya diyaloğa müdahale eden diğer stillere sahip bir kapsayıcı içinde olsa bile, sayfanın geri kalanının üzerinde bulunan bir modal diyalog penceresi oluşturmak için bir portal kullanabilirsiniz.

Bu örnekte, iki kapsayıcı da modal iletişim kutusunu bozan stillere sahiptir, ancak DOM'da modal üst JSX öğeleri içinde yer almadığı için portalda render edilen stil etkilenmez.

<Sandpack>

```js App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal without a portal
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```


```css styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

Portalları kullanırken uygulamanızın erişilebilir olduğundan emin olmanız önemlidir. Örneğin, kullanıcının odağı doğal bir şekilde portalın içine ve dışına taşıyabilmesi için klavye odağını yönetmeniz gerekebilir.

Modal'lar oluştururken [WAI-ARIA Modal Yazma Uygulamaları](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) kılavuzunu izleyiniz. Bir topluluk paketi kullanıyorsanız, erişilebilir olduğundan ve bu yönergeleri izlediğinden emin olun.

</Pitfall>

---

### React bileşenlerini React olmayan sunucu biçimlendirmesine render etme {/*rendering-react-components-into-non-react-server-markup*/}

Portallar, React kökünüz React ile oluşturulmamış statik veya sunucu tarafından render edilen bir sayfanın parçasıysa yararlı olabilir. Örneğin, sayfanız Rails gibi bir sunucu çatısı ile oluşturulmuşsa, sidebar gibi statik alanlar içinde etkileşim alanları oluşturabilirsiniz. [Birden fazla ayrı React köküne](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) sahip olmakla karşılaştırıldığında, portallar, parçaları DOM'un farklı bölümlerine render edilse bile uygulamayı paylaşılan state'e sahip tek bir React ağacı olarak ele almanızı sağlar.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>Welcome to my hybrid app</h1>
    <div class="parent">
      <div class="sidebar">
        This is server non-React markup
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>This part is rendered by React</p>;
}

function SidebarContent() {
  return <p>This part is also rendered by React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### React bileşenlerini React olmayan DOM düğümlerine render etme {/*rendering-react-components-into-non-react-dom-nodes*/}

React dışında yönetilen bir DOM düğümünün içeriğini yönetmek için de bir portal kullanabilirsiniz. Örneğin, React olmayan bir harita widget'ı ile entegre olduğunuzu ve React içeriğini bir açılır pencere içinde redner etmek istediğinizi varsayalım. Bunu yapmak için, içine render edeceğiniz DOM düğümünü saklamak üzere bir `popupContainer` state değişkeni tanımlayabilirsiniz:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Üçüncü parti widget'ı oluşturduğunuzda, widget tarafından döndürülen DOM düğümünü depo edin, böylece içine render edebilirsiniz:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

Bu, React içeriğini kullanılabilir hale geldiğinde `popupContainer` içine render etmek için `createPortal` kullanmanızı sağlar:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Hello from React!</p>,
      popupContainer
    )}
  </div>
);
```

İşte kurcalayabileceğiniz eksiksiz bir örnek:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Hello from React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
