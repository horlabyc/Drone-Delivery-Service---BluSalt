import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Drone } from './drone';

@Entity('battery_audit_logs')
export class BatteryAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  droneId: string;

  @ManyToOne(() => Drone)
  @JoinColumn({ name: 'droneId' })
  drone: Drone;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  batteryLevel: number;

  @CreateDateColumn()
  checkedAt: Date;
}