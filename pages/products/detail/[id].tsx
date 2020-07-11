import React, { Component } from 'react';
import { Row, Col, notification } from 'antd';
import { NextRouter, withRouter } from 'next/router';
import DashboardLayout from '../../shared/DashboardLayout';
import ProductService from '../../../api/Product';
import { Product, Subcategory } from '../../../api/Product/Product';
import './Product.scss';
import ProductInformation from './components/ProductInformation';
import ImagesTable from './components/ImagesTable';
import WithAuthentication from '../../shared/WithAuthentication';
import ProductVariantsTable from './components/ProductVariantsTable';
import ProductModal from './components/ProductModal';
import { ProductFormValues } from './components/ProductModal/ProductModal';
import SubcategoryService from '../../../api/Subcategory';
import ProductVariantModal from './components/ProductVariantModal';
import { ProductVariantFormValues } from './components/ProductVariantModal/ProductVariantModal';
import { ProductVariant } from '../../../api/ProductVariant/ProductVariant';
import ProductVariantService from '../../../api/ProductVariant';

type Props = {
  id: number;
  router: NextRouter;
  product: Product;
};
type State = {
  loading: boolean;
  product?: Product;
  subcategories: Subcategory[];
  showEditModal: boolean;
  savingProduct: boolean;
  selectedProductVariant?: ProductVariant;
  savingProductVariant: boolean;
  showProductVariantModal: boolean;
};

class ProductDetail extends Component<Props, State> {
  state = {
    product: undefined,
    loading: false,
    showEditModal: false,
    savingProduct: false,
    subcategories: [],
    showProductVariantModal: false,
    savingProductVariant: false,
    selectedProductVariant: undefined
  }

  static async getInitialProps({ query }) {
    const { id } = query;
    try {
      const product = await ProductService.findOne(id);
      return {
        product
      }
    } catch (error) {
      return {
        product: undefined
      }
    }
  }

  componentDidMount() {
    const { id } = this.props.router.query;
    if (this.props.router.asPath.includes('success')) {
      notification.success({ message: 'Correcto', description: 'Se ha creado el nuevo producto exitosamente.' });
    }
    this.getProduct(Number(id));
  }

  /**
   * Get the product by id
   */
  getProduct = async (id: number) => {
    this.setState({ loading: true, product: undefined });
    try {
      const product = await ProductService.findOne(Number(id));
      const subcategories = await SubcategoryService.list(product.business_id);
      await new Promise((resolve) => setTimeout(() => resolve(), 1000));
      this.setState({ product, loading: false, subcategories });
    } catch (error) {
      this.props.router.push('/products');
      this.setState({ loading: false });
    }
  }

  /**
   * Handle the edition modal showing
   */
  onEdit = () => {
    const { showEditModal } = this.state;
    this.setState({ showEditModal: !showEditModal });
  }

  /**
   * Handle the product creation request
   */
  handleSave = async (values: ProductFormValues) => {
    const { product } = this.state;
    console.log(values);
    this.setState({ savingProduct: true });
    try {
      const response = await ProductService.update(product, values);
      this.setState({ product: response, savingProduct: false, showEditModal: false });
      notification.success({ message: 'Correcto', description: `${response.name} actualizado correctamente.` });
    } catch (error) {
      notification.error({ message: 'Ups', description: error.message });
      this.setState({ savingProduct: false });
    }
  }

  handleProductVariantSave = async (values: ProductVariantFormValues) => {
    const { product, selectedProductVariant } = this.state;
    this.setState({ savingProductVariant: true });
    try {
      if (selectedProductVariant) {
        await ProductVariantService.update(product.business_id, product.id, selectedProductVariant.id, values);
      } else {
        await ProductVariantService.create(product.business_id, product.id, values);
      }
      notification.success({ message: 'Correcto', description: 'Variante creada correctamente.' });
      this.setState({ savingProductVariant: false, selectedProductVariant: undefined, showProductVariantModal: false }, () => this.getProduct(product.id));
    } catch (error) {
      notification.error({ message: 'Error', description: error.message });
      this.setState({ savingProductVariant: false });
    }
  }

  /**
   * Request delete a product
   */
  deleteProduct = async () => {
    const { product } = this.state;
    try {
      await ProductService.destroy(product.business, product.id);
      this.props.router.push('/products?success');
    } catch (error) {
      notification.error({ message: 'Error', description: error.message });
    }
  }

  /**
   * Callback after image upload correctly
   */
  onImageAdded = () => {
    const { id } = this.props.router.query;
    notification.success({ message: 'Correcto', description: 'Imagen agregada correctamente.' });
    this.getProduct(Number(id));
  }

  /**
   * Callback after image deleted correctly
   */
  onImageDeleted = () => {
    const { id } = this.props.router.query;
    notification.success({ message: 'Correcto', description: 'Imagen eliminada correctamente.' });
    this.getProduct(Number(id));
  }

  /**
   * 
   */
  showProductVariant = (productVariant: ProductVariant) => {
    const { showProductVariantModal } = this.state;
    this.setState({ showProductVariantModal: !showProductVariantModal, selectedProductVariant: productVariant });
  }

  /**
   * Delete the product variant
   */
  onProductVariantDelete = async (productVariant_id: number) => {
    const { product } = this.state;
    this.setState({ savingProductVariant: true });
    try {
      await ProductVariantService.destroy(product.business_id, product.id, productVariant_id);
      notification.success({ message: 'Correcto', description: 'Variante eliminada correctamente.' });
      this.setState({ savingProductVariant: false });
      this.getProduct(product.id);
    } catch (error) {
      notification.error({ message: 'Error', description: error.message });
      this.setState({ savingProductVariant: false });
    }
  }

  render() {
    const {
      product,
      showEditModal,
      savingProduct,
      subcategories,
      showProductVariantModal,
      selectedProductVariant,
      savingProductVariant
    } = this.state;
    const breadCrums = [{ text: 'Productos', link: '/products' }];
    if (product) {
      breadCrums.push({
        text: product.name,
        link: `/products/detail/${product.id}`
      })
    }
    return (<DashboardLayout
      breadCrum={breadCrums}
    >
      <div className={'product'}>
        <h1 className='product__title'>Viendo <span>{product ? product.name : ''}</span></h1>
        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <ProductInformation product={product} onEdit={this.onEdit} onDelete={this.deleteProduct} />
            <br />
          </Col>
          <Col xs={24} lg={12}>
            <ImagesTable product={product} onAdd={this.onImageAdded} onDelete={this.onImageDeleted} />
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs={24}>
            <ProductVariantsTable product={product} onAdd={this.showProductVariant} onDelete={this.onProductVariantDelete} />
          </Col>
        </Row>
        <ProductModal
          onSave={this.handleSave}
          product={product}
          show={showEditModal}
          loading={savingProduct}
          onClose={() => this.setState({ showEditModal: false })}
          subcategories={subcategories}
        />
        <ProductVariantModal
          onSave={this.handleProductVariantSave}
          productVariant={selectedProductVariant}
          show={showProductVariantModal}
          loading={savingProductVariant}
          onClose={() => this.setState({ showProductVariantModal: false, selectedProductVariant: undefined })}
        />
      </div>
    </DashboardLayout>)
  }
}

export default WithAuthentication(withRouter(ProductDetail));