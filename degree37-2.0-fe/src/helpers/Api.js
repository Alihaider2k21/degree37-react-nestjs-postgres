import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export const makeAuthorizedApiRequest = async (method, url, data = null) => {
  const bearerToken = localStorage.getItem('token');
  const config = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      method: method,
      authorization: `Bearer ${bearerToken}`,
    },
    body: data,
  };

  return fetch(url, config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.error(`Error making API request: ${error}`);
    });
};

export const makeAuthorizedApiRequestAxios = async (
  method,
  url,
  data = null
) => {
  const bearerToken = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${bearerToken}`,
  };

  try {
    const response = await axios({
      method,
      url,
      headers,
      data,
    });
    return response;
  } catch (error) {
    console.error(`Error making API request: ${error}`);
    throw error; // Optionally, you can rethrow the error for handling in the caller
  }
};

const methodMap = {
  GET: 'read',
  POST: 'write',
  PUT: 'write',
  PATCH: 'write',
  DELETE: 'write',
};

export const fetchData = async (url, method = 'GET', data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  if (data)
    switch (methodMap[method]) {
      case 'write':
        options['body'] = JSON.stringify(data);
        break;
      default:
        url += '?' + new URLSearchParams(data).toString();
        break;
    }

  const response = await fetch(BASE_URL + url, options);
  const json = await response.json();
  if (!response.ok) {
    const error = new Error();
    Object.keys(json).forEach((key) => (error[key] = json[key]));
    throw error;
  }
  return json;
};

export const postEvent = async (event) => {
  event.ip = await getIP();
  fetch(BASE_URL + '/user-events', {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(event),
  });
};

export const getIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      method: 'GET',
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const { ip } = data;

    return ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
  }
  return null;
};
