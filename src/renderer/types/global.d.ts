declare namespace JSX {
  interface IntrinsicElements {
    webview: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      nodeintegration?: boolean;
      webpreferences?: string;
      allowpopups?: boolean;
    };
  }
}
