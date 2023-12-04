import styled from "styled-components";

export const ButtonComponent = styled.button <{ width?: string; height?: string } > `
  width: ${(props) => (props.width ? props.width : "4rem")};
  height: ${(props) => (props.height ? props.height : "2rem")};
  align-items: center;
  justify-content: center;
  border-radius: 0.2rem;
  border: 2px solid ${({ theme }) => theme.colors.primary_dark};
  color: ${({ theme }) => theme.colors.dark_font};
  outline: none;
  background-color: ${({ theme }) => theme.colors.primary_dark};
  transition: all 0.1s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary_dark};
    border-color: ${({ theme }) => theme.colors.grayBackground};
  }
`;

export const PlusButtonComponent = styled.button <{ width?: string; height?: string } > `
  width: ${(props) => (props.width ? props.width : "4rem")};
  height: ${(props) => (props.height ? props.height : "2rem")};
  align-items: center;
  justify-content: center;
  border-radius: 0.2rem;
  border: 0px solid ${({ theme }) => theme.colors.primary_dark};
  color: ${({ theme }) => theme.colors.light_font};
  outline: none;
  background-color: ${({ theme }) => theme.colors.background};
  transition: all 0.1s ease-in-out;
  border: 1px solid ${({ theme }) => theme.colors.primary_dark};

  // center text in button
  display: flex;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary_dark};
    border-color: ${({ theme }) => theme.colors.grayBackground};
  }
`;