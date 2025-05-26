import { ApiProperty } from "@nestjs/swagger";

export class CreateRegionDto {
    @ApiProperty({
        example: 'Toshkent',
        description: 'The name of the region',
    })
    name: string
}
