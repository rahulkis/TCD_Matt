import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginCmd {
  @ApiProperty() @IsEmail() @IsNotEmpty() readonly email: string;
  @ApiProperty() @IsNotEmpty() readonly password: string;
}

export class ForgotPasswordCmd {
  @ApiProperty() @IsEmail() @IsNotEmpty() readonly email: string;
}

export class VerifyOTPCmd {
  @ApiProperty() @IsEmail() @IsNotEmpty() readonly email: string;
  @ApiProperty() @IsNotEmpty() readonly otp_code: string;
}

export class ResendOTPCmd {
  @ApiProperty() @IsEmail() @IsNotEmpty() readonly email: string;
}
