import Messenger from './Messenger';

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
      const typefaces = [];
      textNodes.forEach((textNode: TextNode) => {
        console.log(textNode)
        typefaces.push(textNode.fontName);
      });

      return typefaces
    };

    const loadTypefaces = (typefaces: Array<{family: string, style: string}>) => {
      typefaces.forEach(typeface => figma.loadFontAsync(typeface));
    }

    const replaceText = () => {
      textNodes.forEach((textNode) => {
        let buffer: number = 24;
        if ((textNode.height / 2) < buffer) {
          buffer = (textNode.height / 2);
        }
        const newTextNode: TextNode = textNode.clone();
        newTextNode.x = textNode.x + buffer;
        newTextNode.y = textNode.y + buffer;
        textNode.parent.appendChild(newTextNode)
      })
    }

    const sendMessages = async () => {
      const typefaces = readTypefaces();

      messenger.log('Do a thing.');
      messenger.toast('A thing, it has been done.');

      await console.log(typefaces);
      await loadTypefaces(typefaces);
      replaceText()
      console.log('inner')
      console.log('inner inner')
    };
    sendMessages();

    console.log('inner outer')


    if (this.shouldTerminate) {
      this.closeGUI();
    }
    return null;
  }
}
