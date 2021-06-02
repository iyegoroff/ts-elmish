import { Result } from 'ts-railway'
import Swal from 'sweetalert2'

export const Alert = {
  showAlert: (...args: Parameters<typeof Swal['fire']>) => Swal.fire(...args).then(Result.success)
} as const
