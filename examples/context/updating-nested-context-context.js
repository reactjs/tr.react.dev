// CreateContext öğesine iletilen varsayılan değerin şeklinin, 
// tüketicilerin beklediği şekle uygun olduğundan emin olun!
// highlight-range{2-3}
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
