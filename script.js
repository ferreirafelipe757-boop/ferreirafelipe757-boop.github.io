const mapaPericias = {
    'acrobacia': 'destreza', 'adestramento': 'carisma', 'atletismo': 'forca',
    'atuacao': 'carisma', 'cavalgar': 'destreza', 'conhecimento': 'inteligencia',
    'cura': 'sabedoria', 'diplomacia': 'carisma', 'enganacao': 'carisma',
    'fortitude': 'constituicao', 'furtividade': 'destreza', 'guerra': 'inteligencia',
    'iniciativa': 'destreza', 'intimidacao': 'carisma', 'intuicao': 'sabedoria',
    'investigacao': 'inteligencia', 'jogatina': 'carisma', 'luta': 'forca',
    'percepcao': 'sabedoria', 'pontaria': 'destreza', 'reflexos': 'destreza',
    'religiao': 'sabedoria', 'sobrevivencia': 'sabedoria', 'vontade': 'sabedoria'
};
const periciasSomenteTreinadas = [
    'adestramento', 'atuacao', 'conhecimento', 'guerra', 
    'jogatina', 'ladinagem', 'misticismo', 'nobreza', 
    'oficio', 'pilotagem', 'religiao'
];
// carregar
let listaFichas = JSON.parse(localStorage.getItem('listaFichas')) || [{ id: '1', nome: 'Personagem 1' }];
let fichaAtualId = localStorage.getItem('fichaAtualId') || '1';

function atualizarPericias() {
    let nivelInput = document.getElementById('nivel').value;
    let nivel = parseInt(nivelInput) || 0;
    let metadeNivel = Math.floor(nivel / 2);

    let bonusDeTreinoValor = 2;
    if (nivel >= 15) bonusDeTreinoValor = 6;
    else if (nivel >= 7) bonusDeTreinoValor = 4;

    let valoresAtributos = {
        'forca': parseInt(document.getElementById('forca').value) || 0,
        'destreza': parseInt(document.getElementById('destreza').value) || 0,
        'constituicao': parseInt(document.getElementById('constituicao').value) || 0,
        'inteligencia': parseInt(document.getElementById('inteligencia').value) || 0,
        'sabedoria': parseInt(document.getElementById('sabedoria').value) || 0,
        'carisma': parseInt(document.getElementById('carisma').value) || 0
    };

    let linhasDePericia = document.querySelectorAll('.pericia');

    linhasDePericia.forEach(function(linha) {
        let inputBonus = linha.querySelector('input[type="number"]:not([readonly])');
        let inputTotal = linha.querySelector('input[readonly]');
        let checkboxTreino = linha.querySelector('input[type="checkbox"]'); 

        let idPericia = inputBonus.id;
        let nomeAtributo = mapaPericias[idPericia];
        let valorDoAtributo = valoresAtributos[nomeAtributo] || 0;
        let bonusExtra = parseInt(inputBonus.value) || 0;

        let estaTreinado = checkboxTreino.checked;
        let bonusTreinado = estaTreinado ? bonusDeTreinoValor : 0;
        let precisaTreino = periciasSomenteTreinadas.includes(idPericia);

        if (precisaTreino && !estaTreinado) {
            inputTotal.value = ''; 
        } else {
            inputTotal.value = metadeNivel + valorDoAtributo + bonusExtra + bonusTreinado;
        }
    });
}



function salvarFicha() {
    let elementos = document.querySelectorAll('input, textarea');
    let dadosFicha = {};
    
    elementos.forEach(function(elemento) {
        if (elemento.id) {
            if (elemento.type === 'checkbox') {
                dadosFicha[elemento.id] = elemento.checked;
            } else {
                dadosFicha[elemento.id] = elemento.value;
            }
        }
    });
    
    localStorage.setItem(`ficha_${fichaAtualId}`, JSON.stringify(dadosFicha));
// trocar nome
    let nomePersonagem = document.getElementById('nome').value || 'Personagem Sem Nome';
    let fichaNoArray = listaFichas.find(f => f.id === fichaAtualId);
    if (fichaNoArray && fichaNoArray.nome !== nomePersonagem) {
        fichaNoArray.nome = nomePersonagem;
        localStorage.setItem('listaFichas', JSON.stringify(listaFichas));
        desenharListaFichas();
    }
}
// trocar de ficha
function carregarFicha(id) {
    fichaAtualId = id;
    localStorage.setItem('fichaAtualId', id);
    
    let dadosSalvos = localStorage.getItem(`ficha_${id}`);
    let elementos = document.querySelectorAll('input, textarea');
    
    elementos.forEach(el => {
        if (el.id) {
            if (el.type === 'checkbox') el.checked = false;
            else el.value = '';
        }
    });

    if (dadosSalvos) {
        let dados = JSON.parse(dadosSalvos);
        elementos.forEach(function(elemento) {
            if (elemento.id && dados[elemento.id] !== undefined) {
                if (elemento.type === 'checkbox') {
                    elemento.checked = dados[elemento.id];
                } else {
                    elemento.value = dados[elemento.id];
                }
            }
        });
    }
    
    atualizarPericias();
}

//lista de fichas
function desenharListaFichas() {
    let container = document.getElementById('lista-de-fichas');
    container.innerHTML = ''; 
    
    listaFichas.forEach(function(ficha) {
        // caixa
        let agrupador = document.createElement('span');
        agrupador.style.marginRight = '12px';
        agrupador.style.display = 'inline-block';

        // selecao
        let botaoFicha = document.createElement('button');
        botaoFicha.innerText = ficha.nome;
        botaoFicha.className = 'botao-seletor-ficha';
        
        if (ficha.id === fichaAtualId) {
            botaoFicha.style.fontWeight = 'bold';
            botaoFicha.style.background = '#ddd'; 
        }
        
        botaoFicha.onclick = function() {
            carregarFicha(ficha.id);
            desenharListaFichas();
        };

        
        let botaoApagar = document.createElement('button');
        botaoApagar.innerText = '❌';
        botaoApagar.style.marginLeft = '4px';
        botaoApagar.style.cursor = 'pointer';
        botaoApagar.title = 'Apagar esta ficha permanentemente';
        
        botaoApagar.onclick = function(evento) {
            evento.stopPropagation(); 
            excluirFicha(ficha.id);
        };

        agrupador.appendChild(botaoFicha);
        agrupador.appendChild(botaoApagar);
        container.appendChild(agrupador);
    });
}

function criarNovaFicha() {
    let novoId = Date.now().toString(); 
    listaFichas.push({ id: novoId, nome: 'Novo Personagem' });
    
    localStorage.setItem('listaFichas', JSON.stringify(listaFichas));
    
    desenharListaFichas();
    carregarFicha(novoId);
}

function excluirFicha(id) {
    let fichaParaDeletar = listaFichas.find(f => f.id === id);
    
    let confirmar = confirm(`Tem certeza que deseja apagar permanentemente a ficha de "${fichaParaDeletar.nome}"?`);
    
    if (confirmar) {
        localStorage.removeItem(`ficha_${id}`);
        
        listaFichas = listaFichas.filter(f => f.id !== id);
        
        
        if (listaFichas.length === 0) {
            let novoId = Date.now().toString();
            listaFichas.push({ id: novoId, nome: 'Personagem 1' });
            fichaAtualId = novoId;
        } 
        // 
        else if (fichaAtualId === id) {
            fichaAtualId = listaFichas[0].id;
        }
      
        localStorage.setItem('listaFichas', JSON.stringify(listaFichas));
        localStorage.setItem('fichaAtualId', fichaAtualId);
    
        desenharListaFichas();
        carregarFicha(fichaAtualId);
    }
}

    
desenharListaFichas();  
carregarFicha(fichaAtualId);

let todosOsCampos = document.querySelectorAll('input, textarea');
todosOsCampos.forEach(function(campo) {
    campo.addEventListener('input', function() {
        atualizarPericias();
        salvarFicha();
    });
    campo.addEventListener('change', function() {
        atualizarPericias();
        salvarFicha();
    }); 
});
