import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "src/error/notFound.error";
import { IDayRepository } from "src/repository/interfaces/IDayRepository";
import { DayModel } from "src/repository/models/day.model";

@Injectable()
export class DayService {
  @Inject("dayRepository")
  private readonly dayRepository: IDayRepository;

  async getDay(dayId: string): Promise<DayModel | never> {
    const day = await this.dayRepository.getDay(dayId);
    if (!day) {
      throw new NotFoundError(`Day id: ${dayId} does not exist.`);
    }
    return day;
  }

  async getDays(): Promise<DayModel[]> {
    return await this.dayRepository.getDays();
  }
}
