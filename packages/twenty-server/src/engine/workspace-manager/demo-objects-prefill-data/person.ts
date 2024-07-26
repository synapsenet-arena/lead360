import { EntityManager } from 'typeorm';

import { peopleDemo } from 'src/engine/workspace-manager/demo-objects-prefill-data/people-demo.json';

export const personPrefillDemoData = async (
  entityManager: EntityManager,
  schemaName: string,
) => {
  const companies = await entityManager?.query(
    `SELECT * FROM ${schemaName}.company`,
  );

  // Iterate through the array and add a UUID for each person
  const people = peopleDemo.map((person, index) => ({
    nameFirstName: person.firstName,
    nameLastName: person.lastName,
    email: person.email,
    linkedinLinkPrimaryLinkUrl: person.linkedinUrl,
    jobTitle: person.jobTitle,
    city: person.city,
    avatarUrl: person.avatarUrl,
    position: index,
    companyId: companies[Math.floor(index / 2)].id,
  }));

  await entityManager
    .createQueryBuilder()
    .insert()
    .into(`${schemaName}.person`, [
      'nameFirstName',
      'nameLastName',
      'email',
      'linkedinLinkPrimaryLinkUrl',
      'jobTitle',
      'city',
      'avatarUrl',
      'position',
      'companyId',
    ])
    .orIgnore()
    .values(people)
    .returning('*')
    .execute();
};
