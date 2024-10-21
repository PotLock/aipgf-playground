import Script from 'next/script';

const FacebookMessenger = () => {
  const MESSENGER_PAGE_ID = process.env.NEXT_PUBLIC_MESSENGER_PAGE_ID;

  if (!MESSENGER_PAGE_ID) return null;

  return (
    <>
      <div id="fb-customer-chat"></div>
      <Script strategy="lazyOnload" id="messenger">
        {`
          var chatbox = document.getElementById('fb-customer-chat');
          chatbox.setAttribute("page_id", ${MESSENGER_PAGE_ID});
          chatbox.setAttribute("attribution", "biz_inbox");


          window.fbAsyncInit = function() {
            FB.init({
              xfbml: true,
              version: 'v14.0'
            });
          };

          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) return;
            js = d.createElement(s); js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
        `}
      </Script>
    </>
  );
};

export default FacebookMessenger;
