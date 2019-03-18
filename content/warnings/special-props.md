---
title: Özel Prop'lar Uyarısı
layout: single
permalink: warnings/special-props.html
---

Bir JSX elemanındaki çoğu prop bileşene iletilir, ancak React tarafından kullanılan ve bu nedenle bileşene iletilmeyen iki özel prop (`ref` ve `key`) vardır.

Örneğin, bir bileşenden (diğer bir deyişle bir render etme fonksiyonu veya [propTypes](/docs/typechecking-with-proptypes.html#proptypes)) `this.props.key`e erişmeye çalışmak tanımlı değildir. Alt bileşende aynı değere erişmeniz gerekiyorsa, bunu farklı bir prop (örnek: `<ListItemWrapper key={result.id} id={result.id} />`) olarak iletmelisiniz. Bu gereksiz görünse de, uygulama mantığını uzlaşma ipuçlarından ayırmak önemlidir.
