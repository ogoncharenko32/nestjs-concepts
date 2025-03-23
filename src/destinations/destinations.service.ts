import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { updateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createDestinationDto: CreateDestinationDto) {
    return this.prisma.destination.create({
      data: {
        ...createDestinationDto,
        travelDate: new Date(createDestinationDto.travelDate).toISOString(),
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.destination.findMany({
      where: {
        userId,
      },
    });
  }

  async finOne(userId: number, id: number) {
    const destination = await this.prisma.destination.findFirst({
      where: {
        userId,
        id,
      },
    });
    if (!destination) {
      throw new NotFoundException(`Destination not found with id: ${id}`);
    }
    return destination;
  }

  async removeDestination(userId: number, id: number) {
    const destination = await this.prisma.destination.findFirst({
      where: {
        userId,
        id,
      },
    });
    if (!destination) {
      throw new NotFoundException(`Destination not found with id: ${id}`);
    }
    return this.prisma.destination.delete({
      where: {
        id,
      },
    });
  }

  async updateDestination(
    userId: number,
    id: number,
    updateDestinationDto: updateDestinationDto,
  ) {
    const destination = await this.prisma.destination.findFirst({
      where: {
        userId,
        id,
      },
    });
    if (!destination) {
      throw new NotFoundException(`Destination not found with id: ${id}`);
    }
    return this.prisma.destination.update({
      where: {
        id,
      },
      data: {
        ...updateDestinationDto,
      },
    });
  }
}
