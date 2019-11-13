import { findFrame, updateArray } from './Tools';
import { DATA_KEYS } from './constants';

// --- private functions for drawing/positioning annotation elements in the Figma file
// TKTK


// --- main Painter class function
/**
 * @description A class to add elements directly onto Figma file frames.
 *
 * @class
 * @name Painter
 *
 * @constructor
 *
 * @property layer The SceneNode in the Figma file that we want to annotate or modify.
 * @property frame The top-level FrameNode in the Figma file that we want to annotate or modify.
 * @property page The PageNode in the Figma file containing the corresponding `frame` and `layer`.
 */
export default class Painter {
  layer: TextNode;
  frame: FrameNode;
  page: PageNode;
  constructor({ for: layer, in: page }) {
    this.layer = layer;
    this.frame = findFrame(this.layer);
    this.page = page;
  }

  /** WIP
   * @description Locates annotation text in a layer’s Settings object and
   * builds the visual annotation on the Figma frame.
   *
   * @kind function
   * @name duplicateText
   *
   * @returns {Object} A result object container success/error status and log/toast messages.
   */
  duplicateText(languageTypeface?: FontName) {
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

    // load list of translations for the layer from Settings
    const existingTranslations = JSON.parse(this.layer.getPluginData(DATA_KEYS.translations));

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

    // set up initial layer spacing
    let spacingBuffer: number = 56;
    if ((this.layer.height / (1.5)) < spacingBuffer) {
      spacingBuffer = (this.layer.height / (1.5));
    }
    let currentSpacingBuffer = spacingBuffer;

    // clone the initial layer and update the text with the translation
    unpaintedTranslations.filter(translation => !translation.painted).forEach((translation) => {
      const updatedCharacters: string = translation.text;

      // create text node + update characters
      const newTextNode: TextNode = this.layer.clone();
      if (languageTypeface) {
        newTextNode.fontName = languageTypeface;
      }
      newTextNode.characters = updatedCharacters;

      // force unlock
      newTextNode.locked = false;

      // placement
      newTextNode.x = this.layer.x + currentSpacingBuffer;
      newTextNode.y = this.layer.y + currentSpacingBuffer;
      newTextNode.name = `${translation.to}: ${newTextNode.name}`;
      this.layer.parent.appendChild(newTextNode);

      currentSpacingBuffer += spacingBuffer;

      // flip the painted flag + update the overall array
      translation.painted = true; // eslint-disable-line no-param-reassign
      updatedTranslations = updateArray(updatedTranslations, translation, 'to');
    });

    // commit updated list of translations to Settings
    this.layer.setPluginData(DATA_KEYS.translations, JSON.stringify(updatedTranslations));

    // return a successful result
    result.status = 'success';
    return result;
  }

  /** WIP
   * @description Locates annotation text in a layer’s Settings object and
   * builds the visual annotation on the Figma frame.
   *
   * @kind function
   * @name replaceText
   *
   * @returns {Object} A result object container success/error status and log/toast messages.
   */
  replaceText(languageTypeface?: FontName) {
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

    // load list of translations for the layer from Settings
    const existingTranslations = JSON.parse(this.layer.getPluginData(DATA_KEYS.translations));

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

    // update the layer’s text with the translation
    unpaintedTranslations.filter(translation => !translation.painted).forEach((translation) => {
      // select the node to update
      const textNode: TextNode = this.layer;

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

      // update (replace) the text
      const updatedCharacters: string = translation.text;
      if (languageTypeface) {
        textNode.fontName = languageTypeface;
      }
      textNode.characters = updatedCharacters;

      // flip the painted flag + update the overall array
      translation.painted = true; // eslint-disable-line no-param-reassign
      updatedTranslations = updateArray(updatedTranslations, translation, 'to');

      // update layer settings with a new originalText
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
    this.layer.setPluginData(DATA_KEYS.translations, JSON.stringify(updatedTranslations));

    // return a successful result
    result.status = 'success';
    return result;
  }
}
