import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Medication } from "./medication";
import { Drone } from "./Drone";

@Entity('drone_medications')
export class DroneMedication {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @Column()
  droneId: string;

  @Column()
  medicationId: string;

  @ManyToOne(() => Drone, drone => drone.droneMedications)
  @JoinColumn({ name: 'droneId' })
  drone: Drone;

  @ManyToOne(() => Medication)
  @JoinColumn({ name: 'medicationId' })
  medication: Medication;

  @CreateDateColumn()
  loadedAt: Date;
}