import { createContext, useState } from 'react';
import Loading from './Loading';
import useServerStatusQuery from '../hooks/useServerStatusQuery/useServerStatusQuery';

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    } else {
      if (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      ) {
        localStorage.setItem('theme', 'dark');
        return 'dark';
      } else {
        localStorage.setItem('theme', 'light');
        return 'light';
      }
    }
  });

  const serverStatus = useServerStatusQuery();

  const changeTheme = () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  if (serverStatus.isError) {
    return (
      <div className="h-dvh w-dvw">
        <div
          className={`${theme} bg-secondary flex h-full w-full flex-col items-center justify-center gap-4 px-8 md:gap-8`}
        >
          <h1 className="text-primary text-4xl font-semibold">
            Could not connect to the server
          </h1>
          <p className="text-secondary text-2xl">Please try again later</p>
        </div>
      </div>
    );
  }

  if (serverStatus.isLoading || serverStatus.isPending) {
    return (
      <div className="h-dvh w-dvw">
        <div
          className={`${theme} bg-secondary flex h-full w-full flex-col items-center justify-center gap-4 px-8 md:gap-8`}
        >
          <h1 className="text-primary font-logo text-4xl">Please wait</h1>
          <div>
            <p className="text-secondary text-center text-xl">
              Connecting to the server
            </p>
            <p className="text-tertiary text-center text-base">
              (This can take up to about a minute)
            </p>
          </div>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
