import { api, getApiErrorMessage } from "./api";

/*
|--------------------------------------------------------------------------
| LISTAR ACTUADORES
|--------------------------------------------------------------------------
*/

async function listActuators(zoneId = null) {
  try {
    const params = {};

    if (zoneId) {
      params.zoneId = zoneId;
    }

    const response = await api.get("/api/actuators", {
      params,
    });

    return response.data?.data || [];
  } catch (error) {
    console.error("Error listando actuadores:", error);
    return [];
  }
}

/*
|--------------------------------------------------------------------------
| OBTENER ACTUADOR POR ID
|--------------------------------------------------------------------------
*/

async function getActuatorById(id) {
  try {
    const response = await api.get(`/api/actuators/${id}`);

    return response.data?.data;
  } catch (error) {
    console.error("Error obteniendo actuador:", error);
    throw new Error(getApiErrorMessage(error));
  }
}

/*
|--------------------------------------------------------------------------
| CREAR ACTUADOR
|--------------------------------------------------------------------------
*/

async function createActuator({
  zoneId,
  name,
  currentAction = "OFF",
}) {
  try {
    const payload = {
      zoneId: Number(zoneId),
      name: name.trim(),
      currentAction: currentAction.toUpperCase(),
    };

    console.log(
      "Payload creando actuador:",
      payload
    );

    const response = await api.post(
      "/api/actuators",
      payload
    );

    return response.data?.data;
  } catch (error) {
    console.error("Error creando actuador:", error);
    throw new Error(getApiErrorMessage(error));
  }
}

/*
|--------------------------------------------------------------------------
| ACTUALIZAR ACTUADOR
|--------------------------------------------------------------------------
*/

async function updateActuator({
  id,
  zoneId,
  name,
  currentAction,
}) {
  try {
    const payload = {};

    if (zoneId !== undefined) {
      payload.zoneId = Number(zoneId);
    }

    if (name !== undefined) {
      payload.name = name.trim();
    }

    if (currentAction !== undefined) {
      payload.currentAction =
        currentAction.toUpperCase();
    }

    const response = await api.patch(
      `/api/actuators/${id}`,
      payload
    );

    return response.data?.data;
  } catch (error) {
    console.error(
      "Error actualizando actuador:",
      error
    );

    throw new Error(getApiErrorMessage(error));
  }
}

/*
|--------------------------------------------------------------------------
| ELIMINAR ACTUADOR
|--------------------------------------------------------------------------
*/

async function deleteActuator(id) {
  try {
    await api.delete(`/api/actuators/${id}`);
  } catch (error) {
    console.error(
      "Error eliminando actuador:",
      error
    );

    throw new Error(getApiErrorMessage(error));
  }
}

/*
|--------------------------------------------------------------------------
| ENVIAR COMANDO ON/OFF
|--------------------------------------------------------------------------
*/

async function sendActuatorCommand(
  actuatorId,
  action
) {
  try {
    const payload = {
      action: String(action).toUpperCase(),
    };

    console.log(
      "Enviando comando:",
      actuatorId,
      payload
    );

    const response = await api.post(
      `/api/actuators/${actuatorId}/command`,
      payload
    );

    return response.data?.data;
  } catch (error) {
    console.error(
      "Error enviando comando:",
      error
    );

    throw new Error(getApiErrorMessage(error));
  }
}

/*
|--------------------------------------------------------------------------
| COMPATIBILIDAD
|--------------------------------------------------------------------------
| Esto arregla:
| actuatorService.sendCommand is not a function
|--------------------------------------------------------------------------
*/

async function sendCommand(
  actuatorId,
  action
) {
  return sendActuatorCommand(
    actuatorId,
    action
  );
}

/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

export const actuatorService = {
  listActuators,
  getActuatorById,
  createActuator,
  updateActuator,
  deleteActuator,

  // nombres válidos
  sendActuatorCommand,
  sendCommand,
};