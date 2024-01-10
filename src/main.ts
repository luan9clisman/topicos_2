// Importações das classes
import * as readlineSync from 'readline-sync';
import { Produto } from './classes/produto';
import { Carrinho } from './classes/carrinho';
import { Mercadinho } from './classes/mercadinho';
import { Usuario } from './classes/usuario';

class Main {
  private usuarios: Usuario[] = [];
  private usuarioLogado: Usuario | undefined;

  criarConta(): void {
    const username = readlineSync.question('Digite um nome de usuario: ');
    const senha = readlineSync.question('Digite uma senha: ');
    const tipoUsuario = readlineSync.keyInSelect(['Cliente', 'Administrador'], 'Escolha o tipo de usuario: ');
    const novoUsuario = new Usuario(username, senha, tipoUsuario === 0 ? 'cliente' : 'administrador');
    this.usuarios.push(novoUsuario);
    console.log('Conta criada com sucesso!');
  }
  
  fazerLogin(tipoUsuario: 'cliente' | 'administrador'): Usuario | undefined {
    const username = readlineSync.question('Digite o nome de usuario: ');
    const senha = readlineSync.question('Digite a senha: ');

    const usuario = this.usuarios.find((u) => u.getUsername() === username && u.validarSenha(senha) && u.getTipo() === tipoUsuario);

    if (!usuario) {
      console.log('Nome de usuario, senha ou tipo incorretos.');
    }

    return usuario;
  }

  menuCliente(): void {
    while (true) {
      const escolhaCliente = readlineSync.keyInSelect(['Criar Conta', 'Fazer Login', 'Sair'], 'Escolha uma opcao: ');

      if (escolhaCliente === 0) {
        // Criar Conta
        this.criarConta();
      } else if (escolhaCliente === 1) {
        // Fazer Login Cliente
        this.usuarioLogado = this.fazerLogin('cliente');
        if (this.usuarioLogado) {
          const mercadinho = Mercadinho.getInstance();
          const carrinho = new Carrinho();
          this.menuCompra(mercadinho, carrinho);
        }
      } else if (escolhaCliente === 2) {
        break;
      } else {
        console.log('Escolha inválida. Por favor, escolha uma opcao válida.');
      }
    }
  }

  menuAdministrador(): void {
    while (true) {
      const escolhaAdmin = readlineSync.keyInSelect(['Criar Conta', 'Fazer Login', 'Sair'], 'Escolha uma opcao: ');

      if (escolhaAdmin === 0) {
        // Criar Conta
        this.criarConta();
      } else if (escolhaAdmin === 1) {
        // Fazer Login Administrador
        this.usuarioLogado = this.fazerLogin('administrador');
        if (this.usuarioLogado) {
          const mercadinho = Mercadinho.getInstance();
          this.menuAdicionarProduto(mercadinho);
        }
      } else if (escolhaAdmin === 2) {
        break;
      } else {
        console.log('Escolha inválida. Por favor, escolha uma opcao válida.');
      }
    }
  }

  menuCompra(mercadinho: Mercadinho, carrinho: Carrinho): void {
    while (true) {
      mercadinho.exibirEstoque();

      const opcaoCompra = readlineSync.keyInYNStrict('Deseja adicionar um produto ao carrinho?');

      if (opcaoCompra) {
        const nomeProdutoCompra = readlineSync.question('Digite o nome do produto desejado: ');
        const estoque = mercadinho.getEstoque();
        const produtoSelecionado = estoque.find((produto) => produto.nome === nomeProdutoCompra);

        if (produtoSelecionado) {
          const quantidadeCompra = readlineSync.questionInt('Digite a quantidade desejada: ');
          carrinho.adicionarItem(produtoSelecionado, quantidadeCompra);
        } else {
          console.log('Produto nao encontrado no estoque.');
        }
      } else {
        carrinho.exibirCarrinho();
        const opcaoFinalizarCompra = readlineSync.keyInYNStrict('Deseja finalizar a compra?');

        if (opcaoFinalizarCompra) {
          // Mostrar itens no carrinho
          carrinho.exibirCarrinho();

          // Oferecer opções de pagamento
          console.log('\nOpcoes de pagamento:');
          console.log('1. Pix');
          console.log('2. Cartao');

          const opcaoPagamento = readlineSync.questionInt('Escolha o metodo de pagamento: ');

          if (opcaoPagamento === 1) {
            console.log('Pagamento realizado via Pix. Obrigado por sua compra!');
          } else if (opcaoPagamento === 2) {
            console.log('Insira o cartão e aguarde a confirmação. Obrigado por sua compra!');
          } else {
            console.log('Opção de pagamento inválida. Compra cancelada.');
          }

          break; // Sai do loop após finalizar a compra
        }
      }
    }
  }

  menuAdicionarProduto(mercadinho: Mercadinho): void {
    // Adiciona produtos ao estoque como administrador
    while (true) {
      const nomeProduto = readlineSync.question('Digite o nome do produto (ou digite "sair" para encerrar): ');

      if (nomeProduto.toLowerCase() === 'sair') {
        break;
      }

      const precoProduto = readlineSync.questionFloat('Digite o preco do produto: ');
      const quantidadeEstoque = readlineSync.questionInt('Digite a quantidade em estoque: ');

      const novoProduto = new Produto(nomeProduto, precoProduto, quantidadeEstoque);
      mercadinho.adicionarProduto(novoProduto);
    }
  }

  executar(): void {
    while (true) {
      const escolhaPapel = readlineSync.keyInSelect(['Administrador', 'Cliente', 'Sair'], 'Escolha o seu papel: ');

      if (escolhaPapel === 0) {
        // Modo Administrador
        this.menuAdministrador();
      } else if (escolhaPapel === 1) {
        // Modo Cliente
        this.menuCliente();
      } else if (escolhaPapel === 2) {
        break;
      } else {
        console.log('Escolha inválida. Por favor, escolha "Administrador", "Cliente" ou "Sair".');
      }
    }
  }
}

// Instância da classe Main e execução do programa
const main = new Main();
main.executar();
