import { Middleware } from '@reduxjs/toolkit'
import { showMessage, MessageType } from '../services/functions'
import { deleteUserByIdOnError, rollbackUser } from './users/slice'
import { UserWithId } from './users/slice'

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

      // Simulamos una llamada a la base de datos
      fetch('https://jsonplaceholder.typicode.com/users/', {
        method: 'POST',
        body: JSON.stringify(userToAdd),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.ok) {
            showMessage({
              message: `Usuario ${userIdToAdd} agregado correctamente`,
              type: MessageType.SUCCESS,
            })
            return
          }
          throw new Error('Error al agregar usuario')
        })
        .catch((err) => {
          showMessage({
            message: `Error al agregar usuario`,
            type: MessageType.ERROR,
          })
          store.dispatch(deleteUserByIdOnError(userIdToAdd))
          console.log(err)
        })
    }

    //TODO: dialog para preguntar confirmar
    if (type === 'users/deleteUserById') {
      const userIdToRemove = payload
      const userToDelete = previusState.users.find(
        (user: UserWithId) => user.id === userIdToRemove
      )

      // Simulamos una llamada a la base de datos
      fetch(`https://jsonplaceholder.typicode.com/users/${userIdToRemove}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (res.ok) {
            showMessage({
              message: `Usuario ${userIdToRemove} eliminado correctamente`,
              type: MessageType.SUCCESS,
            })
            return
          }
          throw new Error('Error al eliminar el usuario')
        })
        .catch((err) => {
          showMessage({
            message: `Error al eliminar el usuario ${userIdToRemove}`,
            type: MessageType.ERROR,
          })
          if (userToDelete) store.dispatch(rollbackUser(userToDelete))
          console.log(err)
        })
    }

    if (type === 'users/updateUser') {
      const userToEdit = payload
      const previusUser = previusState.users.find(
        (user: UserWithId) => user.id === userToEdit.id
      )

      // Simulamos una llamada a la base de datos
      fetch(`https://jsonplaceholder.typicode.com/users/${userToEdit.id}`, {
        method: 'PUT',
        body: JSON.stringify(userToEdit),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.ok) {
            showMessage({
              message: `Usuario ${userToEdit.id} actualizado correctamente`,
              type: MessageType.SUCCESS,
            })
            return
          }
          throw new Error('Error al actualizar el usuario')
        })
        .catch((err) => {
          showMessage({
            message: `Error al actualizar el usuario ${userToEdit.id}`,
            type: MessageType.ERROR,
          })
          if (previusUser) store.dispatch(rollbackUser(previusUser))
          console.log(err)
          console.log(
            'si devuelve error 500 probablemente es porque la API de prueba no admite PUTs entonces se hace rollback'
          )
        })
    }
  }
