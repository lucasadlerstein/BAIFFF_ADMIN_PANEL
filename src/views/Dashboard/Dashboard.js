import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import clienteAxios from '../../config/axios';

import {
  Budget,
  TotalUsers,
  TasksProgress,
  TotalProfit,
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  const [estadisticas, setEstadisticas] = useState({
    talleres: 0,
    asistentes: 0,
    films: 0
  });

  useEffect(() => {
    const traerDatos = async () => {
      const estadisticasDB = await clienteAxios.get('/api/dashboard/estadisticas');
      setEstadisticas(estadisticasDB.data);
    }
    traerDatos();
  //eslint-disable-next-line
  }, []);

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <Budget talleres={estadisticas.talleres} />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TotalUsers asistentes={estadisticas.asistentes} />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TasksProgress films={estadisticas.films} />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <TotalProfit />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
