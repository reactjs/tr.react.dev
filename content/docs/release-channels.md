---
id: release-channels
title: Yayın Kanalları
permalink: docs/release-channels.html
layout: docs
category: installation
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

En son yayınlanan Sonraki sürüm ile en Yeni sürüm arasındaki fark, iki küçük dönem sürümü arasında bulacağınız farkla yaklaşık olarak aynı değere sahiptir. Ancak, **Sonraki kanalı, semantik sürümlemeye uymuyor.** Sonraki kanalda birbirini izleyen sürümler arasında zaman zaman değişiklik yapılması beklenmelidir.

**Ön sürümleri kullanıcılara yönelik uygulamalarda kullanmayınız.**

Sonraki kanalındaki sürümler npm'de `next` etiketi ile yayınlanır. Sürümler, yapının içeriğinin bir karma değerinden oluşturulur; `0.0.0-1022ee0ec`.

#### Sonraki Kanalını Entegrasyon Testi için  Kullanma {#using-the-next-channel-for-integration-testing}

Sonraki kanalı, React ve diğer projeler arasındaki entegrasyon testini desteklemek için tasarlanmıştır.

React'taki tüm değişiklikler kamuya açıklanmadan önce kapsamlı dahili testlerden geçer. Bununla birlikte, React ekosisteminde kullanılan sayısız ortam ve konfigürasyon vardır ve her birine karşı test etmemiz mümkün değildir.

Üçüncü taraf React çatısının, kitaplığının, geliştirici aracının veya benzer altyapı tipi bir projenin sahibiyseniz, test paketinizi en yeni sürümlere karşı düzenli olarak çalıştırarak, React'ı kullanıcılarınız ve tüm React topluluğu için istikrarlı tutmamıza yardımcı olabilirsiniz. İlgileniyorsanız şu adımları izleyiniz:

- Tercih ettiğiniz sürekli entegrasyon platformunu kullanarak bir cron işi oluşturun. Cron işleri hem [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) hem de [Travis CI](https://docs.travis-ci.com/user/cron-jobs/) tarafından desteklenmektedir. 
- Cron işinde, npm'de `next` etiketini kullanarak React paketlerinizi Sonraki kanalındaki en son React sürümüne güncelleyin. Npm cli kullanarak:

  ```
  npm update react@next react-dom@next
  ```

  Yada yarn ile:

  ```
  yarn upgrade react@next react-dom@next
  ```

- Test paketinizi güncellenmiş paketlere karşı çalıştırın.
- Her şey geçerse harika! Projenizin bir sonraki küçük React sürümüyle çalışmasını bekleyebilirsiniz.
- Bir şey beklenmedik bir şekilde çalışmazsa, lütfen [bir sorun bildirerek](https://github.com/facebook/react/issues) bize bildiriniz.


Next.js bu iş akışını kullanan projelerden birisidir. (Kelime oyunu yok! Gerçekten!) Örnek olarak [CircleCI yapılandırması](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml)'na  başvurabilirsiniz.

### Experimental Channel {#experimental-channel}

Like Next, the Experimental channel is a prerelease channel that tracks the master branch of the React repository. Unlike Next, Experimental releases include additional features and APIs that are not ready for wider release.

Usually, an update to Next is accompanied by a corresponding update to Experimental. They are based on the same source revision, but are built using a different set of feature flags.

Experimental releases may be significantly different than releases to Next and Latest. **Do not use Experimental releases in user-facing applications.** You should expect frequent breaking changes between releases in the Experimental channel.

Releases in Experimental are published with the `experimental` tag on npm. Versions are generated from a hash of the build's contents, e.g. `0.0.0-experimental-1022ee0ec`.

#### What Goes Into an Experimental Release? {#what-goes-into-an-experimental-release}

Experimental features are ones that are not ready to be released to the wider public, and may change drastically before they are finalized. Some experiments may never be finalized -- the reason we have experiments is to test the viability of proposed changes.

For example, if the Experimental channel had existed when we announced Hooks, we would have released Hooks to the Experimental channel weeks before they were available in Latest.

You may find it valuable to run integration tests against Experimental. This is up to you. However, be advised that Experimental is even less stable than Next. **We do not guarantee any stability between Experimental releases.**

#### How Can I Learn More About Experimental Features? {#how-can-i-learn-more-about-experimental-features}

Experimental features may or may not be documented. Usually, experiments aren't documented until they are close to shipping in Next or Stable.

If a feature is not documented, they may be accompanied by an [RFC](https://github.com/reactjs/rfcs).

We will post to the [React blog](/blog) when we're ready to announce new experiments, but that doesn't mean we will publicize every experiment.

You can always refer to our public GitHub repository's [history](https://github.com/facebook/react/commits/master) for a comprehensive list of changes.
