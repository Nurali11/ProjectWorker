import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MailService {
    constructor(
        private readonly prisma: PrismaService
    ){}
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            pass: 'pkft jpwd jfjw curu',
            user: 'boltaboyevnurali218@gmail.com'
        },
        tls: {
            rejectUnauthorized: false 
          }
    })

    async sendMail(to: string, subject: string, text: string) {
        try {
            await this.transporter.sendMail({
                to,
                subject,
                text,
                html: `
                <h1>Verify your email</h1>
                <h2>Your otp ${text}</h2>`
            })
            console.log('successfully sent')
        } catch (error) {
            console.log(error);
            
            return error
        }
    }

    async workerFound(to: string, subject: string, text: string) {
        try {
            const data = JSON.parse(text)
            await this.transporter.sendMail({
                to,
                subject,
                text,
                html: `
                <h1>We found a suitable worker for your order. 👷‍♀️</h1>
                <h1Master:</h2>
                <h2>Name: ${data.name}</h2>
                <h2>Email: ${data.email}</h2>
                <h2>Phone: ${data.phone}</h2>
                <h2>Level: ${(await this.prisma.level.findFirst({where: {id: data.levelId}}))?.name}</h2>
                <h2>Year: ${data.year}</h2>
                <h2>Experience: ${data.experience}</h2>
                <h2>Pirce-Hourly: ${data.priceHourly}</h2>
                <h2>Price-Daily: ${data.priceDaily}</h2>
                <h2>About: ${data.about}</h2>
                `
            })
            console.log('successfully sent')
        } catch (error) {
            console.log(error);
            
            return error
        }
    }
}
