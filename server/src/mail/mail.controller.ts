import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service.js';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RequestDto } from './dto/request.dto.js';
import { ContactDto } from './dto/contact.dto.js';
import { Public } from '../common/decorators/public.decorator.js';

@Public()
@ApiTags('Notification')
@ApiInternalServerErrorResponse({
  description: 'Internal server error occurred while sending notification',
})
@Controller('notification')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @ApiOperation({
    summary: 'Request a service',
    description: 'Send a mail request for a specific service',
  })
  @ApiOkResponse({
    description: 'Service request sent successfully',
    type: Object,
    example: {
      message: 'Message received',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data',
  })
  @Post('request-service')
  @HttpCode(HttpStatus.OK)
  requestService(@Body() requestDto: RequestDto) {
    return this.mailService.sendServiceRequest(requestDto);
  }

  @ApiOperation({
    summary: 'Contact form submission',
    description: 'Submit a contact form message to the notification service',
  })
  @ApiOkResponse({
    description: 'Contact form sent successfully',
    type: Object,
    example: {
      message: 'Message received',
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid request data',
  })
  @Post('contact')
  @HttpCode(HttpStatus.OK)
  contact(@Body() contactDto: ContactDto) {
    return this.mailService.sendContactForm(contactDto);
  }
}
