import { ApiProperty } from "@nestjs/swagger";

export class CreateContactDto {
    @ApiProperty({
        description: 'Name of the contact person',
        example: 'John Doe'
    })
    name: string;

    @ApiProperty({
        description: 'Phone number of the contact person',
        example: '+998901234567'
    })
    phone: string;

    @ApiProperty({
        description: 'Address of the contact person',
        example: '123 Main St, Tashkent, Uzbekistan'
    })
    address: string;

    @ApiProperty({
        description: 'Email of the contact person',
        example: 'user@gmail.com'
    })
    email: string;
}
