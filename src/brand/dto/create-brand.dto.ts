import { ApiAcceptedResponse, ApiProperty } from "@nestjs/swagger";

export class CreateBrandDto {
    @ApiProperty({
        description: "Name of the brand",
        example: "Nike"
    })
    name: string;
}
