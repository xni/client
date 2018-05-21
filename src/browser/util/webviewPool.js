import path from 'path';
import uuid from 'uuid/v1';
import { remote } from 'electron';

const preloadPath = `file:${path.join(remote.app.getAppPath(), 'public', 'preloadRenderer.js')}`;

export default class WebviewPool {
  constructor({ document, selector } = {}) {
    this.document = document || window.document;
    this.selector = selector || `#${this.createContainer().id}`;
  }

  attachWebview = (id) => {
    return this.findWebview(id) || this.createWebview(id);
  }

  findWebview = (id) => {
    return this.document.querySelector(`${this.selector} #${id}`);
  }

  createWebview = (id) => {
    const webview = this.document.createElement('webview');
    webview.setAttribute('id', id);
    webview.setAttribute('preload', preloadPath);
    webview.style.height = '100%';
    return webview;
  }

  unattachWebview = (webview) => {
    this.getContainer().appendChild(webview);
  }

  getContainer = () => {
    return this.document.querySelector(this.selector);
  }

  createContainer = () => {
    const container = this.document.createElement('div');
    container.setAttribute('id', `webview-pool-${uuid()}`);
    container.style.zIndex = -1;
    this.document.body.appendChild(container);
    return container;
  }
}

export const defaultWebviewPool = new WebviewPool();
