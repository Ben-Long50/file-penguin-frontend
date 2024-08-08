import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import Loading from './Loading';
import { ThemeContext } from './ThemeContext';

const MainLayout = () => {
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState([]);
  const [allId, setAllId] = useState(() => {
    const value = localStorage.getItem('allId') || '';
    return value;
  });
  const [trashId, setTrashId] = useState(() => {
    const value = localStorage.getItem('trashId') || '';
    return value;
  });
  const [activeId, setActiveId] = useState(() => {
    const value = localStorage.getItem('activeId') || '';
    return value;
  });
  const { apiUrl, currentUser } = useContext(AuthContext);
  const [visibility, setVisibility] = useState(true);
  const { theme, changeTheme } = useContext(ThemeContext);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const fetchFolders = async () => {
      try {
        const response = await fetch(`${apiUrl}/folders`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setFolders(data);
          const allFolder = data.find((folder) => folder.title === 'All files');
          const trashFolder = data.find((folder) => folder.title === 'Trash');
          setAllId(allFolder.id);
          localStorage.setItem('allId', allFolder.id);
          setTrashId(trashFolder.id);
          localStorage.setItem('trashId', trashFolder.id);
          if (!localStorage.getItem('activeId')) {
            localStorage.setItem('activeId', data[0].id);
            setActiveId(data[0].id);
          } else {
            setActiveId(localStorage.getItem('activeId'));
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, [currentUser]);

  const moveIntoFolder = async (e, folderId, targetId) => {
    let dataTransferId;

    if (e.dataTransfer) {
      dataTransferId = e.dataTransfer.getData('id');
    }
    const childId = dataTransferId ? Number(dataTransferId) : Number(targetId);

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
          setFolders((prevFolders) =>
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
          return errorArray;
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const moveFileIntoFolder = async (e, folderId, targetId) => {
    let dataTransferId;

    if (e.dataTransfer) {
      dataTransferId = e.dataTransfer.getData('id');
    }
    const fileId = dataTransferId ? Number(dataTransferId) : Number(targetId);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${apiUrl}/files/${fileId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ folderId, fileId }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data);
        setFolders((prevFolders) =>
          prevFolders.map((folder) => {
            if (folder.id === folderId) {
              return data.newParentFolder;
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
        return errorArray;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onDragStart = (e, id, type) => {
    e.dataTransfer.setData('id', id);
    e.dataTransfer.setData('type', type);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleVisibility = () => {
    setVisibility((prevVisibility) => !prevVisibility);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={`${theme} layout-cols bg-secondary grid grid-rows-1`}>
      <Sidebar
        folders={folders}
        setFolders={setFolders}
        activeId={activeId}
        allId={allId}
        trashId={trashId}
        setActiveId={setActiveId}
        visibility={visibility}
        setVisibility={setVisibility}
        handleVisibility={handleVisibility}
        theme={theme}
        changeTheme={changeTheme}
        allowDrop={allowDrop}
        onDragStart={onDragStart}
        moveIntoFolder={moveIntoFolder}
        moveFileIntoFolder={moveFileIntoFolder}
      />
      <Outlet
        context={{
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
        }}
      />
    </div>
  );
};

export default MainLayout;
