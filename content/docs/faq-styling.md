---
id: faq-styling
title: Tasarım ve CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### Bileşenlere CSS sınıflarını nasıl eklerim? {#how-do-i-add-css-classes-to-components}

Sınıfları `className` prop’una string olarak ekleyin:

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

CSS sınıflarının, bileşenin prop'larına veya stateine bağlı olması yaygındır:

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>İpucu
>
>Kendinizi sık sık böyle bir kod yazarken buluyorsanız, [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) paketi bunu basitleştirebilir.

### Satır içi (inline) stilleri kullanabilir miyim? {#can-i-use-inline-styles}

Evet, stillendirme ile ilgili dokümana [buradan](/docs/dom-elements.html#style) bakın.

### Satır içi (inline) stiller kötü mü? {#are-inline-styles-bad}

CSS sınıfları, performans açısından genellikle satır içi stillerinden daha iyidir.

### JS-içinde-CSS (CSS-in-JS) nedir? {#what-is-css-in-js}

"JS-içinde-CSS", CSS'in harici dosyalarda tanımlanması yerine, JavaScript kullanılarak oluşturulduğu bir deseni belirtir.

_Bu işlevin React'in bir parçası olmadığını, ancak üçüncü parti kütüphaneler tarafından sağlandığını unutmayın._ React, stillerin nasıl tanımlandığı hakkında bir görüşe sahip değildir; şüpheniz varsa, stillerinizi her zamanki gibi ayrı bir `*.css` dosyasında tanımlamak ve [`className`](/docs/dom-elements.html#classname) kullanarak bunlara erişmek iyi bir başlangıç noktasıdır.

### React'te animasyon yapabilir miyim? {#can-i-do-animations-in-react}

<<<<<<< HEAD
React, animasyonlara güç vermek için kullanılabilir. Örneğin, [React Transition Group](https://reactcommunity.org/react-transition-group/), [React Motion](https://github.com/chenglou/react-motion) veya [React Spring](https://github.com/react-spring/react-spring) 'e bakabilirsiniz.
=======
React can be used to power animations. See [React Transition Group](https://reactcommunity.org/react-transition-group/), [React Motion](https://github.com/chenglou/react-motion), [React Spring](https://github.com/react-spring/react-spring), or [Framer Motion](https://framer.com/motion), for example.
>>>>>>> 014f4890dc30a3946c63f83b06883241ddc9bc75
