import { PartialType } from '@nestjs/mapped-types';
import { CreateDestinationDto } from './create-destination.dto';

export class updateDestinationDto extends PartialType(CreateDestinationDto) {}
