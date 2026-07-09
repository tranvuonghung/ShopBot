from models.product import Product

def seed_product(db):

    if db.query(Product).count() > 0:
        return

    products = [
        # Gà Rán (category_id=1)
        Product(name="Gà Rán Giòn", price=50000, description="Gà rán giòn truyền thống",
                image="https://nguyenhafood.vn/uploads/files/ga-chien-gion-cp%20%285%29.png",
                category_id=1, quantity=120, status="Còn hàng"),
        Product(name="Gà Cay Hàn Quốc", price=65000, description="Gà sốt cay Hàn Quốc",
                image="https://cdn11.dienmaycholon.vn/filewebdmclnew/public/userupload/files/kien-thuc/cach-lam-ga-ran-sot-cay-han-quoc/cach-lam-ga-ran-sot-cay-han-quoc-5.jpg",
                category_id=1, quantity=15, status="Sắp hết hàng"),
        Product(name="Gà Sốt Mật Ong", price=60000, description="Gà chiên sốt mật ong",
                image="https://via.placeholder.com/300x200.png?text=Ga+Sot+Mat+Ong",
                category_id=1, quantity=80, status="Còn hàng"),
        Product(name="Cánh Gà Chiên Nước Mắm", price=55000, description="Cánh gà giòn rụm vị nước mắm",
                image="https://via.placeholder.com/300x200.png?text=Canh+Ga+Nuoc+Mam",
                category_id=1, quantity=60, status="Còn hàng"),

        # Burger (category_id=2)
        Product(name="Burger Bò Phô Mai", price=55000, description="Burger bò",
                image="https://burgerking.vn/media/catalog/product/cache/1/image/1800x/040ec09b1e35df139433887a97daa66f/e/x/exc_whopper_2.jpg",
                category_id=2, quantity=50, status="Còn hàng"),
        Product(name="Burger Gà Giòn", price=45000, description="Burger gà giòn cay",
                image="https://via.placeholder.com/300x200.png?text=Burger+Ga",
                category_id=2, quantity=70, status="Còn hàng"),
        Product(name="Burger Tôm", price=58000, description="Burger tôm sốt đặc biệt",
                image="https://via.placeholder.com/300x200.png?text=Burger+Tom",
                category_id=2, quantity=10, status="Sắp hết hàng"),
        Product(name="Burger Rau Củ", price=40000, description="Burger chay thanh đạm",
                image="https://via.placeholder.com/300x200.png?text=Burger+Rau+Cu",
                category_id=2, quantity=40, status="Còn hàng"),

        # Nước Uống (category_id=3)
        Product(name="Coca Cola", price=15000, description="Nước ngọt",
                image="https://www.lottemart.vn/media/catalog/product/cache/0x0/8/9/8935049501503-2.jpg.webp",
                category_id=3, quantity=200, status="Còn hàng"),
        Product(name="Pepsi", price=15000, description="Nước ngọt",
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdWNssdAn-dYG0gRfr5x4P3ncYqa18oR4FZcYtYQwZAS_ICO5Ok2TnlJnj&s=10",
                category_id=3, quantity=8, status="Sắp hết hàng"),
        Product(name="Trà Đào", price=20000, description="Trà đào cam sả mát lạnh",
                image="https://via.placeholder.com/300x200.png?text=Tra+Dao",
                category_id=3, quantity=90, status="Còn hàng"),
        Product(name="Nước Cam Ép", price=25000, description="Cam vắt nguyên chất",
                image="https://via.placeholder.com/300x200.png?text=Nuoc+Cam",
                category_id=3, quantity=60, status="Còn hàng"),

        # Combo (category_id=4)
        Product(name="Thịt Ba Chỉ Nướng", price=99000, description="Combo ưu đãi",
                image="https://i-giadinh.vnecdn.net/2021/10/04/thitnuong-1633329999-7321-1633330176.jpg",
                category_id=4, quantity=0, status="Tạm ẩn"),
        Product(name="Combo Gia Đình", price=199000, description="Combo 4 người",
                image="https://gofood.vn/upload/r/san-pham/combo-thanh-xuan-gia-dinh/combo-gia-dinh-3.jpg",
                category_id=4, quantity=20, status="Còn hàng"),
        Product(name="Combo Đôi", price=139000, description="Combo dành cho 2 người",
                image="https://via.placeholder.com/300x200.png?text=Combo+Doi",
                category_id=4, quantity=35, status="Còn hàng"),
        Product(name="Combo Tiết Kiệm", price=89000, description="Combo giá tốt mỗi ngày",
                image="https://via.placeholder.com/300x200.png?text=Combo+Tiet+Kiem",
                category_id=4, quantity=12, status="Sắp hết hàng"),

        # Mì & Cơm (category_id=5)
        Product(name="Mỳ Cay Hàn Quốc", price=45000, description="Mì cay 7 cấp độ",
                image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO-Pg5tRJ6reIJAGjJEWDmV7kLhg8QfO1Y5RkBOayrcSZkIARX8_Ijpt9Q&s=10",
                category_id=5, quantity=0, status="Hết hàng"),
        Product(name="Cơm Gà Xối Mỡ", price=50000, description="Cơm gà giòn da",
                image="https://via.placeholder.com/300x200.png?text=Com+Ga+Xoi+Mo",
                category_id=5, quantity=45, status="Còn hàng"),
        Product(name="Mì Xào Hải Sản", price=55000, description="Mì xào tôm mực",
                image="https://via.placeholder.com/300x200.png?text=Mi+Xao+Hai+San",
                category_id=5, quantity=30, status="Còn hàng"),
        Product(name="Cơm Sườn Nướng", price=48000, description="Cơm sườn nướng mật ong",
                image="https://via.placeholder.com/300x200.png?text=Com+Suon+Nuong",
                category_id=5, quantity=55, status="Còn hàng"),

        # Tráng Miệng (category_id=6)
        Product(name="Bánh Flan", price=15000, description="Bánh flan caramen mềm mịn",
                image="https://via.placeholder.com/300x200.png?text=Banh+Flan",
                category_id=6, quantity=100, status="Còn hàng"),
        Product(name="Kem Vani", price=20000, description="Kem vani mát lạnh",
                image="https://via.placeholder.com/300x200.png?text=Kem+Vani",
                category_id=6, quantity=70, status="Còn hàng"),
        Product(name="Chè Khúc Bạch", price=25000, description="Chè khúc bạch hạnh nhân",
                image="https://via.placeholder.com/300x200.png?text=Che+Khuc+Bach",
                category_id=6, quantity=15, status="Sắp hết hàng"),
        Product(name="Bánh Su Kem", price=18000, description="Bánh su kem tươi",
                image="https://via.placeholder.com/300x200.png?text=Banh+Su+Kem",
                category_id=6, quantity=50, status="Còn hàng"),
    ]

    db.add_all(products)
    db.commit()

    print(f"Seed Product thành công ({len(products)} món)")