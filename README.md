# Fingerprint Server

- [Introdução](#introdução)
- [Instalação](#instalação)
- [Uso](#uso)

## Introdução
Este repositirio foi criado com o objetivo de coletar dados de fingerprint e microbenchmarks de navegadores web, abaixo estão descritos os procesimentos para instalação, uso, modoficação e contribuição para este projeto.

## Instalação
Siga os passos abaixo para instalar e executar o projeto localmente:

1. Clone este repositório:
   ```bash
   git clone https://github.com/puruwei/servidor_de_coleta.git

2. Acesse o diretorio do projeto:
   ```bash
   cd servidor_de_coleta

3. Instale as dependencias do projeto com NPM:
   ```bash
   npm install

4. A depender das dependencias que estiver usando neste projeto, voce pode precisar instalar compiladores e gerenciadores de pacote de outras linguagens. (ex. rs_fingerprint_generator precisa do cargo (gerenciador de pacotes) e rustc (compilador)).

## Uso
Dado que o projeto visa executar módulos de outras linguagens em WebAssembly, siga os passos a seguir para criar, personalizar e utilizar módulos compatíveis

### Criando módulos:
Códigos de diferentes linguagens podem ser implementados a fim de serem utilizados como módulos WASM. Para fins deste projeto foram adotadas algumas políticas de implementação para permitir a fácil substituição e edição destes módulos:
1. Os módulos que devem ser compilados em WASM para este projeto devem conter suas implementações no GitHub
2. Cada módulo deve disponibilizar o comando `make build`, que pode, opcionalmente, receber como parâmetro o diretório de destino da compilação (*target*). Essa política foi adotada com o objetivo de facilitar a compilação automatizada do projeto principal por meio do comando `make build_submodules`, o qual percorre a pasta `/submodules`, iterando sobre todos os módulos e executando `make build` com o diretório `./public/modules` como destino da compilação.
3. Para importar um novo git de umm submódulo basta usar o comando `git submodule add 'link para o submódulo'`
4. Os módulos devem conter uma função para coleta de dados que retorne uma string com os dados no formato json.

Seguindo estes passos é possível tanto utilizar os submódulos implementados quanto personalizar os próprios módulos.

### Configurando módulos para serem executados:
A execução dos módulos em tempo de execução é determinada de forma dinâmica, com base em uma estrutura predefinida exportada por cada módulo. Embora o sistema contenha diversas implementações possíveis, apenas os módulos explicitamente registrados na estrutura `modules` serão utilizados durante a execução.

#### Critérios para Execução de um Módulo

Para que um módulo seja efetivamente executado, ele deve seguir uma convenção mínima de integração:

- **Exportar uma função de coleta de dados** (`collector`), que será invocada pelo sistema principal;
- Esta função deve retornar, de forma síncrona ou assíncrona, uma string em formato **JSON** representando os dados coletados;
- Dese ser importado dentro do arquivo `./public/config/modules_config.js` (exemplos no arquivo);
- Caso o módulo exija alguma etapa de inicialização (como carregamento de binários WebAssembly ou configuração de contexto), essa lógica deve estar encapsulada na função `initializeModules()`, garantindo que o módulo esteja pronto para uso no momento da coleta.

#### Estrutura de Inicialização

O processo de inicialização é realizado por meio da função `initializeModules()`, responsável por importar, instanciar e registrar dinamicamente os módulos que atendem aos critérios acima. Ao final desse processo, a estrutura `modules` conterá os objetos prontos para serem utilizados, cada um com seu nome e sua função de coleta devidamente associada.
```javascript
modules = [
    { name: "nome_modulo", collector: async () => /* retorna string JSON */ }
];
```
Note que os múdulos em javascript podem ser adicionados a pasta de módulos na pasta `./public` sem problemas, ainda não há uma convenção para estes módulos, mas estes não devem ser importados no mesmo local do git submodules dos arquivos que devem ser compilados.

### Definindo targets:
Do mesmo modo que os módulos podem ser facilmente substituidos, os targets também. Para fins da coleta de dados deste projeto, targets são abstrações para conjuntos de máquinas onde serão coletados os dados.
Os targets são configurados de forma semelhante aos módulos, no arquivo `./public/config/targets_config.js`, porém precisam apenas de um nome para serem adicionados como botão na tela da coleta, e adicionados aos metadados da instancia na coleta de dados.

### executando o projeto:
O projeto conta com um comando que o inicia:
   ```bash
   make run
   ```
Após utilizá-lo o projeto já estará disponinel na porta indicada no terminal.

