import axios from 'axios'
import {API_PATH} from '../const'
import Cookies from 'js-cookie'

let tokenData
const token = Cookies.get('authtoken')
localStorage.getItem('authtoken') ? (tokenData = 'Bearer ' + localStorage.getItem('authtoken')) : (tokenData = '')

let config = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/pdf',
    Authorization: tokenData ? tokenData : '',
    Cookie: `authtoken=${token || ''}`,
  },
  withCredentials: true,
}

// console.log(config)

// --------------------- Auth Api Routes ----------------------

export function login(formData: any) {
  return axios
    .post(API_PATH.login, formData, {withCredentials: true})
    .then((res) => res)
    .catch((err) => err.response)
}

export function register(email: string, firstname: string, lastname: string, password: string) {
  return axios.post(API_PATH.register, {email, firstname: firstname, lastname: lastname, password})
}
export function requestPassword(email: string) {
  return axios.post(API_PATH.register, {email})
}

export function getUserByToken(token: string) {
  return axios.post(API_PATH.getUserByToken, {authtoken: token}).then((res) => res.data)
}

// --------------------- Image Review Api Routes ----------------------

export function fetchAllImageReview() {
  return axios.post(API_PATH.fetchAllImageReview, {}, config).then((res) => res.data)
}

export function acceptImageReview(_id: string) {
  return axios.post(API_PATH.acceptImageReview, {_id}, config).then((res) => res)
}

export function rejectImageReview(_id: string) {
  return axios.post(API_PATH.rejectImageReview, {_id}, config).then((res) => res)
}

// --------------------- Video Review Api Routes ----------------------

export function fetchAllVideoReview() {
  return axios.post(API_PATH.fetchAllVideoReview, {}, config).then((res) => res.data)
}

export function acceptVideoReview(_id: string) {
  return axios.post(API_PATH.acceptVideoReview, {_id}, config).then((res) => res)
}

export function rejectVideoReview(_id: string) {
  return axios.post(API_PATH.rejectVideoReview, {_id}, config).then((res) => res)
}

// --------------------- User Api Routes ----------------------

export function getAllUser(option?: any) {
  return axios.post(API_PATH.fetchAllUser, option, config).then((res) => res.data)
}

export function userblock(_id: string, is_block: number) {
  return axios.post(API_PATH.userblock, {_id, is_block}, config).then((res) => res)
}

export function AddUserCoin(formData: any) {
  return axios.post(API_PATH.AddCoin, formData, config).then((res) => res)
}

// --------------------- Host Api Routes ----------------------

export function fetchHosts(option?: any) {
  return axios.post(API_PATH.fetchHosts, option, config).then((res) => res.data)
}

export function featureUpdate(_id: string, is_feature: number) {
  return axios.post(API_PATH.featureUpdate, {_id, is_feature}, config).then((res) => res)
}

export function fetchHostVideos(option?: any) {
  return axios.post(API_PATH.fetchHostVideos, option, config).then((res) => res.data)
}

export function fetchHostImages(option?: any) {
  return axios.post(API_PATH.fetchHostImages, option, config).then((res) => res.data)
}

export function deleteImageById(_id: string) {
  return axios.post(API_PATH.deleteImageById, {_id}, config).then((res) => res)
}

export function deleteVideoById(_id: string) {
  return axios.post(API_PATH.deleteVideoById, {_id}, config).then((res) => res)
}

export function deleteHostById(_id: string) {
  return axios.post(API_PATH.deleteHostById, {_id}, config).then((res) => res)
}

export function hostById(_id: string) {
  return axios.post(API_PATH.hostById, {_id}, config).then((res) => res.data)
}

export function hostUpdate(data: any) {
  return axios.post(API_PATH.hostUpdate, data, config).then((res) => res)
}

export function addHostImages(formData: any) {
  return axios.post(API_PATH.addHostImages, formData, config).then((res) => res)
}

export function addHostVideo(formData: any) {
  return axios.post(API_PATH.addHostVideos, formData, config).then((res) => res)
}

export function addfakeUser(formData: any) {
  return axios.post(API_PATH.addfakeUser, formData, config).then((res) => res)
}

export function blockUnblockHost(user_id: string, is_block: number) {
  return axios.post(API_PATH.blockUnblockHost, {user_id, is_block}, config).then((res) => res)
}

// export function unblockHost(user_id: string, host_id: string) {
//   return axios.post(API_PATH.unblockHost, {user_id, host_id}).then((res) => res)
// }

export function makeHost(_id: string) {
  return axios.post(API_PATH.makeHost, {_id}, config).then((res) => res)
}

// --------------------- Host Application Api Routes ----------------------

export function fetchHostApplications(option?: any) {
  return axios.post(API_PATH.fetchHostApplications, option, config).then((res) => res.data)
}

export function RejectHost(_id: string) {
  return axios.post(API_PATH.RejectHost, {_id}, config).then((res) => res)
}

// --------------------- Agent Api Routes ----------------------

export function fetchAllagents(option?: any) {
  return axios.post(API_PATH.fetchAllagent, option, config).then((res) => res.data)
}

export function fetchAgents(option?: any) {
  return axios.post(API_PATH.fetchAgents, option, config).then((res) => res.data)
}

export function getAgent(_id?: any) {
  return axios.post(API_PATH.fetchAgentById, {_id}, config).then((res) => res.data)
}

export function editAgent(formData: any) {
  return axios.post(API_PATH.editAgent, formData, config).then((res) => res)
}

export function deleteAgent(_id: string) {
  return axios.post(API_PATH.deleteAgent, {_id}, config).then((res) => res)
}

export function addAgent(formData: any) {
  return axios.post(API_PATH.addAgent, formData, config).then((res) => res)
}

export function fetchAllHostHistory(option?: any) {
  return axios.post(API_PATH.fetchAllHostHistory, option, config).then((res) => res.data)
}

export function getAgentHosts(option?: any) {
  return axios.post(API_PATH.getAgentHosts, option, config).then((res) => res.data)
}

export function getHostAgents(option?: any) {
  return axios.post(API_PATH.getHostAgents, option, config).then((res) => res.data)
}

export function fetchAllStreamHistory(option?: any) {
  return axios.post(API_PATH.fetchAllStreamHistory, option, config).then((res) => res.data)
}

export function fetchStreamHistoryDayWise(formData?: any) {
  return axios.post(API_PATH.fetchStreamHistoryDayWise, formData, config).then((res) => res.data)
}

export function fetchHostSummary(formData?: any) {
  return axios.post(API_PATH.fetchHostSummary, formData, config).then((res) => res.data)
}

// --------------------- Image upload Api Routes ----------------------

export function uploadImg(formData: any) {
  return axios.post(API_PATH.uploadImg, formData, config).then((res) => res.data)
}

// --------------------- Gift Api Routes ----------------------

export function fetchAllgifts(option?: any) {
  return axios.post(API_PATH.fetchAllgifts, {...option}, config).then((res) => res.data)
}

export function addGifts(formData: any) {
  return axios.post(API_PATH.addGifts, formData, config).then((res) => res)
}

export function editGift(formData: any) {
  return axios.post(API_PATH.editGift, formData, config).then((res) => res)
}

export function deleteGift(_id: string) {
  return axios.post(API_PATH.deleteGift, {_id}, config).then((res) => res)
}

// --------------------- Country Api Routes ----------------------

export function fetchAllCountry(option?: any) {
  return axios.post(API_PATH.fetchAllCountry, {...option}, config).then((res) => res.data)
}

export function addCountryData(data: any) {
  return axios.post(API_PATH.addCountry, data, config).then((res) => res)
}

export function editCountryData(data: any) {
  return axios.post(API_PATH.updateCountry, data, config).then((res) => res)
}

export function deleteCountryData(_id: string) {
  return axios.post(API_PATH.deleteCountry, {_id}, config).then((res) => res)
}

// --------------------- Country Api Routes ----------------------

export function fetchNotificationData(option?: any) {
  return axios.post(API_PATH.fetchAllNotification, option, config).then((res) => res.data)
}

export function updateNotification(formData: any) {
  return axios.post(API_PATH.updateNotification, formData, config).then((res) => res)
}

export function deleteNotificationyById(_id: string) {
  return axios.post(API_PATH.deleteNotificationyById, {_id}, config).then((res) => res)
}

export function sendNotification(formData?: any) {
  return axios.post(API_PATH.sendNotification, formData, config).then((res) => res)
}

// --------------------- Report Api Routes ----------------------

export function fetchReports(option?: any) {
  return axios.post(API_PATH.fetchReports, option, config).then((res) => res.data)
}

export function deleteReport(_id: string) {
  return axios.post(API_PATH.deleteReport, {_id}, config).then((res) => res)
}

export function hostblock(_id: string) {
  return axios.post(API_PATH.hostblock, {_id}, config).then((res) => res)
}

// --------------------- Payment Gateway Api Routes ----------------------

export function fetchAllPayment(option?: any) {
  return axios.post(API_PATH.fetchAllPayment, option, config).then((res) => res.data)
}

export function addPayment(formData: any) {
  return axios.post(API_PATH.addPayment, formData, config).then((res) => res)
}

export function updatePayment(formData: any) {
  return axios.post(API_PATH.updatePayment, formData, config).then((res) => res)
}

export function deletePaymentById(_id: string) {
  return axios.post(API_PATH.deletePaymentById, {_id}, config).then((res) => res)
}

// --------------------- Coin plan Api Routes ----------------------

export function fetchAllCoinPlans(option?: any) {
  return axios.post(API_PATH.fetchAllCoinPlans, option, config).then((res) => res.data)
}

export function deleteSubcriptionById(_id: string) {
  return axios.post(API_PATH.deleteSubcriptionById, {_id}, config).then((res) => res)
}

export function addSubcription(formData: any) {
  return axios.post(API_PATH.addSubcription, formData, config).then((res) => res)
}

export function updateSubcription(formData: any) {
  return axios.post(API_PATH.updateSubcription, formData, config).then((res) => res)
}

export function default_flag(_id: string) {
  return axios.post(API_PATH.default_flag, {_id}, config).then((res) => res)
}

// --------------------- User Purchase Api Routes ----------------------

export function fetchAllPurchaseHistory(option?: any) {
  return axios.post(API_PATH.fetchAllPurchaseHistory, option, config).then((res) => res.data)
}

export function fetchAllSpendHistory(option?: any) {
  return axios.post(API_PATH.fetchAllSpendHistory, option, config).then((res) => res.data)
}

export function getPackageName() {
  return axios.post(API_PATH.getPackageName, {}, config).then((res) => res.data)
}

export function fetchAllSortPurchased(option?: any) {
  return axios.post(API_PATH.fetchAllSortPurchased, option, config).then((res) => res.data)
}

export function notiSortPurchased(formData?: any) {
  return axios.post(API_PATH.notiSortPurchased, formData, config).then((res) => res.data)
}

// ------------------- notification credential -------------------------

export function getNotiCredent(option?: any) {
  return axios.post(API_PATH.getNotificationCredential, option, config).then((res) => res.data)
}

export function updateNotiCredent(formData: any) {
  return axios.post(API_PATH.updateNotificationCredential, formData, config).then((res) => res)
}

export function deleteNotiCredent(_id: string) {
  return axios.post(API_PATH.deleteNotificationCredential, {_id}, config).then((res) => res)
}

export function addNotiCredent(formData: any) {
  return axios.post(API_PATH.addNotificationCredential, formData, config).then((res) => res)
}

// ------------------------ notification content ----------------------------

export function addNotiContent(formData: any) {
  return axios.post(API_PATH.addNotificationAdmin, formData, config).then((res) => res)
}

export function updateNotiContent(formData: any) {
  return axios.post(API_PATH.updateNotificationAdmin, formData, config).then((res) => res)
}

export function deleteNotiContent(_id: string) {
  return axios.post(API_PATH.deleteNotificationAdmin, {_id}, config).then((res) => res)
}

export function getNotiContent(formData: any) {
  return axios.post(API_PATH.fetchNotificationAdmin, formData, config).then((res) => res.data)
}

// ----------------------- Message Api Route ---------------------------------

export function fetchAllMessages(formData: any) {
  return axios.post(API_PATH.fetchAllMessages, formData, config).then((res) => res.data)
}

export function addMessage(formData: any) {
  return axios.post(API_PATH.addMessage, formData, config).then((res) => res)
}

export function deleteMessageById(_id: string) {
  return axios.post(API_PATH.deleteMessageById, {_id}, config).then((res) => res)
}

// ------------------------- Report Reason ---------------------------------

export function fetchAllReportReson(formData: any) {
  return axios.post(API_PATH.fetchAllReportReson, formData, config).then((res) => res.data)
}

export function addReportReson(formData: any) {
  return axios.post(API_PATH.addReportReson, formData, config).then((res) => res)
}

export function updateReportReson(formData: any) {
  return axios.post(API_PATH.updateReportReson, formData, config).then((res) => res)
}

export function deleteReportReson(_id: any) {
  return axios.post(API_PATH.deleteReportReson, {_id}, config).then((res) => res)
}

// -------------------------- Setting --------------------------------------

export function getSettingData() {
  return axios.post(API_PATH.getSettingData, {}, config).then((res) => res.data)
}

export function updateSettingApp(formData: any) {
  return axios.post(API_PATH.updateSettingApp, formData, config).then((res) => res)
}

export function updateAdmob(formData: any) {
  return axios.post(API_PATH.updateAdmob, formData, config).then((res) => res)
}

export function getAdmob(formData: any) {
  return axios.post(API_PATH.getAdmob, formData, config).then((res) => res.data)
}

// ---------------------- Redeem Request -------------------------------

export function fetchAllRedeems(formData: any) {
  return axios.post(API_PATH.fetchAllRedeems, formData, config).then((res) => res.data)
}

export function completeRedeem(formData: any) {
  return axios.post(API_PATH.completeRedeem, formData, config).then((res) => res)
}

export function rejectRedeem(_id: string) {
  return axios.post(API_PATH.rejectRedeem, {_id}, config).then((res) => res)
}

// ------------------------ Privacy Policy ------------------------------

export function addPageData(formData: any) {
  return axios.post(API_PATH.addPageData, formData, config).then((res) => res)
}

export function getPageData(formData: any) {
  return axios.post(API_PATH.getPageData, formData, config).then((res) => res.data)
}

// ------------------------ Dashboard -----------------------------------

export function fetchDashboardCount() {
  return axios.post(API_PATH.fetchDashboardCount, {}, config).then((res) => res.data)
}

export function fetchAgentDashboard(_id: string) {
  return axios.post(API_PATH.fetchAgentDashboard, {_id}, config).then((res) => res.data)
}
