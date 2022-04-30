---
id: integrating-with-other-libraries
title: Integrating with Other Libraries
permalink: docs/integrating-with-other-libraries.html
---

React, herhangi bir web uygulamasında kullanılabilir. Diğer uygulamalara yerleştirilebilir ve biraz özenle React'e başka uygulamalar da yerleştirilebilir. Bu rehber, [jQuery](https://jquery.com/) ve [Backbone](https://backbonejs.org/) ile bütünleşmeye odaklanarak çok yaygın kullanım örneklerinin bazılarını inceleyecek, ancak aynı fikirler, bileşenleri varolan herhangi bir kodla bütünleştirmek için de uygulanabilir.

## DOM Manipülasyon Eklentileri ile Bütünleşmek {#integrating-with-dom-manipulation-plugins}

React, React dışında DOM'a yapılan değişikliklerin farkında değildir. Güncellemeleri kendi iç temsiline göre belirler, ve eğer aynı DOM düğümleri başka bir kütüphane tarafından değiştirilmişse, React'in kafası karışır ve bunu kurtarmanın yolu yoktur.

Bu, React'i DOM'u değistirmenin diğer yollarıyla birlikte kullanmanın imkansız veya zor olduğu anlamına gelmez. Sadece hangisinin ne yaptığına dikkat etmeniz gerekir.

Çakışmaları önlemenin en kolay yolu, React bileşeninin güncellenmesini önlemektir. Bunu, boş bir `<div />` gibi React'in güncellemek için bir nedeni olmayan öğelerini oluşturarak yapabilirsiniz.

### Soruna Nasıl Yaklaşılmalı {#how-to-approach-the-problem}

Bunu göstermek için, genel bir jQuery eklentisi için bir sarmalayıcı tasarlayalım.

Kök DOM öğesine bir [ref](/docs/refs-and-the-dom.html) ekleyeceğiz. `componentDidMount` içinde, jQuery eklentisine iletebilmemiz için ona bir referans alacağız.

Monte edildikten sonra, React'in DOM'a dokunmasını önlemek icin, `render()` metodundan boş bir `<div />` döndüreceğiz. `<div />` öğesinin herhangi bir özelliği veya alt öğesi yoktur, bu yüzden React'in onu güncellemek için bir nedeni yoktur, DOM'un bu bölümünü yönetmek için jQuery eklentisi serbest bırakılır:

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

Hem `componentDidMount` hem de `componentWillUnmount` [yaşam döngüsü metotları](/docs/react-component.html#the-component-lifecycle)'nı tanımladığımıza dikkat edin. Birçok jQuery eklentisi, olay dinleyicilerini DOM'a ekler, bu nedenle onları `componentWillUnmount`'tan ayırmak önemlidir. Eğer eklenti temizlik için bir metot sağlamıyorsa, muhtemelen bellek sızıntılarını önlemek için eklentinin kaydettiği herhangi bir olay dinleyicisini kaldırmayı hatırlayarak, kendi önleminizi almak zorunda olacaksınız. 

###  jQuery Chosen Eklentisi ile Bütünleşmek {#integrating-with-jquery-chosen-plugin}

Bu kavramların daha kesin bir örneği için, `<select>` girdilerini genişleten [Chosen](https://harvesthq.github.io/chosen/) eklentisi için küçük bir sarmalayıcı yazalım.

>**Not:**
>
>Bunun mümkün olması demek, React uygulamaları için en iyi yaklaşım olduğu anlamına gelmez. Mümkün olduğunda React bileşenlerini kullanmanızı öneririz. React uygulamalarında, React bileşenlerini yeniden kullanmak daha kolaydır, ve genellikle davranışları ve görünümleri üzerinde daha fazla kontrol sağlar.

Öncelikle, `Chosen`'ın DOM'a ne yaptığına bakalım.

Eğer bunu bir `<select>` DOM ​​düğümünde çağırırsanız, orijinal DOM düğümünün niteliklerini okur, bir satır içi stil ile onu saklar, ve hemen `<select>`'ten sonra, kendi görsel temsili ile ayrı bir DOM düğümü ekler. Ardından, değişiklikleri bize bildirmek için jQuery olaylarını tetikler.

Diyelim ki, bu `<Chosen>` sarmalayıcısı, React bileşenimizle uğraştığımız API'dır:

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

Basit olması için onu [kontrolsüz bileşen](/docs/uncontrolled-components.html) olarak uygulayacağız.

İlk önce, bir `<div>` içine sarılmış `<select>`'i döndürdüğümüz yerde, `render()` metoduyla boş bir bileşen oluşturacağız:

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

Fazladan bir `<div>` içinde `<select>`'i nasıl sardığımıza dikkat edin. Bu gereklidir, çünkü Chosen, ona geçtiğimiz `<select>` düğümünün hemen arkasına başka bir DOM öğesi ekleyecektir. Ancak, React söz konusu olduğunda, `<div>`'in her zaman yalnızca tek bir alt öğesi vardır. Bu, React güncellemelerinin, Chosen tarafından eklenmiş fazladan DOM düğümüyle çakışmamasını sağlama şeklimizdir. Önemlidir ki, eğer DOM'u React akışının dışında değiştirirseniz, React'in bu DOM düğümlerine dokunmak için bir nedeni olmadığından emin olmalısınız.

Ardından, yaşam döngüsü metodunu uygulayacağız. `componentDidMount`'de `<select>` düğümüne ref ile Chosen'i başlatmamız ve `componentWillUnmount`'da parçalamamız gerek:

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

Dikkat edin ki, React `this.el` alanına özel bir anlam atamaz. O sadece, öncesinde bu alana `render()` metodundaki bir `ref`'den atama yapılmış olduğunda çalışır:

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

Bu, bileşenimizin oluşturulması için yeterlidir, ama değer değişiklikleri hakkında da bilgilendirilmek istiyoruz. Bunu yapmak için, Chosen tarafından yönetilen `<select>` üzerindeki jQuery `change` olayına abone olacağız.

`this.props.onChange`'i doğrudan Chosen'a geçmeyecegiz, çünkü bileşenin prop'u zamanla değişebilir, ve bu olay yöneticisini içerir. Bunun yerine, `this.props.onChange`'i çağıran bir `handleChange()` metodu tanımlayacağız, ve onu jQuery `change` olayına abone olacağız:

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

Son olarak, yapılması gereken bir şey daha var. React'te, props zaman içinde değişir. Örneğin, ana bileşenin durumu değişirse, `<Chosen>` bileşeni, farklı alt öğeler alabilir. Bu, React'in DOM'u bizim için yönetmesine izin vermediğimizden, bütünleşme noktalarında, prop güncellemelerine yanıt olarak DOM'u manuel olarak güncellememizin önemli olduğu anlamına gelir. 

Chosen'in dokümantasyonu, orijinal DOM öğesine yapılan değişiklikler hakkında, jQuery `trigger ()` API'ını kullanabileceğimizi önerir. React'in `<select>` içindeki `this.props.children`'i güncellemesine izin vereceğiz, ancak Chosen'ı alt öğeler listesindeki değişiklikler hakkında bilgilendiren bir `componentDidUpdate()`'e yaşam döngüsü yöntemini de ekleyeceğiz: 

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

## Diğer Görünüm Kütüphaneleri ile Bütünleşmek {#integrating-with-other-view-libraries}

React, diğer uygulamalara [`createRoot()`](/docs/react-dom-client.html#createRoot)'un esnekliği sayesinde gömülebilir.

React, başlangıçta genellikle DOM'a tek bir kök React bileşeni yüklemek için kullanılsa da, `root.render()` bir buton kadar küçük veya bir uygulama kadar büyük olabilen UI'ın (Kullanıcı Arayüzü'nün) bağımsız bölümleri için bir çok kez çağrılabilir.

Aslında, Facebook'ta React tam olarak böyle kullanılır. Bu, uygulamaları React'te parça parça yazmamızı sağlar, ve bunları mevcut sunucu tarafından oluşturulan şablonlarımız ve diğer istemci-taraf (client-side) kod ile birleştirir.

### String-Tabanlı Render'i React ile Değiştirme {#replacing-string-based-rendering-with-react}

Eski web uygulamalarındaki yaygın bir örnek, DOM parçalarını bir string olarak tanımlamak ve DOM'a şu şekilde eklemektir: `$el.html(htmlString)`. Bir kod tabanındaki bu noktalar, React'i tanıtmak için mükemmeldir. Sadece string tabanlı oluşturmayı, bir React bileşeni olarak yeniden yazın.

Aşağıdaki JQuery uygulanması....

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

$('#btn').click(function() {
  alert('Hello!');
});
```

Buradan bileşene daha fazla mantık taşımaya ve daha yaygın React uygulamalarını benimsemeye başlayabilirsiniz. Örneğin, bileşenlerde ID'lere güvenmemek en iyisidir. Çünkü aynı bileşen birden çok kez işlenebilir. Bunun yerine, [React olay sistemi](/docs/handling-events.html)'ni kullanacağız ve tıklama olayını doğrudan React `<button>` öğesine kaydedeceğiz:

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
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

İstediğiniz kadar çok sayıda izole edilmiş bileşeniniz olabilir ve bunları farklı DOM konteynerlerine işlemek için `ReactDOM.createRoot()`'u kullanabilirsiniz. Yavaş yavaş, uygulamanızı daha fazla React'e dönüştürdükçe, onları daha büyük bileşenlerde birleştirebilecek ve hiyerarşiyi çağıran `ReactDOM.createRoot()`'un bir kısmını taşıyabileceksiniz.

### Bir Backbone Görünümüne React'ı Gömmek{#embedding-react-in-a-backbone-view}

[Backbone](https://backbonejs.org/) görünümleri, DOM öğelerinin içeriğini oluşturmak için tipik olarak HTML stringlerini ya da string üreten şablon fonksiyonlarını kullanır. Bu işlem de bir React bileşeni oluşturma ile değiştirilebilir.

Aşağıda, `ParagraphView` olarak bilinen bir Backbone görünümü oluşturacağız. Bu bir React `<Paragraph>` bileşenini, Backbone (`this.el`) tarafından sunulan DOM öğesi oluşturmak için Backbone'nın `render()` fonksiyonun geçersiz kılar. Burada da [`ReactDOM.createRoot()`](/docs/react-dom-client.html#createroot) kullanıyoruz:

```js{1,5,8-9,13}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    this.root = ReactDOM.createRoot(this.el);
    this.root.render(<Paragraph text={text} />);
    return this;
  },
  remove() {
    this.root.unmount();
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

`remove` metodundaki `root.unmount()`'ı da çağırmamız önemlidir. Böylece React, ayrıldığında bileşen ağacıyla ilişkili olay yöneticilerini  ve diğer kaynakların kaydını siler.

Bir bileşen bir React ağacının *içinden* kaldırıldığında, temizleme otomatik olarak gerçekleştirilir, ancak tüm ağacı elle kaldırdığımız için bu metodu çağırmalıyız.

## Model Katmanları ile Bütünleşmek{#integrating-with-model-layers}

Genel olarak, [React state](/docs/lifting-state-up.html), [Flux](https://facebook.github.io/flux/), veya [Redux](https://redux.js.org/) gibi tek yönlü veri akışının kullanılması tavsiye edilirken, React bileşenleri, diğer çatı ve kütüphanelerden bir model katmanı kullanabilir.

### React Bileşenlerinde Backbone Modellerini Kullanmak{#using-backbone-models-in-react-components}

Bir React bileşeninden [Backbone](https://backbonejs.org/) modellerini ve koleksiyonlarını kullanmanın en basit yolu, çeşitli değişim olaylarını dinlemek ve manuel olarak bir güncellemeyi zorlamaktır.

Koleksiyonların oluşturulmasından sorumlu bileşenler `'add'` ve `'remove'` olaylarını dinlerken, modellerin oluşturulmasından sorumlu bileşenler, `'change'` olaylarını dinleyecektir. Her iki durumda da bileşeni, yeni verilerle yeniden işlemek için [`this.forceUpdate()`](/docs/react-component.html#forceupdate) metodunu çağırın. 

Aşağıdaki örnekte, `List` bileşeni, tekil öğeleri işlemek için, `Item` bileşenini kullanarak bir Backbone koleksiyonu oluşturur.

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

### Backbone Modellerinden Veriyi Çıkarmak{#extracting-data-from-backbone-models}

Yukarıdaki yaklaşım, React bileşenlerinizin Backbone modelleri ve koleksiyonlarının farkında olmasını gerektirir. Eğer daha sonra, başka bir veri yönetimi çözümüne geçmeyi planlıyorsanız, Backbone hakkındaki bilgileri kodun olabildiğince az bölümüne yoğunlaştırmak isteyebilirsiniz.

 Buna çözüm, her değiştiğinde modelin niteliklerini düz veri olarak çıkarmak ve bu mantığı tek bir yerde tutmaktır. Aşağıdakiler bir Backbone modelinin tüm niteliklerini state'e çıkaran, verileri sarılmış bileşene ileten [üst düzey bir bileşen](/docs/higher-order-components.html)'dir.

Bu şekilde, sadece üst düzey bileşen Backbone model içeriği hakkında bilgiye gereksinim duyar ve uygulamadaki bir çok bileşen Backbone'dan bağımsız kalabilir.

Aşağıdaki örnekte, ilk state'i oluşturmak için modelin niteliklerinin bir kopyasını yapacağız. `change` olayına bağlanıyoruz (ve unmounting aboneliğinden çıkıyoruz), ve bu olduğunda, state'i modelin mevcut nitelikleriyle güncelleriz. Son olarak, eğer `model` prop'unun kendisi değişirse, eski model aboneliğinden çıkmayı ve yenisine abone olmayı unutmadığımızdan emin olalım.

Dikkat edin ki, bu örnek, Backbone ile çalışmaya ilişkin olarak geniş kapsamlı değildir. Ama bu size genel bir şekilde buna nasıl yaklaşılacağına dair bir fikir vermelidir:

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

Bunun nasıl kullanıldığını göstermek için, Backbone modeline bir `NameInput` React bileşeni bağlayacağız, ve giriş değiştiğinde "firstName" özelliğini güncelleyeceğiz: 

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
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Example model={model} />);
```

[**CodePen'de Deneyin**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

Bu teknik, Backbone ile limitli değildir. React'i her hangi bir model kütüphanesi ile yaşam döngüsü metotlarındaki değişikliklere abone olarak, tercihen, veriyi yerel React state'e kopyalayarak kullanabilirsiniz. 
