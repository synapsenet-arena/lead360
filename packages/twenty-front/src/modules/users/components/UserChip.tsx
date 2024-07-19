import { AvatarChip } from 'twenty-ui';

import { getImageAbsoluteURIOrBase64 } from '~/utils/image/getImageAbsoluteURIOrBase64';

export type UserChipProps = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export const UserChip = ({ id, name, avatarUrl }: UserChipProps) => (
  <AvatarChip
    placeholderColorSeed={id}
    name={name}
    avatarType="rounded"
    avatarUrl={getImageAbsoluteURIOrBase64(avatarUrl) || ''}
  />
);
