import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import Form from './Form';
import InputField from './InputField';
import Button from './Button';
import { AuthContext } from './AuthContext';

const SigninForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState([]);
  const { signin, apiUrl } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/chats/global');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        signin();
        navigate('/chats/global');
      } else {
        const errorArray = result.map((error) => {
          return error.msg;
        });
        setErrors(errorArray);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="flex w-1/2 min-w-80 flex-col gap-6">
      <Form method="post" onSubmit={handleSubmit}>
        <h1 className="text-primary pb-4 text-4xl font-semibold">Sign In</h1>
        <InputField
          label="Username"
          name="username"
          type="text"
          onChange={handleChange}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          onChange={handleChange}
        />
        <Button type="submit" className="mb-2 mt-3">
          Sign in
        </Button>
      </Form>
      <p className="text-secondary">
        Dont have an account?
        <Link to="/signup">
          <span className="pl-2 hover:underline">Sign up</span>
        </Link>
      </p>
      {errors.length > 0 && (
        <div className="flex flex-col gap-3 pt-4">
          <span className="text-primary">Error signing in</span>
          {errors.map((error, index) => (
            <p key={index} className="text-error">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SigninForm;
