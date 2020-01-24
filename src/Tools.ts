import {
  FRAME_TYPES,
  GUI_SETTINGS,
  LANGUAGES,
} from './constants';

// --- helper functions
/**
 * @description An approximation of `forEach` but run in an async manner.
 *
 * @kind function
 * @name asyncForEach
 *
 * @param {Array} array An array to iterate.
 * @param {Function} callback A function to feed the single/iterated item back to.
 *
 * @returns {null} Runs the callback function.
 */
const asyncForEach = async (
  array: Array<any>,
  callback: Function,
): Promise<Function> => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array); // eslint-disable-line no-await-in-loop
  }
  return null;
};

/**
 * @description An approximation of `setTimeout` but run in an async manner
 * with logging to Messenger.
 *
 * @kind function
 * @name pollWithPromise
 *
 * @param {Function} externalCheck The external function to run a check against.
 * The function should resolve to `true`.
 * @param {Object} messenger An initialized instance of the Messenger class for logging (optional).
 * @param {string} name The name of the check for logging purposes (optional).
 *
 * @returns {Promise} Returns a promise for resolution.
 */
const pollWithPromise = (
  externalCheck: Function,
  messenger?: { log: Function },
  name?: string,
): Promise<Function> => {
  const isReady: Function = externalCheck;
  const checkName = name || externalCheck.name;

  const checkIsReady = (resolve) => {
    if (messenger) { messenger.log(`Checking: ${checkName} 🤔`); }

    if (isReady()) {
      if (messenger) { messenger.log(`Resolve ${checkName} 🙏`); }

      resolve(true);
    } else {
      setTimeout(checkIsReady, 25, resolve);
    }
  };
  return new Promise(checkIsReady);
};

/**
 * @description Manages the process of passing a network request along to the plugin
 * UI and waiting for the response.
 *
 * @kind function
 * @name asyncNetworkRequest
 *
 * @param {Object} options An object including the request options: The URL the request should
 * go to (`requestUrl`), headers to pass along to the request (optional), an optional request
 * body (`bodyToSend`), and an initialized instance of the Messenger class for logging (optional).
 *
 * @returns {Object} Returns the result of the network request (response).
 */
const asyncNetworkRequest = async (options: {
  requestUrl: string,
  headers?: any,
  bodyToSend?: any,
  messenger?: { log: Function },
}) => {
  const {
    requestUrl,
    headers,
    bodyToSend,
    messenger,
  } = options;

  // set blank response
  let response = null;

  // polling function to check for a response from the plugin UI
  const awaitResponse = async () => {
    // simple function to check for existence of a response
    const responseExists = () => (response !== null);

    // set a one-time use listener
    figma.ui.once('message', (msg) => {
      if (msg && msg.apiResponse) { response = msg.apiResponse; }
    });

    await pollWithPromise(responseExists, messenger);
  };

  // makes the request by passing the options along to the plugin UI
  const makeRequest = () => {
    figma.ui.postMessage({
      action: 'networkRequest',
      payload: {
        route: requestUrl,
        headers,
        bodyToSend,
      },
    });
  };

  // do the things
  makeRequest();
  await awaitResponse();
  return response;
};

// we need to wait for the UI to be ready:
// network calls are made through the UI iframe
const awaitUIReadiness = async (messenger?) => {
  // set UI readiness check to falsey
  let ready = false;

  // simple function to check truthiness of `ready`
  const isUIReady = () => ready;

  // set a one-time use listener
  figma.ui.once('message', (msg) => {
    if (msg && msg.loaded) { ready = true; }
  });

  await pollWithPromise(isUIReady, messenger);
};

/**
 * @description A helper function that uses `fetch` to make a network request.
 * This helper can only be used from the UI thread. The main thread of the plugin
 * cannot make network requests. From the main thread, use `asyncNetworkRequest`.
 *
 * @kind function
 * @name makeNetworkRequest
 *
 * @param {Object} options The network request options, containing the URL/route for the
 * request (`route`), the `method` of the request (default is `POST`), optional
 * request `headers`, and an optional request body (`bodyToSend`).
 *
 * @returns {null} Posts a message to the main thread of the plugin with the results
 * of the `fetch` call.
 */
const makeNetworkRequest = (options: {
  route: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  headers?: any,
  bodyToSend?: any,
}) => {
  const { route, headers, bodyToSend } = options;
  const body = bodyToSend ? JSON.stringify(bodyToSend) : null;
  const method = options.method || 'POST';

  fetch(route, { // eslint-disable-line no-undef
    method,
    headers,
    body,
  })
    .then((response) => {
      response.json()
        .then((json) => {
          if (json) {
            // return json blob back to main thread
            parent.postMessage({ pluginMessage: { apiResponse: json } }, '*');
          }
        });
    })
    .catch(err => console.error(err)); // eslint-disable-line no-console
};

/**
 * @description A reusable helper function to take an array and add or remove data from it
 * based on a top-level key and a defined action.
 *
 * @kind function
 * @name updateArray
 *
 * @param {Array} array The array to be modified.
 * @param {Object} item Object containing the new bit of data to add, remove, or update.
 * @param {string} itemKey String representing the key to match (default is `id`).
 * @param {string} action Constant string representing the action to take
 * (`add`, `update`, or `remove`).
 *
 * @returns {Object} The modified array.
 */
const updateArray = (
  array,
  item,
  itemKey: string = 'id',
  action: 'add' | 'update' | 'remove' = 'add',
) => {
  let updatedArray = array;

  // find the index of a pre-existing `id` match on the array
  const itemIndex: number = updatedArray.findIndex(
    foundItem => (foundItem[itemKey] === item[itemKey]),
  );

  // if a match exists, remove it
  // even if the action is `add`, always remove the existing entry to prevent duplicates
  if (itemIndex > -1) {
    updatedArray = [
      ...updatedArray.slice(0, itemIndex),
      ...updatedArray.slice(itemIndex + 1),
    ];
  }

  // if the `action` is `add` (or update), append the new `item` to the array
  if (action !== 'remove') {
    updatedArray.push(item);
  }

  return updatedArray;
};

/**
 * @description Takes a layer object and traverses parent relationships until the top-level
 * `FRAME_TYPES.main` layer is found. Returns the frame layer.
 *
 * @kind function
 * @name findTopFrame
 * @param {Object} layer A Figma layer object.
 *
 * @returns {Object} The top-level `FRAME_TYPES.main` layer.
 */
const findTopFrame = (layer: any) => {
  let { parent } = layer;

  // if the parent is a page, we're done
  if (parent && parent.type === 'PAGE') {
    return parent;
  }

  // loop through each parent until we find the outermost FRAME
  if (parent) {
    while (parent && parent.type !== FRAME_TYPES.main) {
      parent = parent.parent;
    }
  }
  return parent;
};

/**
 * @description An async function to load multiple typefaces using Figma’s `loadFontAsync`.
 *
 * @kind function
 * @name loadTypefaces
 *
 * @param {Array} typefaces An array of typefaces to load. Typefaces in the array must be
 * formatted to match Figma’s `FontName` type.
 * @param {Object} messenger An initialized instance of the Messenger class for logging (optional).
 *
 * @returns {Promise} Returns a promise for resolution.
 */
const loadTypefaces = async (
  typefaces: Array<FontName>,
  messenger?: { log: Function },
) => {
  messenger.log('begin loading typefaces');
  await asyncForEach(typefaces, async (typeface: FontName) => {
    await figma.loadFontAsync(typeface);
    messenger.log(`loading ${typeface.family} ${typeface.style} typeface`);
  });

  messenger.log('done loading typefaces');
};

/**
 * @description Give an array of language IDs (`languageIdArray`), match the IDs with the
 * `LANGUAGES` constant and retrieve any associated typefaces.
 *
 * @kind function
 * @name readLanguageTypefaces
 *
 * @param {Array} languageIdArray An array of language IDs that will match languages in the
 * `LANGUAGES` constant.
 *
 * @returns {Array} Returns an array of `FontName` typed typefaces.
 */
const readLanguageTypefaces = (languageIdArray: Array<string>): Array<FontName> => {
  const uniqueTypefaces: Array<FontName> = [];

  languageIdArray.forEach((languageId) => {
    const languageIndex = LANGUAGES.findIndex(lang => lang.id === languageId);
    const language = LANGUAGES[languageIndex];
    if (language && language.font) {
      const itemIndex: number = uniqueTypefaces.findIndex(
        (foundItem: FontName) => (
          (foundItem.family === language.font.family)
          && foundItem.style === language.font.style),
      );

      if (itemIndex < 0) {
        uniqueTypefaces.push(language.font);
      }
    }
  });

  return uniqueTypefaces;
};

/**
 * @description Resizes the plugin iframe GUI within the Figma app.
 *
 * @kind function
 * @name resizeGUI
 * @param {string} type A string representing the `type` of GUI to load.
 * @param {Function} ui An instance of `figma.ui` with the GUI pre-loaded.
 *
 * @returns {null}
 */
const resizeGUI = (
  type: string,
  ui: { resize: Function },
): void => {
  ui.resize(
    GUI_SETTINGS[type].width,
    GUI_SETTINGS[type].height,
  );

  return null;
};

/**
 * @description Checks a node’s `type` to see if it is a `TextNode`.
 *
 * @kind function
 * @name isTextNode
 *
 * @param {Object} node The node to check.
 *
 * @returns {boolean} `true` if the node is a `TextNode`.
 */
const isTextNode = (node: any): node is TextNode => node.type === 'TEXT';

/**
 * @description Checks the `FEATURESET` environment variable from webpack and
 * determines if the featureset build should be `internal` or not.
 *
 * @kind function
 * @name isInternal
 *
 * @returns {boolean} `true` if the build is internal, `false` if it is not.
 */
const isInternal = (): boolean => {
  const buildIsInternal: boolean = process.env.FEATURESET === 'internal';
  return buildIsInternal;
};

export {
  asyncForEach,
  asyncNetworkRequest,
  awaitUIReadiness,
  findTopFrame,
  isInternal,
  isTextNode,
  loadTypefaces,
  makeNetworkRequest,
  pollWithPromise,
  readLanguageTypefaces,
  resizeGUI,
  updateArray,
};
