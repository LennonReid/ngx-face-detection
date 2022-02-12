/**
 * scripts loader
 *
 * @export
 * @param url
 * @returns
 */
export async function loadScript(url: string) {
  return new Promise((resolve, reject) => {
    let scriptElement: HTMLScriptElement = document.body.querySelector(`script[src='${url}']`) as any;

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.type = 'text/javascript';
      scriptElement.src = url;
      document.body.appendChild(scriptElement);
    }

    if (scriptElement.classList.contains('load')) {
      resolve(null);
    }
    const removeEvent = () => {
      scriptElement.removeEventListener('load', onLoad);
      scriptElement.removeEventListener('error', onError);
    };
    const onLoad = () => {
      scriptElement.classList.add('load');
      removeEvent();
      resolve(null);
    };
    const onError = (e: any) => {
      removeEvent();
      reject(e);
    };
    scriptElement.addEventListener('load', onLoad);
    scriptElement.addEventListener('error', onError);
  });
}
