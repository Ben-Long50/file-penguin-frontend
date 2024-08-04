import List from './List';
import { useContext, useEffect, useRef, useState } from 'react';
import Icon from '@mdi/react';
import {
  mdiChevronLeft,
  mdiFolderOpenOutline,
  mdiFolderOutline,
  mdiPlus,
  mdiTrashCanOutline,
  mdiWeatherNight,
  mdiWeatherSunny,
} from '@mdi/js';
import { AuthContext } from './AuthContext';
import 'react-perfect-scrollbar/dist/css/styles.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PenguinIcon from './PenguinIcon';
import Button from './Button';
import Folder from './Folder';
import Loading from './Loading';

const Sidebar = (props) => {
  const [createMode, setCreateMode] = useState(false);
  const [input, setInput] = useState('');
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const { apiUrl, signout, currentUser } = useContext(AuthContext);

  const folderInputRef = useRef(null);

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

  const createFolder = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${apiUrl}/folders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: input }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        props.setFolders((prevFolders) => [...prevFolders, data]);
        setInput('');
        folderInputRef.current.value = '';
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const toggleCreateMode = () => {
    setCreateMode((prevCreateMode) => !prevCreateMode);
  };

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
          <Button
            className="my-3 flex items-center gap-2"
            onClick={toggleCreateMode}
          >
            <Icon path={mdiPlus} size={1.2} />
            <h2 className="pr-1 text-lg font-semibold">Add Folder</h2>
          </Button>
          {createMode && (
            <form className="flex flex-col gap-4 p-2">
              <input
                ref={folderInputRef}
                className="bg-primary-2 text-primary focus w-full rounded p-1 text-lg"
                placeholder="New folder name"
                onChange={handleInput}
              ></input>
              <div className="flex items-center justify-between">
                <Button
                  type="submit"
                  onClick={() => {
                    toggleCreateMode();
                    createFolder();
                  }}
                >
                  Create
                </Button>
                <Button onClick={toggleCreateMode}>Cancel</Button>
              </div>
            </form>
          )}
          <li>
            <button
              className="list-primary hover-primary flex items-center gap-4"
              onClick={() => handleId(1)}
            >
              <Icon
                path={
                  props.activeId === 1 ? mdiFolderOpenOutline : mdiFolderOutline
                }
                size={1.2}
              />
              <p>All Files</p>
            </button>
          </li>
          {props.folders.map((folder) => {
            if (
              folder.title !== 'All files' &&
              folder.title !== 'Trash' &&
              !folder.parentFolderId
            ) {
              return (
                <Folder
                  key={folder.id}
                  folders={props.folders}
                  setFolders={props.setFolders}
                  folder={folder}
                  activeId={props.activeId}
                  handleId={handleId}
                />
              );
            }
          })}
          <li>
            <button
              className="list-primary hover-primary flex items-center gap-4"
              onClick={() => handleId(0)}
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
        <p>{currentUser.username}</p>
      </PerfectScrollbar>
    </div>
  );
};

export default Sidebar;
