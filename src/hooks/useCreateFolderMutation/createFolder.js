import handleResponse from '../handleResponse';

const createFolder = async (input, parentFolderId, apiUrl) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${apiUrl}/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: input, parentFolderId }),
    });
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default createFolder;
