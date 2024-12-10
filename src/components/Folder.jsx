import {
  mdiFolderOpenOutline,
  mdiFolderOutline,
  mdiChevronDown,
} from '@mdi/js';
import Icon from '@mdi/react';
import { AuthContext } from './AuthContext';
import { useContext, useEffect, useState } from 'react';
import MenuOptions from './MenuOptions';
import { DragDropContext } from './DragDropContext';
import useEditFolderMutation from '../hooks/useEditFolderMutation/useEditFolderMutation';

const Folder = (props) => {
  const [openStatus, setOpenStatus] = useState(() => {
    if (localStorage.getItem(`folder-${props.folder.id}`)) {
      return JSON.parse(localStorage.getItem(`folder-${props.folder.id}`));
    } else {
      return false;
    }
  });
  const [editMode, setEditMode] = useState(false);
  const [folderName, setFolderName] = useState(props.folder.title);
  const [errors, setErrors] = useState([]);
  const { apiUrl } = useContext(AuthContext);
  const { onDragStart, allowDrop, handleDrop } = useContext(DragDropContext);

  const editFolder = useEditFolderMutation(apiUrl, setErrors);

  useEffect(() => {
    setFolderName(props.folder.title);
  }, [props.folders]);

  const handleEditFolder = async (e, folderId, folderTitle) => {
    e.preventDefault();
    editFolder.mutate({ folderId, folderTitle });
    toggleEditMode();
  };

  const toggleOpen = () => {
    setOpenStatus((prevOpen) => !prevOpen);
    localStorage.setItem(
      `folder-${props.folder.id}`,
      JSON.stringify(!openStatus),
    );
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <details
      className="group/detail [&_summary::-webkit-details-marker]:hidden"
      open={openStatus}
      onClick={(e) => e.preventDefault()}
    >
      <summary
        className="list-primary md:hover-primary group/folder"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          props.handleId(props.folder.id);
        }}
        onDragStart={(e) => onDragStart(e, props.folder.id, 'folder')}
        onDrop={(e) => handleDrop(e, props.folder.id, setErrors)}
        onDragOver={(e) => allowDrop(e)}
        draggable
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Icon
              className="shrink-0"
              path={
                props.activeId === props.folder.id
                  ? mdiFolderOpenOutline
                  : mdiFolderOutline
              }
              size={1.4}
            />
            {!editMode ? (
              <p>{props.folder.title}</p>
            ) : (
              <form
                action="post"
                onSubmit={(e) => {
                  handleEditFolder(e, props.folder.id, folderName);
                }}
              >
                <input
                  className="bg-primary-2 text-primary focus -my-1 box-border w-full rounded p-1"
                  name="title"
                  type="text"
                  placeholder="Folder name"
                  value={folderName}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    setFolderName(e.target.value);
                  }}
                />
              </form>
            )}
          </div>

          <div className="flex items-center gap-4">
            {props.folder.childFolders.length > 0 && (
              <span
                className={`-m-2 shrink-0 p-2 transition duration-300 ${openStatus && '-rotate-180'}`}
                onClick={toggleOpen}
              >
                <Icon
                  path={mdiChevronDown}
                  size={1.1}
                  className={`text-secondary`}
                ></Icon>
              </span>
            )}
            <MenuOptions
              type="folder"
              toggleEditMode={toggleEditMode}
              parentFolder={props.folder.parentFolderId}
              targetId={props.folder.id}
              trashId={props.trashId}
            />
          </div>
        </div>
        {errors.length > 0 && (
          <p className="error-fade pointer-events-none translate-y-1 text-nowrap rounded border-transparent p-1 text-sm">
            {`${errors[0]}`}
          </p>
        )}
      </summary>
      {props.folder.childFolders.length > 0 && (
        <ul className="flex flex-col space-y-1 pl-6">
          {props.folder.childFolders.map((folder, index) => {
            const childFolder = props.folders.find(
              (item) => item.id === folder.id,
            );
            return (
              <Folder
                key={index}
                folders={props.folders}
                folder={childFolder}
                trashId={props.trashId}
                activeId={props.activeId}
                handleId={props.handleId}
                onDragStart={onDragStart}
                allowDrop={allowDrop}
                handleDrop={handleDrop}
                errors={errors}
                setErrors={setErrors}
              />
            );
          })}
        </ul>
      )}
    </details>
  );
};

export default Folder;
