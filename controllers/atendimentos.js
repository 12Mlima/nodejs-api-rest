const Atendimento = require('../models/atendimentos');

module.exports = (aplication) => {
    aplication.get('/atendimentos', (req, res) => {
        Atendimento.list(res);
    });

    aplication.get('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id);
        Atendimento.searchId(id, res);
    });

    aplication.post('/atendimentos', (req, res) => {
        const atendimento = req.body;

        Atendimento.create(atendimento, res);
    });

    aplication.patch('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const valores = req.body;

        Atendimento.update(id, valores, res);
    });

    aplication.delete('/atendimentos/:id', (req, res) => {
        const id = parseInt(req.params.id);
        Atendimento.delete(id, res);
    });
};
