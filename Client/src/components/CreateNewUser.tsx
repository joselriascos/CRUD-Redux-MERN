import { Badge, Button, Card, TextInput, Title } from '@tremor/react'
import { useUserActions } from '../hooks/useUserActions'
import { useRef, useState } from 'react'
import Modal from 'react-modal'

Modal.setAppElement('#root')

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function CreateNewUser({ isOpen, onClose }: Props) {
  const { addUser } = useUserActions()
  const [result, setResult] = useState<'ok' | 'error' | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResult(null)

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const github = formData.get('github') as string

    if (!name || !email || !github) {
      return setResult('error')
    }

    addUser({ name, email, github })
    setResult('ok')
    form.reset()
    nameInputRef.current?.focus()
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 place-self-center outline-none bg-white flex items-center w-1/2 min-w-72"
    >
      <Card className="outline-none ring-gray-400 rounded-sm">
        <div className="flex items-center justify-between mb-4">
          <Title>Create new user</Title>
          <button
            type="button"
            className="px-4 py-2 flex align-top bg-blue-500 text-white rounded-lg hover:bg-blue-800 transition"
            onClick={onClose}
          >
            Go back
          </button>
        </div>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <TextInput
            name="name"
            className="rounded"
            placeholder="Aquí el nombre"
            ref={nameInputRef}
            autoFocus
            autoComplete="off"
          />
          <TextInput
            name="email"
            type="email"
            className="rounded"
            placeholder="Aquí el email"
            autoComplete="off"
          />
          <TextInput
            name="github"
            className="rounded"
            placeholder="Aquí el usuario de GitHub"
            autoComplete="off"
          />

          <div className="flex flex-col justify-center items-center gap-4 mt-4">
            <Button
              type="submit"
              className="bg-gray-200 rounded hover:bg-gray-100 transition w-1/3 min-w-min"
            >
              Create user
            </Button>
            <span>
              {result === 'ok' && (
                <Badge
                  onClick={() => setResult(null)}
                  className="bg-green-100 rounded-lg ring-0 cursor-pointer text-green-600 font-medium"
                >
                  Saved successfully
                </Badge>
              )}
              {result === 'error' && (
                <Badge
                  onClick={() => setResult(null)}
                  className="bg-red-100 rounded-lg ring-0 cursor-pointer text-red-600 font-medium"
                >
                  Error with fields
                </Badge>
              )}
            </span>
          </div>
        </form>
      </Card>
    </Modal>
  )
}
