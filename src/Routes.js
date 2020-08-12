import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  ProductList as ProductListView,
  UserList as UserListView,
  SignIn as SignInView,
  NotFound as NotFoundView,
  NuevoTaller as NuevoTallerView,
  EditarTaller as EditarTallerView,
  Directores as DirectoresView,
  Films as FilmsView,
  Agenda as AgendaView,
  NuevoAgenda as NuevoAgendaView,
  EditarAgenda as EditarAgendaView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/dashboard"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        layout={MainLayout}
        path="/usuarios"
      />
      <RouteWithLayout
        component={ProductListView}
        exact
        layout={MainLayout}
        path="/talleres"
      />
      <RouteWithLayout
        component={AgendaView}
        exact
        layout={MainLayout}
        path="/agenda"
      />
      <RouteWithLayout
        component={DirectoresView}
        exact
        layout={MainLayout}
        path="/directores"
      />
      <RouteWithLayout
        component={FilmsView}
        exact
        layout={MainLayout}
        path="/films"
      />
      <RouteWithLayout
        component={NuevoTallerView}
        exact
        layout={MainLayout}
        path="/nuevo-taller"
      />
      <RouteWithLayout
        component={EditarTallerView}
        exact
        layout={MainLayout}
        path="/editar-taller"
      />
      <RouteWithLayout
        component={NuevoAgendaView}
        exact
        layout={MainLayout}
        path="/nuevo-evento"
      />
      <RouteWithLayout
        component={EditarAgendaView}
        exact
        layout={MainLayout}
        path="/editar-agenda"
      />
      <RouteWithLayout
        component={SignInView}
        exact
        layout={MinimalLayout}
        path="/sign-in"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
