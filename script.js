const chatCode = "c59a815c-b07b-4dc5-aa00-ccc550d38fd7";
const participants = `https://mock-api.driven.com.br/api/v6/uol/participants/${chatCode}`;
const status = `https://mock-api.driven.com.br/api/v6/uol/status/${chatCode}`;
const messagesData = `https://mock-api.driven.com.br/api/v6/uol/messages/${chatCode}`;
const chatMessages = document.querySelector(".content");
const endOfChat = document.querySelector(".end-of-chat");

let username;
let newUser = {
  name: username,
};

let previousParticipants = [];
let currentContact = "Todos";
let currentPrivacy = "message";
let recipientContainer = document.querySelector(".message-recipient");
let renderedMessages = []; // Armazena as mensagens renderizadas

// Registrando Usuários
function setUser() {
  username = prompt("Quem é você?");
  if (!username) {
    alert("Nome de usuário não pode ser vazio.");
    getMessages();
    setUser();
    return;
  }
  newUser = {
    name: username,
  };
  axios.post(participants, newUser).then(confirmLogin).catch(registerError);
}

function confirmLogin(response) {
  alert("Registrado com sucesso!");

  // Iniciar o envio de requisições de status a cada 5 segundos
  setInterval(sendStatus, 5000);
  getMessages();
  renderContacts();
}

function registerError(error) {
  console.log(error);
  if (error.response && error.response.status === 400) {
    alert("Este nome de usuário já está em uso. Tente outro.");
    setUser();
  } else {
    alert("Erro ao registrar. Tente novamente.");
  }
}

// Manutenção de Login
function sendStatus() {
  if (!newUser || !newUser.name) {
    console.error("Usuário não registrado corretamente.");
    setUser();
    return;
  }

  axios
    .post(status, newUser)
    .then((response) => {
      console.log("Status enviado com sucesso:", response);
    })
    .catch((error) => {
      console.error("Erro ao enviar status:", error);
      alert("Você foi deslogado.");
      window.location.reload();
    });
}

function checkParticipants() {
  axios
    .get(participants)
    .then((response) => {
      const currentParticipants = response.data.map((user) => user.name);

      // const leftParticipants = previousParticipants.filter(
      //   (name) => !currentParticipants.includes(name)
      // );

      // leftParticipants.forEach((name) => {
      //   const time = new Date().toLocaleTimeString();
      //   chatMessages.innerHTML += `<article class="message status">
      //       <h3>${time}</h3>
      //       <p><span class="bold">${name}</span> saiu da sala</p>
      //     </article>`;
      // });

      if (
        JSON.stringify(previousParticipants) !==
        JSON.stringify(currentParticipants)
      ) {
        renderContacts();
      }

      // Atualiza a lista de participantes anterior para a próxima verificação
      previousParticipants = currentParticipants;
    })
    .catch((error) => {
      console.error("Erro ao buscar participantes:", error);
    });
}

// Renderizando mensagens a cada 5 segundos
function getMessages() {
  axios.get(messagesData).then(renderNewMessages).catch(failedToGetMessages);
}

function renderNewMessages(response) {
  let messages = response.data;

  // Filtra apenas as mensagens novas
  let newMessages = messages.filter((message) => {
    return !renderedMessages.some(
      (rendered) =>
        rendered.time === message.time &&
        rendered.from === message.from &&
        rendered.to === message.to &&
        rendered.text === message.text
    );
  });

  // Verifica se há novas mensagens antes de renderizar
  let hasNewMessages = newMessages.length > 0;

  newMessages.forEach((element) => {
    renderMessage(element);
    renderedMessages.push(element); // Adiciona a mensagem renderizada ao array
  });

  // Só faz o scroll se houver novas mensagens
  if (hasNewMessages) {
    endOfChat.scrollIntoView({ behavior: "smooth" });
  }
}

function failedToGetMessages(error) {
  console.log(error);
  alert("Erro ao buscar mensagens. Tente novamente.");
}

function renderMessage(element) {
  // Verificar o tipo de mensagem e renderizar de acordo
  if (element.type === "message") {
    chatMessages.innerHTML += `<article class="message">
            <h3>(${element.time})</h3>
            <p><span class="bold">${element.from}</span> para <span class="bold">${element.to}</span>: ${element.text}</p>
          </article>`;
  } else if (element.type === "status") {
    // Verificar se é uma mensagem de entrada ou saída
    let statusMessage = "";
    if (element.text.includes("entra na sala")) {
      statusMessage = `<span class="bold">${element.from}</span> entrou na sala`;
    } else if (element.text.includes("sai da sala")) {
      statusMessage = `<span class="bold">${element.from}</span> saiu da sala`;
    }

    chatMessages.innerHTML += `<article class="message status">
            <h3>(${element.time})</h3>
            <p>${statusMessage}</p>
          </article>`;
  } else if (element.type === "private_message") {
    // Verifica se a mensagem privada deve ser renderizada
    if (element.to === username || element.from === username) {
      chatMessages.innerHTML += `<article class="private">
            <h3>(${element.time})</h3>
            <p><span class="bold">${element.from}</span> reservadamente para <span class="bold">${element.to}</span>: ${element.text}</p>
          </article>`;
    }
  }
}

// Enviando Mensagens
function sendMessage() {
  let textInput = document.getElementById("messageArea");
  let textInputValue = textInput.value;

  let newMessage = {
    from: username,
    to: currentContact,
    text: textInputValue,
    type: currentPrivacy,
  };
  axios
    .post(messagesData, newMessage)
    .then(() => {
      // Chama getMessages para garantir que a nova mensagem seja renderizada
      getMessages();
      textInput.value = "";
    })
    .catch(notLoggedAnymore);

  function notLoggedAnymore() {
    alert("Você não está logado no momento.");
    window.location.reload();
  }
}

// Atualizando a Sidebar
function renderContacts() {
  axios.get(participants).then(updateContacts);
}

function updateContacts(response) {
  const contactContainer = document.querySelector(".contact-options");
  let contactsArray = response.data;

  // Define o conteúdo inicial do container
  contactContainer.innerHTML = `
    <p>Escolha um contato para enviar mensagem</p>
    <button onclick="toContact('Todos', this);" class="sidebar-btn">
      <img class="sidebar-btn__icon" src="./assets/people 2.svg" alt="Todos" />
      <h4 class="sidebar-btn__text">Todos</h4>
      <img class="sidebar-btn__checked" src="./assets/Vector (14).svg" alt="checked" />
    </button>
  `;

  // Cria o HTML para cada contato
  contactsArray.forEach((contact) => {
    if (contact.name !== username) {
      contactContainer.innerHTML += `
        <button onclick="toContact('${contact.name}', this);" class="sidebar-btn">
          <img class="sidebar-btn__icon" src="./assets/people 2.svg" alt="${contact.name}" />
          <h4 class="sidebar-btn__text">${contact.name}</h4>
          <img class="sidebar-btn__checked hidden" src="./assets/Vector (14).svg" alt="checked" />
        </button>`;
    }
  });

  console.log(response);
}

function toContact(contactName, element) {
  // Encontra todos os botões de contato e remove a marcação de todos eles
  const contactOptions = document.querySelectorAll(
    ".contact-options .sidebar-btn__checked"
  );
  contactOptions.forEach((option) => {
    option.classList.add("hidden");
  });

  // Marca o botão clicado
  element.querySelector(".sidebar-btn__checked").classList.remove("hidden");

  currentContact = contactName;
  recipientContainer.innerHTML = `Enviando para ${currentContact} (${
    currentPrivacy === "message" ? "público" : "privado"
  })`;
  console.log(`Destinatário atual: ${currentContact}`);
}

function setPrivacy(privacy, element) {
  // Encontra todos os botões de privacidade e remove a marcação de todos eles
  const visibilityOptions = document.querySelectorAll(
    ".contact-privacy .sidebar-btn__checked"
  );
  visibilityOptions.forEach((option) => {
    option.classList.add("hidden");
  });

  // Marca o botão clicado
  element.querySelector(".sidebar-btn__checked").classList.remove("hidden");

  currentPrivacy = privacy;
  let privacyStatus;
  if (privacy === "private_message") {
    privacyStatus = "reservadamente";
  } else {
    privacyStatus = "público";
  }
  recipientContainer.innerHTML = `Enviando para ${currentContact} (${privacyStatus})`;
}

//Sidebar Opening
function openSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const maskLayer = document.querySelector(".mask-layer");
  sidebar.classList.toggle("open");
  maskLayer.classList.toggle("show");
}

// INICIALIZAÇAO E FUNCIONAMENTO
document.addEventListener("DOMContentLoaded", () => {
  setUser();
  checkParticipants();
  renderContacts();
  setInterval(checkParticipants, 5000);
  setInterval(getMessages, 3000);
  setInterval(renderContacts, 10000);
});
