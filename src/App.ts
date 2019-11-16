import Crawler from './Crawler';
import Messenger from './Messenger';
import Painter from './Painter';
import {
  asyncNetworkRequest,
  awaitUIReadiness,
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

  /** WIP
   * @description Enables the plugin GUI within Figma.
   *
   * @kind function
   * @name showGUI
   * @param {string} size An optional param calling one of the UI sizes defined in GUI_SETTINGS.
   *
   * @returns {null} Shows a Toast in the UI if nothing is selected.
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
        action: 'duplicate' | 'replace',
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

  static showToolbar() {
    const { messenger } = assemble(figma);

    App.showGUI({ size: 'default', messenger });
  }

  /** WIP
   * @description Does a thing.
   *
   * @kind function
   * @name translate
   *
   * @returns {null} Shows a Toast in the UI if nothing is selected.
   */
  translate(
    options: {
      languages: Array<string>,
      action: 'duplicate' | 'replace',
      translateLocked: boolean,
    },
    savePrefs: boolean,
  ) {
    const {
      messenger,
      page,
      selection,
    } = assemble(figma);
    const { action, translateLocked } = options;
    let consolidatedSelection: Array<SceneNode | PageNode> = selection;

    // retrieve selection of text nodes and filter for locked/unlocked based on options
    let textNodes = new Crawler({ for: consolidatedSelection }).text(translateLocked);

    // if action is `duplicate`, need to duplicate the layers first
    if (textNodes.length > 0 && action === 'duplicate') {
      consolidatedSelection = [];

      selection.forEach((node) => {
        // set up Painter instance for the layer
        const painter = new Painter({ for: node, in: page });

        // duplicate the layer
        const newNodeResult = painter.duplicate();
        if (newNodeResult.status === 'success') {
          const newNode = newNodeResult.node;
          consolidatedSelection.push(newNode);
        }
      });

      // reset and retrieve selection of text nodes
      textNodes = new Crawler({ for: consolidatedSelection }).text(translateLocked);
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

    const readText = () => {
      const textToTranslate: Array<{ text: string }> = [];

      textNodes.forEach((textNode: TextNode) => {
        textToTranslate.push({ text: textNode.characters });
      });

      return textToTranslate;
    };

    const manipulateText = () => {
      messenger.log('Begin manipulating text');
      textNodes.forEach((textNode: SceneNode) => {
        // set up Painter instance for the layer
        const painter = new Painter({ for: textNode, in: page });

        // replace the existing text with the translation
        // TKTK handle error result
        painter.replaceText();
      });
      messenger.log('End manipulating text');
    };

    const commitTranslationsToLayers = (
      translations:
        Array<{
          detectedLanguage: {
            language: string,
          }
          translations: [{
            text: string,
            to: string,
          }],
        }>,
    ): void => {
      // check for changes to the original text and reset, if necessary
      const setResetSettings = (
        textNode: TextNode,
        detectedLanguage: { language: string },
      ): void => {
        const originalText: {
          text: string,
          from: string,
        } = JSON.parse(textNode.getPluginData(DATA_KEYS.originalText) || null);

        if (!originalText || originalText.text !== textNode.characters) {
          // set/update original text
          const newOriginalText: {
            text: string,
            from: string,
          } = {
            text: textNode.characters,
            from: detectedLanguage.language,
          };

          textNode.setPluginData(
            DATA_KEYS.originalText,
            JSON.stringify(newOriginalText),
          );

          // invalidate any existing translations
          textNode.setPluginData(
            DATA_KEYS.translations,
            JSON.stringify([]),
          );
        }
      };

      // iterrate selection and add translations to layer node settings
      textNodes.forEach((textNode: TextNode, index: number) => {
        // first check if we need to reset the layer's settings
        setResetSettings(textNode, translations[index].detectedLanguage);

        // read existing translations for the layer
        const existingTranslations = JSON.parse(textNode.getPluginData(DATA_KEYS.translations));

        // set or update translations
        translations[index].translations.forEach((translation: {
          text: string,
          to: string,
          painted?: boolean,
        }) => {
          let updated = false;

          existingTranslations.forEach((existingTranslation) => {
            if (existingTranslation.to === translation.to) {
              // update text
              existingTranslation.text = translation.text; // eslint-disable-line no-param-reassign
              // set painting flag
              existingTranslation.painted = false; // eslint-disable-line no-param-reassign
              updated = true;
            }
          });

          if (!updated) {
            translation.painted = false; // eslint-disable-line no-param-reassign
            existingTranslations.push(translation);
          }
        });

        // save the translations on the layer settings
        textNode.setPluginData(
          DATA_KEYS.translations,
          JSON.stringify(existingTranslations),
        );
      });

      return null;
    };

    const close = () => {
      if (this.shouldTerminate) {
        this.terminatePlugin();
      }
    };

    const mainAction = async () => {
      const { languages } = options;
      const targetLanguages: Array<string> = languages;
      const typefaces: Array<FontName> = readTypefaces();
      const languageTypefaces: Array<FontName> = readLanguageTypefaces(targetLanguages);
      const textToTranslate: Array<{ text: string }> = readText();

      // load typefaces
      if (languageTypefaces) {
        languageTypefaces.forEach(languageTypeface => typefaces.push(languageTypeface));
      }
      await loadTypefaces(typefaces, messenger);

      // set up API call
      const baseUrl: string = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';
      const url: string = `${baseUrl}&to=${targetLanguages.join(',')}`;
      const headers = {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': process.env.MST_API_KEY,
      };

      // make API call
      const data = await asyncNetworkRequest({
        requestUrl: url,
        headers,
        bodyToSend: textToTranslate,
        messenger,
      });

      if (data) {
        // set new translations to the layer's settings
        commitTranslationsToLayers(data);

        // replace the text
        manipulateText();

        messenger.log('Text was translated.');
      } else {
        messenger.log('Translations could not be completed', 'error');
        messenger.toast('Unfortunately, text could not be translated.');
      }

      close();
    };

    // save current options
    if (savePrefs) {
      figma.clientStorage.setAsync(DATA_KEYS.options, options);
    }

    // translate if text nodes are available
    if (textNodes.length > 0) {
      // run the main thread this sets everything else in motion
      return mainAction();
    }

    // otherwise display appropriate error messages
    messenger.log('No text nodes were selected/found');
    if (translateLocked) {
      messenger.toast('❌ You need to select at least one text layer');
    } else {
      messenger.toast('❌ You need to select at least one unlocked text layer');
    }

    return null;
  }
}
