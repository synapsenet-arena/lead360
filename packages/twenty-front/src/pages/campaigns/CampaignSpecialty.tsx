import { Select } from '@/ui/input/components/Select';
import { GET_SPECIALTY } from '@/users/graphql/queries/getSpecialtyDetails';
import { useQuery } from '@apollo/client';
import { Section } from '@react-email/components';
import { atom, useRecoilState } from 'recoil';
import { H2Title } from 'twenty-ui';
import { SytledHR } from '~/pages/Segment/SegmentStyles';

export const campaignSpecialtyState = atom({
  key: 'campaignSpecialty',
  default: '',
});

export const campaignSubspecialtyState = atom({
  key: 'campaignSubspecialty',
  default: '',
});

export const CampaignSpecialty = () => {
  const [specialty, setSpecialty] = useRecoilState(campaignSpecialtyState);
  const [subSpecialty, setSubSpecialty] = useRecoilState(
    campaignSubspecialtyState,
  );
  const { loading: queryLoading, data: queryData } = useQuery(GET_SPECIALTY);

  let Specialty: any = [];
  const SpecialtyTypes: any = {};
  if (!queryLoading) {
    const specialtyTypes = queryData?.subspecialties.edges.map(
      (edge: { node: { specialty: { name: any } } }) =>
        edge?.node?.specialty?.name,
    );
    const uniqueSpecialtyTypes = Array.from(new Set(specialtyTypes));
    Specialty = uniqueSpecialtyTypes.map((specialty) => ({
      value: specialty,
      label: specialty,
    }));
    queryData?.subspecialties.edges.forEach(
      (edge: { node: { specialty: { name: any }; name: any } }) => {
        const specialtyType = edge.node?.specialty?.name;
        const subSpecialty = edge.node.name;

        // If the specialty type is already a key in the dictionary, push the sub-specialty to its array
        if (SpecialtyTypes[specialtyType]) {
          SpecialtyTypes[specialtyType].push({
            value: subSpecialty,
            label: subSpecialty,
          });
        } else {
          // If the specialty type is not yet a key, create a new array with the sub-specialty as its first element
          SpecialtyTypes[specialtyType] = [];
          SpecialtyTypes[specialtyType].push({
            value: subSpecialty,
            label: subSpecialty,
          });
        }
      },
    );
  }

  const handleSpecialtySelectChange = (selectedValue: any) => {
    setSpecialty(selectedValue);
  };
  const handleSubSpecialtySelectChange = (selectedValue: any) => {
    setSubSpecialty(selectedValue);
  };

  return (
    <>
      <Section>
        <H2Title
          title="Specialty Type"
          description="Select a medical specialty that is focused on a particular area of medical practice"
        />
        <Select
          fullWidth
          // disabled
          dropdownId="Specialty Type"
          value={specialty}
          options={Specialty}
          onChange={handleSpecialtySelectChange}
        />
      </Section>

      {specialty && (
        <>
          <SytledHR />
          <Section>
            <H2Title
              title="Subspecialty Type"
              description="Select a subspecialization within the selected medical specialty"
            />
            <Select
              fullWidth
              // disabled
              dropdownId="Sub Specialty Type"
              value={subSpecialty}
              options={SpecialtyTypes[specialty]}
              onChange={handleSubSpecialtySelectChange}
            />
          </Section>
        </>
      )}
    </>
  );
};
