---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

React, `<script>` elemaniyla yuklenirse, bu ust seviye API'lar `ReactDOM` uzerinden kullanilabilirsiniz. Mesela ES6 ile npm kullaniliyorsaniz, `import ReactDOM from 'react-dom'` yazabilir. ES5 ile npm kullaniliyorsaniz `var ReactDOM = require('react-dom')` yazabilirsiniz.

## Genel Taslak {#overview}

`react-dom` uygulamanin en ust seviyesinde DOM'a ozel metodlar sunar ve bu da gerektiginde React model'inin disina cikabilmenizi saglar. Bu arada, cogu bilesenlerin bu modulu kullanmasina gerek olmaz

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### Tarayici destegi {#browser-support}


React, Internet Explorer 9 ve uzeri de dahil, tum populer tarayicilari desteklemekte, ama  IE 9 ve IE 10 gibi eski tarayicilarda [bazi eklentiler gerekmektedir](/docs/javascript-environment-requirements.html)  

> Not
>
> ES5 metodlarini desteklemeyen tarayicilari desteklemiyoruz, ama [es5-shim ve es5-sham](https://github.com/es-shims/es5-shim) gibi bazi eklentiler kullanildiginda, uygulamanizin calistigini gorebilirsiniz. Bu yolu kullanmak sizin takdiriniz.

* * *

## Referans {#reference}

### `render()` {#render}

```javascript
ReactDOM.render(element, container[, callback])
```

Girilen `container` ile DOM'a React elemani render ederek; bilesene bir  [referans](/docs/more-about-refs.html) donuyoruz (ya da [state'siz bilesenler](/docs/components-and-props.html#functional-and-class-components) icin `null` donuyoruz).


Eger React elemani `container` a daha onceden render edildiyse, bu guncelleme olarak gerceklesir ve en guncel React elemanini yansitmask icin sadece DOM'u degistirir.

Eger istege bagli callback saglandiysa, bilesen render edildikten ya da guncellendikten sonra cagrilir.

> Not:
>
> `ReactDOM.render()` ilettiğiniz konteyner elemaninin içeriğini kontrol eder. İlk cagrildiginda, içindeki butun DOM elemanlari değiştirilir. Daha sonra yapılan çağrılar etkili güncellemeler için React'in DOM farklılaştırma algoritmasını kullanır.
>
> `ReactDOM.render()`, konteyner elemanini değiştirmez (yalnızca konteynerin alt elemanlarini değiştirir). Mevcut alt elemanlarin üzerine yazmadan varolan bir DOM elemanina, bileşen eklemek mümkün olabilir
>
> `ReactDOM.render()` halihazirda `ReactComponent` nesnesinin kokune bir referans donuyor. Ancak, bu dönüş değerini kullanmak eskidi
> ve bundan kaçınılmalıdır, çünkü React'in gelecekteki sürümleri, bazı durumlarda bileşenleri eşzamansız olarak sağlayabilir. Kök `ReactComponent` nesnesine referans gerekiyorsa, tercih edilen çözüm  
> kök elemana bir [callback referansi](/docs/more-about-refs.html#the-ref-callback-attribute) olmalidir.
>
> Sunucu tarafından render edilen  bir konteyneri hidratlamak için `ReactDOM.render()`in kullanılması artik desteklenmiyor ve React 17'de de  kaldirilacaktir. Bunun yerine [`hydrate()`](#hydrate) kullanilmalidir
* * *

### `hydrate()` {#hydrate}

```javascript
ReactDOM.hydrate(element, container[, callback])
```

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.

React expects that the rendered content is identical between the server and the client. It can patch up differences in text content, but you should treat mismatches as bugs and fix them. In development mode, React warns about mismatches during hydration. There are no guarantees that attribute differences will be patched up in case of mismatches. This is important for performance reasons because in most apps, mismatches are rare, and so validating all markup would be prohibitively expensive.

If a single element's attribute or text content is unavoidably different between the server and the client (for example, a timestamp), you may silence the warning by adding `suppressHydrationWarning={true}` to the element. It only works one level deep, and is intended to be an escape hatch. Don't overuse it. Unless it's text content, React still won't attempt to patch it up, so it may remain inconsistent until future updates.

If you intentionally need to render something different on the server and the client, you can do a two-pass rendering. Components that render something different on the client can read a state variable like `this.state.isClient`, which you can set to `true` in `componentDidMount()`. This way the initial render pass will render the same content as the server, avoiding mismatches, but an additional pass will happen synchronously right after hydration. Note that this approach will make your components slower because they have to render twice, so use it with caution.

Remember to be mindful of user experience on slow connections. The JavaScript code may load significantly later than the initial HTML render, so if you render something different in the client-only pass, the transition can be jarring. However, if executed well, it may be beneficial to render a "shell" of the application on the server, and only show some of the extra widgets on the client. To learn how to do this without getting the markup mismatch issues, refer to the explanation in the previous paragraph.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
ReactDOM.unmountComponentAtNode(container)
```

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.

* * *

### `findDOMNode()` {#finddomnode}

> Note:
>
> `findDOMNode` is an escape hatch used to access the underlying DOM node. In most cases, use of this escape hatch is discouraged because it pierces the component abstraction. [It has been deprecated in `StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
ReactDOM.findDOMNode(component)
```
If this component has been mounted into the DOM, this returns the corresponding native browser DOM element. This method is useful for reading values out of the DOM, such as form field values and performing DOM measurements. **In most cases, you can attach a ref to the DOM node and avoid using `findDOMNode` at all.**

When a component renders to `null` or `false`, `findDOMNode` returns `null`. When a component renders to a string, `findDOMNode` returns a text DOM node containing that value. As of React 16, a component may return a fragment with multiple children, in which case `findDOMNode` will return the DOM node corresponding to the first non-empty child.

> Note:
>
> `findDOMNode` only works on mounted components (that is, components that have been placed in the DOM). If you try to call this on a component that has not been mounted yet (like calling `findDOMNode()` in `render()` on a component that has yet to be created) an exception will be thrown.
>
> `findDOMNode` cannot be used on function components.

* * *

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).
