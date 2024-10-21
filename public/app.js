document.getElementById("gerarSenha").addEventListener("click", gerarSenha);
document
  .getElementById("chamarSenha")
  .addEventListener("click", chamarProximaSenha);

async function gerarSenha() {
  try {
    console.log("Iniciando requisição para gerar nova senha...");

    const response = await fetch("http://127.0.0.1:3000/nova-senha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    console.log("Resposta da requisição:", response);

    if (response.ok) {
      const data = await response.json();
      console.log("Nova senha gerada com sucesso:", data);
      alert(`Nova senha gerada: ${data.numero}`);
    } else {
      const data = await response.json();
      console.log("Erro ao gerar senha:", data);
      alert(`Erro: ${data.message}`);
    }
  } catch (error) {
    console.error("Erro ao gerar senha:", error);
  }
}

async function chamarProximaSenha() {
  try {
    console.log("Iniciando requisição para chamar a próxima senha...");

    const response = await fetch("http://127.0.0.1:3000/proxima-senha");

    console.log("Resposta da requisição para próxima senha:", response);

    if (response.status === 404) {
      console.log("Nenhuma senha pendente.");
      alert("Nenhuma senha pendente.");
      return;
    }

    const data = await response.json();
    console.log("Próxima senha chamada:", data);
    document.getElementById("senhaNumero").innerText = `Senha ${data.numero}`;
  } catch (error) {
    console.error("Erro ao chamar a próxima senha:", error);
  }
}
