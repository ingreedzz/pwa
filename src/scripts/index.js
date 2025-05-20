// CSS imports
import '../styles/styles.css';
import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const skipLink = document.querySelector('.skip-to-content');
  const mainContent = document.querySelector('#main-content');

  // Skip to Content functionality
  skipLink.addEventListener('click', (event) => {
    event.preventDefault();
    mainContent.focus(); // Focus on the main content
    mainContent.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the main content
  });

  const app = new App({
    content: mainContent,
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  // Bind push notification button globally
  const subscribeBtn = document.getElementById('subscribe-push-btn');
  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', async () => {
      const { subscribeUserToPush } = await import('./utils/push');
      await subscribeUserToPush();
    });
  }
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered');
    } catch (err) {
      console.error('Service Worker registration failed:', err);
    }
  });
}
