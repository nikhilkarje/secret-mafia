import React, { useImperativeHandle, useRef } from "react";
import styled, { css } from "styled-components";

import { Charcoal, BrightRed, LightGrey, Seashell } from "styles/color";

const WideInput = ({ forwardRef, error, ...props }: any) => {
  const inputRef = useRef(null);
  if (forwardRef) {
    useImperativeHandle(forwardRef as any, () => inputRef.current);
  }

  return (
    <InputWrapper>
      <Input isError={!!error} ref={inputRef} {...props} />
      {error && <ErrorContainer>{error}</ErrorContainer>}
    </InputWrapper>
  );
};

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input<{
  isError?: boolean;
}>`
  width: 100%;
  outline: none;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  padding-left: 15px;
  vertical-align: middle;
  border-radius: 5px;
  line-height: 16px;
  border: 1px solid ${LightGrey};
  background: ${Seashell};
  height: 38px;
  box-sizing: border-box;
  color: ${Charcoal};
  border: 1px solid ${Charcoal};

  ${({ isError }) =>
    isError &&
    css`
      border: 1px solid ${BrightRed};
    `}
`;

const ErrorContainer = styled.span`
  color: ${BrightRed};
  font-size: 10px;
  position: absolute;
  bottom: 4px;
  left: 0;
`;

export default WideInput;
