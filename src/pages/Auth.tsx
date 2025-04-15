
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Book, Key, LogIn, UserPlus, User, Camera, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Header from "@/components/Header";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkSession();
  }, [navigate]);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum size is 2MB",
          variant: "destructive",
        });
        return;
      }

      try {
        setIsUploading(true);
        
        // Generate a unique filename
        const timestamp = new Date().getTime();
        const fileExt = file.name.split('.').pop();
        const filePath = `temp_${timestamp}.${fileExt}`;
        
        // Upload to temporary location in avatars bucket
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        setAvatarUrl(data.publicUrl);
        toast({
          title: "Image uploaded",
          description: "Your profile photo is ready",
        });
      } catch (error: any) {
        console.error("Error uploading avatar:", error);
        toast({
          title: "Upload failed",
          description: error.message || "Failed to upload image",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const email = values.email;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password: values.password,
        options: {
          data: {
            username: values.username,
            avatar_url: avatarUrl,
          },
        },
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from("user_profiles")
          .insert({
            id: data.user.id,
            username: values.username,
            avatar_url: avatarUrl,
          });

        if (profileError) {
          console.error("Error creating profile:", profileError);
          // Continue anyway, the profile creation will be handled by AuthContext
        }
      }

      toast({
        title: "Registration Successful",
        description: "Your account has been created! You can now log in.",
      });
      setIsLogin(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-100 flex flex-col">
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 border border-purple-100 shadow-lg bg-white/90 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-700 to-purple-800 bg-clip-text text-transparent">
              {isLogin ? "Login" : "Register"}
            </h2>
            <p className="text-muted-foreground">
              {isLogin
                ? "Sign in to access your account"
                : "Create a new account"}
            </p>
          </div>

          {isLogin ? (
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Mail className="mr-2 h-4 w-4 mt-3" />
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Key className="mr-2 h-4 w-4 mt-3" />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800" disabled={loginForm.formState.isSubmitting}>
                  {loginForm.formState.isSubmitting ? (
                    "Logging in..."
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" /> Login
                    </>
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                className="space-y-6"
              >
                {/* Avatar Upload */}
                <div className="flex justify-center mb-4">
                  <div className="relative" onClick={handleAvatarClick}>
                    <Avatar className="h-20 w-20 cursor-pointer">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt="Profile" />
                      ) : (
                        <AvatarFallback>
                          <User className="h-10 w-10 text-muted-foreground" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer">
                      <Camera className="h-4 w-4 text-white" />
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground -mt-2">
                  {isUploading ? "Uploading..." : "Profile photo (optional)"}
                </p>

                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <User className="mr-2 h-4 w-4 mt-3" />
                          <Input
                            placeholder="Enter your username"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Mail className="mr-2 h-4 w-4 mt-3" />
                          <Input
                            placeholder="Enter your email address"
                            type="email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Key className="mr-2 h-4 w-4 mt-3" />
                          <Input
                            type="password"
                            placeholder="Create a password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800" disabled={registerForm.formState.isSubmitting || isUploading}>
                  {registerForm.formState.isSubmitting ? (
                    "Registering..."
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" /> Register
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => setIsLogin(!isLogin)}
              type="button"
              className="text-indigo-600 hover:text-indigo-800"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Button>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-100 to-slate-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} SKN NotesHub - SPPU Resources Hub</p>
        </div>
      </footer>
    </div>
  );
};

export default Auth;
