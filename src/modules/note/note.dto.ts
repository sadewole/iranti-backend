import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsISO8601,
  IsEnum,
} from 'class-validator';
import { RecurTypes } from 'src/entities/note.entity';

export class CreateNoteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUUID()
  clusterId?: string;

  @ApiProperty({ default: new Date().toISOString(), required: false })
  @IsISO8601()
  @IsOptional()
  reminderTime?: string;

  @ApiProperty({ enum: RecurTypes, required: false })
  @IsEnum(RecurTypes)
  @IsOptional()
  recurrencePattern?: RecurTypes;
}

export class CreateClusterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateClusterDto extends PartialType(CreateClusterDto) {}
export class UpdateNoteDto extends PartialType(CreateNoteDto) {}
