/**
 * Permisos por rol de usuario.
 *
 * ADMIN      → todo
 * MANAGER    → CRUD en módulos operativos, sin gestión de usuarios
 * TECHNICIAN → operar actuadores y alertas, lectura en el resto
 * VIEWER     → solo lectura
 */

export const EDIT_ROLES = ["ADMIN", "MANAGER"];
export const OPERATE_ROLES = ["ADMIN", "MANAGER", "TECHNICIAN"];

/** Puede crear, editar y eliminar registros */
export const canEdit = (role) => EDIT_ROLES.includes(role);

/** Puede operar actuadores y gestionar alertas */
export const canOperate = (role) => OPERATE_ROLES.includes(role);

/** Solo tiene acceso de lectura */
export const isViewer = (role) => role === "VIEWER";
