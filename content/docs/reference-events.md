---
id: events
title: SyntheticEvent
permalink: docs/events.html
layout: docs
category: Reference
---

Bu başvuru rehberinde, React Olay Sistemi'nin bir parçasını oluşturan `SyntheticEvent` sarmalayıcısı (wrapper) açıklanmaktadır. Daha fazla bigli sahibi olmak için [Olay Yönetimi](/docs/handling-events.html) kaynağını inceleyebilirsiniz.

## Genel Bakış {#overview}

Olay yöneticilerinize, tarayıcının kendi olaylarını sarmalayan bir çapraz-tarayıcı `SyntheticEvent` nesnesi iletilir. Bu nesne tüm tarayıcılarda aynı şekilde çalışması dışında, `stopPropagation()` ve `preventDefault()` dahil olmak üzere, tarayıcının kendi olayıyla aynı arabirime sahiptir.

Bir nedenden ötürü esas tarayıcı olayına ihtiyaç duyarsanız, basitçe `nativeEvent` özelliğini kullanın. Sentetik olaylar, tarayıcının doğal (native) olaylarından farklıdır ve doğrudan bunlarla eşleşmez. Örneğin, `onMouseLeave`'in içindeki `event.nativeEvent` bir `mouseout` olayına işaret edecektir. Spesifik eşleme, genel API'nin bir parçası değildir ve herhangi bir zamanda değişebilir. Her `SyntheticEvent` nesnesi aşağıdaki özelliklere sahiptir:

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
void persist()
DOMEventTarget target
number timeStamp
string type
```

> Not:
>
> React 17'den itibaren, `e.persist()` in bir işlevi kalmamıştır. Çünkü `SyntheticEvent` artık [ortaklanmamaktadır. (event-pooling)](/docs/legacy-event-pooling.html).


> Not:
>
> v0.14 itibariyle, bir olay yöneticisinden `false` döndürmek artık olay yayılımını durdurmayacaktır. Bunun yerine, uygun görüldüğü şekilde `e.stopPropagation()` ya da `e.preventDefault()` manuel olarak tetiklenmelidir.


## Desteklenen Olaylar {#supported-events}

React olayları normalleştirir ve olaylar bu şekilde farklı tarayıcılarda tutarlı özelliklere sahip olur.

Aşağıdaki olay yöneticileri, balonlanma (bubbling) evresinde bir olay tarafından tetiklenir. Yakalama evresine bir olay yöneticisi kaydetmek için, olay ismine `Capture` ilave edin. Örneğin tıklama olayını, yakalama evresinde yönetmek için `onClick` kullanmak yerine `onClickCapture` kullanın.

- [Not Panosu Olayları](#clipboard-events)
- [Kompozisyon Olayları](#composition-events)
- [Klavye Olayları](#keyboard-events)
- [Odaklanma Olayları](#focus-events)
- [Form Olayları](#form-events)
- [Genel Olaylar](#generic-events)
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

### Kompozisyon Olayları {#composition-events}

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

`key` özelliği [DOM 3. Seviye Olaylar Belirlemeleri](https://www.w3.org/TR/uievents-key/#named-key-attribute-values)'nde belgelenen tüm değerleri alabilir.

* * *

### Odaklanma Olayları {#focus-events}

Olay isimleri:

```
onFocus onBlur
```

Bu odaklanma olayları sadece form elemanlarında değil, React DOM'daki tüm elemanlarda çalışmaktadır.

Özellikler:

```js
DOMEventTarget relatedTarget
```

#### onFocus {#onfocus}

The `onFocus` event is called when the element (or some element inside of it) receives focus. For example, it's called when the user clicks on a text input.

```javascript
function Example() {
  return (
    <input
      onFocus={(e) => {
        console.log('Focused on input');
      }}
      placeholder="onFocus is triggered when you click this input."
    />
  )
}
```

#### onBlur {#onblur}

The `onBlur` event handler is called when focus has left the element (or left some element inside of it). For example, it's called when the user clicks outside of a focused text input.

```javascript
function Example() {
  return (
    <input
      onBlur={(e) => {
        console.log('Triggered because this input lost focus');
      }}
      placeholder="onBlur is triggered when you click this input and then you click outside of it."
    />
  )
}
```

#### Detecting Focus Entering and Leaving {#detecting-focus-entering-and-leaving}

You can use the `currentTarget` and `relatedTarget` to differentiate if the focusing or blurring events originated from _outside_ of the parent element. Here is a demo you can copy and paste that shows how to detect focusing a child, focusing the element itself, and focus entering or leaving the whole subtree.

```javascript
function Example() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('focused self');
        } else {
          console.log('focused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus entered self');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('unfocused self');
        } else {
          console.log('unfocused child', e.target);
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Not triggered when swapping focus between children
          console.log('focus left self');
        }
      }}
    >
      <input id="1" />
      <input id="2" />
    </div>
  );
}
```

* * *

### Form Olayları {#form-events}

Olay isimleri:

```
onChange onInput onInvalid onReset onSubmit
```

onChage olayı ile ilgili daha fazla bilgi için [Formlar](/docs/forms.html)'ı inceleyin.

* * *

### Genel Olaylar {#generic-events}

Olay isimleri:

```
onError onLoad
```

* * *

### Fare Olayları {#mouse-events}

Olay isimleri:

```
onClick onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit
onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter onMouseLeave
onMouseMove onMouseOut onMouseOver onMouseUp
```

`onMouseEnter` ve `onMouseLeave` olayları, olağan balonlanma yerine bırakılan elemandan girilen elemana doğru yayılırlar ve yakalama evreleri yoktur.

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

`onMouseEnter` ve `onMouseLeave` olayları, olağan balonlanma yerine bırakılan elemandan girilen elemana doğru yayılırlar ve yakalama evreleri yoktur.

Özellikler:

[W3 belirlemeleri](https://www.w3.org/TR/pointerevents/)'nde tanımlandığı üzere, işaretçi olayları [Fare Olayları](#mouse-events)'nı aşağıdaki özellikler ile genişletir.

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

İşaretçi olayları henüz tüm tarayıcılarda desteklenmemektedir (Bu makalenin yazıldığı tarihte destekleyen tarayıcılar: Chrome, Firefox, Edge ve Internet Explorer). React, `react-dom` paket boyutunun önemli bit ölçüde artmaması için kasıtlı olarak diğer tarayıcılar için polyfill desteği sunmamaktadır.

Eğer uygulamanızda işaretçi olaylarına ihtiyaç duyarsanız, üçüncü parti bir işaretçi olay polyfill'i kullanmanızı öneririz.

* * *

### Seçme Olayları {#selection-events}

Olay isimleri:

```
onSelect
```

* * *

### Dokunma Olayları {#touch-events}

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

### Kullanıcı Arayüzü Olayları {#ui-events}

Olay isimleri:

```
onScroll
```

>Not
>
>React 17'den başlayarak, `onScroll` olayı **balonlanma (bubbling) oluşturmaz**. Bu, tarayıcı davranışıyla eşleşir ve iç içe yapıdaki kaydırılabilir bir öğe uzakta bulunan bir üst elemanda olayları (events) tetiklediğinde karışıklığı önler.

Özellikler:

```javascript
number detail
DOMAbstractView view
```

* * *

### Tekerler Olayları {#wheel-events}

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

### Medya Olayları {#media-events}

Olay isimleri:

```
onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted
onEnded onError onLoadedData onLoadedMetadata onLoadStart onPause onPlay
onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend
onTimeUpdate onVolumeChange onWaiting
```

* * *

### Resim Olayları {#image-events}

Olay isimleri:

```
onLoad onError
```

* * *

### Animasyon Olayları {#animation-events}

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

### Geçiş Olayları {#transition-events}

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

### Diğer Olaylar {#other-events}

Olay isimleri:

```
onToggle
```
