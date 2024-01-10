// mercadinho.ts
import { Produto } from './produto';

export class Mercadinho {
  private static instance: Mercadinho | null = null;
  private estoque: Produto[] = [];

  private constructor() {}

  static getInstance(): Mercadinho {
    if (!Mercadinho.instance) {
      Mercadinho.instance = new Mercadinho();
    }
    return Mercadinho.instance;
  }

  adicionarProduto(produto: Produto): void {
    this.estoque.push(produto);
    console.log(`${produto.nome} adicionado ao estoque.`);
  }

  getEstoque(): Produto[] {
    return this.estoque;
  }

  exibirEstoque(): void {
    console.log('\nEstoque do Mercadinho:');
    for (const produto of this.estoque) {
      console.log(`${produto.nome} - R$ ${produto.preco.toFixed(2)} - ${produto.disponibilidade()}`);
    }
  }
}


