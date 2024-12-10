import handleResponse from '../handleResponse';

const uploadFiles = async (activeId, formData, apiUrl) => {
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(`${apiUrl}/folders/${activeId}/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default uploadFiles;
