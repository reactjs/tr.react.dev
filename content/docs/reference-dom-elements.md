---
id: dom-elements
title: DOM Elemanları
layout: docs
category: Reference
permalink: docs/dom-elements.html
redirect_from:
  - "docs/tags-and-attributes.html"
  - "docs/dom-differences.html"
  - "docs/special-non-dom-attributes.html"
  - "docs/class-name-manipulation.html"
  - "tips/inline-styles.html"
  - "tips/style-props-value-px.html"
  - "tips/dangerously-set-inner-html.html"
---

React, performans ve tarayıcılara uyumluluk sağlayabilmek için tarayıcı bağımsız bir DOM sistemi uygulamaktadır. Tarayıcı DOM geliştirmelerinde birkaç zorlu noktayı düzeltme fırsatı yakaladık.

React'te, tüm DOM özellikleri ve nitelikleri (olay işleyicileri dahil) camelCased olmalıdır. Örneğin, HTML niteliği olan `tabindex`, React'te `tabIndex`'e karşılık gelmektedir. Burada istisna olarak `aria-*` ve `data-*` nitelikleri bulunmaktadır. Bu nitelikler küçük harfli olmalıdır. Örneğin, `aria-label`'ı `aria-label` olarak yazabilirsiniz.

## React ve HTML'deki Nitelik Farklılıkları {#differences-in-attributes}

React ve HTML'de birbirlerinden farklı çalışan birkaç nitelik bulunmaktadır:

### checked {#checked}

`checked` niteliği `checkbox` veya `radio` tipinde olan `<input>` elemanlarında desteklenmektedir. Bu niteliği input elemanındaki değer ya da değerleri seçmek için kullanırsınız. Bu nitelik kontrollü bileşenleri oluşturmak için kullanışlıdır. Kontrolsüz bileşende karşılık olarak `defaultChecked` bulunmaktadır. `defaultChecked` içeren bileşen sayfada ilk oluştuğunda kontrol edilip edilmeyeceğini belirlemektedir.

### className {#classname}

CSS sınıfı belirleyebilmek için `className` niteliğini kullanabilirsiniz. Bu nitelik bütün DOM ve SVG elemanlarına uygulanabilmektedir. Örneğin `<div>`, `<a>` ve diğerleri.

React'i Web bileşenleri ile birlikte kullanırsanız (ki bu çok nadirdir), `class` niteliğini kullanmalısınız.

### dangerouslySetInnerHTML {#dangerouslysetinnerhtml}

Tarayıcı DOM'ında kullanılan `innerHTML`'e karşılık React'te `dangerouslySetInnerHTML` kullanılır. Genellikle HTML'i kod üzerinden tanımlamak risklidir çünkü yanlışlıkla kullanıcılarınızı [cross-site scripting (XSS)](https://en.wikipedia.org/wiki/Cross-site_scripting) saldırısına maruz bırakabilirsiniz. React'te HTML'i doğrudan belirleyebilirsiniz ancak bunu yaparken HTML'i `dangerouslySetInnerHTML`'i `__html` anahtarı üzerinden yazmak zorundasız. Örneğin:

```js
function createMarkup() {
  return {__html: 'Birinci &middot; İkinci'};
}

function MyComponent() {
  return <div dangerouslySetInnerHTML={createMarkup()} />;
}
```

### htmlFor {#htmlfor}

`for` Javascript'te kullanılan bir anahtar kelime olduğundan, React elemanları için `htmlFor` kullanmalısınız.

### onChange {#onchange}

`onChange` olayı beklediğiniz gibi davranış sergiler: bir form alanı değiştirildiğinde, bu olay başlatılır. Varolan tarayıcı davranışını bilerek kullanmıyoruz, çünkü `onChange` sergilediği davranışa göre yanlış isimdir. React, kullanıcı girdisini gerçek zamanlı olarak ele almak için bu olaya güvenmektedir.

### selected {#selected}

Bir `<option>`'ı seçili olarak işaretlemek istiyorsanız, `<select>` elemanının `value` kısmında bu seçeneğin değerine bir referans verin. Detaylı talimatlar için ["select Etiketi"](/docs/forms.html#the-select-tag) kısmını inceleyebilirsiniz.

### style {#style}

>Not
>
>Dokümantasyondaki bazı örneklerde kolaylık sağlamak amaçlı `style` kullanıldı, **fakat stil biçimlendirmede kullanılan `style` niteliğinin kullanılması genelde tavsiye edilmez**. Genellikle bu durumlarda [`className`](#classname) kullanılmalıdır. Bu şekilde harici CSS dosyalarında belirtilen class'ları kullanabilirsiniz. `style`'ın kullanım amacı genellikle React'te dinamik hesaplanan stillerin ekrana yansıtma anında ekleyebilmek için kullanılır. [SSS: CSS ve Stillendirme](/docs/faq-styling.html)'ye bakınız.

`style` niteliği CSS string'i almak yerine camelCased şeklinde yazılmış özellikleri, JavaScript objesi halinde beklemektedir. Bu şekilde DOM `style` JavaScript özelliğiyle tutarlı hale gelmektedir. Ayrıca XSS güvenlik açıklarını önlemesinin de yanı sıra daha verimlidir. Örneğin:

```js
const divStyle = {
  color: 'blue',
  backgroundImage: 'url(' + imgUrl + ')',
};

function HelloWorldComponent() {
  return <div style={divStyle}>Merhaba Dünya!</div>;
}
```

Stiller otomatik düzeltilmemektedir. Eski tarayıcıları da desteklemek için ilgili stilleri belirtmeniz gerekmektedir:

```js
const divStyle = {
  WebkitTransition: 'all', // özelliğin burada büyük harfle başlamış olmasına dikkat ediniz
  msTransition: 'all' // 'ms' küçük harf olarak yazılan tek vendor ön ekidir. 
};

function ComponentWithTransition() {
  return <div style={divStyle}>Bütün tarayıcılarda çalışmalıdır.</div>;
}
```

Stil anahtarları, JS'deki DOM elemanlarındaki özelliklere erişimle tutarlı olmak için camelCased'dır. (örneğin `node.style.backgroundImage`). Vendor ön ekleri [`ms`'ten hariç](http://www.andismith.com/blog/2012/02/modernizr-prefixed/) büyük harf ile başlamalıdır. Bundan dolayı yukarıda `WebkitTransition`, büyük harfle "W" başlamıştır.

React otomatik olarak "px" son ekini belirli stil özelliklerine eklemektedir. "px" haricindeki diğer birimleri kullanmak istiyorsanız, değeri string olarak birimiyle beraber yazmalısınız.

```js
// Sonuç: '10px'
<div style={{ height: 10 }}>
  Merhaba Dünya!
</div>

// Sonuç: '10%'
<div style={{ height: '10%' }}>
  Merhaba Dünya!
</div>
```

Tüm stil özellikleri piksel string'ine dönüştürülemez. Bazıları birimsiz kalmaktadır. Örneğin `zoom`, `order`, `flex`. Bütün birimi olmayan özellikler [burada](https://github.com/facebook/react/blob/4131af3e4bf52f3a003537ec95a1655147c81270/src/renderers/dom/shared/CSSProperty.js#L15-L59) görebilirsiniz.

### suppressContentEditableWarning {#suppresscontenteditablewarning}

Normalde, alt elemanları bulunan bir eleman `contentEditable` olarak işaretlendiğinde çalışmayacağına dair uyarı oluşmaktadır. `suppressContentEditableWarning` niteliği bu uyarıyı bastıracaktır. Bu niteliği [Draft.js](https://facebook.github.io/draft-js/) gibi `contentEditable`'ı manuel olarak yöneten bir kütüphane yazmayacaksınız kullanmamanızı tavsiye ederiz.

### suppressHydrationWarning {#suppresshydrationwarning}

Sunucu tarafında render ediyorsanız, sunucu ve istemcinin ekranı farklı oluşturduğuna dair uyarı alırsınız. Fakat çok nadiren, tam eşleşme neredeyse imkansızdır. Örneğin, timestamps sunucu ve istemcide farklı olması beklenir.

<<<<<<< HEAD
`suppressHydrationWarning`'i `true` olarak belirlerseniz, React sizi elemanın niteliklerindeki ve içeriğindeki uyuşmazlıklar hakkında uyarmayacaktır. Sadece bir derece aşağıya kadar çalışmaktadır. Bu nitelik çıkış kapısı olarak kullanılması amaçlanmıştır. Başka amaçlarda kullanılmamasını tavsiye ederiz. [`ReactDOM.hydrate()` dokümentasyonunda](/docs/react-dom.html#hydrate) hidrasyon ile ilgili daha fazla bilgi bulabilirsiniz.
=======
If you set `suppressHydrationWarning` to `true`, React will not warn you about mismatches in the attributes and the content of that element. It only works one level deep, and is intended to be used as an escape hatch. Don't overuse it. You can read more about hydration in the [`ReactDOM.hydrateRoot()` documentation](/docs/react-dom-client.html#hydrateroot).
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450

### value {#value}

`value` niteliği `<input>`, `<select>` ve `<textarea>` elemanlarında kullanılmaktadır. Elemanın değerini belirleyebilmek için kullanabilirsiniz. Kontrollü bileşen oluşturmada kullanışlıdır. Kontrolsüz bileşende karşılık olarak `defaultValue` bulunmaktadır. Bu nitelik elemanın değerini sayfada ilk oluştuğunda belirleyebilmek için kullanılır.

## Desteklenen Bütün HTML Nitelikleri {#all-supported-html-attributes}

React 16'da herhangi bir standart [ya da özelleştirmede](/blog/2017/09/08/dom-attributes-in-react-16.html) DOM nitelikleri tamamen desteklenmektedir.

React her zaman JavaScript merkezli API'ı DOM'a sağlamaktadır. React bileşenleri sık sık hem özel hem de DOM'la ilgili prop'ları aldığı için, React, DOM API'lardaki gibi `camelCase` konvansiyonunu kullanmaktadır.

```js
<div tabIndex={-1} />      // Tıpkı node.tabIndex DOM API gibi
<div className="Button" /> // Tıpkı node.className DOM API gibi
<input readOnly={true} />  // Tıpkı node.readOnly DOM API gibi
```

Bu prop'lara karşılık gelen HTML nitelikleri benzer şekilde çalışmaktadır. (Yukarıda ifade edilen özel durumlar hariç)

React tarafından desteklenen DOM niteliklerinden bazıları şunlardır:

```
accept acceptCharset accessKey action allowFullScreen alt async autoComplete
autoFocus autoPlay capture cellPadding cellSpacing challenge charSet checked
cite classID className colSpan cols content contentEditable contextMenu controls
controlsList coords crossOrigin data dateTime default defer dir disabled
download draggable encType form formAction formEncType formMethod formNoValidate
formTarget frameBorder headers height hidden high href hrefLang htmlFor
httpEquiv icon id inputMode integrity is keyParams keyType kind label lang list
loop low manifest marginHeight marginWidth max maxLength media mediaGroup method
min minLength multiple muted name noValidate nonce open optimum pattern
placeholder poster preload profile radioGroup readOnly rel required reversed
role rowSpan rows sandbox scope scoped scrolling seamless selected shape size
sizes span spellCheck src srcDoc srcLang srcSet start step style summary
tabIndex target title type useMap value width wmode wrap
```

Benzer olarak, bütün SVG nitelikleri tamamen desteklenmektedir:

```
accentHeight accumulate additive alignmentBaseline allowReorder alphabetic
amplitude arabicForm ascent attributeName attributeType autoReverse azimuth
baseFrequency baseProfile baselineShift bbox begin bias by calcMode capHeight
clip clipPath clipPathUnits clipRule colorInterpolation
colorInterpolationFilters colorProfile colorRendering contentScriptType
contentStyleType cursor cx cy d decelerate descent diffuseConstant direction
display divisor dominantBaseline dur dx dy edgeMode elevation enableBackground
end exponent externalResourcesRequired fill fillOpacity fillRule filter
filterRes filterUnits floodColor floodOpacity focusable fontFamily fontSize
fontSizeAdjust fontStretch fontStyle fontVariant fontWeight format from fx fy
g1 g2 glyphName glyphOrientationHorizontal glyphOrientationVertical glyphRef
gradientTransform gradientUnits hanging horizAdvX horizOriginX ideographic
imageRendering in in2 intercept k k1 k2 k3 k4 kernelMatrix kernelUnitLength
kerning keyPoints keySplines keyTimes lengthAdjust letterSpacing lightingColor
limitingConeAngle local markerEnd markerHeight markerMid markerStart
markerUnits markerWidth mask maskContentUnits maskUnits mathematical mode
numOctaves offset opacity operator order orient orientation origin overflow
overlinePosition overlineThickness paintOrder panose1 pathLength
patternContentUnits patternTransform patternUnits pointerEvents points
pointsAtX pointsAtY pointsAtZ preserveAlpha preserveAspectRatio primitiveUnits
r radius refX refY renderingIntent repeatCount repeatDur requiredExtensions
requiredFeatures restart result rotate rx ry scale seed shapeRendering slope
spacing specularConstant specularExponent speed spreadMethod startOffset
stdDeviation stemh stemv stitchTiles stopColor stopOpacity
strikethroughPosition strikethroughThickness string stroke strokeDasharray
strokeDashoffset strokeLinecap strokeLinejoin strokeMiterlimit strokeOpacity
strokeWidth surfaceScale systemLanguage tableValues targetX targetY textAnchor
textDecoration textLength textRendering to transform u1 u2 underlinePosition
underlineThickness unicode unicodeBidi unicodeRange unitsPerEm vAlphabetic
vHanging vIdeographic vMathematical values vectorEffect version vertAdvY
vertOriginX vertOriginY viewBox viewTarget visibility widths wordSpacing
writingMode x x1 x2 xChannelSelector xHeight xlinkActuate xlinkArcrole
xlinkHref xlinkRole xlinkShow xlinkTitle xlinkType xmlns xmlnsXlink xmlBase
xmlLang xmlSpace y y1 y2 yChannelSelector z zoomAndPan
```

Özel nitelikleri tamamen küçük harfle yazmak şartıyla kullanabilirsiniz.
