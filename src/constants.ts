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
const LANGUAGES = [
  {
    name: 'Arabic',
    id: 'arabic',
    abbreviation: 'ar',
    group: 'core',
    font: 'Geeza Pro',
  },
  {
    name: 'Chinese (Traditional)',
    id: 'chinese-traditional',
    abbreviation: 'zh',
    group: 'core',
    font: 'Hiragino Kaku Gothic Pro',
  },
  {
    name: 'Chinese (Simplified)',
    id: 'chinese-simplified',
    abbreviation: 'zh',
    group: 'core',
    font: 'Hiragino Kaku Gothic Pro',
  },
  {
    name: 'Czech',
    id: 'czech',
    abbreviation: 'cs',
    group: 'addl',
    font: null,
  },
  {
    name: 'Danish',
    id: 'danish',
    abbreviation: 'da',
    group: 'addl',
    font: null,
  },
  {
    name: 'Dutch',
    id: 'dutch',
    abbreviation: 'nl',
    group: 'addl',
    font: null,
  },
  {
    name: 'English (U.S.)',
    id: 'english-us',
    abbreviation: 'en',
    group: 'core',
    font: null,
  },
  {
    name: 'English (U.K.)',
    id: 'english-uk',
    abbreviation: 'en',
    group: 'addl',
    font: null,
  },
  {
    name: 'French',
    id: 'french',
    abbreviation: 'fr',
    group: 'addl',
    font: null,
  },
  {
    name: 'German',
    id: 'german',
    abbreviation: 'de',
    group: 'core',
    font: null,
  },
  {
    name: 'Indonesian',
    id: 'indonesian',
    abbreviation: 'id',
    group: 'addl',
    font: null,
  },
  {
    name: 'Italian',
    id: 'italian',
    abbreviation: 'it',
    group: 'addl',
    font: null,
  },
  {
    name: 'Japanese',
    id: 'japanese',
    abbreviation: 'ja',
    group: 'addl',
    font: 'Hiragino Kaku Gothic Pro',
  },
  {
    name: 'Korean',
    id: 'korean',
    abbreviation: 'ko',
    group: 'addl',
    font: 'Apple SD Gothic Neo',
  },
  {
    name: 'Malay',
    id: 'malay',
    abbreviation: 'ms',
    group: 'addl',
    font: null,
  },
  {
    name: 'Norwegian',
    id: 'norwegian',
    abbreviation: 'no',
    group: 'addl',
    font: null,
  },
  {
    name: 'Polish',
    id: 'polish',
    abbreviation: 'pl',
    group: 'addl',
    font: null,
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
    group: 'addl',
    font: null,
  },
  {
    name: 'Russian',
    id: 'russian',
    abbreviation: 'ru',
    group: 'core',
    font: null,
  },
  {
    name: 'Spanish',
    id: 'spanish',
    abbreviation: 'es',
    group: 'addl',
    font: null,
  },
  {
    name: 'Swedish',
    id: 'swedish',
    abbreviation: 'sv',
    group: 'addl',
    font: null,
  },
  {
    name: 'Turkish',
    id: 'turkish',
    abbreviation: 'tr',
    group: 'addl',
    font: null,
  },
  {
    name: 'Thai',
    id: 'thai',
    abbreviation: 'th',
    group: 'core',
    font: 'Thonburi',
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
