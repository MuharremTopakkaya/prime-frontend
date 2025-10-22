import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import styled from "styled-components";

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

export default function SignIn() {
  return (
    <AnimationRevealPage disabled>
      <Container>
        <Card>
          <Title>Sign In</Title>
          <Subtitle>Enter your email and password to sign in!</Subtitle>
          <div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" />
            </div>
            <div tw="mt-4">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="********" />
            </div>
            <Row>
              <CheckboxLabel htmlFor="remember">
                <Checkbox id="remember" type="checkbox" />
                Keep me logged in
              </CheckboxLabel>
              <LinkButton href="#">Forgot password?</LinkButton>
            </Row>
            <Submit type="button">Sign In</Submit>
            <p tw="mt-6 text-sm text-gray-600">
              Not registered yet? <a href="#" tw="text-primary-600 hover:text-primary-800">Create an Account</a>
            </p>
          </div>
        </Card>
      </Container>
    </AnimationRevealPage>
  );
}


