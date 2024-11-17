/*!

=========================================================
* Paper Dashboard React - v1.3.2
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React,  { useState } from "react";
// react plugin for creating notifications over the dashboard
// reactstrap components
import {
  Alert,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Col,
} from "reactstrap";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Both fields are required!');
      return;
    }

    setIsLoading(true);

    // Sample code for login, this needs to make a call to aws or something
    setTimeout(() => {
      if (email === 'user@gmail.com' && password === '12345') {
        alert('Login successful!');
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoading(false);
        window.location.href = '/admin/dashboard';
      } else {
        setErrorMessage('Invalid email or password');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="content">
      <Row className="justify-content-center">
        <Col md="6" lg="4">
          <Card>
            <CardHeader>
              <CardTitle tag="h4">Login</CardTitle>
            </CardHeader>
            <CardBody>
              {errorMessage && (
                <Alert color="danger">
                  <span>{errorMessage}</span>
                </Alert>
              )}
              <Form onSubmit={handleLogin}>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </FormGroup>
                <Button block color="primary" type="submit" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
              <div className="text-center mt-3">
                <a href="#forgot-password">Forgot Password?</a>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default LoginPage;