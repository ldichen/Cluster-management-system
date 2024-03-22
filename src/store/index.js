import { createStore } from 'vuex'
import modelListInfo from './state/modelInfo.state.js'
import calListInfo from './state/calInfo.state.js'
import proMonitorInfo from './state/proMonitor.state.js'
import tolerantConfigInfo from './state/tolerantConfig.state.js'
import tolerantProxyInfo from './state/tolerantProxy.state.js'
import troubleshootInfo from './state/troubleshoot.state.js'

// Only read DB
export default createStore({
  modules: {
    modelListInfo,
    calListInfo,
    proMonitorInfo,
    tolerantConfigInfo,
    tolerantProxyInfo,
    troubleshootInfo
  }
})
