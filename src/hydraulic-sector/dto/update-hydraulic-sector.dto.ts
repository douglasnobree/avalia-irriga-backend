import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateHydraulicSectorDto } from './create-hydraulic-sector.dto';

export class UpdateHydraulicSectorDto extends PartialType(CreateHydraulicSectorDto) {}