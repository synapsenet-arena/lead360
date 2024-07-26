import { renderHook } from '@testing-library/react';
import { print } from 'graphql';
import { RecoilRoot } from 'recoil';

import { useUpdateOneRecordMutation } from '@/object-record/hooks/useUpdateOneRecordMutation';

const expectedQueryTemplate = `
mutation UpdateOnePerson($idToUpdate: ID!, $input: PersonUpdateInput!) {
  updatePerson(id: $idToUpdate, data: $input) {
    __typename
    xLink {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    id
    createdAt
    city
    email
    jobTitle
    name {
      firstName
      lastName
    }
    phone
    linkedinLink {
      primaryLinkUrl
      primaryLinkLabel
      secondaryLinks
    }
    updatedAt
    avatarUrl
    companyId
  }
}
`.replace(/\s/g, '');

describe('useUpdateOneRecordMutation', () => {
  it('should return a valid createManyRecordsMutation', () => {
    const objectNameSingular = 'person';

    const { result } = renderHook(
      () =>
        useUpdateOneRecordMutation({
          objectNameSingular,
        }),
      {
        wrapper: RecoilRoot,
      },
    );

    const { updateOneRecordMutation } = result.current;

    expect(updateOneRecordMutation).toBeDefined();

    const printedReceivedQuery = print(updateOneRecordMutation).replace(
      /\s/g,
      '',
    );

    expect(printedReceivedQuery).toEqual(expectedQueryTemplate);
  });
});
