

import { useForm } from '@mantine/form'
import './App.css'
import { Button, PasswordInput, TextInput } from '@mantine/core'
import { useCallback } from 'react'

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

  const handleForm = useCallback(({ cpf, password }: formValues) => {
    console.log(cpf, password)
  }, [])
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
    </>
  )
}

export default App
