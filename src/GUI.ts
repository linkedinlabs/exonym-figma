/**
 * @description A set of functions to operate the plugin GUI.
 */
import './views/webview.css';
import { makeNetworkRequest } from './Tools';
import { LANGUAGES } from './constants';
import './vendor/figma-select-menu';

/**
 * @description Posts a message to the main thread with `loaded` set to `true`. Used in the
 * main thread to indicate the GUI is listening.
 *
 * @kind function
 * @name sendLoadedMsg
 *
 * @returns {null}
 */
const sendLoadedMsg = (): void => {
  // send message to main thread indicating UI has loaded
  parent.postMessage({ pluginMessage: { loaded: true } }, '*');

  return null;
};

/**
 * @description Populates the `languages` <select> menu with a list of languages
 * in the constants (LANGUAGES).
 *
 * @kind function
 * @name initLanguages
 *
 * @returns {null}
 */
const initLanguages = (): void => {
  const languagesElement: HTMLSelectElement = (<HTMLSelectElement> document.getElementById('languages'));

  if (languagesElement) {
    const coreLanguages = LANGUAGES.filter(language => language.group === 'core');
    const addlLanguages = LANGUAGES.filter(language => language.group === 'addl');

    const addOption = (language: {
      name: string,
      id: string,
    }, optGroup: HTMLOptGroupElement) => {
      const newOptionElement: HTMLOptionElement = (<HTMLOptionElement> document.createElement('option'));
      newOptionElement.text = language.name;
      newOptionElement.value = language.id;
      optGroup.append(newOptionElement);
    };

    // add groups
    const coreOptGroupElement: HTMLOptGroupElement = (<HTMLOptGroupElement> document.createElement('optgroup'));
    const addlOptGroupElement: HTMLOptGroupElement = (<HTMLOptGroupElement> document.createElement('optgroup'));
    languagesElement.add(coreOptGroupElement);
    languagesElement.add(addlOptGroupElement);

    // add core options to group
    coreLanguages.forEach(language => addOption(language, coreOptGroupElement));

    // add additional options to group
    addlLanguages.forEach(language => addOption(language, addlOptGroupElement));

    // set up the Figma version
    selectMenu.init({ position: 'overlap' });
  }

  return null;
};

/** WIP
 * @description Compiles the plugin’s options form elements into an object formatted for
 * consumption in the main thread.
 *
 * @kind function
 * @name readOptions
 *
 * @returns {Object} option Includes an array of languages to translate, the action to take
 * on the text blocks, and whether or not to ignore locked layers.
 */
const readOptions = () => {
  const languagesElement: HTMLSelectElement = (<HTMLSelectElement> document.getElementById('languages'));
  const textActionElement: HTMLInputElement = document.querySelector('input[name="text-action"]:checked');
  const translateLockedElement: HTMLInputElement = document.querySelector('input[name="translate-locked"]');

  const languages: Array<string> = [languagesElement.value]; // array here; eventually multi-lang
  const textAction: string = textActionElement.value;
  const translateLocked: boolean = translateLockedElement.checked;

  const options = {
    languages,
    action: textAction,
    translateLocked,
  };

  return options;
};

/**
 * @description Watch UI clicks for actions to pass on to the main plugin thread.
 *
 * @kind function
 * @name watchActions
 *
 * @returns {null}
 */
const watchActions = (): void => {
  const actionsElement: HTMLInputElement = (<HTMLInputElement> document.getElementById('actions'));

  if (actionsElement) {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLTextAreaElement;
      const button = target.closest('button');
      if (button) {
        // find action by element id
        const action = button.id;

        if (action === 'submit') {
          const payload = readOptions();

          // bubble action to main
          parent.postMessage({
            pluginMessage: {
              action,
              payload,
            },
          }, '*');
        }
      }
    };

    actionsElement.addEventListener('click', onClick);
  }

  return null;
};

/* process Messages from the plugin */

/** WIP
 * @description Compiles the plugin’s options form elements into an object formatted for
 * consumption in the main thread.
 *
 * @kind function
 * @name setOptions
 *
 * @returns {Object} option Includes an array of languages to translate, the action to take
 * on the text blocks, and whether or not to ignore locked layers.
 */
const setOptions = (options: {
  action: 'duplicate' | 'replace' | 'new-page',
  translateLocked: boolean,
  languages: Array<string>,
}): void => {
  const { languages, action, translateLocked } = options;

  // remove the Figma version so it can be reset
  // the figma-select-menu make a <select> clone, so it must be removed before selecting
  // the menu from the DOM
  selectMenu.destroy();

  const languageIndex = 0; // currently GUI only supports 1 language at a time; take first
  const language = languages[languageIndex];
  const languagesElement: HTMLSelectElement = (<HTMLSelectElement> document.getElementById('languages'));
  const languageOptionElement: HTMLOptionElement = document.querySelector(`option[value="${language}"]`);

  const textActionElement: HTMLInputElement = document.querySelector(`input[value="${action}"]`);
  const translateLockedElement: HTMLInputElement = document.querySelector('input[name="translate-locked"]');

  if (languagesElement) {
    // set the language if it exists in the menu
    if (languageOptionElement) {
      languagesElement.value = language;
    }

    // set the Figma version of the menu
    selectMenu.init({ position: 'overlap' });
  }

  if (textActionElement) {
    textActionElement.checked = true;
  }

  if (translateLockedElement) {
    translateLockedElement.checked = translateLocked;
  }

  sendLoadedMsg();
};

/**
 * @description Watches for incoming messages from the plugin’s main thread and dispatches
 * them to the appropriate GUI actions.
 *
 * @kind function
 * @name watchIncomingMessages
 *
 * @returns {null}
 */
const watchIncomingMessages = (): void => {
  onmessage = ( // eslint-disable-line no-undef
    event: {
      data: {
        pluginMessage: {
          action: string,
          payload: any,
        }
      }
    },
  ) => {
    const { pluginMessage } = event.data;

    switch (pluginMessage.action) {
      case 'networkRequest':
        makeNetworkRequest(pluginMessage.payload);
        break;
      case 'setOptions':
        setOptions(pluginMessage.payload);
        break;
      default:
        return null;
    }

    return null;
  };
};


// init GUI
watchActions();
watchIncomingMessages();
initLanguages();
sendLoadedMsg();
