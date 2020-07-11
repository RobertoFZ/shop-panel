import React, { Component, Fragment } from 'react';
import { Layout, Menu, Breadcrumb, Divider, notification, Statistic, Card, Row, Col } from 'antd';
import { DashboardOutlined, BookOutlined, DollarCircleOutlined, ArrowUpOutlined, ArrowDownOutlined, GiftOutlined, DollarOutlined, SmileOutlined } from '@ant-design/icons';
import UserDropdown from './components/UserDropdown';
import { User } from '../../../api/User/User';
import Link from 'next/link';
import { getSelectedBusiness, getUser, clearUser, setSelectedBusiness, setUser } from '../../../utils/common';
import Router, { NextRouter, withRouter } from 'next/router';
import Loader from '../Loader';
import { Business } from '../../../api/Business/Business';
import BusinessDropdown from './components/BusinessDropdown';
import { withCookie, Cookie } from 'next-cookie';
import BaseMeta from '../BaseMeta';
import BusinessEditModal from './components/BusinessEditModal';
import { BusinessFormValues } from './components/BusinessEditModal/BusinessEditModal';
import BusinessService from '../../../api/Business';
import UserEditModal from './components/UserEditModal';
import { UserFormValues } from './components/UserEditModal/UserEditModal';
import UserService from '../../../api/User';
import BusinessConfigurationModal from './components/BusinessConfigurationModal';
import { BusinessConfigurationFormValues } from './components/BusinessConfigurationModal/BusinessConfigurationModal'
import BusinessSettingsService from  '../../../api/BusinessSettings';
import { BusinessSettings } from '../../../api/BusinessSettings/BusinessSettings';

const { SubMenu } = Menu;
const { Header, Content, Sider, Footer } = Layout;

export type BreadCrumItem = {
  link: string;
  text: string;
}

type Props = {
  cookie?: Cookie;
  breadCrum?: BreadCrumItem[];
  router: NextRouter;
  baseMeta?: any;
}

type State = {
  user?: User,
  loading: boolean;
  business?: Business;
  selectedKey: string;
  openedSubmenu: string;
  showBusinessModal: boolean;
  showUserModal: boolean;
  showBusinessConfigModal: boolean;
  loadingBusiness: boolean;
  loadingUser: boolean;
  loadingBusinessConfig:boolean;
}

class DashboardLayout extends Component<Props, State> {
  state = {
    user: undefined,
    loading: true,
    business: undefined,
    selectedKey: 'home',
    openedSubmenu: '',
    showBusinessModal: false,
    showUserModal: false,
    loadingBusiness: false,
    loadingUser: false,
    showBusinessConfigModal:false,
    loadingBusinessConfig:false,
  }

  componentDidMount() {
    const user = getUser(this.props, localStorage);
    const selectedBusiness = getSelectedBusiness(localStorage);
    if (!selectedBusiness || !user) {
      Router.push('/business');
    }
    const context = this;

    setTimeout(() => {
      context.setState({ loading: false, business: selectedBusiness, user });
    }, 1000);
    this.getSelectedKey();
  }

  goToSelectBusiness = () => {
    Router.push('/business');
  }

  handleKeySelected = (key: string) => {
    this.props.router.push(key);
    //this.setState({ selectedKey: key });
  }

  handleMenuOpen = (key: string) => {
    const { openedSubmenu } = this.state;
    this.setState({ openedSubmenu: key === openedSubmenu ? '' : key });
  }

  getSelectedKey = () => {
    const path = this.props.router.asPath;
    if (path.startsWith('/products')) {
      this.setState({ selectedKey: 'products', openedSubmenu: 'catalog' });
      return
    }
    if (path.startsWith('/categories')) {
      this.setState({ selectedKey: 'categories', openedSubmenu: 'catalog' });
      return
    }
    if (path.startsWith('/subcategories')) {
      this.setState({ selectedKey: 'subcategories', openedSubmenu: 'catalog' });
      return
    }
    if (path.startsWith('/collections')) {
      this.setState({ selectedKey: 'collections', openedSubmenu: 'catalog' });
      return
    }
    if (path.startsWith('/orders')) {
      this.setState({ selectedKey: 'orders', openedSubmenu: 'sales' });
      return
    }
    if (path.startsWith('/customers')) {
      this.setState({ selectedKey: 'customers', openedSubmenu: 'sales' });
      return
    }
    if (path.startsWith('/home')) {
      this.setState({ selectedKey: 'home' });
      return
    }
  }

  doLogout = () => {
    clearUser(this.props, localStorage);
    Router.push('/login');
  }

  onEdit = (business: Business) => {
    const { showBusinessModal } = this.state;
    this.setState({ showBusinessModal: !showBusinessModal });
  }

  onEditUser = (user: User) => {
    const { showUserModal } = this.state;
    this.setState({ showUserModal: !showUserModal });
  }

  onConfig = (business: Business) => {
    const { showBusinessConfigModal } = this.state;
    this.setState({ showBusinessConfigModal: !showBusinessConfigModal });
  }

  updateBusiness = async (values: BusinessFormValues) => {
    const { business } = this.state;
    this.setState({ loadingBusiness: true });
    try {
      if (business) {
        const businessUpdated = await BusinessService.update(business, values);
        notification.success({ message: 'Correcto', description: 'Se ha actualizado el negocio exitosamente.' });
        setSelectedBusiness(businessUpdated, localStorage);
        this.setState({ loadingBusiness: false, business: businessUpdated, showBusinessModal: false });
      }
    } catch (error) {
      notification.error({ message: 'Error', description: error.message });
      this.setState({ loadingBusiness: false });
    }
  }

  updateBusinessSettings = async (values: BusinessConfigurationFormValues) => {
    const { business } = this.state;
    this.setState({ loadingBusinessConfig: true });
    try{
      if(business.business_settings){
        const response = await BusinessSettingsService.update(business.id, business.business_settings.id, values as BusinessSettings);
        business.business_settings = response;
        setSelectedBusiness(business, localStorage);
        this.setState({showBusinessConfigModal: false});
      }else{
        const response = await BusinessSettingsService.create(business.id, values as BusinessSettings);
        business.business_settings = response;
        setSelectedBusiness(business, localStorage);
        this.setState({showBusinessConfigModal: false});
      }
      this.setState({ loadingBusinessConfig: false });
    }catch (error){
      notification.error({ message: 'Error', description: error.message });

      this.setState({ loadingBusinessConfig: false });

    }
  }

  updateUser = async (values: UserFormValues) =>{
    const { user } = this.state;
    this.setState({ loadingUser: true });
    try {
      if (user) {
        values.id = user.id;
        const userUpdated = await UserService.update(user, values);
        notification.success({ message: 'Correcto', description: 'Se ha actualizado el usuario exitosamente.' });
        clearUser(this.props, localStorage);
        setUser(userUpdated, this.props, localStorage);
        this.setState({ loadingUser: false, user: userUpdated, showUserModal: false });
      }
    } catch (error) {
      notification.error({ message: 'Error', description: error.message });
      this.setState({ loadingUser: false });
    }
  }

  render() {
    const { loading, business, selectedKey, openedSubmenu,loadingBusinessConfig, user, showBusinessModal, showUserModal, loadingBusiness, loadingUser, showBusinessConfigModal } = this.state;
    const { breadCrum } = this.props;

    if (loading) return <Fragment>
      {
        this.props.baseMeta || <BaseMeta />
      }
      <Loader size={'large'} loading={loading} fullHeight={true} />
    </Fragment>

    return (
      <Layout className='dashboard-layout'>
        {
          this.props.baseMeta || <BaseMeta />
        }
        <Header className="header">
          <div className="dashboard-layout__logo" />
          {
            business && <BusinessDropdown business={business} onLogout={this.goToSelectBusiness} onConfig={this.onConfig} onEdit={this.onEdit} />
          }
          {
            user && <UserDropdown user={user} onLogout={() => this.doLogout()} onEditUser={this.onEditUser} />
          }
        </Header>
        <Layout>
          <Sider width={200}>
            <Menu
              mode="inline"
              defaultSelectedKeys={[selectedKey]}
              defaultOpenKeys={[openedSubmenu]}
              openKeys={[openedSubmenu]}
              selectedKeys={[selectedKey]}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key='home' onClick={() => this.handleKeySelected('/')} icon={<DashboardOutlined />}>
                Inicio
              </Menu.Item>
              <SubMenu key='catalog' icon={<BookOutlined />} title='Catálogo' onTitleClick={() => this.handleMenuOpen('catalog')}>
                <Menu.Item key='products' onClick={() => this.handleKeySelected('/products')}>Productos</Menu.Item>
                <Menu.Item key='categories' onClick={() => this.handleKeySelected('/categories')}>Categorías</Menu.Item>
                <Menu.Item key='subcategories' onClick={() => this.handleKeySelected('/subcategories')}>Subcategorías</Menu.Item>
                <Menu.Item key='collections' onClick={() => this.handleKeySelected('/collections')}>Colecciones</Menu.Item>
              </SubMenu>
              <SubMenu key='sales' icon={<DollarCircleOutlined />} title='Ventas' onTitleClick={() => this.handleMenuOpen('sales')}>
                <Menu.Item key='orders' onClick={() => this.handleKeySelected('/orders')}>Pedidos</Menu.Item>
                <Menu.Item key='customers' onClick={() => this.handleKeySelected('/customers')}>Clientes</Menu.Item>
              </SubMenu>
              <Menu.Item key='subscription' onClick={() => this.handleKeySelected('/subscription')} icon={<SmileOutlined />}>
                Suscripción
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            {
              breadCrum && <Breadcrumb style={{ margin: '16px 0 0', padding: '0 24px' }}>
                {
                  breadCrum.map((item: BreadCrumItem, index: number) => <Breadcrumb.Item key={index}>
                    <Link href={item.link}><a>{item.text}</a></Link>
                  </Breadcrumb.Item>)
                }
              </Breadcrumb>
            }
            

            <Content className='dashboard-layout__content' style={{ padding: '0 24px 24px' }}>
              <Divider />
              {this.props.children}

              <Footer style={{ textAlign: 'center' }}>Arca de Troya ©{new Date().getFullYear()} Creado por <a href='https://twosoft.com.mx' target='_blank'>Twosoft</a> </Footer>
            </Content>
            <BusinessEditModal
              business={business}
              show={showBusinessModal}
              loading={loadingBusiness}
              onSave={this.updateBusiness}
              onClose={this.onEdit}
            />
            <UserEditModal
              user={user}
              show={showUserModal}
              loading={loadingUser}
              onSave={this.updateUser}
              onClose={this.onEditUser}
            />
            <BusinessConfigurationModal
              business={business}
              show={showBusinessConfigModal}
              loading={loadingBusinessConfig}
              onSave={this.updateBusinessSettings}
              onClose={this.onConfig}
            />
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

export default withRouter(withCookie(DashboardLayout));