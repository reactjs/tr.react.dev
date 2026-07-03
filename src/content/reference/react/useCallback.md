---
title: useCallback
---

<Intro>

`useCallback`, render'lar arasında bir fonksiyon tanımını önbelleğe almanızı sağlayan React Hook'udur.

```js
const cachedFn = useCallback(fn, dependencies)
```

</Intro>

<Note>

[React Compiler](/learn/react-compiler) automatically memoizes values and functions, reducing the need for manual `useCallback` calls. You can use the compiler to handle memoization automatically.

</Note>

<InlineToc />

---

## Referans {/*reference*/}

### `useCallback(fn, dependencies)` {/*usecallback*/}

Render'lar arasında bir fonksiyon tanımını önbelleğe almak (memoize) için bileşeninizin en üst kapsamında `useCallback`'i çağırın:

```js {4,9}
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
```

[Daha fazla örnek için aşağıya bakın.](#usage)

#### Parametreler {/*parameters*/}

* `fn`: Önbelleğe almak istediğiniz fonksiyondur. Herhangi bir argüman alıp herhangi bir değer döndürebilir. React, fonksiyonunuzu ilk render sırasında size geri döndürür (çağırmaz!). Sonraki render'larda, `dependencies` dizinin öğeleri son render'dan bu yana değişmediyse aynı fonksiyonu tekrar verir. Değiştiyse mevcut render sırasında ilettiğiniz işlevi size verir ve tekrar kullanılabilmek için saklar. React, fonksiyonunuzu çağırmaz. Fonksiyon size geri döndürülür ve böylece onu ne zaman çağırıp çağırmayacağınıza karar verebilirsiniz.

* `dependencies`: `fn` kodu içerisinde başvurulan reaktif değerlerin listesidir. Reaktif değerler; prop, state ve doğrudan bileşeninizin gövdesinde bildirilen değişkenleri ve fonksiyonları içerir. Linter'ınız [React için yapılandırılmışsa](/learn/editor-setup#linting), kullanılan reaktif değerin bağımlılık olarak doğru bir şekilde belirtildiğini denetler. Bağımlılık listesi sabit sayıda öğe içermeli ve `[dep1, dep2, dep3]` şeklinde doğrudan yazılmalıdır. React [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) karşılaştırma algoritmasını kullanarak her bir bağımlılığı önceki değeriyle karşılaştırır.

#### Dönüş değeri {/*returns*/}

İlk render'da, kendisine ilettiğiniz `fn` fonksiyonunu döndürür.

Sonraki render’lar sırasında, eğer bağımlılıklar değişmediyse önceki render’dan zaten saklanmış olan `fn` fonksiyonunu döndürür; aksi halde bu render sırasında ilettiğiniz `fn` fonksiyonunu döndürür.


#### Dikkat edilmesi gerekenler {/*caveats*/}

* `useCallback` bir Hook olduğundan, yalnızca **bileşeninizin en üst kapsamında** ya da kendi Hook'larınızda çağırabilirsiniz. Döngülerin ve koşulların içinde çağıramazsınız. Eğer çağırmak zorunda kalırsanız yeni bir bileşene çıkarın ve state'i ona taşıyın.
* React, **özel bir nedeni olmadıkça önbelleğe alınan fonksiyonu temizlemez.** Örneğin, geliştirme aşamasında bileşeninizin dosyasını düzenlediğinizde React önbelleği temizler. Hem geliştirme hem de production aşamasında, ilk render sırasında bileşeniniz askıya alınırsa React önbelleği temizler. Gelecekte, önbelleğin temizlenmesinden yararlanan daha fazla özellik ekleyebilir--örneğin, sanallaştırılmış listeler için yerleşik destek eklenirse, sanallaştırılmış tablonun görünüm alanından dışarı kaydırılan öğeler için önbelleği temizlemek mantıklı olacaktır. `useCallback` Hook'una performans optimizasyonu olarak güveniyorsanız bu beklentilerinizi karşılamalıdır. Aksi durumlar için [state değişkeni](/reference/react/useState#im-trying-to-set-state-to-a-function-but-it-gets-called-instead) veya [ref](/reference/react/useRef#avoiding-recreating-the-ref-contents) daha uygun olabilir.

---

## Kullanım {/*usage*/}

### Bileşenlerin yeniden render işlemini atlama {/*skipping-re-rendering-of-components*/}

Render performansını optimize ederken, alt bileşenlere ilettiğiniz fonksiyonları bazen önbelleğe almanız gerekebilir. Önce bunun nasıl yapılacağına ilişkin sözdizime bakalım, ardından hangi durumlarda faydalı olacağını görelim.

Bileşeninizdeki fonksiyonları render işlemleri arasında önbelleğe almak için tanımını `useCallback` Hook'una sarın:

```js [[3, 4, "handleSubmit"], [2, 9, "[productId, referrer]"]]
import { useCallback } from 'react';

function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
```

`useCallback`'e iki şey geçmeniz gerekir:

1. Render'lar arasında önbelleğe almak istediğiniz fonksiyon.
2. Bileşen içerisinde tanımlı olan ve fonksiyonunuzun içerisinde kullandığınız tüm değerleri içeren <CodeStep step={2}>bağımlılık listesi</CodeStep>.

İlk render'da, `useCallback`'in <CodeStep step={3}>döndüğü fonksiyon</CodeStep> ilettiğiniz fonksiyonun kendisidir.

Sonraki render'larda, <CodeStep step={2}>bağımlılıklar</CodeStep> önceki render'daki değerleriyle karşılaştırılır. Bağımlılıkların hiçbirisi değişmemişse ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) ile karşılaştırılarak karar verilir), `useCallback` aynı fonksiyonu döner. Ancak değişmişse, `useCallback` *o anki* render'da ilettiğiniz fonksiyonu döner.

Diğer bir deyişle, `useCallback` bir fonksiyonu bağımlılıkları değişene kadar önbellekte tutar ve her istendiğinde yeni fonksiyon oluşturmak yerine aynı fonksiyonu döner.

**Bunun ne zaman faydalı olabileceğini görmek için bir örnek üzerinden ilerleyelim.**

`ProductPage`'den `ShippingForm` bileşenine `handleSubmit` fonksiyonunu ilettiğinizi düşünün:

```js {5}
function ProductPage({ productId, referrer, theme }) {
  // ...
  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
```

`theme` prop'unu değiştirmenin uygulamayı anlık dondurduğunu fark etmişsinizdir fakat JSX'inizden `<ShippingForm />` bileşenini kaldırırsanız hızlandığını hissedebilirsiniz. Bu size `ShippingForm` bileşenini optimize etmenin denemeye değer olduğunu gösterir.

**React varsayılan davranış olarak bir bileşen yeniden render edildiğinde tüm alt bileşenlerini özyinelemeli olarak yeniden render eder.** Bu nedenle `ProductPage` farklı bir `theme` ile yeniden render edildiğinde `ShippingForm` bileşeni de render edilir. Fakat render işleminin yavaş olduğuna kanaat getirdiyseniz, `ShippingForm`'i [`memo`](/reference/react/memo) ile sarmalayarak prop'ları değişmediği takdirde render'ı atlamasını söyleyebilirsiniz:

```js {3,5}
import { memo } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  // ...
});
```

**Bu değişiklikle birlikte `ShippingForm`, prop'ları son render ile *aynıysa* render'ı atlar.** Burası fonksiyon önbelleklemenin önemli hale geldiği zamandır! `handleSubmit` fonksiyonunu `useCallback` olmadan tanımladığınızı varsayalım:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // `theme` her değiştiğinde bu farklı bir fonksiyon olur...
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      {/* ... böylece ShippingForm'un prop'ları her zaman farklı olur ve her seferinde yeniden render eder */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**JavaScript'te fonksiyon tanımları (`function () {}` ya da `() => {}`) her zaman _farklı_ fonksiyon oluşturur.** Bu durum `{}` nesne değişmezinin her zaman yeni bir nesne oluşturmasına benzerdir. Normalde, bu bir sorun teşkil etmez ancak `ShippingForm` prop'ları asla aynı olmayacağı için [`memo`](/reference/react/memo) optimizasyonu asla çalışmaz. `useCallback` bu noktada işe yarar hale gelir:

```js {2,3,8,12-13}
function ProductPage({ productId, referrer, theme }) {
  // React'a fonksiyonu render'lar arasında önbelleğe almasını söyler...
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ...bunu bağımlılıklar değişmediği sürece yapar...

  return (
    <div className={theme}>
      {/* ...ShippingForm aynı prop'u alır ve render'ı atlar */}
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}
```

**`handleSubmit`'i `useCallback`'e sararak, yeniden render'lar arasında *aynı* fonksiyon kalmasını sağlarsınız** (bağımlılıklar değişene kadar). Spesifik bir sebebiniz olmadığı sürece bir fonksiyonu `useCallback` sarmanız gerekmez. Bu örnekte kullanma sebebiniz, [`memo`](/reference/react/memo) ile sarılmış bir bileşene fonksiyon iletmenizdir ve yeniden render edilmesini engeller. `useCallback`'e ihtiyaç duymanızın bu sayfada ayrıntılı olarak açıklanan başka nedenleri de vardır.

<Note>

**`useCallback`'e yalnızca performans optimizasyonu olarak güvenmelisiniz.** Kodunuz onsuz çalışmıyorsa, önce altta yatan sorunu bulun ve düzeltin. Daha sonra `useCallback`'i geri ekleyebilirsiniz.

</Note>

<DeepDive>

#### useCallback ile useMemo'nun ilişkisi nedir? {/*how-is-usecallback-related-to-usememo*/}

[`useMemo`](/reference/react/useMemo)'yu `useCallback` ile birlikte sıkça görürsünüz. Her ikisi de alt bileşeni optimize etmeye çalıştığınızda kullanışlıdır. Alt bileşene ilettiğiniz şeyi [önbelleğe almanıza](https://en.wikipedia.org/wiki/Memoization) olanak sağlarlar:

```js {6-8,10-15,19}
import { useMemo, useCallback } from 'react';

function ProductPage({ productId, referrer }) {
  const product = useData('/product/' + productId);

  const requirements = useMemo(() => { // Fonksiyonunuzu çağırır ve sonucunu önbelleğe alır
    return computeRequirements(product);
  }, [product]);

  const handleSubmit = useCallback((orderDetails) => { // Fonksiyonun kendisini önbelleğe alır
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm requirements={requirements} onSubmit={handleSubmit} />
    </div>
  );
}
```

Aralarındaki fark önbelleğe aldıkları *şeyle* alakalıdır:

* **[`useMemo`](/reference/react/useMemo) fonksiyonunuzun *sonucunu* önbelleğe alır.** Bur örnekte, `computeRequirements(product)` çağrısının sonucunu `product` değişene kadar önbelleğe alır. Böylece `ShippingForm`'ı gereksiz yere render etmeden `requirements` nesnesini aşağıya iletir. Gerektiğinde React sonucu hesaplamak için render sırasında geçtiğiniz fonksiyonu çağırır.
* **`useCallback` *fonksiyonun kendisini* önbelleğe alır.** `useMemo`'nun aksine, sağladığınızn fonksiyonu çağırmaz. Bunun yerine, verdiğiniz fonksiyonu önbelleğe alır ve böylece `productId` ve `referrer` değişene kadar `handleSubmit`'ın *kendisi* değişmez. Bu, `ShippingForm`'u gereksiz yere render etmeden `handleSubmit` fonksiyonunu aşağıya geçmenize olanak tanır. Kullanıcı formu gönderene kadar kodunuz çalışmaz.

[`useMemo`](/reference/react/useMemo)'ya zaten aşinaysanız `useCallback`'i şu şekilde düşünmek yardımcı olabilir:

```js {expectedErrors: {'react-compiler': [3]}}
// Simplified implementation (inside React)
function useCallback(fn, dependencies) {
  return useMemo(() => fn, dependencies);
}
```

[`useMemo` ve `useCallback` arasındaki fark hakkında daha fazla bilgi edinin.](/reference/react/useMemo#memoizing-a-function)

</DeepDive>

<DeepDive>

#### useCallback'i her yere eklemeli misiniz? {/*should-you-add-usecallback-everywhere*/}

Eğer uygulaman sen bu siteye benziyorsa ve etkileşimlerin çoğu kaba (örneğin bir sayfanın veya tüm bir bölümün değiştirilmesi gibi) ise, memoization genellikle gereksizdir. Öte yandan, eğer uygulaman bir çizim editörüne daha çok benziyorsa ve etkileşimlerin çoğu daha ayrıntılı (örneğin şekilleri taşımak gibi) ise, o zaman memoization’ı oldukça faydalı bulabilirsin.

`useCallback` ile bir fonksiyonu cache’lemek yalnızca birkaç durumda değerli olur:

- [`memo`](/reference/react/memo)'ya sarılmış bir bileşene prop olarak geçersiniz. Değer değişmediyse render'ı atlamak istersiniz. Önbelleğe alma işlemi, yalnızca bağımlılıkları değiştiyse yeniden render tetikler.
- Geçtiğiniz fonksiyon daha sonra bazı Hook'ların bağımlılığı olarak kullanırsınız. Örneğin, `useCallback`'e sarılmış başka bir fonksiyonun bağımlılığıdır ya da [`useEffect`](/reference/react/useEffect) için bu fonksiyona bağımlısınızdır.

Diğer durumlarda fonksiyonları `useCallback`'e sarmanın hiçbir faydası olmaz. Bunu yapmanın da önemli bir zararı yoktur ve bu nedenle bazı ekipler durumları teker teker düşünmektense mümkün olduğunca önbelleğe almayı tercih ederler. Dezavantajı ise kodu daha az okunabilir hale getirmesidir. Aynı zamanda, önbellekleme her şeyde etkili değildir: her zaman yeni olan tek bir değer tüm bileşen için önbelleklemeyi bozmaya yeterlidir.


`useCallback`'in fonksiyon *oluşturmayı* engellemediğini unutmayın. Her zaman yeni fonksiyon oluşturursunuz (ve bu iyidir), ancak React bunu yok sayarak hiçbir şey değişmediği takdirde önbelleğe alınan fonksiyonu geri verir.

1. Bir bileşen diğer bileşenleri görsel olarak sarıyorsa, onun [JSX’i children olarak kabul etmesine](/learn/passing-props-to-a-component#passing-jsx-as-children) izin verin. Böylece, sarmalayan bileşen kendi state’ini güncellediğinde, React çocuk bileşenlerin yeniden render edilmesine gerek olmadığını bilir.
2. Yerel (local) state kullanmayı tercih edin ve [state’i yukarı taşımayı (lift state up)](/learn/sharing-state-between-components) sadece gerektiği kadar yapın. Formlar veya bir öğenin hover durumu gibi geçici (transient) state’leri ağacınızın en üstünde veya global state kütüphanesinde tutmayın.
3. [Render mantığınızı saf (pure) tutun.](/learn/keeping-components-pure) Eğer bir bileşeni yeniden render etmek sorun yaratıyor veya göze çarpan bir görsel bozulma oluşturuyorsa, bu bileşeninizde bir hatadır! Hatayı düzeltin, memoization eklemeye çalışmayın.
4. [State’i güncelleyen gereksiz Effect’lerden](/learn/you-might-not-need-an-effect) kaçının. React uygulamalarındaki çoğu performans problemi, Effect’lerden kaynaklanan ve bileşenlerin tekrar tekrar render edilmesine neden olan güncelleme zincirlerinden oluşur.
5. Effect’lerinizden [gereksiz bağımlılıkları kaldırmaya](/learn/removing-effect-dependencies) çalışın. Örneğin, memoization yerine bazı obje veya fonksiyonları Effect’in içine veya bileşenin dışına taşımak çoğu zaman daha basittir.

1. Bir bileşen diğerlerini görsel olarak sardığında, [JSX'i alt bileşen (children) olarak kabul etmesine](/learn/passing-props-to-a-component#passing-jsx-as-children) izin verin. Böylece sarmalayıcı bileşen kendi state'ini güncellerse, React alt bileşenleri yeniden render etmesine gerek olmadığını bilir.
1. Yerel state'i tercih edin ve [state'i gereğinden fazla üst bileşene taşımayın.](/learn/sharing-state-between-components) Form gibi geçici state'leri veya bileşenin tıklanma durumunu ağacınızın en üstünde yada global state yönetim kütüphanesinde saklamayın.
1. [Render mantığınızı saf tutun.](/learn/keeping-components-pure) Bileşeni yeniden render etmek bir soruna yol açıyorsa veya göze çarpan bir görsel farklılıklar oluşturuyorsa, bileşeninizde bir bug vardır! Önbelleğe almak yerine bug'ı çözün.
1. [State'i gereksiz güncelleyen Efektlerden kaçının.](/learn/you-might-not-need-an-effect) React uygulamalarındaki çoğu performans sorunu, Efektlerden kaynaklanan ve bileşenlerinizin tekrar tekrar render edilmesine neden olan güncelleme zincirlerinden meydana gelir.
1. [Efektlerinizden gereksiz bağımlılıkları kaldırın.](/learn/removing-effect-dependencies) Örneğin, önbelleğe almak yerine ilgili nesneyi veya fonksiyonu Efektin içine ya da bileşenin dışına taşımak genellikle daha basittir.

Buna rağmen gecikmeli gelen spesifik bir etkileşim varsa, hangi bileşenlerin önbelleğe almadan en çok yararlandığını görmek için [React Developer Tools profiler aracını kullanın](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html) ve gerekli şeyleri önbelleğe alın. Bu ilkeler, bileşenlerinizin anlaşılır olmasını sağlar ve hataların ayıklanmasını kolaylaştırır. Durum farketmeksizin takip etmek faydalıdır. Uzun vadede bunu kökten çözmek için [önbelleğe almayı otomatik hale getirmeyi](https://www.youtube.com/watch?v=lGEMwh32soc) araştırıyoruz.

</DeepDive>

<Recipes titleText="useCallback ve işlevi doğrudan tanımlamak arasındaki fark" titleId="examples-rerendering">

#### `useCallback` ve `memo` ile yeniden render işlemini atlama {/*skipping-re-rendering-with-usecallback-and-memo*/}

Bu örnekte, `ShippingForm` bileşeni **yapay olarak yavaşlatılmıştır**, böylece bileşen render'ının gerçekten yavaş olduğunda ne olacağını görebilirsiniz. Sayacı artırmayı ve temayı değiştirmeyi deneyin.

Sayacı arttırmak, yavaşlatılmış `ShippingForm`'u yeniden render'a zorladığı için yavaş hissettirir. Bu beklenen durumdur çünkü sayaç değişti ve bu nedenle kullanıcının yeni seçimini ekrana yansıtmanız gerekir.

Ardından temayı değiştirmeyi deneyin. **[`memo`](/reference/react/memo) ve `useCallback` birlikteliği sayesinde yapay yavaşlatmadan etkilenmez!** `ShippingForm` render'ı atlar çünkü `handleSubmit` fonksiyonu değişmemiştir. `handleSubmit` fonksiyonunun değişmeme sebebi, hem `productId` hem de `referrer` (`useCallback` bağımlılığınız) değişkenlerinin son render'dan beri değişmemesidir.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Karanlık mod
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import { useCallback } from 'react';
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Bunun istek attığını hayal edin...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[YAPAY YAVAŞLATMA] <ShippingForm /> render ediliyor');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Aşırı yavaş kodu simüle etmek için 500 ms boyunca hiçbir şey yapmaz
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Not: <code>ShippingForm</code> yapay olarak yavaşlatılmıştır!</b></p>
      <label>
        Ürün sayısı:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Sokak:
        <input name="street" />
      </label>
      <label>
        Şehir:
        <input name="city" />
      </label>
      <label>
        Posta kodu:
        <input name="zipCode" />
      </label>
      <button type="submit">Gönder</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

<Solution />

#### Bileşeni her zaman yeniden render etme {/*always-re-rendering-a-component*/}

Bu örnekte, `ShippingForm` bileşeni de **yapay olarak yavaşlatılmıştır** ve böylece render ettiğiniz bazı React bileşenleri gerçekten yavaş olduğunda ne olacağını görebilirsiniz. Sayacı artırmayı ve temayı değiştirmeyi deneyin.

Önceki örnekten farklı olarak, temayı değiştirmek de artık yavaş çalışır! Bunun nedeni **bu versiyonda `useCallback` çağrısının olmamasıdır.** Yani `handleSubmit` her zaman yeni bir fonksiyondur ve `ShippingForm` bileşeni yeniden render'ları atlamaz.

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Karanlık mod
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Bunun istek attığını hayal edin...
  console.log('POST /' + url);
  console.log(data);
}
```

```js {expectedErrors: {'react-compiler': [7, 8]}} src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('[YAPAY YAVAŞLATMA] <ShippingForm /> render ediliyor');
  let startTime = performance.now();
  while (performance.now() - startTime < 500) {
    // Aşırı yavaş kodu simüle etmek için 500 ms boyunca hiçbir şey yapmaz
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <p><b>Not: <code>ShippingForm</code> yapay olarak yavaşlatılmıştır!</b></p>
      <label>
        Ürün sayısı:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Sokak:
        <input name="street" />
      </label>
      <label>
        Şehir:
        <input name="city" />
      </label>
      <label>
        Posta kodu:
        <input name="zipCode" />
      </label>
      <button type="submit">Gönder</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Ancak, aşağıda aynı kodun **yapay yavaşlatması kaldırılmış** hali var. `useCallback`'in eksikliği fark ediliyor mu, edilmiyor mu?

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ProductPage from './ProductPage.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Karanlık mod
      </label>
      <hr />
      <ProductPage
        referrerId="wizard_of_oz"
        productId={123}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js src/ProductPage.js active
import ShippingForm from './ShippingForm.js';

export default function ProductPage({ productId, referrer, theme }) {
  function handleSubmit(orderDetails) {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }

  return (
    <div className={theme}>
      <ShippingForm onSubmit={handleSubmit} />
    </div>
  );
}

function post(url, data) {
  // Bunun istek attığını hayal edin...
  console.log('POST /' + url);
  console.log(data);
}
```

```js src/ShippingForm.js
import { memo, useState } from 'react';

const ShippingForm = memo(function ShippingForm({ onSubmit }) {
  const [count, setCount] = useState(1);

  console.log('<ShippingForm /> render ediliyor');

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderDetails = {
      ...Object.fromEntries(formData),
      count
    };
    onSubmit(orderDetails);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Ürün sayısı:
        <button type="button" onClick={() => setCount(count - 1)}>–</button>
        {count}
        <button type="button" onClick={() => setCount(count + 1)}>+</button>
      </label>
      <label>
        Sokak:
        <input name="street" />
      </label>
      <label>
        Şehir:
        <input name="city" />
      </label>
      <label>
        Posta kodu:
        <input name="zipCode" />
      </label>
      <button type="submit">Gönder</button>
    </form>
  );
});

export default ShippingForm;
```

```css
label {
  display: block; margin-top: 10px;
}

input {
  margin-left: 5px;
}

button[type="button"] {
  margin: 5px;
}

.dark {
  background-color: black;
  color: white;
}

.light {
  background-color: white;
  color: black;
}
```

</Sandpack>

Çoğu zaman önbelleklemeye gerek kalmadan kod iyi çalışır. Etkileşimleriniz yeterince hızlıysa, önbelleklemeye ihtiyacınız yoktur.

Uygulamanızı gerçekte neyin yavaşlattığına dair gerçekçi bir fikir edinmek için React'ı üretim modunda çalıştırmanız, [React Developer Tools](/learn/react-developer-tools)'u devre dışı bırakmanız ve uygulamanızın kullanıcılarınınkine benzer cihazlar kullanmanız gerektiğini unutmayın.

<Solution />

</Recipes>

---

### Önbelleğe alınmış callback'den state güncelleme {/*updating-state-from-a-memoized-callback*/}

Bazen önbelleğe alınmış callback'den önceki değerine bağlı olarak state'i güncellemeniz gerekebilir.

`handleAddTodo` fonksiyonu `todos` state'ini bağımlılık olarak belirtir çünkü sonraki `todos`'u ondan hesaplar:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos([...todos, newTodo]);
  }, [todos]);
  // ...
```

Genellikle önbelleğe alınmış fonksiyonların mümkün mertebe az bağımlılığa sahip olmasını istersiniz. State bağımlılığını yalnızca bir sonraki state değerini hesaplamak için kullanıyorsanız, [güncelleyici fonksiyon (updater function)](/reference/react/useState#updating-state-based-on-the-previous-state) ile değiştirerek bu bağımlılığı kaldırabilirsiniz:

```js {6,7}
function TodoList() {
  const [todos, setTodos] = useState([]);

  const handleAddTodo = useCallback((text) => {
    const newTodo = { id: nextId++, text };
    setTodos(todos => [...todos, newTodo]);
  }, []); // ✅ todos bağımlılığına ihtiyaç yok
  // ...
```

Burada, `todos`'u bağımlılık haline getirmek ve fonksiyonun içinde okumak yerine,  state'i *nasıl* güncelleyeceğinizle ilgili talimatı (`todos => [...todos, newTodo]`) React'e iletirsiniz. [Güncelleyici fonksiyonlar hakkında daha fazla bilgi edinin.](/reference/react/useState#updating-state-based-on-the-previous-state)

---

### Efektlerin çok sık tetiklenmesini önleme {/*preventing-an-effect-from-firing-too-often*/}

Bazen [Efekt](/learn/synchronizing-with-effects) içinde fonksiyon çağırmak isteyebilirsiniz:

```js {4-9,12}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    // ...
```

Bu bir sorun yaratır. [Her reaktif değer, Efektinizin bağımlılığı olarak bildirilmelidir.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Ancak, `createOptions`'ı bağımlılık olarak bildirirseniz, Efektinizin sohbet odasına sürekli olarak yeniden bağlanmasına neden olur:

```js {6}
  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🔴 Sorun: Bu bağımlılık her render'da değişir
  // ...
```

Bu sorunu çözmek için, Efekt içinde çağırmanız gereken işlevi `useCallback`'e sarabilirsiniz:

```js {4-9,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const createOptions = useCallback(() => {
    return {
      serverUrl: 'https://localhost:1234',
      roomId: roomId
    };
  }, [roomId]); // ✅ Yalnızca roomId değiştiğinde değişir

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // ✅ Yalnızca createOptions değiştiğinde değişir
  // ...
```

`roomId`'nin aynı olması durumunda `createOptions` fonksiyonunun render'lar arasında aynı kalmasını sağlar. **Bununla birlikte, fonksiyon bağımlılık ihtiyacını ortadan kaldırmak daha da iyidir.** Fonksiyonunuzu Efektin *içine* taşıyın:

```js {5-10,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() { // ✅ useCallback ve fonksiyon bağımlılıklarına gerek yok!
      return {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Yalnızca roomId değiştiğinde değişir
  // ...
```

Artık kodunuz daha basittir ve `useCallback`'e ihtiyaç duymaz. [Efekt bağımlılıklarını kaldırmakla ilgili daha fazla bilgi edinin.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)

---

### Özel Hook'u Optimize Etme {/*optimizing-a-custom-hook*/}

[Özel Hook](/learn/reusing-logic-with-custom-hooks) yazıyorsanız, döndürdüğü tüm fonksiyonları `useCallback` içine sarmanız önerilir:

```js {4-6,8-10}
function useRouter() {
  const { dispatch } = useContext(RouterStateContext);

  const navigate = useCallback((url) => {
    dispatch({ type: 'navigate', url });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'back' });
  }, [dispatch]);

  return {
    navigate,
    goBack,
  };
}
```

Bu kullanım, Hook'unuzu kullanan kişilerin gerektiğinde kendi kodlarını optimize edebilmelerini sağlar.

---

## Sorun giderme {/*troubleshooting*/}

### Bileşenim her render olduğunda, `useCallback` farklı bir fonksiyon döndürüyor {/*every-time-my-component-renders-usecallback-returns-a-different-function*/}

Bağımlılık dizisini ikinci argüman olarak belirttiğinizden emin olun!

Bağımlılık dizisini unutursanız `useCallback` her seferinde yeni bir fonksiyon döndürür:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }); // 🔴 Her seferinde yeni fonksiyon döndürür: bağımlılık dizisi yok
  // ...
```

Bağımlılık dizisinin ikinci argüman olarak iletildiği düzeltilmiş hali şu şekildedir:

```js {7}
function ProductPage({ productId, referrer }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]); // ✅ Gereksiz yere yeni bir fonksiyon döndürmez
  // ...
```

Bu işe yaramazsa, sorun bağımlılıklarınızdan en az birinin önceki render işleminden farklı olmasıdır. Bağımlılıklarınızı manuel olarak konsola yazdırırsanız sorunun sebebini tespit edebilirsiniz:

```js {5}
  const handleSubmit = useCallback((orderDetails) => {
    // ..
  }, [productId, referrer]);

  console.log([productId, referrer]);
```

Daha sonra konsolda farklı render'larda yazdırılan dizilere sağ tıklayıp her ikisi için de "Store as a global variable"'ı seçebilirsiniz. `temp1` ve `temp2` olarak kaydedildiklerini varsayarsak, her iki dizide bulunan bağımlılıkların aynı olup olmadığını kontrol etmek için tarayıcı konsolunu kullanabilirsiniz:

```js
Object.is(temp1[0], temp2[0]); // İlk bağımlılık diziler arasında aynı mı?
Object.is(temp1[1], temp2[1]); // İkinci bağımlılık diziler arasında aynı mı?
Object.is(temp1[2], temp2[2]); // ... her bağımlılık için devam eder ...
```

Önbellek mekanizmasını kıran bağımlılığı bulduğunuzda, ya bir yolunu bulup kaldırın ya da [önbelleğe alın.](/reference/react/useMemo#memoizing-a-dependency-of-another-hook)

---

### Bir döngüdeki her liste öğesi için `useCallback`'i çağırmam gerekiyor ama yapmama izin vermiyor {/*i-need-to-call-usememo-for-each-list-item-in-a-loop-but-its-not-allowed*/}

`Chart` bileşeninin [`memo`](/reference/react/memo) içine sarıldığını varsayalım. `ReportList` bileşeni yeniden render edildiğinde listedeki her `Chart`'ın yeniden render işlemi atlamak istiyorsunuz. Ancak, döngü içerisinde `useCallback` çağıramazsınız:

```js {expectedErrors: {'react-compiler': [6]}} {5-14}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item => {
        // 🔴 `useCallback`i bu şekilde döngüde çağıramazsınız:
        const handleClick = useCallback(() => {
          sendReport(item)
        }, [item]);

        return (
          <figure key={item.id}>
            <Chart onClick={handleClick} />
          </figure>
        );
      })}
    </article>
  );
}
```

Bunun yerine, her öğeyi bileşene çıkarın ve `useCallback`'i bu bileşene yerleştirin:

```js {5,12-21}
function ReportList({ items }) {
  return (
    <article>
      {items.map(item =>
        <Report key={item.id} item={item} />
      )}
    </article>
  );
}

function Report({ item }) {
  // ✅ useCallback'i en üst kapsamda çağırın:
  const handleClick = useCallback(() => {
    sendReport(item)
  }, [item]);

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
}
```

Alternatif olarak, son kod parçasındaki `useCallback`'i kaldırabilir ve yerine `Report` bileşeninin kendisini [`memo`](/reference/react/memo)'ya sarabilirsiniz. `item` prop'u değişmezse, `Report` yeniden render'ı atlar. Bu nedenle `Chart`'da yeniden render edilmez:

```js {5,6-8,15}
function ReportList({ items }) {
  // ...
}

const Report = memo(function Report({ item }) {
  function handleClick() {
    sendReport(item);
  }

  return (
    <figure>
      <Chart onClick={handleClick} />
    </figure>
  );
});
```
