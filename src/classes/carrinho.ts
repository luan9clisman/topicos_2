import { Produto } from './produto';

export class Carrinho {
  private itens: Map<Produto, number> = new Map();

  adicionarItem(produto: Produto, quantidade: number): void {
    if (this.itens.has(produto)) {
      this.itens.set(produto, this.itens.get(produto)! + quantidade);
    } else {
      this.itens.set(produto, quantidade);
    }
    console.log(`${quantidade} ${produto.nome} adicionado ao carrinho.`);
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

  calcularTotal(): number {
    let total = 0;
    this.itens.forEach((quantidade, produto) => {
      total += produto.preco * quantidade;
    });
    return total;
  }

  // Nova função para calcular o valor total
  private calcularValorTotal(): number {
    let valorTotal = 0;
    this.itens.forEach((quantidade, produto) => {
      valorTotal += produto.preco * quantidade;
    });
    return valorTotal;
  }
}