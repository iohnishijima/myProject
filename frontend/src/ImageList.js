import React, { useState } from 'react';
import axios from 'axios';

function FileList() {
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');

    const fetchFiles = async () => {
        try {
            // const response = await axios.get('http://localhost:8000/files');
            const response = await axios.get('http://192.168.3.5:8000/files');
            setFiles(response.data.files);
        } catch (error) {
            console.error('ファイルの取得に失敗しました:', error);
        }
    };

    const handleDelete = async () => {
        try {
            // await axios.delete(`http://localhost:8000/delete/${selectedFile}`);
            await axios.delete(`http://192.168.3.5:8000/delete/${selectedFile}`);
            alert('ファイルが削除されました！');
            // ファイル削除後にリストを更新
            fetchFiles();
        } catch (error) {
            console.error('削除に失敗しました:', error);
            alert('削除に失敗しました');
        }
    };

    return (
        <div>
            <button onClick={fetchFiles}>ファイルリストを更新</button>
            <select onChange={e => setSelectedFile(e.target.value)} value={selectedFile}>
                <option value="">ファイルを選択...</option>
                {files.map(file => (
                    <option key={file} value={file}>{file}</option>
                ))}
            </select>
            <button onClick={handleDelete}>削除</button>
        </div>
    );
}

export default FileList;
