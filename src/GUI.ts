/**
 * @description A set of functions to operate the plugin GUI.
 */
import './views/webview.css';

/* watch Navigation action buttons */
const actionsElement = (<HTMLInputElement> document.getElementById('actions'));

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

/* process Messages from the plugin */


/* watch for Messages from the plugin */
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
    default:
      return null;
  }

  return null;
};
