export const roles = {
  admin: {
    name: 'admin',
    label: '超级管理员',
    routes: ['home', 'mall', 'goods', 'user', 'page1', 'page2']
  },
  editor: {
    name: 'editor',
    label: '编辑者',
    routes: ['home', 'goods', 'user']
  },
  visitor: {
    name: 'visitor',
    label: '访客',
    routes: ['home']
  }
}

export function getRoleRoutes(roleName) {
  const role = roles[roleName]
  return role ? role.routes : []
}
