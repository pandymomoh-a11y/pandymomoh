
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const startApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Could not find root element to mount to");
    return;
  }

  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Initialize app
startApp();

/**
 * PWA Service Worker Registration
 * We use a more robust method to avoid "origin mismatch" errors.
 * In preview environments like AI Studio, the page origin and script origin often differ,
 * which triggers a SecurityError when registering a Service Worker.
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    try {
      const hostname = window.location.hostname;
      const origin = window.location.origin;

      // 1. Detect sandboxed/preview environments where SW will fail due to origin mismatch
      const isPreviewEnv = 
        hostname.includes('usercontent.goog') || 
        hostname.includes('ai.studio') || 
        (hostname.includes('localhost') === false && hostname.includes('.') === false);

      if (isPreviewEnv) {
        console.info('Suffy Poultry: Service Worker registration skipped in preview mode to prevent origin mismatch errors.');
        return;
      }

      // 2. Ensure we are on HTTPS (Service Workers require it)
      if (window.location.protocol !== 'https:' && hostname !== 'localhost' && hostname !== '127.0.0.1') {
        return;
      }

      // 3. Resolve the SW URL strictly against the current origin
      // Using an absolute path /service-worker.js ensures the script origin matches the document origin.
      const swUrl = new URL('/service-worker.js', origin).href;

      navigator.serviceWorker.register(swUrl)
        .then(registration => {
          console.log('Suffy Poultry PWA Ready: ', registration.scope);
        })
        .catch(err => {
          if (err.name === 'SecurityError' || err.message.includes('origin')) {
            console.warn('Suffy Poultry: PWA Service Worker blocked by browser security (expected in preview modes).');
          } else {
            console.error('Suffy Poultry: PWA Setup Failed: ', err);
          }
        });
    } catch (e) {
      console.error('Suffy Poultry: Error during Service Worker setup:', e);
    }
  });
}
