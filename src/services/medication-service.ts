import { Medication } from "../entities/medication";
import { MedicationRepository } from "../repositories/medication-repository";
import { IOptions, RegisterMedicationDTO } from "../types";

export class MedicationService {
  private medicationRepo = new MedicationRepository();

  async getAllMedications(options: IOptions, filter: Record<string, any>): Promise<{
    medications: Partial<Medication>[];
    total: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  }> {
    const page = options.page ? parseInt(options.page as string, 10) : 1;
    const pageSize = options.pageSize ? parseInt(options.pageSize as string, 10) : 5;
    const { sortBy } = options;

    const [medications, total] = await this.medicationRepo.getAllMedications({ page, pageSize, sortBy }, filter)

    if (page !== undefined && pageSize !== undefined) {
      const totalPages = Math.ceil(total / pageSize);
      return { medications, total, page, pageSize, totalPages };
    }
    return { medications, total };
  }

  async registerMedication(data: RegisterMedicationDTO): Promise<{success: boolean, data?: Medication, error?: string}> {
    const existing = await this.medicationRepo.findByCode(data.code);
    if (existing) {
      return { success: false, error: 'Medication with this code already exists' }
    }

    const medication = await this.medicationRepo.create(data);
    return { success: true, data: medication }
  }
}