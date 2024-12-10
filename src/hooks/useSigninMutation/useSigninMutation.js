import { useMutation, useQueryClient } from '@tanstack/react-query';
import signin from './signin';
import { useNavigate } from 'react-router-dom';

const useSigninMutation = (apiUrl, setErrors, signinCb) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (formData) => {
      return await signin(formData, apiUrl);
    },
    onSuccess: (result) => {
      queryClient.clear();
      localStorage.setItem('token', result.token);
      signinCb(result.user);
      navigate('/home/all');
    },
    onError: (error) => {
      setErrors(error.errors);
    },
    throwOnError: false,
  });
};

export default useSigninMutation;
