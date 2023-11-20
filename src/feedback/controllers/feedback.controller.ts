import { Body, Controller, Patch, Post, Get, UseGuards, Req, Inject, Delete, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserGuard } from "../../auth/guards/user.guard";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { FeedbackService } from "../services/feedback.service";
import { UserFeedbackDto } from "../dto/feedback.dto";

@ApiTags('FEEDBACK')
@Controller('feedback')
export class FeedbackController {

    constructor(
        private readonly feedbackService: FeedbackService,
    ) { }

    @UseGuards(UserGuard)
    @ApiOperation({ summary: 'Khách hàng khảo sát sau cuộc hẹn' })
    @ApiBearerAuth()
    @Post()
    async bookConsultation(
        @Body() dto: UserFeedbackDto,
        @Req() req
    ) {
        return await this.feedbackService.userFeedback(req.user.id, dto)
    }
}