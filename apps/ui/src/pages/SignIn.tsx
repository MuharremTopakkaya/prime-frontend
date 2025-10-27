import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";

const Container = tw.div`min-h-screen bg-gray-100 flex items-center justify-center px-6`;
const Card = tw.div`w-full max-w-md bg-white rounded-lg shadow-lg p-8`;
const Title = tw.h1`text-3xl font-bold text-gray-900 mb-2`;
const Subtitle = tw.p`text-gray-500 mb-8`;
const Label = tw.label`block text-sm font-medium text-gray-700 mb-1`; 
const Input = styled.input`
  ${tw`w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
`;
const Row = tw.div`flex items-center justify-between mt-4`;
const CheckboxLabel = tw.label`flex items-center text-sm text-gray-700`;
const Checkbox = tw.input`mr-2`;
const LinkButton = tw.a`text-sm font-medium text-primary-600 hover:text-primary-800`;
const Submit = tw.button`w-full mt-6 bg-primary-500 hover:bg-primary-700 text-white font-semibold py-3 rounded transition`;
const ErrorMessage = tw.div`mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded`;
const SuccessMessage = tw.div`mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded`;

export default function SignIn() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Email ve şifre alanları zorunludur.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const success = await login(email, password);
      
      if (success) {
        setSuccess("Giriş yapıldı! Yönlendiriliyorsunuz...");
        
        // Authentication method'a göre yönlendirme
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        setError("Giriş bilgileri hatalı. Lütfen kontrol edin.");
      }
    } catch (error) {
      setError("Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimationRevealPage disabled>
      <Container>
        <Card>
          <Title>Sign In</Title>
          <Subtitle>Enter your email and password to sign in!</Subtitle>
          <form onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <div tw="mt-4">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            <Row>
              <CheckboxLabel htmlFor="remember">
                <Checkbox id="remember" type="checkbox" disabled={isLoading} />
                Keep me logged in
              </CheckboxLabel>
              <LinkButton href="#">Forgot password?</LinkButton>
            </Row>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
            <Submit type="submit" disabled={isLoading}>
              {isLoading ? "Giriş yapılıyor..." : "Sign In"}
            </Submit>
            <p tw="mt-6 text-sm text-gray-600">
              Not registered yet? <a href="#" tw="text-primary-600 hover:text-primary-800">Create an Account</a>
            </p>
          </form>
        </Card>
      </Container>
    </AnimationRevealPage>
  );
}


