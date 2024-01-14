import React, {useContext, useState} from 'react'
import Header from '../templates/Header'
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import { LoginUserContext } from '../providers/LoginUserProvider';
import {Container, Box, Typography, TextField, InputLabel, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio, Button} from "@mui/material"
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import { styled } from '@mui/material/styles';
import axios from 'axios';

const Main = () => {
    const location = useLocation();
    const [data, setData] = useState(location.state)
    const {isLogined} = useContext(LoginUserContext);
    const {loginUser} = useContext(LoginUserContext);
    const navigate = useNavigate();
    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });
    if(!isLogined){
        return <Navigate to="/login"></Navigate>
    }else{
      const uploadFiles = (files) => {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
        formData.append('loginUser', JSON.stringify(loginUser));
    
        axios.post('http://localhost:8000/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log('Upload successful:', response.data);
        })
        .catch((error) => {
          console.error('Error during file upload:', error);
        });
      };
        const handleFileChange = event => {
            const files = event.target.files;
            if (files.length > 0) {
              uploadFiles(files);
            }
        };
        return (
            <>
            <Header/>
            <Container maxWidth="xs">
                <Box sx={{ mt: 3, mb: 2 }}>
                <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Upload photos
                    <VisuallyHiddenInput type="file" multiple onChange={handleFileChange}/>
                </Button>
                </Box>
                <Box sx={{ mt: 20, mb: 2 }}>
                <Button component="label" variant="contained" startIcon={<AutoAwesomeMotionIcon/>} onClick={() => navigate('/album')}>
                    Go to photo album
                </Button>
                </Box>
            </Container>
            </>
            
          )
    }
}

export default Main
