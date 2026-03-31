import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { RegisterForm } from '@/features/auth/ui/RegisterForm'

export function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center p-4">
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
