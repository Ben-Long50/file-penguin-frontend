import handleResponse from '../handleResponse';

const deleteItem = async (itemId, type, apiUrl) => {
  let endpoint;
  if (type === 'folder') {
    endpoint = `folders/${itemId}`;
  } else if (type === 'file') {
    endpoint = `files/${itemId}`;
  }
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${apiUrl}/${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ folderId: Number(itemId) }),
    });
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default deleteItem;
