import { ApiProperty } from "@nestjs/swagger";

export class CreateCapacityDto {
    @ApiProperty({
        description: "Name of the capacity",
        example: "1000"
    })
    name: string
}
