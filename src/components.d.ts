/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
export namespace Components {
    interface AreanetCookiebanner {
        "cookies": string;
        "gaeProperty": number;
        "imprintUrl": string;
        "privacyUrl": string;
        "thirdparty": string;
    }
}
declare global {
    interface HTMLAreanetCookiebannerElement extends Components.AreanetCookiebanner, HTMLStencilElement {
    }
    var HTMLAreanetCookiebannerElement: {
        prototype: HTMLAreanetCookiebannerElement;
        new (): HTMLAreanetCookiebannerElement;
    };
    interface HTMLElementTagNameMap {
        "areanet-cookiebanner": HTMLAreanetCookiebannerElement;
    }
}
declare namespace LocalJSX {
    interface AreanetCookiebanner {
        "cookies"?: string;
        "gaeProperty"?: number;
        "imprintUrl"?: string;
        "privacyUrl"?: string;
        "thirdparty"?: string;
    }
    interface IntrinsicElements {
        "areanet-cookiebanner": AreanetCookiebanner;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "areanet-cookiebanner": LocalJSX.AreanetCookiebanner & JSXBase.HTMLAttributes<HTMLAreanetCookiebannerElement>;
        }
    }
}
