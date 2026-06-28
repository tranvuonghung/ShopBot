from models.category import Category

def seed_category(db):

    if db.query(Category).count() > 0:
        return

    categories = [
        Category(name="Gà Rán"),
        Category(name="Burger"),
        Category(name="Nước Uống"),
        Category(name="Combo")
    ]

    db.add_all(categories)
    db.commit()

    print("Seed Category thành công")