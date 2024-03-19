import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class GetAllCommunicationInterface {
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  page?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  limit?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  sortBy?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  sortOrder?: string = 'ASC';

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  fetchAll: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  keyword?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  message_type?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  status: string;

  @IsOptional()
  @ApiProperty({ required: false })
  date: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  communicationable_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  communicationable_type: string;
}

export class SendEmailDto {
  @IsNotEmpty({ message: 'Template id is required' })
  @ApiProperty({ required: true })
  templateId: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  dsid: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  email: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  personalizationTags: any;
}

export class GetCampaignId {
  // @IsNotEmpty({message: "Campaign Id is required"})
  @ApiProperty({ required: false })
  campaignId: number;
}
