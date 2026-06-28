from models.product import Product

def seed_product(db):

    if db.query(Product).count() > 0:
        return

    products = [

        Product(
            name="Gà Rán Giòn",
            price=50000,
            description="Gà rán giòn truyền thống",
            image="https://nguyenhafood.vn/uploads/files/ga-chien-gion-cp%20%285%29.png",
            category_id=1,
            quantity=120,
            status="Còn hàng"
        ),

        Product(
            name="Gà Cay Hàn Quốc",
            price=65000,
            description="Gà sốt cay Hàn Quốc",
            image="https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/kien-thuc/cach-lam-ga-ran-sot-cay-han-quoc/cach-lam-ga-ran-sot-cay-han-quoc-5.jpg",
            category_id=1,
            quantity=15,
            status="Sắp hết hàng"
        ),

        Product(
            name="Burger Bò Phô Mai",
            price=55000,
            description="Burger bò",
            image="https://burgerking.vn/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/e/x/exc_whopper_2.jpg",
            category_id=2,
            quantity=50,
            status="Còn hàng"
        ),

        Product(
            name="mỳ cay",
            price=45000,
            description="Burger gà",
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-Pg5tRJ6reIJAGjJEWDmV7kLhg8QfO1Y5RkBOayrcSZkIARX8_Ijpt9Q&s=10",
            category_id=2,
            quantity=0,
            status="Hết hàng"
        ),

        Product(
            name="Coca Cola",
            price=15000,
            description="Nước ngọt",
            image="https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8935049501503-2.jpg.webp",
            category_id=3,
            quantity=200,
            status="Còn hàng"
        ),

        Product(
            name="Pepsi",
            price=15000,
            description="Nước ngọt",
            image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdWNssdAn-dYG0gRfr5x4P3ncYqa18oR4FZcYtYQwZAS_ICO5Ok2TnlJnj&s=10",
            category_id=3,
            quantity=8,
            status="Sắp hết hàng"
        ),

        Product(
            name="thịt ba chỉ nướng",
            price=99000,
            description="Combo ưu đãi",
            image="https://i-giadinh.vnecdn.net/2021/10/04/thitnuong-1633329999-7321-1633330176.jpg",
            category_id=4,
            quantity=0,
            status="Tạm ẩn"
        ),

        Product(
            name="Combo Gia Đình",
            price=199000,
            description="Combo 4 người",
            image="https://gofood.vn/upload/r/san-pham/combo-thanh-xuan-gia-dinh/combo-gia-dinh-3.jpg",
            category_id=4,
            quantity=20,
            status="Còn hàng"
        )

    ]

    db.add_all(products)
    db.commit()

    print("Seed Product thành công")