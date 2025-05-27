import { ApiProperty } from "@nestjs/swagger";

export class CreatePartnerDto {
    @ApiProperty({
    description: 'Name of the partner in Uzbek language',
    example: 'Hamkor nomi O\'zbekcha'
    })
    name_uz: string;

    @ApiProperty({
    description: 'Name of the partner in Russian language',
    example: 'Название партнера на русском'
    })
    name_ru: string;

    @ApiProperty({
    description: 'Name of the partner in English language',
    example: 'Partner name in English'
    })
    name_en: string;

    @ApiProperty({
    description: 'Description of the partner in Uzbek language',
    example: 'image.png'
    })
    image: string;
}
