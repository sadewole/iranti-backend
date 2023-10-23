import { ApiProperty } from '@nestjs/swagger';

export class LocalAuthDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
