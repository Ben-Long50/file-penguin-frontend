import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Form from './Form';
import InputField from './InputField';
import Button from './Button';
import { AuthContext } from './AuthContext';
import useSignupMutation from '../hooks/useSignupMutation/useSignupMutation';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState([]);
  const { apiUrl } = useContext(AuthContext);

  const signupMutation = useSignupMutation(apiUrl, setErrors);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    signupMutation.mutate(formData);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <Form method="post" onSubmit={handleSubmit} buttonText="Sign Up">
        <h1 className="text-primary text-3xl font-semibold md:text-4xl">
          Sign Up
        </h1>
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
        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          onChange={handleChange}
        />
        <Button type="submit" className="mb-2 mt-3 p-2">
          Sign up
        </Button>
      </Form>
      <p className="text-secondary">
        Already have an account?
        <Link to="/signin">
          <span className="pl-2 hover:underline">Sign in</span>
        </Link>
      </p>
      {errors.length > 0 && (
        <div className="flex flex-col gap-3 pt-4">
          <span className="text-primary">Error signing up</span>
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

export default SignupForm;
