import handleResponse from '../handleResponse';

const editFile = async (fileId, fileTitle, apiUrl) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${apiUrl}/files/${fileId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileId: Number(fileId),
        fileTitle: fileTitle,
      }),
    });
    const data = handleResponse(response);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default editFile;
