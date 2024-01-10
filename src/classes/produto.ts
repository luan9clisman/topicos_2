export class Produto {
  constructor(public nome: string, public preco: number, public quantidadeEstoque: number) {}

  disponibilidade(): string {
    return this.quantidadeEstoque > 0 ? 'Disponível' : 'Indisponível';
  }
}
