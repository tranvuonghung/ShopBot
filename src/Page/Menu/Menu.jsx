import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../../Compoment/Sidebar/Sidebar";
import { Search } from "lucide-react";

function FoodManagement() {
  const [foods, setFoods] = useState([]);
  const [keyword, setKeyword] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category_id: 1,
    quantity: 0,
    status: "Còn hàng"
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get("http://127.0.0.1:8000/products/")
      .then((res) => {
        setFoods(res.data);
      })
      .catch((err) => console.log(err));
  };

  const filteredFoods = useMemo(() => {
    const value = keyword.toLowerCase();

    return foods.filter(
      (food) =>
        food.name.toLowerCase().includes(value) ||
        food.status.toLowerCase().includes(value)
    );
  }, [foods, keyword]);

  const handleAdd = () => {
    axios
      .post("http://127.0.0.1:8000/products/", formData)
      .then(() => {
        fetchProducts();

        setFormData({
          name: "",
          price: "",
          description: "",
          image: "",
          category_id: 1,
          quantity: 0,
          status: "Còn hàng"
        });
      })
      .catch(err => console.log(err));
  };


  const handleUpdate = () => {

    axios
      .put(
        `http://127.0.0.1:8000/products/${editingId}`,
        formData
      )
      .then(() => {

        fetchProducts();

        setEditingId(null);

        setFormData({
          name: "",
          price: "",
          description: "",
          image: "",
          category_id: 1,
          quantity: 0,
          status: "Còn hàng"
        });

      })
      .catch(err => console.log(err));

  };

  const handleEdit = (food) => {
    setEditingId(food.id);

    setFormData({
      name: food.name,
      price: food.price,
      description: food.description,
      image: food.image,
      category_id: food.category_id,
      quantity: food.quantity,
      status: food.status
    });
  };

  const handleDelete = async (id) => {

  try {

    await axios.delete(
      `http://127.0.0.1:8000/products/${id}`
    );

    fetchProducts();

    setShowDeleteModal(false);

    setSelectedId(null);

  } catch (err) {

    console.log(err);

  }

};

  return (
    <div className="d-flex min-vh-100 bg-light">
      <Sidebar />

      <main className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold">Menu</h1>
            <p className="text-secondary">
              Danh sách sản phẩm hiện có
            </p>
          </div>

          <button className="btn btn-success" onClick={() => setShowAddModal(true)}>
            + Thêm sản phẩm
          </button>
        </div>

        <div className="input-group mb-4" style={{ maxWidth: 350 }}>
          <span className="input-group-text">
            <Search size={18} />
          </span>

          <input
            className="form-control"
            placeholder="Tìm món ăn..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="row g-3">
          {filteredFoods.map((food) => (
            <div className="col-md-3" key={food.id}>
              <div className="card shadow-sm h-100">

                <div className="card-body">

                  <h5 className="fw-bold">
                    {food.name}
                  </h5>

                  <p className="text-secondary">
                    {food.description}
                  </p>

                  <div className="mb-2">
                    <strong>
                      {food.price.toLocaleString()} VNĐ
                    </strong>
                  </div>

                  <div className="mb-2">
                    Số lượng: {food.quantity}
                  </div>

                  <span
                    className={`badge ${food.status === "Còn hàng"
                      ? "bg-success"
                      : food.status === "Sắp hết hàng"
                        ? "bg-warning"
                        : "bg-danger"
                      }`}
                  >
                    {food.status}
                  </span>

                  <div className="d-flex gap-2 mt-3">
                    <button className="btn btn-warning btn-sm" onClick={() => {
                      handleEdit(food);
                      setShowEditModal(true);
                    }}>
                      Sửa
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setSelectedId(food.id);
                        setShowDeleteModal(true);
                      }}
                    >
                      Xóa
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      {
        showAddModal && (

          <div className="modal d-block bg-dark bg-opacity-50">

            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header">
                  <h5>Thêm sản phẩm</h5>

                  <button
                    className="btn-close"
                    onClick={() => setShowAddModal(false)}
                  ></button>

                </div>

                <div className="modal-body">

                  <input
                    className="form-control mb-2"
                    placeholder="Tên sản phẩm"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Giá"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Mô tả"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Số lượng"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />

                </div>

                <div className="modal-footer">

                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Đóng
                  </button>

                  <button
                    className="btn btn-success"
                    onClick={() => {
                      handleAdd();
                      setShowAddModal(false);
                    }}
                  >
                    Thêm
                  </button>

                </div>

              </div>
            </div>

          </div>

        )
      }

//modal sửa
      {
        showEditModal && (

          <div className="modal d-block bg-dark bg-opacity-50">

            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header">
                  <h5>Cập nhật sản phẩm</h5>

                  <button
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                  ></button>

                </div>

                <div className="modal-body">

                  <input
                    className="form-control mb-2"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />

                  <input
                    className="form-control mb-2"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                  />

                  <input
                    className="form-control mb-2"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />

                  <input
                    className="form-control mb-2"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                  />

                </div>

                <div className="modal-footer">

                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Đóng
                  </button>

                  <button
                    className="btn btn-warning"
                    onClick={() => {
                      handleUpdate();
                      setShowEditModal(false);
                    }}
                  >
                    Cập nhật
                  </button>

                </div>

              </div>
            </div>

          </div>

        )
      }

//modal xóa
      {
        showDeleteModal && (

          <div className="modal d-block bg-dark bg-opacity-50">

            <div className="modal-dialog">
              <div className="modal-content">

                <div className="modal-header">
                  <h5>Xóa sản phẩm</h5>
                </div>

                <div className="modal-body">

                  Bạn có chắc muốn xóa sản phẩm này không?

                </div>

                <div className="modal-footer">

                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Hủy
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      handleDelete(selectedId);
                      setShowDeleteModal(false);
                    }}
                  >
                    Xóa
                  </button>

                </div>

              </div>
            </div>

          </div>

        )
      }
    </div>
  );
}



export default FoodManagement;