---
id: release-channels
title: Yayın Kanalları
permalink: docs/release-channels.html
layout: docs
category: installation
---

React, hata raporlarını dosyalamak, pull request açmak ve [RFC göndermek] (https://github.com/reactjs/rfcs) için başarılı bir açık kaynak topluluğuna güvenir. Geri bildirimi teşvik etmek için bazen yayınlanmamış özellikler içeren özel React yapılarını paylaşırız.



 Bu belge, en çok çatı, kütüphane veya geliştirici araçları üzerinde çalışan yazılımcılar için uygundur. React'i öncelikle kullanıcılara yönelik uygulamalar oluşturmak için kullanan yazılımcıların yayın öncesi kanallarımız hakkında endişelenmeleri gerekmez.



 React'in yayın kanallarının her biri ayrı bir kullanım için tasarlanmıştır:


- [**En Yeni**] (#latest-channel) istikrarli, semver React sürümleri içindir. React'i npm'den yüklediğinizde elde edeceğiniz şey budur. Bugün kullandığınız kanal bu. **Bunu kullanıcılara yönelik tüm React uygulamaları için kullanın.**

- [**Sonraki**] (#next-channel), React kaynak kodu veri havuzunun ana dalını izler. Bunları bir sonraki küçük semver sürümü için aday olarak düşünün. React ve üçüncü taraf projeleri arasındaki entegrasyon testi için bunu kullanın.

- [**Deneysel**] (#eperimental-channel), kararlı sürümlerde bulunmayan deneysel API'leri ve özellikleri içerir. Bunlar ayrıca ana dalı izler, ancak ek özellik bayrakları açıktır. Gelecek özellikleri yayınlanmadan önce denemek için bunu kullanın.


Tüm sürümler npm'de yayınlanır, ancak yalnızca en yeni kullanımlar [anlamsal sürüm oluşturma] (/ docs / faq-versioning.html). Ön yayınlar (Sonraki ve Deneysel kanallarda bulunanlar), içeriklerinin bir karma değerinden oluşturulan sürümlere sahiptir, örneğin İleri için "0.0.0-1022ee0ec" ve Deney için "0.0.0-deneysel-1022ee0ec".


**Kullanıcıya yönelik uygulamalar için resmi olarak desteklenen tek yayın kanalı En Yeni**. Sonraki ve Deneysel sürümler yalnızca test amacıyla sağlanmıştır ve En Yeni sürümler için kullandığımız semver protokolünü takip etmediklerinden dolayı sürümler arasında davranışın değişmeyeceğine dair hiçbir garanti vermiyoruz. 

Ön sürümleri, istikrarlı sürümler için kullandığımız kayıt defterinde yayınlayarak, [unpkg] (https://unpkg.com) ve [CodeSandbox] (https://codesandbox.io) gibi npm iş akışını destekleyen birçok araçtan yararlanabiliyoruz. .

### En Yeni Kanalı {#latest-channel}
En Yeni, istikrarlı React sürümleri için kullanılan kanaldır. Npm'deki `latest` etiketine karşılık gelir. Gerçek kullanıcılara gönderilen tüm React uygulamaları için önerilen kanaldır.

**Hangi kanalı kullanmanız gerektiğinden emin değilseniz, kullanmanız gereken kanal En Yeni'dir.** Bir React yazılımcısıysanız, zaten kullandığınız budur.

Son güncellemelerinin son derece istikrarlı olmasını bekleyebilirsiniz. Sürümler semantik versiyonlama şemasını takip eder. [Sürüm oluşturma politikamız](/ docs / faq-versioning.html) sayfasından istikrarlılık ve aşamalı geçiş taahhüdümüz hakkında daha fazla bilgi edinin.

### Next Channel {#next-channel}

The Next channel is a prerelease channel that tracks the master branch of the React repository. We use prereleases in the Next channel as release candidates for the Latest channel. You can think of Next as a superset of Latest that is updated more frequently.

The degree of change between the most recent Next release and the most recent Latest release is approximately the same as you would find between two minor semver releases. However, **the Next channel does not conform to semantic versioning.** You should expect occasional breaking changes between successive releases in the Next channel.

**Do not use prereleases in user-facing applications.**

Releases in Next are published with the `next` tag on npm. Versions are generated from a hash of the build's contents, e.g. `0.0.0-1022ee0ec`.

#### Using the Next Channel for Integration Testing {#using-the-next-channel-for-integration-testing}

The Next channel is designed to support integration testing between React and other projects.

All changes to React go through extensive internal testing before they are released to the public. However, there are a myriad of environments and configurations used throughout the React ecosystem, and it's not possible for us to test against every single one.

If you're the author of a third party React framework, library, developer tool, or similar infrastructure-type project, you can help us keep React stable for your users and the entire React community by periodically running your test suite against the most recent changes. If you're interested, follow these steps:

- Set up a cron job using your preferred continuous integration platform. Cron jobs are supported by both [CircleCI](https://circleci.com/docs/2.0/triggers/#scheduled-builds) and [Travis CI](https://docs.travis-ci.com/user/cron-jobs/).
- In the cron job, update your React packages to the most recent React release in the Next channel, using `next` tag on npm. Using the npm cli:

  ```
  npm update react@next react-dom@next
  ```

  Or yarn:

  ```
  yarn upgrade react@next react-dom@next
  ```
- Run your test suite against the updated packages.
- If everything passes, great! You can expect that your project will work with the next minor React release.
- If something breaks unexpectedly, please let us know by [filing an issue](https://github.com/facebook/react/issues).

A project that uses this workflow is Next.js. (No pun intended! Seriously!) You can refer to their [CircleCI configuration](https://github.com/zeit/next.js/blob/c0a1c0f93966fe33edd93fb53e5fafb0dcd80a9e/.circleci/config.yml) as an example.

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
