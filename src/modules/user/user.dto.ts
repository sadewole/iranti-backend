import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(5, { message: 'Password must be at least 5 characters' })
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  code: string;
}
