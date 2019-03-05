---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

Bu başvuru rehberinde, React Olay Sistemi'nin bir parçasını oluşturan `SyntheticEvent` sarmalayıcısı(wrapper) açıklanmaktadır. Daha fazla bigli sahibi olmak için [Olay Yönetimi](/docs/handling-events.html) kaynağını inceleyebilirsiniz.

## Genel Bakış {#overview}

Olay yöneticilerinize, tarayıcının kendi olaylarını sarmalayan bir çapraz-tarayıcı `SyntheticEvent` nesnesi iletilir. Bu nesne tüm tarayıcılarda aynı şekilde çalışması dışında, `stopPropagation()` ve `preventDefault()` dahil olmak üzere, tarayıcının kendi olayıyla aynı arabirime sahiptir. 

Bir nedenden ötürü esas tarayıcı olayına ihtiyaç duyarsanız, basitçe `nativeEvent` özelliğini kullanın. Her `SyntheticEvent` nesnesi aşağıdaki özelliklere sahiptir:

```javascript
boolean bubbles
boolean cancelable
DOMEventTarget currentTarget
boolean defaultPrevented
number eventPhase
boolean isTrusted
DOMEvent nativeEvent
void preventDefault()
boolean isDefaultPrevented()
void stopPropagation()
boolean isPropagationStopped()
DOMEventTarget target
number timeStamp
string type
```

> Not:
>
> v0.14 itibariyle, bir olay yöneticisinden `false` döndürmek artık olay yayılımını durdurmayacaktır. Bunun yerine, uygun görüldüğü şekilde `e.stopPropagation()` ya da `e.preventDefault()` manuel olarak tetiklenmelidir.

### Olay Ortaklama (Event Pooling) {#event-pooling}

`SyntheticEvent` ortaklanmıştır. Bu, `SyntheticEvent` nesnesinin tekrar kullanılacağı ve olay geri dönmesinin(callback) çağırılması durumunda tüm özelliklerinin sıfırlanacağı anlamına gelmektedir. Bu durum performans sebeplerinden kaynaklanmaktadır. Böyle olunca da, olaya asenkron bir şekilde erişmeniz mümkün değildir.

```javascript
function onClick(event) {
  console.log(event); // => nullified object.
  console.log(event.type); // => "click"
  const eventType = event.type; // => "click"

  setTimeout(function() {
    console.log(event.type); // => null
    console.log(eventType); // => "click"
  }, 0);

  // Won't work. this.state.clickEvent will only contain null values.
  this.setState({clickEvent: event});

  // You can still export event properties.
  this.setState({eventType: event.type});
}
```

> Not:
>
> Olay özelliklerine asenkron bir şekilde erişmek isterseniz, olay üzerinde `event.persist()` çağırmalısınız. Bu şekilde sentetik olay havuzdan çıkarılır ve olay referanslarının kullanıcı kodu tarafından korunmasına olanak sağlanır.

## Desteklenen Olaylar {#supported-events}

React olayları normalleştirir ve olaylar bu şekilde farklı tarayıcılarda tutarlı özelliklere sahip olur.

Aşağıdaki olay yöneticileri, balonlanma(bubbling) evresinde bir olay tarafından tetiklenir. Yakalama evresine bir olay yöneticisi kaydetmek için, olay ismine `Capture` ilave edin. Örneğin tıklama olayını, yakalama evresinde yönetmek için `onClick` kullanmak yerine `onClickCapture` kullanın.

- [Not Panosu Olayları](#clipboard-events)
- [Dizim Olayları](#composition-events)
- [Klavye Olayları](#keyboard-events)
- [Odaklanma Olayları](#focus-events)
- [Form Olayları](#form-events)
- [Fare Olayları](#mouse-events)
- [İşaretçi Olayları](#pointer-events)
- [Seçme Olayları](#selection-events)
- [Dokunma Olayları](#touch-events)
- [Kullanıcı Arayüzü Olayları](#ui-events)
- [Tekerlek Olayları](#wheel-events)
- [Medya Olayları](#media-events)
- [Resim Olayları](#image-events)
- [Animasyon Olayları](#animation-events)
- [Geciş Olayları](#transition-events)
- [Diğer Olaylar](#other-events)

* * *

## Kaynak {#reference}

### Not Panosu Olayları {#clipboard-events}

Olay isimleri:

```
onCopy onCut onPaste
```

Özellikler:

```javascript
DOMDataTransfer clipboardData
```

* * *

### Dizim Olayları {#composition-events}

Olay isimleri:

```
onCompositionEnd onCompositionStart onCompositionUpdate
```

Özellikler:

```javascript
string data

```

* * *

### Klavye Olayları {#keyboard-events}

Olay isimleri:

```
onKeyDown onKeyPress onKeyUp
```

Özellikler:

```javascript
boolean altKey
number charCode
boolean ctrlKey
boolean getModifierState(key)
string key
number keyCode
string locale
number location
boolean metaKey
boolean repeat
boolean shiftKey
number which
```

`key` özelliği [DOM Level 3 Events spec](https://www.w3.org/TR/uievents-key/#named-key-attribute-values)'de belgelenen tüm değerleri alabilir.

* * *

### Odaklanma Olayları {#focus-events}

Olay isimleri:

```
onFocus onBlur
```

Bu odaklanma olayları sadece form elemanlarında değil, React DOM'daki tüm elemanlarda çalışmaktadır.

Özellikler:

```javascript
DOMEventTarget relatedTarget
```

* * *

### Form Olayları {#form-events}

Olay isimleri:

```
onChange onInput onInvalid onSubmit
```

onChage olayı ile ilgili daha fazla bilgi için [Formlar](/docs/forms.html)'ı inceleyin.

* * *

### Fare Olayları {#mouse-events}

Olay isimleri:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

The `onMouseEnter` and `onMouseLeave` events propagate from the element being left to the one being entered instead of ordinary bubbling and do not have a capture phase.

Özellikler:

```javascript
boolean altKey
number button
number buttons
number clientX
number clientY
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
number pageX
number pageY
DOMEventTarget relatedTarget
number screenX
number screenY
boolean shiftKey
```

* * *

### İşaretçi Olayları {#pointer-events}

Olay isimleri:

```
onPointerDown onPointerMove onPointerUp onPointerCancel onGotPointerCapture
onLostPointerCapture onPointerEnter onPointerLeave onPointerOver onPointerOut
```

The `onPointerEnter` and `onPointerLeave` events propagate from the element being left to the one being entered instead of ordinary bubbling and do not have a capture phase.

Özellikler:

[W3 spec](https://www.w3.org/TR/pointerevents/)'te tanımlandığı üzere, işaretçi olayları [Fare Olayları](#mouse-events)'nı aşağıdaki özellikler ile genişletir.

```javascript
number pointerId
number width
number height
number pressure
number tangentialPressure
number tiltX
number tiltY
number twist
string pointerType
boolean isPrimary
```

Çapraz-tarayıcı desteği üzerine bir not:

İşaretçi olayları henüz tüm tarayıcılarda desteklenmemektedir (Bu makalenin yazıldığı tarihte destekleyen tarayıcılar: Chrome, Firefox, Edge ve Internet Explorer). React kasıtlı olarak 

Pointer events are not yet supported in every browser (at the time of writing this article, supported browsers include: Chrome, Firefox, Edge, and Internet Explorer). React deliberately does not polyfill support for other browsers because a standard-conform polyfill would significantly increase the bundle size of `react-dom`.

If your application requires pointer events, we recommend adding a third party pointer event polyfill.

* * *

### Selection Events {#selection-events}

Olay isimleri:

```
onSelect
```

* * *

### Touch Events {#touch-events}

Olay isimleri:

```
onTouchCancel onTouchEnd onTouchMove onTouchStart
```

Özellikler:

```javascript
boolean altKey
DOMTouchList changedTouches
boolean ctrlKey
boolean getModifierState(key)
boolean metaKey
boolean shiftKey
DOMTouchList targetTouches
DOMTouchList touches
```

* * *

### UI Events {#ui-events}

Olay isimleri:

```
onScroll
```

Özellikler:

```javascript
number detail
DOMAbstractView view
```

* * *

### Wheel Events {#wheel-events}

Olay isimleri:

```
onWheel
```

Özellikler:

```javascript
number deltaMode
number deltaX
number deltaY
number deltaZ
```

* * *

### Media Events {#media-events}

Olay isimleri:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Image Events {#image-events}

Olay isimleri:

```
onLoad onError
```

* * *

### Animation Events {#animation-events}

Olay isimleri:

```
onAnimationStart onAnimationEnd onAnimationIteration
```

Özellikler:

```javascript
string animationName
string pseudoElement
float elapsedTime
```

* * *

### Transition Events {#transition-events}

Olay isimleri:

```
onTransitionEnd
```

Özellikler:

```javascript
string propertyName
string pseudoElement
float elapsedTime
```

* * *

### Other Events {#other-events}

Olay isimleri:

```
onToggle
```
