import Contact from '../sections/Contact'

// Patička s286 (varianta C): kontakt, sociální sítě, právní řádek a logo jsou
// v sections/Contact — dřívější `OficialInfo` je její součástí.
const Footer = async () => {
  return (
    <footer>
      <Contact />
    </footer>
  )
}

export default Footer
