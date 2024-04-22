import { gql } from '@apollo/client';
export const ADD_SEGMENT = gql`
mutation CreateOneSegment($input: SegmentCreateInput!) {
  createSegment(data: $input) {
    id
  }
}`;