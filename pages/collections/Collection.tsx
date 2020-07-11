import React, { Component } from 'react';

import './Collection.scss';
import DashboardLayout from '../shared/DashboardLayout';
import { Business } from '../../api/Business/Business';
import { getSelectedBusiness } from '../../utils/common';
import { notification, Button } from 'antd';
import esES from 'antd/lib/locale-provider/es_ES';
import WithAuthentication from '../shared/WithAuthentication';
import CollectionService from '../../api/Collection';
import { Collection } from '../../api/Collection/Collection';
import CategoriesTable from './components/CollectionTable';
import CollectionModal from './components/CollectionModal';

type Props = {

}
type State = {
  business?: Business;
  // Pagination
  pageSize: number;
  currentPage: number;
  //
  loading: boolean;
  collections: Collection[];
  showCollectionModal: boolean;
  savingCollection: boolean;
  selectedCollection?: Collection;
}
class Collections extends Component<Props, State> {
  state = {
    business: undefined,
    pageSize: 10,
    currentPage: 1,
    loading: false,
    showCollectionModal: false,
    savingCollection: false,
    collections: [],
    selectedCollection: undefined,
  }

  componentDidMount() {
    const business = getSelectedBusiness(localStorage);
    this.setState({ business }, () => {
      this.getCollections();
    });
  }

  getCollections = async () => {
    this.setState({ loading: true });
    try {
      const { business } = this.state;
      const collections = await CollectionService.list(business.id);
      const context = this;
      this.setState({ collections });
      setTimeout(() => {
        context.setState({ loading: false });
      }, 1000);
    } catch (error) {
      this.setState({ loading: false });
      notification.warning({ message: 'Ups', description: 'No pudimos recuperar la lista de colecciones.' });
    }
  }

  saveCollection = async (values: any) => {
    const { business, selectedCollection } = this.state;
    values.business_id=business.id;
    this.setState({ savingCollection: true });
    try {
      if (selectedCollection) {
        await CollectionService.update(business.id, selectedCollection.id, values);
      } else {
        await CollectionService.create(business.id, values);
      }
      this.setState({ showCollectionModal: false, savingCollection: false, selectedCollection: undefined }, () => this.getCollections());
    } catch (error) {
      notification.error({ message: 'Ups', description: error.message });
      this.setState({ savingCollection: false });
    }
  }

  deleteCollection = async (id: number) => {
    const { business } = this.state;
    try {
      await CollectionService.destroy(business.id, id);
      this.getCollections();
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

  onEdit = (collection_id: number) => {
    const { collections } = this.state;
    this.setState({ showCollectionModal: true, selectedCollection: collections.find((collection: Collection) => collection.id === collection_id) });
  }

  handleModalOpen = () => {
    const { showCollectionModal } = this.state;
    this.setState({ showCollectionModal: !showCollectionModal });
  }

  render() {
    const { loading, business, collections, pageSize, currentPage, showCollectionModal, selectedCollection, savingCollection } = this.state;
    return (<DashboardLayout
      breadCrum={[{ text: 'Colecciones', link: '/collections' }]}
    >
      <div className={'categories'}>
        <h1 className='categories__title'>Lista de colecciones <span>{`${business ? business.name : ''}`}</span></h1>
        <Button type='primary' onClick={this.handleModalOpen} style={{ marginTop: 10 }}>Agregar colección</Button>
        <CategoriesTable
          onEdit={this.onEdit}
          onDelete={this.deleteCollection}
          loading={loading}
          collections={collections}
          pagination={{
            total: collections.length,
            showTotal: (total: number, range: any) => `${range[0]}-${range[1]} de ${total} colecciones`,
            pageSize: pageSize,
            pageSizeOptions: ['10', '25', '50', '100'],
            showSizeChanger: true,
            locale: esES.Pagination,
            current: currentPage,
            onChange: this.pageChange,
            onShowSizeChange: this.sizePageChange,
            position: ['bottomLeft']
          }} />
        <CollectionModal
          collection={selectedCollection}
          show={showCollectionModal}
          loading={savingCollection}
          onSave={this.saveCollection}
          onClose={() => this.setState({ showCollectionModal: false, selectedCollection: undefined })}
        />
      </div>
    </DashboardLayout>)
  }
}

export default WithAuthentication(Collections);