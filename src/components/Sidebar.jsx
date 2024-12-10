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
import useCreateFolderMutation from '../hooks/useCreateFolderMutation/useCreateFolderMutation';
import { DragDropContext } from './DragDropContext';
import { ThemeContext } from './ThemeContext';

const Sidebar = (props) => {
  const [createMode, setCreateMode] = useState(false);
  const [input, setInput] = useState('');
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [errors, setErrors] = useState([]);
  const { apiUrl, signout } = useContext(AuthContext);
  const { theme, changeTheme } = useContext(ThemeContext);
  const { allowDrop, handleDrop } = useContext(DragDropContext);

  const toggleCreateMode = () => {
    setCreateMode((prevCreateMode) => !prevCreateMode);
  };

  const createFolder = useCreateFolderMutation(
    apiUrl,
    setErrors,
    setInput,
    toggleCreateMode,
  );

  const handleResize = () => {
    const newSize = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    setWindowSize(newSize);
    hideSidebar(newSize);
  };

  const hideSidebar = (size) => {
    if (size.width < 1024) {
      props.setVisibility(false);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleCreateFolder = () => {
    let parentFolderId;
    if (Number(props.activeId) === props.allId) {
      parentFolderId = null;
    } else {
      parentFolderId = Number(props.activeId);
    }
    createFolder.mutate(input, parentFolderId);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleId = (id) => {
    props.setActiveId(id);
    localStorage.setItem('activeId', id);
  };

  return (
    <div
      className={`bg-primary z-10 col-end-2 row-start-1 row-end-2 flex h-dvh min-w-0 flex-col justify-between transition duration-300 max-sm:col-start-1 max-sm:col-end-3 ${!props.visibility && '-translate-x-full'} sticky top-0`}
    >
      <button
        className={`shadow-custom accent-primary absolute right-4 top-4 z-20 grid shrink-0 place-content-center rounded-full md:hover:scale-110 ${!props.visibility && 'translate-x-180'}`}
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
            className="my-3 flex items-center gap-2 p-2"
            onClick={toggleCreateMode}
          >
            <Icon path={mdiPlus} size={1.2} />
            <h2 className="pr-1 text-lg font-semibold">Add Folder</h2>
          </Button>
          {createMode && (
            <form
              className="flex flex-col gap-4 py-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateFolder();
              }}
            >
              <input
                className="bg-primary-2 text-primary focus w-full rounded p-2 text-lg"
                placeholder="New folder name"
                onChange={handleInput}
                value={input}
              />
              {errors.length > 0 && (
                <p className="error-fade pointer-events-none text-nowrap rounded border-transparent text-sm">
                  {`${errors[0]}`}
                </p>
              )}
              <div className="flex items-center justify-between">
                <Button className="px-3 py-2 font-semibold" type="submit">
                  Create
                </Button>
                <Button
                  className="px-3 py-2 font-semibold"
                  onClick={toggleCreateMode}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
          <li>
            <button
              className="list-primary md:hover-primary flex items-center gap-4"
              onClick={() => handleId(props.allId)}
            >
              <Icon
                path={
                  props.activeId === props.allId
                    ? mdiFolderOpenOutline
                    : mdiFolderOutline
                }
                size={1.4}
              />
              <p>All Files</p>
            </button>
          </li>
          {props.folders?.map((folder) => {
            if (
              folder.title !== 'All files' &&
              folder.title !== 'Trash' &&
              !folder.parentFolderId
            ) {
              return (
                <Folder
                  key={folder.id}
                  folders={props.folders}
                  folder={folder}
                  activeId={props.activeId}
                  handleId={handleId}
                  trashId={props.trashId}
                />
              );
            }
          })}
          <li>
            <button
              className="list-primary md:hover-primary flex items-center gap-4"
              onClick={() => handleId(props.trashId)}
              onDrop={(e) => handleDrop(e, props.trashId)}
              onDragOver={allowDrop}
            >
              <Icon path={mdiTrashCanOutline} size={1.4} />
              <p>Trash</p>
            </button>
          </li>
          <hr className="text-tertiary my-2 border-t" />
          <li>
            <List heading="Account">
              <button
                className="list-secondary hover-primary flex items-center gap-4 p-2"
                onClick={changeTheme}
              >
                <p>Change theme</p>
                <Icon
                  className="-my-1"
                  path={theme === 'light' ? mdiWeatherSunny : mdiWeatherNight}
                  size={1.2}
                />
              </button>
              <form action="/signin" onSubmit={signout}>
                <button
                  className="list-secondary hover-primary flex-grow p-2"
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
