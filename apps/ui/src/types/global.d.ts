declare module '*.svg' {
  import * as React from 'react';
  
  const SVGComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  
  const content: string;
  export default content;
}

declare module '*.svg?react' {
  import * as React from 'react';
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export default ReactComponent;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module 'react-anchor-link-smooth-scroll' {
  import { ComponentPropsWithoutRef, FC } from 'react';
  
  interface AnchorLinkProps extends ComponentPropsWithoutRef<'a'> {
    href: string;
    offset?: string | number;
    css?: any;
  }
  
  const AnchorLink: FC<AnchorLinkProps>;
  export default AnchorLink;
}

declare module 'react-github-btn';

declare module 'react-rnd' {
  import { Component } from 'react';
  
  export interface RndResizeCallback {
    (
      e: MouseEvent | TouchEvent,
      dir: any,
      elementRef: HTMLElement,
      delta: { width: number; height: number },
      position: { x: number; y: number }
    ): void;
  }

  export interface RndDragCallback {
    (e: any, data: { x: number; y: number }): void;
  }

  export interface Props {
    default?: {
      x?: number;
      y?: number;
      width?: number | string;
      height?: number | string;
    };
    position?: { x: number; y: number };
    size?: { width: number | string; height: number | string };
    minWidth?: number | string;
    minHeight?: number | string;
    maxWidth?: number | string;
    maxHeight?: number | string;
    bounds?: string | HTMLElement;
    dragAxis?: 'x' | 'y' | 'both' | 'none';
    dragGrid?: [number, number];
    resizeGrid?: [number, number];
    lockAspectRatio?: boolean | number;
    lockAspectRatioExtraWidth?: number;
    lockAspectRatioExtraHeight?: number;
    dragHandleClassName?: string;
    enableResizing?: {
      bottom?: boolean;
      bottomLeft?: boolean;
      bottomRight?: boolean;
      left?: boolean;
      right?: boolean;
      top?: boolean;
      topLeft?: boolean;
      topRight?: boolean;
    };
    resizeHandleComponent?: {
      [key: string]: React.ReactElement<any>;
    };
    resizeHandleStyles?: {
      [key: string]: React.CSSProperties;
    };
    resizeHandleClasses?: {
      [key: string]: string;
    };
    resizeHandleWrapperClass?: string;
    resizeHandleWrapperStyle?: React.CSSProperties;
    enableUserSelectHack?: boolean;
    disableDragging?: boolean;
    onResizeStart?: RndResizeCallback;
    onResize?: RndResizeCallback;
    onResizeStop?: RndResizeCallback;
    onDragStart?: RndDragCallback;
    onDrag?: RndDragCallback;
    onDragStop?: RndDragCallback;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    scale?: number;
  }

  export class Rnd extends Component<Props> {}
}


