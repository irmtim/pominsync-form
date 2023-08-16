import React from 'react';
import './App.css';
import { CreateForm, CreateFormProps } from 'pages/create';


const App = (props: CreateFormProps) =>  {
  return <CreateForm {...props}/>
}

export default App;
