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
const INPUT_GENERO = document.getElementById('input-genero');

let contadorCliques = 0;

const CONTADOR_CLIQUES = document.getElementById('contador-cliques');

let removedorMusicas = 0;

const REMOVEDOR_MUSICAS = document.getElementById('removedor-musicas')

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
function adicionarMusica(titulo, artista, ano, genero) {
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
        genero: genero || 'Desconhecido',
        dataAdicao: new Date().toLocaleDateString('pt-BR')
    };
    
    playlist.push(musica);
    contadorCliques++;
    CONTADOR_CLIQUES.textContent = `Músicas adicionadas: ${contadorCliques}`;
    salvarPlaylist();
    atualizarListaPlaylist();

    localStorage.setItem('contador_cliques', contadorCliques);

    // Limpa os campos do formulário
    INPUT_TITULO.value = '';
    INPUT_ARTISTA.value = '';
    INPUT_ANO.value = '';
    INPUT_GENERO.value = '';
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
        contadorCliques = 0;
        CONTADOR_CLIQUES.textContent =  `Músicas adicionadas: ${contadorCliques}`;
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
                <small class="text-muted">Ano: ${musica.ano} | Gênero: ${musica.genero} | Adicionado em: ${musica.dataAdicao}</small>
            </div>
            <button class="btn btn-outline-danger btn-sm" data-id="${musica.id}">
                <i class="bi bi-trash"></i>
            </button>
        `;
        
        // Adiciona o evento de clique para remover a música
        li.querySelector('button').addEventListener('click', () => {
            contadorCliques--;
            CONTADOR_CLIQUES.textContent =  `Músicas adicionadas: ${contadorCliques}`;
            removerMusica(musica.id);
        });
        
        LISTA_PLAYLIST.appendChild(li);
    });
}

const BOTAO_TEMA = document.getElementById('botao-tema');

// Alternar entre modo claro e escuro
BOTAO_TEMA.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    // Salvar preferência no localStorage
    const modoAtual = document.body.classList.contains('dark-mode') ? 'escuro' : 'claro';
    localStorage.setItem('modo_tema', modoAtual);
});

// Aplicar tema salvo ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const temaSalvo = localStorage.getItem('modo_tema');
    if (temaSalvo === 'escuro') {
        document.body.classList.add('dark-mode');
    }
});


// Adiciona o evento de submit ao formulário
FORM_ADICIONAR.addEventListener('submit', function(e) {
    e.preventDefault();
    adicionarMusica(INPUT_TITULO.value, INPUT_ARTISTA.value, INPUT_ANO.value, INPUT_GENERO.value);
});
// Adiciona o evento de clique ao botão de limpar playlist
BOTAO_LIMPAR.addEventListener('click', limparPlaylist);

// Carrega a playlist ao iniciar
document.addEventListener('DOMContentLoaded', carregarPlaylist);
// Recupera o contador de cliques do localStorage
const contadorSalvo = localStorage.getItem('contador_cliques');
if (contadorSalvo) {
    contadorCliques = parseInt(contadorSalvo);
    CONTADOR_CLIQUES.textContent = `Músicas adicionadas: ${contadorCliques}`;
}
