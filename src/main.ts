// ++++++++++++++++++++++++++ Specter for Figma +++++++++++++++++++++++++++
import App from './App';
import Messenger from './Messenger';
import { awaitUIReadiness, resizeGUI } from './Tools';

// GUI management -------------------------------------------------

/**
 * @description Shuts down the plugin and closes the GUI.
 *
 * @kind function
 * @name terminatePlugin
 *
 * @returns {null}
 */
const terminatePlugin = (): void => {
  // close the plugin without suppressing error messages
  figma.closePlugin();
  return null;
};

// watch for commands -------------------------------------------------

/**
 * @description Takes a unique string (`type`) and calls the corresponding action
 * in the App class. Also does some housekeeping duties such as pre-loading typefaces
 * and managing the GUI.
 *
 * @kind function
 * @name dispatcher
 * @param {Object} action An object comprised of `type`, a string representing
 * the action received from the GUI and `visual` a boolean indicating if the
 * command came from the GUI or the menu.
 * @returns {null}
 */
const dispatcher = async (action: {
  type: string,
  payload?: any,
  visual: boolean,
}) => {
  const { type, payload, visual } = action;

  // if the action is not visual, close the plugin after running
  const shouldTerminate: boolean = !visual;

  // pass along some GUI management and navigation functions to the App class
  const app = new App({
    shouldTerminate,
    terminatePlugin,
  });

  // run the action in the App class based on type
  const runAction = async () => {
    let quickTranslatePayload = null;

    // retrieve existing options
    const lastUsedOptions: {
      action: 'duplicate' | 'replace',
      translateLocked: boolean,
      languages: Array<string>,
    } = await figma.clientStorage.getAsync('options');

    const setTranslatePayload = (quickTranslateType: string) => {
      // set language to use
      const language: string = quickTranslateType.replace('quick-translate-', '');

      // set preliminary options
      const options: {
        languages: Array<string>,
        action: 'duplicate' | 'replace',
        translateLocked: boolean,
      } = {
        languages: [language],
        action: 'duplicate',
        translateLocked: false,
      };

      // set core options
      if (lastUsedOptions
        && lastUsedOptions.action !== undefined
        && lastUsedOptions.translateLocked !== undefined
      ) {
        options.action = lastUsedOptions.action;
        options.translateLocked = lastUsedOptions.translateLocked;
      }

      // set last-used language, if necessary
      if (language === 'last' && lastUsedOptions.languages !== undefined) {
        options.languages = lastUsedOptions.languages;
      }

      // commit options to payload
      quickTranslatePayload = options;
    };

    switch (type) {
      case 'submit':
        app.translate(payload);
        break;
      case 'quick-translate-last':
      case 'quick-translate-ar':
      case 'quick-translate-zh-CHT':
      case 'quick-translate-zh-CHS':
      case 'quick-translate-en':
      case 'quick-translate-de':
      case 'quick-translate-ru':
      case 'quick-translate-th':
        setTranslatePayload(type);
        app.translate(quickTranslatePayload);
        break;
      default:
        app.showToolbar();
    }
  };

  runAction();

  return null;
};
export default dispatcher;

/**
 * @description Acts as the main wrapper function for the plugin. Run by default
 * when Figma calls the plugin.
 *
 * @kind function
 * @name main
 *
 * @returns {null}
 */
const main = async () => {
  // set up logging
  const messenger = new Messenger({ for: figma, in: figma.currentPage });

  // set up the UI, hidden by default -----------------------------------------
  figma.showUI(__html__, { visible: false }); // eslint-disable-line no-undef

  // make sure UI has finished setting up
  await awaitUIReadiness(messenger);

  // watch menu commands ------------------------------------------------------
  if (figma.command) {
    dispatcher({
      type: figma.command,
      visual: false,
    });
  }

  // watch GUI action clicks --------------------------------------------------
  figma.ui.onmessage = (msg: { action: string, payload: any }): void => {
    const { action, payload } = msg;

    // watch for actions and send to `dispatcher`
    if (action) {
      dispatcher({
        type: action,
        payload,
        visual: true,
      });
    }

    // ignore everything else
    return null;
  };
};

// run main as default
main();
