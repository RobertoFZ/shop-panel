import React, { Component } from 'react';
import { Cookie, withCookie, WithCookieContext, WithCookieProps } from 'next-cookie';
import Router from "next/router";
import { NextComponentType } from 'next';
import { getUser, doLogout } from '../../../utils/common';
import { User } from '../../../api/User/User';
import dynamic from "next/dynamic";
import moment from 'moment';
const Login = dynamic(() => import('../../login'));

type Props = WithCookieProps & {
  user?: User;
  pathname?: string;
};
type State = WithCookieContext & {};

const WithAuthentication = <P extends object>(WrappedComponent: NextComponentType<P>) =>
  withCookie(class extends Component<P & Props, State> {
    MAX_HOUR = 1;

    static async getInitialProps(context: any) {
      const user = getUser(context);
      const componentProps: any =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(context))
      return { ...componentProps, user, pathname: context.pathname };
    }

    componentDidMount() {
      const { user } = this.props;
      if (!this.isRememberUser(user)) {
        doLogout(this.props, localStorage);
        this.sendToLogin();
      }
    }

    isRememberUser = (user: User) => {
      if (!user) {
        return false;
      } else {
        const { last_login, remember_me } = user;
        if (remember_me) {
          return true;
        } else if (!remember_me && (moment().diff(moment(last_login), 'hour') < this.MAX_HOUR)) {
          return true;
        } else {
          return false;
        }
      }
    }

    sendToLogin() {
      const { pathname } = this.props;
      if (pathname.startsWith('/products/detail')) {
        Router.push('/login');
      }
      try {
        Router.replace(pathname, '/login', { shallow: true });
      } catch (error) {
        Router.push('/login');
      }
    }

    render() {
      const { user } = this.props;
      if (!this.isRememberUser(user)) {
        return <Login {...this.props} />
      }
      return <WrappedComponent {...this.props} />;
    }
  });

export default WithAuthentication;