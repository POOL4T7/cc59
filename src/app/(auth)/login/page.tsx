'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react'; // Added useEffect import
// Removed useState as isLoading comes from useAuth

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
// Removed ApiError as Supabase error structure is different

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, isLoading, isAuthenticated, user } = useAuth(); // Get isLoading from context

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect if already logged in and user object is available
      // This can happen if the onAuthStateChange fires quickly
      // or if navigating back to login page when already authenticated.
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await loginUser(values.email, values.password);

      if (error) {
        console.error('Supabase login error:', error);
        toast.error('Login Failed', {
          description: error.message || 'Invalid credentials',
        });
        return;
      }

      // No explicit toast success here, onAuthStateChange will handle user state
      // and useEffect above will redirect.
      // If you still want a success toast:
      // toast.success('Login Successful', { description: 'Welcome back!' });

      // The redirection will be handled by the useEffect watching isAuthenticated
      // router.push('/menu'); // Or redirect immediately if preferred
    } catch (error: any) {
      // This catch block might be redundant if supabase errors are always in the 'error' object
      console.error('Unexpected error during login:', error, error.messages);
      toast.error('Login Failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    }
    // isLoading state is managed by AuthContext
  };

  // Prevent rendering form if already authenticated and redirecting
  if (isLoading && !form.formState.isSubmitting) return <p>Loading...</p>; // Show a general loading if context is loading initial auth state
  if (isAuthenticated && user) return <p>Redirecting...</p>; // Or a specific redirecting message

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-800'>Login</h1>
          <p className='mt-2 text-sm text-gray-600'>Welcome back to CC59</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='you@example.com'
                      {...field}
                      type='email'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Enter your password'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              className='w-full'
              disabled={isLoading || form.formState.isSubmitting}
            >
              {isLoading || form.formState.isSubmitting
                ? 'Logging in...'
                : 'Login'}
            </Button>
            <div className='text-center mt-4 space-y-2'>
              <Link
                href='/forgot-password'
                className='text-sm text-blue-600 hover:underline block'
              >
                Forgot Password?
              </Link>
              <p className='text-sm text-gray-600'>
                Don&apos;t have an account?{' '}
                <Link
                  href='/register' // Assuming your signup page will be at /register
                  className='text-blue-600 hover:underline'
                >
                  Register
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
