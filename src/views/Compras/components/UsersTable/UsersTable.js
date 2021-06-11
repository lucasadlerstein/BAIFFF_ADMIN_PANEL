import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import clienteAxios from '../../../../config/axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


import {
  IconButton,
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination
} from '@material-ui/core';

import { getInitials } from 'helpers';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  inner: {
    minWidth: 1050
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const UsersTable = props => {
  const { className, users, ...rest } = props;

  const classes = useStyles();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = event => {
    const { users } = props;

    let selectedUsers;

    if (event.target.checked) {
      selectedUsers = users.map(user => user.id);
    } else {
      selectedUsers = [];
    }

    setSelectedUsers(selectedUsers);
  };

  const ConfirmacionSwal = withReactContent(Swal)

  const cambiarVisibilidad = async (id, vi) => {
      let viNuevo;
      vi === true ? viNuevo = false : viNuevo = true;
      const respuesta = await clienteAxios.put(`/api/compra/estado/${id}/${viNuevo}`);
      if(respuesta.data.fue === 1){
        ConfirmacionSwal.fire({
          title: 'Excelente',
          text: viNuevo ? `Ya está pago` : `No esta pagado`,
          icon: 'success',
          timer: 1500}).then(() => {
            window.location.reload(false);
          });
      }
  }

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelectedUsers = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedUsers = newSelectedUsers.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }

    setSelectedUsers(newSelectedUsers);
  };

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(event.target.value);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>País</TableCell>
                  <TableCell>Masterclass</TableCell>
                  <TableCell>Forma</TableCell>
                  <TableCell>Monto</TableCell>
                  <TableCell>Pagado</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={user.id}
                    selected={selectedUsers.indexOf(user.id) !== -1}
                  >
                    <TableCell>{moment(user.createdAt).format('DD/MM/YYYY')}</TableCell>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Typography variant="body1">{user.nombre}</Typography>
                      </div>
                    </TableCell>
                    <TableCell>{user.apellido}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.pais}</TableCell>
                    <TableCell>{user.taller}</TableCell>
                    <TableCell>{user.fpago}</TableCell>
                    <TableCell>{(user.fpago === 'US') ? 'U$D' : 'AR$'} {user.monto}</TableCell>
                    <TableCell>{user.pago ? 'SI' : 'NO'}</TableCell>
                    <TableCell>           
                      <IconButton 
                        onClick={() => cambiarVisibilidad(user.id, user.pago)}>
                        {user.pago ? (
                          <CancelIcon style={{ fill: 'red' }} />
                        ) : (
                          <CheckCircleIcon style={{ fill: 'green' }} />
                        ) }
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={users.length}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
  );
};

UsersTable.propTypes = {
  className: PropTypes.string,
  users: PropTypes.array.isRequired
};

export default UsersTable;