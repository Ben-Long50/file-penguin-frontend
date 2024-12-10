import {
  mdiFolderOpenOutline,
  mdiFileDocumentOutline,
  mdiClose,
  mdiArrowUpLeft,
  mdiTrashCanOutline,
  mdiUpload,
  mdiCircle,
  mdiCircleOutline,
} from '@mdi/js';
import Icon from '@mdi/react';
import Button from './Button';
import ActionBtn from './ActionBtn';
import Label from './Label';
import Loading from './Loading';
import {
  useContext,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from 'react';
import { AuthContext } from './AuthContext';
import { useOutletContext } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import FolderCard from './FolderCard';
import FileCard from './FileCard';
import SadPenguinIcon from './SadPenguinIcon';
import useFolderContentQuery from '../hooks/useFolderContentQuery/useFolderContentQuery';
import useUploadFilesMutation from '../hooks/useUploadFilesMutation/useUploadFilesMutation';
import useDeleteTrashMutation from '../hooks/useDeleteTrashMutation/useDeleteTrashMutation';

const Explorer = () => {
  const { activeId, allId, trashId, setActiveId, visibility, folders } =
    useOutletContext();
  const [title, setTitle] = useState('');
  const [filteredSubfolders, setFilteredSubfolders] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [errors, setErrors] = useState([]);
  const { apiUrl } = useContext(AuthContext);

  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dialogRef = useRef(null);

  const folderContents = useFolderContentQuery(allId, activeId, apiUrl);
  const uploadFiles = useUploadFilesMutation(
    activeId,
    apiUrl,
    setErrors,
    setFilesToUpload,
  );

  const openModal = () => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  };

  const closeModal = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const deleteTrash = useDeleteTrashMutation(trashId, apiUrl, closeModal);

  useEffect(() => {
    if (!folderContents.isLoading) {
      console.log(folderContents.data);

      if (Number(activeId) === allId) {
        setFilteredSubfolders([]);
        setFilteredFiles(folderContents.data.files);
        setTitle('All Files');
      } else {
        setFilteredSubfolders(folderContents.data.childFolders);
        setFilteredFiles(folderContents.data.files);
        setTitle(folderContents.data.title);
      }
    }
  }, [folderContents.data, activeId]);

  const updateWidth = () => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  };

  useLayoutEffect(() => {
    updateWidth();

    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  const handleFilesUpload = () => {
    const formData = new FormData();

    filesToUpload.map((file) => {
      formData.append('file', file);
    });

    uploadFiles.mutate(formData);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    setFilesToUpload(Array.from(files));
  };

  const handleId = (id) => {
    setActiveId(id);
    localStorage.setItem('activeId', id);
  };

  const removeFile = (fileName) => {
    const updatedFiles = filesToUpload.filter((file) => file.name !== fileName);
    setFilesToUpload(updatedFiles);
  };

  const handleChange = () => {
    if (inputRef.current.value === '') {
      setFilteredSubfolders(folderContents.data?.childFolders);
      setFilteredFiles(folderContents.data?.files);
    } else {
      const filteredSubfolders = folderContents.data.childFolders?.filter(
        (subfolder) => {
          return subfolder.title
            .toLowerCase()
            .includes(inputRef.current.value.toLowerCase());
        },
      );
      const filteredFiles = folderContents.data.files?.filter((files) => {
        return files.title
          .toLowerCase()
          .includes(inputRef.current.value.toLowerCase());
      });
      setFilteredSubfolders(filteredSubfolders);
      setFilteredFiles(filteredFiles);
    }
  };

  if (folderContents.isLoading || folderContents.isPending) {
    return <Loading />;
  }

  return (
    <PerfectScrollbar
      className={`col-start-1 row-start-1 h-dvh w-full min-w-0 overflow-y-auto max-lg:col-start-1 max-lg:col-end-3 ${visibility ? 'col-start-2 col-end-3' : 'col-start-1 col-end-3'}`}
    >
      <div
        ref={containerRef}
        className="mx-auto flex max-w-6xl flex-col gap-2 p-4 lg:p-8 2xl:p-12"
      >
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <Icon
            className="text-primary shrink-0"
            path={mdiFolderOpenOutline}
            size={'clamp(3rem, 7vw, 6rem)'}
          />

          <h1 className="text-primary text-3xl font-semibold sm:text-4xl md:text-5xl lg:text-6xl">
            {title}
          </h1>
        </div>
        <div className="flex items-center justify-between gap-4 lg:gap-8">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {Number(activeId) !== trashId && (
            <Button
              className="my-3 flex shrink-0 items-center gap-2 p-1 sm:p-2"
              onClick={handleButtonClick}
            >
              {uploadFiles.isPending ? (
                <Loading className="text-gray-950" size={1.2} />
              ) : (
                <>
                  <Icon path={mdiUpload} size={1.2} />
                  {containerWidth > 640 && (
                    <h2 className="pr-1 text-lg font-semibold">Upload files</h2>
                  )}
                </>
              )}
            </Button>
          )}

          <input
            ref={inputRef}
            className="bg-primary-2 text-primary focus w-full rounded p-2 text-lg"
            placeholder="Search in folder"
            onChange={handleChange}
          />
          {Number(activeId) !== trashId ? (
            <Button
              className="p-1 sm:p-2"
              onClick={() => {
                if (folderContents.data.parentFolderId) {
                  setActiveId(folderContents.data.parentFolderId);
                }
              }}
            >
              {folderContents.data.parentFolderId ? (
                <Icon path={mdiArrowUpLeft} size={1.2} />
              ) : (
                <Icon path={mdiCircleOutline} size={1.2} />
              )}
            </Button>
          ) : (
            <>
              <Button className="p-1 sm:p-2" onClick={openModal}>
                <Icon path={mdiTrashCanOutline} size={1.2} />
              </Button>
              <dialog
                className="text-primary bg-primary shadow-custom max-w-xl rounded p-4 text-center text-xl leading-9 lg:text-2xl"
                ref={dialogRef}
              >
                Are you sure you want to permemantly delete the trash folder
                contents?
                <div className="mt-4 flex items-center justify-between">
                  <Button
                    className="px-3 py-2 text-lg font-semibold lg:text-xl"
                    onClick={() => {
                      deleteTrash.mutate();
                    }}
                  >
                    Confirm
                  </Button>
                  <SadPenguinIcon className="text-primary -my-4 size-28" />
                  <Button
                    className="px-3 py-2 text-lg font-semibold lg:text-xl"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                </div>
              </dialog>
            </>
          )}
        </div>
        {filesToUpload.length > 0 && (
          <div className="group/upload text-primary bg-secondary-2 mb-4 flex flex-col gap-2 rounded p-3">
            <h3 className="mb-2 text-lg">Files for upload:</h3>
            {errors.length > 0 && (
              <div className="-mt-2 flex flex-col gap-1">
                {errors.map((error, index) => {
                  return (
                    <p
                      key={index}
                      className="error-fade pointer-events-none text-nowrap border-transparent text-sm"
                    >
                      {error}
                    </p>
                  );
                })}
              </div>
            )}
            {filesToUpload.map((file, index) => {
              return (
                <div
                  className="flex items-center justify-between gap-4"
                  key={index}
                >
                  <div className="flex items-center gap-4">
                    <Icon path={mdiFileDocumentOutline} size={1.2} />
                    <p>{file.name}</p>
                  </div>
                  <ActionBtn
                    className="group-hover/upload:text-primary"
                    icon={mdiClose}
                    onClick={() => removeFile(file.name)}
                  >
                    <Label className="-translate-x-full" label="Remove file" />
                  </ActionBtn>
                </div>
              );
            })}
            <div className="mt-2 flex items-center justify-between">
              <Button
                className="px-3 py-2 font-semibold"
                type="submit"
                onClick={handleFilesUpload}
              >
                Upload
              </Button>
              <Button
                className="px-3 py-2 font-semibold"
                onClick={() => setFilesToUpload([])}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
        {Number(activeId) !== allId &&
          (filteredSubfolders?.length > 0 ? (
            <h3 className="text-secondary mt-4 text-lg font-semibold">
              Subfolders
            </h3>
          ) : (
            <h3 className="text-secondary mt-4 text-lg font-semibold">
              No subfolders
            </h3>
          ))}
        {filteredSubfolders?.map((folder) => {
          return (
            <FolderCard
              key={folder.id}
              folder={folder}
              handleId={handleId}
              trashId={trashId}
            />
          );
        })}
        {Number(activeId) !== allId &&
          (filteredFiles?.length > 0 ? (
            <h3 className="text-secondary mt-4 text-lg font-semibold">Files</h3>
          ) : (
            <h3 className="text-secondary mt-4 text-lg font-semibold">
              No files
            </h3>
          ))}
        {filteredFiles?.map((file) => {
          return <FileCard key={file.id} file={file} trashId={trashId} />;
        })}
      </div>
    </PerfectScrollbar>
  );
};

export default Explorer;
