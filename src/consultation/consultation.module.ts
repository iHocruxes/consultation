import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Consultation } from './entities/consultation.entity';
import { User } from './entities/user.entity';
import { UserConsultation } from './controllers/user.consultation';
import { DoctorConsultation } from './controllers/doctor.consultation';
import { ConsultationService } from './services/consultation.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import * as dotenv from 'dotenv'
import { ConsultationConsumer } from './consumers/consultation.consumer';
import { Discount } from '../discount/entities/discount.entity';
import { ScheduleModule } from '@nestjs/schedule';

dotenv.config()

@Module({
    imports: [
        TypeOrmModule.forFeature([Doctor, Consultation, User, Discount]),
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: 'healthline.consultation.schedule',
                    type: 'direct',
                },
                {
                    name: 'healthline.doctor.information',
                    type: 'direct'
                },
                {
                    name: 'healthline.user.information',
                    type: 'direct'
                },
            ],
            uri: process.env.RABBITMQ_URL,
            connectionInitOptions: { wait: true, reject: true, timeout: 10000 },
        }),
        ScheduleModule.forRoot()
    ],
    controllers: [
        UserConsultation,
        DoctorConsultation
    ],
    providers: [
        ConsultationService,
        ConsultationConsumer
    ]
})
export class ConsultationModule { }
