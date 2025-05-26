import { ApiProperty } from "@nestjs/swagger";

export class CreateToolDto {
    @ApiProperty({
        description: "Name of the tool",
        example: "Hammer"
    })
    name: string

    @ApiProperty({
        description: "Description of the tool",
        example: "A tool for hammering nails"
    })
    description: string

    @ApiProperty({
        description: "Price of the tool",
        example: "35000"
    })    
    price: number


    @ApiProperty({
        description: "Quantity of the tool",
        example: "10"
    })
    quantity: number
    

    @ApiProperty({
        description: "Image of the tool",
        example: "https://example.com/image.jpg"
    })
    image: string

    @ApiProperty({
        description: "Capacity of the tool",
        example: 1
    })
    capacityId: number


    @ApiProperty({
        description: "Size of the tool",
        example: 1
    })
    sizeId: number

    @ApiProperty({
        description: "Brand of the tool",
        example: 1
    })
    brandId: number
}
