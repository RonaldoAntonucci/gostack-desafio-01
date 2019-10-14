const express = require("express");

const app = express();
app.use(express.json());

//definindo a classe de Projetos
class Project {
  constructor(id, title) {
    this.id = `${id}`;
    this.title = title;
    this.tasks = [];
  }
}

//Criando o array para armazenar os projetos
const projects = [];
let RequestCont = 0;

//Definindo os Middlewares
//Global
app.use((req, res, next) => {
  RequestCont++;
  console.log(RequestCont);
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

//Local
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }

  req.id = id;

  return next();
}

//Criando as Rotas
//Rotas dos Projectos
app.get("/projects", (req, res) => {
  return res.json(projects);
});

app.post("/projects", (req, res) => {
  const { id, title } = req.body;

  projects.push(new Project(id, title));

  return res.json(projects);
});

app.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;

  return res.json(project);
});

app.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req;
  const project = projects.find(p => p.id == id);
  projects.splice(projects.indexOf(project), 1);

  return res.send();
});

//Rotas das Tasks
app.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);
  project.tasks.push(title);

  return res.json(project);
});

app.listen(3000);
