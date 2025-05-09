import { toast } from 'sonner'

export function useToast() {
  return {
    toast: (options: {
      title?: string
      description?: string
      variant?: 'default' | 'destructive'
    }) => {
      const { title, description, variant } = options

      switch (variant) {
        case 'destructive':
          toast.error(title, { description })
          break
        default:
          toast(title, { description })
      }
    }
  }
}
