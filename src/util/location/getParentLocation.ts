type Location = string[];

export const getParentLocation = (location: Location): Location => {
  const parentLocation = location.slice(0, location.length - 1);
  return parentLocation;
}
