import React, {useContext, useState} from 'react'
import {Container, Box, Typography, TextField, InputLabel, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio, Button} from "@mui/material"
import {Link} from "react-router-dom"

const Home = () => {
  return (
    <div>
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
                    YuIo photo share app
                </Typography>
                <Link to="/login">
                  Login from here
                </Link>
            </Box>
        </Container>
    </div>
  )
}

export default Home
