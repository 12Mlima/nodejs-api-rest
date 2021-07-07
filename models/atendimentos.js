const moment = require('moment');
const axios = require('axios');
const conexao = require('../infraestrutura/conexao');
const repositories = require('../repositories/atendimentos');

class Atendimento {
    constructor() {
        this.dataValida = (data, dataCriacao) =>
            moment(data).isSameOrAfter(dataCriacao);
        this.clienteValido = (tamanho) => tamanho >= 5;

        this.valida = (parametros) =>
            this.validacoes.filter((item) => {
                const { nome } = item.nome;
                const parametro = parametros[nome];

                return !item.valido(parametro);
            });

        this.validacoes = [
            {
                nome: 'data',
                valido: this.dataValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: this.clienteValido,
                mensagem: 'Cliente deve ter pelo menos cinco caracteres'
            }
        ];
    }

    create(atendimento) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
        const data = moment(atendimento.data, 'DD/MM/YYYY').format(
            'YYYY-MM-DD HH:MM:SS'
        );

        const parametros = {
            data: { data, dataCriacao },
            cliente: { tamanho: atendimento.cliente.length }
        };

        const erros = this.valida(parametros);
        const existemErros = erros.length;

        if (existemErros) {
            return new Promise((reject) => reject(erros));
        } else {
            const atendimentoDatado = { ...atendimento, dataCriacao, data };
            return repositories.create(atendimentoDatado).then((resultados) => {
                const id = resultados.insertId;
                return { ...atendimento, id };
            });
        }
    }

    list() {
        return repositories.list();
    }

    searchId(id, res) {
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`;

        conexao.query(sql, async (erro, resultados) => {
            const atendimento = resultados[0];
            const cpf = atendimento.cliente;
            if (erro) {
                res.status(400).json(erro);
            } else {
                const { data } = await axios.get(
                    `http://localhost:8082/${cpf}`
                );

                atendimento.cliente = data;

                res.status(200).json(atendimento);
            }
        });
    }

    update(id, valores, res) {
        if (valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format(
                'YYYY-MM-DD HH:MM:SS'
            );
        }
        const sql = `UPDATE Atendimentos SET ? WHERE id=?`;
        conexao.query(sql, [valores, id], (erro) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({ ...valores, id });
            }
        });
    }

    delete(id, res) {
        const sql = `DELETE FROM Atendimentos WHERE id=?`;

        conexao.query(sql, id, (erro) => {
            if (erro) {
                res.status(400).json(erro);
            } else {
                res.status(200).json({ id });
            }
        });
    }
}

module.exports = new Atendimento();
