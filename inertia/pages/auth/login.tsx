import { InferPageProps } from '@adonisjs/inertia/types'
import { Link, useForm } from '@inertiajs/react'
import LoginController from '#controllers/auth/login_controller'
import { Button } from '~/app/components/ui/button'
import { Input } from '~/app/components/ui/input'
import { Label } from '~/app/components/ui/label'
import { FormError } from '~/app/components/ui/form_error'

export default function Login({}: InferPageProps<LoginController, 'show'>) {
  const { data, setData, errors, post } = useForm({ email: '', password: '' })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        post('/login')
      }}
    >
      <div className="w-full lg:grid min-h-screen lg:grid-cols-2">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-balance text-muted-foreground">
                Enter your email below to login to your account
              </p>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  required
                />
                <FormError error={errors.email} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  required
                />
                <FormError error={errors.password} />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="underline">
                Register
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          {/* <img
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        /> */}
        </div>
      </div>
    </form>
  )
}
