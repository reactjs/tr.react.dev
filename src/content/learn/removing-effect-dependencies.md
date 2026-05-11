---
title: 'Efekt Bağımlılıklarını Kaldırma'
---

<Intro>

Bir Efekt yazdığınızda, linter, Efektin okuduğu her reaktif değeri (props ve state gibi) Efektinizin bağımlılıkları listesine dahil ettiğinizi doğrular. Bu, Efektinizin bileşeninizin en son prop'ları ve state'i ile senkronize kalmasını sağlar. Gereksiz bağımlılıklar, Efektinizin çok sık çalışmasına ve hatta sonsuz bir döngü oluşturmasına neden olabilir. Gereksiz bağımlılıkları gözden geçirmek ve Efektlerinizden kaldırmak için bu kılavuzu izleyin.

</Intro>

<YouWillLearn>

- Sonsuz efekt bağımlılık döngüleri nasıl düzeltilir
- Bir bağımlılığı kaldırmak istediğinizde ne yapmalısınız
- Efektinizden bir değeri ona "tepki vermeden" nasıl okuyabilirsiniz
- Nesne ve fonksiyon bağımlılıklarından nasıl ve neden kaçınılır
- Bağımlılık linterini bastırmak neden tehlikelidir ve bunun yerine ne yapılmalıdır

</YouWillLearn>

## Bağımlılıklar kod ile eşleşmelidir {/*dependencies-should-match-the-code*/}

Bir Efekt yazdığınızda, ilk olarak Efektinizin yapmasını istediğiniz şeyi nasıl [başlatacağınızı ve durduracağınızı](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect) belirtirsiniz:

```js {5-7}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  	// ...
}
```

Ardından, efekt bağımlılıklarını boş bırakırsanız (`[]`), linter doğru bağımlılıkları önerecektir:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Buradaki hatayı düzeltin!
  return <h1>{roomId} odasına hoş geldiniz!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="seyehat">Seyehat</option>
          <option value="müzik">Müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  return {
    connect() {
      console.log('✅ "' + roomId + '" odasına ' + serverUrl + ' adresinde bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" odasından ' + serverUrl + ' adresinden bağlantı kesildi');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Bunları linterin söylediğine göre doldurun:

```js {6}
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
}
```

[Efektler reaktif değerlere "tepki verir"](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) `roomId` reaktif bir değer olduğundan (yeniden renderlama nedeniyle değişebilir), linter bunu bir bağımlılık olarak belirttiğinizi doğrular. Eğer `roomId` farklı bir değer alırsa, React Efektinizi yeniden senkronize edecektir. Bu, sohbetin seçilen odaya bağlı kalmasını ve açılır menüye "tepki vermesini" sağlar:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
  return <h1>{roomId} odasına hoş geldiniz!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="seyehat">Seyahat</option>
          <option value="müzik">Müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  return {
    connect() {
      console.log('✅ "' + roomId + '" odasına ' + serverUrl + ' adresinde bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" odasından ' + serverUrl + ' adresinden bağlantı kesildi');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

### Bir bağımlılığı kaldırmak için, bunun bir bağımlılık olmadığını kanıtlayın {/*to-remove-a-dependency-prove-that-its-not-a-dependency*/}

Efektinizin bağımlılıklarını "seçemeyeceğinize" dikkat edin. Efektinizin kodu tarafından kullanılan her <CodeStep step={2}>reaktif değer</CodeStep> bağımlılık listenizde bildirilmelidir. Bağımlılık listesi çevredeki kod tarafından belirlenir:

```js [[2, 3, "roomId"], [2, 5, "roomId"], [2, 8, "roomId"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) { // Bu reaktif bir değer
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Bu efekt o reaktif değeri okur
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Dolayısıyla, bu reaktif değeri Efektinizin bir bağımlılığı olarak belirtmeniz gerekir
  // ...
}
```

[Reaktif değerler](/learn/lifecycle-of-reactive-effects#all-variables-declared-in-the-component-body-are-reactive) prop'ları ve doğrudan bileşeninizin içinde bildirilen tüm değişkenleri ve fonksiyonları içerir. `roomId` reaktif bir değer olduğundan, bağımlılık listesinden kaldıramazsınız. Linter buna izin vermez:

```js {8}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect'in eksik bir bağımlılığı var: 'roomId'
  // ...
}
```

Ve linter haklı olacaktır! Zaman içinde `roomId` değişebileceğinden, bu durum kodunuzda bir hataya yol açacaktır.

**Bir bağımlılığı kaldırmak için, linter'e *bağımlılık olmasına gerek olmadığını* "kanıtlayın."** Örneğin, reaktif olmadığını ve yeniden render edildiğinde değişmeyeceğini kanıtlamak için `roomId`'yi bileşeninizin dışına taşıyabilirsiniz:

```js {2,9}
const serverUrl = 'https://localhost:1234';
const roomId = 'music'; // Artık reaktif bir değer değil

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Tüm bağımlılıklar bildirildi
  // ...
}
```

Artık `roomId` reaktif bir değer olmadığından (ve yeniden render edilmede değişemeyeceğinden), bir bağımlılık olmasına gerek yoktur:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'müzik';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>{roomId} odasına hoş geldiniz!</h1>;
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  return {
    connect() {
      console.log('✅ "' + roomId + '" odasına ' + serverUrl + ' adresinde bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" odasından ' + serverUrl + ' adresinden bağlantı kesildi');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Bu nedenle artık [boş (`[]`) bağımlılık listesi](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) belirtebilirsiniz. Efektiniz *gerçekten* artık herhangi bir reaktif değere bağlı değildir, bu nedenle *gerçekten* bileşenin herhangi bir prop'u veya state'i değiştiğinde yeniden çalıştırılması gerekmez.

### Bağımlılıkları değiştirmek için kodu değiştirin {/*to-change-the-dependencies-change-the-code*/}

İş akışınızda bir düzen fark etmiş olabilirsiniz:

1. İlk olarak, Efektinizin kodunu veya reaktif değerlerinizin nasıl beyan edildiğini **değiştirirsiniz**.
2. Ardından, linter'ı takip eder ve bağımlılıkları **değiştirdiğiniz kodla eşleşecek şekilde ayarlarsınız.**
3. Bağımlılıklar listesinden memnun değilseniz, **ilk adıma** geri dönersiniz (ve kodu tekrar değiştirirsiniz).

Son kısım önemlidir. **Bağımlılıkları değiştirmek istiyorsanız, önce çevredeki kodu değiştirin.** Bağımlılık listesini [Efekt kodunuz tarafından kullanılan tüm reaktif değerlerin bir listesi](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) olarak düşünebilirsiniz. Bu listeye ne koyacağınızı *seçmezsiniz*. Liste kodunuzu *tanımlar*. Bağımlılık listesini değiştirmek için kodu değiştirin.

Bu bir denklem çözmek gibi gelebilir. Bir hedefle başlayabilirsiniz (örneğin, bir bağımlılığı kaldırmak için) ve bu hedefle eşleşen kodu "bulmanız" gerekir. Herkes denklem çözmeyi eğlenceli bulmaz ve aynı şey Efekt yazmak için de söylenebilir! Neyse ki, aşağıda deneyebileceğiniz yaygın tariflerin bir listesi var.

<Pitfall>

Mevcut bir kod tabanınız varsa, linter'ı bu şekilde bastıran bazı Efektleriniz olabilir:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Linter'i şu şekilde bastırmaktan kaçının:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Bağımlılıklar kodla eşleşmediğinde, hataların ortaya çıkma riski çok yüksektir.** Linter'ı bastırarak, Efektinizin bağlı olduğu değerler hakkında React'e "yalan söylemiş" olursunuz.

Bunun yerine aşağıdaki teknikleri kullanın.

</Pitfall>

<DeepDive>

#### Bağımlılık linterini bastırmak neden bu kadar tehlikeli? {/*why-is-suppressing-the-dependency-linter-so-dangerous*/}

Linteri bastırmak, bulunması ve düzeltilmesi zor olan çok mantıksız hatalara yol açar. İşte bir örnek:

<Sandpack>

```js {expectedErrors: {'react-compiler': [14]}}
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  function onTick() {
	setCount(count + increment);
  }

  useEffect(() => {
    const id = setInterval(onTick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Sayaç: {count}
        <button onClick={() => setCount(0)}>Sıfırla</button>
      </h1>
      <hr />
      <p>
        Her saniye şu kadar artıyor:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Diyelim ki Efekti "sadece montajda" çalıştırmak istediniz. [Boş (`[]`) bağımlılıkların](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) bunu yaptığını okudunuz, bu yüzden linter'ı görmezden gelmeye karar verdiniz ve bağımlılıklar olarak zorla `[]` belirttiniz.

Bu sayacın her saniye iki düğme ile yapılandırılabilen miktar kadar artması gerekiyordu. Ancak, React'e bu Efektin hiçbir şeye bağlı olmadığı konusunda "yalan söylediğiniz" için, React ilk render'dan itibaren `onTick` fonksiyonunu sonsuza kadar kullanmaya devam ediyor. [Bu render sırasında,](/learn/state-as-a-snapshot#rendering-takes-a-snapshot-in-time) `count` = `0` ve `increment` = `1` idi. Bu nedenle bu render'daki `onTick` her zaman her saniye `setCount(0 + 1)` çağırır ve her zaman `1` görürsünüz. Bunun gibi hatalar birden fazla bileşene yayıldığında düzeltilmesi daha zordur.

Her zaman linter'ı görmezden gelmekten daha iyi bir çözüm vardır! Bu kodu düzeltmek için bağımlılık listesine `onTick` eklemeniz gerekir. (Aralığın yalnızca bir kez ayarlandığından emin olmak için, [`onTick`i bir Efekt Olayı yapın.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)) 

**Bağımlılık lint hatasını bir derleme hatası olarak ele almanızı öneririz. Bunu bastırmazsanız, bu gibi hataları asla görmezsiniz.** Bu sayfanın geri kalanı, bu ve diğer durumlar için alternatifleri belgelemektedir.

</DeepDive>

## Gereksiz bağımlılıkları kaldırma {/*removing-unnecessary-dependencies*/}

Efektin bağımlılıklarını kodu yansıtacak şekilde her ayarladığınızda, bağımlılık listesine bakın. Bu bağımlılıklardan herhangi biri değiştiğinde Efektin yeniden çalıştırılması mantıklı mı? Bazen cevap "hayır" olabilir:

* Efektinizin *farklı bölümlerini* farklı koşullar altında yeniden yürütmek isteyebilirsiniz.
* Değişikliklere "tepki vermek" yerine bazı bağımlılıkların yalnızca *en son değerini* okumak isteyebilirsiniz.
* Bir bağımlılık, bir nesne ya da fonksiyon olduğu için *kasıtsız olarak* çok sık değişebilir.

Doğru çözümü bulmak için, Efektiniz hakkında birkaç soruyu yanıtlamanız gerekir. Hadi bunların üzerinden geçelim.

### Bu kod bir olay yöneticisine taşınmalı mı? {/*should-this-code-move-to-an-event-handler*/}

Düşünmeniz gereken ilk şey, bu kodun bir efekt olup olmaması gerektiğidir.

Bir form düşünün. Gönderildiğinde, `submitted` state değişkenini `true` olarak ayarlarsınız. Bir POST isteği göndermeniz ve bir bildirim göstermeniz gerekir. Bu mantığı, `submitted` state'inin `true` olmasına "tepki veren" bir Efektin içine yerleştirirsiniz:

```js {6-8}
function Form() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) {
      // 🔴 Kaçının: Bir Efekt içinde olaya özgü mantık
      post('/api/register');
      showNotification('Başarıyla Kaydedildi!');
    }
  }, [submitted]);

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Daha sonra, bildirim mesajını mevcut temaya göre şekillendirmek istersiniz, bu nedenle mevcut temayı okursunuz. Bileşen gövdesinde `theme` bildirildiği için reaktif bir değerdir, bu nedenle onu bir bağımlılık olarak eklersiniz:

```js {3,9,11}
function Form() {
  const [submitted, setSubmitted] = useState(false);
  const theme = useContext(ThemeContext);

  useEffect(() => {
    if (submitted) {
      // 🔴 Kaçının: Bir Efekt içinde olaya özgü mantık
      post('/api/register');
      showNotification('Başarıyla Kaydedildi!', theme);
    }
  }, [submitted, theme]); // ✅ Tüm bağımlılıklar bildirildi

  function handleSubmit() {
    setSubmitted(true);
  }

  // ...
}
```

Bunu yaparak bir hatayı ortaya çıkarmış olursunuz. Önce formu gönderdiğinizi ve ardından Koyu ve Açık temalar arasında geçiş yaptığınızı düşünün. Tema değişecek, Efekt yeniden çalışacak ve böylece aynı bildirimi tekrar görüntüleyecektir!

**Buradaki sorun, bunun ilk etapta bir Efekt olmaması gerektiğidir.** Bu POST isteğini göndermek ve belirli bir etkileşim olan *formun gönderilmesine* yanıt olarak bildirimi göstermek istiyorsunuz. Belirli bir etkileşime yanıt olarak bazı kodları çalıştırmak için, bu mantığı doğrudan ilgili olay yöneticisine yerleştirin:

```js {6-7}
function Form() {
  const theme = useContext(ThemeContext);

  function handleSubmit() {
    // ✅ Güzel: Olaya özgü mantık olay yöneticilerinden çağrılır
    post('/api/register');
<<<<<<< HEAD
    showNotification('Başarıyla Kaydedildi!', theme);
  }  
=======
    showNotification('Successfully registered!', theme);
  }
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

  // ...
}
```

Artık kod bir olay yöneticisinde olduğu için reaktif değildir--bu nedenle yalnızca kullanıcı formu gönderdiğinde çalışacaktır. [Olay yöneticileri ve Efektler arasında seçim yapma](/learn/separating-events-from-effects#reactive-values-and-reactive-logic) ve [gereksiz Etkiler nasıl silinir](/learn/you-might-not-need-an-effect) hakkında daha fazla bilgi edinin

### Efektiniz birbiriyle alakasız birkaç şey mi yapıyor? {/*is-your-effect-doing-several-unrelated-things*/}

Kendinize sormanız gereken bir sonraki soru, Efektinizin birbiriyle alakasız birkaç şey yapıp yapmadığıdır.

Kullanıcının şehir ve bölgesini seçmesi gereken bir gönderi formu oluşturduğunuzu düşünün. 
Seçilen `country`'e göre `cities` listesini sunucudan alıp bir açılır menüde gösteriyorsunuz:

```js
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ Tüm bağımlılıklar bildirildi

  // ...
```

Bu,[bir Efekte veri getirmeye](/learn/you-might-not-need-an-effect#fetching-data) iyi bir örnektir. `cities` state'i `country` prop'una göre ağ ile senkronize ediyorsunuz. Bunu bir olay yöneticisinde yapamazsınız çünkü `ShippingForm` görüntülendiğinde ve `country` değiştiğinde (hangi etkileşim buna neden olursa olsun) getirmeniz gerekir.

Şimdi diyelim ki şehir alanları için ikinci bir seçim kutusu ekliyorsunuz, bu da o anda seçili olan `city` için `areas`ı getirmelidir. Aynı Efekt içindeki alanların listesi için ikinci bir `fetch` çağrısı ekleyerek başlayabilirsiniz:

```js {15-24,28}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);

  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    // 🔴 Kaçının: Tek bir Efekt iki bağımsız süreci senkronize eder
    if (city) {
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [country, city]); // ✅ Tüm bağımlılıklar bildirildi

  // ...
```

Ancak, Efekt artık `city` state değişkenini kullandığından, bağımlılıklar listesine `city` eklemek zorunda kaldınız. Bu da bir sorun ortaya çıkardı: Kullanıcı farklı bir şehir seçtiğinde, Efekt yeniden çalışacak ve `fetchCities(country)` öğesini çağıracaktır. Sonuç olarak, şehir listesini gereksiz yere birçok kez yeniden çağırmış olursunuz.

**Bu koddaki sorun, iki farklı ilgisiz şeyi senkronize ediyor olmanızdır:**

1. `cities` state'ini `country` prop'una göre ağ ile senkronize etmek istiyorsunuz.
2. `areas` state'ini `city` stateine göre ağ ile senkronize etmek istiyorsunuz.

Mantığı, her biri senkronize olması gereken prop'a tepki veren iki Efekt'e bölün:

```js {19-33}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]); // ✅ Tüm bağımlılıklar bildirildi

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]); // ✅ Tüm bağımlılıklar bildirildi

  // ...
```

Şimdi ilk Efekt yalnızca `country` değiştiğinde yeniden çalışırken, ikinci Efekt `city` değiştiğinde yeniden çalışır. Bunları amaçlarına göre ayırdınız: iki farklı şey iki ayrı Efekt tarafından senkronize ediliyor. İki ayrı Efektin iki ayrı bağımlılık listesi vardır, bu nedenle istemeden birbirlerini tetiklemezler.

Son kod orijinalinden daha uzundur, ancak bu Efektleri bölmek hala doğrudur. [Her Efekt bağımsız bir senkronizasyon sürecini temsil etmelidir](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) Bu örnekte, bir Efektin silinmesi diğer Efektin mantığını bozmaz. Bu, *farklı şeyleri senkronize ettikleri* ve onları ayırmanın iyi olduğu anlamına gelir. Tekrarlama konusunda endişeleriniz varsa, bu kodu [tekrarlayan mantığı özel bir hook çıkararak](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks) geliştirebilirsiniz.

### Bir sonraki state'i hesaplamak için bir state mi okuyorsunuz? {/*are-you-reading-some-state-to-calculate-the-next-state*/}

Bu Efekt, her yeni mesaj geldiğinde `messages` state değişkenini yeni oluşturulan bir dizi ile günceller:

```js {2,6-8}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    // ...
```

Mevcut tüm mesajlardan başlayarak [yeni bir dizi oluşturmak](/learn/updating-arrays-in-state) için `messages` değişkenini kullanır ve sonuna yeni mesajı ekler. Ancak, `messages` bir Efekt tarafından okunan reaktif bir değer olduğundan, bir bağımlılık olmalıdır:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages([...messages, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId, messages]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

Ve `messages`'ı bir bağımlılık haline getirmek bir sorun yaratır.

Her mesaj aldığınızda, `setMessages()` bileşenin alınan mesajı içeren yeni bir `messages` dizisiyle yeniden renderlanmasına neden olur. Ancak, bu Efekt artık `messages` dizisine bağlı olduğundan, bu *aynı zamanda* Efekti yeniden senkronize edecektir. Yani her yeni mesaj sohbetin yeniden bağlanmasını sağlayacaktır. Kullanıcı bundan hoşlanmayacaktır!

Sorunu çözmek için, `messages`'ı Efekt içinde okumayın. Bunun yerine, `setMessages` öğesine bir [güncelleyici fonksiyon](/reference/react/useState#updating-state-based-on-the-previous-state) iletin:

```js {7,10}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Tüm bağımlılıklar bildirildi.
  // ...
```

**Efekt'inizin artık `messages` değişkenini nasıl okumadığına dikkat edin.** Sadece `msgs => [...msgs, receivedMessage]` gibi bir güncelleyici fonksiyonu geçirmeniz gerekir. React [güncelleyici fonksiyonunuzu bir kuyruğa koyar](/learn/queueing-a-series-of-state-updates) ve bir sonraki render sırasında `msgs` argümanını ona sağlayacaktır. Bu nedenle Efektin kendisinin artık `messages`'a bağlı olması gerekmez. Bu düzeltmenin bir sonucu olarak, bir sohbet mesajı almak artık sohbetin yeniden bağlanmasına neden olmayacaktır.

### Bir değeri, değişikliklerine "tepki vermeden" okumak mı istiyorsunuz? {/*do-you-want-to-read-a-value-without-reacting-to-its-changes*/}

Diyelim ki kullanıcı yeni bir mesaj aldığında, eğer `isMuted` değeri `true` değilse bir ses çalmak istiyorsun:

```js {3,10-12}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    // ...
```

Efektiniz artık kodunda `isMuted` kullandığından, bunu bağımlılıklara eklemeniz gerekir:

```js {10,15}
function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      setMessages(msgs => [...msgs, receivedMessage]);
      if (!isMuted) {
        playSound();
      }
    });
    return () => connection.disconnect();
  }, [roomId, isMuted]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

Sorun şu ki, `isMuted` her değiştiğinde (örneğin, kullanıcı "Muted" düğmesine bastığında), Efekt yeniden senkronize olacak ve sohbete yeniden bağlanacaktır. Bu istenen kullanıcı deneyimi değildir! (Bu örnekte, linter'ı devre dışı bırakmak bile işe yaramayacaktır - eğer bunu yaparsanız, `isMuted` eski değerine "takılıp kalacaktır").

Bu sorunu çözmek için, reaktif olmaması gereken mantığı Efektin dışına çıkarmanız gerekir. Bu Efektin `isMuted` içindeki değişikliklere "tepki vermesini" istemezsiniz. [Bu reaktif olmayan mantık parçasını bir Efekt Olayına taşıyın:](/learn/separating-events-from-effects#declaring-an-effect-event)

```js {1,7-12,18,21}
import { useState, useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId }) {
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const onMessage = useEffectEvent(receivedMessage => {
    setMessages(msgs => [...msgs, receivedMessage]);
    if (!isMuted) {
      playSound();
    }
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

Efekt Olayları, bir Efekti reaktif parçalara (`roomId` gibi reaktif değerlere ve bunların değişikliklerine "tepki" vermesi gereken) ve reaktif olmayan parçalara (`onMessage`ın `isMuted`ı okuması gibi yalnızca en son değerlerini okuyan) ayırmanıza olanak tanır. **Artık `isMuted` değerini bir Efekt Olayı içinde okuduğunuz için, Efektinizin bir bağımlılığı olması gerekmez.** Sonuç olarak, "Muted" ayarını açıp kapattığınızda sohbet yeniden bağlanmayacak ve orijinal sorunu çözecektir!

#### Bir olay yöneticisini prop'lardan sarma {/*wrapping-an-event-handler-from-the-props*/}

Bileşeniniz prop olarak bir olay yöneticisi aldığında da benzer bir sorunla karşılaşabilirsiniz:

```js {1,8,11}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onReceiveMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId, onReceiveMessage]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

Ana bileşenin her render işleminde *farklı* bir `onReceiveMessage` fonksiyonu geçirdiğini varsayalım:

```js {3-5}
<ChatRoom
  roomId={roomId}
  onReceiveMessage={receivedMessage => {
    // ...
  }}
/>
```

`onReceiveMessage` bir bağımlılık olduğundan, her üst yeniden renderdan sonra Efektin yeniden senkronize olmasına neden olur. Bu da sohbete yeniden bağlanmasına neden olur. Bunu çözmek için, çağrıyı bir Efekt Olayına sarın:

```js {4-6,12,15}
function ChatRoom({ roomId, onReceiveMessage }) {
  const [messages, setMessages] = useState([]);

  const onMessage = useEffectEvent(receivedMessage => {
    onReceiveMessage(receivedMessage);
  });

  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    connection.on('message', (receivedMessage) => {
      onMessage(receivedMessage);
    });
    return () => connection.disconnect();
  }, [roomId]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

Efekt Olayları reaktif değildir, bu nedenle bunları bağımlılık olarak belirtmeniz gerekmez. Sonuç olarak, ana bileşen her yeniden renderda farklı bir fonksiyon geçirse bile sohbet artık yeniden bağlanmayacaktır.

#### Reaktif ve reaktif olmayan kodu ayırma {/*separating-reactive-and-non-reactive-code*/}

Bu örnekte, `roomId` her değiştiğinde bir ziyareti günlüğe kaydetmek istiyorsunuz. Her günlüğe geçerli `notificationCount` değerini dahil etmek istiyorsunuz, ancak `notificationCount` değerindeki bir değişikliğin bir günlük olayını tetiklemesini *istemiyorsunuz*.

Çözüm yine reaktif olmayan kodu bir Efekt Olayına ayırmaktır:

```js {2-4,7}
function Chat({ roomId, notificationCount }) {
  const onVisit = useEffectEvent(visitedRoomId => {
    logVisit(visitedRoomId, notificationCount);
  });

  useEffect(() => {
    onVisit(roomId);
  }, [roomId]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
}
```

Mantığınızın `roomId` ile ilgili olarak reaktif olmasını istiyorsunuz, bu nedenle Efektinizin içinde `roomId` değerini okuyorsunuz. Ancak, `notificationCount` değerinde yapılan bir değişikliğin fazladan bir ziyareti günlüğe kaydetmesini istemezsiniz, bu nedenle `notificationCount` değerini Efekt Olayının içinde okursunuz. [Efekt Olaylarını kullanarak Efektlerden en son props ve state'leri okuma hakkında daha fazla bilgi edinin](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)

### Bazı reaktif değerler istemeden değişiyor mu? {/*does-some-reactive-value-change-unintentionally*/}

Bazen, Efektinizin belirli bir değere "tepki vermesini" istersiniz, ancak bu değer istediğinizden daha sık değişir ve kullanıcının bakış açısından herhangi bir gerçek değişikliği yansıtmayabilir. Örneğin, bileşeninizin gövdesinde bir `options` nesnesi oluşturduğunuzu ve daha sonra bu nesneyi Efektinizin içinden okuduğunuzu varsayalım:

```js {3-6,9}
function ChatRoom({ roomId }) {
  // ...
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    // ...
```
Bu nesne bileşen gövdesinde bildirilir, bu nedenle bir [reaktif değerdir.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Bunun gibi bir reaktif değeri bir Efekt içinde okuduğunuzda, onu bir bağımlılık olarak bildirirsiniz. Bu, Efektinizin onun değişikliklerine "tepki vermesini" sağlar:

```js {3,6}
  // ...
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

Bunu bir bağımlılık olarak bildirmek önemlidir! Bu, örneğin `roomId` değişirse, Efektinizin yeni `seçenekler` ile sohbete yeniden bağlanmasını sağlar. Ancak, yukarıdaki kodda da bir sorun var. Bunu görmek için, aşağıdaki sandbox'taki girdiye yazmayı deneyin ve konsolda ne olduğunu izleyin:

<Sandpack>

```js {expectedErrors: {'react-compiler': [10]}}
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // Sorunu göstermek için linteri geçici olarak devre dışı bırakın
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>{roomId} odasına Hoş Geldiniz</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="seyehat">Seyehat</option>
          <option value="müzik">Müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  return {
    connect() {
      console.log('✅ "' + roomId + '" odasına ' + serverUrl + ' adresinde bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" odasından ' + serverUrl + ' adresinden bağlantı kesildi');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Yukarıdaki sanal alanda, girdi yalnızca `message` state değişkenini günceller. Kullanıcının bakış açısından, bunun sohbet bağlantısını etkilememesi gerekir. Ancak, `message` değişkenini her güncellediğinizde, bileşeniniz yeniden renderlanır. Bileşeniniz yeniden renederlandığında, içindeki kod sıfırdan yeniden çalışır.

`ChatRoom` bileşeninin her yeniden renderlanmasında sıfırdan yeni bir `options` nesnesi oluşturulur. React, `options` nesnesinin son render sırasında oluşturulan `options` nesnesinden *farklı bir nesne* olduğunu görür. Bu nedenle Efektinizi yeniden senkronize eder (ki bu `options`e bağlıdır) ve sohbet siz yazarken yeniden bağlanır.

**Bu sorun yalnızca nesneleri ve fonksiyonları etkiler. JavaScript'te, yeni oluşturulan her nesne ve fonksiyon diğerlerinden farklı kabul edilir. İçlerindeki içeriklerin aynı olması önemli değildir!**

```js {7-8}
// İlk rener sırasında
const options1 = { serverUrl: 'https://localhost:1234', roomId: 'müzik' };

// Sonraki render sırasında
const options2 = { serverUrl: 'https://localhost:1234', roomId: 'müzik' };

// Bunlar iki farklı nesne!
console.log(Object.is(options1, options2)); // false
```
**Nesne ve fonksiyon bağımlılıkları, Efektinizin ihtiyacınız olandan daha sık yeniden senkronize edilmesine neden olabilir.** 

<<<<<<< HEAD
Bu nedenle, mümkün olduğunca, Efektinizin bağımlılıkları olarak nesnelerden ve fonksiyonlardan kaçınmaya çalışmalısınız. Bunun yerine, bunları bileşenin dışına, Efektin içine taşımayı veya ilkel değerleri bunlardan çıkarmayı deneyin.
=======
**Object and function dependencies can make your Effect re-synchronize more often than you need.**
>>>>>>> abe931a8cb3aee3e8b15ef7e187214789164162a

#### Statik nesneleri ve fonksiyonları bileşeninizin dışına taşıma {/*move-static-objects-and-functions-outside-your-component*/}

Nesne herhangi bir prop ve state'e bağlı değilse, bu nesneyi bileşeninizin dışına taşıyabilirsiniz:

```js {1-4,13}
const options = {
  serverUrl: 'https://localhost:1234',
  roomId: 'music'
};

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

Bu şekilde, linter'a reaktif olmadığını *kanıtlamış* olursunuz. Yeniden renderlamanın bir sonucu olarak değişemez, bu nedenle bir bağımlılık olması gerekmez. Şimdi `ChatRoom`un yeniden renderlaması Efektinizin yeniden senkronize edilmesine neden olmaz.

Bu fonksiyonlar için de geçerlidir:

```js {1-6,12}
function createOptions() {
  return {
    serverUrl: 'https://localhost:1234',
    roomId: 'music'
  };
}

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

`createOptions` bileşeninizin dışında bildirildiği için reaktif bir değer değildir. Bu nedenle Efektinizin bağımlılıklarında belirtilmesi gerekmez ve bu nedenle Efektinizin yeniden senkronize olmasına neden olmaz.

#### Dinamik nesneleri ve fonksiyonları Efektinizin içine taşıma {/*move-dynamic-objects-and-functions-inside-your-effect*/}

Nesneniz yeniden renderlaması sonucunda değişebilecek bir reaktif değere bağlıysa, örneğin bir `roomId` prop'u gibi, onu bileşeninizin *dışına* çekemezsiniz. Bununla birlikte, oluşturulmasını Efekt kodunuzun *içine* taşıyabilirsiniz:

```js {7-10,11,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

Artık `options` Efektinizin içinde bildirildiği için, Efektinizin bir bağımlılığı değildir. Bunun yerine, Efektiniz tarafından kullanılan tek reaktif değer `roomId`dir. roomId` bir nesne ya da fonksiyon olmadığından, *kasıtsız olarak* farklı olmayacağından emin olabilirsiniz. JavaScript'te sayılar ve dizeler içeriklerine göre karşılaştırılır:

```js {7-8}
// İlk render sırasında
const roomId1 = 'müzik';

// Sonraki render sırasında
const roomId2 = 'müzik';

// Bu iki string de aynı!
console.log(Object.is(roomId1, roomId2)); // true
```

Bu düzeltme sayesinde, girişi düzenlediğinizde sohbet artık yeniden bağlanmıyor:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>{roomId} odasına hoş geldiniz</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="seyehat">Seyehat</option>
          <option value="müzik">Müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  return {
    connect() {
      console.log('✅ "' + roomId + '" odasına ' + serverUrl + ' adresinde bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" odasından ' + serverUrl + ' adresinden bağlantı kesildi');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Ancak, `roomId` açılır menüsünü değiştirdiğinizde, beklediğiniz gibi *yeniden bağlanır*.

Bu, fonksiyonlar için de geçerlidir:

```js {7-12,14}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

Efektinizin içindeki mantık parçalarını gruplamak için kendi fonksiyonlarınızı yazabilirsiniz. Bunları Efektinizin *içinde* de bildirdiğiniz sürece, reaktif değerler değildirler ve bu nedenle Efektinizin bağımlılıkları olmaları gerekmez.

#### Nesnelerden ilkel değerleri okuma {/*read-primitive-values-from-objects*/}

Bazen proplardan bir nesne alabilirsiniz:

```js {1,5,8}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

Buradaki risk, ana bileşenin renderlanması sırasında nesneyi renderlamasıdır:

```js {3-6}
<ChatRoom
  roomId={roomId}
  options={{
    serverUrl: serverUrl,
    roomId: roomId
  }}
/>
```

Bu, ana bileşen her yeniden renderlandığında Efektinizin yeniden bağlanmasına neden olur. Bunu düzeltmek için, Efektin *dışındaki* nesneden bilgi okuyun ve nesne ve fonksiyon bağımlılıklarına sahip olmaktan kaçının:

```js {4,7-8,12}
function ChatRoom({ options }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

Mantık biraz tekrara düşüyor (bir Efektin dışındaki bir nesneden bazı değerleri okuyorsunuz ve ardından Efektin içinde aynı değerlere sahip bir nesne oluşturuyorsunuz). Ancak bu, Efektinizin *gerçekte* hangi bilgilere bağlı olduğunu çok açık hale getirir. Bir nesne ana bileşen tarafından istenmeden yeniden oluşturulursa, sohbet yeniden bağlanmaz. Ancak, `options.roomId` veya `options.serverUrl` gerçekten farklıysa, sohbet yeniden bağlanır.

#### Fonksiyonlardan ilkel değerleri hesaplama {/*calculate-primitive-values-from-functions*/}

Aynı yaklaşım fonksiyonlar için de kullanılabilir. Örneğin, ana bileşenin bir fonksiyon geçirdiğini varsayalım:

```js {3-8}
<ChatRoom
  roomId={roomId}
  getOptions={() => {
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }}
/>
```

Bunu bir bağımlılık haline getirmekten (ve yeniden renderlamalarda yeniden bağlanmasına neden olmaktan) kaçınmak için, bunu Efektin dışında çağırın. Bu size nesne olmayan ve Efektinizin içinden okuyabileceğiniz `roomId` ve `serverUrl` değerlerini verir:

```js {1,4}
function ChatRoom({ getOptions }) {
  const [message, setMessage] = useState('');

  const { roomId, serverUrl } = getOptions();
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Tüm bağımlılıklar bildirildi
  // ...
```

Bu sadece[saf halde](/learn/keeping-components-pure) fonksiyonlar için geçerlidir, çünkü render sırasında çağrılmaları güvenlidir. 
Fonksiyonunuz bir olay yöneticisiyse, ancak değişikliklerinin Efektinizi yeniden senkronize etmesini istemiyorsanız,[bunun yerine bir Efekt Olayına sarın.](#do-y-want-to-read-a-value-without-reacting-to-its-changes)

<Recap>

- Bağımlılıklar her zaman kodla eşleşmelidir.
- Bağımlılıklarınızdan memnun olmadığınızda, düzenlemeniz gereken şey koddur.
- Linteri bastırmak çok kafa karıştırıcı hatalara yol açar ve bundan her zaman kaçınmalısınız.
- Bir bağımlılığı kaldırmak için, linter'e bunun gerekli olmadığını "kanıtlamanız" gerekir.
- Bazı kodların belirli bir etkileşime yanıt olarak çalışması gerekiyorsa, bu kodu bir olay yöneticisine taşıyın.
- Efektinizin farklı bölümlerinin farklı nedenlerle yeniden çalıştırılması gerekiyorsa, onu birkaç Efekte bölün.
- Bir önceki durumu temel alarak bazı durumları güncellemek istiyorsanız, bir güncelleyici fonksiyonu geçirin.
- En son değeri "tepki vermeden" okumak istiyorsanız, Efektinizden bir Efekt Olayı çıkarın.
- JavaScript'te, nesneler ve fonksiyonlar farklı zamanlarda oluşturulmuşlarsa farklı kabul edilirler.
- Nesne ve fonksiyon bağımlılıklarından kaçınmaya çalışın. Bunları bileşenin dışına veya Efektin içine taşıyın.

</Recap>

<Challenges>

#### Sıfırlama aralığını düzeltme {/*fix-a-resetting-interval*/}

Bu Efekt, her saniyede bir işleyen bir aralık oluşturur. Tuhaf bir şeyin olduğunu fark ettiniz: Sanki aralık her tıklandığında yok ediliyor ve yeniden yaratılıyor gibi görünüyor. Kodu, aralığın sürekli olarak yeniden oluşturulmayacağı şekilde düzeltin.

<Hint>

Bu Efekt'in kodu `count`'a bağlı gibi görünüyor. Bu bağımlılığa ihtiyaç duymamanın bir yolu var mı? Bu değere bir bağımlılık eklemeden `count` state'ini önceki değerine göre güncellemenin bir yolu olmalıdır.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Bir aralık oluşturma');
    const id = setInterval(() => {
      console.log('⏰ Aralık işareti');
      setCount(count + 1);
    }, 1000);
    return () => {
      console.log('❌ Bir aralığı temizleme');
      clearInterval(id);
    };
  }, [count]);

  return <h1>Sayaç: {count}</h1>
}
```

</Sandpack>

<Solution>

Efektin içinden `count` state'ini `count + 1` olacak şekilde güncellemek istiyorsunuz. Ancak bu, Efektinizi her tıklamayla değişen `count`'a bağlı hale getirir ve bu nedenle aralığınız her tıklamada yeniden oluşturulur.

Bunu çözmek için [güncelleyici fonksiyonu](/reference/react/useState#updating-state-based-on-the-previous-state) kullanın ve `setCount(count + 1)` yerine `setCount(c => c + 1)` yazın:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('✅ Bir aralık oluşturma');
    const id = setInterval(() => {
      console.log('⏰ Aralık işareti');
      setCount(c => c + 1);
    }, 1000);
    return () => {
      console.log('❌ Bir aralığı temizleme');
      clearInterval(id);
    };
  }, []);

  return <h1>Sayaç: {count}</h1>
}
```

</Sandpack>

`count` değerini Efekt içinde okumak yerine, React'e `c => c + 1` talimatını ("bu sayıyı artır!") verirsiniz. React bu işlemi bir sonraki render'da uygular. Artık Efekt'in içinde `count` değerini okumanıza gerek kalmadığı için, Efekt'in bağımlılık dizisini boş (`[]`) bırakabilirsiniz. Bu da, her tikte Efekt'in yeniden oluşturulmasını engeller.

</Solution>

#### Yeniden tetiklenen bir animasyonu düzeltin {/*fix-a-retriggering-animation*/}

Bu örnekte, "Göster" düğmesine bastığınızda bir karşılama mesajı belirir. Animasyon bir saniye sürer. "Kaldır" düğmesine bastığınızda, karşılama mesajı hemen kaybolur. Soluk animasyonun mantığı `animation.js` dosyasında düz JavaScript olarak uygulanmıştır [animasyon döngüsü.](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) Bu mantığı değiştirmenize gerek yoktur. Bunu üçüncü taraf bir kütüphane olarak ele alabilirsiniz. Efektiniz, DOM düğümü için bir `FadeInAnimation` örneği oluşturur ve ardından animasyonu kontrol etmek için `start(duration)` veya `stop()` çağırır. `Süre` bir kaydırıcı tarafından kontrol edilir. Kaydırıcıyı ayarlayın ve animasyonun nasıl değiştiğini görün.

Bu kod zaten çalışıyor, ancak değiştirmek istediğiniz bir şey var. Şu anda, `duration` state değişkenini kontrol eden kaydırıcıyı hareket ettirdiğinizde, animasyonu yeniden tetikliyor. Efektin `duration` değişkenine "tepki" vermemesi için davranışı değiştirin. "Göster" düğmesine bastığınızda, Efekt kaydırıcıdaki geçerli `duration` değerini kullanmalıdır. Ancak, kaydırıcıyı hareket ettirmek kendi başına animasyonu yeniden tetiklememelidir.

<Hint>

Efektin içinde reaktif olmaması gereken bir kod satırı var mı? Reaktif olmayan kodu Efektin dışına nasıl taşıyabilirsiniz?

</Hint>

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useEffectEvent } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome({ duration }) {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [duration]);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Hoş Geldiniz
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Solma süresi: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Kaldır' : 'Göster'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Hemen sona atla
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Animasyona başla
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Hâlâ boyanacak karelerimiz var.
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

<Solution>

Efektinizin `duration` ın en son değerini okuması gerekir, ancak `duration`daki değişikliklere "tepki" vermesini istemezsiniz. Animasyonu başlatmak için `duration` kullanıyorsunuz, ancak animasyonu başlatmak reaktif değildir. Reaktif olmayan kod satırını bir Efekt Olayı içine alın ve bu işlevi Efektinizden çağırın.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';
import { useEffectEvent } from 'react';

function Welcome({ duration }) {
  const ref = useRef(null);

  const onAppear = useEffectEvent(animation => {
    animation.start(duration);
  });

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    onAppear(animation);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
      Hoş Geldiniz
    </h1>
  );
}

export default function App() {
  const [duration, setDuration] = useState(1000);
  const [show, setShow] = useState(false);

  return (
    <>
      <label>
        <input
          type="range"
          min="100"
          max="3000"
          value={duration}
          onChange={e => setDuration(Number(e.target.value))}
        />
        <br />
        Fade in duration: {duration} ms
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Kaldır' : 'Göster'}
      </button>
      <hr />
      {show && <Welcome duration={duration} />}
    </>
  );
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // Daha boyanacak karelerimiz var.
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

</Sandpack>

`onAppear` gibi Efekt Olayları reaktif değildir, bu nedenle animasyonu yeniden tetiklemeden içindeki `duration`ı okuyabilirsiniz.

</Solution>

#### Yeniden bağlanan bir sohbeti düzeltme {/*fix-a-reconnecting-chat*/}

Bu örnekte, "Temayı değiştir" düğmesine her bastığınızda sohbet yeniden bağlanır. Bu neden oluyor? Hatayı düzeltin, böylece sohbet yalnızca Sunucu URL'sini düzenlediğinizde veya farklı bir sohbet odası seçtiğinizde yeniden bağlansın.

`chat.js`'ye harici bir üçüncü taraf kütüphanesi gibi davranın: API'sini kontrol etmek için ona danışabilirsiniz, ancak onu düzenlemeyin.

<Hint>

Bunu düzeltmenin birden fazla yolu vardır, ancak sonuçta bağımlılığınız olarak bir nesneye sahip olmaktan kaçınmak istersiniz.

</Hint>

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('genel');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Temayı Değiştir
      </button>
      <label>
        Sunucu URL'i:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Sohbet odası seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="seyehat">Seyehat</option>
          <option value="müzik">Müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return <h1>{options.roomId} Odasına Hoş Geldiniz!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama sunucuya gerçekten bağlanır
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl inin bir dize olması bekleniyordu. Bu Geldi: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId nin string olması gerekiyordu. Bu Geldi: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ "' + roomId + '" odasına ' + serverUrl + ' adresinde bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" odasından ' + serverUrl + ' adresinden bağlantı kesildi');
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

<Solution>

Efektiniz `options` nesnesine bağlı olduğu için yeniden çalışıyor. Nesneler istemeden yeniden oluşturulabilir, mümkün olduğunca Efektlerinizin bağımlılıkları olarak bunlardan kaçınmaya çalışmalısınız.

En az bozan çözüm, `roomId` ve `serverUrl` değerlerini Efektin hemen dışında okumak ve ardından Efektin bu ilkel değerlere (istemeden değişemez) bağlı olmasını sağlamaktır. Efektin içinde bir nesne oluşturun ve bunu `createConnection` öğesine aktarın:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('genel');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Temayı Değiştir
      </button>
      <label>
        Sunucu URL'i:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Sohbet odası seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="seyehat">Seyehat</option>
          <option value="müzik">Müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom options={options} />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ options }) {
  const { roomId, serverUrl } = options;
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>{options.roomId} Odasına Hoş Geldiniz!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama gerçekten sunucuya bağlanır.
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl inin bir dize olması bekleniyordu. Bu Geldi: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId nin string olması gerekiyordu. Bu Geldi: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ "' + roomId + '" odasına ' + serverUrl + ' adresinde bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" odasından ' + serverUrl + ' adresinden bağlantı kesildi');
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Object `options` prop'unu daha spesifik olan `roomId` ve `serverUrl` prop'ları ile değiştirmek daha da iyi olacaktır:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('genel');
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  return (
    <div className={isDark ? 'dark' : 'light'}>
      <button onClick={() => setIsDark(!isDark)}>
        Temayı Değiştir
      </button>
      <label>
        Sunucu URL'i:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <label>
        Sohbet odası seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="seyehat">Seyehat</option>
          <option value="müzik">Müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        serverUrl={serverUrl}
      />
    </div>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId, serverUrl }) {
  useEffect(() => {
    const connection = createConnection({
      roomId: roomId,
      serverUrl: serverUrl
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return <h1>{roomId} Odasına Hoş Geldiniz!</h1>;
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama sunucuya gerçekten bağlanır
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl inin bir dize olması bekleniyordu. Bu Geldi: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId nin string olması gerekiyordu. Bu Geldi: ' + roomId);
  }
  return {
    connect() {
      console.log('✅ "' + roomId + '" odasına ' + serverUrl + ' adresinde bağlanılıyor...');
    },
    disconnect() {
      console.log('❌ "' + roomId + '" odasından ' + serverUrl + ' adresinden bağlantı kesildi');
    }
  };
}
```

```css
label, button { display: block; margin-bottom: 5px; }
.dark { background: #222; color: #eee; }
```

</Sandpack>

Mümkün olduğunca ilkel aksesuarlara bağlı kalmak, bileşenlerinizi daha sonra optimize etmenizi kolaylaştırır.

</Solution>

#### Yeniden bağlanan bir sohbeti düzeltin, tekrar {/*fix-a-reconnecting-chat-again*/}

Bu örnek, sohbete şifreleme ile veya şifreleme olmadan bağlanır. Onay kutusunu değiştirin ve şifreleme açık ve kapalı olduğunda konsoldaki farklı mesajlara dikkat edin. Odayı değiştirmeyi deneyin. Ardından, temayı değiştirmeyi deneyin. Bir sohbet odasına bağlandığınızda, her birkaç saniyede bir yeni mesajlar alacaksınız. Renklerinin seçtiğiniz temayla eşleştiğini doğrulayın.

Bu örnekte, temayı her değiştirmeye çalıştığınızda sohbet yeniden bağlanıyor. Bunu düzeltin. Düzeltmeden sonra, temayı değiştirmek sohbeti yeniden bağlamamalı, ancak şifreleme ayarlarını değiştirmek veya odayı değiştirmek yeniden bağlamalıdır.

`chat.js` içindeki hiçbir kodu değiştirmeyin. Bunun dışında, aynı davranışla sonuçlandığı sürece herhangi bir kodu değiştirebilirsiniz. Örneğin, hangi prop'ların aktarıldığını değiştirmeyi yararlı bulabilirsiniz.

<Hint>

İki adet fonksiyon  aktarıyorsunuz: `onMessage` ve `createConnection`. Her ikisi de `App` tekrardan oluşturulduğunda sıfırdan oluşturulur. Her seferinde yeni değerler olarak kabul edilirler, bu yüzden Efektinizi yeniden tetiklerler.

Bu fonksiyonlardan biri bir olay yöneticisi. Olay yöneticisi işlevinin yeni değerlerine "tepki vermeden" bir olay yöneticiyi bir Efekt olarak çağırmanın herhangi bir yolunu biliyor musunuz? Bu çok kullanışlı olurdu!

Bu fonksiyonlardan bir diğeri yalnızca içe aktarılan bir API yöntemine bazı durumları iletmek için vardır. Bu fonksiyon gerçekten gerekli mi? Aktarılan temel bilgi nedir? Bazı içe aktarmaları `App.js`den `ChatRoom.js`e taşımanız gerekebilir.

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';
import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('genel');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Karanlık Tema'yı Kullan
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Şifrelemeyi Etkinleştir
      </label>
      <label>
        Sohbet odası seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="seyehat">Seyehat</option>
          <option value="müzik">Müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        onMessage={msg => {
          showNotification('Yeni Mesaj: ' + msg, isDark ? 'Karanlık' : 'Aydınlık');
        }}
        createConnection={() => {
          const options = {
            serverUrl: 'https://localhost:1234',
            roomId: roomId
          };
          if (isEncrypted) {
            return createEncryptedConnection(options);
          } else {
            return createUnencryptedConnection(options);
          }
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';

export default function ChatRoom({ roomId, createConnection, onMessage }) {
  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [createConnection, onMessage]);

  return <h1>{roomId} Odasına hoş geldiniz!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl inin bir dize olması bekleniyordu. Bu Geldi: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId nin string olması gerekiyordu. Bu Geldi: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Şuraya bağlanılıyor "' + roomId + '" odası... (şifrelenmiş)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Şuradan bağlantı kesildi "' + roomId + '" odası (şifrelenmiş)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Yönetici iki kez eklenemez.');
      }
      if (event !== 'message') {
        throw Error('Yalnızca "message" olayı desteklenir.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl inin bir dize olması bekleniyordu. Bu Geldi:: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId nin string olması gerekiyordu. Bu Geldi: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Şuraya bağlanılıyor "' + roomId + '" odası (şifrelenmemiş)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Şuradan bağlantı kesildi "' + roomId + '" odası (şifrelenmemiş)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Yönetici iki kez eklenemez.');
      }
      if (event !== 'message') {
        throw Error('Sadece "message" olayı desteklenir.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

<Solution>

Bunu çözmenin birden fazla doğru yolu var, ancak işte olası bir çözüm.

Orijinal örnekte, temanın değiştirilmesi farklı `onMessage` ve `createConnection` fonksiyonlarının oluşturulmasına ve aşağı aktarılmasına neden oluyordu. Efekt bu fonksiyonlara bağlı olduğundan, temayı her değiştirdiğinizde sohbet yeniden bağlanıyordu.

`onMessage` ile ilgili sorunu çözmek için, bunu bir Efekt Olayına sarmanız gerekiyordu:

```js {1,2,6}
export default function ChatRoom({ roomId, createConnection, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    // ...
```

`onMessage` prop'unun aksine, `onReceiveMessage` Efekt Olayı reaktif değildir. Bu nedenle Efektinizin bir bağımlılığı olması gerekmez. Sonuç olarak, `onMessage`da yapılan değişiklikler sohbetin yeniden bağlanmasına neden olmaz.

Aynı şeyi `createConnection` ile yapamazsınız çünkü bu *reaktif* olmalıdır. Kullanıcı şifreli ve şifresiz bir bağlantı arasında geçiş yaptığında veya kullanıcı mevcut odayı değiştirdiğinde Efektin yeniden tetiklenmesini *istiyorsunuz*. Ancak, `createConnection` bir fonksiyon olduğu için, okuduğu bilginin *gerçekte* değişip değişmediğini kontrol edemezsiniz. Bunu çözmek için, `createConnection`ı `App` bileşeninden geçirmek yerine, ham `roomId` ve `isEncrypted` değerlerini geçirin:

```js {2-3}
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('Yeni mesaj: ' + msg, isDark ? 'Karanlık' : 'Aydınlık');
        }}
      />
```

Artık `createConnection` fonksiyonunu `App` içinden geçirmek yerine Efektin *içine* taşıyabilirsiniz:

```js {1-4,6,10-20}
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }
    // ...
```

Bu iki değişiklikten sonra, Efektiniz artık herhangi bir fonksiyon değerine bağlı değildir:

```js {1,8,10,21}
export default function ChatRoom({ roomId, isEncrypted, onMessage }) { // Reaktif değerler
  const onReceiveMessage = useEffectEvent(onMessage); // Reaktif değil

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId // Reaktif bir değer okuma
      };
      if (isEncrypted) { // Reaktif bir değer okuma
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]); // ✅ Tüm bağımlılıklar bildirildi
```

Sonuç olarak, sohbet yalnızca anlamlı bir şey (`roomId` veya `isEncrypted`) değiştiğinde yeniden bağlanır:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

import { showNotification } from './notifications.js';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Karanlık Tema'yı Kullan
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Şifrelemeyi Etkinleştir
      </label>
      <label>
        Sohbet odası seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">Genel</option>
          <option value="seyehat">Seyehat</option>
          <option value="müzik">Müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
        onMessage={msg => {
          showNotification('Yeni mesaj: ' + msg, isDark ? 'Karanlık' : 'Aydınlık');
        }}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { useEffectEvent } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
  const onReceiveMessage = useEffectEvent(onMessage);

  useEffect(() => {
    function createConnection() {
      const options = {
        serverUrl: 'https://localhost:1234',
        roomId: roomId
      };
      if (isEncrypted) {
        return createEncryptedConnection(options);
      } else {
        return createUnencryptedConnection(options);
      }
    }

    const connection = createConnection();
    connection.on('message', (msg) => onReceiveMessage(msg));
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>{roomId} Odasına hoş geldiniz!</h1>;
}
```

```js src/chat.js
export function createEncryptedConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl inin bir dize olması bekleniyordu. Bu Geldi:: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId nin string olması gerekiyordu. Bu Geldi: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ 🔐 Şuraya bağlanılıyor "' + roomId + '" odası... (şifrelenmiş)');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ 🔐 Şuradan bağlantı kesildi "' + roomId + '" odası (şifrelenmiş)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Yönetici iki kez eklenemez.');
      }
      if (event !== 'message') {
        throw Error('Yalnızca "message" olayı desteklenir.');
      }
      messageCallback = callback;
    },
  };
}

export function createUnencryptedConnection({ serverUrl, roomId }) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  if (typeof serverUrl !== 'string') {
    throw Error('serverUrl inin bir dize olması bekleniyordu. Bu Geldi:: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('roomId nin string olması gerekiyordu. Bu Geldi: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Şuraya bağlanılıyor "' + roomId + '" odası (şifrelenmemiş)...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Şuradan bağlantı kesidi "' + roomId + '" odası (şifrelenmemiş)');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Yönetici iki kez eklenemez.');
      }
      if (event !== 'message') {
        throw Error('Yalnızca "message" olayı desteklenir.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```css
label, button { display: block; margin-bottom: 5px; }
```

</Sandpack>

</Solution>

</Challenges>
