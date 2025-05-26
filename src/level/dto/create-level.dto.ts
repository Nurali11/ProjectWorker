import { ApiProperty } from "@nestjs/swagger";

export class CreateLevelDto {
    @ApiProperty({
        description: "Name of the level",
        example: "Junior"
    })
    name: string
}
