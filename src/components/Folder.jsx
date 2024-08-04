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
  const [folderStatuses, setFolderStatuses] = useState([]);
  const { apiUrl } = useContext(AuthContext);

  useEffect(() => {
    const parentFolders = props.folders.filter(
      (folder) => folder.childFolders.length > 0,
    );
    setFolderStatuses(
      parentFolders.map((folder) => ({ id: folder.id, open: false })),
    );
  }, [props.folders]);

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
          props.setFolders((prevFolders) =>
            prevFolders.map((folder) => {
              if (folder.id === folderId) {
                return data.parentFolder;
              } else if (folder.id === childId) {
                return data.childFolder;
              } else {
                return folder;
              }
            }),
          );
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const toggleOpen = (folderId) => {
    setFolderStatuses((prevStatuses) => {
      return prevStatuses.map((folder) =>
        folder.id === folderId ? { ...folder, open: !folder.open } : folder,
      );
    });
  };

  return (
    <details
      className="group/detail [&_summary::-webkit-details-marker]:hidden"
      open={folderStatuses.find((item) => item.id === props.folder.id)?.open}
    >
      <summary
        className="list-primary hover-primary group/folder flex items-center justify-between gap-4"
        onClick={(e) => {
          e.preventDefault();
          props.handleId(props.folder.id);
          toggleOpen(props.folder.id);
        }}
        onDragStart={(e) => onDragStart(e, props.folder.id)}
        onDrop={(e) => onDrop(e, props.folder.id)}
        onDragOver={allowDrop}
        draggable
      >
        <div className="flex items-center gap-4">
          <Icon
            path={
              props.activeId === props.folder.id
                ? mdiFolderOpenOutline
                : mdiFolderOutline
            }
            size={1.2}
          />
          <p>{props.folder.title}</p>
        </div>
        <div className="flex items-center gap-4">
          <ActionBtn
            className="group-hover/folder:text-primary"
            icon={mdiNoteEditOutline}
            onClick={(e) => {
              e.stopPropagation();
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
              className={`shrink-0 transition duration-300 ${folderStatuses.find((item) => item.id === props.folder.id)?.open && '-rotate-180'}`}
            >
              <Icon
                path={mdiChevronDown}
                size={1.1}
                className={`text-secondary`}
              ></Icon>
            </span>
          )}
        </div>
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
