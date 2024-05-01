---
title: "<textarea>"
---

<Intro>

[Tarayıcıya yerleşik `<textarea>` bileşeni](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) çok satırlı metin kutusu render etmenizi sağlar.

```js
<textarea />
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `<textarea>` {/*textarea*/}

Ekranda bir metin alanı göstermek için, [tarayıcıya yerleşik `<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) bileşenini render edin.

```js
<textarea name="gonderiIcerigi" />
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Prop'lar {/*props*/}

`<textarea>` tüm [ortak eleman proplarını](/reference/react-dom/components/common#props) destekler.

`value` propu ileterek [metin alanını kontrollü hale](#controlling-a-text-area-with-a-state-variable) getirebilirsiniz :

* `value`: String. Metin alanı içindeki metni kontrol eder.

`value` değeri ilettiğinizde, iletilen değeri güncelleyen `onChange` olay yöneticisini de iletmeniz gerekmektedir.

Eğer `<textarea>` bileşeniniz kontrolsüz ise, onun yerine `defaultValue` propunu iletebilirsiniz:

* `defaultValue`: String. Metin alanının [başlangıç değerini](#providing-an-initial-value-for-a-text-area) belirler.

Bu `<textarea>` propları hem kontrollü hem de kotrolsüz metin alanları için geçerlidir:

<<<<<<< HEAD
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): `'on'` ya da `'off'`. Otomatik tamamlama davranışlarını belirtir.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): Boolean. Eğer `true` ise, React, eleman DOM'a eklendikten sonra o elamana odaklanacaktır.
* `children`: `<textarea>` alt bileşen kabul etmez. Başlangıç değeri ayarlamak için `defaultValue`  kullanınız.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): Sayı. Ortalama karakter genişliklerinde,varsayılan genişliği belirler. Varsayılan değeri `20`dir.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): Boolean. Eğer `true` ise, metin alanı etkileşimli olmayacak ve soluk renkli görünecektir.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): String. Metin kutusunun ait olduğu `<form>` bileşeninin `id`'sini belirtir. Eğer belirtilmezse, ağaçtaki en yakın üst formdur.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): Sayı. Metnin maksimum uzunluğunu belirtir.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): Sayı. Metnin minimum uzunluğunu belirtir.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): String. [Form ile birlikte gönderilen](#reading-the-textarea-value-when-submitting-a-form) metin kutusunun adını belirtir.
* `onChange`: [`olay` yöneticisi](/reference/react-dom/components/common#event-handler) fonksiyonu.  [Kontrollü metin alanları](#controlling-a-text-area-with-a-state-variable) için gereklidir. Kullanıcı tarafından, girdi değeri değiştiği anda çalışır (örneğin, klavyede tuşa her basıldığında çalışır). Tarayıcı `input` olayı](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) gibi çalışır.
* `onChangeCapture`: [Yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan `onChange`'in bir versiyonudur.
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Olay` yöneticisi](/reference/react-dom/components/common#event-handler) fonksiyonu. Değer, kullanıcı tarafından değiştirildiği anda çalıştırılır. Tarihsel nedenlerden dolayı, React'te benzer şekilde çalışan `onChange`'i kullanmak yaygındır.
* `onInputCapture`: `onInput`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalıştırılan versiyonudur. 
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Olay` yöneticisi](/reference/react-dom/components/common#event-handler) fonksiyonu. Bir girdi, form gönderiminde doğrulamayı geçemezse çalıştırılır. Yerleşik `invalid` olayının aksine, React `onInvalid` olayı kabarcık şeklinde yayılır (bubbles).
* `onInvalidCapture`: `onInvalid`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalıştırılan bir versiyionudur.
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): [`Olay` yöneticisi](/reference/react-dom/components/common#event-handler) fonksiyonu. `<textarea>` içindeki seçilen alanın değişmesiyle tetiklenir. React, `onSelect` olayını boş seçim ve düzenlemelerde de (seçimi etkileyebilir) çalıştırır. 
* `onSelectCapture`: `onSelect`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalıştırılan bir versiyonudur.
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): String. Metin alanı boşken ekranda soluk renkte görüntülenir.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): Boolean. Eğer `true` ise, metin alanı kullanıcı tarafından düzenlenemez.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): Boolean. Eğer `true` ise, formun gönderilebilmesi için değer sağlanmalıdır.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): Sayı. Ortalama karakter yüksekliklerinde, varsayılan yüksekliği belirler. Varsayılan değeri `2`dir.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): `'hard'`, `'soft'`, ya da `'off'` değerlerini alabilir. Form gönderiliken metnin nasıl sarmalanacağını belirler.
=======
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autocomplete): Either `'on'` or `'off'`. Specifies the autocomplete behavior.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#autofocus): A boolean. If `true`, React will focus the element on mount.
* `children`: `<textarea>` does not accept children. To set the initial value, use `defaultValue`.
* [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols): A number. Specifies the default width in average character widths. Defaults to `20`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#disabled): A boolean. If `true`, the input will not be interactive and will appear dimmed.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#form): A string. Specifies the `id` of the `<form>` this input belongs to. If omitted, it's the closest parent form.
* [`maxLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#maxlength): A number. Specifies the maximum length of text.
* [`minLength`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#minlength): A number. Specifies the minimum length of text.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#name): A string. Specifies the name for this input that's [submitted with the form.](#reading-the-textarea-value-when-submitting-a-form)
* `onChange`: An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Required for [controlled text areas.](#controlling-a-text-area-with-a-state-variable) Fires immediately when the input's value is changed by the user (for example, it fires on every keystroke). Behaves like the browser [`input` event.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: A version of `onChange` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires immediately when the value is changed by the user. For historical reasons, in React it is idiomatic to use `onChange` instead which works similarly.
* `onInputCapture`: A version of `onInput` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires if an input fails validation on form submit. Unlike the built-in `invalid` event, the React `onInvalid` event bubbles.
* `onInvalidCapture`: A version of `onInvalid` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement/select_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires after the selection inside the `<textarea>` changes. React extends the `onSelect` event to also fire for empty selection and on edits (which may affect the selection).
* `onSelectCapture`: A version of `onSelect` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`placeholder`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#placeholder): A string. Displayed in a dimmed color when the text area value is empty.
* [`readOnly`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#readonly): A boolean. If `true`, the text area is not editable by the user.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#required): A boolean. If `true`, the value must be provided for the form to submit.
* [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows): A number. Specifies the default height in average character heights. Defaults to `2`.
* [`wrap`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#wrap): Either `'hard'`, `'soft'`, or `'off'`. Specifies how the text should be wrapped when submitting a form.
>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951

#### Uyarılar {/*caveats*/}

- `<textarea>something</textarea>` şeklinde alt bileşen gönderimine izin verilmez. [ Başlangıç içeriği için `defaultValue` kullanınız.](#providing-an-initial-value-for-a-text-area)
- Bir metin alanı `value` propuna string değer alırsa, [kontrollü olarak ele alınır. ](#controlling-a-text-area-with-a-state-variable).
- Bir metin alanı aynı anda hem kontrollü hem de kontrolsüz olamaz.
- Bir metin alanı yaşam döngüsü boyunca kontrollü ve kontrolsüz olma arasında geçiş yapamaz.
- Kontrollü tüm metin alanları, değerini senkronize olarak güncelleyecen `onChange` olay yöneticisine ihtiyaç duyar.
---

## Kullanım {/*usage*/}

### Metin alanını gösterme {/*displaying-a-text-area*/}

Ekranda `<textarea>`'yı görüntülemek için render ediniz. Varsayılan değerlerini [`rows`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#rows) and [`cols`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#cols) niteliklerini kullanarak belirleyebilirsiniz ancak varsayılan olarak kullanıcı yeniden boyutlandırabilir. Yeniden boyutlandırmayı devre dışı bırakmak için, CSS'te `resize: none` şeklinde belirtebilirsiniz.

<Sandpack>

```js
export default function NewPost() {
  return (
    <label>
      Gönderinizi yazın:
      <textarea name="gonderiIcerigi" rows={4} cols={40} />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

---

### Metin alanı için etiket verme {/*providing-a-label-for-a-text-area*/}

Genel olarak, her `<textarea>` elemanını bir `<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) elemanı içine yerleştirirsiniz. Bu, tarayıcıya  bu etiketin o metin alanıyla ilişkili olduğunu söyler. Kullanıcı bu etikete tıkladığında, tarayıcı o metin alanına odaklanır. Bu durum ayrıca erişebilirlik için de önemlidir: kullanıcı metin alanına tıkladığında ekran okuyucu bu etiketi okuyacaktır.

Eğer `<textarea>` bir `<label>` elemanının içine yerleştiremezseniz, `<textarea id>` ve [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) elemanlarına aynı ID'yi ileterek bu elemanları ilişkilendirebilirsiniz. Bir bileşenin birden fazla örnekleri arasındaki çakışmaları önlemek için [`useId`](/reference/react/useId) ile ID üretebilirsiniz.

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const postTextAreaId = useId();
  return (
    <>
      <label htmlFor={postTextAreaId}>
        Gönderinizi yazın:
      </label>
      <textarea
        id={postTextAreaId}
        name="gonderiIcerigi"
        rows={4}
        cols={40}
      />
    </>
  );
}
```

```css
input { margin: 5px; }
```

</Sandpack>

---

### Metin alanına başlangıç değeri verme {/*providing-an-initial-value-for-a-text-area*/}

`defaultValue` değerini string olarak ileterek metin alanına başlangıç değeri verebilirsiniz. 
<Sandpack>

```js
export default function EditPost() {
  return (
    <label>
      Gönderinizi düzenleyin:
      <textarea
        name="gonderiIcerigi"
        defaultValue="Dün bisiklet sürmekten gerçekten keyif verdi!"
        rows={4}
        cols={40}
      />
    </label>
  );
}
```

```css
input { margin-left: 5px; }
textarea { margin-top: 10px; }
label { margin: 10px; }
label, textarea { display: block; }
```

</Sandpack>

<Pitfall>

HTML'in aksine, `<textarea>Bazı içerikler</textarea>` şeklinde yerleşik metin gönderimi desteklenmemektedir.

</Pitfall>

---

### Formu gönderirken metin alanı değerini okuma {/*reading-the-text-area-value-when-submitting-a-form*/}

[`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) ve metin alanınızı çevreleyen bir [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) ekleyin. Eklediğiniz buton `<form onSubmit>` olay yöneticisini çağıracaktır. Varsayılan olarak, tarayıcı form verilerini bulunduğunuz URL'e gönderecek ve sayfayı yenileyecektir. `e.preventDefault()` ifadesini çağırarak bu işlemi engelleyebilirsiniz. Form verilerini [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) ile okuyabilirsiniz.
<Sandpack>

```js
export default function EditPost() {
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
        Gönderi başlığı: <input name="gonderiBasligi" defaultValue="Bisiklet Sürmek" />
      </label>
      <label>
        Gönderinizi düzenleyin:
        <textarea
          name="gonderiIcerigi"
          defaultValue="Dün bisiklet sürmekten gerçekten keyif verdi!"
          rows={4}
          cols={40}
        />
      </label>
      <hr />
      <button type="reset">Düzenlemeleri sıfırla</button>
      <button type="submit">Gönderiyi kaydet</button>
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

`<textarea>` elemanınıza bir `name` değeri verin, örneğin `<textarea name="gonderiIcerigi" />`. Bu `name` değeri form verilerinde anahtar olarak kullanılacaktır, örneğin `{ postContent: "Gönderiniz" }`.

</Note>

<Pitfall>

Varsayılan olarak `<form>` içindeki *herhangi bir* `<button>` elemanı formu gönderecektir. Bu biraz şaşırtıcı olabilir, kendinize ait React `Button` elemanınız varsa, `<button>` yerine [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) döndürmeyi düşünebilirsiniz. Daha açık olmak gerekirse, formu göndermesi gereken *butonlar* için `<button type="submit">` kullanınız.

</Pitfall>

---

### Durum değişkeniyle metin alanını kontrol etme {/*controlling-a-text-area-with-a-state-variable*/}

`<textarea />` şeklindeki metin alanları *kontrolsüzdür.* `<textarea defaultValue="Başlangıç metni" />` gibi [başlangıç değeri](#providing-an-initial-value-for-a-text-area) iletseniz bile, JSX'iniz şu anki değeri değil, yalnızca başlangıç değerini belirtir.

**_Kontrollü_ metin alanını render etmek için, metin alanına `value` propunu iletin.** React, her zaman metin alanı değerinin sizin ilettiğiniz `value` değeri olması için zorlayacaktır. Genelde, [durum değişkeni:](/reference/react/useState) tanımlayarak metin alanınızı kontrol edeceksiniz.

```js {2,6,7}
function NewPost() {
  const [postContent, setPostContent] = useState(''); // Durum değişkeni tanımlayınız...
  // ...
  return (
    <textarea
      value={postContent} //.. girdinin değerinin durum değişkeniyle eşleşmesi için zorlayınız...
      onChange={e => setPostContent(e.target.value)} //...ve her düzenlemede durum değişkenini güncelleyiniz!
    />
  );
}
```

Bu işlem, eğer klavyedeki her girişte arayüzün bazı parçalarını yeniden render edecekseniz kullanışlıdır.
<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Hello,_ **Markdown**!');
  return (
    <>
      <label>
        Markdown giriniz:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  const renderedHTML = md.render(markdown);
  return <div dangerouslySetInnerHTML={{__html: renderedHTML}} />;
}
```

```json package.json
{
  "dependencies": {
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

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

<Pitfall>

<<<<<<< HEAD
**Eğer `onChange` olay yöneticisi olmadan `value` değeri iletirseniz, metin alanına yazmak imkansız olacaktır.** Metin alanını `value` değeri ileterek kontrol ettiğinizde, metin alanını sürekli olarak o değeri kullanmaya *zorlarsınız*. Bu nedenle bir durum değişkeni olarak `value` değeri ilettiğiniz sırada `onChange` olay yöneticisiyle de senkron olarak bu durum değişkenini güncellemeyi unutursanız, React klavyeye her basıldığında değişiklikleri geri alıp belirttiğiniz `value` değerine dönecektir.
=======
**If you pass `value` without `onChange`, it will be impossible to type into the text area.** When you control a text area by passing some `value` to it, you *force* it to always have the value you passed. So if you pass a state variable as a `value` but forget to update that state variable synchronously during the `onChange` event handler, React will revert the text area after every keystroke back to the `value` that you specified.

>>>>>>> 9e1f5cd590fd066e72dda9022237bee30b499951
</Pitfall>

---

## Sorun giderme {/*troubleshooting*/}

### Metin alanına yazarken güncellenmiyor {/*my-text-area-doesnt-update-when-i-type-into-it*/}

Metin alanınızı `value` değeri ile render ederken `onChange` olay yöneticisi yoksa konsolde şu hatayı göreceksiniz:

```js
// 🔴 Hata: kontrol edilen metin alanının onChange olay yöneticisi yok
<textarea value={something} />
```

<ConsoleBlock level="error">

`onChange` yöneticisi olmayan bir form alanına `value` propu verdiniz. Bu, salt okunur bir alan oluşturacaktır. Alanın değişken olması gerekiyorsa `defaultValue` kullanın. Aksi takdirde, `onChange` veya `readOnly` olarak ayarlayın. 

</ConsoleBlock>

Hata mesajında önerildiği üzere, sadece [*başlangıç* değeri belirlemek](#providing-an-initial-value-for-a-text-area) istiyorsanız `defaultValue` kullanın:

```js
// ✅ İyi: başlangıç değeri olan kontrolsüz metin alanı
<textarea defaultValue={something} />
```

[Metin alanını durum değişkeni ile kontrol etmek için](#controlling-a-text-area-with-a-state-variable) `onChange` yöneticisi belirleyin:

```js
// ✅ İyi: onChange yöneticisi olan kontrollü metin alanı
<textarea value={something} onChange={e => setSomething(e.target.value)} />
```

Değer bilerek salt okunur ayarlanmak isteniyorsa, hatayı `readOnly` propu ekleyerek önleyebilirsiniz:

```js
// ✅ İyi: salt okunur kontrollü metin alanı
<textarea value={something} readOnly={true} />
```

---

### Metin alanındaki imlecim klavyeden her girişte en başa atlıyor {/*my-text-area-caret-jumps-to-the-beginning-on-every-keystroke*/}

[Bir metin alanını kontrol ediyorsanız](#controlling-a-text-area-with-a-state-variable), `onChange` sırasında DOM'daki metin alanı değerini durum değişkenine göre güncellemelisiniz.

`e.target.value` dışında başka bir değerle güncelleyemezsiniz:

```js
function handleChange(e) {
  // 🔴 Hata: bir girişi e.target.value dışında bir şeyle güncelleme
  setFirstName(e.target.value.toUpperCase());
}
```

Ayrıca asenkron olarak da güncelleyemezsiniz:

```js
function handleChange(e) {
  // 🔴 Hata: bir girişi asenkron güncelleme
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
}
```

Kodunuzu düzeltmek için, senkron bir şekilde `e.target.value` değeriyle güncelleyiniz:

```js
function handleChange(e) {
  // ✅ Kontrollü girişi e.target.value değeriyle senkron güncelleme
  setFirstName(e.target.value);
}
```

Eğer bunlar sorununuzu çözmezse, metin alanınız her klavye girişinde DOM'dan silinip geri ekleniyor olabilir. Bu durum, her yeniden renderda [durumu sıfırlama](/learn/preserving-and-resetting-state)'dan kaynaklı olabilir. Örneğin, metin alanı ya da onun üstündeki elemanlar sürekli farklı `key` niteliği alıyor olabilir veya bileşen tanımlarını iç içe yerleştirmenizden kaynaklı olabilir. (React'ta iç içe yerleştirmelere izin verilmez ve "içteki" bileşen her renderda yeniden bağlanır.)

---

### "Bir bileşen kontrolsüz girişi kontrol ediyor" hatası alıyorum {/*im-getting-an-error-a-component-is-changing-an-uncontrolled-input-to-be-controlled*/}


Bileşeninize `value` değeri verdiyseniz, yaşam döngüsü boyunca string olarak kalmalıdır.

Önce `value={undefined}` olarak değer iletip daha sonra `value="some string"` şeklinde değer iletemezsiniz çünkü React, kontrollü bileşen mi kontrolsüz bileşen mi bunu bilemez. Kontrollü bileşen her zaman `value` değeri olarak string almalıdır, `null` ya da `undefined` almamalıdır.

`value` değeriniz API'den veya durum değişkeninden geliyorsa, başta `null` veya `undefined` olarak tanımlanmış olabilir. Bu durumda boş bir string olarak (`''`) tanımlayabilirsiniz veya `value={someValue ?? ''}` olarak iletip `value` değerinin string olup olmadığına emin olabilirsiniz.
