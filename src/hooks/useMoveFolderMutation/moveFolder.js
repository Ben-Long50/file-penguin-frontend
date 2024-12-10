import handleResponse from '../handleResponse';

const moveFolder = async (folderId, childId, apiUrl) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${apiUrl}/folders/${folderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ folderId, childId }),
    });
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default moveFolder;
