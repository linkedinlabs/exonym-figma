/**
 * @description A set of functions to operate the plugin GUI.
 */
import './views/webview.css';
import { makeNetworkRequest } from './Tools';
import { LANGUAGES } from './constants';

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
    }) => {
      const newOptionElement: HTMLOptionElement = (<HTMLOptionElement> document.createElement('option'));
      newOptionElement.text = language.name;
      newOptionElement.value = language.id;
      languagesElement.add(newOptionElement);
    };

    // add core group
    coreLanguages.forEach(language => addOption(language));

    // add separator between groups
    const newOptionElement: HTMLOptionElement = (<HTMLOptionElement> document.createElement('option'));
    newOptionElement.disabled = true;
    newOptionElement.text = '-----------------';
    languagesElement.add(newOptionElement);

    // add additional group
    addlLanguages.forEach(language => addOption(language));
  }

  return null;
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

        // bubble action to main
        parent.postMessage({
          pluginMessage: {
            navType: action,
          },
        }, '*');
      }
    };

    actionsElement.addEventListener('click', onClick);
  }

  return null;
};

/* process Messages from the plugin TKTK */

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
      case 'doAThing':
        console.log('a thing'); // eslint-disable-line no-console
        break;
      case 'networkRequest':
        makeNetworkRequest(pluginMessage.payload);
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

// send message to main thread indicating UI has loaded
parent.postMessage({ pluginMessage: { loaded: true } }, '*');
