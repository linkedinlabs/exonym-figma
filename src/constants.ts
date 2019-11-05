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
  abbreviation: string,
  font?: {
    family: string,
    style: string,
  },
  group: 'addl' | 'core',
}> = [
  {
    name: 'Arabic',
    id: 'arabic',
    abbreviation: 'ar',
    font: {
      family: 'Geeza Pro',
      style: 'Regular',
    },
    group: 'core',
  },
  {
    name: 'Chinese (Traditional)',
    id: 'chinese-traditional',
    abbreviation: 'zh-CHT',
    font: {
      family: 'Hiragino Kaku Gothic Pro',
      style: 'W3',
    },
    group: 'core',
  },
  {
    name: 'Chinese (Simplified)',
    id: 'chinese-simplified',
    abbreviation: 'zh-CHS',
    font: {
      family: 'Hiragino Kaku Gothic Pro',
      style: 'W3',
    },
    group: 'core',
  },
  {
    name: 'Czech',
    id: 'czech',
    abbreviation: 'cs',
    font: null,
    group: 'addl',
  },
  {
    name: 'Danish',
    id: 'danish',
    abbreviation: 'da',
    font: null,
    group: 'addl',
  },
  {
    name: 'Dutch',
    id: 'dutch',
    abbreviation: 'nl',
    font: null,
    group: 'addl',
  },
  {
    name: 'English (U.S.)',
    id: 'english-us',
    abbreviation: 'en',
    font: null,
    group: 'core',
  },
  {
    name: 'English (U.K.)',
    id: 'english-uk',
    abbreviation: 'en',
    font: null,
    group: 'addl',
  },
  {
    name: 'French',
    id: 'french',
    abbreviation: 'fr',
    font: null,
    group: 'addl',
  },
  {
    name: 'German',
    id: 'german',
    abbreviation: 'de',
    font: null,
    group: 'core',
  },
  {
    name: 'Indonesian',
    id: 'indonesian',
    abbreviation: 'id',
    font: null,
    group: 'addl',
  },
  {
    name: 'Italian',
    id: 'italian',
    abbreviation: 'it',
    font: null,
    group: 'addl',
  },
  {
    name: 'Japanese',
    id: 'japanese',
    abbreviation: 'ja',
    font: {
      family: 'Hiragino Kaku Gothic Pro',
      style: 'W3',
    },
    group: 'addl',
  },
  {
    name: 'Korean',
    id: 'korean',
    abbreviation: 'ko',
    font: {
      family: 'Apple SD Gothic Neo',
      style: 'Regular',
    },
    group: 'addl',
  },
  {
    name: 'Malay',
    id: 'malay',
    abbreviation: 'ms',
    font: null,
    group: 'addl',
  },
  {
    name: 'Norwegian',
    id: 'norwegian',
    abbreviation: 'no',
    font: null,
    group: 'addl',
  },
  {
    name: 'Polish',
    id: 'polish',
    abbreviation: 'pl',
    font: null,
    group: 'addl',
  },
  {
    name: 'Portuguese',
    id: 'portuguese',
    abbreviation: 'pt',
    group: 'addl',
    font: null,
  },
  {
    name: 'Romanian',
    id: 'romanian',
    abbreviation: 'ro',
    font: null,
    group: 'addl',
  },
  {
    name: 'Russian',
    id: 'russian',
    abbreviation: 'ru',
    font: null,
    group: 'addl',
  },
  {
    name: 'Spanish',
    id: 'spanish',
    abbreviation: 'es',
    font: null,
    group: 'addl',
  },
  {
    name: 'Swedish',
    id: 'swedish',
    abbreviation: 'sv',
    font: null,
    group: 'addl',
  },
  {
    name: 'Turkish',
    id: 'turkish',
    abbreviation: 'tr',
    font: null,
    group: 'addl',
  },
  {
    name: 'Thai',
    id: 'thai',
    abbreviation: 'th',
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
