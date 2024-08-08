import { mdiFileDocumentOutline } from '@mdi/js';
import Icon from '@mdi/react';
import MenuOptions from './MenuOptions';
import { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

const FileCard = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState([]);
  const { apiUrl } = useContext(AuthContext);

  const changeFolderName = async (e, folderId, folderTitle) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${apiUrl}/folders/${folderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          folderId: Number(folderId),
          folderTitle: folderTitle,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        props.setFolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === folderId ? { ...folder, title: folderTitle } : folder,
          ),
        );
        props.setSubfolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === folderId ? { ...folder, title: folderTitle } : folder,
          ),
        );
        props.setFilteredSubfolders((prevFolders) =>
          prevFolders.map((folder) =>
            folder.id === folderId ? { ...folder, title: folderTitle } : folder,
          ),
        );
      } else {
        const errorArray = data.map((error) => {
          return error.msg;
        });
        setErrors(errorArray);
        setTimeout(() => {
          setErrors([]);
        }, 5000);
      }
      toggleEditMode();
    } catch (error) {
      console.error(error);
    }
  };

  const toggleEditMode = () => {
    setFileName(props.file.title);
    setEditMode(!editMode);
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        key={props.file.id}
        className="group/item bg-secondary-2 list-primary hover:hover-secondary flex items-center justify-between gap-8"
        onDragStart={(e) => props.onDragStart(e, props.file.id, 'file')}
        draggable
      >
        <div className="flex items-center gap-4">
          <Icon path={mdiFileDocumentOutline} size={1.2} />

          {!editMode ? (
            <p>{props.file.title}</p>
          ) : (
            <form
              className="flex items-center gap-4"
              action="post"
              onSubmit={(e) => {
                changeFolderName(e, props.folder.id, fileName);
              }}
            >
              <input
                className="bg-primary-2 text-primary focus -my-1 w-full rounded p-1"
                name="title"
                type="text"
                placeholder="Folder name"
                value={fileName}
                onChange={(e) => {
                  setFileName(e.target.value);
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
        <MenuOptions />
      </button>
      {errors.length > 0 && (
        <p className="error-fade pointer-events-none translate-y-1 text-nowrap rounded border-transparent p-1 text-sm">
          {`${errors[0]}`}
        </p>
      )}
    </div>
  );
};

export default FileCard;
