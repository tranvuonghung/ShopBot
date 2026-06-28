from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models.product import Product
from schemas.product_schema import ProductCreate, ProductUpdate

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.get("/")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()

    return products

@router.post("/")
def create_product(data: ProductCreate, db: Session = Depends(get_db)):

    product = Product(
        name=data.name,
        price=data.price,
        description=data.description,
        image=data.image,
        category_id=data.category_id,
        quantity=data.quantity,
        status=data.status
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return {
        "message": "Thêm thành công",
        "data": product
    }

@router.put("/{id}")
def update_product(
        id: int,
        data: ProductUpdate,
        db: Session = Depends(get_db)
):

    product = db.query(Product).filter(Product.id == id).first()

    if not product:
        return {"message": "Không tìm thấy sản phẩm"}

    product.name = data.name
    product.price = data.price
    product.description = data.description
    product.image = data.image
    product.category_id = data.category_id
    product.quantity = data.quantity
    product.status = data.status

    db.commit()

    return {"message": "Cập nhật thành công"}

@router.delete("/{id}")
def delete_product(
        id: int,
        db: Session = Depends(get_db)
):

    product = db.query(Product)\
                .filter(Product.id == id)\
                .first()

    if not product:
        return {"message": "Không tìm thấy sản phẩm"}

    db.delete(product)
    db.commit()

    return {"message": "Xóa thành công"}