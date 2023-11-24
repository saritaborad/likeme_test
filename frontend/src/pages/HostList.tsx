import {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {toast} from 'react-toastify'
import {blockUnblockHost, deleteHostById, featureUpdate, fetchHosts} from '../ApiService/_requests'
import {useAllAgent} from '../hooks/customHook'
import RtdDatatableNew from '../Common/DataTable/DataTableNew'
import {useAuth} from '../app/modules/auth'
import Loader from '../Images/loader.gif'
import NoImg from '../Images/noimg.png'
import {Modal} from 'react-bootstrap'
import {DeleteConfirmModal} from '../Modals/DeleteConfirmModal'
import {ImgUrl} from '../const'

const HostList: React.FC = () => {
  const {state}: any = useLocation()
  const [hosts, setHosts] = useState([])
  const [modalStates, setModalStates] = useState({rowVal: '', deleteConfirm: false})
  const [loader, setLoader] = useState(true)
  const [selectedItem, setSelectedItem] = useState<any>({is_fake: 0, is_block: state?.is_block})
  const [option, set_option] = useState({sizePerPage: 10, search: {}, totalRecord: 0, page: 1, sort: '_id', order: 'desc'})
  const agents = useAllAgent()
  const {currentUser} = useAuth()

  const column1 = [
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
      value: 'fullName',
      label: 'Name',
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
      value: 'version',
      label: 'Version',
      options: {
        filter: false,
        sort: false,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.version}</div>
        },
      },
    },
    {
      value: 'is_block',
      label: 'Status',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return (
            <button className={`${data[i]?.is_block == 1 ? 'badge badge-danger' : 'badge badge-success'}`} onClick={() => handleBlockUnblock(data[i]?._id, data[i]?.is_block)}>
              {data[i]?.is_block == 1 ? 'Blocked' : 'Allowed'}
            </button>
          )
        },
      },
    },
    {
      value: 'total_diamond',
      label: 'Total Collection',
      options: {
        filter: false,
        sort: true,
        search: true,
        customBodyRender: (data: any, i: number) => {
          return <div className=''>{data[i]?.total_diamond}</div>
        },
      },
    },
    {
      value: 'is_feature',
      label: 'Featured',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return (
            <button className={`${data[i]?.is_feature == 1 ? 'btn-comn-success' : 'btn-comn-black'}`} onClick={() => changeSelect(data[i]?._id, data[i]?.is_feature)}>
              {data[i]?.is_feature == 1 ? 'Selected' : 'Select'}
            </button>
          )
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
            <Link className='btn-comn-info' to='/viewHost' state={{hostData: data[i]}}>
              View
            </Link>
          )
        },
      },
    },
  ]

  const column2 = [
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
      value: 'fullName',
      label: 'Name',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.fullName}</div>
        },
      },
    },
    {
      value: 'identity',
      label: 'Identity',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (data: any, i: number) => {
          return <div>{data[i]?.identity}</div>
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
            <>
              <Link className='btn-comn-info me-2' to='/viewHost' state={{hostData: data[i], show: false}}>
                View
              </Link>
              {!currentUser?.is_tester && (
                <button className='btn-comn-danger me-2' onClick={() => setModalStates({rowVal: data[i]?._id, deleteConfirm: true})}>
                  Delete
                </button>
              )}
            </>
          )
        },
      },
    },
  ]

  useEffect(() => {
    getAllHost(option, {filter: selectedItem})
  }, [])

  const getAllHost = async (option?: any, filter?: any) => {
    const {data} = await fetchHosts({options: option, ...filter})
    setHosts(data.hosts)
    set_option({...option, totalRecord: data.totalRecord})
    setModalStates({rowVal: '', deleteConfirm: false})
    setLoader(false)
  }

  const deleteHost = async () => {
    const {data} = await deleteHostById(modalStates.rowVal)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAllHost(option, selectedItem)
  }

  const changeSelect = async (id: string, isSelect: number) => {
    const {data} = await featureUpdate(id, isSelect == 1 ? 0 : 1)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAllHost(option)
  }

  const handleBlockUnblock = async (id: string, is_block: number) => {
    const {data} = await blockUnblockHost(id, is_block == 1 ? 0 : 1)
    data.status == 200 ? toast.success(data.message) : toast.error(data.message)
    getAllHost(option, selectedItem)
  }

  const handleFilter = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filterMapping: any = {agent_id: 'All Agent', is_block: 'All Visibility'}
    const selectedFilter = filterMapping[e.target.name]
    let newSelectedItem = {...selectedItem}

    if (selectedFilter === e.target.value) {
      delete newSelectedItem[e.target.name]
    } else {
      newSelectedItem[e.target.name] = e.target.value
    }

    setSelectedItem(newSelectedItem)
    getAllHost(option, {filter: newSelectedItem})
  }

  const tableCallBack = (option: any) => {
    set_option(option)
    getAllHost(option, selectedItem)
  }

  const handleDrop = (updatedData: any) => {
    setHosts(updatedData)
    // Call your API to update data here
  }

  return (
    <>
      <div className='container-fluid'>
        <div className='row'></div>

        <div className='col-12  mt-5'>
          <div className='white-box-table  card-shadow'>
            <div className='row'>
              <div className='col-12 d-flex mt-5'>
                <div className='ms-3'>
                  <h1>Hosts</h1>
                </div>
                {!currentUser?.is_tester && (
                  <div className='ms-auto me-4'>
                    <Link className='btn-comn-submit' to='/addFakeUser'>
                      Add Fake Host
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className='row d-flex'>
              <div className='col-7 d-flex'>
                {/* <button className={`${tab === 'Fake Hosts' ? 'btn-comn-submit active' : 'btn-transparent'} `} onClick={() => setTab('Fake Hosts')}>
                  Fake Hosts
                </button>

                <button className={`${tab === 'Real Hosts' ? 'btn-comn-submit active' : 'btn-transparent'} `} onClick={() => setTab('Real Hosts')}>
                  Real Hosts
                </button> */}

                <div className='col-2 p-2'>
                  <select className='form-control' name='is_fake' onChange={handleFilter}>
                    <option value='0'>Real Hosts</option>
                    <option value='1'>Fake Hosts</option>
                  </select>
                </div>
                <div className='col-3 p-2'>
                  <select className='form-control' name='agent_id' onChange={handleFilter}>
                    <option>All Agent</option>
                    {agents?.length > 0 &&
                      agents.map((item: any, i) => (
                        <option value={item._id} key={i}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className='col-3 p-2'>
                  <select className='form-control' name='is_block' onChange={handleFilter}>
                    <option>All Visibility</option>
                    <option value='0'>Allowed</option>
                    <option value='1' selected={state?.is_block ? true : false}>
                      Blocked
                    </option>
                  </select>
                </div>
              </div>
            </div>
            {loader ? (
              <div className='loader-info-main'>
                <img src={Loader} alt='loader' />
              </div>
            ) : (
              <RtdDatatableNew data={hosts} columns={selectedItem?.is_fake == '0' ? column1 : column2} option={option} tableCallBack={tableCallBack} onDrop={handleDrop} />
            )}
          </div>
        </div>

        <Modal show={modalStates.deleteConfirm} onHide={() => setModalStates({...modalStates, deleteConfirm: false})} size='lg' className='cust-comn-modal' centered>
          <DeleteConfirmModal setDelete={setModalStates} setConfirmDel={deleteHost} />
        </Modal>
      </div>
    </>
  )
}

export default HostList
