import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class FinancialRecord extends Model<FinancialRecord> {
  @Column({ type: DataType.STRING, allowNull: false })
  userId!: string;

  @Column({ type: DataType.DATE, allowNull: false })
  date!: Date;

  @Column({ type: DataType.STRING, allowNull: false })
  description!: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  amount!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  category!: string;

  @Column({ type: DataType.STRING, allowNull: false })
  paymentMethod!: string;
}
