import { atom } from 'recoil';

interface CheckboxState {
  [key: string]: boolean;
}
interface AllLeadId {
  [key: string]: boolean;
}

interface LeadNode {
  id: string;
  [key: string]: any;
}

interface LeadEdge {
  node: LeadNode;
}

export const leadsDataState = atom<LeadEdge[]>({
  key: 'leadsData',
  default: [],
});

export const totalLeadsCountState = atom<number>({
  key: 'totalLeadsCount',
  default: 0,
});

export const cursorState = atom<string | null>({
  key: 'cursor',
  default: null,
});

export const loadingState = atom<boolean>({
  key: 'loading',
  default: false,
});

export const selectedIDState = atom<Set<string>>({
  key: 'selectedID',
  default: new Set(),
});

export const unselectedIDState = atom<Set<string>>({
  key: 'unSelectedID',
  default: new Set(),
});

export const checkboxState = atom<CheckboxState>({
  key: 'checkbox',
  default: {},
});

export const filterState = atom<Record<string, any>>({
  key: 'filterStare',
  default: {},
});

export const opportunitesLeadIdsState = atom<Set<string>>({
  key: 'opportunitesLeadIdsState',
  default: new Set(),
});

export const isCheckedState = atom<boolean>({
  key: 'isCheckedState',
  default: true,
});

export const allLeadId: AllLeadId = {};
