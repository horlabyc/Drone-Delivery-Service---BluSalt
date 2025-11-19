import { DroneService } from '../src/services/drone-service';
import { DroneState } from '../src/types';

const mockDroneRepo = {
  findBySerialNumber: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  getAllDrones: jest.fn(),
  findAvailableForLoading: jest.fn(),
};

const mockMedicationRepo = {
  findByIds: jest.fn(),
};

const mockDroneMedicationRepo = {
  save: jest.fn(),
  find: jest.fn(),
};

jest.mock('../src/repositories/drone-repository', () => ({
  DroneRepository: jest.fn().mockImplementation(() => mockDroneRepo),
}));

jest.mock('../src/repositories/medication-repository', () => ({
  MedicationRepository: jest.fn().mockImplementation(() => mockMedicationRepo),
}));

jest.mock('../src/config/database', () => ({
  AppDataSource: {
    getRepository: jest.fn(() => mockDroneMedicationRepo),
  },
}));

describe('DroneService', () => {
  let service: DroneService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DroneService();
  });

  describe('registerDrone', () => {
    it('creates a drone when serial number is unique', async () => {
      const payload = {
        serialNumber: 'SN-001',
        model: 'Lightweight',
        weightLimit: 300,
        batteryCapacity: 100,
      } as any;
      const createdDrone = { id: 'dr-1', ...payload };
      mockDroneRepo.findBySerialNumber.mockResolvedValue(null);
      mockDroneRepo.create.mockResolvedValue(createdDrone);

      const result = await service.registerDrone(payload);

      expect(mockDroneRepo.findBySerialNumber).toHaveBeenCalledWith('SN-001');
      expect(mockDroneRepo.create).toHaveBeenCalledWith(payload);
      expect(result).toEqual({ success: true, data: createdDrone });
    });

    it('returns an error when serial number already exists', async () => {
      mockDroneRepo.findBySerialNumber.mockResolvedValue({ id: 'existing' });

      const result = await service.registerDrone({
        serialNumber: 'SN-001',
      } as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Drone with this serial number already exists');
      expect(mockDroneRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('loadDroneWithMedications', () => {
    const baseDrone = {
      id: 'dr-1',
      serialNumber: 'DR-1',
      batteryCapacity: 80,
      weightLimit: 500,
      state: DroneState.IDLE,
    };

    it('blocks loading when battery is below 25%', async () => {
      mockDroneRepo.findById.mockResolvedValue({ ...baseDrone, batteryCapacity: 20 });

      const result = await service.loadDroneWithMedications({
        droneId: 'dr-1',
        medicationIds: ['med-1'],
      });

      expect(result).toEqual({ success: false, error: 'Drone battery level is below 25%. Drone cannot load!' });
      expect(mockDroneRepo.update).not.toHaveBeenCalled();
    });

    it('loads medications when all validations pass', async () => {
      const medications = [
        { id: 'med-1', weight: 100 },
        { id: 'med-2', weight: 50 },
      ];
      mockDroneRepo.findById
        .mockResolvedValueOnce(baseDrone)
        .mockResolvedValueOnce({ ...baseDrone, state: DroneState.LOADED });
      mockMedicationRepo.findByIds.mockResolvedValue(medications);
      mockDroneRepo.update.mockResolvedValue(null);
      mockDroneMedicationRepo.save.mockResolvedValue(null);

      const result = await service.loadDroneWithMedications({
        droneId: 'dr-1',
        medicationIds: medications.map((m) => m.id),
      });

      expect(mockDroneRepo.update).toHaveBeenNthCalledWith(1, 'dr-1', { state: DroneState.LOADING });
      expect(mockDroneRepo.update).toHaveBeenNthCalledWith(2, 'dr-1', { state: DroneState.LOADED });
      expect(mockDroneMedicationRepo.save).toHaveBeenCalledTimes(2);
      expect(result.success).toBe(true);
      expect(result.data?.state).toBe(DroneState.LOADED);
    });
  });

  describe('getAllDrones', () => {
    it('returns paginated result from repository', async () => {
      const drones = [{ id: 'dr-1' }];
      mockDroneRepo.getAllDrones.mockResolvedValue([drones, 10]);

      const result = await service.getAllDrones({ page: '2', pageSize: '5', sortBy: 'createdAt' }, {});

      expect(mockDroneRepo.getAllDrones).toHaveBeenCalledWith({ page: 2, pageSize: 5, sortBy: 'createdAt' }, {});
      expect(result).toEqual({ drones, total: 10, page: 2, pageSize: 5, totalPages: 2 });
    });
  });

  describe('getLoadedMedications', () => {
    it('returns medications if drone exists', async () => {
      const meds = [{ medication: { id: 'med-1' } }, { medication: { id: 'med-2' } }];
      mockDroneRepo.findById.mockResolvedValue({ id: 'dr-1' });
      mockDroneMedicationRepo.find.mockResolvedValue(meds);

      const result = await service.getLoadedMedications('dr-1');

      expect(mockDroneMedicationRepo.find).toHaveBeenCalledWith({
        where: { droneId: 'dr-1' },
        relations: ['medication'],
      });
      expect(result).toEqual({ success: true, data: meds.map((m) => m.medication) });
    });

    it('returns error when drone is missing', async () => {
      mockDroneRepo.findById.mockResolvedValue(null);

      const result = await service.getLoadedMedications('missing');

      expect(result).toEqual({ success: false, error: 'Drone not found' });
    });
  });

  describe('getDroneBatteryLevel', () => {
    it('returns the numeric battery capacity', async () => {
      mockDroneRepo.findById.mockResolvedValue({ batteryCapacity: '85' });

      const result = await service.getDroneBatteryLevel('dr-1');

      expect(result).toEqual({ success: true, data: 85 });
    });

    it('notifies when drone does not exist', async () => {
      mockDroneRepo.findById.mockResolvedValue(null);

      const result = await service.getDroneBatteryLevel('missing');

      expect(result).toEqual({ success: false, error: 'Drone not found' });
    });
  });
});
