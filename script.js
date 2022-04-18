const API_PARTICIPANTES = "https://mock-api.driven.com.br/api/v6/uol/participants"
const API_CONEXAO = "https://mock-api.driven.com.br/api/v6/uol/status"
const API_MENSAGENS = "https://mock-api.driven.com.br/api/v6/uol/messages"

let nomeUsuario = null
let caixaDeMensagens = [];
let conexaoUsuario = null
let mostrarMensagem = null

const listaMensagens = document.querySelector(".mensagens");

function entrarNaSala(){
    nomeUsuario = document.querySelector(".input_login_usuario").value;
    if(nomeUsuario !== ""){
        telaInicial();
        qualseunome();
    }
}

function telaInicial(){
    const telaEntrada = document.querySelector(".tela_de_entrada");
    const loging = document.querySelector(".entrando");

    telaEntrada.classList.toggle("escondido");
    loging.classList.toggle("escondido");
}
function paginaDeMensagens(){
    const telaPrincipal = document.querySelector(".tela_de_entrada");
    telaPrincipal.classList.add("escondido");
}

function qualseunome(){
   const usuario = {name: nomeUsuario};
   const promisseEntrada = axios.post(API_PARTICIPANTES, usuario);
   
   promisseEntrada.then(entradaComSucesso);
   promisseEntrada.catch(entradaSemSucesso);

}

function entradaComSucesso() {
    paginaDeMensagens();
    
    conexaoUsuario = setInterval(manterConexao, 5000);

    pegarMensagens();

    mostrarMensagem = setInterval(pegarMensagens, 3000);

    botaoMensagem();
}
function entradaSemSucesso() {    
    alert(`Esse nome de usuário, ${nomeUsuario} já está cadastrado, por favor escolha outro para se cadastrar`)
    telaInicial();
}

function manterConexao(){

    const usuarioComServidor = { name: nomeUsuario};

    axios.post(API_CONEXAO, usuarioComServidor);
    console.log(API_CONEXAO)
}

function pegarMensagens(){

    const pegaMensagem = axios.get(API_MENSAGENS);
    pegaMensagem.then(controlaAsMensagens);
}

function controlaAsMensagens (response){
    caixaDeMensagens = response.data;

    listaMensagens.innerHTML += "";

    caixaDeMensagens.forEach(processarMensagens);

    rolagemAutomatica();        
    
}

function processarMensagens(mensagem){

    if(mensagem.type == "status"){
        listaMensagens.innerHTML =+ `
        <li class="mensagem-status" data-identifier="message">
            <p> <span class="horario">(${mensagem.time}) </span> <b>${mensagem.from}</b> 
            para <b>${mensagem.to}:</b> ${mensagem.text}
            </p>
        </li>
        `
    }

    else if (mensagem.type == "message"){
        listaMensagens.innerHTML += `
        <li class="mensagem-aberta" data-identifier="message">
            <p> <span class="horario">(${mensagem.time}) </span> <b>${mensagem.from}</b> 
            para <b>${mensagem.to}:</b> ${mensagem.text}
            </p>
        </li>
        `
    }

    else if (mensagem.type = "private_message"){
        listaMensagens.innerHTML += `
        <li class="mensagem-reservada" data-identifier="message">
            <p> <span class="horario">(${mensagem.time}) </span> <b>${mensagem.from}</b> 
            para <b>${mensagem.to}:</b> ${mensagem.text}
            </p>
        </li> `
    }

}

function rolagemAutomatica() {
    const ultimoLi = document.querySelector(".mensagens li:last-child");
    ultimoLi.scrollIntoView();

}





