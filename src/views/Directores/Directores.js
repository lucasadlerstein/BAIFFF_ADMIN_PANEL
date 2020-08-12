import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import clienteAxios from '../../config/axios';

import { UsersToolbar, UsersTable } from './components';
// import mockData from './data';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const Directores = () => {
  const [users, setUsers] = useState([]);
  const classes = useStyles();

  useEffect(()=> {
    const traerAsitentes = async () => {
      const directores = await clienteAxios.get('/api/films/directores');
      setUsers(directores.data);
      console.log(directores.data);
    }
    traerAsitentes();
  }, []);

  return (
    <div className={classes.root}>
      <UsersToolbar />
      <div className={classes.content}>
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default Directores;
