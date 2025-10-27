---
title: Kullanıcı Arayüzünüzü Bir Ağaç Olarak Anlamak
---

<Intro>

React uygulamanız birçok bileşenin iç içe geçmesiyle şekilleniyor. React, uygulamanızın bileşen yapısını nasıl takip ediyor?

React ve diğer birçok UI kütüphanesi, UI'ı bir ağaç olarak modeller. Uygulamanızı bir ağaç olarak düşünmek, bileşenler arasındaki ilişkiyi anlamak için kullanışlıdır. Bu anlayış, performans ve durum yönetimi gibi gelecekteki kavramlarda hata ayıklamanıza yardımcı olacaktır.

</Intro>

<YouWillLearn>

* React bileşen yapılarını nasıl "görür"
* Render ağacı nedir ve ne işe yarar
* Modül bağımlılık ağacı nedir ve ne işe yarar

</YouWillLearn>

## Bir ağaç olarak kullanıcı arayüzünüz {/*your-ui-as-a-tree*/}

<<<<<<< HEAD
Ağaçlar öğeler arasında bir ilişki modelidir ve kullanıcı arayüzü genellikle ağaç yapıları kullanılarak temsil edilir. Örneğin, tarayıcılar HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) ve CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)) modellemek için ağaç yapılarını kullanır. Mobil platformlar da görünüm hiyerarşilerini temsil etmek için ağaçları kullanır.
=======
Trees are a relationship model between items. The UI is often represented using tree structures. For example, browsers use tree structures to model HTML ([DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)) and CSS ([CSSOM](https://developer.mozilla.org/docs/Web/API/CSS_Object_Model)). Mobile platforms also use trees to represent their view hierarchy.
>>>>>>> 2c7798dcc51fbd07ebe41f49e5ded4839a029f72

<Diagram name="preserving_state_dom_tree" height={193} width={864} alt="Yatay olarak düzenlenmiş üç bölümlü diyagram. İlk bölümde,'Bileşen A', 'Bileşen B' ve 'Bileşen C' etiketleri ile dikey olarak istiflenmiş üç dikdörtgen vardır. Bir sonraki bölmeye geçişte, üzerinde React logosu bulunan ve 'React' etiketli bir ok bulunur. Orta bölüm, 'A' olarak etiketlenmiş kök ve 'B' ve 'C' olarak etiketlenmiş iki alt bileşen ile bir bileşen ağacı içerir. Bir sonraki bölüm yine üzerinde React logosu bulunan ve 'React DOM' olarak etiketlenmiş bir ok kullanılarak geçilir. Üçüncü ve son bölüm, yalnızca bir alt kümesi vurgulanmış (orta bölümdeki alt ağacı gösteren) 8 düğümlü bir ağaç içeren bir tarayıcının şemasıdır.">

React, bileşenlerinizden bir Kullanıcı Arayüzü(UI) ağacı oluşturur. Bu örnekte, Kullanıcı Arayüzü(UI) ağacı daha sonra DOM'a render etmek için kullanılır.
</Diagram>

Tarayıcılar ve mobil platformlar gibi React de bir React uygulamasındaki bileşenler arasındaki ilişkiyi yönetmek ve modellemek için ağaç yapıları kullanır. Bu ağaçlar, verilerin bir React uygulamasında nasıl aktığını ve render ile uygulama boyutunun nasıl optimize edileceğini anlamak için yararlı araçlardır.

## Render Ağacı {/*the-render-tree*/}

Bileşenlerin önemli bir özelliği, diğer bileşenlerin bileşenlerini oluşturma yeteneğidir. Eş [bileşenleri iç içe](/learn/your-first-component#nesting-and-organizing-components) yerleştirdiğimizde, her bir üst bileşenin kendisinin başka bir bileşenin alt elemanı olabileceği üst ve alt bileşen kavramına sahip oluruz.

Bir React uygulamasını render ettiğimizde, bu ilişkiyi render ağacı olarak bilinen bir ağaçta modelleyebiliriz.

İşte ilham verici alıntıları render eden bir React uygulaması.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="İlham Alın Uygulaması" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import quotes from './quotes';
import FancyText from './FancyText';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const quote = quotes[index];
  const next = () => setIndex((index + 1) % quotes.length);

  return (
    <>
      <p>İlham verici sözün:</p>
      <FancyText text={quote} />
      <button onClick={next}>Bana tekrar ilham ver</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/quotes.js
export default [
  "Zafer, 'zafer benimdir' diyebilenindir.Başarı ise 'başaracağım' diye başlayarak sonunda 'başardım' diyenindir. - Mustafa Kemal Atatürk",
  "Hırs, gökyüzüne merdiven dayamaktır.",
  "Paylaşılan bir sevinç, ikiye katlanmış bir sevinçtir.",
  ];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
```

</Sandpack>

<Diagram name="render_tree" height={250} width={500} alt="Beş düğümlü ağaç grafiği. Her düğüm bir bileşeni temsil eder. Ağacın kökü App'tir ve ondan 'InspirationGenerator' ve 'FancyText'e uzanan iki ok vardır. Oklar 'renders' kelimesi ile etiketlenmiştir. 'InspirationGenerator' düğümü ayrıca 'FancyText' ve 'Copyright' düğümlerini işaret eden iki oka sahiptir.">

React, render edilen bileşenlerden oluşan bir Kullanıcı Arayüzü(UI) ağacı olan *render ağacı* oluşturur.


</Diagram>

Örnek uygulama üzerinden yukarıdaki render ağacını oluşturabiliriz.

Ağaç, her biri bir bileşeni temsil eden düğümlerden oluşur. Birkaç örnek vermek gerekirse `App`, `FancyText`, `Copyright`, hepsi ağacımızdaki düğümlerdir.

React render ağacındaki kök düğüm, uygulamanın [kök bileşeni](/learn/importing-and-exporting-components#the-root-component-file)'dir. Bu durumda, kök bileşen `App`'dir ve React'in işlediği ilk bileşendir. Ağaçtaki her ok, bir üst bileşenden bir alt bileşene işaret eder.

<DeepDive>

#### HTML etiketleri render ağacının neresinde? {/*where-are-the-html-elements-in-the-render-tree*/}

Yukarıdaki render ağacında, her bileşenin işlediği HTML etiketlerinden bahsedilmediğini fark edeceksiniz. Bunun nedeni, render ağacının yalnızca React [bileşenlerinden](learn/your-first-component#components-ui-building-blocks) oluşmasıdır.

React, bir UI framework'ü olarak platformdan bağımsızdır. tr.react.dev'de, UI öğeleri olarak HTML işaretlemesini kullanan web'e işlenen örnekleri sergiliyoruz. Ancak bir React uygulaması, [UIView](https://developer.apple.com/documentation/uikit/uiview) veya [FrameworkElement](https://learn.microsoft.com/en-us/dotnet/api/system.windows.frameworkelement?view=windowsdesktop-7.0) gibi farklı UI öğelerini kullanabilen bir mobil veya masaüstü platformunda da işlenebilir.

Bu platform UI temel öğeleri React'in bir parçası değildir. React render ağaçları, uygulamanızın hangi platformda render edildiğinden bağımsız olarak React uygulamamıza fikir verebilir.

</DeepDive>

Bir render ağacı, React uygulamasının tek bir render geçişini temsil eder. [Koşullu render](/learn/conditional-rendering) ile bir üst bileşen, aktarılan verilere bağlı olarak farklı alt bileşenleri render edebilir.

Uygulamayı koşullu olarak ilham verici bir alıntı veya renk oluşturacak şekilde güncelleyebiliriz.

<Sandpack>

```js src/App.js
import FancyText from './FancyText';
import InspirationGenerator from './InspirationGenerator';
import Copyright from './Copyright';

export default function App() {
  return (
    <>
      <FancyText title text="İlham Alın Uygulaması" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </>
  );
}

```

```js src/FancyText.js
export default function FancyText({title, text}) {
  return title
    ? <h1 className='fancy title'>{text}</h1>
    : <h3 className='fancy cursive'>{text}</h3>
}
```

```js src/Color.js
export default function Color({value}) {
  return <div className="colorbox" style={{backgroundColor: value}} />
}
```

```js src/InspirationGenerator.js
import * as React from 'react';
import inspirations from './inspirations';
import FancyText from './FancyText';
import Color from './Color';

export default function InspirationGenerator({children}) {
  const [index, setIndex] = React.useState(0);
  const inspiration = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);

  return (
    <>
      <p>Your inspirational {inspiration.type} is:</p>
      {inspiration.type === 'quote'
      ? <FancyText text={inspiration.value} />
      : <Color value={inspiration.value} />}

      <button onClick={next}>Bana tekrar ilham ver</button>
      {children}
    </>
  );
}
```

```js src/Copyright.js
export default function Copyright({year}) {
  return <p className='small'>©️ {year}</p>;
}
```

```js src/inspirations.js
export default [
  {type: 'quote', value: "Zafer, 'zafer benimdir' diyebilenindir.Başarı ise 'başaracağım' diye başlayarak sonunda 'başardım' diyenindir. - Mustafa Kemal Atatürk"},
  {type: 'color', value: "#B73636"},
  {type: 'quote', value: "Hırs, gökyüzüne merdiven dayamaktır."},
  {type: 'color', value: "#256266"},
  {type: 'quote', value: "Paylaşılan bir sevinç, ikiye katlanmış bir sevinçtir."},
  {type: 'color', value: "#F9F2B4"},
];
```

```css
.fancy {
  font-family: 'Georgia';
}
.title {
  color: #007AA3;
  text-decoration: underline;
}
.cursive {
  font-style: italic;
}
.small {
  font-size: 10px;
}
.colorbox {
  height: 100px;
  width: 100px;
  margin: 8px;
}
```
</Sandpack>

<Diagram name="conditional_render_tree" height={250} width={561} alt="Altı düğümlü ağaç grafiği. Ağacın en üst düğümü 'App' olarak etiketlenmiştir ve 'InspirationGenerator' ve 'FancyText' olarak etiketlenmiş düğümlere uzanan iki ok bulunmaktadır. Oklar düz çizgilerdir ve 'render' kelimesiyle etiketlenmiştir. 'InspirationGenerator' düğümünün de üç oku vardır. 'FancyText' ve 'Color' düğümlerine giden oklar kesiktir ve 'renders?' ile etiketlenmiştir. Son ok 'Telif Hakkı' etiketli düğümü işaret eder ve düzdür ve 'renders' ile etiketlenmiştir.">

Koşullu render ile, farklı render işlemlerinde, render ağacı farklı bileşenleri render edebilir.

</Diagram>

Bu örnekte, `inspiration.type` öğesinin ne olduğuna bağlı olarak, `<FancyText>` veya `<Color>` öğesini render edebiliriz. Render ağacı her render geçişi için farklı olabilir.

Render ağaçları render geçişlerinde farklılık gösterse de, bu ağaçlar genellikle bir React uygulamasında *üst düzey* ve *yaprak bileşenlerin* ne olduğunu belirlemek için yardımcı olur. Üst düzey bileşenler, kök bileşene en yakın bileşenlerdir ve altlarındaki tüm bileşenlerin render performansını etkiler ve genellikle en karmaşık bileşenlerdir. Yaprak bileşenler ağacın en altında yer alır ve alt bileşenleri yoktur ve genellikle sık sık yeniden render edilirler.

Bu bileşen kategorilerini tanımlamak, uygulamanızın veri akışını ve performansını anlamak için yararlıdır.

## Modül Bağımlılık Ağacı {/*the-module-dependency-tree*/}

Bir React uygulamasında ağaç ile modellenebilecek bir başka ilişki de uygulamanın modül bağımlılıklarıdır. [Bileşenlerimizi ve mantığımızı ayrı dosyalara böldüğümüzde](/learn/importing-and-exporting-components#exporting-and-importing-a-component), bileşenleri, fonksiyonları veya sabitleri dışa aktarabileceğimiz [JS modülleri](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) oluştururuz.

Bir modül bağımlılık ağacındaki her düğüm bir modüldür ve her dal o modüldeki bir `import` deyimini temsil eder.

Önceki İlham Alma uygulamasını ele alırsak, bir modül bağımlılık ağacı veya kısaca bağımlılık ağacı oluşturabiliriz.

<Diagram name="module_dependency_tree" height={250} width={658} alt="Yedi düğümlü bir ağaç grafiği. Her düğüm bir modül adı ile etiketlenmiştir. Ağacın en üst seviye düğümü 'App.js' olarak etiketlenmiştir. 'InspirationGenerator.js', 'FancyText.js' ve 'Copyright.js' modüllerine işaret eden üç ok vardır ve oklar 'imports' ile etiketlenmiştir. 'InspirationGenerator.js' düğümünden üç modüle uzanan üç ok vardır: 'FancyText.js', 'Color.js' ve 'inspirations.js'. Oklar 'imports' ile etiketlenmiştir.">

İlham Alma uygulaması için modül bağımlılık ağacı.

</Diagram>

Ağacın kök düğümü, giriş noktası dosyası olarak da bilinen kök modüldür. Genellikle kök bileşeni içeren modüldür.

Aynı uygulamanın render ağacı ile karşılaştırıldığında, benzer yapılar vardır ancak bazı önemli farklılıklar da mevcuttur:

* Ağacı oluşturan düğümler bileşenleri değil modülleri temsil eder.
* Bileşen olmayan modüller, örneğin `inspirations.js` de bu ağaçta temsil edilir. Render ağacı yalnızca bileşenleri kapsüller.
* `Telif hakkı.js`, `App.js` altında görünür, ancak render ağacında bileşen olan `Copyright`, `InspirationGenerator`ın bir alt elemanı olarak görünür. Bunun nedeni `InspirationGenerator` bileşeninin JSX'i [children props](/learn/passing-props-to-a-component#passing-jsx-as-children) olarak kabul etmesidir, bu nedenle `Copyright` bileşenini alt bileşen olarak işler ancak modülü içe aktarmaz.

Bağımlılık ağaçları, React uygulamanızı çalıştırmak için hangi modüllerin gerekli olduğunu belirlemek için kullanışlıdır. Üretim için bir React uygulaması oluştururken, genellikle istemciye göndermek için gerekli tüm JavaScript'i paketleyecek bir derleme adımı vardır. Bundan sorumlu araca [bundler](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Understanding_client-side_tools/Overview#the_modern_tooling_ecosystem) adı verilir ve bundler'lar hangi modüllerin dahil edilmesi gerektiğini belirlemek için bağımlılık ağacını kullanır.

Uygulamanız büyüdükçe, genellikle paket boyutu da büyür. Büyük paket boyutlarını, bir istemcinin indirmesi ve çalıştırması oldukça pahalıdır. Büyük paket boyutları, kullanıcı arayüzünüzün çizilme süresini geciktirebilir. Uygulamanızın bağımlılık ağacı hakkında fikir edinmek bu sorunları ayıklamanıza yardımcı olabilir.

[comment]: <> (perhaps we should also deep dive on conditional imports)

<Recap>

* Ağaçlar, varlıklar arasındaki ilişkiyi temsil etmenin yaygın bir yoludur. Genellikle kullanıcı arayüzünü modellemek için kullanılırlar.
* Render ağaçları, tek bir render boyunca React bileşenleri arasındaki iç içe geçmiş ilişkiyi temsil eder.
* Koşullu render ile render ağacı farklı render işlemlerinde değişebilir. Farklı prop değerleri ile bileşenler farklı alt bileşenleri oluşturabilir.
* Render ağaçları, üst düzey ve yaprak bileşenlerin ne olduğunu belirlemeye yardımcı olur. Üst düzey bileşenler altlarındaki tüm bileşenlerin render performansını etkiler ve yaprak bileşenler genellikle sık sık yeniden render edilir. Bunları tanımlamak, oluşturma performansını anlamak ve hata ayıklamak için yararlıdır.
* Bağımlılık ağaçları, bir React uygulamasındaki modül bağımlılıklarını temsil eder.
* Bağımlılık ağaçları, bir uygulamayı göndermek için gerekli kodu paketlemek üzere derleme araçları tarafından kullanılır.
* Bağımlılık ağaçları, boyama süresini yavaşlatan ve hangi kodun paketlendiğini optimize etme fırsatlarını ortaya çıkaran büyük paket boyutlarında hata ayıklamak için kullanışlıdır.

</Recap>

[TODO]: <> (Add challenges)
