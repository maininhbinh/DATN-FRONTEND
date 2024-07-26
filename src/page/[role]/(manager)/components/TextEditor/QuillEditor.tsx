import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';


function QuillEditor() {
  const [value, setValue] = useState('');

  const modules = {
    toolbar: {
      container: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['bold', 'italic', 'underline'],
        ['link', 'image'],
        [{ 'color': [] }, { 'background': [] }], // Include color and background color in toolbar
        ['clean']
      ],
    },
    clipboard: {
      matchVisual: false,
    }
  };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline',
        'list', 'bullet',
        'link', 'image'
    ];

    const editorStyles = {
        height: '150px', // Set height to 50px
        border: '1px solid #ccc', // Example border style
        borderRadius: '5px', // Example border radius
        padding: '10px', // Example padding
      };

  return (
    <div style={editorStyles}>
        <ReactQuill theme="snow" value={value} onChange={setValue} modules={modules} formats={formats}/>
    </div>
  );
}

export default QuillEditor