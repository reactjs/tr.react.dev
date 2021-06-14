---
id: higher-order-components
title: Higher-Order Components
permalink: docs/higher-order-components.html
---

Bir üst-seviye bileşen (İngilizcesi Higher-Order Component - HOC) React'te bileşen mantığının tekrar kullanılmasına yarayan ileri düzey bir tekniktir. HOC'lar React API'nın bir parçası değildir aslında. React'ın bileşen tümleyici doğasından doğan bir modeldir.

Daha açıklayıcı olmak gerekirse, **bir üst-seviye bileşen; parametre olarak bir bileşen alıp output olarak yeni bir bileşen döndüren bir fonksiyondur.**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Bir bileşen; proplarını kullanıcı arayüzüne çevirirken, üst-seviye bir bileşen başka bir bileşeni alıp farklı bir bileşene çevirir.

HOC'lar Redux'un [`connect`](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect) ve Relay'in [`createFragmentContainer`](https://relay.dev/docs/v10.1.3/fragment-container/#createfragmentcontainer) gibi üçüncü taraf React kütüphanelerinde yaygındır.

Bu dokümanda neden üst-seviye bileşenlerin kullanışlı olduğunu tartışıp, bunları nasıl yazabileceğiniz hakkında konuşacağız.

## HOC'ları Uygulama Genelindeki Sorunlar için Kullanın {#use-hocs-for-cross-cutting-concerns}


>**Not**
>
>Daha önce uygulama genelindeki sorunlar için mixin'lerin kullanılmasını önermiştik. Fakat o zamandan beri fark ettik ki, mixin'ler yarardan çok zarara yol açıyor. Mixin'lerden neden uzaklaştığımız konusunda ve nasıl varolan bileşenlerinizi mixin'lerden geçirebileceğiniz hakkında daha fazla bilgiye [buradan](/blog/2016/07/13/mixins-considered-harmful.html) ulaşabilirsiniz.

Bileşenler React’te yeniden kod kullanımının temel birimidir. Fakat, bazı davranışların alışılageldik bileşenlerle kullanılmaya uygun olmadığını göreceksiniz.

Örneğin, `CommentList` diye bir dış data kaynağına bağlanan bir bileşeniniz olduğunu varsayalım.

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" is some global data source
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Subscribe to changes
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Clean up listener
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Update component state whenever the data source changes
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

Sonra, benzer bir davranış sergileyen, tek bir blog gönderisine bağlanan bir bileşen yazıyorsunuz.

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList` ve `BlogPost` birebir aynı değil - `DataSource`'da farklı methodlar çağırıyorlar ve farklı çıktılar renderlıyorlar. Fakat, kodlamasının çoğu aynı:

- Yükleme (mount) sırasında `DataSource`'a bir değişken dinleyici eklemek.
- Dinleyicinin içinde, data kaynağı değiştiğinde `setState`'i çağırmak
- Unmount'da, değişken dinleyiciyi kaldırmak.

Büyük bir uygulamada, bu `DataSource`'a bağlanan ve `setState`'i çağıran davranışın sürekli tekrarlanacağını hayal edebilirsiniz. Fakat bizim istediğimiz şey bu davranışı somutlaştırmak ve bu davranışı tek bir yerde birden fazla bileşen arasında paylaşmak. İşte bu gibi durumlarda Üst-seviye bileşenler işimize yarıyor.

`CommentList` ve `BlogPost` gibi `DataSource`'a bağlanacak bileşenleri üretecek bir fonksiyon yazabiliriz. Foknsiyon arguman olarak, elde edilen datayı prop olarak alan bir alt eleman alacak. Fonksiyonun adını `withSubscription` koyalım.

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

İlk parametre kaplanan bileşen. İkinci parametre is `DataSource` ve anlık propları aldığı zaman ilgilendiğimiz datayı çekiyor.

`CommentListWithSubscription` ve `BlogPostWithSubscription` render edildiğinde `CommentList` ve `BlogPost`'a bir `data` propu gelecek ve bu data'da `DataSource`'tan çekilen en gücel data bulunacak.

```js
// This function takes a component...
function withSubscription(WrappedComponent, selectData) {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

Bir HOC'un input bileşenini değiştirmediğini ve davranışı kopyalamak için inheritance kullanmadığına dikkat ediniz. Bunun yerine; HOC, orjinal bileşeni bir container içine alarak bu bileşeni yaratır. Bir HOC yan etkisi olmayan saf bir fonksiyondur.

İşte bu kadar! Kapsanan bileşen, kapsayan bileşenin bütün proplarını alır ayrıca output'unu render etmek için yeni bir prop olan `data`'yı alır. Data'nın neden veya nasıl kullanıldığı HOC'u ilgilendirmez ve kapsanan bileşen de data'nın nereden geldiğiyle ilgilenmez.

`withSubscription` normal bir fonksiyon olduğundan, istediğiniz kadar arguman ekleyebilirsiniz. Örneğin, `data` prop ismini değiştirilebilir yapmak isteyebilirsiniz, bu sayede HOC ve kapsanan bileşen birbirinden daha ayrık bir hale gelecektir. Ya da `shouldComponentUpdate`'i veya data kaynağını ayarlayan bir arguman alabilirsiniz. Bunların mümkün olmasının sebebi ise HOC'un bileşenin nasıl tanımlandığı üzerinde tam kontrole sahip olmasıdır.

Bileşenlerde olduğu gibi, `withSubscription` ile kapsanan bileşen arasındaki bağlantı tamamen proplar üzerindendir. Bu da kapsanan bileşene aynı propları sağladıkları sürece bir HOC'u başka bir HOC'la değiştirmeyi kolaylaştırır. Eğer data almanıza yarayan kütüphaneleri kullanırsanız bu değişkenlik işinize yarayabilir.

## Orijinal Bileşeni Değiştirmeyin. Composition Kullanın. {#dont-mutate-the-original-component-use-composition}

HOC içerisinde bileşenin prototipini değiştirmemeye çalışın.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentDidUpdate = function(prevProps) {
    console.log('Current props: ', this.props);
    console.log('Previous props: ', prevProps);
  };
  // The fact that we're returning the original input is a hint that it has
  // been mutated.
  return InputComponent;
}

// EnhancedComponent will log whenever props are received
const EnhancedComponent = logProps(InputComponent);
```

Bununla alakalı bir kaç problem var. Birincisi, girdi olarak kullanılan bileşen geliştirilmiş bileşenden ayrı olarak yeniden kullanılamaz. Daha önemlisi, `EnchancedComponent`'e başka bir HOC uygularsanız, o da `componentDidUpdate`'i değiştirecektir; ilk HOC’un fonksiyonalitesi kaybolacaktır. Ayrıca bu HOC, yaşam döngüsü methodları içermedikleri için, fonksiyonel bileşenlerle çalışmayacaktır.

HOC’ları değiştirmek sıkıntılı bir soyutlama yöntemidir— kodu kullanacak kişinin bunların nasıl kodlandığını bilmesi gerekiyor, yoksa diğer HOC’larla sıkıntı yaşayabilir.

HOC'lar, datayi degistirmek yerine girdi bileşenini bir kapsayıcı bileşene sararak bileşim (composition) yontemini kullanmalıdır.

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props: ', this.props);
      console.log('Previous props: ', prevProps);
    }
    render() {
      // Wraps the input component in a container, without mutating it. Good!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

Bu HOC degistiren versiyonla aynı islevsellige sahiptir ve bunu yaparken de potansiyel sıkıntılardan da kacinmaktadir. Aynı zamanda hem class bileşenlerle hem fonksiyonel bileşenlerle aynı şekilde iyi çalışıyor. Ayrıca saf bir fonksiyon olduğu için kendisi de dahil diğer HOC’larla çalışabilir durumda.

HOC’ların ve **kapsayıcı bileşenler (container components)** adlı bir teknik arasında bir kaç benzerlik fark etmiş olabilirsiniz. Kapsayıcı bileşenler üst ve alt seviyeyle alakalı sorumluluğu birbirinden ayrımaya yarayan bir stratejidir. Container’lar olayları dinlemek, state ve propların bileşenler arasında yollanması gibi UI’yla alakalı olaylarla ilgilenirler. HOC’lar ise container’ları kendilerini hayata geçirmekte kullanırlar. HOC’ları, parametrize edilmiş bileşen tanımları gibi düşünebilirsiniz.

## Kural: Alakasız Propları Kapsanan Bileşen Üzerinden Geçirin {#convention-pass-unrelated-props-through-to-the-wrapped-component}

HOC’lar bileşenlere yeni özellikler eklerler. Ama genel olarak yaptığı işleri çok fazla değiştirmemeleri gerekir. HOC’tan dönen bir bileşenin, kapsanan bileşenle benzer bir interface’e sahip olması beklenir.

HOC’lar kendileriyle alakası olmayan propları da geçirmelidirler. Çoğu HOC şu tarz bir render metoduna sahiptir:

```js
render() {
  // Filter out extra props that are specific to this HOC and shouldn't be
  // passed through
  const { extraProp, ...passThroughProps } = this.props;

  // Inject props into the wrapped component. These are usually state values or
  // instance methods.
  const injectedProp = someStateOrInstanceMethod;

  // Pass props to wrapped component
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

Bu kural HOC’ların yeterince değişken ve yeniden kullanılabilir olmasını sağlar.

## Kural: Composability'yi En Üst Seviyeye Çıkartmak {#convention-maximizing-composability}

Tüm HOC’lar aynı gözükmez. Bazen sadece bir argüman aldıkları da olur, bu da kapsanan bileşendir:

```js
const NavbarWithRouter = withRouter(Navbar);
```

Genellike HOC’lar başka argüman da alırlar. Relay’den alınan bu örnekte, bir config objesi bileşenin data bağımlılıklarını tanımlamak için kullanılıyor.

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

HOC’ların en yaygın kullanım şekli şuna benzer:

```js
// React Redux's `connect`
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

*Nasıl?!* Eğer ayrıştırırsanız görmesi daha kolay olur.

```js
// connect is a function that returns another function
const enhance = connect(commentListSelector, commentListActions);
// The returned function is a HOC, which returns a component that is connected
// to the Redux store
const ConnectedComment = enhance(CommentList);
```
Diğer bir deyişle, `connect` üst-seviye bileşen döndüren bir üst-seviye fonksiyondur!

Bu şekil karmaşık ve gereksiz gözükebilir, ama işe yarayan bir özelliği var. `connect` tarafından döndürülen HOC’lar şöyle bir kullanıma sahiptir `Component => Component`. Girdisi ve çıktısı aynı olan fonksiyonların birbirleriyle kullanımı çok kolaydır.

```js
// Instead of doing this...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... you can use a function composition utility
// compose(f, g, h) is the same as (...args) => f(g(h(...args)))
const enhance = compose(
  // These are both single-argument HOCs
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(Ayrıca bu özellik `connect` ve diğer geliştirme özellikli HOC’ların decorator olarak kullanılmasını da sağlar, decorator deneysel bir JavaScript önerisidir)

`compose` fonksiyonu ana bir özelliği olmasa da kullanışlı olması açısından bir çok 3. Parti kütüphaneleri tarafından kullanılır, bunların içinde lodash([`lodash.flowRight`](https://lodash.com/docs/#flowRight) olarak), [Redux](https://redux.js.org/api/compose) ve [Ramda](https://ramdajs.com/docs/#compose) da bulunur.

## Kural: Kolay Debug Etmek için Gösterilen Adı Kapsayın {#convention-wrap-the-display-name-for-easy-debugging}

HOC’lar tarafından yaratılan kapsayan bileşenler, diğer bileşenler gibi [React Developer Tools](https://github.com/facebook/react-devtools) tarafından gösterilir. Debug işlemini kolaylaştırmak için, gösterilecek adı bu bileşenin bir HOC sonucu olduğunu belirtmesine özen gösterin.

En yaygın teknik, kapsanan bileşenin gösterilen adını kapsamaktır. Yani eğer üst-seviye bileşeninizin adı `withSubscription` ise ve kapsanan bileşenin gösterilen adı `CommentList` ise, gösterilen ad olarak `withSubscription(CommentList)`’i kullanın:

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```


## Uyarılar {#caveats}

Üst-seviye bileşenler, dikkat etmeniz gereken ve eğer React’a yeniyseniz hemen göremeyeceğiniz bazı sıkıntılara sahiptir.

### Render Metodu İçerisinde HOC'ları Kullanmayın {#dont-use-hocs-inside-the-render-method}

React’ın fark algılama algoritması ([Reconciliation](/docs/reconciliation.html)n olarak adlandırılır) var olan bileşen ağacını güncellemesi veya tamamen baştan yaratması gerektiğini anlamak için bileşen kimliğini kullanır. Eğer `render`'dan dönen bileşen bir önceki renderla aynıysa(`===`), React recursive bir şekilde bileşen ağacını yeni olanla farkını ölçelerek günceller. Eğer aynı değillerse, önceki bileşen ağacı tamamen kaldırlır.

Normalde, bunun hakkında düşünmeniz gerekmez. Fakat HOC kullanırken bu render metodu içerisinde HOC kullanayamacağınız anlamına gelir:

```js
render() {
  // A new version of EnhancedComponent is created on every render
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // That causes the entire subtree to unmount/remount each time!
  return <EnhancedComponent />;
}
```

Buradaki tek sıkıntı performans değil — bir bileşeni tekrar mount etmek bileşenin state’inin kaybolmasına ve tüm alt-elemanlarının kaybolmasına yol açar.

Bunun yerine HOC’u bileşen tanımının dışında yapın, bu sayede sonuç bileşen sadece bir kez yaratılmış olsun. Bu sayede bu bileşenin kimliği renderlar arasında tutarlı olacaktır. Zaten genelde istenilen davranış bu şekildedir.

HOC’u dinamik olarak uygulamanız gereken durumlarda ise bunu bileşenin yaşam döngüsü metodlarında veya bileşenin constructor’ında yapabilirsiniz.

### Statik Metodlar Kopyalanmalıdır {#static-methods-must-be-copied-over}

Bazen bir react bileşeninde statik bir metod tanımlamak kullanışlı olabilir. Örneğin, Relay container’ları GrahpQL ile birlikte kullanılması için `getFragment` diye statik bir metod açığa çıkarır.

Bir bileşene HOC uyguladığınız zaman, orijinali bir container bileşen tarafından kapsanmış olabilir. Bu da yeni bileşenin orijinal bileşenin statik fonksiyonlarından hiçbirine sahip olmadığı anlamına gelir.

```js
// Define a static method
WrappedComponent.staticMethod = function() {/*...*/}
// Now apply a HOC
const EnhancedComponent = enhance(WrappedComponent);

// The enhanced component has no static method
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

Bunu çözmek için, bileşeni döndürmeden önce bütün metodları container’a kopyalayabilirsiniz.

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Must know exactly which method(s) to copy :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

Fakat bunun için hangi metodları kopyalamanız gerektiğini bilmelisiniz. Tüm React-dışı statik metodlarını[hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics)’i kullanarak kopyalayabilirisiniz:

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

Başka bir olası çözüm de statik metodları bileşenden ayrı olarak dışa aktarmaktır.

```js
// Instead of...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...export the method separately...
export { someFunction };

// ...and in the consuming module, import both
import MyComponent, { someFunction } from './MyComponent.js';
```

### Ref'ler Geçirilmemektedir {#refs-arent-passed-through}

Üst-seviye bileşenlerin rahatlığı tüm propların kapsanan bileşene geçirilmesi olmasına rağmen, bu `ref`’lerde işe yaramaz. Çünkü ref’ler aslında bir prop değildir — `key` gibi, React tarafından özel olarak yönetilir. Eğer sahip olduğu bir bileşeni, bir HOC sonucu olaran bir elemana ref eklerseniz; bu ref en dıştaki container bileşenine denk gelir, kapsanan bileşene değil.

Bu sorunun çözümü ise `React.forwardRef` API’nın (React 16.3’le tanıtıldı) kullanılmasıdır. [Ref’leri taşımak kısmında bu konu hakkında daha çok şey öğrenin.](/docs/forwarding-refs.html).
