const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 3000;

// CORS middleware
app.use(cors());

// Configuração do banco de dados
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "gerenciamento_fila",
  password: "1234",
  port: 5432,
});

// Conexão ao banco de dados
pool
  .connect()
  .then(() => {
    console.log("Conectado ao banco de dados PostgreSQL!");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
  });

app.use(express.json()); // Para analisar JSON no corpo da requisição
app.use(express.static("public")); // Para servir arquivos estáticos

// Rota para criar uma nova senha
app.post("/nova-senha", async (req, res) => {
  try {
    const result = await pool.query(
      "INSERT INTO senhas (status) VALUES ($1) RETURNING *",
      ["pendente"]
    );
    res.json(result.rows[0]); // Retorna a senha criada
  } catch (err) {
    console.error("Erro ao gerar nova senha:", err);
    res.status(500).json({ message: "Erro ao gerar nova senha" });
  }
});

// Rota para chamar a próxima senha
app.get("/proxima-senha", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM senhas WHERE status = $1 ORDER BY numero ASC LIMIT 1",
      ["pendente"]
    );
    if (result.rows.length > 0) {
      const senha = result.rows[0];
      await pool.query("UPDATE senhas SET status = $1 WHERE id = $2", [
        "chamada",
        senha.id,
      ]);
      res.json(senha); // Retorna a próxima senha
    } else {
      res.status(404).json({ message: "Nenhuma senha pendente" });
    }
  } catch (err) {
    console.error("Erro ao buscar a próxima senha:", err);
    res.status(500).json({ message: "Erro ao buscar a próxima senha" });
  }
});

// Inicia o servidor na porta 3000
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
