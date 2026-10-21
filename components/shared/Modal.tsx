import React from "react";
import { Modal } from "antd";
import Loader from "@/components/shared/Loader";

interface CustomModalProps {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  headerContent: React.ReactNode;
  bodyContent: React.ReactNode;
  width?: number;
  className?: string;
  maskClosable?: boolean;
}

const CustomModal = ({
  open,
  onClose,
  loading,
  headerContent,
  bodyContent,
  width = 1000,
  className = " [&_.ant-modal-container]:!p-0 [&_.ant-modal-body]:bg-card-bg border border-border rounded-md font-['Montserrat'] ",
  maskClosable = true,
}: CustomModalProps) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnHidden
      mask={{ closable: maskClosable }}
      width={width}
      className={className}
      styles={{
        body: {
          padding: 10,
          borderRadius: 7,
          overflow: "hidden",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {loading ? (
        <div className="flex items-center justify-center px-6 py-16">
          <Loader size="lg" />
        </div>
      ) : (
        <div className="bg-card-bg flex flex-col overflow-hidden text-foreground font-['Montserrat']">
          <div className="bg-primary text-foreground px-6 py-5 flex items-start rounded-md justify-between shrink-0">
            {headerContent}
          </div>

          <div className="space-y-4 overflow-y-auto flex-1 mt-2">{bodyContent}</div>
        </div>
      )}
    </Modal>
  );
};

export default CustomModal;
