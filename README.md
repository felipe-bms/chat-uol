# Chat Uol

## Descrição

Este projeto é um aplicativo de chat inspirado no UOL Chat, desenvolvido para simular a funcionalidade de um chat online com diversas características, incluindo registro de usuários, envio de mensagens, e manutenção de status ativo. O projeto utiliza JavaScript puro, HTML e CSS, e faz chamadas a uma API mock para gerenciar participantes e mensagens.

Modo de Utilização: para simular conversas, utiliza diversas abas do seu browser de preferência.

Obs: design only-mobile.

## Funcionalidades

1. **Registro de Usuário**

   - Os usuários são registrados por meio de um prompt de entrada.
   - Se o nome de usuário já estiver em uso, o usuário será solicitado a inserir um novo nome.
   - Envia uma requisição POST para registrar o novo usuário na API.

2. **Manutenção de Status**

   - O servidor precisa saber que o usuário está ativo, então uma requisição POST é enviada a cada 5 segundos para manter o status ativo do usuário.

3. **Envio de Mensagens**

   - Os usuários podem enviar mensagens públicas e privadas.
   - As mensagens são enviadas para a API e recuperadas periodicamente para atualização da interface do usuário.

4. **Recebimento de Mensagens**

   - Mensagens são recuperadas a cada 3 segundos da API.
   - Apenas mensagens novas são renderizadas para evitar duplicação.
   - Suporte para mensagens públicas, privadas e de status (entrada e saída da sala).

5. **Verificação de Participantes**

   - A lista de participantes é atualizada a cada 5 segundos.
   - Mensagens de saída são exibidas quando um participante sai da sala, garantindo que cada mensagem de saída seja renderizada apenas uma vez.

6. **Atualização da Sidebar**

   - A lista de contatos disponíveis é atualizada a cada 10 segundos.
   - Os usuários podem selecionar destinatários e definir a privacidade das mensagens (público ou privado).

7. **Interface de Usuário**
   - Sidebar para seleção de destinatários e configuração de privacidade.
   - Máscara de fundo e animações para abrir e fechar a sidebar.

## Tecnologias Utilizadas

1. **HTML**: Estrutura básica do aplicativo.
2. **CSS**: Estilização do aplicativo, incluindo layout responsivo e design de componentes.
3. **JavaScript**: Lógica do aplicativo, gerenciamento de estado e interação com a API.
4. **Axios**: Biblioteca para fazer requisições HTTP para a API.

## Estrutura do Código

1. **Variáveis Globais**

   - Definição de URLs da API, elementos do DOM e variáveis de estado do usuário.

2. **Funções de Registro e Status**

   - `setUser()`: Solicita o nome de usuário e registra o usuário.
   - `confirmLogin()`: Confirma o login e inicia o envio periódico de status.
   - `sendStatus()`: Envia o status do usuário para a API a cada 5 segundos.

3. **Funções de Mensagens**

   - `getMessages()`: Recupera mensagens da API.
   - `renderNewMessages()`: Renderiza apenas mensagens novas na interface do usuário.
   - `sendMessage()`: Envia uma nova mensagem para a API.

4. **Funções de Participantes**

   - `checkParticipants()`: Verifica e atualiza a lista de participantes.
   - `renderContacts()`: Atualiza a lista de contatos na sidebar.
   - `toContact()`: Seleciona o destinatário das mensagens.
   - `setPrivacy()`: Define a privacidade das mensagens (público ou privado).

5. **Inicialização**
   - Configuração inicial das funções e definição de intervalos para verificação e atualização de mensagens e participantes.

## Como Executar o Projeto

1. Clone o repositório para sua máquina local.
2. Abra o arquivo `index.html` no seu navegador.
3. Insira um nome de usuário quando solicitado.
4. Comece a usar o chat, enviando mensagens e interagindo com outros usuários.

## Notas

- Certifique-se de que a API mock está acessível e funcionando corretamente.
- Teste o aplicativo em diferentes navegadores para garantir compatibilidade.
