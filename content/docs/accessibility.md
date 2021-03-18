---
id: accessibility
title: Accessibility
permalink: docs/accessibility.html
---

## Niçin Erişilebilirlik? {#why-accessibility}

([**a11y**](https://en.wiktionary.org/wiki/a11y)) olarak da anılan web erişilebilirliği, herkes tarafından kullanılabilir web sitelerinin tasarımı ve oluşturulmasıdır. Erişilebilirlik desteği, yardımcı teknolojinin web sayfalarını yorumlamasına izin vermek için gereklidir.

React, sıklıkla standart HTML tekniklerini kullanarak, tamamen erişilebilir web siteleri oluşturmayı destekler.

## Standards and Guidelines {#standards-and-guidelines}

### WCAG {#wcag}

[Web İçeriği Erişilebilirlik Yönergeleri](https://www.w3.org/WAI/intro/wcag), erişilebilir web siteleri oluşturmak için yönergeler sağlar.

Aşağıdaki WCAG kontrol listeleri genel bir bakış sağlar:

- [Wuhcag'dan WCAG Kontrol Listesi](https://www.wuhcag.com/wcag-checklist/)
- [WebAIM'den WCAG Kontrol Listesi](https://webaim.org/standards/wcag/checklist)
- [A11Y Projesi'nden Kontrol Listesi](https://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

[Web Erişilebilirlik Girişimi - Erişilebilir Zengin İnternet Uygulamaları](https://www.w3.org/WAI/intro/aria) 
belgesi, tamamen erişilebilir JavaScript widgetleri oluşturmak için teknikler içerir.

Tüm `aria- *` HTML özelliklerinin JSX'te tam olarak desteklendiğini unutmayın. React'teki çoğu DOM özellikleri ve öznitelikleri camelCased iken, bu öznitelikler düz HTML'de olduğu gibi hyphen-cased şeklinde olmalıdır (kebab-case, lisp-case, ve benzeri olarak da bilinir):

```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## Semantik HTML {#semantic-html}
Semantik HTML, bir web uygulamasında erişilebilirliğin temelidir. web sitelerimizdeki bilginin anlamını pekiştirmek için, çeşitli HTML öğelerini kullanmak sıklıkla bize ücretsiz olarak erişilebilirlik sağlayacaktır.

- [MDN HTML elements reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

Bazen, React kodumuzun çalışması için JSX'imize `<div>` öğeleri eklediğimizde, HTML'in semantiğini bozarız, özellikle listeler (`<ol>`, `<ul>` ve `<dl>`) ve HTML `<table>` ile çalışırken. 
Bu durumlarda, çoklu öğeleri gruplamak için [React Fragments](/docs/fragments.html) kullanmayı tercih etmelisiniz.

Örneğin,

```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

Başka herhangi bir öğe türünde yapacağınız gibi, bir öğe koleksiyonunu bir fragment array'ine eşleyebilirsiniz :

```javascript{6,9}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (// Kolleksiyonları eşleştirirken, fragmentler de bir `anahtar` prop'a sahip olmalıdır. 
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

Fragment etiketinde herhangi bir prop'a ihtiyacınız olmadığında, eğer arac gerecleriniz onu destekliyorsa [kisa syntax](/docs/fragments.html#short-syntax)'i kullanabilirsiniz:

```javascript{3,6}
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

Daha fazla bilgi için, [Fragmentler dokümantasyonu](/docs/fragments.html)'na bakiniz.

## Erişilebilir Formlar {#accessible-forms}

### Etiketlemek {#labeling}
`<input>` ve `<textarea>` gibi her HTML form kontrolunun, erişilebilir halde etiketlenmiş olması gerekir. Ekran okuyucuları tarafndan da ortaya çıkan, açıklayıcı etiketler sağlamamız gerekir.

Aşağıdaki kaynaklar bize bunun nasıl yapılacağını gösterir:

- [W3C bize öğeleri nasıl etiketleneceğini gösterir](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WebAIM bize öğelerin nasıl etiketleneceğini gösterir](https://webaim.org/techniques/forms/controls)
- [Paciello Group erişilebilir isimleri açıklar](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

Bu standart HTML uygulamaları doğrudan React'te kullanılabilmesine rağmen, `for` nitelliğinin JSX'de `htmlFor` olarak yazıldığına dikkat edin:

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### Kullanici hatalarini farketmek {#notifying-the-user-of-errors}

Hata durumlarının tüm kullanıcılar tarafından anlaşılması gerekir. 
Aşağıdaki link, hata metinlerinin de ekran okuyucuları tarafından nasıl algılandığını gösterir:

- [W3C, kullanıcı bildirimlerini gösterir](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WebAIM form doğrulamaya bakar](https://webaim.org/techniques/formvalidation/)

## Odak Kontrolü {#focus-control}

Web uygulamanızın yalnızca klavye ile tam olarak çalıştırılabildiğinden emin olun:

- [WebAIM klavye erişilebilirliği hakkında konuşur](https://webaim.org/techniques/keyboard/)

### Klavye odağı ve odak ana hatları {#keyboard-focus-and-focus-outline}

Klavye odağı, klavyeden girişi kabul etmek için seçilen DOM'daki varolan öğeye başvurur. Bunu her yerde aşağıdaki resimde gösterilene benzer bir odak anahat olarak görürüz:

<img src="../images/docs/keyboard-focus.png" alt="Blue keyboard focus outline around a selected link." />

Eger onu başka bir odak anahat uygulamasıyla değiştiriyorsanız, sadece bu anahatı kaldıran CSS'si kullanın.

### İstenilen İçeriğe atlama mekanizmaları{#mechanisms-to-skip-to-desired-content}

Klavyede gezinmeye yardımcı olduğundan ve hızlandırdığından, kullanıcıların uygulamanızdaki geçmiş gezinme(navigasyon) bölümlerini atlamasına izin veren bir mekanizma sağlayın.

AtlamaLinkleri (Skiplinks) veya Atlama Navigasyon Linkleri (Skip Navigation Links), klavye kullanicilari sadece sayfa ile etkileşimde bulundukları zaman görünür olan gizli navigasyon linkleiridir. Bunların iç sayfa bağlantıları ve bazı stillerle uygulanması çok kolaydır:

- [WebAIM - Navigasyon Linklerini Atlamak](https://webaim.org/techniques/skipnav/)

Yardımcı teknoloji, kullanıcının bu bölümlere cabuk bir şekilde gezinmesine olanak tanıdığından, sayfa bölümlerini ayırmak için "<main>" ve "<aside>" gibi belirgin isaret öğeleri ve rolleri de kullanın.

Erişilebilirliği geliştirmek için, bu öğelerin kullanımı hakkında daha fazlasını buradan okuyun

- [Erisilebilir Belirgin Isaretler](https://www.scottohara.me/blog/2018/03/03/landmarks.html)

### Programlı olarak odağı yönetmek {#programmatically-managing-focus}

React uygulamamlarımız çalışma süresinde HTML DOM'u degistirir, bazen klavye odağının kaybolmasına veya beklenmedik bir öğeye ayarlanmasına yol açar. Bunu düzeltmek amaciyla, klavye odağını programlı olarak doğru yönde itelemek gerekir. Ornegin, modal penceresi kapatildiktan sonra, bir modal penceresi acan bir butona klavye odagini sifirlatmak.

MDN Web Dokumanlari buna bakar ve [gezinilebilir-klavye JavaScript widgetleri](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)'ni nasil insa edebildigimizi aciklar.

React'te odagi ayarlamak icin [DOM ogelerine Refler](/docs/refs-and-the-dom.html)'i kullnabiliriz.

Bunu kullanarak, öncelikle, bir bileşen sınıfının JSX'indeki bir öğeye bir ref oluştururuz:

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // textInput DOM ogesini depolamak icin bir ref olustur
    this.textInput = React.createRef();
  }
  render() {
  // text input DOM'a bir referans depolamak icin `ref` geri cagriyi kullanin
  // bir instance alanindaki öğe (örneğin, this.textInput).
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

Daha sonra, gerektiğinde bileşenimizde onu başka bir yere odaklayabiliriz:

 ```javascript
 focus() {
   // Açık bir şekilde, ham DOM API'ı kullanarak metin girişine odaklanın
   // Not: DOM düğümünü almak için "current"e erişiyoruz
   this.textInput.current.focus();
 }
 ```

Bazen bir üst bileşenin, bir alt bileşendeki bir öğeye odaginin ayarlanması gerekir. Bunu [DOM reflerini ust bilesenler de ortaya cikartarak](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components) ust ogenin ref'ini alt ogenin DOM düğümüne ileten alt bileşen üzerindeki özel bir destek yoluyla yapabiliriz.

```javascript{4,12,16}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// Simdi gerektiginde odagi ayarlayabilirsiniz.
this.inputElement.current.focus();
```

Bileşenleri genişletmek için bir HOC kullanırken, React'in `forwardRef` fonksiyonu kullanarak [forward the ref](/docs/forwarding-refs.html) sarılmış bileşene iletilmesi önerilir. Eger bir üçüncü taraf HOC, ref iletmeyi  uygulamazsa, yukarıdaki sablon/ornek yine de bir geri cekilme olarak kullanılabilir.

[react-aria-modal](https://github.com/davidtheclark/react-aria-modal), harika bir odak yönetimi örneğidir. Bu, tamamen erişilebilir bir modal penceresinin goreceli olarak nadir bir ornegidir.   
Sadece ilk odagi iptal butonuna ayarlamak (klavye kullanıcısının başarılı eylemi yanlışlıkla etkinleştirmesini engeller) ve klavye odağını modal içinde hapsetmekle kalmaz, onu başlangıçta modali tetikleyen öğeye geri odaklanarak sıfırlar. 

>Not:
>
>Bu çok önemli bir erişilebilirlik özelliği iken, adilce kullanılması da gereken bir tekniktir. Nasıl yapılacağını tahmin etmek için değil, rahatsız edildiğinde klavye odak akışını onarmak için kullanın.
>kullanıcılar uygulamaları kullanmak ister.

## Mouse ve imleç olayları {#mouse-and-pointer-events}

Bir mouse veya imleç olayı aracılığıyla açığa çıkan tüm fonksiyonların yalnızca klavye kullanılarak da erişilebildiğinden emin olun. Sadece imleç cihazına bağlı olarak, klavye kullanıcıları uygulamanızın kullanilamayacağı birçok duruma yonlendirecektir

Bunu gostermek icin, tıklama olaylarının sebep olduğu bozuk erişilebilirliğin verimli bir örneğine bakalım. Bu, bir kullanıcının öğenin dışına tıklayarak, bir anda açılan (popover) pencereyi engellediği dış tıklama sablonudur/ornektir.

<img src="../images/docs/outerclick-with-mouse.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with a mouse showing that the close action works." />

Bu genelliklre popover'i kapatan `window` nesnesine bir `click` olayinin baglanarak uygulanmasidir.

```javascript{12-14,26-30}
class OuterClickExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Select an option</button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Bu mouse gibi imlecli cihaz kullanan kullanicilar icin iyi calisabilir. Ama bunun tek olarak klavye ile çalıştırılması, sonraki öğeye sekme yapıldığında bozuk fonksiyonellige yol acar, cunku `window` nesnesi asla `click` olayini almaz. Bu, kullanıcıların uygulamanızı kullanmasını engelleyen belirsiz fonksiyonellige yol açabilir. 

<img src="../images/docs/outerclick-with-keyboard.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with the keyboard showing the popover not being closed on blur and it obscuring other screen elements." />

Bunun yerine `onBlur` ve `onFocus` gibi, aynı fonksiyonellik uygun olay yoneticilerini kullanarak ulasilabilir:

```javascript{19-29,31-34,37-38,40-41}
class BlurExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  // Bir sonraki tıklamada, setTimeout kullanarak açılır pencereyi kapatıyoruz.
  // Bu gereklidir çünkü önce kontrol etmemiz gerekiyor, eger
  // öğenin başka bir alt öğesine odaklanilmissa, cunku
  // bulanıklık olayı, yeni odak olayından önce tetiklenir.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // Bir alt ogeye odaklanılırsa, açılır pencereyi kapatmayın
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React bulanıklığı köpürterek ve
    // ve olayları üst ogeye odaklayarak bize yardımcı olur
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Select an option
        </button>
        {this.state.isOpen && (
          <ul>
            <li>Option 1</li>
            <li>Option 2</li>
            <li>Option 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Bu kod fonksiyonelligi hem imleçi hem de klavye kullanıcılarına açiga çikartir. Ekran-okuyucu kullanıcılarını desteklemek için eklenen `aria-*` prop'larina da dikkat edin. Basitlik adina, açılır pencere seçeneklerinin `arrow key` etkileşimini etkinleştirmek için klavye olayları uygulanmamıştır.

<img src="../images/docs/blur-popover-close.gif" alt="Hem mouse hem de klavye kullanıcıları için doğru şekilde kapanan bir açılır liste." />

Bu, sadece imleç ve mouse olaylarına bağlı olan klavye kullanıcıları icin fonksiyonelligin bozuldugu birçok duruma bir örnektir. Daima klavye ile test etmek, derhal klavyeye duyarlı olay yoneticilerini kullanarak duzeltilmis olabilen sorunlu bolgeleri vurgular.

## Daha Karisik Widgetler {#more-complex-widgets}

Daha karmaşık bir kullanıcı deneyimi, daha az erişilebilir demek degildir. Erişilebilirlik en kolay şekilde mümkün olabildiğince HTML'ye yakın kodlama ile ulaşilabilir iken, en karmaşık widget bile erişilebilir şekilde kodlanmış olabilir.

Burada [ARIA Durumlari ve Ozellikleri](https://www.w3.org/TR/wai-aria/#states_and_properties) gibi [ARIA Rolleri](https://www.w3.org/TR/wai-aria/#roles)'nin bilgisine gereksinim duyariz. 
Bunlar JSX'te tamamen desteklenmis ve tamamen erişilebilir, yuksek dereceli fonksiyonel React bileşenleri inşa etmemize imkan veren HTML nitelikleriyle dolu araç kutularıdır.

Her cesit widget öğesi türünün belirli bir tasarım sablon/ornek  vardır ve hem kullanicilar hem de kullanici ajanslari gibi olanlar tarafindan, belirli bir sekilde fonksiyon gostermesi beklenir:

- [WAI-ARIA Yazarlık Uygulamaları - Tasarım Desenleri ve Widget'lar](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - ARIA Örnekleri](https://heydonworks.com/article/practical-aria-examples/)
- [Kapsayıcı Bileşenler](https://inclusive-components.design/)

## Dikkat Edilmesi Gereken Diğer Hususlar {#other-points-for-consideration}

### Dilin ayarlanması {#setting-the-language}

Ekran okuyucu yazılımı doğru ses ayarlarını seçmek için bunu kullandığından, sayfa metinlerinin insan dilini belirtin:

- [WebAIM - Dokumantasyon Dili](https://webaim.org/techniques/screenreader/#language)

### Dokuman basligini ayarlamak {#setting-the-document-title}

Dokumanin `<title>`'ini mevcut sayfa içeriğini doğru şekilde tanımlayarak ayarlayın, çünkü bu, kullanıcının mevcut sayfa bağlamından emin olmasını sağlar: burayi yeniden yaz

- [WCAG - Dokuman Başlığı Gereksinimini Anlamak](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

Bunu React'te [React Dokuman Başlığı Bileşeni](https://github.com/gaearon/react-document-title);ini kullanarak ayarlayabiliriz.

### Renk Karsiti {#color-contrast}

Görme yetisi kisitli kullanıcılar tarafından, maksimum düzeyde okunabilmesi için web sitenizdeki tüm okunabilir metinlerin yeterli renk kontrastına sahip olduğundan emin olun:

- [WCAG - Renk Kontrast Gereksinimini Anlama](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [Renk Kontrastı Hakkındaki Her Şey ve Onu Neden Yeniden Düşünmelisiniz](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProjesi -Renk Kontrastı Nedir](https://a11yproject.com/posts/what-is-color-contrast/)

Web sitenizdeki tüm durumlar için uygun renk kombinasyonlarını manuel olarak hesaplamak yorucu olabilir. Oyleyse, bunun yerine [colorable ile tüm erişilebilir bir renk paletini hesaplayın](https://jxnblk.com/colorable/).

Hem aXe hem de WAVE araclari asagida  mentioned below also include color contrast tests and will report on contrast errors.

Kontrast testi becerilerinizi genişletmek istiyorsanız, bu araçları kullanabilirsiniz:

- [WebAIM - Renk Kontrastı Denetleyicisi](https://webaim.org/resources/contrastchecker/)
- [The Paciello Group - Renk Kontrasti Cözümleyicisi](https://www.paciellogroup.com/resources/contrastanalyser/)

## Geliştirme ve Test Etme Araçları {#development-and-testing-tools}

Erişilebilir web uygulamalarının oluşturulmasına yardımcı olmak için kullanabileceğimiz bir çok araç vardır.

### Klavye {#the-keyboard}

Şimdiye kadar en kolay ve ayni zamanda en onemli kontroller, tum websitesinin sadece klavye ile ulasalabilir ve kullanilabilir oldugunu test etmektir. Bunu şu şekilde yapın:

1. Mouse'nizin bağlantısını kesmek.
1. Gözden geçirmek icin `Tab` ve `Shift+Tab` kullanmak.
1. Öğeleri etkinleştirmek için `Enter` kullanmak
1. Gerektiğinde, menüler ve asagi dogru açılan menüler (dropdown) gibi bazı öğelerle etkileşim kurmak için klavye ok tuşlarınızı kullanmak.

### Geliştirme Asistanı {#development-assistance}

Bazı erişilebilirlik özelliklerini doğrudan JSX kodumuzda kontrol edebiliriz. 
Genellikle intellisense kontrolleri, zaten JSX uyumlu IDE'lerde ARIA rolleri, durumları ve özellikleri için sağlanmıştır. Aşağıdaki araca da erişimimiz vardir: 

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

ESLint icin [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) eklentisi, JSX'inizdeki erişilebilirlik sorunları ile ilgili AST linting geri bildirimi sağlar. Bir cok IDE, bu bulguları doğrudan kod analizi ve kaynak kodu pencereleri ile birlikte kullanmaniza izin verir.

[Create React App](https://github.com/facebookincubator/create-react-app) bir kural alt kümesinin etkinleştirildiği bu eklentiye sahiptir. Daha da fazla erişilebilirlik kurallarını etkinleştirmek istiyorsanız, bu içerikle projenizin root (kök) dizininde bir `.eslintrc` dosyası oluşturabilirsiniz: 

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Testing accessibility in the browser {#testing-accessibility-in-the-browser}

A number of tools exist that can run accessibility audits on web pages in your browser. Please use them in combination with other accessibility checks mentioned here as they can only
test the technical accessibility of your HTML.

#### aXe, aXe-core and react-axe {#axe-axe-core-and-react-axe}

Deque Systems offers [aXe-core](https://github.com/dequelabs/axe-core) for automated and end-to-end accessibility tests of your applications. This module includes integrations for Selenium.

[The Accessibility Engine](https://www.deque.com/products/axe/) or aXe, is an accessibility inspector browser extension built on `aXe-core`.

You can also use the [react-axe](https://github.com/dylanb/react-axe) module to report these accessibility findings directly to the console while developing and debugging.

#### WebAIM WAVE {#webaim-wave}

The [Web Accessibility Evaluation Tool](https://wave.webaim.org/extension/) is another accessibility browser extension.

#### Accessibility inspectors and the Accessibility Tree {#accessibility-inspectors-and-the-accessibility-tree}

[The Accessibility Tree](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) is a subset of the DOM tree that contains accessible objects for every DOM element that should be exposed
to assistive technology, such as screen readers.

In some browsers we can easily view the accessibility information for each element in the accessibility tree:

- [Using the Accessibility Inspector in Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Using the Accessibility Inspector in Chrome](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane)
- [Using the Accessibility Inspector in OS X Safari](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### Screen readers {#screen-readers}

Testing with a screen reader should form part of your accessibility tests.

Please note that browser / screen reader combinations matter. It is recommended that you test your application in the browser best suited to your screen reader of choice.

### Commonly Used Screen Readers {#commonly-used-screen-readers}

#### NVDA in Firefox {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/) or NVDA is an open source Windows screen reader that is widely used.

Refer to the following guides on how to best use NVDA:

- [WebAIM - Using NVDA to Evaluate Web Accessibility](https://webaim.org/articles/nvda/)
- [Deque - NVDA Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver in Safari {#voiceover-in-safari}

VoiceOver is an integrated screen reader on Apple devices.

Refer to the following guides on how to activate and use VoiceOver:

- [WebAIM - Using VoiceOver to Evaluate Web Accessibility](https://webaim.org/articles/voiceover/)
- [Deque - VoiceOver for OS X Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - VoiceOver for iOS Shortcuts](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS in Internet Explorer {#jaws-in-internet-explorer}

[Job Access With Speech](https://www.freedomscientific.com/Products/software/JAWS/) or JAWS, is a prolifically used screen reader on Windows.

Refer to the following guides on how to best use JAWS:

- [WebAIM - Using JAWS to Evaluate Web Accessibility](https://webaim.org/articles/jaws/)
- [Deque - JAWS Keyboard Shortcuts](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Other Screen Readers {#other-screen-readers}

#### ChromeVox in Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](https://www.chromevox.com/) is an integrated screen reader on Chromebooks and is available [as an extension](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) for Google Chrome.

Refer to the following guides on how best to use ChromeVox:

- [Google Chromebook Help - Use the Built-in Screen Reader](https://support.google.com/chromebook/answer/7031755?hl=en)
- [ChromeVox Classic Keyboard Shortcuts Reference](https://www.chromevox.com/keyboard_shortcuts.html)
