import {
  mdiFolderOpenOutline,
  mdiFolderOutline,
  mdiTrashCanOutline,
  mdiChevronDown,
  mdiNoteEditOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import ActionBtn from './ActionBtn';
import Label from './Label';
import { AuthContext } from './AuthContext';
import { useContext, useEffect, useState } from 'react';

const Folder = (props) => {
  const [openStatus, setOpenStatus] = useState(() => {
    if (localStorage.getItem(`folder-${props.folder.id}`)) {
      return JSON.parse(localStorage.getItem(`folder-${props.folder.id}`));
    } else {
      return false;
    }
  });
  const [errors, setErrors] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [folderName, setFolderName] = useState(props.folder.title);
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

  const deleteFolder = async (folderId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${apiUrl}/folders/${folderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ folderId: Number(folderId) }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        props.setFolders((prevFolders) =>
          prevFolders.filter((folder) => folder.id !== folderId),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDragStart = (e, folderId) => {
    e.dataTransfer.setData('id', folderId);
  };

  const onDrop = async (e, folderId) => {
    const childId = Number(e.dataTransfer.getData('id'));
    if (childId !== folderId) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${apiUrl}/folders/${folderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ folderId, childId }),
        });
        const data = await response.json();

        if (response.ok) {
          console.log(data);
          props.setFolders((prevFolders) =>
            prevFolders.map((folder) => {
              if (folder.id === folderId) {
                return data.parentFolder;
              } else if (folder.id === childId) {
                return data.childFolder;
              } else if (folder.id === data.oldParentFolder?.id) {
                return data.oldParentFolder;
              } else {
                return folder;
              }
            }),
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
      } catch (error) {
        console.error(error);
      }
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
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
        className="list-primary hover-primary group/folder"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          props.handleId(props.folder.id);
          toggleOpen();
        }}
        onDragStart={(e) => onDragStart(e, props.folder.id)}
        onDrop={(e) => onDrop(e, props.folder.id)}
        onDragOver={allowDrop}
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
              size={1.2}
            />
            {!editMode ? (
              <p>{props.folder.title}</p>
            ) : (
              <form
                action="post"
                onSubmit={(e) => {
                  changeFolderName(e, props.folder.id, folderName);
                }}
              >
                <input
                  className="bg-primary-2 text-primary focus -my-1 box-border w-full rounded p-1"
                  name="title"
                  type="text"
                  placeholder="Folder name"
                  value={folderName}
                  onChange={(e) => {
                    setFolderName(e.target.value);
                  }}
                />
              </form>
            )}
          </div>

          <div className="flex items-center gap-4">
            <ActionBtn
              className="group-hover/folder:text-primary"
              icon={mdiNoteEditOutline}
              onClick={(e) => {
                e.stopPropagation();
                toggleEditMode();
              }}
            >
              <Label className="-translate-x-full" label="Edit folder name" />
            </ActionBtn>
            <ActionBtn
              className="group-hover/folder:text-primary"
              icon={mdiTrashCanOutline}
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(props.folder.id);
              }}
            >
              <Label className="-translate-x-full" label="Move to trash" />
            </ActionBtn>
            {props.folder.childFolders.length > 0 && (
              <span
                className={`shrink-0 transition duration-300 ${openStatus && '-rotate-180'}`}
              >
                <Icon
                  path={mdiChevronDown}
                  size={1.1}
                  className={`text-secondary`}
                ></Icon>
              </span>
            )}
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
                setFolders={props.setFolders}
                folder={childFolder}
                activeId={props.activeId}
                handleId={props.handleId}
              />
            );
          })}
        </ul>
      )}
    </details>
  );
};

export default Folder;
