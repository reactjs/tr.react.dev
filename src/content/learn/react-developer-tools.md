---
title: React Developer Tools
---

<Intro>

React [bileşenlerini](/learn/your-first-component) incelemek, [prop'ları](/learn/passing-props-to-a-component) ve [state](/learn/state-a-components-memory) özelliklerini düzenlemek, performans sorunlarını belirlemek için React Developer Tools'u kullanın.

</Intro>

<YouWillLearn>

* React Developer Tools nasıl kurulur?

</YouWillLearn>

## Tarayıcı eklentisi {/*browser-extension*/}

React ile oluşturulmuş web sitelerinin hata ayıklaması için en kolay yol, React Developer Tools tarayıcı uzantısını yüklemektir. Uzantının kullanılabilir olduğu popüler tarayıcılar:

* [**Chrome** için yükle](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [**Firefox** için yükle](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [**Edge** için yükle](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Artık **React ile oluşturulmuş** bir web sitesini ziyaret ettiğinizde, _Components_ ve _Profiler_ panellerini göreceksiniz.

![React Developer Tools eklentisi](/images/docs/react-devtools-extension.png)

### Safari ve diğer tarayıcılar {/*safari-and-other-browsers*/}
Diğer tarayıcılar için (örneğin Safari için), [`react-devtools`](https://www.npmjs.com/package/react-devtools) paketini yükleyin:

```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Daha sonra, terminalden React Developer Tools'u açın:
```bash
react-devtools
```

Daha sonra, `<script>` etiketini web sitenizin `<head>` etiketinin başlangıcına etkleyerek bağlanın :
```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```
Web sitenizi geliştirici araçlarında görüntülemek sayfayı yenileyin.

![Tek başına React Developer Tools](/images/docs/react-devtools-standalone.png)

## Mobil (React Native) {/*mobile-react-native*/}
React Developer Tools, [React Native](https://reactnative.dev/) ile oluşturulan uygulamaları incelemek için de kullanılabilir.

<<<<<<< HEAD
React Developer Tools'u kullanmanın en kolay yolu, onu global olarak yüklemektir:
```bash
# Yarn
yarn global add react-devtools
=======
## Mobile (React Native) {/*mobile-react-native*/}

To inspect apps built with [React Native](https://reactnative.dev/), you can use [React Native DevTools](https://reactnative.dev/docs/debugging/react-native-devtools), the built-in debugger that deeply integrates React Developer Tools. All features work identically to the browser extension, including native element highlighting and selection.
>>>>>>> 3b02f828ff2a4f9d2846f077e442b8a405e2eb04

[Learn more about debugging in React Native.](https://reactnative.dev/docs/debugging)

<<<<<<< HEAD
Daha sonra, terminalden React Developer Tools'u açın.
```bash
react-devtools
```

Yerelde çalışan herhangi bir React Native uygulamasına bağlanmalıdır.

> Birkaç saniye sonra React Developer Tools bağlanmazsa, uygulamayı yeniden yüklemeyi deneyin.

[React Native'de hata ayıklama hakkında daha fazla bilgi edinmek için.](https://reactnative.dev/docs/debugging)
=======
> For versions of React Native earlier than 0.76, please use the standalone build of React DevTools by following the [Safari and other browsers](#safari-and-other-browsers) guide above.
>>>>>>> 3b02f828ff2a4f9d2846f077e442b8a405e2eb04
