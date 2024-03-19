export const makeRequest = (url, method = 'GET', body = null) => {
  if (method !== 'GET') {
    const bearerToken = localStorage.getItem('token');
    return fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${bearerToken}`,
      },
      method,
      body: JSON.stringify(body),
    }).then((res) => res.json());
  }
  return fetch(url).then((res) => res.json());
};

export const downloadFile = async (fileUrl) => {
  const urlParts = fileUrl.split('/');
  const filenameWithExtension = urlParts[urlParts.length - 1];
  const [filename, fileExtension] = filenameWithExtension.split('.');
  const response = await fetch(fileUrl);
  const blob = await response.blob();
  const filenameToUse = `${filename}.${fileExtension}`;
  const a = document.createElement('a');
  a.style.display = 'none';
  document.body.appendChild(a);
  const url = window.URL.createObjectURL(blob);
  a.href = url;
  a.download = filenameToUse;
  a.click();
  window.URL.revokeObjectURL(url);
};
