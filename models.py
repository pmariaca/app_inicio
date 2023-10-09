from config import db


class Category(db.Model):
    __tablename__ = "category"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), nullable=False)
    #elementos = db.relationship('Element', backref='category', lazy='select')

class Element(db.Model):
    __tablename__ = "element"
    id = db.Column(db.Integer, primary_key=True)
    id_category = db.Column(db.Integer, db.ForeignKey('category.id'), nullable = False)
    title = db.Column(db.String(50), nullable=False)
    content = db.Column(db.String(255), nullable=False)
