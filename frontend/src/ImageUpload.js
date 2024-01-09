import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = event => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            // await axios.post('http://localhost:8000/upload', formData);
            await axios.post('http://192.168.3.5:8000/upload', formData);
            alert('画像がアップロードされました！');
        } catch (error) {
            console.error('アップロードに失敗しました:', error);
            alert('アップロードに失敗しました');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>アップロード</button>
        </div>
    );
}

export default ImageUpload;
