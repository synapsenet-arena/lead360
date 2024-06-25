import { gql } from '@apollo/client';

export const GET_SEGMENT_LISTS = gql`
query FindManySegments($filter: SegmentFilterInput, $orderBy: [SegmentOrderByInput], $lastCursor: String, $limit: Int) {
    segments(
      filter: $filter
      orderBy: $orderBy
      first: $limit
      after: $lastCursor
    ) {
      edges {
        node {
          id
          description
          filters
          name
        }
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