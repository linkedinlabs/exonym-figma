import Messenger from './Messenger';
import Painter from './Painter';
import { loadTypefaces, readLanguageTypeface } from './Tools';
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
      page,
      selection,
    } = assemble(figma);
    const ignoreLocked = true;
    // const ignoreLocked = false;

    let textNodes: Array<TextNode> = selection.filter((node: SceneNode) => node.type === 'TEXT');
    if (ignoreLocked) {
      textNodes = textNodes.filter((node: SceneNode) => !node.locked);
    }

    const readTypefaces = () => {
      const uniqueTypefaces: Array<FontName> = [];

      textNodes.forEach((textNode: TextNode) => {
        if (!textNode.hasMissingFont) {
          const typefaceOrSymbol: any = textNode.fontName;
          const typeface: FontName = typefaceOrSymbol;

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

    const duplicateOrReplaceText = (
      languageTypeface?: FontName | null,
      action: 'duplicate' | 'replace' = 'duplicate',
    ) => {
      messenger.log('begin manipulating text');
      const isDuplicate = action === 'duplicate';
      textNodes.forEach((textNode: TextNode) => {
        // set up Painter instance for the layer
        const painter = new Painter({ for: textNode, in: page });

        if (isDuplicate) {
          painter.duplicateText(languageTypeface);
        } else {
          painter.replaceText(languageTypeface);
        }
      });
      messenger.log('end manipulating text');
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

      await loadTypefaces(typefaces, messenger);
      // duplicateOrReplaceText(languageTypeface, 'duplicate');
      duplicateOrReplaceText(null, 'duplicate');
      // duplicateOrReplaceText(languageTypeface, 'replace');
      // duplicateOrReplaceText(null, 'replace');
      messenger.log('Do a thing.');
      messenger.toast('A thing, it has been done.');
      console.log(LANGUAGES); // eslint-disable-line no-console
      close();
    };

    return doTheThing();
  }
}
