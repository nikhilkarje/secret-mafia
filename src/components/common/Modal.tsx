import React, { useImperativeHandle, forwardRef, useState } from "react";
import styled, { css } from "styled-components";

import { CenteredContent } from "styles/common";
import { White } from "styles/color";
import { Close } from "components/common/icons";

const ModalLayout = ({
  children,
  closeModal,
  hideClose,
  partialOverlay,
}: {
  children: React.ReactNode;
  closeModal: () => void;
  hideClose?: boolean;
  partialOverlay: boolean;
}) => {
  return (
    <>
      <ModalOverlay partialOverlay={partialOverlay} onClick={closeModal} />
      <ModalContainer partialOverlay={partialOverlay}>
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
      partialOverlay,
    }: {
      children?: React.ReactNode;
      hideClose?: boolean;
      onOpen?: () => any;
      onClose?: () => any;
      partialOverlay?: boolean;
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
      [open]
    );

    return (
      open && (
        <ModalLayout
          partialOverlay={partialOverlay}
          hideClose={hideClose}
          closeModal={removeModal}
        >
          {children}
        </ModalLayout>
      )
    );
  }
);

const FixedCss = css<{
  partialOverlay: boolean;
}>`
  position: fixed;
  right: 0px;
  bottom: 0px;
  top: 0px;
  left: 0px;
  ${({ partialOverlay }) =>
    partialOverlay &&
    css`
      right: 320px;
    `}
`;

const ModalWrapper = styled.div`
  position: relative;
`;

const ModalContainer = styled.div<{
  partialOverlay: boolean;
}>`
  z-index: 1301;
  ${CenteredContent}
  ${FixedCss}
`;

const ModalOverlay = styled.div<{
  partialOverlay: boolean;
}>`
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
