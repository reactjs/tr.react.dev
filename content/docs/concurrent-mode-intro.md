---
id: concurrent-mode-intro
title: Eşzamanlı Mod'a Giriş (Deneysel)
permalink: docs/concurrent-mode-intro.html
next: concurrent-mode-suspense.html
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

Bu sayfa Eşzamanlı Mod'a teorik bir bakış açısı kazandırmaktadır. **Daha uygulamalı bir başlangıç için aşağıdaki bölümlere göz atmak isteyebilirsiniz:**

* [Veri Alımı İçin Bekleme](/docs/concurrent-mode-suspense.html) React bileşenlerinde veri alımı için yeni bir mekanizma sunar.
* [Eşzamanlı Kullanıcı Arayüzü Şablonları](/docs/concurrent-mode-patterns.html) Eşzamanlı Mod ve Bekleme sayesinde mümkün kılınan birkaç kullanıcı arayüzü şablonundan bahseder.
* [Eşzamanlı Mod'u Benimsemek](/docs/concurrent-mode-adoption.html) Eşzamanlı Mod'u projenizde nasıl deneyebileceğinizi açıklar.
* [Eşzamanlı Mod API Kaynağı](/docs/concurrent-mode-reference.html) Eşzamanlı Mod için bir API dökümantasyonudur.

## Eşzamanlı Mod Nedir? {#what-is-concurrent-mode}

Eşzamanlı Mod, React uygulamalarının kullanıcı cihaz kapasitelerine ve ağ hızlarına uyumlu şekilde davranmalarını sağlayan bir dizi yeni özelliktir.

Bu özellikler hala deneyseldir ve değişime açıktır. Stabil React versiyonunun henüz bir parçası değildir, ancak deneysel geliştirmelerinizde bu özellikleri kullanabilirsiniz.

## Engelleyici Render Etmek, Kesilebilir Render Etmeye Karşı {#blocking-vs-interruptible-rendering}

**Eşzamanlı Mod'u açıklamak için versiyon kontrolünü bir metafor olarak kullanacağız.** Eğer bir yazılım geliştirme takımı ile çalışıyorsanız, büyük ihtimalle Git gibi bir versiyon kontrol sistemi kullanıyor ve branch'ler üzerinde çalışıyorsunuzdur. Branch'iniz hazır olduğunda diğer insanlar da üzerinde çalışabilsin diye master branch ile birleştirebilirsiniz.

Versiyon kontrolü var olmadan önce geliştirme iş akışı çok farklıydı. Branch gibi bir konsept yoktu. Birkaç dosyayı düzenlemek istediğinizde herkese haber vermeliydiniz ki işiniz bitene kadar kimse bu dosyalara dokunmasın. Herhangi birisiyle eşzamanlı olarak çalışmaya bile başlayamazdınız - resmen *bloklanırdınız*.

Bu konsept, React de dahil olmak üzere, kullanıcı arayüzü kütüphanelerinin bugün nasıl çalıştığını açıklıyor. Bir güncelleme render edilmeye başlandığında, yeni DOM node'ları oluşturmak ve bileşenlerin içerisindeki kodları çalıştırmak da dahil olmak üzere herhangi bir şekilde render yarıda kesilemiyor. Bu yaklaşımı "Engelleyici Render Etmek" olarak adlandıracağız.

Eşzamanlı Mod'da, render etmek engelleyici değil ve yarıda kesilebilir. Bu durum kullanıcı deneyimini iyileştirmekte ve aynı zamanda eskiden mümkün olmayan özelliklerin geliştirilmesini mümkün kılmakta. [İleri](/docs/concurrent-mode-suspense.html) [bölümlerdeki](/docs/concurrent-mode-patterns.html) somut örneklere geçmeden önce bu yeni özelliklere genel anlamıyla bir göz atacağız.

### Engellenebilir Render Etmek {#interruptible-rendering}

Filtrelenebilir bir ürün listesi düşünün. Daha önce bir liste filtresine yazı yazarken her tuş basışınızda takılıyormuş gibi hissetiniz mi? Ürün listesini güncellerken yapılan bazı eylemler kaçınılmaz olabilir, yeni DOM node'ları oluşturmak ya da tarayıcının sayfa düzenini oturtması gibi. Ancak, bu eylemleri *ne zaman* ve *nasıl* gerçekleştirdiğimiz oldukça önemlidir.

Bu takılmadan kurtulmanın en yaygın yolu girdi bekletmektir. Girdi bekletme yaparken ürün listesini yalnızca kullanıcı yazmayı bıraktıktan *sonra* güncelleriz. Ancak, yazı yazılırken güncellenmeyen bir kullanıcı arayüzü can sıkıcı olabilir. Bu duruma alternatif olarak girdi baskılama yapılabilir ve kullanıcının yazmayı bırakmasını beklemek yerine, belirli aralıklarla liste güncellenebilir. Fakat düşük güçteki cihazlarda hala takılmalar devam edecektir. Girdi bekletme de, baskılama da ortalama bir kullanıcı deneyimi sunmaktadır.

Takılmanın sebebi gayet basit bir şekilde açıklanabilir: Render işlemi, başladıktan sonra yarıda kesilemez. Bu durumda tarayıcı, girdiyi tuşa basılmasının hemen ardından güncelleyemez. Her ne kadar kaliteli bir kullanıcı arayüzü kütüphanesi (React gibi) kullanırsanız kullanın, eğer engelleyici render metodu kullanılıyorsa, bileşenlerinizdeki belirli sayıda eylemler her zaman takılmaya sebep olacaktır. Genellikle bu durumun kolay bir çözümü yoktur.

**Eşzamanlı Mod, render işlemini yarıda kesilebilir hale getirerek bu temel sınırlamayı ortadan kaldırır.** Bu durum, kullanıcı başka bir tuşa bastığında, tarayıcının girdiyi güncellemesinin React tarafından engellenmesine gerek olmayacağı anlamına gelmektedir. Bunun yerine React, tarayıcının girdiyi güncellemesine izin verir ve ardından *hafızadaki* güncellenmiş listeyi render etmeye devam eder. Render etme işlemi bittiğinde React DOM'u günceller ve değişiklikler ekrana yansıtılır.

Konsept olarak bu durumu, React her güncellemeyi bir "branch üzerinde" yapıyormuş gibi düşünebilirsiniz. Tıpkı branch üzerindeki işi yarıda bırakabileceğiniz ya da diğer branchler arasında geçiş yapabileceğiniz gibi, Eşzamanlı Mod'daki React, süregelen bir güncellemeyi daha önemli bir işi yapmak için yarıda bırakabilir ve ardından tekrar önceki işine geri dönebilir. Bu teknik aynı zamanda sizlere video oyunlarındaki [double buffering](https://wiki.osdev.org/Double_Buffering) sistemini anımsatabilir.

Eşzamanlı Mod tekniği, kullanıcı arayüzlerindeki girdi bekletme ve baskılama ihtiyacını azaltmaktadır. Render işlemi yarıda kesilebilir olduğundan, takılma problemini çözmek için React, sanal bir *gecikmeye* ihtiyaç duymamaktadır. Uygulamanın kullanıcıya olan duyarlılığını korumak için gerektiğinde render işlemini yarıda bırakabilir ve ardından tekrar render etmeye devam edebilir.

### Bilinçli Yükleme Sekansları {#intentional-loading-sequences}

Daha önce Eşzamanlı Mod'un, React'in "bir branch üzerinde" çalışıyormuş gibi işlediğinden bahsetmiştik. Branch'ler, kısa süreli çözümlerde olduğu gibi, yapımı uzun sürecek özelliklerde de faydalıdır. Bazı zamanlar, master branch ile birleştirilebilecek duruma gelmesi haftalar alabilecek özellikler üzerinde çalışıyor olabilirsiniz. Versiyon kontrol metaforumuzun bu tarafı da render etmeye uygulanabilir.

Bir uygulama üzerinde iki farklı sayfa arasında geçiş yaptığımızı hayal edin. Bazı durumlarda kullanıcıya yeterli kalitede bir yükleme sekansı veremeyecek kadar kod ya da veri yüklenmemiş olabilir. Boş bir ekrana geçiş yapmak ya da kocaman bir dönen çubuk görmek hoş bir deneyim olmayacaktır. Ancak, gerekli kod ve verinin elde edilmesinin çok uzun sürmemesi de oldukça sık rastlanan bir durumdur. **Böyle bir durumda React eski ekranda biraz daha kalsa ve yeni ekranı göstermeden önce "kötü yükleme sekansını" "pas geçse" iyi olmaz mıydı?**

Günümüzde bu her ne kadar uygulanabilir olsa da, uygulama içerisindeki uyumluluğu sağlaması oldukça zorlayıcı olabilir. Eşzamanlı Mod'da bu özellik hazır olarak bulunmaktadır. Öncelikle, React yeni ekranı hafızada hazırlamaya başlar - ya da metaforumuz üzerinden gitmek gerekirse "farklı bir branch üzerinde". Bu sayede React, DOM'u güncellemeden önce içeriklerin yüklenmesini bekleyebilir. Eşzamanlı Mod'da, React eski sayfayı diğer sayfanın yüklendiğini belirten bir yükleme belirteci eşliğinde etkileşime açık bir şekilde tutabilir ve yeni ekran hazır olduğunda kullanıcıyı o sayfaya yönlendirebilir.

### Eşzamanlılık {#concurrency}

Hadi yukarıdaki iki örneği tekrar gözden geçirelim ve Eşzamanlı Mod'un bu örnekleri nasıl birleştirdiğini anlayalım. **Eşzamanlı Mod'da, React birden çok state güncellemesi üzerinde *eşzamanlı* olarak çalışabilmektedir.** - tıpkı branch'lerin, ekip üyelerinin birbirlerinden bağımsız şekilde çalışabilmelerini sağladıkları gibi:

* CPU'ya bağlı güncellemeler (DOM node'larının oluşturulması ve bileşen kodlarının çalıştırılması gibi) için eşzamanlılık, süregelen render işlemi, daha aciliyeti olan güncellemeler tarafından "yarıda kesilebilir" anlamına gelmektedir.
* IO'ya bağlı güncellemeler (ağ üzerinden kod ya da verinin alınması gibi) için eşzamanlılık, verinin tamamı henüz ulaşmamış olsa dahi React bellekte render işlemine başlayabilir ve kullanıcı deneyimini zedeleyen, boş yükleme sekanslarını pas geçebilir anlamına gelmektedir.

Önemli olarak bahsetmek gerekir ki, React'in *kullanım* şekli de aynı bu teknik gibidir. Bileşenler, prop'plar ve state temel olarak aynı mantıkla çalışırlar. Ekranı güncellemek istediğinizde, state'i ayarlarsınız.

React bir güncellemenin aciliyetine karar vermek için sezgisel analiz tekniğini kullanır ve birkaç satır kod ile bunu ayarlamanıza olanak sağlar. Bu sayede, her etkileşimde istenen kullanıcı deneyimini elde edebilirsiniz.

## Araştırmayı Üretime Uygulamak {#putting-research-into-production}

Eşzamanlı Mod özellikleri arasında yaygın bir tema bulunmaktadır. **Bu özelliklerin görevi, İnsan-Bilgisayar Etkilişimi araştırmalarının, kullanımda olan kullanıcı arayüzlerine entegre edilmesine yardımcı olmaktır.**

Örnek olarak, bir araştırma, ekranlar arası geçişte çok fazla yükleme ekranı gösterilmesinin, bu geçişleri *daha yavaş* hissettirdiğini ortaya koymuştur. Eşzamanlı Mod'un, sık ve uyumsuz güncellemelerden kaçınmak amacıyla yükleme state'lerini sabit bir zamanlamada göstermesinin arkasında bu sebep yatmaktadır.

Benzer olarak, araştırmalar sayesinde, "hover" ve yazı girdisi gibi etkileşimlerin çok kısa bir sürede gerçekleşmesi gerekirken, tıklama ve sayfa geçişlerinin biraz daha uzun sürmesinin gecikme hissi yaşatmayacağını biliyoruz. Eşzamanlı Mod'un kullandığı "öncelikler" kabaca insan algısı araştırmalarının etkileşim kategorilerine göre şekillenmektedir.

Kullanıcı deneyimine önem gösteren ekipler bazen bu tür sorunları günü kurtaracak şekilde çözebilirler. Ancak bu çözümler, sürdürülebilirliği zor oldukları için, çok nadiren uzun vadeli bir fayda sağlayabilmektedir. Eşzamanlı Mod ile amacımız, kullanıcı arayüzü araştırmalarını somutlaştırmak ve kullanımını kolaylaştırmaktır. Bir kullanıcı arayüzü kütüphanesi olarak, React bu misyonunu sağlam bir şekilde sürdürmektedir.

## Sıradaki Adımlar {#next-steps}

Artık Eşzamanlı Mod'un ne olduğunu tamamen biliyorsun!

İleriki sayfalarda daha spesifik konular hakkında detaylar öğreneceksin:

* [Veri Alımı İçin Bekleme](/docs/concurrent-mode-suspense.html) React bileşenlerinde veri alımı için yeni bir mekanizma sunar.
* [Eşzamanlı Kullanıcı Arayüzü Şablonları](/docs/concurrent-mode-patterns.html) Eşzamanlı Mod ve Bekleme sayesinde mümkün kılınan birkaç kullanıcı arayüzü şablonundan bahseder.
* [Eşzamanlı Mod'u Benimsemek](/docs/concurrent-mode-adoption.html) Eşzamanlı Mod'u projenizde nasıl deneyebileceğinizi açıklar.
* [Eşzamanlı Mod API Kaynağı](/docs/concurrent-mode-reference.html) Eşzamanlı Mod için bir API dökümantasyonudur.
