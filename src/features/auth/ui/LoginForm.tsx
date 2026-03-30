import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from '@tanstack/react-router'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { loginSchema, type LoginFormData } from '@/features/auth/model/login-schema'
import { useAuthStore } from '@/features/auth/store'

export function LoginForm() {
  const navigate = useNavigate()
  const loginAccount = useAuthStore((s) => s.login)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    clearErrors('root')
    const result = await loginAccount(data.email, data.password)
    if (!result.success) {
      setError('root', {
        message: 'Email ou senha inválidos.',
      })
      return
    }
    await navigate({ to: '/' })
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
        <FieldLabel htmlFor="login-email">Email</FieldLabel>
        <FieldContent>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          <FieldError errors={errors.email ? [errors.email] : undefined} />
        </FieldContent>
      </Field>

      <Field data-invalid={!!errors.password}>
        <FieldLabel htmlFor="login-password">Senha</FieldLabel>
        <FieldContent>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <FieldError errors={errors.password ? [errors.password] : undefined} />
        </FieldContent>
      </Field>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'A entrar…' : 'Entrar'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Não tem conta?{' '}
        <Link
          to="/register"
          className="text-primary underline underline-offset-4"
        >
          Criar conta
        </Link>
      </p>
    </form>
  )
}
