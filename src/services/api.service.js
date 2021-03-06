import baseService from "./base.service";

const API_CONS_URL = "api/consultas/";
const API_CHAT_URL = "api/comments/";
const API_UIMG_URL = "api/ImageTemp/";
const API_IMEM_URL = "api/internalMembers/";
const API_EMEM_URL = "api/ExternalConnections/";
const API_AEXM_URL = "api/ExternalMembers/";
const API_EXCM_URL = "api/ExternalComments/";
const API_FOLD_URL = "api/UserFolders/";
const API_STAT_URL = "api/UserStatusInConsulta/"

baseService.interceptors.request.use(
  config => {
    const token = JSON.parse(localStorage.getItem('iconicoUser'))

    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token.access_token
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  error => Promise.reject(error)
)

const getAllConsultations = () => baseService.get(API_CONS_URL);

const getConsultationById = consultationId => baseService.get(`${API_CONS_URL}${consultationId}`);

const getConsultationConv = consultationId => baseService.get(`${API_CHAT_URL}GetConversation/${consultationId}`);

const addMessage = msg => baseService.post(API_CHAT_URL, msg);

const uploadImage = file => {
  const data = new FormData();
  data.append("image", file);
  return baseService.post(API_UIMG_URL, data);
};

const addNewConsultation = consultation => baseService.post(API_CONS_URL, consultation);

const endConsultation = consultation => baseService.put(`${API_CONS_URL}${consultation._id}`, {...consultation, IsManuallyFinished:true});

const getAllInternalMembers = () => baseService.get(API_IMEM_URL);

const getExternalMembers = consultationId =>
  baseService.get(
    `${API_CONS_URL}${consultationId}/ExternalConnections/`
  );
const getAllExternalConnections = () => baseService.get(`${API_EMEM_URL}GetExternalConnections/`);

const getAllExternalMembers = () => baseService.get(API_AEXM_URL);

const addExternalToConsultation = ext => baseService.post(API_EMEM_URL, ext);

const getExternalConversation = (consultationId, authorId, receptorId) => {
  return baseService.get(`${API_EXCM_URL}GetConversation/${consultationId}/${authorId}/${receptorId}`);
}

const addExternalMessage = msg => baseService.post(API_EXCM_URL, msg);

const getAllFolders = () => baseService.get(API_FOLD_URL);
const getConsultationsInFolder = (folderId) => baseService.get(`${API_FOLD_URL}${folderId}/Consultas`);
const addNewFolder = folder => baseService.post(API_FOLD_URL, folder);
const togglePinFolder = folder => baseService.put(`${API_FOLD_URL}${folder.id}`, {...folder, isPinned:!folder.isPinned});
const addConsultationToFolder = (consultationId, folderId) => baseService.put(`${API_STAT_URL}${consultationId}/${folderId ? folderId : ""}`);

export const apiService = {
  getAllConsultations,
  getConsultationById,
  endConsultation,
  addNewConsultation,
  getConsultationConv,
  addMessage,
  uploadImage,
  getAllInternalMembers,
  getExternalMembers,
  getAllExternalConnections,
  addExternalToConsultation,
  getExternalConversation,
  addExternalMessage,
  getAllExternalMembers,
  getAllFolders,
  getConsultationsInFolder,
  addNewFolder,
  togglePinFolder,
  addConsultationToFolder,
}
