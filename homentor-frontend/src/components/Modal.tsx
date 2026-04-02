import React from "react";
import { useNavigate } from "react-router-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 z-[5000] h-[100vh] flex items-center justify-center w-[100%
    ] bg-black">
      <div className="bg-black h-[100vh] top-0 z-[1000] absolute"></div>
      {/* <div className="bg-red-500 rounded-lg shadow-lg fixed max-w-md p-6 mx-4">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="mb-6">{children}</div>
        <div className="flex justify-end">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-mentor-blue-600 text-white rounded hover:bg-mentor-blue-700"
          >
            Close
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Modal;
