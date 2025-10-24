import { DeleteIcon, EditIcon } from './Icons'
import { useAppSelector } from '../hooks/store'
import { CreateNewUser } from './CreateNewUser'
import { useState } from 'react'
import { UserWithId } from '../store/users/slice'
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title,
} from '@tremor/react'
import { EditExistingUser } from './EditExistingUser'
import { ConfirmDialog } from './ConfirmDialog'

interface ModalState {
  type: 'add' | 'edit' | null
  user: UserWithId | null
}

interface DialogState {
  isOpen: boolean
  user: UserWithId | null
}

export function ListOfUsers() {
  const [modalState, setModalState] = useState<ModalState>({
    type: null,
    user: null,
  })

  const closeModal = () => setModalState({ type: null, user: null })
  const openAddModal = () => setModalState({ type: 'add', user: null })
  const openEditModal = (user: UserWithId) =>
    setModalState({ type: 'edit', user })

  const [dialogState, setDialogOpen] = useState<DialogState>({
    isOpen: false,
    user: null,
  })

  const openDialog = (user: UserWithId) =>
    setDialogOpen({ isOpen: true, user: user })
  const closeDialog = () => setDialogOpen({ isOpen: false, user: null })

  const users = useAppSelector((state) => state.users)

  return (
    <>
      <Card className="outline-none ring-gray-400 rounded-sm h-full overflow-y-auto min-w-[250px]">
        <div className="flex justify-between items-center mb-4 gap-4">
          <Title className="flex items-center">
            <span className='text-tremor-content-default dark:text-slate-600'>Users</span>
            <Badge className="ml-2 rounded-xl text-blue-600 bg-blue-100 ring-0">
              {users.length}
            </Badge>
          </Title>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800 transition"
            onClick={openAddModal}
          >
            Add User
          </button>
        </div>
        <Table className="text-gray-600">
          <TableHead>
            <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
              <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Id
              </TableHeaderCell>
              <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Name
              </TableHeaderCell>
              <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Email
              </TableHeaderCell>
              <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Actions
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                  {user.id}
                </TableCell>
                <TableCell className="flex items-center gap-4 max-w-80">
                  <img
                    className="w-8 h-8 rounded-full object-cover"
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt={user.name}
                  />
                  <span className="truncate">{user.name}</span>
                </TableCell>
                <TableCell className="max-w-80">
                  <span className="truncate">{user.email}</span>
                </TableCell>
                <TableCell className="flex items-center gap-4 justify-left">
                  <button
                    type="button"
                    className="hover:text-black transition"
                    // onClick={() => removeUser(user.id)}
                    onClick={() => openDialog(user)}
                  >
                    <DeleteIcon />
                  </button>
                  <button
                    type="button"
                    className="hover:text-black transition"
                    onClick={() => openEditModal(user)}
                  >
                    <EditIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {modalState.type === 'add' && (
        <CreateNewUser
          isOpen={modalState.type === 'add'}
          onClose={closeModal}
        />
      )}
      {modalState.type === 'edit' && modalState.user && (
        <EditExistingUser
          isOpen={modalState.type === 'edit'}
          onClose={closeModal}
          user={modalState.user}
        />
      )}
      <ConfirmDialog
        isOpen={dialogState.isOpen}
        onClose={closeDialog}
        user={dialogState.user}
      />
    </>
  )
}
