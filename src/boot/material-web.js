// boot/material-web.js
import { boot } from 'quasar/wrappers'

const MaterialWebComponents = {
  'md-button': () => import('@material/web/button/filled-button.js'),
  'md-textfield': () => import('@material/web/textfield/filled-text-field.js'),

  'md-list': () => import('@material/web/list/list.js'),
  'md-list-item': () => import('@material/web/list/list-item.js'),
  'md-dialog': () => import('@material/web/dialog/dialog.js'),
  'md-icon': () => import('@material/web/icon/icon.js'), // You might need this later
  // ... add more components as needed
}

export default boot(({ app }) => {
  app.config.globalProperties.$materialWeb = MaterialWebComponents

  // Preload frequently used components
  MaterialWebComponents['md-button']()
  MaterialWebComponents['md-textfield']()
})
