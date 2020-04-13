---
id: reconciliation
title: Uyumlaştırma
permalink: docs/reconciliation.html
---

React, her güncellemede tam olarak ne değiştiği konusunda endişelenmenize gerek kalmaması için bildirimsel bir API sağlar. Bu, uygulamarı yazmayı daha kolay hale getirir, ancak bunun React içinde nasıl gerçekleştirildiği açık olmayabilir. Bu makale, React'ın "fark bulma" algoritmasındaki yaptığımız seçimleri açıklar, böylece yüksek performanslı uygulamalar için yeterince hızlı olurken bileşen güncellemeleri tahmin edilebilir.

## Motivasyon {#motivation}

React'ı kullandığınızda, zaman içinde bir noktada `render()` fonksiyonunun React elemanlarından bir ağaç oluşturduğunu düşünebilirsiniz. Bir sonraki state veya prop'ların güncellenmesiyle, `render()` fonksiyonu farklı bir React elemanları ağacı döndürecektir. React daha sonra, en son ağaca uyacak şekilde kullanıcı arayüzünü nasıl verimli bir şekilde güncelleyeceğini bulmalıdır.

Bir ağacı diğerine dönüştürmek için minimum sayıda işlem üretme sorununa bazı genel çözümler vardır. Bununla birlikte, [en gelişmiş algoritmalarının](https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf) O(n<sup>3</sup>) düzeyinde karmaşıklığı vardır; burada n, ağaçtaki elemanların sayısıdır.

Eğer bunu React'ta kullansaydık, 1000 öğenin görüntülenmesi sırasına göre bir milyar karşılaştırmaya ihtiyaç duyardı. Bu çok maliyetli. Bunun yerine, React iki varsayım üzerinde sezgisel bir O(n) algoritması gerçekleştirir:

1. Farklı tip iki eleman farklı ağaçlar üretecektir.
2. Geliştirici, hangi alt elemanların farklı render'larda sabit olabileceğini `key` prop’u kullanarak belirtebilir.

Pratikte, bu varsayımlar neredeyse tüm kullanım durumları için geçerlidir.

## Fark Bulma (Diffing) Algoritması {#the-diffing-algorithm}

İki ağacın farkını bulurken, React önce iki kök elemanı karşılaştırır. Davranış, kök elemanların tipine bağlı olarak farklılık gösterir.

### Farklı Tip Elemanlar {#elements-of-different-types}

Kök elemanların tipleri farklı olduğunda, React eski ağacı yıkacak ve yeni ağacı sıfırdan inşa edecektir. `<a>`'dan `<img>`'e, `<Article>`'dan `<Comment>`'e veya `<Button>`'dan `<div>`'e gitmek - bunlardan herhangi biri tam bir yeniden inşaya yol açacaktır.

Bir ağacı yıkarken, eski DOM düğümleri yok edilir. Bileşen nesnelerinde `componentWillUnmount()` çalıştırılır. Yeni bir ağaç oluştururken, DOM'a yeni DOM düğümleri eklenir. Bileşen nesnelerinde `componentWillMount()` ve sonra `componentDidMount()` çalıştırılır. Eski ağaçla ilişkili herhangi bir state, kaybolur.

Kökün altındaki tüm bileşenlerin de bağlantısı kesilir ve stateleri yok edilir. Örneğin, fark bulurken:

```xml
<div>
  <Counter />
</div>

<span>
  <Counter />
</span>
```

Bu, eski `Counter`'ı yok eder ve yenisini oluşturur.

### Aynı Tip DOM Elemanları {#dom-elements-of-the-same-type}

Aynı tip iki React DOM elemanını karşılaştırırken, React her ikisinin de özelliklerine bakar, aynı DOM düğümünü tutar ve yalnızca değiştirilen özellikleri günceller. Örneğin:

```xml
<div className="before" title="stuff" />

<div className="after" title="stuff" />
```

React bu iki elemanı karşılaştırarak, yalnızca DOM düğümündeki `className` özelliğini değiştirmesi gerektiğini bilir.

`style`'ı güncellerken, React yalnızca değişen özellikleri güncellemesi gerektiğini de bilir. Örneğin:

```xml
<div style={{color: 'red', fontWeight: 'bold'}} />

<div style={{color: 'green', fontWeight: 'bold'}} />
```

React, bu iki eleman arasında dönüştürme yaparken `fontWeight`'i değil, yalnızca `color` stilini değiştirmesi gerektiğini bilir.

DOM düğümünü yönetildikten sonra, React alt elemanlar üzerinde özyinelemeli olarak devam eder.

### Aynı Tip Bileşen Elemanları {#component-elements-of-the-same-type}

Bir bileşen güncellendiğinde, nesne aynı kalır, böylece state render edilmeler arasında korunur. React, bileşen nesnesinin prop'larını yeni elemanla eşleşecek şekilde günceller ve nesnede `componentWillReceiveProps()` ve `componentWillUpdate()`'i calıştırır.

Ardından, `render()` metodu çağrılır ve fark bulma algoritması önceki sonuç ile yeni sonuç üzerinden özyinelemeli olarak devam eder.

### Alt Elemanlarda Özyineleme {#recursing-on-children}

Varsayılan olarak, bir DOM düğümünün alt elemanlarında özyineleme yaparken, React aynı anda her iki alt eleman listesinde de gezer ve fark olduğunda mutasyon oluşturur.

Örneğin, alt elemanların sonuna bir eleman eklerken, bu iki ağaç arasında dönüştürme iyi sonuç verir:

```xml
<ul>
  <li>first</li>
  <li>second</li>
</ul>

<ul>
  <li>first</li>
  <li>second</li>
  <li>third</li>
</ul>
```

React iki `<li>first</li>` ağacını eşleştirir, iki `<li>second</li>` ağacını eşleştirir ve sonra `<li>third</li>` ağacını ekler.

Doğal bir şekilde uygularsanız, başlangıçta eleman eklemek daha kötü performansa sahiptir. Örneğin, bu iki ağaç arasında dönüştürme verimsiz çalışır:

```xml
<ul>
  <li>Duke</li>
  <li>Villanova</li>
</ul>

<ul>
  <li>Connecticut</li>
  <li>Duke</li>
  <li>Villanova</li>
</ul>
```

React, `<li>Duke</li>` ve `<li>Villanova</li>`  alt ağaçlarını dokunmadan tutabileceğini farketmek yerine, her çocuğu mutasyona uğratacaktır. Bu verimsizlik bir sorun olabilir.

### Anahtarlar (Keys) {#keys}

Bu sorunu çözmek için, React `key` özelliğini destekler. Elemanların anahtarı olduğunda, React anahtarı orijinal ağaçtaki elemanları sonraki ağaçtaki elemanlarla eşleştirmek için kullanır. Örneğin, yukarıdaki verimsiz örneğimize bir `key` eklemek ağaç dönüşümünü verimli hale getirebilir:

```xml
<ul>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>

<ul>
  <li key="2014">Connecticut</li>
  <li key="2015">Duke</li>
  <li key="2016">Villanova</li>
</ul>
```

Artık React, `'2014'` anahtarlı elemanın yeni olduğunu ve `'2015'` ile `'2016'` anahtarlı elemanların sadece yer değiştirdiğini bilir.

Pratikte, bir anahtar bulmak genellikle zor değildir. Göstereceğiniz öğenin zaten benzersiz bir kimliği (ID) olabilir, bu nedenle anahtar verilerinizden gelebilir:

```js
<li key={item.id}>{item.name}</li>
```

Durum böyle olmadığında, anahtar oluşturmak için modelinize yeni bir ID özelliği ekleyebilir veya içeriğin bazı bölümlerini karıştırarak (hash) yapabilirsiniz. Anahtar sadece kardeşleri arasında benzersiz olmalı, genel (global) olarak değil.

Son çare olarak, dizideki bir öğenin dizinini anahtar olarak kullanabilirsiniz. Öğeler hiçbir zaman yeniden sıralanmazsa bu işe yarayabilir, ancak yeniden sıralamalar yavaş olacaktır.

Yeniden sıralamalar, dizinler anahtar olarak kullanıldığında bileşen state'i ile ilgili sorunlara da neden olabilir. Bileşen nesneleri, anahtarlarına göre güncellenir ve yeniden kullanılır. Anahtar bir dizinse, bir öğeyi taşımak onu değiştirir. Sonuç olarak, bileşen state'i kontrolsüz girdiler gibi şeyler için beklenmedik şekillerde karışabilir ve güncellenebilir.

İşte CodePen'de [dizinlerin anahtar olarak kullanılmasından kaynaklanabilecek sorunlara bir örnek](codepen://reconciliation/index-used-as-key), ve işte [dizinlerin anahtar olarak kullanılmamasının sıralama, yeniden sıralama ve beklenen sorunları nasıl çözeceğini gösteren, aynı örneğin güncellenmiş bir sürümü](codepen://reconciliation/no-index-used-as-key).

## Tradeoffs {#tradeoffs}

It is important to remember that the reconciliation algorithm is an implementation detail. React could rerender the whole app on every action; the end result would be the same. Just to be clear, rerender in this context means calling `render` for all components, it doesn't mean React will unmount and remount them. It will only apply the differences following the rules stated in the previous sections.

We are regularly refining the heuristics in order to make common use cases faster. In the current implementation, you can express the fact that a subtree has been moved amongst its siblings, but you cannot tell that it has moved somewhere else. The algorithm will rerender that full subtree.

Because React relies on heuristics, if the assumptions behind them are not met, performance will suffer.

1. The algorithm will not try to match subtrees of different component types. If you see yourself alternating between two component types with very similar output, you may want to make it the same type. In practice, we haven't found this to be an issue.

2. Keys should be stable, predictable, and unique. Unstable keys (like those produced by `Math.random()`) will cause many component instances and DOM nodes to be unnecessarily recreated, which can cause performance degradation and lost state in child components.
