import React, { Component } from 'react';

import './Products.scss';
import DashboardLayout from '../shared/DashboardLayout';
import { Business } from '../../api/Business/Business';
import { getSelectedBusiness } from '../../utils/common';
import ProductsTable from './components/ProductsTable';
import { ProductPaginate } from '../../api/Product/Product';
import ProductService from '../../api/Product';
import { notification, Button } from 'antd';
import esES from 'antd/lib/locale-provider/es_ES';
import WithAuthentication from '../shared/WithAuthentication';
import ProductModal from './detail/components/ProductModal';
import SubcategoryService from '../../api/Subcategory';
import { Subcategory } from '../../api/Subcategory/Subcategory';
import { ProductFormValues } from './detail/components/ProductModal/ProductModal';
import Router, { withRouter, NextRouter } from 'next/router';

type Props = {
  router: NextRouter;
}
type State = {
  business?: Business;
  // Pagination
  pageSize: number;
  currentPage: number;
  //
  subcategories: Subcategory[];
  selectedCategories: Array<number>;
  loading: boolean;
  products?: ProductPaginate;
  showProductModal: boolean;
  savingProduct: boolean;
}
class Products extends Component<Props, State> {
  state = {
    business: undefined,
    pageSize: 10,
    currentPage: 1,
    subcategories: [],
    selectedCategories: [],
    products: undefined,
    loading: false,
    showProductModal: false,
    savingProduct: false
  }

  componentDidMount() {
    const business = getSelectedBusiness(localStorage);
    if (this.props.router.asPath.includes('success')) {
      notification.success({
        message: 'Correcto',
        description: 'Se ha eliminado el producto exitosamente.'
      });
    }
    this.setState({ business }, () => {
      this.getProducts();
      this.getSubcategories();
    });
  }

  getSubcategories = async () => {
    const { business } = this.state;
    try {
      const response = await SubcategoryService.list(business.id);
      this.setState({ subcategories: response });
    } catch (error) {
      console.log(error);
    }
  }

  getProducts = async () => {
    this.setState({ loading: true });
    try {
      const { currentPage, pageSize, selectedCategories, business } = this.state;
      const products = await ProductService.list(currentPage, pageSize, undefined, [business.id], selectedCategories);
      const context = this;
      this.setState({ products });
      setTimeout(() => {
        context.setState({ loading: false });
      }, 1000);
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      notification.warning({ message: 'Ups', description: 'No pudimos recuperar la lista de productos.' });
    }
  }

  createProduct = async (values: ProductFormValues) => {
    const { business } = this.state;
    this.setState({ savingProduct: true });
    try {
      const product = await ProductService.create(business, values);
      //this.setState({ showProductModal: false, savingProduct: false }, () => this.getProducts());
      Router.push(`/products/detail/${product.id}?success`);
    } catch (error) {
      notification.error({ message: 'Ups', description: error.message });
      this.setState({ savingProduct: false });
    }
  }

  deleteProduct = async (id: number) => {
    const { business } = this.state;
    try {
      await ProductService.destroy(business, id);
      this.getProducts();
    } catch (error) {
      notification.error({ message: 'Ups', description: error.message });
    }
  }

  pageChange = async (page: number) => {
    try {
      this.setState({ currentPage: page }, () => this.getProducts());
    } catch (error) {
      console.log(error);
    }

  }

  sizePageChange = async (current: number, size: number) => {
    try {
      this.setState({ pageSize: size, currentPage: 1 }, () => this.getProducts());
    } catch (error) {
      console.log(error);
    }
  }

  handleModalOpen = () => {
    const { showProductModal } = this.state;
    this.setState({ showProductModal: !showProductModal });
  }

  render() {
    const { loading, business, products, pageSize, currentPage, showProductModal, subcategories, savingProduct } = this.state;
    return (<DashboardLayout
      breadCrum={[{ text: 'Productos', link: '/products' }]}
    >
      <div className={'products'}>
        <h1 className='products__title'>Lista de productos <span>{`${business ? business.name : ''}`}</span></h1>
        <Button type='primary' onClick={this.handleModalOpen} style={{ marginTop: 10 }}>Agregar producto</Button>
        <ProductsTable
          onDelete={this.deleteProduct}
          loading={loading}
          products={products}
          pagination={{
            total: products ? products.count : 0,
            showTotal: (total: number, range: any) => `${range[0]}-${range[1]} de ${total} productos`,
            pageSize: pageSize,
            pageSizeOptions: ['10', '25', '50', '100'],
            showSizeChanger: true,
            locale: esES.Pagination,
            current: currentPage,
            onChange: this.pageChange,
            onShowSizeChange: this.sizePageChange,
            position: ['bottomLeft']
          }} />
        <ProductModal
          product={undefined}
          loading={savingProduct}
          show={showProductModal}
          subcategories={subcategories}
          onClose={this.handleModalOpen}
          onSave={this.createProduct}
        />
      </div>
    </DashboardLayout>)
  }
}

export default WithAuthentication(withRouter(Products));