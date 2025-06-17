export class AddQuestionDto {
  text: string;
  timeLimit: number;
  image?: string;
  options: {
    text: string;
    isCorrect: boolean;
    color: string;
  }[];
}
