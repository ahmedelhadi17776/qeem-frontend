import Link from 'next/link';
import dynamic from 'next/dynamic';

// Lazy load Button component for better performance
const Button = dynamic(
  () => import('@/components/ui').then(mod => ({ default: mod.Button })),
  { ssr: true }
);

interface HeaderProps {
  user?: {
    name: string;
    email: string;
  } | null;
  onLogout?: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className='header'>
      <div className='header-content'>
        <div className='header-left'>
          <Link href='/' className='header-logo'>
            <span className='logo-text'>Qeem</span>
          </Link>
        </div>

        <div className='header-right'>
          {user ? (
            <div className='header-user'>
              <span className='user-name'>{user.name}</span>
              <Button variant='ghost' size='sm' onClick={onLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className='header-auth'>
              <Link href='/login'>
                <Button variant='ghost' size='sm'>
                  Login
                </Button>
              </Link>
              <Link href='/register'>
                <Button variant='primary' size='sm'>
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
