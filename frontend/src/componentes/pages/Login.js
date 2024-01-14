import React, {useContext, useState} from 'react'
import {Container, Box, Typography, TextField, InputLabel, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio, Button} from "@mui/material"
import {Link} from "react-router-dom"
import { UseLogin } from '../hooks/UseLogin'

const Login = () => {
    const {login} = UseLogin()
    const [user, setUser] = useState({
        username: "",
        password: "",
    })
    const handleChaneg = (event) => {
        const {name, value} = event.target;
        console.log(value)
        setUser({...user, [name]: value})
    }
    const onClickLogin = () => {
        login(user)
    }

  return (
    <>
        <Container maxWidth="xs">
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
                <Typography variant="h5">
                    Log in
                </Typography>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    name="username"
                    label="User name"
                    onChange={handleChaneg}  
                />
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    onChange={handleChaneg}
                />
                <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={onClickLogin}
                    >
                    Log In
                </Button>
                {/* <Link to="/register">
                  Regist from here
                </Link> */}
            </Box>
        </Container>
    </>
  )
}

export default Login
