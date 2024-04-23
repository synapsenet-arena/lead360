import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateFormResponse {
  queryFormResponse(data, decoded_ids) {
    const queryCreateFormResponse = {
      query: `mutation CreateOneFormResponse($input: FormResponseCreateInput!) {
        createFormResponse(data: $input) {
          id
        }
      }`,
      variables: {
        input: {
          email: `${data?.email ?? ''}`,
          firstName: `${data?.firstName ?? ''}`,
          lastName: `${data?.lastName ?? ''}`,
          consent: `${data?.consent ?? ''}`,
          leadId: `${decoded_ids?.leadId}`,
          name: `${data?.firstName ?? ''}`,
          weight: `${data?.weight ?? ''}`,
          gender: `${data?.gender ?? ''}`,
          medicalHistory: `${data?.medicalHistory ?? ''}`,
          appointmentReason: `${data?.appointmentReason ?? ''}`,
          height: `${data?.height ?? ''}`,
          appointmentType: `${data?.appointmentType ?? ''}`,
          appointmentLocation: `${data?.appointmentLocation ?? ''}`,
          phoneNumber: `${data?.phoneNumber ?? ''}`,
          appointmentDate: data?.appintmentDate ?? null,
        },
      },
    };

    return queryCreateFormResponse;
  }
}
