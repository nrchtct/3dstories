import CloseButton from './CloseButton'
import { useMediaQuery } from 'react-responsive'
import './ModalWindow.css'

const ModalWindow = ({ isModalImage, closeModal, isModalVisible }) => {
  const isBigScreen = useMediaQuery({ query: '(min-width: 640px)' })
  return (
    <div className={`ModalWindow ${isModalVisible ? 'open pointer-events-auto' : 'pointer-events-none'}`}>
      <CloseButton
        onClick={() => {
          closeModal()
        }}
        className="mb-2"
        size={32}
        style={{ position: 'absolute', right: isBigScreen ? '3rem' : '1rem', top: isBigScreen ? '2rem' : '1rem' }}
      />
      <div className="ModalWindow-content">
        <img src={`${isModalImage?.url}`} alt={`${isModalImage?.title}`} />
        {/* <figcaption className="mt-3">{isModalImage?.title}</figcaption> */}
        {isModalImage?.description ? (
          <figcaption className="w-11/12 md:w-2/4 text-sm">{isModalImage?.description}</figcaption>
        ) : null}
      </div>
    </div>
  )
}

export default ModalWindow
