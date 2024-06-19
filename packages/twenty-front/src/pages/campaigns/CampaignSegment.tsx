import { Select } from '@/ui/input/components/Select';
import { GET_SEGMENT_LISTS } from '@/users/graphql/queries/getSegments';
import { useQuery } from '@apollo/client';
import { Section } from '@react-email/components';
import { atom, useRecoilState } from 'recoil';
import { H2Title } from 'twenty-ui';

export const campaignSegmentState = atom({
  key: 'campaignSegment',
  default: '',
});

export const CampaignSegment = () => {
  let segmentsList: any = [];

  const [segment, setSegment] = useRecoilState(campaignSegmentState);
  const { loading: segmentLoading, data: segmentsData } =
    useQuery(GET_SEGMENT_LISTS);

  if (!segmentLoading) {
    segmentsList = segmentsData?.segments.edges.map((edge: { node: any }) => ({
      value: edge.node?.id,
      label: edge.node?.name,
    }));
  }

  return (
    <>
      <Section>
        <H2Title
          title="Segment"
          description="Your Target Audience will be displayed in Campaign List"
        />
        <Select
          fullWidth
          dropdownId="segments"
          value={segment}
          options={segmentsList}
          onChange={(e) => setSegment(e)}
        />
      </Section>
    </>
  );
};
