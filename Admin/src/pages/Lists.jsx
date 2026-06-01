import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../component/Sidebar'
import Nav from '../component/Nav'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { FaEdit } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'
import BackToHomeButton from '../component/BackToHomeButton'

// function for fetching the list of products 

function Lists() {
  const navigate = useNavigate()
  let [list, setList] = useState([])
  let [editingProduct, setEditingProduct] = useState(null)
  let [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    bestseller: false,
    sizes: []
  })
  let { serverUrl } = useContext(authDataContext)

  const fetchlist = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/product/list",)
      setList(result.data)
      console.log(result.data)
    } catch (error) {
      console.log("fetchlist error:", error)
    }
  }

  //  function for deleting a product from the list. 

  const removelist = async (id) => {
    try {
      let result = await axios.post(` ${serverUrl}/api/product/remove/${id}`, {}, { withCredentials: true })

      if (result.data) {
        fetchlist()
      }
      else {
        alert("Failed to remove the product")
      }

    } catch (error) {
      console.log("removelist error:", error)
    }

  }

  // function for editing a product
  const startEdit = (product) => {
    setEditingProduct(product)
    setEditForm({
      name: product.name,
      description: product.description,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      bestseller: product.bestseller,
      sizes: product.sizes || []
    })
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setEditForm({
      name: '',
      description: '',
      category: '',
      subcategory: '',
      price: '',
      bestseller: false,
      sizes: []
    })
  }

  const updateProduct = async (e) => {
    e.preventDefault()
    try {
      let formData = new FormData()
      formData.append("name", editForm.name)
      formData.append("description", editForm.description)
      formData.append("category", editForm.category)
      formData.append("subcategory", editForm.subcategory)
      formData.append("price", editForm.price)
      formData.append("bestseller", editForm.bestseller)
      formData.append("sizes", JSON.stringify(editForm.sizes))

      let result = await axios.post(`${serverUrl}/api/product/update/${editingProduct._id}`, formData, { withCredentials: true })

      if (result.data) {
        fetchlist()
        cancelEdit()
        alert("Product updated successfully")
      }
    } catch (error) {
      console.log("updateProduct error:", error)
      alert("Failed to update product")
    }
  }


  useEffect(() => {
    fetchlist()
  }, [])
  return (

    <div className='w-[99vw]  min-h-[100vh]  bg-gradient-to-l from-[#141414] to-[#0c2025] text-[white]  '>
      <Nav />
      <div className='w-[100%] h-[100%] flex items-center justify-start'> <Sidebar />

        <div className='w-[82%] h-[100%] lg:ml-[320px] md:ml-[230px] sm:ml-[100px]
       mt-[70px] flex flex-col gap-[30px] py-[30px] overflow-x-hidden ml-[100px]'>

          <div className='w-full flex items-center justify-between'>
            <div className='w-[400px] h-[50px] text-[28px] md:text-[40px] text-[white]'> All listed Products </div>
          </div>


          {/* Maping the list of products to display them on the page. Each product is displayed in a card-like format with an image and some details. If there are no products available, a message is shown instead. */}

          {

            list?.length > 0 ? (
              list.map((item, index) => (
                <div key={index} className='w-[90%] md:h-[129px] h-[90px]  bg-slate-600  rounded-xl flex items-center justify-start gap-[5px] p-[10px] md:px-[30px]'>
                  <img src={item.image1} className='w-[30%] md:w-[120px]  h-[90%]  rounded-lg' alt="" />

                  <div className='w-[90%] h-[80%] flex flex-col items-start justify-center gap-[2px]'>



                    <div className='w-[100%] md:text-[20px] text-[15px] text-[abef0f3] '> {item.name} </div>
                    <div className='w-[100%] md:text-[18px] text-[14px] text-[white] '> {item.category} </div>
                    <div className='w-[100%] md:text-[18px] text-[14px] text-[white] '> Rs {item.price} </div>

                  </div>

                  <div className=' w-[10%] h-[100%] bg-transparent flex items-center justify-center gap-2'>

                    <span className='w-[30px] h-[30%] flex items-center justify-center rounded-md md:hover:bg-blue-300 md:hover:text-black cursor-pointer hover:bg-blue-300 hover:text-black' onClick={() => startEdit(item)} title="Edit Product">
                      <FaEdit className='text-sm' />
                    </span>

                    <button className='w-[30px] h-[30%]  flex items-center justify-center rounded-md md:hover:bg-red-300 md:hover:text-black cursor-pointer hover:bg-red-300 hover:text-black' onClick={() => removelist(item._id)} title="Delete Product"> X </button>
                  </div>

                </div>
              ))


            ) :
              (
                <div className='text-white text-lg'> product Not Available </div>

              )


          }


        </div>

      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-slate-700 p-6 rounded-lg w-[90%] max-w-md max-h-[80vh] overflow-y-auto'>
            <h2 className='text-white text-xl mb-4'>Edit Product</h2>
            <form onSubmit={updateProduct} className='space-y-4'>
              <div>
                <label className='text-white block mb-1'>Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className='w-full p-2 rounded bg-slate-600 text-white'
                  required
                />
              </div>

              <div>
                <label className='text-white block mb-1'>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className='w-full p-2 rounded bg-slate-600 text-white'
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className='text-white block mb-1'>Category</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className='w-full p-2 rounded bg-slate-600 text-white'
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <div>
                <label className='text-white block mb-1'>Subcategory</label>
                <select
                  value={editForm.subcategory}
                  onChange={(e) => setEditForm({ ...editForm, subcategory: e.target.value })}
                  className='w-full p-2 rounded bg-slate-600 text-white'
                >
                  <option value="TopWear">TopWear</option>
                  <option value="BottomWear">BottomWear</option>
                  <option value="WinterWear">WinterWear</option>
                </select>
              </div>

              <div>
                <label className='text-white block mb-1'>Price</label>
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  className='w-full p-2 rounded bg-slate-600 text-white'
                  required
                />
              </div>

              <div>
                <label className='text-white flex items-center'>
                  <input
                    type="checkbox"
                    checked={editForm.bestseller}
                    onChange={(e) => setEditForm({ ...editForm, bestseller: e.target.checked })}
                    className='mr-2'
                  />
                  Bestseller
                </label>
              </div>

              <div className='flex gap-2'>
                <button
                  type="submit"
                  className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className='bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700'
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Lists