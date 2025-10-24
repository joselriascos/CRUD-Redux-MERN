import { useAppDispatch } from './store'
import { addNewUser, deleteUserById, updateUser } from '../store/users/slice'
import type { UserId, User, UserWithId } from '../store/users/slice'

export const useUserActions = () => {
  const dispatch = useAppDispatch()

  const addUser = ({ name, email, github }: User) => {
    const id = crypto.randomUUID()
    dispatch(addNewUser({ id, name, email, github }))
  }

  const removeUser = (id: UserId) => {
    dispatch(deleteUserById(id))
  }

  const editUser = (user: UserWithId) => {
    dispatch(updateUser(user))
  }

  return { addUser, removeUser, editUser }
}
