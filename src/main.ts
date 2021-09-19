import { viewTree } from "./tree";
import { createItem, createRoot, randomItems } from "./itemsTree";
import { css, style } from "./infra/styles/style";
import { dom } from "./infra";
import { colors, fontSizes, spacings } from "./designSystem";

const root: Item = createRoot("Home", [
  createItem("Music", randomItems(10)),
  createItem("Software Development", [
    createItem("Front-End", randomItems(3)),
    createItem("Back-End", randomItems(2)),
    createItem("Tumpa Mandal", randomItems(2)),
  ]),
  createItem("People", randomItems(12)),
  createItem("Channels", randomItems(5)),
]);

document.body.appendChild(
  dom.div({ className: "app" }, [
    dom.div({ className: "tree-container" }, [viewTree(root)]),
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
  backgroundColor: `#1e1e1e`,
  color: `white`,
});

css.createScrollStyles("app", {
  scrollbar: { width: spacings.scrollbar },
  thumb: { backgroundColor: colors.scrollbar },
});
