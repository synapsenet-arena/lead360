import { IconButton } from '@/ui/input/button/components/IconButton';
import { IconPlayerPlay } from '@tabler/icons-react';

type PageRunCampaignButtonProps = {
    onClick: () => void;
  };
  export const RunCampaignButton = ({
    onClick,
  }: PageRunCampaignButtonProps) => (
    <IconButton
    Icon={IconPlayerPlay}
    size="medium"
    variant="secondary"
    data-testid="run-campaign-button"
    accent={'default'}
    onClick={onClick}
  />
);