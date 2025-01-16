import React, {useContext} from 'react';
import {Redirect, Route} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';

const PrivateRoute = ({component: Component, ...rest}) => {
  const {client, staff} = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => client || staff ?
        (<Component {...props} />) :
        (<Redirect to="/login"/>)}
    />
  );
};

export default PrivateRoute;
