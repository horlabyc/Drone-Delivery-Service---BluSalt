import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { DroneModel, DroneState } from "../types";
import { DroneMedication } from "./drone-medication";

@Entity('drones')
export class Drone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  serialNumber: string;

  @Column({ type: 'enum', enum: DroneModel })
  model: DroneModel;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  weightLimit: number;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  batteryCapacity: number;

  @Column({ type: 'enum', enum: DroneState, default: DroneState.IDLE })
  state: DroneState;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => DroneMedication, dm => dm.drone)
  droneMedications: any[];
}