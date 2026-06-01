import React, { useContext } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import image from '../assets/uploadimage.jpg'
import { useState } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'

function Add() {
let [image1,setImage1]=useState(false)
let [image2,setImage2]=useState(false)
let [image3,setImage3]=useState(false)
let [image4,setImage4]=useState(false)

const [name,setName]=useState("")
const [description,setDescription]=useState("")
const [category,setCategory]=useState("Men")
const [subcategory,setSubcategory]=useState("TopWear")
const [price,setPrice]=useState("")
const [bestSeller,setBestSeller]=useState(false)
const [size,setSize]=useState([])

let {serverUrl} = useContext(authDataContext)

const handleAddProduct = async(e) => {
  e.preventDefault()
  try {
    
    let formData = new FormData()
    formData.append("name", name)
    formData.append("description", description)
    formData.append("category", category)
    formData.append("subcategory", subcategory)
    formData.append("price", price)
    formData.append("bestseller", bestSeller)
    // formData.append("size", JSON.stringify(size))
    formData.append("sizes", JSON.stringify(size || []))
    formData.append("image1", image1)
    formData.append("image2", image2)
    formData.append("image3", image3)
    formData.append("image4", image4)


    let result = await axios.post(serverUrl + "/api/product/addproduct", formData, {withCredentials:true})

     console.log(result.data)

     if(result.data){

      setName("")
      setDescription("")
      setImage1(false)
      setImage2(false)
      setImage3(false)
      setImage4(false)
      setPrice("")
      setBestSeller(false)
      setCategory("Men")
      setSubcategory("TopWear")
      

     }
  } catch (error) {
    console.error("Error adding product:", error)
  }
}

  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white] overflow-x-hidden relative bottom-[5%]'>
    <Nav />
    <Sidebar />



    {/* //form */}

    <div className='w-[82%] h-[100%] flex items-center justify-start overflow-x-hidden absolute right-0'>
      <form action="" onSubmit={handleAddProduct} className='w-[100%] md:w-[90%] h-[100%] mt-[50px] flex flex-col gap-[30px] py-[60px] px-[30px] md:px-[60px] '>
        <div className='w-[400px] h-[50px] text-[25px] md:text-[40px] text-[white]' >Add Product Page</div>

        <div title=' Add Images' className='w-[80%] h-[130px] flex items-start justify-center flex-col mt-[20px] gap[10px]'>
          <p className='text-[20px] md:text-[25px] font-semibold mb-[10px]'>Upload Image</p>





        <div className='w-[100%] h-[100%] flex items-center justify-start'>

      <label htmlFor="image1" className='w-[6px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#46d1f7]'>
        <img src={!image1 ? image :URL.createObjectURL(image1)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#1d1d1d] border-[2px]' />
        <input type="file" id="image1" hidden onChange={(e)=>setImage1(e.target.files[0])} />
      </label>

      <label htmlFor="image2" className='w-[6px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#46d1f7]'>
        <img src={!image2 ? image :URL.createObjectURL(image2)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#1d1d1d] border-[2px]' />
        <input type="file" id="image2" hidden onChange={(e)=>setImage2(e.target.files[0])}   />
      </label>

      <label htmlFor="image3" className='w-[6px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#46d1f7]'>
        <img src={!image3 ? image :URL.createObjectURL(image3)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#1d1d1d] border-[2px]' />
        <input type="file" id="image3" hidden onChange={(e)=>setImage3(e.target.files[0])} />
      </label>

      <label htmlFor="image4" className='w-[6px] h-[65px] md:w-[100px] md:h-[100px] cursor-pointer hover:border-[#46d1f7]'>
        <img src={!image4 ? image :URL.createObjectURL(image4)} alt="" className='w-[80%] h-[80%] rounded-lg shadow-2xl hover:border-[#1d1d1d] border-[2px]' />
        <input type="file" id="image4" hidden onChange={(e)=>setImage4(e.target.files[0])} />
      </label>
      </div>
    </div>



      
     <div className='w-[80%] h-[100px] flex items-start justify-center flex-col gap[10px]'>
      <p className='text-[20px] md:text-[25px] font-semibold mb-[10px]' >Product Name</p>
      <input type="text" placeholder='Type Here' className='w-[600px] max-w-[98%] h-[40px] rounded-lg hover:border-[#46d1f7] border-[2px] cursor-pointer bg-slate-600 px-[20px] text-[18px] placeholder:text-[#ffffffc2]' onChange={(e)=>setName(e.target.value)} value={name} required/>
     </div>





     <div className='w-[80%] flex items-start justify-center flex-col gap[10px]'>
      <p className='text-[20px] md:text-[25px] font-semibold mb-[10px]' >Product Description</p>
      <textarea type="text" placeholder='Type Here' className='w-[600px] max-w-[98%] h-[100px] rounded-lg hover:border-[#46d1f7] border-[2px] cursor-pointer bg-slate-600 px-[20px] text-[18px] placeholder:text-[#ffffffc2] py-[10px]' onChange={(e)=>setDescription(e.target.value)} value={description} required />
     </div>





      <div className='w-[80%] flex items-center gap-[10px] flex-wrap'>
      <div title='Select Category' className='md:w-[30%] w-[100%] flex items-start sm:justify-center flex-col gap-[10px]'>
        <p className='text-[20px] md:text-[25px] font-semibold w-[100%]'>Product Category</p>
        <select name="" id="" className='bg-slate-600 w-[60%] px-[10px] py-[7px] rounded-lg hover:border-[#46d1f7] border-[2px] cursor-pointer' onChange={(e)=>setCategory(e.target.value)} value={category}>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
        </select>
      </div>
      <div title='Select SubCategory' className='md:w-[30%] w-[100%] flex items-start sm:justify-center flex-col gap-[10px]'>
        <p className='text-[20px] md:text-[25px] font-semibold w-[100%]'>Sub Category</p>
        <select name="" id="" className='bg-slate-600 w-[60%] px-[10px] py-[7px] rounded-lg hover:border-[#46d1f7] border-[2px] cursor-pointer' onChange={(e)=>setSubcategory(e.target.value)} value={subcategory}>
          <option value="TopWear">TopWear</option>
          <option value="BottomWear">BottomWear</option>
          <option value="WinterWear">WinterWear</option>
        </select>
      </div>
     </div> 



 
     <div className='w-[80%] h-[100px] flex items-start justify-center flex-col gap[10px]'>
      <p className='text-[20px] md:text-[25px] font-semibold mb-[10px]' >Product Price</p>
      <input type="number"placeholder=" Rs 1000" value={price} onChange={(e) => setPrice(e.target.value)} className='w-[600px] max-w-[98%] h-[40px] rounded-lg hover:border-[#46d1f7] border-[2px] cursor-pointer bg-slate-600 px-[20px] text-[18px] placeholder:text-[#ffffffc2]' required/>
     </div>

      

      <div className='w-[80%] h-[220px] md:h-[100px] flex items-start justify-center flex-col gap[10px] py-[10px] md:py-0'>
       <p className='text-[20px] md:text-[25px] font-semibold'>Product Size</p>
      </div>



      <div title='Select Sizes' className=' flex items-center justify-start gap-[15px] flex-wrap '>
        <div className= {'px-[20px] py-[7px]  rounded-lg bg-[#475569] text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ' + (size.includes('S') ? ' bg-green-400 text-black border-[#46d1f7]' : "")} onClick={() => setSize(prev =>prev.includes('S') ? prev.filter(item => item !== 'S') : [...prev, 'S'])}>S</div>
        <div className= {'px-[20px] py-[7px]  rounded-lg bg-[#475569] text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ' + (size.includes('M') ? ' bg-green-400 text-black border-[#46d1f7]' : "")} onClick={() => setSize(prev =>prev.includes('M') ? prev.filter(item => item !== 'M') : [...prev, 'M'])}>M</div>
        <div className= {'px-[20px] py-[7px]  rounded-lg bg-[#475569] text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ' + (size.includes('L') ? ' bg-green-400 text-black border-[#46d1f7]' : "")} onClick={() => setSize(prev =>prev.includes('L') ? prev.filter(item => item !== 'L') : [...prev, 'L'])}>L</div>
        <div className= {'px-[20px] py-[7px]  rounded-lg bg-[#475569] text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ' + (size.includes('XL') ? ' bg-green-400 text-black border-[#46d1f7]' : "")} onClick={() => setSize(prev =>prev.includes('XL') ? prev.filter(item => item !== 'XL') : [...prev, 'XL'])}>XL</div>
        <div className= {'px-[20px] py-[7px]  rounded-lg bg-[#475569] text-[18px] hover:border-[#46d1f7] border-[2px] cursor-pointer ' + (size.includes('XXL') ? 'bg-green-400 text-black border-[#46d1f7]' : "")} onClick={() => setSize(prev =>prev.includes('XXL') ? prev.filter(item => item !== 'XXL') : [...prev, 'XXL'])}>XXL</div>  

      </div>



      <div className='w-[80%] h-[50px]  flex items-center justify-start gap-[10px]'>
        <input type="checkbox" id='bestSeller' className='w-[25px]  h-[25px] cursor-pointer accent-[#475569] ' onChange={(e)=>setBestSeller(e.target.checked)} checked={bestSeller} />
        <label htmlFor="bestSeller" className='text-[18px]  font-semibold cursor-pointer' onChange={(e)=>setBestSeller(prev => !prev)}> Add to Best Seller</label>
      </div>

        <button  title='Click To Add' className='w-[140px]  px-[20px] py-[20px] rounded-xl flex items-center justify-center  gap-[5px] text-black bg-slate-500 hover:bg-slate-300  active:text-white active:border-[2px] border-white cursor-pointer '>Add Product</button>


      </form>

    </div>

    </div>
  )
} 


export default Add