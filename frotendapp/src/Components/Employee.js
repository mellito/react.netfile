import React, { useState, useEffect } from "react";
const defaultimg = "/Images/profile2D.jpg";
const initialFieldValues = {
  employeeId: 0,
  employeeName: "",
  occupation: "",
  imageName: "name",
  imageSrc: defaultimg,
  imageFiles: null,
};

const Employee = ({ addOrEdit, recordForEdit }) => {
  const [values, setValues] = useState(initialFieldValues);
  const [error, setErrors] = useState({});
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (recordForEdit != null) {
      setValues(recordForEdit);
    }
  }, [recordForEdit]);

  const showPreview = (e) => {
    if (e.target.files[0] && e.target.files) {
      const imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setValues((prev) => ({
          ...prev,
          imageFiles: imageFile,
          imageSrc: x.target.result,
        }));
      };
      reader.readAsDataURL(imageFile);
    } else {
      setValues((prev) => ({
        ...prev,
        imageFiles: null,
        imageSrc: defaultimg,
      }));
    }
  };
  const validate = () => {
    let temp = {};
    temp.employeeName = values.employeeName === "" ? false : true;
    temp.imageSrc = values.imageSrc === defaultimg ? false : true;
    setErrors(temp);
    return Object.values(temp).every((x) => x === true);
  };
  const resetForm = () => {
    setValues(initialFieldValues);
    document.getElementById("image-upload").value = null;
    setErrors({});
  };

  const applyErrorsClass = (field) =>
    field in error && error[field] === false ? " invalid-field" : "";

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const formDataEmployee = new FormData();
      formDataEmployee.append("EmployeeId", values.employeeId);
      formDataEmployee.append("EmployeeName", values.employeeName);
      formDataEmployee.append("Occupation", values.occupation);
      formDataEmployee.append("ImageName", values.imageName);
      formDataEmployee.append("ImageFiles", values.imageFiles);
      addOrEdit(formDataEmployee, resetForm);
    }
  };

  return (
    <>
      <div className="container text-center">
        <p className="lead"> An Employee</p>
      </div>
      <form
        autoComplete="off"
        noValidate
        className="text-center"
        onSubmit={handleFormSubmit}
      >
        <div className="card ">
          <img
            src={values.imageSrc}
            alt={values.employeeName}
            className="card-img-top"
          />
          <div className="card-body ">
            <div className="form-group py-2">
              <input
                type="file"
                accept="image/*"
                className={"form-control-file" + applyErrorsClass("imageSrc")}
                onChange={showPreview}
                id="image-upload"
              />
            </div>
            <div className="form-group py-2">
              <input
                className={"form-control" + applyErrorsClass("employeeName")}
                placeholder="Employee Name"
                name="employeeName"
                value={values.employeeName}
                onChange={handleInputChange}
              ></input>
            </div>
            <div className="form-group py-2">
              <input
                className="form-control"
                placeholder="occupation"
                name="occupation"
                value={values.occupation}
                onChange={handleInputChange}
              ></input>
            </div>
            <div className="form-group">
              <button type="submit" className="btn btn-light">
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Employee;
