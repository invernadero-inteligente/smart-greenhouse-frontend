# PATCH BLOCKED

The file is too large for atomic patching due to the amount of local actuator logic. Manual intervention is required to:
- Remove all references to zoneCatalog, newCatalogActuator, addCatalogActuator, removeCatalogActuator, isActuatorLocal, localActuatorWarning, and related UI blocks.
- Only keep logic for actuators defined by backend (suggestedActuators).

## Steps
1. Remove all imports from ../../utils/actuatorRegistry.
2. Remove all state and useEffect related to zoneCatalog and newCatalogActuator.
3. Remove all code/UI for adding/removing actuators locally.
4. Remove isActuatorLocal and localActuatorWarning logic and UI.
5. Ensure only backend actuators are operable.

---

If you want, I can split the file and apply the patch in smaller steps, or you can do a manual cleanup following these instructions.