// Manual framer-motion declarations for when node_modules isn't available

declare module 'framer-motion' {
  export interface MotionProps {
    initial?: any;
    animate?: any;
    exit?: any;
    transition?: {
      duration?: number;
      ease?: string;
      delay?: number;
    };
    whileHover?: any;
    whileTap?: any;
    style?: React.CSSProperties;
    className?: string;
    children?: React.ReactNode;
  }

  export const motion: {
    div: React.FC<MotionProps & React.HTMLAttributes<HTMLDivElement>>;
    span: React.FC<MotionProps & React.HTMLAttributes<HTMLSpanElement>>;
    button: React.FC<MotionProps & React.HTMLAttributes<HTMLButtonElement>>;
    img: React.FC<MotionProps & React.HTMLAttributes<HTMLImageElement> & { src?: string; alt?: string; }>;
  };
}

