---
title: "<option>"
---

<Intro>

[Web Tarayıcısının `<option>` bileşeni](https://developer.mozilla.org/tr/docs/Web/HTML/Element/option), [`<select>`](/reference/react-dom/components/select) kutusu içinde bir seçenek sunmanıza olanak tanır.

```js
<select>
   <option value="birSecenek">Bir seçenek</option>
   <option value="digerSecenek">Diğer seçenek</option>
</select>
```

</Intro>

<InlineToc />

---

## Başvuru dokümanı {/*reference*/}

### `<option>` {/*option*/}

[Web Tarayıcısının `<option>` bileşeni](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option) [`<select>`](/reference/react-dom/components/select) kutusunun içinde bir seçenek oluşturmanıza olanak tanır.

```js
<select>
   <option value="birSecenek">Bir seçenek</option>
   <option value="digerSecenek">Diğer seçenek</option>
</select>
```

[Buradan daha fazla örnek görebilirsiniz.](#usage)

#### Prop'lar {/*props*/}

`<option>`, tüm [yaygın element özelliklerini](/reference/react-dom/components/common#common-props) destekler.

Ayrıca, `<option>` bu özellikleri de destekler:

* [`disabled`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#disabled): Boolean. Eğer `true` ise, seçenek seçilemez ve soluk görünür.
* [`label`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label): Dize. Seçeneğin anlamını belirtir. Eğer dahil edilmezse, seçenek içindeki metin kullanılır.
* [`value`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#value): Eğer bu seçenek seçilirse, [üst eleman `<select>` öğesini bir formda gönderirken](/reference/react-dom/components/select#reading-the-select-box-value-when-submitting-a-form) kullanılacak değeri belirtir.

#### Uyarılar {/*caveats*/}

* React, `<option>` öğesinde `selected` özelliğini desteklemez. Bunun yerine, bu seçeneğin `value` değerini ebeveyn [`<select defaultValue>`](/reference/react-dom/components/select#providing-an-initially-selected-option) öğesine aktararak kontrolsüz bir seçim kutusu oluşturun veya [`<select value>`](/reference/react-dom/components/select#controlling-a-select-box-with-a-state-variable) öğesine aktararak kontrollü bir seçim kutusu oluşturun.

---

## Kullanım {/*usage*/}

### Seçenekler içeren bir seçim kutusu gösterme {/*displaying-a-select-box-with-options*/}

Seçim kutusu oluşturmak için, içerisinde `<option>` bileşenleri bulunan `<select>` öğesi kullanın. Her bir `<option>` bileşenine, form ile gönderilecek verileri temsil eden bir `value` değeri atayın.

[İçerisinde `<option>` bileşenleri bulunan bir `<select>` öğesini göstermek hakkında daha fazla bilgi edinin.](/reference/react-dom/components/select)


<Sandpack>

```js
export default function MeyveSecici() {
  return (
    <label>
      Bir meyve seçin:
      <select name="secilenMeyve">
        <option value="apple">Elma</option>
        <option value="banana">Muz</option>
        <option value="orange">Portakal</option>
      </select>
    </label>
  );
}
```

```css
select { margin: 5px; }
```

</Sandpack>  

