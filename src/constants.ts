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
    type: 'core',
  },
  {
    name: 'Chinese (Traditional)',
    id: 'chinese-traditional',
    abbreviation: 'zh',
    type: 'core',
  },
  {
    name: 'Chinese (Simplified)',
    id: 'chinese-simplified',
    abbreviation: 'zh',
    type: 'core',
  },
  {
    name: 'Czech',
    id: 'czech',
    abbreviation: 'cs',
    type: 'addl',
  },
  {
    name: 'Danish',
    id: 'danish',
    abbreviation: 'da',
    type: 'addl',
  },
  {
    name: 'Dutch',
    id: 'dutch',
    abbreviation: 'nl',
    type: 'addl',
  },
  {
    name: 'English (U.S.)',
    id: 'english-us',
    abbreviation: 'en',
    type: 'core',
  },
  {
    name: 'English (U.K.)',
    id: 'english-uk',
    abbreviation: 'en',
    type: 'addl',
  },
  {
    name: 'French',
    id: 'french',
    abbreviation: 'fr',
    type: 'addl',
  },
  {
    name: 'German',
    id: 'german',
    abbreviation: 'de',
    type: 'core',
  },
  {
    name: 'Indonesian',
    id: 'indonesian',
    abbreviation: 'id',
    type: 'addl',
  },
  {
    name: 'Italian',
    id: 'italian',
    abbreviation: 'it',
    type: 'addl',
  },
  {
    name: 'Japanese',
    id: 'japanese',
    abbreviation: 'ja',
    type: 'addl',
  },
  {
    name: 'Korean',
    id: 'korean',
    abbreviation: 'ko',
    type: 'addl',
  },
  {
    name: 'Malay',
    id: 'malay',
    abbreviation: 'ms',
    type: 'addl',
  },
  {
    name: 'Norwegian',
    id: 'norwegian',
    abbreviation: 'no',
    type: 'addl',
  },
  {
    name: 'Polish',
    id: 'polish',
    abbreviation: 'pl',
    type: 'addl',
  },
  {
    name: 'Portuguese',
    id: 'portuguese',
    abbreviation: 'pt',
    type: 'addl',
  },
  {
    name: 'Romanian',
    id: 'romanian',
    abbreviation: 'ro',
    type: 'addl',
  },
  {
    name: 'Russian',
    id: 'russian',
    abbreviation: 'ru',
    type: 'core',
  },
  {
    name: 'Spanish',
    id: 'spanish',
    abbreviation: 'es',
    type: 'addl',
  },
  {
    name: 'Swedish',
    id: 'swedish',
    abbreviation: 'sv',
    type: 'addl',
  },
  {
    name: 'Turkish',
    id: 'turkish',
    abbreviation: 'tr',
    type: 'addl',
  },
  {
    name: 'Thai',
    id: 'thai',
    abbreviation: 'th',
    type: 'core',
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
