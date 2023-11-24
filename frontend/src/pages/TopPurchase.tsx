import {useState, useEffect} from 'react'
import {fetchAllSortPurchased, notiSortPurchased} from '../ApiService/_requests'
import {Modal} from 'react-bootstrap'
import SendMessage from '../Modals/sendMessage'
import {toast} from 'react-toastify'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {useAuth} from '../app/modules/auth'
import Loader from '../Images/loader.gif'

const TopPurchase = () => {
  const [purchase, setPurchase] = useState()
  const [show, setShow] = useState(false)
  const [userId, setUserId] = useState('')
  const [loader, setLoader] = useState(true)
  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'desc'})
  const {currentUser} = useAuth()

  const columns = [
    {
      value: 'user.fullName',
      label: 'User Name',

      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.user?.fullName}</div>
        },
      },
    },

    {
      value: 'identity',
      label: 'Email',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.user?.identity}</div>
        },
      },
    },
    {
      value: 'diamond',
      label: 'Total Diamond',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.diamond_}</div>
        },
      },
    },
    {
      value: 'count',
      label: 'Purchase count',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.count}</div>
        },
      },
    },

    {
      value: 'action',
      label: 'Action',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return (
            !currentUser?.is_tester && (
              <button
                type='button'
                className='btn btn-dark noty'
                onClick={() => {
                  setShow(true)
                  setUserId(data[i]?.user?._id)
                }}
              >
                Send &nbsp; <i className='fas fa-bell' />
              </button>
            )
          )
        },
      },
    },
  ]

  useEffect(() => {
    getAllSpendHistory(option)
  }, [])

  const getAllSpendHistory = async (option?: any) => {
    const {data} = await fetchAllSortPurchased({options: option})
    setPurchase(data.data)
    set_option({...option, totalRecord: data.totalRecord})
    setLoader(false)
  }

  const submitFormData = async (formData: any) => {
    const {data} = await notiSortPurchased({...formData, _id: userId})
    setShow(false)
    if (data.status === 200) {
      toast.success(data.message)
    }
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getAllSpendHistory(option)
  }

  const appModalClose = () => setShow(false)

  const handleDrop = () => {}

  return (
    <div className='container-fluid'>
      <div className='col-12'>
        <div className='white-box-table  card-shadow'>
          <div className='row'>
            <div className='col-12 d-flex align-items-center my-4'>
              <div className=' '>
                <h1>Most Purchases User</h1>
              </div>
            </div>
          </div>
          {loader ? (
            <div className='loader-info-main'>
              <img src={Loader} alt='loader' />
            </div>
          ) : (
            <RtdDatatableNew data={purchase} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
          )}
        </div>
      </div>

      <Modal show={show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
        <SendMessage submitFormData={submitFormData} appModalClose={appModalClose} />
      </Modal>
    </div>
  )
}

export default TopPurchase
