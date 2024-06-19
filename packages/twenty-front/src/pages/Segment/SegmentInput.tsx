import { TextArea } from '@/ui/input/components/TextArea';
import { TextInput } from '@/ui/input/components/TextInput';
import { Section } from '@react-email/components';
import { SytledHR } from '~/pages/Segment/SegmentStyles';
import { H2Title } from 'twenty-ui';

export type SegmentInputProps = {
  segmentName: string;
  setSegmentName: (value: string) => void;
  segmentDescription: string;
  setSegmentDescription: (value: string) => void;
};

export const SegmentInput = ({
  segmentName,
  setSegmentName,
  segmentDescription,
  setSegmentDescription,
}: SegmentInputProps) => {
  return (
    <>
      <Section>
        <H2Title title="Segment Name" description="Enter Segment name here" />
        <TextInput
          placeholder={'Enter segment name'}
          value={segmentName}
          onChange={(e) => setSegmentName(e)}
          name="segmentName"
          required
          fullWidth
        />
      </Section>
      <SytledHR />
      <Section>
        <H2Title
          title="Segment Description"
          description="Enter segment description"
        />
      </Section>
      <TextArea
        placeholder={'Enter segment description'}
        minRows={5}
        value={segmentDescription}
        onChange={(e) => setSegmentDescription(e)}
      />
    </>
  );
};
