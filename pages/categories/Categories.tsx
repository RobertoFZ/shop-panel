import React, { Component } from 'react';

import './Categories.scss';
import DashboardLayout from '../shared/DashboardLayout';
import { Business } from '../../api/Business/Business';
import { getSelectedBusiness } from '../../utils/common';
import { notification, Button } from 'antd';
import esES from 'antd/lib/locale-provider/es_ES';
import WithAuthentication from '../shared/WithAuthentication';
import CategoryService from '../../api/Category';
import { Category } from '../../api/Category/Category';
import CategoriesTable from './components/CategoriesTable';
import CategoryModal from './components/CategoryModal';

type Props = {

}
type State = {
  business?: Business;
  // Pagination
  pageSize: number;
  currentPage: number;
  //
  loading: boolean;
  categories: Category[];
  showCategoryModal: boolean;
  savingCategory: boolean;
  selectedCategory?: Category;
}
class Categories extends Component<Props, State> {
  state = {
    business: undefined,
    pageSize: 10,
    currentPage: 1,
    loading: false,
    showCategoryModal: false,
    savingCategory: false,
    categories: [],
    selectedCategory: undefined,
    
  }

  componentDidMount() {
    const business = getSelectedBusiness(localStorage);
    this.setState({ business }, () => {
      this.getCategories();
    });
  }

  getCategories = async () => {
    this.setState({ loading: true });
    try {
      const { business } = this.state;
      const categories = await CategoryService.list(business.id);
      const context = this;
      this.setState({ categories });
      setTimeout(() => {
        context.setState({ loading: false });
      }, 1000);
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
      notification.warning({ message: 'Ups', description: 'No pudimos recuperar la lista de categorías.' });
    }
  }

  saveCategory = async (values: any) => {
    const { business, selectedCategory } = this.state;
    this.setState({ savingCategory: true });
    try {
      if (selectedCategory) {
        await CategoryService.update(business.id, selectedCategory.id, values);
      } else {
        await CategoryService.create(business.id, values);
      }
      this.setState({ showCategoryModal: false, savingCategory: false, selectedCategory: undefined }, () => this.getCategories());
    } catch (error) {
      notification.error({ message: 'Ups', description: error.message });
      this.setState({ savingCategory: false });
    }
  }

  deleteCategory = async (id: number) => {
    const { business } = this.state;
    try {
      await CategoryService.destroy(business.id, id);
      this.getCategories();
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

  onEdit = (category_id: number) => {
    const { categories } = this.state;
    this.setState({ showCategoryModal: true, selectedCategory: categories.find((category: Category) => category.id === category_id) });
  }

  handleModalOpen = () => {
    const { showCategoryModal } = this.state;
    this.setState({ showCategoryModal: !showCategoryModal });
  }

  render() {
    const { loading, business, categories, pageSize, currentPage, showCategoryModal, selectedCategory, savingCategory } = this.state;
    return (<DashboardLayout
      breadCrum={[{ text: 'Categorías', link: '/categories' }]}
    >
      <div className={'categories'}>
        <h1 className='categories__title'>Lista de categorías <span>{`${business ? business.name : ''}`}</span></h1>
        <Button type='primary' onClick={this.handleModalOpen} style={{ marginTop: 10 }}>Agregar categoría</Button>
        <CategoriesTable
          onEdit={this.onEdit}
          onDelete={this.deleteCategory}
          loading={loading}
          categories={categories}
          pagination={{
            total: categories.length,
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
        <CategoryModal
          category={selectedCategory}
          show={showCategoryModal}
          loading={savingCategory}
          onSave={this.saveCategory}
          onClose={() => this.setState({ showCategoryModal: false, selectedCategory: undefined })}
        />
      </div>
    </DashboardLayout>)
  }
}

export default WithAuthentication(Categories);