import { get, post, axiosDelete, put, get_id } from '@/utils/request.js'

/*
 ****Interface for obtaining data
 */

//get data
export const getModelData = (p) => post('/model/portal/list', p)

//get nodeData
export const getCalData = (p) => post('/node/list', p)

//delete add edit
export const dataOperate = (p) => post('/node/label/update', p)

//get nodelist
export const getNodeList = (p) => get_id('/model/nodes/available/' + p)

//get deploylist
export const getDeployList = (p) => post('/model/deploy/list', p)

//post migrate
export const migrate = (p) => post('/model/migrate', p)

//upload file
export const uploadFile = (p) => post('/model/pkg/upload', p, true)

//tolerantConfig
export const postTolerantConfig = (p) => post('/model/ha/config', p, true)

//getConfigList
export const getConfigList = (p) => post('/model/ha/model/list', p)

//tolerantRecord
export const getTolerantRecord = (p) => post('/model/ha/record/list', p)

//get nodesConfig
export const getNodesConfig = (p) => get_id('/model/nodes/available/' + p)

//deploy
export const modeDeploy = (p) => post('/model/deploy', p)

//refresh
export const modeRefresh = (p) => get('/node/refresh', p)

//deployInfo
export const deployInfo = (p) => get_id('/model/deploy/info/' + p)
