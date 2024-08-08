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
      className={`${theme} auth-layout-rows bg-primary grid min-h-dvh justify-center`}
    >
      <div className="mb-16 flex flex-col items-center gap-8 self-end md:mb-32 md:flex-row">
        <PenguinIcon className="size-24" />
        <h1 className="text-primary text-5xl font-semibold md:text-6xl">
          File Penguin
        </h1>
      </div>
      <div className="z-10 flex min-w-80 flex-col items-center justify-center self-start">
        <button
          className="text-secondary hover-primary absolute left-0 top-0 m-4 flex items-center gap-4 rounded p-2 text-xl transition duration-300"
          onClick={changeTheme}
        >
          Theme
          <Icon
            path={theme === 'dark' ? mdiWeatherSunny : mdiWeatherNight}
            size={1.2}
          />
        </button>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
