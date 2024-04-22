import { gql } from '@apollo/client';

export const GET_CAMPAIGN_LISTS = gql`
query FindManyCampaigns($filter: CampaignFilterInput, $orderBy: CampaignOrderByInput, $lastCursor: String, $limit: Float) {
  campaigns(filter: $filter, orderBy: $orderBy, first: $limit, after: $lastCursor) {
    edges {
      node {
        id
        id
        messageTemplate {
          __typename
          id
          id
          status
          body
          name
          createdAt
          campaign {
            edges {
              node {
                __typename
                id
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
              }
              __typename
            }
            __typename
          }
          updatedAt
          position
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
          channelType
        }
        subspecialty
        campaignExecution {
          edges {
            node {
              __typename
              id
              status
              updatedAt
              startDate
              stopDate
              opportunites {
                edges {
                  node {
                    __typename
                    id
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
                  }
                  __typename
                }
                __typename
              }
              campaign {
                __typename
                id
              }
              id
              createdAt
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
              executionId
              position
              campaignId
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
              name
            }
            __typename
          }
          __typename
        }
        segment {
          __typename
          id
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
          lastQueryExecution
          campaign {
            edges {
              node {
                __typename
                id
              }
              __typename
            }
            __typename
          }
          filters
          id
          createdAt
          updatedAt
          position
          name
          description
        }
        segmentId
        status
        specialty
        formTemplateId
        messageTemplateId
        activityTargets {
          edges {
            node {
              __typename
              id
              activity {
                __typename
                id
              }
              activityId
              specialtyId
              opportunity {
                __typename
                id
              }
              formResponseId
              opportunityId
              updatedAt
              id
              subspecialty {
                __typename
                id
              }
              leadId
              formTemplateId
              companyId
              subspecialtyId
              campaignTrigger {
                __typename
                id
              }
              personId
              segment {
                __typename
                id
              }
              messageTemplateId
              segmentId
              specialty {
                __typename
                id
              }
              campaign {
                __typename
                id
              }
              campaignTriggerId
              messageTemplate {
                __typename
                id
              }
              campaignId
              formResponse {
                __typename
                id
              }
              createdAt
              formTemplate {
                __typename
                id
              }
              communicationLogId
              person {
                __typename
                id
              }
              lead {
                __typename
                id
              }
              company {
                __typename
                id
              }
              communicationLog {
                __typename
                id
              }
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
              campaign {
                __typename
                id
              }
              person {
                __typename
                id
              }
              updatedAt
              formResponseId
              segmentId
              formTemplate {
                __typename
                id
              }
              lead {
                __typename
                id
              }
              subspecialtyId
              workspaceMemberId
              createdAt
              company {
                __typename
                id
              }
              segment {
                __typename
                id
              }
              specialtyId
              specialty {
                __typename
                id
              }
              messageTemplate {
                __typename
                id
              }
              communicationLog {
                __typename
                id
              }
              campaignId
              formTemplateId
              communicationLogId
              position
              workspaceMember {
                __typename
                id
              }
              formResponse {
                __typename
                id
              }
              leadId
              subspecialty {
                __typename
                id
              }
              campaignTriggerId
              id
              opportunityId
              opportunity {
                __typename
                id
              }
              companyId
              campaignTrigger {
                __typename
                id
              }
              personId
              messageTemplateId
            }
            __typename
          }
          __typename
        }
        opportunities {
          edges {
            node {
              __typename
              id
              informedPhoneNumberId
              id
              campaignTrigger {
                __typename
                id
              }
              amount {
                amountMicros
                currencyCode
                __typename
              }
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
              updatedAt
              company {
                __typename
                id
              }
              stage
              pipelineStepId
              status
              companyId
              leadId
              campaignId
              lead {
                __typename
                id
              }
              informedPhoneNumber {
                __typename
                id
              }
              closeDate
              pipelineStep {
                __typename
                id
              }
              messageStatus
              position
              campaignTriggerId
              pointOfContactId
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
              comments
              name
              createdAt
              pointOfContact {
                __typename
                id
              }
              probability
              campaign {
                __typename
                id
              }
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
            __typename
          }
          __typename
        }
        createdAt
        updatedAt
        name
        formTemplate {
          __typename
          id
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
          position
          description
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
          name
          value
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
          createdAt
          campaign {
            edges {
              node {
                __typename
                id
              }
              __typename
            }
            __typename
          }
          status
          id
          updatedAt
        }
        description
        position
        attachments {
          edges {
            node {
              __typename
              id
              name
              formResponseId
              activity {
                __typename
                id
              }
              formTemplateId
              companyId
              opportunityId
              subspecialty {
                __typename
                id
              }
              subspecialtyId
              id
              segment {
                __typename
                id
              }
              campaign {
                __typename
                id
              }
              createdAt
              opportunity {
                __typename
                id
              }
              messageTemplate {
                __typename
                id
              }
              updatedAt
              formResponse {
                __typename
                id
              }
              specialty {
                __typename
                id
              }
              company {
                __typename
                id
              }
              campaignTrigger {
                __typename
                id
              }
              person {
                __typename
                id
              }
              leadId
              activityId
              author {
                __typename
                id
              }
              campaignTriggerId
              communicationLogId
              authorId
              messageTemplateId
              type
              lead {
                __typename
                id
              }
              communicationLog {
                __typename
                id
              }
              fullPath
              specialtyId
              segmentId
              campaignId
              personId
              formTemplate {
                __typename
                id
              }
            }
            __typename
          }
          __typename
        }
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
}`