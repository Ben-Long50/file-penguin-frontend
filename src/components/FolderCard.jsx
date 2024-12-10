import { mdiFolderOutline } from '@mdi/js';
import Icon from '@mdi/react';
import MenuOptions from './MenuOptions';
import { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { DragDropContext } from './DragDropContext';
import useEditFolderMutation from '../hooks/useEditFolderMutation/useEditFolderMutation';

const FolderCard = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [errors, setErrors] = useState([]);
  const { apiUrl } = useContext(AuthContext);
  const { onDragStart, allowDrop, handleDrop } = useContext(DragDropContext);

  const editFolder = useEditFolderMutation(apiUrl, setErrors);

  const handleEditFolder = async (e, folderId, folderTitle) => {
    e.preventDefault();
    editFolder.mutate({ folderId, folderTitle });
    toggleEditMode();
  };

  const toggleEditMode = () => {
    setFolderName(props.folder.title);
    setEditMode(!editMode);
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        key={props.folder.id}
        className="group/item bg-secondary-2 list-primary md:hover:hover-secondary flex w-full items-center justify-between gap-8"
        onClick={() => props.handleId(props.folder.id)}
        onDragStart={(e) => onDragStart(e, props.folder.id, 'folder')}
        onDrop={(e) => handleDrop(e, props.folder.id, setErrors)}
        onDragOver={(e) => allowDrop(e)}
        draggable
      >
        <div className="flex items-center gap-4">
          <Icon className="shrink-0" path={mdiFolderOutline} size={1.2} />
          {!editMode ? (
            <p>{props.folder.title}</p>
          ) : (
            <form
              className="flex items-center gap-4"
              action="post"
              onSubmit={(e) => {
                handleEditFolder(e, props.folder.id, folderName);
              }}
            >
              <input
                className="bg-primary-2 text-primary focus -my-1 w-full rounded p-1"
                name="title"
                type="text"
                placeholder="Folder name"
                value={folderName}
                onChange={(e) => {
                  setFolderName(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className="hidden"
                type="submit"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              ></button>
              <button
                className="text-tertiary text-sm hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleEditMode();
                }}
              >
                Cancel
              </button>
            </form>
          )}
        </div>
        <MenuOptions
          type="folder"
          toggleEditMode={toggleEditMode}
          moveIntoFolder={props.moveIntoFolder}
          setFilteredSubfolders={props.setFilteredSubfolders}
          parentFolder={props.folder.parentFolderId}
          targetId={props.folder.id}
          trashId={props.trashId}
        />
      </button>
      {errors.length > 0 && (
        <p className="error-fade pointer-events-none translate-y-1 text-nowrap rounded border-transparent p-1 text-sm">
          {`${errors[0]}`}
        </p>
      )}
    </div>
  );
};

export default FolderCard;
