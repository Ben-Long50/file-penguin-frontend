import {
  mdiPlus,
  mdiFolderOutline,
  mdiFolderOpenOutline,
  mdiFileDocumentOutline,
  mdiClose,
} from '@mdi/js';
import Icon from '@mdi/react';
import Button from './Button';
import ActionBtn from './ActionBtn';
import Label from './Label';
import Loading from './Loading';
import MenuOptions from './MenuOptions';
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

const Explorer = () => {
  const [loading, setLoading] = useState(false);
  const { activeId, setActiveId, visibility, folders } = useOutletContext();
  const [title, setTitle] = useState('');
  const [input, setInput] = useState('');
  const [subfolders, setSubfolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const { apiUrl } = useContext(AuthContext);

  const fileInputRef = useRef(null);
  const containerRef = useRef(null);

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
        const response = await fetch(`${apiUrl}/folders/${activeId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setSubfolders(data.folders);
          setFiles(data.files);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFolderContents();
    const currentFolder = folders.find((item) => item.id === activeId);
    if (currentFolder) {
      setTitle(currentFolder.title);
    }

    setLoading(false);
  }, [activeId]);

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
      if (response.ok) {
        setFiles((prevFiles) => [...prevFiles, ...data]);
        console.log(data);
        setFilesToUpload([]);
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
    console.log(files);
  };

  const handleId = (id) => {
    setActiveId(id);
    localStorage.setItem('activeId', id);
  };

  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const removeFile = (fileName) => {
    const updatedFiles = filesToUpload.filter((file) => file.name !== fileName);
    setFilesToUpload(updatedFiles);
  };

  const toggleMenuVisibility = () => {
    setMenuVisibility((prevVisibility) => !prevVisibility);
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
        <div className="flex items-center justify-center gap-6 px-16">
          <Icon className="text-primary" path={mdiFolderOpenOutline} size={4} />

          <h1 className="text-primary text-6xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center justify-between gap-8">
          <input
            type="file"
            ref={fileInputRef}
            multiple
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button
            className="my-3 flex shrink-0 items-center gap-2 p-2"
            onClick={handleButtonClick}
          >
            <Icon path={mdiPlus} size={1.2} />
            {containerWidth > 640 && (
              <h2 className="pr-1 text-lg font-semibold">Upload files</h2>
            )}
          </Button>
          <input
            className="bg-primary-2 text-primary focus w-full rounded p-1 text-lg"
            placeholder="Search in folder"
            onChange={handleInput}
          ></input>
        </div>
        {filesToUpload.length > 0 && (
          <div className="group/upload text-primary bg-secondary-2 mb-4 flex flex-col gap-2 rounded p-3">
            <h3 className="mb-2 text-lg">Files for upload:</h3>
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
        {subfolders.length > 0 ? (
          <h3 className="text-secondary text-lg font-semibold">Subfolders</h3>
        ) : (
          <h3 className="text-secondary text-lg font-semibold">
            No subfolders
          </h3>
        )}
        {subfolders.map((folder) => {
          return (
            <button
              key={folder.id}
              className="group/item bg-secondary-2 list-primary hover:hover-secondary flex items-center justify-between gap-8"
              onClick={() => handleId(folder.id)}
            >
              <div className="flex items-center gap-4">
                <Icon path={mdiFolderOutline} size={1.2} />
                <p>{folder.title}</p>
              </div>
              <MenuOptions />
            </button>
          );
        })}
        {files.length > 0 ? (
          <h3 className="text-secondary mt-4 text-lg font-semibold">Files</h3>
        ) : (
          <h3 className="text-secondary mt-4 text-lg font-semibold">
            No files
          </h3>
        )}
        {files.map((file) => {
          return (
            <button
              key={file.id}
              className="group/item bg-secondary-2 list-primary hover:hover-secondary flex items-center justify-between gap-8"
              onClick={() => handleId(file.id)}
            >
              <div className="flex items-center gap-4">
                <Icon path={mdiFileDocumentOutline} size={1.2} />
                <p>{file.title}</p>
              </div>
              <MenuOptions />
            </button>
          );
        })}
      </div>
    </PerfectScrollbar>
  );
};

export default Explorer;
