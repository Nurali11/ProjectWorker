import { ApiProperty } from "@nestjs/swagger";

export class CreateSizeDto {
    @ApiProperty({
        description: "Size",
        example: "10x15"
    })
    name: string
}
