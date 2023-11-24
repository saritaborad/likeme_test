/* eslint-disable jsx-a11y/anchor-is-valid */
import {useEffect, useState} from 'react'
import * as Yup from 'yup'
import {getUserByToken, login} from '../../../../ApiService/_requests'
import {useAuth} from '../core/Auth'
import Cookies from 'js-cookie'
import {toast} from 'react-toastify'
import {Formik} from 'formik'
import {errorContainer, formAttr} from '../../../../commonFun'

export function Login() {
  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser} = useAuth()
  const [rememberme, setRememberme] = useState<any>({})

  useEffect(() => {
    const cookieValue = Cookies.get('rememberme')
    setRememberme({user_type: cookieValue?.split('|')[0], username: cookieValue?.split('|')[1], password: cookieValue?.split('|')[2], is_remember: cookieValue?.split('|')[3]})
  }, [])

  const submitFormData = async (formData: any, resetForm: any) => {
    setLoading(true)
    const {data} = await login(formData)
    if (data.status == 200) {
      saveAuth(data?.data?.authtoken)
      setLoading(false)
      resetForm(formData)
      const {data: user} = await getUserByToken(data.data.authtoken)
      Cookies.set('authtoken', data?.data?.authtoken)
      setCurrentUser(user)
    } else {
      toast.error(data.message)
      saveAuth(undefined)
      setLoading(false)
    }
  }

  return (
    <>
      <div className='card'>
        <div className='card-header mt-4'>
          <h1 className='d-flex align-items-center'>Login</h1>
        </div>
        <div className='card-body'>
          <Formik
            enableReinitialize
            initialValues={{
              username: rememberme?.username,
              password: rememberme?.password,
              user_type: rememberme?.user_type || 'admin',
              is_remember: rememberme?.is_remember == 'true' ? true : false,
            }}
            validationSchema={Yup.object({
              username: Yup.string().required('Username is required'),
              password: Yup.string().required('Password is required'),
            })}
            onSubmit={(formData, {resetForm}) => {
              submitFormData(formData, resetForm)
            }}
          >
            {(runform) => (
              <form onSubmit={runform.handleSubmit} className='needs-validation'>
                <div className='form-group'>
                  <label className='mb-2' htmlFor='user_type'>
                    User Type
                  </label>

                  <select className='form-select input-style' name='user_type' {...formAttr(runform, 'user_type')}>
                    <option value='admin'>admin</option>
                    <option value='agent'>agent</option>
                  </select>
                </div>
                <div className='form-group mt-4'>
                  <label htmlFor='username' className='mb-2'>
                    Admin Username / Agent Email
                  </label>
                  <input id='username' type='text' className='form-control' placeholder='Enter Your Username' required autoFocus {...formAttr(runform, 'username')} />
                  {errorContainer(runform, 'username')}
                </div>
                <div className='form-group mt-4'>
                  <div className='d-block'>
                    <label htmlFor='password' className='control-label mb-2'>
                      Password
                    </label>
                  </div>
                  <input id='password' type='password' className='form-control' placeholder='Enter Your Password' required {...formAttr(runform, 'password')} />
                  {errorContainer(runform, 'password')}
                </div>
                <div className='col-6 my-4'>
                  <div className='custom-checkbox'>
                    <label className='custom-lbl-part d-flex'>
                      <input
                        type='checkbox'
                        id='is_remember'
                        className='me-2'
                        checked={runform.values?.is_remember == true ? true : false}
                        {...formAttr(runform, 'is_remember')}
                        onChangeCapture={(e: any) => {
                          runform?.setFieldValue('is_remember', e.target.checked)
                        }}
                      />
                      <span className='custom-checkbox-class'></span>
                      Remember Me
                    </label>
                  </div>
                </div>
                <div className='d-grid mt-4'>
                  <button type='submit' id='kt_sign_in_submit' className='btn btn-primary'>
                    {!loading && <span className='indicator-label'>Login</span>}
                    {loading && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  )
}
