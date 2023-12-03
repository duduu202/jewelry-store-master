import styled from 'styled-components';

export const PageContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr; /* Duas colunas, a primeira com tamanho automático e a segunda ocupando o restante do espaço */
  height: 100vh;
  background-color: ${(props) => props.theme.colors.grayBackground};
  margin: 0;
  padding: 0;
`;

