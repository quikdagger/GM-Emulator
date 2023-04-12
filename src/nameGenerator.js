import React, { useState } from "react";
import { nameData } from "./nameList";
import NameOptionsModal from "./nameOptionsModal";

const NameGenerator = () => {
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [gender, setGender] = useState("");
  const [prefixes, setPrefixes] = useState([]);
  const [suffixes, setSuffixes] = useState([]);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [categories] = useState(Object.keys(nameData));
  const [subCategories, setSubCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");

  const handleSelect = (type, value) => {
    if (type === "category") {
      handleCategoryChange(value);
    } else if (type === "subCategory") {
      handleSubCategoryChange(value);
    } else if (type === "gender") {
      setGender(value);
    }
  };
  
  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  
    const categoryData = nameData[selectedCategory];
    const newSubCategories = Object.keys(categoryData);
    setSubCategories(newSubCategories);
  
    setSubCategory("");
    setPrefix("");
    setSuffix("");
  };
  
  const handleSubCategoryChange = (selectedSubCategory) => {
    setSubCategory(selectedSubCategory);
  
    const selectedCategoryData = nameData[category]?.[selectedSubCategory];
    const prefixList = selectedCategoryData?.male?.prefixes || [];
    const suffixList = selectedCategoryData?.male?.suffixes || [];
  
    setPrefixes(prefixList);
    setSuffixes(suffixList);
  };
  

  const handleModalToggle = () => {
    setShowModal(!showModal);
    if (!showModal) {
      generateName();
    }
  };

  const generateName = () => {
    if (!category || !subCategory || !gender) return;

    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];

    setName(`${randomPrefix}${randomSuffix}`);
};

  return (
    <div>
      <h2>Name Generator</h2>
      <button onClick={handleModalToggle}>Generate Name</button>
      {showModal && (
        <NameOptionsModal
        categories={Object.keys(nameData)}
        subCategories={subCategories}
        onSelect={handleSelect}
        onClose={handleModalToggle}
        generateName={generateName}
        />
      )}
      <p>{name}</p>
    </div>
  );
};

export default NameGenerator;