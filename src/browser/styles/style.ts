import { cssRuleToString } from "./convertion";

const existingStyles = document.getElementById("app-styles");
if (existingStyles) existingStyles.remove();

const styleElement = document.createElement("style");

styleElement.id = "app-styles";
document.head.appendChild(styleElement);

const writeToStyles = (selector: string, styles: Styles) => {
  styleElement.innerHTML += cssRuleToString(selector, styles);
};

export const style = {
  class: (className: string, styles: Styles) =>
    writeToStyles(`.${className}`, styles),
  tag: (tag: keyof HTMLElementTagNameMap, styles: Styles) =>
    writeToStyles(`${tag}`, styles),
};

export const css = {
  createScrollStyles: (
    className: string,
    props: {
      scrollbar: Styles;
      thumb: Styles;
    }
  ) => {
    writeToStyles(`.${className}::-webkit-scrollbar`, props.scrollbar);
    writeToStyles(`.${className}::-webkit-scrollbar-thumb`, props.thumb);
  },

  padding: padding,
};

function padding(all: number): string;
function padding(vertical: number, horizontal: number): string;
function padding(vertical: number, horizontal?: number): string {
  return horizontal ? `${vertical}px ${horizontal}px` : `${vertical}px`;
}
