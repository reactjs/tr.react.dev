---
id: uncontrolled-components
title: Kontrolsüz Bileşenler
permalink: docs/uncontrolled-components.html
---

Çoğu durumda, formları uygulamak için [kontrollü bileşenler](/docs/forms.html#controlled-components) kullanmanızı öneririz. Kontrollü bir bileşende, form verileri bir React bileşeni tarafından ele alınır. Alternatifi ise, form verilerinin DOM'ın kendisi tarafından işlendiği kontrolsüz bileşenlerdir.

Bir kontrolsüz bileşen yazmak için, her state güncellemesine bir olay yöneticisi yazmak yerine, form verilerini DOM üzerinden getirmek için [ref kullanabilirsiniz](/docs/refs-and-the-dom.html).

Örneğin, bu kod kontrolsüz bir bileşende tek bir isim kabul eder:

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

Kontrolsüz bir bileşen DOM üzerinde gerçeğin kaynağını koruduğundan, kontrolsüz bileşenleri kullanırken React ve React olmayan kodu entegre etmek bazen daha kolaydır. Ayrıca hızlı ve özensiz olmak istiyorsanız bu biraz daha az kod olabilir. Aksi takdirde, genellikle kontrollü bileşenler kullanmalısınız.

Eğer henüz belirli bir durum için hangi bileşen tipini kullanmanız gerektiğini bilmiyorsanız, [kontrollü ve kontrolsüz input'lara ilişkin bu makaleyi](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) faydalı bulabilirsiniz.

### Varsayılan Değerler {#default-values}

React render etme yaşam döngüsünde, form elemanlarında bulunan `value` niteliği, DOM içindeki değeri geçersiz kılar. Kontrolsüz bir bileşen ile, React'in başlangıç ​​değerini belirlemesini isteyebilir, ancak sonraki güncellemeleri kontrolsüz bırakmak isteyebilirsiniz. Bu durumda, `value` yerine `defaultValue` niteliğini belirtebilirsiniz. `defaultValue` değerini bileşen yüklendikten sonra değiştirmek, DOM içinde herhangi bir değer değişikliğine sebep olmayacaktır.

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
```

Aynı şekilde, `<input type="checkbox">` ve `<input type="radio">` `defaultChecked` niteliğini destekler, `<select>` ve `<textarea>` ise `defaultValue` niteliğini destekler.

## Dosya Girdisi Etiketi {#the-file-input-tag}

HTML'de, `<input type="file">` kullanıcının cihaz belleği üzerinden bir sunucuya yükleneceği veya JavaScript tarafından [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications) ile değiştirebileceği bir veya daha fazla dosya seçmesini sağlar.

```html
<input type="file" />
```

React'te, `<input type="file" />` her zaman kontrolsüz bir bileşendir, çünkü değeri yalnızca bir kullanıcı tarafından ayarlanabilir, programlanabilir bir biçimde olamaz.

Dosyalarla etkileşimde bulunmak için File API'ını kullanmalısınız. Aşağıdaki örnek, bir gönderme yöneticisi üzerinde bulunan dosyalara erişmek için [DOM node'una bir ref'in nasıl oluşturulacağı](/docs/refs-and-the-dom.html)nı gösterir:

`embed:uncontrolled-components/input-type-file.js`

**[CodePen'de Deneyin](codepen://uncontrolled-components/input-type-file)**

