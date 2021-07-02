const conexao = require('../infraestrutura/conexao');
const upload_arquivos = require('../infraestrutura/arquivos/upload_arquivos');

class Pet {
    create(pet, res) {
        const query = 'INSERT INTO Pets SET ?';

        upload_arquivos(pet.imagem, pet.nome, (erro, novoCaminho) => {
            if (erro) {
                res.status(400).json({ erro });
            } else {
                const novoPets = { nome: pet.nome, imagem: novoCaminho };
                conexao.query(query, novoPets, (erro) => {
                    if (erro) {
                        console.log(erro);
                        res.status(400).json(erro);
                    } else {
                        res.status(200).json(novoPets);
                    }
                });
            }
        });
    }
}
module.exports = new Pet();
