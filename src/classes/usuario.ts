// Usuario.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  senha: string;

  @Column()
  tipo: 'cliente' | 'administrador';

  getUsername(): string {
    return this.username;
  }

  validarSenha(senha: string): boolean {
    return this.senha === senha;
  }

  getTipo(): 'cliente' | 'administrador' {
    return this.tipo;
  }
}
