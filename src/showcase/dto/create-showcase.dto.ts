import { ApiProperty } from "@nestjs/swagger";

export class CreateShowcaseDto {
    @ApiProperty({
    description: 'Name of the showcase in Uzbek language',
    example: 'Ko\'rgazma nomi O\'zbekcha'
    })
    name_uz: string;

    @ApiProperty({
    description: 'Name of the showcase in Russian language',
    example: 'Название витрины на русском'
    })
    name_ru: string;

    @ApiProperty({
    description: 'Name of the showcase in English language',
    example: 'Showcase name in English'
    })
    name_en: string;

    @ApiProperty({
    description: 'Description of the showcase in Uzbek language',
    example: 'Ko\'rgazma haqida ma\'lumot O\'zbekcha'
    })
    description_uz: string;

    @ApiProperty({
    description: 'Description of the showcase in Russian language',
    example: 'Описание витрины на русском'
    })
    description_ru: string;

    @ApiProperty({
    description: 'Description of the showcase in English language',
    example: 'Description of the showcase in English'
    })
    description_en: string;

    @ApiProperty({
    description: 'Image URL of the showcase',
    example: 'https://example.com/image.png'
    })
    image: string;

    @ApiProperty({
    description: 'Link to the showcase',
    example: 'https://example.com/showcase'
    })
    link: string;
}
