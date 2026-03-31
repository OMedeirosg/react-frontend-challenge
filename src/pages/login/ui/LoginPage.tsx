import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Logo } from '@/components/logo'
import { LoginForm } from '@/features/auth/ui/LoginForm'

export function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center gap-8 p-4">
      <Logo className="h-10 sm:h-11" />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sessão</CardTitle>
          <CardDescription>
            Entre com o email e senha que usou ao criar a conta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
