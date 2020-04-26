import React, { useImperativeHandle, forwardRef, useState } from "react";
import styled, { css } from "styled-components";

import { CenteredContent } from "styles/common";
import { White } from "styles/color";
import { Close } from "components/common/icons";

const ModalLayout = ({
  children,
  closeModal,
  hideClose,
}: {
  children: React.ReactNode;
  closeModal: () => void;
  hideClose?: boolean;
}) => {
  return (
    <>
      <ModalOverlay onClick={closeModal} />
      <ModalContainer>
        <ModalWrapper>
          {!hideClose && (
            <CloseWrapper onClick={closeModal}>
              <Close iconCss={CloseIconCss} />
            </CloseWrapper>
          )}
          {children}
        </ModalWrapper>
      </ModalContainer>
    </>
  );
};

const Modal = forwardRef(
  (
    {
      children,
      hideClose,
      onOpen,
      onClose,
    }: {
      children?: React.ReactNode;
      hideClose?: boolean;
      onOpen?: () => any;
      onClose?: () => any;
    },
    ref
  ) => {
    const [open, setOpen] = useState<boolean>(false);

    const addModal = () => {
      if (!open) {
        setOpen(true);
        if (onOpen) {
          onOpen();
        }
      }
    };

    const removeModal = () => {
      if (open) {
        setOpen(false);
        if (onClose) {
          onClose();
        }
      }
    };

    useImperativeHandle(
      ref,
      () => {
        return { addModal, removeModal };
      },
      []
    );

    return (
      open && (
        <ModalLayout hideClose={hideClose} closeModal={removeModal}>
          {children}
        </ModalLayout>
      )
    );
    // return children ? (
    //   <TriggerContainer triggerCss={triggerCss} onClick={addModal}>
    //     {children}
    //   </TriggerContainer>
    // ) : null;
  }
);

const FixedCss = css`
  position: fixed;
  right: 0px;
  bottom: 0px;
  top: 0px;
  left: 0px;
  right: 320px;
`;

const ModalWrapper = styled.div`
  position: relative;
`;

const ModalContainer = styled.div`
  z-index: 1301;
  ${CenteredContent}
  ${FixedCss}
`;

const ModalOverlay = styled.div`
  z-index: 1300;
  background-color: rgba(0, 0, 0, 0.5);
  ${FixedCss}
`;

const CloseWrapper = styled.span`
  position: absolute;
  right: 10px;
  top: 10px;
`;

const CloseIconCss = css`
  color: ${White};
`;

export default Modal;
