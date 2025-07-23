---
title: "Ortak bileşenler (örn. <div>)"
---

<Intro>

[`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div) gibi tüm yerleşik tarayıcı bileşenleri bazı ortak prop'ları ve olayları destekler.

</Intro>

<InlineToc />

---

## Referans {/*reference*/}

### Ortak bileşenler (örn. `<div>`) {/*common*/}

```js
<div className="wrapper">Herhangi bir içerik</div>
```

[Aşağıda daha fazla örnek bulabilirsiniz.](#usage)

#### Prop'lar {/*common-props*/}

Şu özel React prop'ları tüm yerleşik bileşenlerde desteklenir:

* `children`: Bir React düğümü (bir eleman, bir string, bir sayı, [bir portal,](/reference/react-dom/createPortal) `null`, `undefined` ve boolean'lar gibi boş bir düğüm, veya diğer React düğümlerinden bir dizi). Bileşenin içeriğini belirtir. JSX kullandığınızda, `children` prop'unu genellikle etiketleri iç içe `<div><span /></div>` gibi yerleştirerek üstü kapalı olarak belirteceksiniz.

* `dangerouslySetInnerHTML`: İçinde saf bir HTML string'i bulunan `{ __html: '<p>herhangi bir html</p>' }` biçiminde bir nesne. DOM düğümünün [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) özelliğini geçersiz kılar ve içeriye verilen HTML'i gösterir. Bunu kullanırken son derece dikkatli olmalısınız! Eğer içteki HTML güvenilir değilse (mesela kullanıcı verisine dayanan bir şeyse), bir [XSS](https://tr.wikipedia.org/wiki/Siteler_aras%C4%B1_betik_%C3%A7al%C4%B1%C5%9Ft%C4%B1rma) riski ortaya çıkarırsınız. [`dangerouslySetInnerHTML` kullanımıyla ilgili daha fazlasını okuyun.](#dangerously-setting-the-inner-html)

* `ref`: [`useRef`](/reference/react/useRef) veya [`createRef`](/reference/react/createRef)'ten bir ref nesnesi, veya [`ref` callback fonksiyonu,](#ref-callback) veya [eski sürüm ref'leri](https://tr.legacy.reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) için bir string. Bu düğümde ref'iniz DOM elemanıyla doldurulacaktır. [DOM'u ref'lerle manipüle etmeyle ilgili daha fazlasını okuyun.](#manipulating-a-dom-node-with-a-ref)

* `suppressContentEditableWarning`: Bir boolean. Eğer `true` ise, hem `children` hem de `contentEditable={true}` prop'larına sahip olan elemanlarda (ki bunlar normalde birlikte çalışmazlar) React'ın gösterdiği uyarıları baskılar. Bunu, `contentEditable` içeriğini manuel olarak yöneten bir metin girdisi kütüphanesi geliştiriyorsanız kullanın.

* `suppressHydrationWarning`: Bir boolean. Eğer [sunucu taraflı render'lama](/reference/react-dom/server) kullanıyorsanız, sunucu ve istemci farklı içerikleri render ettiğinde normalde bir uyarı görürsünüz. Bazı ender durumlarda (zaman damgası gibi) ise birebir eşleşmeyi sağlamak çok zor veya imkansızdır. Eğer `suppressHydrationWarning`'i `true` olarak ayarlarsanız, React o elemanın içeriği ve niteliklerindeki yanlış eşleşmelerle ilgili bir uyarı vermeyecektir. Yalnızca bir kademe derinde çalışır ve bir kaçış yolu olarak kullanılması amaçlanmıştır. Gereğinden fazla kullanmayınız. [Hydration hatalarını baskılamayla ilgili daha fazlasını okuyun.](/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)

* `style`: CSS biçimlerini taşıyan bir nesne, örneğin `{ fontWeight: 'bold', margin: 20 }`. DOM'un [`style`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) özelliğine benzer olarak, CSS özellik isimleri `camelCase` olarak yazılmalıdır, örneğin `font-weight` yerine `fontWeight`. Değerleri string veya sayı olarak verebilirsiniz. `width: 100` şeklinde bir sayı verdiğinizde, eğer [birimsiz özellik](https://github.com/facebook/react/blob/81d4ee9ca5c405dce62f64e61506b8e155f38d8d/packages/react-dom-bindings/src/shared/CSSProperty.js#L8-L57) değilse, React bu sayıya otomatik olarak `px` ("piksel")'i ekler. `style`'ı yalnızca, biçim değerlerini önceden bilmediğiniz dinamik biçimler için kullanmanızı tavsiye ediyoruz. Diğer durumlarda ise `className` ile düz CSS sınıfları uygulamak daha verimli. [`className` and `style` ile ilgili daha fazlasını okuyun.](#applying-css-styles)

Şu standart DOM prop'ları da tüm yerleşik bileşenlerde desteklenir:

* [`accessKey`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey): Bir string. Eleman için bir klavye kısayolu belirtir. [Genellikle tavsiye edilmez.](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/accesskey#accessibility_concerns)
* [`aria-*`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes): ARIA nitelikleri, bu elemanın erişilebilirlik ağacı bilgisini belirlemenize olanak sağlar. Eksiksiz bir referans için [ARIA niteliklerine](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes) bakınız. React'taki tüm ARIA nitelik isimleri HTML'dekilerle birebir aynıdır.
* [`autoCapitalize`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autocapitalize): Bir string. Kullanıcı girdisinin büyük harfe dönüştürülüp dönüştürülmeyeceğini, eğer dönüştürülecekse nasıl dönüştürüleceğini belirtir.
* [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className): Bir string. Elemanın CSS sınıf ismini belirtir. [CSS biçimlerini uygulamayla ilgili daha fazlasını okuyun.](#applying-css-styles)
* [`contentEditable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable): Bir boolean. Eğer `true` ise tarayıcı, kullanıcının render edilmiş elemanı direkt olarak düzenlemesine olanak sağlar. [Lexical](https://lexical.dev/) gibi zengin metin girdisi kütüphanelerini uygulamak için kullanılabilir. Eğer `contentEditable={true}` prop'una sahip bir elemana React alt elemanları vermeye çalışırsanız React sizi uyarır, çünkü React kullanıcı düzenleme yaptıktan sonra içeriğini güncelleyemeyecektir.
* [`data-*`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*): Data nitelikleri, elemana herhangi bir string verisi bağlamanıza olanak sağlar, örneğin `data-meyve="armut"`. Bunlar React'ta yaygın şekilde kullanılmazlar çünkü veriler daha çok prop'lardan veya state'ten okunur.
* [`dir`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir): `'ltr'` veya `'rtl'`. Elemanın metin yönü belirtir.
* [`draggable`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/draggable): Bir boolean. Elemanın sürüklenebilir olup olmadığını belirtir. [HTML Sürükle ve Bırak API'sinin](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) bir parçasıdır.
* [`enterKeyHint`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/enterKeyHint): Bir string. Sanal klavyelerde enter tuşu için hangi aksiyonun gösterilmesi gerektiğini belirtir.
* [`htmlFor`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLLabelElement/htmlFor): Bir string. [`<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) ve [`<output>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/output) kullanırken [etiket üzerinde bazı kontrollere sahip olmanıza](/reference/react-dom/components/input#providing-a-label-for-an-input) olanak sağlar. [HTML `for` niteliğiyle](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/for) aynı. React, HTML nitelik isimleri yerine standart DOM özellik isimlerini (`htmlFor`) kullanır.
* [`hidden`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden): Bir boolean veya bir string. Elemanın gizli olup olmaması gerektiğini belirtir.
* [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id): Bir string. Elemanı daha sonra bulmaya veya elemanı başka elemanlarla bağlamaya yarayan bir benzersiz tanımlayıcı belirtir. Aynı bileşenin birden fazla nesnelerinin çakışmasını önlemek için [`useId`](/reference/react/useId) ile oluşturun.
* [`is`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is): Bir string. Eğer belirtilmişse, bileşen bir [özel eleman](/reference/react-dom/components#custom-html-elements) gibi davranacaktır. 
* [`inputMode`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inputmode): Bir string. Ne tür bir klavye görüntüleneceğini belirtir (örneğin metin, sayı veya telefon).
* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop): Bir string. Elemanın, web arama robotları için hangi özelliği temsil ettiğini belirtir.
* [`lang`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang): Bir string. Elemanın dilini belirtir.
* [`onAnimationEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event): Bir [`AnimationEvent` yönetici](#animationevent-handler) fonksiyonu. Bir CSS animasyonu tamamlandığında çalışır.
* `onAnimationEndCapture`: `onAnimationEnd`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onAnimationIteration`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationiteration_event): Bir [`AnimationEvent` yönetici](#animationevent-handler) fonksiyonu. Bir CSS animasyonu iterasyonu bitip, bir diğeri başladığında çalışır.
* `onAnimationIterationCapture`: `onAnimationIteration`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onAnimationStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationstart_event): Bir [`AnimationEvent` yönetici](#animationevent-handler) fonksiyonu. Bir CSS animasyonu başladığında çalışır.
* `onAnimationStartCapture`: `onAnimationStart`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onAuxClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/auxclick_event): Bir [`MouseEvent` yönetici](#mouseevent-handler) fonksiyonu. Birincil olmayan bir imleç tuşuna basıldığında çalışır.
* `onAuxClickCapture`: `onAuxClick`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* `onBeforeInput`: Bir [`InputEvent` yönetici](#inputevent-handler) fonksiyonu. Düzenlenebilir bir elemanın değeri değiştirilmeden önce çalışır. React, henüz yerel [`beforeinput`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/beforeinput_event) olayını *kullanmıyor* ve onun yerine, diğer olayları kullanarak polyfill yapmaya çalışıyor.
* `onBeforeInputCapture`: `onBeforeInput`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* `onBlur`: Bir [`FocusEvent` yönetici](#focusevent-handler) fonksiyonu. Bir eleman odağı kaybedince çalışır. React'taki `onBlur` olayı, yerleşik tarayıcıdaki [`blur`](https://developer.mozilla.org/en-US/docs/Web/API/Element/blur_event) olayının aksine kabarır.
* `onBlurCapture`: `onBlur`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onClick`](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event): Bir [`MouseEvent` yönetici](#mouseevent-handler) fonksiyonu. İmleç cihazındaki birincil tuşa tıklanıldığında çalışır.
* `onClickCapture`: `onClick`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onCompositionStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionstart_event): Bir [`CompositionEvent` yönetici](#compositionevent-handler) fonksiyonu. Bir [girdi metodu düzenleyicisi](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) yeni bir birleştirme oturumu başlattığında çalışır.
* `onCompositionStartCapture`: `onCompositionStart`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onCompositionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event): Bir [`CompositionEvent` yönetici](#compositionevent-handler) fonksiyonu. Bir [girdi metodu düzenleyicisi](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) bir birleştirme oturumunu tamamlayınca veya iptal edince çalışır.
* `onCompositionEndCapture`: `onCompositionEnd`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onCompositionUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionupdate_event): Bir [`CompositionEvent` yönetici](#compositionevent-handler) fonksiyonu. Bir [girdi metodu düzenleyicisi'ne](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) yeni bir karakter girildiğinde çalışır.
* `onCompositionUpdateCapture`: `onCompositionUpdate`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onContextMenu`](https://developer.mozilla.org/en-US/docs/Web/API/Element/contextmenu_event): Bir [`MouseEvent` yönetici](#mouseevent-handler) fonksiyonu. Kullanıcı bir bağlam menüsü açmayı denediğinde çalışır.
* `onContextMenuCapture`: `onContextMenu`'nun [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onCopy`](https://developer.mozilla.org/en-US/docs/Web/API/Element/copy_event): Bir [`ClipboardEvent` yönetici](#clipboardevent-handler) fonksiyonu. Kullanıcı panoya bir şeyler kopyalamayı denediğinde çalışır.
* `onCopyCapture`: `onCopy`'nin [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onCut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/cut_event): Bir [`ClipboardEvent` yönetici](#clipboardevent-handler) fonksiyonu. Kullanıcı panoya bir şeyler kesmeyi denediğinde çalışır.
* `onCutCapture`: `onCut`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* `onDoubleClick`: Bir [`MouseEvent` yönetici](#mouseevent-handler) fonksiyonu. Kullanıcı çift tıkladığında çalışır. Tarayacıdaki [`dblclick` olayına](https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event) karşılık gelir. 
* `onDoubleClickCapture`: `onDoubleClick`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onDrag`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event): Bir [`DragEvent` yönetici](#dragevent-handler) fonksiyonu. Kullanıcı bir şeyleri sürüklerken çalışır.
* `onDragCapture`: `onDrag`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onDragEnd`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event): Bir [`DragEvent` yönetici](#dragevent-handler) fonksiyonu. Kullanıcı bir şeyleri sürüklemeyi bıraktığında çalışır.
* `onDragEndCapture`: `onDragEnd`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onDragEnter`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event): Bir [`DragEvent` yönetici](#dragevent-handler) fonksiyonu. Sürüklenen içerik geçerli bir bırakma hedefine girince çalışır.
* `onDragEnterCapture`: `onDragEnter`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onDragOver`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event): Bir [`DragEvent` yönetici](#dragevent-handler) fonksiyonu. Sürüklenen içerik üzerine sürüklendiğinde, geçerli bir bırakma hedefinde çalışır. Bırakmaya izin vermek için burada `e.preventDefault()`'u çağırmanız gerekiyor.
* `onDragOverCapture`: `onDragOver`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onDragStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event): Bir [`DragEvent` yönetici](#dragevent-handler) fonksiyonu. Kullanıcı bir elemanı sürüklemeye başladığında çalışır.
* `onDragStartCapture`: `onDragStart`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onDrop`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event): Bir [`DragEvent` yönetici](#dragevent-handler) fonksiyonu. Geçerli bir bırakma hedefinin üstüne bir şeyler bırakılınca çalışır.
* `onDropCapture`: `onDrop`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* `onFocus`: Bir [`FocusEvent` yönetici](#focusevent-handler) fonksiyonu. Bir elemana odaklanıldığında çalışır. React'taki `onFocus` olayı, yerleşik tarayıcadaki [`focus`](https://developer.mozilla.org/en-US/docs/Web/API/Element/focus_event) olayının aksine kabarır.
* `onFocusCapture`: `onFocus`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onGotPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/gotpointercapture_event): Bir [`PointerEvent` yönetici](#pointerevent-handler) fonksiyonu. Bir eleman programsal olarak bir imleci yakalarsa çalışır.
* `onGotPointerCaptureCapture`: `onGotPointerCapture`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onKeyDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event): Bir [`KeyboardEvent` yönetici](#keyboardevent-handler) fonksiyonu. Bir tuşa basıldığında çalışır.
* `onKeyDownCapture`: `onKeyDown`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onKeyPress`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keypress_event): Bir [`KeyboardEvent` yönetici](#keyboardevent-handler) fonksiyonu. Kullanımdan kaldırıldı. Bunun yerine `onKeyDown` veya `onBeforeInput`'u kullanın.
* `onKeyPressCapture`: `onKeyPress`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onKeyUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event): Bir [`KeyboardEvent` yönetici](#keyboardevent-handler) fonksiyonu. Bastığınız tuştan elinizi çekince çalışır.
* `onKeyUpCapture`: `onKeyUp`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onLostPointerCapture`](https://developer.mozilla.org/en-US/docs/Web/API/Element/lostpointercapture_event): Bir [`PointerEvent` yönetici](#pointerevent-handler) fonksiyonu. Bir eleman, bir imleci yakalamayı bırakınca çalışır.
* `onLostPointerCaptureCapture`: `onLostPointerCapture`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onMouseDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousedown_event): Bir [`MouseEvent` yönetici](#mouseevent-handler) fonksiyonu. İmlece basıldığında çalışır.
* `onMouseDownCapture`: `onMouseDown`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onMouseEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseenter_event): Bir [`MouseEvent` yönetici](#mouseevent-handler) fonksiyonu. İmleç bir elemanın içine girince çalışır. Yakalama aşaması yoktur. Onun yerine, `onMouseLeave` ve `onMouseEnter` çıkış yapılan elemandan giriş yapılan elemana doğru yayılır.
* [`onMouseLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseleave_event): Bir [`MouseEvent` yönetici](#mouseevent-handler) fonksiyonu. İmleç bir elemanın dışına çıkınca çalışır. Yakalama aşaması yoktur. Onun yerine, `onMouseLeave` ve `onMouseEnter` çıkış yapılan elemandan giriş yapılan elemana doğru yayılır.
* [`onMouseMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mousemove_event): Bir [`MouseEvent` yönetici](#mouseevent-handler) fonksiyonu. İmleç koordinatları değişince çalışır.
* `onMouseMoveCapture`: `onMouseMove`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onMouseOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseout_event): Bir [`MouseEvent` yönetici](#mouseevent-handler) fonksiyonu. İmleç bir elemanın dışına çıkarsa veya bir alt elemanın içine girerse çalışır.
* `onMouseOutCapture`: `onMouseOut`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onMouseUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/mouseup_event): Bir [`MouseEvent` yönetici](#mouseevent-handler) fonksiyonu. Bastığınız imleçten elinizi çekince çalışır.
* `onMouseUpCapture`: `onMouseUp`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onPointerCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointercancel_event): Bir [`PointerEvent` yönetici](#pointerevent-handler) fonksiyonu. Tarayıcı bir imleç etkileşimini iptal edince çalışır.
* `onPointerCancelCapture`: `onPointerCancel`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onPointerDown`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerdown_event): Bir [`PointerEvent` yönetici](#pointerevent-handler) fonksiyonu. Bir imleç aktif hale gelince çalışır.
* `onPointerDownCapture`: `onPointerDown`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onPointerEnter`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerenter_event): Bir [`PointerEvent` yönetici](#pointerevent-handler) fonksiyonu. Bir imleç bir elemanın içine girince çalışır. Yakalama aşaması yoktur. Onun yerine, `onPointerLeave` ve `onPointerEnter` çıkış yapılan elemandan giriş yapılan elemana doğru yayılır.
* [`onPointerLeave`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerleave_event): Bir [`PointerEvent` yönetici](#pointerevent-handler) fonksiyonu. Bir imleç bir elemanın dışına çıkınca çalışır. Yakalama aşaması yoktur. Onun yerine, `onPointerLeave` ve `onPointerEnter` çıkış yapılan elemandan giriş yapılan elemana doğru yayılır.
* [`onPointerMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointermove_event): Bir [`PointerEvent` yönetici](#pointerevent-handler) fonksiyonu. İmleç koordinatları değişince çalışır.
* `onPointerMoveCapture`: `onPointerMove`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onPointerOut`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event): Bir [`PointerEvent` yönetici](#pointerevent-handler) fonksiyonu. İmleç bir elemanın dışına çıkınca, imleç etkileşimi iptal edilirse ve [diğer birkaç sebepten](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerout_event) ötürü çalışır.
* `onPointerOutCapture`: `onPointerOut`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onPointerUp`](https://developer.mozilla.org/en-US/docs/Web/API/Element/pointerup_event): Bir [`PointerEvent` yönetici](#pointerevent-handler) fonksiyonu. İmleç artık aktif değilse çalışır.
* `onPointerUpCapture`: `onPointerUp`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onPaste`](https://developer.mozilla.org/en-US/docs/Web/API/Element/paste_event): Bir [`ClipboardEvent` yönetici](#clipboardevent-handler) fonksiyonu. Kullanıcı panodan bir şeyler yapıştırmayı denerse çalışır.
* `onPasteCapture`: `onPaste`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onScroll`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scroll_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Bir eleman kaydırılınca çalışır. Bu olay kabarmaz.
* `onScrollCapture`: `onScroll`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onSelect`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Girdi gibi düzenlenebilir bir elemanın içindeki seçim değişince çalışır. React `onSelect` olayını, `contentEditable={true}` elemanları için de çalışacak şekilde genişletir. Ek olarak, React bunu boş seçimlerde ve düzenlemelerde (ki bunlar seçimi etkileyebilir) çalışacak şekilde genişletir.
* `onSelectCapture`: `onSelect`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onTouchCancel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchcancel_event): Bir [`TouchEvent` yönetici](#touchevent-handler) fonksiyonu. Tarayıcı bir dokunma etkileşimini iptal edince çalışır.
* `onTouchCancelCapture`: `onTouchCancel`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onTouchEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchend_event): Bir [`TouchEvent` yönetici](#touchevent-handler) fonksiyonu. Bir veya daha fazla dokunma noktası kaldırılınca çalışır.
* `onTouchEndCapture`: `onTouchEnd`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onTouchMove`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchmove_event): Bir [`TouchEvent` yönetici](#touchevent-handler) fonksiyonu. Bir veya daha fazla dokunma noktası hareket ettirilince çalışır.
* `onTouchMoveCapture`: `onTouchMove`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onTouchStart`](https://developer.mozilla.org/en-US/docs/Web/API/Element/touchstart_event): Bir [`TouchEvent` yönetici](#touchevent-handler) fonksiyonu. Bir veya daha fazla dokunma noktası yerleştirildiğinde çalışır.
* `onTouchStartCapture`: `onTouchStart`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onTransitionEnd`](https://developer.mozilla.org/en-US/docs/Web/API/Element/transitionend_event): Bir [`TransitionEvent` yönetici](#transitionevent-handler) fonksiyonu. Bir CSS geçişi tamamlanınca çalışır.
* `onTransitionEndCapture`: `onTransitionEnd`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onWheel`](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event): Bir [`WheelEvent` yönetici](#wheelevent-handler) fonksiyonu. Kullanıcı fare tekerleğini döndürünce çalışır.
* `onWheelCapture`: `onWheel`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`role`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Bir string. Yardımcı teknolojiler için elemanın rolünü açık bir şekilde belirtir.
* [`slot`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles): Bir string. Shadow DOM'u kullanırken slot ismini belirtir. React'ta buna denk bir model genellikle JSX'in prop olarak iletilmesiyle elde edilir. Örneğin, `<Layout left={<Sidebar />} right={<Content />} />`.
* [`spellCheck`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/spellcheck): Bir boolean veya boş. Eğer açık bir şekilde `true` veya `false` olarak ayarlanırsa yazım denetimini etkinleştirir veya devre dışı bırakır.
* [`tabIndex`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex): Bir sayı. Varsayılan Tab tuşu davranışını geçersiz kılar. [`-1` ve `0` dışında değerleri kullanmaktan kaçının.](https://www.tpgi.com/using-the-tabindex-attribute/)
* [`title`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/title): Bir string. Elemanın araç ipucu metnini belirtir.
* [`translate`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/translate): `'yes'` veya `'no'`. `'no'` değerini vermek eleman içeriğinin çevrilmesini engeller.

Prop olarak özel nitelikler de verebilirsiniz, örneğin `ozelprop="herhangiBirDeger"`. Bu, üçüncü parti kütüphaneleri entegre ederken işinize yarayabilir. Özel nitelik isimlerinin küçük harflerle yazılması ve `on` ile başlamaması gerekmektedir. Değer bir stringe dönüştürülecek. Eğer `null` veya `undefined` verirseniz bu özel nitelik kaldırılacaktır.

Şu olaylar yalnızca [`<form>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form) elemanlarında çalışır:

* [`onReset`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/reset_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Form sıfırlanınca çalışır.
* `onResetCapture`: `onReset`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onSubmit`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Form gönderilince çalışır.
* `onSubmitCapture`: `onSubmit`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.

Şu olaylar yalnızca [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) elemanlarında çalışır. Tarayıcı olaylarının aksine, bunlar React'ta kabarırlar:

* [`onCancel`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/cancel_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Kullanıcı diyaloğu kapatmayı deneyince çalışır.
* `onCancelCapture`: `onCancel`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onClose`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Diyalog kapatılınca çalışır.
* `onCloseCapture`: `onClose`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.

Şu olaylar yalnızca [`<details>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details) elemanlarında çalışır. Tarayıcı olaylarının aksine, bunlar React'ta kabarırlar:

* [`onToggle`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDetailsElement/toggle_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Kullanıcı detayların aç-kapa modları arasında geçiş yapınca çalışır.
* `onToggleCapture`: `onToggle`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.

Şu olaylar [`<img>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img), [`<iframe>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe), [`<object>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/object), [`<embed>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/embed), [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link), ve [SVG `<image>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/SVG_Image_Tag) elemanlarında çalışır. Tarayıcı olaylarının aksine, bunlar React'ta kabarırlar:

* `onLoad`: Bir [`Event` yönetici](#event-handler) fonksiyonu. Kaynak yüklenince çalışır.
* `onLoadCapture`: `onLoad`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Kaynak yüklenemeyince çalışır.
* `onErrorCapture`: `onError`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.

Şu olaylar [`<audio>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio) ve [`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) gibi kaynaklarda çalışır. Tarayıcı olaylarının aksine, bunlar React'ta kabarırlar:

* [`onAbort`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/abort_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Kaynak bir hatayla karşılaşmamasına rağmen tam olarak yüklenmediğinde çalışır.
* `onAbortCapture`: `onAbort`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onCanPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplay_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Oynatmaya başlamak için yeterince veri olup, arabelleğe almadan sonuna kadar oynatmaya yetecek kadar veri olmadığı zaman çalışır.
* `onCanPlayCapture`: `onCanPlay`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onCanPlayThrough`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/canplaythrough_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Arabelleğe almadan sonuna kadar oynatmayı mümkün kılacak kadar veri olduğu zaman çalışır.
* `onCanPlayThroughCapture`: `onCanPlayThrough`'nun [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onDurationChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/durationchange_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Medya süresi güncellenince çalışır.
* `onDurationChangeCapture`: `onDurationChange`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onEmptied`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/emptied_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Medya boşaltılınca çalışır.
* `onEmptiedCapture`: `onEmptied`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onEncrypted`](https://w3c.github.io/encrypted-media/#dom-evt-encrypted): Bir [`Event` yönetici](#event-handler) fonksiyonu. Tarayıcı şifrelenmiş bir medyayla karşılaşınca çalışır.
* `onEncryptedCapture`: `onEncrypted`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onEnded`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ended_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Oynatacak bir şey kalmadığı için oynatma durunca çalışır.
* `onEndedCapture`: `onEnded`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onError`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/error_event): Bir [`Event` yönetici](#event-handler) fonksiyonu.  Kaynak yüklenemeyince çalışır.
* `onErrorCapture`: `onError`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onLoadedData`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadeddata_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Mevcut oynatma çerçevesi yüklenince çalışır.
* `onLoadedDataCapture`: `onLoadedData`'nın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onLoadedMetadata`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadedmetadata_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Üstveri yüklenince çalışır.
* `onLoadedMetadataCapture`: `onLoadedMetadata`'nın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onLoadStart`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/loadstart_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Tarayıcı, kaynağı yüklemeye başlayınca çalışır.
* `onLoadStartCapture`: `onLoadStart`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onPause`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Medya duraklatılınca çalışır.
* `onPauseCapture`: `onPause`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onPlay`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Medya duraklatmadan çıkınca çalışır.
* `onPlayCapture`: `onPlay`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onPlaying`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playing_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Medya çalmaya başlayınca veya baştan başlayınca çalışır.
* `onPlayingCapture`: `onPlaying`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onProgress`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/progress_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Kaynak yüklenirken aralıklı olarak çalışır.
* `onProgressCapture`: `onProgress`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onRateChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/ratechange_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Çalma hızı değişince çalışır.
* `onRateChangeCapture`: `onRateChange`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* `onResize`: Bir [`Event` yönetici](#event-handler) fonksiyonu. Video boyutu değişince çalışır.
* `onResizeCapture`: `onResize`'ın [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onSeeked`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeked_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Arama (seeking) işlemi tamamlanınca çalışır.
* `onSeekedCapture`: `onSeeked`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onSeeking`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/seeking_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Arama (seeking) işlemi başlayınca çalışır.
* `onSeekingCapture`: `onSeeking`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onStalled`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/stalled_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Tarayıcı veri beklerken takılı kalınca çalışır.
* `onStalledCapture`: `onStalled`'un [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onSuspend`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/suspend_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Kaynak yükleme asılı kalınca çalışır.
* `onSuspendCapture`: `onSuspend`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onTimeUpdate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/timeupdate_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Mevcut oynatma zamanı güncellenince çalışır.
* `onTimeUpdateCapture`: `onTimeUpdate`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onVolumeChange`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/volumechange_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Videonun sesi değişince çalışır.
* `onVolumeChangeCapture`: `onVolumeChange`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.
* [`onWaiting`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/waiting_event): Bir [`Event` yönetici](#event-handler) fonksiyonu. Oynatma geçici veri eksikliğinden dolayı durunca çalışır.
* `onWaitingCapture`: `onWaiting`'in [yakalama aşamasında](/learn/responding-to-events#capture-phase-events) çalışan versiyonu.

#### Uyarılar {/*common-caveats*/}

- Aynı anda hem `children` hem de `dangerouslySetInnerHTML` kullanamazsınız.
- Bazı olaylar (`onAbort` ve `onLoad` gibi) tarayıcıda kabarmaz ama React'ta kabarır.

---

### `ref` callback fonksiyonu {/*ref-callback*/}

`ref` niteliğine, bir ref nesnesi yerine ([`useRef`](/reference/react/useRef#manipulating-the-dom-with-a-ref) tarafından döndürülen gibi) bir fonksiyon verebilirsiniz.

```js
<div ref={(node) => {
  console.log('Bağlı', node);

  return () => {
    console.log('Temizlik', node)
  }
}}>
```
[`ref` geri çağırma fonksiyonunun kullanım örneğine bakın.](/learn/manipulating-the-dom-with-refs#how-to-manage-a-list-of-refs-using-a-ref-callback)

`<div>` DOM düğümü ekrana eklendiğinde, React `ref` geri çağırma fonksiyonunuzu DOM `node` parametresiyle çağıracaktır. O `<div>` DOM düğümü kaldırıldığında, React geri çağırmadan döndürülen temizlik fonksiyonunu çağıracaktır.

React ayrıca, *farklı* bir `ref` geri çağırma fonksiyonu geçtiğinizde de `ref` geri çağırmanızı çağıracaktır. Yukarıdaki örnekte, `(node) => { ... }` her render işleminde farklı bir fonksiyondur. Bileşen yeniden render edildiğinde, *önceki* fonksiyon `null` parametresiyle çağrılacak ve *sonraki* fonksiyon DOM düğümüyle çağrılacaktır.

#### Parametreler {/*ref-callback-parameters*/}

* `node`: Bir DOM düğümü. `ref` eklenirken, React size DOM düğümünü iletecektir. Her render işleminde `ref` geri çağırma fonksiyonu için aynı fonksiyon referansını geçmediğiniz sürece, geri çağırma fonksiyonu her bileşen yeniden render edildiğinde geçici olarak temizlenip yeniden oluşturulacaktır.

<Note>

#### React 19, `ref` geri çağırmaları için temizlik fonksiyonları ekledi. {/*react-19-added-cleanup-functions-for-ref-callbacks*/}

Geriye dönük uyumluluğu desteklemek için, `ref` geri çağırmasından bir temizlik fonksiyonu döndürülmezse, `ref` ayrıldığında `node` ile `null` çağrılacaktır. Bu davranış gelecekteki bir sürümde kaldırılacaktır.

</Note>

#### Döndürülenler {/*returns*/}

* **isteğe bağlı** `temizlik fonksiyonu`: `ref` ayrıldığında, React temizlik fonksiyonunu çağıracaktır. Eğer `ref` geri çağırmasından bir fonksiyon döndürülmezse, React, `ref` ayrıldığında geri çağırmayı tekrar `null` parametresiyle çağıracaktır. Bu davranış gelecekteki bir sürümde kaldırılacaktır.

#### Uyarılar {/*caveats*/}

* Strict Mode etkinleştirildiğinde, React **ilk gerçek kurululumdan önce bir ekstra sadece geliştirme amaçlı kurulum+temizlik döngüsü çalıştıracaktır**. Bu, temizlik mantığınızın kurulum mantığını "yansıttığını" ve kurulumun yaptığı her şeyi durdurup geri aldığından emin olan bir stres testidir. Bu, bir problem oluşturuyorsa temizlik fonksiyonunu uygulayın.
* *Farklı* bir `ref` geri çağırma fonksiyonu geçtiğinizde, React, sağlanmışsa *önceki* geri çağırmanın temizlik fonksiyonunu çağıracaktır. Eğer temizlik fonksiyonu tanımlanmazsa, `ref` geri çağırması `null` parametresiyle çağrılacaktır. *Sonraki* fonksiyon ise DOM düğümü ile çağrılacaktır.

---

### React olay nesnesi {/*react-event-object*/}

Olay yöneticileriniz bir *React olay nesnesi* alacaktır. Buna bazen "sentetik olay" da denir.

```js
<button onClick={e => {
  console.log(e); // React olay nesnesi
}} />
```

Altta yatan DOM olaylarıyla aynı standartlara uyar ama bazı tarayıcı tutarsızlıklarına çözüm sağlar.

Bazı React olayları tarayıcının yerel olaylarıyla birebir eşleşmez. Örneğin `onMouseLeave`'de `e.nativeEvent` bir `mouseout` olayına işaret edecektir. Birebir eşleşme açık API'ye dahil değildir ve gelecekte değişebilir. Eğer herhangi bir sebeple altta yatan tarayıcı olayına ihtiyacınız varsa `e.nativeEvent`'ten ulaşabilirsiniz.

#### Özellikler {/*react-event-object-properties*/}

React olay nesneleri bazı standart [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) özelliklerini uygular:

* [`bubbles`](https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles): Bir boolean. Olayın DOM boyunca kabarıp kabarmadığını döndürür.
* [`cancelable`](https://developer.mozilla.org/en-US/docs/Web/API/Event/cancelable): Bir boolean. Olayın iptal edip edilemediğini döndürür.
* [`currentTarget`](https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget): Bir DOM düğümü. Mevcut yöneticinin React ağacında bağlı olduğu düğümü döndürür.
* [`defaultPrevented`](https://developer.mozilla.org/en-US/docs/Web/API/Event/defaultPrevented): Bir boolean. `preventDefault`'un çağırılıp çağırılmadığını döndürür.
* [`eventPhase`](https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase): Bir sayı. Olayın halihazırda bulunduğu aşamayı döndürür.
* [`isTrusted`](https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted): Bir boolean. Olayın kullanıcı tarafından oluşturulup oluşturulmadığını döndürür.
* [`target`](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): Bir DOM düğümü. Olayın gerçekleştiği düğümü döndürür (uzak bir alt eleman olabilir).
* [`timeStamp`](https://developer.mozilla.org/en-US/docs/Web/API/Event/timeStamp): Bir sayı. Olayın gerçekleştiği zamanı döndürür.

Ek olarak, React olay nesneleri şu özellikleri de sağlar:

* `nativeEvent`: Bir DOM [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event)'i. Orijinal tarayıcı olay nesnesidir.

#### Metotlar {/*react-event-object-methods*/}

React olay nesneleri bazı standart [`Event`](https://developer.mozilla.org/en-US/docs/Web/API/Event) metotlarını uygular:

* [`preventDefault()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault): Olay için varsayılan tarayıcı aksiyonunu engeller.
* [`stopPropagation()`](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation): Olayın React ağacı boyunca yayılmasını durdurur.

Ek olarak, React olay nesneleri şu metotları da sağlar:

* `isDefaultPrevented()`: `preventDefault`'un çağırılıp çağırılmadığını gösteren bir boolean döndürür.
* `isPropagationStopped()`: `stopPropagation`'ın çağırılıp çağırılmadığını gösteren bir boolean döndürür.
* `persist()`: React DOM'uyla kullanılmaz. React Native'de, olaydan sonra olayın özelliklerine ulaşmak için bunu çağırın.
* `isPersistent()`: React DOM'uyla kullanılmaz. React Native'de, `persist`'in çağırılıp çağırılmadığını döndürür.

#### Uyarılar {/*react-event-object-caveats*/}

* `currentTarget`, `eventPhase`, `target`, ve `type`'ın değerleri React kodunuzun beklediği değerleri yansıtır. React aslında olay yöneticilerini kökte bağlar ama bu React'ın olay nesnelerine yansıtılmaz. Örneğin, `e.currentTarget` altta yatan `e.nativeEvent.currentTarget` ile aynı olmayabilir. Polyfill yapılmış olaylarda `e.type` (React olay tipi), `e.nativeEvent.type`'tan (altta yatan tip) farklı olabilir.

---

### `AnimationEvent` yönetici fonksiyonu {/*animationevent-handler*/}

[CSS animasyonu](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) olayları için bir olay yöneticisi tipi.

```js
<div
  onAnimationStart={e => console.log('onAnimationStart')}
  onAnimationIteration={e => console.log('onAnimationIteration')}
  onAnimationEnd={e => console.log('onAnimationEnd')}
/>
```

#### Parametreler {/*animationevent-handler-parameters*/}

* `e`: Şu ekstra [`AnimationEvent`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent) özelliklerine sahip olan bir [React olay nesnesi](#react-event-object):
  * [`animationName`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/animationName)
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/elapsedTime)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEvent/pseudoElement)

---

### `ClipboardEvent` yönetici fonksiyonu {/*clipboadevent-handler*/}

[Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) olayları için bir olay yöneticisi tipi.

```js
<input
  onCopy={e => console.log('onCopy')}
  onCut={e => console.log('onCut')}
  onPaste={e => console.log('onPaste')}
/>
```

#### Parametreler {/*clipboadevent-handler-parameters*/}

* `e`: Şu ekstra [`ClipboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent) özelliklerine sahip olan bir [React olay nesnesi](#react-event-object):

  * [`clipboardData`](https://developer.mozilla.org/en-US/docs/Web/API/ClipboardEvent/clipboardData)

---

### `CompositionEvent` yönetici fonksiyonu {/*compositionevent-handler*/}

[Girdi metodu düzenleyicisi (IME)](https://developer.mozilla.org/en-US/docs/Glossary/Input_method_editor) olayları için bir olay yöneticisi tipi.

```js
<input
  onCompositionStart={e => console.log('onCompositionStart')}
  onCompositionUpdate={e => console.log('onCompositionUpdate')}
  onCompositionEnd={e => console.log('onCompositionEnd')}
/>
```

#### Parametreler {/*compositionevent-handler-parameters*/}

* `e`: Şu ekstra [`CompositionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent) özelliklerine sahip olan bir [React olay nesnesi](#react-event-object):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent/data)

---

### `DragEvent` yönetici fonksiyonu {/*dragevent-handler*/}

[HTML Sürükle ve Bırak API'si](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API) olayları için bir olay yöneticisi tipi.

```js
<>
  <div
    draggable={true}
    onDragStart={e => console.log('onDragStart')}
    onDragEnd={e => console.log('onDragEnd')}
  >
    Sürükleme kaynağı
  </div>

  <div
    onDragEnter={e => console.log('onDragEnter')}
    onDragLeave={e => console.log('onDragLeave')}
    onDragOver={e => { e.preventDefault(); console.log('onDragOver'); }}
    onDrop={e => console.log('onDrop')}
  >
    Bırakma hedefi
  </div>
</>
```

#### Parametreler {/*dragevent-handler-parameters*/}

* `e`: Şu ekstra [`DragEvent`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent) özelliklerine sahip olan bir [React olay nesnesi](#react-event-object):
  * [`dataTransfer`](https://developer.mozilla.org/en-US/docs/Web/API/DragEvent/dataTransfer)

  Ayrıca kalıtılmış [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) özellikleri de buna dahildir:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Ayrıca kalıtılmış [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) özellikleri de buna dahildir:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `FocusEvent` yönetici fonksiyonu {/*focusevent-handler*/}

Odaklanma olayları için bir olay yöneticisi tipi.

```js
<input
  onFocus={e => console.log('onFocus')}
  onBlur={e => console.log('onBlur')}
/>
```

[Şu örneğe göz atın.](#handling-focus-events)

#### Parametreler {/*focusevent-handler-parameters*/}

* `e`: Şu ekstra [`FocusEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent) özelliklerine sahip olan bir [React olay nesnesi](#react-event-object):
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/FocusEvent/relatedTarget)

  Ayrıca kalıtılmış [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) özellikleri de buna dahildir:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `Event` yönetici fonksiyonu {/*event-handler*/}

Genel olaylar için bir olay yöneticisi tipi.

#### Parametreler {/*event-handler-parameters*/}

* `e`: Ek özellikleri olmayan bir [React olay nesnesi](#react-event-object).

---

### `InputEvent` yönetici fonksiyonu {/*inputevent-handler*/}

`onBeforeInput` olayı için bir olay yöneticisi tipi.

```js
<input onBeforeInput={e => console.log('onBeforeInput')} />
```

#### Parametreler {/*inputevent-handler-parameters*/}

* `e`: Şu ekstra [`InputEvent`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent) özelliklerine sahip olan bir [React olay nesnesi](#react-event-object):
  * [`data`](https://developer.mozilla.org/en-US/docs/Web/API/InputEvent/data)

---

### `KeyboardEvent` yönetici fonksiyonu {/*keyboardevent-handler*/}

Klavye olayları için bir olay yöneticisi tipi.

```js
<input
  onKeyDown={e => console.log('onKeyDown')}
  onKeyUp={e => console.log('onKeyUp')}
/>
```

[Şu örneğe göz atın.](#handling-keyboard-events)

#### Parametreler {/*keyboardevent-handler-parameters*/}

* `e`: Şu ekstra [`KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) özelliklerine sahip olan bir [React olay nesnesi](#react-event-object):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/altKey)
  * [`charCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/charCode)
  * [`code`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/ctrlKey)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState)
  * [`key`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
  * [`keyCode`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode)
  * [`locale`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/locale)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/metaKey)
  * [`location`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location)
  * [`repeat`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey)
  * [`which`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/which)

  Ayrıca kalıtılmış [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) özellikleri de buna dahildir:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `MouseEvent` yönetici fonksiyonu {/*mouseevent-handler*/}

Fare olayları için bir olay yöneticisi tipi.

```js
<div
  onClick={e => console.log('onClick')}
  onMouseEnter={e => console.log('onMouseEnter')}
  onMouseOver={e => console.log('onMouseOver')}
  onMouseDown={e => console.log('onMouseDown')}
  onMouseUp={e => console.log('onMouseUp')}
  onMouseLeave={e => console.log('onMouseLeave')}
/>
```

[Şu örneğe göz atın.](#handling-mouse-events)

#### Parametreler {/*mouseevent-handler-parameters*/}

* `e`: Şu ekstra [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) özelliklerine sahip olan bir [React olay nesnesi](#react-event-object):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Ayrıca kalıtılmış [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) özellikleri de buna dahildir:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `PointerEvent` yönetici fonksiyonu {/*pointerevent-handler*/}

[İmleç olayları](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events) için bir olay yöneticisi tipi.

```js
<div
  onPointerEnter={e => console.log('onPointerEnter')}
  onPointerMove={e => console.log('onPointerMove')}
  onPointerDown={e => console.log('onPointerDown')}
  onPointerUp={e => console.log('onPointerUp')}
  onPointerLeave={e => console.log('onPointerLeave')}
/>
```

[Şu örneğe göz atın.](#handling-pointer-events)

#### Parametreler {/*pointerevent-handler-parameters*/}

* `e`: Şu ekstra [`PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) özelliklerine sahip olan bir [React olay nesnesi](#react-event-object):
  * [`height`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/height)
  * [`isPrimary`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/isPrimary)
  * [`pointerId`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId)
  * [`pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType)
  * [`pressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure)
  * [`tangentialPressure`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tangentialPressure)
  * [`tiltX`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltX)
  * [`tiltY`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/tiltY)
  * [`twist`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/twist)
  * [`width`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/width)

  Ayrıca kalıtılmış [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) özellikleri de buna dahildir:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Ayrıca kalıtılmış [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) özellikleri de buna dahildir:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TouchEvent` yönetici fonksiyonu {/*touchevent-handler*/}

[Dokunma olayları](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) için bir olay yöneticisi tipi.

```js
<div
  onTouchStart={e => console.log('onTouchStart')}
  onTouchMove={e => console.log('onTouchMove')}
  onTouchEnd={e => console.log('onTouchEnd')}
  onTouchCancel={e => console.log('onTouchCancel')}
/>
```

#### Parametreler {/*touchevent-handler-parameters*/}

* `e`: Şu ekstra [`TouchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent) özelliklerine sahip olan bir [React olay nesnesi](#react-event-object):
  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/altKey)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/ctrlKey)
  * [`changedTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/changedTouches)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/metaKey)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/shiftKey)
  * [`touches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/touches)
  * [`targetTouches`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/targetTouches)
  
  Ayrıca kalıtılmış [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) özellikleri de buna dahildir:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `TransitionEvent` yönetici fonksiyonu {/*transitionevent-handler*/}

CSS geçiş olayları için bir olay yöneticisi tipi.

```js
<div
  onTransitionEnd={e => console.log('onTransitionEnd')}
/>
```

#### Parametreler {/*transitionevent-handler-parameters*/}

* `e`: Şu ekstra [`TransitionEvent`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent) özelliklerine sahip olan bir [React olay nesnesi](#react-event-object):
  * [`elapsedTime`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/elapsedTime)
  * [`propertyName`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/propertyName)
  * [`pseudoElement`](https://developer.mozilla.org/en-US/docs/Web/API/TransitionEvent/pseudoElement)

---

### `UIEvent` yönetici fonksiyonu {/*uievent-handler*/}

Genel UI olayları için bir olay yöneticisi tipi.

```js
<div
  onScroll={e => console.log('onScroll')}
/>
```

#### Parametreler {/*uievent-handler-parameters*/}

* `e`: Şu ekstra [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) özelliklerine sahip olan bir [React olay nesnesi](#react-event-object):
  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

### `WheelEvent` yönetici fonksiyonu {/*wheelevent-handler*/}

`onWheel` olayı için bir olay yöneticisi tipi.

```js
<div
  onWheel={e => console.log('onWheel')}
/>
```

#### Parametreler {/*wheelevent-handler-parameters*/}

* `e`: Şu ekstra [`WheelEvent`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent) özelliklerine sahip olan bir [React olay nesnesi](#react-event-object):
  * [`deltaMode`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaMode)
  * [`deltaX`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaX)
  * [`deltaY`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY)
  * [`deltaZ`](https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaZ)


  Ayrıca kalıtılmış [`MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) özellikleri de buna dahildir:

  * [`altKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/altKey)
  * [`button`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button)
  * [`buttons`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons)
  * [`ctrlKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/ctrlKey)
  * [`clientX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX)
  * [`clientY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY)
  * [`getModifierState(key)`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/getModifierState)
  * [`metaKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/metaKey)
  * [`movementX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementX)
  * [`movementY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/movementY)
  * [`pageX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX)
  * [`pageY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageY)
  * [`relatedTarget`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/relatedTarget)
  * [`screenX`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenX)
  * [`screenY`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/screenY)
  * [`shiftKey`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/shiftKey)

  Ayrıca kalıtılmış [`UIEvent`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent) özellikleri de buna dahildir:

  * [`detail`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/detail)
  * [`view`](https://developer.mozilla.org/en-US/docs/Web/API/UIEvent/view)

---

## Kullanım {/*usage*/}

### CSS stillerinin uygulanması {/*applying-css-styles*/}

React'ta bir CSS sınıfını [`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) kullanarak belirtirsiniz. HTML'deki `class` niteliği gibi çalışır:

```js
<img className="avatar" />
```

Sonra bu sınıf için CSS kurallarını ayrı bir CSS dosyasına yazarsınız:

```css
/* CSS dosyanız */
.avatar {
  border-radius: 50%;
}
```

React, CSS dosyalarını nasıl ekleyeceğinizle ilgili sıkı kurallar koymaz. En basit yol, HTML'inize bir[`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) etiketi eklemektir. Eğer bir derleme aracı veya bir framework kullanırsanız, projenize nasıl CSS dosyası ekleyeceğinizi öğrenmek için ilgili dokümantasyona danışabilirsiniz.

Bazen stil değerleri veriye bağlıdır. Dinamik bir şekilde stillendirmek için `style` niteliğini kullanın:

```js {3-6}
<img
  className="avatar"
  style={{
    width: user.imageSize,
    height: user.imageSize
  }}
/>
```


Yukarıdaki örnekteki `style={{}}` özel bir söz dizimi değil, `style={ }` [JSX süslü parantezleri](/learn/javascript-in-jsx-with-curly-braces) içinde yer alan sıradan bir `{}` nesnesidir. Stilleriniz JavaScript değişkenlerine bağlı olduğunda yalnızca `style` kullanmanızı öneriyoruz.

<Sandpack>

```js src/App.js
import Avatar from './Avatar.js';

const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function App() {
  return <Avatar user={user} />;
}
```

```js src/Avatar.js active
export default function Avatar({ user }) {
  return (
    <img
      src={user.imageUrl}
      alt={user.name + ' profil fotoğrafı'}
      className="avatar"
      style={{
        width: user.imageSize,
        height: user.imageSize
      }}
    />
  );
}
```

```css src/styles.css
.avatar {
  border-radius: 50%;
}
```

</Sandpack>

<DeepDive>

#### Birden fazla CSS sınıfı koşulsal olarak nasıl uygulanır? {/*how-to-apply-multiple-css-classes-conditionally*/}

CSS sınıflarını koşulsal olarak uygulamak için `className` string'ini JavaScript'i kullanarak kendiniz üretmeniz gerekiyor.

Örneğin, `className={'row ' + (isSelected ? 'selected': '')}`, `isSelected`'ın `true` olup olmamasına göre `className="row"` veya `className="row selected"` üretecektir. 

Bunu daha okunaklı hale getirmek için [`classnames`](https://github.com/JedWatson/classnames) gibi minik yardımcı bir kütüphane kullanabilirsiniz:

```js
import cn from 'classnames';

function Row({ isSelected }) {
  return (
    <div className={cn('row', isSelected && 'selected')}>
      ...
    </div>
  );
}
```

Özellikle birden fazla koşulsal sınıfınız varsa kullanışlı oluyor:

```js
import cn from 'classnames';

function Row({ isSelected, size }) {
  return (
    <div className={cn('row', {
      selected: isSelected,
      large: size === 'large',
      small: size === 'small',
    })}>
      ...
    </div>
  );
}
```

</DeepDive>

---

### Bir DOM düğümünü ref ile manipüle etme {/*manipulating-a-dom-node-with-a-ref*/}

Bazı durumlarda tarayıcıdaki DOM düğümünün JSX'teki bir etiket ile ilişkilendirilmesine ihtiyaç duyacaksınız. Örneğin, eğer bir butona tıkladığınızda bir `<input>`'a odaklanmak istiyorsanız, tarayıcıdaki `<input>` DOM düğümünde [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus)'u çağırmanız gerekiyor.

Bir etikette, tarayıcıdaki DOM düğümünü elde etmek için, [bir ref tanımlayın](/reference/react/useRef) ve bunu, o etikete `ref` niteliği olarak verin:

```js {7}
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);
  // ...
  return (
    <input ref={inputRef} />
    // ...
```

React, DOM düğümü ekrana render edildikten sonra onu `inputRef.current`'ın içine koyacaktır.

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Girdiye odaklan
      </button>
    </>
  );
}
```

</Sandpack>

[Refs ile DOM manipülasyonu](/learn/manipulating-the-dom-with-refs) hakkında daha fazla bilgi edinin ve [daha fazla örneğe göz atın.](/reference/react/useRef#usage)

Daha ileri düzey kullanım durumları için `ref` niteliği ayrıca bir [callback fonksiyonu](#ref-callback) da kabul eder.

---

### İç HTML'i tehlikeli bir şekilde ayarlama {/*dangerously-setting-the-inner-html*/}

Bir elemana şu şekilde düz bir HTML string'i verebilirsiniz:

```js
const markup = { __html: '<p>düz bir html içeriği</p>' };
return <div dangerouslySetInnerHTML={markup} />;
```

**Bu tehlikelidir. Altta yatan DOM'un [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML) özelliğinde olduğu gibi, son derece dikkatli kullanmanız gerekir. Eğer ki biçimlendirme (markup) çok güvenilir bir kaynaktan gelmiyorsa, bu şekilde bir [XSS](https://tr.wikipedia.org/wiki/Siteler_aras%C4%B1_betik_%C3%A7al%C4%B1%C5%9Ft%C4%B1rma) zayıflığı oluşturmak gereksizdir.**

Örneğin, eğer Markdown'ı HTML'e dönüştüren bir Markdown kütüphanesi kullanıyorsanız, ayrıştırıcısında herhangi bir hata olmadığına güveniyorsanız ve kullanıcı yalnızca kendi girdisini görüyorsa, sonuçta oluşan HTML'i şöyle görüntüleyebilirsiniz:

<Sandpack>

```js
import { useState } from 'react';
import MarkdownPreview from './MarkdownPreview.js';

export default function MarkdownEditor() {
  const [postContent, setPostContent] = useState('_Merhaba,_ **Markdown**!');
  return (
    <>
      <label>
        Herhangi bir markdown girin:
        <textarea
          value={postContent}
          onChange={e => setPostContent(e.target.value)}
        />
      </label>
      <hr />
      <MarkdownPreview markdown={postContent} />
    </>
  );
}
```

```js src/MarkdownPreview.js active
import { Remarkable } from 'remarkable';

const md = new Remarkable();

function renderMarkdownToHTML(markdown) {
  // Bu yöntem, YALNIZCA sonuçta oluşan HTML
  // aynı kullanıcıya gösterildiği ve Markdown 
  // ayrıştırıcısında hata olmadığına
  // emin olduğunuz için güvenlidir.
  const renderedHTML = md.render(markdown);
  return {__html: renderedHTML};
}

export default function MarkdownPreview({ markdown }) {
  const markup = renderMarkdownToHTML(markdown);
  return <div dangerouslySetInnerHTML={markup} />;
}
```

```json package.json
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
textarea { display: block; margin-top: 5px; margin-bottom: 10px; }
```

</Sandpack>

`{__html}` nesnesi, yukarıdaki örnekte `renderMarkdownToHTML` olduğu gibi, HTML'nin oluşturulduğu yere mümkün olduğunca yakın oluşturulmalıdır. Bu, kodunuzda kullanılan tüm ham HTML'nin açıkça bu şekilde işaretlenmesini ve yalnızca HTML içermesini beklediğiniz değişkenlerin `dangerouslySetInnerHTML`'ye iletilmesini sağlar. Nesnenin satır içi olarak `<div dangerouslySetInnerHTML={{__html: markup}} />` gibi oluşturulması önerilmez.

Gelişigüzel HTML'i render etmenin neden tehlikeli olduğunu görmek için yukarıdaki kod yerine şunu koyun:

```js {1-4,7,8}
const post = {
  // Bu içeriğin veritabanında saklandığını hayal edelim.
  content: `<img src="" onerror='alert("hacklendiniz!!!")'>`
};

export default function MarkdownPreview() {
  // 🔴 GÜVENLİK AÇIĞI: dangerouslySetInnerHTML'e güvenilir olmayan girdi veriyorsunuz
  const markup = { __html: post.content };
  return <div dangerouslySetInnerHTML={markup} />;
}
```

HTML'de gömülü olan kod çalışacak. Bir hacker, bu güvenlik açığını kullanıcı bilgilerini çalmak veya kendi çıkarları için kullanabilir. **`dangerouslySetInnerHTML`'i yalnızca güvenilir ve temizlenmiş verilerle kullanın.**

---

### Fare olaylarını yönetme {/*handling-mouse-events*/}

Bu örnek bazı yaygın [fare olaylarını](#mouseevent-handler) ve ne zaman çalıştıklarını gösteriyor.

<Sandpack>

```js
export default function MouseExample() {
  return (
    <div
      onMouseEnter={e => console.log('onMouseEnter (üst eleman)')}
      onMouseLeave={e => console.log('onMouseLeave (üst eleman)')}
    >
      <button
        onClick={e => console.log('onClick (birinci buton)')}
        onMouseDown={e => console.log('onMouseDown (birinci buton)')}
        onMouseEnter={e => console.log('onMouseEnter (birinci buton)')}
        onMouseLeave={e => console.log('onMouseLeave (birinci buton)')}
        onMouseOver={e => console.log('onMouseOver (birinci buton)')}
        onMouseUp={e => console.log('onMouseUp (birinci buton)')}
      >
        Birinci buton
      </button>
      <button
        onClick={e => console.log('onClick (ikinci buton)')}
        onMouseDown={e => console.log('onMouseDown (ikinci buton)')}
        onMouseEnter={e => console.log('onMouseEnter (ikinci buton)')}
        onMouseLeave={e => console.log('onMouseLeave (ikinci buton)')}
        onMouseOver={e => console.log('onMouseOver (ikinci buton)')}
        onMouseUp={e => console.log('onMouseUp (ikinci buton)')}
      >
        İkinci buton
      </button>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### İmleç olaylarını yönetme {/*handling-pointer-events*/}

Bu örnek bazı yaygın [imleç olayarını](#pointerevent-handler) ve ne zaman çalıştıklarını gösteriyor.

<Sandpack>

```js
export default function PointerExample() {
  return (
    <div
      onPointerEnter={e => console.log('onPointerEnter (üst eleman)')}
      onPointerLeave={e => console.log('onPointerLeave (üst eleman)')}
      style={{ padding: 20, backgroundColor: '#ddd' }}
    >
      <div
        onPointerDown={e => console.log('onPointerDown (birinci alt eleman)')}
        onPointerEnter={e => console.log('onPointerEnter (birinci alt eleman)')}
        onPointerLeave={e => console.log('onPointerLeave (birinci alt eleman)')}
        onPointerMove={e => console.log('onPointerMove (birinci alt eleman)')}
        onPointerUp={e => console.log('onPointerUp (birinci alt eleman)')}
        style={{ padding: 20, backgroundColor: 'lightyellow' }}
      >
        Birinci alt eleman
      </div>
      <div
        onPointerDown={e => console.log('onPointerDown (ikinci alt eleman)')}
        onPointerEnter={e => console.log('onPointerEnter (ikinci alt eleman)')}
        onPointerLeave={e => console.log('onPointerLeave (ikinci alt eleman)')}
        onPointerMove={e => console.log('onPointerMove (ikinci alt eleman)')}
        onPointerUp={e => console.log('onPointerUp (ikinci alt eleman)')}
        style={{ padding: 20, backgroundColor: 'lightblue' }}
      >
        İkinci alt eleman
      </div>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Odaklanma olaylarını yönetme {/*handling-focus-events*/}

[Odaklanma olayları](#focusevent-handler) React'ta kabarırlar. Odaklanma ve bulandırma olaylarının üst elemanın dışında oluşup oluşmadığını ayırt etmek için `currentTarget` ve `relatedTarget`'i kullanabilirsiniz. Aşağıdaki örnek, bir alt elemana veya üst elemana odaklanmanın ve tüm alt ağaca giren veya çıkan odaklanmaların nasıl tespit edileceğini gösteriyor.

<Sandpack>

```js
export default function FocusExample() {
  return (
    <div
      tabIndex={1}
      onFocus={(e) => {
        if (e.currentTarget === e.target) {
          console.log('üst elemana odaklanıldı');
        } else {
          console.log(e.target.name, 'alt elemanına odaklanıldı');
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Alt elemanlar arasındaki odağı değiştirirken tetiklenmez
          console.log('odak üst elemana girdi');
        }
      }}
      onBlur={(e) => {
        if (e.currentTarget === e.target) {
          console.log('üst elemandan odak kaldırıldı');
        } else {
          console.log(e.target.name, 'alt elemanından odak kaldırıldı');
        }
        if (!e.currentTarget.contains(e.relatedTarget)) {
          // Alt elemanlar arasındaki odağı değiştirirken tetiklenmez
          console.log('odak üst elemandan çıktı');
        }
      }}
    >
      <label>
        İsim:
        <input name="isim" />
      </label>
      <label>
        Soyisim:
        <input name="soyisim" />
      </label>
    </div>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

---

### Klavye olaylarını yönetme {/*handling-keyboard-events*/}

Bu örnek bazı yaygın [klavye olaylarını](#keyboardevent-handler) ve ne zaman çalıştıklarını gösteriyor.

<Sandpack>

```js
export default function KeyboardExample() {
  return (
    <label>
      İsim:
      <input
        name="isim"
        onKeyDown={e => console.log('onKeyDown:', e.key, e.code)}
        onKeyUp={e => console.log('onKeyUp:', e.key, e.code)}
      />
    </label>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>
