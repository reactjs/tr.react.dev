---
title: Unknown Prop Uyarısı
layout: single
permalink: warnings/unknown-prop.html
---
React tarafından geçerli olarak kabul edilmeyen bir özelliğe sahip bir DOM öğesini oluşturmaya çalışırsanız, `unknown-prop` uyarısı etkinleşir. DOM öğelerinizin geçersiz özelliklerinin olmadığından emin olmalısınız.

Bu uyarının çıkmasının birkaç olası sebebi vardır:

1. `{...this.props}` ya da `cloneElement(element, this.props)` yapılarını mı kullanıyorsunuz? Bileşeniniz proplarını direkt olarak alt elemana aktarmaktadır. ([prop'ları aktarmak](/docs/transferring-props.html)). Prop'larınızı bir alt bileşene aktarırken, yanlışlıkla üst bileşen tarafından yorumlanması amaçlanan prop'ları iletmediğinizden emin olmalısınız.

2. Yerel bir DOM düğümünde, belki de özel verilerinizi temsil etmek için, standart olmayan bir DOM özelliği kullanıyorsunuz. Eğer standard bir DOM elemanına özel bir veriyi iliştirmek istiyorsanız, [MDN'de](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_data_attributes) açıklanmış olan özel veri niteliklerini (data attributes) kullanmayı düşünebilirsiniz.

3. React henüz belirttiğiniz özniteliği tanımıyor olabilir. Bu muhtemelen React'in gelecekteki bir sürümünde düzeltilecektir. Ancak, React şu anda tüm bilinmeyen öznitelikleri göz ardı etmektedir. Bu nedenle bunları React uygulamanızda kullanmanız render edilmesine neden olmayacaktır.

4. Bir React bileşenini ilk harfi büyük harf olmadan kullanıyor olabilirsiniz. Çünkü [JSX, küçük harf / büyük harf kuralını DOM etiketlerini ve kullanıcı tanımlı bileşenleri ayırt etmek için kullanır.](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized).

---

Bunu düzeltmek için, karmaşık bileşenlerin sadece karmaşık bileşenlere yönelik olan ve alt bileşenler için tasarlanmamış prop'ları kullanması gerekmektedir. Örneğin:

**Kötü:** Beklenmeyen `layout` prop'u `div` etiketine yönlendirilmiş.

```js
function MyDiv(props) {
  if (props.layout === 'horizontal') {
    // KÖTÜ! Çünkü "layout" un div etiketinin anlayabileceği bir prop olmadığını biliyorsunuz.
    return <div {...props} style={getHorizontalStyle()} />
  } else {
    // KÖTÜ! Çünkü "layout" un div etiketinin anlayabileceği bir prop olmadığını biliyorsunuz.
    return <div {...props} style={getVerticalStyle()} />
  }
}
```

<<<<<<< HEAD
**İyi:** Yayılma operatörü, değişkenleri propların içinden çıkarmak ve kalan propları başka bir değişkene koymak için kullanılabilir.
=======
**Good:** The spread syntax can be used to pull variables off props, and put the remaining props into a variable.
>>>>>>> 69bd27a3d558d6633e4f0adc61ecb8bb3d5f2edf

```js
function MyDiv(props) {
  const { layout, ...rest } = props
  if (layout === 'horizontal') {
    return <div {...rest} style={getHorizontalStyle()} />
  } else {
    return <div {...rest} style={getVerticalStyle()} />
  }
}
```

**İyi:** Ayrıca, propları yeni bir nesneye atayabilir ve kullanmadığınız değerleri yeni nesneden silebilirsiniz. Orijinal `props` nesnesinden prop'ları silmediğinizden emin olun, çünkü bu nesne değişmez (immutable) olarak düşünülmelidir.

```js
function MyDiv(props) {

  const divProps = Object.assign({}, props);
  delete divProps.layout;

  if (props.layout === 'horizontal') {
    return <div {...divProps} style={getHorizontalStyle()} />
  } else {
    return <div {...divProps} style={getVerticalStyle()} />
  }
}
```
