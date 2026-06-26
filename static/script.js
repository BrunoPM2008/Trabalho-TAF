window.onload = carregarSoldados();
// Cria uma função do JS para chamar a função do Python e carregar os dados no site
function carregarSoldados() {
  fetch("http://127.0.0.1:5000/soldados", {
    method: "GET"
  })
    .then(res => res.json())
    .then(data => {

      data.sort((a, b) => b.pontuacao - a.pontuacao);

      const tabela = document.getElementById("tabelaSoldados")

      tabela.innerHTML = "";
      if (data && data.length > 0) {
        data.forEach((soldado, index) => {
          const linha = `
                                            <tr>
                                                <td>${index + 1}</td>
                                                <td>${soldado.nome}</td>
                                                <td>${soldado.corrida}</td>
                                                <td>${soldado.flexao}</td>
                                                <td>${soldado.abdominal}</td>
                                                <td>${soldado.barra}</td>
                                                <td>${soldado.pontuacao || "-"}</td>
                                                <td><button class="excluir" data-id="${soldado.id}">Eliminar</button></td>
                                                <td><button class="editar" data-id="${soldado.id}">Editar</button></td>
                                            </tr>
                                        `;
          tabela.innerHTML += linha;
        });
      } else {
        const linha = "<tr class='nenhumSoldado'><td colspan='9'>Nenhum soldado cadastrado até o momento</td></tr>"
        tabela.innerHTML += linha;
      }
    })
}

let idEditando = null;
const form = document.getElementById("formSoldado");
// Esta função é começada quando o botão submit do formulario é precionado
document.getElementById("formSoldado").addEventListener("submit", function (e) {
  // Está impede que o botão submit recaregue a pagina
  e.preventDefault();

  // Pega os dados dos soldados, coloca em variaveis js para ser salvo
  const soldado = {
    nome: document.getElementById("nome").value,
    corrida: Number(document.getElementById("corrida").value),
    flexao: Number(document.getElementById("flexao").value),
    abdominal: Number(document.getElementById("abdominal").value),
    barra: Number(document.getElementById("barra").value)
  };
  console.log(soldado)

  if (idEditando) {
    // Pega o id que esta sendo editado e envia para o backend com o metado de edição PUT junto aos dados do formulario
    fetch(`http://127.0.0.1:5000/soldados/${idEditando}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(soldado)
    })
      // Carrega a lista quando alguem for atualizado, além de enviar uma mensagem de sucesso
      .then(() => {
        idEditando = null;
        document.getElementById("submitButton").innerText = "Cadastrar Resultado";
        form.reset();
        carregarSoldados();
        Swal.fire({
          title: "Soldado Atualizado!",
          icon: "success",
          customClass: {
            confirmButton: 'CompletePop'
          }
        })
      });

  } else {
    // Processo de cadastro do soldado
    fetch("http://127.0.0.1:5000/soldados", {
      // Indica o metado POST como mensionado no app.py para cadastro
      method: "POST",
      // Envio de cabeçalho simples, indicando que oque está sendo enviado é um JSON
      headers: {
        "Content-Type": "application/json"
      },
      // Envia os dados do soldado
      body: JSON.stringify(soldado)
    })
      // Carrega a lista quando alguem for cadastrado, além de enviar uma mensagem de sucesso
      .then(() => {
        form.reset();
        carregarSoldados();
        Swal.fire({
          title: "Soldado Cadastrado!",
          icon: "success",
          customClass: {
            confirmButton: 'CompletePop'
          }
        })
      });
  }
});

// Adiona uma função ao click que será usado para excluir e editar
document.addEventListener("click", function (e) {
  // Verifica se o item clicado tem a classe excluir
  if (e.target.classList.contains("excluir")) {
    // Pega o Id do soldado
    const id = e.target.getAttribute("data-id");
    Swal.fire({
      title: "Deletar Soldado?",
      text: "Deseja realmente eliminar o soldado?",
      icon: "warning",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: "Cancelar",
      customClass: {
        confirmButton: 'DeletePop',
        denyButton: 'CancelPop',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Envia para metado delete
        fetch(`http://127.0.0.1:5000/soldados/${id}`, {
          method: "DELETE"
        })
          // Pega o resultado do JS anunacia que a opeção foi bem sucedida e carrega a lista novamente
          .then(data => {
            carregarSoldados();
            Swal.fire({
              title: "Soldado Eliminado!",
              icon: "success",
              draggable: true,
              customClass: {
                confirmButton: 'CompletePop'
              }
            });
          });
      }
    });

  }

  // Verifica se o item clicado tem a classe editar
  if (e.target.classList.contains("editar")) {
    Swal.fire({
      title: "Editar soldado?",
      text: "Deseja editar os dados do soldado?",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Editar",
      denyButtonText: "Cancelar",
      customClass: {
        confirmButton: 'ConfirmPop',
        denyButton: 'CancelPop',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Pega o Id do usuario
        const id = e.target.getAttribute("data-id");
        idEditando = id;

        // Ele chama todos os soldados e procura pleo soldado com id correto para inserir os valores nos inputs
        fetch(`http://127.0.0.1:5000/soldados`)
          .then(res => res.json())
          .then(data => {

            console.log(data);

            const soldado = data.find(s => s.id == id);

            document.getElementById("nome").value = soldado.nome;
            document.getElementById("corrida").value = soldado.corrida;
            document.getElementById("flexao").value = soldado.flexao;
            document.getElementById("abdominal").value = soldado.abdominal;
            document.getElementById("barra").value = soldado.barra;
            document.getElementById("submitButton").innerText = "Editar Resultado";
          });
      }
    });
  }
});
