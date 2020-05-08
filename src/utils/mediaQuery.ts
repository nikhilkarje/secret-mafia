import { css } from "styled-components";

export const BreakPoints: any = {
  xs: 320,
  xsm: 375,
  xmd: 480,
  sm: 768,
  md: 1024,
  mlg: 1080,
  lg: 1280,
  hd: 1440,
  xhd: 1920,
};

export const media: any = Object.keys(BreakPoints).reduce(
  (accumulator: any, label) => {
    const pxSize = BreakPoints[label];
    accumulator[label] = (
      arg: TemplateStringsArray,
      ...args: TemplateStringsArray[]
    ) => css`
      @media (min-width: ${pxSize}px) {
        ${css(arg, ...args)};
      }
    `;
    return accumulator;
  },
  {}
);
