import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  preco: number;

  @Column()
  quantidadeEstoque: number;

  disponibilidade(): string {
    return this.quantidadeEstoque > 0 ? 'Disponível' : 'Indisponível';
  }
}
