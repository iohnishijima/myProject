import React, {useContext, useState} from 'react'
import Header from '../templates/Header'
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import { LoginUserContext } from '../providers/LoginUserProvider';
import {Container, Box, Typography, TextField, InputLabel, Select, MenuItem, FormLabel, RadioGroup, FormControlLabel, Radio, Button} from "@mui/material"
import { styled } from '@mui/material/styles';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import FormControl from '@mui/material/FormControl';
import Modal from '@mui/material/Modal';
import Checkbox from '@mui/material/Checkbox';
import axios from 'axios';


const Album = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {isLogined} = useContext(LoginUserContext);
    const [open, setOpen] = useState(false);
    const [selectedImg, setSelectedImg] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedPerson, setSelectedPerson] = useState("")
    const [items, setItems] = useState([]);
    const StyleModal = styled(Modal)({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      });
      const StyledCheckbox = styled(Checkbox)({
        position: 'absolute',
        top: 0,
        left: 0,     
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        padding: '1px',
      });
      const FixedButton = styled(Button)({
        position: 'fixed',
        left: 0,
        bottom: 0,
        color:"blue",
        fontSize:15,
        backgroundColor: 'white', 
      });
    if(!isLogined){
        return <Navigate to="/login"></Navigate>
    }else{
        const handleChange = (event) =>{
            console.log(event.target.value)
            const person = event.target.value
            axios.get('http://localhost:8000/files') 
            .then(response => {
                console.log(response)
                setItems(response.data.files);
                console.log(items)
            })
            .catch(error => {
                console.error('Error fetching the files:', error);
            });
            return setSelectedPerson(person)
        }
        const handleDownloadImage = () => {
            navigate("/main")
        }
        const handleSelectImage = (event, img) => {
            event.stopPropagation();
            setSelectedImages((prev) => {
              if (prev.includes(img)) {
                return prev.filter((item) => item !== img);
              } else {
                return [...prev, img];
              }
            });
          };
        const handleOpen = (img) => {
            setSelectedImg(img);
            setOpen(true);
          };
        
        const handleClose = () => setOpen(false);
        return (
            <>
            <Header />
            <Container maxWidth="xl">
                <Box sx={{ mt: 3, mb: 2 }}>
                    <Typography variant="h4" >
                        YuIo photo Album
                    </Typography>
                    <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">choose photos owner</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedPerson}
                        label="ChooseUser"
                        onChange={handleChange}
                    >
                        <MenuItem value={"Bret"}>Bret</MenuItem>
                        <MenuItem value={"Antonette"}>Antonette</MenuItem>
                        <MenuItem value={"Everyone"}>Everyone</MenuItem>
                    </Select>
                    </FormControl>
                </Box>
                <ImageList sx={{ flexDirection: 'column', }} gap={8}>
                    {items.map((item) => {
                        if (selectedPerson === "Everyone" || selectedPerson === item.user){
                            console.log("aaaaaaaaaa")
                            return (
                                <ImageListItem key={item.img}  onClick={() => handleOpen(item)}>
                                <img
                                    srcSet={`${item.img}?w=161&fit=crop&auto=format&dpr=2 2x`}
                                    src={`${item.img}?w=161&fit=crop&auto=format`}
                                    alt={item.title}
                                    loading="lazy"
                                />
                                <StyledCheckbox
                                    checked={selectedImages.includes(item.img)}
                                    onClick={(event) => handleSelectImage(event, item.img)}
                                />
                                </ImageListItem>
                            )
                        }else{
                            return null; 
                        }
                    })}
                </ImageList>
                <StyleModal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{ outline: 'none' }}>
                    <Typography id="modal-modal-title" color="white" variant="h6" component="h2">
                        {selectedImg.title}
                    </Typography>
                    <img src={selectedImg.img} alt="Selected" style={{ width: '100%' }} />
                    </Box>
                </StyleModal>
            </Container>
            <FixedButton onClick={handleDownloadImage}>
                Go back to upload page
            </FixedButton>
            </>
            
          )
    }
}

export default Album
