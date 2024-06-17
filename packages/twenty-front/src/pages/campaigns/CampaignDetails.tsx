import { H2Title } from '@/ui/display/typography/components/H2Title';
import { TextArea } from '@/ui/input/components/TextArea';
import { TextInput } from '@/ui/input/components/TextInput';
import { Section } from '@react-email/components';
import { atom, useRecoilState } from 'recoil';
import { SytledHR } from '~/pages/Segment/SegmentStyles';

export const campaignNameState = atom({
  key: 'campaignName',
  default: '',
});

export const campaignDescriptionState = atom({
  key: 'campaignDescription',
  default: '',
});

export const CampaignDetails = () => {
  const [campaignName, setCampaignName] = useRecoilState(campaignNameState);
  const [campaignDescription, setCampaignDescription] = useRecoilState(
    campaignDescriptionState
  );

  return (
    <>
      <Section>
        <H2Title
          title="Campaign Name"
          description="Your Campaign name will be displayed in Campaign List"
        />
        <TextInput
          placeholder={'Enter campaign Name'}
          value={campaignName}
          onChange={(e) => setCampaignName(e)}
          name="campaignName"
          required
          fullWidth
        />
      </Section>
      <SytledHR />
      <Section>
        <H2Title
          title="Campaign Description"
          description="Your Campaign Description will be displayed in Campaign List"
        />
        <TextArea
          value={campaignDescription}
          onChange={(e) => setCampaignDescription(e)}
          minRows={4}
        />
      </Section>
    </>
  );
};
