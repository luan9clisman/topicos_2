// Importações das classes
import * as readlineSync from 'readline-sync';
//import { Produto } from './classes/produto';
import { Carrinho } from './classes/carrinho';
import { Mercadinho } from './classes/mercadinho';
//import { Usuario } from './classes/usuario';
import { createConnection } from 'typeorm';
import { config, getDataSource } from './app-data-source';
import { UsuarioEntity } from './classes/entities/UsuarioEntity';
import { ProdutoEntity } from './classes/entities/ProdutoEntity';
//import { Produto } from './classes/produto';


class Main {
  private usuarios: UsuarioEntity[] = [];
  private usuarioLogado: UsuarioEntity | null;

  async criarConta(): Promise<void> {
    try{
    const username = readlineSync.question('Digite um nome de usuario: ');
    const senha = readlineSync.question('Digite uma senha: ');
    const tipoUsuario = readlineSync.keyInSelect(['Cliente', 'Administrador'], 'Escolha o tipo de usuario: ');
    //const novoUsuario = new Usuario(username, senha, tipoUsuario === 0 ? 'cliente' : 'administrador');
    // const novoUsuario = await myDataSource.getRepository(UsuarioEntity).create({
    //   username, senha, tipo: tipoUsuario === 0 ? 'cliente' : 'administrador'
    // })
    // await myDataSource.getRepository(UsuarioEntity).save(novoUsuario);

    console.table({
      username,
      senha,
      tipoUsuario
    })

    const myDataSource = await getDataSource();

    const usuario = new UsuarioEntity();
    usuario.senha = senha;
    usuario.username = username;
    usuario.tipo = tipoUsuario === 0 ? 'cliente' : 'administrador';

    await myDataSource.manager.save(usuario);

    console.log("usuario criado com id: ", usuario.id)
  } catch (error) {
    console.error('Erro ao criar conta:', error);
  }
}

  async fazerLogin(tipoUsuario: 'cliente' | 'administrador'): Promise<UsuarioEntity | null> {
    const username = readlineSync.question('Digite o nome de usuario: ');
    const senha = readlineSync.question('Digite a senha: ');

    // const usuario = this.usuarios.find((u) => u.getUsername() === username && u.validarSenha(senha) && u.getTipo() === tipoUsuario);

    const myDataSource = await getDataSource();

    const usuario = await myDataSource.manager.findOne(UsuarioEntity, {
      where: {
        tipo: tipoUsuario,
        senha,
        username
      }
    })

    console.log('usuario', usuario);

    if (!usuario) {
      console.log('Nome de usuario, senha ou tipo incorretos.');
    }

    return usuario;
  }

  async menuCliente(): Promise<void> {
    while (true) {
      const escolhaCliente = readlineSync.keyInSelect(['Criar Conta', 'Fazer Login', 'Sair'], 'Escolha uma opcao: ');

      if (escolhaCliente === 0) {
        // Criar Conta
        await this.criarConta();
      } else if (escolhaCliente === 1) {
        // Fazer Login Cliente
        this.usuarioLogado = await this.fazerLogin('cliente');
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

  async menuAdministrador(): Promise<void> {
    while (true) {
      const escolhaAdmin = readlineSync.keyInSelect(['Criar Conta', 'Fazer Login', 'Sair'], 'Escolha uma opcao: ');

      if (escolhaAdmin === 0) {
        // Criar Conta
        await this.criarConta();
      } else if (escolhaAdmin === 1) {
        // Fazer Login Administrador
        this.usuarioLogado = await this.fazerLogin('administrador');
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

  async menuCompra(mercadinho: Mercadinho, carrinho: Carrinho): Promise<void> {
    while (true) {
      mercadinho.exibirEstoque();

      const opcaoCompra = readlineSync.keyInYNStrict('Deseja adicionar um produto ao carrinho?');
      
      if (opcaoCompra) {
        const nomeProdutoCompra = readlineSync.question('Digite o nome do produto desejado: ');
        const estoque = mercadinho.getEstoque();
        const produtoSelecionado = estoque.find((produto) => produto.nome === nomeProdutoCompra);

        if (produtoSelecionado) {
          const quantidadeCompra = readlineSync.questionInt('Digite a quantidade desejada: ');

          // Adiciona verificação de estoque
          const adicionouAoCarrinho = carrinho.adicionarItem(produtoSelecionado, quantidadeCompra);
          if (adicionouAoCarrinho) {
            continue; // Retorna ao início do loop sem exibir o carrinho
          }
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

 //async menuAdicionarProduto(mercadinho: Mercadinho): Promise<void> {
    // Adiciona produtos ao estoque como administrador
    //while (true) {
      //const nomeProduto = readlineSync.question('Digite o nome do produto (ou digite "sair" para encerrar): ');
      //const precoProduto = readlineSync.questionFloat('Digite o preco do produto: ');
      //const quantidadeEstoque = readlineSync.questionInt('Digite a quantidade em estoque: ');
       //const novoProduto = new Produto(nomeProduto, precoProduto, quantidadeEstoque);
       //const myDataSource = await getDataSource()
       //const novoProduto = await myDataSource.getRepository(Produto).create({
       // quantidadeEstoque,preco: precoProduto, nome:nomeProduto
       //})
       //mercadinho.adicionarProduto(novoProduto);
       //if (nomeProduto.toLowerCase() === 'sair') {
       //  break;
       //}
      //console.table({
        //nome: nomeProduto,
        //preco: precoProduto,
        //quantidadeEstoque: quantidadeEstoque
      //})
  
      //const myDataSource = await getDataSource();
  
      //const produto = new ProdutoEntity();
      //produto.nome = nomeProduto;
      //produto.preco = precoProduto;
      //produto.quantidadeEstoque = quantidadeEstoque;
  
      //await myDataSource.manager.save(produto);
  
      //console.log("produto criado com id: ", produto.id)
  //}
//}
  // async conectarBancoDados(): Promise<void> {
  //   myDataSource.initialize().then(() => {
  //     console.log("Data Source has been initialized!");}).catch((err) => {
  //     console.error("Error during Data Source initialization", err);});
  // }
  async menuAdicionarProduto(mercadinho: Mercadinho): Promise<void> {
    // Adiciona produtos ao estoque como administrador
    while (true) {
      const nome = readlineSync.question('Digite o nome do produto (ou digite "sair" para encerrar): ');
  
      if (nome.toLowerCase() === 'sair') {
        break;
      }
  
      const preco = readlineSync.questionFloat('Digite o preco do produto: ');
      const quantidadeEstoque = readlineSync.questionInt('Digite a quantidade em estoque: ');
  
      console.table({
        nome,
        preco,
        quantidadeEstoque,
      });
  
      const myDataSource = await getDataSource();
  
      const produto = new ProdutoEntity();
      produto.nome = nome;
      produto.preco = preco;
      produto.quantidadeEstoque = quantidadeEstoque;
  
      await myDataSource.manager.save(produto);
  
      console.log('Produto criado com id:', produto.id);
    }
  }
  async executar(): Promise<void> {
    // await this.conectarBancoDados();
    while (true) {
      const escolhaPapel = readlineSync.keyInSelect(['Administrador', 'Cliente', 'Sair'], 'Escolha o seu papel: ');

      if (escolhaPapel === 0) {
        // Modo Administrador
        await this.menuAdministrador();
      } else if (escolhaPapel === 1) {
        // Modo Cliente
        await this.menuCliente();
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
