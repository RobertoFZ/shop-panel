import React, { Component, Fragment } from 'react';
import { Table, Card, Button, Popconfirm, Modal, Upload, message, notification } from 'antd';
import { Product } from '../../../../../api/Product/Product';
import { chunkArray } from '../../../../../utils/common';
import { RcFile } from 'antd/lib/upload';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import ProductImageService from '../../../../../api/ProductImage';

type ProductImage = { id: number, image: string };

type Props = {
  product?: Product;
  onAdd?: Function;
  onDelete?: Function;
}

type State = {
  selectedImage?: { key: number, image: string };
  uploadImage: boolean;
  selectedPage: number;
  imageUrl?: string;
  loading: boolean;
}

class ImagesTable extends Component<Props, State> {
  PAGE_SIZE = 2;
  state = {
    selectedImage: undefined,
    uploadImage: false,
    selectedPage: 1,
    loading: false,
    imageUrl: undefined
  }

  getDataSource = () => {
    const { selectedPage } = this.state;
    const { product } = this.props;
    if (!product || product.images.length === 0) {
      return [];
    }
    return chunkArray(product.images, this.PAGE_SIZE)[selectedPage - 1].map((image: ProductImage) => {
      return {
        key: image.id,
        image: `${process.env.serverUrl}${image.image}`
      }
    });
  }

  onShowImage = (image: { key: number, image: string }) => {
    this.setState({ selectedImage: image });
  }

  uploadImage = () => {
    const { uploadImage } = this.state;
    this.setState({ uploadImage: !uploadImage });
  }

  getBase64 = (img: File, callback: Function) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Los formatos aceptados son JPG/PNG', 3);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('La imagen debe ser menor a 2MB', 3);
    }
    return isJpgOrPng && isLt2M;
  }

  handleUpload = async (file: RcFile) => {
    if (this.beforeUpload(file)) {
      this.getBase64(file, (result: string) => {
        const base64String = result.split(',')[1];
        this.uploadImageToServer(base64String);
      })
    }
    return '';
  }

  uploadImageToServer = async (base64Image: string) => {
    const { product, onAdd } = this.props;
    this.setState({ loading: true });
    try {
      await ProductImageService.create(product.business_id, product.id, base64Image);
      if (onAdd) {
        onAdd();
      }
      this.setState({ loading: false, uploadImage: false, imageUrl: undefined, selectedPage: 1 });
    } catch (error) {
      notification.error({ message: 'Error', description: error.message });
      this.setState({ loading: false });
    }
  }

  deleteImage = async (id: number) => {
    const { product, onDelete } = this.props;
    this.setState({ loading: true });
    try {
      await ProductImageService.destroy(product.business_id, product.id, id);
      if (onDelete) {
        onDelete();
      }
      this.setState({ loading: false, selectedPage: 1 });
    } catch (error) {
      notification.error({ message: 'Error', description: error.message });
      this.setState({ loading: false });
    }
  }

  render() {
    const { product } = this.props;
    const { selectedImage, selectedPage, uploadImage, imageUrl, loading } = this.state;
    const columns = [
      {
        title: 'Imagen',
        dataIndex: 'image',
        key: 'image',
        render: (text: string, record: any) => <div
          onClick={() => this.onShowImage(record)}
          className='images-table__image'
          style={{ backgroundImage: `url("${text}")` }}
        ></div>
      },
      {
        title: 'Acciones',
        dataIndex: 'accions',
        key: 'accions',
        render: (text: string, record: any, index: number) => (
          <span>
            <Popconfirm
              placement='left'
              title='¿Seguro que deseas eliminar la imagen del producto?'
              onConfirm={() => this.props.onDelete ? this.props.onDelete(record.key) : () => { }}
              okText='Sí'
              cancelText='No'
            >
              <Button type='link' onClick={() => this.deleteImage(record.key)}>
                Eliminar
            </Button>
            </Popconfirm>
          </span>
        ),
      }
    ];

    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Agregar</div>
      </div>
    );

    return (<Card
      title='Imágenes del producto'
      className='images-table'
      loading={product ? false : true}
      extra={<Button type='link' onClick={this.uploadImage}>Agregar</Button>}
    >
      {
        product && <Table
          dataSource={this.getDataSource()}
          columns={columns}
          pagination={{
            total: product.images.length,
            pageSize: this.PAGE_SIZE,
            current: selectedPage,
            onChange: (page) => this.setState({ selectedPage: page }),
            position: ['bottomRight']
          }}
        />
      }
      <Modal
        title={uploadImage && !selectedImage ? 'Subir nueva imagen' : 'Vista previa'}
        centered
        visible={this.state.selectedImage || uploadImage}
        onCancel={() => this.setState({ selectedImage: undefined, uploadImage: false })}
        footer={[
          <Button key="back" disabled={loading} onClick={() => this.setState({ selectedImage: undefined, uploadImage: false })}>
            Cerrar
          </Button>,
        ]}
      >
        {selectedImage ? <img className='images-table__preview' src={selectedImage.image} /> : <Fragment>
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            action={this.handleUpload}
          >
            {imageUrl && !loading ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Fragment>}
      </Modal>
    </Card>);
  }
}

export default ImagesTable;