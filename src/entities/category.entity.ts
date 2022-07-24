import { SharedEntity } from '../common/model/sharedEntity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Category extends SharedEntity {
  @ApiProperty()
  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;
}
