import List from './List';
import { useContext, useEffect, useState } from 'react';
import Icon from '@mdi/react';
import {
  mdiChevronLeft,
  mdiFolder,
  mdiFolderOpenOutline,
  mdiFolderOutline,
  mdiTrashCanOutline,
  mdiWeatherNight,
  mdiWeatherSunny,
} from '@mdi/js';
import { AuthContext } from './AuthContext';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PenguinIcon from './PenguinIcon';

const Sidebar = (props) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { signout, currentUser } = useContext(AuthContext);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const hideSidebar = () => {
    if (windowSize.width < 1024) {
      props.setVisibility(false);
    }
  };

  const handleId = (id) => {
    props.setActiveId(id);
    localStorage.setItem('activeId', id);
  };

  return (
    <div
      className={`bg-primary z-10 col-end-2 row-start-1 flex h-dvh min-w-0 flex-col justify-between transition duration-300 max-sm:col-start-1 max-sm:col-end-3 ${!props.visibility && '-translate-x-full'} sticky top-0`}
    >
      <button
        className={`accent-primary absolute right-4 top-4 z-20 grid shrink-0 place-content-center rounded-full hover:scale-110 ${!props.visibility && 'translate-x-180'}`}
        onClick={props.handleVisibility}
      >
        <Icon
          path={mdiChevronLeft}
          size={1.75}
          className={`text-inherit transition duration-300 ${!props.visibility && 'rotate-180'}`}
        ></Icon>
      </button>
      <PerfectScrollbar
        options={{
          wheelSpeed: 1 / 2,
        }}
        className="overflow-y-auto px-4 py-6"
        style={{ maxHeight: '100%' }}
      >
        <div className="mb-5 flex items-center justify-start gap-4 pl-2">
          <PenguinIcon className="size-14" />
          <h1 className="text-primary place-content-center text-4xl font-semibold">
            File Penguin
          </h1>
        </div>
        <ul>
          <hr className="text-tertiary my-2 border-t" />
          <li>
            <button
              className="list-secondary hover-primary flex items-center gap-4 p-3"
              onClick={handleId}
            >
              <Icon path={mdiFolderOutline} size={1.2} />
              <p>All Files</p>
            </button>
          </li>
          <li>
            <button
              className="list-secondary hover-primary flex items-center gap-4 p-3"
              onClick={handleId}
            >
              <Icon path={mdiTrashCanOutline} size={1.2} />
              <p>Trash</p>
            </button>
          </li>
          <hr className="text-tertiary my-2 border-t" />
          <li>
            <List heading="Account">
              <button
                className="list-secondary hover-primary flex items-center gap-4 p-3"
                onClick={props.changeTheme}
              >
                <p>Change theme</p>
                <Icon
                  path={
                    props.theme === 'dark' ? mdiWeatherSunny : mdiWeatherNight
                  }
                  size={1.2}
                />
              </button>
              <form action="/signin" onSubmit={signout}>
                <button
                  className="list-secondary hover-primary flex-grow p-3"
                  type="submit"
                >
                  Sign out
                </button>
              </form>
            </List>
          </li>
        </ul>
      </PerfectScrollbar>
    </div>
  );
};

export default Sidebar;
