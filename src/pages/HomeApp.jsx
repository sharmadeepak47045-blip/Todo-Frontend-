import Navbar from '../components/Navbar'
import Header from '../components/Header'

const HomeApp = () => {
  return (
<div className="flex flex-col items-center min-h-screen pt-20 bg-[url('/bg_img.png')] bg-cover bg-center">
     
     <Navbar />
     <Header />
    </div>
  )
}

export default HomeApp;
