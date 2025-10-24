import { Middleware } from '@reduxjs/toolkit'
import { showMessage, MessageType } from '../services/functions'
import { deleteUserByIdOnError, rollbackUser } from './users/slice'
import { UserWithId } from './users/slice'
import { API_URL } from '../utils/consts'

export const persistanceLocalStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    // fase 1
    next(action)
    // fase 2 -> Después de que se ejecuta la acción
    localStorage.setItem('__redux_state__', JSON.stringify(store.getState()))
  }

export const syncWithDatabase: Middleware =
  (store) => (next) => (action: any) => {
    const { type, payload } = action
    const previusState = store.getState()

    next(action)

    if (type === 'users/addNewUser') {
      const userToAdd = payload
      const userIdToAdd = payload.id

      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(userToAdd),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.ok) {
            showMessage({
              message: `User ${userIdToAdd} created successfully`,
              type: MessageType.SUCCESS,
            })
            return
          }
          throw new Error('Error creating user')
        })
        .catch((err) => {
          showMessage({
            message: err.message,
            type: MessageType.ERROR,
          })
          store.dispatch(deleteUserByIdOnError(userIdToAdd))
          console.error(err)
        })
    }

    if (type === 'users/deleteUserById') {
      const userIdToRemove = payload
      const userToDelete = previusState.users.find(
        (user: UserWithId) => user.id === userIdToRemove
      )

      fetch(`${API_URL}/${userIdToRemove}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            showMessage({
              message: `User ${userIdToRemove} deleted successfully`,
              type: MessageType.SUCCESS,
            })
            return
          }
          throw new Error('Error deleting user')
        })
        .catch((err) => {
          showMessage({
            message: `Error deleting user ${userIdToRemove}`,
            type: MessageType.ERROR,
          })
          if (userToDelete) store.dispatch(rollbackUser(userToDelete))
          console.error(err)
        })
    }

    if (type === 'users/updateUser') {
      const userToEdit = payload
      const previusUser = previusState.users.find(
        (user: UserWithId) => user.id === userToEdit.id
      )

      fetch(API_URL, {
        method: 'PUT',
        body: JSON.stringify(userToEdit),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.ok) {
            showMessage({
              message: `User ${userToEdit.id} updated successfully`,
              type: MessageType.SUCCESS,
            })
            return
          }
          throw new Error('Error updating user')
        })
        .catch((err) => {
          showMessage({
            message: `Error updating user ${userToEdit.id}`,
            type: MessageType.ERROR,
          })
          if (previusUser) store.dispatch(rollbackUser(previusUser))
          console.error(err)
        })
    }
  }
