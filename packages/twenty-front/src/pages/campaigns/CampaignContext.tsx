import { ReactNode, createContext, useState } from 'react';

import { App } from '~/App';

type CampaignData = {
  campaignName: string;
  campaignDescription: string;
  specialtyType: string;
  subSpecialtyType: string;
  leads: string;
};
export type CampaignContextProps = {
  currentStep: number;
  setCurrentStep: (step: number) => void;

  campaignData: any;

  setCampaignData: (data: any) => void;

  leadData: any;

  setLeadData: any;
};
type CampaignContextProviderProps = {
  children: ReactNode;
};
export const CampaignMultiStepContext =
  createContext<CampaignContextProps | null>(null);

const CampaignContext: React.FC<CampaignContextProviderProps> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [leadData, setLeadData] = useState();
  const [campaignData, setCampaignData] = useState({
    startDate: '',
    endDate: '',
    selectedId: '',
    unSelectedId: '',
    querystamp: '',
    campaignName: '',
    campaignDescription: '',
    targetAudience: '',
    emailTemplate: '',
    whatsappTemplate: '',
    pageUrl: '',
    reload: false,
  });

  return (
    <div>
      <CampaignMultiStepContext.Provider
        value={{
          currentStep,
          setCurrentStep,
          campaignData,
          setCampaignData,
          leadData,
          setLeadData,
        }}
      >
        <App />
      </CampaignMultiStepContext.Provider>
    </div>
  );
};

export default CampaignContext;
