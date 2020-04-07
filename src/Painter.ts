import { isTextNode, updateArray } from './Tools';
import { DATA_KEYS, LANGUAGES } from './constants';

// --- private functions
const reverseRTLLang = (text: string): string => {
  const isAlphanumeric = (testString: string) => {
    const firstCharIndex = 0;
    const firstChar = testString[firstCharIndex];

    if (firstChar.replace(/[^a-z0-9]/gi, '') === '') {
      return false;
    }
    return true;
  };

  const reverseString = require('reverse-string'); // eslint-disable-line global-require
  const textAsArray = text.split(' ');
  const reversedArray = [];

  textAsArray.forEach((word) => {
    if (!isAlphanumeric(word)) {
      reversedArray.push(reverseString(word));
    } else {
      reversedArray.push(word);
    }
  });

  const reversedString = reversedArray.reverse().join(' ');
  return reversedString;
};

// --- main Painter class function
/**
 * @description A class to manipulate elements directly in the Figma file.
 *
 * @class
 * @name Painter
 *
 * @constructor
 *
 * @property node The SceneNode in the Figma file that we want to annotate or modify.
 * @property page The page (`PageNode`) containing the corresponding `frame`, `node`,
 * and `textLayer`.
 * @property textLayer A text node (`TextNode`) to manipulate.
 */
export default class Painter {
  node: SceneNode;
  page: PageNode;
  textLayer: TextNode;
  constructor({ for: node, in: page }) {
    this.node = node;
    this.textLayer = isTextNode(this.node) ? this.node : null;
    this.page = page;
  }

  /**
   * @description Duplicates a node and, by default, places it near the original node. If
   a `newPage` node is passed, the duplicated `SceneNode` will be placed on a new page.
   *
   * @kind function
   * @name duplicate
   *
   * @param {Object} newPage A page node (`PageNode`) to move the duplicated node to (optional).
   *
   * @returns {Object} A result object container success/error status and log/toast messages.
   */
  duplicate(newPage?: PageNode) {
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

    // set up initial node spacing
    let spacingBuffer: number = 56;
    if ((this.node.height / (1.5)) < spacingBuffer) {
      spacingBuffer = (this.node.height / (1.5));
    }

    // create text node + update characters and typeface
    const newNode: SceneNode = this.node.clone();
    newPage ? newPage.appendChild(newNode) : this.node.parent.appendChild(newNode);

    // force unlock - no one expects new nodes to be locked
    newNode.locked = false;

    // placement
    newNode.x = this.node.x + spacingBuffer;
    newNode.y = this.node.y + spacingBuffer;
    result.node = newNode;

    // return a successful result
    result.status = 'success';
    return result;
  }

  /**
   * @description Retrieves unpainted translation(s) from a node’s data, updates the `textNode`
   * characters to match, and updates the node data to mark the translation(s) as painted.
   *
   * @kind function
   * @name replaceText
   *
   * @returns {Object} A result object container success/error status and log/toast messages.
   */
  replaceText() {
    const result: {
      status: 'error' | 'success',
      messages: {
        toast: string,
        log: string,
      },
    } = {
      status: null,
      messages: {
        toast: null,
        log: null,
      },
    };

    // load list of translations for the node from Settings
    const existingTranslations = JSON.parse(
      this.node.getPluginData(DATA_KEYS.translations) || null,
    );

    // if there are no translations, return with error
    if (!existingTranslations) {
      result.status = 'error';
      result.messages.log = 'Layer is missing translations';
      return result;
    }

    // isolate the translations that need to be added
    // only unpainted items should be drawn
    const unpaintedTranslations = existingTranslations.filter(translation => !translation.painted);
    let updatedTranslations = existingTranslations;

    // update the node’s text with the translation
    unpaintedTranslations.filter(translation => !translation.painted).forEach((translation) => {
      // select the node to update
      const textNode: TextNode = this.textLayer;

      // add previous originalText to the translations list as a translation
      const originalText: {
        text: string,
        from: string,
      } = JSON.parse(textNode.getPluginData(DATA_KEYS.originalText) || null);
      if (originalText && originalText.text === textNode.characters) {
        const newTranslation: {
          text: string,
          to: string,
          painted: boolean,
        } = {
          text: textNode.characters,
          to: originalText.from,
          painted: true,
        };

        // add/update the translations array with the original text
        updatedTranslations = updateArray(updatedTranslations, newTranslation, 'to');
      }

      // update (replace) the text + update typeface, if necessary
      const updatedCharacters: string = translation.text;
      const languageConstant = LANGUAGES.find(language => language.id === translation.to);
      const languageTypeface = languageConstant.font;
      if (languageTypeface) {
        textNode.fontName = languageTypeface;
      }

      // Figma does not support right-to-left languages, so we need to manually
      // reverse the characters to make them appear correctly
      if (languageConstant.direction === 'rtl') {
        textNode.characters = reverseRTLLang(updatedCharacters);
        textNode.name = updatedCharacters;
      } else {
        textNode.characters = updatedCharacters;
      }

      // flip the painted flag + update the overall array
      translation.painted = true; // eslint-disable-line no-param-reassign
      updatedTranslations = updateArray(updatedTranslations, translation, 'to');

      // update node settings with a new originalText
      const newOriginalText: {
        text: string,
        from: string,
      } = {
        text: updatedCharacters,
        from: translation.to,
      };

      textNode.setPluginData(
        DATA_KEYS.originalText,
        JSON.stringify(newOriginalText),
      );
    });

    // commit updated list of translations to Settings
    this.node.setPluginData(DATA_KEYS.translations, JSON.stringify(updatedTranslations));

    // return a successful result
    result.status = 'success';
    return result;
  }
}
