---
id: accessibility
title: Accessibility
permalink: docs/accessibility.html
---

## Niçin Erişilebilirlik? {#why-accessibility}

([**a11y**](https://en.wiktionary.org/wiki/a11y)) olarak da anılan web erişilebilirliği, herkes tarafından kullanılabilir web sitelerinin tasarımı ve oluşturulmasıdır. Erişilebilirlik desteği, yardımcı teknolojinin web sayfalarını yorumlamasına izin vermek için gereklidir.

React, sıklıkla standart HTML tekniklerini kullanarak, tamamen erişilebilir web siteleri oluşturmayı destekler.

## Standartlar ve Yönergeler {#standards-and-guidelines}

### WCAG {#wcag}

[Web İçeriği Erişilebilirlik Yönergeleri](https://www.w3.org/WAI/intro/wcag), erişilebilir web siteleri oluşturmak için yönergeler sağlar.

Aşağıdaki WCAG kontrol listeleri genel bir bakış sağlar:

- [Wuhcag'dan WCAG Kontrol Listesi](https://www.wuhcag.com/wcag-checklist/)
- [WebAIM'den WCAG Kontrol Listesi](https://webaim.org/standards/wcag/checklist)
- [A11Y Projesi'nden Kontrol Listesi](https://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

[Web Erişilebilirlik Girişimi - Erişilebilir Zengin İnternet Uygulamaları](https://www.w3.org/WAI/intro/aria) belgesi, tamamen erişilebilir JavaScript widgetleri oluşturmak için teknikler içerir.

Tüm `aria- *` HTML özelliklerinin, JSX'te tam olarak desteklendiğini unutmayın. React'teki çoğu DOM özellikleri ve nitelikleri camelCased iken, bu nitelikler düz HTML'de olduğu gibi hyphen-cased şeklinde olmalıdır (kebab-case, lisp-case, ve benzeri olarak da bilinir):

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

## Anlamsal HTML {#semantic-html}
Anlamsal HTML, bir web uygulamasında erişilebilirliğin temelidir. Web sitelerimizdeki bilginin anlamını pekiştirmek için, çeşitli HTML öğelerini kullanmak sıklıkla bize ücretsiz olarak erişilebilirlik sağlayacaktır.

- [MDN HTML öğeleri referansı](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

Bazen, React kodumuzun çalışması için JSX'imize `<div>` öğeleri eklediğimizde, HTML'in anlamsallığını bozarız, özellikle listeler (`<ol>`, `<ul>` ve `<dl>`), ve HTML `<table>` ile çalışırken. 
Bu durumlarda, çoklu öğeleri gruplamak için [React Fragmentleri](/docs/fragments.html) kullanmayı tercih etmelisiniz.

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

Başka herhangi bir öğe türünde yapacağınız gibi, bir öğe koleksiyonunu bir fragment dizisine (array'ine) eşleyebilirsiniz :

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

Fragment etiketinde herhangi bir prop'a ihtiyacınız olmadığında, eğer araç gereçleriniz onu destekliyorsa [kısa sözdizimi(syntax)](/docs/fragments.html#short-syntax)'ni kullanabilirsiniz:

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

Daha fazla bilgi için, [Fragmentler dokümantasyonu](/docs/fragments.html)'na bakınız.

## Erişilebilir Formlar {#accessible-forms}

### Etiketlemek {#labeling}
`<input>` ve `<textarea>` gibi her HTML form kontrolunun (form control), erişilebilir halde etiketlenmiş olması gerekir. Ekran okuyucuları tarafndan da ortaya çıkan, açıklayıcı etiketler sağlamamız gerekir.

Aşağıdaki kaynaklar bize bunun nasıl yapılacağını gösterir:

- [W3C bize öğelerin nasıl etiketleneceğini gösterir](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WebAIM bize öğelerin nasıl etiketleneceğini gösterir](https://webaim.org/techniques/forms/controls)
- [Paciello Group erişilebilir isimleri açıklar](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

Bu standart HTML uygulamaları doğrudan React'te kullanılabilmesine rağmen, `for` niteliğinin JSX'de `htmlFor` olarak yazıldığına dikkat edin:

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### Kullanıcı hatalarını bildirmek {#notifying-the-user-of-errors}

Hata durumlarının tüm kullanıcılar tarafından anlaşılmış olması gerekir. 
Aşağıdaki link, hata metinlerinin de ekran okuyucuları tarafından nasıl algılandığını gösterir:

- [W3C, kullanıcı bildirimlerini gösterir](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WebAIM, form doğrulamaya bakar](https://webaim.org/techniques/formvalidation/)

## Odak Kontrolü {#focus-control}

Web uygulamanızın yalnızca klavye ile tam olarak çalıştırılabildiğinden emin olun:

- [WebAIM, klavye erişilebilirliği hakkında konuşur](https://webaim.org/techniques/keyboard/)

### Klavye odağı ve odak ana hatları {#keyboard-focus-and-focus-outline}

Klavye odağı, klavyeden girişi kabul etmek için seçilen DOM'daki varolan öğeye başvurur. Bunu her yerde aşağıdaki resimde gösterilene benzer bir odak anahat olarak görürüz:

<img src="../images/docs/keyboard-focus.png" alt="Mavi renk, seçilmiş bir link etrafindaki klavye odak anahattıdır" />

Eğer onu başka bir odak anahat uygulamasıyla değiştiriyorsanız, sadece bu anahattı kaldıran CSS'ini kullanın.

### İstenilen içeriğe atlama mekanizmaları{#mechanisms-to-skip-to-desired-content}

Klavyede gezinmeye yardımcı olduğundan ve hızlandırdığından, kullanıcıların uygulamanızdaki geçmiş navigasyon bölümlerini atlamasına izin veren bir mekanizma sağlayın.

AtlamaLinkleri (Skiplinks) veya Navigasyon Linklerini Atlamak (Skip Navigation Links), klavye kullanıcıları, sadece sayfa ile etkileşimde bulundukları zaman görünür olan gizli navigasyon linkleridir. Bunların iç sayfa bağlantıları ve bazı stillerle uygulanması çok kolaydır:

- [WebAIM - Navigasyon Linklerini Atlamak](https://webaim.org/techniques/skipnav/)

Yardımcı teknoloji, kullanıcının bu bölümlere çabuk bir şekilde gezinmesine olanak tanıdığından, sayfa bölümlerini ayırmak için "<main>" ve "<aside>" gibi belirgin işaret (landmark) öğeleri ve rolleri de kullanın.

Erişilebilirliği geliştirmek için, bu öğelerin kullanımı hakkında daha fazlasını buradan okuyun

- [Erişilebilir Belirgin İşaretler](https://www.scottohara.me/blog/2018/03/03/landmarks.html)

### Programlayarak odağı yönetmek {#programmatically-managing-focus}

React uygulamamlarımız çalışma süresinde, HTML DOM'u değiştirir, bazen klavye odağının kaybolmasına veya beklenmedik bir öğeye ayarlanmasına yol açar. Bunu düzeltmek amacıyla, klavye odağını programlı olarak doğru yönde itelemek gerekir. Örneğin, modal penceresi kapatıldıktan sonra, bir modal penceresi açan bir butona klavye odağını sıfırlatmak.

MDN Web Dokümanları buna bakar ve [gezinilebilir-klavye JavaScript widgetleri](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets)'ni nasıl inşa edebildiğimizi açıklar.

React'te odağı ayarlamak için [DOM öğelerine Ref'ler](/docs/refs-and-the-dom.html)'i kullanabiliriz.

Bunu kullanarak, öncelikle, bir bileşen sınıfının JSX'indeki bir öğeye bir ref oluştururuz:

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // textInput DOM öğesini depolamak için bir ref oluşturun
    this.textInput = React.createRef();
  }
  render() {
  // text input DOM'a bir referans depolamak için `ref` callback'i (geri çağrı) kullanın
  // bir instance alanındaki öğe (örneğin, this.textInput).
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
   // Açık bir şekilde, işlenmemiş DOM API'ı kullanarak metin girişine odaklanın
   // Not: DOM düğümünü almak için "current"e erişiyoruz
   this.textInput.current.focus();
 }
 ```

Bazen bir üst bileşenin, bir alt bileşendeki bir öğeye odağının ayarlanması gerekir. Bunu [DOM ref'lerini üst bileşenler de ortaya çıkartarak](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components), üst öğenin ref'ini alt öğenin DOM düğümüne ileten alt bileşen üzerindeki özel bir prop yoluyla yapabiliriz.

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

// Simdi gerektiğinde odağı ayarlayabilirsiniz.
this.inputElement.current.focus();
```

Bileşenleri genişletmek için bir HOC kullanırken, React'in `forwardRef` fonksiyonu kullanılarak sarılmış bileşene [ref'i iletmesi](/docs/forwarding-refs.html) önerilir. Eğer üçüncü bir taraf HOC, ref iletmeyi uygulamazsa, yukarıdaki şablon yine de bir geri çekilme olarak kullanılabilir.

[react-aria-modal](https://github.com/davidtheclark/react-aria-modal), harika bir odak yönetimi örneğidir. Bu, tamamen erişilebilir bir modal penceresinin göreceli olarak nadir bir örneğidir.   
Sadece ilk odağı iptal butonuna ayarlamak (klavye kullanıcısının başarılı eylemi yanlışlıkla etkinleştirmesini engeller) ve klavye odağını modal içinde hapsetmekle kalmaz, onu başlangıçta modalı tetikleyen öğeye geri odaklanarak sıfırlar. 

>Not:
>
>Bu çok önemli bir erişilebilirlik özelliği iken, adilce kullanılması da gereken bir tekniktir. Nasıl yapılacağını tahmin etmek için değil, rahatsız edildiğinde klavye odak akışını onarmak için kullanın.
>kullanıcılar uygulamaları kullanmak ister.

## Fare ve imleç olayları {#mouse-and-pointer-events}

Bir fare veya imleç olayı aracılığıyla açığa çıkan tüm fonksiyonların yalnızca klavye kullanılarak da erişilebildiğinden emin olun. Sadece imleç cihazına bağlı olarak, klavye kullanıcıları uygulamanızın kullanılamayacağı birçok duruma yönlendirilecektir.

Bunu göstermek için, tıklama olaylarının sebep olduğu bozuk erişilebilirliğin verimli bir örneğine bakalım. Bu, bir kullanıcının öğenin dışına tıklayarak, bir anda açılan pencereyi (popover) engellediği dış tıklama şablonudur.

<img src="../images/docs/outerclick-with-mouse.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with a mouse showing that the close action works." />

Bu genellikle popover'ı kapatan `window` nesnesine bir `click` olayının bağlanarak uygulanmasıdır.

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

Bu fare gibi imleçli cihaz kullanan kullanıcılar için iyi çalışabilir. Ama bunun tek olarak klavye ile çalıştırılması, sonraki öğeye sekme yapıldığında bozuk fonksiyonelliğe yol açar, çünkü `window` nesnesi asla `click` olayını almaz. Bu, kullanıcıların uygulamanızı kullanmasını engelleyen belirsiz fonksiyonellige yol açabilir. 

<img src="../images/docs/outerclick-with-keyboard.gif" alt="A toggle button opening a popover list implemented with the click outside pattern and operated with the keyboard showing the popover not being closed on blur and it obscuring other screen elements." />

Bunun yerine `onBlur` ve `onFocus` gibi, aynı fonksiyonellik, uygun olay yöneticilerini kullanarak ulaşılabilir:

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

  // Bir sonraki tıklamada, setTimeout kullanarak açılır pencereyi (popover) kapatıyoruz.
  // Bu gereklidir çünkü önce kontrol etmemiz gerekiyor, eğer
  // öğenin başka bir alt öğesine odaklanılmışsa, 
  // bulanıklık olayı, yeni odak olayından önce tetiklendiği.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // Bir alt öğeye odaklanılırsa, açılır pencereyi (popover) kapatmayın
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React bulanıklığı köpürterek ve
    // olayları üst öğeye odaklayarak bize yardımcı olur
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

Bu kod, işlevselliği hem imlece hem de klavye kullanıcılarına sunar. Ekran-okuyucu kullanıcılarını desteklemek için eklenen `aria-*` prop'larına da dikkat edin. Basitlik adına, açılır pencere (popover) seçeneklerinin `arrow key` etkileşimini etkinleştirmek için klavye olayları uygulanmamıştır.

<img src="../images/docs/blur-popover-close.gif" alt="Hem fare hem de klavye kullanıcıları için doğru şekilde kapanan bir açılır (popover) liste." />

Bu, sadece imleç ve fare olaylarına bağlı olan klavye kullanıcıları için, fonksiyonelliğin bozulduğu birçok duruma bir örnektir. Daima klavye ile test etmek, derhal klavyeye duyarlı olay yöneticilerini kullanarak düzeltilmiş olabilen sorunlu bölgeleri vurgular.

## Daha Karmaşık Widgetler {#more-complex-widgets}

Daha karmaşık bir kullanıcı deneyimi, daha az erişilebilir demek değildir. Erişilebilirlik en kolay şekilde mümkün olabildiğince HTML'ye yakın kodlama ile ulaşılabilir iken, en karmaşık widget bile erişilebilir şekilde kodlanmış olabilir.

Burada [ARIA Durumları ve Özellikleri](https://www.w3.org/TR/wai-aria/#states_and_properties) gibi [ARIA Rolleri](https://www.w3.org/TR/wai-aria/#roles)'nin bilgisine gereksinim duyarız. 
Bunlar JSX'te tamamen desteklenmiş ve tamamen erişilebilir, yüksek dereceli fonksiyonel React bileşenleri inşa etmemize imkan veren HTML nitelikleriyle dolu araç kutularıdır.

Her çeşit widget öğesi türünün belirli bir tasarım deseni vardır ve hem kullanıcılar hem de kullanıcı ajansları gibi olanlar tarafından, belirli bir şekilde fonksiyon göstermesi beklenir:

- [WAI-ARIA Yazarlık Pratikleri - Tasarım Desenleri ve Widget'lar](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - ARIA Örnekleri](https://heydonworks.com/article/practical-aria-examples/)
- [Kapsayıcı Bileşenler](https://inclusive-components.design/)

## Düşünülmesi Gereken Diğer Hususlar {#other-points-for-consideration}

### Dili ayarlamak {#setting-the-language}

Ekran okuyucu yazılımı, doğru ses ayarlarını seçmek için bunu kullandığından, sayfa metinlerinin insan dilini belirtin:

- [WebAIM - Dokümantasyon Dili](https://webaim.org/techniques/screenreader/#language)

### Doküman başlığını ayarlamak {#setting-the-document-title}

Dokümanın `<title>`'ını mevcut sayfa içeriğini doğru şekilde tanımlayarak ayarlayın, çünkü bu, kullanıcının mevcut sayfa içeriğinden emin olmasını sağlar:

- [WCAG - Doküman Başlığı Gereksinimini Anlamak](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

Bunu React'te [React Doküman Başlığı Bileşeni](https://github.com/gaearon/react-document-title)'ni kullanarak ayarlayabiliriz.

### Renk Kontrastı {#color-contrast}

Görme yetisi kısıtlı kullanıcılar tarafından, maksimum düzeyde okunabilmesi için web sitenizdeki tüm okunabilir metinlerin yeterli renk kontrastına sahip olduğundan emin olun:

- [WCAG - Renk Kontrastı Gereksinimini Anlama](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [Renk Kontrastı Hakkındaki Her Şey ve Onu Neden Yeniden Düşünmelisiniz](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProjesi - Renk Kontrastı Nedir](https://a11yproject.com/posts/what-is-color-contrast/)

Web sitenizdeki tüm durumlar için uygun renk kombinasyonlarını manuel olarak hesaplamak yorucu olabilir. Öyleyse, bunun yerine [colorable ile tüm erişilebilir bir renk paletini hesaplayın](https://jxnblk.com/colorable/).

Aşağıda belirtilen hem aXe hem de WAVE araçları renk kontrast testlerini de içerir ve kontrast hatalarını rapor edecektir. 

Kontrast testi becerilerinizi genişletmek istiyorsanız, bu araçları kullanabilirsiniz:

- [WebAIM - Renk Kontrastı Denetleyicisi](https://webaim.org/resources/contrastchecker/)
- [The Paciello Group - Renk Kontrastı Çözümleyicisi](https://www.paciellogroup.com/resources/contrastanalyser/)

## Geliştirme ve Test Etme Araçları {#development-and-testing-tools}

Erişilebilir web uygulamalarının oluşturulmasına yardımcı olmak için kullanabileceğimiz bir çok araç vardır.

### Klavye {#the-keyboard}

Şimdiye kadar en kolay ve aynı zamanda en önemli kontroller, tüm websitesinin sadece klavye ile ulaşalabilir ve kullanılabilir olduğunu test etmektir. Bunu şu şekilde yapın:

1. Farenizin bağlantısını kesmek.
1. Gözden geçirmek icin `Tab` ve `Shift+Tab` kullanmak.
1. Öğeleri etkinleştirmek için `Enter`'i kullanmak
1. Gerektiğinde, menüler ve aşağı doğru açılan (dropdown) menüler gibi, bazı öğelerle etkileşim kurmak için klavye ok tuşlarınızı kullanmak.

### Geliştirme asistanı {#development-assistance}

Bazı erişilebilirlik özelliklerini doğrudan JSX kodumuzda kontrol edebiliriz. 
Genellikle, ARIA rolleri, durumları ve özellikleri için Intellisense kontrolleri, JSX uyumlu IDE(Integrated Development Environment)'lerde  zaten sağlanmıştır. Aşağıdaki araca da erişimimiz vardir: 

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

ESLint için [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) eklentisi, JSX'inizdeki erişilebilirlik sorunları ile ilgili AST linting geri bildirimini sağlar. Bir çok IDE, bu bulguları doğrudan kod analizi ve kaynak kodu pencereleri ile birlikte kullanmanıza izin verir.

[Create React App](https://github.com/facebookincubator/create-react-app), bir kural alt kümesinin etkinleştirildiği bu eklentiye sahiptir. Daha da fazla erişilebilirlik kurallarını etkinleştirmek istiyorsanız, bu içerikle projenizin root (kök) dizininde bir `.eslintrc` dosyası oluşturabilirsiniz: 

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Tarayıcıda erişilebilirliği test etme {#testing-accessibility-in-the-browser}

Tarayıcınızda web sayfalarındaki erişilebilirlik denetimlerini çalıştırabilen bir dizi araçlar vardır. Onlar yalnızca HTML'nizin teknik erişilebilirliğini test edebildiği için, lütfen onları burada belirtilen diğer erişilebilirlik kontrolleriyle birlikte kullanın.

#### aXe, aXe-core ve react-axe {#axe-axe-core-and-react-axe}

Deque Systemleri uygulamalarınızın otomatik ve uçtan-uça (end-to-end) erişilebilirlik testleri için[aXe-core](https://github.com/dequelabs/axe-core) sunar. Bu modül Selenium için entegrasyonları içerir.

[Erişilebilirlik Motoru](https://www.deque.com/products/axe/) veya aXe, `aXe-core` üzerine inşa edilmiş bir erişilebilirlik denetçisi tarayıcı uzantısı.

Geliştirme ve hata ayıklama sırasında, bu erişilebilirlik bulgularını doğrudan konsola bildirmek için [react-axe](https://github.com/dylanb/react-axe) modülünü de kullanabilirsiniz.

#### WebAIM WAVE {#webaim-wave}

[Web Erişilebilirlik Değerlendirme Aracı](https://wave.webaim.org/extension/) 
başka bir erişilebilirlik tarayıcı uzantısıdır.

#### Erişilebilirlik Denetçileri ve Erişilebilirlik Ağacı {#accessibility-inspectors-and-the-accessibility-tree}

[Erişilebilirlik Ağacı](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/), ekran okuyucuları gibi yardımcı teknolojilere maruz bırakılmış olması gereken, her DOM öğesi için erişilebilir nesneleri içeren DOM ağacının alt kümesidir.

Bazı tarayıcılarda, erişilebilirlik ağacındaki her öğe için erişilebilirlik bilgilerini kolayca görüntüleyebiliriz:

- [Firefox'da Erişilebilirlik Denetçisini Kullanmak](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Chrome'da Erişilebilirlik Denetçisini Kullanmak](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane)
- [OS X Safari'de Erişilebilirlik Denetçisini Kullanmak](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### Ekran Okuyucuları {#screen-readers}

Bir ekran okuyucuyla test etmek, erişilebilirlik testlerinizin bir parçasını oluşturmalıdır.

Tarayıcı / ekran okuyucu kombinasyonlarının önemli olduğunu lütfen unutmayın. Uygulamanızı, seçtiğiniz ekran okuyucuya en uygun tarayıcıda test etmeniz önerilir. 

### Yaygın Kullanılan Ekran Okuyucuları {#commonly-used-screen-readers}

#### Firefox İçindeki NVDA {#nvda-in-firefox}

[Görsel Olmayan Masaüstü Erişimi](https://www.nvaccess.org/) veya  NVDA(NonVisual Desktop Access) yaygın olarak kullanılan açık kaynaklı bir Windows ekran okuyucudur.

NVDA'yı en iyi şekilde nasıl kullanacağınız konusunda aşağıdaki kılavuzlara basvurun:

- [WebAIM - Web Erişilebilirliğini Değerlendirmek için NVDA'yı Kullanmak](https://webaim.org/articles/nvda/)
- [Deque - NVDA Klavye Kısayolları](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### Safari içindeki VoiceOver {#voiceover-in-safari}

VoiceOver, Apple cihazlara entegre edilmiş bir ekran okuyucudur.

VoiceOver'ı nasıl etkinleştireceğiniz ve kullanacağınız ile ilgili aşağıdaki rehberlere bakın:

- [WebAIM - Web Erişilebilirliğini Değerlendirmek için VoiceOver'ı Kullanmak](https://webaim.org/articles/voiceover/)
- [Deque - OS X Klavye Kısayolları için VoiceOver](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - iOS Kısayolları için VoiceOver](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### Internet Explorer içindeki JAWS{#jaws-in-internet-explorer}

[Job Access With Speech](https://www.freedomscientific.com/Products/software/JAWS/) (Konuşma ile İş Erişimi) veya JAWS, Windows üzerinde üretken olarak kullanılan ekran okuyucudur.

JAWS'ın en iyi nasıl kullanılacağına ilişkin aşağıdaki rehberlere başvurun:

- [WebAIM - JAWS'ı Kullanarak Web Erişilebilirliğini Değerlendirmek ](https://webaim.org/articles/jaws/)
- [Deque - JAWS Klavye Kısayolları](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Diğer Ekran Okuyucuları{#other-screen-readers}

#### Google Chrome içindeki ChromeVox{#chromevox-in-google-chrome}

[ChromeVox](https://www.chromevox.com/), Chromebooks'daki bir ekran okuyucudur ve Google Chrome için [bir uzantı olarak](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=en) vardır.

ChromeVox'un en iyi nasıl kullanılacağına ilişkin aşağıdaki rehberlere başvurun:

- [Google Chromebook Yardım - Yerleşik Ekran Okuyucuyu Kullanın](https://support.google.com/chromebook/answer/7031755?hl=en)
- [ChromeVox Klasik Klavye Kısayolları Referansı](https://www.chromevox.com/keyboard_shortcuts.html)
