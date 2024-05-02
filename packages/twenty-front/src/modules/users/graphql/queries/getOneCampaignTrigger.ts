import { gql } from '@apollo/client';

export const GET_CAMPAIGN_TRIGGER = gql`query FindOnecampaignTrigger($objectRecordId: UUID!) {
    campaignTrigger(filter: {id: {eq: $objectRecordId}}) {
      id
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
      executionId
      startDate
      opportunites {
        edges {
          node {
            __typename
            id
            campaign {
              __typename
              id
            }
            lead {
              __typename
              id
            }
            probability
            messageStatus
            activityTargets {
              edges {
                node {
                  __typename
                  id
                }
                __typename
              }
              __typename
            }
            favorites {
              edges {
                node {
                  __typename
                  id
                }
                __typename
              }
              __typename
            }
            companyId
            campaignTrigger {
              __typename
              id
            }
            stage
            attachments {
              edges {
                node {
                  __typename
                  id
                }
                __typename
              }
              __typename
            }
            informedPhoneNumberId
            informedPhoneNumber {
              __typename
              id
            }
            createdAt
            updatedAt
            id
            pointOfContact {
              __typename
              id
            }
            pipelineStepId
            campaignId
            amount {
              amountMicros
              currencyCode
              __typename
            }
            campaignTriggerId
            company {
              __typename
              id
            }
            comments
            closeDate
            pipelineStep {
              __typename
              id
            }
            pointOfContactId
            leadId
            name
            position
          }
          __typename
        }
        __typename
      }
      id
      createdAt
      position
      stopDate
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
      campaign {
        __typename
        id
        description
        segment {
          __typename
          id
        }
        position
        activityTargets {
          edges {
            node {
              __typename
              id
            }
            __typename
          }
          __typename
        }
        id
        segmentId
        messageTemplateId
        subspecialty
        updatedAt
        formTemplate {
          __typename
          id
        }
        status
        favorites {
          edges {
            node {
              __typename
              id
            }
            __typename
          }
          __typename
        }
        campaignExecution {
          edges {
            node {
              __typename
              id
            }
            __typename
          }
          __typename
        }
        specialty
        formTemplateId
        createdAt
        opportunities {
          edges {
            node {
              __typename
              id
            }
            __typename
          }
          __typename
        }
        messageTemplate {
          __typename
          id
        }
        name
        attachments {
          edges {
            node {
              __typename
              id
            }
            __typename
          }
          __typename
        }
      }
      campaignId
      status
      name
      updatedAt
      __typename
    }
  }`