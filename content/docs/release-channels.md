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

<<<<<<< HEAD
- [**En Yeni**](#latest-channel), istikrarlı, semver React sürümleri içindir. React'i npm'den yüklediğinizde elde edeceğiniz şey budur. Bugün kullandığınız kanal bu. **Bunu kullanıcılara yönelik tüm React uygulamaları için kullanın.**

- [**Sonraki**](#next-channel), React kaynak kodu veri havuzunun ana dalını izler. Bunları bir sonraki küçük semver sürümü için aday olarak düşünebilirsiniz. React ve üçüncü taraf projeleri arasındaki entegrasyon testi için bunu kullanın.
=======
- [**Latest**](#latest-channel) is for stable, semver React releases. It's what you get when you install React from npm. This is the channel you're already using today. **Use this for all user-facing React applications.**
- [**Next**](#next-channel) tracks the main branch of the React source code repository. Think of these as release candidates for the next minor semver release. Use this for integration testing between React and third party projects.
- [**Experimental**](#experimental-channel) includes experimental APIs and features that aren't available in the stable releases. These also track the main branch, but with additional feature flags turned on. Use this to try out upcoming features before they are released.

All releases are published to npm, but only Latest uses [semantic versioning](/docs/faq-versioning.html). Prereleases (those in the Next and Experimental channels) have versions generated from a hash of their contents and the commit date, e.g. `0.0.0-68053d940-20210623` for Next and `0.0.0-experimental-68053d940-20210623` for Experimental.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

- [**Deneysel**](#eperimental-channel), kararlı sürümlerde bulunmayan deneysel API'leri ve özellikleri içerir. Bunlar ayrıca ana dalı izler, ancak ek özellik bayrakları açıktır. Gelecek özellikleri yayınlanmadan önce denemek için bunu kullanın.


Tüm sürümler npm'de yayınlanır, ancak yalnızca en yeni kullanımlar [anlamsal sürüm oluşturma](/docs/faq-versioning.html). Ön yayınlar (Sonraki ve Deneysel kanallarında bulunanlar), kendi içeriklerinin bir karma değerinden oluşturulan sürümlere sahiptir, örneğin İleri için `0.0.0-1022ee0ec` ve Deney için `0.0.0-experimental-1022ee0ec`.


**Kullanıcıya yönelik uygulamalar için resmi olarak desteklenen tek yayın kanalı En Yeni kanalıdır**. Sonraki ve Deneysel sürümler yalnızca test amacıyla sağlanmıştır ve En Yeni sürümler için kullandığımız semver protokolünü takip etmediklerinden dolayı sürümler arasında davranışın değişmeyeceğine dair hiçbir garanti vermiyoruz. 

Ön sürümleri, istikrarlı sürümler için kullandığımız kayıt defterinde yayınlayarak, [unpkg](https://unpkg.com) ve [CodeSandbox](https://codesandbox.io) gibi npm iş akışını destekleyen birçok araçtan yararlanabiliyoruz. .

### En Yeni Kanalı {#latest-channel}
En Yeni, istikrarlı React sürümleri için kullanılan kanaldır. Npm'deki `latest` etiketine karşılık gelir. Gerçek kullanıcılara gönderilen tüm React uygulamaları için önerilen kanaldır.

<<<<<<< HEAD
**Hangi kanalı kullanmanız gerektiğinden emin değilseniz, kullanmanız gereken kanal En Yeni kanalıdır.** Bir React yazılımcısıysanız, zaten kullandığınız budur.
=======
The Next channel is a prerelease channel that tracks the main branch of the React repository. We use prereleases in the Next channel as release candidates for the Latest channel. You can think of Next as a superset of Latest that is updated more frequently.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

Güncellemelerin son derece istikrarlı olmasını bekleyebilirsiniz. Sürümler semantik versiyonlama şemasını takip eder. [Sürüm oluşturma politikamız](/docs/faq-versioning.html) sayfasından istikrarlılık ve aşamalı geçiş taahhüdümüz hakkında daha fazla bilgi edininiz.

### Sonraki Kanalı {#next-channel}

<<<<<<< HEAD
Sonraki kanal, React kaynak kodu ana dalını izleyen bir yayın öncesi kanaldır. Bir Sonraki kanaldaki yayın öncesi sürümleri, En Son kanal için yayın adayları olarak kullanıyoruz. İleri kanalını , daha sık güncellenen En Yeni kanalının  üstkümesi olarak düşünebilirsiniz.
=======
Releases in Next are published with the `next` tag on npm. Versions are generated from a hash of the build's contents and the commit date, e.g. `0.0.0-68053d940-20210623`.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

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

<<<<<<< HEAD
Genellikle Sonraki kanalına yönelik bir güncellemeye, Deneysel kanalına karşılık gelen bir güncelleme eşlik eder. Aynı kaynak revizyonuna dayanırlar, ancak farklı bir özellik bayrağı seti kullanılarak oluşturulmuştur.
=======
Like Next, the Experimental channel is a prerelease channel that tracks the main branch of the React repository. Unlike Next, Experimental releases include additional features and APIs that are not ready for wider release.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

Deneysel sürümler, Sonraki ve En Yeni sürümlerden daha farklı olabilir. **Deneysel sürümleri kullanıcılara yönelik uygulamalarda kullanmayınız.** Deney kanalındaki sürümler arasında sık sık değişiklik yapılmasını beklemelisiniz.

Deneysel sürümler npm'de `experimental` etiketi ile yayınlanır. Sürümler, yapının kendi içeriğinin bir karma değerinden oluşturulur, örneğin; `0.0.0-experimental-1022ee0ec`.

<<<<<<< HEAD
=======
Releases in Experimental are published with the `experimental` tag on npm. Versions are generated from a hash of the build's contents and the commit date, e.g. `0.0.0-experimental-68053d940-20210623`.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28

#### Deneysel Bir Sürümde Neler Oluyor? {#what-goes-into-an-experimental-release}

Deneysel özellikler, daha geniş bir kitleye sunulmaya hazır olmayan özelliklerdir ve sonuçlandırılmadan önce büyük ölçüde değişebilirler. Bazı deneyler asla sonuçlandırılamaz -- deney yapmamızın nedeni, önerilen değişikliklerin uygulanabilirliğini test etmektir.

Örneğin, Hooks'u duyurduğumuzda Deneysel kanal mevcut olsaydı, Hooks'u En Yeni kanalında kullanıma sunmadan haftalar önce Deneysel kanalında yayınlardık.

Denemeye karşı entegrasyon testleri yapmayı değerli bulabilirsiniz. Bu size kalmış. Ancak, Deneysel kanalının Sonraki kanalından daha az istikrarlı olduğunu unutmayınız. **Deneysel sürümler arasında herhangi bir istikrarı garanti etmiyoruz.**

#### Deneysel Özellikler Hakkında Nasıl Daha Fazla Bilgi Edinebilirim? {#how-can-i-learn-more-about-experimental-features}

Deneysel özellikler belgelenebilir veya belgelenmeyebilir. Genellikle, deneyler Sonrakine veya En yeni'ye gönderime yakın olana kadar belgelenmez.

Bir özellik belgelenmezse, bir [RFC](https://github.com/reactjs/rfcs) eşlik edebilir.

Yeni deneyleri duyurmaya hazır olduğumuzda [React blog](/blog)'da  yayınlayacağız, ancak bu, her denemeyi yayınlayacağımız anlamına gelmez.

<<<<<<< HEAD
Kapsamlı bir değişiklik listesi için her zaman herkese açık olan GitHub depomuzun [geçmişine](https://github.com/facebook/react/commits/master) başvurabilirsiniz.
=======
You can always refer to our public GitHub repository's [history](https://github.com/facebook/react/commits/main) for a comprehensive list of changes.
>>>>>>> 0bb0303fb704147452a568472e968993f0729c28
