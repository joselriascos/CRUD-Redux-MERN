import { Badge, Button, Card, TextInput, Title } from '@tremor/react'
import { useUserActions } from '../hooks/useUserActions'
import { useRef, useState } from 'react'
import Modal from 'react-modal'
import { UserId, UserWithId } from '../store/users/slice'

Modal.setAppElement('#root')

interface Props {
  isOpen: boolean
  onClose: () => void
  user: UserWithId
}

export function EditExistingUser({ isOpen, onClose, user }: Props) {
  const { editUser } = useUserActions()
  const [result, setResult] = useState<
    'ok' | 'error-missing' | 'error-same' | null
  >(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResult(null)

    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const id = formData.get('id') as UserId
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const github = formData.get('github') as string

    if (!name || !email || !github) {
      return setResult('error-missing')
    }

    if (name === user.name && email === user.email && github === user.github) {
      return setResult('error-same')
    }

    editUser({ id, name, email, github })
    setResult('ok')
    form.reset()
    nameInputRef.current?.focus()
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 place-self-center outline-none bg-white flex items-center w-1/2 min-w-72"
    >
      <Card className="outline-none ring-gray-400 rounded-sm">
        <div className="flex items-center justify-between mb-4">
          <Title>Edit user</Title>
          <button
            type="button"
            className="px-4 py-2 flex align-top bg-blue-500 text-white rounded-lg hover:bg-blue-800 transition"
            onClick={onClose}
          >
            Go back
          </button>
        </div>

        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="flex justify-between gap-4 items-center mt-2">
            <label htmlFor="id" className="font-medium">
              id
            </label>
            <TextInput
              name="id"
              id="id"
              className="rounded text-gray-600 w-4/5"
              readOnly
              value={user.id}
            />
          </div>

          <div className="flex justify-between gap-4 items-center mt-2">
            <label htmlFor="name" className="font-medium">
              Name
            </label>
            <TextInput
              name="name"
              id="name"
              className="rounded w-4/5"
              placeholder="Aquí el nombre"
              ref={nameInputRef}
              autoFocus
              autoComplete="off"
              defaultValue={user.name}
            />
          </div>

          <div className="flex justify-between gap-4 items-center mt-2">
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <TextInput
              name="email"
              id="email"
              type="email"
              className="rounded w-4/5"
              placeholder="Aquí el email"
              autoComplete="off"
              defaultValue={user.email}
            />
          </div>

          <div className="flex justify-between gap-4 items-center mt-2">
            <label htmlFor="github" className="font-medium">
              GitHub
            </label>
            <TextInput
              name="github"
              id="github"
              className="rounded w-4/5"
              placeholder="Aquí el usuario de GitHub"
              autoComplete="off"
              defaultValue={user.github}
            />
          </div>

          <div className="flex flex-col justify-center items-center gap-4 mt-4">
            <Button
              type="submit"
              className="bg-gray-200 rounded hover:bg-gray-100 transition w-1/3 min-w-min"
            >
              Save
            </Button>
            <span>
              {result === 'ok' && (
                <Badge
                  onClick={() => setResult(null)}
                  className="bg-green-100 rounded-lg ring-0 cursor-pointer text-green-600 font-medium"
                >
                  User edited successfully
                </Badge>
              )}
              {result === 'error-missing' && (
                <Badge
                  onClick={() => setResult(null)}
                  className="bg-red-100 rounded-lg ring-0 cursor-pointer text-red-600 font-medium"
                >
                  There are missing fields
                </Badge>
              )}
              {result === 'error-same' && (
                <Badge
                  onClick={() => setResult(null)}
                  className="bg-red-100 rounded-lg ring-0 cursor-pointer text-red-600 font-medium"
                >
                  No changes were made
                </Badge>
              )}
            </span>
          </div>
        </form>
      </Card>
    </Modal>
  )
}
