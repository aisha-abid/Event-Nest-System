import React from 'react'
import Hero from '../components/Hero'
import Gallery from '../components/Gallery'
import About from '../components/About'
import OurMenu from '../components/OurMenu'


const Home = () => {
  return (
    <>
       <Hero/> 
       <About/>
       <Gallery/>
       <OurMenu/>  
    </>
  )
}

export default Home