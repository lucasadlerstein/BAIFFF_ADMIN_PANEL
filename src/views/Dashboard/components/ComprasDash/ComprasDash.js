import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MoneyOffIcon from '@material-ui/icons/MoneyOff';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    fontWeight: 700
  },
  avatarVerde: {
    backgroundColor: theme.palette.success.main,
    height: 56,
    width: 56
  },
  avatarRojo: {
    backgroundColor: theme.palette.error.main,
    height: 56,
    width: 56
  },
  icon: {
    height: 32,
    width: 32
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: theme.palette.success.dark
  },
  differenceValue: {
    color: theme.palette.success.dark,
    marginRight: theme.spacing(1)
  }
}));

const ComprasDash = props => {
  const { numero, texto, className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <Typography
              className={classes.title}
              color="inherit"
              gutterBottom
              variant="body2"
            >
              {texto}
            </Typography>
            <Typography
              color="inherit"
              variant="h3"
            >
              {numero}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={texto === 'MASTERCLASSES SIN PAGAR' ? classes.avatarRojo : classes.avatarVerde}>
              {
                (texto === 'MASTERCLASSES COMPRADOS') ? (
                  <EmojiObjectsIcon className={classes.icon} />
                ) : (
                  (texto === 'MASTERCLASSES PAGAS') ? (
                    <AttachMoneyIcon className={classes.icon} />
                  ) : (
                    <MoneyOffIcon className={classes.icon} />
                  )
                )
              }
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

ComprasDash.propTypes = {
  className: PropTypes.string
};

export default ComprasDash;
