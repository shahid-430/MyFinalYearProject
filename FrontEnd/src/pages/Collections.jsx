import React, { use, useContext, useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import Title from "../component/Title";
import { ShopDataContext } from "../context/shopContext";
import Card from "../component/Card";
function Collections() {

  let [showFilter, setShowFilter] = useState(false)
  let { products, search, showSearch } = useContext(ShopDataContext);
  let [filteredProducts, setFilteredProducts] = useState([]);
  let [category, setCategory] = useState([]);
  let [subCategory, setSubCategory] = useState([]);
  let [sortBy, setSortType] = useState("relevant");

  /* setting values for filters to the products */

  const toggleCategory = (e) => {
    let value = e.target.value;
    if (category.includes(e.target.value)) {
      setCategory(prev => prev.filter(item => item !== value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }

  const toggleSubCategory = (e) => {
    let value = e.target.value.toLowerCase();

    if (subCategory.includes(value)) {
      setSubCategory(prev => prev.filter(item => item !== value))
    } else {
      setSubCategory(prev => [...prev, value])
    }

  }



  /* Apply filters to the products */

  const applyFilter = () => {
    let productCopy = products.slice()

    // Searching the products based on the search query

    if (showSearch && search) {
      productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (category.length > 0) {
      productCopy = productCopy.filter(item => category.includes(item.category))
    }


    if (subCategory.length > 0) {
      productCopy = productCopy.filter(item =>
        subCategory.includes(item.subcategory?.toLowerCase())
      )
    }
    setFilteredProducts(productCopy);
  }


  // Sorting the products based on the price

  const sortProducts = () => {
    let fbCopy = filteredProducts.slice();

    switch (sortBy) {
      case "low_to_high":
        setFilteredProducts(fbCopy.sort((a, b) => a.price - b.price));
        break;
      case "high_to_low":
        setFilteredProducts(fbCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;

    }

  }

  useEffect(() => {
    sortProducts();
  }, [sortBy])



  useEffect(() => {
    setFilteredProducts(products);
  }, [products])


  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch])



  return (
    <div className="w-[99vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex flex-col lg:flex-row pt-[70px] overflow-x-hidden z-[2] pb-[110px]">


      <div className={'w-[100vw] lg:w-[22vw] p-[20px] border-r-[1px] border-gray-400 text-[#aaf5fa] bg-slate-900/20 ' + (showFilter ? 'h-auto' : 'h-[8vh]') + ' lg:fixed lg:top-[70px] lg:left-0 lg:h-auto'}>
        <p className="text-[25px] font-semibold flex gap-[5px] items-center justify-between text-[#f8fafa] cursor-pointer" onClick={() => setShowFilter(prev => !prev)}>
          FILTER
          {!showFilter && <FaAngleRight className="text-[18px] md:hidden" />}
          {showFilter && <FaChevronDown className="text-[18px] md:hidden" />}
        </p>

        <div className={`border-[2px] border-[#dedcdc] pl-5 py-3 mt-6 rounded-md bg-slate-600 ${showFilter ? 'block' : 'hidden'} lg:block`}>
          <p className="text-[18px] text-[#f8fafa]">Categories</p>
          <div className="w-full h-auto flex flex-col gap-[10px] mt-3">
            <label className="flex items-center gap-[10px] text-[15px] text-[#f8fafa]"><input type="checkbox" value="Men" className="w-3" onChange={toggleCategory} />Men</label>
            <label className="flex items-center gap-[10px] text-[15px] text-[#f8fafa]"><input type="checkbox" value="Women" className="w-3" onChange={toggleCategory} />Women</label>
            <label className="flex items-center gap-[10px] text-[15px] text-[#f8fafa]"><input type="checkbox" value="Kids" className="w-3" onChange={toggleCategory} />Kids</label>
          </div>
        </div>

        <div className={`border-[2px] border-[#dedcdc] pl-5 py-3 mt-6 rounded-md bg-slate-600 ${showFilter ? 'block' : 'hidden'} lg:block`}>
          <p className="text-[18px] text-[#f8fafa]">Sub Categories</p>
          <div className="w-full h-auto flex flex-col gap-[10px] mt-3">
            <label className="flex items-center gap-[10px] text-[15px] text-[#f8fafa]"><input type="checkbox" value="Topwear" className="w-3" onChange={toggleSubCategory} />Topwear</label>
            <label className="flex items-center gap-[10px] text-[15px] text-[#f8fafa]"><input type="checkbox" value="Bottomwear" className="w-3" onChange={toggleSubCategory} />Bottomwear</label>
            <label className="flex items-center gap-[10px] text-[15px] text-[#f8fafa]"><input type="checkbox" value="Winterwear" className="w-3" onChange={toggleSubCategory} />Winterwear</label>
          </div>
        </div>

      </div>


      <div className="w-full lg:ml-[22vw] md:py-[10px]">
        <div className=" md:w-[80vw] w-[100vw] p-[20px] flex justify-between  flex-col   lg:flex-row lg:px-[50px] ">
          <Title text1={"All"} text2={"Collections"} />

          <select name="" id="" className="bg-slate-600 w-[60%] md:w-[200px] h-[50px] px-[10px]  text-[white] rounded-lg hover:border-[#46d1f7] border-[2px]" onChange={(e) => setSortType(e.target.value)}>



            <option value="relevant" className="w-[100%] h-[100%]">Sort By: Relevant</option>
            <option value="low_to_high" className="w-[100%] h-[100%]">Sort By: Low to High</option>
            <option value="high_to_low" className="w-[100%] h-[100%]">Sort By: High to Low</option>
          </select>

        </div>

        <div className="w-full min-h-[70vh] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[30px] px-5 justify-items-start content-start">

          {
            filteredProducts.length > 0 ? (
              filteredProducts.map((item, index) => (
                <Card
                  key={item._id || index}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  image={item.image1}
                  ratingAverage={item.ratingAverage}
                  ratingCount={item.ratingCount}
                />
              ))
            ) : (
              <p className="text-[24px] text-[#f8fafa] font-semibold">Product Not Found</p>
            )
          }

        </div>


      </div>
    </div>
  )

}
export default Collections