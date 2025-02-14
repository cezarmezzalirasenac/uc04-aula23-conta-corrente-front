import { useForm } from '@mantine/form'
import './App.css'
import { Button, PasswordInput, TextInput } from '@mantine/core'
import { useCallback, useState } from 'react'

type formValues = {
  cpf: string;
  password: string;
}

function App() {
  const form = useForm<formValues>({
    mode: 'uncontrolled',
    initialValues: {
      cpf: '',
      password: ''
    }
  })

  const [status, setStatus] = useState('Não Logado');

  const handleForm = useCallback(async ({ cpf, password }: formValues) => {
    console.log(cpf, password)
    const loginData = JSON.stringify({
      cpf,
      password
    })
    console.log(loginData)

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{"cpf":"${cpf}","password":"${password}"}`
    };
    try {
      const response = await fetch("http://172.17.9.86:3000/contas/auth", options)
      const responseBody = await response.json();
      const { token } = responseBody
      if (token) {
        console.log(token)
        setStatus("Logado")
      }

    } catch (error) {
      console.log(error);
    }


  }, []);


  return (
    <>
      <form onSubmit={form.onSubmit(handleForm)}>
        <TextInput
          label="CPF"
          placeholder="CPF"
          key={form.key('cpf')}
          {...form.getInputProps('cpf')}
        />
        <PasswordInput
          mt="md"
          label="Password"
          placeholder="Password"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <Button type="submit" mt="sm">
          Submit
        </Button>
      </form>
      <h1>{status}</h1>
    </>
  )
}

export default App
