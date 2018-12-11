import fetch from 'isomorphic-fetch';

export default class {
  static async all() {
    return fetch(`/requestTypes`, {
      credentials: 'same-origin'
    })
      .then(response => {
        if (response.ok) {
          return Promise.resolve(response.json());
        } else {
          return Promise.reject(Error('HTTP error when trying to list users'));
        }
      })
      .then(data => {
        return data;
      })
      .catch(() => Promise.reject(Error('Error trying to list users')));
  }
}
