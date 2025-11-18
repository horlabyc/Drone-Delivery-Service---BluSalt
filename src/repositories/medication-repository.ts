import { Brackets, In } from "typeorm";
import { AppDataSource } from "../config/database";
import { Medication } from "../entities/medication";

export class MedicationRepository { 
  private repository = AppDataSource.getRepository(Medication);

  async findByIds(ids: string[]): Promise<Medication[]> {
    return await this.repository.findBy({ id: In(ids) })
  }

  async getAllMedications(
    options: { page:number, pageSize: number, sortBy: string | undefined },
    filter: Record<string, any>
  ): Promise<[Medication[], number]> {
    const { page, pageSize, sortBy } = options
    const query = this.repository
      .createQueryBuilder('medications')
  
    if (page !== undefined && pageSize !== undefined) {
      query.skip((page - 1) * pageSize).take(pageSize);
    }

    if (sortBy === 'createdAt') {
      query.orderBy({ 'medications.createdAt': 'DESC' });
    } else if (sortBy === 'desc') {
      query.orderBy({ 'medications.createdAt': 'DESC' });
    } else if (sortBy === 'asc') {
      query.orderBy({ 'medications.createdAt': 'ASC' });
    } else {
      query.orderBy({ 'medications.createdAt': 'DESC' });
    }

    if (filter['dateFrom']) {
      query.andWhere('medications.createdAt >= :start_date', { start_date: filter['dateFrom'] });
    }

    if (filter['dateTo']) {
      query.andWhere('medications.createdAt <= :end_date', { end_date: filter['dateTo'] });
    }

    if (filter['searchTerm']) {
      const { searchTerm } = filter;
      query.andWhere(
        new Brackets((qb) => {
          qb.where('medications.code LIKE :searchTerm', { searchTerm: `%${searchTerm}%` }).orWhere(
            'medications.name LIKE :searchTerm',
            { searchTerm: `%${searchTerm}%` }
          );
        })
      );
    }

    return await query.getManyAndCount();
  }

  async findByCode(code: string): Promise<Medication | null> {
    return await this.repository.findOne({ where: { code } });
  }

  async create(medicationData: Partial<Medication>): Promise<Medication> {
    const medication = this.repository.create(medicationData);
    return await this.repository.save(medication);
  }
}