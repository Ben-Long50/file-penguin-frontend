import { mdiFileDocumentOutline } from '@mdi/js';
import Icon from '@mdi/react';
import MenuOptions from './MenuOptions';
import { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { format } from 'date-fns';

const FileCard = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState([]);
  const [displayMode, setDisplayMode] = useState(false);
  const { apiUrl } = useContext(AuthContext);

  const changeFileName = async (e, fileId, fileTitle) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${apiUrl}/files/${fileId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileId: Number(fileId),
          fileTitle: fileTitle,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        props.setFiles((prevFiles) =>
          prevFiles.map((file) => (file.id === data.id ? data : file)),
        );
        props.setFilteredFiles((prevFiles) =>
          prevFiles.map((file) => (file.id === data.id ? data : file)),
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

  const toggleDisplayMode = () => {
    setDisplayMode((prevDisplayMode) => !prevDisplayMode);
  };

  const imageFileTypes = [
    'jpeg',
    'jpg',
    'png',
    'gif',
    'webp',
    'svg+xml',
    'svg',
    'bmp',
    'tiff',
  ];

  return (
    <div className="bg-secondary-2 list-primary hover:hover-secondary flex flex-col">
      <button
        key={props.file.id}
        className="group/item flex items-center justify-between gap-8"
        onDragStart={(e) => props.onDragStart(e, props.file.id, 'file')}
        draggable
        onClick={toggleDisplayMode}
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
                changeFileName(e, props.file.id, fileName);
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
        <MenuOptions
          type="file"
          toggleEditMode={toggleEditMode}
          targetId={props.file.id}
          file={props.file}
          moveFileIntoFolder={props.moveFileIntoFolder}
          parentFolder={props.file.folderId}
          trashId={props.trashId}
        />
      </button>
      {errors.length > 0 && (
        <p className="error-fade pointer-events-none translate-y-1 text-nowrap rounded border-transparent p-1 text-sm">
          {`${errors[0]}`}
        </p>
      )}
      <details
        className={`${displayMode && 'mt-3'} [&_summary::-webkit-details-marker]:hidden`}
        open={displayMode}
        onClick={(e) => e.preventDefault()}
      >
        <summary className="list-none"></summary>
        {!imageFileTypes.includes(props.file.ext) ? (
          <iframe
            className="mb-3 max-w-full rounded"
            src={props.file.url}
            width="100%"
            height="500"
          />
        ) : (
          <img
            className="mb-3 max-w-full rounded"
            src={props.file.url}
            alt={`${props.file.title} preview`}
          />
        )}
        <p className="text-tertiary text-sm">{`Uploaded at ${format(props.file.uploadedAt, 'pp')} on ${format(props.file.uploadedAt, 'PP')}`}</p>
      </details>
    </div>
  );
};

export default FileCard;
