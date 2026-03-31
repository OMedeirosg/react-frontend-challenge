import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Logo } from '@/components/logo'
import { RegisterForm } from '@/features/auth/ui/RegisterForm'

export function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center gap-8 p-4">
      <Logo className="h-10 sm:h-11" />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>
            Registe-se para usar o CineDash (auth simulada, sem servidor).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
