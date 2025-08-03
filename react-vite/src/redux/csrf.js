import Cookies from 'js-cookie';

export async function csrfFetch(url, options = {}) {
  // set options.method to 'GET' if there is no method
  options.method = options.method || 'GET';
  // set options.headers to an empty object if there is no headers
  options.headers = options.headers || {};
  // set credentials to include by default to send cookies
  options.credentials = options.credentials || 'include';

  // if the options.method is not 'GET', then set the "Content-Type" header to
  // "application/json", and set the "X-CSRFToken" header to the value of the
  // "csrf_token" cookie
  if (options.method.toUpperCase() !== 'GET') {
    options.headers['Content-Type'] =
      options.headers['Content-Type'] || 'application/json';
    options.headers['X-CSRFToken'] = Cookies.get('csrf_token');
  }
  // call the default window's fetch with the url and the options passed in
  const res = await window.fetch(url, options);

  // if the response status code is 400 or above, then throw an error with the
  // error being the response
  //if (res.status >= 400) console.log res;

  // if the response status code is under 400, then return the response to the
  // next promise chain
  return res;
}


    // call this to get the "csrf_token" cookie, should only be used in development
export function restoreCSRF() {
    if (process.env.NODE_ENV !== 'production') {
    return csrfFetch('/api/csrf/restore', { credentials: 'include' });
  }
}