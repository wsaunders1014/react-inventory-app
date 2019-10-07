//Removes spaces and characters from category names
export const spaceRemove = (name="") => {
  return name.split(' ').join('_');
}
export const spaceAdder = (name="") =>{
  console.log(name)
  return name.split('_').join(' ');
}
