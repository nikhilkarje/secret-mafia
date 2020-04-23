import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";
import ReactDOM from "react-dom";
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
      content,
      hideClose,
      triggerCss,
      onOpen,
      onClose,
    }: {
      children?: React.ReactNode;
      content: React.ReactNode;
      hideClose?: boolean;
      triggerCss?: any;
      onOpen?: () => any;
      onClose?: () => any;
    },
    ref
  ) => {
    const modalContainer = useRef(null);

    const mountComponent = () => {
      modalContainer.current = document.createElement("div");
      document.body.appendChild(modalContainer.current);

      ReactDOM.render(
        <ModalLayout hideClose={hideClose} closeModal={removeModal}>
          {content}
        </ModalLayout>,
        modalContainer.current
      );
    };

    const unmountComponent = () => {
      if (modalContainer.current) {
        ReactDOM.unmountComponentAtNode(modalContainer.current);
        if (document.body.contains(modalContainer.current)) {
          document.body.removeChild(modalContainer.current);
        }
        modalContainer.current = null;
      }
    };

    const addModal = () => {
      mountComponent();
      if (onOpen) {
        onOpen();
      }
    };

    const removeModal = () => {
      unmountComponent();
      if (onClose) {
        onClose();
      }
    };

    useImperativeHandle(
      ref,
      () => {
        return { addModal, removeModal };
      },
      []
    );

    return children ? (
      <TriggerContainer triggerCss={triggerCss} onClick={addModal}>
        {children}
      </TriggerContainer>
    ) : null;
  }
);

const TriggerContainer = styled.div<{
  triggerCss?: any;
}>`
  display: inline-block;
  ${({ triggerCss }: { triggerCss?: any }) => triggerCss}
`;

const FixedCss = css`
  position: fixed;
  right: 0px;
  bottom: 0px;
  top: 0px;
  left: 0px;
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
