from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt


bcrypt = Bcrypt()
db = SQLAlchemy()


def connect_db(app):
    db.app = app
    db.init_app(app)


class Users(db.Model):
    __tablename__ = "users"

    username = db.Column(db.Text, primary_key=True)
    password = db.Column(db.Text, nullable=False)


    @classmethod
    def register(cls, username, pwd):
        """Register user w/hashed password & return user."""

        hashed = bcrypt.generate_password_hash(pwd)
        # turn bytestring into normal (unicode utf8) string
        hashed_utf8 = hashed.decode("utf8")

        # return instance of user w/username and hashed pwd
        return cls(username=username, password=hashed_utf8)
    

   
    @classmethod
    def authenticate(cls, username, pwd):
        """Validate that user exists & password is correct.

        Return user if valid; else return False.
        """

        user = Users.query.filter_by(username=username).first()

        if user and bcrypt.check_password_hash(user.password, pwd):
            # return user instance
            return user
        else:
            return False
  
    
class Events(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    name = db.Column(db.Text,nullable=False)
    date = db.Column(db.Date,nullable=False)
    time = db.Column(db.Time,nullable=False)
    location = db.Column(db.Text,nullable=True)
    address = db.Column(db.Text,nullable=True)
    url = db.Column(db.Text,nullable=True)
    userid = db.Column(db.Text, db.ForeignKey('users.username'),nullable=False)

    def serialize(self):
        return {
            "name":self.name,
            "time":str(self.time),
            "year":self.date.year,
            "month":self.date.month,
            "day":self.date.day
        }


