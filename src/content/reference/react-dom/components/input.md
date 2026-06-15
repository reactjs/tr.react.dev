---
title: "<input>"
---

<Intro>

[Tarayıcıya yerleşik `<input>` bileşeni](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) farklı türden form girdileri render etmenizi sağlar.

```js
<input />
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `<input>` {/*input*/}

Ekranda bir girdi göstermek için, [tarayıcıya yerleşik `<input>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input) bileşenini render edin.

```js
<input name="myInput" />
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Prop'lar {/*props*/}

`<input>`, tüm [yaygın element özelliklerini](/reference/react-dom/components/common#common-props) destekler.

`<input>` tüm [ortak eleman proplarını](/reference/react-dom/components/common#common-props) destekler.

- [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): Bir string veya fonksiyon. `type="submit"` ve `type="image"` için ebeveyn `<form action>`'ı geçersiz kılar. Bir URL `action` parametresine geçtiğinde form, standart bir HTML formu gibi davranır. Bir fonksiyon `formAction` parametresine geçtiğinde, fonksiyon form gönderimini işler. [`<form action>`](/reference/react-dom/components/form#props) bölümüne bakın.

Aşağıdaki proplardan birini ileterek [girdileri kontrollü hale](#controlling-an-input-with-a-state-variable) getirebilirsiniz:

* [`checked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#checked): Boolean. Onay kutusu girdisi ya da radyo butonunun seçilip seçilmediğini kontrol eder.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#value): String. Metin kutusunun içindeki metni kontrol eder. (Radyo butonu için, form verisini belirtir.)

İki propdan birini ilettiğinizde, iletilen değeri güncelleyen `onChange` olay yöneticisini de iletmeniz gerekmektedir.

Aşağıdaki `<input>` propları sadece kontrolsüz girdilerle ilgilidir:

* [`defaultChecked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultChecked): Boolean. Tipi `type="checkbox"` ve `type="radio"` olan girdiler için [başlangıç değerini](#providing-an-initial-value-for-an-input) belirler.

* [`defaultValue`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#defaultValue): String. Metin girdilerinin [başlangıç değerini](#providing-an-initial-value-for-an-input) belirler.

Aşağıdaki `<input>` proplar hem kontrollü hem de kontrolsüz girdilerle ilgilidir:

* [`accept`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#accept): String. Tipi `type="file"` olan girdiler için hangi dosya tiplerinin kabul edilebilir olduğunu belirler.
* [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#alt): String. Tipi `type="image"` olan girdiler için alternatif görüntü metnini belirler.
* [`capture`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#capture): String. Tipi `type="file"` olan girdiler için yakalanan medyayı (mikrofon, video ya da kamera) belirler.
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autocomplete): String. Olası [otomatik tamamlama davranışları](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)'ndan birini belirler.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#autofocus): Boolean. Eğer `true` ise, React, eleman DOM'a eklendikten sonra o elemana odaklanacaktır.
* [`dirname`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#dirname): String. Bileşen yönlendirmesi için form alanı adını belirler.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#disabled): Boolean. Eğer `true` ise, girdi etkileşimli olmayacak ve soluk renkli görünecektir.
* `children`: `<input>` alt bileşen kabul etmez.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#form): String. Girdinin ait olduğu `<form>`'un `<id>`'sini belirtir. Eğer belirtilmemişse, ağaçtaki en yakın üst formdur.
* [`formAction`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formaction): String. Tipi `type="submit"` ve `type="image"` olan girdiler için `<form action>` üst bileşenini geçersiz kılar.
* [`formEnctype`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formenctype): String. Tipi `type="submit"` ve `type="image"` olan girdiler için `<form enctype>` üst bileşenini geçersiz kılar.
* [`formMethod`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formmethod): String. Tipi `type="submit"` ve `type="image"` olan girdiler için `<form method>` üst bileşenini geçersiz kılar.
* [`formNoValidate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formnovalidate): String. Tipi `type="submit"` ve `type="image"` olan girdiler için `<form- noValidate`> üst bileşenini geçersiz kılar.
* [`formTarget`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#formtarget): String. Tipi `type="submit"` and `type="image"` olan girdiler için `<form target>` üst bileşenini geçersiz kılar.
* [`height`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#height): String. Tipi `type="image"` olan girdiler için görsel yükseliğini belirler.
* [`list`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#list): String. Otomatik tamamlama seçeneği olan `<datalist>` bileşeninin `id`'sini belirler.
* [`max`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max): Numara. Tarih ve nümerik girdilerin maksimumum alabilecekleri değeri belirler.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength): Numara. Metin ve diğer girdi tipleri için maksimum uzunluğu belirler.
* [`min`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min): Numara. Nümerik ve tarih girdilerin minimum alabilecekleri değeri belirler.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength): Numara. Metin ve diğer girdi tipleri için minimum uzunluğu belirler.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#multiple): Boolean. Tipi `<type="file"` ve `type="email"` olan girdilerin çoklu değere sahip olup olamayacağını belirler.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): String. [Form ile birlikte gönderilen](#reading-the-input-values-when-submitting-a-form) girdinin adını belirler.
* `onChange`: [`Olay` yöneticisi](/reference/react-dom/components/common#event-handler) fonksiyonu. [Kontrollü girdiler](#controlling-an-input-with-a-state-variable) için gereklidir. Kullanıcı tarafından girdi değeri değiştiği anda (örneğin, klavyede her tuşa basıldığında) çalışır. [Tarayıcı `input` olayı] (https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) gibi çalışır.
* `onChangeCapture`: [Yakalama aşamasında] (/learn/responding-to-events#capture-phase-events) çalışan `onChange`'in bir versiyonudur.
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Olay` yöneticisi](/reference/react-dom/components/common#event-handler) fonksiyonu. Değer, kullanıcı tarafından değiştirildiği anda çalıştırılır. Tarihsel nedenlerden dolayı, React'te benzer şekilde çalışan `onChange`'i kullanmak yaygındır.
* `onInputCapture`: `onInput`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalıştırılan versiyonudur. 
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Olay` yöneticisi](/reference/react-dom/components/common#event-handler) fonksiyonu. Bir girdi, form gönderiminde doğrulamayı geçemezse çalıştırılır. Yerleşik `invalid` olayının aksine, React `onInvalid` olayı kabarcık şeklinde yayılır (bubbles).
* `onInvalidCapture`: `onInvalid`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalıştırılan bir versiyionudur.
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): [`Olay` yöneticisi](/reference/react-dom/components/common#event-handler) fonksiyonu. `<input>` içindeki seçilen alanın değişmesiyle tetiklenir. React, `onSelect` olayını boş seçim ve düzenlemelerde de (seçimi etkileyebilir) çalıştırır. 
* `onSelectCapture`: `onSelect`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalıştırılan bir versiyonudur.
* [`pattern`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern): String. `value` değerinin eşleşmesi gereken şablonu belirler.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#placeholder): String. Girdi değeri yokken ekranda soluk renkte görüntülenir.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly): Boolean. Eğer `true` ise, girdi alanı kullanıcı tarafından düzenlenemez.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#required): Boolean. Eğer `true` ise, formun gönderilebilmesi için değer sağlanmalıdır.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#size): Numara. Genişlik ayarına benzerdir ancak birimin türü kontrole bağlıdır.
* [`src`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#src): String. Tipi `type="image"` olan girdiler için görsel kaynağını belirler.
* [`step`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step): Pozitif sayı ya da `'any'` string. Geçerli iki değer araasındaki uzaklığı belirler.
* [`type`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#type): String. [Girdi tipleri](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types)'nden biridir.
* [`width`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#width): String. Tipi `type="image"` olan girdiler için görsel genişliğini belirler.

#### Uyarılar {/*caveats*/}

- Onay kutularının `value` (veya`defaultValue`) yerine`checked` (veya `defaultChecked`) değerine ihtiyacı vardır.
- Metin girdisi `value` propuna string değer alırsa [kontrollü bileşen](#controlling-an-input-with-a-state-variable) olarak ele alınır.
- Onay kutusu ya da radyo butonu `checked` propuna boolean değer alırsa [kontrollü bileşen](#controlling-an-input-with-a-state-variable) olarak ele alınır.
- Bir girdi aynı anda hem kontrollü hem de kontrolsüz olamaz.
- Bir girdi yaşam döngüsü boyunca kontrollü ve kontrolsüz olma arasında geçiş yapamaz.
- Kontrollü tüm girdiler, değeri senkronize olarak güncelleyen `onChange` olay yöneticisine ihtiyaç duyar.

---

## Kullanım {/*usage*/}

### Farklı tiplerde girdileri gösterme {/*displaying-inputs-of-different-types*/}

Ekranda `<input>`'u görülemek için render ediniz. Varsayılan olarak metin girdisi olacaktır. Onay kutusu için `type="checkbox"`, radyo butonu için `type="radio"` [veya diğer girdi tiplerinden birini](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types) gönderebilirsiniz.
<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Girdi için etiket verme {/*providing-a-label-for-an-input*/}

Genel olarak her `<input>` elemanını bir, [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) elemanı içine yerleştirirsiniz. Bu, tarayıcıya bu etkietin o metin alanıyla ilişkili olduğunu söyler. Kullanıcı bu etikete tıkladığında, tarayıcı o metin alanına odaklanır. Bu durum ayrıca erişebilirlik için de önemlidir: kullanıcı metin alanına tıkladığında ekran okuyucu bu etiketi okuyacaktır.

Eğer `<input>` elemanını bir `<label>` elemanının içine yerleştiremezseniz, `<input id>` ve [`<label htmlFor>`.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) elemanlarına aynı ID'yi ileterek bu elemanları ilişkilendirebilirsiniz. Bir bileşenein birden fazla örnekleri arasındaki çakışmaları önlemek için [`useId`](/reference/react/useId) ile ID üretebilirsiniz.

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const ageInputId = useId();
  return (
    <>
      <label>
        Adınız:
        <input name="ad" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Yaşınız:</label>
      <input id={ageInputId} name="yas" type="number" />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Girdiye başlangıç değeri verme {/*providing-an-initial-value-for-an-input*/}

Her girdi tipi için başlangıç değeri verebilirsiniz. Metin girdileri için string tipinde `defaultValue` değeri iletebilirsiniz. Onay kutusu ve radyo butonları için başlangıç değerlerini boolean tipinde `defaultChecked` değeriyle belirleyebilirsiniz.

<Sandpack>

```js
export default function MyForm() {
  return (
    <>
      <label>
        Metin girdisi: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Onay kutusu: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radyo butonları:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Seçenek 1
        </label>
        <label>
          <input
            type="radio"
            name="myRadio"
            value="option2"
            defaultChecked={true}
          />
          Seçenek 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Seçenek 3
        </label>
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

---

### Formu gönderirken girdi değerlerini okuma {/*reading-the-input-values-when-submitting-a-form*/}

[`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) ve girdilerinizi çevreleyen bir [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) ekleyin. Eklediğiniz buton `<form onSubmit>` olay yöneticisini çağıracaktır. Varsayılan olarak, tarayıcı form verilerini bulunduğunuz URL'e gönderecek ve sayfayı yenileyecektir. `e.preventDefault()` ifadesini çağırarak bu işlemi engelleyebilirsiniz. Form verilerini [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) ile okuyabilirsiniz.
<Sandpack>

```js
export default function MyForm() {
  function handleSubmit(e) {
    // Tarayıcının sayfayı yenilemesini engelleyin
    e.preventDefault();

    // Form verisini okuyun
    const form = e.target;
    const formData = new FormData(form);

    // formDatayı fetch gövdesi olarak iletebilirsiniz:
    fetch('/some-api', { method: form.method, body: formData });

    // formDatayı Düz nesne gibi de kullanabilirsiniz 
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Metin girdisi: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Onay kutusu: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radyo butonları:
        <label><input type="radio" name="myRadio" value="option1" /> Seçenek 1</label>
        <label><input type="radio" name="myRadio" value="option2" defaultChecked={true} /> Seçenek 2</label>
        <label><input type="radio" name="myRadio" value="option3" /> Seçenek 3</label>
      </p>
      <hr />
      <button type="reset">Formu sıfırla</button>
      <button type="submit">Forumu gönder</button>
    </form>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
```

</Sandpack>

<Note>

Tüm `<input>` elemanlarınıza bir `name` değeri verin, örneğin `<input name="firstName" defaultValue="Taylor">`. Bu `name` değeri form verilerinde anahtar olarak kullanılacaktır, örneğin `{ firstName: "Taylor" }`.

</Note>

<Pitfall>

Varsayılan olarak, `type` niteliği olmayan bir `<form>` içindeki bir `<button>` formu gönderir. Bu şaşırtıcı olabilir! Kendi özel `Button` React bileşeniniz varsa, `<button>` (type belirtilmeden) yerine [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) kullanmayı düşünün. Daha açık olmak için, formu gerçekten *göndermesi gereken* butonlar için `<button type="submit">` kullanın.  

</Pitfall>

---

### Durum değişkeniyle girdiyi kontrol etme {/*controlling-an-input-with-a-state-variable*/}

`<input />` şeklindeki girdiler *kontrolsüzdür.* `<input defaultValue="Başlangıç değeri" />` gibi [başlangıç değeri](#providing-an-initial-value-for-an-input) iletseniz bile, JSX'iniz şu anki değeri değil, yalnızca başlangıç değerini belirtir.

**_kontrollü girdi render etmek için, `value` propunu iletin (veya onay kutuları ve radyo butonları için `checked`).** React, her zaman girdi değerinin sizin ilettiğiniz `value` değeri olması için zorlayacaktır. Genelde, [durum değişkeni:](/reference/react/useState) tanımlayarak girdinizi kontrol edersiniz.

```js {2,6,7}
function Form() {
  const [firstName, setFirstName] = useState(''); // Durum değişkeni tanımlayınız...
  // ...
  return (
    <input
      value={firstName} //.. girdinin değerinin durum değişkeniyle eşleşmesi için zorlayınız...
      onChange={e => setFirstName(e.target.value)} //...ve her düzenlemede durum değişkenini güncelleyiniz!
    />
  );
}
```

Kontrollü bir girdi zaten duruma ihtiyacınız varsa kullanışlıdır, örneğin her düzenlemede arayüzü yeniden render etmek için:

```js {2,9}
function Form() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <label>
        Ad:
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </label>
      {firstName !== '' && <p>Adınız {firstName}.</p>}
      ...
```

Ayrıca birden çok girdi seçeneği vermek isterseniz de kullanışlıdır (butona tıklamak gibi) :
```js {3-4,10-11,14}
function Form() {
  // ...
  const [age, setAge] = useState('');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Yaş:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          10 yıl ekle
        </button>
```

Kontrollü bileşenlere ilettiğiniz `value` değeri `undefined` veya `null` olmamalıdır. Başlangıç değerinin boş olması gerekiyorsa (örneğin aşağıdaki `firstName` alanı), durum değişkeninizi boş string (`''`) olarak tanımyabilirsiniz.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [age, setAge] = useState('20');
  const ageAsNumber = Number(age);
  return (
    <>
      <label>
        Ad:
        <input
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Yaş:
        <input
          value={age}
          onChange={e => setAge(e.target.value)}
          type="number"
        />
        <button onClick={() => setAge(ageAsNumber + 10)}>
          10 yıl ekle
        </button>
      </label>
      {firstName !== '' &&
        <p>Adınız {firstName}.</p>
      }
      {ageAsNumber > 0 &&
        <p>Yaşınız {ageAsNumber}.</p>
      }
    </>
  );
}
```

```css
label { display: block; }
input { margin: 5px; }
p { font-weight: bold; }
```

</Sandpack>

<Pitfall>

**Eğer `onChange` olay yöneticisi olmadan `value` değeri iletirseniz, girdiyi kullanmak imkansız olacaktır** 
Girdiyi `value` değeri ileterek kontrol ettiğinizde, girdiyi sürekli olarak o değeri kullanmaya *zorlarsınız.* Bu nedenle durum değişkeni olarak `value` değeri ilettiğiniz sırada `onChange` olay yöneticisiyle de senkron olarak bu durum değişkenini güncellemeyi unutursanız, React klavyeye her basıldığında değişiklikleri ageri alıp belirttiğiniz `value` değerine dönecektir.

</Pitfall>

---

### Her tuş vuruşunda yeniden render işlemininin iyileştirilmesi {/*optimizing-re-rendering-on-every-keystroke*/}

Kontrollü girdi kullandığınızda, her klavye tıklamasında durumu ayarlarsınız. Durumun bulunduğu bileşeniniz her seferinde büyük bir ağacı yeniden render ederse bu işlem yavaş olabilir. Yeniden render performansınızı en iyi hale getirmek için birkaç yol bulunmaktadır.

Örneğin, her klavye girdisinde tüm sayfayı yeniden render eden bir form ile başlayalım:

```js {5-8}
function App() {
  const [firstName, setFirstName] = useState('');
  return (
    <>
      <form>
        <input value={firstName} onChange={e => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
}
```

`<PageContent />` girdi durumuna bağlı kalmadığı için girdi durumunu kendi bileşenine taşıyabilirsiniz:

```js {4,10-17}
function App() {
  return (
    <>
      <SignupForm />
      <PageContent />
    </>
  );
}

function SignupForm() {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={e => setFirstName(e.target.value)} />
    </form>
  );
}
```

Artık sadece `SignupForm` yeniden render edildiği için performans belirgin bir şekilde iyileşecektir.

Eğer yeniden renderı geçersiz kılacak bir yol yoksa (örneğin, `PageContent` arama girdisindeki değere bağlıysa), [`useDeferredValue`](/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) kontrollü girdinizi büyük bir yeniden render sırasında bile duyarlı tutar.

---

## Sorun giderme {/*troubleshooting*/}

### Metin girdime yazarken güncellenmiyor {/*my-text-input-doesnt-update-when-i-type-into-it*/}

Girdinizi `value` değeri ile render ederken `onChange` olay yöneticisi yoksa, konsolda şu hatayı göreceksiniz:

```js
// 🔴 Hata: kontrollü metin girdisinin onChange olay yöneticisi yok
<input value={something} />
```

<ConsoleBlock level="error">

`onChange` yöneticisi olmayaan bir form alanına `value` propunu verdiniz. Bu salt okunur bir alan oluşturacaktır. Alanın değişken olması gerekiyorsa `defaultValue` kullanın. Aksi takdirde `onChange` veya `readOnly` olarak ayarlayın.

</ConsoleBlock>

Hata mesajının önerdiği gibi, sadece [*başlangıç* değeri belirlemek](#providing-an-initial-value-for-an-input) istiyorsanız `defaultValue` kullanın:

```js
// ✅ İyi: başlangıç değeri olan kontrollü girdi
<input defaultValue={something} />
```
[Girdi alanını durum değişkeni ile kontrol etmek için](#controlling-an-input-with-a-state-variable) `onChange` yöneticisi belirleyin:

```js
// ✅ İyi: onChange yöneticisi olan kontrollü girdi
<input value={something} onChange={e => setSomething(e.target.value)} />
```
Değer bilerek salt okunur ayarlanmak isteniyorsa, hatayı `readOnly` propu ekleyerek önleyebilirsiniz:

```js
// ✅ İyi: salt okunur onChange olay yöneticisi olmayan kontrollü girdi
<input value={something} readOnly={true} />
```

---

### Onay kutularım onlara tıkladığımda güncellenmiyor {/*my-checkbox-doesnt-update-when-i-click-on-it*/}

Onay kutunuzu `onChange` olay yöneticisi olmadan `checked` değeri ile render ederseniz, konsolda şu hatayı göreceksiniz:

```js
// 🔴 Hata: onChange yöneticisi olmayan kontrollü onay kutusu
<input type="checkbox" checked={something} />
```

<ConsoleBlock level="error">

`onChange` yöneticisi olmayan bir form alanına `checked` propu verdiniz. Bu, salt okunur bir alan oluşturacaktır. Alanın değişken olması gerekiyorsa `defaultChecked` kullanın. Aksi takdirde `onChange` veya `readOnly` olarak ayarlayın.

</ConsoleBlock>

Hata mesajında önerildiği üzere, [*başlangıç* değeri belirlemek](#providing-an-initial-value-for-an-input) istiyorsanız `defaultValue` kullanın:

```js
// ✅ İyi: başlangıç değeri olan kontrolsüz girdi
<input type="checkbox" defaultChecked={something} />
```


[Onay kutusunu durum değişkeni ile kontrol etmek için](#controlling-an-input-with-a-state-variable) `onChange` yöneticisi belirleyin:

```js
// ✅ İyi: onChange yöneticisi olan kontrollü onay kutusu
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />
```

<Pitfall>

Onay kutularında `e.target.value` yerine `e.target.checked` değerini okumalısınız.

</Pitfall>

Onay kutusu bilerek salt okunur ayarlanmak isteniyorsa hatayı, `readOnly` propu ekleyerek önleyebilirsiniz:

```js
// ✅ İyi: salt okunur onChange yöneticisi olan kontrollü girdi
<input type="checkbox" checked={something} readOnly={true} />
```

---

### Girdideki imlecim klavyeden her girişte en başa atlıyor {/*my-input-caret-jumps-to-the-beginning-on-every-keystroke*/}

[Bir girdiyi kontrol ediyorsanız](#controlling-an-input-with-a-state-variable) `onChange` sırasında DOM'daki durum değişkeni değerini girdi değerine güncellemelisiniz.

`e.target.value` (veya onay kutuları için `e.target.checked`) dışındaki başka bir değerle güncelleyemezsiniz:

```js
function handleChange(e) {
  // 🔴 Hata: girdi değerini e.target.value dışında bir şeyle güncelleme
  setFirstName(e.target.value.toUpperCase());
}
```
Ayrıca asenkron olarak da güncelleyemezsiniz:

```js
function handleChange(e) {
  // 🔴 Hata: girdiyi asenkron olarak güncelleme
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Kodunuzu düzeltmek için, senkron bir şekilde `e.target.value` değeriyle güncelleyiniz:

```js
function handleChange(e) {
  // ✅ Kontrollü girdiyi e.target.value değeriyle senkron güncelleme
  setFirstName(e.target.value);
}
```

Eğerbunlar sorununuzu çözmezse, girdiniz her klavye girişinde DOM'dan silinip geri ekleniyor olabilir. Bu durum, her yeniden renderda [durumu sıfırlama](/learn/preserving-and-resetting-state)'dan kaynaklı olabilir. Örneğin, eğer girdiniz ya da onun üstündeki elemanlardan biri süreki farklı `key` niteliği alıyor olabilir veya bileşen tanımlarını iç içe yerleştirmenizden kaynaklı olabilir (iç içe yerleştirmeler desteklenmemektedir ve "iç" bileşenin her zaman farklı bir ağaç olarak kabul edilmesine neden olur).
---

### "Bir bileşen kontrolsüz girişi kontrol ediyor" hatası alıyorum {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Bileşeninize `value` değeri verdiyseniz, yaşam döngüsü boyunca string olarak kalmalıdır.

Önce `value={undefined}` olarak değer iletip daha sonra `value="some string"` şeklinde değer iletemezsiniz çünkü React, kontrollü bileşen mi kontrolsüz bileşen mi bunu bilemez. Kontrollü bileşen her zaman `value` değer olarak string almalıdır, `null` ya da `undefined` almamalıdır.

`value` değeriniz API'den veya durum değişkeninden geliyorsa, başta `null` veya `undefined` olarak tanımlanmış olabilir. Bu durumda boş bir string (`''`) olarak tanımlayabilirsiniz veya `value={someValue ?? ''}` olarak iletip `value` değerinin string olup olmadığına emin olabilirsiniz.
