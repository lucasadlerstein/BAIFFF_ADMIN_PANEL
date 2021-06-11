import React from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import {
  IconButton,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Divider
} from '@material-ui/core';
import TurnedInNotIcon from '@material-ui/icons/TurnedInNot';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import clienteAxios from '../../../../config/axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ScheduleIcon from '@material-ui/icons/Schedule';


const useStyles = makeStyles(theme => ({
  root: {},
  imageContainer: {
    height: 250,
    width: 'auto',
    margin: '0 auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '5px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%'
  },
  titulo: {
    margin: '30px 0 15px 0'
  },
  statsItem: {
    display: 'flex',
    alignItems: 'center'
  },
  statsIcon: {
    color: theme.palette.icon,
    marginRight: theme.spacing(1)
  },
  statsIconDobleMargin: {
    color: theme.palette.icon,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1)

  }
}));

const ProductCard = props => {
  const { className, product, ...rest } = props;

  const classes = useStyles();

  const ConfirmacionSwal = withReactContent(Swal)
  
  const eliminarTaller = (id) => {
    ConfirmacionSwal.fire({
      title: '¿Seguro querés borrarlo?',
      text: `Si lo eliminas, no podes recuperarlo`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then( async (result)  => {
      if(result.value){
        try {
          const resEliminar = await clienteAxios.delete(`/api/programacion/${id}`);  
          ConfirmacionSwal.fire({
            title: 'Eliminado con éxito',
            text: "Listo, ya lo eliminaste",
            icon: 'success',
            timer: 2000,
          }).then( () => {
            window.location.reload(false);
          });
        } catch (error) {
          ConfirmacionSwal.fire({
            title: 'Ups!',
            text: "No pudimos eliminar el evento",
            icon: 'error',
            timer: 2000,
          });
        }
      }
    }); 
  }
  
  const cambiarVisibilidad = async (id, vi) => {
    let viNuevo;
    vi === 1 ? viNuevo = 0 : viNuevo = 1;
    const respuesta = await clienteAxios.put(`/api/programacion/visibilidad/${id}/${viNuevo}`);
    if(respuesta.data.fue === 1){
      
      ConfirmacionSwal.fire({
        title: 'Excelente',
        text: viNuevo ? `Ya está visible` : `Ya no está más visible`,
        icon: 'success',
        timer: 1500}).then(() => {
          window.location.reload(false);
        });
    }
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <div className={classes.imageContainer}>
          <img
            alt={product.titulo_es}
            className={classes.image}
            src={`${process.env.REACT_APP_BASE_URL}/static/${product.imagen}`}
          />
        </div>
        <Typography
          align="center"
          gutterBottom
          variant="h4"
          className={classes.titulo}
        >
          {product.titulo_es}
        </Typography>
        <Typography
          align="center"
          variant="body1"
        >
          {product.texto_es}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <Grid
          container
          justify="space-between"
        >
          <Grid
            className={classes.statsItem}
            item
          >
            <CalendarTodayIcon className={classes.statsIcon} />
              <Typography
                display="inline"
                variant="body2"
              >
                {`Dia ${product.dia}`}
              </Typography>
              <ScheduleIcon className={classes.statsIconDobleMargin} />
              <Typography
                display="inline"
                variant="body2"
              >
                {`${product.hora}`}
              </Typography>
          </Grid>
          <Grid
            className={classes.statsItem}
            item
          >
              <IconButton 
                onClick={() => cambiarVisibilidad(product.id, product.visible)}>
                {product.visible === 1 ? (
                  <VisibilityOffIcon />
                ) : (
                  <VisibilityIcon />
                ) }
              </IconButton>
            <Link to={`/editar-agenda?id=${product.id}`}>
              <IconButton>
                <CreateIcon />
              </IconButton>
            </Link>
            <IconButton
              onClick={() => eliminarTaller(product.id)}
            >
              <DeleteIcon/>
            </IconButton>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

ProductCard.propTypes = {
  className: PropTypes.string,
  product: PropTypes.object.isRequired
};

export default ProductCard;
