self.addEventListener('push', (event) => {
  const data = event.data.json();
  const title = data.title;
  const body = data.body;
  const url = data.url
  const notificationOptions = {
    body,
    url,
    icon: '/icon.png',
  };

  event.waitUntil(self.registration.showNotification(title, notificationOptions));

  /*  event.waitUntil(
   self.registration.showNotification(title, {
   body: "New push notification",
   icon: "/images/logo@2x.png",
   tag:  "push-notification-tag",
   data: {
     url: JSON.parse(event.message).url
   }
  })
) */

  //self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url + "?notification_id=" + event.notification.data.id));
});

self.addEventListener('pushsubscriptionchange', (event) => {
  console.log(event);
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim()); // Ensures active service worker
});

self.addEventListener('install', (event) => {
  event.waitUntil(skipWaiting()); // Activate immediately
});
