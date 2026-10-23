import { useEffect } from 'react';

// Opt-in per entry: never mount globally, on manager screens, or in the DS.
const WIDGET_ID = '6adb816d9f0ad5b6ade68e02';
let host: HTMLDivElement | null = null;
let consumers = 0;
let disposeTimer: ReturnType<typeof setTimeout> | undefined;

function mountAgent() {
  const root = document.createElement('div');
  root.dataset.faroExternalAgent = WIDGET_ID;
  document.body.appendChild(root);

  const load = () => {
    root.replaceChildren();
    const script = document.createElement('script');
    script.src = 'https://widgets.leadconnectorhq.com/loader.js';
    script.dataset.resourcesUrl = 'https://widgets.leadconnectorhq.com/chat-widget/loader.js';
    script.dataset.widgetId = WIDGET_ID;
    script.async = true;
    script.onerror = () => {
      if (!root.isConnected) return;
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.textContent = 'Agente indisponível. Tentar novamente';
      retry.setAttribute('aria-label', 'Recarregar o agente de IA externo');
      Object.assign(retry.style, {
        position: 'fixed', bottom: '16px', right: '16px', zIndex: '9999',
        padding: '12px 16px', borderRadius: '12px', background: '#243E3B',
        color: '#fff', border: '0', cursor: 'pointer', maxWidth: 'calc(100vw - 32px)',
      });
      retry.onclick = load;
      root.replaceChildren(retry);
    };
    root.appendChild(script);
  };
  load();
  return root;
}

/** The provider handles its chat. No Faro customer/context data is passed to it. */
export function useLeadConnectorAgent() {
  useEffect(() => {
    consumers += 1;
    clearTimeout(disposeTimer);
    if (!host) host = mountAgent();
    return () => {
      consumers -= 1;
      // Preserve the same instance through React StrictMode's effect replay.
      disposeTimer = setTimeout(() => {
        if (consumers === 0) {
          host?.remove();
          host = null;
        }
      }, 0);
    };
  }, []);
}
