import { useForm } from "@mantine/form";
import "./App.css";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { useCallback, useState } from "react";

type formValues = {
  cpf: string;
  password: string;
};

type formCadastroValues = {
  id: string;
  agencia: number;
  numero: number;
  nome_cliente: string;
  cpf: string;
  data_nascimento: Date;
  data_criacao: Date;
  saldo: number;
}

function App() {
  const form = useForm<formValues>({
    mode: "uncontrolled",
    initialValues: {
      cpf: "",
      password: "",
    },
  });

  const formCadastro = useForm<formCadastroValues>({
    mode: "uncontrolled",
    initialValues: {
      id: "",
      agencia: 0,
      numero: 0,
      nome_cliente: "",
      cpf: "",
      data_nascimento: new Date(),
      data_criacao: new Date(),
      saldo: 0,
    }
  })

  const [status, setStatus] = useState("Não Logado");
  const [token, setToken] = useState("");
  const [idUsuario, setIdUsuario] = useState("");

  const handleForm = useCallback(async ({ cpf, password }: formValues) => {
    console.log(cpf, password);
    const loginData = JSON.stringify({
      cpf,
      password,
    });
    console.log(loginData);

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: `{"cpf":"${cpf}","password":"${password}"}`,
    };
    try {
      const response = await fetch(
        "http://localhost:3000/contas/auth",
        options
      );
      const responseBody = await response.json();
      if (responseBody.token) {
        console.log(responseBody);
        setToken(responseBody.token);
        setIdUsuario(responseBody.id);
        setStatus("Logado");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleGetCadastro = async () => {
    if(!token || !idUsuario){
      alert("Token ou usuário invalido");
      return;
    }

    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      };

      // Busca do backend as informações da conta do usuário
      const response = await fetch(
        `http://localhost:3000/contas/${idUsuario}`,
        options
      );
      const responseBody = await response.json();
      console.log(responseBody)
      // Atualiza o formulário
      formCadastro.setValues({
        id: responseBody.id,
        agencia: responseBody.agencia,
        numero: responseBody.numero,
        nome_cliente: responseBody.nome_cliente,
        cpf: responseBody.cpf,
        data_nascimento: new Date(responseBody.data_nascimento),
        data_criacao: new Date(responseBody.data_criacao),
        saldo: responseBody.saldo,
      })
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <>
      <form onSubmit={form.onSubmit(handleForm)}>
        <TextInput
          label="CPF"
          placeholder="CPF"
          key={form.key("cpf")}
          {...form.getInputProps("cpf")}
        />
        <PasswordInput
          mt="md"
          label="Password"
          placeholder="Password"
          key={form.key("password")}
          {...form.getInputProps("password")}
        />
        <Button type="submit" mt="sm">
          Submit
        </Button>
      </form>

      <h1>{status}</h1>

      <form>
        <TextInput
          label="Nome"
          key={formCadastro.key("nome_cliente")}
          {...formCadastro.getInputProps("nome_cliente")}
        />
        <TextInput
          label="CPF"
          key={formCadastro.key("cpf")}
          {...formCadastro.getInputProps("cpf")}
        />
        <TextInput
          label="Agência"
          key={formCadastro.key("agencia")}
          {...formCadastro.getInputProps("agencia")}
        />
        <TextInput
          label="Número Conta"
          key={formCadastro.key("numero")}
          {...formCadastro.getInputProps("numero")}
        />
        <TextInput
          label="Data Nascimento"
          key={formCadastro.key("data_nascimento")}
          {...formCadastro.getInputProps("data_nascimento")}
        />
        <TextInput
          label="Data Criação Conta"
          key={formCadastro.key("data_criacao")}
          {...formCadastro.getInputProps("data_criacao")}
        />
        <TextInput
          label="Saldo"
          key={formCadastro.key("saldo")}
          {...formCadastro.getInputProps("saldo")}
        />
        <Button type="button" mt="sm" onClick={handleGetCadastro}>
          Submit
        </Button>
      </form>
    </>
  );
}

export default App;
