import handleResponse from '../handleResponse';

const moveFile = async (folderId, fileId, apiUrl) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${apiUrl}/files/${fileId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ folderId, fileId }),
    });
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default moveFile;
