import {uploadImg} from './ApiService/_requests'

export const errorContainer = (form, field) => {
  return form.touched[field] && form.errors[field] ? <span className='error text-danger'>{form.errors[field]}</span> : null
}

export const formAttr = (form, field) => ({onBlur: form.handleBlur, onChange: form.handleChange, value: form.values[field]})

export const handleImageUpload = async (file, setImgUrl) => {
  const formData = new FormData()
  formData.append('image', file)
  const {data} = await uploadImg(formData)
  setImgUrl(data)
}
