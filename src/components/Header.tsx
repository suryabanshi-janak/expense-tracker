import { NavLink } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAuthStore } from '@/store/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { supabase } from '@/config/supabase';

const navs: { title: string; href: string }[] = [
  { title: 'Dashboad', href: '/' },
  { title: 'Category', href: '/categories' },
  { title: 'Income', href: '/incomes' },
  { title: 'Expense', href: '/expenses' },
  { title: 'Saving', href: '/savings' },
  { title: 'Lending', href: '/lendings' },
  { title: 'Transaction', href: '/transactions' },
];

export function Header() {
  const user = useAuthStore((state) => state.auth?.user);
  const authStore = useAuthStore();

  const onLogout = async () => {
    let { error } = await supabase.auth.signOut();

    if (error) {
      console.log(error);
      return;
    }

    authStore.setAuth(null);
  };

  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background'>
      <div className='container flex items-center justify-between h-16'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              {navs.map((nav) => (
                <NavLink to={nav.href} key={nav.title}>
                  <div
                    className={cn(navigationMenuTriggerStyle(), 'text-base')}
                  >
                    {nav.title}
                  </div>
                </NavLink>
              ))}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex items-center gap-2 cursor-pointer'>
              <Avatar>
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p>{user?.email}</p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56'>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
