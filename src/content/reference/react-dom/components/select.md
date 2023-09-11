---
title: "<select>"
---

<Intro>

[Tarayıcıya yerleşik `<select>` bileşeni](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select), bir seçim kutusu render etmenizi sağlar.

```js
<select>
  <option value="birSecenek">Bir seçenek</option>
  <option value="digerSecenek">Diğer seçenek</option>
</select>
```

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### `<select>` {/*select*/}

Ekranda bir seçim kutusu göstermek için, [tarayıcının yerleşik bileşeni olan `<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)'i render edin.

```js
<select>
  <option value="birSecenek">Bir seçenek</option>
  <option value="digerSecenek">Diğer seçenek</option>
</select>
```

[Daha fazla örnek için aşağıya bakınız.](#usage)

#### Prop'lar {/*props*/}

`<select>` tüm [ortak eleman prop'larını](/reference/react-dom/components/common#props) destekler.

`value` prop'u ileterek [seçim kutusunu kontrollü hale](#controlling-a-select-box-with-a-state-variable) getirebilirsiniz:

* `value`: String (ya da [`multiple={true}`] için string'lerden oluşan bir dizi (#enabling-multiple-selection)). Hangi seçeneğin seçildiğini kontrol eder. Her value string'i, `<select>` içindeki `<option>`'ların `value` değeri ile eşleşir.

`value` değeri ilettiğinizde, iletilen değeri güncelleyen bir `onChange` olay yöneticisi de iletmeniz gerekmektedir.

Eğer `<select>` bileşeniniz kontrolsüz ise, onun yerine `defaultValue` prop'unu iletebilirsiniz:

* `defaultValue`: String (ya da [`multiple={true}`] için string'lerden oluşan bir dizi (#enabling-multiple-selection)). [Başlangıçta seçili seçeneği](#providing-an-initially-selected-option) belirtir.

Bu `<select>` prop'ları hem kontrollü hem de kontrolsüz seçim kutuları için geçerlidir:

<<<<<<< HEAD
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): String. Olası [otomatik tamamlama davranışlarından](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values) birini belirtir.
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): Boolean. Eğer `true` ise, React, eleman DOM'a eklendikten sonra o elemana odaklanacaktır.
* `children`: `<select>` elemanı [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup) ve [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup) bileşenlerini alt eleman olarak kabul eder. Bu bileşenlerden birini render ettiği sürece kendi bileşenlerinizi de iletebilirsiniz. Sonucunda `<option>` elemanını render eden kendi bileşenlerinizi iletirseniz, render ettiğiniz her `<option>` bir `value` değerine sahip olmalıdır.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): Boolean. Eğer `true` ise, seçim kutusu etkileşimli olmayacak ve soluk renkte görünecektir.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): String. Seçim kutusunun ait olduğu `<form>`'un `id`'sini belirtir. Eğer belirtilmezse, ağaçtaki en yakın üst form'dur.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): Boolean. Eğer `true` ise, tarayıcı [çoklu seçime](#enabling-multiple-selection) izin verir.
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): String. [Form ile birlikte gönderilen](#reading-the-select-box-value-when-submitting-a-form) seçim kutusunun adını belirtir.
* `onChange`: [`Olay` yöneticisi](/reference/react-dom/components/common#event-handler) fonksiyonu. [Kontrollü seçim kutuları] (#controlling-a-select-box-with-a-state-variable) için gereklidir. Kullanıcı farklı bir seçenek seçer seçmez çalıştırılır. Tarayıcı [`input` olayı](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event) gibi davranır.
* `onChangeCapture`: `onChange`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalıştırılan sürümüdür.
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): [`Olay` yöneticisi](/reference/react-dom/components/common#event-handler) fonksiyonu. Kullanıcı değeri değiştirir değiştirmez çalıştırılır. Tarihsel nedenlerden dolayı, React'te benzer şekilde çalışan `onChange`'i kullanmak yaygındır.
* `onInputCapture`: `onInput`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalıştırılan sürümüdür.
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): [`Olay` yöneticisi](/reference/react-dom/components/common#event-handler) fonksiyonu. Bir girdi, form gönderilirken doğrulamayı geçemezse çalıştırılır. Yerleşik `invalid` olayının aksine, React `onInvalid` olayı kabarcıklanır (bubbles).
* `onInvalidCapture`: `onInvalid`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalıştırılan sürümüdür.
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): Boolean. Eğer `true` ise, formun gönderilmesi için bir değer sağlanmalıdır.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): Sayı. `multiple={true}` seçenekleri için, başlangıçta görüntülenmesi tercih edilen öğe sayısını belirtir.
=======
* [`autoComplete`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autocomplete): A string. Specifies one of the possible [autocomplete behaviors.](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values)
* [`autoFocus`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#autofocus): A boolean. If `true`, React will focus the element on mount.
* `children`: `<select>` accepts [`<option>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option), [`<optgroup>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup), and [`<datalist>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/datalist) components as children. You can also pass your own components as long as they eventually render one of the allowed components. If you pass your own components that eventually render `<option>` tags, each `<option>` you render must have a `value`.
* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#disabled): A boolean. If `true`, the select box will not be interactive and will appear dimmed.
* [`form`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#form): A string. Specifies the `id` of the `<form>` this select box belongs to. If omitted, it's the closest parent form.
* [`multiple`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#multiple): A boolean. If `true`, the browser allows [multiple selection.](#enabling-multiple-selection)
* [`name`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#name): A string. Specifies the name for this select box that's [submitted with the form.](#reading-the-select-box-value-when-submitting-a-form)
* `onChange`: An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Required for [controlled select boxes.](#controlling-a-select-box-with-a-state-variable) Fires immediately when the user picks a different option. Behaves like the browser [`input` event.](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
* `onChangeCapture`: A version of `onChange` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires immediately when the value is changed by the user. For historical reasons, in React it is idiomatic to use `onChange` instead which works similarly.
* `onInputCapture`: A version of `onInput` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`onInvalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event): An [`Event` handler](/reference/react-dom/components/common#event-handler) function. Fires if an input fails validation on form submit. Unlike the built-in `invalid` event, the React `onInvalid` event bubbles.
* `onInvalidCapture`: A version of `onInvalid` that fires in the [capture phase.](/learn/responding-to-events#capture-phase-events)
* [`required`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#required): A boolean. If `true`, the value must be provided for the form to submit.
* [`size`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#size): A number. For `multiple={true}` selects, specifies the preferred number of initially visible items.
>>>>>>> 5219d736a7c181a830f7646e616eb97774b43272

#### Uyarılar {/*caveats*/}

- HTML'den farklı olarak, `<option>`'a `selected` özelliği iletmek desteklenmemektedir. Bunun yerine, kontrolsüz seçim kutuları için [`<select defaultValue>`](#providing-an-initially-selected-option), kontrollü seçim kutuları için [`<select value>`](#controlling-a-select-box-with-a-state-variable) ifadelerini kullanın.
- Eğer bir seçim kutusu `value` prop'u alıyorsa, [kontrollü olarak ele alınacaktır.](#controlling-a-select-box-with-a-state-variable)
- Bir seçim kutusu aynı anda hem kontrollü hem de kontrolsüz olamaz.
- Bir seçim kutusu yaşam döngüsü boyunca kontrollü ve ya kontrolsüz olma arasında geçiş yapamaz.
- Kontrollü her seçim kutusu, değerini senkronize olarak güncelleyen bir `onChange` olay yöneticisine ihtiyaç duyar.

---

## Kullanım {/*usage*/}

### Seçenekler içeren bir seçim kutusu gösterme {/*displaying-a-select-box-with-options*/}

Bir seçim kutusu görüntülemek için içinde `<option>` bileşenlerinin listesini içeren bir `<select>` render edin. Her `<option>`'a, form ile gönderilecek verileri temsil eden bir `value` değeri verin.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Bir meyve seçin:
      <select name="secilenMeyve">
        <option value="elma">Elma</option>
        <option value="muz">Muz</option>
        <option value="portakal">Portakal</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

---

### Seçim kutusuna etiket verme {/*providing-a-label-for-a-select-box*/}

Genel olarak, her `<select>` elemanını bir [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) elemanı içine yerleştirirsiniz. Bu, tarayıcıya bu etiketin o seçim kutusuyla ilişkili olduğunu söyler. Kullanıcı etikete tıkladığında tarayıcı otomatik olarak seçim kutusuna odaklanacaktır. Bu durum erişilebilirlik için de önemlidir: kullanıcı seçim kutusuna odaklandığında ekran okuyucu bu etiketi okuyacaktır.

`<select>` elemanını bir `<label>` içine yerleştiremezseniz, `<select id>` ve [`<label htmlFor>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor) elemanlarına aynı ID'yi ileterek bu elemanları ilişkilendirebilirsiniz. Bir bileşenin birden çok örneği arasındaki çakışmaları önlemek için [`useId`](/reference/react/useId) ile bir ID üretebilirsiniz.

<Sandpack>

```js
import { useId } from 'react';

export default function Form() {
  const vegetableSelectId = useId();
  return (
    <>
      <label>
        Bir meyve seçin:
        <select name="secilenMeyve">
          <option value="elma">Elma</option>
          <option value="muz">Muz</option>
          <option value="portakal">Portakal</option>
        </select>
      </label>
      <hr />
      <label htmlFor={vegetableSelectId}>
        Bir sebze seçin:
      </label>
      <select id={vegetableSelectId} name="secilenSebze">
        <option value="salatalik">Salatalık</option>
        <option value="misir">Mısır</option>
        <option value="domates">Domates</option>
      </select>
    </>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>


---

### Başlangıçta seçili bir seçenek sağlama {/*providing-an-initially-selected-option*/}

Varsayılan olarak, tarayıcı listedeki ilk `<option>`'ı seçecektir. Varsayılan olarak başka bir seçeneği seçmek için o `<option>`'ın `value` değerini `defaultValue` olarak `<select>` elemanına iletin.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Bir meyve seçin:
      <select name="secilenMeyve" defaultValue="portakal">
        <option value="elma">Elma</option>
        <option value="muz">Muz</option>
        <option value="portakal">Portakal</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

<Pitfall>

HTML'den farklı olarak, tek bir `<option>`'a `selected` özelliği iletmek desteklenmemektedir.

</Pitfall>

---

### Çoklu seçime izin verme {/*enabling-multiple-selection*/}

Kullanıcının çok seçenek seçmesine izin vermek için `multiple={true}` ifadesini `<select>` elemanına iletin. Bu durumda, eğer başlangıçta seçili seçenekler için `defaultValue` belirtirseniz, bu bir dizi olmalıdır.

<Sandpack>

```js
export default function FruitPicker() {
  return (
    <label>
      Bazı meyveleri seçin:
      <select
        name="secilenMeyve"
        defaultValue={['portakal', 'muz']}
        multiple={true}
      >
        <option value="elma">Elma</option>
        <option value="muz">Muz</option>
        <option value="portakal">Portakal</option>
      </select>
    </label>
  );
}
```

```css
select { display: block; margin-top: 10px; width: 200px; }
```

</Sandpack>

---

### Form'u gönderirken seçim kutusunun değerini okuma {/*reading-the-select-box-value-when-submitting-a-form*/}

Seçim kutusu ve [`<button type="submit">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button) içeren bir [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) elemanı render edin. Bu buton `<form onSubmit>` olay yönetecinizi çağıracaktır. Varsayılan olarak, tarayıcı form verilerini bulunduğunuz URL'e gönderecek ve sayfayı yenileyecektir. Bu davranışı engellemek için `e.preventDefault()` ifadesini çağırabilirsiniz. Form verisini [`new FormData(e.target)`](https://developer.mozilla.org/en-US/docs/Web/API/FormData) ile okuyabilirsiniz.
<Sandpack>

```js
export default function EditPost() {
  function handleSubmit(e) {
    // Tarayıcının sayfayı yenilemesini engelleyin
    e.preventDefault();
    // Form verisini okuyun
    const form = e.target;
    const formData = new FormData(form);
    // formData'yı fetch gövdesi olarak iletebilirsiniz:
    fetch('/some-api', { method: form.method, body: formData });
    // Tarayıcının varsayılan olarak yaptığı gibi, bir URL oluşturabilirsiniz:
    console.log(new URLSearchParams(formData).toString());
    // Düz bir nesne gibi çalışabilirsiniz.
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson); // (!) Bu, çoklu seçim değerlerini içermez
    // Ya da bir dizi ad-değer çifti alabilirsiniz.
    console.log([...formData.entries()]);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Favori meyvenizi seçin:
        <select name="secilenMeyve" defaultValue="portakal">
          <option value="elma">Elma</option>
          <option value="muz">Muz</option>
          <option value="portakal">Portakal</option>
        </select>
      </label>
      <label>
        Tüm favori sebzelerinizi seçin:
        <select
          name="secilenSebzeler"
          multiple={true}
          defaultValue={['misir', 'domates']}
        >
          <option value="salatalik">Salatalık</option>
          <option value="misir">Mısır</option>
          <option value="domates">Domates</option>
        </select>
      </label>
      <hr />
      <button type="sifirla">Sıfırla</button>
      <button type="gonder">Gönder</button>
    </form>
  );
}
```

```css
label, select { display: block; }
label { margin-bottom: 20px; }
```

</Sandpack>

<Note>

`<select>` elemanınıza bir `name` değeri verin, örneğin `<select name="selectedFruit" />`. Verdiğiniz `name` değeri form verisinde anahtar olarak kullanılacaktır, örneğin `{ selectedFruit: "orange" }`.

Eğer çoklu seçim için `<select multiple={true}>` ifadesini kullanırsanız, form'dan okuyacağınız [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData), seçilen her değeri ayrı bir ad-değer çifti olarak içerecektir. Yukarıdaki örnekteki konsola yakından bakın.

</Note>

<Pitfall>

Varsayılan olarak, `<form>` elemanı içindeki *herhangi bir* `<button>` elemanı formu gönderecektir. Bu şaşırtıcı olabilir! Kendi özel `Button` React bileşeniniz varsa, `<button>` yerine [`<button type="button">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button) döndürmeyi düşünün. Daha açık olmak için, formu göndermesi gereken *butonlar* için `<button type="submit">` ifadesini kullanın.

</Pitfall>

---

### State değişkeni ile seçim kutusunu kontrol etme {/*controlling-a-select-box-with-a-state-variable*/}

`<select />` gibi bir seçim kutusu *kontrolsüzdür.* `<select defaultValue="orange" />` gibi [başlangıçta seçili bir değer iletseniz](#providing-an-initially-selected-option) bile, JSX'iniz şu anki değeri değil, yalnızca başlangıç değerini belirtir.

**_Kontrollü_ seçim kutusu render etmek için ona `value` prop'u iletin.** React, seçim kutusunu her zaman ilettiğiniz `value` değerine sahip olmaya zorlar. Genellikle, bir [state değişkeni](/reference/react/useState) kullanarak seçim kutusunu kontrol edeceksiniz:

```js {2,6,7}
function FruitPicker() {
  const [secilenMeyve, setSecilenMeyve] = useState('portakal'); // State değişkeni bildirin...
  // ...
  return (
    <select
      value={secilenMeyve} // ...seçilenin değerini state değişkeniyle eşleşmeye zorla...
      onChange={e => setSecilenMeyve(e.target.value)} // ... ve her bir değişimde state değişkenini güncelle!
    >
      <option value="elma">Elma</option>
      <option value="muz">Muz</option>
      <option value="portakal">Portakal</option>
    </select>
  );
}
```

Bu, her yapılan seçime tepki olarak kullanıcı arayüzünün bazı bölümlerini yeniden render etmek istediğiniz zaman kullanışlıdır.

<Sandpack>

```js
import { useState } from 'react';

export default function FruitPicker() {
  const [secilenMeyve, setSecilenMeyve] = useState('portakal');
  const [secilenSebzeler, setSecilenSebzeler] = useState(['misir', 'domates']);
  return (
    <>
      <label>
        Bir meyve seç:
        <select
          value={secilenMeyve}
          onChange={e => setSecilenMeyve(e.target.value)}
        >
          <option value="elma">Elma</option>
          <option value="muz">Muz</option>
          <option value="portakal">Portakal</option>
        </select>
      </label>
      <hr />
      <label>
        Tüm favori sebzelerinizi seçin:
        <select
          multiple={true}
          value={secilenSebzeler}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSecilenSebzeler(values);
          }}
        >
          <option value="salatalik">Salatalık</option>
          <option value="misir">Mısır</option>
          <option value="domates">Domates</option>
        </select>
      </label>
      <hr />
      <p>Favori meyveniz: {secilenMeyve}</p>
      <p>Favori sebzeleriniz: {secilenSebzeler.join(', ')}</p>
    </>
  );
}
```

```css
select { margin-bottom: 10px; display: block; }
```

</Sandpack>

<Pitfall>

**Eğer `onChange` fonksiyonu olmadan `value` değeri iletirseniz, bir seçenek seçmek imkansız olacaktır.** Seçim kutusuna `value` değeri ileterek kontrol ettiğinizde, seçim kutusunu her zaman ilettiğiniz değere sahip olmaya *zorlarsınız.* Bu nedenle, bir state değişkenini `value` olarak iletirseniz ancak `onChange` olay yöneticisi sırasında bu state değişkenini eşzamanlı olarak güncellemeyi unutursanız, React, her tuşa tıkladığınızda seçim kutusunu belirttiğiniz `value` değerine geri döndürecektir.

HTML'den farklı olarak, tek bir `<option>`'a `selected` özelliği iletmek desteklenmemektedir.

</Pitfall>
