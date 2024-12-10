import { mdiFileDocumentOutline } from '@mdi/js';
import Icon from '@mdi/react';
import MenuOptions from './MenuOptions';
import { useState, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { format } from 'date-fns';
import { DragDropContext } from './DragDropContext';
import useEditFileMutation from '../hooks/useEditFileMutation/useEditFileMutation';

const FileCard = (props) => {
  const [editMode, setEditMode] = useState(false);
  const [fileName, setFileName] = useState('');
  const [errors, setErrors] = useState([]);
  const [displayMode, setDisplayMode] = useState(false);
  const { apiUrl } = useContext(AuthContext);
  const { onDragStart } = useContext(DragDropContext);

  const editFile = useEditFileMutation(apiUrl, setErrors);

  const handleEditFile = (e, fileId, fileTitle) => {
    e.preventDefault();
    editFile.mutate({ fileId, fileTitle });
    toggleEditMode();
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
    <div className="bg-secondary-2 list-primary md:hover:hover-secondary flex flex-col">
      <button
        key={props.file.id}
        className="group/item flex items-center justify-between gap-8"
        onDragStart={(e) => onDragStart(e, props.file.id, 'file')}
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
                handleEditFile(e, props.file.id, fileName);
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
          setFilteredFiles={props.setFilteredFiles}
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
            className="md:max-h-50dvh mb-3 max-w-full rounded"
            src={props.file.url}
            width="100%"
            height="500"
          />
        ) : (
          <img
            className="md:max-h-50dvh mx-auto mb-3 max-w-full rounded"
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
