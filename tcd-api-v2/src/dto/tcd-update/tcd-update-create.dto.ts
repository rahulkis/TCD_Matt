import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
export class TCDUpdatesCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsOptional()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  is_published: boolean;
}
