import { Inject, Injectable } from "@nestjs/common";
import { BadRequestError } from "src/error/badRequest.error";
import { ITimeRepository } from "src/repository/interfaces/ITimeRepository";
import { TimeModel } from "src/repository/models/time.model";

@Injectable()
export class TimeService {
  @Inject("timeRepository")
  private readonly timeRepository: ITimeRepository;

  async getTimeById(timeId: string): Promise<TimeModel | never> {
    const time = await this.timeRepository.getTimeById(timeId);
    if (!time) {
      throw new BadRequestError(`Time data specified by Time id: ${timeId} was not found`);
    }
    return time;
  }

  async getTimes(): Promise<TimeModel[]> {
    return await this.timeRepository.getTimes();
  }
}
