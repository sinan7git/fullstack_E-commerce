import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from "axios";


export default function Signup() {
  const [errMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    user_type: "CUSTOMER",
  });

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    const signApi = "http://127.0.0.1:8001/api/v1/auth/create/";
    try {
      const response = await axios.post(signApi, formData);
      console.log(response.data);
      let data = response.data.data;
      let status_code = response.data.status_code;
      if (status_code === 6000) {
        localStorage.setItem("user_data", JSON.stringify(data));
        navigate("/login");
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage("An error occurred while signing up.");
      }
    }
  };
  

  return (
    <>
      <Continent>
        <LeftContainer>
          <HeaderContainer>
            <Logo />
          </HeaderContainer>
          <MainHeading>READ,STUDY SUCCEED</MainHeading>
          <Paragraph>
            You’re in the right place. Tell us what titles or genres you’ve
            enjoyed in the past, and we’ll give you surprisingly insightful
            recommendations.
          </Paragraph>
        </LeftContainer>
        <RightContainer>
          <LoginContainer>
            <LoginHeading>Register into Account</LoginHeading>
            <LoginInfo>Create an account to access all the features</LoginInfo>
            <Form onSubmit={handleSignup}>
              <InputContainer>
                <TextInput
                  value={formData.name}
                  onChange={handleInputChange}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Name"
                />
              </InputContainer>
              <InputContainer>
                <TextInput
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                />
              </InputContainer>
              <InputContainer>
                <TextInput
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                />
              </InputContainer>
              <InputContainer>
      <Select
        value={formData.user_type}
        onChange={handleInputChange}
        required
        id="user_type"
        name="user_type"
      >
        <MenuItem value="CUSTOMER">Customer</MenuItem>
        <MenuItem value="SELLER">Seller</MenuItem>
      </Select>
    </InputContainer>
              <LoginButton to="/login/">Login Now</LoginButton>

              <ButtonContainer>
                <SubmitButton>Create an Account</SubmitButton>
              </ButtonContainer>
              <div className="error-message">
              {errMessage && <h6 style={{color:'red',fontSize:'10px',textAlign:'center',marginTop:'25px'}}>{errMessage}</h6> }
              </div>
            </Form>
          </LoginContainer>
        </RightContainer>
      </Continent>
    </>
  );
}

const Continent = styled.div`
  min-height: 100vh;
  display: flex;
  padding: 15px;
  background: #fff;
`;
const LeftContainer = styled.div`
  width: 55%;
  padding: 40px 70px 70px;
`;
const HeaderContainer = styled.div``;
const Paragraph = styled.h4`
  font-size: 20px;
  color: #090e5e;
  margin-top: 30px;
  line-height: 1.4em;
`;
const Logo = styled.img``;
const MainHeading = styled.h1`
  font-size: 80px;
  color: #090e5e;
  margin-top: 100px;
  line-height: 1.4em;
`;
const RightContainer = styled.div`
  background: #efefef;
  width: 45%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-radius: 20px;
  padding: 0 70px 70px;
`;
const LoginContainer = styled.div`
  padding-bottom: 70px;
  border-bottom: 1px solid #fff;
  width: 100%;
`;
const LoginHeading = styled.h3`
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
`;
const LoginInfo = styled.p`
  font-size: 18px;
  margin-bottom: 35px;
`;
const Form = styled.form`
  width: 100%;
  display: block;
`;
const InputContainer = styled.div`
  margin-bottom: 15px;
  position: relative;
`;
const TextInput = styled.input`
  padding: 20px 25px 20px 30px;
  width: 100%;
  display: block;
  border: none;
  border-radius: 10px;
  font-size: 18px;
  outline: none;
`;
const LoginButton = styled(Link)`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 25px;
  color: #046bf6;
  font-size: 20px;
`;
const SubmitButton = styled.button`
  background: #046bf6;
  border: 0;
  outline: 0;
  color: #fff;
  padding: 25px 40px;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;
