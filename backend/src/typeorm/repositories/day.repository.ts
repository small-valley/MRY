import { InjectRepository } from "@nestjs/typeorm";
import { IDayRepository } from "src/repository/interfaces/IDayRepository";
import { DayModel } from "src/repository/models/day.model";
import { Repository } from "typeorm";
import { Day } from "../entities/day.entity";

export class DayRepository implements IDayRepository {
  constructor(
    @InjectRepository(Day)
    private dayRepository: Repository<Day>
  ) {}

  async getDay(dayId: string): Promise<DayModel | null> {
    return await this.dayRepository.findOne({
      where: { id: dayId, isDeleted: false },
      select: ["id", "hoursPerWeek"],
    });
  }

  async getDays(): Promise<DayModel[]> {
    return await this.dayRepository.find({
      where: { isDeleted: false },
      select: ["id", "name"],
    });
  }
}
