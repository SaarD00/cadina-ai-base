
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  FileText, 
  User, 
  LogOut,
  BookOpen
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const location = useLocation();

  const handleSignOut = () => {
    signOut();
  };

  const navigation = [
    { name: 'Templates', href: '/templates' },
    { name: 'Blog', href: '/blog' },
    { name: 'Pricing', href: '#pricing' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Vireia AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.href) 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || ''} />
                      <AvatarFallback>
                        {user?.fullName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.fullName && (
                        <p className="font-medium">{user.fullName}</p>
                      )}
                      {user?.emailAddresses[0]?.emailAddress && (
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.emailAddresses[0].emailAddress}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/resume" className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      My Resumes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/sign-up">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary hover:bg-accent'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {!isSignedIn && (
                <div className="pt-4 pb-3 border-t border-border">
                  <div className="flex flex-col space-y-2">
                    <Link to="/sign-in" onClick={() => setIsOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/sign-up" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </div>
                </div>
              )}
              
              {isSignedIn && (
                <div className="pt-4 pb-3 border-t border-border">
                  <div className="flex items-center px-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || ''} />
                      <AvatarFallback>
                        {user?.fullName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <div className="text-base font-medium">
                        {user?.fullName || 'User'}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {user?.emailAddresses[0]?.emailAddress}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="mr-3 h-5 w-5" />
                      Dashboard
                    </Link>
                    <Link
                      to="/resume"
                      className="flex items-center px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md"
                      onClick={() => setIsOpen(false)}
                    >
                      <FileText className="mr-3 h-5 w-5" />
                      My Resumes
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
