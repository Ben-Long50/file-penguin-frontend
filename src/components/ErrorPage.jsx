import { useNavigate, useRouteError } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { mdiAlertCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import Button from './Button';

const ErrorPage = () => {
  const { theme } = useContext(ThemeContext);
  const error = useRouteError();
  const navigate = useNavigate();

  return (
    <div
      className={`${theme} bg-primary flex h-dvh w-full flex-col items-center justify-start gap-4 px-6 py-8 md:gap-8`}
    >
      <Icon
        className="fade-in-bottom text-accent text-orange-300"
        path={mdiAlertCircleOutline}
        size={5}
      />
      <h1 className="fade-in-bottom text-primary text-center text-2xl font-semibold md:text-3xl">
        Oops an error occured
      </h1>
      <p className="fade-in-bottom text-error text-center text-xl">
        {error.message}
      </p>
      <div className="fade-in-bottom grid grid-cols-2 gap-4 md:gap-8">
        <Button
          className="w-full px-3 py-2 text-lg md:text-xl"
          onClick={() => navigate(0)}
        >
          Refresh page
        </Button>
        <Button
          className="w-full p-2 text-lg md:text-xl"
          onClick={() => navigate('/signin')}
        >
          Sign in
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
