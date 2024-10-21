export const publicPages = [
  '/',
  '/login',
  '/chat',
  '/callback',
  '/chat/(.*)',
  '/create-agent',
  '/create-widget',
  '/create-tool'
];
export const pathnames = {
  '/': '/',
  '/login': '/login',
  '/chat': '/chat',
  '/chat/[id]': '/chat/[id]',
  '/callback': '/callback',
  '/create-agent': '/create-agent',
  '/create-widget': '/create-widget',
  '/create-tool': '/create-tool'
};
