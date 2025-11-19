import { BatterySimulatorService } from '../src/services/batter-simulator-service';
import { DroneState } from '../src/types';

const mockCreateQueryBuilder = jest.fn();
const mockUpdate = jest.fn();

jest.mock('../src/repositories/drone-repository', () => {
  return {
    DroneRepository: jest.fn().mockImplementation(() => ({
      repoInst: {
        createQueryBuilder: mockCreateQueryBuilder,
      },
      update: mockUpdate,
    })),
  };
});

const createQueryBuilderChain = (drones: any[]) => {
  return {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue(drones),
  };
};

describe('BatterySimulatorService', () => {
  let service: BatterySimulatorService;
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    service = new BatterySimulatorService();
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  describe('dischargeBatteries', () => {
    it('skips discharging when there are no active drones', async () => {
      const queryChain = createQueryBuilderChain([]);
      mockCreateQueryBuilder.mockReturnValue(queryChain);

      await service.dischargeBatteries();

      expect(mockCreateQueryBuilder).toHaveBeenCalledWith('drone');
      expect(queryChain.where).toHaveBeenCalledWith('drone.state != :idleState', { idleState: DroneState.IDLE });
      expect(mockUpdate).not.toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith('⚡ No active drones to discharge');
    });

    it('decreases battery level for drones above the minimum threshold', async () => {
      const drones = [
        { id: 'dr-1', serialNumber: 'DR-1', state: DroneState.DELIVERING, batteryCapacity: 40 },
        { id: 'dr-2', serialNumber: 'DR-2', state: DroneState.RETURNING, batteryCapacity: 24 },
      ];
      const queryChain = createQueryBuilderChain(drones);
      mockCreateQueryBuilder.mockReturnValue(queryChain);

      await service.dischargeBatteries();

      expect(mockUpdate).toHaveBeenCalledTimes(2);
      expect(mockUpdate).toHaveBeenNthCalledWith(1, 'dr-1', { batteryCapacity: 38 });
      expect(mockUpdate).toHaveBeenNthCalledWith(2, 'dr-2', { batteryCapacity: 22 });
    });

    it('avoids updating drones that would fall below the minimum battery', async () => {
      const drones = [
        { id: 'critical', serialNumber: 'CRIT', state: DroneState.DELIVERING, batteryCapacity: 11 },
      ];
      const queryChain = createQueryBuilderChain(drones);
      mockCreateQueryBuilder.mockReturnValue(queryChain);

      await service.dischargeBatteries();

      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe('chargeBatteries', () => {
    it('skips charging when all idle drones are already full', async () => {
      const queryChain = createQueryBuilderChain([]);
      mockCreateQueryBuilder.mockReturnValue(queryChain);

      await service.chargeBatteries();

      expect(queryChain.where).toHaveBeenCalledWith('drone.state = :idleState', { idleState: DroneState.IDLE });
      expect(queryChain.andWhere).toHaveBeenCalledWith('drone.batteryCapacity < :maxBattery', { maxBattery: 100 });
      expect(mockUpdate).not.toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith('🔌 No IDLE drones need charging (all fully charged or busy)');
    });

    it('charges idle drones and caps at maximum battery capacity', async () => {
      const drones = [
        { id: 'idle-1', serialNumber: 'IDLE-1', state: DroneState.IDLE, batteryCapacity: 98 },
        { id: 'idle-2', serialNumber: 'IDLE-2', state: DroneState.IDLE, batteryCapacity: 50 },
      ];
      const queryChain = createQueryBuilderChain(drones);
      mockCreateQueryBuilder.mockReturnValue(queryChain);

      await service.chargeBatteries();

      expect(mockUpdate).toHaveBeenCalledTimes(2);
      expect(mockUpdate).toHaveBeenNthCalledWith(1, 'idle-1', { batteryCapacity: 100 });
      expect(mockUpdate).toHaveBeenNthCalledWith(2, 'idle-2', { batteryCapacity: 52 });
    });
  });
});
