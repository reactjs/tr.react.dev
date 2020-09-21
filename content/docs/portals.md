---
id: portals
title: Portal'lar
permalink: docs/portals.html
---

Portal'lar, üst bileşenin DOM hiyerarşisinin dışında bulunan bir DOM düğümüne alt eleman render etmek için üstün bir yol sağlar.

```js
ReactDOM.createPortal(child, container)
```

İlk argüman (`child`) bir eleman, dize veya fragment gibi [render edilebilir herhangi bir React alt elemanıdır.](/docs/react-component.html#render) İkinci argüman (`container`) bir DOM elemanıdır.

## Kullanım {#usage}

Normal olarak, bir elemanı bir bileşenin render metodundan döndürdüğünüzde, En yakın üst düğümün alt elemanı olarak DOM'a yerleştirilir:

```js{4,6}
render() {
  // React yeni bir div oluşturur ve içine alt elemanları render eder
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

Bununla birlikte, bazen bir alt elemanı DOM üzerinde farklı bir yere yerleştirmek için kullanışlıdır:

```js{6}
render() {
  // React yeni bir div *oluşturmaz*. Alt elemanı `domNode` içine render eder.
  // `domNode` DOM üzerindeki konumuna bakılmaksızın, herhangi bir geçerli DOM düğümüdür.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

Portal'lar için tipik bir kullanım durumu, bir ana bileşenin `overflow: hidden` veya `z-index` stiline sahip olması, fakat alt elemanı kapsayıcısından görsel olarak "çıkarmanız" gerektiğindedir. Örneğin; dialog'lar, hovercard'lar ve tooltip'ler.

> Not:
>
> Portal'lar ile çalışırken, [klavye odağını yönetmenin](/docs/accessibility.html#programmatically-managing-focus) çok önemli olduğunu unutmayın.
>
> Modal dialog'ları için, [WAI-ARIA Modal Oluşturma Pratiklerine](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal) uygun şekilde herkesin onlarla etkileşim kurabildiğinden emin olun.

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/yzMaBd)

## Portal'lar Üzerinden Olay Kabarcıklandırma {#event-bubbling-through-portals}

Bir portal DOM ağacında herhangi bir yerde olsa bile, her şekilde normal bir React alt elemanı gibi davranır. Context gibi özellikler, alt elemanın bir portal olup olmadığına bakılmaksızın tam olarak aynı şekilde çalışır, çünkü portal *DOM ağacındaki* konumundan bağımsız olarak hala *React ağacında* bulunur.

Bu örnek olay kabarcıklandırma içerir. Bir portal'ın içinden tetiklenen bir olay, bu elemanlar *DOM ağacında* üst elemanı olmasa bile, içinde bulunduğu *React ağacındaki* üst elemanlara yayılır. Aşağıdaki HTML yapısını varsayarak:

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

`#app-root` içinde bulunan bir `Parent` bileşeni, kardeş eleman olan `#modal-root` üzerinden kabarcıklanan yakalanmamış bir olayı yakalayabilecek.

```js{28-31,42-49,53,61-63,70-71,74}
// Bu iki kapsayıcı DOM üzerinde kardeştir (yani yan yana bulunur)
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // Portal elemanı, Modal'ın alt elemanları
    // oluşturulduktan sonra DOM ağacına eklenir,
    // bu alt elemanların ayrı bir DOM düğümünde oluşturulduğu anlamına gelir.
    // Bir alt bileşen oluşturulduğunda çabucak DOM ağacına
    // bağlanmayı gerektirirse, örneğin DOM düğümünü ölçmek için,
    // veya üstten gelen bir 'autoFocus' kullanıyorsa,
    // Modal'a state ekleyin ve alt elemanları yalnızca
    // DOM ağacına Modal eklendiğinde render edin.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // Bu, Child içinde bulunan butona tıklandığında tetiklenir,
    // buton DOM üzerinde doğrudan üste bağlı olmamasına rağmen
    // Parent'in state'ini günceller.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Tıklama sayısı: {this.state.clicks}</p>
        <p>
          Butonun onClick yöneticisi ile
          birlikte div alt elemanı olmadığını
          gözlemlemek için tarayıcınızın
          geliştrici konsolunu açın.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // Bu butondaki click olayı en üst elemana kabarcıklanır (çıkar),
  // çünkü tanımlanmış bir 'onClick' özelliği yok
  return (
    <div className="modal">
      <button>Tıkla</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/jGBWpE)

Bir üst bileşende bir portal'dan kabarcıklanan bir olayı yakalamak, doğal olarak portal'lara bağımlı olmayan daha esnek soyutlamaların geliştirilmesine izin verir. Örneğin, bir `<Modal />` bileşeni render ederseniz, üst eleman portal'lar kullanılarak uygulanıp uygulanmadığına bakılmaksızın olaylarını yakalayabilir.