import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton, Grid, Typography } from '@material-ui/core';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import { ProductsToolbar, ProductCard } from './components';
import clienteAxios from '../../config/axios';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  pagination: {
    marginTop: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  }
}));

const ProductList = () => {
  const classes = useStyles();

  const [talleres, setTalleres] = useState([]);
  const [num, setNum] = useState(1);

  const traerTalleres = async () => {
    const talleresBD = await clienteAxios.get('/api/programacion/todos');
    setTalleres(talleresBD.data);
    setNum(0);
    console.log(talleres);
    console.log(num);
  }
  if(num === 1){
    traerTalleres();
  }

  return (
    <div className={classes.root}>
      <ProductsToolbar />
      <div className={classes.content}>
        <Grid
          container
          spacing={3}
        >
          {talleres.map(taller => (
            <Grid
              item
              key={taller.id}
              lg={3}
              md={4}
              xs={12}
            >
              <ProductCard product={taller} />
            </Grid>
          ))}
        </Grid>
      </div>
      <div className={classes.pagination}>
        <Typography variant="caption">1-6 of {talleres.length}</Typography>
        <IconButton>
          <ChevronLeftIcon />
        </IconButton>
        <IconButton>
          <ChevronRightIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default ProductList;
