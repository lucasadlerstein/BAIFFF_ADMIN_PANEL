import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { DropzoneDialog } from 'material-ui-dropzone';
import clienteAxios from '../../../../config/axios';
import Alert from '@material-ui/lab/Alert';

import {
  Input,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField
} from '@material-ui/core';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const useStyles = makeStyles(() => ({
  root: {}
}));

const AccountDetails = props => {
  const { className, ...rest } = props;
  const classes = useStyles();
  let history = useHistory();
  
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);

  const [formFinalData, setFormFinalData] = useState([]);

  const [errores, setErrores] = useState(null);
  const [datosEditar, setDatosEditar] = useState({});
  const [editandoId, setEditandoId] = useState(null);

  const [values, setValues] = useState({
    titulo_es: '',
    titulo_en: '',
    texto: '',
    dia: 1,
    hora: '',
    duracion: '',
    imagen: ''
  });

  useEffect(()=> {
    const rellenarCamposEdicion = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get('id');
      setEditandoId(id);
  
      try{
        const resultado = await clienteAxios.get(`/api/programacion/${id}`);
        setValues(resultado.data);
  
        if(resultado.data.status === 'incorrecto'){
          history.push("/agenda");
        }
      }catch(error){
        console.log('error', error);
      } 
    }
    rellenarCamposEdicion();
  }, []);

  const dias = [ 1, 2, 3 ];

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const onSaveImagen = async () => {
    console.log('onSaveFunction', fileObjects);
    setOpen(false);

    console.log("fileObjects:", fileObjects);
    // Crear formData
    const formDataImagen = new FormData();
    formDataImagen.append('archivo', fileObjects[0]);
    setFormFinalData(formDataImagen);

    try {
      const subirImagen = await clienteAxios.post('/api/archivos', formDataImagen);
      console.log('subirImagen', subirImagen);
      setValues(prevState => ({
        ...prevState,
        imagen: subirImagen.data.archivo
      }));
    } catch (error) {
      const mensajeSwal = withReactContent(Swal);
      console.log(error);
      mensajeSwal.fire({
        title: 'Ups...',
        text: `No pudimos subir la imagen`,
        icon: 'error',
        timer: 3000
      });
    }
  }

  const enviarFormulario = async (e) => {
    e.preventDefault();
    let errorForm = null;
    // Validacion
    if (values.titulo_es.trim() === ''){
      errorForm = "El titulo no puede estar vacío";
    } else if (values.titulo_en.trim() === ''){
      errorForm = "El titulo en inglés no puede estar vacío";
    } else if (values.imagen.trim() === ''){
      errorForm = "Falta subir una imagen";
    } else if (values.texto.trim() === ''){
      errorForm = "El contenido del evento es obligatorio";
    } else if (values.hora.trim() === ''){
      errorForm = "La hora del evento es obligatoria";
    } else if (values.duracion.trim() === ''){
      errorForm = "La duración del evento es obligatoria";
    }
  
    const mensajeSwal = withReactContent(Swal);

    if(errorForm){
      setErrores(errorForm);
      setTimeout(() => {
        setErrores(null);
        return;
      }, 3000);
    } else {
      try {
        console.log('values post editar', values);
        const postTaller = await clienteAxios.put(`/api/programacion/${editandoId}`, values);
        console.log("resultado consulta: ", postTaller);
  
        mensajeSwal.fire({
          title: '¡Excelente!',
          text: `El evento fue editado con éxito`,
          icon: 'success',
          timer: 3000
        }).then(()=> {
          window.location.replace("/agenda");
        });
      } catch (error) {
        mensajeSwal.fire({
          title: 'Ups...',
          text: `Hubo un error`,
          icon: 'error',
          timer: 3000
        });
      }
    }
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        method="post"
        noValidate
        onSubmit={(e) => enviarFormulario(e)}
      >
        <CardHeader
          subheader="Eventos"
          title="AGREGAR NUEVO"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Titulo del evento en español"
                label="Título en español"
                margin="dense"
                name="titulo_es"
                onChange={handleChange}
                required
                value={values.titulo_es}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Titulo del evento en inglés"
                label="Título en inglés"
                margin="dense"
                name="titulo_en"
                onChange={handleChange}
                required
                value={values.titulo_en}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => setOpen(true)}>
                    Subir imagen</Button>

                <DropzoneDialog
                  acceptedFiles={['image/*', 'video/*']}
                  fileObjects={fileObjects}
                  cancelButtonText={"Cancelar"}
                  submitButtonText={"Adjuntar"}
                  dialogTitle={"Subir imagen"}
                  dropzoneText={"Hacé clic o arrastrá el archivo"}
                  maxFileSize={1610611911} // 1.5 GB
                  filesLimit={1}
                  open={open}
                  // onAdd={(nuevoArchivo) => {
                  //   console.log(nuevoArchivo);
                  //   console.log('onAdd', nuevoArchivo);
                  //   setFileObjects(nuevoArchivo);
                  // }}
                  onDrop={(nuevoArchivo) => {
                    console.log('onDrop', nuevoArchivo);
                    setFileObjects(nuevoArchivo);
                  }}
                  onDelete={deleteFileObj => {
                    console.log('onDelete', deleteFileObj);
                  }}
                  onClose={() => setOpen(false)}
                  onSave={() => {
                    onSaveImagen();
                  }}
                  showPreviews={false}
                  showPreviewsInDropzone={true}
                  showFileNamesInPreview={true}
                />
              </div>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Contenido"
                margin="dense"
                name="texto"
                onChange={handleChange}
                required
                multiline={true}
                type="text"
                value={values.texto}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={2}
              xs={6}
            >
              <TextField
                fullWidth
                label="¿Qué día va a ser?"
                margin="dense"
                name="dia"
                onChange={handleChange}
                required
                select
                // eslint-disable-next-line react/jsx-sort-props
                SelectProps={{ native: true }}
                value={values.dia}
                variant="outlined"
              >
                {dias.map(option => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid
              item
              md={2}
              xs={6}
            >
              <TextField
                fullWidth
                label="Hora"
                margin="dense"
                name="hora"
                onChange={handleChange}
                required
                type="time"
                value={values.hora}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={2}
              xs={6}
            >
              <TextField
                fullWidth
                label="Duración"
                margin="dense"
                name="duracion"
                onChange={handleChange}
                required
                type="text"
                value={values.duracion}
                variant="outlined"
              />
            </Grid>
            </Grid>
            </CardContent>
        <Divider />
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            type="submit"
          >
            Guardar
          </Button>
          
          {errores ? <Alert severity="error">{errores}</Alert> : null}
        </CardActions>
      </form>
    </Card>

  );
};

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
