import {
  mdiNoteEditOutline,
  mdiTrashCanOutline,
  mdiDotsHorizontal,
} from '@mdi/js';
import Icon from '@mdi/react';
import { useState, useRef, useEffect } from 'react';
import ActionBtn from './ActionBtn';

const MenuOptions = (props) => {
  const [menuVisibility, setMenuVisibility] = useState(false);
  const menuRef = useRef(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisibility(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <ActionBtn
      className="text-primary -m-1 bg-transparent p-1"
      icon={mdiDotsHorizontal}
      onClick={(e) => {
        e.stopPropagation();
        setMenuVisibility((prevVisibility) => !prevVisibility);
      }}
    >
      <div
        ref={menuRef}
        className={`${props.className} ${menuVisibility ? 'absolute' : 'hidden'} bg-secondary shadow-custom flex -translate-x-full translate-y-4 flex-col rounded duration-300`}
      >
        <div
          className="hover:bg-secondary-2 flex items-center gap-4 whitespace-nowrap rounded-t p-2"
          onClick={props.toggleEditMode}
        >
          <Icon path={mdiNoteEditOutline} size={1.2} />
          <p>Edit Name</p>
        </div>
        <div className="hover:bg-secondary-2 flex items-center gap-4 whitespace-nowrap rounded-b p-2">
          <Icon path={mdiTrashCanOutline} size={1.2} />
          <p>Move to trash</p>
        </div>
      </div>
    </ActionBtn>
  );
};

export default MenuOptions;
