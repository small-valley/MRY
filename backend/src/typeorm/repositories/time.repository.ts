import { InjectRepository } from "@nestjs/typeorm";
import { ITimeRepository } from "src/repository/interfaces/ITimeRepository";
import { TimeModel } from "src/repository/models/time.model";
import { Repository } from "typeorm";
import { Time } from "../entities/time.entity";

export class TimeRepository implements ITimeRepository {
  constructor(
    @InjectRepository(Time)
    private timeRepository: Repository<Time>
  ) {}

  async getTimeById(timeId: string): Promise<TimeModel | null> {
    return await this.timeRepository.findOne({
      where: { id: timeId, isDeleted: false },
    });
  }

  async getTimes(): Promise<TimeModel[]> {
    return await this.timeRepository.find({
      where: { isDeleted: false },
      select: ["id", "name"],
    });
  }
}
