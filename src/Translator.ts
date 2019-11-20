import {
  asyncForEach,
  asyncNetworkRequest,
  updateArray,
} from './Tools';
import { DATA_KEYS } from './constants';

// for custom translations
import CUSTOM_TRANSLATIONS from './vendor/linkedin-custom-translations';

// --- private functions
/** WIP
 * @description Does a thing.
 *
 * @kind function
 * @name readText
 *
 * @returns {null} Shows a Toast in the UI if nothing is selected.
 */
const readText = (textNodes: Array<TextNode>): Array<{
  text: string,
}> => {
  const textToTranslate: Array<{
    text: string,
  }> = [];

  textNodes.forEach((textNode: TextNode) => {
    textToTranslate.push({
      text: textNode.characters,
    });
  });

  return textToTranslate;
};

/** WIP
 * @description Does a thing.
 *
 * @kind function
 * @name commitToSettings
 *
 * @returns {null} Shows a Toast in the UI if nothing is selected.
 */
const commitToSettings = (results: {
  detectedLanguage: { language: string },
  textNode: TextNode,
  translations: Array<{
    text: string,
    to: string,
  }>,
}): void => {
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

  // set up our params
  const { detectedLanguage, textNode, translations } = results;

  // first check if we need to reset the layer's settings
  setResetSettings(textNode, detectedLanguage);

  // read existing translations for the layer
  const existingTranslations: Array<{
    to: string,
    text: string,
    painted: boolean,
  }> = JSON.parse(textNode.getPluginData(DATA_KEYS.translations));

  // set or update translations
  translations.forEach((translation: {
    text: string,
    to: string,
    painted: boolean,
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

  return null;
};

/** WIP
 * @description Does a thing.
 *
 * @kind function
 * @name commitToSettings
 *
 * @returns {null} Shows a Toast in the UI if nothing is selected.
 */
const commitAllToSettings = (
  translationResults:
    Array<{
      detectedLanguage: {
        language: string,
      }
      translations: [{
        text: string,
        to: string,
      }],
    }>,
  textNodes: Array<TextNode>,
): void => {
  // iterrate selection and add translations to layer node settings
  textNodes.forEach((textNode: TextNode, index: number) => {
    const { detectedLanguage, translations } = translationResults[index];

    commitToSettings({
      detectedLanguage,
      textNode,
      translations,
    });
  });

  return null;
};

/** WIP
 * @description Does a thing.
 *
 * @kind function
 * @name translateLocal
 *
 * @returns {null} Shows a Toast in the UI if nothing is selected.
 */
const translateLocal = (options: {
  textNodesToManipulate: Array<TextNode>,
  targetLanguages: Array<string>,
}) => {
  // set custom dictionary
  const customDictionary = CUSTOM_TRANSLATIONS;
  const {
    textNodesToManipulate,
    targetLanguages,
  } = options;
  let remainingTextNodes = textNodesToManipulate;

  // -------- translate from custom dictionary
  if (customDictionary) {
    // iterate through each text node
    remainingTextNodes.forEach((textNode) => {
      // find the original word first in the dictionary
      let customWord = null;
      let fromLanguage = null;
      customDictionary.forEach((word) => {
        const i = 0;
        const firstMatch = word.filter(entry => entry.text === textNode.characters)[i];

        // set the first available match as the `customWord`
        if (!customWord && firstMatch) {
          customWord = word;
          fromLanguage = firstMatch.id;
        }
      });

      // we have a word; check for corresponding translations
      if (customWord) {
        // stub in boilerplate result object
        const localResults: {
          detectedLanguage: { language: string },
          textNode: TextNode,
          translations: Array<{
            text: string,
            to: string,
          }>,
        } = {
          detectedLanguage: { language: fromLanguage },
          textNode,
          translations: [],
        };

        // reassign `targetLanguages` so that we can check if all are found
        let languagesToCheck = targetLanguages;

        // look for a translations for each language; add it to the list
        languagesToCheck.forEach((language, languageIndex) => {
          const i = 0;
          const translation = customWord.filter(entry => entry.id === language)[i];

          if (translation) {
            // add translation to the list
            localResults.translations.push({
              text: translation.text,
              to: translation.id,
            });

            // remove the language from the master list because it was found
            languagesToCheck = [
              ...languagesToCheck.slice(0, languageIndex),
              ...languagesToCheck.slice(languageIndex + 1),
            ];
          }
        });

        // commit the result if ALL requested languages were translated locally
        if (languagesToCheck.length < 1) {
          // commit the result to the layer settings
          // NOTE: if a single language is missing from the custom translations,
          // we fall back to the API for ALL translations
          commitToSettings(localResults);

          // remove from the master array because all requested languages were translated
          // this text layer will NOT be translater by the API
          remainingTextNodes = updateArray(remainingTextNodes, textNode, 'id', 'remove');
        }
      }
    });
  }

  // -------- attempt to translate remaining locally
  remainingTextNodes.forEach((textNode) => {
    const originalText: {
      text: string,
      from: string,
    } = JSON.parse(textNode.getPluginData(DATA_KEYS.originalText) || null);

    // if the original text matches (and hasn't changed) we can check for an available translation
    if (originalText && originalText.text === textNode.characters) {
      const translations: Array<{
        text: string,
        to: string,
        painted: boolean,
      }> = JSON.parse(textNode.getPluginData(DATA_KEYS.translations) || null);
      let updatedTranslations = translations;

      if (translations.length > 0 && targetLanguages) {
        // reassign `targetLanguages` so that we can check if all are found
        let languagesToCheck = targetLanguages;

        languagesToCheck.forEach((language, languageIndex) => {
          const i = 0;
          const foundTranslation = translations.filter(
            translation => translation.to === language,
          )[i];

          if (foundTranslation) {
            // set translation flag to paint
            foundTranslation.painted = false;
            updatedTranslations = updateArray(updatedTranslations, foundTranslation, 'to', 'update');

            // remove the language from the master list because it was found
            languagesToCheck = [
              ...languagesToCheck.slice(0, languageIndex),
              ...languagesToCheck.slice(languageIndex + 1),
            ];
          }
        });

        // commit the result if ALL requested languages were translated locally
        if (languagesToCheck.length < 1) {
          // commit the result to the layer settings
          // NOTE: if a single language is missing from the custom translations,
          // we fall back to the API for ALL translations
          textNode.setPluginData(
            DATA_KEYS.translations,
            JSON.stringify(updatedTranslations),
          );

          // remove from the master array because all requested languages were translated
          // this text layer will NOT be translater by the API
          remainingTextNodes = updateArray(remainingTextNodes, textNode, 'id', 'remove');
        }
      }
    }
  });

  return { remainingTextNodes };
};

// --- main Translate class
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
   * @name translate
   *
   * @returns {null} Shows a Toast in the UI if nothing is selected.
   */
  async translate(targetLanguages: Array<string>) {
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

    // set the initial array of text nodes
    // this array will first be translated locally, then narrowed,
    // and then any remaining nodes in the array will be translated via the API
    let textNodesToManipulate: Array<TextNode> = this.textNodes;

    // attempt local translations first ---------------
    const localOptions = {
      textNodesToManipulate,
      targetLanguages,
    };

    const localTranslateResults = translateLocal(localOptions);

    // narrow the nodes to translate based on local results
    textNodesToManipulate = localTranslateResults.remainingTextNodes;

    // if there are no nodes left, we do not need to translate anything remotely
    if (textNodesToManipulate.length < 1) {
      // return a successful result
      result.status = 'success';
      result.messages.log = 'Text was translated (locally)';
      return result;
    }

    // finish up with remote translations ---------------

    // set up the initial text array
    const textToTranslate: Array<{ text: string }> = readText(textNodesToManipulate);

    // set options for the API request
    // the API is limited to 5000 characters per request
    // count the characters that need translating and split them into bundles
    const apiRequests: Array<Array<{ text: string }>> = [];
    let apiRequestBundle: Array<{ text: string }> = [];

    let characterCount = 0;
    textToTranslate.forEach((textSnippet) => {
      const snippetCharCount = textSnippet.text.length;
      const proposedCharCount = (characterCount + snippetCharCount);

      // if adding the current snippet will not tip the bundle over 5k, go ahead
      // otherwise the current bundle is full and a new one needs to be started
      if (proposedCharCount < 5000) {
        // add the current snippet to the current bundle
        apiRequestBundle.push(textSnippet);
        // update the character count
        characterCount = proposedCharCount;
      } else {
        // push the previous bundle to the requests array
        apiRequests.push(apiRequestBundle);

        // reset the bundle array and character count
        apiRequestBundle = [];
        characterCount = snippetCharCount;

        // add the current snippet to the new bundle
        apiRequestBundle.push(textSnippet);
      }
    });

    // need to push the last bundle into the requests array
    apiRequests.push(apiRequestBundle);

    // set up API call options
    const baseUrl: string = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';
    const url: string = `${baseUrl}&to=${targetLanguages.join(',')}`;
    const headers = {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': process.env.MST_API_KEY,
    };

    // make API call(s)
    let data = [];
    await asyncForEach(apiRequests, async (apiRequestBody) => {
      const updatedData = data;
      const newData = await asyncNetworkRequest({
        requestUrl: url,
        headers,
        bodyToSend: apiRequestBody,
        messenger: this.messenger,
      });

      // update the master data object with the latest request result
      data = updatedData.concat(newData);
    });

    if (data) {
      // set new translations to the layer's settings
      await commitAllToSettings(data, textNodesToManipulate);

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
