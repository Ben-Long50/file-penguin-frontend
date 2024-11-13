import { Outlet } from 'react-router-dom';
import { ThemeContext } from './ThemeContext';
import { useContext } from 'react';
import Icon from '@mdi/react';
import { mdiWeatherSunny, mdiWeatherNight } from '@mdi/js';
import PenguinIcon from './PenguinIcon';

const AuthLayout = () => {
  const { theme, changeTheme } = useContext(ThemeContext);

  return (
    <div
      className={`${theme} bg-primary flex min-h-dvh flex-col items-center justify-center gap-16 p-4 md:gap-32 md:p-8`}
    >
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
        <PenguinIcon className="size-20 md:size-24" />
        <h1 className="text-primary text-center text-4xl font-semibold md:text-6xl">
          File Penguin
        </h1>
      </div>
      <div className="w-full max-w-96">
        <Outlet />
      </div>
      <button
        className="text-secondary hover-primary absolute left-0 top-0 m-4 flex items-center gap-4 rounded p-2 text-xl transition duration-300"
        onClick={changeTheme}
      >
        <Icon
          path={theme === 'light' ? mdiWeatherSunny : mdiWeatherNight}
          size={1.2}
        />
      </button>
    </div>
  );
};

export default AuthLayout;
