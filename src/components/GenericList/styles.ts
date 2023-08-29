import styled, { keyframes } from 'styled-components';
import { NavLink } from 'react-router-dom';

export const GenericListTable = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
`;

export const GenericListCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

export const GenericListHeaderCell = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.default};
`;

export const GenericListRow= styled.tr`
  background-color: ${(props) => props.theme.colors.secondary};
`;

