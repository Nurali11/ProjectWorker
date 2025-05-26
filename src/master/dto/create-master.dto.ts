import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateMasterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the master' })
  @IsString()
  name: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number of the master' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'user@gmail.com', description: 'Email address of the master' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234', description: 'Password for the master account' })
  @IsString()
  password: string;

  @ApiProperty({
    example: [1,2],
    description: 'Products the master is associated with',
  })
  productsId: number[];


  @ApiProperty({ example: true, description: 'Indicates if the master is active' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: 1990, description: 'Year of birth or starting year of the master' })
  @IsNumber()
  year: number;

  @ApiProperty({ example: 1, description: 'Level of the master (e.g., junior, middle, senior)' })
  @IsNumber()
  levelId: number;

  @ApiProperty({ example: 20, description: 'Minimum working hours per day' })
  @IsNumber()
  minWorkingHours: number;

  @ApiProperty({ example: 25, description: 'Hourly price in USD' })
  @IsNumber()
  priceHourly: number;

  @ApiProperty({ example: 200, description: 'Daily price in USD' })
  @IsNumber()
  priceDaily: number;

  @ApiProperty({ example: 5, description: 'Total years of work experience' })
  @IsNumber()
  experience: number;

  @ApiProperty({ example: 'https://example.com/profile.jpg', description: 'URL to the master’s profile image' })
  @IsString()
  image: string;

  @ApiProperty({ example: 'https://example.com/passport.jpg', description: 'URL to the scanned passport image' })
  @IsString()
  passportImage: string;

  @ApiProperty({ example: 'Highly experienced professional in home appliance repair.', description: 'Brief biography or description of the master' })
  @IsString()
  about: string;
}
