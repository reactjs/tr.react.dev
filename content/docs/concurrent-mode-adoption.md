---
id: concurrent-mode-adoption
title: Eşzamanlı Mod'u Benimsemek (Deneysel)
permalink: docs/concurrent-mode-adoption.html
prev: concurrent-mode-patterns.html
next: concurrent-mode-reference.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>Dikkat:
>
>Bu sayfa, **henüz stabil sürümde yer almayan deneysel özellikleri** anlatmaktadır. Canlı ortamda React'in deneysel versiyonlarına güvenmeyin. Bu özellikler, React'in bir parçası olmadan önce büyük oranda ve haber verilmeden değişikliğe uğrayabilir.
>
>Bu dokümantasyonla erken adaptasyon yapanlar ve meraklı insanlar hedeflenmektedir. **Eğer React'te yeniyseniz, bu özellikleri önemsemeyin** -- bunları şu an öğrenmenize gerek yok.

</div>

- [Yükleme](#installation)
  - [Bu Deneysel Sürüm Kimin İçin?](#who-is-this-experimental-release-for)
  - [Eşzamanlı Modu Etkinleştirmek](#enabling-concurrent-mode)
- [Beklenmesi Gerekenler](#what-to-expect)
  - [Geçiş Adımı: Engelleme Modu](#migration-step-blocking-mode)
  - [Neden Bu Kadar Çok Mod Var?](#why-so-many-modes)
  - [Özellik Karşılaştırması](#feature-comparison)

## Yükleme {#installation}

Eşzamanlı mod sadece React'in [deneysel versiyonlarında](/blog/2019/10/22/react-release-channels.html#experimental-channel) bulunmaktadır. Onları yüklemek için, şu komutu çalıştırın:

```
npm install react@experimental react-dom@experimental
```
**Deneysel versiyonlar için mantıksal versiyonlamanın garantisi yoktur.** Herhangi bir `@experimental` sürümde API'lar eklenebilir, değişebilir veya kaldırılabilir.

**Deneysel versiyonlar sıkça bozucu değişimler içerirler.**

Bu sürümleri kişisel projelerinizde veya bir branch üzerinde deneyebilirsiniz, ancak canlıda kullanılmasını tavsiye etmeyiz. Biz Facebook'ta onları canlıda *kullanıyoruz*, ama bunun nedeni eğer bir şey bozulursa bugları düzeltmek için bizim varolmamız. Sizi uyardık!

### Bu Deneysel Sürüm Kimin İçin? {#who-is-this-experimental-release-for}

Bu sürüm öncelikli olarak erken benimseyenler, kütüphane sahipleri ve meraklı insanlar içindir.

Biz bu kodu canlıda kullanıyoruz (ve işimizi görüyor) ancak hala kimi buglar, eksik özellikler ve dokümantasyonda boşluklar var. Gelecekte yayınlanacak olan kararlı sürüme daha iyi hazırlanabilmek için eşzamanlı modda nelerin çalışmadığı konusunda bilgiye toplamak istiyoruz.

### Eşzamanlı Modu Etkinleştirmek {#enabling-concurrent-mode}

Normalde React'e bir özellik eklediğimizde onu hemen kullanmaya başlayabilirsiniz. Fragment, Context ve hatta Hooks böyle özelliklere bir örnek. Bunları eski kodda herhangi bir değişiklik yapmadan yeni kodda kulanabilirsiniz.

Eşzamanlı mod ise farklı. React'in nasıl çalıştığı konusunda mantıksal değişiklikler ekliyor. Aksi takdirde onun etkinleştirdiği [yeni özellikler](/docs/concurrent-mode-patterns.html) *mümkün  olamazdı*. Bu yüzden izole bir şekilde teker teker yayınlanmak yerine yeni bir "mod" altında gruplandırıldılar.

Eşzamanlı modu sadece belli alt ağaçlarda kullanamazsınız. Onun yerine bugün `ReactDOM.render()` metodunu çağırdığınız yerde kullanmanız gerekiyor.

**Bu tüm `<App />` ağacı için eşzamanlı modu etkinleştirir:**

```js
import ReactDOM from 'react-dom';

// Eğer eskiden
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// kullanıyorduysanız, eşzamanlı modu şunu yazarak etkinleştirebilirsiniz:

ReactDOM.createRoot(
  document.getElementById('root')
).render(<App />);
```

>Not:
>
>`createRoot` gibi eşzamanlı mod APIları React'in sadece deneysel versiyonlarında bulunmaktadır.

Eşzamanlı modda [daha önce](/blog/2018/03/27/update-on-async-rendering.html) "güvensiz" olarak işaretlenmiş yaşam döngüsü metotları bu sefer gerçekten *güvensizdir* ve bugünkü React'ten dahi daha çok hataya sebep olurlar. Uygulamanızın [Strict Mode](/docs/strict-mode.html) desteği olana dek eşzamanlı modu kullanmanızı önermiyoruz.

## Beklenmesi Gerekenler {#what-to-expect}

Eğer büyük bir uygulamanız varsa veya uygulamanızın çok fazla üçüncü parti paketlere bağımlılığı varsa, lütfen eşzamanlı modu anında kullanabileceğiziniz düşünmeyin. **Örneğin biz Facebook'ta eşzamanlı modu yeni sitede kullanıyoruz ama eski sitede kullanmayı planlamıyoruz.** Bunun nedeni, eski sitemizin hala güvensiz yaşam döngüsü metotlarını, uyumsuz üçüncü parti kütüphanelerini ve eşzamanlı modla çok iyi çalışmayan desenleri canlı kodda kullanıyor olması.

Bizim tecrübemiz, deyimsel React desenlerini kullanan ve harici state yönetimi çözümlerine bel bağlamayan kodun eşzamanlı modu çalıştırmada en kolay olduğu yönünde. Gördüğümüz ortak sorunları ve onların çözümlerini önümüzdeki haftalarda ayrıca anlatacağız.

### Geçiş Adımı: Engelleme Modu {#migration-step-blocking-mode}

Eski kodlar için eşzamanlı mod biraz ileri gidiyor olabilir. Bu yüzden de deneysel React versiyonunda yeni "engelleme modu"nu sunuyoruz. `createRoot` yerine `createBlockingRoot` deneyebilirsiniz. Bu, eşzamanlı mod özelliklerinin sadece *küçük bir kısmını* sunar, ama React'in bugünkü çalışmasına yakındır ve bir geçiş adımı olarak kullanılabilir.

Toplamak gerekirse:

* **Miras modu:** `ReactDOM.render(<App />, rootNode)`. Bu, React uygulamalarının bugün kullandığı moddur. Gözlemlenebilir gelecekte miras modunu kaldırma planı yok - ama bu yeni özellikler de bu modla kullanılamayacak.
* **Engelleme Modu:** `ReactDOM.createBlockingRoot(rootNode).render(<App />)`. Bu, şu anda deneysel. Eşzamanlı modun özelliklerinin bir alt kümesini kullanmak isteyen uygulamalar için bir geçiş adımı olarak düşünüldü.
* **Eşzamanlı mod:** `ReactDOM.createRoot(rootNode).render(<App />)`. 
Bu, şu anda deneysel. Gelecekte, kararlılığa ulaştıktan sonra onu öntanımlı React modu yapmayı istiyoruz. Bu, yeni özelliklerin *tamamını* etkinleştiriyor.

### Neden Bu Kadar Çok Mod Var? {#why-so-many-modes}

Biz, çok büyük ve bozucu değişiklikler yapmak yerine [kademeli geçiş stratejisi](/docs/faq-versioning.html#commitment-to-stability) sunmanın - veya React'in gereksizliğe doğru durulmasının - daha iyi olduğunu düşünüyoruz.

Pratikte miras modunu kullanan uygulamaların çoğunun en azından engelleme moduna (hatta eşzamanlı moda) geçişi mümkün olmalı. Bu parçalanma, tüm modları desteklemeyi hedefleyen kütüphaneler için kısa vadede can sıkıcı olabilir. Ancak, ekosistemi miras modundan kademeli olarak uzaklaşmak aynı zamanda React ekosistemindeki büyük kütüphaneleri etkileyen [layoutu okurken kafa karıştıran Suspense davranışı](https://github.com/facebook/react/issues/14536) ve [tutarlı harmanlama garantisinin olmayışı](https://github.com/facebook/react/issues/15080) gibi sorunları da *çözecektir*. Miras modunda bulunan kimi hatalar mantıksal değişiklikler yapılmadan çözülemiyor ama engelleme modunda ve eşzamanlı modda bulunmuyor. 

Engelleme modunu, eşzamanlı modun "zarifçe indirgenmiş" bir versiyonu olarak düşünebilirsiniz. **Sonuç olarak, uzun vadede birleştirebileceğiz ve farklı modları düşünmeyi komple bırakabileceğız.**  Ama şimdilik modlar önemli bir geçiş stratejisi. Geçiş yapmaya değip değmeyeceğine herkesin kendinin karar vermesine ve kendi hızlarıyla yükseltmelerine izin veriyorlar.

### Özellik Karşılaştırması {#feature-comparison}

<style>
  #feature-table table { border-collapse: collapse; }
  #feature-table th { padding-right: 30px; }
  #feature-table tr { border-bottom: 1px solid #eee; }
</style>

<div id="feature-table">

|   |Miras modu  |Engelleme modu  |Eşzamanlı mod  |
|---  |---  |---  |---  |
|[String referansları](/docs/refs-and-the-dom.html#legacy-api-string-refs)  |✅  |🚫**  |🚫**  |
|[Miras Contexti](/docs/legacy-context.html) |✅  |🚫**  |🚫**  |
|[findDOMNode](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)  |✅  |🚫**  |🚫**  |
|[Suspense](/docs/concurrent-mode-suspense.html#what-is-suspense-exactly) |✅  |✅  |✅  |
|[SuspenseList](/docs/concurrent-mode-patterns.html#suspenselist) |🚫  |✅  |✅  |
|Suspense SSR + Hydration |🚫  |✅  |✅  |
|Kademeli Hydration  |🚫  |✅  |✅  |
|Seçili Hydration  |🚫  |🚫  |✅  |
|İşbirlikli Çoklugörev |🚫  |🚫  |✅  |
|Çoklu setStates'in otomatik olarak gruplanması     |🚫* |✅  |✅  |
|[Öncelik tabanlı Rendering](/docs/concurrent-mode-patterns.html#splitting-high-and-low-priority-state) |🚫  |🚫  |✅  |
|[Bölünebilir Prerendering](/docs/concurrent-mode-intro.html#interruptible-rendering) |🚫  |🚫  |✅  |
|[useTransition](/docs/concurrent-mode-patterns.html#transitions)  |🚫  |🚫  |✅  |
|[useDeferredValue](/docs/concurrent-mode-patterns.html#deferring-a-value) |🚫  |🚫  |✅  |
|[Suspense Reveal "Train"](/docs/concurrent-mode-patterns.html#suspense-reveal-train)  |🚫  |🚫  |✅  |

</div>

\*: Miras modunun React tarafından yönetilen olaylarda otomatik kümelemesi var ama sadece tek tarayıcı göreviyle sınırlı. React dışı olaylar `unstable_batchedUpdates` kullanarak katılmak zorunda. Engelleme modunda ve eşzamanlı modda tüm `setState`ler öntanımlı olarak kümeleniyor.

\*\*: Geliştirmede uyarı verir.
