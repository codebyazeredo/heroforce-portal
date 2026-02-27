import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectGoalsDto {
  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  agility: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(0)
  enchantment: number;

  @ApiProperty({ example: 8 })
  @IsNumber()
  @Min(0)
  efficiency: number;

  @ApiProperty({ example: 12 })
  @IsNumber()
  @Min(0)
  excellence: number;

  @ApiProperty({ example: 7 })
  @IsNumber()
  @Min(0)
  transparency: number;

  @ApiProperty({ example: 9 })
  @IsNumber()
  @Min(0)
  ambition: number;
}