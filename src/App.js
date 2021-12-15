import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

export default function App() {
  const [value, setValue] = useState('<p>Peace?</p>');
  const [text, setText] = useState('');
  const [lastSentence, setLastSentence] = useState([]);

  function onEditorChange(value, editor) {
    setValue(value);
    var words = value.split(' ');
    console.log(words);

    setText(editor.getContent({ format: 'text' }));
    axios
      .get('/nlp-web-demo/process?text="' + editor.getContent({ format: 'text' }) + '"')
      .then(function (response) {
        console.log(response);
        setLastSentence(response.data.slice(-1)[0]);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const wrong = lastSentence.filter((word) => !word.lemma.includes('+'));
  console.log('wrong words:', wrong);
  return (
    <>
      <Editor
        onInit={(evt, editor) => setText(editor.getContent({ format: 'text' }))}
        onEditorChange={onEditorChange}
        initialValue="<p>Hello Editor</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help' +
            ' | spellchecker',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />{' '}
      {text}{' '}
    </>
  );
}
