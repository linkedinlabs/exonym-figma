// ++++++++++++++++++++++++++ Specter for Figma +++++++++++++++++++++++++++
import App from './App';
import { GUI_SETTINGS } from './constants';

// GUI management -------------------------------------------------

/**
 * @description Shuts down the plugin and closes the GUI.
 *
 * @kind function
 * @name closeGUI
 *
 * @returns {null}
 */
const closeGUI = (): void => {
  // close the UI without suppressing error messages
  figma.closePlugin();
  return null;
};

/**
 * @description Enables the plugin GUI within Figma.
 *
 * @kind function
 * @name showGUI
 *
 * @returns {null} Shows a Toast in the UI if nothing is selected.
 */
const showGUI = (): void => {
  // show UI – command: tools
  figma.showUI(__html__, { // eslint-disable-line no-undef
    width: GUI_SETTINGS.default.width,
    height: GUI_SETTINGS.default.height,
  });

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
const dispatcher = (action: {
  type: string,
  payload?: any,
  visual: boolean,
}): void => {
  const { type, payload, visual } = action;

  // if the action is not visual, close the plugin after running
  const shouldTerminate: boolean = !visual;

  // pass along some GUI management and navigation functions to the App class
  const app = new App({
    closeGUI,
    dispatcher,
    shouldTerminate,
    showGUI,
  });

  // run the action in the App class based on type
  const runAction = () => {
    let quickTranslatePayload = null;
    const setTranslatePayload = (quickTranslateType: string) => {
      const language: string = quickTranslateType.replace('quick-translate-', '');
      const options: {
        languages: Array<string>,
        action: 'duplicate',
        ignoreLocked: boolean,
      } = {
        languages: [language],
        action: 'duplicate',
        ignoreLocked: true,
      };
      return options;
    };

    switch (type) {
      case 'submit':
        app.translate(payload);
        break;
      case 'quick-translate-ar':
      case 'quick-translate-zh-CHT':
      case 'quick-translate-zh-CHS':
      case 'quick-translate-en':
      case 'quick-translate-de':
      case 'quick-translate-ru':
      case 'quick-translate-th':
        quickTranslatePayload = setTranslatePayload(type);
        app.translate(quickTranslatePayload);
        break;
      default:
        showGUI();
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
const main = (): void => {
  // watch menu commands -------------------------------------------------
  if (figma.command) {
    dispatcher({
      type: figma.command,
      visual: false,
    });
  }

  // watch GUI action clicks -------------------------------------------------
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
