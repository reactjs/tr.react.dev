---
id: reconciliation
title: Uyumlaştırma
permalink: docs/reconciliation.html
---

React, her güncellemede tam olarak ne değiştiği konusunda endişelenmenize gerek kalmaması için bildirimsel bir API sağlar. Bu, uygulamaları yazmayı daha kolay hale getirir, ancak bunun React içinde nasıl uygulandığı (implementation) açık olmayabilir. Bu makale, React'ın "fark bulma" algoritmasındaki yaptığımız seçimleri açıklar, böylece yüksek performanslı uygulamalar için yeterince hızlı olurken bileşen güncellemeleri tahmin edilebilir.

## Motivasyon {#motivation}

React'ı kullandığınızda, zaman içinde bir noktada `render()` fonksiyonunun React elemanlarından bir ağaç oluşturduğunu düşünebilirsiniz. Bir sonraki state veya prop'ların güncellenmesiyle, `render()` fonksiyonu farklı bir React elemanları ağacı döndürecektir. React daha sonra, en son ağaca uyacak şekilde kullanıcı arayüzünü nasıl verimli bir şekilde güncelleyeceğini bulmalıdır.

Bir ağacı diğerine dönüştürmek için minimum sayıda işlem üretme sorununa bazı genel çözümler vardır. Bununla birlikte, [en gelişmiş algoritmaların](https://grfia.dlsi.ua.es/ml/algorithms/references/editsurvey_bille.pdf) O(n<sup>3</sup>) düzeyinde karmaşıklığı vardır; burada n, ağaçtaki elemanların sayısıdır.

Eğer bunu React'ta kullansaydık, 1000 öğenin görüntülenmesi sırasına göre bir milyar karşılaştırmaya ihtiyaç duyardı. Bu çok maliyetli. Bunun yerine, React iki varsayım üzerine sezgisel bir O(n) algoritma uygular:

1. Farklı tip iki eleman farklı ağaçlar üretecektir.
2. Geliştirici, hangi alt elemanların farklı render edilmelerde sabit olabileceğini `key` prop’u kullanarak belirtebilir.

Pratikte, bu varsayımlar neredeyse tüm kullanım durumları için geçerlidir.

## Fark Bulma (Diffing) Algoritması {#the-diffing-algorithm}

İki ağacın farkını bulurken, React önce iki kök elemanı karşılaştırır. Davranış, kök elemanların tipine bağlı olarak farklılık gösterir.

### Farklı Tip Elemanlar {#elements-of-different-types}

Kök elemanların tipleri farklı olduğunda, React eski ağacı yıkacak ve yeni ağacı sıfırdan inşa edecektir. `<a>`'dan `<img>`'e, `<Article>`'dan `<Comment>`'e veya `<Button>`'dan `<div>`'e gitmek - bunlardan herhangi biri tam bir yeniden inşaya yol açacaktır.

Bir ağacı yıkarken, eski DOM düğümleri yok edilir. Bileşen nesnelerinde `componentWillUnmount()` çalıştırılır. Yeni bir ağaç oluştururken, DOM'a yeni DOM düğümleri eklenir. Bileşen nesnelerinde `UNSAFE_componentWillMount()` ve sonra `componentDidMount()` çalıştırılır. Eski ağaçla ilişkili herhangi bir state kaybolur.

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

>Not:
>
<<<<<<< HEAD
>Bu yöntemler eski yöntem olarak kabul edilir ve yeni kodda [bunlardan kaçınmalısınız](/blog/2018/03/27/update-on-async-rendering.html):
=======
>This method is considered legacy and you should [avoid it](/blog/2018/03/27/update-on-async-rendering.html) in new code:
>>>>>>> 5fed75dac5f4e208369b102a1337d76944111b33
>
>- `UNSAFE_componentWillMount()`

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

Bir bileşen güncellendiğinde, nesne aynı kalır, böylece state render edilmeler arasında korunur. React, bileşen nesnesinin prop'larını yeni elemanla eşleşecek şekilde günceller ve nesnede `UNSAFE_componentWillReceiveProps()` ve `UNSAFE_componentWillUpdate()`'i calıştırır.

Ardından, `render()` metodu çağrılır ve fark bulma algoritması önceki sonuç ile yeni sonuç üzerinden özyinelemeli olarak devam eder.

>Note:
>
>Bu yöntemler eski yöntem olarak kabul edilir ve yeni kodda [bunlardan kaçınmalısınız](/blog/2018/03/27/update-on-async-rendering.html):
>
>- `UNSAFE_componentWillUpdate()`
>- `UNSAFE_componentWillReceiveProps()`

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

Bunu bilmeden uygularsanız, ağacın sonuna değil de başına eleman eklemek daha kötü bir performansa sahiptir. Örneğin, bu iki ağaç arasında dönüştürme işlemi verimsiz çalışır:

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

Durum böyle olmadığında, anahtar oluşturmak için modelinize yeni bir ID özelliği ekleyebilir veya içeriğin bazı bölümlerini karıştırarak (hash) yapabilirsiniz. Anahtar sadece kardeşleri arasında benzersiz olmalı, global (genel) olarak değil.

Son çare olarak, dizideki bir öğenin dizinini anahtar olarak kullanabilirsiniz. Öğeler hiçbir zaman yeniden sıralanmazsa bu işe yarayabilir, ancak yeniden sıralamalar yavaş olacaktır.

Yeniden sıralamalar, dizinler anahtar olarak kullanıldığında bileşen state'i ile ilgili sorunlara da neden olabilir. Bileşen nesneleri, anahtarlarına göre güncellenir ve yeniden kullanılır. Anahtar bir dizinse, bir öğeyi taşımak onu değiştirir. Sonuç olarak, bileşen state'i kontrolsüz girdiler gibi şeyler için beklenmedik şekillerde karışabilir ve güncellenebilir.

İşte CodePen'de [dizinlerin anahtar olarak kullanılmasından kaynaklanabilecek sorunlara bir örnek](codepen://reconciliation/index-used-as-key), ve işte [dizinlerin anahtar olarak kullanılmamasının sıralama, yeniden sıralama ve beklenen sorunları nasıl çözeceğini gösteren, aynı örneğin güncellenmiş bir sürümü](codepen://reconciliation/no-index-used-as-key).

## Ödünler {#tradeoffs}

Uyumlaştırma algoritmasının bir uygulama (implementation) detayı olduğunu hatırlamak önemlidir. React, her eylemde tüm uygulamayı yeniden render edebilir; sonuç aynı olurdu. Açık olmak gerekirse, bu bağlamda yeniden render etmek, tüm bileşenler için "render etmek" anlamına gelir, React'ın bunları sökeceği ve yeniden ekleyeceği anlamına gelmez. Uyumlaştırmayı, önceki bölümlerde belirtilen kurallara göre uygulayacaktır.

Yaygın kullanım durumlarını daha hızlı hale getirmek için sezgisel yöntemleri düzenli olarak geliştiriyoruz. Mevcut uygulamada, bir alt ağacın kardeşleri arasında taşındığı gerçeğini ifade edebilirsiniz, ancak başka bir yere taşındığını söyleyemezsiniz. Algoritma tüm alt ağacı yeniden render edecektir.

React sezgisel yöntemlere dayandığı için, arkasındaki varsayımlar karşılanmazsa performans düşük olacaktır.

1. Algoritma, farklı bileşen tiplerinin alt ağaçlarını eşleştirmeye çalışmaz. Kendinizi çok benzer çıktıya sahip iki bileşen türü arasında geçiş yaparken görürseniz, bunları aynı tür yapmak isteyebilirsiniz. Pratikte, bunun bir sorun olmadığını gördük.

2. Anahtarlar kararlı, öngörülebilir ve benzersiz olmalıdır. Kararsız anahtarlar (`Math.random()` tarafından üretilenler gibi) birçok bileşen nesnesinin ve DOM düğümünün gereksiz yere yeniden oluşturulmasına neden olur ve bu da alt bileşenlerde performans düşüşüne ve state kaybına neden olabilir.
