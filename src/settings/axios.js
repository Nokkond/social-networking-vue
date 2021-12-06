import axios from 'axios'
import store from '@/store'

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';

axios.defaults.headers['content-type'] = 'application/json';
axios.defaults.withCredentials = true;
switch (NODE_ENV) {
  case 'development':
    axios.defaults.baseURL =  'http://localhost:8086/api/v1/';
    // axios.defaults.baseURL =  'https://java-16-pro-group.herokuapp.com/api/v1/';
    break;
    case 'production':
    // axios.defaults.baseURL =  'https://java-16-pro-group.herokuapp.com/api/v1/';
    axios.defaults.baseURL =  'http://localhost:8086/api/v1/';
    break;
  default:
    axios.defaults.baseURL =  'https://virtserver.swaggerhub.com/andrewleykin/social/1.0.4/api/v1/';
}

const token = localStorage.getItem('user-token')
if (token) axios.defaults.headers.common['Authorization'] = token

axios.interceptors.response.use(null, error => {
  let message = ''

  if (error.response.data.error === 'invalid_request') {
    message = error.response.data.error_description
  } else {
    message = error.response.data.path + ' - ' + error.response.data.error
  }

  if (error.response.status === 401) {
    store.dispatch('auth/api/logout');
    window.location.reload();
  } else {
    store.dispatch('global/alert/setAlert', {
      status: 'error',
      text: message
    })
  }

  return Promise.reject(error)
});
