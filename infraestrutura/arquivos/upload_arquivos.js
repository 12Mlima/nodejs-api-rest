const fs = require('fs');
const path = require('path');

module.exports = (caminho, nome_arquivo, callbackImagemCriada) => {
    const tipos_validos = ['jpg', 'png', 'jpeg'];

    const tipo = path.extname(caminho);

    const tipo_valido = tipos_validos.indexOf(tipo.substring(1)) !== -1;

    if (tipo_valido) {
        const novoCaminho = `./assets/imagens/${nome_arquivo}${tipo}`;
        fs.createReadStream(caminho).pipe(
            fs
                .createWriteStream(novoCaminho)
                .on('finish', () => callbackImagemCriada(false, novoCaminho))
        );
    } else {
        const erro = 'Tipo é inválido';
        console.log('Erro! Tipo inválido');
        callbackImagemCriada(erro);
    }
};
