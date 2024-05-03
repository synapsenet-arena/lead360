import React from 'react';
import styled from '@emotion/styled';

import { ModalLayout } from '@/ui/layout/modal/components/ModalLayout';

const StyledContent = styled(ModalLayout.Content)`
  align-items: center;
  width: 100%;
  height: 100%;
  justify-content: center;
`;

type AuthModalProps = { children: React.ReactNode };

export const AuthModal = ({ children }: AuthModalProps) => (
  <ModalLayout padding={'none'} size={'extralarge'} >
    <StyledContent>{children}</StyledContent>
  </ModalLayout>
);
