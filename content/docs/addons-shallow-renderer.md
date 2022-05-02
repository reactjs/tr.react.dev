---
id: shallow-renderer
title: Yüzeysel Render Edici
permalink: docs/shallow-renderer.html
layout: docs
category: Reference
---

**İçe aktarım**

```javascript
import ShallowRenderer from 'react-test-renderer/shallow'; // ES6
var ShallowRenderer = require('react-test-renderer/shallow'); // npm ile ES5
```

## Genel Bakış {#overview}

React için birim testleri yazarken, yüzeysel render edici yardımcı olabilir. Yüzeysel render etme; bir bileşeni, somutlaştırılmayan veya render edilmeyen alt bileşenlerinin davranışları hakkında endişelenmeden, "bir seviye alta" render etmenize ve render etme metodunun ne döndüğü ile ilgili gerçekleri teyit etmenize olanak sağlar. Bu bir DOM gerektirmez.

Örneğin, aşağıdaki gibi bir bileşeniniz varsa:

```javascript
function MyComponent() {
  return (
    <div>
      <span className="heading">Title</span>
      <Subcomponent foo="bar" />
    </div>
  );
}
```

O zaman şu şekilde kullanabilirsiniz:

```javascript
import ShallowRenderer from 'react-test-renderer/shallow';

// Testinizde:
const renderer = new ShallowRenderer();
renderer.render(<MyComponent />);
const result = renderer.getRenderOutput();

expect(result.type).toBe('div');
expect(result.props.children).toEqual([
  <span className="heading">Title</span>,
  <Subcomponent foo="bar" />
]);
```

Yüzeysel test etmenin şu anda bazı kısıtlamaları var, mesela ref'leri desteklemiyor.

> Not:
>
> Ayrıca Enzyme'in [Yüzeysel Render Etme API'si](https://airbnb.io/enzyme/docs/api/shallow.html)ne de göz atmanızı öneririz. Aynı işlevsellik üzerinden daha iyi ve üst düzey bir API sağlar.

## Referans {#reference}

### `shallowRenderer.render()` {#shallowrendererrender}

shallowRenderer'ı, test ettiğiniz bileşeni render edeceğiniz ve bu bileşenin çıktısını alabileceğiniz bir "yer" olarak düşünebilirsiniz.

<<<<<<< HEAD
`shallowRenderer.render()`, [`ReactDOM.render()`](/docs/react-dom.html#render)'a benzer, ancak DOM gerektirmez ve yalnızca bir seviye alta render eder. Bu, alt öğelerinin nasıl uygulandığından bağımsız şekilde bileşenleri test edebileceğiniz anlamına gelir.
=======
`shallowRenderer.render()` is similar to [`root.render()`](/docs/react-dom-client.html#createroot) but it doesn't require DOM and only renders a single level deep. This means you can test components isolated from how their children are implemented.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

### `shallowRenderer.getRenderOutput()` {#shallowrenderergetrenderoutput}

`shallowRenderer.render()` çağrıldıktan sonra, yüzeysel render edilen çıktıyı almak için `shallowRenderer.getRenderOutput()` kullanabilirsiniz.

Sonrasında çıktı hakkında gerçekleri teyit etmeye başlayabilirsiniz.
