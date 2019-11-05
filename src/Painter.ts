import { findFrame, getLayerSettings } from './Tools';
import { PLUGIN_IDENTIFIER, PLUGIN_NAME } from './constants';

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

    // TKTK
    // const layerSettings = getLayerSettings(this.page, this.layer.id);

    // if (!layerSettings || (layerSettings && !layerSettings.annotationText)) {
    //   result.status = 'error';
    //   result.messages.log = 'Layer missing annotationText';
    //   return result;
    // }

    let spacingBuffer: number = 24;
    if ((this.layer.height / 2) < spacingBuffer) {
      spacingBuffer = (this.layer.height / 2);
    }
    const updatedCharacters: string = `${this.layer.characters}… and some more!`;

    // create text node + update characters
    const newTextNode: TextNode = this.layer.clone();
    if (languageTypeface) {
      newTextNode.fontName = languageTypeface;
    }
    newTextNode.characters = updatedCharacters;

    // placement
    newTextNode.x = this.layer.x + spacingBuffer;
    newTextNode.y = this.layer.y + spacingBuffer;
    this.layer.parent.appendChild(newTextNode);

    // // update the `newPageSettings` array TKTK
    // let newPageSettings = JSON.parse(this.page.getPluginData(PLUGIN_IDENTIFIER) || null);
    // newPageSettings = updateArray(
    //   'annotatedLayers',
    //   newAnnotatedLayerSet,
    //   newPageSettings,
    //   'add',
    // );

    // // commit the `Settings` update
    // this.page.setPluginData(
    //   PLUGIN_IDENTIFIER,
    //   JSON.stringify(newPageSettings),
    // );

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

    // TKTK
    // const layerSettings = getLayerSettings(this.page, this.layer.id);

    // if (!layerSettings || (layerSettings && !layerSettings.annotationText)) {
    //   result.status = 'error';
    //   result.messages.log = 'Layer missing annotationText';
    //   return result;
    // }

    const updatedCharacters: string = `${this.layer.characters}… and some more!`;

    // create text node + update characters
    const textNode: TextNode = this.layer;
    if (languageTypeface) {
      textNode.fontName = languageTypeface;
    }
    textNode.characters = updatedCharacters;

    // // update the `newPageSettings` array TKTK
    // let newPageSettings = JSON.parse(this.page.getPluginData(PLUGIN_IDENTIFIER) || null);
    // newPageSettings = updateArray(
    //   'annotatedLayers',
    //   newAnnotatedLayerSet,
    //   newPageSettings,
    //   'add',
    // );

    // // commit the `Settings` update
    // this.page.setPluginData(
    //   PLUGIN_IDENTIFIER,
    //   JSON.stringify(newPageSettings),
    // );

    // return a successful result
    result.status = 'success';
    return result;
  }
}
