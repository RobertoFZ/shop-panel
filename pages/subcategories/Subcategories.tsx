import React, { Component } from 'react';

import './Subcategories.scss';
import DashboardLayout from '../shared/DashboardLayout';
import { Business } from '../../api/Business/Business';
import { getSelectedBusiness } from '../../utils/common';
import { notification, Button } from 'antd';
import esES from 'antd/lib/locale-provider/es_ES';
import WithAuthentication from '../shared/WithAuthentication';
import CategoryService from '../../api/Category';
import SubategoriesTable from './components/SubategoriesTable';
import { Subcategory } from '../../api/Subcategory/Subcategory';
import SubcategoryService from '../../api/Subcategory';
import SubcategoryModal from './components/SubcategoryModal';
import { Category } from '../../api/Category/Category';
import { SubategoryFormValues } from './components/SubcategoryModal/SubcategoryModal';

type Props = {

}
type State = {
  business?: Business;
  // Pagination
  pageSize: number;
  currentPage: number;
  //
  loading: boolean;
  categories: Category[],
  subcategories: Subcategory[];
  showSubcategoryModal: boolean;
  savingSubcategory: boolean;
  selectedSubcategory?: Subcategory;
}
class Subcategories extends Component<Props, State> {
  state = {
    business: undefined,
    pageSize: 10,
    currentPage: 1,
    loading: false,
    showSubcategoryModal: false,
    savingSubcategory: false,
    categories: [],
    subcategories: [],
    selectedSubcategory: undefined
  }

  componentDidMount() {
    const business = getSelectedBusiness(localStorage);
    this.setState({ business }, () => {
      this.getCategories();
      this.getSubcategories();
    });
  }

  getCategories = async () => {
    const { business } = this.state;
    try {
      const categories = await CategoryService.list(business.id);
      this.setState({ categories });
    } catch (error) {
      notification.error({ message: 'Ups', description: 'No pudimos obtener las categorías de la empresa.' });
    }
  }

  getSubcategories = async () => {
    this.setState({ loading: true });
    try {
      const { business } = this.state;
      const subcategories = await SubcategoryService.list(business.id);
      const context = this;
      this.setState({ subcategories });
      setTimeout(() => {
        context.setState({ loading: false });
      }, 1000);
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      notification.warning({ message: 'Ups', description: 'No pudimos recuperar la lista de categorías.' });
    }
  }

  saveSubcategory = async (values: SubategoryFormValues) => {
    const { business, selectedSubcategory } = this.state;
    this.setState({ savingSubcategory: true });
    try {
      if (selectedSubcategory) {
        await SubcategoryService.update(business.id, selectedSubcategory.category.id, selectedSubcategory.id, values);
      } else {
        await SubcategoryService.create(business.id, values.category_id, values);
      }
      this.setState({ showSubcategoryModal: false, savingSubcategory: false, selectedSubcategory: undefined }, () => this.getSubcategories());
    } catch (error) {
      notification.error({ message: 'Ups', description: error.message });
      this.setState({ savingSubcategory: false });
    }
  }

  deleteCategory = async (id: number) => {
    const { business, subcategories } = this.state;
    const subcategory = subcategories.find((subcategory: Subcategory) => subcategory.id === id)
    try {
      await SubcategoryService.destroy(business.id, subcategory.category.id, subcategory.id);
      this.getSubcategories();
    } catch (error) {
      notification.error({ message: 'Ups', description: error.message });
    }
  }

  pageChange = async (page: number) => {
    try {
      this.setState({ currentPage: page });
    } catch (error) {
      console.log(error);
    }

  }

  sizePageChange = async (current: number, size: number) => {
    try {
      this.setState({ pageSize: size, currentPage: 1 });
    } catch (error) {
      console.log(error);
    }
  }

  onEdit = (subcategory_id: number) => {
    const { subcategories } = this.state;
    this.setState({ showSubcategoryModal: true, selectedSubcategory: subcategories.find((subcategory: Subcategory) => subcategory.id === subcategory_id) });
  }

  handleModalOpen = () => {
    const { showSubcategoryModal } = this.state;
    this.setState({ showSubcategoryModal: !showSubcategoryModal });
  }

  render() {
    const {
      loading,
      business,
      subcategories,
      pageSize,
      currentPage,
      showSubcategoryModal,
      selectedSubcategory,
      savingSubcategory,
      categories
    } = this.state;
    return (<DashboardLayout
      breadCrum={[{ text: 'Subcategorías', link: '/subcategories' }]}
    >
      <div className={'categories'}>
        <h1 className='categories__title'>Lista de subcategorías <span>{`${business ? business.name : ''}`}</span></h1>
        <Button type='primary' onClick={this.handleModalOpen} style={{ marginTop: 10 }}>Agregar subcategoría</Button>
        <SubategoriesTable
          onEdit={this.onEdit}
          onDelete={this.deleteCategory}
          loading={loading}
          subcategories={subcategories}
          pagination={{
            total: subcategories.length,
            showTotal: (total: number, range: any) => `${range[0]}-${range[1]} de ${total} categorías`,
            pageSize: pageSize,
            pageSizeOptions: ['10', '25', '50', '100'],
            showSizeChanger: true,
            locale: esES.Pagination,
            current: currentPage,
            onChange: this.pageChange,
            onShowSizeChange: this.sizePageChange,
            position: ['bottomLeft']
          }} />
        <SubcategoryModal
          categories={categories}
          subcategory={selectedSubcategory}
          show={showSubcategoryModal}
          loading={savingSubcategory}
          onSave={this.saveSubcategory}
          onClose={() => this.setState({ showSubcategoryModal: false, selectedSubcategory: undefined })}
        />
      </div>
    </DashboardLayout>)
  }
}

export default WithAuthentication(Subcategories);