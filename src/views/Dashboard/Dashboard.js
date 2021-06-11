import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import clienteAxios from '../../config/axios';

import {
  Budget,
  TotalUsers,
  TasksProgress,
  TotalProfit,
  ComprasDash
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  aboutTalleres: {
    fontFamily: 'Roboto' 
  }
}));

const Dashboard = () => {
  const classes = useStyles();

  const [estadisticas, setEstadisticas] = useState({
    talleres: 0,
    asistentes: 0,
    films: 0,
    totalCompras: 0,
    totalComprasPagas: 0
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
          <TotalProfit programacion={estadisticas.programacion} />
        </Grid>
        <Grid
          item
          lg={12}
          sm={12}
          xl={12}
          xs={12}
        >
          <h2 className={classes.aboutTalleres}>ABOUT MASTERCLASSES</h2>
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <ComprasDash numero={estadisticas.totalCompras} texto="MASTERCLASSES COMPRADOS" />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <ComprasDash numero={estadisticas.totalCompras - estadisticas.totalComprasPagas} texto="MASTERCLASSES SIN PAGAR" />
        </Grid>
        <Grid
          item
          lg={3}
          sm={6}
          xl={3}
          xs={12}
        >
          <ComprasDash numero={estadisticas.totalComprasPagas} texto="MASTERCLASSES PAGAS" />
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
