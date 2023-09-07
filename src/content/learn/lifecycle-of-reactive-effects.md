---
title: 'Reacktif Efektlerin Yaşam Döngüsü'
---

<Intro>

Efektler bileşenlerden farklı bir yaşam döngüsü vardır. Bileşenler takılabilir, güncellenebilir veya çıkarılabilir.Efektler sadece iki şey yapabilir: bir şeyi senkronize etmeye başlamak için, ve daha sonra senkronizasyonu durdurmak için. Efektler zaman içinde değişen sahne ve durumlara bağlıysa bu döngü birden çok kez gerçekleşebilir. React, Efekt'inizin bağımlılıklarını doğru belirtip belirtmediğinizi kontrol etmek için bir linter kuralı sağlar. Bu, Efektinizin en son props ve state ile senkronize olmasını sağlar.

</Intro>

<YouWillLearn>

  Efektlerin yaşam döngüsü bir bileşenin yaşam döngüsünden nasıl farklıdır
- Her bir Efekt tek başına nasıl düşünülebilir
- Efekt ne zaman ve neden yeniden senkronize edilmesi gerektiği
- Efekt bağımlılıkları nasıl belirlenir?
- Bir değerin reaktif olması ne anlama gelir
- Boş bir bağımlılık dizisi ne anlama gelir?
- React, bir linter ile bağımlılıklarınızın doğru olduğunu nasıl doğrular
- Linter ile aynı fikirde olmadığınızda ne yapmalısınız

</YouWillLearn>

## Efektin Yaşam Döngüsü {/*the-lifecycle-of-an-effect*/}

Her React bileşeni aynı yaşam döngüsünden geçer:

- Bir bileşen ekrana eklendiğinde _monte_ edilir.
- Bir bileşen, genellikle bir etkileşime yanıt olarak yeni prop'lar veya state aldığında _updates_ yapar.
- Bir bileşen ekrandan kaldırıldığında _unmounts_ olur.

**Bileşenler hakkında düşünmek için iyi bir yol, ancak Efektler hakkında _değildir_.** Bunun yerine, her bir Efekt bileşeninizin yaşam döngüsünden bağımsız olarak düşünmeye çalışın. Bir Efekt [harici bir sistemin](/learn/synchronizing-with-effects) mevcut prop'lara ve state nasıl senkronize edileceğini açıklar. Kodunuz değiştikçe, senkronizasyonun daha sık veya daha seyrek yapılması gerekecektir.

Bu noktayı açıklamak için, bileşeninizi bir sohbet sunucusuna bağlayan bu Efekti düşünün:

```js
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Efektinizin gövdesi **senkronizasyonun nasıl başlatılacağını belirtir:**

```js {2-3}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Efektiniz tarafından döndürülen temizleme işlevi **senkronizasyonun nasıl durdurulacağını belirtir:**

```js {5}
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
    // ...
```

Sezgisel olarak, React'in bileşeniniz bağlandığında **senkronizasyonu başlatacağını** ve bileşeniniz ayrıldığında **senkronizasyonu durduracağını** düşünebilirsiniz. Ancak, bu hikayenin sonu değildir! Bazen, bileşen takılı kalırken **senkronizasyonu birden çok kez başlatmak ve durdurmak** da gerekebilir.

Şimdi bunun _neden_ gerekli olduğuna, _ne zaman_ gerçekleştiğine ve _bu davranışı _nasıl_ kontrol edebileceğinize bakalım.

<Note>

Bazı Efektler hiç temizleme fonksiyonu döndürmez. [Çoğu zaman,](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) bir tane döndürmek isteyeceksiniz-ama döndürmezseniz, React boş bir temizleme fonksiyonu döndürmüşsünüz gibi davranacaktır.

</Note>

### Senkronizasyonun neden birden fazla kez yapılması gerekebilir {/*why-synchronization-may-need-to-happen-more-than-once*/}

Bu `ChatRoom` bileşeninin, kullanıcının bir açılır menüden seçtiği bir `roomId` prop'larını aldığını düşünün. Diyelim ki kullanıcı başlangıçta `roomId` olarak `"genel"` odasını seçti. Uygulamanız `"genel"` sohbet odasını görüntüler:

```js {3}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId /* "genel" */ }) {
  // ...
  return <h1>{roomId} odasına hoş geldiniz!</h1>;
}
```

UI görüntülendikten sonra, React **senkronizasyonu başlatmak için Efektinizi çalıştıracaktır.** `"genel"` odasına bağlanır:

```js {3,4}
function ChatRoom({ roomId /* "genel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "genel" odaya bağlanır
    connection.connect();
    return () => {
      connection.disconnect(); // "genel" oda ile bağlantıyı keser
    };
  }, [roomId]);
  // ...
```

Buraya kadar her şey yolunda.

Daha sonra, kullanıcı açılır menüden farklı bir oda seçer (örneğin, `"seyahat"`). İlk olarak, React kullanıcı arayüzünü güncelleyecektir:

```js {1}
function ChatRoom({ roomId /* "seyahat" */ }) {
  // ...
  return <h1>{roomId} odasına hoş geldiniz!</h1>;
}
```

Bundan sonra ne olması gerektiğini düşünün. Kullanıcı, kullanıcı arayüzünde seçili sohbet odasının `"seyahat"` olduğunu görür. Ancak, son kez çalışan Efekt hala `"genel"` odasına bağlı. **`roomId` prop'u değişti, bu nedenle Efektinizin o zaman yaptığı şey (`"genel"` odasına bağlanmak) artık kullanıcı arayüzüyle eşleşmiyor.**

Bu noktada, React'in iki şey yapmasını istersiniz:

1. Eski `roomId` ile senkronizasyonu durdurun (`"genel"` oda ile bağlantıyı kesin)
2. Yeni `roomId` ile senkronizasyonu başlatın (`"seyahat"` odasına bağlanın)

**Neyse ki, React'e bunların her ikisini de nasıl yapacağını zaten öğrettiniz.** Efektinizin gövdesi senkronizasyonun nasıl başlatılacağını ve temizleme fonksiyonunuz da senkronizasyonun nasıl durdurulacağını belirtir. React'in şimdi yapması gereken tek şey, bunları doğru sırada ve doğru prop ve state ile çağırmaktır. Bunun tam olarak nasıl gerçekleştiğini görelim.

### React Efektinizi Nasıl Yeniden Senkronize Eder? {/*how-react-re-synchronizes-your-effect*/}

Hatırlayın, `ChatRoom` bileşeniniz `roomId` özelliği için yeni bir değer aldı. Eskiden `"general"` idi ve şimdi `"travel"` oldu. React'in sizi farklı bir odaya yeniden bağlamak için Efektinizi yeniden senkronize etmesi gerekiyor.

React, **senkronizasyonu durdurmak için,** Efektinizin `"general"` odasına bağlandıktan sonra döndürdüğü temizleme fonksiyonunu çağıracaktır. roomId` `"general"` olduğu için, temizleme fonksiyonu `"general"` odasıyla bağlantıyı keser:

```js {6}
function ChatRoom({ roomId /* "genel" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "genel" odaya bağlanır
    connection.connect();
    return () => {
      connection.disconnect(); // "genel" oda ile bağlantıyı keser
    };
    // ...
```

Ardından React, bu render sırasında sağladığınız Efekti çalıştıracaktır. Bu sefer, `roomId` `"seyahat"` olduğundan, `"seyahat"` sohbet odasına **senkronize olmaya** başlayacaktır (sonunda temizleme fonksiyonu da çağrılana kadar):

```js {3,4}
function ChatRoom({ roomId /* "seyahat" */ }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // "seyahat" odasına bağlanır
    connection.connect();
    // ...
```

Bu sayede, artık kullanıcının kullanıcı arayüzünde seçtiği odaya bağlanmış olursunuz. Felaket önlendi!

Bileşeniniz farklı bir `roomId` ile yeniden oluşturulduktan sonra her seferinde Efektiniz yeniden senkronize olacaktır. Örneğin, kullanıcı `roomId`yi `"seyahat"`ten `"müzik"`e değiştirdi diyelim. React, temizleme fonksiyonunu çağırarak (sizi `"seyahat"` odasından ayırarak) Efektinizin senkronizasyonunu tekrar **durdurur**. Ardından, gövdesini yeni `roomId` prop ile çalıştırarak (sizi `"müzik"` odasına bağlayarak) tekrar **senkronize etmeye** başlayacaktır.

Son olarak, kullanıcı farklı bir ekrana geçtiğinde, `ChatRoom` bağlantıyı kaldırır. Artık bağlı kalmaya hiç gerek yok. React, Efektinizi son bir kez **senkronize etmeyi durdurur** ve sizi `"müzik"` sohbet odasından ayırır.

### Efektin bakış açısından düşünmek {/*thinking-from-the-effects-perspective*/}

Şimdi `ChatRoom' bileşeninin bakış açısından olan her şeyi özetleyelim:

1. `ChatRoom` `roomId` `"genel"` olarak ayarlanmış şekilde monte edildi
1. `ChatRoom`, `roomId` değeri `"seyahat"` olarak ayarlanarak güncellendi
1. `ChatRoom`, `roomId` değeri `"müzik"` olarak ayarlanarak güncellendi
1. ChatRoom` bağlanmamış

Bileşenin yaşam döngüsündeki bu noktaların her biri sırasında, Efektiniz farklı şeyler yaptı:

1. Efektiniz `"genel"` odaya bağlandı
1. Efektinizin `"genel"` oda ile bağlantısı kesildi ve `"seyahat"` odasına bağlandı
1. Efektinizin "seyahat" odasıyla bağlantısı kesildi ve "müzik" odasına bağlandı
1. Efektinizin "müzik" odasıyla bağlantısı kesildi

Şimdi olanları bir de Efektin kendi perspektifinden düşünelim:

```js
  useEffect(() => {
    // Efektiniz roomId ile belirtilen odaya bağlandı...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      // ...bağlantısı kesilene kadar
      connection.disconnect();
    };
  }, [roomId]);
```

Bu kodun yapısı, olanları birbiriyle örtüşmeyen bir dizi zaman dilimi olarak görmeniz için size ilham verebilir:

1. Efektiniz `"genel"` odaya bağlandı (bağlantısı kesilene kadar)
1. Efektiniz `"seyahat"` odasına bağlı (bağlantısı kesilene kadar)
1. Efektiniz `"müzik"` odasına bağlı (bağlantısı kesilene kadar)

Önceden, bileşenin bakış açısından düşünüyordunuz. Bileşenin perspektifinden baktığınızda, Efektleri "render işleminden sonra" veya "unmount işleminden önce" gibi belirli bir zamanda ateşlenen "geri aramalar" veya "yaşam döngüsü olayları" olarak düşünmek cazip geliyordu. Bu düşünce tarzı çok hızlı bir şekilde karmaşıklaşır, bu nedenle kaçınmak en iyisidir.

**Bunun yerine, her zaman bir seferde tek bir başlatma/durdurma döngüsüne odaklanın. Bir bileşenin takılıyor, güncelleniyor ya da sökülüyor olması önemli olmamalıdır. Yapmanız gereken tek şey senkronizasyonun nasıl başlatılacağını ve nasıl durdurulacağını açıklamaktır. Bunu iyi yaparsanız, Efektiniz ihtiyaç duyulduğu kadar çok kez başlatılmaya ve durdurulmaya dayanıklı olacaktır.**

Bu size, JSX oluşturan işleme mantığını yazarken bir bileşenin monte edilip edilmediğini veya güncellenip güncellenmediğini nasıl düşünmediğinizi hatırlatabilir. Siz ekranda ne olması gerektiğini tanımlarsınız ve React [gerisini çözer](/learn/reacting-to-input-with-state)

### React, Efektinizin yeniden senkronize olabileceğini nasıl doğrular {/*how-react-verifies-that-your-effect-can-re-synchronize*/}

İşte oynayabileceğiniz canlı bir örnek. ChatRoom bileşenini bağlamak için "Sohbeti aç" düğmesine basın:

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
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Sohbet odasını seçin:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="müzik">müzik</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Sohbeti kapat' : 'Sohbeti aç'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Bağlanmak "' + roomId + '" oda ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Bağlantısı kesildi "' + roomId + '" oda ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Bileşen ilk kez bağlandığında üç günlük gördüğünüze dikkat edin:

1. `✅ "Genel" odaya bağlanma https://localhost:1234...` *(sadece geliştirme)*
1. `❌ "Genel" oda ile bağlantı kesildi https://localhost:1234.` *(sadece geliştirme)*
1. `✅ Adresinden "genel" odasına bağlanıyor https://localhost:1234...`

İlk iki günlük yalnızca geliştirmeye yöneliktir. Geliştirme aşamasında, React her bileşeni her zaman bir kez yeniden bağlar.

**React, Efektinizin yeniden senkronize olup olamayacağını, onu geliştirme aşamasında bunu hemen yapmaya zorlayarak doğrular.** Bu size kapı kilidinin çalışıp çalışmadığını kontrol etmek için bir kapıyı açıp fazladan bir kez kapatmayı hatırlatabilir. React, kontrol etmek için geliştirme sırasında Efektinizi fazladan bir kez başlatır ve durdurur [temizlemeyi iyi uyguladığınızı](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

Efektinizin pratikte yeniden senkronize olmasının ana nedeni, kullandığı bazı verilerin değişmiş olmasıdır. Yukarıdaki sanal alanda, seçili sohbet odasını değiştirin. RoomId` değiştiğinde Efektinizin nasıl yeniden senkronize olduğuna dikkat edin.

Ancak, yeniden senkronizasyonun gerekli olduğu daha sıra dışı durumlar da vardır. Örneğin, sohbet açıkken yukarıdaki sanal alanda `sunucuUrl`yi düzenlemeyi deneyin. Kodda yaptığınız düzenlemelere yanıt olarak Efekt'in nasıl yeniden senkronize olduğuna dikkat edin. Gelecekte React, yeniden senkronizasyona dayanan daha fazla özellik ekleyebilir.

### React, Efekti yeniden senkronize etmesi gerektiğini nasıl anlar {/*how-react-knows-that-it-needs-to-re-synchronize-the-effect*/}

React'in `roomId` değiştikten sonra Efektinizin yeniden senkronize edilmesi gerektiğini nasıl bildiğini merak ediyor olabilirsiniz. Çünkü *React'e* kodunun `roomId`'ye bağlı olduğunu [bağımlılıklar listesi:](/learn/synchronizing-with-effects#step-2-specify-the-effect-dependencies) içine dahil ederek söylediniz.


```js {1,3,8}
function ChatRoom({ roomId }) { // roomId özelliği zaman içinde değişebilir
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Bu Efektte roomId'yi okur
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]); // Böylece React'e bu Efektin roomId'ye "bağlı" olduğunu söylersiniz
  // ...
```

Here's how this works:

1. You knew `roomId` is a prop, which means it can change over time.
2. You knew that your Effect reads `roomId` (so its logic depends on a value that may change later).
3. This is why you specified it as your Effect's dependency (so that it re-synchronizes when `roomId` changes).

Bileşeniniz yeniden oluşturulduktan sonra React her seferinde geçtiğiniz bağımlılıklar dizisine bakacaktır. Dizideki değerlerden herhangi biri, önceki render sırasında geçtiğiniz aynı noktadaki değerden farklıysa, React Efektinizi yeniden senkronize edecektir.

Örneğin, ilk render sırasında `["genel"]` değerini geçtiyseniz ve daha sonra bir sonraki render sırasında `["seyahat"]` değerini geçtiyseniz, React `"genel"` ve `"seyahat"` değerlerini karşılaştıracaktır. Bunlar farklı değerlerdir ([`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) ile karşılaştırıldığında), bu nedenle React Efektinizi yeniden senkronize edecektir. Öte yandan, bileşeniniz yeniden render edilirse ancak `roomId` değişmediyse, Efektiniz aynı odaya bağlı kalacaktır.

### Her Efekt ayrı bir senkronizasyon sürecini temsil eder {/*each-effect-represents-a-separate-synchronization-process*/}

Yalnızca bu mantığın daha önce yazdığınız bir Efekt ile aynı anda çalışması gerektiği için Efektinize ilgisiz bir mantık eklemekten kaçının. Örneğin, kullanıcı odayı ziyaret ettiğinde bir analiz olayı göndermek istediğinizi varsayalım. Zaten `roomId`ye bağlı bir Efektiniz var, bu nedenle analitik çağrısını oraya eklemek isteyebilirsiniz:

```js {3}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Ancak daha sonra bu Efekte bağlantıyı yeniden kurması gereken başka bir bağımlılık eklediğinizi düşünün. Bu Efekt yeniden senkronize olursa, aynı oda için `logVisit(roomId)` çağrısı da yapacaktır, ki bunu istememiştiniz. Ziyaretin günlüğe kaydedilmesi **bağlantıdan ayrı bir süreçtir**. Bunları iki ayrı Efekt olarak yazın:

```js {2-4}
function ChatRoom({ roomId }) {
  useEffect(() => {
    logVisit(roomId);
  }, [roomId]);

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    // ...
  }, [roomId]);
  // ...
}
```

**Kodunuzdaki her bir Efekt ayrı ve bağımsız bir senkronizasyon sürecini temsil etmelidir.**

Yukarıdaki örnekte, bir Efektin silinmesi diğer Efektin mantığını bozmayacaktır. Bu, farklı şeyleri senkronize ettiklerinin iyi bir göstergesidir ve bu nedenle onları ayırmak mantıklıdır. Öte yandan, uyumlu bir mantık parçasını ayrı Efektlere bölerseniz, kod "daha temiz" görünebilir ancak [bakımı daha zor](/learn/you-might-not-need-an-effect#chains-of-computations) olacaktır. Bu nedenle, kodun daha temiz görünüp görünmediğini değil, süreçlerin aynı mı yoksa ayrı mı olduğunu düşünmelisiniz.

## Efektler reaktif değerlere "tepki verir" {/*effects-react-to-reactive-values*/}

Efektiniz iki değişkeni (`serverUrl` ve `roomId`) okuyor, ancak bağımlılık olarak yalnızca `roomId` belirtmişsiniz:

```js {5,10}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Neden `serverUrl` bir bağımlılık olmak zorunda değil?

Çünkü `serverUrl` yeniden oluşturma nedeniyle asla değişmez. Bileşen kaç kez yeniden oluşturulursa oluşturulsun ve nedeni ne olursa olsun her zaman aynıdır. SunucuUrl` asla değişmediğinden, bunu bir bağımlılık olarak belirtmek mantıklı olmaz. Sonuçta, bağımlılıklar yalnızca zaman içinde değiştiklerinde bir şey yaparlar!

Öte yandan, `roomId` yeniden oluşturmada farklı olabilir. **Bileşen içinde bildirilen prop'lar, state ve diğer değerler _reaktiftir_ çünkü render sırasında hesaplanırlar ve React veri akışına katılırlar.**

Eğer `serverUrl` bir state değişkeni olsaydı, reaktif olurdu. Reaktif değerler bağımlılıklara dahil edilmelidir:

```js {2,5,10}
function ChatRoom({ roomId }) { // Prop'ların zaman içinde değişimi
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State zaman içinde değişebilir

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Efektin prop'ları ve state okur
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Böylece React'e bu Efektin proplara ve state "bağlı" olduğunu söylersiniz
  // ...
}
```

Sunucu URL`sini bir bağımlılık olarak dahil ederek, Efektin değiştikten sonra yeniden senkronize olmasını sağlarsınız.

Seçili sohbet odasını değiştirmeyi deneyin veya bu sanal alanda sunucu URL'sini düzenleyin:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>{roomId} odasına hoş geldiniz!</h1>
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
          <option value="genel">general</option>
          <option value="seyahat">seyahat</option>
          <option value="müzik">müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama aslında sunucuya bağlanır
  return {
    connect() {
      console.log('✅ Bağlanmak "' + roomId + '" oda ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Bağlantısı kesildi "' + roomId + '" oda ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

`roomId` veya `serverUrl` gibi reaktif bir değeri her değiştirdiğinizde, Efekt sohbet sunucusuna yeniden bağlanır.

### Boş bağımlılıklara sahip bir Efekt ne anlama gelir {/*what-an-effect-with-empty-dependencies-means*/}

Hem `serverUrl` hem de `roomId` öğelerini bileşenin dışına taşırsanız ne olur?

```js {1,2}
const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Tüm bağımlılıklar beyan edildi
  // ...
}
```

Artık Efektinizin kodu *hiçbir* reaktif değer kullanmadığından bağımlılıkları boş olabilir (`[]`).

Bileşenin bakış açısından düşünürsek, boş `[]` bağımlılık dizisi, bu Efektin sohbet odasına yalnızca bileşen bağlandığında bağlandığı ve yalnızca bileşen ayrıldığında bağlantıyı kestiği anlamına gelir. (React'in mantığınızı stres testi için geliştirme sırasında [fazladan bir kez daha senkronize edeceğini](#how-react-verifies-that-your-effect-can-re-synchronize) unutmayın).


<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>{roomId} odasına hoş geldiniz!</h1>;
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Sohbeti kapat' : 'Sohbeti aç'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama sunucuya gerçekten bağlanır
  return {
    connect() {
      console.log('✅ Bağlantı "' + roomId + '" oda ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Bağlantısı kesildi "' + roomId + '" oda ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Ancak, [Efektin bakış açısından düşünürseniz](#thinking-from-the-effects-perspective) takma ve çıkarma hakkında düşünmenize hiç gerek yoktur. Önemli olan, Efektinizin senkronizasyonu başlatmak ve durdurmak için ne yaptığını belirtmiş olmanızdır. Bugün, hiçbir reaktif bağımlılığı yoktur. Ancak kullanıcının zaman içinde `roomId` veya `serverUrl` değerlerini değiştirmesini isterseniz (ve bunlar reaktif hale gelirse), Efektinizin kodu değişmeyecektir. Sadece bunları bağımlılıklara eklemeniz gerekecektir.

### Bileşen gövdesinde bildirilen tüm değişkenler reaktiftir {/*all-variables-declared-in-the-component-body-are-reactive*/}

Tek reaktif değerler prop'lar ve state değildir. Bunlardan hesapladığınız değerler de reaktiftir. Prop'lar veya state değişirse bileşeniniz yeniden render edilir ve bunlardan hesaplanan değerler de değişir. Bu nedenle, Efekt tarafından kullanılan bileşen gövdesindeki tüm değişkenler Efekt bağımlılık listesinde olmalıdır.

Diyelim ki kullanıcı açılır menüden bir sohbet sunucusu seçebiliyor, ancak ayarlardan varsayılan bir sunucu da yapılandırabiliyor. Ayarlar durumunu zaten bir [context](/learn/scaling-up-with-reducer-and-context) içine koyduğunuzu ve böylece `ayarlar`i bu bağlamdan okuduğunuzu varsayalım. Şimdi `serverUrl`yi props ve varsayılan sunucudan seçilen sunucuya göre hesaplarsınız:

```js {3,5,10}
function ChatRoom({ roomId, selectedServerUrl }) { // roomId reaktiftir
  const settings = useContext(SettingsContext); // ayarlar reaktiftir
  const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl reaktiftir
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // Efektiniz roomId ve serverUrl değerlerini okur
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]); // Bu yüzden bunlardan herhangi biri değiştiğinde yeniden senkronize edilmesi gerekir!
  // ...
}
```

Bu örnekte, `serverUrl` bir prop veya state değişkeni değildir. Render sırasında hesapladığınız normal bir değişkendir. Ancak render sırasında hesaplanır, bu nedenle yeniden render nedeniyle değişebilir. Bu yüzden reaktiftir.

**Bileşen içindeki tüm değerler (prop'lar, durum ve bileşeninizin gövdesindeki değişkenler dahil) reaktiftir. Herhangi bir reaktif değer yeniden işlendiğinde değişebilir, bu nedenle reaktif değerleri Effect'in bağımlılıkları olarak eklemeniz gerekir.**

Başka bir deyişle, Efektler bileşen gövdesindeki tüm değerlere "tepki" verir.

<DeepDive>

#### Global veya değiştirilebilir değerler bağımlılık olabilir mi? {/*can-global-or-mutable-values-be-dependencies*/}

Değiştirilebilir değerler (global değişkenler dahil) reaktif değildir.

**[`location.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/Location/pathname) gibi değişken bir değer bağımlılık olamaz.** Değişkendir, bu nedenle React render veri akışının tamamen dışında herhangi bir zamanda değişebilir. Değiştirilmesi bileşeninizin yeniden render edilmesini tetiklemez. Bu nedenle, bağımlılıklarda belirtmiş olsanız bile, React *değiştiğinde Efekti yeniden senkronize edeceğini bilemez*. Bu aynı zamanda React'in kurallarını da ihlal eder, çünkü render sırasında (bağımlılıkları hesapladığınız zaman) değişebilir verileri okumak [purity of rendering.](/learn/keeping-components-pure) Bunun yerine, [`useSyncExternalStore'](/learn/you-might-not-need-an-effect#subscribing-to-an-external-store) ile harici bir değişebilir değeri okumalı ve abone olmalısınız.

**[`ref.current`](/reference/react/useRef#reference) gibi değiştirilebilir bir değer veya ondan okuduğunuz şeyler de bir bağımlılık olamaz.** `useRef` tarafından döndürülen ref nesnesinin kendisi bir bağımlılık olabilir, ancak `current` özelliği kasıtlı olarak değiştirilebilir. [Yeniden oluşturmayı tetiklemeden bir şeyi takip etmenizi sağlar](/learn/referencing-values-with-refs) Ancak onu değiştirmek yeniden oluşturmayı tetiklemediğinden, reaktif bir değer değildir ve React, değiştiğinde Efektinizi yeniden çalıştırmayı bilmez.

Bu sayfada aşağıda öğreneceğiniz gibi, bir linter bu sorunları otomatik olarak kontrol edecektir.

</DeepDive>

### React, her reaktif değeri bir bağımlılık olarak belirttiğinizi doğrular {/*react-verifies-that-you-specified-every-reactive-value-as-a-dependency*/}

Eğer linter'ınız [React için yapılandırılmışsa,](/learn/editor-setup#linting) Effect'inizin kodu tarafından kullanılan her reaktif değerin bağımlılığı olarak bildirilip bildirilmediğini kontrol edecektir. Örneğin, bu bir lint hatasıdır çünkü hem `roomId` hem de `serverUrl` reaktiftir:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) { // roomId reaktiftir
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl reaktiftir

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // <-- Burada bir sorun var!

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>{roomId} odasına hoş geldiniz!</h1>
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
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="müzik">müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama sunucuya gerçekten bağlanır
  return {
    connect() {
      console.log('✅ Bağlanmak "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Bağlantısı kesildi "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Bu bir React hatası gibi görünebilir, ancak aslında React kodunuzdaki bir hataya işaret ediyor. Hem `roomId` hem de `serverUrl` zaman içinde değişebilir, ancak bunlar değiştiğinde Efektinizi yeniden senkronize etmeyi unutuyorsunuz. Kullanıcı kullanıcı arayüzünde farklı değerler seçtikten sonra bile ilk `roomId` ve `serverUrl` değerlerine bağlı kalacaksınız.

Hatayı düzeltmek için, `roomId` ve `serverUrl` değerlerini Efektinizin bağımlılıkları olarak belirtmek için linter'ın önerisini izleyin:

```js {9}
function ChatRoom({ roomId }) { // roomId reaktiftir
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl reaktiftir
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]); // ✅ Bildirilen tüm bağımlılıklar
  // ...
}
```

Bu düzeltmeyi yukarıdaki sandbox'ta deneyin. Linter hatasının ortadan kalktığını ve sohbetin gerektiğinde yeniden bağlandığını doğrulayın.

<Note>

Bazı durumlarda React, bir değerin bileşen içinde bildirilmiş olmasına rağmen asla değişmediğini *bilmektedir*. Örneğin, `useState`'den döndürülen [`set` fonksiyonu](/reference/react/useState#setstate) ve [`useRef`](/reference/react/useRef) tarafından döndürülen ref nesnesi *stable*'dır - yeniden oluşturmada değişmeyecekleri garanti edilir. Stabil değerler reaktif değildir, bu yüzden onları listeden çıkarabilirsiniz. Bunları dahil etmeye izin verilir: değişmeyeceklerdir, bu yüzden önemli değildir.

</Note>

### Yeniden senkronize etmek istemediğinizde ne yapmalısınız? {/*what-to-do-when-you-dont-want-to-re-synchronize*/}

Önceki örnekte, `roomId` ve `serverUrl` değerlerini bağımlılık olarak listeleyerek lint hatasını düzelttiniz.

**Bununla birlikte, bunun yerine bu değerlerin reaktif değerler olmadığını, yani yeniden oluşturma sonucunda *değişemeyeceklerini** linter'a "kanıtlayabilirsiniz". Örneğin, `serverUrl` ve `roomId` render işlemine bağlı değilse ve her zaman aynı değerlere sahipse, bunları bileşenin dışına taşıyabilirsiniz. Artık bağımlılık olmalarına gerek yoktur:

```js {1,2,11}
const serverUrl = 'https://localhost:1234'; // serverUrl reaktif değil
const roomId = 'genel'; // roomId reaktif değil

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Bildirilen tüm bağımlılıklar
  // ...
}
```

Bunları *Efektin içinde* de taşıyabilirsiniz.* Render sırasında hesaplanmazlar, bu nedenle reaktif değildirler:

```js {3,4,10}
function ChatRoom() {
  useEffect(() => {
    const serverUrl = 'https://localhost:1234'; // serverUrl reaktif değil
    const roomId = 'genel'; // roomId reaktif değil
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []); // ✅ Bildirilen tüm bağımlılıklar
  // ...
}
```

**Efektler reaktif kod bloklarıdır.** İçlerinde okuduğunuz değerler değiştiğinde yeniden senkronize olurlar. Etkileşim başına yalnızca bir kez çalışan olay işleyicilerin aksine, Efektler senkronizasyon gerektiğinde çalışır.

**Bağımlılıklarınızı "seçemezsiniz. "** Bağımlılıklarınız, Efektte okuduğunuz her [reaktif değeri](#all-variables-declared-in-the-component-body-are-reactive) içermelidir. Linter bunu zorunlu kılar. Bazen bu, sonsuz döngüler ve Efektinizin çok sık yeniden senkronize edilmesi gibi sorunlara yol açabilir. Bu sorunları linter'ı bastırarak çözmeyin! İşte bunun yerine deneyeceğiniz şey:

* **Efektinizin bağımsız bir senkronizasyon sürecini temsil edip etmediğini kontrol edin.** Efektiniz hiçbir şeyi senkronize etmiyorsa, [gereksiz olabilir.](/learn/you-might-not-need-an-effect) Birden fazla bağımsız şeyi senkronize ediyorsa, [bölün.](#each-effect-represents-a-separate-synchronization-process)

* **Eğer prop'ların veya state'in en son değerini ona "tepki vermeden" ve Efekti yeniden senkronize etmeden okumak istiyorsanız,** Efektinizi reaktif bir parçaya (Efekt içinde tutacağınız) ve reaktif olmayan bir parçaya (Efekt Olayı_ adı verilen bir şeye çıkaracağınız) bölebilirsiniz. [Olayları Efektlerden ayırma hakkında bilgi edinin](/learn/separating-events-from-effects)

* **Nesnelere ve işlevlere bağımlılık olarak güvenmekten kaçının** Render sırasında nesneler ve işlevler oluşturur ve ardından bunları bir Efektten okursanız, her renderda farklı olurlar. Bu, Efektinizin her seferinde yeniden senkronize olmasına neden olur. [Efektlerden gereksiz bağımlılıkları kaldırma hakkında daha fazla bilgi edinin](/learn/removing-effect-dependencies)

<Pitfall>

Linter sizin dostunuzdur, ancak yetkileri sınırlıdır. Linter yalnızca bağımlılıkların ne zaman *yanlış* olduğunu bilir. Her bir durumu çözmenin *en iyi* yolunu bilmez. Linter bir bağımlılık öneriyorsa, ancak bunu eklemek bir döngüye neden oluyorsa, bu linter'ın göz ardı edilmesi gerektiği anlamına gelmez. Efektin içindeki (veya dışındaki) kodu değiştirmeniz gerekir, böylece bu değer reaktif olmaz ve bir bağımlılık olmasına *ihtiyaç* kalmaz.

Mevcut bir kod tabanınız varsa, bu şekilde linter'ı bastıran bazı Efektleriniz olabilir:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Linteri bu şekilde bastırmaktan kaçının:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

[Sonraki](/learn/separating-events-from-effects) [sayfalarda](/learn/removing-effect-dependencies), bu kodu kuralları bozmadan nasıl düzelteceğinizi öğreneceksiniz. Her zaman düzeltmeye değer!

</Pitfall>

<Recap>

- Bileşenler takılabilir, güncellenebilir ve çıkarılabilir.
- Her Efektin çevresindeki bileşenden ayrı bir yaşam döngüsü vardır.
- Her bir Efekt, *başlatılabilen* ve *durdurulabilen* ayrı bir senkronizasyon sürecini tanımlar.
- Efektleri yazarken ve okurken, bileşenin bakış açısından (nasıl bağlandığı, güncellendiği veya kaldırıldığı) ziyade her bir Efektin bakış açısından (senkronizasyonun nasıl başlatılacağı ve durdurulacağı) düşünün.
- Bileşen gövdesi içinde bildirilen değerler "reaktiftir".
- Reaktif değerler zaman içinde değişebileceğinden Efekti yeniden senkronize etmelidir.
- Linter, Efekt içinde kullanılan tüm reaktif değerlerin bağımlılık olarak belirtildiğini doğrular.
- Linter tarafından işaretlenen tüm hatalar meşrudur. Kuralları ihlal etmemek için kodu düzeltmenin her zaman bir yolu vardır.

</Recap>

<Challenges>

#### Her tuş vuruşunda yeniden bağlanmayı düzeltme {/*fix-reconnecting-on-every-keystroke*/}

Bu örnekte, `ChatRoom` bileşeni, bileşen bağlandığında sohbet odasına bağlanır, bağlantıyı kestiğinde bağlantıyı keser ve farklı bir sohbet odası seçtiğinizde yeniden bağlanır. Bu davranış doğrudur, bu nedenle çalışmaya devam etmesi gerekir.

Ancak, bir sorun var. Alttaki mesaj kutusu girişine her yazdığınızda, `ChatRoom` *ayrıca* sohbete yeniden bağlanır. (Bunu konsolu temizleyerek ve girdiye yazarak fark edebilirsiniz.) Bunun gerçekleşmemesi için sorunu düzeltin.

<Hint>

Bu Efekt için bir bağımlılık dizisi eklemeniz gerekebilir. Orada hangi bağımlılıklar olmalı?

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  });

  return (
    <>
      <h1>{roomId} odasına hoş geldiniz!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
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
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="müzik">müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama sunucuya gerçekten bağlanır
  return {
    connect() {
      console.log('✅ Bağlanmak "' + roomId + '" oda ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Bağlantısı kesildi "' + roomId + '" oda ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Solution>

Bu Efektin bir bağımlılık dizisi yoktu, bu yüzden her yeniden oluşturmadan sonra yeniden senkronize oluyordu. İlk olarak, bir bağımlılık dizisi ekleyin. Ardından, Efekt tarafından kullanılan her reaktif değerin dizide belirtildiğinden emin olun. Örneğin, `roomId` reaktiftir (çünkü bir prop'tur), bu nedenle diziye dahil edilmelidir. Bu, kullanıcı farklı bir oda seçtiğinde sohbetin yeniden bağlanmasını sağlar. Öte yandan, `serverUrl` bileşenin dışında tanımlanır. Bu yüzden dizide olması gerekmez.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>{roomId} odasına hoş geldiniz!</h1>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('genel');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="genel">genel</option>
          <option value="seyahat">seyahat</option>
          <option value="müzik">müzik</option>
        </select>
      </label>
      <hr />
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Gerçek bir uygulama sunucuya gerçekten bağlanır
  return {
    connect() {
      console.log('✅ Bağlanmak "' + roomId + '" oda ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Bağlantısı kesildi "' + roomId + '" oda ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

</Solution>

#### Senkronizasyonu açma ve kapatma {/*switch-synchronization-on-and-off*/}

Bu örnekte, bir Efekt ekranda pembe bir noktayı hareket ettirmek için window [`pointermove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event) olayına abone olur. Önizleme alanının üzerine gelmeyi deneyin (veya mobil bir cihaz kullanıyorsanız ekrana dokunun) ve pembe noktanın hareketinizi nasıl takip ettiğini görün.

Ayrıca bir onay kutusu da vardır. Onay kutusunun işaretlenmesi `canMove` durum değişkenini değiştirir, ancak bu durum değişkeni kodun hiçbir yerinde kullanılmaz. Sizin göreviniz kodu, `canMove` `false` olduğunda (onay kutusu işaretlendiğinde) noktanın hareket etmeyi durduracağı şekilde değiştirmektir. Onay kutusunu tekrar açtıktan (ve `canMove` öğesini `true` olarak ayarladıktan) sonra, kutu hareketi tekrar takip etmelidir. Başka bir deyişle, noktanın hareket edip edemeyeceği onay kutusunun işaretli olup olmamasıyla senkronize kalmalıdır.

<Hint>

Bir Efekti koşullu olarak bildiremezsiniz. Ancak, Efektin içindeki kod koşulları kullanabilir!

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        Noktanın hareket etmesine izin verilir
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

<Solution>

Çözümlerden biri `setPosition` çağrısını bir `if (canMove) { ... }` koşuluna sarmaktır:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        Noktanın hareket etmesine izin verilir
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Alternatif olarak, *olay aboneliği* mantığını bir `if (canMove) { ... }` koşuluna sarabilirsiniz:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    if (canMove) {
      window.addEventListener('pointermove', handleMove);
      return () => window.removeEventListener('pointermove', handleMove);
    }
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

In both of these cases, `canMove` is a reactive variable that you read inside the Effect. This is why it must be specified in the list of Effect dependencies. This ensures that the Effect re-synchronizes after every change to its value.

</Solution>

#### Investigate a stale value bug {/*investigate-a-stale-value-bug*/}

In this example, the pink dot should move when the checkbox is on, and should stop moving when the checkbox is off. The logic for this has already been implemented: the `handleMove` event handler checks the `canMove` state variable.

However, for some reason, the `canMove` state variable inside `handleMove` appears to be "stale": it's always `true`, even after you tick off the checkbox. How is this possible? Find the mistake in the code and fix it.

<Hint>

If you see a linter rule being suppressed, remove the suppression! That's where the mistakes usually are.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

<Solution>

The problem with the original code was suppressing the dependency linter. If you remove the suppression, you'll see that this Effect depends on the `handleMove` function. This makes sense: `handleMove` is declared inside the component body, which makes it a reactive value. Every reactive value must be specified as a dependency, or it can potentially get stale over time!

The author of the original code has "lied" to React by saying that the Effect does not depend (`[]`) on any reactive values. This is why React did not re-synchronize the Effect after `canMove` has changed (and `handleMove` with it). Because React did not re-synchronize the Effect, the `handleMove` attached as a listener is the `handleMove` function created during the initial render. During the initial render, `canMove` was `true`, which is why `handleMove` from the initial render will forever see that value.

**If you never suppress the linter, you will never see problems with stale values.** There are a few different ways to solve this bug, but you should always start by removing the linter suppression. Then change the code to fix the lint error.

You can change the Effect dependencies to `[handleMove]`, but since it's going to be a newly defined function for every render, you might as well remove dependencies array altogether. Then the Effect *will* re-synchronize after every re-render:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  });

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

This solution works, but it's not ideal. If you put `console.log('Resubscribing')` inside the Effect, you'll notice that it resubscribes after every re-render. Resubscribing is fast, but it would still be nice to avoid doing it so often.

A better fix would be to move the `handleMove` function *inside* the Effect. Then `handleMove` won't be a reactive value, and so your Effect won't depend on a function. Instead, it will need to depend on `canMove` which your code now reads from inside the Effect. This matches the behavior you wanted, since your Effect will now stay synchronized with the value of `canMove`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  useEffect(() => {
    function handleMove(e) {
      if (canMove) {
        setPosition({ x: e.clientX, y: e.clientY });
      }
    }

    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, [canMove]);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)} 
        />
        The dot is allowed to move
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Try adding `console.log('Resubscribing')` inside the Effect body and notice that now it only resubscribes when you toggle the checkbox (`canMove` changes) or edit the code. This makes it better than the previous approach that always resubscribed.

You'll learn a more general approach to this type of problem in [Separating Events from Effects.](/learn/separating-events-from-effects)

</Solution>

#### Fix a connection switch {/*fix-a-connection-switch*/}

In this example, the chat service in `chat.js` exposes two different APIs: `createEncryptedConnection` and `createUnencryptedConnection`. The root `App` component lets the user choose whether to use encryption or not, and then passes down the corresponding API method to the child `ChatRoom` component as the `createConnection` prop.

Notice that initially, the console logs say the connection is not encrypted. Try toggling the checkbox on: nothing will happen. However, if you change the selected room after that, then the chat will reconnect *and* enable encryption (as you'll see from the console messages). This is a bug. Fix the bug so that toggling the checkbox *also* causes the chat to reconnect.

<Hint>

Suppressing the linter is always suspicious. Could this be a bug?

</Hint>

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

If you remove the linter suppression, you will see a lint error. The problem is that `createConnection` is a prop, so it's a reactive value. It can change over time! (And indeed, it should--when the user ticks the checkbox, the parent component passes a different value of the `createConnection` prop.) This is why it should be a dependency. Include it in the list to fix the bug:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        createConnection={isEncrypted ?
          createEncryptedConnection :
          createUnencryptedConnection
        }
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';

export default function ChatRoom({ roomId, createConnection }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, createConnection]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

It is correct that `createConnection` is a dependency. However, this code is a bit fragile because someone could edit the `App` component to pass an inline function as the value of this prop. In that case, its value would be different every time the `App` component re-renders, so the Effect might re-synchronize too often. To avoid this, you can pass `isEncrypted` down instead:

<Sandpack>

```js App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isEncrypted, setIsEncrypted] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isEncrypted}
          onChange={e => setIsEncrypted(e.target.checked)}
        />
        Enable encryption
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        isEncrypted={isEncrypted}
      />
    </>
  );
}
```

```js ChatRoom.js active
import { useState, useEffect } from 'react';
import {
  createEncryptedConnection,
  createUnencryptedConnection,
} from './chat.js';

export default function ChatRoom({ roomId, isEncrypted }) {
  useEffect(() => {
    const createConnection = isEncrypted ?
      createEncryptedConnection :
      createUnencryptedConnection;
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, isEncrypted]);

  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
export function createEncryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ 🔐 Connecting to "' + roomId + '... (encrypted)');
    },
    disconnect() {
      console.log('❌ 🔐 Disconnected from "' + roomId + '" room (encrypted)');
    }
  };
}

export function createUnencryptedConnection(roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '... (unencrypted)');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room (unencrypted)');
    }
  };
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

In this version, the `App` component passes a boolean prop instead of a function. Inside the Effect, you decide which function to use. Since both `createEncryptedConnection` and `createUnencryptedConnection` are declared outside the component, they aren't reactive, and don't need to be dependencies. You'll learn more about this in [Removing Effect Dependencies.](/learn/removing-effect-dependencies)

</Solution>

#### Populate a chain of select boxes {/*populate-a-chain-of-select-boxes*/}

In this example, there are two select boxes. One select box lets the user pick a planet. Another select box lets the user pick a place *on that planet.* The second box doesn't work yet. Your task is to make it show the places on the chosen planet.

Look at how the first select box works. It populates the `planetList` state with the result from the `"/planets"` API call. The currently selected planet's ID is kept in the `planetId` state variable. You need to find where to add some additional code so that the `placeList` state variable is populated with the result of the `"/planets/" + planetId + "/places"` API call.

If you implement this right, selecting a planet should populate the place list. Changing a planet should change the place list.

<Hint>

If you have two independent synchronization processes, you need to write two separate Effects.

</Hint>

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

There are two independent synchronization processes:

- The first select box is synchronized to the remote list of planets.
- The second select box is synchronized to the remote list of places for the current `planetId`.

This is why it makes sense to describe them as two separate Effects. Here's an example of how you could do this:

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export default function Page() {
  const [planetList, setPlanetList] = useState([])
  const [planetId, setPlanetId] = useState('');

  const [placeList, setPlaceList] = useState([]);
  const [placeId, setPlaceId] = useState('');

  useEffect(() => {
    let ignore = false;
    fetchData('/planets').then(result => {
      if (!ignore) {
        console.log('Fetched a list of planets.');
        setPlanetList(result);
        setPlanetId(result[0].id); // Select the first planet
      }
    });
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (planetId === '') {
      // Nothing is selected in the first box yet
      return;
    }

    let ignore = false;
    fetchData('/planets/' + planetId + '/places').then(result => {
      if (!ignore) {
        console.log('Fetched a list of places on "' + planetId + '".');
        setPlaceList(result);
        setPlaceId(result[0].id); // Select the first place
      }
    });
    return () => {
      ignore = true;
    }
  }, [planetId]);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '???'} on {planetId || '???'} </p>
    </>
  );
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

This code is a bit repetitive. However, that's not a good reason to combine it into a single Effect! If you did this, you'd have to combine both Effect's dependencies into one list, and then changing the planet would refetch the list of all planets. Effects are not a tool for code reuse.

Instead, to reduce repetition, you can extract some logic into a custom Hook like `useSelectOptions` below:

<Sandpack>

```js App.js
import { useState } from 'react';
import { useSelectOptions } from './useSelectOptions.js';

export default function Page() {
  const [
    planetList,
    planetId,
    setPlanetId
  ] = useSelectOptions('/planets');

  const [
    placeList,
    placeId,
    setPlaceId
  ] = useSelectOptions(planetId ? `/planets/${planetId}/places` : null);

  return (
    <>
      <label>
        Pick a planet:{' '}
        <select value={planetId} onChange={e => {
          setPlanetId(e.target.value);
        }}>
          {planetList?.map(planet =>
            <option key={planet.id} value={planet.id}>{planet.name}</option>
          )}
        </select>
      </label>
      <label>
        Pick a place:{' '}
        <select value={placeId} onChange={e => {
          setPlaceId(e.target.value);
        }}>
          {placeList?.map(place =>
            <option key={place.id} value={place.id}>{place.name}</option>
          )}
        </select>
      </label>
      <hr />
      <p>You are going to: {placeId || '...'} on {planetId || '...'} </p>
    </>
  );
}
```

```js useSelectOptions.js
import { useState, useEffect } from 'react';
import { fetchData } from './api.js';

export function useSelectOptions(url) {
  const [list, setList] = useState(null);
  const [selectedId, setSelectedId] = useState('');
  useEffect(() => {
    if (url === null) {
      return;
    }

    let ignore = false;
    fetchData(url).then(result => {
      if (!ignore) {
        setList(result);
        setSelectedId(result[0].id);
      }
    });
    return () => {
      ignore = true;
    }
  }, [url]);
  return [list, selectedId, setSelectedId];
}
```

```js api.js hidden
export function fetchData(url) {
  if (url === '/planets') {
    return fetchPlanets();
  } else if (url.startsWith('/planets/')) {
    const match = url.match(/^\/planets\/([\w-]+)\/places(\/)?$/);
    if (!match || !match[1] || !match[1].length) {
      throw Error('Expected URL like "/planets/earth/places". Received: "' + url + '".');
    }
    return fetchPlaces(match[1]);
  } else throw Error('Expected URL like "/planets" or "/planets/earth/places". Received: "' + url + '".');
}

async function fetchPlanets() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([{
        id: 'earth',
        name: 'Earth'
      }, {
        id: 'venus',
        name: 'Venus'
      }, {
        id: 'mars',
        name: 'Mars'        
      }]);
    }, 1000);
  });
}

async function fetchPlaces(planetId) {
  if (typeof planetId !== 'string') {
    throw Error(
      'fetchPlaces(planetId) expects a string argument. ' +
      'Instead received: ' + planetId + '.'
    );
  }
  return new Promise(resolve => {
    setTimeout(() => {
      if (planetId === 'earth') {
        resolve([{
          id: 'laos',
          name: 'Laos'
        }, {
          id: 'spain',
          name: 'Spain'
        }, {
          id: 'vietnam',
          name: 'Vietnam'        
        }]);
      } else if (planetId === 'venus') {
        resolve([{
          id: 'aurelia',
          name: 'Aurelia'
        }, {
          id: 'diana-chasma',
          name: 'Diana Chasma'
        }, {
          id: 'kumsong-vallis',
          name: 'Kŭmsŏng Vallis'        
        }]);
      } else if (planetId === 'mars') {
        resolve([{
          id: 'aluminum-city',
          name: 'Aluminum City'
        }, {
          id: 'new-new-york',
          name: 'New New York'
        }, {
          id: 'vishniac',
          name: 'Vishniac'
        }]);
      } else throw Error('Unknown planet ID: ' + planetId);
    }, 1000);
  });
}
```

```css
label { display: block; margin-bottom: 10px; }
```

</Sandpack>

Check the `useSelectOptions.js` tab in the sandbox to see how it works. Ideally, most Effects in your application should eventually be replaced by custom Hooks, whether written by you or by the community. Custom Hooks hide the synchronization logic, so the calling component doesn't know about the Effect. As you keep working on your app, you'll develop a palette of Hooks to choose from, and eventually you won't need to write Effects in your components very often.

</Solution>

</Challenges>
