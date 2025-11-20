/// <reference types="vite/client" />

declare module '*.jpg' {
    const src: string;
    export default src;
}

/// <reference types="vite/client" />

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    import * as React from 'react';
    export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
    const src: string;
    export default src;
}

declare module '*.txt' {
    const content: string;
    export default content;
}

declare module '*.txt?raw' {
    const content: string;
    export default content;
}
