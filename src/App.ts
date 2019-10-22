import Messenger from './Messenger';
import { asyncForEach } from './Tools';
import { LANGUAGES } from './constants';

/**
 * @description A shared helper function to set up in-UI messages and the logger.
 *
 * @kind function
 * @name assemble
 * @param {Object} context The current context (event) received from Figma.
 * @returns {Object} Contains an object with the current page as a javascript object,
 * a messenger instance, and a selection array (if applicable).
 */
const assemble = (context: any = null) => {
  const page = context.currentPage;
  const { selection } = context.currentPage;
  const messenger = new Messenger({ for: context, in: page });

  return {
    messenger,
    page,
    selection,
  };
};

/**
 * @description A class to handle core app logic and dispatch work to other classes.
 *
 * @class
 * @name App
 *
 * @constructor
 *
 * @property closeGUI A convenience function for closing the GUI and shutting down the plugin.
 * @property showGUI A convenience function for showing the GUI.
 * @property dispatcher The function from `main.ts` that determines where to route GUI clicks.
 * @property shouldTerminate A boolean that tells us whether or not the GUI should remain open
 * at the end of the plugin’s current task.
 */
export default class App {
  closeGUI: Function;
  dispatcher: Function;
  shouldTerminate: boolean;
  showGUI: Function;

  constructor({
    closeGUI,
    dispatcher,
    shouldTerminate,
    showGUI,
  }) {
    this.closeGUI = closeGUI;
    this.dispatcher = dispatcher;
    this.shouldTerminate = shouldTerminate;
    this.showGUI = showGUI;
  }

  /**
   * @description Does a thing.
   *
   * @kind function
   * @name doAThing
   *
   * @returns {null} Shows a Toast in the UI if nothing is selected.
   */
  doAThing() {
    const {
      messenger,
      // page,
      selection,
    } = assemble(figma);

    const textNodes: Array<TextNode> = selection.filter((node: SceneNode) => node.type === 'TEXT');

    const readTypefaces = () => {
      const uniqueTypefaces: Array<FontName> = [];

      textNodes.forEach((textNode: TextNode) => {
        if (!textNode.hasMissingFont) {
          const typeface: FontName = textNode.fontName;

          const itemIndex: number = uniqueTypefaces.findIndex(
            (foundItem: FontName) => (
              (foundItem.family === typeface.family)
              && foundItem.style === typeface.style),
          );

          if (itemIndex < 0) {
            uniqueTypefaces.push(typeface);
          }
        }
      });

      return uniqueTypefaces;
    };

    const readLanguageTypeface = (languageId: string) => {
      const languageIndex = LANGUAGES.findIndex(lang => lang.id === languageId);
      const language = LANGUAGES[languageIndex];
      if (language && language.font) {
        return language.font;
      }
      return null;
    };

    const loadTypefaces = async (typefaces: Array<FontName>) => {
      messenger.log('begin loading typefaces');
      await asyncForEach(typefaces, async (typeface: FontName) => {
        await figma.loadFontAsync(typeface);
        messenger.log(`loading ${typeface.family} ${typeface.style} typeface`);
      });

      messenger.log('done loading typefaces');
    };

    const replaceText = (languageTypeface: FontName) => {
      messenger.log('begin manipulating text');
      textNodes.forEach((textNode: TextNode) => {
        let spacingBuffer: number = 24;
        if ((textNode.height / 2) < spacingBuffer) {
          spacingBuffer = (textNode.height / 2);
        }
        const updatedCharacters: string = `${textNode.characters}… and some more!`;

        // create text node + update characters
        const newTextNode: TextNode = textNode.clone();
        newTextNode.fontName = languageTypeface;
        newTextNode.characters = updatedCharacters;

        // placement
        newTextNode.x = textNode.x + spacingBuffer;
        newTextNode.y = textNode.y + spacingBuffer;
        textNode.parent.appendChild(newTextNode);
      });
    };

    const close = () => {
      if (this.shouldTerminate) {
        this.closeGUI();
      }
    };

    const doTheThing = async () => {
      const typefaces: Array<FontName> = readTypefaces();
      const languageTypeface = readLanguageTypeface('thai');

      if (languageTypeface) {
        typefaces.push(languageTypeface);
      }

      await loadTypefaces(typefaces);
      replaceText(languageTypeface);
      messenger.log('Do a thing.');
      messenger.toast('A thing, it has been done.');
      console.log(LANGUAGES); // eslint-disable-line no-console
      close();
    };

    return doTheThing();
  }
}
