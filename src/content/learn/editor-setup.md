---
title: Editör Kurulumu
---

<Intro>

Doğru şekilde yapılandırılmış bir editör, kodun daha kolay okunmasını ve daha hızlı yazılmasını sağlayabilir. Hatta yazarken hataları tespit etmenize bile yardımcı olabilir! İlk kez bir editör kuruyorsanız veya mevcut editörünüzü iyileştirmek istiyorsanız, birkaç önerimiz var.

</Intro>

<YouWillLearn>

* En popüler editörler hangileri
* Kodunuzu otomatik olarak nasıl biçimlendirirsiniz

</YouWillLearn>

## Editörünüz {/*your-editor*/}

Günümüzün en popüler editörlerinden biri olan [VS Code](https://code.visualstudio.com/), geniş bir eklenti pazarına sahip olmasının yanı sıra GitHub gibi popüler servislerle iyi bir entegrasyona sahiptir. Aşağıda listelenen özellikler VS Code'a eklenti olarak yüklenebilir ve bu VS Code'u daha fazla yapılandırılabilir hale getirir!

React topluluğunun kullandığı diğer popüler editörler:

* [WebStorm](https://www.jetbrains.com/webstorm/), Javascript için özel olarak tasarlanmış entegre bir geliştirme ortamıdır.
* [Sublime Text](https://www.sublimetext.com/), Halihazırda JSX ve TypeScript desteği ile birlikte [sözdizimi vurgusu](https://stackoverflow.com/a/70960574/458193) ve otomatik tamamlama özelliğine sahiptir.
* [Vim](https://www.vim.org/), her türlü metni oluşturmayı ve değiştirmeyi daha verimli hale getirmek için oluşturulmuş, son derece yapılandırılabilir bir metin düzenleyicisidir. Çoğu UNIX sisteminde ve Apple OS X'te "vi" olarak bulunur.

## Önerilen editör özellikleri {/*recommended-text-editor-features*/}

Bazı düzenleyiciler bu özelliklerle birlikte gelir, ancak diğerleri bir eklenti kurmanızı gerektirebilir. Emin olmak için seçtiğiniz editörünüzün hangi desteği sağladığını kontrol edin!

### Linting {/*linting*/}

Kod linter araçları kodunuzu yazarken problemleri bulmanızı ve düzeltmenizi sağlar. [ESLint](https://eslint.org/) popüler bir açık kaynak JavaScript linter aracıdır.

* [React için önerilen ESLint ayarlarını kurmak](https://www.npmjs.com/package/eslint-config-react-app) ([Node'un yüklü](https://nodejs.org/en/download/current/)olduğundan emin olun!) 
* [ESLint'i, VSCode'a resmi eklenti ile entegre edin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

** [`eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) kurallarını projeniz için etkinleştirdiğinizden emin olun.
** Bu özellikler önemlidir ve en ciddi hataları erken aşamada yakalarlar. Önerilen [`eslint-config-react-app`](https://www.npmjs.com/package/eslint-config-react-app) ön ayar bunları içeriyor.

### Biçimlendirme {/*formatting*/}

<<<<<<< HEAD
Kodunuza katkıda bulunan başka bir kişiyle yapmak isteyeceğiniz son şey [tab ve boşluklar](https://www.google.com/search?q=tabs+vs+spaces) hakkında bir tartışmaya girmektir! Neyse ki, [Prettier](https://prettier.io/) kodunuzu önceden ayarladığınız kurallara uyacak şekilde biçimlendirerek düzenler ve temizler. Prettier'ı çalıştırın ve tüm tab'lar boşluklara dönüştürülecek ve girintileriniz, alıntılarınız vb. de yapılandırmaya uyacak şekilde değiştirilecektir. İdeal kurulumda Prettier, dosyanızı kaydettiğinizde çalışacak ve bu düzenlemeleri sizin için hızlıca yapacaktır.
=======
The last thing you want to do when sharing your code with another contributor is get into a discussion about [tabs vs spaces](https://www.google.com/search?q=tabs+vs+spaces)! Fortunately, [Prettier](https://prettier.io/) will clean up your code by reformatting it to conform to preset, configurable rules. Run Prettier, and all your tabs will be converted to spaces—and your indentation, quotes, etc will also all be changed to conform to the configuration. In the ideal setup, Prettier will run when you save your file, quickly making these edits for you.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

[Prettier VSCode eklentisini](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) aşağıdaki adımları takip ederek yükleyebilirsiniz:

1. VS Code'u açın
2. Hızlı Aç'ı kullanın (Ctrl/Cmd+P'ye basın)
3. Yapıştırın `ext install esbenp.prettier-vscode`
4. Enter'a basın

#### Kayıt sırasında biçimlendirme {/*formatting-on-save*/}

İdeal olarak, kodunuzu her kaydetme işleminde biçimlendirmelisiniz. VS Code bunu sizin için yapacak ayarlara sahiptir!

1. VS Code'da `CTRL/CMD + SHIFT + P` 'ye basın.
2. "settings" yazın
3. Enter'a basın
4. Arama çubuğunda, "format on save" yazın
5. "format on save" kutucuğunun seçili olduğundan emin olun!

> ESLint ön ayarınızın biçimlendirme kuralları varsa bunlar Prettier ile çakışabilir. ESLint'in *yalnızca* mantıksal hataları yakalamak için kullanılabilmesi için [`eslint-config-prettier`](https://github.com/prettier/eslint-config-prettier) kullanarak ESLint ön ayarınızdaki tüm biçimlendirme kurallarını devre dışı bırakmanızı öneririz. Bir çekme isteği (pull request) birleştirilmeden önce dosyaların biçimlendirilmesini zorunlu kılmak istiyorsanız, sürekli entegrasyonunuz için  [`prettier --check`](https://prettier.io/docs/en/cli.html#--check) kullanın.
