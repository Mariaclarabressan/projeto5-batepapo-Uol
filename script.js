const API_PARTICIPANTES = "https://mock-api.driven.com.br/api/v6/uol/participants"
const API_CONEXAO = "https://mock-api.driven.com.br/api/v6/uol/status"
const API_MENSAGENS = "https://mock-api.driven.com.br/api/v6/uol/messages"

let nomeUsuario = null
let caixaDeMensagens = [];
let conexaoUsuario = null
let mostrarMensagem = null

let listaMensagens = document.querySelector(".mensagens");

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

    listaMensagens.innerHTML = "";

    caixaDeMensagens.forEach(processarMensagens);
    

    rolagemAutomatica();        
    
}

function processarMensagens(mensagem){   

    if(mensagem.type == "status"){
        listaMensagens.innerHTML += `
        <li class="mensagem-status" data-identifier="message">
            <p> <h4 class="horario">(${mensagem.time}) </h4> <h4>${mensagem.from}</h4> 
            para <h4>${mensagem.to}:</h4> ${mensagem.text}
            </p>
        </li>
        `
    } else if (mensagem.type == "message"){
        listaMensagens.innerHTML += `
        <li class="mensagem-aberta" data-identifier="message">
            <p> <h4 class="horario">(${mensagem.time}) </h4> <h4>${mensagem.from}</h4> 
            para <h4>${mensagem.to}:</h4> ${mensagem.text}
            </p>
        </li>
        `
    } else if (mensagem.to == nomeUsuario){
        listaMensagens.innerHTML += `
        <li class="mensagem-reservada" data-identifier="message">
            <p> <h4 class="horario">(${mensagem.time}) </h4> <h4>${mensagem.from}</h4> 
            para <h4>${mensagem.to}:</h4> ${mensagem.text}
            </p>
        </li> `
    }

}

function rolagemAutomatica() {
    const mensagem = document.querySelector(".mensagens");
    const liFinal = mensagem.querySelector(`:nth-child(${mensagem.children.length-1})`);
    
    liFinal.scrollIntoView();
}

function enviaMensagem(){
    let escreveMensagem = document.querySelector(".input__mensagem")
    
    let enviaMensagem = escreveMensagem.value;
    

    if(enviaMensagem !== ""){
        const texto ={
            from: nomeUsuario,
            to: "Todos",
            text: enviaMensagem,
            type: "message"
        } 
        const promisseEnviarMensagem = axios.post(API_MENSAGENS, texto);
        promisseEnviarMensagem.then(()=>{
            
        });
    }
}
function botaoMensagem(){
    window.addEventListener('keydown', function(e){
        if(e.key === "Enter")
        enviaMensagem();
    })
}