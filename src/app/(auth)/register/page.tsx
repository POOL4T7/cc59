'use client';

import { useEffect } from 'react'; // Added useEffect
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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

// Registration Form Schema
const registrationSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'), // Supabase default is 6
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function RegisterPage() {
  const router = useRouter();
  // Use isLoading from context, and also isAuthenticated and user for redirection
  const { signupUser, isLoading, isAuthenticated, user } = useAuth(); 

  // Registration Form
  const registrationForm = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect if already logged in 
      router.push('/menu'); 
    }
  }, [isAuthenticated, user, router]);

  // Registration Submit Handler
  const onRegistrationSubmit = async (
    values: z.infer<typeof registrationSchema>
  ) => {
    try {
      const { data, error } = await signupUser(values.email, values.password);

      if (error) {
        console.error('Supabase signup error:', error);
        toast.error('Registration Failed', {
          description: error.message || 'Please try again',
        });
        return;
      }

      // data.user contains user data, data.session is null if email confirmation is pending
      if (data.user && !data.session) {
        toast.info('Registration Successful', {
          description: 'Please check your email to verify your account before logging in.',
        });
        // Optionally redirect to a page saying "check your email" or back to login
        router.push('/login'); 
      } else if (data.user && data.session) {
        // This case implies user is auto-confirmed and logged in by Supabase
        toast.success('Registration Successful', {
          description: 'You are now logged in!',
        });
        // router.push('/menu'); // Redirection handled by useEffect
      } else {
        // Fallback, though Supabase usually provides user or error
        toast.info('Registration Submitted', {
            description: 'Please follow any instructions sent to your email.'
        });
        router.push('/login');
      }

    } catch (error: any) {
      // This catch might be redundant if Supabase errors are handled above
      console.error('Unexpected error during registration:', error);
      toast.error('Registration Failed', {
        description: error.message || 'An unexpected error occurred.',
      });
    }
    // isLoading state is managed by AuthContext
  };

  // Prevent rendering form if already authenticated and redirecting
  if (isLoading && !registrationForm.formState.isSubmitting) return <p>Loading...</p>;
  if (isAuthenticated && user) return <p>Redirecting...</p>;

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-gray-800'>Register</h1>
          <p className='mt-2 text-sm text-gray-600'>Create your CC59 account</p>
        </div>
        <Form {...registrationForm}>
          <form
            onSubmit={registrationForm.handleSubmit(onRegistrationSubmit)}
            className='space-y-6'
          >
            <FormField
              control={registrationForm.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='your@email.com'
                      type='email'
                      {...field}
                      disabled={isLoading || registrationForm.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registrationForm.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Password (min. 6 characters)'
                      {...field}
                      disabled={isLoading || registrationForm.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={registrationForm.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='Confirm Password'
                      {...field}
                      disabled={isLoading || registrationForm.formState.isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isLoading || registrationForm.formState.isSubmitting}>
              {isLoading || registrationForm.formState.isSubmitting ? 'Processing...' : 'Register'}
            </Button>
            <div className='text-center mt-4'>
              <Link
                href='/login'
                className='text-sm text-blue-600 hover:underline'
              >
                Already have an account? Login
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
