---
title: "Efektler ile Senkronize Etme"
---

<Intro>

Bazı bileşenler harici sistemler ile senkronize olmalıdır. Örneğin, React state'ine göre React olmayan bir bileşeni kontrol etmek, bir sunucu bağlantısı kurmak veya bir bileşen ekranda göründüğünde analiz bilgisi göndermek isteyebilirsiniz. *Efektler*, bileşeninizi bazı React dışı sistemler ile senkronize etmenizi sağlamak için bazı kodları render işleminden sonra çalıştırır.

</Intro>

<YouWillLearn>

- Efektler nelerdir
- Efektler olaylardan nasıl farklıdır
- Bileşeninizde nasıl Efekt bildirirsiniz
- Efekti gereksiz olarak yeniden çalıştırmaktan nasıl kaçınırsınız
- Efektler geliştirme sırasında neden iki kere çalışır ve bunu nasıl düzeltiriz

</YouWillLearn>

## Efektler nedir ve olaylardan nasıl farklıdırlar? {/*what-are-effects-and-how-are-they-different-from-events*/}

Efektlere başlamadan önce React bileşenleri içindeki iki tip mantığa aşina olmalısınız:

- **Kodun render edilmesi** ([Describing the UI](/learn/describing-the-ui) başlığında bahsedildi) bileşeninizin en üst seviyesindedir. Burası prop'ları ve state'i aldığınız, onları dönüştürdüğünüz ve ekranda görmek istediğiniz JSX'i döndürdüğünüz yerdir. [Kodu render etmek saf olmak zorundadır.](/learn/keeping-components-pure) Bir matematik formülünde olduğu gibi sadece sonucu _hesaplamalı_ ve başka hiçbir şey yapmamalıdır.

- **Olay yöneticileri** ([Adding Interactivity](/learn/adding-interactivity) başlığında bahsedildi) bileşeniniz içinde sadece hesaplama yapmak yerine bir şeyler *yapan* iç içe fonksiyonlardır. Bir olay yöneticisi input alanını güncelleyebilir, bir ürünü satılan almak için HTTP POST isteği gönderebilir ya da kullanıcıyı başka bir ekrana yönlendirebilir. Olay yöneticileri, belirli bir kullanıcı eyleminin (örneğin bir butana tıklamak ya da yazmak) ["yan etkiler"](https://en.wikipedia.org/wiki/Side_effect_(computer_science)) içerirler (programın state'ini değiştirirler).

Bazen bu yeterli değildir. Ekranda göründüğünde sohbet sunucusuna bağlanmak zorunda olan bir `ChatRoom` bileşenini ele alalım. Bir sunucuya bağlanmak saf bir hesaplama değildir (bir yan etkidir) bu yüzden render etme sırasında yapılamaz. Ancak, `ChatRoom`'un ekranda görüntülenmesine neden olan tıklama gibi belirli bir olay yoktur.

***Efektler*, belirli bir olaydan ziyade render etmenin kendisinden kaynaklanan yan etkileri belirtmenizi sağlar.** Sohbete mesaj göndermek bir *olaydır* çünkü direkt olarak kullanıcının belirli bir butona tıklaması ile gerçekleşir. Ancak, bir sunucu bağlantısı kurmak *Efekttir* çünkü bileşenin ekranda görünmesine neden olan etkileşim ne olursa olsun gerçekleşmesi gerekir. Efektler ekran güncellendikten sonra [işlemenin (commit)](/learn/render-and-commit) sonunda çalışır. Bu, React bileşenlerini bazı harici sistemlerle (ağ veya üçüncü parti kütüphane ile) senkronize etmek için iyi bir zamandır.

<Note>

Burada ve daha sonra bu metinde, büyük harflerle yazılan "Efekt", yukarıdaki React'e özgü tanıma atıfta bulunur, örneğin render etmenin neden olduğu bir yan etki. Daha geniş programlama konseptine atıfta bulunmak için "yan etki" ifadesini kullanacağız.

</Note>


## Bir Efekte ihtiyacınız olmayabilir {/*you-might-not-need-an-effect*/}

**Bileşenlerinize Efekt eklemekte acele etmeyin.** Efektlerin genel olarak React kodununuzun "dışına çıkmakta" ve bazı *harici* sistemler ile senkronize etmekte kullanıldığı aklınızda olsun. Bu tarayıcı API'larını, üçüncü parti widget'ları, ağları ve diğer şeyleri içerir. Efektiniz yalnızca bazı state'leri başka bir state'e göre ayarlıyorsa, [bir Efekte ihtiyacınız olmayabilir.](/learn/you-might-not-need-an-effect)

## Efekt nasıl yazılır {/*how-to-write-an-effect*/}

Bir Efekt yazmak için aşağıdaki üç adımı takip edin:

1. **Bir Efekt bildirin.** Varsayılan olarak, Efektiniz her [işleme](/learn/render-and-commit)'den sonra çalışacaktır.
2. **Efektin bağımlılıklarını belirtin.** Çoğu Efekt her render yerine yalnızca *gerektiğinde* yeniden çalışmalıdır. Örneğin, bir solma animasyonu yalnızca bileşen göründüğünde tetiklenmelidir. Bir sohbet odasına bağlanmak ya da bağlantıyı koparmak yalnızca bileşen göründüğünde ve kaybolduğunda ya da sohbet odası değiştiğinde olmalıdır. *Bağımlılıkları* belirterek bunu nasıl kontrol edeceğinizi öğreneceksiniz.
3. **Gerekliyse temizleme (cleanup) ekleyin.** Bazı Efektlerin, yaptıkları her şeyi nasıl durduracaklarını, geri alacaklarını veya temizleyeceklerini belirtmeleri gerekir. Örneğin, "bağlanmak" "bağlantıyı kese" ihtiyaç duyar, "abone ol" "abonelikten çıka" ihtiyaç duyar ve "veri getirme (fetch)" ya "iptal" ya da "görmezden gele" ihtiyaç duyar. Bir *temizleme fonksiyonu* döndürerek bunu nasıl yapacağınızı öğreneceksiniz.

Gelin her bir adıma detaylı bir şekilde bakalım.

### 1. Adım: Bir Efekt bildirin {/*step-1-declare-an-effect*/}

Bileşeninizde bir Efekt bildirmek için [`useEffect` Hook'unu](/reference/react/useEffect) içe aktarın:

```js
import { useEffect } from 'react';
```

Daha sonra, bileşeninizin üst seviyesinde çağırın ve Efektiniz içine kodunuzu yazın:

```js {2-4}
function MyComponent() {
  useEffect(() => {
    // Buradaki kod *her* render'dan sonra çalışır
  });
  return <div />;
}
```

Bileşeniniz her render edildiğinde, React ekranı güncelleyecektir *ve sonra* `useEffect` içindeki kodu çalıştıracaktır. Diğer bir deyişle, **`useEffect` bir kod parçasının çalışmasını o render işlemi ekrana yansıtılana kadar "geciktirir".**

Harici bir sistemle senkronize etmek için Efekti nasıl kullanacağımızı görelim. Bir `<VideoPlayer>` React bileşeni düşünün. Bu bileşene `isPlaying` prop'u ileterek videonun çalıyor mu yoksa duraklatılmış mı olduğunu kontrol etmek güzel olurdu:

```js
<VideoPlayer isPlaying={isPlaying} />;
```

Özel `VideoPlayer` bileşeniniz tarayıcıya yerleşik [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) elemanını render eder:

```js
function VideoPlayer({ src, isPlaying }) {
  // YAPILACAK: isPlayinga ile bir şey yap
  return <video src={src} />;
}
```

Ancak, tarayıcı `<video>` elemanı `isPlaying` prop'una sahip değildir. Kontrol etmenin tek yolu manuel olarak DOM elemanında [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) ve [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) metodlarını çağırmaktır. **Videonun şu anda _oynatılıp oynatılmayacağını_ söyleyen `isPlaying` prop'unun değerini `play()` ve `pause()` gibi çağrıları kullanarak senkronize etmeniz gerekmektedir.**

İlk olarak `<video>` DOM node'una [bir ref verin](/learn/manipulating-the-dom-with-refs).

Render etme sırasında `play()` veya `pause()` metodlarını çağırmak isteyebilirsiniz ancak bu doğru bir yöntem değil:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  if (isPlaying) {
    ref.current.play();  // Render etme sırasında bunları çağırmaya izin verilmez.
  } else {
    ref.current.pause(); // Ayrıca bu çöker
  }

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Duraklat' : 'Oynat'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Bu kodun doğru olmamasının sebebi render etme esnasında DOM node'una bir şeyler yapmaya çalışmasıdır. React'te, [render etme JSX'ın saf bir hesaplaması](/learn/keeping-components-pure) olmalıdır ve DOM'u değiştirme gibi yan etkileri içermemelidir.

Dahası, `VideoPlayer` ilk çağırıldığı zaman, o bileşen henüz DOM'da değildir! Henüz `play()` ve `pause()` metodları çağırılıcak bir DOM node'u yok çünkü React, siz JSX'i döndürene kadar hangi DOM'u oluşturacağını bilmiyor.

Buradaki çözüm, **yan etkiyi render etme hesaplamasının dışına çıkarmak için useEffect içine taşımaktır:**

```js {6,12}
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}
```

DOM güncellemesini Efekt içine taşıyarak React'in ilk olarak ekranı güncellemesine izin verirsiniz. Ardından Efektiniz çalışır.

`VideoPlayer` bileşeniniz render edildiğinde (ya ilk sefer ya da yeniden render'larda), birkaç şey olacaktır. İlk olarak, React ekranı güncelleyecektir, bu `<video>` elemanının DOM'da doğru prop'larla olmasını sağlayacaktır. Ardından React, Efektinizi çalıştıracaktır. Son olarak, Efektiniz `isPlaying` değerine göre `play()` veya `pause()` metodlarını çağıracaktır.

Oynat/Duraklat butonuna birkaç kez basın ve video oynatıcının `isPlaying` değeriyle nasıl senkronize kaldığını görün:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Duraklat' : 'Oynat'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Bu örnekte, React state'ine senkronize ettiğiniz "harici sistem" tarayıcı medya API'ıdır. Eski, React olmayan kodu (JQuery eklentileri gibi) bildirim temelli React bileşenlerine sarmak için benzer bir yaklaşım kullanabilirsiniz.

Bir video oynatıcısını kontrol etmenin pratikte çok daha kompleks bir şey olduğuna dikkat edin. `play()` metodunu çağırmak başarısız olabilir, kullanıcı tarayıcıya yerleşik kontrolleri kullanarak videoyu oynatıp durdurabilir ve bunun gibi şeyler. Bu örnek çok basitleştirilmiş ve eksiktir.

<Pitfall>

Varsayılan olarak, Efektler *her* render'dan sonra çalışır. Bu yüzden aşağıdaki gibi bir kod **sonsuz bir döngü yaratacaktır:**

```js
const [count, setCount] = useState(0);
useEffect(() => {
  setCount(count + 1);
});
```

Efektler render işleminin *sonucu* olarak çalışırlar. State'i değiştirmek render'ı *tetikler*. Bir Efekt içinde state'i hemen değiştirmek, bir elektrik prizini kendisine takmaya benzer. Daha sonra Efekt çalışır, state'i değiştirir, bu yeniden render'a neden olur, bu Efektin çalışmasına neden olur, yeniden state'i değiştirir, bu başka bir yeniden render'a neden olur, ve bu böyle devam eder.

Efektleriniz genellikle bileşenlerinizi *harici* bir sistemle senkronize etmelidir. Eğer harici bir sistem yoksa ve sadece state'i başka bir state'e göre ayarlamak istiyorsanız, [bir Efekte ihtiyacınız olmayabilir.](/learn/you-might-not-need-an-effect)

</Pitfall>

### 2. Adım: Efekt bağımlılıklarını belirtin {/*step-2-specify-the-effect-dependencies*/}

Varsayılan olarak, Efektler *her* render'dan sonra çalışır. Genellikle bu, **istediğiniz davranış değildir:**

- Bazen yavaştır. Harici bir sistem ile senkronize etmek anlık bir olay değildir bu yüzden gerekli olmadıkça senkronize etme işlemini atlamak isteyebilirsiniz. Örneğin, her bir tuşa her bastığınızda sohbet sunucusuna tekrar bağlanmak istemezsiniz.
- Bazen yanlıştır. Örneğin, her bir tuşa her bastığınızda bileşen solma animasyonunu tetiklemek istemezsiniz. Animasyon yalnızca bir kere, bileşen ekranda belirdiği zaman tetiklenmelidir.

Sorunu göstermek için, birkaç `console.log` çağrısı ve üst bileşenin state'ini güncelleyen bir input alanı içeren önceki örneği burada bulabilirsiniz. Yazmanın Efektin nasıl yeniden çalışmasına neden olduğuna dikkat edin:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('video.play() çağrılıyor');
      ref.current.play();
    } else {
      console.log('video.pause() çağrılıyor');
      ref.current.pause();
    }
  });

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Duraklat' : 'Oynat'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

`useEffect` çağrısının ikinci argümanı olarak *bağımlılıklar* dizisini belirterek React'e **Efekti gereksiz yere yeniden çalıştırmayı atlamasını** söyleyebilirsiniz. Yukarıdaki örnekteki 14. satıra boş bir `[]` dizi ekleyin:

```js {3}
  useEffect(() => {
    // ...
  }, []);
```

`React Hook'u useEffect'in eksik bir bağımlılığı var: 'isPlaying'` diyen bir hata göreceksiniz:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('video.play() çağrılıyor');
      ref.current.play();
    } else {
      console.log('video.pause() çağrılıyor');
      ref.current.pause();
    }
  }, []); // Bu bir hataya neden olur

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Duraklat' : 'Oynat'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Buradaki problem Efektiniz içindeki kodun ne yapacağı `isPlaying` prop'una *bağlıdır* ancak bu bağımlılık açıkça bildirilmemiştir. Bu sorunu düzeltmek için bağımlılık dizisine `isPlaying` ekleyin:

```js {2,7}
  useEffect(() => {
    if (isPlaying) { // Burada kullanılıyor...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...yani burada bildirilmeli!
```

Şimdi bütün bağımlılıklar bildirildiği için artık hata mesajı yoktur. `[isPlaying]`'i bağımlılık listesinde belirtmek React'in, eğer `isPlaying` değeri bir önceki render ile aynıysa Efektinizin yeniden çalışmasını atlamasını sağlar. Bu değişiklikle beraber input alanına bir şey yazmak Efektin yeniden çalışmasına neden olmaz ama Oynat/Duraklat butonuna basmak Efekti yeniden çalıştırır:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      console.log('video.play() çağrılıyor');
      ref.current.play();
    } else {
      console.log('video.pause() çağrılıyor');
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [text, setText] = useState('');
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Duraklat' : 'Oynat'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
input, button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Bağımlılık dizisi birden çok bağımlılık içerebilir. React, yalnızca belirttiğiniz bağımlılıkların *tümünün* önceki render sırasına sahip oldukları değerlerle tamamen aynı değerlere sahip olması durumunda Efekti çalıştırmayı atlayacaktır. React, bağımlılıkların değerlerini [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) kıyaslamasını kullanarak karşılaştırır. Detaylar için [`useEffect` referansına](/reference/react/useEffect#reference) göz atın.

**Bağımlılıklarınızı "seçemediğinize" dikkat edin.** Eğer belirttiğiniz bağımlılıklar React'in Efektiniz içindeki kodunuza göre beklediği bağımlılıklar ile eşleşmiyorsa bir lint hatası alacaksınız. Bu kodunuzdaki pek çok hatayı yakalamanıza yardımcı olur. Eğer bir kodun tekrar çalışmasını istemiyorsanız, [*Efekt kodunun kendisini* o bağımlılığa "ihtiyacı olmayacak" şekilde düzenleyin.](/learn/lifecycle-of-reactive-effects#what-to-do-when-you-dont-want-to-re-synchronize)

<Pitfall>

Bağımlılık dizisinin olmaması ve *boş* `[]` bir bağımlılık dizisinin olması farklı davranışlar göstermektedir:

```js {3,7,11}
useEffect(() => {
  // Bu her render'dan sonra çalışır
});

useEffect(() => {
  // Bu sadece bileşen DOM'a eklendikten sonra çalışır (bileşen ekranda göründüğünde)
}, []);

useEffect(() => {
  // Bu hem bileşen DOM'a eklendiğinde *hem de* son render'dan itibaren a ya da b değiştiğinde çalışır
}, [a, b]);
```

"DOM'a eklenmenin (mount)" ne demek olduğuna bir sonraki adımda bakacağız.

</Pitfall>

<DeepDive>

#### ref neden bağımlılık dizisinde değildir? {/*why-was-the-ref-omitted-from-the-dependency-array*/}

Bu Efekt _hem_ `ref` _hem de_ `isPlaying` kullanmaktadır ancak yalnızca `isPlaying` bağımlılık olarak bildirilmiştir:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);
```

Bunun nedeni `ref` nesnesi *sabit bir kimliğe* sahiptir: React, her render'da aynı `useRef` çağrısından [her zaman aynı nesneyi alacağınızı](/reference/react/useRef#returns) garanti eder. Nesne hiçbir zaman değişmez bu yüzden nesne Efektin yeniden çalışmasına neden olmaz. Bu yüzden bağımlılık listesine dahil edip etmediğiniz önemli değildir. Dahil etmek de sorun yaratmaz:

```js {9}
function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);
  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying, ref]);
```

`useState`'den döndürülen [`set` fonksiyonları](/reference/react/useState#setstate) da sabit bir kimliğe sahiptir bu yüzden bağımlılık dizilerine dahil edilmediklerini sık sık görürsünüz. Eğer linter bir bağımlılığı dahil etmediğinizde hata vermiyorsa, dahil etmemeniz güvenlidir.

Sürekli-sabit olan bağımlılıkları dahil etmemek yalnızca linter nesnenin sabit olduğunu "görebildiğinde" çalışır. Örneğin, eğer `ref` üst bir elemandan iletiliyorsa, onu bağımlılık dizisinde belirtmeniz gerekmektedir. Ancak bu iyidir çünkü üst bileşenin her zaman aynı ref'i mi yoksa koşullu olarak birkaç ref'den birini mi ilettiğini bilemezsiniz. Dolayısıyla, Efektiniz hangi ref'in iletildiğine bağlı _olacaktır_.

</DeepDive>

### 3. Adım: Gerekliyse temizleme fonksiyonu ekle {/*step-3-add-cleanup-if-needed*/}

Başka bir örneği ele alalım. Ekranda göründüğünde sohbet sunucusuna bağlanması gereken bir `ChatRoom` bileşeni yazıyorsunuz. Elinizde `connect()` ve `disconnect()` metodlarını içeren bir nesne döndüren `createConnection()` API'ı var. Bileşen kullanıcı tarafında görüntülenirken bu bileşeni nasıl bağlı tutarsınız?

Efektin mantığını yazarak başlayın:

```js
useEffect(() => {
  const connection = createConnection();
  connection.connect();
});
```

Her yeniden render'dan sonra tekrar sohbete bağlanmak çok yavaş olurdu bu yüzden bağımlılık dizisi ekleyin:

```js {4}
useEffect(() => {
  const connection = createConnection();
  connection.connect();
}, []);
```

**Efekt içindeki kod herhangi bir prop ya da state kullanmıyor bu yüzden bağımlılık diziniz `[]` (boş) olacaktır. Bu React'e, bu kodu yalnızca bileşen "DOM'a eklendiğinde" çalıştırmasını söyler. Örneğin, bileşen ekranda ilk defa göründüğünde.**

Bu kodu çalıştırmayı deneyelim:

<Sandpack>

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
  }, []);
  return <h1>Sohbete hoşgeldiniz!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Gerçek bir uygulama aslında sunucuya bağlanacaktır
  return {
    connect() {
      console.log('✅ Bağlanıyor...');
    },
    disconnect() {
      console.log('❌ Bağlantı kesildi.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Bu Efekt yalnızca bileşen DOM'a eklendiğinde çalışır, bu yüzden `"✅ Bağlanıyor..."` yazısının konsola sadece bir kere yazılmasını bekleyebilirsiniz. **Ancak, eğer konsolu kontrol ederseniz, `"✅ Bağlanıyor..."` iki kere yazılmıştır. Bu niye olmakta?**

`ChatRoom` bileşeninin birçok farklı ekrana sahip daha büyük bir uygulamanın parçası olduğunu hayal edin. Kullanıcı macerasına `ChatRoom` sayfasına başlıyor. Bileşen DOM'a ekleniyor ve `connection.connect()` fonksiyonunu çağırıyor. Şimdi ise kullanıcının başka bir sayfaya örneğin Ayarlar sayfasına gittiğini düşünün. `ChatRoom` bileşeni DOM'dan kaldırılır. Son olarak, kullanıcı Geri tuşuna basar ve `ChatRoom` bileşeni tekrar DOM'a eklenir. Bu ikinci bir bağlantı kurar ancak ilk bağlantı yok edilmemişti! Kullanıcı uygulama sayfalarında gezdikçe bağlantılar birikecektir.

Bu gibi hatalar geniş manuel testler olmadan kolayca gözden kaçırılırlar. Bu hataları hızlıcı farketmeniz için geliştirme sırasında React, bileşen ilk defa DOM'a eklendikten hemen sonra o bileşeni bir kere DOM'dan kaldırır.

`"✅ Bağlanıyor..."` mesajını iki kere görmek asıl sorunu farketmenize yardımcı olur: kodunuz, bileşen DOM'dan kaldırıldığında bağlantıyı kesmemektedir.

Bu sorunu düzeltmek için, Efektinizde bir *temizleme fonksiyonu* döndürün:

```js {4-6}
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
```

React, Efektiniz yeniden çalışmadan önce her seferinde temizleme fonksiyonunuzu çağıracak ve son olarak bileşen DOM'dan kaldırıldığında çağıracaktır. Temizleme fonksiyonu yazıldığı zaman ne olduğunu görelim:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Sohbete hoşgeldiniz!</h1>;
}
```

```js src/chat.js
export function createConnection() {
  // Gerçek bir uygulama aslında sunucuya bağlanacaktır
  return {
    connect() {
      console.log('✅ Bağlanıyor...');
    },
    disconnect() {
      console.log('❌ Bağlantı kesildi.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Şimdi geliştirme sırasında üç mesaj alırsınız:

1. `"✅ Bağlanıyor..."`
2. `"❌ Bağlantı kesildi."`
3. `"✅ Bağlanıyor..."`

**Bu geliştirme sırasındaki doğru davranıştır.** React, bileşeninizi DOM'dan kaldırarak, uygulama sayfalarında ileri ve geri gitmenin kodunuzu bozmayacağını doğrular. Bağlantının kesilmesi ve yeniden bağlanılması tam da olması gerekendir! Temizleme fonksiyonunu doğru uyguladığınız zaman, Efekti bir kere çalıştırma ile çalıştırma, temizleme ve tekrar çalıştırma arasında kullanıcı tarafından görülen bir fark olmamalıdır. Burada fazladan bir bağlan/bağlantıyı kes çağrı çifti vardır çünkü React, geliştirme sırasındaki hatalar için kodunuzu araştırmaktadır. Bu normal davranıştır, ondan kurtulmaya çalışmayın!

**Son üründe, `"✅ Bağlanıyor..."` mesajını bir kere alırsınız.** Bileşenlerin DOM'dan kaldırılması yalnızca geliştirme sırasında temizleme gerektiren Efektleri bulmanıza yardımcı olmak için vardır. [Strict Modu](/reference/react/StrictMode) kapatarak geliştirme sırasındaki davranışlarından kaçınabilirsiniz ancak biz bunu açık tutmanızı tavsiye ediyoruz. Bu, yukarıdaki gibi bir çok hatayı bulmanızı sağlar.

## Geliştirme sırasında Efektin iki kere çalışması nasıl kullanılır? {/*how-to-handle-the-effect-firing-twice-in-development*/}

React, son örnekteki gibi hataları bulmak için bileşenlerinizi geliştirme sırasında kasıtlı olarak DOM'dan kaldırır ve ekler. **Doğru soru "bir Efekt nasıl bir defa çalıştırılır" değil, "Efektimi bileşen DOM'dan kaldırılıp yeniden eklendikten sonra çalışacak şekilde nasıl düzeltirim" olmalıdır.**

Genellikle doğru cevap, temizleme fonksiyonu eklemektir. Temizleme fonksiyonu, Efektin yaptığı her şeyi durdurmalı veya geri almalıdır. Temel kural, kullanıcı bir kez çalışan Efekt (son üründe olduğu gibi) ile _kurulum → temizleme → kurulum_ sekansı (geliştirme sırasında olduğu gibi) arasındaki farkı ayırt etmemelidir.

Yazacağınız Efektlerin çoğu aşağıdaki yaygın kalıplardan birine uyacaktır.

<Pitfall>

#### Effekt'lerin tetiklenmesini önlemek için refleri kullanmayın {/*dont-use-refs-to-prevent-effects-from-firing*/}

A common pitfall for preventing Effects firing twice in development is to use a `ref` to prevent the Effect from running more than once. For example, you could "fix" the above bug with a `useRef`:

```js {1,3-4}
  const connectionRef = useRef(null);
  useEffect(() => {
    // 🚩 This wont fix the bug!!!
    if (!connectionRef.current) {
      connectionRef.current = createConnection();
      connectionRef.current.connect();
    }
  }, []);
```

This makes it so you only see `"✅ Connecting..."` once in development, but it doesn't fix the bug.

When the user navigates away, the connection still isn't closed and when they navigate back, a new connection is created. As the user navigates across the app, the connections would keep piling up, the same as it would before the "fix". 

To fix the bug, it is not enough to just make the Effect run once. The effect needs to work after re-mounting, which means the connection needs to be cleaned up like in the solution above.

See the examples below for how to handle common patterns.

</Pitfall>

### React olmayan widget'ları kontrol etmek {/*controlling-non-react-widgets*/}

Bazen React'te yazılmamış UI widget'ları eklemek isteyebilirsiniz. Örneğin, sayfanıza bir harita bileşeni ekliyorsunuz. Bu harita `setZoomLevel()` metoduna sahip ve React kodunuzdaki `zoomLevel` state değişkenini yakınlaştırma seviyesi ile senkronize etmek istiyorsunuz. Efektiniz şuna benzeyecektir:

```js
useEffect(() => {
  const map = mapRef.current;
  map.setZoomLevel(zoomLevel);
}, [zoomLevel]);
```

Bu durumda temizleme fonksiyonuna ihtiyacınız yoktur. Geliştirme sırasında React, Efekti iki defa çağıracaktır ancak bu bir problem yaratmaz çünkü `setZoomLevel` metodunu aynı değer ile iki defa çağırmak hiçbir şey yapmaz. Bu biraz yavaş olabilir ancak son üründe bileşen gereksiz yere DOM'a eklenip çıkarılmadığından önemli değildir.

Bazı API'lar ard arda iki defa çağırmanıza izin vermezler. Örneğin, tarayıcıya yerleşik [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement) elemanının [`showModal`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) metodu iki kez çağırılamaz. Temizleme fonksiyonunu yazarak modal dialog'unu kapatmasını sağlayın:

```js {4}
useEffect(() => {
  const dialog = dialogRef.current;
  dialog.showModal();
  return () => dialog.close();
}, []);
```

Geliştirme sırasında, Efektiniz `showModal()` fonksiyonunu çağıracaktır, hemen ardından `close()` çağırılacaktır, son olarak yine `showModal()` çağırılacaktır. Bu, son üründe görebileceğiniz gibi, `showModal()`'ın bir kez çağırılmasıyla kullanıcı tarafından görülen aynı davraşına sahiptir.

### Olaylara abone olma {/*subscribing-to-events*/}

Eğer Efektiniz bir şeye abone oluyorsa (subscribe), temizleme fonksiyonu abonelikten çıkarmalıdır:

```js {6}
useEffect(() => {
  function handleScroll(e) {
    console.log(window.scrollX, window.scrollY);
  }
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

Geliştirme sırasında, Efektiniz `addEventListener()`'ı çağıracaktır, hemen ardından `removeEventListener()` çağırılacaktır, ve ardından aynı yöneticiyle tekrar `addEventListener()` çağırılacaktır. Yani aynı anda yalnızca bir aktif abonelik olacaktır. Bu, son üründe görebileceğiniz gibi, `addEventListener()`'ın bir kez çağırılmasıyla kullanıcı tarafından görülen aynı davranışa sahiptir.

### Animasyonları tetikleme {/*triggering-animations*/}

Efektiniz bir şeye animasyon ekliyorsa, temizleme fonksiyonu o animasyonu başlangıç değerlerine sıfırlamalıdır:

```js {4-6}
useEffect(() => {
  const node = ref.current;
  node.style.opacity = 1; // Animasyonu tetikler
  return () => {
    node.style.opacity = 0; // Başlangıç değerlerine sıfırlar
  };
}, []);
```

Geliştirme sırasında, opaklık (opacity) `1` olacaktır, daha sonra `0`, ardından tekrar `1` olacaktır. Bu, son üründe görebileceğiniz gibi, opaklık değerinin `1`'e eşitlenmesi kullanıcı tarafından görülen aynı davranışa sahiptir. Eğer ara doldurma (tweening) destekli üçüncü parti bir animasyon kütüphanesini kullanıyorsanız, temizleme fonksiyonunuz zaman çizelgesini başlangıç state'ine sıfırlamalıdır.

### Veri getirme {/*fetching-data*/}

Efektiniz bir veri getiriyorsa, temizleme fonksiyonunuz ya [veri getirmeye iptal etmeli](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) ya da getirilen sonucu yok saymalıdır:

```js {2,6,13-15}
useEffect(() => {
  let ignore = false;

  async function startFetching() {
    const json = await fetchTodos(userId);
    if (!ignore) {
      setTodos(json);
    }
  }

  startFetching();

  return () => {
    ignore = true;
  };
}, [userId]);
```

Çoktan gerçekleştirilmiş bir ağ isteği "geri alınamaz" ama temizleme işleviniz  _artık alakalı olmayan_ bir veri getirme işleminin uygulamanızı etkilemesini engellemelidir. `userId`, `'Alice'`'ten `'Bob'`'a değişirse, temizleme fonksiyonu, `'Alice'` yanıtı `'Bob'`'tan önce gelse bile `'Alice'` yanıtının göz ardı edilmesini sağlar.

**Geliştirme sırasında, Network sekmesinde (developer tools) iki veri getirme işlemi göreceksiniz.** Bunda hiçbir sorun yok. Yukarıdaki yaklaşımla, ilk Efekt hemen temizlenecek ve böylece `ignore` değişkeninin kopyası `true` olacaktır. Yani fazladan bir istek olsa bile, `if (!ignore)` ifadesi sayesinde state'i etkilemeyecektir.

**Son üründe, sadece tek bir istek olacaktır.** Geliştirme sırasındaki ikinci istek sizi rahatsız ediyorsa, en iyi yaklaşım, istekleri tekilleştiren ve sonuçlarını bileşenler arasında önbelleğe alan bir çözüm kullanmaktır:

```js
function TodoList() {
  const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
  // ...
```

Bu sadece geliştirme deneyimini iyileştirmekle kalmaz aynı zamanda uygulamanız daha hızlı çalıştığını hissettirir. Örneğin, Geri butonuna basan bir kullanıcının, önbelleğe alınacağı için bazı verileri beklemesine gerek kalmayacaktır. Böyle bir önbelleği kendiniz yapabilir ya da Efektte manuel olarak veri getirmeye yardımcı olan pek çok alternatiften birini kullanabilirsiniz.

<DeepDive>

#### Efektte veri getirmenin iyi alternatifleri nelerdir? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Efektler içinde `veri getirme` çağrıları yazmak özellikle tamamen kullanıcı taraflı uygulamalarda [veri getirmenin popüler bir yoludur](https://www.robinwieruch.de/react-hooks-fetch-data/). Ancak bu, oldukça manuel bir yaklaşımdır ve önemli dezavantajları vardır:

- **Efektler sunucuda çalışmazlar.** Bu, sunucu tarafından render edilen ilk HTML'in veri içermeyen bir yükleme state'ini içereceği anlamına gelir. Kullanıcı bilgisayarının tüm bu JavaScript'i indirmesi ve uygulamanızın verileri yüklemesi gerektiğini keşfetmesi için render etmesi gerekecektir. Bu çok verimli bir yol değildir.
- **Doğrudan Efekt ile veri getirmek, "ağ şelaleleri (waterfalls) oluşturmayı kolaylaştırır."** Üst bileşeni render edersiniz, o bileşen veri getirir, alt bileşenleri render eder, daha sonra o bileşenler kendi verilerini getirmeye başlarlar. Eğer internet bağlantınız hızlı değilse, verileri paralel olarak getirmeye göre önemli derecede yavaştır.
- **Doğrudan Efekt ile veri getirmek, genellikle verileri önceden yüklememeniz veya önbelleğe almamanız anlamına gelir.** Örneğin, bileşen DOM'dan kaldırılır ve sonra tekrar DOM'a eklenirse, bileşen aynı veriyi tekrar getirmek zorundadır.
- **Ergonomik değildir.** [Yarış koşulları](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) gibi hatalardan zarar görmeyecek şekilde `fetch` çağrıları yaparken oldukça fazla genel hatlarıyla (boilerplate) kod yazmanız gerekmektedir.

Bu dezavantajlar listesi React'e özel değildir. Bu, herhangi bir kütüphane ile DOM'a eklenme sırasında yapılan veri getirme için geçerlidir. Yönlendirme (routing) de olduğu gibi, veri getirmenin de başarılı şekilde yapılması kolay değildir. Bu nedenle aşağıdaki yaklaşımları önermekteyiz:

<<<<<<< HEAD
- **Bir [framework](/learn/creating-a-react-app#full-stack-frameworks) kullanıyorsanız, yerleşik data fetch mekanizmasını kullanın.** Modern React framework'leri, verimli olan ve yukarıdaki tuzaklardan muzdarip olmayan entegre data fetch mekanizmalarına sahiptir.
- **Aksi takdirde, istemci taraflı bir cache kullanmayı veya oluşturmayı düşünebilirsiniz.** Popüler açık kaynak çözümleri arasında [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/) ve [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) bulunmaktadır. Kendi çözümünüzü de oluşturabilirsiniz, bu durumda kaputun altındaki *Effects*'i kullanırsınız, ancak istekleri tekilleştirmek, yanıtları önbelleğe almak ve ağ şelalelerinden kaçınmak için mantık eklersiniz (verileri önceden yükleyerek veya veri gereksinimlerini rotalara kaldırarak).
=======
- **If you use a [framework](/learn/start-a-new-react-project#full-stack-frameworks), use its built-in data fetching mechanism.** Modern React frameworks have integrated data fetching mechanisms that are efficient and don't suffer from the above pitfalls.
- **Otherwise, consider using or building a client-side cache.** Popular open source solutions include [React Query](https://tanstack.com/query/latest), [useSWR](https://swr.vercel.app/), and [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) You can build your own solution too, in which case you would use Effects under the hood, but add logic for deduplicating requests, caching responses, and avoiding network waterfalls (by preloading data or hoisting data requirements to routes).
>>>>>>> e07ac94bc2c1ffd817b13930977be93325e5bea9

Eğer bu yaklaşımlardan hiçbiri size uymuyorsa, Efektler içinde veri getirmeye devam edebilirsiniz.

</DeepDive>

### Analizleri gönderme {/*sending-analytics*/}

Sayfa ziyaretinde analiz gönderen bu kodu düşünün:

```js
useEffect(() => {
  logVisit(url); // POST isteği gönderir
}, [url]);
```

Geliştirme sırasında, `logVisit` fonksiyonu her URL için iki defa çağrılacaktır, bu yüzden bunu düzeltmeye çalışabilirsiniz. **Bu kodu olduğu gibi bırakmanızı öneririz.** Önceki örneklerde olduğu gibi, bir kez çalıştırmak ile iki kez çalıştırmak arasında *kullanıcının görebileceği* bir davranış farkı yoktur. Pratik açıdan, `logVisit` geliştirme sırasında hiçbir şey yapmamalılıdır çünkü geliştirme makinelerinden gelen bilgilerin son üründeki ölçümleri çarpıtmasını istemezsiniz. Bileşeniniz dosyasını her kaydettiğiniz sefer DOM'dan çıkarılıp/eklenir, bu yüzden zaten geliştirme sırasındaki ekstra ziyaretleri kaydeder.

**Son üründe, kopyalanmış ziyaret kayıtları olmayacaktır.**

Gönderdiğiniz analiz olaylarını debug etmek (hatayı düzeltmek) için, uygulamanızı bir hazırlama ortamına (son ürün modunda çalışan) veya [Strict Mode](/reference/react/StrictMode) ve yalnızca geliştirme sırasındaki DOM'dan çıkarıp/ekleme kontrollerini geçici olarak devre dışı bırakabilirsiniz. Efektler yerine yol (route) değişikliği olay yöneticilerinden de analizleri gönderebilirsiniz. Daha kesin analizler için, [kesişme gözlemcileri (intersection observers)](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), görünüm alanında hangi bileşenlerin olduğunu ve bu bileşenlerin ne kadar süre görünür kaldıklarını izlemeye yardımcı olabilir.

### Efekt değil: Uygulamanın başlatılması {/*not-an-effect-initializing-the-application*/}

Yazdığınız bazı mantıklar uygulama başlatıldığında yalnızca bir kez çalışmalıdır. Bu mantıkları bileşenlerinizin dışına koyabilirsiniz:

```js {2-3}
if (typeof window !== 'undefined') { // Tarayıcıda çalışıp çalışmadığımızı kontrol et
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() {
  // ...
}
```

Bu, böyle bir mantığın, tarayıcı sayfayı yükledikten sonra yalnızca bir defa çalışacağını garanti eder.

### Efekt değil: Ürün satın alma {/*not-an-effect-buying-a-product*/}

Bazen, temizleme fonksiyonu yazsanız bile, Efektin iki kez çalıştırılmasından dolayı kullanıcının görebileceği sonuçları önlemenin bir yolu yoktur. Örneğin, belki Efektiniz ürün satın almak için bir POST isteği gönderiyor:

```js {2-3}
useEffect(() => {
  // 🔴 Yanlış: Bu Efekt geliştirme sırasında iki kez çalışır, koddaki bir problemi ortaya çıkarır.
  fetch('/api/buy', { method: 'POST' });
}, []);
```

Ürünü iki defa almak istemezsiniz. Ancak, bu yüzden de bu mantığı Efektin içine koymamalısınız. Ya kullanıcı başka bir sayfaya giderse ve Geri butonuna basarsa? Efektiniz tekrardan çalışacaktır. Ürünü kullanıcı sayfayı *ziyaret* ettiğinde değil, kullanıcı Satın Al butonuna *bastığında* almak istersiniz.

Satın almak render etmekten değil, spesifik bir etkileşimden kaynaklanmaktadır. Yalnızca kullanıcı butona bastığında çalışmalıdır. **Efekti silin ve `/api/buy` isteğini Satın Al butonu olay yöneticisine taşıyın:**

```js {2-3}
  function handleClick() {
    // ✅ Satın almak bir olaydır çünkü spesifik bir etkileşimden kaynaklanmaktadır.
    fetch('/api/buy', { method: 'POST' });
  }
```

**Bu, eğer DOM'dan çıkarıp/eklemek uygulamanızın mantığını bozarsa, bunun genellikle mevcut hataları ortaya çıkaracağını gösterir.** Kullanıcı açısından, bir sayfayı ziyaret etmek, o sayfayı ziyaret etmekten, bir bağlantıya tıklayıp Geri butonuna basmaktan farklı olmamalıdır. React, geliştirme sırasında bileşenleri bir kez DOM'dan çıkarıp/ekleyerek bileşenlerinizin bu prensibe uyduğunu doğrular.

## Hepsini bir araya koyma {/*putting-it-all-together*/}

Bu örnek, Efektlerin pratikte nasıl çalıştığına dair "bir fikir edinmenize" yardımcı olabilir.

Bu örnek, input metinini içeren bir konsol mesajını Efekt çalıştıktan üç saniye sonra görünecek şekilde planlamak için [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout) API'ını kullanır. Temizleme fonksiyonu bekleyen zaman aşımını iptal eder. "Bileşeni DOM'a ekle" butonuna basarak başlayın:

<Sandpack>

```js
import { useState, useEffect } from 'react';

function Playground() {
  const [text, setText] = useState('a');

  useEffect(() => {
    function onTimeout() {
      console.log('⏰ ' + text);
    }

    console.log('🔵 "' + text + '" metnini planla');
    const timeoutId = setTimeout(onTimeout, 3000);

    return () => {
      console.log('🟡 "' + text + '" metnini iptal et');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        Ne yazılmalı:{' '}
        <input
          value={text}
          onChange={e => setText(e.target.value)}
        />
      </label>
      <h1>{text}</h1>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        Bileşeni {show ? "DOM'dan çıkar" : "DOM'a ekle"}
      </button>
      {show && <hr />}
      {show && <Playground />}
    </>
  );
}
```

</Sandpack>

İlk başta üç mesaj göreceksiniz: `"a" mesajını planla`, `"a" mesajını iptal et` ve tekrardan `"a" mesajını planla`. Üç saniye sonra `a` yazan başka bir mesaj olacaktır. Daha önce öğrendiğiniz gibi, fazladan planla/iptal et işlemi, React'in geliştirme sırasında, temizleme fonksiyonunu doğru yazdığınızı kontrol etmek amacıyla bileşeni DOM'dan çıkarıp/eklemesidir.

Input'u `abc` olarak düzenleyin. Eğer bunu yeterince hızlı yaparsanız, `"ab" mesajını planla`'dan hemen sonra `"ab" mesajını iptal et` ve `"abc" mesajını planla` mesajlarını göreceksiniz. **React her zaman bir sonraki render'ın Efektinden önce bir önceki render'ın Efektini temizler.** Bu yüzden input'a hızlı yazsanız bile, aynı anda en fazla bir zaman aşımı planlanmıştır. Efektlerin nasıl temizlendiğini anlayabilmek için input'u düzenleyin ve konsolu inceleyin.

Input'a bir şeyler yazın ve hemen ardından "Bileşeni DOM'dan kaldır" butonuna basın. Bileşeni DOM'dan kaldırmanın nasıl son render'ın Efektini temizlediğine dikkat edin. Burada, tetikleme şansı bulamadan son zaman aşımını temizler.

Son olarak, zaman aşımlarının iptal edilmemesi için yukırdaki bileşeni düzenleyin ve temizleme fonksiyonunu devre dışı bırakın. Hızlı şekilde `abcde` yazmaya çalışın. Üç saniye içinde ne olmasını bekliyorsunuz? Zaman aşımı içindeki `console.log(text)` ifadesi *son* `text`'i ve beş tane `abcde` mesajı mı yazdıracaktır? Bir deneyip ne olacağını görün!

Üç saniye sonra, beş `abcde` mesajı yerine bir seri (`a`, `ab`, `abc`, `abcd`, ve `abcde`) mesajı göreceksiniz. **Her Efekt, karşılık gelen render'ın `text` değerini *yakalar*.** `text` state'inin değişmesi önemli değildir: `text = 'ab'` ile oluşan render'ın Efekti her zaman `'ab'` ifadesini görecektir. Diğer bir deyişle, her bir render'ın Efekti birbirinden izole bir şekildedir. Eğer bunun nasıl çalıştığını merak ediyorsanız, [closure'ler](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) hakkında bilgi alabilirsiniz.

<DeepDive>

#### Her bir render'ın kendi Efekti vardır {/*each-render-has-its-own-effects*/}

`useEffect`'i render çıktısına bir davranış parçasının "iliştirilmesi" olarak düşünebilirsiniz. Bu Efekti düşünün:

```js
export default function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>{roomId} odasına hoşgeldiniz!</h1>;
}
```

Kullanıcı uygulama içinde gezindiğinde tam olarak neler olduğunu görelim.

#### İlk render {/*initial-render*/}

Kullanıcı `<ChatRoom roomId="genel" />` ziyaret eder. Şimdi [mental olarak](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `roomId`'yi `'genel'`olarak değiştirelim:

```js
  // İlk render için JSX (roomId = "general")
  return <h1>Genel odasına hoşgeldiniz!</h1>;
```

**Efekt *aynı zamanda* render çıktısının bir parçasıdır.** İlk render'ın Efekti şöyle olur:

```js
  // İlk render için Efekt (roomId = "genel")
  () => {
    const connection = createConnection('genel');
    connection.connect();
    return () => connection.disconnect();
  },
  // İlk render için bağımlılıklar (roomId = "genel")
  ['genel']
```

React `'genel'` sohbet odasına bağlanan Efekti çalıştırır.

#### Aynı bağımlılıklar ile yeniden render etme {/*re-render-with-same-dependencies*/}

Diyelim ki `<ChatRoom roomId="genel" />` yeniden render edilmektedir. JSX çıktısı aynıdır:

```js
  // İkinci render için JSX (roomId = "genel")
  return <h1>Genel odasına hoşgeldiniz!</h1>;
```

React render edilen çıktının değişmediğini görecektir bu yüzden DOM'u güncellemez.

İkinci render'ın Efekti şöyle gözükmektedir:

```js
  // İkinci render için Efekt (roomId = "genel")
  () => {
    const connection = createConnection('genel');
    connection.connect();
    return () => connection.disconnect();
  },
  // İkinci render için bağımlılıklar (roomId = "genel")
  ['genel']
```

React, ilk render'dan `['genel']` ile ikinci render'dan `['genel']`'i kıyaslar. **Tüm bağımlılıkların aynı olmasından dolayı, React ikinci render'daki Efekti *görmezden gelecektir.*** İkinci olan asla çağırılmaz.

#### Farklı bağımlılıklar ile yeniden render etme {/*re-render-with-different-dependencies*/}

Daha sonra, kullanıcı `<ChatRoom roomId="seyahat" />` ziyaret eder. Bu sefer, bileşen başka bir JSX döndürür:

```js
  // Üçüncü render için JSX (roomId = "seyahat")
  return <h1>Seyahat odasına hoşgeldiniz!</h1>;
```

React, `"Genel odasına hoşgeldiniz"` yazısını `"Seyahat odasına hoşgeldiniz"` olarak değiştirmek için DOM'u günceller.

Üçüncü render'ın Efekti şu şekilde gözükmektedir:

```js
  // Üçüncü render için Effect (roomId = "seyahat")
  () => {
    const connection = createConnection('seyahat');
    connection.connect();
    return () => connection.disconnect();
  },
  // Üçüncü render için bağımlılıklar (roomId = "seyahat")
  ['seyahat']
```

React, ikinci render'dan `['genel']` ile üçüncü render'dan `['seyahat']`'i kıyaslar. Bir bağımlılık farklı: `Object.is('seyahat', 'genel')` `false` olur. Efekt devreye girer.

**React üçüncü render'daki Efekti uygulamadan önce, en son _çalışan_ Efekti temizlemelidir.** İkinci render'ın Efekti atlandığından dolayı React'in ilk render'ın Efektini temizlemesi gerekmektedir. Eğer ilk render'a bakacak olursanız, ilk render'ın temizleme fonksiyonunun `createConnection('genel')` ile yapılmış olan bağlantıda `disconnect()` fonksiyonunu çağırdığını göreceksiniz. Böylelikle uygulama `'genel'` sohbet odasıyla bağlantıyı koparacaktır.

Bundan sonra, React üçüncü render'ın Efektini çalıştırır. Uygulama `'seyahat'` sohbet odasına bağlanır.

#### DOM'dan kaldırma {/*unmount*/}

Son olarak, diyelim ki kullanıcı başka sayfaları ziyaret eder ve `ChatRoom` bileşeni DOM'dan kaldırılır. React son Efektin temizleme fonksiyonunu çalıştırır. Son Efekt üçüncü render'ın Efektiydi. Üçüncü render'ın temizleme fonksiyonu `createConnection('seyahat')` bağlantısını koparır. Yani uygulama `'seyahat'` odasıyla bağlantısını koparır.

#### Sadece geliştirme sırasında olan davranışlar {/*development-only-behaviors*/}

[Strict modu](/reference/react/StrictMode) açıkken, React her bir bileşeni DOM'a ekledikten sonra DOM'dan kaldırır (state ve DOM korunur). Bu, [temizleme fonksiyonu gereken Efektleri bulmanıza yardımcı olur](#step-3-add-cleanup-if-needed) ve yarış koşulları gibi hataları erken ortaya çıkarır. Ek olarak, geliştirme sırasında dosyayı her kaydettiğiniz zaman React, Efektleri DOM'dan çıkarıp/ekleyecektir. Bu her iki davranışta sadece geliştirme sırasında olmaktadır.

</DeepDive>

<Recap>

- Olayların aksine, Efektler belirli bir etkileşim sonucu değil de render etmenin kendisinden kaynaklanmaktadır.
- Efektler bir bileşeni bir harici sistem ile senkronize etmenizi sağlar (üçüncü parti API, ağ vb).
- Varsayılan olarak, Efektler her render'dan sonra çalışır (ilk render'da dahil).
- Eğer Efektin bağımlılıklarının değerleri son yapılan render'da değişmemişse React Efekti çalıştırmayacaktır.
- Bağımlılıklarınızı "seçemezsiniz". Bağımlılıklar Efekt içindeki koda bağlı olarak belirlenir.
- Boş bağımlılık dizisi (`[]`) bileşen "DOM'a ekleniyor" demektir, örneğin bileşenin ekrana eklenmesi.
- Strict modundayken, React  bileşenleri DOM'a Efektlerinize stres testi yapmak için iki defa ekler (sadece geliştirme sırasında!).
- Efektiniz DOM'dan çıkarılıp/eklenme aşamasında uygulamanızı bozuyorsa, bir temizleme fonksiyonu yazmanız gerekmektedir.
- React temizleme fonksiyonunuzu Efektin bir sonraki çalışmasından önce ve DOM'dan çıkarılma aşamasına çağıracaktır.

</Recap>

<Challenges>

#### Bileşen DOM'a eklendiğinde alana odaklanma {/*focus-a-field-on-mount*/}

Bu örnekte, form, `<MyInput />` bileşenini render etmektedir.

Input'un [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) metodunu kullanarak `MyInput` bileşeni ekranda göründüğünde input alanına otomatik olarak odaklanmasını sağlayın. Halihazırda yorum satırı içine alınmış bir örnek var ancak tam olarak çalışmamakta. Niye çalışmadığını bulun ve düzeltin. (Eğer `autoFocus`'u biliyorsanız, yokmuş gibi davranın: aynı işlevselliği sıfırdan yeniden yazıyoruz.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  // YAPILACAK: Bu tam olarak çalışmamakta. Düzeltin.
  // ref.current.focus()    

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>Formu {show ? 'Gizle' : 'Göster'}</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Adınızı girin:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Büyük harf yap
          </label>
          <p>Selam, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>


Çözümünüzün çalıştığını doğrulamak için "Formu göster" butonuna tıklayın ve input'a odaklandığını kontrol edin (input alanı farklı renk alır ve içine imleç yerleştirilir). "Formu gizle" ve "Formu göster" butonuna tıklayın. Input alanına yeniden odaklandığını kontrol edin.

`MyInput` her render'dan sonra değil sadece _DOM'a eklendiğinde_ odaklanmalıdır. Bu davranışın çalıştığını doğrulamak için "Formu göster" butonuna tıklayın ve ardından "Büyük harf yap" kutucuğuna birkaç defa tıklayın. Kutucuğa tıklamak yukarıdaki input'a _odaklamamalıdır_.

<Solution>

`ref.current.focus()` ifadesini render esnasında çağırmak yanlıştır çünkü bu bir *yan etkidir*. Yan etkiler ya bir olay yöneticisi içinde olmalı ya da `useEffect` ile bildirilmelidir. Bu durumda yan etki, belirli bir etkileşimin aksine bileşenin ekranda gözükmesinden dolayı _kaynaklanmaktadır_ bu yüzden bu kodu Efektin içine koymak mantıklıdır.

Hatayı düzeltmek için, `ref.current.focus()` çağrısını bildirdiğiniz bir Efektin içine koyun. Daha sonra, bu Efektin her render'dan sonra değil de sadece DOM'a eklendikten sonra çalışmasını sağlamak için boş `[]` bağımlılık dizisini ekleyin.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('Taylor');
  const [upper, setUpper] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>Formu {show ? 'Gizle' : 'Göster'}</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Adınızı girin:
            <MyInput
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={upper}
              onChange={e => setUpper(e.target.checked)}
            />
            Büyük harf yap
          </label>
          <p>Selam, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### Koşullu olarak alana odaklanma {/*focus-a-field-conditionally*/}

Bu form iki `<MyInput />` bileşeni render etmektedir.

"Formu göster" butonuna tıklayın ve ikinci alana otomatik olarak odaklandığını görün. Bunun nedeni, her iki `<MyInput />` bileşeni de alana odaklanmaya çalışmaktadır. İki input alanı için ard arda `focus()` metodunu çağırdığınızda en son yapılan çağrı her zaman "kazanacaktır".

Diyelim ki ilk alana odaklanmak istiyorsunuz. Şimdi ilk `MyInput` bileşeni bir `true` boolean `shouldFocus` prop'u almaktadır. Mantığı, `focus()`'un  yalnızca `MyInput` tarafından alınan `shouldFocus` prop'unun `true` olması durumunda çağrılmasını sağlayacak şekilde değiştirin.

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  // YAPILACAK: focus() metodunu yalnızca shouldFocus "true" ise çağır.
  useEffect(() => {
    ref.current.focus();
  }, []);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>Formu {show ? 'Gizle' : 'Göster'}</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Adınızı girin:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Soyadınızı girin:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Selam, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Çözümünüzü doğrulamak için, "Formu göster" ve "Formu gizle" butonlarına tekrar tekrar tıklayın. Form ekranda gözüktüğünde sadece *ilk* input alanına odaklanmalıdır. Bunun nedeni, üst bileşenin ilk input'u `shouldFocus={true}` olarak ve ikinci input'u `shouldFocus={false}` olarak render etmesidir. Ayrıca her iki input alanının da hala çalışıp çalışmadığını ve her ikisine de yazabildiğinizi kontrol edin.

<Hint>

Efektiniz koşullu ifadeler içerebilir ancak koşullu olarak bir Efekt bildiremezsiniz.

</Hint>

<Solution>

Koşullu ifadeyi Efekt içine koyun. `shouldFocus`'u bağımlılık olarak bildirmeniz gerekmektedir çünkü Efektiniz içinde bu prop'u kullanmaktasınız. (Bu demektir ki eğer bir input'un `shouldFocus` prop'u `false`'tan `true`'ya değişirse, input DOM'a eklendikten sonra odaklanacaktır.)

<Sandpack>

```js src/MyInput.js active
import { useEffect, useRef } from 'react';

export default function MyInput({ shouldFocus, value, onChange }) {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus) {
      ref.current.focus();
    }
  }, [shouldFocus]);

  return (
    <input
      ref={ref}
      value={value}
      onChange={onChange}
    />
  );
}
```

```js src/App.js hidden
import { useState } from 'react';
import MyInput from './MyInput.js';

export default function Form() {
  const [show, setShow] = useState(false);
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  const [upper, setUpper] = useState(false);
  const name = firstName + ' ' + lastName;
  return (
    <>
      <button onClick={() => setShow(s => !s)}>Formu {show ? 'Gizle' : 'Göster'}</button>
      <br />
      <hr />
      {show && (
        <>
          <label>
            Adınızı girin:
            <MyInput
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              shouldFocus={true}
            />
          </label>
          <label>
            Soyadınızı girin:
            <MyInput
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              shouldFocus={false}
            />
          </label>
          <p>Selam, <b>{upper ? name.toUpperCase() : name}</b></p>
        </>
      )}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

</Solution>

#### İki kere tetiklenen interval'i düzelt {/*fix-an-interval-that-fires-twice*/}

Bu `Counter` bileşeni her saniye artması gereken bir sayaç göstermektedir. DOM'a eklendiğinde [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) çağrılır. Bu `onTick` fonksiyonunun her saniye çalışmasını sağlar. `onTick` fonksiyonu sayacı bir artırır.

Ancak, sayaç saniyede bir artmak yerine iki artmaktadır. Neden böyle? Hatanın sebebini bulun ve düzeltin.

<Hint>

`setInterval`'in interval'i durdurmak için [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) fonksiyonuna iletebileceğiniz bir interval ID döndürdüğünü unutmayın.

</Hint>

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    setInterval(onTick, 1000);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function Form() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>Sayacı {show ? 'Gizle' : 'Göster'}</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

<Solution>

[Strict modu](/reference/react/StrictMode) açıkken (bu sitedeki sandbox'lar gibi), React her bileşeni geliştirme sırasında bir defa DOM'dan çıkarıp/ekler. Bu interval'in iki defa kurulmasına neden olur ve her saniye sayaç iki artar.

Ancak, hatanın kaynağı React'in bu davranışı değildir: hata zaten kodun içindedir. React'in bu davranışı hatayı daha görünür kılar. Hatanın gerçek nedeni Efektin bir süreci başlatması ancak bu süreci temizlemek için bir fonksiyon sunmamasından kaynaklıdır.

Bu kodu düzeltmek için `setInterval` tarafından döndürülen ID'yi kaydedin ve [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval) fonksiyonunu kullanarak bir temizleme fonksiyonu yazın:

<Sandpack>

```js src/Counter.js active
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function onTick() {
      setCount(c => c + 1);
    }

    const intervalId = setInterval(onTick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <h1>{count}</h1>;
}
```

```js src/App.js hidden
import { useState } from 'react';
import Counter from './Counter.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(s => !s)}>Sayacı {show ? 'Gizle' : 'Göster'}</button>
      <br />
      <hr />
      {show && <Counter />}
    </>
  );
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Geliştirme sırasında React, temizleme fonksiyonunu doğru yazıp yazmadığınızı doğrulamak için bileşeninizi DOM'dan çıkarıp/ekleyecektir. Yani bir `setInterval` çağrısı olacak, hemen ardından `clearInterval` ve tekrar `setInterval` çağrısı gelecek. Son üründe ise sadece bir `setInterval` çağrısı olacaktır. Her iki durumda da kullanıcı tarafından görülen davranış aynıdır: sayaç her saniye bir artar.

</Solution>

#### Efekt içinde veri getirmeyi düzeltin {/*fix-fetching-inside-an-effect*/}

Bu bileşen seçilen kişinin biyografisini göstermektedir. Biyografiyi, bileşen DOM'a eklendiğinde ve `person` her değiştiğinde eşzamansız (async) bir `fetchBio(person)` fonksiyonu çağırarak yükler. Bu eşzamansız fonksiyon, en sonda bir string'e çözümlenen bir [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) döndürür. Veri getirme işlemi tamamlandığında, `setBio` fonksiyonu çağrılır ve string seçim kutusunun altında gösterilir.

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    setBio(null);
    fetchBio(person).then(result => {
      setBio(result);
    });
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Yükleniyor...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Bu ' + person + '’un biyografisidir.');
    }, delay);
  })
}

```

</Sandpack>


Bu kodda bir hata bulunmaktadır. "Alice" seçerek başlayın. Ardından "Bob" kişisini seçin ve hemen ardında "Taylor" kişisini seçin. Eğer bunu yeterince hızlı yaparsanız, hatayı farkedeceksiniz: Taylor seçiliydi ancak alttaki paragrafta "Bu Bob'un biyografisi." yazmaktadır.

Bu neden olmakta? Efektin içindeki hatayı düzeltin.

<Hint>

Eğer bir Efekt eşzamansız olarak veri getiriyorsa, çoğu zaman temizleme fonksiyonu gereklidir.

</Hint>

<Solution>

Hatayı tetiklemek için, her şeyin bu sırayla gerçekleşmesi gereklidir:

- `'Bob'` seçeneğini seçmek `fetchBio('Bob')` fonksiyonunu tetikler
- `'Taylor'` seçeneğini seçmek `fetchBio('Taylor')` fonksiyonunu tetikler
- **`'Taylor'` verisi `'Bob'` verisinden *önce* getirilir**
- `'Taylor'` render'ının Efekti `setBio('Bu Taylor'ın biyografisidir.')` fonksiyonunu çağırır
- `'Bob'` verisi getirilir
- `'Bob'` render'ının Efekti `setBio('Bu Bob'un biyografisidir.')` fonksiyonunu çağırır

Bu yüzden Taylor seçili olmasına rağmen Bob'un biyografisini görürsünüz. Bunun gibi hatalar [yarış koşulları](https://en.wikipedia.org/wiki/Race_condition) olarak adlandırılmaktadır çünkü iki eşzamansız operasyon birbirleriyle "yarışmaktadır" ve beklenmedik bir sırada varabilirler.

Yarış koşullarını düzeltmek için bir temizleme fonksiyonu ekleyin:

<Sandpack>

```js src/App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Yükleniyor...'}</i></p>
    </>
  );
}
```

```js src/api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('Bu ' + person + '’un biyografisi.');
    }, delay);
  })
}

```

</Sandpack>

Her render'ın Efekti kendi `ignore` değişkenine sahiptir. İlk olarak, `ignore` değişkeninin değeri `false` olur. Ancak, Efekt temizlenirse (farklı bir kişi seçtiğiniz zaman), `ignore` değişkeninin değeri `true` olur. Bu yüzden şimdi isteklerin hangi sırada tamamlandığının bir önemi yoktur. Sadece son kişinin Efektinin `ignore` değişkeninin değeri `false` olur, bu yüzden `setBio(result)` fonksiyonu çağırılacaktır. Geçmiş Efektler temizlenmiştir, yani `if (!ignore)` koşulu `setBio` fonksiyonunun çağırılmasını engelleyecektir:

- `'Bob'` kişisini seçmek `fetchBio('Bob')` fonksiyonunu tetikler
- `'Taylor'` kişisini seçmek `fetchBio('Taylor')` fonksiyonunu tetikler **ve bir önceki Efekti temizler (Bob'un Efekti)**
- `'Taylor'` verisi `'Bob'` verisinden *önce* getirilir 
- `'Taylor'` render'ının Efekti `setBio('Bu Taylor'ın biyografisidir.')` fonksiyonunu çağırır
- `'Bob'` verisi getirilir
- `'Bob'` render'ının Efekti **`ignore` değişkeninin değeri `true` olduğu için hiçbir şey yapmaz**

Güncelliğini yitirmiş bir API çağrısının sonucunu göz ardı etmenin yanı sıra, artık ihtiyacınız olmayan istekler için[`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) API'ını da kullanabilirsiniz. Ancak bu tek başına yarış koşullarına karşı koruma sağlamak için yeterli değildir. Veri getirme işleminden sonra daha fazla eşzamansız işlem yapılabilir, bu nedenle `ignore` gibi bir değişken kullanmak bu tür sorunları çözmenin en güvenilir yoludur.

</Solution>

</Challenges>

