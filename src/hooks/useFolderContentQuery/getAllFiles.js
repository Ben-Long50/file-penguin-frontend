import handleResponse from '../handleResponse';

const getAllFiles = async (apiUrl) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${apiUrl}/files`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getAllFiles;
