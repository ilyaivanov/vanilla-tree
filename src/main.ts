import { viewTree } from "./app";
import { css, style } from "./browser/styles/style";
import { dom } from "./browser";
import { colors, fontSizes, spacings } from "./designSystem";

document.body.appendChild(
  dom.div({ className: "app" }, [
    dom.div({ className: "tree-container" }, [viewTree()]),
  ])
);

style.class("app", {
  height: "100vh",
  overflowY: "overlay",
});

style.class("tree-container", {
  maxWidth: spacings.maxWidth,
  marginLeft: "auto",
  marginRight: "auto",
  padding: css.padding(
    spacings.rootVerticalPadding,
    spacings.rootHorizontalPadding
  ),
});

style.tag("body", {
  fontFamily: `Roboto, Arial, sans-serif`,
  margin: 0,
  fontSize: fontSizes.regular,
  backgroundColor: colors.appBackground,
  color: colors.text,
});

css.createScrollStyles("app", {
  scrollbar: { width: spacings.scrollbar },
  thumb: { backgroundColor: colors.scrollbar },
});
