import React, {useState} from 'react'
import Loader from '../Images/loader.gif'
import {Modal} from 'react-bootstrap'

interface IPROPS {
  appModalClose?: any
  submitImageData?: any
  loader?: any
}

const AddImage: React.FC<IPROPS> = ({appModalClose, submitImageData, loader}) => {
  const [images, setImages] = useState<FileList | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setImages(files)
  }

  return (
    <>
      <Modal.Header closeButton className='border-0 pb-0' onClick={() => appModalClose()}></Modal.Header>
      <Modal.Body className='pt-0 mb-3'>
        <div className='modal-header'>
          <h2>Add Images</h2>
        </div>
        <div className='modal-body'>
          {loader ? (
            <div className='loader-video-main'>
              <img src={Loader} alt='loader' />
            </div>
          ) : (
            <form onSubmit={(e) => submitImageData(e, images)}>
              <div id='divThumb' className='form-group'>
                <div className='mb-3'>
                  <label htmlFor='image' className='form-label'>
                    Select Images
                  </label>
                  <input className='form-control' type='file' id='hostImages' name='images' accept='image/x-png,image/gif,image/jpeg' multiple onChange={handleFileChange} required />
                </div>
              </div>
              <div className='form-group mt-5'>
                <input className='btn-comn-submit mr-1' type='submit' />
              </div>
            </form>
          )}
        </div>
      </Modal.Body>
    </>
  )
}

export default AddImage
