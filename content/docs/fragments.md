---
id: fragments
title: Fragment'ler
permalink: docs/fragments.html
prev: context.html
next: portals.html
---

React'teki ortak model, bir bileşenin birden fazla öğe döndürmesidir. Fragmentler, Dom'a ekstra düğüm eklemeden bir alt elemanlar listesini gruplandırmanıza izin verir.

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

Onları tanımlamak için yeni bir [kısa sözdizimi](#short-syntax) de vardır.

## Motivasyon {#motivation}

Bir bileşenin alt eleman listesini döndürmesi için yaygın bir modeldir. Örnek için bu React kod parçasına bakın.

```jsx
class Table extends React.Component {
  render() {
    return (
      <table>
        <tr>
          <Columns />
        </tr>
      </table>
    );
  }
}
```

Oluşturulan HTML'in geçerli olması için `<Columns />` birden fazla `<td>` öğesini döndürmesi gerekir. Bir üst div `<Columns />` bileşeninin `render()` metodu içinde kullanılmışsa, sonuçta ortaya çıkan HTML geçersiz olacaktır.

```jsx
class Columns extends React.Component {
  render() {
    return (
      <div>
        <td>Merhaba</td>
        <td>Dünya</td>
      </div>
    );
  }
}
```

`<Table />` çıktısının sonucu:

```jsx
<table>
  <tr>
    <div>
      <td>Hello</td>
      <td>World</td>
    </div>
  </tr>
</table>
```

Fragmentler bu sorunu çözer.

## Kullanım {#usage}

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <React.Fragment>
        <td>Merhaba</td>
        <td>Dünya</td>
      </React.Fragment>
    );
  }
}
```

`<Table />` çıktısının doğru sonucu:

```jsx
<table>
  <tr>
    <td>Merhaba</td>
    <td>Dünya</td>
  </tr>
</table>
```

### Kısa Sözdizimi {#short-syntax}

Fragmentleri tanımlamak için kullanabileceğiniz yeni, daha kısa bir sözdizimi var. Boş etiketlere benziyor:

```jsx{4,7}
class Columns extends React.Component {
  render() {
    return (
      <>
        <td>Merhaba</td>
        <td>Dünya</td>
      </>
    );
  }
}
```

Anahtarları veya nitelikleri desteklememesi dışında, diğer elementleri kullandığınız gibi `<></>` kullanabilirsiniz.

Not, **[birçok araç henüz desteklemiyor](/blog/2017/11/28/react-v16.2.0-fragment-support.html#support-for-fragment-syntax)**. Bu nedenle, destekleninceye kadar `<React.Fragment>` yazmak isteyebilirsiniz.

### Anahtarlı Fragment'ler {#keyed-fragments}

Açıkça belirtilen `<React.Fragment>` sözdiziminin anahtarları olabilir. Bunun için bir kullanım durumu, bir koleksiyonun bir fragmentler dizisine eşlenmesidir. -- örneğin, bir açıklama listesi oluşturmak için:

```jsx
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // `key` olmadan, React önemli bir uyarıyı tetikler
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

`key`, `Fragment`'e iletilebilecek tek özelliktir. Gelecekte, olay yöneticileri gibi ek özellikler için destek ekleyebiliriz.

### Canlı Demo {#live-demo}

Bununla yeni JSX fragment sözdizimini deneyebilirsiniz: [CodePen](https://codepen.io/reactjs/pen/VrEbjE?editors=1000).
