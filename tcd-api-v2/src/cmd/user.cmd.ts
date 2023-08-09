import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignupCmd {
  @ApiProperty() @IsEmail() @IsNotEmpty() readonly email: string;
  @ApiProperty() @IsNotEmpty() readonly password: string;
  @ApiProperty() @IsNotEmpty() readonly dob: Date;
  @ApiProperty() readonly state: number;
  @ApiProperty() readonly country: number;
  @ApiProperty() readonly contact_no: number;
  @ApiProperty() readonly activity_level: number;
  @ApiProperty() readonly full_name: string;
  @ApiProperty() readonly gender: string;
  @ApiProperty() readonly device_type: number;
  @ApiProperty() readonly zipcode: number;
  @ApiProperty() readonly device_push_key: string;
  @ApiProperty() readonly device_id: string;
  @ApiProperty() readonly cannabis_consumption: string;
  @ApiProperty() readonly consumption_reason: string;
  @ApiProperty() readonly physique: string;
  @ApiProperty() readonly height: string;
  @ApiProperty() readonly height_scale: string;
  @ApiProperty() readonly weight: string;
  @ApiProperty() readonly weight_scale: string;
  @ApiProperty() readonly symptoms: Array<string>;
  @ApiProperty() readonly effects: Array<string>;
  @ApiProperty() readonly activities: Array<string>;
  @ApiProperty() readonly conditions: Array<string>;
  @ApiProperty() readonly favourite_strains: string;
  @ApiProperty() readonly cannabinoids: Array<string>;
}

export class LoginCmd {
  @ApiProperty() @IsEmail() @IsNotEmpty() readonly email: string;
  @ApiProperty() @IsNotEmpty() readonly password: string;
  @ApiProperty() readonly device_push_key: string;
  @ApiProperty() readonly device_id: string;
  @ApiProperty() readonly device_type: number;
}
export class ContactCmd {
  @ApiProperty() @IsEmail() @IsNotEmpty() readonly email: string;
  @ApiProperty() @IsNotEmpty() readonly topic: string;
  @ApiProperty() @IsNotEmpty() readonly issue: string;
}
export class MarkFavouriteVideoCmd {
  @ApiProperty() @IsNotEmpty() readonly video_id: string;
  @ApiProperty() @IsNotEmpty() readonly is_favourite: number;
}
export class AddVideoCommentCmd {
  @ApiProperty() @IsNotEmpty() readonly video_id: string;
  @ApiProperty() @IsNotEmpty() readonly comment: string;
}
export class CommunityQuestionCmd {
  @ApiProperty() @IsNotEmpty() readonly question: string;
  @ApiProperty() @IsNotEmpty() readonly category_id: string;
}
export class MarkFavouriteCommunityQuestionCmd {
  @ApiProperty() @IsNotEmpty() readonly question_id: string;
  @ApiProperty() @IsNotEmpty() readonly is_favourite: number;
}
export class MarkPublicEntryCmd {
  @ApiProperty() @IsNotEmpty() readonly entry_id: string;
  @ApiProperty() @IsNotEmpty() readonly is_public: number;
}
export class MarkFavouriteEntryCmd {
  @ApiProperty() @IsNotEmpty() readonly entry_id: string;
  @ApiProperty() @IsNotEmpty() readonly is_favourite: number;
}
export class ReviewEntryCmd {
  @ApiProperty() @IsNotEmpty() readonly entry_id: string;
  @ApiProperty() @IsNotEmpty() readonly ratings: number;
}

export class BlockPublicEntryCmd {
  @ApiProperty() @IsNotEmpty() readonly user_id: string;
}

export class UpdateSettingsCmd {
  @ApiProperty() readonly is_on: number;
  @ApiProperty() readonly reminder_interval: number;
  @ApiProperty() readonly twoFA_is_on: number;
  @ApiProperty() readonly get_tcd_update: number;
}

export class saveCompleteEntryCmd {}
export class CreateProductCmd {
  @ApiProperty() @IsNotEmpty() readonly name: string;
  @ApiProperty() readonly product_type: string;
  @ApiProperty() readonly weight: string;
  @ApiProperty() readonly strain: string;
  @ApiProperty() readonly COA_identifier: string;
  @ApiProperty() readonly description: string;
  @ApiProperty() readonly chemical_compounds: any;
}
export class GetPublicEntiresCmd {
  @ApiProperty() readonly search_text: string;
  @ApiProperty() readonly is_public: number;
  @ApiProperty() readonly user: string;
  @ApiProperty() readonly product: string;
  @ApiProperty() readonly ratings: number;
  @ApiProperty() readonly page: number;
  @ApiProperty() readonly search_date_from: Date;
  @ApiProperty() readonly search_date_to: Date;
}

export class AddEntryCommentCmd {
  @ApiProperty() @IsNotEmpty() readonly entry_id: string;
  @ApiProperty() @IsNotEmpty() readonly comment: string;
}
export class GetAllEntriesCmd {
  @ApiProperty() readonly search_text: string;
  @ApiProperty() readonly ratings: string;
  @ApiProperty() readonly is_public: number;
  @ApiProperty() readonly page: number;
  @ApiProperty() readonly search_date_to: Date;
  @ApiProperty() readonly search_date_from: Date;
}

export class ActivateAccountCmd {
  @ApiProperty() @IsNotEmpty() readonly email: string;
}

export class FingerPrintLoginCmd {
  @ApiProperty() @IsNotEmpty() readonly device_id: string;
  @ApiProperty() @IsNotEmpty() readonly device_type: number;
  @ApiProperty() @IsNotEmpty() readonly device_push_key: string;
}
export class ReportPublicEntryCmd {
  @ApiProperty() @IsNotEmpty() readonly entry_id: string;
  @ApiProperty() @IsNotEmpty() readonly comment: string;
  @ApiProperty() @IsNotEmpty() readonly reason_id: string;
}
export class ReportQuestionCmd {
  @ApiProperty() @IsNotEmpty() readonly question_id: string;
  @ApiProperty() @IsNotEmpty() readonly comment: string;
  @ApiProperty() @IsNotEmpty() readonly reason_id: string;
}
export class CommunityCommentCmd {
  @ApiProperty() @IsNotEmpty() readonly question_id: string;
  @ApiProperty() @IsNotEmpty() readonly comment: string;
}
export class TwoFACodeCmd {
  @ApiProperty() @IsNotEmpty() readonly twoFA_code: string;
}

export class ReportSpamCmd {
  @ApiProperty() @IsNotEmpty() readonly video_id: string;
  @ApiProperty() @IsNotEmpty() readonly comment_id: string;
  @ApiProperty() @IsNotEmpty() readonly reason_id: string;
}

export class GetActivityGraphDataCmd {
  @ApiProperty() @IsNotEmpty() readonly activity_id: string;
  @ApiProperty() @IsNotEmpty() readonly month: number;
}
export class GetEffectGraphDataCmd {
  @ApiProperty() @IsNotEmpty() readonly effect_id: string;
  @ApiProperty() @IsNotEmpty() readonly month: number;
}
