import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'bruce@wayne.com' })
  email: string;

  @ApiProperty({ example: 'senha123' })
  password: string;
}