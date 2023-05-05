---
title: Render Etmek ve DOM'u Değiştirmek
---

<Intro>

Bileşenleriniz ekranda görüntülenmeden önce React tarafından render edilmek zorundadırlar. Bu süreçteki her bir adımı anlamak, kodunuzun nasıl çalıştığı hakkında düşünmenize ve davranışını açıklamanıza yardımcı olacaktır.

</Intro>

<YouWillLearn>

* React'te render etmek ne demektir
* React ne zaman ve niye bir bileşeni render eder
* Bir bileşenin ekranda görüntülenmesi için gerçekleşen adımlar nelerdir
* Render etmek niye her zaman bir DOM güncellemesine neden olmaz

</YouWillLearn>

Bileşenlerinizin mutfakta, malzemelerden lezzetli yemekler pişiren aşçılar olduğunu hayal edin. Bu senaryoda React, müşterilerin siparişlerini alan ve müşterilere siparişlerini teslim eden garsondur. UI'ı (kullanıcı arayüzü) isteme ve servis etme süreci üç adımdan oluşur:

1. Bir render **tetiklemek** (müşterinin siparişinin mutfaktaki aşçıya iletilmesi)
2. Bileşeni **render etmek**  (siparişin mutfakta hazırlanması)
3. DOM'u **değiştirmek** (siparişin masaya götürülmesi)

<IllustrationBlock sequential>
  <Illustration caption="Trigger" alt="React as a server in a restaurant, fetching orders from the users and delivering them to the Component Kitchen." src="/images/docs/illustrations/i_render-and-commit1.png" />
  <Illustration caption="Render" alt="The Card Chef gives React a fresh Card component." src="/images/docs/illustrations/i_render-and-commit2.png" />
  <Illustration caption="Commit" alt="React delivers the Card to the user at their table." src="/images/docs/illustrations/i_render-and-commit3.png" />
</IllustrationBlock>

## 1. Adım: Bir render tetiklemek {/*step-1-trigger-a-render*/}

Bir bileşenin render edilmesi için iki sebep vardır:

1. İlk sebep bileşenin **ilk defa render edilmesidir.**
2. İkinci sebep ise bileşenin (ya da üst bir bileşenin) **state'inin güncellenmesidir.**

### İlk render {/*initial-render*/}

Uygulamanız başladığında, ilk render'ı tetiklemeniz gerekmektedir. Çatılar ve sandbox'lar bazen bu kodu gizlerler ancak bu, hedef DOM node'unun [`createRoot`](/reference/react-dom/client/createRoot) ile çağrılması ve ardından bileşeninizle o DOM node'unun `render` metodu çağrılarak ilk render tetiklenir:

<Sandpack>

```js index.js active
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

```js Image.js
export default function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

</Sandpack>

`root.render()` ifadesini yorum satırı ("//") içine alın ve bileşeninizin kaybolduğunu görün!

### State güncellendiği zaman yeniden render etmek {/*re-renders-when-state-updates*/}

Bir bileşen ilk defa render edildikten sonra, [`set` fonksiyonu](/reference/react/useState#setstate) ile state'i güncelleyerek bileşenin tekrar render edilmesini sağlayabilirsiniz. Bileşeninizin state'ini güncellemek otomatik olarak sıraya bir render almaktadır. (Bunu restorandaki bir müşterinin susuzluk ve açlık durumuna göre ilk siparişini verdikten sonra çay, tatlı ve benzeri şeyleri sipariş etmesi gibi düşünebilirsiniz.)

<IllustrationBlock sequential>
  <Illustration caption="State update..." alt="React as a server in a restaurant, serving a Card UI to the user, represented as a patron with a cursor for their head. They patron expresses they want a pink card, not a black one!" src="/images/docs/illustrations/i_rerender1.png" />
  <Illustration caption="...triggers..." alt="React returns to the Component Kitchen and tells the Card Chef they need a pink Card." src="/images/docs/illustrations/i_rerender2.png" />
  <Illustration caption="...render!" alt="The Card Chef gives React the pink Card." src="/images/docs/illustrations/i_rerender3.png" />
</IllustrationBlock>

## 2. Adım: React bileşeninizi render eder {/*step-2-react-renders-your-components*/}

Bir render tetiklediğiniz zaman React, ekranda neyin görüntüleneceğini belirlemek için bileşenlerinizi çağırır. **"Render etmek" React'in bileşenlerinizi çağırması demektir.**

* **İlk render etme sırasında** React, root (kök) bileşeni çağırır.
* **Daha sonraki renderlar için** React, render'ı tetikleyen state güncellemesinin yapıldığı bileşeni çağırır.

Bu süreç recursive'dir (özyinelemeli): eğer güncellenmiş bileşen başka bir bileşen döndürüyorsa React bir sonra _o_ bileşeni render edecek, o bileşen de bir şey döndürüyorsa React bir sonra _o_ bileşeni render edecektir. Bu süreç daha fazla iç içe geçmiş bileşen kalmayıncaya ve React ekranda neyin görüntülenmesi gerektiğini bilene kadar deveam edecektir.

Aşağıdaki örnekte React, `Gallery()` ve  `Image()` bileşenlerini birkaç kez çağıracaktır:

<Sandpack>

```js Gallery.js active
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

```js index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

* **İlk render esnasında** React, `<section>`, `<h1>`, ve üç `<img>` elementi için [DOM node'larını oluşturacaktır.](https://developer.mozilla.org/docs/Web/API/Document/createElement)
* **Yeniden render esnasında** React, eğer varsa önceki render'dan bu yana hangi özelliklerin değiştiğini hesaplayacaktır. Bir sonraki adım olan DOM'un değiştirilme safhasına kadar bu bilgilerle hiçbir şey yapmayacaktır.

<Pitfall>

Render etmek her zaman [saf hesaplama](/learn/keeping-components-pure) olmalıdır:

* **Aynı girdi, aynı çıktı.** Aynı girdiler verildiğinde, saf bir fonksiyon her zaman aynı JSX'i döndürmelidir. (Bir müşteri domatesli salata sipariş ettiği zaman soğanlı bir salata almamalıdır!)
* **Kendi işine bakar.** Render edilmeden önce var olan herhangi bir nesneyi ve objeyi değiştirmemelidir. (Bir müşterinin siparişi diğer bir müşterinin siparişini değiştirmemelidir.)

Aksi takdirde, kod tabanınız daha karmaşık bir hale geldikçe kafa karıştırıcı ve tahmin edilemeyen hatalarla karşı karşıya kalabilirsiniz. "Strict Mode" ile geliştirme yaparken React, her bileşenin fonksiyonunu iki kez çağırarak saf olmayan fonksiyonlardan kaynaklanabilecek hataların ortaya çıkmasına yardımcı olabilir.

</Pitfall>

<DeepDive>

#### Performansı optimize etmek {/*optimizing-performance*/}

Eğer güncellenen bileşen ağaçta çok yüksekteyse (üst bir eleman ise), güncellenen bileşen içinde render edilen iç içe geçmiş tüm bileşenleri de render etmek performans açısından ideal değildir. Eğer performans sorunlarıyla karşılaşıyorsanız, [Performance](https://reactjs.org/docs/optimizing-performance.html) bölümünde bu sorunu çözmenin birkaç yolu anlatılmaktadır. **Vaktinden önce optimize etmeye çalışmayın!**

</DeepDive>

## 3. Adım: React değişiklikleri DOM'a uygular {/*step-3-react-commits-changes-to-the-dom*/}

Bileşenleriniz render edildikten (çağırıldıktan) sonra React, DOM'u değiştirir. 

* **İlk render için** React, [`appendChild()`](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API'nı kullanarak tüm DOM node'larını ekranda görüntüler. 
* **Yeniden renderler için** React, DOM'un son render'daki çıktıyla eşleşmesi için gerekli olan asgari hesaplamaları (render edilme esnasında hesaplanmış!) yapar.

**React DOM node'larını sadece render'lar arasında farklılık varsa değiştirir.** Örneğin aşağıda, üst bileşeninden her saniye aldığı farklı prop'lar ile yeniden render edilen bir bileşen var. `<input>` elementine yazı yazmanıza ve `değerini` güncellemenize rağmen yeniden render edilen bileşende yazdığınız yazının kaybolmadığına dikkat edin:

<Sandpack>

```js Clock.js active
export default function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
```

```js App.js hidden
import { useState, useEffect } from 'react';
import Clock from './Clock.js';

function useTime() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function App() {
  const time = useTime();
  return (
    <Clock time={time.toLocaleTimeString()} />
  );
}
```

</Sandpack>

Bu, son adımda React'in sadece `<h1>` elementinin içeriğini yeni `time` ile güncellediği için çalışmaktadır. React `<input>` elementinin JSX'te geçen seferki yerinde olduğunu görür ve `<input>` elementine ya da onun `değerine` dokunmaz!

## Sonsöz: Tarayıcının boyanması {/*epilogue-browser-paint*/}

Render tamamlandıktan ve React DOM'u güncelledikten sonra, tarayıcı ekranı yeniden boyayacaktır. Bu süreç "tarayıcının render etmesi" olarak bilinsede, bu dökümantasyon boyunca kafa karışıklığını engellemk için biz ona "boyama" diyeceğiz. 

<Illustration alt="A browser painting 'still life with card element'." src="/images/docs/illustrations/i_browser-paint.png" />

<Recap>

* Bir React uygulamasında herhangi bir ekran güncellemesi üç adımda olur: 
  1. Render tetiklemek
  2. Render etmek
  3. DOM'u değiştirmek
* Strict mode'u kullanarak bileşenlerinizdeki hataları bulabilirsiniz
* Render'ın sonucu geçen seferki render ile aynıysa, React DOM'a dokunmaz

</Recap>

