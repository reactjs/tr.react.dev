---
id: typechecking-with-proptypes
title: PropTypes ile Tip Kontrolü
permalink: docs/typechecking-with-proptypes.html
redirect_from:
  - "docs/react-api.html#typechecking-with-proptypes"
---

> Not:
>
> `React.PropTypes` React v15.5'ten bu yana farklı bir pakete taşındı. Lütfen bunun yerine [`prop-types` kütüphanesini kullanın](https://www.npmjs.com/package/prop-types).
>
> Dönüştürme işlemini otomatikleştirmek için [bir codemod script](/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes)'i sunuyoruz.

Uygulamanız büyüdükçe, tip kontrolü ile birçok hata yakalayabilirsiniz. Bazı uygulamalarda, tüm uygulamanız üzerinde tip kontrolü yapmak için [Flow](https://flow.org/) veya [TypeScript](https://www.typescriptlang.org/) gibi JavaScript uzantılarını kullanabilirsiniz. Ama bunları kullanmasanız bile, React bazı yerleşik tip kontrolü yeteneklerine sahiptir. Bir bileşenin prop'ları üzerinde tip kontrolü yapmak için, özel `propTypes` niteliğini atayabilirsiniz:

```javascript
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

Bu örnekte, bir sınıf bileşeni kullanıyoruz, ancak aynı işlevsellik fonksiyon bileşenlerine, veya [`React.memo`](/docs/react-api.html#reactmemo) veya [`React.forwardRef`](/docs/react-api.html#reactforwardref) tarafından oluşturulan bileşenlere de uygulanabilir.

`PropTypes` alınan verilerin geçerli olduğundan emin olmak için kullanılabilecek bir dizi doğrulayıcı verir. Bu örnekte, `PropTypes.string`'i kullanıyoruz. Bir prop için geçersiz bir değer sağlandığında, JavaScript konsolunda bir uyarı gösterilecektir. Performans nedeniyle, `propTypes` sadece geliştirme modunda kontrol edilir.

### PropTypes {#proptypes}

İşte sağlanan çeşitli doğrulayıcıları gösteren bir örnek:

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // Bir prop'un belirli bir JS türü olduğunu belirtebilirsiniz.
  // Varsayılan olarak, bunların hepsi isteğe bağlıdır.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Render edilebilecek her şey: sayılar, dizeler, elemanlar veya bir dizi
  // (veya fragment) bu türleri içeren.
  optionalNode: PropTypes.node,

  // React elemanı.
  optionalElement: PropTypes.element,
  
  // Bir React Eleman Tipi (Örnek: MyComponent).
  optionalElementType: PropTypes.elementType,
  
  // Bir prop'un sınıf nesnesi olduğunu da belirtebilirsiniz.
  // Bu JS'in instanceof operatörünü kullanır.
  optionalMessage: PropTypes.instanceOf(Message),

  // Bir prop'un enum olarak değerlendirilerek
  // belirli değerlerle sınırlı olmasını sağlayabilirsiniz.
  optionalEnum: PropTypes.oneOf(['Haberler', 'Fotoğraflar']),

  // Birçok türden birinin olabileceği bir nesne
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // Belirli bir türde bir dizi
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // Belirli bir türde özellik değerlerine sahip bir nesne
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // Belirli bir şekildeki nesne
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),
  
  // An object with warnings on extra properties
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),   

  // Prop'un sağlanmadığı durumlarda bir uyarının gösterildiğinden emin olmak için,
  // yukarıdakilerden herhangi birini `isRequired` ile zincirleyebilirsiniz.
  requiredFunc: PropTypes.func.isRequired,

  // Herhangi bir veri türünün değeri
  requiredAny: PropTypes.any.isRequired,

  // Özel bir doğrulayıcı da belirtebilirsiniz.
  // Doğrulama başarısız olursa bir Error nesnesi döndürmelidir.
  // `console.warn` veya `throw` kullanmayın, çünkü bu `oneOfType` içinde çalışmayacaktır.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // Ayrıca `arrayOf` ve `objectOf`'lara özel bir doğrulayıcı da belirtebilirsiniz.
  // Doğrulama başarısız olursa bir Error nesnesi döndürmelidir.
  // Doğrulayıcı, dizideki veya nesnedeki her anahtar için çağrılacaktır.
  // Doğrulayıcının ilk iki argümanı dizi veya nesnenin kendisi
  // ve geçerli öğenin anahtarıdır.
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

### Tek Alt Eleman Gerektirmek {#requiring-single-child}

`PropTypes.element` ile, yalnızca tek bir elemanın bir bileşene alt eleman olarak geçeceğini belirtebilirsiniz.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // Bu kesinlikle tek bir eleman olmalı; aksi takdirde uyarı verecektir.
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### Varsayılan Prop Değerleri {#default-prop-values}

Özel `defaultProps` niteliğine atama yaparak, `prop`'larınız için varsayılan değerleri tanımlayabilirsiniz:

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// Prop'lar için varsayılan değerleri belirtir:
Greeting.defaultProps = {
  name: 'Stranger'
};

// "Hello, Stranger" yazısını çıktılar:
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

Eğer [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) gibi bir Babel dönüşümü kullanıyorsanız, `defaultProps`'u bir React bileşen sınıfında statik özellik olarak da tanımlayabilirsiniz. Bu sözdizimi henüz tamamlanmadı ve tarayıcıda çalışabilmesi için bir derleme adımı gerektirecektir. Daha fazla bilgi için, [sınıf alanları önergesi](https://github.com/tc39/proposal-class-fields)'ne göz atabilirsiniz.

```javascript
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <div>Hello, {this.props.name}</div>
    )
  }
}
```

`this.props.name`'in üst bileşen tarafından belirtilen bir değerinin olmadığı durumlarda, varsayılan bir değere sahip olmasını sağlamak için `defaultProps` kullanılır. `propTypes` tip kontrolü `defaultProps` çözümlendikten sonra gerçekleşir, bu nedenle tip kontrolü `defaultProps` için de geçerli olacaktır.
