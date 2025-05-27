import { ApiProperty } from "@nestjs/swagger";

export class CreateFaqDto {
    @ApiProperty({
    description: 'The question to be added to the FAQ',
    example: 'What is the purpose of this application?'
    })
    question: string;

    @ApiProperty({
    description: 'The answer to the question in the FAQ',
    example: 'This application is designed to help users manage their tasks efficiently.'
    })
    answer: string;
}
