document.body.style.display = 'none';

// instantiate Lock
var lock = new Auth0Lock('9kjZ63jVdIQ1eFXQihdb83FDEVTEUF4z', 'skypager.auth0.com');



// sso requires redirect mode, hence we need to parse
// the response from Auth0 that comes on location hash
var hash = lock.parseHash(window.location.hash);
if (hash && hash.id_token) {
  // the user came back from the login (either SSO or regular login),
  // save the token
  localStorage.setItem('userToken', hash.id_token);
  // redirect to "targetUrl" if any
  window.location.href = hash.state || '#home';
  return;
}

// Get the user token if we've saved it in localStorage before
var idToken = localStorage.getItem('userToken');
if (idToken) {
  // If there's a token, just redirect to "targetUrl" if any
  window.location.href = hash.state || '#home';
  return;
}

// user is not logged, check whether there is an SSO session or not
lock.$auth0.getSSOData(function(err, data) {
  if (!err && data.sso) {
    // there is! redirect to Auth0 for SSO
    lock.$auth0.signin({
      // If the user wanted to go to some other URL, you can track it with `state`
      state: getQueryParam(location.search, 'targetUrl'),
      callbackOnLocationHash: true
    });
  } else {
    // regular login
    document.body.style.display = 'inline';
  }
});
