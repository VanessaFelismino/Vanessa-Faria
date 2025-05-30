const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const cursosPath = path.join(__dirname, 'public', 'cursos.json');

function lerCursos() {
    const data = fs.readFileSync(cursosPath);
    return JSON.parse(data);
}

function salvarCursos(cursos) {
    fs.writeFileSync(cursosPath, JSON.stringify(cursos, null, 4));
}

app.get('/cursos', (req, res) => {
    res.json(lerCursos());
});

app.get('/cursos/:id', (req, res) => {
    const cursos = lerCursos();
    const id = parseInt(req.params.id);
    const curso = cursos.find(c => c.id === id);
    if (!curso) return res.status(404).json({ erro: 'Curso não encontrado' });
    res.json(curso);
});

app.post('/cursos', (req, res) => {
    const cursos = lerCursos();
    const novoCurso = req.body;
    const novoId = cursos.length > 0 ? cursos[cursos.length - 1].id + 1 : 1;
    novoCurso.id = novoId;
    cursos.push(novoCurso);
    salvarCursos(cursos);
    res.status(201).json(novoCurso);
});

app.put('/cursos/:id', (req, res) => {
    const cursos = lerCursos();
    const id = parseInt(req.params.id);
    const index = cursos.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ erro: 'Curso não encontrado' });
    cursos[index] = { ...cursos[index], ...req.body, id };
    salvarCursos(cursos);
    res.json(cursos[index]);
});

app.delete('/cursos/:id', (req, res) => {
    const cursos = lerCursos();
    const id = parseInt(req.params.id);
    const index = cursos.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ erro: 'Curso não encontrado' });
    cursos.splice(index, 1);
    salvarCursos(cursos);
    res.json({ mensagem: 'Curso removido com sucesso' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
