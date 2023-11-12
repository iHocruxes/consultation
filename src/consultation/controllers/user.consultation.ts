import { Body, Controller, Patch, Post, Get, UseGuards, Req, Inject, Delete, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { ConsultationService } from "../services/consultation.service";
import { UserGuard } from "../../auth/guards/user.guard";
import { BookConsultation } from "../dto/consultation.dto";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";

@ApiTags('USER CONSULTATION')
@Controller()
export class UserConsultation {

    constructor(
        private readonly consultationService: ConsultationService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly amqpConnection: AmqpConnection,
    ) { }

    @UseGuards(UserGuard)
    @ApiOperation({ summary: 'Khách hàng đặt 1 cuộc hẹn với bác sĩ' })
    @ApiBearerAuth()
    @Post()
    async bookConsultation(
        @Body() dto: BookConsultation,
        @Req() req
    ) {
        // const amqp = fetch()
        const working_time = await this.amqpConnection.request<string>({
            exchange: 'healthline.consultation.schedule',
            routingKey: 'schedule',
            payload: {
                doctor: dto.doctor_id,
                date: dto.date,
            },
            timeout: 10000
        })
        return await this.consultationService.bookConsultation(req.user.id, dto, working_time)
    }

    @UseGuards(UserGuard)
    @ApiOperation({ summary: 'Khách hàng hủy cuộc hẹn khi cuộc hẹn đang trong trạng thái pending' })
    @ApiBearerAuth()
    @Delete(':consultation_id')
    async cancelConsultation(
        @Param('consultation_id') consultation_id: string,
        @Req() req
    ) {
        return await this.consultationService.cancelConsultation(req.user.id, consultation_id)
    }
}