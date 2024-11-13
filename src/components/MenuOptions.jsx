import {
  mdiNoteEditOutline,
  mdiTrashCanOutline,
  mdiDotsHorizontal,
  mdiDeleteRestore,
  mdiDownload,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useState, useRef, useEffect } from 'react';
import ActionBtn from './ActionBtn';

const MenuOptions = (props) => {
  const [menuVisibility, setMenuVisibility] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuVisibility(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenuVisibility = () => {
    setMenuVisibility(!menuVisibility);
  };

  const handleTrash = (e, id, targetId) => {
    if (props.type === 'folder') {
      props.moveIntoFolder(e, id, targetId);
    } else if (props.type === 'file') {
      props.moveFileIntoFolder(e, id, targetId);
    }
  };

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(
        'There has been a problem with your fetch operation:',
        error,
      );
    }
  };

  return (
    <ActionBtn
      className="text-primary relative -m-1 bg-transparent p-1"
      icon={mdiDotsHorizontal}
      onClick={(e) => {
        e.stopPropagation();
        toggleMenuVisibility();
      }}
    >
      <div
        ref={menuRef}
        className={`${props.className} ${menuVisibility ? 'visible opacity-100' : 'invisible translate-x-4 opacity-0'} timing bg-secondary shadow-custom absolute right-full top-0 flex flex-col rounded duration-300`}
      >
        {props.parentFolder !== props.trashId ? (
          <>
            {props.type === 'file' && (
              <div
                className="hover:bg-secondary-2 flex items-center gap-4 whitespace-nowrap rounded-t p-2"
                onClick={() => downloadFile(props.file.url, props.file.title)}
              >
                <Icon path={mdiDownload} size={1.2} />
                <p>Download file</p>
              </div>
            )}
            <div
              className="hover:bg-secondary-2 flex items-center gap-4 whitespace-nowrap rounded-t p-2"
              onClick={props.toggleEditMode}
            >
              <Icon path={mdiNoteEditOutline} size={1.2} />
              <p>Edit Name</p>
            </div>
            <div
              className="hover:bg-secondary-2 flex items-center gap-4 whitespace-nowrap rounded-b p-2"
              onClick={(e) => {
                e.stopPropagation();
                handleTrash(e, props.trashId, props.targetId);
              }}
            >
              <Icon path={mdiTrashCanOutline} size={1.2} />
              <p>Move to trash</p>
            </div>
          </>
        ) : (
          <div
            className="hover:bg-secondary-2 flex items-center gap-4 whitespace-nowrap rounded-b p-2"
            onClick={(e) => {
              e.stopPropagation();
              handleTrash(e, null, props.targetId);
            }}
          >
            <Icon path={mdiDeleteRestore} size={1.2} />
            <p>Restore from trash</p>
          </div>
        )}
      </div>
    </ActionBtn>
  );
};

export default MenuOptions;
