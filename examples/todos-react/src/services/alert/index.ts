import { Result } from 'ts-railway'
import Swal from 'sweetalert2'

export const Alert = {
  showError: (error: string) => Swal.fire('Error', error, 'error').then(Result.success)
} as const
