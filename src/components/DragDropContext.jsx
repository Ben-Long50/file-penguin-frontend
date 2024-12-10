import { createContext, useContext } from 'react';
import useMoveFolderMutation from '../hooks/useMoveFolderMutation/useMoveFolderMutation';
import useMoveFileMutation from '../hooks/useMoveFileMutation/useMoveFileMutation';
import { AuthContext } from './AuthContext';

export const DragDropContext = createContext();

const DragDropProvider = ({ children }) => {
  const { apiUrl } = useContext(AuthContext);

  const moveFolder = useMoveFolderMutation(apiUrl);
  const moveFile = useMoveFileMutation(apiUrl);

  const handleMoveFolder = async (e, folderId, targetId) => {
    let dataTransferId;

    if (e.dataTransfer) {
      dataTransferId = e.dataTransfer.getData('id');
    }
    const childId = dataTransferId ? Number(dataTransferId) : Number(targetId);

    if (childId !== folderId) {
      try {
        await moveFolder.mutateAsync({ folderId, childId });
      } catch (error) {
        return error.message;
      }
    }
  };

  const handleMoveFile = async (e, folderId, targetId) => {
    let dataTransferId;

    if (e.dataTransfer) {
      dataTransferId = e.dataTransfer.getData('id');
    }
    const fileId = dataTransferId ? Number(dataTransferId) : Number(targetId);

    moveFile.mutate({ folderId, fileId });
  };

  const onDragStart = (e, id, type) => {
    e.dataTransfer.setData('id', id);
    e.dataTransfer.setData('type', type);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, folderId, setErrors) => {
    let result;
    const dataTransferType = e.dataTransfer.getData('type');
    if (dataTransferType === 'file') {
      result = await handleMoveFile(e, folderId);
    } else if (dataTransferType === 'folder') {
      result = await handleMoveFolder(e, folderId);
    }
    if (result) {
      setErrors([result]);
      setTimeout(() => {
        setErrors([]);
      }, 5000);
    }
  };

  return (
    <DragDropContext.Provider
      value={{
        handleMoveFolder,
        handleMoveFile,
        onDragStart,
        allowDrop,
        handleDrop,
      }}
    >
      {children}
    </DragDropContext.Provider>
  );
};

export default DragDropProvider;
