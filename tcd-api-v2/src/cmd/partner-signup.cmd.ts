import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class PartnerSignupCmd {
  @ApiProperty() @IsEmail() @IsNotEmpty() readonly email: string;
  @ApiProperty() @IsNotEmpty() readonly password: string;
  @ApiProperty() @IsNotEmpty() readonly full_name: string;
}

export class PartnerUpdateSettingCmd {
  @ApiProperty() readonly full_name: string;
  @ApiProperty() readonly email: string;
  @ApiProperty() readonly password: string;
  @ApiProperty() readonly company_name: string;
  @ApiProperty() readonly company_email: string;
  @ApiProperty() readonly company_phone: number;
  @ApiProperty() readonly company_email_invoice: string;
  @ApiProperty() readonly company_address: string;
  @ApiProperty() readonly company_zipcode: number;
  @ApiProperty() readonly company_state: string;
  @ApiProperty() readonly company_country: string;
}

export class TopProductsCmd {
  @ApiProperty() readonly page: number;
  @ApiProperty() readonly perPageRecord: number;
  @ApiProperty() readonly from: Date;
  @ApiProperty() readonly to: Date;
}
export class ProductsFilterCmd {
  @ApiProperty() readonly page: number;
  @ApiProperty() readonly perPageRecord: number;
  @ApiProperty() readonly searchValue: string;
  @ApiProperty() readonly id: string;
}
export class TopEffectsCmd {
  @ApiProperty() readonly from: Date;
  @ApiProperty() readonly to: Date;
}
