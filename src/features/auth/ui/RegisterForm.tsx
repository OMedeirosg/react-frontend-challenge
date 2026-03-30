import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  registerSchema,
  type RegisterFormData,
} from '@/features/auth/model/register-schema'
import { useAuthStore } from '@/features/auth/store'

export function RegisterForm() {
  const navigate = useNavigate()
  const registerAccount = useAuthStore((s) => s.register)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    clearErrors('root')
    const result = await registerAccount(data.email, data.password)
    if (!result.success) {
      if (result.error === 'duplicate_email') {
        setError('root', {
          message: 'Este email já está registado.',
        })
      }
      return
    }
    await navigate({ to: '/login' })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      {errors.root?.message ? (
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{errors.root.message}</AlertDescription>
        </Alert>
      ) : null}

      <Field data-invalid={!!errors.email}>
        <FieldLabel htmlFor="register-email">Email</FieldLabel>
        <FieldContent>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          <FieldError errors={errors.email ? [errors.email] : undefined} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.password}>
        <FieldLabel htmlFor="register-password">Senha</FieldLabel>
        <FieldContent>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <FieldError errors={errors.password ? [errors.password] : undefined} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.confirmPassword}>
        <FieldLabel htmlFor="register-confirm-password">
          Confirmar senha
        </FieldLabel>
        <FieldContent>
          <Input
            id="register-confirm-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          <FieldError
            errors={
              errors.confirmPassword ? [errors.confirmPassword] : undefined
            }
          />
        </FieldContent>
      </Field>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'A registar…' : 'Registar'}
      </Button>
    </form>
  )
}
