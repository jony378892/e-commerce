import React, { useContext, useEffect, useState, Suspense } from "react";

import ProductItem from "../components/ProductItem";
import ShopContext from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevent");
  const [showFilter, setShowFilter] = useState(false);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    if (!products || products.length === 0) return; // Ensure products is defined
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category));
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    if (!filterProducts || filterProducts.length === 0) return; // Ensure filterProducts is defined
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;

      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter;
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse flex flex-col items-center">
          <div className="bg-gray-300 h-36 w-36 rounded-md"></div>
          <div className="bg-gray-300 h-4 w-24 mt-2 rounded"></div>
          <div className="bg-gray-300 h-4 w-16 mt-1 rounded"></div>
        </div>
      ))}
    </div>
  );

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 vorder-t">
        {/* Filter Options */}
        <div className="min-w-60">
          <p onClick={() => setShowFilter(!showFilter)} className="my-2 text-xl flex items-center cursor-pointer gap-2">
            FILTERS
            <img src={assets.dropdown_icon} alt="" className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`} />
          </p>

          {/* Category Filter */}
          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-medium">CATEGORIES</p>

            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input className="w-3" type="checkbox" value={"Men"} onChange={toggleCategory} />
                Men
              </p>
              <p className="flex gap-2">
                <input className="w-3" type="checkbox" value={"Women"} onChange={toggleCategory} /> Women
              </p>
              <p className="flex gap-2">
                <input className="w-3" type="checkbox" value={"Kids"} onChange={toggleCategory} /> Kids
              </p>
            </div>
          </div>
          {/* Subcategory Filter */}
          <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? "" : "hidden"} sm:block`}>
            <p className="mb-3 text-sm font-medium">TYPE</p>

            <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
              <p className="flex gap-2">
                <input className="w-3" type="checkbox" value={"Topwear"} onChange={toggleSubCategory} />
                Topwear
              </p>
              <p className="flex gap-2">
                <input className="w-3" type="checkbox" value={"Bottomwear"} onChange={toggleSubCategory} /> Bottomwear
              </p>
              <p className="flex gap-2">
                <input className="w-3" type="checkbox" value={"Winterwear"} onChange={toggleSubCategory} /> Winterwear
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 ">
          <div className="flex justify-between text-base sm:text-2xl mb-4">
            <Title text1={"ALL"} text2={"COLLECTION"} />
            {/* Product Sort */}
            <select className="border-2 border-gray-300 text-sm px-2" onChange={(e) => setSortType(e.target.value)}>
              <option value="revelevent">Sort by: Relevent</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
          </div>

          {/* Map Products */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
            {filterProducts.map((item, index) => (
              <ProductItem key={index} name={item.name} id={item._id} image={item.image} price={item.price} />
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Collection;
