---
id: hello-world
title: Merhaba Dünya
permalink: docs/hello-world.html
prev: cdn-links.html
next: introducing-jsx.html
---

En basit React örneği aşağıdaki gibidir:
```js
ReactDOM.render(
  <h1>Merhaba dünya!</h1>,
  document.getElementById('root')
);
```


Ekrana "Merhaba dünya!" başlığını yazdırır.

**[Codepen'de Aç](codepen://hello-world)**

Yukarıdaki linke tıklayarak online düzenleyiciyi açabilirsiniz. Değişiklik yapmaktan çekinmeyin ve yaptığınız değişikliklerin çıktısını gözlemleyin. Bu rehberdeki çoğu sayfada bunun gibi düzenlenebilir örnekler göreceksiniz.

## Bu Rehberi Nasıl Okumalısınız? {#how-to-read-this-guide}

Bu rehberde, React uygulamalarının yapı taşları olan elemanları (Element) ve bileşenleri (Component) inceleyeceğiz. Bunlarda uzmanlaştığınızda, küçük ve tekrar kullanılabilir parçalardan karmaşık uygulamalar oluşturabilirsiniz.

>İpucu
>
>Bu rehber **adım adım öğrenme** konseptini tercih eden kişiler için hazırlanmıştır. Eğer yaparak öğrenmeyi tercih ediyorsanız, [pratik öğretici](/tutorial/tutorial.html) sayfamıza göz atabilirsiniz. Bu rehberi ve pratiğe dayalı dersleri birbirine tamamlayıcı olarak kullanabilirsiniz.

Bu bölüm, adım adım temel React konseptlerinin ilk bölümü. Yandaki menüden diğer bölümlere ulaşabilirsiniz. Eğer bunu mobil cihazda okuyorsanız, sağ alt köşedeki butona basarak menüye ulaşabilirsiniz.

Bu rehberdeki her bölüm, önceki bölümlerden edinilen bilgilere dayanarak ilerlemektedir. **Yan menüde "Temel Konseptler" başlığı altındaki bölümleri sırasıyla okuyarak React hakkındaki önemli konuları öğrenebilirsiniz.** Örneğin bundan sonraki bölüm, [“JSX'e Giriş”](/docs/introducing-jsx.html).

## Bilgi Seviyesi Varsayımları {#knowledge-level-assumptions}

React bir JavaScript kütüphanesidir ve bu yüzden sizin temel düzeyde JavaScript dilini anladığınızı varsayacağız. **Eğer yeteri kadar rahat hissetmiyorsanız, [JavaScript derslerine](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) göz atmanızı ve bilgi seviyenizi kontrol etmenizi** tavsiye ederiz. Böylelikle bu rehberi takip ederken kaybolmazsınız. Bu, yaklaşık 30 dakika ile 1 saat arası bir sürenizi alabilir; fakat sonuç olarak aynı anda hem React hem JavaScript öğreniyormuş gibi hissetmek zorunda hissetmeyeceksiniz.

>Not
>
<<<<<<< HEAD
>Bu rehberdeki örneklerde bazen yeni JavaScript sözdizimi kullanımlarına rastlayabilirsiniz. Eğer son bir kaç yıldır JavaScript'le çalışmadıysanız,
[bu üç madde](https://gist.github.com/gaearon/683e676101005de0add59e8bb345340c) şu an için yeterli olacaktır.
=======
>This guide occasionally uses some newer JavaScript syntax in the examples. If you haven't worked with JavaScript in the last few years, [these three points](https://gist.github.com/gaearon/683e676101005de0add59e8bb345340c) should get you most of the way.
>>>>>>> 68e4efcf93b6e589355f6aa3cbc3f3c811c0ad37


## Hadi Başlayalım! {#lets-get-started}

Aşağı inmeye devam edin, sayfanın en altından hemen önce, [bu rehberin bir sonraki bölümü](/docs/introducing-jsx.html)nün linkini bulacaksınız.


