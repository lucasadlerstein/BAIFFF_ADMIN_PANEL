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
    slug_es: '',
    miniatura: '',
    descripcion_es: '',
    codigo: '',
    precio_ars: '',
    precio_usd: '',
    titulo_en: '',
    descripcion_en: ''
  });

  useEffect(()=> {
    const rellenarCamposEdicion = async () => {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get('id');
      setEditandoId(id);
  
      try{
        const resultado = await clienteAxios.get(`/api/talleres/id/${id}`);
        setValues(resultado.data);
  
        if(resultado.data.status === 'incorrecto'){
          history.push("/talleres");
        }
      }catch(error){
      } 
    }
    rellenarCamposEdicion();
    // eslint-disable-next-line
  }, []);

  const handleChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  const onSaveImagen = async () => {
    setOpen(false);

    // Crear formData
    const formDataImagen = new FormData();
    formDataImagen.append('archivo', fileObjects[0]);
    setFormFinalData(formDataImagen);

    const mensajeSwal = withReactContent(Swal);
    try {
      const subirImagen = await clienteAxios.post('/api/archivos', formDataImagen);
      setValues(prevState => ({
        ...prevState,
        imagen_es: subirImagen.data.archivo,
        imagen_en: subirImagen.data.archivo
      }));
    } catch (error) {
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
    } else if (values.slug_es.trim() === ''){
      errorForm = 'El slug no puede estar vacío';
    } else if (/\s/.test(values.slug_es) || (values.slug_es.indexOf('.') !== -1) ){
      errorForm = 'El slug no puede tener espacios ni puntos';
    } else if (values.descripcion_es.trim() === ''){
      errorForm = 'La descripción no puede estar vacía';
    }  else if ((values.precio_ars.trim() === '') || (values.precio_ars < 1) ){
      errorForm = 'Falta el valor del taller en AR$';
    } else if ((values.precio_usd.trim() === '') || (values.precio_usd < 1) ){
      errorForm = 'Falta el valor del taller en U$D';
    } else if (values.codigo.trim() === ''){
      errorForm = 'El código de producto no puede estar vacío';
    } else if (values.titulo_en.trim() === ''){
      errorForm = 'El titulo en inglés no puede estar vacío';
    } else if (values.descripcion_en.trim() === ''){
      errorForm = 'La descripción en inglés no puede estar vacía';
    } else if (values.imagen_es.trim() === ''){
      errorForm = 'Falta subir una imagen del taller';
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
        const postTaller = await clienteAxios.put(`/api/talleres/${editandoId}`, values);
  
        mensajeSwal.fire({
          title: '¡Excelente!',
          text: `El taller fue agregado con éxito`,
          icon: 'success',
          timer: 3000
        }).then(()=> {
          window.location.href = "/talleres";
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
          subheader={`${values.titulo_es}`}
          title="EDITAR"
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
                helperText="Titulo del taller en español"
                label="Título"
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
                label="Slug"
                placeholder="taller-de-cine-y-guion"
                helperText="No puede contener espacios ni puntos"
                margin="dense"
                name="slug_es"
                onChange={handleChange}
                required
                value={values.slug_es}
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
                  dialogTitle={"Subir imagen miniatura"}
                  dropzoneText={"Hacé clic o arrastrá el archivo"}
                  maxFileSize={1610611911} // 1.5 GB
                  filesLimit={1}
                  open={open}
                  onDrop={(nuevoArchivo) => {
                    setFileObjects(nuevoArchivo);
                  }}
                  onDelete={deleteFileObj => {
                    // console.log('onDelete', deleteFileObj);
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
                label="Descripción"
                margin="dense"
                multiline={true}
                name="descripcion_es"
                onChange={handleChange}
                required
                value={values.descripcion_es}
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
                label="Precio en AR$"
                margin="dense"
                name="precio_ars"
                onChange={handleChange}
                required
                type="number"
                value={values.precio_ars}
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
                label="Precio en U$D"
                margin="dense"
                name="precio_usd"
                onChange={handleChange}
                required
                type="number"
                value={values.precio_usd}
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
                label="Código de compra"
                margin="dense"
                name="codigo"
                onChange={handleChange}
                required
                type="text"
                value={values.codigo}
                variant="outlined"
              />
            </Grid>
            </Grid>
            </CardContent>
            <CardHeader
              subheader={values.titulo_es ? `Sobre "${values.titulo_es}"` : null}
              title="Información en Inglés"
            />
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
                helperText="Titulo del taller en inglés"
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
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Descripción en inglés"
                margin="dense"
                name="descripcion_en"
                multiline={true}
                onChange={handleChange}
                required
                value={values.descripcion_en}
                variant="outlined"
              />
            </Grid>
            
        <Divider />
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
