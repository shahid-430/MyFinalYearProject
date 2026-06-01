import React, { useEffect, useState } from 'react'
import Nav from '../component/Nav'
import Background from '../component/Background'
import Hero from '../component/Hero'
import Product from './Product'
import OurPolicy from '../component/OurPolicy'
import NewLetterBox from '../component/NewLetterBox'
import Footer from '../component/Footer'

function Home() {
  //hero we set values for prop that we pass to hero componment
  let heroData = [
    { text1: "30% OFF Limited Offer", text2: "Style that" },
    { text1: "Discover the Best of Bold Fashion", text2: "Limited Time Only" },
    { text1: "Explore Our Best Collection", text2: "Shop Now!" },
    { text1: "Choose Your Perfect Fashion Fit", text2: " Now on Sale!" }
  ]

  let [heroCount, setHeroCount] = useState(0)

  //for automatically sliding
  useEffect(() => {
    let interval = setInterval(() => {
      setHeroCount(preCount => (preCount === 3 ? 0 : preCount + 1))

    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className='overflow-hidden relative'>
      <div className='w-[100vw] bg-gradient-to-l from-[#141414] to-[#0c2025] pt-[70px] pb-[30px] lg:pb-[40px]'>
        <Nav />
        <div className='mx-auto flex flex-col-reverse items-center justify-between gap-8 px-4 pb-10 md:flex-row md:px-10 lg:px-16 lg:pb-16 max-w-[1300px]'>
          <Hero heroCount={heroCount} setHeroCount={setHeroCount} heroData={heroData[heroCount]} />
          <Background heroCount={heroCount} />
        </div>
      </div>
      <Product />
      <OurPolicy />
      <NewLetterBox />
      <Footer />
    </div>
  )
}

export default Home