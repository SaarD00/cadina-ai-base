
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileText, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

const signUpSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one capital letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string(),
  fullName: z.string().min(2, { message: 'Please enter your full name' }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
    },
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: data.fullName,
          },
        },
      });

      if (error) throw error;

      toast.success('🎉 Registration successful! Please check your email for verification.');
      navigate('/sign-in');
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during Google sign up.');
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { test: (pwd: string) => pwd.length >= 8, text: 'At least 8 characters' },
    { test: (pwd: string) => /[A-Z]/.test(pwd), text: 'One uppercase letter' },
    { test: (pwd: string) => /[0-9]/.test(pwd), text: 'One number' },
  ];

  const currentPassword = form.watch('password') || '';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 p-4 relative overflow-hidden">
      {/* Animated background elements - consistent with sign-in */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-resume-violet/20 to-resume-purple/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-resume-purple/20 to-resume-violet/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Logo - consistent with app branding */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="bg-gradient-to-r from-resume-purple to-resume-violet rounded-xl p-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
            <FileText className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <span className="font-bold text-lg md:text-xl bg-gradient-to-r from-resume-purple to-resume-violet bg-clip-text text-transparent">
            Vireia AI
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg mx-auto">
        <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm"></div>
          
          <CardHeader className="relative z-10 text-center pb-4 md:pb-6 pt-6 md:pt-8 px-6 md:px-8">
            <div className="mx-auto w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-resume-purple to-resume-violet rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <User className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Join Vireia AI
            </CardTitle>
            <CardDescription className="text-gray-600 text-sm md:text-lg">
              Create your account and start building amazing resumes
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 px-6 md:px-8 pb-6 md:pb-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-5">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-sm md:text-base">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-resume-purple transition-colors duration-200" />
                          <Input 
                            placeholder="Enter your full name" 
                            {...field} 
                            className="pl-12 h-11 md:h-12 border-2 border-gray-200 rounded-xl focus:border-resume-purple focus:ring-4 focus:ring-resume-purple/20 transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm md:text-base"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-sm md:text-base">Email Address</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-resume-purple transition-colors duration-200" />
                          <Input 
                            type="email" 
                            placeholder="Enter your email" 
                            {...field} 
                            className="pl-12 h-11 md:h-12 border-2 border-gray-200 rounded-xl focus:border-resume-purple focus:ring-4 focus:ring-resume-purple/20 transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm md:text-base"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-sm md:text-base">Password</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-resume-purple transition-colors duration-200" />
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Create a strong password" 
                            {...field} 
                            className="pl-12 pr-12 h-11 md:h-12 border-2 border-gray-200 rounded-xl focus:border-resume-purple focus:ring-4 focus:ring-resume-purple/20 transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm md:text-base"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-resume-purple transition-colors duration-200"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      {currentPassword && (
                        <div className="mt-2 space-y-1">
                          {passwordRequirements.map((req, index) => (
                            <div key={index} className="flex items-center text-xs md:text-sm">
                              <CheckCircle 
                                className={`h-3 w-3 md:h-4 md:w-4 mr-2 ${req.test(currentPassword) ? 'text-green-500' : 'text-gray-300'}`}
                              />
                              <span className={req.test(currentPassword) ? 'text-green-600' : 'text-gray-500'}>
                                {req.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium text-sm md:text-base">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-resume-purple transition-colors duration-200" />
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm your password" 
                            {...field} 
                            className="pl-12 pr-12 h-11 md:h-12 border-2 border-gray-200 rounded-xl focus:border-resume-purple focus:ring-4 focus:ring-resume-purple/20 transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm md:text-base"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-resume-purple transition-colors duration-200"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-11 md:h-12 bg-gradient-to-r from-resume-purple to-resume-violet hover:from-resume-purple/90 hover:to-resume-violet/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group text-sm md:text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 md:mt-8 text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs md:text-sm">
                  <span className="px-4 bg-white/80 text-gray-500 rounded-full">Or continue with</span>
                </div>
              </div>

              <Button 
                onClick={handleGoogleSignUp}
                variant="outline" 
                className="w-full h-11 md:h-12 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-300 text-sm md:text-base"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs md:text-sm">
                  <span className="px-4 bg-white/80 text-gray-500 rounded-full">Already have an account?</span>
                </div>
              </div>

              <Link to="/sign-in" className="block">
                <Button variant="outline" className="w-full h-11 md:h-12 border-2 border-gray-200 hover:border-resume-purple/30 hover:bg-resume-purple/5 rounded-xl font-semibold transition-all duration-300 group text-sm md:text-base">
                  Sign In Instead
                  <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
