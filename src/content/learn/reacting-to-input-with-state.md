---
title: Girdiye State ile Reaksiyon Verme
---

<Intro>

React, UI'ı manipüle etmek için bildirimsel bir yol sağlar. UI'ın her bir parçasını doğrudan manipüle etmek yerine, bileşeninizin içinde bulunabileceği farklı durumları (state'leri) tanımlar ve kullanıcı girdisine karşılık bunlar arasında geçiş yaparsınız. Bu, tasarımcıların UI hakkındaki düşüncelerine benzer.

</Intro>

<YouWillLearn>

* Bildirimsel UI programlamanın, zorunlu UI programlamadan nasıl ayrıştığını
* Bileşeninizin içinde bulunabileceği farklı görsel state'lerin nasıl sıralanabileceğini
* Farklı görsel state'ler arasındaki değişimin koddan nasıl tetiklenebileceğini

</YouWillLearn>

## Bildirimsel ve zorunlu UI'ın karşılaştırması {/*how-declarative-ui-compares-to-imperative*/}

UI etkileşimleri tasarlarken, UI'ın kullanıcı aksiyonlarına karşılık nasıl *değiştiği* hakkında muhtemelen düşünürsünüz. Kullanıcının bir cevap gönderdiği bir form düşünelim:

* Formun içine bir şey yazdığınızda, "Gönder" butonu **etkinleşir.**
* "Gönder" butonuna bastığınızda, hem form hem de buton **devre dışı kalır** ve bir spinner **görünür.**
* Eğer ağ isteği başarılı olursa, form **görünmez hale gelir** ve "Teşekkürler" mesajı **görünür.**
* Eğer ağ isteği başarısız olursa, bir hata mesajı **görünür** ve form tekrar **etkinleşir.**

**Zorunlu programlama**da yukarıdakiler, etkileşimi nasıl uyguladığınıza doğrudan karşılık gelir. Az önce ne olduğuna bağlı olarak UI'ı manipüle etmek için tam talimatları yazmanız gerekir. Bunu düşünmenin başka bir yolu da şudur: Arabada birinin yanına bindiğinizi ve ona adım adım nereye gideceğini söylediğinizi hayal edin.

<Illustration src="/images/docs/illustrations/i_imperative-ui-programming.png"  alt="JavaScript'i temsil eden endişeli görünümlü bir kişi tarafından sürülen bir arabada, bir yolcu sürücüye bir dizi karmaşık dönüşü gerçekleştirmesini emreder." />

Nereye gitmek istediğinizi bilmiyor, sadece talimatlarınızı takip ediyor. (Ve eğer yanlış yönlendirirseniz, kendinizi yanlış yerde bulursunuz!) Buna *zorunlu* denir çünkü, bilgisayara UI'yı *nasıl* güncellemesi gerektiğini, spinner'dan butona her eleman için "talimat vermeniz" gerekir.

Zorunlu UI programlamanın bu örneğinde form, React *kullanmadan* oluşturulmuştur. Sadece tarayıcı [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)'unu kullanır:

<Sandpack>

```js src/index.js active
async function handleFormSubmit(e) {
  e.preventDefault();
  disable(textarea);
  disable(button);
  show(loadingMessage);
  hide(errorMessage);
  try {
    await submitForm(textarea.value);
    show(successMessage);
    hide(form);
  } catch (err) {
    show(errorMessage);
    errorMessage.textContent = err.message;
  } finally {
    hide(loadingMessage);
    enable(textarea);
    enable(button);
  }
}

function handleTextareaChange() {
  if (textarea.value.length === 0) {
    disable(button);
  } else {
    enable(button);
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function enable(el) {
  el.disabled = false;
}

function disable(el) {
  el.disabled = true;
}

function submitForm(answer) {
  // Ağa istek atıyormuş gibi yapalım.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (answer.toLowerCase() === 'istanbul') {
        resolve();
      } else {
        reject(new Error('İyi tahmin ama yanlış cevap. Tekrar dene!'));
      }
    }, 1500);
  });
}

let form = document.getElementById('form');
let textarea = document.getElementById('textarea');
let button = document.getElementById('button');
let loadingMessage = document.getElementById('loading');
let errorMessage = document.getElementById('error');
let successMessage = document.getElementById('success');
form.onsubmit = handleFormSubmit;
textarea.oninput = handleTextareaChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <h2>Şehir sorusu</h2>
  <p>
    İki kıta üzerinde konumlanmış şehir hangisidir?
  </p>
  <textarea id="textarea"></textarea>
  <br />
  <button id="button" disabled>Gönder</button>
  <p id="loading" style="display: none">Yükleniyor...</p>
  <p id="error" style="display: none; color: red;"></p>
</form>
<h1 id="success" style="display: none">Doğru cevap!</h1>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
</style>
```

</Sandpack>

UI'yı zorunlu bir şekilde manipüle etmek izole örneklerde yeterince işe yarar, fakat bunun daha karmaşık sistemlerde yönetilmesi katlanarak zorlaşır. Bunun gibi farklı formlarla dolu bir sayfayı güncellediğinizi hayal edin. Yeni bir UI elemanı veya yeni bir etkileşim eklemek, bir hata (örneğin, bir şeyi göstermeyi veya gizlemeyi unutmak) eklemediğinizden emin olmak için mevcut tüm kodun dikkatlice kontrol edilmesini gerektirir.

React, bu sorunu çözmek için geliştirilmiştir.

React'ta, UI'yı doğrudan manipüle etmezsiniz--yani bileşenleri doğrudan etkinleştirmez, devre dışı bırakmaz, göstermez veya gizlemezsiniz. Bunun yerine, **göstermek istediğiniz şeyi belirtirsiniz** ve React, UI'yı nasıl güncelleyeceğini çözer. Bir taksiye bindiğinizi ve şoföre nereden döneceğini söylemek yerine nereye gitmek istediğinizi söylediğinizi düşünün. Sizi oraya götürmek şoförün işidir ve hatta belki de sizin aklınıza gelmeyen kestirme yollar biliyordur.

<Illustration src="/images/docs/illustrations/i_declarative-ui-programming.png" alt="In a car driven by React, a passenger asks to be taken to a specific place on the map. React figures out how to do that." />

## UI'ı bildirimsel olarak düşünmek {/*thinking-about-ui-declaratively*/}

Yukarıda bir formun zorunlu olarak nasıl uygulanacağını gördünüz. React'ta nasıl düşüneceğinizi daha iyi anlamak için, aşağıda bu UI'ı React'ta tekrar uygulayacaksınız:

1. Bileşeninizin farklı görsel state'lerini **tanımlayın**
2. Bu state değişikliklerini neyin tetiklediğini **belirleyin**
3. State'i `useState` ile bellekte **gösterin**
4. Gereksiz tüm state değişkenlerini **kaldırın**
5. State'i ayarlamak için olay yöneticilerini **bağlayın**

### Adım 1: Bileşeninizin farklı görsel state'lerini tanımlayın {/*step-1-identify-your-components-different-visual-states*/}

Bilgisayar biliminde, bir ["state machine"](https://en.wikipedia.org/wiki/Finite-state_machine)in birçok "state"ten birinde olduğunu duyabilirsiniz. Eğer bir tasarımcı ile çalışıyorsanız, farklı "görsel state"ler için modeller görmüş olabilirsiniz. React, tasarım ve bilgisayar biliminin kesiştiği noktada durmaktadır, bu nedenle bu fikirlerin her ikisi de ilham kaynağıdır.

Öncelikle, UI'ın kullanıcının görebileceği tüm farklı "state"lerini görselleştirmeniz gerekir:

* **Empty**: Formda devre dışı bırakılmış bir "Gönder" butonu var.
* **Typing**: Formda etkinleştirilmiş bir "Gönder" butonu var.
* **Submitting**: Form tamamen devre dışı bırakılmış. Spinner gösterilir.
* **Success**: Form yerine "Teşekkürler" mesajı gösterilir.
* **Error**: Typing state'i ile aynı ama ekstra bir hata mesajı ile.

Tıpkı bir tasarımcı gibi, mantık eklemeden önce farklı state'ler için modeller oluşturmak isteyeceksiniz. Örneğin, burada formun sadece görsel kısmı için bir model bulunmaktadır. Bu model, varsayılan değeri `'empty'` olan `status` adlı bir prop tarafından kontrol edilir:

<Sandpack>

```js
export default function Form({
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>Doğru cevap!</h1>
  }
  return (
    <>
      <h2>Şehir sorusu</h2>
      <p>
        Havayı içilebilir suya çeviren reklam tabelası hangi şehirdedir?
      </p>
      <form>
        <textarea />
        <br />
        <button>
          Gönder
        </button>
      </form>
    </>
  )
}
```

</Sandpack>

Bu prop'u istediğiniz gibi isimlendirebilirsiniz, isimlendirme önemli değil. Başarı mesajını görmek için `status = 'empty'`'yi `status = 'success'`'e değiştirmeyi deneyin. Modelleme, herhangi bir mantığı bağlamadan önce UI'ın üzerinden hızlıca tekrar geçmenizi sağlar. İşte aynı bileşenin hala `status` prop'u tarafından "kontrol edilen" daha ayrıntılı bir prototipi:

<Sandpack>

```js
export default function Form({
  // Şunları deneyin: 'submitting', 'error', 'success':
  status = 'empty'
}) {
  if (status === 'success') {
    return <h1>Doğru cevap!</h1>
  }
  return (
    <>
      <h2>Şehir sorusu</h2>
      <p>
        Havayı içilebilir suya çeviren reklam tabelası hangi şehirdedir?
      </p>
      <form>
        <textarea disabled={
          status === 'submitting'
        } />
        <br />
        <button disabled={
          status === 'empty' ||
          status === 'submitting'
        }>
          Gönder
        </button>
        {status === 'error' &&
          <p className="Error">
            İyi tahmin ama yanlış cevap. Tekrar dene!
          </p>
        }
      </form>
      </>
  );
}
```

```css
.Error { color: red; }
```

</Sandpack>

<DeepDive>

#### Birden fazla görsel state'i tek seferde görüntüleme {/*displaying-many-visual-states-at-once*/}

Eğer bir bileşenin birçok görsel state'i varsa, hepsini tek bir sayfada göstermek uygun olabilir:

<Sandpack>

```js src/App.js active
import Form from './Form.js';

let statuses = [
  'empty',
  'typing',
  'submitting',
  'success',
  'error',
];

export default function App() {
  return (
    <>
      {statuses.map(status => (
        <section key={status}>
          <h4>Form ({status}):</h4>
          <Form status={status} />
        </section>
      ))}
    </>
  );
}
```

```js src/Form.js
export default function Form({ status }) {
  if (status === 'success') {
    return <h1>Doğru cevap!</h1>
  }
  return (
    <form>
      <textarea disabled={
        status === 'submitting'
      } />
      <br />
      <button disabled={
        status === 'empty' ||
        status === 'submitting'
      }>
        Gönder
      </button>
      {status === 'error' &&
        <p className="Error">
          İyi tahmin ama yanlış cevap. Tekrar dene!
        </p>
      }
    </form>
  );
}
```

```css
section { border-bottom: 1px solid #aaa; padding: 20px; }
h4 { color: #222; }
body { margin: 0; }
.Error { color: red; }
```

</Sandpack>

Böyle sayfalar sıklıkla "yaşayan stil rehberi" veya "hikaye kitabı" diye adlandırılır.

</DeepDive>

### Adım 2: State değişikliklerini neyin tetiklediğini belirleyin {/*step-2-determine-what-triggers-those-state-changes*/}

State güncellemelerini iki girdi çeşidine karşılık tetikleyebilirsiniz:

* **İnsan girdileri:** bir butona tıklama, bir alana yazma, bir bağlantıya gitme vb.
* **Bilgisayar girdileri:** bir ağ yanıtının ulaşması, bir zamanaşımının tamamlanması, bir görüntünün yüklenmesi vb.

<IllustrationBlock>
  <Illustration caption="İnsan girdileri" alt="Bir parmak." src="/images/docs/illustrations/i_inputs1.png" />
  <Illustration caption="Bilgisayar girdileri" alt="Birler ve sıfırlar." src="/images/docs/illustrations/i_inputs2.png" />
</IllustrationBlock>

Her iki durumda da **UI'ı güncellemek için [state değişkenlerini](/learn/state-a-components-memory#anatomy-of-usestate) ayarlamak zorundasınız.** Geliştirdiğiniz form için, birkaç farklı girdiye karşılık state değiştirmeniz gerekecek:

* **Metin girdisini değiştirmek** (insan) metin kutusunun boş olup olmadığına bağlı olmak üzere, state'i *Empty*'den *Typing*'e ya da tam tersine çevirmeli.
* **Gönder butonuna tıklamak** (insan) state'i *Submitting*'e çevirmeli.
* **Başarılı ağ yanıtı** (bilgisayar) state'i *Success*'e çevirmeli.
* **Başarısız ağ yanıtı** (bilgisayar) state'i ilgili hata mesajı ile birlikte *Error*'a çevirmeli.

<Note>

İnsan girdilerinin sıklıkla [olay yöneticilerini](/learn/responding-to-events) gerektirdiğine dikkat ediniz!

</Note>

Bu akışı görselleştirmeye yardımcı olması için, kağıt üzerinde her bir state'i etiketli bir daire olarak ve iki state arasındaki her bir değişikliği bir ok olarak çizmeyi deneyin. Bu şekilde birçok akışı taslak olarak çizebilir ve uygulamadan çok önce hataları ayıklayabilirsiniz.

<DiagramGroup>

<Diagram name="responding_to_input_flow" height={350} width={688} alt="Soldan sağa doğru 5 düğümle ilerleyen akış şeması. 'empty' olarak etiketlenen ilk düğümün 'start typing' olarak etiketlenen ve 'typing' olarak etiketlenen bir düğüme bağlı bir kenarı vardır. Bu düğümün iki kenarı olan 'submitting' etiketli bir düğüme bağlı 'press submit' etiketli bir kenarı vardır. Sol kenar 'error' etiketli bir düğüme bağlanan 'network error' olarak etiketlenmiştir. Sağ kenar ise 'success' etiketli bir düğüme bağlanan 'network success' olarak etiketlenmiştir.">

Form state'leri

</Diagram>

</DiagramGroup>

### Adım 3: State'i `useState` ile bellekte gösterin {/*step-3-represent-the-state-in-memory-with-usestate*/}

Şimdi bileşeninizin görsel state'lerini [`useState`](/reference/react/useState) ile bellekte göstermeniz gerekecek. Kilit nokta sadelik: state'in her bir parçası birer "hareketli parça"dır, ve **mümkün olduğunca az "hareketli parça" istersiniz.** Daha fazla karmaşıklık daha fazla hataya yol açar!

*Kesinlikle bulunması gereken* state ile başlayın. Örneğin, girdi için `answer` ve (eğer varsa) son hata için `error`ı depolamanız gerekecek.

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
```

Sonrasında, göstermek istediğiniz görsel state'i temsil eden bir state değişkenine ihtiyacınız olacak. Bunu bellekte temsil etmenin genellikle birden fazla yolu vardır, bu nedenle denemeler yapmanız gerekecek.

Hemen en iyi yolu bulmakta zorlanırsanız, tüm muhtemel görsel state'leri kapsandığından *kesinlikle* emin olacağınız kadar state ekleyerek başlayın:

```js
const [isEmpty, setIsEmpty] = useState(true);
const [isTyping, setIsTyping] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [isSuccess, setIsSuccess] = useState(false);
const [isError, setIsError] = useState(false);
```

İlk fikriniz muhtemelen en iyisi olmayacaktır, ancak sorun değil--state'i yeniden düzenlemek sürecin bir parçasıdır!

### Adım 4: Gereksiz tüm state değişkenlerini kaldırın {/*step-4-remove-any-non-essential-state-variables*/}

State içeriğinde kopyalardan kaçınmak istersiniz ve bu yüzden yalnızca gerekli olanların takibini yaparsınız. State yapınızı yeniden düzenlemek için biraz zaman harcamak bileşenlerinizin anlaşılmasını kolaylaştıracak, tekrarları azaltacak ve istenmeyen anlamları önleyecektir. Amacınız **bellekteki state'in kullanıcının görmesini isteyeceğiniz geçerli bir UI'ı temsil etmediği durumları önlemektir.** (Örneğin, asla bir hata mesajı göstermek ve aynı zamanda girişi devre dışı bırakmak istemezsiniz, aksi takdirde kullanıcı hatayı düzeltemez!)

İşte state değişkenleriniz hakkında sorabileceğiniz bazı sorular:

* **Bu state bir paradoksa sebep oluyor mu?** Örneğin, hem `isTyping` hem de `isSubmitting`, `true` olamaz. Paradoks genellikle state'in yeterince kısıtlanmadığı anlamına gelir. İki boolean'ın dört muhtemelen kombinasyonu vardır, ancak sadece üç tanesi geçerli state'e karşılık gelir. "İmkansız" state'i kaldırmak için bunları, değeri `'typing'`, `'submitting'`, veya `'success'`'ten biri olması gereken `status` içinde birleştirebilirsiniz 
* **Aynı bilgi başka bir state değişkeninde zaten mevcut mu?** Bir diğer paradoks: `isEmpty` ve `isTyping` aynı anda `true` olamazlar. Bunları ayrı state değişkenleri haline getirerek, senkronize olmamaları ve hatalara neden olmaları riskini alırsınız. Neyse ki, `isEmpty`'yi kaldırıp yerine `answer.length === 0`'ı kontrol edebilirsiniz.
* **Aynı bilgiye bir başka state değişkeninin tersini alarak erişebiliyor musunuz?** `error !== null` kontrolünü yapabildiğiniz için `isError`'a ihtiyacınız yok.

Bu temizlikten sonra, 3 tane (7'den düştü!) *gerekli* state değişkeniniz kalıyor:

```js
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing'); // 'typing', 'submitting', veya 'success'
```

Bunların gerekli olduğunu biliyorsunuz, çünkü işlevselliği bozmadan hiçbirini kaldıramazsınız.

<DeepDive>

#### “İmkansız" state'leri bir reducer ile elimine etme {/*eliminating-impossible-states-with-a-reducer*/}

Bu üç değişken, bu formun state'ini yeterince iyi bir şekilde temsil ediyor. Ancak, hala tam olarak anlam ifade etmeyen ara state'ler var. Örneğin, `status` `'success'` olduğunda null olmayan bir `error` bir anlam ifade etmez. State'i daha kesin bir şekilde modellemek için, [onu bir reducer'a çıkarabilirsiniz](/learn/extracting-state-logic-into-a-reducer). Reducer'lar, birden fazla state değişkenini tek bir nesnede birleştirmenize ve ilgili tüm mantığı bir araya getirmenize olanak tanır!

</DeepDive>

### Adım 5: State'i ayarlamak için olay yöneticilerini bağlayın {/*step-5-connect-the-event-handlers-to-set-state*/}

Son olarak, state'i güncelleyen olay yöneticileri oluşturun. Aşağıda, tüm olay yöneticilerinin bağlandığı formun son hali yer almaktadır:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>Doğru cevap!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>Şehir sorusu</h2>
      <p>
        Havayı içilebilir suya çeviren reklam tabelası hangi şehirdedir?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Gönder
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Ağa istek atıyormuş gibi yapalım.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('İyi tahmin ama yanlış cevap. Tekrar dene!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

Bu kod orijinal bildirimsel örnekten daha uzun olmasına rağmen, çok daha az kırılgandır. Tüm etkileşimleri state değişiklikleri olarak ifade etmek, daha sonra mevcut state'leri bozmadan yeni görsel state'ler eklemenizi sağlar. Ayrıca, etkileşimin kendi mantığını değiştirmeden her bir state'te neyin görüntülenmesi gerektiğini değiştirmenize de olanak tanır.

<Recap>

* Bildirimsel programlama, UI'ın mikro yönetimi (zorunlu) yerine, UI'ı her bir görsel state için tarif etmek anlamına gelir.
* Bir bileşen geliştirirken:
  1. Tüm görsel state'lerini tanımlayın.
  2. State değişiklikleri için insan ve bilgisayar tetikleyicilerini belirleyin.
  3. State'i, `useState` ile modelleyin.
  4. Hataları ve paradoksları önlemek için gereksiz state'i kaldırın.
  5. State'i ayarlamak için olay yöneticilerini bağlayın.

</Recap>



<Challenges>

#### Bir CSS sınıfı ekleyin ve çıkarın {/*add-and-remove-a-css-class*/}

Problemi, resme tıklandığında dış `<div>`'den `background--active` CSS sınıfını *kaldıracak*, ancak `<img>`'ye `picture--active` sınıfını *ekleyecek* şekilde çözün. Arka plana tekrar tıklandığında orijinal CSS sınıfları geri yüklenmeli.

Görsel olarak, resmin üzerine tıkladığınızda mor arka planın kaldırılmasını ve resim kenarlığının vurgulanmasını beklemelisiniz. Resmin dışına tıklamak arka planı vurgular, ancak resim kenarlığı vurgusunu kaldırır.

<Sandpack>

```js
export default function Picture() {
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Kampung Pelangi'deki (Endonezya) gökkuşağı evleri"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

<Solution>

Bu bileşenin iki görsel state'i vardır: resim aktifken ve resim aktif değilken:

* Resim aktifken, CSS sınıfları `background` ve `picture picture--active`'dir.
* Resim aktif değilken, CSS sınıfları `background background--active` ve `picture`'dır.

Görüntünün aktif olup olmadığına bakmak için tek bir boolean state değişkeni yeterlidir. Asıl görev CSS sınıflarını kaldırmak ya da eklemekti. Ancak React'ta UI öğelerini *manipüle* etmek yerine görmek istediğinizi *tanımlamanız* gerekir. Bu nedenle, mevcut state'e göre her iki CSS sınıfını da hesaplamanız gerekir. Ayrıca, resme tıklamanın arka plana tıklama olarak kaydedilmemesi için [ilerlemeyi durdurmanız](/learn/responding-to-events#stopping-propagation) gerekir.

Bu sürümün çalıştığını resmin üstüne ve sonra dışına tıklayarak doğrulayın:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Kampung Pelangi'deki (Endonezya) gökkuşağı evleri"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

Alternatif olarak, iki ayrı JSX bloğu döndürebilirsiniz:

<Sandpack>

```js
import { useState } from 'react';

export default function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Kampung Pelangi'deki (Endonezya) gökkuşağı evleri"
          src="https://i.imgur.com/5qwVYb1.jpeg"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Kampung Pelangi'deki (Endonezya) gökkuşağı evleri"
        src="https://i.imgur.com/5qwVYb1.jpeg"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```css
body { margin: 0; padding: 0; height: 250px; }

.background {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
}

.background--active {
  background: #a6b5ff;
}

.picture {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  border: 5px solid transparent;
}

.picture--active {
  border: 5px solid #a6b5ff;
}
```

</Sandpack>

İki farklı JSX bloğunun aynı ağacı tanımlaması durumunda, iç içe geçmelerinin (ilk `<div>` → ilk `<img>`) aynı hizada olması gerektiğini unutmayın. Aksi takdirde, `isActive` değerini değiştirmek ağacın aşağıda kalan her yerini yeniden oluşturacak ve [state'i sıfırlayacaktır.](/learn/preserving-and-resetting-state) Bu nedenle, her iki durumda da benzer bir JSX ağacı döndürülecekse, bunları tek bir JSX parçası olarak yazmak daha iyidir.

</Solution>

#### Profil düzenleyici {/*profile-editor*/}

İşte sade JavaScript ve DOM ile oluşturulmuş küçük bir form. Davranışını anlamak için onunla biraz oynayın:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Profili Düzenle') {
    editButton.textContent = 'Profili Kaydet';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Profili Düzenle';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Merhaba ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Merhaba ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Ad:
    <b id="firstNameText">Vedat</b>
    <input
      id="firstNameInput"
      value="Vedat"
      style="display: none">
  </label>
  <label>
    Soyad:
    <b id="lastNameText">Milor</b>
    <input
      id="lastNameInput"
      value="Milor"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Profili Düzenle</button>
  <p><i id="helloText">Merhaba, Vedat Milor!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Bu form iki mod arasında geçiş yapar: düzenleme modunda girdileri görürsünüz ve görüntüleme modunda sadece sonucu görürsünüz. Buton etiketi, içinde bulunduğunuz moda bağlı olarak "Düzenle" ve "Kaydet" arasında değişir. Girdileri değiştirdiğinizde, alttaki karşılama mesajı gerçek zamanlı olarak güncellenir.

Sizin göreviniz bunu, aşağıdaki sandbox'ın içinde React'ta yeniden uygulamaktır. Size kolaylık sağlamak için, biçimlendirme çoktan JSX'e dönüştürüldü, ancak orijinalinde olduğu gibi girdileri gösterip gizlemeniz gerekecek.

Alttaki metni de güncellediğinden emin olun!

<Sandpack>

```js
export default function EditProfile() {
  return (
    <form>
      <label>
        Ad:{' '}
        <b>Vedat</b>
        <input />
      </label>
      <label>
        Soyad:{' '}
        <b>Milor</b>
        <input />
      </label>
      <button type="submit">
        Profili Düzenle
      </button>
      <p><i>Merhaba, Vedat Milor!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

<Solution>

Girdi değerlerini tutmak için iki tane state değişkenine ihtiyacınız olacak: `firstName` ve `lastName`. Ayrıca, girdinin gösterilip gösterilmeyeceğinin bilgisini tutan bir `isEditing` state değişkenine de ihtiyacınız olacak. Tam ad (ad ve soyad), `firstName` ve `lastName` kullanılarak hesaplanabileceği için, tam ad için ayrıyeten bir `fullName` değişkenine _ihtiyaç duymamalısınız._

Son olarak, `isEditing`'e bağlı olan girdileri göstermek veya gizlemek için [koşullu render etmeyi](/learn/conditional-rendering) kullanmalısınız.

<Sandpack>

```js
import { useState } from 'react';

export default function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Vedat');
  const [lastName, setLastName] = useState('Milor');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        Ad:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Soyad:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        Profili {isEditing ? 'Kaydet' : 'Düzenle'}
      </button>
      <p><i>Merhaba, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

```css
label { display: block; margin-bottom: 20px; }
```

</Sandpack>

Bu çözüm ile orijinal zorunlu kodu karşılaştırın. Aralarındaki farklar neler?

</Solution>

#### Zorunlu çözümü React olmadan yeniden düzenleyin {/*refactor-the-imperative-solution-without-react*/}

İşte önceki problemdeki, React olmadan zorunlu bir şekilde yazılmış orijinal sandbox:

<Sandpack>

```js src/index.js active
function handleFormSubmit(e) {
  e.preventDefault();
  if (editButton.textContent === 'Profili Düzenle') {
    editButton.textContent = 'Profili Kaydet';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Profili Düzenle';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
}

function handleFirstNameChange() {
  firstNameText.textContent = firstNameInput.value;
  helloText.textContent = (
    'Merhaba ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function handleLastNameChange() {
  lastNameText.textContent = lastNameInput.value;
  helloText.textContent = (
    'Merhaba ' +
    firstNameInput.value + ' ' +
    lastNameInput.value + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Ad:
    <b id="firstNameText">Vedat</b>
    <input
      id="firstNameInput"
      value="Vedat"
      style="display: none">
  </label>
  <label>
    Soyad:
    <b id="lastNameText">Milor</b>
    <input
      id="lastNameInput"
      value="Milor"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Profili Düzenle</button>
  <p><i id="helloText">Merhaba, Vedat Milor!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

React'ın var olmadığını hayal edin. Bu kodu, mantığı daha az kırılgan ve React sürümüne daha benzer hale getirecek şekilde yeniden düzenleyebilir misiniz? State, React'taki gibi açık olsaydı nasıl görünürdü?

Nereden başlayacağınızı düşünmekte zorlanıyorsanız, aşağıdaki taslakta yapının çoğu mevcut. Buradan başlarsanız, `updateDOM` işlevindeki eksik mantığı doldurun. (Gerektiğinde orijinal koda başvurun.)

<Sandpack>

```js src/index.js active
let firstName = 'Vedat';
let lastName = 'Milor';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Profili Kaydet';
    // YAPILACAK: girdileri göster, içeriği gizle
  } else {
    editButton.textContent = 'Profili Düzenle';
    // YAPILACAK: girdileri gizle, içeriği göster
  }
  // YAPILACAK: metin etiketlerini güncelle
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Ad:
    <b id="firstNameText">Vedat</b>
    <input
      id="firstNameInput"
      value="Vedat"
      style="display: none">
  </label>
  <label>
    Soyad:
    <b id="lastNameText">Milor</b>
    <input
      id="lastNameInput"
      value="Milor"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Profili Düzenle</button>
  <p><i id="helloText">Merhaba, Vedat Milor!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

<Solution>

Eksik mantık, girişlerin ve içeriğin görüntülenmesinin değiştirilmesini ve etiketlerin güncellenmesini içeriyordu:

<Sandpack>

```js src/index.js active
let firstName = 'Vedat';
let lastName = 'Milor';
let isEditing = false;

function handleFormSubmit(e) {
  e.preventDefault();
  setIsEditing(!isEditing);
}

function handleFirstNameChange(e) {
  setFirstName(e.target.value);
}

function handleLastNameChange(e) {
  setLastName(e.target.value);
}

function setFirstName(value) {
  firstName = value;
  updateDOM();
}

function setLastName(value) {
  lastName = value;
  updateDOM();
}

function setIsEditing(value) {
  isEditing = value;
  updateDOM();
}

function updateDOM() {
  if (isEditing) {
    editButton.textContent = 'Profili Kaydet';
    hide(firstNameText);
    hide(lastNameText);
    show(firstNameInput);
    show(lastNameInput);
  } else {
    editButton.textContent = 'Profili Düzenle';
    hide(firstNameInput);
    hide(lastNameInput);
    show(firstNameText);
    show(lastNameText);
  }
  firstNameText.textContent = firstName;
  lastNameText.textContent = lastName;
  helloText.textContent = (
    'Merhaba ' +
    firstName + ' ' +
    lastName + '!'
  );
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

let form = document.getElementById('form');
let editButton = document.getElementById('editButton');
let firstNameInput = document.getElementById('firstNameInput');
let firstNameText = document.getElementById('firstNameText');
let lastNameInput = document.getElementById('lastNameInput');
let lastNameText = document.getElementById('lastNameText');
let helloText = document.getElementById('helloText');
form.onsubmit = handleFormSubmit;
firstNameInput.oninput = handleFirstNameChange;
lastNameInput.oninput = handleLastNameChange;
```

```js sandbox.config.json hidden
{
  "hardReloadOnChange": true
}
```

```html public/index.html
<form id="form">
  <label>
    Ad:
    <b id="firstNameText">Vedat</b>
    <input
      id="firstNameInput"
      value="Vedat"
      style="display: none">
  </label>
  <label>
    Soyad:
    <b id="lastNameText">Milor</b>
    <input
      id="lastNameInput"
      value="Milor"
      style="display: none">
  </label>
  <button type="submit" id="editButton">Profili Düzenle</button>
  <p><i id="helloText">Merhaba, Vedat Milor!</i></p>
</form>

<style>
* { box-sizing: border-box; }
body { font-family: sans-serif; margin: 20px; padding: 0; }
label { display: block; margin-bottom: 20px; }
</style>
```

</Sandpack>

Yazdığınız `updateDOM` fonksiyonu, state'i ayarladığınızda React'ın temelde ne yaptığını gösterir. (Bununla birlikte React, son ayarlandıkları zamandan beri değişmeyen özellikler için DOM'a dokunmaktan da kaçınır).

</Solution>

</Challenges>
