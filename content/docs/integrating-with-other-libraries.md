---
id: integrating-with-other-libraries
title: Integrating with Other Libraries
permalink: docs/integrating-with-other-libraries.html
---

React, herhangi bir web uygulamasında kullanılabilir. Diğer uygulamalara yerleştirilebilir ve biraz özenle React'e başka uygulamalar da yerleştirilebilir. Bu rehber, [jQuery](https://jquery.com/) ve [Backbone](https://backbonejs.org/) ile bütünleşmeye odaklanarak cok yaygın kullanım örneklerinin bazılarını inceleyecek, ancak aynı fikirler, bileşenleri varolan herhangi bir kodla bütünleştirme için de uygulanabilir.

## Integrating with DOM Manipulation Plugins {#integrating-with-dom-manipulation-plugins}

React, React dışında DOM'da yapılan değişikliklerin farkında değildir. Güncellemeleri kendi iç temsiline göre belirler, ve eğer aynı DOM düğümleri başka bir kütüphane tarafından değiştirilmişse, React şaşırır ve kurtarmak için hiçbir yolu yoktur.

Bu demek değildir ki, o imkansızdır veya DOM'u etkileyen diğer yollarla React'i birleştirmek gerekli olarak zor olsa bile, her birinin ne yaptığını dikkate almanız yeterlidir.

Çakışmaları önlemenin en kolay yolu, React bileşeninin güncellenmesini önlemektir. Bunu, boş bir `<div />` gibi React'in güncellemek için bir nedeni olmayan öğeleri oluşturarak yapabilirsiniz.

### How to Approach the Problem {#how-to-approach-the-problem}

Bunu göstermek için, genel bir jQuery eklentisi için bir sarmalayıcı çizelim.

Kök DOM öğesine bir [ref](/docs/refs-and-the-dom.html) ekleyeceğiz. `componentDidMount` içinde, jQuery eklentisine iletebilmemiz için ona bir referans alacağız.

Yığılmadan sonra, React'in DOM'a dokunmasını önlemek icin, `render()` yönteminden boş bir `<div />` döndüreceğiz.  `<div />` öğesinin herhangi bir özelliği veya alt öğesi yoktur, bu yüzden React'in onu güncellemek için bir nedeni yoktur, DOM'un bu bölümünü yönetmek için jQuery eklentisi serbest bırakılır:

```js{3,4,8,12}
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
```

Not edin ki, biz hem `componentDidMount` hem de `componentWillUnmount` [lifecycle methods](/docs/react-component.html#the-component-lifecycle)'i tanımladık. Birçok jQuery eklentisi, olay dinleyicilerini DOM'a ekler, bu nedenle onları `componentWillUnmount`'tan ayırmak önemlidir. Eğer eklenti düzeltme için bir yöntem sağlamıyorsa, muhtemelen hafıza sızıntılarını önlemek için eklentinin kaydettiği herhangi bir olay dinleyicisini kaldırmayı hatırlayarak kendi önleminizi almak zorunda olacaksınız. 

### Integrating with jQuery Chosen Plugin {#integrating-with-jquery-chosen-plugin}

Bu kavramların daha kesin bir örneği için, `<select>` girdileri arttırılmıs [Chosen](https://harvesthq.github.io/chosen/) eklentisi için küçük bir sarmalayıcı yazalım.

>**Not:**
>
>Bunun mümkün olması, React uygulamaları için en iyi yaklaşım olduğu anlamına gelmez. Biz, yapabildiğin zaman, seni React bileşenlerini kullanman için yüreklendiriyoruz. React uygulamalarında, React bileşenlerini yeniden kullanmak daha kolaydır, ve sıklıkla davranışları ve görünümleri üzerinde daha fazla kontrol sağlar.

Öncelikle, `Chosen`'ın DOM'a ne yaptığına bakalım.

Eğer bunu bir `<select>` DOM ​​düğümünde çağırırsanız, orijinal DOM düğümünün özniteliklerini okur, bir satır içi stil ile onu saklar, ve hemen `<select>`'ten sonra, kendi görsel temsili ile ayrı bir DOM düğümü ekler. Ardından, değişiklikleri bize bildirmek için jQuery olaylarını tetikler.

Diyelim ki, bu `<Chosen>` sarmalayıcı React bileşenimizle uğraştığımız API'dır:

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>vanilla</option>
      <option>chocolate</option>
      <option>strawberry</option>
    </Chosen>
  );
}
```

Sadelik için onu [uncontrolled component](/docs/uncontrolled-components.html) olarak uygulamaya koyacagız.

Önce, bir `<div>` içine sarılmış `<select>`'i döndürdüğümüz yerde, `render()` yöntemiyle boş bir bileşen oluşturacağız:

```js{4,5}
class Chosen extends React.Component {
  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

Fazladan bir `<div>` içinde `<select>`'i nasıl sardığımıza dikkat edin. Bu gereklidir çünkü Chosen, ona geçtiğimiz `<select>` düğümünün hemen arkasına başka bir DOM öğesi ekleyecektir. Ancak, React söz konusu olduğunda, `<div>`'in her zaman yalnızca tek bir alt öğesi vardır. Bu, React güncellemelerinin, Chosen tarafından eklenmis fazladan DOM düğümüyle çakışmamasını sağlama şeklimizdir.  Önemlidir ki, eğer DOM'u React akışının dışında değiştirirseniz, React'in bu DOM düğümlerine dokunmak için bir nedeni olmadığından emin olmalısınız.

Ardından, yaşam döngüsü yöntemlerini uygulayacağız. `componentDidMount`'de `<select>` düğümüne ref ile Chosen'i baslatmamız  ve `componentWillUnmount`'da parçalamamız gerek:

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen(); 
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/qmqeQx?editors=0010)

Not edin ki, React'in `this.el` alanına özel bir anlam atamaz. O sadece, öncesinde bu alana `render()` yöntemindeki bir `ref`'den atama yapılmış olduğunda çalışır:

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

Bu, bileşenimizin oluşturulması için yeterlidir, ama değer değişiklikleri hakkında da bilgilendirilmek istiyoruz. Bunu yapmak için, Chosen tarafından yönetilen `<select>` üzerindeki jQuery `change` olayına bağlanmak istiyoruz.

`this.props.onChange`'yi doğrudan Chosen'a geçmeyecegiz, çünkü bileşenin prop'u zamanla değişebilir, ve bu olay handler'i içerir. Bunun yerine, `this.props.onChange`'i çağıran bir `handleChange()` bildireceğiz, ve onu jQuery `change` olayına bağlayacağız:

```js{5,6,10,14-16}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();

  this.handleChange = this.handleChange.bind(this);
  this.$el.on('change', this.handleChange);
}

componentWillUnmount() {
  this.$el.off('change', this.handleChange);
  this.$el.chosen('destroy');
}

handleChange(e) {
  this.props.onChange(e.target.value);
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/bWgbeE?editors=0010)

Son olarak, yapılması gereken bir şey daha var. React'te, props zaman içinde değişir. Örneğin, ana bileşenin durumu değişirse, `<Chosen>` bileşeni,farklı alt öğeler alabilir. Bu, React'in DOM'u bizim için yönetmesine izin vermediğimizden, entegrasyon noktalarında, prop güncellemelerine yanıt olarak DOM'u manuel olarak güncellememizin önemli olduğu anlamına gelir. 

Chosen'in dökümantasyonu, orijinal DOM öğesine yapılan değişiklikler hakkında, jQuery `trigger ()` API'sını kullanabileceğimizi önerir. React'in `<select>` içindeki `this.props.children`'i güncellemesine izin vereceğiz, ancak Chosen'ı alt öğeler listesindeki değişiklikler hakkında bilgilendiren bir `componentDidUpdate()`'e yaşam döngüsü yöntemini de ekleyeceğiz: 

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

Bu şekilde Chosen, React tarafından yönetilen `<select>` alt öğeleri değiştiğinde DOM öğesini güncelleyeceğini bilecektir.

 `Chosen` bileşeninin tam uygulanması şu şekildedir:

```js
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }
  
  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## Integrating with Other View Libraries {#integrating-with-other-view-libraries}

React, diğer uygulamalara gömülebilir, [`ReactDOM.render()`](/docs/react-dom.html#render)'in esnekliğine teşekkür ediyoruz.

React, başlangıçta genellikle DOM'a tek bir kök React bileşeni yüklemek için kullanılsa da, `ReactDOM.render()` bir düğme kadar küçük veya bir uygulama kadar büyük olabilen UI'nin (Kullanıcı Arayüzü'nün) bağımsız bölümleri için bir çok kez çağrılabilir. 

Aslında, Facebook'ta React tam olarak böyle kullanılır. Bu, uygulamaları React'te parça parça yazmamızı sağlar, ve bunları mevcut sunucu tarafından oluşturulan şablonlarımız ve diğer client-side kod ile birleştirir.

### Replacing String-Based Rendering with React {#replacing-string-based-rendering-with-react}

Eski web uygulamalarındaki yaygın bir örnek, DOM parçalarını bir string olarak tanımlamak ve DOM'a şu şekilde eklemektir:  `$el.html(htmlString)`. Bir kod tabanındaki bu noktalar, React'i tanıtmak için mükemmeldir. Sadece string tabanlı oluşturmayı bir React bileşeni olarak yeniden yazın.

Takip eden JQuery uygulanması...

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function() {
  alert('Hello!');
});
```

...bir React bileşeni kullanılarak yeniden yazılabilir:

```js
function Button() {
  return <button id="btn">Say Hello</button>;
}

ReactDOM.render(
  <Button />,
  document.getElementById('container'),
  function() {
    $('#btn').click(function() {
      alert('Hello!');
    });
  }
);
```

Buradan bileşene daha fazla mantık taşımaya ve daha yaygın React uygulamalarını benimsemeye başlayabilirsiniz. Örneğin, bileşenlerde ID'lere güvenmemek en iyisidir çünkü aynı bileşen birden çok kez işlenebilir. Bunun yerine, [React event system](/docs/handling-events.html)'i kullanacağız ve click handler'i doğrudan React `<button>` öğesine kaydedin::

```js{2,6,9}
function Button(props) {
  return <button onClick={props.onClick}>Say Hello</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Hello!');
  }
  return <Button onClick={handleClick} />;
}

ReactDOM.render(
  <HelloButton />,
  document.getElementById('container')
);
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

İstediğiniz kadar çok sayıda yalıtılmış bileşeniniz olabilir ve bunları farklı DOM konteynerlerine işlemek için `ReactDOM.render ()`'i kullanabilirsiniz. Yavaş yavaş, uygulamanızı daha fazla React'e dönüştürdükçe, onları daha büyük bileşenlerde birleştirebilecek ve hiyerarşiyi çağıran `ReactDOM.render ()`'in bir kısmını taşıyabileceksiniz. 

### Embedding React in a Backbone View {#embedding-react-in-a-backbone-view}

[Backbone](https://backbonejs.org/) görünümleri, DOM öğelerinin içeriğini oluşturmak için tipik olarak HTML stringlerini ya da string üreten şablon fonksiyonları kullanır. Bu işlem de bir React bileşeni oluşturma ile değiştirilebilir.
 
Aşağıda, `ParagraphView` olarak bilinen bir Backbone  görünümü oluşturacağız. Bu bir React `<Paragraph>` bileşenini, Backbone (`this.el`) tarafından sunulan DOM öğesi oluşturmak için Backbone'nın `render()` fonksiyonun geçersiz kılar.

```js{1,5,8,12}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

`remove` yöntemindeki `ReactDOM.unmountComponentAtNode()`'ı da çağırmamız önemlidir. Böylece React, ayrıldığında bileşen ağacıyla ilişkili event handlers ve diğer kaynakların kaydını siler.

Bir bileşen bir React ağacının *içinden* kaldırıldığında, temizleme otomatik olarak gerçekleştirilir, ancak tüm ağacı elle kaldırdığımız için bu yöntemi çağırmalıyız.

## Integrating with Model Layers {#integrating-with-model-layers}

Genel olarak, [React state](/docs/lifting-state-up.html), [Flux](https://facebook.github.io/flux/), veya [Redux](https://redux.js.org/) gibi tek yönlü veri akışının kullanılması tavsiye edilirken, React bileşenleri, diğer framework ve kütüphanelerden bir model katmanı kullanabilir.

### Using Backbone Models in React Components {#using-backbone-models-in-react-components}

Bir React bileşeninden [Backbone](https://backbonejs.org/) modeller ve koleksiyonlarını tüketmenin en basit yolu, çeşitli değişim olaylarını dinlemek ve manuel olarak bir güncellemeyi zorlamaktır.

Koleksiyonların oluşturulmasından sorumlu bileşenler `'add'` ve `'remove'` olaylarını dinlerken, modellerin oluşturulmasından sorumlu bileşenler, `'change'` olaylarını dinleyecektir. Her iki durumda da bileşeni, yeni verilerle yeniden işlemek için [`this.forceUpdate()`](/docs/react-component.html#forceupdate) metodunu çağırın.

Aşağıdaki örnekte, `List` bileşeni, tekli öğeleri işlemek için, `Item` bileşenini kullanarak bir Backbone koleksiyonu oluşturur.

```js{1,7-9,12,16,24,30-32,35,39,46}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/GmrREm?editors=0010)

### Extracting Data from Backbone Models {#extracting-data-from-backbone-models}

Yukarıdaki yaklaşım, React bileşenlerinizin Backbone modelleri ve koleksiyonlarının farkında olmasını gerektirir. Eğer daha sonra başka bir veri yönetimi çözümüne geçmeyi planlıyorsanız, Backbone hakkındaki bilgileri kodun olabildiğince az bölümüne yoğunlaştırmak isteyebilirsiniz.

 Buna çözüm olarak, her ne zaman değiştirse, modelin özniteliklerini düz veri olarak çıkarmak ve bu mantığı tek bir yerde tutmaktır. Aşagıdakiler bir Backbone modelinin tüm özniteliklerini duruma çıkaran, verileri sarılmış bileşene ileten [üst düzey bileşenler ](/docs/higher-order-components.html)'dir.

Bu şekilde, sadece üst düzey bileşenin Backbone model içselleri hakkında bilmeye gereksinim duyar ve uygulamadaki bir çok bileşen Backbone'dan bağımsız kalabilir.

Aşağıdaki örnekte, ilk durumu oluşturmak için modelin özniteliklerinin bir kopyasını yapacağız.  `change` etkinliğine bağlanıyoruz (ve unmounting üyeliğinden çıkıyoruz), ve bu olduğunda, durumu modelin mevcut öznitelikleriyle güncelleriz. Son olarak, eğer `model` prop kendisi değişirse, eski model aboneliğinden çıkmayı ve yenisine abone olmayı unutmadığımızdan emin olalım.

Not edin ki, bu örnek, Backbone ile çalışmaya ilişkin olarak geniş kapsamli değildir. Ama bu size genel bir şekilde buna nasıl yaklaşılacağına dair bir fikir vermelidir:

```js{1,5,10,14,16,17,22,26,32}
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
```

Bunun nasıl kullanıldığını göstermek için, Backbone modeline bir `NameInput` React bileşeni bağlayacağız, ve giriş değiştiğinde "firstName" niteliğini güncelleyceğiz: 

```js{4,6,11,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      My name is {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    props.model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
ReactDOM.render(
  <Example model={model} />,
  document.getElementById('root')
);
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

Bu teknik Backbone'a limitli değildir. React'i her hangi bir model kütüphanesi ile yaşam döngüsü yöntemlerindeki değişikliklere abone olarak, tercihen, veriyi yerel React state'te kopyalayarak kullanabilirsiniz. 
