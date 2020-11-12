import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router, 
  Switch, 
  Route,
  Link
} from "react-router-dom";
import { createBrowserHistory } from 'history';
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  card: {
    fontWeight:'bold', 
    margin:'50px 200px', 
    padding:'25px', 
    border:'2px solid lightgray', 
    borderRadius:'10px',
    display:'flex', 
    justifyContent: 'space-between',  
  },
  info: {
    display:'flex', 
    flexDirection:'column'
  },
  title: {
    marginBottom: '15px',
    fontSize: '1.5rem'
  },
  navbar: {
    padding: '10px',
    borderBottom: '1px solid lightgray',
    display: 'flex',
    justifyContent: 'center',
  },
  searchBar: {
    outline: '0',
    borderWidth: '0 0 2.5px',
    borderColor: 'gray',
    margin: '0 15px',
    width: '250px',
    fontSize: '1rem'
  },
  searchWrap: {
    margin: '20px 0',
    height: '25px',
  },
  page: {
    margin: ' 50px 500px',
    fontamily: 'Roboto, sans-serif'
  },
  searchButton : {
    border: '2px solid gray',
    textDecoration: 'none',
    color: 'black',
    borderRadius: '5px',
    padding: '3px 10px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontFamily: 'Roboto, sans-serif'
  }
}));


// App Component  
export default function App() {
  const classes = useStyles();
  const history = createBrowserHistory();

  const [currentInput, setCurrentInput] = useState("");
  const [ID, setID] = useState("");
  const [bookData, setBookData] = useState([]);
  // const [error, setError] = useState(null);

  // effect that runs when  isbnID changes and makes request to API
  useEffect(() => {
    if (ID) {
      fetchAPI().then();
    }
  }, [ID]);


  async function fetchAPI () { 
    let response = await fetch(`https://openlibrary.org/isbn/${ID}.json`);
    let data = await response.json();

    const authorEndPt = data.authors[0].key;
    let response2 = await fetch(`https://openlibrary.org${authorEndPt}.json`);
    let data2 = await response2.json();
    setBookData(data, data["author_name"] = data2.name)
  }

  function onChange(input) {
    console.log(input)
    setCurrentInput(input);
  }
  
  function search() {
    setID(currentInput);
    history.push(`/isbn/${currentInput}`);
  }
  
  // <Route path={`/isbn/${isbnID}`}>
  return (
    <Router>
      <div className={classes.page}>
      <NavBar onChange={onChange} input={currentInput} search={search} />
      <Switch>
        <Route path="/isbn/:ID"> 
          <Book id={ID} data={bookData} />
        </Route>
      </Switch>
      </div>
     </Router>
  );
}


// Book Component 
const Book = (props) => {
  const classes = useStyles();
  const id = props.id;
  const book = props.data;
  
  return (
    <div className={classes.card}>
      <div className={classes.info}>
        <div className={classes.title}>{book.title}</div>
        <div>ISBN: {id}</div>
        <div>Published: {book.publish_date}</div>
        <div>Author: {book.author_name}</div>
        <div>Pages: {book.number_of_pages}</div>
        <div>Publishers: {book.publishers}</div> 
      </div>
    <img height='170px' width='150px' src={`https://covers.openlibrary.org/b/id/${book.covers}-L.jpg`} />
    </div>
  );
}


// NavBar Component
const NavBar = (props) => {
  const classes = useStyles();
  const onChange = props.onChange;
  const input = props.input;
  const search = props.search;
  
  return (
    <div className={classes.navbar}> 
      <div className={classes.searchWrap}>
      <input 
        className={classes.searchBar}
        value={input} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="ISBN #" 
      /> 
      {/* <button onClick={() => search()}>Search</button> */}
      <Link className={classes.searchButton} to={`/isbn/${input}`} onClick={() => search()}> 
        Search 
      </Link>
      </div>
    </div>
  );
}