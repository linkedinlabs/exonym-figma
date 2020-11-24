import Crawler from './Crawler';
import Messenger from './Messenger';
import Painter from './Painter';
import Translator from './Translator';
import {
  awaitUIReadiness,
  findTopComponent,
  findTopInstance,
  loadTypefaces,
  readLanguageTypefaces,
  resizeGUI,
} from './Tools';
import { DATA_KEYS } from './constants';

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
 * @description Retrieves all of the typefaces (`FontName`) from a selection of text nodes
 * and returns them as a unique array (without repeats).
 *
 * @kind function
 * @name readTypefaces
 *
 * @param {Array} textNodes Array of the text next (`TextNode`) to retrieve typefaces from.
 *
 * @returns {Array} Returns an array of unique `FontName` entries (no repeats).
 */
const readTypefaces = (textNodes: Array<TextNode>) => {
  const uniqueTypefaces: Array<FontName> = [];

  // take the typeface and, if new/unique, add it to the `uniqueTypefaces` array
  const setTypeFace = (typeface: FontName) => {
    const itemIndex: number = uniqueTypefaces.findIndex(
      (foundItem: FontName) => (
        (foundItem.family === typeface.family)
        && foundItem.style === typeface.style),
    );

    // typeface is not present; add it to the array
    if (itemIndex < 0) {
      uniqueTypefaces.push(typeface);
    }
  };

  // iterate through each text node
  textNodes.forEach((textNode: TextNode) => {
    if (!textNode.hasMissingFont) {
      // some text nodes have multiple typefaces and the API returns a `figma.mixed` Symbol
      if (typeof textNode.fontName !== 'symbol') {
        // if a node does not return `fontName` as a Symbol, we can use the result directly
        const typeface: any = textNode.fontName;
        setTypeFace(typeface);
      } else {
        // use `getRangeFontName` to check each character (based on index) for its typeface
        const { characters } = textNode;
        const length: number = characters.length; // eslint-disable-line prefer-destructuring
        for (let i = 0; i < length; i += 1) {
          const typeface: any = textNode.getRangeFontName(i, i + 1);
          setTypeFace(typeface);
        }
      }
    }
  });

  return uniqueTypefaces;
};

/**
 * @description Invokes Figma’s `setRelaunchData` on the passed node and (if applicable),
 * the container component node.
 *
 * @kind function
 * @name setRelaunchCommands
 *
 * @param {Object} node The node (`SceneNode`) to use with `setRelaunchData`.
 *
 * @returns {null}
 */
const setRelaunchCommands = (node: SceneNode): void => {
  // currently cannot apply `setRelaunchData` to a node inside of an `InstanceNode`
  node.setRelaunchData({
    tools: '',
  });

  // apply to top-level component
  const componentNode: ComponentNode = findTopComponent(node);
  if (componentNode && !componentNode.remote) {
    componentNode.setRelaunchData({
      tools: '',
    });
  }

  // apply to the instance node
  const topInstanceNode: InstanceNode = findTopInstance(node);
  if (topInstanceNode) {
    node.setRelaunchData({
      tools: '',
    });

    if (topInstanceNode.masterComponent && !topInstanceNode.masterComponent.remote) {
      topInstanceNode.masterComponent.setRelaunchData({
        tools: '',
      });
    }
  }

  // add “Open Realish” to page
  figma.currentPage.setRelaunchData({
    tools: '',
  });

  return null;
};

/**
 * @description A class to handle core app logic and dispatch work to other classes.
 *
 * @class
 * @name App
 *
 * @constructor
 *
 * @property shouldTerminate A boolean that tells us whether or not the GUI should remain open
 * at the end of the plugin’s current task.
 * @property terminatePlugin A convenience function for properly shutting down the plugin.
 */
export default class App {
  shouldTerminate: boolean;
  terminatePlugin: Function;

  constructor({
    shouldTerminate,
    terminatePlugin,
  }) {
    this.shouldTerminate = shouldTerminate;
    this.terminatePlugin = terminatePlugin;
  }

  /**
   * @description Displays the plugin GUI within Figma. Before showing the UI, it
   * reads saved options from `clientStorage` and passes them along to the UI thread.
   *
   * @kind function
   * @name showGUI
   *
   * @param {Object} options Should include `size`, calling one of the UI sizes defined
   * in GUI_SETTINGS, and an optional initialized instance of the Messenger class for
   * logging (`messenger`).
   *
   * @returns {null}
   */
  static async showGUI(options: {
    size: 'default' | 'info',
    messenger?: { log: Function },
  }) {
    const { size, messenger } = options;

    if (messenger) {
      messenger.log(`Display GUI at size: ${size}`);
    }

    if (size === 'default') {
      // retrieve existing options
      const lastUsedOptions: {
        action: 'duplicate' | 'replace' | 'new-page',
        translateLocked: boolean,
        languages: Array<string>,
      } = await figma.clientStorage.getAsync(DATA_KEYS.options);

      // update the UI with the existing options
      if (lastUsedOptions
        && lastUsedOptions.action !== undefined
        && lastUsedOptions.translateLocked !== undefined
        && lastUsedOptions.languages !== undefined
      ) {
        // set the options in the UI
        figma.ui.postMessage({
          action: 'setOptions',
          payload: lastUsedOptions,
        });

        // wait for the UI to tell us it is done setting options
        // this prevents showing the UI while changes are being drawn
        await awaitUIReadiness(messenger);
      }
    }

    // set UI panel size
    resizeGUI(size, figma.ui);

    // show UI
    figma.ui.show();

    return null;
  }

  /**
   * @description Triggers a UI refresh and then displays the plugin UI.
   *
   * @kind function
   * @name showToolbar
   */
  static showToolbar() {
    const { messenger } = assemble(figma);

    App.showGUI({ size: 'default', messenger });
  }

  /**
   * @description The main action for translating text.
   *
   * @kind function
   * @name runTranslate
   *
   * @param {Object} options Should include the `languages` array of IDs that correspond with
   * the `LANGUAGES` constant, an `action` (`duplicate`, `replace`, or `new-page`), and a
   * boolean determining whether or not to ignore locked nodes (`translateLocked`).
   * @param {boolean} savePrefs Determines if the current options should be saved
   * for future reference.
   *
   * @returns {Function} Calls `closeOrReset` to either terminate the plugin, or reset
   * the state of the UI.
   */
  async runTranslate(
    options: {
      languages: Array<string>,
      action: 'duplicate' | 'replace' | 'new-page',
      translateLocked: boolean,
    },
    savePrefs: boolean,
  ) {
    const {
      messenger,
      page,
      selection,
    } = assemble(figma);
    const {
      action,
      languages,
      translateLocked,
    } = options;
    let consolidatedSelection: Array<SceneNode | PageNode> = selection;

    // retrieve selection of text nodes and filter for locked/unlocked based on options
    let textNodes = new Crawler({ for: consolidatedSelection }).text(translateLocked);

    /**
     * @description Iterates through an array of text nodes (`TextNode`), applying
     * Painter’s `replaceText` to each and updating the text.
     *
     * @kind function
     * @name manipulateText
     *
     * @param {Array} textNodesToPaint An array of text nodes (`TextNode`).
     *
     * @returns {null}
     */
    const manipulateText = (textNodesToPaint): void => {
      messenger.log('Begin manipulating text');
      textNodesToPaint.forEach((textNode: SceneNode) => {
        // set up Painter instance for the layer
        const painter = new Painter({ for: textNode, in: page });

        // replace the existing text with the translation
        // TKTK handle error result
        painter.replaceText();

        // set the re-launch commands
        setRelaunchCommands(textNode);
      });
      messenger.log('End manipulating text');

      return null;
    };

    /**
     * @description Resets the plugin GUI back to the original state or closes it entirely,
     * terminating the plugin.
     *
     * @kind function
     * @name closeOrReset
     *
     * @returns {null}
     */
    const closeOrReset = () => {
      if (this.shouldTerminate) {
        return this.terminatePlugin();
      }

      // reset the working state
      const message: {
        action: string,
      } = {
        action: 'resetState',
      };
      figma.ui.postMessage(message);

      return null;
    };

    // begin main thread of action ------------------------------------------------------

    // save current options
    if (savePrefs) {
      figma.clientStorage.setAsync(DATA_KEYS.options, options);
    }

    // if action is `new-page`, need to create a new page first
    let newPage = null;
    if (textNodes.length > 0 && action === 'new-page') {
      newPage = figma.createPage();
    }

    // if action is `duplicate`, need to duplicate the layers first
    if (
      textNodes.length > 0
      && (action === 'duplicate' || action === 'new-page')
    ) {
      consolidatedSelection = [];

      selection.forEach((node) => {
        // set up Painter instance for the layer
        const painter = new Painter({ for: node, in: page });

        // duplicate the layer
        const newNodeResult = painter.duplicate(newPage);
        if (newNodeResult.status === 'success') {
          const newNode = newNodeResult.node;
          consolidatedSelection.push(newNode);
        }
      });

      if (newPage && action === 'new-page') {
        figma.currentPage = newPage;
        figma.currentPage.selection = newPage.children;
      }

      // reset and retrieve selection of text nodes
      textNodes = new Crawler({ for: consolidatedSelection }).text(translateLocked);
    }

    // translate if text nodes are available and fonts are not missing
    const missingTypefaces: Array<TextNode> = textNodes.filter(
      (node: TextNode) => node.hasMissingFont,
    );
    if ((textNodes.length > 0) && (missingTypefaces.length < 1)) {
      // run the main thread this sets everything else in motion
      const typefaces: Array<FontName> = readTypefaces(textNodes);
      const languageTypefaces: Array<FontName> = readLanguageTypefaces(languages);

      // load typefaces
      if (languageTypefaces) {
        languageTypefaces.forEach(languageTypeface => typefaces.push(languageTypeface));
      }
      await loadTypefaces(typefaces, messenger);

      // do the text translations
      const translator = new Translator({ for: textNodes, messenger });
      const translationResult = await translator.translate(languages);
      messenger.handleResult(translationResult);

      if (translationResult.status === 'success') {
        // replace the text in the document
        manipulateText(textNodes);
      }

      return closeOrReset();
    }

    // otherwise set/display appropriate error messages
    let toastErrorMessage = 'Something went wrong 😬';

    // set the message + log
    if (missingTypefaces.length > 0) {
      toastErrorMessage = textNodes.length > 1
        ? '❌ One or more select text layers contain missing fonts'
        : '❌ This text layer contains a missing font';
      messenger.log('Text node(s) contained missing fonts');
    } else {
      toastErrorMessage = translateLocked
        ? '❌ You need to select at least one text layer'
        : '❌ You need to select at least one unlocked text layer';
      messenger.log('No text nodes were selected/found');
    }

    // display the message and terminate the plugin
    messenger.toast(toastErrorMessage);
    return closeOrReset();
  }
}
