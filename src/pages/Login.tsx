import * as React from 'react';
import { Card, CardHeader, CardBody, Button, Input } from '@nextui-org/react';
import { supabase } from '@/config/supabase';
import { useAuthStore } from '@/store/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = React.useState('');

  const authStore = useAuthStore();

  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (email && password) {
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setLoginError('Invalid credentials');
        return;
      }

      if (data?.user && data?.session) {
        authStore.setAuth({
          user: data.user,
          session: data.session,
        });

        navigate('/');
      }
    }
  };

  React.useEffect(() => {
    setLoginError('');
  }, [emailRef?.current?.value, passwordRef?.current?.value]);

  return (
    <div className='grid min-h-screen place-content-center'>
      <Card className='w-96'>
        <CardHeader className='justify-center'>
          <h2 className='text-xl font-semibold'>Login</h2>
        </CardHeader>
        <CardBody>
          <form className='flex flex-col gap-4' onSubmit={onSubmit}>
            <Input
              isRequired
              label='Email'
              placeholder='Enter your email'
              type='email'
              ref={emailRef}
            />
            <Input
              isRequired
              label='Password'
              placeholder='Enter your password'
              type='password'
              ref={passwordRef}
            />

            <Button fullWidth color='primary' type='submit'>
              Login
            </Button>
            {loginError && (
              <p className='text-sm text-center text-red-500'>{loginError}</p>
            )}
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
