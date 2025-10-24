import { Dialog, DialogPanel } from '@tremor/react'
import { CloseIcon } from './Icons'
import { UserId, UserWithId } from '../store/users/slice'
import { useUserActions } from '../hooks/useUserActions'

interface Props {
  isOpen: boolean
  onClose: () => void
  user: UserWithId | null
}

export function ConfirmDialog({ isOpen, onClose, user }: Props) {
  if (!isOpen || user === null) return

  const { removeUser } = useUserActions()
  const { id, name } = user

  const handleConfirm = ({ id }: { id: UserId }) => {
    removeUser(id)
    onClose()
  }

  return (
    <Dialog open={isOpen} onClose={onClose} static={true} className="z-[100]">
      <DialogPanel className="w-1/4 min-w-[300px] ring-gray-200 bg-white rounded">
        <div className="absolute right-0 top-0 pr-3 pt-3">
          <button
            type="button"
            className="rounded-tremor-small p-2 text-tremor-content-subtle hover:bg-tremor-background-subtle hover:text-tremor-content dark:text-dark-tremor-content-subtle hover:dark:bg-dark-tremor-background-subtle hover:dark:text-tremor-content"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>
        <form className="text-gray-600">
          <h4 className="font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong text-black mb-8">
            Delete user
          </h4>
          <p className="text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content">
            ¿Are you sure you want to delete the user{' '}
            <strong className="font-medium">{name}</strong>?
          </p>
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={() => handleConfirm({ id })}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Yes, delete
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-800 transition"
            >
              No, cancel
            </button>
          </div>
        </form>
      </DialogPanel>
    </Dialog>
  )
}
