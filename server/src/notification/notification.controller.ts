import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import {
  ContactNotificationDto,
  RequestNotificationDto,
} from './dto/notification.dto';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiInternalServerErrorResponse({
  description: 'Internal server error occurred while sending notification',
})
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({
    summary: 'Request a notification service',
    description: 'Send a notification request for a specific service',
  })
  @ApiOkResponse({
    description: 'Notification request sent successfully',
    type: Object,
    example: {
      message: '250 Message received',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data',
  })
  @Post('request-service')
  @HttpCode(HttpStatus.OK)
  requestService(@Body() requestNotificationDto: RequestNotificationDto) {
    return this.notificationService.requestService(requestNotificationDto);
  }

  @ApiOperation({
    summary: 'Contact form submission',
    description: 'Submit a contact form message to the notification service',
  })
  @ApiOkResponse({
    description: 'Contact form sent successfully',
    type: Object,
    example: {
      message: '250 Message received',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data',
  })
  @Post('contact')
  @HttpCode(HttpStatus.OK)
  contact(@Body() contactNotificationDto: ContactNotificationDto) {
    return this.notificationService.contact(contactNotificationDto);
  }
}
