---
id: release-channels
title: Yayın Kanalları
permalink: docs/release-channels.html
layout: docs
category: installation
prev: cdn-links.html
next: hello-world.html
---

React, hata raporlarını dosyalamak, pull request açmak ve [RFC göndermek](https://github.com/reactjs/rfcs) için başarılı bir açık kaynak topluluğuna güvenir. Geri bildirimi teşvik etmek için bazen yayınlanmamış özellikler içeren özel React yapılarını paylaşırız.

 > Bu belge, en çok çatı, kütüphane veya geliştirici araçları üzerinde çalışan yazılımcılar için uygundur. React'i öncelikle kullanıcılara yönelik uygulamalar oluşturmak için kullanan yazılımcıların yayın öncesi kanallarımız hakkında endişelenmeleri gerekmez.

 React'in yayın kanallarının her biri ayrı bir kullanım için tasarlanmıştır:

- [**En Yeni**](#latest-channel), istikrarlı, semver React sürümleri içindir. React'i npm'den yüklediğinizde elde edeceğiniz şey budur. Bugün kullandığınız kanal bu. **Bunu kullanıcılara yönelik tüm React uygulamaları için kullanın.**

- [**Sonraki**](#next-channel), React kaynak kodu veri havuzunun ana dalını izler. Bunları bir sonraki küçük semver sürümü için aday olarak düşünebilirsiniz. React ve üçüncü taraf projeleri arasındaki entegrasyon testi için bunu kullanın.

- [**Deneysel**](#eperimental-channel), kararlı sürümlerde bulunmayan deneysel API'leri ve özellikleri içerir. Bunlar ayrıca ana dalı izler, ancak ek özellik bayrakları açıktır. Gelecek özellikleri yayınlanmadan önce denemek için bunu kullanın.


Tüm sürümler npm'de yayınlanır, ancak yalnızca en yeni kullanımlar [anlamsal sürüm oluşturma](/docs/faq-versioning.html). Ön yayınlar (Sonraki ve Deneysel kanallarında bulunanlar), kendi içeriklerinin bir karma değerinden oluşturulan sürümlere sahiptir, örneğin İleri için `0.0.0-1022ee0ec` ve Deney için `0.0.0-experimental-1022ee0ec`.


**Kullanıcıya yönelik uygulamalar için resmi olarak desteklenen tek yayın kanalı En Yeni kanalıdır**. Sonraki ve Deneysel sürümler yalnızca test amacıyla sağlanmıştır ve En Yeni sürümler için kullandığımız semver protokolünü takip etmediklerinden dolayı sürümler arasında davranışın değişmeyeceğine dair hiçbir garanti vermiyoruz. 

Ön sürümleri, istikrarlı sürümler için kullandığımız kayıt defterinde yayınlayarak, [unpkg](https://unpkg.com) ve [CodeSandbox](https://codesandbox.io) gibi npm iş akışını destekleyen birçok araçtan yararlanabiliyoruz. .

### En Yeni Kanalı {#latest-channel}
En Yeni, istikrarlı React sürümleri için kullanılan kanaldır. Npm'deki `latest` etiketine karşılık gelir. Gerçek kullanıcılara gönderilen tüm React uygulamaları için önerilen kanaldır.

**Hangi kanalı kullanmanız gerektiğinden emin değilseniz, kullanmanız gereken kanal En Yeni kanalıdır.** Bir React yazılımcısıysanız, zaten kullandığınız budur.

Güncellemelerin son derece istikrarlı olmasını bekleyebilirsiniz. Sürümler semantik versiyonlama şemasını takip eder. [Sürüm oluşturma politikamız](/docs/faq-versioning.html) sayfasından istikrarlılık ve aşamalı geçiş taahhüdümüz hakkında daha fazla bilgi edininiz.

### Sonraki Kanalı {#next-channel}

Sonraki kanal, React kaynak kodu ana dalını izleyen bir yayın öncesi kanaldır. Bir Sonraki kanaldaki yayın öncesi sürümleri, En Son kanal için yayın adayları olarak kullanıyoruz. İleri kanalını , daha sık güncellenen En Yeni kanalının  üstkümesi olarak düşünebilirsiniz.

En son yayınlanan Sonraki sürüm ile en Yeni sürüm arasındaki fark, iki küçük dönem sürümü arasında bulacağınız farkla yaklaşık olarak aynı değere sahiptir. Ancak, **Sonraki kanalı, semantik sürümlemeye uymaz.** Sonraki kanalda birbirini izleyen sürümler arasında zaman zaman değişiklik yapılması beklenmelidir.

**Ön sürümleri kullanıcılara yönelik uygulamalarda kullanmayınız.**

Sonraki kanalındaki sürümler npm'de `next` etiketi ile yayınlanır. Sürümler, yapının kendi içeriğinin bir karma değerinden oluşturulur; `0.0.0-1022ee0ec`.

#### Sonraki Kanalını Entegrasyon Testi için  Kullanma {#using-the-next-channel-for-integration-testing}

Sonraki kanalı, React ve diğer projeler arasındaki entegrasyon testini desteklemek için tasarlanmıştır.

React'teki tüm değişiklikler kamuya açıklanmadan önce kapsamlı dahili testlerden geçer. Bununla birlikte, React ekosisteminde kullanılan sayısız ortam ve konfigürasyon vardır ve her birine karşı test etmemiz mümkün değildir.

Üçüncü taraf React çatısının, kitaplığının, geliştirici aracının veya benzer altyapı tipi bir projenin sahibiyseniz, test paketinizi en yeni sürümlere karşı düzenli olarak çalıştırarak, React'i kullanıcılarınız ve tüm React topluluğu için istikrarlı tutmamıza yardımcı olabilirsiniz. İlgileniyorsanız şu adımları izleyiniz:

- Tercih ettiğiniz sürekli entegrasyon platformunu kullanarak bir cron işi oluşturun. Cron işleri hem [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) hem de [Travis CI](https://docs.travis-ci.com/user/cron-jobs/) tarafından desteklenmektedir. 
- Cron işinde, npm'de `next` etiketini kullanarak React paketlerinizi Sonraki kanalındaki en son React sürümüne güncelleyin. Npm cli kullanarak:

  ```
  npm update react@next react-dom@next
  ```

  Ya da yarn ile:

  ```
  yarn upgrade react@next react-dom@next
  ```

- Test paketinizi güncellenmiş paketlere karşı çalıştırın.
- Her şey geçerse harika! Projenizin bir sonraki küçük React sürümüyle çalışmasını bekleyebilirsiniz.
- Beklenmedik bir şekilde herhangi bir şeyin çalışmaması durumunda, lütfen [bir sorun bildirerek](https://github.com/facebook/react/issues) bizimle iletişime geçiniz.


Next.js bu iş akışını kullanan projelerden birisidir. (Kelime oyunu yok! Gerçekten!) Örnek olarak [CircleCI yapılandırması](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml)'na  başvurabilirsiniz.

### Deneysel Kanal {#experimental-channel}

Sonraki kanalı gibi, Deneysel kanal da React deposunun ana dalını izleyen bir yayın öncesi kanaldır. Sonraki'nin aksine, Deneysel sürümler, geniş bir sürüme hazır olmayan ek özellikler ve API'ler içerir.

Genellikle Sonraki kanalına yönelik bir güncellemeye, Deneysel kanalına karşılık gelen bir güncelleme eşlik eder. Aynı kaynak revizyonuna dayanırlar, ancak farklı bir özellik bayrağı seti kullanılarak oluşturulmuştur.

Deneysel sürümler, Sonraki ve En Yeni sürümlerden daha farklı olabilir. **Deneysel sürümleri kullanıcılara yönelik uygulamalarda kullanmayınız.** Deney kanalındaki sürümler arasında sık sık değişiklik yapılmasını beklemelisiniz.

Deneysel sürümler npm'de `experimental` etiketi ile yayınlanır. Sürümler, yapının kendi içeriğinin bir karma değerinden oluşturulur, örneğin; `0.0.0-experimental-1022ee0ec`.


#### Deneysel Bir Sürümde Neler Oluyor? {#what-goes-into-an-experimental-release}

Deneysel özellikler, daha geniş bir kitleye sunulmaya hazır olmayan özelliklerdir ve sonuçlandırılmadan önce büyük ölçüde değişebilirler. Bazı deneyler asla sonuçlandırılamaz -- deney yapmamızın nedeni, önerilen değişikliklerin uygulanabilirliğini test etmektir.

Örneğin, Hooks'u duyurduğumuzda Deneysel kanal mevcut olsaydı, Hooks'u En Yeni kanalında kullanıma sunmadan haftalar önce Deneysel kanalında yayınlardık.

Denemeye karşı entegrasyon testleri yapmayı değerli bulabilirsiniz. Bu size kalmış. Ancak, Deneysel kanalının Sonraki kanalından daha az istikrarlı olduğunu unutmayınız. **Deneysel sürümler arasında herhangi bir istikrarı garanti etmiyoruz.**

#### Deneysel Özellikler Hakkında Nasıl Daha Fazla Bilgi Edinebilirim? {#how-can-i-learn-more-about-experimental-features}

<<<<<<< HEAD
Deneysel özellikler belgelenebilir veya belgelenmeyebilir. Genellikle, deneyler Sonraki veya İstikrarlı'ya gönderime yakın olana kadar belgelenmez.
=======
Experimental features may or may not be documented. Usually, experiments aren't documented until they are close to shipping in Next or Latest.
>>>>>>> 63332462bb5afa18ac7a716975b679f4c23cc8a1

Bir özellik belgelenmezse, bir [RFC](https://github.com/reactjs/rfcs) eşlik edebilir.

Yeni deneyleri duyurmaya hazır olduğumuzda [React blog](/blog)'da  yayınlayacağız, ancak bu, her denemeyi yayınlayacağımız anlamına gelmez.

Kapsamlı bir değişiklik listesi için her zaman herkese açık olan GitHub depomuzun [geçmişine](https://github.com/facebook/react/commits/master) başvurabilirsiniz.