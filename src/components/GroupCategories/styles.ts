import styled, { keyframes } from 'styled-components';
import { NavLink } from 'react-router-dom';

export const GroupCell = styled.td`
  background-color: ${(props) => props.theme.colors.background};
  padding: 0.25rem;
  // text color
  color: ${(props) => props.theme.colors.light_font};
  border-color: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.primary};
  border-radius: 0.5rem;
  
`;

export const GroupContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  display: flex;
  width: fit-content;
  min-width: 100px;
  border-radius: 0.5rem;
  
  align-items: center;
  justify-content: center;
  margin: 0.25rem;
   
  // create space between children
  & > * {
    margin: 0.25rem;
  }
`;