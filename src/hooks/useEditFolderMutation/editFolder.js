import handleResponse from '../handleResponse';

const editFolder = async (folderId, folderTitle, apiUrl) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${apiUrl}/folders/${folderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        folderId: Number(folderId),
        folderTitle: folderTitle,
      }),
    });
    const data = handleResponse(response);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default editFolder;
