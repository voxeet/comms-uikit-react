import type { UseMessage } from './types/Message';
import useCommsContext from './useCommsContext';

const useMessage: UseMessage = () => {
  const { sendMessage, messageData, clearMessage } = useCommsContext();

  const { sender, message } = messageData;

  return {
    sendMessage,
    sender,
    message,
    clearMessage,
  };
};

export default useMessage;
