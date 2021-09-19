import { viewTree } from "./tree";
import { createItem, randomItems } from "./domain/create";
import { css, style } from "./browser/styles/style";
import { dom } from "./browser";
import { colors, fontSizes, spacings } from "./designSystem";
import { Store } from "./domain/Store";

const root: Item = createItem("Home", [
  createItem("Music"),
  createItem("Software Development"),
  createItem("People", randomItems(12)),
  createItem("Channels", [
    createItem(
      `Если вы спросите программиста, повара или фитнес тренера о чем-то довольно сложном, то ответ его будет довольно обтекаемым, либо же он задаст несколько наводящих вопросов, чтобы узнать контекст получше.`
    ),
    createItem(
      `Нужно ли писать тесты? Важно ли качество кода? Какая лучшая степень прожарки мяса? С чем лучше всего сочетается белое вино? Нужно ли делать жим лежа со становой или турника будет достаточно?`
    ),
    createItem(
      `Когда я рассматриваю источники информации по некоторой теме я ищу в авторе глубину и осторожность. Желание дать фундаментальные принципы, а не конкретные ответы на сложные вопросы. В этом плане старина Боб Мартин меня давно разочаровал. Когда-то он для меня был автором лучших книг и статей, но его категоричность, негибкость в суждениях и неумение смотреть на проблемы шире перевели его в категорию "анти"-авторов. В категорию людей, чье мнение скорее опасно для индустрии, чем полезно.`
    ),
    createItem(
      `Моя нелюбовь к старине Бобу началась с его книги "Принципы, паттерны и методики гибкой разработки на языке C#" (вот большая критическая статья на эту тему), но дядюшка Боб периодически выдает и вот, после очередного его высказывания, мне захотелось подумать над поднятой им темой более подробно.`
    ),
  ]),
]);

const store = new Store(root);

document.body.appendChild(
  dom.div({ className: "app" }, [
    dom.div({ className: "tree-container" }, [viewTree(store)]),
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
