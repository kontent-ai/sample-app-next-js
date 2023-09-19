
export const getEnvIdFromRouteParams = (envId: string | undefined) => {
  if(!envId) {
    throw new Error("The envId route parameter is missing");
  }

  return envId;
}