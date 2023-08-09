import { PartialType } from '@nestjs/swagger';
import { CreatePartnerapiDto } from './create-partnerapi.dto';

export class UpdatePartnerapiDto extends PartialType(CreatePartnerapiDto) {}
