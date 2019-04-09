// CreateContext öğesine iletilen varsayılan değerin formunun,
// tüketicilerin beklediği formla eşleştiğinden emin olun!
// highlight-range{2-3}
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
