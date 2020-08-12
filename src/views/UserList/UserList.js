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

const UserList = () => {
  const [users, setUsers] = useState([]);
  const classes = useStyles();

  useEffect(()=> {
    const traerAsitentes = async () => {
      const asistentes = await clienteAxios.get('/api/asistentes');
      setUsers(asistentes.data);
    }
    traerAsitentes();
  }, [])

  return (
    <div className={classes.root}>
      <UsersToolbar />
      <div className={classes.content}>
        <UsersTable users={users} />
      </div>
    </div>
  );
};

export default UserList;
