/**
 * SISTEMA DE PLAYLIST MUSICAL COM localStorage
 * 
 * Este sistema permite:
 * 1. Adicionar novas músicas à playlist
 * 2. Remover músicas da playlist
 * 3. Visualizar todas as músicas cadastradas
 * 4. Persistir os dados mesmo após fechar o navegador
 */

// Constantes para os elementos HTML que serão manipulados
const FORM_ADICIONAR = document.getElementById('form-adicionar-musica');
const INPUT_TITULO = document.getElementById('input-titulo');
const INPUT_ARTISTA = document.getElementById('input-artista');
const LISTA_PLAYLIST = document.getElementById('lista-playlist');
const BOTAO_LIMPAR = document.getElementById('botao-limpar');

// Chave para armazenamento no localStorage
const LOCAL_STORAGE_KEY = 'playlist_musical';

// Array que armazenará as músicas em memória
let playlist = [];

/**
 * Função para carregar a playlist do localStorage
 * Ao iniciar a aplicação, verifica se já existem dados salvos
 * e carrega eles para a variável playlist
 */
function carregarPlaylist() {
    // Recupera os dados do localStorage usando a chave definida
    const playlistSalva = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    // Verifica se existem dados salvos
    if (playlistSalva) {
        // Converte de string JSON para array JavaScript
        playlist = JSON.parse(playlistSalva);
        
        // Atualiza a exibição na tela
        atualizarListaPlaylist();
    }
}

/**
 * Função para salvar a playlist no localStorage
 * Converte o array playlist em string JSON antes de salvar
 */
function salvarPlaylist() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(playlist));
}

/**
 * Função para adicionar uma nova música à playlist
 * @param {string} titulo - Título da música
 * @param {string} artista - Nome do artista/banda
 */
function adicionarMusica(titulo, artista) {
    // Verifica se os campos não estão vazios
    if (!titulo.trim() || !artista.trim()) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    // Cria objeto representando a música
    const musica = {
        id: Date.now(), // Usa o timestamp como ID único
        titulo: titulo,
        artista: artista,
        dataAdicao: new Date().toLocaleDateString()
    };
    
    // Adiciona a música ao array playlist
    playlist.push(musica);
    
    // Salva no localStorage
    salvarPlaylist();
    
    // Atualiza a exibição
    atualizarListaPlaylist();
    
    // Limpa os campos do formulário
    INPUT_TITULO.value = '';
    INPUT_ARTISTA.value = '';
}

/**
 * Função para remover uma música da playlist
 * @param {number} id - ID da música a ser removida
 */
function removerMusica(id) {
    // Filtra o array, mantendo apenas músicas com IDs diferentes do informado
    playlist = playlist.filter(musica => musica.id !== id);
    
    // Salva as alterações no localStorage
    salvarPlaylist();
    
    // Atualiza a exibição
    atualizarListaPlaylist();
}

/**
 * Função para limpar toda a playlist
 */
function limparPlaylist() {
    // Confirmação antes de limpar
    if (confirm('Tem certeza que deseja limpar toda a playlist?')) {
        // Esvazia o array
        playlist = [];
        
        // Remove os dados do localStorage
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        
        // Atualiza a exibição
        atualizarListaPlaylist();
    }
}

/**
 * Função para atualizar a exibição da playlist na tela
 * Cria elementos HTML para cada música na playlist
 */
function atualizarListaPlaylist() {
    // Limpa a lista atual
    LISTA_PLAYLIST.innerHTML = '';
    
    // Verifica se a playlist está vazia
    if (playlist.length === 0) {
        LISTA_PLAYLIST.innerHTML = '<li class="list-group-item">Nenhuma música na playlist</li>';
        return;
    }
    
    // Para cada música na playlist, cria um item de lista
    playlist.forEach(musica => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <div>
                <strong>${musica.titulo}</strong> - ${musica.artista}
                <br>
                <small>Adicionado em: ${musica.dataAdicao}</small>
            </div>
            <button class="btn btn-danger btn-sm" data-id="${musica.id}">
                Remover
            </button>
        `;
        
        // Adiciona evento de clique ao botão de remover
        li.querySelector('button').addEventListener('click', () => {
            removerMusica(musica.id);
        });
        
        // Adiciona o item à lista
        LISTA_PLAYLIST.appendChild(li);
    });
}

// Event Listeners

// Formulário de adição de música
FORM_ADICIONAR.addEventListener('submit', function(e) {
    e.preventDefault(); // Evita o recarregamento da página
    
    // Obtém valores dos inputs
    const titulo = INPUT_TITULO.value;
    const artista = INPUT_ARTISTA.value;
    
    // Chama função para adicionar música
    adicionarMusica(titulo, artista);
});

// Botão para limpar toda a playlist
BOTAO_LIMPAR.addEventListener('click', limparPlaylist);

// Ao carregar a página, carrega a playlist do localStorage
document.addEventListener('DOMContentLoaded', carregarPlaylist);