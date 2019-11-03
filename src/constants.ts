/* eslint-disable import/prefer-default-export */

/**
 * @description A unique string to identify the plugin within Figma.
 * Changing this will break data retrieval in any `sharedPluginData` and potentially elsewhere.
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
 * @description An object containing the current string constants the Figma API returns for
 * top-level (`main`) layer and `group` layer types.
 *
 * @kind constant
 * @name FRAME_TYPES
 * @type {Object}
 */
const FRAME_TYPES = {
  main: 'FRAME',
  group: 'GROUP',
};

/** WIP
 * @description An object containing `height`/`width` settings for the plugin GUI window.
 *
 * @kind constant
 * @name LANGUAGES
 * @type {Object}
 */
const LANGUAGES: Array<{
  name: string,
  id: string,
  font?: {
    family: string,
    style: string,
  },
  group: 'addl' | 'core',
}> = [
  {
    name: 'Arabic',
    id: 'ar',
    font: {
      family: 'Geeza Pro',
      style: 'Regular',
    },
    group: 'core',
  },
  {
    name: 'Chinese (Traditional)',
    id: 'zh-CHT',
    font: {
      family: 'Hiragino Kaku Gothic Pro',
      style: 'W3',
    },
    group: 'core',
  },
  {
    name: 'Chinese (Simplified)',
    id: 'zh-CHS',
    font: {
      family: 'Hiragino Kaku Gothic Pro',
      style: 'W3',
    },
    group: 'core',
  },
  {
    name: 'Czech',
    id: 'cs',
    font: null,
    group: 'addl',
  },
  {
    name: 'Danish',
    id: 'da',
    font: null,
    group: 'addl',
  },
  {
    name: 'Dutch',
    id: 'nl',
    font: null,
    group: 'addl',
  },
  {
    name: 'English (U.S.)',
    id: 'en',
    font: null,
    group: 'core',
  },
  {
    name: 'English (U.K.)',
    id: 'en',
    font: null,
    group: 'addl',
  },
  {
    name: 'French',
    id: 'fr',
    font: null,
    group: 'addl',
  },
  {
    name: 'German',
    id: 'de',
    font: null,
    group: 'core',
  },
  {
    name: 'Indonesian',
    id: 'id',
    font: null,
    group: 'addl',
  },
  {
    name: 'Italian',
    id: 'it',
    font: null,
    group: 'addl',
  },
  {
    name: 'Japanese',
    id: 'ja',
    font: {
      family: 'Hiragino Kaku Gothic Pro',
      style: 'W3',
    },
    group: 'addl',
  },
  {
    name: 'Korean',
    id: 'ko',
    font: {
      family: 'Apple SD Gothic Neo',
      style: 'Regular',
    },
    group: 'addl',
  },
  {
    name: 'Malay',
    id: 'ms',
    font: null,
    group: 'addl',
  },
  {
    name: 'Norwegian',
    id: 'no',
    font: null,
    group: 'addl',
  },
  {
    name: 'Polish',
    id: 'pl',
    font: null,
    group: 'addl',
  },
  {
    name: 'Portuguese',
    id: 'pt',
    group: 'addl',
    font: null,
  },
  {
    name: 'Romanian',
    id: 'ro',
    font: null,
    group: 'addl',
  },
  {
    name: 'Russian',
    id: 'ru',
    font: null,
    group: 'addl',
  },
  {
    name: 'Spanish',
    id: 'es',
    font: null,
    group: 'addl',
  },
  {
    name: 'Swedish',
    id: 'sv',
    font: null,
    group: 'addl',
  },
  {
    name: 'Turkish',
    id: 'tr',
    font: null,
    group: 'addl',
  },
  {
    name: 'Thai',
    id: 'th',
    font: {
      family: 'Thonburi',
      style: 'Regular',
    },
    group: 'core',
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
    width: 140,
    height: 180,
  },
  input: {
    width: 440,
    height: 145,
  },
};

/**
 * @description An object containing the sets of typefaces in-use by the plugin.
 *
 * @kind constant
 * @name TYPEFACES
 * @type {Object}
 */
const TYPEFACES = {
  primary: {
    family: 'Helvetica Neue',
    style: 'Regular',
  },
  secondary: {
    family: 'Roboto',
    style: 'Regular',
  },
};

export {
  FRAME_TYPES,
  GUI_SETTINGS,
  LANGUAGES,
  PLUGIN_IDENTIFIER,
  PLUGIN_NAME,
  TYPEFACES,
};
/* eslint-enable import/prefer-default-export */
