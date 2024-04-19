import { IsOptional } from 'class-validator';

export class FormDataDTO {
  @IsOptional()
  email: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  name: string;

  @IsOptional()
  weight: string;

  @IsOptional()
  gender: string;

  @IsOptional()
  medicalHistory: string;

  @IsOptional()
  appointmentReason: string;

  @IsOptional()
  height: string;

  @IsOptional()
  appointmentType: string;

  @IsOptional()
  appointmentLocation: string;

  @IsOptional()
  consent: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  lastName: string;

  @IsOptional()
  appointmentDate: Date;
}
