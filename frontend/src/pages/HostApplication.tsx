import {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {toast} from 'react-toastify'
import {RejectHost, fetchHostApplications, makeHost} from '../ApiService/_requests'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {useAuth} from '../app/modules/auth'
import Loader from '../Images/loader.gif'
import NoImg from '../Images/noimg.png'
import {ImgUrl} from '../const'

const HostApplication: React.FC = () => {
  const [hostApp, setHostApp] = useState<any>([])
  const [loader, setLoader] = useState(true)
  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'desc'})
  const {currentUser} = useAuth()

  const columns = [
    {
      value: 'profileimages',
      label: 'Profile Image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <img src={data[i]?.profileimages ? `${ImgUrl + data[i]?.profileimages}` : NoImg} className='profile-img' alt='' />
        },
      },
    },
    {
      value: 'identity',
      label: 'Identity',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.identity}</div>
        },
      },
    },
    {
      value: 'fullName',
      label: 'Full Name',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.fullName}</div>
        },
      },
    },
    {
      value: 'age',
      label: 'Age',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.age}</div>
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
            <div>
              <Link className='btn-comn-info me-2' to='/viewHost' state={{hostData: data[i], show: true}}>
                View
              </Link>
              {!currentUser?.is_tester && (
                <>
                  <button className='btn-comn-submit me-2' onClick={() => makeHostById(data[i]?._id)}>
                    Make Host
                  </button>
                  <button className='btn-comn-danger me-2' onClick={() => RejectHostApp(data[i]?._id)}>
                    Reject
                  </button>
                </>
              )}
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getAllHostApp(option)
  }, [])

  const getAllHostApp = async (option?: any) => {
    const {data} = await fetchHostApplications({options: option})
    setHostApp(data.hostApp)
    set_option({...option, totalRecord: data.totalRecord})
    setLoader(false)
  }

  const makeHostById = async (_id: string) => {
    const {data} = await makeHost(_id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAllHostApp(option)
  }

  const RejectHostApp = async (_id: string) => {
    const {data} = await RejectHost(_id)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAllHostApp(option)
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getAllHostApp(option)
  }

  const handleDrop = (updatedData: any) => {
    setHostApp(updatedData)
    // Call your API to update data here
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-12 d-flex'>
            <div className='mb-3'>
              <h1>Host Applications</h1>
            </div>
          </div>
        </div>
        <div className='col-12'>
          <div className='white-box-table  card-shadow'>
            {loader ? (
              <div className='loader-info-main'>
                <img src={Loader} alt='loader' />
              </div>
            ) : (
              <RtdDatatableNew data={hostApp} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default HostApplication
