import styled, { css } from "styled-components";
import { Charcoal, Seashell } from "styles/color";

const Table = styled.table`
  width: 100%;
  color: ${Charcoal};
`;

const CellCss = css`
  padding: 15px 0;
  text-align: center;
`;

export const TableHeader = styled.th`
  ${CellCss}
  font-weight: 400;
`;

export const TableData = styled.td`
  ${CellCss}
  font-weight: 200;
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${Seashell};

  &:last-child {
    border-bottom: none;
  }
`;

export default Table;
