import React, { useState, useEffect } from "react";
import Employee from "./Employee";
import axios from "axios";
const EmployeeList = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState(null);

  const employeeAPi = (url = "https://localhost:7251/api/Employee") => {
    return {
      fetchAll: () => axios.get(url),
      create: (newRecord) => axios.post(url, newRecord),
      update: (id, updateRecord) => axios.put(url + "/" + id, updateRecord),
      delete: (id) => axios.delete(url + "/" + id),
    };
  };

  const refreshEmployeeList = () => {
    employeeAPi()
      .fetchAll()
      .then((res) => setEmployeeList(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    refreshEmployeeList();
  }, []);

  const addOrEdit = (formData, onSuccess) => {
    if (formData.get("EmployeeId") == "0") {
      employeeAPi()
        .create(formData)
        .then((res) => {
          onSuccess();
          refreshEmployeeList();
        })
        .catch((err) => console.log(err));
    } else {
      employeeAPi()
        .update(formData.get("EmployeeId"), formData)
        .then((res) => {
          onSuccess();
          refreshEmployeeList();
        })
        .catch((err) => console.log(err));
    }
  };
  const showRecordDetails = (data) => {
    setRecordForEdit(data);
  };

  const onDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure to delete this record")) {
      employeeAPi()
        .delete(id)
        .then((res) => {
          refreshEmployeeList();
        })
        .catch((err) => console.log(err));
    }
  };
  const imageCard = (data) => {
    return (
      <div className="card" onClick={() => showRecordDetails(data)}>
        <img
          src={data.imageSrc}
          alt={data.employeeName}
          className="card-img-top rounded-circ"
        ></img>
        <div className="card-body">
          <h5>{data.employeeName}</h5>
          <span>{data.ocuppation}</span>
          <br />
          <button
            className="btn btn-light delete-button"
            onClick={(e) => onDelete(e, parseInt(data.employeeId))}
          >
            <i className="far fa-trash-alt"></i>
          </button>
        </div>
      </div>
    );
  };
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="jumbotron jumbotron-fluid py-4">
          <div className="container text-center">
            <h1 className="display-4">Employee Register</h1>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <Employee addOrEdit={addOrEdit} recordForEdit={recordForEdit} />
      </div>
      <div className="col-md-8">
        <h5 className="text-center">Employee List</h5>
        <table>
          <tbody>
            {[...Array(Math.ceil(employeeList.length / 3))].map((e, i) => {
              return (
                <tr key={i}>
                  <td>{imageCard(employeeList[3 * i])}</td>
                  <td>
                    {employeeList[3 * i + 1]
                      ? imageCard(employeeList[3 * i + 1])
                      : null}
                  </td>
                  <td>
                    {employeeList[3 * i + 2]
                      ? imageCard(employeeList[3 * i + 2])
                      : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
