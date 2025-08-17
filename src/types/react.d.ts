// Manual React type declarations for when node_modules isn't available

declare module 'react' {
  export interface HTMLAttributes<T> {
    className?: string;
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent<T>) => void;
    onLoad?: (event: React.SyntheticEvent<T>) => void;
    onError?: (event: React.SyntheticEvent<T>) => void;
  }

  export interface CSSProperties {
    [key: string]: string | number | undefined;
    background?: string;
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    width?: string | number;
    height?: string | number;
    borderRadius?: string;
    border?: string;
    padding?: string;
    margin?: string;
    display?: string;
    justifyContent?: string;
    alignItems?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: string;
    cursor?: string;
    position?: string;
    top?: string | number;
    left?: string | number;
    right?: string | number;
    bottom?: string | number;
    zIndex?: number;
    overflow?: string;
    boxShadow?: string;
    transform?: string;
    transition?: string;
    opacity?: number;
  }

  export interface ReactElement {
    type: any;
    props: any;
    key: string | number | null;
  }

  export interface ReactNode extends ReactElement {}

  export interface FC<P = {}> {
    (props: P & { key?: string | number }): ReactElement | null;
  }

  export interface MouseEvent<T> {
    currentTarget: T;
    target: EventTarget;
    preventDefault(): void;
    stopPropagation(): void;
  }

  export interface SyntheticEvent<T> {
    currentTarget: T;
    target: EventTarget;
  }

  export const React: {
    createElement(type: any, props?: any, ...children: any[]): ReactElement;
  };

  export function createElement(type: any, props?: any, ...children: any[]): ReactElement;
}

declare module 'react/jsx-runtime' {
  export const jsx: (type: any, props: any) => any;
  export const jsxs: (type: any, props: any) => any;
}

declare namespace JSX {
  interface IntrinsicElements {
    div: React.HTMLAttributes<HTMLDivElement>;
    img: React.HTMLAttributes<HTMLImageElement> & { src?: string; alt?: string; };
    h1: React.HTMLAttributes<HTMLHeadingElement>;
    h2: React.HTMLAttributes<HTMLHeadingElement>;
    h3: React.HTMLAttributes<HTMLHeadingElement>;
    p: React.HTMLAttributes<HTMLParagraphElement>;
    span: React.HTMLAttributes<HTMLSpanElement>;
    button: React.HTMLAttributes<HTMLButtonElement>;
  }
}
