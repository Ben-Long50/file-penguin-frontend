import handleResponse from '../handleResponse';

const deleteTrash = async (trashId, apiUrl) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${apiUrl}/folders/${trashId}/trash`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ folderId: Number(trashId) }),
    });
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default deleteTrash;
