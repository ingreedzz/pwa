import CONFIG from '../config';

export async function subscribeUserToPush() {
  if (!('serviceWorker' in navigator)) return;
  const reg = await navigator.serviceWorker.ready;

  // Request permission
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    alert('Push notification permission denied.');
    return;
  }

  // Check for existing subscription
  let subscription = await reg.pushManager.getSubscription();
  if (!subscription) {
    subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(CONFIG.VAPID_PUBLIC_KEY),
    });
  }

  // Send subscription to Dicoding API
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must log in to enable push notifications.');
    return;
  }

  await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subscription),
  });

  // Show a notification immediately for feedback
  if (reg.showNotification) {
    reg.showNotification('Get Notifications', {
      body: 'You will receive notifications when you add a story!',
      icon: '/images/logo.png',
    });
  } else if (window.Notification && Notification.permission === 'granted') {
    new Notification('Get Notifications', {
      body: 'You will receive notifications when you add a story!',
      icon: '/images/logo.png',
    });
  } else {
    alert('Push notification enabled!');
  }
}

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}