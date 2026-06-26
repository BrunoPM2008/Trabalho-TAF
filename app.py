# Importações importantes para o FLASK como as rotas ou o trabalho com JSON para criação e controle de dicionarios dentro da banco
from flask import Flask, render_template, make_response, jsonify, request


app = Flask(__name__)
# Configuração do FLASK para não ordenar os names de objetos em ordem alfabetica
app.json.sort_keys = False

# Função que calcula os pontos do TAF
def calcular_pontuacao(soldado):
    pontos = 0

    # Aqui é calculado o desempenho de cada soldado com base no numero de flexões, abdominais etc.
    if soldado["flexao"] >= 30:
        pontos += 30  # Desempenho excelente
    elif soldado["flexao"] >= 21:
        pontos += 20  # Padrão mínimo oficial de suficiência (Apto)
    elif soldado["flexao"] >= 15:
        pontos += 10  # Abaixo do padrão ideal, mas com pontuação mínima
    else:
        pontos += 0   # Inapto / Sem pontuação

    if soldado["abdominal"] >= 42:
        pontos += 30  # Desempenho excelente
    elif soldado["abdominal"] >= 34:
        pontos += 20  # Padrão mínimo oficial de suficiência (Apto)
    elif soldado["abdominal"] >= 25:
        pontos += 10  # Abaixo do padrão ideal, mas com pontuação mínima
    else:
        pontos += 0   # Inapto / Sem pontuação

    if soldado["barra"] >= 7:
        pontos += 30  # Desempenho excelente
    elif soldado["barra"] >= 3:
        pontos += 20  # Padrão mínimo oficial de suficiência (Apto - 3 repetições)
    elif soldado["barra"] >= 1:
        pontos += 10  # Consegue fazer, mas abaixo do mínimo de suficiência
    else:
        pontos += 0   # Não faz nenhuma / Inapto

    metros = soldado["corrida"]
    if metros >= 3400:
        pontos += 50 # Desempenho excelente
    elif metros >= 3200:
        pontos += 45 # Acima do padrão ideal
    elif metros >= 3000:
        pontos += 40 # Acima do padrão ideal
    elif metros >= 2900:
        pontos += 35 # Acima do padrão ideal
    elif metros >= 2800:
        pontos += 30 # Padrão mínimo oficial de suficiência
    elif metros >= 2600:
        pontos += 25 # Padrão mínimo oficial de suficiência
    elif metros >= 2400:
        pontos += 20 # Abaixo do padrão ideal, mas com pontuação abaixo
    elif metros >= 2200:
        pontos += 15 # Abaixo do padrão ideal, mas com pontuação abaixo
    elif metros >= 2100:
        pontos += 10 # Abaixo do padrão ideal, mas com pontuação abaixo
    else:
        pontos += 0  # Metragem isuficiente / Inapto

    return pontos

# "Banco de dados" é apenas uma lista que ficara armazenado os soldados
soldados = []

# Contador do id atual para ir incrementando de forma númerica
idCount = 1

# Essas são as rotas de CRUD para o navegador chamar as função
# Para definir qual função será executada utilizamos os methados de envio como paremetro

# Listar os soldados dentro da lista soldados
# GET para listar  
@app.route("/soldados", methods=["GET"])
def listarSoldados():
    return make_response(jsonify(soldados))

# Cadastro de soldados dentro da lista soldados
# POST para criar
@app.route("/soldados", methods=["POST"])
def cadastroSoldados():
    soldado = request.json

    pontuacao = calcular_pontuacao(soldado)
    soldado["pontuacao"] = pontuacao

    global idCount
    soldado["id"] = idCount
    idCount += 1

    soldados.append(soldado)
    return jsonify({"mensagem": "Soldado cadastrado", "soldado": soldado}), 201

# Atualizar os soldados dentro da lista soldados
# PUT para atualizar
@app.route("/soldados/<int:id>", methods=["PUT"])
def atualizarSoldado(id):
    dados = request.json
    for soldado in soldados:
        if soldado["id"] == id:
            soldado.update(dados)
            pontuacao = calcular_pontuacao(soldado)
            soldado["pontuacao"] = pontuacao
            return '', 204
    return '', 404

# Deletar usuarios dentro da lista soldados
# DELETE para deletar
@app.route("/soldados/<int:id>", methods=["DELETE"])
def deletarSoldado(id):
    for soldado in soldados:
        if soldado["id"] == id:
            soldados.remove(soldado)
            return '', 204
    return '', 404

# Chama o HTML do site
@app.route("/")
def home():
    return render_template("index.html")

# Serve para falar para o python que este arquivo so será executado quando ele for o que esta em primeiro plano
if __name__ == "__main__":
    app.run()