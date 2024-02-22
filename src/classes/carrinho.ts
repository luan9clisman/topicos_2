// Classe Carrinho
import { Produto } from './produto';

export class Carrinho {
  private itens: Map<Produto, number> = new Map();

  adicionarItem(produto: Produto, quantidade: number): boolean {
    if (quantidade > produto.quantidadeEstoque) {
      console.log(`Estoque insuficiente para ${produto.nome}.`);
      return false;
    }

    if (this.itens.has(produto)) {
      this.itens.set(produto, this.itens.get(produto)! + quantidade);
    } else {
      this.itens.set(produto, quantidade);
    }

    // Remove a quantidade do estoque
    produto.quantidadeEstoque -= quantidade;

    console.log(`${quantidade} ${produto.nome} adicionado ao carrinho.`);
    return true;
  }

  exibirCarrinho(): void {
    console.log('\nCarrinho de Compras:');
    this.itens.forEach((quantidade, produto) => {
      console.log(`${produto.nome} - ${quantidade} unidade(s) - Total: R$ ${(produto.preco * quantidade).toFixed(2)}`);
    });

    // Adiciona o cálculo do valor total
    const valorTotal = this.calcularValorTotal();
    console.log(`\nValor Total da Compra: R$ ${valorTotal.toFixed(2)}`);
  }
  
  private calcularValorTotal(): number {
    let valorTotal = 0;
    this.itens.forEach((quantidade, produto) => {
      valorTotal += produto.preco * quantidade;
    });
    return valorTotal;
  }
}
