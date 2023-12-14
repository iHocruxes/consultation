import { Body, Controller, Param, Post, Get, UseGuards, Req, Inject, Delete } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { ConsultationService } from "../services/consultation.service";
import { DoctorGuard } from "../../auth/guards/doctor.guard";
import { Status } from "../../config/enum.constants";
import { Admin } from "typeorm";
import { AdminGuard } from "src/auth/guards/admin.guard";
import * as uuid from 'uuid-random'

@ApiTags('DOCTOR CONSULTATION')
@Controller('doctor')
export class DoctorConsultation {
    constructor(
        private readonly consultationService: ConsultationService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    @UseGuards(DoctorGuard)
    @ApiOperation({ summary: 'Bác sĩ xác nhận cuộc hẹn của khách hàng' })
    @ApiBearerAuth()
    @Post(':consultation_id')
    async confirmConsultation(
        @Param('consultation_id') consultation_id: string,
        @Req() req
    ) {
        const data = await this.consultationService.doctorConsultation(req.user.id, consultation_id, Status.confirmed)
        return {
            data: data,
            message: 'consultation_confirmed'
        }
    }

    @UseGuards(DoctorGuard)
    @ApiOperation({ summary: 'Bác sĩ từ chối cuộc hẹn của khách hàng' })
    @ApiBearerAuth()
    @Delete(':consultation_id')
    async denyConsultation(
        @Param('consultation_id') consultation_id: string,
        @Req() req
    ) {
        const data = await this.consultationService.doctorConsultation(req.user.id, consultation_id, Status.denied)
        return {
            data: data,
            message: 'consultation_denied'
        }
    }

    @UseGuards(DoctorGuard)
    @ApiOperation({ summary: 'Bác sĩ từ chối cuộc hẹn của khách hàng' })
    @ApiBearerAuth()
    @Delete(':consultation_id')
    async finishedConsultation(
        @Param('consultation_id') consultation_id: string,
        @Req() req
    ) {
        const data = await this.consultationService.doctorConsultation(req.user.id, consultation_id, Status.finished)
        return {
            data: data,
            message: 'consultation_finished'
        }
    }

    @UseGuards(DoctorGuard)
    @ApiBearerAuth()
    @Get('information/:doctor_id')
    async constUserByDoctorConsultation(
        @Param('doctor_id') doctor_id: string,
    ) {
        return await this.consultationService.countUserByDoctorConsultation(doctor_id)
    }

    @UseGuards(AdminGuard)
    @ApiBearerAuth()
    @Get('consultation/dashboard')
    async consultationDashboard() {
        return await this.consultationService.consultationDashboard()
    }

    @UseGuards(AdminGuard)
    @ApiBearerAuth()
    @Get('consultation/chart')
    async consultationChart() {
        return await this.consultationService.consultationChart()
    }

    @UseGuards(AdminGuard)
    @ApiBearerAuth()
    @Get('consultation/money')
    async moneyDashboard() {
        return await this.consultationService.moneyDashboard()
    }

    @UseGuards(AdminGuard)
    @ApiBearerAuth()
    @Get('consultation/money/chart')
    async moneyChart() {
        return await this.consultationService.moneyChart()
    }

    @UseGuards(AdminGuard)
    @ApiBearerAuth()
    @Get('consultation/money/chart/:doctorId')
    async moneyChartByDoctorId(@Param('doctorId') doctorId: string) {
        return await this.consultationService.moneyChartByDoctorId(doctorId)
    }

    @UseGuards(DoctorGuard)
    @ApiBearerAuth()
    @Post('gen-consultation')
    async genConsultation() {
        return this.consultationService.generate({
            id: uuid(),
            name: "healthlinemanager2023",
            email: "healthlinemanager2023@gmail.com",
            avatar: "",
            appId: "vpaas-magic-cookie-fd0744894f194f3ea748884f83cec195",
            kid: "vpaas-magic-cookie-fd0744894f194f3ea748884f83cec195/96e059",
            time: 20,
        });
    }
}