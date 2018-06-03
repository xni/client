import path from 'path';
import uuid from 'uuid/v1';
import { remote } from 'electron';

const preloadPath = `file:${path.join(remote.app.getAppPath(), 'public', 'preloadRenderer.js')}`;

function bindListeners(webview) {
  [
    'did-finish-load', 'did-fail-load', 'did-frame-finish-load', 'did-start-loading',
    'did-stop-loading', 'did-get-response-details', 'did-get-redirect-request', 'dom-ready',
    'page-favicon-updated', 'new-window', 'will-navigate', 'did-navigate', 'did-navigate-in-page',
    'will-prevent-unload', 'crashed', 'destroyed', 'before-input-event', 'devtools-opened',
    'devtools-closed', 'devtools-focused', 'certificate-error', 'select-client-certificate',
    'login', 'found-in-page', 'media-started-playing', 'media-paused', 'did-change-theme-color',
    'update-target-url', 'cursor-changed', 'context-menu', 'select-bluetooth-device', 'paint',
    'will-attach-webview', 'did-attach-webview', 'console-message'
  ].forEach((eventName) => {
    webview.addEventListener(eventName, (event) => console.log(eventName, event));
  });
}

export default class WebviewPool {
  constructor({ document, selector } = {}) {
    this.document = document || window.document;
    this.selector = selector || `#${this.createContainer().id}`;
  }

  attachWebview = (id, container, callback) => {
    console.log('attaching...');
    const existingWebview = this.findWebview(id);

    if (existingWebview) {
      console.log('existingWebview:', existingWebview);
      return this.moveWebview(existingWebview, container);
    } else {
      return container.appendChild(this.createWebview(id, callback));
    }
  }

  unattachWebview = (webview) => {
    console.log('unattaching...');
    return this.moveWebview(webview, this.getContainer());
  }

  findWebview = (id) => {
    return this.document.querySelector(`${this.selector} #${id}`);
  }

  createWebview = (id, callback) => {
    const webview = this.document.createElement('webview');
    bindListeners(webview);

    webview.setAttribute('id', id);
    webview.setAttribute('preload', preloadPath);
    webview.style.height = '100%';

    if (callback) {
      callback(webview);
    }

    return webview;
  }

  // Part of "moving" a webview and preserving its state involves the `guestinstance` attribute
  // being reassigned to the new webview.  It's important to note that we can't simply move the
  // existing DOM element via `container.appendChild`, because the webview will first be removed
  // from its existing container before being appended to the new container, which results in
  // its `webContent` being destroyed, thereby invalidating the `guestinstance`.  Because of
  // this behavior, we instead have to create a new webview, copy all the attributes, append it
  // to the DOM, then delete the old webview element.
  moveWebview = (existingWebview, container) => {
    const { attributes } = existingWebview;
    const webview = this.document.createElement('webview');

    console.log('  original guestinstance:', existingWebview.guestinstance);
    webview.guestinstance = existingWebview.guestinstance;
    console.log('  copied guestinstance:', webview.guestinstance);

    for (let i = 0; i < attributes.length; i += 1) {
      webview.setAttribute(attributes[i].nodeName, attributes[i].nodeValue);
    }

    bindListeners(webview);

    container.appendChild(webview);

    setTimeout(() => {
      existingWebview.parentNode.removeChild(existingWebview);
    }, 100);

    return webview;
  }

  getContainer = () => {
    return this.document.querySelector(this.selector);
  }

  createContainer = () => {
    const container = this.document.createElement('div');
    container.setAttribute('id', `webview-pool-${uuid()}`);
    // container.style.display = 'none';
    this.document.body.appendChild(container);
    return container;
  }
}

export const defaultWebviewPool = new WebviewPool();
