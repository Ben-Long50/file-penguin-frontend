import handleResponse from '../handleResponse';

const signin = async (formData, apiUrl) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${apiUrl}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export default signin;
