// usuario.ts
export class Usuario {
  private username: string;
  private senha: string;
  private tipo: 'cliente' | 'administrador';

  constructor(username: string, senha: string, tipo: 'cliente' | 'administrador') {
    this.username = username;
    this.senha = senha;
    this.tipo = tipo;
  }

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
