import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';
import { UserCharacter } from '../enums/user-character.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Tony Stark' })
  name: string;

  @ApiProperty({ example: 'ironman@stark.com' })
  email: string;

  @ApiProperty({ example: 'senha123' })
  password: string;

  @ApiProperty({ enum: UserCharacter, example: UserCharacter.IRONMAN })
  character: UserCharacter;

  @ApiProperty({ enum: UserRole, example: UserRole.USER, required: false })
  role: UserRole;
}