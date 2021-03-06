/* eslint-disable import/prefer-default-export */

/**
 * @description A unique string to identify the plugin within Figma.
 * Changing one of these keys will break data retrieval or reset data in any
 * `xPluginData` getters/setters and potentially elsewhere.
 * [More info]{@link https://www.figma.com/plugin-docs/api/properties/nodes-setsharedplugindata/}
 *
 * @kind constant
 * @name PLUGIN_IDENTIFIER
 * @type {string}
 */
const PLUGIN_IDENTIFIER = 'com.linkedin.figma.exonym-plugin';

/**
 * @description The public-facing name for the plugin. This should match the
 * `name` stated in manifset.json.
 *
 * @kind constant
 * @name PLUGIN_NAME
 * @type {string}
 */
const PLUGIN_NAME = 'Exonym';

/**
 * @description An object containing the current string constants used as keys in plugin data.
 * Changing one of these keys will break data retrieval or reset data in any
 * `xPluginData` getters/setters and potentially elsewhere.
 *
 * @kind constant
 * @name DATA_KEYS
 * @type {Object}
 */
const DATA_KEYS = {
  options: `${PLUGIN_IDENTIFIER}.options-001`,
  translations: `${PLUGIN_IDENTIFIER}.translations-001`,
  originalText: `${PLUGIN_IDENTIFIER}.original-text-001`,
};

/**
 * @description An object containing the current string constants the Figma API returns for
 * top-level (`main`) layer and `group` layer types.
 *
 * @kind constant
 * @name CONTAINER_NODE_TYPES
 * @type {Object}
 */
const CONTAINER_NODE_TYPES = {
  component: 'COMPONENT',
  frame: 'FRAME',
  group: 'GROUP',
  instance: 'INSTANCE',
};

/**
 * @description An array of languages offered in the plugin for translation. The list is split
 * into two groups: `addl` and `core`. Core languages are listed first in the translation
 * menus. Languages are listed in the order that they appear in this array. Each language should
 * contain a `name`, an `id` that corresponds to the ID used in the Microsoft Translator API,
 * and the afforementioned `group`. If the language contains characters that are not widely
 * supported by all typefaces, you may also provide a `font`, formatted like Figma’s `FontName`.
 *
 * @kind constant
 * @name LANGUAGES
 * @type {Array}
 */
const LANGUAGES: Array<{
  name: string,
  id: string,
  font?: {
    family: string,
    style: string,
  },
  group: 'addl' | 'core',
  direction: 'ltr' | 'rtl',
}> = [
  {
    name: 'Arabic',
    id: 'ar',
    font: {
      family: 'Geeza Pro',
      style: 'Regular',
    },
    group: 'core',
    direction: 'rtl',
  },
  {
    name: 'Chinese (Traditional)',
    id: 'zh-Hant',
    font: {
      family: 'Hiragino Kaku Gothic Pro',
      style: 'W3',
    },
    group: 'core',
    direction: 'ltr',
  },
  {
    name: 'Chinese (Simplified)',
    id: 'zh-Hans',
    font: {
      family: 'Hiragino Kaku Gothic Pro',
      style: 'W3',
    },
    group: 'core',
    direction: 'ltr',
  },
  {
    name: 'Czech',
    id: 'cs',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'Danish',
    id: 'da',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'Dutch',
    id: 'nl',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'English',
    id: 'en',
    font: null,
    group: 'core',
    direction: 'ltr',
  },
  {
    name: 'Filipino / Tagalog',
    id: 'fil',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'French',
    id: 'fr',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'German',
    id: 'de',
    font: null,
    group: 'core',
    direction: 'ltr',
  },
  {
    name: 'Indonesian',
    id: 'id',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'Italian',
    id: 'it',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'Japanese',
    id: 'ja',
    font: {
      family: 'Hiragino Kaku Gothic Pro',
      style: 'W3',
    },
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'Klingon',
    id: 'tlh',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'Korean',
    id: 'ko',
    font: {
      family: 'Apple SD Gothic Neo',
      style: 'Regular',
    },
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'Malay',
    id: 'ms',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'Norwegian',
    id: 'no',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'Polish',
    id: 'pl',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'Portuguese',
    id: 'pt',
    group: 'addl',
    direction: 'ltr',
    font: null,
  },
  {
    name: 'Romanian',
    id: 'ro',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'Russian',
    id: 'ru',
    font: null,
    group: 'core',
    direction: 'ltr',
  },
  {
    name: 'Spanish',
    id: 'es',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'Swedish',
    id: 'sv',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
  {
    name: 'Thai',
    id: 'th',
    font: {
      family: 'Thonburi',
      style: 'Regular',
    },
    group: 'core',
    direction: 'ltr',
  },
  {
    name: 'Turkish',
    id: 'tr',
    font: null,
    group: 'addl',
    direction: 'ltr',
  },
];

/**
 * @description An object containing `height`/`width` settings for the plugin GUI window.
 *
 * @kind constant
 * @name GUI_SETTINGS
 * @type {Object}
 */
const GUI_SETTINGS = {
  default: {
    width: 200,
    height: 326,
  },
  info: {
    width: 440,
    height: 145,
  },
};

export {
  DATA_KEYS,
  CONTAINER_NODE_TYPES,
  GUI_SETTINGS,
  LANGUAGES,
  PLUGIN_IDENTIFIER,
  PLUGIN_NAME,
};
/* eslint-enable import/prefer-default-export */
