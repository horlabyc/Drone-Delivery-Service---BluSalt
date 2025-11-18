import { In } from "typeorm";
import { AppDataSource } from "../config/database";
import { Medication } from "../entities/medication";

export class MedicationRepository { 
  private repository = AppDataSource.getRepository(Medication);

  async findByIds(ids: string[]): Promise<Medication[]> {
    return await this.repository.findBy({ id: In(ids) })
  }
}