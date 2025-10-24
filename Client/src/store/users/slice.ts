import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { type AppThunk } from '../index'
import { API_URL } from '../../utils/consts'

export type UserId = string

export interface User {
  name: string
  email: string
  github: string
}

export interface UserWithId extends User {
  id: UserId
}

// const DEFAULT_STATE = [
//   {
//     id: '1',
//     name: 'Jose Riascos',
//     email: 'joseluis.riascos10@gmail.com',
//     github: 'joselriascos',
//   },
//   {
//     id: '2',
//     name: 'Emily Jhonson',
//     email: 'emily.jhonson@gmail.com',
//     github: 'emilys',
//   },
//   {
//     id: '3',
//     name: 'Miguel Durán',
//     email: 'midudev@gmail.com',
//     github: 'midudev',
//   },
//   {
//     id: '4',
//     name: 'Sofia Rodriguez',
//     email: 'sofia.rodriguez@gmail.com',
//     github: 'sofiarod',
//   },
//   {
//     id: '5',
//     name: 'Emma Miller',
//     email: 'emma.miller@gmail.com',
//     github: 'emmaj',
//   },
// ]

const initialState: UserWithId[] = []

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addNewUser: (state, action: PayloadAction<UserWithId>) => {
      const newUser = action.payload
      state.push(newUser)
      return state
    },

    deleteUserById: (state, action: PayloadAction<UserId>) => {
      const userId = action.payload
      return state.filter((user) => user.id !== userId)
    },

    deleteUserByIdOnError: (state, action: PayloadAction<UserId>) => {
      const userId = action.payload
      return state.filter((user) => user.id !== userId)
    },

    updateUser: (state, action: PayloadAction<UserWithId>) => {
      const updatedUser = action.payload
      const { id } = updatedUser
      const userIndex = state.findIndex((user) => user.id === id)
      if (state[userIndex] !== updatedUser) state[userIndex] = updatedUser
      return state
    },

    rollbackUser: (state, action: PayloadAction<UserWithId>) => {
      const userToRollback = action.payload
      const isUserIdAlreadyDefined = state.some(
        (user) => user.id === userToRollback.id
      )
      if (!isUserIdAlreadyDefined) {
        state.push(userToRollback)
        return
      }
      const userIndex = state.findIndex((user) => user.id === userToRollback.id)
      state[userIndex] = userToRollback
      return state
    },

    setUsers: (state, action: PayloadAction<UserWithId[]>) => {
      state = action.payload
      return state
    },
  },
})

export default usersSlice.reducer

export const {
  addNewUser,
  updateUser,
  deleteUserByIdOnError,
  deleteUserById,
  rollbackUser,
  setUsers,
} = usersSlice.actions

export const fetchUsers = (): AppThunk => async (dispatch) => {
  try {
    const response = await fetch(API_URL)
    const data: UserWithId[] = await response.json()
    dispatch(setUsers(data))
    console.log('Users fetched successfully')
  } catch (error) {
    console.error('Failed to fetch users')
  }
}
