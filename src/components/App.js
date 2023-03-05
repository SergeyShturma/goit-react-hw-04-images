import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import s from './App.module.css';
import Searchbar from './Searchbar/Searchbar';
import fetchImages from 'components/api';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import ImageLoader from './Loader/Loader';
import Modal from 'components/Modal/Modal';

class App extends Component {
  state = {
    searchData: '',
    page: 0,
    images: [],
    isLoading: false,
    error: null,
    showModal: false,
    largeImage: '',
  };

  onSubmit = searchData => {
    if (this.state.searchData === searchData.trim()) {
      return this.toastInfoDuplication();
    }
    this.setState({
      searchData,
      page: 1,
      images: [],
    });
  };

  toastInfoDuplication = () => {
    return toast.info('You are already here!', this.toastSettings);
  };

  componentDidUpdate(prevProps, prevState) {
    const prevPage = prevState.page;
    const prevSearchData = prevState.searchData;
    const { searchData, page, images } = this.state;

    if (prevPage !== page || prevSearchData !== searchData) {
      try {
        this.setState({ isLoading: true });
        const response = fetchImages(searchData, page);
        response.then(foundData => {
          foundData.data.hits.length === 0
            ? toast.error('Better luck next time!')
            : foundData.data.hits.forEach(
                ({ id, webformatURL, largeImageURL }) => {
                  !images.some(image => image.id === id) &&
                    this.setState(({ images }) => ({
                      images: [...images, { id, webformatURL, largeImageURL }],
                    }));
                }
              );
          this.setState({ isLoading: false });
        });
      } catch (error) {
        this.setState({ error, isLoading: false });
      } finally {
      }
    }
  }

  nextPage = () => {
    this.setState(({ page }) => ({ page: page + 1 }));
  };

  toggleModal = () => {
    this.setState(({ showModal }) => ({ showModal: !showModal }));
  };

  openModal = id => {
    this.setState(({ images }) => ({
      showModal: true,
      largeImage: images[id].largeImageURL,
    }));
  };

  render() {
    const { images, isLoading, largeImage, showModal } = this.state;
    const { nextPage, toggleModal, openModal, onSubmit } = this;

    return (
      <div className={s.main}>
        <Searchbar onSubmit={onSubmit} />
        {images.length !== 0 && (
          <ImageGallery images={images} openModal={openModal} />
        )}
        {showModal && (
          <Modal toggleModal={toggleModal} largeImage={largeImage} />
        )}
        {isLoading && <ImageLoader />}
        {images.length >= 12 && <Button nextPage={nextPage} />}
        <ToastContainer autoClose={1500} />
      </div>
    );
  }
}

export default App;
