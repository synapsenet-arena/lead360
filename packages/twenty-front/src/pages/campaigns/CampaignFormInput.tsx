import { H2Title } from '@/ui/display/typography/components/H2Title';
import { Select } from '@/ui/input/components/Select';
import { GET_FORM_TEMPLATES } from '@/users/graphql/queries/getFormTemplates';
import { useQuery } from '@apollo/client';
import { Section } from '@react-email/components';
import { atom, useRecoilState } from 'recoil';

export const campaignFormInputState = atom({
  key: 'campaignFormInput',
  default: '',
});

export const CampaignFormInput = () => {
  const [form, setForm] = useRecoilState(campaignFormInputState);
  let formTemplates: any = [];

  const { loading: formTemplateLoading, data: formTemplateData } =
    useQuery(GET_FORM_TEMPLATES);

  if (!formTemplateLoading) {
    formTemplates = formTemplateData?.formTemplates.edges.map(
      (edge: { node: any }) => ({
        value: edge.node?.id,
        label: edge.node?.name,
      }),
    );
  }
  return (
    <>
      <Section>
        <H2Title
          title="Loading Page URL"
          description="URL for the landing page, to be used here"
        />
        <Select
          fullWidth
          dropdownId="formTemplates"
          value={form}
          options={formTemplates}
          onChange={(e) => setForm(e)}
        />
      </Section>
    </>
  );
};
