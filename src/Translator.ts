import { asyncNetworkRequest } from './Tools';
import { DATA_KEYS } from './constants';

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
  textNodes: Array<TextNode>;
  messenger: { log: Function };

  constructor({ for: textNodes, messenger }) {
    this.textNodes = textNodes;
    this.messenger = messenger;
  }

  /** WIP
   * @description Does a thing.
   *
   * @kind function
   * @name commitToSettings
   *
   * @returns {null} Shows a Toast in the UI if nothing is selected.
   */
  commitToSettings(
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
  ): void {
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
    this.textNodes.forEach((textNode: TextNode, index: number) => {
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
  }

  /** WIP
   * @description Does a thing.
   *
   * @kind function
   * @name readText
   *
   * @returns {null} Shows a Toast in the UI if nothing is selected.
   */
  readText() {
    const textToTranslate: Array<{ text: string }> = [];

    this.textNodes.forEach((textNode: TextNode) => {
      textToTranslate.push({ text: textNode.characters });
    });

    return textToTranslate;
  }

  /** WIP
   * @description Does a thing.
   *
   * @kind function
   * @name translate
   *
   * @returns {null} Shows a Toast in the UI if nothing is selected.
   */
  async translate(targetLanguages) {
    const result: {
      node: SceneNode,
      status: 'error' | 'success',
      messages: {
        toast: string,
        log: string,
      },
    } = {
      node: null,
      status: null,
      messages: {
        toast: null,
        log: null,
      },
    };

    // set up the text array
    const textToTranslate: Array<{ text: string }> = this.readText();

    // set up API call options
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
      messenger: this.messenger,
    });

    if (data) {
      // set new translations to the layer's settings
      await this.commitToSettings(data);

      // return a successful result
      result.status = 'success';
      result.messages.log = 'Text was translated';
    } else {
      result.status = 'error';
      result.messages.log = 'Translations could not be completed';
      result.messages.toast = 'Unfortunately, text could not be translated';
    }

    return result;
  }
}
