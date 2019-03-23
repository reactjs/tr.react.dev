// highlight-range{1-2}
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// Şimdi DOM üzerinde bulunacak butona doğrudan bir ref alabilirsiniz:
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
