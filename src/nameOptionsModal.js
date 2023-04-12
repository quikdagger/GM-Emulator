import React from "react";

const NameOptionsModal = ({ categories, onSelect, onClose, subCategory, subCategories, generateName }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h2>Select Name Options</h2>
                <label>
                    Category:
                    <select name="category" onChange={(e) => onSelect('category', e.target.value)}>
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Sub-Category:
                    <select
                        onChange={(e) => onSelect("subCategory", e.target.value)} >
                        <option value="">Select sub-category</option>
                        {subCategories.map((subCategory, index) => (
                            <option key={index} value={subCategory}>
                                {subCategory}
                            </option>
                        ))}
                    </select>
                </label>
                <label>
                    Gender:
                    <select name="gender" onChange={(e) => onSelect('gender', e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </label>
                <button onClick={() => {
                    onClose();
                    generateName();
                }}>Generate Name</button>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    )
}

export default NameOptionsModal;
