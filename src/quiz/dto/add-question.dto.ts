import { IsString, IsInt, IsOptional, ValidateNested, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
class OptionDto {
  @IsString()
  text: string;

  @IsBoolean()
  isCorrect: boolean;

  @IsString()
  color: string;
}
export class AddQuestionDto {
  @IsString()
  text: string;

  @IsInt()
  timeLimit: number;

  @IsOptional()
  @IsString()
  image?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options: OptionDto[];
}