import { createApp, h } from 'vue-demi';

/**
 * 动态渲染组件
 * @param {Component} Component 组件
 * @param {Object} initialAttrs 初始属性，支持vue组件的属性：attrs、props、emit等
 * @param {HTMLElement} mountNode 挂载节点，默认是document.body
 * @param {HTMLElement} mountNode 挂载节点，默认是document.body
 * @param {Object} initialProps 初始props
 * @returns {Object} {container, update, unmount}
 * @example
 * const { container, update, unmount } = renderDynamicComponent(Component, { attr: "value",props:{title:'title'} });
 */
export function renderDynamicComponent(Component, initialAttrs = {}, mountNode = document.body) {
  const container = document.createElement('div');
  container.className = 'popup-render-root';
  mountNode.appendChild(container);
  const Root = {
    render() {
      return h(Component, { ...initialAttrs });
    },
  };
  const app = createApp(Root);
  app.mount(container);
  return {
    container,
    update(newProps = {}) {
      //暂定
    },
    unmount() {
      try {
        app.unmount();
      } catch (e) {}
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    },
  };
}
