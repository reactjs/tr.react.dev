---
title: Geçersiz ARIA Prop Uyarısı
layout: single
permalink: warnings/invalid-aria-prop.html
---

invalid-aria-prop uyarısı, Web Erişilebilirlik Girişimi (Web Accessibility Initiative - WAI) Erişilebilir Zengin İnternet Uygulaması (Accessible Rich Internet Application - ARIA) [belirtiminde](https://www.w3.org/TR/wai-aria-1.1/#states_and_properties) bulunmayan bir aria-* prop'u ile bir DOM elemanını render etmeye çalışırsanız tetiklenir.

1. Geçerli bir prop kullandığınızı düşünüyorsanız, imlayı dikkatlice kontrol edin. `aria-labelledby` ve `aria-activedescendant` genellikle yanlış yazılır.

2. If you wrote `aria-role`, you may have meant `role`.

3. Otherwise, if you're on the latest version of React DOM and verified that you're using a valid property name listed in the ARIA specification, please [report a bug](https://github.com/facebook/react/issues/new/choose).
