import { gql } from '@apollo/client';

export const GET_MESSAGE_TEMPLATES = gql`
query FindManyMessageTemplates($filter: MessageTemplateFilterInput, $orderBy: [MessageTemplateOrderByInput], $lastCursor: String, $limit: Int) {
  messageTemplates(
    filter: $filter
    orderBy: $orderBy
    first: $limit
    after: $lastCursor
  ) {
    edges {
      node {
        id
        updatedAt
        createdAt
        channelType
        name
        body
        id
        favorites {
          edges {
            node {
              __typename
              id
              updatedAt
              campaign {
                __typename
                id
              }
              position
              workspaceMemberId
              subspecialtyId
              formResponse {
                __typename
                id
              }
              specialty {
                __typename
                id
              }
              personId
              company {
                __typename
                id
              }
              formTemplateId
              lead {
                __typename
                id
              }
              campaignTrigger {
                __typename
                id
              }
              messageTemplateId
              person {
                __typename
                id
              }
              campaignTriggerId
              id
              segmentId
              opportunityId
              subspecialty {
                __typename
                id
              }
              createdAt
              segment {
                __typename
                id
              }
              formTemplate {
                __typename
                id
              }
              campaignId
              formResponseId
              specialtyId
              opportunity {
                __typename
                id
              }
              communicationLogId
              messageTemplate {
                __typename
                id
              }
              workspaceMember {
                __typename
                id
              }
              companyId
              leadId
              communicationLog {
                __typename
                id
              }
            }
            __typename
          }
          __typename
        }
        attachments {
          edges {
            node {
              __typename
              id
              specialty {
                __typename
                id
              }
              fullPath
              activity {
                __typename
                id
              }
              updatedAt
              formResponseId
              companyId
              campaign {
                __typename
                id
              }
              communicationLog {
                __typename
                id
              }
              type
              segment {
                __typename
                id
              }
              formResponse {
                __typename
                id
              }
              subspecialty {
                __typename
                id
              }
              communicationLogId
              specialtyId
              createdAt
              messageTemplate {
                __typename
                id
              }
              person {
                __typename
                id
              }
              formTemplateId
              subspecialtyId
              id
              leadId
              company {
                __typename
                id
              }
              messageTemplateId
              opportunity {
                __typename
                id
              }
              formTemplate {
                __typename
                id
              }
              segmentId
              lead {
                __typename
                id
              }
              campaignId
              name
              authorId
              campaignTriggerId
              campaignTrigger {
                __typename
                id
              }
              author {
                __typename
                id
              }
              opportunityId
              activityId
              personId
            }
            __typename
          }
          __typename
        }
        activityTargets {
          edges {
            node {
              __typename
              id
              subspecialtyId
              company {
                __typename
                id
              }
              specialtyId
              opportunity {
                __typename
                id
              }
              campaignTrigger {
                __typename
                id
              }
              campaignTriggerId
              activityId
              id
              person {
                __typename
                id
              }
              messageTemplate {
                __typename
                id
              }
              formResponseId
              createdAt
              opportunityId
              segmentId
              campaignId
              activity {
                __typename
                id
              }
              lead {
                __typename
                id
              }
              formResponse {
                __typename
                id
              }
              updatedAt
              subspecialty {
                __typename
                id
              }
              communicationLogId
              companyId
              leadId
              formTemplate {
                __typename
                id
              }
              specialty {
                __typename
                id
              }
              communicationLog {
                __typename
                id
              }
              segment {
                __typename
                id
              }
              campaign {
                __typename
                id
              }
              personId
              formTemplateId
              messageTemplateId
            }
            __typename
          }
          __typename
        }
        status
        position
        __typename
      }
      cursor
      __typename
    }
    pageInfo {
      hasNextPage
      startCursor
      endCursor
      __typename
    }
    totalCount
    __typename
  }
}
`;