import styled from '@emotion/styled';

export const StyledButtonContainer = styled.div`
  display: inline-flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing(2)};
`;

export const StyledContainer = styled.div`
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const StyledInputCard = styled.div`
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  height: auto;
  justify-content: space-evenly;
  width: 100%;
`;