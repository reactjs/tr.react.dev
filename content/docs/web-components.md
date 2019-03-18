---
id: web-components
title: Web Bileşenleri
permalink: docs/web-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React ve [Web Bileşenleri](https://developer.mozilla.org/en-US/docs/Web/Web_Components) farklı sorunları çözmek için oluşturulmuştur. React, DOM ile verilerinizi senkronize eden bir bildirimsel kitaplık sunarken, Web Bileşenleri yeniden kullanılabilir bileşenler için güçlü bir kapsülleme sağlar. İkisinin de amaçları birbirini tamamlar. Bir geliştirici olarak, Web Bileşenleri'nde React'i, React'te Web Bileşenleri'ni veya her ikisini de kullanmakta serbestsiniz.

React kullanan çoğu kişi Web Bileşenleri'ni kullanmaz, ancak özellikle Web Bileşenleri kullanılarak yazılmış üçüncü-taraf UI bileşenleri kullanıyorsanız kullanmak isteyebilirsiniz.

## Web Bileşenleri'ni React'te Kullanmak {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Hello <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> Not:
>
> Web Bileşenleri çoğu zaman zorunlu bir API ortaya çıkarır. Örneğin, bir `video` Web Bileşeni `play()` ve `pause()` fonksiyonlarını ortaya çıkarabilir. Bir Web Bileşeni'nin zorunlu API'lerine erişmek için DOM düğümüyle doğrudan etkileşimde bulunmak için bir ref kullanmanız gerekir. Üçüncü-taraf Web Bileşenleri kullanıyorsanız, en iyi çözüm Web Bileşeni'niz için sarıcı olarak çalışacak bir React bileşeni yazmaktır.
>
> Bir Web Bileşeni tarafından yayınlanan olaylar, React render ağacı boyunca uygun bir şekilde yayılmayabilir.
> Bu olayları React bileşenleriniz içerisinde yönetmek için olay yöneticilerini el ile eklemeniz gerekir.

Yaygın karışıklıklardan biri, Web Bileşenleri'nin "className" yerine "class" kullanmasıdır.

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>front</div>
      <div>back</div>
    </brick-flipbox>
  );
}
```

## React'i Web Bileşenleri'nizde Kullanmak {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

> Not:
>
> Sınıfları Babel ile dönüştürürseniz, bu kod **çalışmayacaktır**. Sorun için [bu konuya](https://github.com/w3c/webcomponents/issues/587) bakınız.
> Bu sorunu düzeltmek için web bileşenlerinizi yüklemeden önce [custom-elements-es5-adapter](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs) ekleyin.
