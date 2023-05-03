---
title: useLayoutEffect
---

<Pitfall>

`useLayoutEffect` performansı kötü etkileyebilir. Mümkün olduğunca [`useEffect`](/reference/react/useEffect)'i tercih edin.

</Pitfall>

<Intro>

`useLayoutEffect`, tarayıcı bileşeni ekrana çizmeden önce tetiklenen bir [`useEffect`](/reference/react/useEffect) çeşididir.

```js
useLayoutEffect(kurulum, bağımlılıklar?)
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `useLayoutEffect(kurulum, bağımlılıklar?)` {/*useinsertioneffect*/}

`useLayoutEffect`, tarayıcının ekrana yeniden çizme işleminden (repainting) önce yerleşim (layout) ölçümlerini gerçekleştirmek için çağrılır:

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```


[Daha fazla örnek için aşağıya bakın.](#usage)

#### Parametereler {/*parameters*/}

* `kurulum (setup)`: Efekt kodunu barındıran fonksiyondur. Kurulum fonksiyonunuz ayrıca isteğe bağlı *temizleme (cleanup)* fonksiyonu döndürebilir. React, bileşeninizi DOM'a eklemeden önce kurulum fonksiyonunuzu çalıştırır. Bağımlılıkların değişmesiyle tetiklenen render'ların ardından öncelikle eski değerlerle birlikte temizleme fonksiyonunuzu (varsa) çalıştırılır ve ardından yeni değerlerle birlikte kurulum fonksiyonuzu çalıştırılır. Bileşen DOM'dan kaldırılmadan önce, React son kez temizleme fonksiyonunuzu çalıştırır.
 
* **isteğe bağlı** `bağımlılıklar (dependencies)`: Kurulum fonksiyonu içerisinde başvurulan reaktif değerlerin listesidir. Reaktif değerler; prop'lar, state'ler ve de bileşenin içerisinde tanımlanan değişkenler ve fonksiyonlardır. Linter'ınız [React için yapılandırılmışsa](/learn/editor-setup#linting), her reaktif değerin doğru bir şekilde bağımlılıklara eklendiğini kontrol eder. Bağımlılık listesi, sabit sayıda öğeye sahiptir ve `[dep1, dep2, dep3]` şeklinde satır içi yazılmalıdır. React, [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) kullanarak bağımlılıkları önceki değerleriyle karşılaştırır. Eğer bu argümanı atlarsanız, bileşen her render edildiğinde efekt çalıştırılır.

#### Dönüş değerleri {/*returns*/}

`useLayoutEffect`, `undefined` döndürür.

#### Uyarılar {/*caveats*/}

* `useLayoutEffect` bir Hook olduğundan, yalnızca **bileşeninizin en üst kapsamında** ya da kendi Hook’larınızda çağırabilirsiniz. Döngülerin ve koşulların içinde çağıramazsınız. Eğer çağırmak zorunda kaldıysanız yeni bir bileşene çıkarın ve efekti oraya taşıyın.

* Katı Mod (Strict Mode) açık olduğunda React, ilk kurulumdan önce **yalnızca geliştirme ortamında olmak üzere ekstra bir kurulum+temizleme döngüsü çalıştırır**. Bu, temizleme mantığının kurulum mantığını "yansıtmasını" ve kurulumun yaptığı her şeyi durdurmasını veya geri almasını sağlayan bir stres testidir. Eğer bir probleme neden olursa [temizleme fonksiyonunu implemente edin.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Bileşen içerisinde tanımlanıp bağımlılıklarınıza eklenmiş bazı [nesneler](/reference/react/useEffect#removing-unnecessary-object-dependencies) ve [fonksiyonlar](/reference/react/useEffect#removing-unnecessary-function-dependencies), **efektin gereksiz yere yeniden çalışmasına neden olabilir**. Bu sorunu çözmek için gereksiz nesne ve fonksiyon bağımlılıklarını kaldırabilirsiniz. Ayrıca [state güncellemelerini](/reference/react/useEffect#updating-state-based-on-previous-state-from-an-effect) ve [reaktif olmayan kodları](/reference/react/useEffect#reading-the-latest-props-and-state-from-an-effect) efekt dışına çıkarabilirsiniz.

* Efektler **yalnızca istemcide (client) çalışır.** Sunucu taraflı renderlama (server-side rendering) esnasında çalışmaz.

* `useLayoutEffect` fonksiyonunun kodu ve içerisinde planlanan state güncellemeleri, **tarayıcının ekrana yeniden çizme işlemini bloklar**. Aynı zamanda gereğinden fazla kullanılması durumunda uygulamanızı yavaşlatabilir. Mümkün olduğunca [`useEffect`](/reference/react/useEffect)'i tercih edin.

---

## Kullanım {/*usage*/}

### Tarayıcı ekrana çizmeden önce yerleşimi ölçmek {/*measuring-layout-before-the-browser-repaints-the-screen*/}

Çoğu bileşen, render edeceği elementlere karar vermek için ekrandaki konumlarını ve boyutlarını bilmeye ihtiyaç duymaz. Sadece JSX döndürürler. Sonrasında tarayıcı, *yerleşimlerini* (konum ve boyut) hesaplar ve ekrana çizer.

Bazen bu yeterli olmaz. Bir elementin üzerine gelindiğinde yanında görünen bir ipucu kutusunu (tooltip) düşünün. Yeterli alan mevcutsa öğenin üstünde, yoksa altında görünmelidir. Doğru konumda render edilmesi için kutunun yüksekliğini bilmeye ihtiyacınız (üstteki boşluğa sığdığından emin olmak adına) vardır.

Bunu yapmak için çift dikiş renderlamaya ihtiyacınız vardır:

1. İpucunu herhangi bir yerde render edin (konumu farketmez).
2. Yüksekliğini ölçün ve ipucunu yerleştireceğiniz yere karar verin.
3. İpucunu doğru yerde yeniden render edin.

**Tüm bunlar tarayıcı ekrana yeniden çizmeden önce yaşanmalıdır**. Kullanıcının kutunun konum değiştirme hareketini görmesini istemezsiniz. Yerleşim ölçümlerini yapmak için `useLayoutEffect`'i çağırın:

```js {5-8}
function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0); // Henüz yüksekliğini bilmiyorsunuz

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height); // Gerçek yüksekliği öğrendikten sonra yeniden render edin
  }, []);

  // ...aşağıda bulunan rendering mantığında tooltipHeight'i kullanın...
}
```

İşleyişi adım adım şu şekilde açıklanabilir:

1. `Tooltip`, başlangıçta `tooltipHeight = 0` olarak render edilir (kutu yanlış konumlandırılabilir).
2. React, DOM'a yerleştirir ve `useLayoutEffect`'teki kodu çalıştırır.
3. `useLayoutEffect`, ipucu kutusunun [yüksekliğini ölçer](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) ve anında yeniden render'ı tetikler.
4. `Tooltip`, gerçek `tooltipHeight` ile yeniden render edilir (kutu doğru konumlandırılır).
5. React, DOM'u günceller ve tarayıcı ipucu kutusunu nihayet görüntüler.

Aşağıdaki düğmelerin üzerine gelip ipucu kutusunun sığıp sığmadığına bağlı olarak nasıl konumlandırılacağını görün:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Bu ipucu kutusu düğmenin üstüne sığmaz.
            <br />
            Bu yüzden altında görüntülenir!
          </div>
        }
      >
        Fareyle üstüme gel (ipucu kutusu aşağıda)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Bu ipucu kutusu düğmenin üstüne sığar.</div>
        }
      >
        Fareyle üstüme gel (ipucu kutusu yukarıda)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Bu ipucu kutusu düğmenin üstüne sığar.</div>
        }
      >
        Fareyle üstüme gel (ipucu kutusu yukarıda)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
    console.log('Ölçülen ipucu kutusu yüksekliği: ' + height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Yukarıya sığmadığı için altına yerleştirilir
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Dikkat edin, `Tooltip` bileşeni çift dikiş (önce `tooltipHeight = 0` olarak, ardından ölçülen yükseklikle) render edilmesine rağmen, yalnızca nihai sonucu görürsünüz. Elbette bunun için örnekteki gibi [`useEffect`](/reference/react/useEffect) yerine `useLayoutEffect` kullanmanız gerekir. Farkı detaylıca inceleyelim.

<Recipes titleText="useLayoutEffect vs useEffect" titleId="examples">

#### `useLayoutEffect` tarayıcının ekrana çizme işlemini bloklar {/*uselayouteffect-blocks-the-browser-from-repainting*/}

React; `useLayoutEffect` kodunun ve içerisinde planlanan durum güncellemelerinin, **tarayıcı ekranı yeniden çizmeden önce** işleme alınacağının garantisini verir. Bu da kullanıcı ilk render'ı fark edemeden tooltip'i ölçmenize ve tekrar render etmenize olanak tanır. Başka bir deyişle, `useLayoutEffect` tarayıcının ekrana çizmesini engeller.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Bu ipucu kutusu düğmenin üstüne sığmaz.
            <br />
            Bu yüzden altında görüntülenir!
          </div>
        }
      >
        Fareyle üstüme gel (ipucu kutusu yukarda)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Bu ipucu kutusu düğmenin üstüne sığar.</div>
        }
      >
        Fareyle üstüme gel (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Bu ipucu kutusu düğmenin üstüne sığar.</div>
        }
      >
        Fareyle üstüme gel (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Yukarıya sığmadığı için altına yerleştirilir
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

<Solution />

#### `useEffect` tarayıcıyı bloklamaz {/*useeffect-does-not-block-the-browser*/}

Aynı örneğe [`useEffect`](/reference/react/useEffect) ile bakalım. Daha yavaş bir cihaz kullanıyorsanız, ipucu kutusunun bazen "titrediğini" ve gerçek konumundan önce kısa süreliğine başlangıç konumunda göründüğünü fark edebilirsiniz.

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Bu ipucu kutusu düğmenin üstüne sığmaz.
            <br />
            Bu yüzden altında görüntülenir!
          </div>
        }
      >
        Fareyle üstüme gel (ipucu kutusu yukarda)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Bu ipucu kutusu düğmenin üstüne sığar.</div>
        }
      >
        Fareyle üstüme gel (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Bu ipucu kutusu düğmenin üstüne sığar.</div>
        }
      >
        Fareyle üstüme gel (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Yukarıya sığmadığı için altına yerleştirilir
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Farkın net bir şekilde  anlaşılabilmesi için aşağıdaki örnekte render gecikmesi olarak yapay bir gecikme eklenir. React, `useEffect` içindeki state güncellemesini işlemeden önce, tarayıcının ekranı yeniden çizmesine izin verecektir. Sonuç olarak, ipucu kutusu titrer:

<Sandpack>

```js
import ButtonWithTooltip from './ButtonWithTooltip.js';

export default function App() {
  return (
    <div>
      <ButtonWithTooltip
        tooltipContent={
          <div>
            Bu ipucu kutusu düğmenin üstüne sığmaz.
            <br />
            Bu yüzden altında görüntülenir!
          </div>
        }
      >
        Fareyle üstüme gel (ipucu kutusu yukarda)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Bu ipucu kutusu düğmenin üstüne sığar.</div>
        }
      >
        Fareyle üstüme gel (tooltip below)
      </ButtonWithTooltip>
      <div style={{ height: 50 }} />
      <ButtonWithTooltip
        tooltipContent={
          <div>Bu ipucu kutusu düğmenin üstüne sığar.</div>
        }
      >
        Fareyle üstüme gel (tooltip below)
      </ButtonWithTooltip>
    </div>
  );
}
```

```js ButtonWithTooltip.js
import { useState, useRef } from 'react';
import Tooltip from './Tooltip.js';

export default function ButtonWithTooltip({ tooltipContent, ...rest }) {
  const [targetRect, setTargetRect] = useState(null);
  const buttonRef = useRef(null);
  return (
    <>
      <button
        {...rest}
        ref={buttonRef}
        onPointerEnter={() => {
          const rect = buttonRef.current.getBoundingClientRect();
          setTargetRect({
            left: rect.left,
            top: rect.top,
            right: rect.right,
            bottom: rect.bottom,
          });
        }}
        onPointerLeave={() => {
          setTargetRect(null);
        }}
      />
      {targetRect !== null && (
        <Tooltip targetRect={targetRect}>
          {tooltipContent}
        </Tooltip>
      )
    }
    </>
  );
}
```

```js Tooltip.js active
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import TooltipContainer from './TooltipContainer.js';

export default function Tooltip({ children, targetRect }) {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // Bu yapay olarak rendering işlemini yavaşlatır
  let now = performance.now();
  while (performance.now() - now < 100) {
    // Kısa süre bekler...
  }

  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);

  let tooltipX = 0;
  let tooltipY = 0;
  if (targetRect !== null) {
    tooltipX = targetRect.left;
    tooltipY = targetRect.top - tooltipHeight;
    if (tooltipY < 0) {
      // Yukarıya sığmadığı için altına yerleştirilir
      tooltipY = targetRect.bottom;
    }
  }

  return createPortal(
    <TooltipContainer x={tooltipX} y={tooltipY} contentRef={ref}>
      {children}
    </TooltipContainer>,
    document.body
  );
}
```

```js TooltipContainer.js
export default function TooltipContainer({ children, x, y, contentRef }) {
  return (
    <div
      style={{
        position: 'absolute',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`
      }}
    >
      <div ref={contentRef} className="tooltip">
        {children}
      </div>
    </div>
  );
}
```

```css
.tooltip {
  color: white;
  background: #222;
  border-radius: 4px;
  padding: 4px;
}
```

</Sandpack>

Yukarıdaki kodu `useLayoutEffect` kullanacak şekilde düzenleyin ve rendering yavaşlatıldığında bile ekrana çizme işlemini engellediğini gözlemleyin.

<Solution />

</Recipes>

<Note>

İki aşamalı render'lama ve tarayıcıyı bloklama performansı düşürür. Yapabildiğinizce bundan kaçınmaya çalışın.

</Note>

---

## Sorun giderme {/*troubleshooting*/}

### "`useLayoutEffect` does nothing on the server" hatası alıyorum {/*im-getting-an-error-uselayouteffect-does-nothing-on-the-server*/}

`useLayoutEffect`'in amacı, bileşeninizin [render anında yerleşim bilgisini kullanmasına](#measuring-layout-before-the-browser-repaints-the-screen) izin vermektir:

1. Başlangıç içeriğini render edin.
2. Tarayıcı ekranı çizmeden önce yerleşimi ölçün.
3. Okuduğunuz yerleşim bilgisini kullanarak nihai içeriği render edin.

Siz veya framework'ünüz [sunucu taraflı render'lama](/reference/react-dom/server) kullanıyorsa, React uygulamanız ilk render için sunucuda HTML render eder. Bu da JavaScript kodu yüklenmeden önce HTML'ini göstermenize sebep olur.

Sorunun kaynağı sunucuda yerleşim (layout) bilgisinin bulunmamasıdır.

[Önceki örneklerde](#measuring-layout-before-the-browser-repaints-the-screen) bahsedilen `Tooltip` bileşenindeki `useLayoutEffect` çağrısı, içeriğin yüksekliğine bağlı olarak doğru konuma yerleşmesine izin veriyordu (içeriğin üstünde veya altında). `Tooltip`'i sunucu HTML'inin bir parçası olarak render etmeye çalışırsanız, konumu belirlemek imkansız olur. Sunucuda yerleşim yoktur! Bu nedenle, sunucuda render edilen bileşeniniz JavaScript yüklenip çalıştırıldıktan sonra nihai konumuna "zıplar".

Genellikle yerleşim bilgisine ihtiyaç duyan bileşenlerin sunucuda render edilmesi gereksizdir. Örneğin, ilk render'da `Tooltip` göstermek çoğu zaman mantıklı değildir. İstemci etkileşimiyle tetiklenmelidir.

Bununla birlikte bu sorunla karşılaştığınızda seçebileceğiniz birkaç farklı seçenek vardır:

- `useLayoutEffect`'i [`useEffect`](/reference/react/useEffect) ile değiştirin. Bu, React'a ekrana çizme işlemini bloke etmesine gerek olmadan ilk render sonucunu görüntüleyebileceğini söyler (çünkü efektiniz çalışmadan önce HTML render edilmiş olacaktır).

- Alternatif olarak, [bileşeninizi yalnızca istemci taraflı render olacak şekilde işaretleyin](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content). Böylece bileşen sunucu tarafında render edilirken en yakındaki [`<Suspense>`](/reference/react/Suspense) sınırına (boundary) yüklenme fallback'i olarak verilen bileşen (örneğin, spinner veya glimmer) ile değiştirilir.

- Alternatif olarak, `useLayoutEffect` kullanan bileşeni hidratlama sonrasında render ettirebilirsiniz. Başlangıç değeri `false` olan `isMounted` isminde bir state oluşturun ve `useEffect` içerisinde `true` olarak ayarlayın. Render ederken lojiğiniz şöyle olabilir: `return isMounted ? <RealContent /> : <FallbackContent />`. Sunucudayken veya hidratlama sırasında, kullanıcı `useLayoutEffect` çağırılmayan `FallbackContent`'i görür. İstemci tarafında React, içeriği `RealContent` ile değiştirir.

- Bileşeninizi harici bir veri deposu (data store) ile senkron tutuyorsanız ve `useEffect`'i yerleşimi ölçmek yerine başka sebeplerle kullanıyorsanız, bunun yerine [sunucu taraflı render'ı destekleyen](/reference/react/useSyncExternalStore#adding-support-for-server-rendering) [`useSyncExternalStore`](/reference/react/useSyncExternalStore)'u kullanmayı düşünün.