import { ModalWrapper } from '@/spreadsheet-import/components/ModalWrapper';
import { Providers } from '@/spreadsheet-import/components/Providers';
import { Steps } from '@/spreadsheet-import/steps/components/Steps';
import { SpreadsheetImportDialogOptions as SpreadsheetImportProps } from '@/spreadsheet-import/types';

export const defaultSpreadsheetImportProps: Partial<
  SpreadsheetImportProps<any>
> = {
  autoMapHeaders: true,
  allowInvalidSubmit: true,
  autoMapDistance: 2,
  uploadStepHook: async (value) => value,
  selectHeaderStepHook: async (headerValues, data) => ({
    headerRow: headerValues,
    importedRows: data,
  }),
  matchColumnsStepHook: async (table) => table,
  dateFormat: 'yyyy-mm-dd', // ISO 8601,
  parseRaw: true,
  selectHeader: false,
  maxRecords: 2000,
} as const;

export const SpreadsheetImport = <T extends string>(
  props: SpreadsheetImportProps<T>,
) => {
  return (
    <Providers values={props}>
      <ModalWrapper isOpen={props.isOpen} onClose={props.onClose}>
        <Steps />
      </ModalWrapper>
    </Providers>
  );
};

SpreadsheetImport.defaultProps = defaultSpreadsheetImportProps;
