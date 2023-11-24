import {useEffect, useState} from 'react'
import {addAgent, deleteAgent, editAgent, fetchAllagents} from '../ApiService/_requests'
import {toast} from 'react-toastify'
import {Modal} from 'react-bootstrap'
import AddAgentModal from '../Modals/AddAgent'
import {Link} from 'react-router-dom'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {useAuth} from '../app/modules/auth'
import Loader from '../Images/loader.gif'
import {DeleteConfirmModal} from '../Modals/DeleteConfirmModal'
import {ImgUrl} from '../const'
import NoImg from '../Images/noimg.png'

const AgentList: React.FC = () => {
  const [agent, setAgent] = useState<any>([])
  const [modalStates, setModalStates] = useState({update: false, show: false, rowVal: '', deleteConfirm: false})
  const [loader, setLoader] = useState(true)
  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'desc'})
  const {currentUser} = useAuth()

  const columns = [
    {
      value: 'images',
      label: 'Profile Image',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <img src={`${ImgUrl + data[i]?.images}` || NoImg} className='profile-img' alt='' />
        },
      },
    },
    {
      value: 'name',
      label: 'Name',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.name}</div>
        },
      },
    },
    {
      value: 'email_id',
      label: 'Email',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.email_id}</div>
        },
      },
    },
    {
      value: 'password',
      label: 'Password',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.password}</div>
        },
      },
    },
    {
      value: 'phone_no',
      label: 'Phone No',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.phone_no}</div>
        },
      },
    },
    {
      value: 'contry.country_name',
      label: 'Country',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.contry?.country_name}</div>
        },
      },
    },
    {
      value: 'status',
      label: 'Status',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.status == 0 ? 'Offline' : 'Live'}</div>
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
              {!currentUser?.is_tester && (
                <>
                  <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, update: true, show: true, rowVal: data[i]})}>
                    Edit
                  </button>
                  <button className='btn-comn-danger me-2' onClick={() => setModalStates({...modalStates, rowVal: data[i]?._id, deleteConfirm: true})}>
                    Delete
                  </button>
                </>
              )}
              <Link to='/agentHost' state={{agentInfo: data[i]}} className='btn-comn-warning me-2'>
                Hosts
              </Link>
            </div>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getAgentData(option)
  }, [])

  const getAgentData = async (option?: any) => {
    const {data} = await fetchAllagents({options: option})
    set_option({...option, totalRecord: data.totalRecord})
    setAgent(data.agents)
    setModalStates({show: false, update: false, rowVal: '', deleteConfirm: false})
    setLoader(false)
  }

  const deleteAgentById = async () => {
    const {data} = await deleteAgent(modalStates.rowVal)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAgentData(option)
  }

  const submitFormData = async (formData: any) => {
    const {data} = await addAgent(formData)

    if (data.status === 200) {
      toast.success(data.message)
      getAgentData(option)
    }
  }

  const updateAgent = async (formData: any) => {
    const {data} = await editAgent(formData)

    if (data.status === 200) {
      toast.success(data.message)
      getAgentData(option)
    }
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getAgentData(option)
  }

  const handleDrop = (updatedData: any) => {
    setAgent(updatedData)
    // Call your API to update data here
  }

  const appModalClose = () => setModalStates({...modalStates, update: false, show: false, rowVal: ''})

  return (
    <>
      <div className='container-fluid'>
        <div className='col-12 '>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex align-items-center my-3'>
                <div className='comn-inr-title '>
                  <h1>Agent List</h1>
                </div>
                <div className='ms-auto mb-2 me-2 mt-5'>
                  {!currentUser?.is_tester && (
                    <button className='btn-comn-submit me-2' onClick={() => setModalStates({...modalStates, show: true})}>
                      Add Agent
                    </button>
                  )}
                </div>
              </div>
            </div>
            {loader ? (
              <div className='loader-info-main'>
                <img src={Loader} alt='loader' />
              </div>
            ) : (
              <RtdDatatableNew data={agent} columns={columns} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
            )}
          </div>
        </div>

        <Modal show={modalStates.show} onHide={() => appModalClose()} size='lg' className='cust-comn-modal' centered>
          <AddAgentModal update={modalStates.update} submitFormData={submitFormData} updateAgent={updateAgent} appModalClose={appModalClose} agentInfo={modalStates.rowVal} />
        </Modal>

        <Modal show={modalStates.deleteConfirm} onHide={() => setModalStates({...modalStates, deleteConfirm: false})} size='lg' className='cust-comn-modal' centered>
          <DeleteConfirmModal setDelete={setModalStates} setConfirmDel={deleteAgentById} />
        </Modal>
      </div>
    </>
  )
}
export default AgentList
