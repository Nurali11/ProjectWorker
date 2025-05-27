import { ApiProperty } from "@nestjs/swagger";

export class CreateGeneralinfoDto {
    @ApiProperty({
        description: 'Email of the company',
        example: 'arbait@gmail.com'
    })
    email: string

    @ApiProperty({
        description: 'Links of the company',
        example: ['https://arbait.com', 'https://arbait.com/about']
    })
    links: string[]

    @ApiProperty({
        description: 'Phones of the company',
        example: ['+998901234567', '+998901234568']
    })
    phones: string[]
}
