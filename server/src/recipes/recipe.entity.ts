import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type Ingredient = { name: string; amount: string };

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column('int')
  prepMinutes: number;

  @Column('int')
  servings: number;

  // Store arrays as JSONB — efficient and queryable in PostgreSQL
  @Column({ type: 'jsonb', default: [] })
  tags: string[];

  @Column({ type: 'jsonb', default: [] })
  ingredients: Ingredient[];

  @Column({ type: 'jsonb', default: [] })
  steps: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Soft delete: when set, the row is treated as deleted. TypeORM automatically
  // adds `WHERE deletedAt IS NULL` to find/queryBuilder calls, so soft-deleted
  // recipes disappear from all reads without the data ever leaving the table.
  // `nullable: true` + null default = "not deleted".
  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
