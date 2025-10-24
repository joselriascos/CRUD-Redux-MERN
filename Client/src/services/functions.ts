import { toast } from 'sonner'

export enum MessageType {
  SUCCESS = 'success',
  ERROR = 'error',
}

interface Props {
  message: string
  type: MessageType
}

export const showMessage = ({ message, type }: Props) => {
  if (type === MessageType.SUCCESS) {
    toast.success(message)
    return
  }
  if (type === MessageType.ERROR) {
    toast.error(message)
    return
  }
}
