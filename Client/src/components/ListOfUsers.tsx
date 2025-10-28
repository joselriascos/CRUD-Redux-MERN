import { DeleteIcon, EditIcon } from './Icons'
import { useAppDispatch, useAppSelector } from '../hooks/store'
import { CreateNewUser } from './CreateNewUser'
import { useEffect, useState } from 'react'
import { fetchUsers, UserWithId } from '../store/users/slice'
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

  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.users)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  return (
    <>
      <Card className="outline-none ring-gray-400 rounded-sm h-full overflow-y-auto min-w-[250px]">
        <div className="flex justify-between items-center mb-4 gap-4">
          <Title className="flex items-center">
            <span className="text-tremor-content-default dark:text-slate-600">
              Users
            </span>
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
        <Table className="text-gray-600 table-fixed w-full">
          <TableHead>
            <TableRow className="border-b border-tremor-border dark:border-dark-tremor-border">
              <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong truncate overflow-hidden">
                Id
              </TableHeaderCell>
              <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong w-1/3 whitespace-nowrap">
                Name
              </TableHeaderCell>
              <TableHeaderCell className="text-tremor-content-strong dark:text-dark-tremor-content-strong w-1/3 whitespace-nowrap">
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
                <TableCell className="flex items-center">
                  <div className="w-[80px] sm:w-[120px] lg:w-full truncate">
                    {user.id}
                  </div>
                </TableCell>

                <TableCell className="w-1/3 truncate">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <img
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt={user.name}
                    />
                    <span className="truncate">{user.name}</span>
                  </div>
                </TableCell>

                <TableCell className="w-1/3 truncate">
                  <span className="truncate block">{user.email}</span>
                </TableCell>

                <TableCell className="">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="hover:text-black transition"
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
                  </div>
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
