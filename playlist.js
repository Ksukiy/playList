/**
 * SISTEMA DE PLAYLIST MUSICAL COM ANO
 * Tema lilás e funcionalidade para adicionar ano das músicas
 */

// Elementos HTML
const FORM_ADICIONAR = document.getElementById('form-adicionar-musica');
const INPUT_TITULO = document.getElementById('input-titulo');
const INPUT_ARTISTA = document.getElementById('input-artista');
const INPUT_ANO = document.getElementById('input-ano');
const LISTA_PLAYLIST = document.getElementById('lista-playlist');
const BOTAO_LIMPAR = document.getElementById('botao-limpar');

// Chave para localStorage
const LOCAL_STORAGE_KEY = 'playlist_musical_com_ano';

// Array da playlist
let playlist = [];

/**
 * Carrega a playlist do localStorage ao iniciar
 */
function carregarPlaylist() {
    const playlistSalva = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (playlistSalva) {
        playlist = JSON.parse(playlistSalva);
        atualizarListaPlaylist();
    }
}

/**
 * Salva a playlist atual no localStorage
 */
function salvarPlaylist() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(playlist));
}

/**
 * Adiciona uma nova música à playlist
 */
function adicionarMusica(titulo, artista, ano) {
    if (!titulo.trim() || !artista.trim()) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return;
    }
    
    // Validação básica do ano
    if (ano && (ano < 1900 || ano > new Date().getFullYear() + 1)) {
        alert('Por favor, insira um ano válido!');
        return;
    }
    
    const musica = {
        id: Date.now(),
        titulo: titulo,
        artista: artista,
        ano: ano || 'Desconhecido',
        dataAdicao: new Date().toLocaleDateString('pt-BR')
    };
    
    playlist.push(musica);
    salvarPlaylist();
    atualizarListaPlaylist();
    
    // Limpa os campos do formulário
    INPUT_TITULO.value = '';
    INPUT_ARTISTA.value = '';
    INPUT_ANO.value = '';
}

/**
 * Remove uma música da playlist
 */
function removerMusica(id) {
    playlist = playlist.filter(musica => musica.id !== id);
    salvarPlaylist();
    atualizarListaPlaylist();
}

/**
 * Limpa toda a playlist
 */
function limparPlaylist() {
    if (confirm('Tem certeza que deseja limpar toda a playlist?')) {
        playlist = [];
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        atualizarListaPlaylist();
    }
}

/**
 * Atualiza a exibição da playlist na tela
 */
function atualizarListaPlaylist() {
    LISTA_PLAYLIST.innerHTML = '';
    
    if (playlist.length === 0) {
        LISTA_PLAYLIST.innerHTML = '<li class="list-group-item text-center py-4">Nenhuma música na playlist</li>';
        return;
    }
    
    playlist.forEach(musica => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center playlist-item';
        
        li.innerHTML = `
            <div class="musica-info">
                <h5 class="mb-1">${musica.titulo}</h5>
                <p class="mb-1">${musica.artista}</p>
                <small class="text-muted">Ano: ${musica.ano} | Adicionado em: ${musica.dataAdicao}</small>
            </div>
            <button class="btn btn-outline-danger btn-sm" data-id="${musica.id}">
                <i class="bi bi-trash"></i>
            </button>
        `;
        
        li.querySelector('button').addEventListener('click', () => {
            removerMusica(musica.id);
        });
        
        LISTA_PLAYLIST.appendChild(li);
    });
}

// Event Listeners
FORM_ADICIONAR.addEventListener('submit', function(e) {
    e.preventDefault();
    adicionarMusica(INPUT_TITULO.value, INPUT_ARTISTA.value, INPUT_ANO.value);
});

BOTAO_LIMPAR.addEventListener('click', limparPlaylist);

// Carrega a playlist ao iniciar
document.addEventListener('DOMContentLoaded', carregarPlaylist);