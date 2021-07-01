const conexao = require('./infraestrutura/conexao');
const customExpress = require('./config/customExpress');
const Tabelas = require('./infraestrutura/Tabelas');

conexao.connect((erro) => {
    if (erro) {
        console.log(erro);
    } else {
        console.log('conectado com sucesso');

        Tabelas.init(conexao);

        const aplication = customExpress();

        aplication.listen(3333, () =>
            console.log('servidor rodando com sucesso')
        );
    }
});
