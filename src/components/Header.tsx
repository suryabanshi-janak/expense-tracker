// import * as React from 'react';
import { NavLink } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const navs: { title: string; href: string }[] = [
  { title: 'Dashboad', href: '/' },
  { title: 'Income', href: '/income' },
  { title: 'Expense', href: '/expenses' },
  { title: 'Saving', href: '/savings' },
  { title: 'Transaction', href: '/transactions' },
];

export function Header() {
  return (
    <header className='sticky top-0 z-40 w-full border-b bg-background'>
      <div className='container flex items-center h-16'>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              {navs.map((nav) => (
                <NavLink to={nav.href} key={nav.title}>
                  <NavigationMenuLink
                    className={cn(navigationMenuTriggerStyle(), 'text-base')}
                  >
                    {nav.title}
                  </NavigationMenuLink>
                </NavLink>
              ))}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
}
