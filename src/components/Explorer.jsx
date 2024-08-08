import {
  mdiPlus,
  mdiFolderOpenOutline,
  mdiFileDocumentOutline,
  mdiClose,
  mdiArrowUpLeft,
  mdiTrashCanOutline,
  mdiUpload,
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

const Explorer = () => {
  const [loading, setLoading] = useState(false);
  const {
    activeId,
    allId,
    trashId,
    setActiveId,
    visibility,
    folders,
    setFolders,
    allowDrop,
    onDragStart,
    moveIntoFolder,
    moveFileIntoFolder,
  } = useOutletContext();
  const [title, setTitle] = useState('');
  const [subfolders, setSubfolders] = useState([]);
  const [filteredSubfolders, setFilteredSubfolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const [errors, setErrors] = useState([]);
  const { apiUrl } = useContext(AuthContext);

  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dialogRef = useRef(null);

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

  useEffect(() => {
    setLoading(true);
    const fetchFolderContents = async () => {
      const token = localStorage.getItem('token');
      try {
        const response =
          Number(activeId) === allId
            ? await fetch(`${apiUrl}/files`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              })
            : await fetch(`${apiUrl}/folders/${activeId}`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
              });

        const data = await response.json();
        if (response.ok) {
          if (Number(activeId) === allId) {
            setSubfolders([]);
            setFilteredSubfolders([]);
            setFiles(data);
            setFilteredFiles(data);
            setTitle('All Files');
          } else {
            setSubfolders(data.childFolders);
            setFilteredSubfolders(data.childFolders);
            setFiles(data.files);
            setFilteredFiles(data.files);
            setTitle(data.title);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFolderContents();
  }, [activeId, folders]);

  const uploadFiles = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();

    filesToUpload.map((file) => {
      formData.append('file', file);
    });

    try {
      const response = await fetch(`${apiUrl}/folders/${activeId}/files`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setFiles((prevFiles) => [...prevFiles, ...data]);
        setFilteredFiles((prevFiles) => [...prevFiles, ...data]);
        console.log(data);
        setFilesToUpload([]);
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
    } finally {
      setLoading(false);
    }
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
      setFilteredSubfolders(subfolders);
      setFilteredFiles(files);
    } else {
      const filteredSubfolders = subfolders.filter((subfolder) => {
        return subfolder.title
          .toLowerCase()
          .includes(inputRef.current.value.toLowerCase());
      });
      const filteredFiles = files.filter((files) => {
        return files.title
          .toLowerCase()
          .includes(inputRef.current.value.toLowerCase());
      });
      setFilteredSubfolders(filteredSubfolders);
      setFilteredFiles(filteredFiles);
    }
  };

  const deleteTrashContents = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${apiUrl}/folders/${trashId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ folderId: Number(trashId) }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setFolders((prevFolders) =>
          prevFolders.map((folder) => {
            if (folder.id === trashId) {
              return data;
            } else {
              return folder;
            }
          }),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
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
              <Icon path={mdiUpload} size={1.2} />
              {containerWidth > 640 && (
                <h2 className="pr-1 text-lg font-semibold">Upload files</h2>
              )}
            </Button>
          )}
          <input
            ref={inputRef}
            className="bg-primary-2 text-primary focus w-full rounded p-1 text-lg"
            placeholder="Search in folder"
            onChange={handleChange}
          />
          {Number(activeId) !== trashId ? (
            <Button
              className="p-1 sm:p-2"
              onClick={() => {
                const folder = folders.find((folder) => folder.id === activeId);
                if (folder) {
                  setActiveId(folder.parentFolderId);
                }
              }}
            >
              <Icon path={mdiArrowUpLeft} size={1.2} />
            </Button>
          ) : (
            <>
              <Button
                className="p-1 sm:p-2"
                onClick={() => dialogRef.current.showModal()}
              >
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
                    className="p-2 text-lg lg:text-xl"
                    onClick={deleteTrashContents}
                  >
                    Confirm
                  </Button>
                  <SadPenguinIcon className="text-primary -my-4 size-28" />
                  <Button
                    className="p-2 text-lg lg:text-xl"
                    onClick={() => dialogRef.current.close()}
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
              <Button className="p-1" type="submit" onClick={uploadFiles}>
                Upload
              </Button>
              <Button className="p-1" onClick={() => setFilesToUpload([])}>
                Cancel
              </Button>
            </div>
          </div>
        )}
        {Number(activeId) !== allId &&
          (filteredSubfolders.length > 0 ? (
            <h3 className="text-secondary text-lg font-semibold">Subfolders</h3>
          ) : (
            <h3 className="text-secondary text-lg font-semibold">
              No subfolders
            </h3>
          ))}
        {filteredSubfolders.map((folder) => {
          return (
            <FolderCard
              key={folder.id}
              folder={folder}
              handleId={handleId}
              setFolders={setFolders}
              setSubfolders={setSubfolders}
              setFilteredSubfolders={setFilteredSubfolders}
              allowDrop={allowDrop}
              onDragStart={onDragStart}
              moveIntoFolder={moveIntoFolder}
              moveFileIntoFolder={moveFileIntoFolder}
              trashId={trashId}
            />
          );
        })}
        {Number(activeId) !== allId &&
          (filteredFiles.length > 0 ? (
            <h3 className="text-secondary mt-4 text-lg font-semibold">Files</h3>
          ) : (
            <h3 className="text-secondary mt-4 text-lg font-semibold">
              No files
            </h3>
          ))}
        {filteredFiles.map((file) => {
          return (
            <FileCard
              key={file.id}
              file={file}
              setFiles={setFiles}
              setFilteredFiles={setFilteredFiles}
              onDragStart={onDragStart}
              moveFileIntoFolder={moveFileIntoFolder}
              trashId={trashId}
            />
          );
        })}
      </div>
    </PerfectScrollbar>
  );
};

export default Explorer;
