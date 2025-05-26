import { ApiProperty } from "@nestjs/swagger"
import { Roles } from "@prisma/client"
import { IsEmail, IsString, Length } from "class-validator"

export class    CreateUserDto {
    @ApiProperty({
        description: "Name of the user",
        example: "John Doe"
    })
    @IsString()
    name: string

    @ApiProperty({
        description: "Phone number of the user",
        example: "+123456789012"
    })
    @IsString()
    @Length(13)
    phone: string

    @ApiProperty({
        description: "Email of the user",
        example: "user@gmail.com"
    })
    @IsEmail()
    @IsString()
    email: string

    @ApiProperty({
        description: "Password of the user",
        example: "1234"
    })
    @IsString()
    password: string

    @ApiProperty({
        description: "Region ID of the user",
        example: "1"
    })
    regionId: number
}

export class LoginDto {
    @ApiProperty({
        description: "Email of the user",
        example: "user@gmail.com"
    })
    @IsString()
    @IsEmail()
    email: string

    @ApiProperty({
        description: "Password of the user",
        example: "1234"
    })
    @IsString()
    password: string
}

export class ResetDto {
    @ApiProperty({
        description: "New password of the user",
        example: "12345"
    })
    @IsString()
    new_password: string
}

export class RegisterEmail {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'User\'s email address',
  })
  @IsEmail()
  email: string;
}

export class VerifyEmail {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'User\'s email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345',
    description: 'Verification code (OTP) sent to the email address',
  })
  @IsString()
  @Length(5, 5, { message: 'The OTP must be exactly 5 characters long' })
  otp: string;
}

export class ResendOtp {
    @ApiProperty({
        example: 'user@gmail.com',
        description: 'User\'s email address',
    })
    email: string
}