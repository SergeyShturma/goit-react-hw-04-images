import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import s from './App.module.css';
import Searchbar from './Searchbar/Searchbar';
import fetchImages from 'components/api';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import ImageLoader from './Loader/Loader';
import Modal from 'components/Modal/Modal';
import Notification from 'components/Notification/Notification';

export default function App() {
  const [searchData, setSearchData] = useState('');
  const [page, setPage] = useState(0);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [largeImage, setLargeImage] = useState('');

  const onSubmit = newData => {
    if (searchData === newData.trim()) {
      return toastInfoDuplication();
    }
    setSearchData(newData);
    setPage(1);
    setImages([]);
  };

  const toastInfoDuplication = () => {
    return toast.info('You are already here!');
  };

  useEffect(() => {
    if (!page) {
      return;
    }

    try {
      setIsLoading(true);
      const response = fetchImages(searchData, page);
      response.then(foundData => {
        foundData.data.hits.length === 0
          ? toast.error('Better luck next time!')
          : foundData.data.hits.forEach(
              ({ id, webformatURL, largeImageURL }) => {
                !images.some(image => image.id === id) &&
                  setImages(images => [
                    ...images,
                    { id, webformatURL, largeImageURL },
                  ]);
              }
            );
        setIsLoading(false);
      });
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchData, page]);

  const nextPage = () => {
    setPage(page => page + 1);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const openModal = id => {
    setShowModal(true);
    setLargeImage(images[id].largeImageURL);
  };

  return (
    <div className={s.main}>
      <Searchbar onSubmit={onSubmit} />
      {images.length === 0 && <Notification />}
      {images.length !== 0 && (
        <ImageGallery images={images} openModal={openModal} />
      )}
      {showModal && <Modal toggleModal={toggleModal} largeImage={largeImage} />}
      {isLoading && <ImageLoader />}
      {images.length >= 12 && <Button nextPage={nextPage} />}
      <ToastContainer autoClose={2000} />
    </div>
  );
}
