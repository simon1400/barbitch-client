const media = (type: 'sm' | 'md' | 'lg' | 'xl', classes: string) => {
  const arrClasses = classes.split(' ')
  const classesMedia = arrClasses.map((item) => `${type}:${item}`)
  return classesMedia.join(' ')
}

export default media
