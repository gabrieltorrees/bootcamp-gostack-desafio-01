const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

/**
 * Middleware to log the count of the application requests
 */
function requestCount(req, res, next) {
    console.count('Request count');
    return next();
}

server.use(requestCount);

/**
 * Middleware to check if the id given matches an existing project
 */
function checkProjectExists(req, res, next) {
    const { id } = req.params;

    const project = projects.find(el => el.id == id);

    if(!project) {
        return res.status(400).json({ error: 'Project does not exist!' });
    }

    req.project = project;

    return next();
}

/**
 * Create a new project
 */
server.post('/projects', (req, res) => {
    const id = req.body.id;
    const title = req.body.title;

    const project = projects.find(el => el.id == id);

    if(project) {
        return res.status(400).json({ error: 'Project already exists!' });
    }

    projects.push({ id: id, title: title, tasks: [] });

    return res.json(projects);
});

/**
 * Lists all existing projects
 */
server.get('/projects', (req, res) => {
    return res.json(projects);
});

/**
 * Update the project title based in the id given
 */
server.put('/projects/:id', checkProjectExists, (req, res) => {
    const { title } = req.body;
    const project = req.project;

    project.title = title;

    return res.json(project);
});

/**
 * Delete a project based in the id given
 */
server.delete('/projects/:id', checkProjectExists, (req, res) => {
    const { id } = req.params;

    const index = projects.findIndex(el => el.id == id);

    projects.splice(index, 1);

    return res.send();
});

/**
 * Insert a new task in a project (based in the id given)
 */
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
    const { title } = req.body;
    const project = req.project;

    project.tasks.push(title);

    return res.json(project);
});

server.listen(3000);