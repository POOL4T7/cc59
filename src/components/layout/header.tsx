// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MenuIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { logoutUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('userDetails');
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error: unknown) {
      const err = error as Error;
      toast.error('Logout failed', {
        description: err.message || 'Please try again',
      });
    }
  };
  return (
    <header className='sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-lg'>
      <div className=' flex h-16 items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='icon'
            className='text-black hover:bg-white/10'
            onClick={toggleSidebar}
          >
            <MenuIcon className='h-5 w-5' />
          </Button>
          <span className='hidden text-black text-xl font-bold md:inline-block'>
            Admin Dashboard
          </span>
        </div>

        {/* Moved header options to the end */}
        <div className='flex items-center space-x-4 mr-3'>
          {/* <Button
            variant='ghost'
            size='icon'
            className='text-white hover:bg-white/10 relative'
          >
            <BellIcon className='h-5 w-5' />
            <span className='absolute -right-1 -top-1 h-3 w-3 rounded-full bg-red-500'></span>
          </Button> */}
          <div className='flex items-center space-x-4'>
            {/* <div className='text-right hidden md:block'>
              <p className='font-medium'>Admin User</p>
              <p className='text-xs text-white/80'>Super Admin</p>
            </div>
            <Avatar className='border-2 border-white/30'>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback className='bg-indigo-500'>AD</AvatarFallback>
            </Avatar> */}
            <Button
              variant='ghost'
              // size='icon'
              className='flex items-center space-x-1 text-white hover:bg-white/10'
              onClick={handleLogout}
            >
              <LogOutIcon className='h-5 w-5' />
              <span className='hidden md:inline-block'>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
