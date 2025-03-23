import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { updateDestinationDto } from './dto/update-destination.dto';

@Controller('destinations')
@UseGuards(JwtAuthGuard)
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Post()
  create(@Request() req, @Body() createDestinationDto: CreateDestinationDto) {
    return this.destinationsService.create(
      req.user.userId,
      createDestinationDto,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.destinationsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.destinationsService.finOne(req.user.userId, +id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDestinationDto: updateDestinationDto,
  ) {
    return this.destinationsService.updateDestination(
      req.user.userId,
      +id,
      updateDestinationDto,
    );
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.destinationsService.removeDestination(req.user.userId, +id);
  }
}
