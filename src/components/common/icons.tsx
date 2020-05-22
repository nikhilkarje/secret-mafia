import React from "react";
import styled, { css } from "styled-components";

interface IconProps extends Props {
  icon: string;
}

interface Props extends React.HTMLAttributes<HTMLElement> {
  iconCss?: any;
  onClick?: any;
}

const Icon = ({ icon, iconCss, className, onClick }: IconProps) => (
  <CIcon
    className={`material-icons ${className}`}
    iconCss={iconCss}
    onClick={onClick}
  >
    {icon}
  </CIcon>
);

export const Add = (props: Props) => <Icon {...props} icon="add_circle" />;

export const Edit = (props: Props) => <Icon {...props} icon="create" />;

export const Close = (props: Props) => <Icon {...props} icon="clear" />;

export const Delete = (props: Props) => <Icon {...props} icon="delete" />;

export const DoubleArrow = (props: Props) => (
  <Icon {...props} icon="double_arrow" />
);

export const Next = (props: Props) => {
  const AddedCss = css`
    transform: rotate(90deg);
    ${props.iconCss || ""}
  `;
  return <Icon {...props} iconCss={AddedCss} icon="navigation" />;
};

export const Draw = (props: Props) => <Icon {...props} icon="library_books" />;

const CIcon = styled.i<{
  iconCss?: any;
}>`
  &.material-icons {
    cursor: pointer;
    ${({ iconCss }) => iconCss}
  }
`;
